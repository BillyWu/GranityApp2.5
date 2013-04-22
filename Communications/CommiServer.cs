using System;
using System.Collections.Generic;
using System.Text;
using System.Net;
using System.Net.Sockets;
using Microsoft.ApplicationBlocks.ExceptionManagement;
using System.Threading;
using System.Diagnostics;
using System.IO;
using System.Collections.Specialized;

namespace Granity.communications
{
    /// <summary>
    /// 统一模式通讯服务
    /// </summary>
    public class CommiServer
    {
        /// <summary>
        /// 监听端口列表
        /// </summary>
        private Dictionary<int, TcpListener> listenermap = new Dictionary<int, TcpListener>();

        private static CommiServer globalServer = null;
        /// <summary>
        /// 全局实例
        /// </summary>
        public static CommiServer GlobalServer
        {
            get 
            {
                if (null == globalServer)
                    globalServer = new CommiServer();
                return globalServer; 
            }
        }
        /// <summary>
        /// 请求事件
        /// </summary>
        public event EventHandler<RequestEventArgs> RequestHandle;
        /// <summary>
        /// 响应事件
        /// </summary>
        public event EventHandler<ResponseSrvEventArgs> ResponseHandle;
        /// <summary>
        /// 异常时事件
        /// </summary>
        public event EventHandler<ErrorRequestEventArgs> ErrorHandle;
        /// <summary>
        /// 断开连接时事件
        /// </summary>
        public event EventHandler<DisconnEventArgs> DisconnHandle;

        /// <summary>
        /// 启动服务,已经启动则失败
        /// </summary>
        /// <param name="port">端口号</param>
        /// <param name="server">服务器</param>
        public void Start(int port, ServerBase server)
        {
            if (port < 1024 || null == server)
                return;
            if (this.listenermap.ContainsKey(port))
                return;
            ThreadManager.QueueUserWorkItem(delegate(object obj) { this.start(port, server); }, null);
        }

        /// <summary>
        /// 停止服务
        /// </summary>
        /// <param name="port">端口号</param>
        public void Stop(int port)
        {
            if (!this.listenermap.ContainsKey(port))
                return;
            TcpListener lsn = this.listenermap[port];
            this.listenermap.Remove(port);
            lsn.Stop();
        }
        /// <summary>
        /// 停止所有端口服务
        /// </summary>
        public void Stop()
        {
            foreach(TcpListener lsn in this.listenermap.Values)
                lsn.Stop();
            this.listenermap.Clear();
        }

        /// <summary>
        /// 启动服务,已经启动则忽略,被占用则忽略加入和启动
        /// </summary>
        /// <param name="port">端口号</param>
        /// <param name="server">服务器</param>
        private void start(int port, ServerBase server)
        {
            if (port < 1024 || null == server)
                return;
            if (this.listenermap.ContainsKey(port))
                return;
            server.Port = port;
            IPEndPoint localport = new IPEndPoint(IPAddress.Any, port);
            TcpListener listener = new TcpListener(localport);
            this.listenermap.Add(port, listener);
            try
            {
                listener.Start();
            }
            catch
            {
                this.listenermap.Remove(port);
                return;
            }
            while (true)
            {
                Socket client = null;
                try
                {
                    client = listener.AcceptSocket();
                    client.NoDelay = true;
                }
                catch (Exception ex)
                {
                    ErrorRequestEventArgs args = new ErrorRequestEventArgs(client, server, new byte[0], ex);
                    this.raiseEvent(args);
                    if (!this.listenermap.ContainsKey(port))
                        return;
                    listener.Start();
                    continue;
                }
                ClientInfo info = server.Add(client);
                if (null == info)
                {
                    Thread.Sleep(60000);
                    continue;
                }
                ThreadManager.QueueUserWorkItem(delegate(object obj) { this.readData(info, server); }, null);
                ThreadManager.QueueUserWorkItem(delegate(object obj) { this.writeData(info, server); }, null);
            }
        }
        /// <summary>
        /// 服务器读取通讯数据
        /// </summary>
        /// <param name="client">客户端连接</param>
        /// <param name="server">服务器</param>
        private void readData(ClientInfo clientinfo, ServerBase server)
        {
            if (null == clientinfo || null == server)
                return;
            Socket client = clientinfo.Client;
            bool isopen = false;
            int iM = 1048576, available = 0;
            try
            {
                isopen = client.Connected;
                available = isopen ? client.Available : 0;
            }
            catch { return; }

            List<byte[]> responseList = clientinfo.BufferResponse;
            byte[] buffer = new byte[client.ReceiveBufferSize];
            MemoryStream stream = new MemoryStream();
            byte[] b = null;
            while (true)
            {
                while (available > 0)
                {
                    try
                    {
                        //执行请求
                        byte[] request = stream.ToArray();
                        long pos = stream.Position;
                        int len = client.Receive(buffer);
                        string msgrp = Encoding.GetEncoding("GB2312").GetString(buffer, 0, len);
                        Debug.WriteLine(DateTime.Now.ToString("HH:mm:ss.fff") + " S接收：" + msgrp);
                        myLog.WriteLine(DateTime.Now.ToString("HH:mm:ss.fff") + " S接收：" + msgrp);
                        clientinfo.OPdt = DateTime.Now;
                        if (request.Length > 0)
                        {
                            stream = new MemoryStream();
                            long lenr = request.LongLength;
                            for (int i = 0; i * iM < lenr; i++)
                                stream.Write(request, iM * i, lenr > (i + 1) * iM ? iM : (int)(lenr - i * iM));
                        }
                        stream.Seek(pos, SeekOrigin.Begin);
                        byte[] reqarg = new byte[len];
                        Array.Copy(buffer, reqarg, len);
                        RequestEventArgs argreq = new RequestEventArgs(client, server, reqarg);
                        this.raiseEvent(argreq);
                        b = server.Execute(clientinfo, buffer, len, ref stream);
                        available = client.Available;
                    }
                    catch (Exception ex)
                    {
                        byte[] request = stream.ToArray();
                        stream = new MemoryStream();
                        //NameValueCollection attr = new NameValueCollection();
                        //attr["剩余连接数"] = Convert.ToString(server.ClientList.Count);
                        //ExceptionManager.Publish(ex, attr);
                        ErrorRequestEventArgs argerr = new ErrorRequestEventArgs(client, server, request, ex);
                        this.raiseEvent(argerr);
                        if (ex is SocketException)
                        {
                            isopen = false;
                            break;
                        }
                        try { available = 0; isopen = client.Connected; available = isopen ? client.Available : 0; }
                        catch { isopen = false; }
                        continue;
                    }
                    //响应结果写入缓存,触发同步事件写入响应
                    if (null != b && b.Length > 0)
                    {
                        Monitor.Enter(clientinfo);
                        responseList.Add(b);
                        Monitor.PulseAll(clientinfo);
                        Monitor.Exit(clientinfo);
                    }
                }//while (available > 0)
                while(available < 1)
                {
                    Thread.Sleep(10);
                    try
                    {
                        isopen = client.Connected;
                        available = isopen ? client.Available : 0;
                        if (!isopen) break;
                    }
                    catch
                    {
                        available = 0; 
                        isopen = false; 
                        break;
                    }
                }
                if (!isopen)
                {
                    server.Close(clientinfo);
                    return;
                }
            }//while (true)
        }
        /// <summary>
        /// 服务器写入通讯数据
        /// </summary>
        /// <param name="client">客户端连接</param>
        /// <param name="server">服务器</param>
        private void writeData(ClientInfo clientinfo, ServerBase server)
        {
            if (null == clientinfo || null == server)
                return;
            Socket client = clientinfo.Client;
            List<byte[]> responseList = clientinfo.BufferResponse;
            while (true)
            {
                //心跳超时关闭退出
                if (DateTime.Now - clientinfo.OPdt > server.TimeDisconn)
                {
                    server.Close(clientinfo);
                    //string msgex = "心跳超时退出，剩余连接数：" + Convert.ToString(server.ClientList.Count);
                    //ExceptionManager.Publish(new Exception(msgex));
                    DisconnEventArgs args = new DisconnEventArgs(client, server);
                    this.raiseEvent(args);
                    return;
                }
                for (int i = 0; i < 80; i++)
                {
                    if (responseList.Count > 0)
                        break;
                    Thread.Sleep(5);
                }
                if (responseList.Count < 1)
                    continue;
                //同步事件触发发送响应数据
                clientinfo.OPdt = DateTime.Now;
                Monitor.Enter(clientinfo);
                byte[][] responseArray = responseList.ToArray();
                responseList.Clear();
                Monitor.PulseAll(clientinfo);
                Monitor.Exit(clientinfo);
                try
                {
                    for (int i = 0; i < responseArray.Length; i++)
                    {
                        client.Send(responseArray[i]);
                        Debug.WriteLine(DateTime.Now.ToString("HH:mm:ss.fff") + " S发送：" + CommandBase.Parse(responseArray[i]));
                        myLog.WriteLine(DateTime.Now.ToString("HH:mm:ss.fff") + " S发送：" + CommandBase.Parse(responseArray[i]));
                        ResponseSrvEventArgs argresp = new ResponseSrvEventArgs(client, server, responseArray[i]);
                        this.raiseEvent(argresp);
                    }
                }
                catch (Exception ex)
                {
                    server.Close(clientinfo);
                    //NameValueCollection attr = new NameValueCollection();
                    //attr["剩余连接数"] = Convert.ToString(server.ClientList.Count);
                    //ExceptionManager.Publish(ex, attr);
                    DisconnEventArgs args = new DisconnEventArgs(client, server, ex);
                    this.raiseEvent(args);
                    return;
                }
                clientinfo.OPdt = DateTime.Now;
            }
        }

        /// <summary>
        /// 触发服务端事件:请求/响应/异常
        /// </summary>
        /// <param name="args">要触发的事件</param>
        private void raiseEvent(EventArgs args)
        {
            if (null == args)
                return;
            Monitor.Enter(argsHandle);
            argsHandle.Add(args);
            Monitor.PulseAll(argsHandle);
            Monitor.Exit(argsHandle);
            if (!isRunHandle)
                ThreadManager.QueueUserWorkItem(raiseCmdHandle, null);
        }
        /// <summary>
        /// 指令事件参数列表
        /// </summary>
        private List<EventArgs> argsHandle = new List<EventArgs>();
        /// <summary>
        /// 是否正在执行指令事件
        /// </summary>
        private bool isRunHandle = false;
        /// <summary>
        /// 触发指令事件
        /// </summary>
        /// <param name="obj"></param>
        private void raiseCmdHandle(object obj)
        {
            if (isRunHandle) return;
            isRunHandle = true;
            while (true)
            {
                Monitor.Enter(argsHandle);
                EventArgs[] args = argsHandle.ToArray();
                argsHandle.Clear();
                if (args.Length < 1)
                    isRunHandle = false;
                Monitor.PulseAll(argsHandle);
                Monitor.Exit(argsHandle);
                if (args.Length < 1)
                    break;
                foreach (EventArgs arg in args)
                {
                    if (null == arg)
                        continue;
                    try
                    {
                        if (arg is RequestEventArgs)
                        {
                            if (null != this.RequestHandle)
                                this.RequestHandle(this, arg as RequestEventArgs);
                        }
                        else if (arg is ResponseSrvEventArgs)
                        {
                            if (null != this.ResponseHandle)
                                this.ResponseHandle(this, arg as ResponseSrvEventArgs);
                        }
                        else if (arg is ErrorRequestEventArgs)
                        {
                            if (null != this.ErrorHandle)
                                this.ErrorHandle(this, arg as ErrorRequestEventArgs);
                        }
                        else if (arg is DisconnEventArgs)
                        {
                            if (null != this.DisconnHandle)
                                this.DisconnHandle(this, arg as DisconnEventArgs);
                        }
                    }
                    catch (Exception ex) { ExceptionManager.Publish(ex); }
                }
                for (int i = 0; i < 10; i++)
                    if (argsHandle.Count < 1)
                        Thread.Sleep(50);
            }
        }
    }
}

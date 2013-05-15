// JScript 文件
function Hash()
{
    this._hash = new Object();
    this.add = function(key,value)       //增加一个指定了Key的值和value的值的项...***  成功则返回true  ***  不成功(修改失败或者不存在此Key的项)则返回false;****
    {
	    if(typeof(key)!="undefined")
	    {
		    if(this.contains(key)==false)
		    {
			    this._hash[key]=typeof(value)=="undefined"?null:value;
			    return true;
		    }
		    else
		    {
			    return false;
		    }
	    }
	    else
	    {
		    return false;
	    }
    }
    this.remove = function(key){delete this._hash[key];}    //删除指定的key的项
    this.count = function(){var i=0;for(var k in this._hash){i++;} return i;}   //获取此哈希表中总共有几个项
    this.items = function(key){return this._hash[key];}     //返回指定的key的项
    this.contains = function(key){ return typeof(this._hash[key])!="undefined";}   //判断此key是否已存在于此哈希表中,如果不存在则返回true,存在则返回false
    this.clear = function(){for(var k in this._hash){delete this._hash[k];}}      //清空此哈希表中的所有值
    this.edit=function(key,value)     //编辑指定Key的项的值,***  成功则返回true  ***  不成功(修改失败或者不存在此Key的项)则返回false;****
    {
	    if(typeof(key)!="undefined") 
	    {
		    if(this.contains(key)==true) 
		    {
			    this._hash[key]=typeof(value)=="undefined"?null:value;
			    return true;
		    }
		    else
		    {
			    return false;
		    }
	    }
	    else
	    {
		    return false;
	    }	        
    }
    this.readall= function()  //遍历哈希表--------返回一个数组(二维数组，第一维指key值，第二维指的是value值)
    {
        var i=0;
        var hash_all=new Array();
        for(var k in this._hash)
        {       
            hash_all[i]=[k,this._hash[k]];  
            i++;
        } 
        return hash_all;	                                
    }
}

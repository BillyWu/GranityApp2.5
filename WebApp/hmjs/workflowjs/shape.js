/*--------------------------------------------------|
| ����Ʒȡ��ԭ������Ȩ�޸��� support@tops.com.cn    |
| ����Ʒtopflow                                     |
|                                                   |
| ��������ͼ���õ���ͼ�Σ�����Ԥ�������Զ���        |
|                                                   |
| ��Ȩ���Ϻ�ѩ����Ϣ�������޹�˾���У�              |
| ����֧�֣�sales@shcommit.com �����Ը����û���     |
| ��    վ��www.shcommit.com                        |
|                                                   |
| ����˽�Կ������޸Ļ�������ҵ��;                  |
| ���뱣����ע��.                                   |
|                                                   |
| Updated: 20070613                                 |
|--------------------------------------------------*/

//����Ŀǰ��ʹ�õĸ���ͼ�μ���ʶID������demo��ʾ����ʾ��ʹ�ã�val��ʵ�ʶ���
var _SHAPE = [];
_SHAPE["roundrect"] = [];
_SHAPE["rect"] = [];
_SHAPE["oval"] = [];
_SHAPE["diamond"] = [];
_SHAPE["line"] = [];
_SHAPE["polyline"] = [];
_SHAPE["fillrect"] = [];

//Բ��
_SHAPE["oval"]["demo"] = 
              '<v:Oval id="demoOval" title="Բ��" style="position:relative;left:0px;top:0px;width:100px;height:40px;z-index:9" strokecolor="red" strokeweight="1">' +
                '<v:shadow id="demoOvalShadow" on="T" type="single" color="#b3b3b3" offset="5px,5px"/>' + 
                '<v:extrusion id="demoOvalExt" on="false" backdepth="20" />' +
                '<v:fill id="demoOvalFill" type="gradient" color="white" color2="white" />' +
                '<v:TextBox id="demoOvalText" inset="2pt,5pt,2pt,5pt" style="text-align:center; color:red; font-size:9pt;">ʾ��</v:TextBox>' +
              '</v:Oval>';
_SHAPE["oval"]["val"] = 
              '<v:Oval id="{id}" af="{af}" wt="{wt}" ist="{ist}" isc="{isc}" title="{title}" sc="{sc}" fsc="{fsc}" st="{st}" typ="Proc" style="position:absolute;left:{l};top:{t};width:{w};height:{h};z-index:{z}"" strokecolor="{sc}" strokeweight="{sw}" ondblclick=\'editProc(this.id);\' >' +
                '<v:shadow on="{shadowenable}" type="single" color="{shadowcolor}" offset="5px,5px"/>' + 
                '<v:extrusion on="{3denable}" backdepth="{3ddepth}" />' +
                '<v:fill type="gradient" color="{osc1}" color2="{osc2}" />' +
                '<v:TextBox id="{id}Text" inset="2pt,5pt,2pt,5pt" style="text-align:center; color:{tc}; font-size:{fs};">{text}</v:TextBox>' +
              '</v:Oval>';

//����
_SHAPE["rect"]["demo"] = 
              '<v:rect id="demoRect" title="����" style="z-index:0;position:relative;width:100px;height:40px;left:0px;top:0px;" strokecolor="blue" strokeweight="1">' +
              '  <v:shadow on="T" type="single" color="#b3b3b3" offset="5px,5px"/>' +
              '  <v:extrusion on="false" backdepth="20" />' +
              '  <v:fill type="gradient" color="white" color2="white" />' +
              '  <v:TextBox inset="2pt,5pt,2pt,5pt" style="text-align:center; color:blue; font-size:9pt;">ʾ��</v:TextBox>' +
              '</v:rect>';
_SHAPE["rect"]["val"] =
              '<v:rect id="{id}" af="{af}" wt="{wt}" ist="{ist}" isc="{isc}" title="{title}" sc="{sc}" fsc="{fsc}" st="{st}" typ="Proc" style="z-index:{z};position:absolute;width:{w};height:{h};left:{l};top:{t};" strokecolor="{sc}" strokeweight="{sw}" ondblclick=\'editProc(this.id);\'>' +
              '  <v:shadow on="{shadowenable}" type="single" color="{shadowcolor}" offset="5px,5px"/>' +
              '  <v:extrusion on="{3denable}" backdepth="{3ddepth}" />' +
              '  <v:fill type="gradient" color="{sc1}" color2="{sc2}" angle="30"/>' +
              '  <v:TextBox id="{id}Text" inset="2pt,5pt,2pt,5pt" style="text-align:center; color:{tc}; font-size:{fs};">{text}</v:TextBox>' +
              '</v:rect>';
//��䷽��
_SHAPE["fillrect"]["demo"] = 
              '<v:rect id="demoRect" title="����" style="z-index:0;position:relative;width:100px;height:40px;left:0px;top:0px;" strokecolor="blue" strokeweight="1">' +
              '  <v:shadow on="T" type="single" color="#b3b3b3" offset="5px,5px"/>' +
              '  <v:extrusion on="false" backdepth="20" />' +
              '  <v:fill type="gradient" color="white" color2="white" />' +
              '  <v:TextBox inset="2pt,5pt,2pt,5pt" style="text-align:center; color:blue; font-size:9pt;">ʾ��</v:TextBox>' +
              '</v:rect>';
_SHAPE["fillrect"]["val"] =
              '<v:rect id="{id}" af="{af}" wt="{wt}" ist="{ist}" isc="{isc}" title="{title}" sc="{sc}" fsc="{fsc}" st="{st}" typ="Proc" style="z-index:{z};position:absolute;width:{w};height:{h};left:{l};top:{t};" strokecolor="{sc}" strokeweight="{sw}" ondblclick=\'editProc(this.id);\'>' +
              '  <v:shadow on="{shadowenable}" type="single" color="{shadowcolor}" offset="5px,5px"/>' +
              '  <v:extrusion on="{3denable}" backdepth="{3ddepth}" />' +
              '  <v:fill type="frame" color="#CCCCCC" color2="#CCCCCC" />' +
              '  <v:TextBox id="{id}Text" inset="2pt,5pt,2pt,5pt" style="text-align:center; color:{tc}; font-size:{fs};">{text}</v:TextBox>' +
              '</v:rect>';
//Բ����
_SHAPE["roundrect"]["demo"] = 
              '<v:RoundRect id="demoRoundRect" title="Բ����" style="position:relative;left:0px;top:0px;width:100px;height:40px;z-index:9"" strokecolor="blue" strokeweight="1">' +
                '<v:shadow id="demoRoundRectShadow" on="T" type="single" color="#b3b3b3" offset="5px,5px"/>' + 
                '<v:extrusion id="demoRoundRectExt" on="false" backdepth="20" />' +
                '<v:fill id="demoRoundRectFill" type="gradient" color="white" color2="white" />' +
                '<v:TextBox id="demoRoundRectText" inset="2pt,5pt,2pt,5pt" style="text-align:center; color:blue; font-size:9pt;">ʾ��</v:TextBox>' +
              '</v:RoundRect>';
_SHAPE["roundrect"]["val"] = 
              '<v:RoundRect id="{id}" af="{af}" wt="{wt}" ist="{ist}" isc="{isc}" title="{title}" sc="{sc}" onmousemove="this.fillcolor=\'#f90\'" onmouseout="this.fillcolor=\'#e2d9b7\'"  fsc="{fsc}" st="{st}" typ="Proc" style="position:absolute;left:{l};top:{t};width:{w};height:{h};z-index:{z}"" strokecolor="{sc}" strokeweight="{sw}" ondblclick=\'editProc(this.id);\'>' +
                '<v:shadow on="{shadowenable}" type="single" color="{shadowcolor}" offset="5px,5px"/>' + 
                '<v:extrusion on="{3denable}" backdepth="{3ddepth}" />' +
                '<v:fill type="gradient" color="{sc1}" color2="{sc2}" />' +
                '<v:TextBox id="{id}Text" inset="2pt,5pt,2pt,5pt" style="text-align:center; color:{tc}; font-size:{fs};">{text}</v:TextBox>' +
              '</v:RoundRect>';
//����
_SHAPE["diamond"]["demo"] = 
              '<v:shape id="demoDiamond" title="����" type="#diamond" style="position:relative;left:0px;top:0px;width:100px;height:50px;z-index:9" strokecolor="blue" strokeweight="1">' +
                '<v:shadow on="T" type="single" color="#b3b3b3" offset="5px,5px"/>' +
                '<v:extrusion on="false" backdepth="20" />' +
                '<v:fill type="gradient" color="white" color2="white" />' +
                '<v:TextBox inset="5pt,10pt,5pt,5pt" style="text-align:center; color:blue; font-size:9pt;">ʾ��</v:TextBox>' +
              '</v:shape>';
_SHAPE["diamond"]["val"] =
              '<v:shape type="#diamond" id="{id}" af="{af}" wt="{wt}" ist="{ist}" isc="{isc}" title="{title}" sc="{sc}" fsc="{fsc}" st="{st}" typ="Proc" style="position:absolute;width:{w};height:{h};left:{l};top:{t};z-index:{z}" strokecolor="{sc}" strokeweight="{sw}" ondblclick=\'editProc(this.id);\'>' +
              '  <v:shadow on="{shadowenable}" type="single" color="{shadowcolor}" offset="5px,5px"/>' +
              '  <v:extrusion on="{3denable}" backdepth="{3ddepth}" />' +
              '  <v:fill type="gradient" color="{sc1}" color2="{sc2}" />' +
              '  <v:TextBox id="{id}Text" inset="2pt,10pt,2pt,5pt" style="text-align:center; color:{tc}; font-size:{fs};">{text}</v:TextBox>' +
              '</v:shape>';

//ֱ��
_SHAPE["line"]["demo"] = 
              '<v:line id="demoLine" title="ֱ��" style="z-index:0;position:relative;" from="0,0" to="100,0" strokecolor="blue" strokeweight="1">' +
                '<v:stroke id="demoLineArrow" StartArrow="" EndArrow="Classic"/>' +
                '<v:TextBox inset="5pt,1pt,5pt,5pt" style="text-align:center; color:blue; font-size:9pt;"></v:TextBox>' +
              '</v:line>'
_SHAPE["line"]["val"] = 
              '<v:line id="{id}" title="{title}" sc="{sc}" fsc="{fsc}" typ="Step" style="z-index:{z};position:absolute;" {pt} strokecolor="{sc}" strokeweight="{sw}" onmousedown=\'objFocusedOn(this.id);\' ondblclick=\'editStep(this.id);\'>' +
                '<v:stroke id="{id}Arrow" StartArrow="{sa}" EndArrow="{ea}"/>' +
                '<v:TextBox id="{id}Text" inset="5pt,1pt,5pt,5pt" style="text-align:center; color:black; font-size:9pt;">{cond}</v:TextBox>' +
              '</v:line>';
//����
_SHAPE["polyline"]["demo"] = 
              '<v:PolyLine id="demoPolyLine" title="�۽���" filled="false" Points="0,20 50,0 100,20" style="z-index:0;position:relative;" strokecolor="blue" strokeweight="1">' +
                '<v:stroke id="demoPolyLineArrow" StartArrow="" EndArrow="Classic"/>' +
                '<v:TextBox inset="5pt,1pt,5pt,5pt" style="text-align:center; color:blue; font-size:9pt;"></v:TextBox>' +
              '</v:PolyLine>';
_SHAPE["polyline"]["val"] =
              '<v:PolyLine id="{id}" title="{title}" sc="{sc}" fsc="{fsc}" typ="Step" filled="false" Points="{pt}" style="z-index:{z};position:absolute;" strokecolor="{sc}" strokeweight="{sw}" onmousedown=\'objFocusedOn(this.id);\' ondblclick=\'editStep(this.id);\'>' + 
              '<v:stroke id="{id}Arrow" StartArrow="{sa}" EndArrow="{ea}"/>' + 
                '<v:TextBox id="{id}Text" inset="5pt,8pt,-50pt,5pt" style="text-align:left; color:black; font-size:9pt;width:200px;">{cond}</v:TextBox>' +
              '</v:PolyLine>';
//������
function getShapeDemo(AName){
  return _SHAPE[AName.toLowerCase()]["demo"];
}

function getShapeVal(AName)
{
  return _SHAPE[AName.toLowerCase()]["val"];
}

function stuffShape(AStr, arr){
  var re = /\{(\w+)\}/g;
  return AStr.replace(re, function(a,b){return arr[b]}); 
}

//����Զ���ͼ��
document.write('<v:shapetype id="diamond" coordsize="12,12" path="m 6,0 l 0,6,6,12,12,6 x e"/>');

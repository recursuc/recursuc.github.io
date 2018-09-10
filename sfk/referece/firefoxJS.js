﻿
if(window.Event){// 修正Event的DOM
/*
IE5 MacIE5 Mozilla Konqueror2.2 Opera5
event yes yes yes yes yes
event.returnValue yes yes no no no
event.cancelBubble yes yes no no no
event.srcElement yes yes no no no
event.fromElement yes yes no no no

*/
Event.prototype.__defineSetter__("returnValue",function(b){// 
if(!b)this.preventDefault();
return b;
});
Event.prototype.__defineSetter__("cancelBubble",function(b){// 设置或者检索当前事件句柄的层次冒泡
if(b)this.stopPropagation();
return b;
});
Event.prototype.__defineGetter__("srcElement",function(){
var node=this.target;
while(node.nodeType!=1)node=node.parentNode;
return node;
});
Event.prototype.__defineGetter__("fromElement",function(){// 返回鼠标移出的源节点
var node;
if(this.type=="mouseover")
node=this.relatedTarget;
else if(this.type=="mouseout")
node=this.target;
if(!node)return;
while(node.nodeType!=1)node=node.parentNode;
return node;
});
Event.prototype.__defineGetter__("toElement",function(){// 返回鼠标移入的源节点
var node;
if(this.type=="mouseout")
node=this.relatedTarget;
else if(this.type=="mouseover")
node=this.target;
if(!node)return;
while(node.nodeType!=1)node=node.parentNode;
return node;
});
Event.prototype.__defineGetter__("offsetX",function(){
return this.layerX;
});
Event.prototype.__defineGetter__("offsetY",function(){
return this.layerY;
});
}
if(window.Document){// 修正Document的DOM
/*
IE5 MacIE5 Mozilla Konqueror2.2 Opera5
document.documentElement yes yes yes yes no
document.activeElement yes null no no no

*/
}
if(window.Node){// 修正Node的DOM
/*
IE5 MacIE5 Mozilla Konqueror2.2 Opera5
Node.contains yes yes no no yes
Node.replaceNode yes no no no no
Node.removeNode yes no no no no
Node.children yes yes no no no
Node.hasChildNodes yes yes yes yes no
Node.childNodes yes yes yes yes no
Node.swapNode yes no no no no
Node.currentStyle yes yes no no no

*/
Node.prototype.replaceNode=function(Node){// 替换指定节点
this.parentNode.replaceChild(Node,this);
}
Node.prototype.removeNode=function(removeChildren){// 删除指定节点
if(removeChildren)
return this.parentNode.removeChild(this);
else{
var range=document.createRange();
range.selectNodeContents(this);
return this.parentNode.replaceChild(range.extractContents(),this);
}
}
Node.prototype.swapNode=function(Node){// 交换节点
var nextSibling=this.nextSibling;
var parentNode=this.parentNode;
node.parentNode.replaceChild(this,Node);
parentNode.insertBefore(node,nextSibling);
}
}
if(window.HTMLElement){
HTMLElement.prototype.__defineGetter__("all",function(){
var a=this.getElementsByTagName("*");
var node=this;
a.tags=function(sTagName){
return node.getElementsByTagName(sTagName);
}
return a;
});
HTMLElement.prototype.__defineGetter__("parentElement",function(){
if(this.parentNode==this.ownerDocument)return null;
return this.parentNode;
});
HTMLElement.prototype.__defineGetter__("children",function(){
var tmp=[];
var j=0;
var n;
for(var i=0;i<this.childNodes.length;i++){
n=this.childNodes[i];
if(n.nodeType==1){
tmp[j++]=n;
if(n.name){
if(!tmp[n.name])
tmp[n.name]=[];
tmp[n.name][tmp[n.name].length]=n;
}
if(n.id)
tmp[n.id]=n;
}
}
return tmp;
});
HTMLElement.prototype.__defineGetter__("currentStyle", function(){
return this.ownerDocument.defaultView.getComputedStyle(this,null);
});
HTMLElement.prototype.__defineSetter__("outerHTML",function(sHTML){
var r=this.ownerDocument.createRange();
r.setStartBefore(this);
var df=r.createContextualFragment(sHTML);
this.parentNode.replaceChild(df,this);
return sHTML;
});
HTMLElement.prototype.__defineGetter__("outerHTML",function(){
var attr;
var attrs=this.attributes;
var str="<"+this.tagName;
for(var i=0;i
attr=attrs[i];
if(attr.specified)
str+=" "+attr.name+'="'+attr.value+'"';
}
if(!this.canHaveChildren)
return str+">";
return str+">"+this.innerHTML+"";
});
HTMLElement.prototype.__defineGetter__("canHaveChildren",function(){
switch(this.tagName.toLowerCase()){
case "area":
case "base":
case "basefont":
case "col":
case "frame":
case "hr":
case "img":
case "br":
case "input":
case "isindex":
case "link":
case "meta":
case "param":
return false;
}
return true;
});

HTMLElement.prototype.__defineSetter__("innerText",function(sText){
var parsedText=document.createTextNode(sText);
this.innerHTML=parsedText;
return parsedText;
});
HTMLElement.prototype.__defineGetter__("innerText",function(){
var r=this.ownerDocument.createRange();
r.selectNodeContents(this);
return r.toString();
});
HTMLElement.prototype.__defineSetter__("outerText",function(sText){
var parsedText=document.createTextNode(sText);
this.outerHTML=parsedText;
return parsedText;
});
HTMLElement.prototype.__defineGetter__("outerText",function(){
var r=this.ownerDocument.createRange();
r.selectNodeContents(this);
return r.toString();
});
HTMLElement.prototype.attachEvent=function(sType,fHandler){
var shortTypeName=sType.replace(/on/,"");
fHandler._ieEmuEventHandler=function(e){
window.event=e;
return fHandler();
}
this.addEventListener(shortTypeName,fHandler._ieEmuEventHandler,false);
}
HTMLElement.prototype.detachEvent=function(sType,fHandler){
var shortTypeName=sType.replace(/on/,"");
if(typeof(fHandler._ieEmuEventHandler)=="function")
this.removeEventListener(shortTypeName,fHandler._ieEmuEventHandler,false);
else
this.removeEventListener(shortTypeName,fHandler,true);
}
HTMLElement.prototype.contains=function(Node){// 是否包含某节点
do if(Node==this)return true;
while(Node=Node.parentNode);
return false;
}
HTMLElement.prototype.insertAdjacentElement=function(where,parsedNode){
switch(where){
    case "beforeBegin":
    this.parentNode.insertBefore(parsedNode,this);
    break;
    case "afterBegin":
    this.insertBefore(parsedNode,this.firstChild);
    break;
    case "beforeEnd":
    this.appendChild(parsedNode);
    break;
    case "afterEnd":
    if(this.nextSibling)
    this.parentNode.insertBefore(parsedNode,this.nextSibling);
    else
    this.parentNode.appendChild(parsedNode);
    break;
}
}
HTMLElement.prototype.insertAdjacentHTML=function(where,htmlStr){
var r=this.ownerDocument.createRange();
r.setStartBefore(this);
var parsedHTML=r.createContextualFragment(htmlStr);
this.insertAdjacentElement(where,parsedHTML);
}
HTMLElement.prototype.insertAdjacentText=function(where,txtStr){
var parsedText=document.createTextNode(txtStr);
this.insertAdjacentElement(where,parsedText);
}
HTMLElement.prototype.attachEvent=function(sType,fHandler){
var shortTypeName=sType.replace(/on/,"");
fHandler._ieEmuEventHandler=function(e){
window.event=e;
return fHandler();
}
this.addEventListener(shortTypeName,fHandler._ieEmuEventHandler,false);
}
HTMLElement.prototype.detachEvent=function(sType,fHandler){
var shortTypeName=sType.replace(/on/,"");
if(typeof(fHandler._ieEmuEventHandler)=="function")
this.removeEventListener(shortTypeName,fHandler._ieEmuEventHandler,false);
else
this.removeEventListener(shortTypeName,fHandler,true);
}
}

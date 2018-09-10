function Framework(){
	
}

Framework.prototype.addUser=function(url){
	if(url.search('currentId=')!=-1){
		return url;
	}
	if(url.search('\\?')==-1){
		url+="?";
	}else{
		url+="&";
	}
	url+="currentId="+currentId;
	url+="&temptemp="+new Date();
	return url;
}

Framework.prototype.goBlank=function(url){
	framework.go("about:blank");
}


Framework.prototype.go=function(url){
	url=this.addUser(url);
	self.location.href=url;
}

Framework.prototype.open=function(url,title,id){
	url=this.addUser(url);
	var urlx=url.indexOf("&temptemp");
	if(urlx!=-1){
		url=url.substring(0,urlx);
	}
	if(!window.top.addPannel){
		window.open(url);
		return;
	}
	return window.top.addPannel(url,title,id);
}

Framework.prototype.close=function(isConfirm){
	var tabid=window.top.getActiveTab().id;
	if(isConfirm){
		window.top.removePannel(tabid);
	}else{
		if(confirm("确认关闭当前界面?")){
			window.top.removePannel(tabid);
			}
	}

}


Framework.prototype.addUserInput=function(parent){
	var id="";
	$(parent).children().each(function(index,el){
		if($(el).attr("name")=="currentId"){
			id=$(el).val();
		}
	});
	if(id){
		return;
	}
	var userId="<input type='hidden' name='currentId' value='"+currentId+"'>";
	$(parent).append($(userId));
}

Framework.prototype.subForm=function(fm){
	//验证表单
	if (!validate.valiForm(fm, true)) {
		return false;
	}
	if(!fm.currentId){
		this.addUserInput(fm);
	}else{
		fm.currentId.value=currentId;
	}
	fm.submit();
	return true;
}

Framework.prototype.query=function(fm){
	//如果界面异步提交过会将forward的值设置为update,
	//通过framework.query查询时肯定不会forward到update页面的
	//所以,如果发现有就删掉
	var fo=$("input[name='forward']");
	if(fo.val()=="update"){
		fo.remove();
	}
	//是否包含敏感字符
	if (!validate.valiQuery(fm)) {
		return false;
	}
	if(!fm.currentId){
		this.addUserInput(fm);
	}else{
		fm.currentId.value=currentId;
	}
	fm.submit();
	return true;
}

var framework=new Framework();

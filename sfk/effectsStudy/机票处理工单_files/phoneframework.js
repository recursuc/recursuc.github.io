function PhoneFramework() {


}
PhoneFramework.prototype.softphone=function(){	
	var frames = window.top.frames;
	for ( var i = 0; i < frames.length; i++) {
		if (frames[i].name == "softphone") {
			return  frames[i];
		}
	}	
	  return false;
}


PhoneFramework.prototype.softphoneinfo=function(){	
	var frames = window.top.frames;
	for ( var i = 0; i < frames.length; i++) {
		if (frames[i].name == "softphoneinfo") {
			return  frames[i];
		}
	}	
   return false;
}

with(PhoneFramework){
	
	/**软电话是否可以退出*/
	prototype.isCanLogOut=function(){	
		if(this.softphone().isCanLogOut){
			return true;
		}
		var state=this.getAgentStatus();
		if(state[2] == "空闲"){
			return true;
		}
		return false;
	}
	/**软电话签退*/
	prototype.AgentLogout=function(){
		if(!this.softphone()){
			return 1;
		}
		var state=this.getAgentStatus();
		if(state[1] != "未就绪"){
					var isLogOut=this.softphone().SoftPhoneOCX.AgentLogout();
					if(isLogOut){
						this.softphone().SoftPhoneOCX.MonDataStop();
					    this.softphone().SoftPhoneOCX.SPUnInit();
						return this.softphone().SoftPhoneOCX.StopService();			
					}
				}
			 return this.softphone().SoftPhoneOCX.SPUnInit();
	}

	/**将软电话置为未就绪(后处理)*/
	prototype.notReady=function(){
		return this.softphone().SoftPhoneOCX.AgentWorkingAfterCall();
	}
	
	/**将软电话置为就绪(空闲)*/
	prototype.ready=function(){
		return this.softphone().SoftPhoneOCX.AgentReady();
	}
	
	/**外拨*/
	prototype.makeCall = function(el,dnis,flowId) {	
      //判断是否可以外拨  通话中状态  22开头的分机直接外拨  ip电话
		if(this.softphone().station.substring(0,2)!="22"){
		var state=this.getAgentStatus();
        if(state[1]=="忙"|| state[2]=="摘机呼出"){}else{
			alert("请先摘机，并确定当前状态在 事后处理或者小休状态!当前话机状态为 "+state[2]);
			this.reuseButton(el);
			return ;
		}	
		}
		
		    this.softphone().calloutFlowid=flowId;
			this.softphone().calloutPhoneNo=dnis;
			this.softphoneinfo().writeCustomerNo(dnis);
			this.softphone().SoftPhoneOCX.makeCall(dnis,"");
			this.cancleCall();
	};
	

	/**判断是否可以显示外拨按钮， 通过是否加载软电话判断*/     
	prototype.callOutAble = function() {
		if(!this.softphone()){
			return false
		}
		//var state=this.getAgentStatus();
		//if(state[2]!="空闲"){
		//	return false;
		//}
		return true;
	}
	
	document.onkeyup=function(){
		var keycode = event.keyCode;
		if(keycode==13){
			$("#phoneButton").click();
		};
	}
 
	 
		
	 
	/**弹出外拨窗口,电销系统专用*/
	prototype.preCall = function(el,phoneNo,callBackName,myId) {
	    this.prepareCall(el,phoneNo,myId,true);
	    this.softphone().callBackMethd=eval(callBackName); //设置softphone 回调事件
	    this.softphone().myId=myId;
	}
	
	
	prototype.callbackForSale = function(callUuid) {
		callBackMethd(callUuid,this.softphone().phoneNoForSale,this.softphone().myId);
	    this.softphone().callBackMethd=null;
	}
	
	
	/**弹出外拨窗口,ZT外呼专用*/
	prototype.preCallForZT = function(el,phoneNo,flowId,callBackName) {
	  

	   try { 
		  
		   this.softphone().callBackMethd=eval(callBackName); //设置softphone 回调事件
	   } catch (e)  { 
        alert("请在处理界面拨打电话!");
        return;
	   } 
	   
	   this.prepareCall(el,phoneNo,flowId,false);
	}
	

    		
	/**弹出外拨窗口,工单系统专用*/
	prototype.prepareCall = function(el,phoneNo,flowId,isSale) {
		phoneNo="9"+phoneNo;
		phoneNo=phoneNo.replace(new RegExp(" ","gi"), "").replace(new RegExp("-","gi"), "");

		var top=$(el).offset().top-50;
		var left=$(el).offset().left-100;
		var id="phoneNo";
		var title="外拨";
		
 
	var html='<input style="width:150px" class="input"      id="phoneNo'+phoneNo+'" value="'+phoneNo+'">';
		html+='<input type="button" class="button" value="外拨" id="phoneButton" onclick="phoneFramework.startCall(this,\'phoneNo'+phoneNo+'\',\''+flowId+'\','+isSale+')">';
		var dlg = new J.dialog({
			id:id,
			title:title,
			cover:true,
			width:320,
			height:100,
			maxBtn:false,
			html:html,
			btnBar:false,
			top:top,
			left:left,
			cancelBtn:false
		});
		dlg.ShowDialog();
		currentDlg=dlg;
	}

	prototype.startCall = function(el,aniId,flowId,isSale) {
		$(el).attr('disabled',"true");
		currentDlg.SetTitle("正在外拨请稍后...");
		var ani=$("#"+aniId).val();
		ani=ani.replace(new RegExp(" ","gi"), "").replace(new RegExp("-","gi"), "");
		this.makeCall(el,ani,flowId);
		if(isSale){
			//设置softphone 回调的修改后的电话号码
		    this.softphone().phoneNoForSale=ani;
		      }
		
	}

	/**关掉小窗口*/
	prototype.cancleCall = function() {
		currentDlg.cancel();
     }
	/**设置外拨窗口按钮可用*/
	prototype.reuseButton = function(el) {
		$(el).attr('disabled',false);
		$(el).attr('class','button');
		currentDlg.SetTitle("外拨");
     }
 
	/**转IVR*/
	prototype.transferIVR = function(ivrno,ivrName,currentPopScreenId) {
		//获取当前状态， 特定状态才可以转IVR
		var state=this.getAgentStatus();
		if(state[2]!="通话中状态"){
			alert("只有通话中状态才可以转接!");
			return;
		}
		
		if(confirm("确认要转接 "+decodeURI(ivrName)+" ?")){
		this.softphone().SoftPhoneOCX.SetIVRNo(ivrno);
		this.softphone().SoftPhoneOCX.TransferToIVR("",0);
		this.softphone().SoftPhoneOCX.SetIVRNo("5542");
		//this.softphone().$("#ivrNo").attr("value","0000");
		//this.softphone().$("#ivrNo").val("请选择");
		
		}
     }
	
	
	/**转代理商 IVR*/
	prototype.transOtcIVR = function(transPhone,otcName) {
		 var customerCallId=this.softphone().customercallId;
		 this.softphone().SoftPhoneOCX.SetCustomerCallData(customerCallId,"Cust_Add_Field3,1,"+transPhone)
		//var phoneValue= this.softphone().SoftPhoneOCX.GetCustomerCallInfo(customerCallId, "Cust_Add_Field3,1");
		this.transferIVR("5554",otcName,"");
     }
	
	
	/**转代理商 IVR 新 咨询转*/
	prototype.transOtcIVRNew = function(transPhone,otcName) {
		this.transferIVRNew(transPhone,otcName);
     }
	
	/**转IVR*/
	prototype.transferIVRNew = function(transPhone,ivrName) {
		//获取当前状态， 特定状态才可以转IVR
		var state=this.getAgentStatus();
		if(state[2]!="通话中状态"){
			alert("只有通话中状态才可以转接!");
			return;
		}
		
		if(confirm("确认要转接 "+ivrName+" ?")){
		  //咨询
			this.softphone().SoftPhoneOCX.ConsultantCall(transPhone,"");
			
			//this.softphone().SoftPhoneOCX.TransferCall();
		//this.softphone().$("#ivrNo").attr("value","0000");
		//this.softphone().$("#ivrNo").val("请选择");
		
		}
     }
	
	/**获取坐席状态*/
	prototype.getAgentStatus = function() {
		return this.softphone().SoftPhoneOCX.GetStatusText().split(",");
     }

    /**  接回电话*/
    prototype.reconnectCall = function() {
        return this.softphone().SoftPhoneOCX.ReconnectCall();
    }


    /**  转移电话*/
    prototype.transferCall = function() {
        this.softphone().SoftPhoneOCX.TransferCall();
    }




}
var phoneFramework = new PhoneFramework();
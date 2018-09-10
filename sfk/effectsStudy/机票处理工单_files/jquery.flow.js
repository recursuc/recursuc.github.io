
/**选择转发到人时的提交*/
function subFormToUser(data){
	var op=$("form select[name='toActivitySelect']").find("option:selected");
	var index=$(op).attr("activityIndex");
	var userId=$("form select[name='toUserId']").val();

	if($("form select[title='客户来源']").val()=="请选择"&&$("input[name='flowChannel']").val()=="phone"){
		$("form select[title='客户来源']").focus();
		alert("请选择客户来源!");
		return false;
	}

	subForm(index,userId,data);
}

//工单合并
function prepareMerge(){
	frame.open(webRoot+"/flow/prepareMerge.call","工单合并");
}

function checkToMonitor(index){
	if(index==-1||index==-2){
		return true;
	}
	return true;
}

/**开始处理工单*/
function doProcess(flowId,flowNodeId,lockId){
	var url=webRoot+"/flow/updateLockId.json";
	url+="?flowNodeId="+flowNodeId;
	url+="&flowId="+flowId;
	url+="&lockId="+lockId;
	url+="&userId="+userId;
	url+="&updateId="+userId;
	ajaxUtil.update(url,function(result){
		if(result.success){
			var url=webRoot+"/flow/get.call";
			url+="?flowId="+flowId;
			url+="&forward=prepareUpdate"
			url+="&temp="+new Date().getTime();
			framework.go(url,"工单处理");
		}else{
			alert(result.data);
		}
	});
}

/**当前页面是否是查询界面*/
function isQueryPage(){
	var action=$(fm).attr("action");
	if(!action){
		return true;
	}
	if(action.search("query([a-z]|[A-Z])+\\.call$")!=-1){
		return true;
	}
	return false;
}

function subForm(index,lockId,data){

	//return false;
   if($("select[name=problem0] option[selected]").html()=="文字链"){
	 	for(var i=1;i<5;i++){
	 		if($("select[name=problem"+i+"] option[selected]").html()=="请选择"){
	 		   $("select[name='problem"+i+"']").remove();
	 		}
	 	}
   }

	$("input[name='toActivityIndex']").val(index);
	$("input[name='lockId']").val(lockId);	
	
	var cusId=$("input[name='customerInfoId']").val();
	if(!cusId){
		$("input[name='customerName']").focus();
		alert("请先定位或新增用户");
		return false;
	}

	//对于渠道是电话的,验证客户来源,姓名和性别
	if($("input[name='flowChannel']").val()=="phone"){
		if($("form select[title='客户来源']").val()=="请选择"){
			$("form select[title='客户来源']").focus();
			alert("请选择客户来源!");
			return false;
		}
		var realNameValue=$("input[name='realName']").val();
		if(realNameValue=="未知"){
			$("input[name='realName']").focus();
			alert("请修改用户姓名,不能为未知!");
			return false;
		}
		
		var sexValue=$("select[name='gender']").val();
		if(!sexValue){
			$("input[name='gender']").focus();
			alert("请修改用户性别,不能为未知!");
			return false;
		}
	}


	//如果结束,将预约时间设置为空，不需要插入
	if(index==-2){
     //  var appointTimeTemp=$("#newAppointTime").val();
       // if(appointTimeTemp==""){
            $("#newAppointTime").val("");
     //   }
	}
	
	if(!validate.valiForm(fm)){
		return false;
	}
	
	//设置附件名称
	$("input[name='fileInfoId']").each(function(index,el){
		$(el).attr("name","fileInfoId["+index+"]")
	});
	
	//设置最后1级问题类别
	if(!setLastProblem()){
		return false;
	}
	
	if(!checkToMonitor(index)){
		return false;
	}
	
	var addCusChk=$("#addCusChk");
	if(!addCusChk.attr("checked")){
		realSubForm();
		return false;
	}
	
	
	
	//如果新增客户,判断是否联系方式已经存在
	var url=webRoot+"/customerinfo/queryByContactInfoNo.json";
	var cont=$("input[name='contactWayContent']").val();
	url+="?contactContent="+cont;
	url+="&forward=simple"
	ajaxUtil.json(url,function(data){
		if(data!=0){
			var c=window.confirm("联系方式"+cont+"在系统中已经有对应用户了,是否需要重新定位客户");
			if(c){
				addCusChk.attr("checked",false);
				setCusNo();
				$("input[name='contactWayContent']").val(cont);
				$("#customerBtn").focus();
				$("#customerBtn").click();
			}else{
				realSubForm();
			}
		}else{
			realSubForm();
		}
	});
}

function setLastProblem(){
	var lastProblem="";
	var size=0;
	$("form input[name='lastProblemBox']").each(function(idx,el){
		size++;
		if($(el).attr("checked")){
			lastProblem+=$(el).val()+",";
		}
	});
	//如果设置了问题类别多选就要去必选
	if(size>0){
		if(!lastProblem){
			alert("请选择问题类别!");
			return false;
		}else{
			lastProblem=lastProblem.substring(0,lastProblem.length-1);
			$("input[name='lastProblem']").val(lastProblem);
		}
	}
	return true;
}

function realSubForm(){
	ajaxUtil.subForm(fm,function(result){
		if(result.success){
			if(window.confirm("操作成功,是否转到详细页面")){
				flowId=result.data.flowId;
				var url=webRoot+"/flow/get.call?flowId="+flowId;
				url+="&forward=view"
				framework.go(url);
			}else{
				framework.close(true);
			}
		}else{
			alert(result.data);
		}
	});
}

function createProblemChildren(el){
	var level=eval($(el).attr("level"));
	var flowConfigId=$(el).attr("flowConfigId");
	var max=eval($(el).attr("max"));
	var changeFun=$(el).attr("changeFun");
	
	if(level<max-1){
		createProblemImpl(flowConfigId,el.value,level+1,max,"problemForUpdate");
	}
	$(el).children().each(function(index,child){
		var script=$(child).attr("script");
		if(!script){
			return;
		}
		if($(child).attr("selected")=="selected"){
			script=script+"('"+$(child).val()+"','"+$(child).text()+"')";
			try{
				eval(script);
			}catch(e){
				alert("执行:"+script+"失败")
			}
		}
	});
}

/**点击新增客户文本框*/
function setCusNo(cusNo){
	var el=$("#addCusChk");
	if(el.attr("checked")){
		$("input[name='customerId']").val("");
		$("#customerBtn").val(cusNo);
		$("#customerBtn").focus();
		$("#contactTd").show()
		$("#addCusCheck").attr("checked",true);
		$("#addCusCheck").click();
		$("#addCusCheck").attr("checked",true);
		$("#addCusCheckSpan").hide();
	}else{
		var val=$("#customerBtn").attr("toast");
		$("#customerBtn").val(val);
		$("#customerBtn").attr("style","color:#999;width:70%");
		$("#contactTd").hide();
		$("input[name='customerName']").val("");
		$("select[name='gender']").val("");
	}
}


//显示工单详细信息
function showFlow(flowId,flowType,flowNo,inSameWindow){
	flowType = jQuery.trim(flowType);
	flowNo = jQuery.trim(flowNo);
	var url=webRoot+"/flow/get.call";
	if(flowType&&flowType=="机票" &&flowNo&&(flowNo.substring(0,1)=="P")){
		url=webRoot+"/flowapiupdate/view.call";
	}
	
	url+="?flowId="+flowId;
	url+="&forward=view";
	
	if(flowNo&&flowNo.length>2&&flowNo.substring(0,2)=="NP"){
		url=webRoot+"/flowinfo/go2view.call";
		url+="?flowId="+flowId;
	}
	
	if(!inSameWindow){
		framework.open(url,"详细信息");
	}else{
		framework.go(url);
	}
	
	
}
//显示国内机票订单详情
function showOrderDetail(orderNo,type,orderId){
	if(type=="国内机票"){
		var url="/flowbussiness/prepareQueryFlightDetail.call?orderNo="+orderNo;
		 url="/flowapi/flightOrderDetail.call?forward=orderDetail/flightOrderDetail&orderNo="+orderNo;
		url="/flowapi/flightOrderDetail.call?forward=orderDetail/flightOrderDetail&orderNo="+orderNo;
		framework.open(url,"国内机票订单详情");
	}else if(type=="国际机票"){
		var url="/flowbussiness/prepareQueryIFlightDetail.call?orderNo="+orderNo;
		 url="/flowapi/iflightOrderDetail.call?forward=orderDetail/iflightOrderDetail&orderNo="+orderNo;
		framework.open(url,"国际机票订单详情");
	}else if(type=="超值自游飞"){
		 var url="/flowbussiness/fcpDetail.call?id="+orderId;
		 url="/flowapi/fcpOrderDetail.call?forward=orderDetail/fcpOrderDetail&orderId="+orderId;
	     framework.open(url,"超值自游飞订单详情");
	}else{
	 	  var url="/flowbussiness/flagshipDetail.call?orderNo="+orderNo+"&clientName="+orderId;
	 	  url="/flowapi/flagshipDetail.call?forward=orderDetail/flagshipOrderDetail&orderNo="+orderNo+"&orderId="+orderId;
		  framework.open(url,"机票旗舰店订单详情");
	}
}

//pe详细信息
function openFlightPeInfo(orderNum){
    var url="/flowapiupdate/peView.call?flowNo="+orderNum;
    framework.open(url,'PE信息');
}

//显示团购，酒店 订单详情
function showTuanOrderDetail(type,orderNo,wrapperId){
	if(type=="tuan"){
		var url="/flowbussiness/prepareQueryTuanDetail.call?id="+orderNo;
		framework.open(url,"团购订单详情");
	}else if(type=="hms"){
		var url="/flowbussiness/queryHmsDetail.call?forward=hmsDetail&orderNum="+orderNo;
		framework.open(url,"HMS订单详情");
	}else if(type=="otappb"){
		var url="/flowbussiness/queryOtaPpbDetailForNewFlow.call?forward=otappbDetail&orderNum="+orderNo+"&wrapperId="+wrapperId;
		framework.open(url,"otappb订单详情");
	}else if(type=="otacpc"){
		var url="/flowbussiness/queryOtaCpcDetail.call?forward=otacpcDetail&orderNum="+orderNo;
		framework.open(url,"otacpc订单详情");
	}else if(type=="discount"){

		var url="/flowbussiness/queryDiscountDetail.call?forward=discountDetail&orderNum="+orderNo;
		try{
			if(flowNo&&flowId&&userId){
				url="/flowbussiness/queryDiscountDetailForRefund.call?forward=discountDetail&orderNum="+orderNo+"&flowNo="+flowNo+"&flowId="+flowId+"&userId="+userId;
			}
		}catch(e){}
		
		framework.open(url,"一口价订单详情");
	}
}
//转接
var transPhoneToIvr = function(flowId,phoneNo,orderNo,otcName,otcType,callInPhone){
    try{
        //判断软电话状态
        var state=phoneFramework.getAgentStatus();
        if(state[2]!="通话中状态"){
            alert("只有通话中状态才可以转接!");
            return;
        }
        //转代理商之前 检验  
        var url="/ivrapi/otcPhone.json";
        var customerCallId=phoneFramework.softphone().customercallId;
        var data="callUuid="+customerCallId+"&source=agent&orderNo="+orderNo+"&oriFlowId="+flowId+"&otcName="+otcName+"&otaOrderType="+otcType;
        data+="&customerPhone="+callInPhone;
        ajaxUtil.json(url,function(result){ },data);
         phoneFramework.transOtcIVR(phoneNo,otcName);   
        return;
    }catch(e){
        alert("请登录软电话!");
    }
}
//更新某个级别问题的select
function updateSelect(sel,level,max,divId){
	sel.attr("name","problem"+level);
	sel.attr("style","width:15%");
	sel.attr("title","问题类别");
	if(!isQueryPage()){
		sel.attr("validate","notNull");
	}
	for(var i=level;i<max;i++){
		$("#"+divId+" select[name='problem"+i+"']").remove();
		$("#"+divId+" div[name='multiProblem']").remove();
	}
	
	//空的下级不显示 yongming.wang,如果要显示,把if和下面的注释去掉
	if(sel.children().size()!=1){
		//如果是第三,创建的下是多选的,所以用checkBox
		if(level==3){
			//查询页面不要
			if(isQueryPage()){
				return;
			}
			var problemHtml="<div name='multiProblem'>";
			var checked="";
			// 如果只有1个选项就选中
			if(sel.children().size()==2){
				checked="checked";
			}
			sel.children().each(function(idx,el){
				if($(el).html()=="请选择"){
					return;
				}
				problemHtml+="<span style='width:30%'>&nbsp;</span>";
				problemHtml+="<input "+checked+" value='"+$(el).html()+"' type='radio' name='lastProblemBox'";
				problemHtml+=">";
				problemHtml+=$(el).html();
				var mk=$(el).attr("remark");
				if(mk){
					if((mk+"")=="undefined"){
						mk="";
					}
					problemHtml+="&nbsp;&nbsp;<a href='javaScript:'>"+mk+"</a>";
				}
				problemHtml+="<br>";
			})
			problemHtml+="</div>";
			$("#"+divId).append(problemHtml);
			return;
		}
		$("#"+divId).append(sel);	
	}
}
/*转老工单*/
function oldFlow(){
	var url="/flowinfo/go2oldflow.call";
	url+="?ani=13800138000";
	url+="&callUuid=1380013800014";
	url+="&agentId=admin";
	url+="&inputPhone=13800138000";
	url+="&businessInfo=BU0001";
	url+="&customerLevel="+escape("BU0001#2");
	url+="&ivrDigit=1,12,128";
	url+="&lastDigit=181";
	//url+="&currentId=63376337653633386161323834643332613130623330303965306164326337352C313338323431343430303030302C3139322E3136382E3132322E3336";
	framework.go(url);
}

function oldPublicOpinionFlow(){
	var url="/flow/get.call";
	url+="?flowId=$flowPop.flow.flowId";
	url+="&forward=flowchannel/publicOpinion";
	framework.go(url);
}


/*创建问题类别
 * 
 *flowProblemId 爹id
 *level 当前层级
 *max 总层数
 */
function createProblemImpl(flowConfigId,flowProblemId,level,max,divId,defaultText){
	//当什么都没选的时候将下级清空
	if(!flowProblemId){
		var s=selectUtil.create("请选择");
		updateSelect(s,level,max,divId);
		return;
	}
	
	var url=webRoot+"/flowproblem/getProblem.json";
	url+="?flowConfigId="+flowConfigId;
	url+="&flowProblemId="+flowProblemId;
	url+="&jsonChildren=children";
	
	ajaxUtil.json(url,function(data){
		if(data.success==false){
			alert(data.data);
			return;
		}
		 for(var i=0;i<data.children.length; i++){
			 data.children[i]["remark"]="remark='"+data.children[i]["problemDetail"]+"'";
		 }
		var sel=selectUtil.create("请选择",data.children,"flowProblemId","flowProblemName","r")
		if(defaultText){
			sel.children().each(function(index,el){
				if($(el).text()==defaultText){
					$(el).attr("selected","selected");
				}
			});
		}
		
		//如果只有1个也选中
		if(sel.children().size()==2){
			sel.children().each(function(index,el){
				if($(el).text()!="请选择"){
					$(el).attr("selected","selected");
				}
			});
		}
		
		sel.change(function(){
			if(level<max-1){
				createProblemImpl(flowConfigId,this.value,level+1,max,divId);
			}
		
			for(var i=0;i<data.children.length;i++){
				var d=data.children[i];
				if(d.flowProblemId==$(this).val()){
					if(d.script&&!isQueryPage()){
						var script=d.script+"('"+d.flowProblemId+"','"+d.flowProblemName+"')";
						try{
							eval(script);
						}catch(e){
							alert("执行:"+script+"失败")
						}
					}
				}
			}
		});	
		
		updateSelect(sel,level,max,divId);
		
		if(defaultText||sel.val()){
			sel.change();
		}
	});
	//js 判断是否是问题类别，不已 FlowProblem 开头,弹出div
	if (flowProblemId.indexOf("FlowProblem")==-1 && true){
		var urlForWordToSay=webRoot+"/flowproblem/getProblemWordToSay.json?flowProblemId="+flowProblemId;
		ajaxUtil.json(urlForWordToSay,function(data){
            try{
                if(!data.wordToSay|| data.wordToSay==""){  //没有话术的,隐藏div
                    unInitDiv();
                    return;
                }
                initDiv(data.wordToSay);
            }  catch(e){}
		});
		}
	
};


(function($) {
	
	function queryCustomerHistory(customerId){
		$("#customerHisTitle").html("<img height='12' width='12' src='"+imgRoot+"/load.gif'>");
		var url=webRoot+"/flow/customerFlows.json";
		url+="?customerId="+customerId;
		ajaxUtil.json(url,function(data){
			$("#customerHisTitle").html("("+data.length+")");
			$("#customerHis").html(createCusFlowTable(data));
			styleUtil.init();
		});
	}
	
	
	/**创建客户工单的html*/
	function createCusFlowTable(data,selected){
		var html='<table class="list" id="customerFlow">\
					<thead><tr>\
					<th>工单号</th>\
					<th>工单类型</th>\
					<th>创建人</th>\
					<th>创建时间</th>\
					<th>结束时间</th>\
					<th>当前节点</th>\
					<th>节点状态</th>\
					</tr></thead>'
		for(var i=0;i<data.length;i++){
			var flow=data[i];
			html+='<tr><td>';
			html+="<a href='javaScript:' onclick=\"showFlow('"+flow.flowId+"','"+flow.flowConfigName+"')\">"+flow.flowNo+"</a>";
			html+='</td>';
			html+="<td>"+flow.flowConfigName+"</td>";
			html+="<td>"+flow.createUser+"</td>";
			html+="<td>"+flow.createTime+"</td>";
			html+="<td>"+flow.endTime+"</td>";
			html+="<td>"+flow.lastNodeName+"</td>";
			html+="<td>"+flow.lastNodeStatus+"</td>";
			html+="</tr>";
		}
		html+="</table>";
		return html;
	}
	
	
	
	
	
	
	
	function getChannelName(value){
		if(value=="电话"){
			return "电话号码";
		}else if(value=="QQ"){
			return "QQ号";
		}else if(value=="邮件"){
			return "邮箱地址";
		}else if(value=="传真"){
			return "传真号";
		}else{
			return "渠道标识";
		}
	}
	
	
	$.fn.extend({
		//切换渠道,修改渠道标识名称
		"channelText" : function() {
			this.each(function(index,el){
				$(el).change(function(){
					var channelTitle=$(this).parent().next().children().get(0);
					channelTitle.innerHTML=getChannelName(this.value)
				});
			});
		},
		
		//可转节点修改时,显示客户转用户列表
		"showToUser":function(userSelect){
			this.change(function(){
                $(userSelect).html("");
				var activityId=this.value;
				var url=webRoot+"/flowactivity/avaiUsers.json";
				url+="?flowActivityId="+activityId;
				ajaxUtil.json(url,function(users){
					var users=selectUtil.createOption("请选择",users,"userId","userName")
					$(userSelect).html(users);
				});
			});
			this.change();
		},
		
		
		/*创建问题类别
		 * 
		 *flowProblemId 爹id
		 *level 当前层级
		 *max 总层数
		 */
		"createProblem":function(flowConfigId,flowProblemId,level,max,divId,defaultText){
			createProblemImpl(flowConfigId,flowProblemId,level,max,divId,defaultText);
		},
		
		
		
		"searchCustomer":function(){
			this.click(function(){
				//如果选择了新增按钮,就直接返回
				var addCusChk=$("#addCusChk");
				if(addCusChk.attr("checked")){
					return;
				}
				
				var customerName=$("input[name='customerName']");
				var customerSourceId=$("input[name='customerSourceId']")
				var customerId=$("input[name='customerId']")
				var customerSource=$("input[name='customerSource']")
				var gender=$("select[name='gender']")
				var contactWay=$("select[name='contactWay']")
				var contactWayContent=$("input[name='contactWayContent']")
				var conShow=$("#conShow");
				var customerSource=$("input[name='customerSource']")
				var customerRealName=$("input[name='customerRealName']")
				
				
				var url=webRoot+"/customerinfo/selectIndex.call";
				url+="?customerName="+customerName.val();
				url+="&contactContent="+contactWayContent.val();
				url+="&sourceId="+customerSourceId.val();
				var dlg= frame.openDialog(url,"查询客户","searcuCustomer",true,900,400);
				dlg.addBtn( 'close', '关闭',dlg.cancel);
				dlg.dgWin.callBackCustomer=function(customer,contacts){
					customerId.val(customer.customerInfoId);
					customerName.val(customer.customerName);
					gender.val(customer.gender);
					customerSourceId.val(customer.sourceId);
					customerSource.val(customer.source);
					customerRealName.val(customer.realName);
				
					var option="";
					for(var i=0;i<contacts.length; i++){
						option+= "<option value=\"" +contacts[i].contactWay+",";
						option+= contacts[i].contactContent+"\">";
						option+= contacts[i].contactText+"---"+contacts[i].contactContent;
						option+= "</option>";
				    }
					conShow.html(option);
					conShow.change(function(){
						var vs=this.value.split(",");
						contactWay.val(vs[0]);
						contactWayContent.val(vs[1]);
					});
					conShow.change();
					
					//显示联系方式框
					$("#contactTd").show()
					$("#addCusCheck").attr("checked",false);
					$("#addCusCheck").click();
					$("#addCusCheck").attr("checked",false);
					$("#addCusCheckSpan").show();
					
					//查询客户历史工单
					queryCustomerHistory(customerId.val());
					
					dlg.cancel();
				}
			});
		},
		
		/**新增客户的checkbox*/
		"addCustomer":function(conInput,conShow){
			this.click(function(){
				if(this.checked){
					conShow.hide();
					conInput.show();
					$("input[name='contactWayContent']").val("");
				}else{
					conInput.hide();
					conShow.show();
					conShow.change()
				}
			});
		},
		"userfield":function(text){
			this.parent().append(text);
			this.hide();
		}
	});
})(jQuery);
/***** 获得跟路径 *****/
function getRootPath() {
    var strFullPath = window.document.location.href;
    var strPath = window.document.location.pathname;
    var pos = strFullPath.indexOf(strPath);
    var prePath = strFullPath.substring(0, pos);
    var postPath = strPath.substring(0, strPath.substr(1).indexOf('/') + 1);
    return (prePath + postPath);
}

/**** 创建流程实例 *****/
function createEvent(flowId){
	var sXML = "<?xml version=\"1.0\" encoding=\"utf-8\"?><RAD><Doc><Data><Param ParamType=\"CreatEvent\" FlowId=\"" + flowId + "\"></Param></Data><Result><ResCode></ResCode><ResDetail></ResDetail></Result></Doc></RAD>";
	$.ajax({
        type: "post",
        url: "workFlowRunAction!creatEvent.action",
        async: false,
        contentType: 'xml',
        data: $.parseXML(sXML),
        processData: false,
        success: function (xmlResult) {
            var flowData = $(xmlResult).find("Param");
            var windowWidthValue = 1024;
            var windowHeightValue = 200;

            var startNodeCount = flowData.attr("StartNodeCount");
            var startNodes = flowData.attr("StartNodes");
            if (startNodeCount == "0") {
                alert("您没有该流程权限！");
                return;
            }
            else if (startNodeCount == "1") {
            	 var flowDataModeValue = flowData.attr("FlowDataMode");
                 if (flowDataModeValue == "SingleForm") {
                     var formStyle = flowData.attr("FormStyle");
                     var RMS = new Array;
                     if (formStyle != "") {
                         var arr = formStyle.split(";");

                         for (var i = 0; i < arr.length; i++) {
                             if (arr[i] != "") {
                                 var valuePairs = arr[i].split(":");
                                 valuePairs[0] = TrimString(valuePairs[0]);
                                 if (valuePairs[0].toUpperCase() == "WIDTH") {
                                     RMS["WIDTH"] = valuePairs[1];
                                 } else if (valuePairs[0].toUpperCase() == "HEIGHT") {
                                     RMS["HEIGHT"] = valuePairs[1];
                                 }
                             }
                         }
                     } else {
                         RMS["WIDTH"] = "";
                         RMS["HEIGHT"] = "";
                     }
                     windowWidthValue = parseInt(RMS["WIDTH"].split("px")[0]) + 50;
                     windowHeightValue = parseInt(RMS["HEIGHT"].split("px")[0]) - 50;
                 }
                 var sheight = 600; //screen.height - 70;
                 var swidth = windowWidthValue-10; //screen.width - 10;

                 showCustomDialog(getRootPath() + "/Application/Run/Flow/WorkBench/runFlow.html?EventStepId=" + flowData.attr("EventStepId"), '', 'dialogWidth:' + swidth + 'px; dialogHeight:' + sheight + 'px; resizable=yes;id=Sys_runFlow1;minimize=no;maximize=yes;overparent:yes;showbuttombar=no', null, null);
  
            }
            else {
            	showCustomDialog(getRootPath() + '/Application/Run/Flow/WorkBench/createEvent.html?StartNodes=' + startNodes + '&FlowId=' + flowId, 
            			'', 'dialogWidth:580px;dialogHeight:400px;id=Sys_runFlow;resizable:no;overparent:yes;showbuttombar=no', null, function (returnValue) {
            		if (returnValue) {
            			showCustomDialog(getRootPath() + "/Application/Run/Flow/WorkBench/runFlow.html?EventStepId=" + returnValue, '', 'dialogWidth:500px; dialogHeight:500px; resizable=yes;id=Sys_runFlow1;minimize=no;maximize=yes;overparent:yes;showbuttombar=no', null, null);
            		}
            	});
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
	        alert('Failure: ' + textStatus);
	    }
    });
}

/*** 查看和签收任务 ***/
function acceptWork(eventStepId, acceptState, bussinessParam) {
    var comUrl = getRootPath() + "/Application/WorkFlowSystem/WorkBench/CommonAjax.aspx";
    var formStyle = eventStepSize(eventStepId, comUrl);

    var url = getRootPath() + "/Application/Run/Flow/WorkBench/runFlow.html?EventStepId=" + eventStepId + "";
    if (bussinessParam != undefined && bussinessParam != "") {
        url += bussinessParam;
    }

    if (acceptState == "HasAccepted" || acceptState == "Draft") {
        //已签收
        showCustomDialog(url, '', 'dialogWidth:' + formStyle["WIDTH"] + 'px; dialogHeight:' + formStyle["HEIGHT"] + 'px; resizable:yes;id:AcceptWork;minimize=no;maximize=yes;overparent:yes;title:签收任务',null,function(){window.location.reload();});
    }
    else if (acceptState == "NotAccept") {
        if (confirm("是否签收？") == true) {
            var sXML = "<?xml version=\"1.0\" encoding=\"utf-8\"?><RAD><Doc><Data><Param EventStepId=\"" + eventStepId + "\" ParamType=\"AcceptWork\"></Param></Data><Result><ResCode></ResCode><ResDetail></ResDetail></Result></Doc></RAD>";
            $.ajax({
                type: "post",
                url: 'workFlowSubmitWorkAction!acceptWork.action',
                async: false,
                contentType: 'xml',
                data: $.parseXML(sXML),
                processData: false,
                success: function (XMLObj) {
                    if ($(XMLObj).find("ResCode").text() == "0") {
                        if ($(XMLObj).find("Param")[0].getAttribute("HasAccept").toString() == "1") {
                            alert($(XMLObj).find("Param")[0].getAttribute("ResultInf"));
//
                            showCustomDialog(url, '', 'dialogWidth:' + formStyle["WIDTH"] + 'px; dialogHeight:' + formStyle["HEIGHT"] + 'px; resizable:yes;minimize=no;maximize=yes;overparent:yes;scroll:no;title:签收任务', null, function () {
                            	window.location.reload();
                            });
                        }
                        else {
                            alert("任务已被其它用户签收！");
                        }
                    }
                    else {
                        alert($(XMLObj).find("ResDetail").text());
                        return;
                    }
                },
                error: function (jqXHR, textStatus, errorThrown) {
                }
            });
        }
        else {
            url += "&IsView=1";
            showCustomDialog(url, '', 'onXclick:function(){alert("close");};dialogWidth:' + formStyle["WIDTH"] + 'px; dialogHeight:' + formStyle["HEIGHT"] + 'px;resizable:yes;minimize=no;maximize=yes;location:yes;scroll:no;overparent:yes;title:预览任务');
        }
    }
}

/**流转步骤的窗体大小设置**/
function eventStepSize(sEventStepId, url) {
    var arrSize = new Array;
    /*var sXML = "<?xml version=\"1.0\" encoding=\"utf-8\"?><RAD><Doc><Data><Param ParamType=\"GetEventSize\" FlowDataMode=\"\" EventWorkId=\"" + sEventStepId + "\" ></Param></Data><Result><ResCode></ResCode><ResDetail></ResDetail></Result></Doc></RAD>";
    //发送XML对象
    $.ajax({
        type: "post",
        url: url,
        async: false,
        dataType: 'xml',
        data: sXML,
        success: function (XMLObj) {
            if ($(XMLObj).find("ResCode").text() == "0") {
                var flowDataModeValue = $(XMLObj).find("Param")[0].getAttribute("FlowDataMode").toString();
                if (flowDataModeValue == "SingleForm") {
                    var formStyle = $(XMLObj).find("Param")[0].getAttribute("FormStyle").toString();

                    var RMS = new Array;

                    if (formStyle != "") {
                        var arr = formStyle.split(";");

                        for (var i = 0; i < arr.length; i++) {
                            if (arr[i] != "") {
                                var valuePairs = arr[i].split(":");
                                valuePairs[0] = TrimString(valuePairs[0]);
                                if (valuePairs[0].toUpperCase() == "WIDTH") {
                                    RMS["WIDTH"] = valuePairs[1];
                                } else if (valuePairs[0].toUpperCase() == "HEIGHT") {
                                    RMS["HEIGHT"] = valuePairs[1];
                                }
                            }
                        }
                    } else {
                        RMS["WIDTH"] = "";
                        RMS["HEIGHT"] = "";
                    }
                    arrSize["WIDTH"] = (parseInt(RMS["WIDTH"].split("px")[0]) + 50 > 700) ? parseInt(RMS["WIDTH"].split("px")[0]) + 50 : 700;
                    arrSize["HEIGHT"] = 600;
                }
            }
            else {
                alert($(XMLObj).find("ResDetail").text());
                return;
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            alert(errorThrown);
        }
    });*/
    arrSize["WIDTH"] = "600";
    arrSize["HEIGHT"] = "600";
    return arrSize;
}
/*** 查看结案 ***/
function ViewEndWork(enentId,state){
	 
	    window.showCustomDialog("../../Run/Flow/WorkBench/eventRecords.html?eventWorkId=" + enentId, '', "dialogHeight:630px;dialogWidth:1000px;scroll:yes;resizable=no;Maximize=yes;overparent:yes;cover:yes;dialogtop:10px;id=ViewEventRecord" + enentId);
}

/*
function ViewEndWork(eventId, state) {
	
	var comUrl = getRootPath() + "/Application/WorkFlowSystem/WorkBench/CommonAjax.aspx";
    var formStyle = eventStepSize(eventId, comUrl);
    
    
    
    
    showCustomDialog(getRootPath() + "/Application/Run/Flow/FlowBoxManage/EndWork.html?EventWorkId="
            + eventId, '', "dialogHeight:" + formStyle["WIDTH"] + "px;dialogWidth:" + formStyle["HEIGHT"] 
            + "px;id:ViewEndWork;resizable:yes;minimize=no;maximize=yes;overparent:yes;scroll:no;title:查看结案");
    
     	
}*/
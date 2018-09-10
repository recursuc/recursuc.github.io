//获取IE版本
function fGetIEVer() {
    var iVerNo = 0;
    var sVer = navigator.userAgent;
    if (sVer.indexOf("MSIE") > -1) {
        var sVerNo = sVer.split(";")[1];
        sVerNo = sVerNo.replace("MSIE", "");
        iVerNo = parseFloat(sVerNo);
    }
    return iVerNo;
}

/// <summary>
/// 提交流程
/// </summary>
/// <param name="submitType">数据提交类型</param>
function SubmitFlow(submitType) {
    //确认用户操作
    if (!ConfimMessage(submitType)) {
        return;
    }

    //根据提交类型判断是否需要保存表单数据
    //【暂存、提交、交办、交办完成、任意跳、自动提交、传阅】需要保存数据
    //【回退、任意回退、收回】不需要保存数据
    var formDatasInf, hasUpdateForm = false, result = false;
    if (submitType == "TemporSave" || submitType == "Submit" || submitType == "Delegate" ||
            submitType == "DelegateOK" || submitType == "Jump" ||
            submitType == "GoCome" || submitType == "CopySend") {
        if (arguments[1] == undefined || arguments[1] == null) {
            //保存表单数据
            formDatasInf = SaveForm();
            if (!formDatasInf) { return false; }
            hasUpdateForm = true;
        }
        else {
            formDatasInf = "";
            hasUpdateForm = true;
        }
    }

    //发送Ajax请求进行提交：[暂存表单数据?]；接收返回值
    tempAjaxResult = SubmitTempData(formDatasInf, hasUpdateForm, submitType);

    //根据返回值：发送选项
    //单步处理时可以获取到eventStepId（流转步骤Id）在tempAjaxResult中
    if (tempAjaxResult) {
        //传阅、交办、交办完成、回退、任意回退、任意跳、提交、自动提交、收回
        if (submitType == "CopySend" || submitType == "Delegate" || submitType == "BackWork" ||
            submitType == "BackWorks" || submitType == "Jump" || submitType == "Submit" ||
            submitType == "DelegateOK" || submitType == "GoCome" || submitType == "GetBack") {
            if ($(tempAjaxResult[0]).find("ResCode").text() == "0") {
                //判定是否需要打开发送选项页面
                var sendOperation = $(tempAjaxResult[0]).find("Param")[0].getAttribute("SendOperation");
                if (sendOperation == "1" || sendOperation == "2") {
                    var resXml;
                    //发送选项
                    if (sendOperation == "1") {
                        //resXml = UpdateEventRecord(tempAjaxResult, submitType);
                        window.showCustomDialog("../../Run/Flow/WorkBench/sendOptionPage.html?submitType=" + submitType, tempAjaxResult, "dialogHeight:600px;dialogWidth:880px;resizable:no;overparent:yes;id=SendSubmitInfo", null, function (returObjXmlStr) {
                            if (typeof returObjXmlStr != "undefined") {
                                //获取基础XML对象
                                var sendXml = GetBaseSendXml("Do" + submitType);
                                var paramNode = $(sendXml).find("Param")[0];
                                //                                var xmlNodes = $(SetDom(returObjXmlStr)).find("Nodes")[0].cloneNode(true);
                                //                                paramNode.appendChild(xmlNodes);
                                paramNode.appendChild($(SetDom(returObjXmlStr)).find("Nodes")[0]);
                                result = SendAjax(sendXml, "workFlowSubmitWorkAction!do" + submitType+".action");
                            }
                            callBackFn(result, formDatasInf, submitType);
                        });
                    }
                    //提交信息
                    //单步回退步骤
                    else {
                        // resXml = UpdateEventRecord2(tempAjaxResult[0], submitType);
                        var operatorInfXml = tempAjaxResult[0];

                        var eventStepId = $(operatorInfXml).find("NextStep")[0].getAttribute("EventStepId");//流转步骤ID发送过去
                        var nodeName = $(operatorInfXml).find("NextStep")[0].getAttribute("NodeName");
                        var receiveObjectNames = $(operatorInfXml).find("NextStep")[0].getAttribute("ReceiveObjectNames");
                        var isCodeterminant = $(operatorInfXml).find("NextStep")[0].getAttribute("IsCodeterminant");

                        window.showCustomDialog(getRootPath() + "/Application/Run/Flow/WorkBench/sendSubmitInfo.jsp?submitType="
                        		+ submitType + "&nodeName=" + nodeName + "&receiveObjectNames=" + receiveObjectNames + "&isCodeterminant=" + isCodeterminant, null, "dialogHeight:250px;dialogWidth:700px;resizable:no;overparent:yes;id=SendSubmitInfo;title=回退", null, function (returObjXmlStr) {
                            if (typeof returObjXmlStr != "undefined") {
                                $(operatorInfXml).find("NextStep")[0].setAttribute("SubmitInfo", returObjXmlStr);
                                $(operatorInfXml).find("Param")[0].setAttribute("ParamType", "Do" + submitType);
                                result = SendAjax(operatorInfXml, "workFlowSubmitWorkAction!do" + submitType);
                            }
                            callBackFn(result, formDatasInf, submitType);
                        });
                    }
                }
                else {
                    //var alertInf = tempAjaxResult[0].selectSingleNode("RAD/Doc/Result/ResDetail").text;
                    var alertInf = $(tempAjaxResult[0]).find("ResDetail").text();
                    if (alertInf == "结案成功") {
                        alertInf = "流程处理结束";
                    }
                    alert(alertInf + "!");
                    window.close();
                }
            }
            else {
                if (submitType == "GetBack") {
                    alert($(tempAjaxResult[0]).find("ResDetail").text() + "!");
                } else {
                    alert("更新失败:" + $(tempAjaxResult[0]).find("ResDetail").text() + "!");
                }
                window.close();
            }
        }
        else {
            if (submitType == "TemporSave") {
                if ($(tempAjaxResult[0]).find("ResCode").text() == "0") {
                    alert($(tempAjaxResult[0]).find("ResDetail").text() + "!");
                    //window.close();
                    //暂存成功不关闭页面，需要刷新表单数据
                    ReloadForm(formDatasInf);
                }
                else {
                    alert("更新失败:" + $(tempAjaxResult[0]).find("ResDetail").text() + "!");
                    window.close();
                }
            }
        }
    }
    else {
        alert("数据提交失败！");
        window.close();
    }
}

function callBackFn(resXml, formDatasInf, submitType) {
    if (resXml) {
        if ($(resXml[0]).find("ResCode").text() == 1) {
            //保存失败
            alert($(resXml[0]).find("ResDetail").text() + "!");
            window.close();
        }
        else if ($(resXml[0]).find("ResCode").text() == 0) {
            //保存成功
            var alertInf = $(resXml[0]).find("ResDetail").text();

            if (alertInf == "结案成功") {
                alertInf = "流程处理结束";
            } else {
            	alert(alertInf + "!");
            }

            //传阅成功无需关闭页面，需要刷新
            if (submitType == "CopySend") {
//                ReloadForm(formDatasInf);
            }
            else {
                window.close();
            }
        }
    }
    else {
        //发送选项 【取消操作】：没有关闭页面，【提交、交办、交办完成、任意跳、自动提交、传阅】需要刷新表单数据
        if (submitType == "Submit" || submitType == "Delegate" || submitType == "DelegateOK" ||
                            submitType == "Jump" || submitType == "GoCome" || submitType == "CopySend") {
//            ReloadForm(formDatasInf);
        }
    }
}
/// <summary>
/// 操作进行前提示信息
/// </summary>
///<param name="submitType">数据提交类型</param>
/// <returns>确定执行:true;取消:false</returns>
function ConfimMessage(submitType) {
    //代办交回、自动提交、收回
    switch (submitType) {
        case "DelegateOK":
            {
                return confirm("是否确认代办交回！");
            }
        case "GoCome":
            {
                return confirm("是否确认提交！");
            }
        case "GetBack":
            {
                return confirm("是否确认收回此任务！");
            }
    }
    return true;
}

/// <summary>
/// 保存表单数据
/// </summary>
/// <returns>提交表单薄数据，并返回表单数据值</returns>
function SaveForm() {
    var flowDataMode = ""; //流程数据模式 单表单：SingleForm 多表单：MultiForm
    var info = ""; //提交表单薄数据，并返回表单数据值

    /*if (typeof document.getElementById("FlowDataMode") != "undefined" && document.getElementById("FlowDataMode").value != "") {
        flowDataMode = document.getElementById("FlowDataMode").value;
    }
    else {
        alert("保存表单数据流程数据模式获取失败！");
        return;
    }

    if (typeof document.getElementById("RunFlowForm") != "undefined") {
        var runFlowFormWin = document.getElementById("RunFlowForm").contentWindow;

        //单表单：调用表单运行器数据提交方法
        if (flowDataMode == "SingleForm") {
            info = runFlowFormWin.RunFormFun(true);
        }
        //多表单：调用表单簿运行器数据提交方法
        else if (flowDataMode == "MultiForm") {
            //格式：表单ID，数据KEY，主数据表名；表单ID，数据KEY，主数据表名
            info = runFlowFormWin.RunBusinessFormFun(1);


            if (!info) { return false; }
        }
    }
    else {
        alert("流程运行器表单对象获取失败！");
        return;
    }*/
    var runFlowFormWin = document.getElementById("RunFlowForm").contentWindow;
    info = runFlowFormWin.SForm.save({
    	blnAlert: false,
    	blnClose: false,
    	blnReturnVal: true
    });
    if (!info) { return false; }

    return info;
}

function GetConditionControlsValue(){
	//获取基础XML对象
	var eventStepId = document.getElementById("EventStepId").value;
    result = SendAjax(null, "workFlowSubmitWorkAction!getFormValueConditions.action?EventStepId=" + eventStepId);
    var runFlowFormWin = document.getElementById("RunFlowForm").contentWindow;
    var cValues = [], sheets = runFlowFormWin.SForm.sheets;
    if(result[0] != ""){
    	var jControls = eval("(" + result[0] + ")");
    	for (var name in sheets) {
    		for(var n = 0, l = jControls.length; n < l; n++){
    			var control = jControls[n];
    			if(name == control.formName){
    				var cValue = {};
    				var value = sheets[control.formName].getControlValue(control.controlId);
    				cValue["sValue"] = value;
    				cValue["xnValue"] = "<ConditionValue Type='fControl' ClientId='" + control.controlId 
    				+ "' FormId='" + control.formId + "' FormName='" + jControls[n].formName + "' Value='" 
    				+ value + "'/>";
    				cValues.push(cValue);
    			}
    		}
    	}
    }
    return cValues;
}

/// <summary>
/// 根据表单和表单薄保存返回的信息回刷运行器页面
/// </summary>
function ReloadForm(info) {
    var flowDataMode = ""; //流程数据模式 单表单：SingleForm 多表单：MultiForm

    if (typeof document.getElementById("FlowDataMode") != "undefined" 
    		&& document.getElementById("FlowDataMode").value != "") {
        flowDataMode = document.getElementById("FlowDataMode").value;
    }
    else {
        alert("保存表单数据流程数据模式获取失败！");
        return;
    }

    if (typeof document.getElementById("RunFlowForm") != "undefined") {
        var runFlowFormWin = document.getElementById("RunFlowForm").contentWindow;

        //单表单：调用表单运行器数据提交方法
        if (flowDataMode == "SingleForm") {
            //表单信息 infoList[0]：表单ID infoList[1]：数据KEY infoList[2]：主表表名
            var infoList = info.split(',');
            var infoArray = GetFormInfList(infoList[0]);

            //回写formInfo到页面域
            document.getElementById("formInfValue").value = infoList[0] + ',' + infoList[1] + ',' + infoArray[2] + ',' + infoList[2];

            if (infoList.length > 0 && infoArray.length > 0) {
                document.getElementById("RunFlowForm").src = "../../FormRun/f_run.htm?DataKey=" + infoList[1] + "&IsRunflow=1&FormId=" + infoList[0] + "&FormState=" + infoArray[2] + "&OperationSign=2";
            }
        }
        //多表单：调用表单簿运行器数据提交方法
        else if (flowDataMode == "MultiForm") {
            //Info格式：表单ID，数据KEY，主数据表名；表单ID，数据KEY，主数据表名
            //重新加载表单簿
            //此操作主要把数据更新后的DATAKEY回填到formInfValue的字符串中
            //--start
            var formInfValueArray = new Array();
            var formInfValueStr = document.getElementById("formInfValue").value;
            var formInfValueList = formInfValueStr.split(';');
            for (var y = 0, length = formInfValueList.length; y < length; y++) {
                formInfValueArray[y] = formInfValueList[y].split(',');
            }

            var formsInfo = info.split(';');
            for (var m = 0, length = formsInfo.length; m < length; m++) {
                var formInfo = formsInfo[m].split(',');
                for (var u = 0, flength = formInfValueArray.length; u < flength; u++) {
                    if (formInfo[0] == formInfValueArray[u][0]) {
                        formInfValueArray[u][1] = formInfo[1];
                        break;
                    }
                }
            }

            for (var v = 0, length = formInfValueArray.length; v < length; v++) {
                if (v == 0) {
                    formInfValueStr = formInfValueArray[v][0] + "," + formInfValueArray[v][1] + "," + formInfValueArray[v][2] + "," + formInfValueArray[v][3];
                }
                else {
                    formInfValueStr += ";" + formInfValueArray[v][0] + "," + formInfValueArray[v][1] + "," + formInfValueArray[v][2] + "," + formInfValueArray[v][3];
                }
            }

            //回写formInfo到页面域
            document.getElementById("formInfValue").value = formInfValueStr;
            //--end

            var bfId = document.getElementById("businessFormId").value;
            document.getElementById("RunFlowForm").src = "../../FormRun/f_run.htm?BusinessFormId=" + bfId + "&IsRunflow=1&FormsInf=" + formInfValueStr;
        }
    }
    else {
        alert("流程运行器表单对象获取失败！");
        return;
    }
}

/// <summary>
/// 根据表单ID获得表单信息数组
/// </summary>
/// <returns>表单信息数组 formInfList[0]：表单ID formInfList[1]：数据KEY formInfList[2]：表单状态 formInfList[3]：主表名称</returns>
function GetFormInfList(formId) {
    var formInfList = new Array();

    var forms = document.getElementById("formInfValue").value;

    var formsList = forms.split(';');
    for (var n = 0, length = formsList.length; n < length; n++) {
        var formInf = formsList[n].split(',');
        if (formInf[0] == formId) {
            formInfList = formInf;
            break;
        }
    }
    return formInfList;
}

/// <summary>
/// 暂存,进行流转数据更新
/// </summary>
/// <param name="formsInf">表单数据值信息</param>
/// <param name="hasUpdateForm">是否需要更新表单信息</param>
/// <returns>处理人等相关信息</returns>
function SubmitTempData(formsInf, hasUpdateForm, submitType) {
	var conditionControls = GetConditionControlsValue();
    //获取基础XML对象
    var sendXml = GetBaseSendXml(submitType);

    if (hasUpdateForm) {
    	var strNodeCondition = "<Condition>";
    	for(var n = 0, l = conditionControls.length; n < l; n++){
    		strNodeCondition += conditionControls[n]["xnValue"];
    	}
    	strNodeCondition += "</Condition>";
    	
        //拼装数据内容节点
        var strNodeSend = "<?xml version=\"1.0\" encoding=\"utf-8\"?><RAD><Doc><Data><Forms EventStepId=\"" + document.getElementById("EventStepId").value + "\">";
        if (formsInf != "") {
            var arrFormsInfo = formsInf.split(";");
            for (var i = 0; i < arrFormsInfo.length; i++) {
                var arr = arrFormsInfo[i].split(",");
                strNodeSend += "<Form Id =\"" + arr[0] + "\" DataKey =\"" + arr[1] + "\" MainTable =\"" + arr[2] + "\" />";
            }
        }
        strNodeSend += "</Forms>" + strNodeCondition + "</Data></Doc></RAD>";

        //var xmlForms = $(SetDom(strNodeSend)).find("Forms")[0].cloneNode(true);

        var paramNode = $(sendXml).find("Param")[0];
        paramNode.appendChild($(SetDom(strNodeSend)).find("Forms")[0]);
        paramNode.appendChild($(SetDom(strNodeSend)).find("Condition")[0]);
    }

    return SendAjax(sendXml, "workFlowSubmitWorkAction!" + submitType);
}

/// <summary>
/// 发送选项
/// </summary>
/// <param name="operatorInfXml">处理人等相关信息</param>
/// <param name="submitType">数据提交类型</param>
function SendOption(operatorInfXml, submitType) {
    // 根据提交类型出不同的发送选项
    //var returObjXmlStr = window.showModalDialog("SendOption.aspx?submitType=" + submitType, operatorInfXml, "dialogHeight:630px;dialogWidth:660px;status:yes;scroll:yes;resizable:no;center:yes");
    var returObjXmlStr = window.showModalDialog("sendOptionPage.html?submitType=" + submitType, operatorInfXml, "dialogHeight:600px;dialogWidth:880px;status:yes;scroll:yes;resizable:no;center:yes");
    return returObjXmlStr;
}

/// <summary>
/// 查看流转记录
/// </summary>
function ViewEventRecord(eventWorkId) {
    var timeTags = Math.floor(Math.random() * 1000 + 1);
    window.showCustomDialog("../../Run/Flow/WorkBench/eventRecords.html?timeTags=" + timeTags + "&eventWorkId=" + eventWorkId, '', "dialogHeight:630px;dialogWidth:1000px;scroll:yes;resizable=no;Maximize=yes;overparent:yes;cover:yes;dialogtop:10px;id=ViewEventRecord" + eventWorkId);
}

/// <summary>
/// 更新流转记录
/// </summary>
function UpdateEventRecord(operatorInfXml, submitType) {
    var returObjXmlStr = SendOption(operatorInfXml, submitType);

    var result;
    if (typeof returObjXmlStr != "undefined") {
        //获取基础XML对象
        var sendXml = GetBaseSendXml("Do" + submitType);
        var paramNode = $(sendXml).find("Param")[0];
        //var xmlNodes = $(SetDom(returObjXmlStr)).find("Nodes")[0].cloneNode(true);
        paramNode.appendChild($(SetDom(returObjXmlStr)).find("Nodes")[0]);
        result = SendAjax(sendXml, "workFlowSubmitWorkAction!do" + submitType);
    }
    else {
        result = false;
    }
    return result;
}

//更新流转（先出提交信息页面）
function UpdateEventRecord2(operatorInfXml, submitType) {

    var eventStepId = $(operatorInfXml).find("NextStep")[0].getAttribute("EventStepId");
    var nodeName = $(operatorInfXml).find("NextStep")[0].getAttribute("NodeName");
    var receiveObjectNames = $(operatorInfXml).find("NextStep")[0].getAttribute("ReceiveObjectNames");
    var isCodeterminant = $(operatorInfXml).find("NextStep")[0].getAttribute("IsCodeterminant");

    var returObjXmlStr = window.showModalDialog("sendSubmitInfo.html?submitType=" + submitType + "&nodeName=" + nodeName + "&receiveObjectNames=" + receiveObjectNames + "&isCodeterminant=" + isCodeterminant, null, "dialogHeight:250px;dialogWidth:600px;status:no;scroll:no;resizable:no;center:yes");
    var result;
    if (typeof returObjXmlStr != "undefined") {
        $(operatorInfXml).find("NextStep").setAttribute("SubmitInfo", returObjXmlStr);
        $(operatorInfXml).find("Param").setAttribute("ParamType", "Do" + submitType);

        result = SendAjax(operatorInfXml, "workFlowSubmitWorkAction!do" + submitType);
    }
    else {
        result = false;
    }
    return result;

}

/// <summary>
/// 拼装发送的XML基础对象
/// </summary>
/// <param name="saveType">流程保存类型</param>
/// <returns>发送的XML基础对象</returns>
function GetBaseSendXml(saveType) {
    var eventStepId = document.getElementById("EventStepId").value;

    var strXMLSend = "<?xml version=\"1.0\" encoding=\"utf-8\"?>";
    strXMLSend += "<RAD><Doc><Data>";
    strXMLSend += "<Param ParamType=\"" + saveType + "\" EventStepId=\"" + eventStepId + "\" >";
    strXMLSend += "</Param>";
    strXMLSend += "</Data></Doc></RAD>";

    //发送的参数Xml
    var XMLSend = SetDom(strXMLSend);

    return XMLSend;
}

/// <summary>
/// 拼装发送的XML基础对象
/// </summary>
/// <returns>Ajax结果集 Array[0]：返回的XML Array[1]：responseText</returns>
function SendAjax(sendXml, url) {
    //发送xml请求
    //    if (document.all) {
    //        var XMLPoster = GetXmlHttpObject()//获得AJAX对象
    //        if (XMLPoster == null) {
    //            alert("您的浏览器不支持AJAX！");
    //            return;
    //        }

    //        XMLPoster.open("Post", url, false);
    //        XMLPoster.send(sendXml);

    //        //接收返回参数Xml
    //        var XMLObj = SetDom(XMLPoster.responseText);
    //        var ajaxResult = new Array();
    //        ajaxResult[0] = XMLObj;
    //        ajaxResult[1] = XMLPoster.responseText;

    //        return ajaxResult;
    //    }

    if (!document.all) {
        Node.prototype.__defineGetter__("xml",
        function () {
            return (new XMLSerializer).serializeToString(this);
        });
    }

    var ajaxResult = new Array();
    $.ajax({
        type: "post",
        url: url,
        async: false,
        contentType: "xml",
        data: sendXml,
        processData: false,
        success: function (data) {
        	if(typeof data == "string"){
        		ajaxResult[0] = data;
        	} else {
        		ajaxResult[0] = data;
        		ajaxResult[1] = data.xml.toString();
        	}
        },
        error: function (jqXHR, textStatus, errorThrown) {
	        alert('Failure: ' + textStatus);
	    }
    });
    return ajaxResult;
}

/// <summary>
/// 获得AJAX对象
/// </summary>
/// <returns>AJAX对象</returns>
function GetXmlHttpObject() {
    var xmlHttp = null;
    try {
        // Firefox, Opera 8.0+, Safari
        xmlHttp = new XMLHttpRequest();
    }
    catch (e) {
        // Internet Explorer
        try {
            xmlHttp = new ActiveXObject("Msxml2.XMLHTTP");
        }
        catch (e) {
            xmlHttp = new ActiveXObject("Microsoft.XMLHTTP");
        }
    }
    return xmlHttp;
}

/// <summary>
/// 将字符串序列化XML对象
/// </summary>
function SetDom(sXml) {
    if (document.all) {
        var oXml = "";
        if (window.ActiveXObject) {
            oXml = new ActiveXObject("Microsoft.XMLDOM");
        }
        oXml.async = false;
        oXml.loadXML(sXml);
        return oXml;
    }
    else
    { return new DOMParser().parseFromString(sXml, "text/xml") }
}

/// <summary>
/// 关闭窗口
/// </summary>
function CloseThis() {
    if (confirm("确定关闭当前窗口吗？")) {
        window.close();
    }
}

function InitIframeStyle() {
    var contentDiv = document.getElementById("middlediv");
    var iframeObj = document.getElementById("RunFlowForm");
    iframeObj.style.height = contentDiv.clientHeight;
}

//痕迹查看
function RunTrace() {
    var formDataType = document.getElementById("FlowDataMode").value;
    var selforms = document.getElementById("selforms");
    var iframeObj = document.getElementById("RunFlowForm");
    if (formDataType == "SingleForm") {
        iframeObj.contentWindow.RunTrace();
    } else if (formDataType == "MultiForm") {
        if (document.getElementById("formInfValue").value != "") {
            var forms = document.getElementById("formInfValue").value;
            window.showModalDialog("../../FormSystem/form/f_trace_frame.aspx?FormInfs=" + forms, "", "dialogHeight:750px;dialogWidth:900px;status:yes;scroll:no;resizable:no;center:yes");
        }
    }
}

//监控信息查看
function MonitoringView(type, eventStepID) {
    if (fGetIEVer() == 6) {
        window.showCustomDialog('MonitoringOption.aspx?eventStepID=' + eventStepID + '&type=' + type, '', "dialogHeight:600px;dialogWidth:980px;scroll:yes;resizable=yes;Maximize=yes;overparent:yes;cover:yes;dialogtop:10px;id=MonitoringView" + eventStepID)
    }
    else if (fGetIEVer() == 8) {
        window.showCustomDialog('MonitoringOption.aspx?eventStepID=' + eventStepID + '&type=' + type, '', "dialogHeight:600px;dialogWidth:980px;scroll:yes;resizable=yes;Maximize=yes;overparent:yes;cover:yes;dialogtop:10px;id=MonitoringView" + eventStepID)
    }
    else if (fGetIEVer() == 7) {
        window.showCustomDialog('MonitoringOption.aspx?eventStepID=' + eventStepID + '&type=' + type, '', "dialogHeight:600px;dialogWidth:980px;scroll:yes;resizable=yes;Maximize=yes;overparent:yes;cover:yes;dialogtop:10px;id=MonitoringView" + eventStepID)
    }
}

//督办信息查看
function PushesInfo(id, eventStepID, messageStart) {
    if (arguments[3] == undefined) {
        window.parent.frames.frames["SendMessage"].location = "MonitoringMessage.aspx?PushesID=" + id + "&EventStepID=" + eventStepID + "&State=LooKPushesMessage&MessageStart=" + messageStart + "";
    }
    else {
        window.parent.frames.frames["SendMessage"].location = "MonitoringMessage.aspx?PushesID=" + id + "&EventStepID=" + eventStepID + "&State=LooKAndAnswersPushesMessage&MessageStart=" + messageStart + "";
    }
}

function NewPushes(eventStepID) {
    window.parent.frames.frames["SendMessage"].location = "MonitoringMessage.aspx?EventStepID=" + eventStepID + "&State=SendPushesMessage";
}

//新建延时申请
function NewTimeDelay(eventStepID) {
    window.parent.frames.frames["SendMessage"].location = "MonitoringMessage.aspx?EventStepId=" + eventStepID + "&State=SendTimeDelayMessage";
}

//延时申请信息查看
function TimeDelayView(timeDelayID, eventStepID) {
    window.parent.frames.frames["SendMessage"].location = "MonitoringMessage.aspx?timeDelayID=" + timeDelayID + "&State=LookTimeDelayMessage&EventStepId=" + eventStepID + "";
}
//根据参数获取信息
function GetAjaxInfo(params) {
    var XMLrecieve;

    //发送XML字符串
    var sXML = '<?xml version="1.0" encoding="utf-8"?><Pnet><Doc><Data>' + params + '</Data></Doc></Pnet>';

    //发送XML对象
    var XMLSend = new ActiveXObject("Microsoft.XMLDOM");
    XMLSend.loadXML(sXML);

    //获取请求信息
    XMLPoster = new ActiveXObject("Microsoft.XMLHTTP");
    XMLPoster.Open("Post", "formRunAction!getConditionDatas.action", false);
    XMLPoster.Send(XMLSend);

    XMLrecieve = XMLPoster.ResponseXML;

    return XMLrecieve;
}

function Flow_IsNameExist(flowname) {
    var paramXML = '<Param ParamType="IsFlowNameExist" FlowName="' + flowname + '" />';

    var XMLObj = GetAjaxInfo(paramXML);

    if (XMLObj.selectSingleNode("Pnet/Doc/Data/IsFlowNameExist").attributes.getNamedItem("IsExist").value == "true") {
        return "True";
    }
    else {
        return "False";
    }
}

function Flow_CreateFormList(BFormId) {
    var flowHtml = "";

    if (BFormId == "") {
        flowHtml = "<table class='table11' width='100%'><tr><td style='height:35px' class='table_heading6'>请选择表单薄</td></tr></table>";
        return flowHtml;
    }

    var paramXML = '<Param ParamType="SelectFormList" BFormId="' + BFormId + '"  GetFormState="1" />';

    var XMLObj = GetAjaxInfo(paramXML);

    if (XMLObj.selectSingleNode("Pnet/Doc/Data/SelectFormList").childNodes.length > 0) {
        flowHtml += "<table class='table11' width='100%'>";
        
        for (var i = 0; i < XMLObj.selectSingleNode("Pnet/Doc/Data/SelectFormList").childNodes.length; i++) {
            flowHtml += "<tr><td style='height:20px' class='table_heading6'>" + XMLObj.selectSingleNode("Pnet/Doc/Data/SelectFormList").childNodes[i].attributes.getNamedItem("Name").value + "</td>"
            + "<td class='table_heading6'><select class='page_select1' id='Flow_" + XMLObj.selectSingleNode("Pnet/Doc/Data/SelectFormList").childNodes[i].attributes.getNamedItem("Id").value + "' "
            + "formid='" + XMLObj.selectSingleNode("Pnet/Doc/Data/SelectFormList").childNodes[i].attributes.getNamedItem("Id").value + "' maintable='" + XMLObj.selectSingleNode("Pnet/Doc/Data/SelectFormList").childNodes[i].attributes.getNamedItem("MainTable").value + "' name='formState' style='width:120'>";

            if (XMLObj.selectSingleNode("Pnet/Doc/Data/SelectFormList").childNodes[i].childNodes.length > 0) {
               
                for (var j = 0; j < XMLObj.selectSingleNode("Pnet/Doc/Data/SelectFormList").childNodes[i].childNodes.length; j++) {
                    flowHtml += "<option value='" + XMLObj.selectSingleNode("Pnet/Doc/Data/SelectFormList").childNodes[i].childNodes[j].attributes.getNamedItem("StateId").value + "' datastate='" + XMLObj.selectSingleNode("Pnet/Doc/Data/SelectFormList").childNodes[i].childNodes[j].attributes.getNamedItem("DataState").value + "' >" 
                    + XMLObj.selectSingleNode("Pnet/Doc/Data/SelectFormList").childNodes[i].childNodes[j].attributes.getNamedItem("StateName").value + "</option>";
                }
            }

            flowHtml += "</select></td><td class='table_heading6'><select class='page_select1' id='select_" + XMLObj.selectSingleNode("Pnet/Doc/Data/SelectFormList").childNodes[i].attributes.getNamedItem("Id").value + "' name='formDataState'style='width:120'><option value='0' selected>非环节独占</option><option value='1' selected>环节独占</option></select> </td></tr>";
        }
        
        flowHtml += "</table>";
    }
    else {
        flowHtml = "<table class='table11' width='100%'><tr><td style='height:35px' class='table_heading6'>当前表单薄下没有表单</td></tr></table>";
    }

    return flowHtml;
}

//根据表单薄ID获取所有的表单列表 ：Xml格式
function Flow_GetFormByBFormId(BFormId) {
    if (BFormId == "") {
        return null;
    }
    
    var paramXML = '<Param ParamType="GetFormByBFormId" BFormId="' + BFormId + '" />';
    var XMLObj = GetAjaxInfo(paramXML);

    return XMLObj;
}

//根据表单ID获取所有的控件列表 ：Xml格式
function Flow_GetControlByFormId(FormId) {
    if (FormId == "") {
        return null;
    }
    
    var paramXML = '<Param ParamType="GetControlByFormId" FormId="' + FormId + '" OnlyDataControl="1" />';
    var XMLObj = GetAjaxInfo(paramXML);

    return XMLObj;
}

// 获得决策人
function Flow_GetLeadersByIdStr(IdStr) {
    if (IdStr == "") return null;
    IdStr = IdStr.replace('<', "&lt");
    IdStr = IdStr.replace('>', "&gt");
    var paramXML = '<Param ParamType="GetLeaders" UserId="' + IdStr + '" OnlyDataControl="1" />';
    var XMLObj = GetAjaxInfo(paramXML);

    return XMLObj;
}

function Flow_GetFormStatByFormId(formId) {
    if (formId == "") {
        return null;
    }

    var paramXML = '<Param ParamType="GetFormStatByFormId" FormId="' + formId + '" OnlyDataControl="1" />';
    var XMLObj = GetAjaxInfo(paramXML);

    return XMLObj;
}


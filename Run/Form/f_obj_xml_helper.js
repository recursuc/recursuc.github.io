function ValidForm(arrValidSeq) {
    if (arrValidSeq.length > 0) {
        for (var i = 0, iValidSeqLen = arrValidSeq.length; i < iValidSeqLen; i++) {
            for (var prop in arrValidSeq[i]) {
                switch (prop) {
                    case "IsRequired":
                        {
                            if (arrValidSeq[i][prop] == "true") {
                                var sMsg = '表单中尚有必填项尚未填写！请填写。';
                                if (arrValidSeq[i].NoEmptyAlertMsg != "") {
                                    sMsg = arrValidSeq[i].NoEmptyAlertMsg;
                                }
                                if (document.getElementById(arrValidSeq[i].ClientId).ControlType == "radio") {
                                    if (!fValidControl(arrValidSeq[i].ClientId, SysF_IsEmptyByRadio, sMsg)) {
                                        SetFocus(document.getElementById(arrValidSeq[i].ClientId));
                                        return false;
                                    }
                                } else {
                                    if (!fValidControl(arrValidSeq[i].ClientId, SysF_IsNoEmpty, sMsg)) {
                                        SetFocus(document.getElementById(arrValidSeq[i].ClientId));
                                        return false;
                                    }
                                }
                            }
                            break;
                        }
                    case "IsXMLSpecialChar":
                        {
                            if (arrValidSeq[i][prop] == "true") {
                                var sMsg = '表单中含有非法字符,请检查并删除非法字符!';
                                if (arrValidSeq[i].SpecialCharAlertMsg != "") {
                                    sMsg = arrValidSeq[i].SpecialCharAlertMsg;
                                }
                                if (!fValidControl(arrValidSeq[i].ClientId, SysF_IsNoContainSpecialChar, sMsg)) {
                                    SetFocus(document.getElementById(arrValidSeq[i].ClientId));
                                    return false;
                                }
                            }
                            break;
                        }
                    case "IsLengthValid":
                        {
                            if (arrValidSeq[i][prop] == "true") {
                                if (!fValidControl(arrValidSeq[i].ClientId, SysF_IsInBoundOfLength, arrValidSeq[i].LengthValidInfo.split(","))) {
                                    SetFocus(document.getElementById(arrValidSeq[i].ClientId));
                                    return false;
                                }
                            }
                            break;
                        }
                    case "CommitValidFucNames":
                        {
                            if (arrValidSeq[i][prop] != "") {
                                if (document.getElementById(arrValidSeq[i].ClientId).value != "") {
                                    if (arrValidSeq[i][prop].indexOf(";") != -1) {
                                        var arrFns = arrValidSeq[i][prop].split(";");
                                        for (var j = 0, iFnslen = arrFns.length; j < iFnslen; j++) {
                                            try {
                                                var regExtraSpace = /^\s+(.*)\s+$/;
                                                var sFucName = arrFns[j].replace(regExtraSpace, "$1");
                                                if (sFucName == "") continue;
                                                if (!eval(sFucName)) {
                                                    SetFocus(document.getElementById(arrValidSeq[i].ClientId));
                                                    return false;
                                                }
                                            } catch (e) {
                                                alert("提交函数" + sFucName.subString(0, sFucName.indexOf("(")) + "有错！");
                                            }
                                        }
                                    } else {
                                        var regExtraSpace = /^\s+(.*)\s+$/;
                                        var sFucName = arrValidSeq[i][prop].replace(regExtraSpace, "$1");
                                        if (sFucName == "") continue;
                                        try {
                                            if (!eval(sFucName)) {
                                                SetFocus(document.getElementById(arrValidSeq[i].ClientId));
                                                return false;
                                            }
                                        } catch (e) {
                                            alert("提交函数" + sFucName.subString(0, sFucName.indexOf("(")) + "有错！");
                                        }
                                    }
                                }
                            }
                            break;
                        }
                }
            }
        }
    }
    return true;
}

function fValidControl(sId, fnName, params) {
    var oCont = document.getElementById(sId);
    if (!(params instanceof Array)) {
        params = [params];
    }
    try {
        switch (oCont.getAttribute('ControlType')) {
            case "countersign":
                {
                    oCont = oCont.getElementsByTagName("textarea")[0];
                    break;
                }
            case "datetime":
                {
                    oCont = oCont.getElementsByTagName("input")[0];
                    break;
                }
            case "combobox":
                {
                    if (oCont.options.length > 1 && oCont.options[oCont.selectedIndex].value == "") {//选中的文本为 请选择
                        return false;
                    }
                    break;
                }
            case "radio":
                {
                    break;
                }
            case "checkboxlist":
                {
                    break;
                }
            case "checkbox":
                {
                    var oIpts = oCont.getElementsByTagName("input")[0];
                    var bNoAnySel = true;
                    for (var i = 0; i < oIpts.length; i++) {
                        if (oIpts[i].checked) {
                            bNoAnySel = false;
                        }
                    }
                    if (bNoAnySel) {
                        return false;
                    }
                    break;
                }
        }
        params.unshift(oCont.value);
        params.push(oCont);
        if (oCont.ControlType == "radio") {
            if (!SysF_IsEmptyByRadio(oCont, params[1])) {
                return false;
            }
        } else {
            if (!fnName.apply(null, params)) {
                return false;
            }
        }
    } catch (e) {
        throw new Error("控件Id为" + oCont.id + "验证配置参数有误!");
    }
    return true;
}

function fCreateXMLForm(xmlBase, oForm) {
    var xmlform = xmlBase.createElement("Form");

    xmlform.setAttribute("DbId", oForm.sDbId);
    xmlform.setAttribute("ClientId", oForm.sClientId);
    xmlform.setAttribute("ControlPrefix", oForm.sControlPrefix);
    xmlform.setAttribute("Name", oForm.sChineseName);
    xmlform.setAttribute("Trace", oForm.sTrace);
    xmlform.setAttribute("Categories", oForm.sCategories);
    if (typeof oForm.area != "undefined") {
        xmlform.setAttribute("Style", oForm.area.style.cssText);
        xmlform.setAttribute("EditingAreaStyle", oForm.area.parentNode.parentNode.style.cssText);
    } else {
        xmlform.setAttribute("Style", "");
        xmlform.setAttribute("EditingAreaStyle", "");
    }

    return xmlform;
}

function fCreateXMLControl(xmlBase) {
    var xmlControl = xmlBase.createElement("Control");

    xmlControl.setAttribute("DbId", "");
    xmlControl.setAttribute("ClientId", "");
    xmlControl.setAttribute("Type", "");
    xmlControl.setAttribute("Name", "");
    xmlControl.setAttribute("Trace", "");

    xmlControl.setAttribute("Position", "");
    xmlControl.setAttribute("Style", "");

    xmlControl.setAttribute("DtClientId", "");
    xmlControl.setAttribute("ColumnName", "");

    xmlControl.setAttribute("DataMode", "");
    xmlControl.setAttribute("ValueColumnName", "");
    xmlControl.setAttribute("Value", "");
    xmlControl.setAttribute("TextColumnName", "");
    xmlControl.setAttribute("Text", "");

    xmlControl.setAttribute("DefaultValue", "");

    xmlControl.setAttribute("DataSourceType", "");
    xmlControl.setAttribute("TextDataSource", "");
    xmlControl.setAttribute("DbValueColumn", "");
    xmlControl.setAttribute("DbTextColumn", "");
    xmlControl.setAttribute("DbDataSource", "");
    xmlControl.setAttribute("DbParentColumn", "");
    xmlControl.setAttribute("ParentControlClientId", "");

    xmlControl.setAttribute("IsRequired", "");
    xmlControl.setAttribute("IsXMLSpecialChar", "");
    xmlControl.setAttribute("SystemVariables", "");

    return xmlControl;
}

function fCreateXMLEvents(currObj, xmlBase) {
    var xmlEvents = xmlBase.createElement("Events");

    var xmlOnclick = xmlBase.createElement("Event");
    xmlOnclick.setAttribute("type", "onclick");
    $(xmlOnclick).text(isUndefined(currObj.getAttribute("_onclick")) == true ? "" : currObj.getAttribute("_onclick"));
    xmlEvents.appendChild(xmlOnclick);
    var xmlOndblclick = xmlBase.createElement("Event");
    xmlOndblclick.setAttribute("type", "ondblclick");
    $(xmlOndblclick).text(isUndefined(currObj.getAttribute("_ondblclick")) == true ? "" : currObj.getAttribute("_ondblclick"));
    xmlEvents.appendChild(xmlOndblclick);
    var xmlOnfocus = xmlBase.createElement("Event");
    xmlOnfocus.setAttribute("type", "onfocus");
    $(xmlOnfocus).text(isUndefined(currObj.getAttribute("_onfocus")) == true ? "" : currObj.getAttribute("_onfocus"));
    xmlEvents.appendChild(xmlOnfocus);
    var xmlOnblur = xmlBase.createElement("Event");
    xmlOnblur.setAttribute("type", "onblur");
    $(xmlOnblur).text(isUndefined(currObj.getAttribute("_onblur")) == true ? "" : currObj.getAttribute("_onblur"));
    xmlEvents.appendChild(xmlOnblur);
    var xmlOnchange = xmlBase.createElement("Event");
    xmlOnchange.setAttribute("type", "onchange");
    $(xmlOnchange).text(isUndefined(currObj.getAttribute("_onchange")) == true ? "" : currObj.getAttribute("_onchange"));
    xmlEvents.appendChild(xmlOnchange);
    var xmlOnkeydown = xmlBase.createElement("Event");
    xmlOnkeydown.setAttribute("type", "onkeydown");
    $(xmlOnkeydown).text(isUndefined(currObj.getAttribute("_onkeydown")) == true ? "" : currObj.getAttribute("_onkeydown"));
    xmlEvents.appendChild(xmlOnkeydown);
    var xmlOnkeyup = xmlOnkeydown.cloneNode(false);
    xmlOnkeyup.setAttribute("type", "onkeyup");
    $(xmlOnkeyup).text(isUndefined(currObj.getAttribute("_onkeyup")) == true ? "" : currObj.getAttribute("_onkeyup"));
    xmlEvents.appendChild(xmlOnkeyup);
    return xmlEvents;
}


function fSetBaseAttribute(currObj, xmlControl) {
    var NodeId = "";
    var NodeName = "";
    var NodeTrace = "";

    if (currObj.getAttribute("DbId")) {
        NodeId = currObj.getAttribute("DbId");
    }

    if (currObj.getAttribute("ChineseName")) {
        NodeName = currObj.getAttribute("ChineseName");
    }

    if (currObj.getAttribute("Trace")) {
        NodeTrace = currObj.getAttribute("Trace");
    }

    if (currObj.IsPrint) {
        xmlControl.setAttribute("IsPrint", currObj.IsPrint);
    }

    xmlControl.setAttribute("DbId", NodeId);
    xmlControl.setAttribute("ClientId", currObj.id);
    xmlControl.setAttribute("Type", currObj.getAttribute("ControlType"));
    xmlControl.setAttribute("Name", NodeName);
    xmlControl.setAttribute("Trace", NodeTrace);
    var controlStateType = typeof currObj.getAttribute("ControlStateType") == "undefined" ? "None" : currObj.getAttribute("ControlStateType");
    xmlControl.setAttribute("ControlStateType", controlStateType);
    xmlControl.setAttribute("ClassName", currObj.className);
}

//设置样式属性
function fSetStyleAttribute(currObj, xmlControl) {
    xmlControl.setAttribute("Position", currObj.style.position);
    xmlControl.setAttribute("Style", currObj.style.cssText);
}

//设置单值数据绑定属性
function fSetDataAttribute(currObj, xmlControl) {
    xmlControl.setAttribute("DtClientId", currObj.getAttribute("DtClientId"));
    xmlControl.setAttribute("ColumnName", currObj.getAttribute("ColumnName"));
    xmlControl.setAttribute("DefaultValue", currObj.getAttribute("DefaultValue") || '');
}

//设置双值数据绑定属性
function fSetBothDataAttribute(currObj, xmlControl) {
    xmlControl.setAttribute("DtClientId", currObj.getAttribute("DtClientId"));
    xmlControl.setAttribute("DataMode", currObj.getAttribute("DataMode"));
    xmlControl.setAttribute("ValueColumnName", currObj.getAttribute("ValueColumnName"));
    xmlControl.setAttribute("TextColumnName", currObj.getAttribute("TextColumnName"));
}

//设置数据源属性
function fSetDBSourceAttribute(currObj, xmlControl) {
    var tempDbDataSource = $(currObj).attr("DbDataSource").replace(/'/g, "@");
    xmlControl.setAttribute("DataSourceType", $(currObj).attr("DataSourceType"));
    xmlControl.setAttribute("TextDataSource", $(currObj).attr("TextDataSource"));
    xmlControl.setAttribute("DbValueColumn", $(currObj).attr("DbValueColumn"));
    xmlControl.setAttribute("DbTextColumn", $(currObj).attr("DbTextColumn"));
    xmlControl.setAttribute("DbDataSource", tempDbDataSource);
    xmlControl.setAttribute("DbParentColumn", $(currObj).attr("DbParentColumn"));
    xmlControl.setAttribute("ParentControlClientId", $(currObj).attr("ParentControlClientId"));
}

//设置返回值属性
function fSetValueAttribute(currObj, xmlControl, xmlBase) {
    switch (currObj.getAttribute("ControlType")) {
        case "text":
        case "password":
        case "textarea":
            {
                var returnValue = currObj.value;
                if (currObj.getAttribute("SystemVariables") && (currObj.getAttribute("SystemVariables") == "User" || currObj.getAttribute("SystemVariables") == "Department")) {
                    returnValue = currObj.getAttribute("ReturnValue");
                } else if (String.isSpace(currObj.value) && currObj.getAttribute("DefaultValue") && currObj.getAttribute("DefaultValue") != "") {
                    returnValue = currObj.getAttribute("DefaultValue");
                }
                if (currObj.getAttribute("SpecialFunc") === "f_Price") {

                }
                xmlControl.setAttribute("Value", returnValue);
                xmlControl.setAttribute("SourceValue", currObj.getAttribute("SourceValue") || "");
                break;
            }
        case "editor":
            {
                var sContent = escape(document.getElementById(currObj.id).contentWindow.HtmlEditor.document.body.innerHTML);
                xmlControl.setAttribute("Value", sContent);
                xmlControl.setAttribute("SourceValue", currObj.getAttribute("SourceValue") || "");
                break;
            }
        case "datetime":
            {
                var cObj = document.getElementById(currObj.id);
                var currValueObj = cObj.getElementsByTagName("input");
                var returnValue = currValueObj[0].value;
                xmlControl.setAttribute("Value", returnValue);
                xmlControl.setAttribute("SourceValue", currObj.getAttribute("SourceValue") || "");

                break;
            }
        case "mydatetime":
            {
                var returnValue = currObj.value;
                xmlControl.setAttribute("Value", returnValue);
                xmlControl.setAttribute("SourceValue", currObj.getAttribute("SourceValue") || "");

                break;
            }
        case "combobox":
            {
                xmlControl.setAttribute("Value", HTMLEncode(currObj.value));
                if (currObj.options.length > 0) {
                    xmlControl.setAttribute("Text", HTMLEncode(currObj.options[currObj.selectedIndex].text));
                } else {
                    xmlControl.setAttribute("Text", "");
                }
                xmlControl.setAttribute("SourceValue", currObj.getAttribute("SourceValue") || "");
                xmlControl.setAttribute("SourceText", currObj.getAttribute("SourceText") || "");
                break;
            }
        case "radio":
            {
                xmlControl.setAttribute("Value", currObj.getAttribute("Value"));
                xmlControl.setAttribute("Text", currObj.getAttribute("Text") || "");
                xmlControl.setAttribute("SourceValue", currObj.getAttribute("SourceValue") || "");
                xmlControl.setAttribute("SourceText", currObj.getAttribute("SourceText") || "");
                break;
            }
        case "checkboxlist":
            {
                xmlControl.setAttribute("Value", currObj.getAttribute("Value"));
                xmlControl.setAttribute("Text", currObj.getAttribute("Text"));
                xmlControl.setAttribute("SourceValue", currObj.getAttribute("SourceValue") || "");
                xmlControl.setAttribute("SourceText", currObj.getAttribute("SourceText"));
                break;
            }
        case "checkbox":
            {
                xmlControl.setAttribute("Value", currObj.getAttribute("Value"));
                xmlControl.setAttribute("SourceValue", currObj.getAttribute("SourceValue") || "");
                break;
            }
        case "countersign":
            {
                var xmlCountersignInfos = xmlBase.createElement("CountersignInfos");
                var xmlCountersignInfo = xmlBase.createElement("CountersignInfo");

                var textarea = currObj.getElementsByTagName("textarea");
                if (textarea[0]) {
                    var countersignInfoId = "";
                    if (textarea[0].getAttribute("DbId")) {
                        countersignInfoId = textarea[0].getAttribute("DbId");
                    }
                    if (parent && parent.document && parent.document.getElementById("EventStepId") && parent.document.getElementById("EventStepId").value) {
                        xmlCountersignInfo.setAttribute("StepId", parent.document.getElementById("EventStepId").value);
                        if (parent && parent.document && parent.document.getElementById("WorkFlowNodeName") && parent.document.getElementById("WorkFlowNodeName").value) {
                            xmlCountersignInfo.setAttribute("WorkFlowNodeName", parent.document.getElementById("WorkFlowNodeName").value);
                        }
                    }
                    else {
                        xmlCountersignInfo.setAttribute("StepId", "");
                    }

                    xmlCountersignInfo.setAttribute("DbId", countersignInfoId);
                    xmlCountersignInfo.setAttribute("value", textarea[0].value);
                }
                xmlCountersignInfos.appendChild(xmlCountersignInfo);
                xmlControl.appendChild(xmlCountersignInfos);
                break;
            }
    }

}

function AppendDiffNode(oForm) {
    var xmlDoc = createBaseXmlDoc();

    var xnForm = xmlDoc.createElement("Form");
    xmlform.setAttribute("DbId", oForm.DbId);
    xmlform.setAttribute("ClientId", oForm.ClientId);
    xmlform.setAttribute("Name", oForm.ChineseName);
    xnForm.setAttribute("UserId", document.getElementById("txtUserId").value);
    xnForm.setAttribute("UserName", document.getElementById("txtUserName").value);

    var xmlControls = xmlDoc.createElement("Controls");

    var Effobjs = fValidObjectFilter(oForm.ControlsXML);
    for (var i = 0; i < Effobjs.length; i++) {
        var currObj = Effobjs[i];

        var xmlControl = xmlDoc.createElement("Control");
        xmlControl.setAttribute("DbId", currObj.DbId);
        xmlControl.setAttribute("ClientId", currObj.ClientId);
        xmlControl.setAttribute("Type", currObj.Type);
        xmlControl.setAttribute("Name", currObj.Name);

        switch (currObj.ControlType) {
            case "password":
            case "text":
            case "textarea":
            case "editor":
            case "mydatetime":
            case "datetime":
                {
                    xmlControl.setAttribute("SourceValue", currObj.SourceValue);
                    xmlControl.setAttribute("Value", currObj.Value);
                    break;
                }
            case "countersign":
                {
                    break;
                }
            case "checkbox":
                {
                    break;
                }
            case "checkboxlist":
            case "combobox":
            case "radio":
                {
                    var tempDbDataSource = currObj.DbDataSource.replace(/'/g, "@");
                    xmlControl.setAttribute("DataSourceType", currObj.DataSourceType);
                    xmlControl.setAttribute("TextDataSource", currObj.TextDataSource);
                    xmlControl.setAttribute("DbValueColumn", currObj.DbValueColumn);
                    xmlControl.setAttribute("DbTextColumn", currObj.DbTextColumn);
                    xmlControl.setAttribute("DbDataSource", tempDbDataSource);

                    xmlControl.setAttribute("SourceValue", currObj.SourceValue);
                    xmlControl.setAttribute("SourceText", currObj.SourceText);
                    xmlControl.setAttribute("Value", currObj.Value);
                    xmlControl.setAttribute("Text", currObj.Text);

                    break;
                }
            case "upload":
                {
                    var xmlAttachments = xmlDoc.createElement("Attachments");
                    var oTable = currObj.children[0];
                    for (var k = 0; k < oTable.rows.length; k++) {
                        var oTr = oTable.rows[k];
                        if (oTr.TrType == 'Attachment') {
                            var xmlAttahment = xmlDoc.createElement("Attachment");
                            xmlAttachment.setAttribute("DbId", oTr.AttachId);
                            xmlAttachment.setAttribute("ServicePathName", oTr.AttachServerPath);
                            xmlAttachment.setAttribute("FileName", oTr.AttachName);
                            xmlAttachment.setAttribute("Extension", oTr.AttachExt);
                            xmlAttachments.appendChild(xmlAttachment);
                        }
                    }
                    xmlControl.appendChild(xmlAttachments);
                    xmlControls.appendChild(xmlControl);
                    break;
                }

            case "webgrid":
                {
                    break;
                }
        }
        xmlControls.appendChild(xmlControl);
    }

    xmlDoc.selectSingleNode("RAD/Doc/Data").appendChild(xmlForm);
    return xmlDoc;
}

function HTMLEncode(text) {
    if (text && typeof (text) != "string") {
        text = text.toString();
    }
    text = text.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/'/g, "@");
    return text;
}

function HTMLDecode(text) {
    if (text && typeof (text) != "string") {
        text = text.toString();
    }
    text = text.replace("&amp;", /&/g).replace("&quot;", /"/g).replace("&lt;", /</g).replace("&gt;", />/g).replace(/'/g, "@");
    return text;
}
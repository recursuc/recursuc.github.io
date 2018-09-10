function SortValidControlBySeq(oXmlFormNode) {
    var arrSortCont = [];
    var $xnControl = $(oXmlFormNode).find("Control[ValidSeq]"); //  oXmlFormNode.selectNodes(".//Control[@ValidSeq]");
    if ($xnControl.length > 0) {
        for (var i = 0; i < $xnControl.length; i++) {
            if ($xnControl[i].getAttribute("ControlStateType") === null || ($xnControl[i].getAttribute("ControlStateType") != null && ($xnControl[i].getAttribute("ControlStateType").toLowerCase() == "none" || $xnControl[i].getAttribute("ControlStateType").toLowerCase() == "write"))) { //只验证none和write状态下的控件
                var oContValidInfo = {};
                oContValidInfo["ClientId"] = $xnControl[i].getAttribute("ClientId");
                //  oContValidInfo["ControlStateType"] = oControls[i].getAttribute("ControlStateType") == null ? "" : oControls[i].getAttribute("ControlStateType");
                oContValidInfo["IsRequired"] = $xnControl[i].getAttribute("IsRequired") == null ? "false" : $xnControl[i].getAttribute("IsRequired");
                oContValidInfo["NoEmptyAlertMsg"] = $xnControl[i].getAttribute("NoEmptyAlertMsg") == null ? "" : $xnControl[i].getAttribute("NoEmptyAlertMsg");
                oContValidInfo["IsXMLSpecialChar"] = $xnControl[i].getAttribute("IsXMLSpecialChar") == null ? "false" : $xnControl[i].getAttribute("IsXMLSpecialChar");
                oContValidInfo["SpecialCharAlertMsg"] = $xnControl[i].getAttribute("SpecialCharAlertMsg") == null ? "" : $xnControl[i].getAttribute("SpecialCharAlertMsg");
                oContValidInfo["IsLengthValid"] = $xnControl[i].getAttribute("IsLengthValid") == null ? "false" : $xnControl[i].getAttribute("IsLengthValid");
                oContValidInfo["LengthValidInfo"] = $xnControl[i].getAttribute("LengthValidInfo") == null ? "false" : $xnControl[i].getAttribute("LengthValidInfo");
                oContValidInfo["CommitValidFucNames"] = $xnControl[i].getAttribute("CommitValidFucNames") == null ? "" : $xnControl[i].getAttribute("CommitValidFucNames");
                oContValidInfo["ValidSeq"] = $xnControl[i].getAttribute("ValidSeq");
                arrSortCont.push(oContValidInfo);
            }
        }

        for (var i = 0, len = arrSortCont.length; i < len - 1; i++) {
            var bHasOrder = true;
            for (var j = 0; j < len - 1 - i; j++) {
                if (parseInt(arrSortCont[j].ValidSeq) > parseInt(arrSortCont[j + 1].ValidSeq)) {
                    var temp = null;
                    temp = arrSortCont[j + 1];
                    arrSortCont[j + 1] = arrSortCont[j];
                    arrSortCont[j] = temp;
                    bHasOrder = false;
                }
            }
            if (bHasOrder) {
                break;
            }
        }
    }

    return arrSortCont;
}

function SetFocus(obj) {
    if (typeof obj != "undefined") {
        var oControl = obj,
            oTabContent = null, //oControl所在的TabContent DIV
            oTabControl = null, //oControl所在的TabControl DIV
            bIsInTab = false; // 判断控件是否在tab也中
        while (oControl && oControl.nodeName.toLowerCase() != "div" && oControl.id.toLowerCase() != "tabscontent") {
            if (oControl.getAttribute('ControlType ') && oControl.getAttribute('ControlType').toLowerCase() == "formcontainer"
            && oControl.getAttribute('FormId') == obj.getAttribute('FormDbId')) {
                oTabContent = oControl.parentNode; //保存oControl所在的TabContent DIV
                bIsInTab = true;
                break;
            }
            oControl = oControl.parentNode;
        }

        if (bIsInTab) {
            oTabControl = oControl.parentNode; //保存oControl所在的TabControl控件
            for (var i = 0; i < oTabContent.parentNode.childNodes.length; i++) {
                if (oTabContent.parentNode.childNodes[i] == oTabContent) {
                    //找到该tabcontent所在tascontent下的序号
                    if (oTabControl.firstChild.childNodes[3].value != i) {
                        //当前活动tabcontent不是本页
                        var oUl = oTabControl.firstChild.childNodes[1].firstChild.firstChild;
                        $(oUl.childNodes[i].childNodes[1].firstChild).trigger("click");
                    }
                    break;
                }
            }
        }

        obj.focus();
    }
}

function fAddControl(xmlControl, oLoadArea, oForm, strLoadType, Controls) {
    var strBaseAttribute = fGetBaseAttribute(xmlControl, oForm);

    //按控件类型拼装控件HTML
    var sbHtml = new $.StringBuilder();
    var controlType = xmlControl.getAttribute("Type");
    var stateType = "None";
    if (xmlControl.getAttribute("ControlStateType") && xmlControl.getAttribute("ControlStateType") != "") {
        stateType = xmlControl.getAttribute("ControlStateType");
    }

    var strEvent = fGetStrEvents(xmlControl, strLoadType, stateType);

    if (strLoadType == "print") {
        stateType = "View";
    }
    switch (controlType) {
        case "password":
            {
                var controlValue = xmlControl.getAttribute("Value");

                switch (stateType) {
                    case "None":
                    case "Write":
                        {
                            sbHtml.append('<input type="password" SourceValue ="' + controlValue + '"   value ="' + controlValue + '" ');
                            sbHtml.append(strBaseAttribute);
                            sbHtml.append(fGetSingeData(xmlControl));
                            sbHtml.append(strEvent);
                            sbHtml.append(fGetBaseValid(xmlControl));
                            sbHtml.append(fGetCommitValidInfo(xmlControl));
                            sbHtml.append(' ControlStateType="' + stateType + '" />');
                            break;
                        }
                    case "View":
                        {
                            sbHtml.append('<div ');
                            sbHtml.append(strBaseAttribute);
                            sbHtml.append(fGetSingeData(xmlControl));
                            sbHtml.append('" SourceValue ="' + controlValue + '"  value ="' + controlValue + '" ');
                            sbHtml.append(strEvent);
                            sbHtml.append(' ControlStateType="' + stateType + '">' + controlValue + '</div>');
                            break;
                        }
                    case "Hidden":
                        {
                            sbHtml.append('<input type="password" style="display:none;" value ="' + controlValue + '" ');
                            sbHtml.append(strBaseAttribute);
                            sbHtml.append(fGetSingeData(xmlControl));
                            sbHtml.append(strEvent);
                            sbHtml.append(' ControlStateType="' + stateType + '" />');
                            break;
                        }
                    case "ReadOnly":
                        {
                            sbHtml.append('<input type="password" readonly ');
                            sbHtml.append(strBaseAttribute);
                            sbHtml.append(fGetSingeData(xmlControl));
                            sbHtml.append('" SourceValue ="' + controlValue + '"  value ="' + controlValue + '" ');
                            sbHtml.append(strEvent);
                            sbHtml.append(' ControlStateType="' + stateType + '" />');
                            break;
                        }
                }
                break;
            }
        case "text":
            {
                var controlValue = xmlControl.getAttribute("Value");
                var controlDefaultValue = "", SystemVariablesReturnValue = "", srcValue = "";
                var SystemVariablesObj = xmlControl.getAttribute("SystemVariables");
                if (oForm.Datakey === "" || document.getElementById("txtOperSign").value === "1") {
                    controlDefaultValue = xmlControl.getAttribute("DefaultValue");
                    if (SystemVariablesObj && SystemVariablesObj.value != "") {
                        if (SystemVariablesObj == "CurrentTime") {
                            SystemVariablesReturnValue = controlValue = document.getElementById("txtCurrDate").value;
                        }
                        else if (SystemVariablesObj == "User") {
                            SystemVariablesReturnValue = controlValue = document.getElementById("txtUserId").value;
                        }
                        else if (SystemVariablesObj == "UserName") {
                            SystemVariablesReturnValue = controlValue = document.getElementById("txtUserName").value;
                        }
                        else if (SystemVariablesObj == "Department") {
                            SystemVariablesReturnValue = controlValue = document.getElementById("txtUnitId").value;
                        }
                        else if (SystemVariablesObj == "DepartmentName") {
                            SystemVariablesReturnValue = controlValue = document.getElementById("txtUnitName").value;
                        }
                    } else if (controlDefaultValue != "" && controlValue === "") {
                        controlValue = controlDefaultValue;
                    }
                    srcValue = controlValue; //记住控件值，以判断控件值是否被更改
                }
                else if (document.getElementById("txtOperSign").value === "2") {
                    if (SystemVariablesObj && SystemVariablesObj.value != "") {
                        switch (SystemVariablesObj.value) {
                            case "User":
                                {
                                    if (xmlControl.getAttribute("DisplayValue") == null || xmlControl.getAttribute("DisplayValue") == "") {
                                        controlValue = xmlControl.getAttribute("Value");
                                        SystemVariablesReturnValue = xmlControl.getAttribute("Value");
                                    } else {
                                        controlValue = xmlControl.getAttribute("DisplayValue"); // 显示用户名
                                        SystemVariablesReturnValue = xmlControl.getAttribute("Value");
                                    }
                                    srcValue = controlValue;
                                    break;
                                }
                            case "Department":
                                {
                                    break;
                                }
                        }
                    }
                }
                switch (stateType) {
                    case "None":
                    case "Write":
                        {
                            sbHtml.append("<input ");
                            sbHtml.append(strBaseAttribute);
                            sbHtml.append(fGetSingeData(xmlControl));
                            sbHtml.append(fGetCommitValidInfo(xmlControl));
                            sbHtml.append(' SourceValue ="' + controlValue + '" SrcValue = "' + srcValue + '" DefaultValue="' + controlDefaultValue + '" value ="' + controlValue + '"  ReturnValue = "' + SystemVariablesReturnValue + '" SystemVariables= "' + SystemVariablesObj.value + '" ');
                            sbHtml.append(strEvent);
                            sbHtml.append(fGetBaseValid(xmlControl));
                            sbHtml.append(' ControlStateType="' + stateType + '" />');
                            break;
                        }
                    case "View":
                        {
                            sbHtml.append('<div style="margin-top:4px;"');
                            sbHtml.append(strBaseAttribute);
                            sbHtml.append(fGetSingeData(xmlControl));
                            sbHtml.append(' SourceValue="' + controlValue + '"  DefaultValue="' + controlDefaultValue + '" value="' + controlValue + '"  ReturnValue = "' + SystemVariablesReturnValue + '" SystemVariables= "' + SystemVariablesObj + '"');
                            sbHtml.append(strEvent);
                            sbHtml.append(' ControlStateType="' + stateType + '" >' + controlValue + '</div>');
                            break;
                        }
                    case "Hidden":
                        {
                            sbHtml.append('<input style="display:none;" ');
                            sbHtml.append(strBaseAttribute);
                            sbHtml.append(fGetSingeData(xmlControl));
                            sbHtml.append(' DefaultValue="' + controlDefaultValue + '" value="' + controlValue + '"  ReturnValue="' + SystemVariablesReturnValue + '" SystemVariables= "' + SystemVariablesObj + '"');
                            sbHtml.append(strEvent);
                            sbHtml.append(' ControlStateType="' + stateType + '" />');
                            break;
                        }
                    case "ReadOnly":
                        {
                            sbHtml.append('<input readonly ');
                            sbHtml.append(strBaseAttribute);
                            sbHtml.append(fGetSingeData(xmlControl));
                            sbHtml.append(' SourceValue="' + controlValue + '" DefaultValue="' + controlDefaultValue + '" value="' + controlValue + '"  ReturnValue= "' + SystemVariablesReturnValue + '" SystemVariables= "' + SystemVariablesObj + '"');
                            sbHtml.append(strEvent);
                            sbHtml.append(' ControlStateType="' + stateType + '" />');
                            break;
                        }
                }
                break;
            }
        case "datetime":
            {
                var controlValue = xmlControl.getAttribute("Value");
                if (xmlControl.getAttribute("Format").toUpperCase() == "DATE") {
                    var arr = controlValue.split(" ");
                    controlValue = arr[0];
                }
                var controlDefaultValue = xmlControl.getAttribute("DefaultValue");
                if (controlDefaultValue != "" && (oForm.Datakey === "" || document.getElementById("txtOperSign").value === "1")) {
                    controlValue = controlDefaultValue;
                }

                switch (stateType) {
                    case "None":
                    case "Write":
                        {
                            sbHtml.append('<div ControlStateType="' + stateType + '" ');
                            sbHtml.append(strBaseAttribute);
                            sbHtml.append(fGetSingeData(xmlControl));
                            sbHtml.append(fGetCommitValidInfo(xmlControl));
                            sbHtml.append('Format= "' + xmlControl.getAttribute("Format") + '"  DefaultValue="' + controlDefaultValue + '" ><table border=0 cellPadding=0 cellSpacing=0  frame=box style=\'table-layout:fixed;BORDER-COLLAPSE: collapse;font-size:13px;Height:100%;width:100%;\'>');
                            sbHtml.append('<tr><td style="border-bottom:1px solid #90a5c2;" ><input type="text"  SourceValue ="' + controlValue + '" value ="' + controlValue + '" oncontextmenu="return false" style="width:100%; height:100%; " readonly id="' + xmlControl.getAttribute("DbId") + '_text" ');
                            sbHtml.append(strEvent);
                            sbHtml.append(' />');
                            sbHtml.append(' </td><td valign="middle" style=\'width:30px;\'><img unselectable="on" src="skins/blue/images/design_time.gif" style="width:18px; height:18px;cursor: hand;" ');
                            if (xmlControl.getAttribute("Format").toUpperCase() == "DATETIME") {
                                sbHtml.append('onclick=\'document.getElementById("VicPopCal").style.height=225;document.getElementById("theTime").checked=true;');
                            } else {
                                sbHtml.append(' onclick=\'document.getElementById("VicPopCal").style.height=200;');
                            }
                            sbHtml.append('m_intIsShowTime = 0;  m_intCalendarExcursionX = 0; m_intCalendarExcursionY = 0; fPopCalendar(document.getElementById("' + xmlControl.getAttribute("DbId") + '_text"),');
                            sbHtml.append(' document.getElementById("' + xmlControl.getAttribute("DbId") + '_text"),window.dialogArguments);\' alt="日期选择" /></td></tr></table>');
                            sbHtml.append('</div>');
                            break;
                        }
                    case "View":
                        {
                            sbHtml.append('<div ControlStateType="' + stateType + '" ');
                            sbHtml.append(strBaseAttribute);
                            sbHtml.append(fGetSingeData(xmlControl));
                            sbHtml.append(' Format= "' + xmlControl.getAttribute("Format") + '"  DefaultValue="' + controlDefaultValue + '" ><table border=0 cellPadding=0 cellSpacing=0  frame=box style=\'table-layout:fixed;BORDER-COLLAPSE: collapse;font-size:13px;Height:100%;width:100%;\'>');
                            sbHtml.append('<tr><td style=\'border-bottom:0px solid #90a5c2;\' >' + controlValue);
                            sbHtml.append(' </td><td valign="middle" style=\'width:30px;\'></td></tr></table>');
                            sbHtml.append('</div>');
                            break;
                        }
                    case "Hidden":
                        {
                            sbHtml.append('<div style="display:none;" ControlStateType="' + stateType + '" ');
                            sbHtml.append(strBaseAttribute);
                            sbHtml.append(fGetSingeData(xmlControl));
                            sbHtml.append('Format= "' + xmlControl.getAttribute("Format") + '"  DefaultValue="' + controlDefaultValue + '" ><table border=0 cellPadding=0 cellSpacing=0  frame=box style=\'table-layout:fixed;BORDER-COLLAPSE: collapse;font-size:13px;Height:100%;width:100%;\'>');
                            sbHtml.append('<tr><td style=\'border-bottom:1px solid #90a5c2;\' ><input type="text"  SourceValue ="' + controlValue + '" value ="' + controlValue + '" oncontextmenu="return false" style="width:100%; height:100%; " readonly id="' + xmlControl.getAttribute("DbId") + '_text"');
                            sbHtml.append(strEvent);
                            sbHtml.append(' />');
                            sbHtml.append(' </td><td valign="middle" style=\'width:30px;\'><img src="skins/blue/images/design_time.gif" style="width:18px; height:18px;cursor: hand;" ');
                            if (xmlControl.getAttribute("Format").toUpperCase() == "DATETIME") {
                                sbHtml.append('onclick=\'document.getElementById("VicPopCal").style.height=225;document.getElementById("theTime").checked=true;');
                            } else {
                                sbHtml.append(' onclick=\'document.getElementById("VicPopCal").style.height=200;');
                            }
                            sbHtml.append('m_intIsShowTime = 0;  m_intCalendarExcursionX = 0; m_intCalendarExcursionY = 0; fPopCalendar(document.getElementById("' + xmlControl.getAttribute("DbId") + '_text"),');
                            sbHtml.append(' document.getElementById("' + xmlControl.getAttribute("DbId") + '_text"),window.dialogArguments);\' alt="日期选择" /></td></tr></table>');
                            sbHtml.append('</div>');
                            break;
                        }
                    case "ReadOnly":
                        {
                            sbHtml.append('<div ControlStateType="' + stateType + '" ');
                            sbHtml.append(strBaseAttribute);
                            sbHtml.append(fGetSingeData(xmlControl));
                            sbHtml.append('Format= "' + xmlControl.getAttribute("Format") + '"  DefaultValue="' + controlDefaultValue + '" ><table border=0 cellPadding=0 cellSpacing=0  frame=box style=\'table-layout:fixed;BORDER-COLLAPSE: collapse;font-size:13px;Height:100%;width:100%;\'>');
                            sbHtml.append('<tr><td style=\'border-bottom:1px solid #90a5c2;\' ><input type="text"  SourceValue ="' + controlValue + '" value ="' + controlValue + '"  oncontextmenu="return false" style="width:100%; height:100%; " readonly id="' + xmlControl.getAttribute("DbId") + '_text"');
                            sbHtml.append(strEvent);
                            sbHtml.append(' />');
                            sbHtml.append(' </td><td valign="middle" style=\'width:30px;\'><img unselectable="on" src="skins/blue/images/design_time.gif" style="width:18px; height:18px;cursor: hand;" ');
                            sbHtml.append(' alt="日期选择" /></td></tr></table></div>');
                            break;
                        }
                }
                break;
            }
        case "mydatetime":
            {
                var controlValue = xmlControl.getAttribute("Value");
                if (xmlControl.getAttribute("Format").toUpperCase() == "DATE") {
                    var arr = controlValue.split(" ");
                    controlValue = arr[0];
                }
                var controlDefaultValue = xmlControl.getAttribute("DefaultValue");
                if (controlDefaultValue != "" && (oForm.Datakey === "" || document.getElementById("txtOperSign").value === "1")) {
                    controlValue = controlDefaultValue;
                }

                switch (stateType) {
                    case "None":
                    case "Write":
                        {
                            sbHtml.append('<input type="text" class="Wdate" ControlStateType="' + stateType + '" SourceValue ="' + controlValue + '" value ="' + controlValue + '" ');
                            sbHtml.append(strBaseAttribute);
                            sbHtml.append(fGetSingeData(xmlControl));
                            sbHtml.append(fGetCommitValidInfo(xmlControl));
                            sbHtml.append(' Format= "' + xmlControl.attributes.getNamedItem("Format").value + '"  DefaultValue="' + controlDefaultValue + '" ');
                            if (xmlControl.attributes.getNamedItem("Format").value.toUpperCase() == "DATETIME") {
                                sbHtml.append('onFocus="WdatePicker({isShowClear:true,readOnly:true,dateFmt:\'yyyy-MM-dd HH:mm:ss\'});document.body.focus();" ');
                            } else {
                                sbHtml.append('onFocus="WdatePicker({isShowClear:true,readOnly:true,dateFmt:\'yyyy-MM-dd\'});document.body.focus();" ');
                            }
                            sbHtml.append('/>');
                            break;
                        }
                    case "View":
                        {
                            sbHtml.append('<div style="font-size:13px;margin-top:5px;" ControlStateType="' + stateType + '" SourceValue ="' + controlValue + '" ');
                            sbHtml.append(strBaseAttribute);
                            sbHtml.append(fGetSingeData(xmlControl));
                            sbHtml.append(' Format= "' + xmlControl.attributes.getNamedItem("Format").value + '"  DefaultValue="' + controlDefaultValue + '" ');
                            sbHtml.append('>' + controlValue + '</div>');
                            break;
                        }
                    case "Hidden":
                        {
                            sbHtml.append('<input type="text" ControlStateType="' + stateType + '" style="display:none;" SourceValue ="' + controlValue + '" value ="' + controlValue + '" ');
                            sbHtml.append(strBaseAttribute);
                            sbHtml.append(fGetSingeData(xmlControl));
                            sbHtml.append(' Format= "' + xmlControl.attributes.getNamedItem("Format").value + '"  DefaultValue="' + controlDefaultValue + '" ');
                            sbHtml.append('/>');
                            break;
                        }
                    case "ReadOnly":
                        {
                            sbHtml.append('<input type="text" ControlStateType="' + stateType + '" disabled SourceValue ="' + controlValue + '" value ="' + controlValue + '" ');
                            sbHtml.append(strBaseAttribute);
                            sbHtml.append(fGetSingeData(xmlControl));
                            sbHtml.append(' Format= "' + xmlControl.attributes.getNamedItem("Format").value + '"  DefaultValue="' + controlDefaultValue + '" ');
                            sbHtml.append('/>');
                            break;
                        }
                }
                break;
            }
        case "textarea":
            {
                var controlValue = xmlControl.getAttribute("Value");
                var controlDefaultValue = xmlControl.getAttribute("DefaultValue");
                if (oForm.Datakey == "" || document.getElementById("txtOperSign").value === "1") {
                    //controlValue = controlDefaultValue;
                }

                switch (stateType) {
                    case "None":
                    case "Write":
                        {
                            sbHtml.append('<textarea ControlStateType="' + stateType + '" style="resize:none;" ');
                            sbHtml.append(strBaseAttribute);
                            sbHtml.append(fGetSingeData(xmlControl));
                            sbHtml.append('SourceValue ="' + controlValue + '"  DefaultValue="' + controlDefaultValue + '" ');
                            sbHtml.append(strEvent);
                            sbHtml.append(fGetBaseValid(xmlControl));
                            sbHtml.append(fGetCommitValidInfo(xmlControl));
                            sbHtml.append(' >' + controlValue + '</textarea>');
                            break;
                        }
                    case "View":
                        {
                            sbHtml.append('<div  ControlStateType="' + stateType + '" style="overflow:auto;" ');
                            sbHtml.append(strBaseAttribute);
                            sbHtml.append(fGetSingeData(xmlControl));
                            sbHtml.append('SourceValue ="' + controlValue + '"  DefaultValue="' + controlDefaultValue + '" ');
                            sbHtml.append(strEvent);
                            sbHtml.append('>' + controlValue.replace(/\n/ig, "<br/>").replace(/\s/ig, "&nbsp") + '</div>');
                            break;
                        }
                    case "Hidden":
                        {
                            sbHtml.append('<textarea style="display:none;" ControlStateType="' + stateType + '" ');
                            sbHtml.append(strBaseAttribute);
                            sbHtml.append(fGetSingeData(xmlControl));
                            sbHtml.append(' SourceValue ="' + controlValue + '"  DefaultValue="' + controlDefaultValue + '" ');
                            sbHtml.append(strEvent);
                            sbHtml.append('>' + controlValue + '</textarea>');
                            break;
                        }
                    case "ReadOnly":
                        {
                            sbHtml.append('<textarea readonly  ControlStateType="' + stateType + '" style="resize:none;" ');
                            sbHtml.append(strBaseAttribute);
                            sbHtml.append(fGetSingeData(xmlControl));
                            sbHtml.append(' SourceValue ="' + controlValue + '"  DefaultValue="' + controlDefaultValue + '" ');
                            sbHtml.append(strEvent);
                            sbHtml.append(' >' + controlValue + '</textarea>');
                            break;
                        }
                }
                break;
            }
        case "editor":
            {
                var controlValue = xmlControl.getAttribute("Value");
                var currId = xmlControl.getAttribute("ClientId");
                var controlDefaultValue = xmlControl.getAttribute("DefaultValue");

                switch (stateType) {
                    case "None":
                        {
                            sbHtml.append("<iframe ControlStateType='" + stateType + "' scrolling='no' marginheight='0' marginwidth='0' frameborder='0'");
                            sbHtml.append(strBaseAttribute);
                            sbHtml.append(fGetSingeData(xmlControl));
                            sbHtml.append('DefaultValue="' + controlDefaultValue + '"');
                            //sbHtml.append(strEvent);
                            sbHtml.append(fGetBaseValid(xmlControl));
                            sbHtml.append(fGetCommitValidInfo(xmlControl));
                            sbHtml.append('src="../FormSystem/form/f_editor.htm" onload="document.getElementById(\'' + currId + '\').contentWindow.HtmlEditor.document.body.innerHTML = unescape(\'' + controlValue + '\');' + strEvent.strEvents + '"></iframe>');
                            break;
                        }
                    case "ReadOnly":
                        {
                            sbHtml.append('<DIV ');
                            sbHtml.append(strBaseAttribute);
                            sbHtml.append(fGetSingeData(xmlControl));
                            sbHtml.append('DefaultValue="' + controlDefaultValue + '" ');
                            sbHtml.append(fGetBaseValid(xmlControl));
                            sbHtml.append(fGetCommitValidInfo(xmlControl));
                            sbHtml.append(">" + unescape(controlValue) + "</div>");
                            break;
                        }
                }
                break;
            }
        case "combobox":
            {
                var controlValue = xmlControl.getAttribute("Value");

                switch (stateType) {
                    case "None":
                    case "Write":
                        {
                            sbHtml.append('<select ControlStateType="' + stateType + '" ');
                            sbHtml.append(strBaseAttribute);
                            sbHtml.append(fGetBothData(xmlControl));
                            sbHtml.append(' SourceValue ="' + controlValue + '" CurValue="' + controlValue + '" ');
                            sbHtml.append(strEvent);
                            sbHtml.append(fGetBaseValid(xmlControl));
                            sbHtml.append(fGetCommitValidInfo(xmlControl));
                            sbHtml.append(' ></select>');
                            break;
                        }
                    case "View":
                        {
                            sbHtml.append('<select ControlStateType="' + stateType + '" ');
                            sbHtml.append(strBaseAttribute);
                            sbHtml.append(fGetBothData(xmlControl));
                            sbHtml.append(' SourceValue ="' + controlValue + '" CurValue="' + controlValue + '" disabled ');
                            sbHtml.append(strEvent);
                            sbHtml.append(' ></select>');
                            break;
                        }
                    case "Hidden":
                        {
                            sbHtml.append('<select style="display:none;" ControlStateType="' + stateType + '" ');
                            sbHtml.append(strBaseAttribute);
                            sbHtml.append(fGetBothData(xmlControl));
                            sbHtml.append(' SourceValue ="' + controlValue + '" CurValue="' + controlValue + '" ');
                            sbHtml.append(strEvent);
                            sbHtml.append('></select>');
                            break;
                        }
                    case "ReadOnly":
                        {
                            sbHtml.append('<select ControlStateType="' + stateType + '" ');
                            sbHtml.append(strBaseAttribute);
                            sbHtml.append(fGetBothData(xmlControl));
                            sbHtml.append(' SourceValue ="' + controlValue + '" CurValue="' + controlValue + '" oldSelectedIndex onchange="this.selectedIndex = this.oldSelectedIndex" ');
                            sbHtml.append(strEvent);
                            sbHtml.append(' ></select>');
                            break;
                        }
                }
                break;
            }
        case "radio":
            {
                var controlName = xmlControl.getAttribute("Name");
                var controlDefaultValue = xmlControl.getAttribute("DefaultValue");
                switch (stateType) {
                    case "None":
                    case "Write":
                        {
                            sbHtml.append('<fieldset aspect="' + xmlControl.getAttribute("Aspect") + '" ControlStateType="' + stateType + '" ');
                            sbHtml.append(strBaseAttribute);
                            sbHtml.append(fGetBothData(xmlControl));
                            sbHtml.append(' SourceValue ="' + xmlControl.getAttribute("Value") + '"  Value="' + xmlControl.getAttribute("Value") + '"  DefaultValue="' + controlDefaultValue + '" ');
                            sbHtml.append(' SourceText ="' + xmlControl.getAttribute("Text") + '" Text="' + xmlControl.getAttribute("Text") + '"  DefaultValue="' + controlDefaultValue + '" ');
                            sbHtml.append(strEvent);
                            sbHtml.append(' ></fieldset>');
                            break;
                        }
                    case "Hidden":
                        {
                            sbHtml.append('<fieldset style="display:none;" aspect="' + xmlControl.getAttribute("Aspect") + '" ControlStateType="' + stateType + '" ');
                            sbHtml.append(strBaseAttribute);
                            sbHtml.append(fGetBothData(xmlControl));
                            sbHtml.append(' SourceValue ="' + xmlControl.getAttribute("Value") + '"  Value="' + xmlControl.getAttribute("Value") + '"  DefaultValue="' + controlDefaultValue + '" ');

                            sbHtml.append(strEvent);
                            sbHtml.append('></fieldset>');
                            break;
                        }
                    case "ReadOnly":
                        {
                            sbHtml.append('<fieldset aspect="' + xmlControl.getAttribute("Aspect") + '" disabled ControlStateType="' + stateType + '" ');
                            sbHtml.append(strBaseAttribute);
                            sbHtml.append(fGetBothData(xmlControl));
                            sbHtml.append(' SourceValue ="' + xmlControl.getAttribute("Value") + '" Value="' + xmlControl.getAttribute("Value") + '"  DefaultValue="' + controlDefaultValue + '" ');
                            sbHtml.append(strEvent);
                            sbHtml.append(' ></fieldset>');
                            break;
                        }
                }
                break;
            }
        case "checkboxlist":
            {
                var controlName = xmlControl.getAttribute("Name");
                var controlDefaultValue = xmlControl.getAttribute("DefaultValue");
                switch (stateType) {
                    case "None":
                    case "Write":
                        {
                            sbHtml.append('<fieldset aspect="' + xmlControl.getAttribute("Aspect") + '" ControlStateType="' + stateType + '" ');
                            sbHtml.append(strBaseAttribute);
                            sbHtml.append(fGetBothData(xmlControl));
                            sbHtml.append(' SourceValue ="' + xmlControl.getAttribute("Value") + '"  Value="' + xmlControl.getAttribute("Value") + '"');
                            sbHtml.append(' SourceText ="' + xmlControl.getAttribute("Text") + '" Text="' + xmlControl.getAttribute("Text") + '"  DefaultValue="' + controlDefaultValue + '" ');
                            sbHtml.append(strEvent);
                            sbHtml.append(' ></fieldset>');
                            break;
                        }
                    case "Hidden":
                        {
                            sbHtml.append('<fieldset style="display:none;" aspect="' + xmlControl.getAttribute("Aspect") + '" ControlStateType="' + stateType + '" ');
                            sbHtml.append(strBaseAttribute);
                            sbHtml.append(fGetBothData(xmlControl));
                            sbHtml.append(' SourceValue ="' + xmlControl.attributes.getNamedItem("Value").value + '" DefaultValue="' + controlDefaultValue + '" ');
                            sbHtml.append(' Value="' + xmlControl.attributes.getNamedItem("Value").value + '"  Text="' + xmlControl.attributes.getNamedItem("Text").value + '" ');
                            sbHtml.append(strEvent);
                            sbHtml.append('></fieldset>');
                            break;
                        }
                    case "ReadOnly":
                        {
                            sbHtml.append('<fieldset aspect="' + xmlControl.getAttribute("Aspect") + '" disabled ControlStateType="' + stateType + '" ');
                            sbHtml.append(strBaseAttribute);
                            sbHtml.append(fGetBothData(xmlControl));
                            sbHtml.append(' SourceValue ="' + xmlControl.attributes.getNamedItem("Value").value + '" DefaultValue="' + controlDefaultValue + '" ');
                            sbHtml.append(' Value="' + xmlControl.attributes.getNamedItem("Value").value + '"  Text="' + xmlControl.attributes.getNamedItem("Text").value + '" ');
                            sbHtml.append(strEvent);
                            sbHtml.append(' ></fieldset>');
                            break;
                        }
                }
                break;
            }
        case "checkbox":
            {
                var sValue = xmlControl.getAttribute("Value") == null ? "" : xmlControl.getAttribute("Value");
                var sChecked = "";
                if (sValue == "") {
                    var sIsDefaultCheck = xmlControl.getAttribute("IsDefaultCheck") == null ? "" : xmlControl.getAttribute("IsDefaultCheck");
                    sChecked = sIsDefaultCheck == "1" ? "checked ='checked'" : "";
                }
                else {
                    sChecked = sValue == "1" ? "checked ='checked'" : "";
                }

                switch (stateType) {
                    case "None":
                    case "Write":
                        {
                            sbHtml.append('<div nowrap ControlStateType="' + stateType + '" ');
                            sbHtml.append(strBaseAttribute);
                            sbHtml.append(fGetSingeData(xmlControl));
                            sbHtml.append(' DefaultValue ="' + xmlControl.getAttribute("DefaultValue") + '" ');
                            sbHtml.append(' SourceValue ="' + sValue + '"  Value="' + sValue + '" truevalue="' + xmlControl.getAttribute("TrueValue") + '" falsevalue="' + xmlControl.getAttribute("FalseValue") + '" ');
                            sbHtml.append(strEvent);
                            sbHtml.append(' ><input type="checkbox" ' + sChecked + '  onclick="if(this.checked) {this.parentNode.Value = this.parentNode.truevalue;}else{ this.parentNode.Value = this.parentNode.falsevalue;}" ><span>' + xmlControl.getAttribute("Name") + '</span></div>');
                            break;
                        }
                    case "View":
                        {
                            sbHtml.append('<div nowrap ControlStateType="' + stateType + '" ');
                            sbHtml.append(strBaseAttribute);
                            sbHtml.append(fGetSingeData(xmlControl));
                            sbHtml.append(' SourceValue ="' + sValue + '" Value="' + sValue + '"  truevalue="' + xmlControl.getAttribute("TrueValue") + '" falsevalue="' + xmlControl.getAttribute("FalseValue") + '" ');
                            sbHtml.append(strEvent);
                            sbHtml.append(' onclick="return false;" ><input type="checkbox"  ' + sChecked + ' ><span>' + xmlControl.getAttribute("Name") + '</span></div>');
                            break;
                        }
                    case "Hidden":
                        {
                            sbHtml.append('<div nowrap style="display:none;" ControlStateType="' + stateType + '" ');
                            sbHtml.append(strBaseAttribute);
                            sbHtml.append(fGetSingeData(xmlControl));
                            sbHtml.append(' SourceValue ="' + sValue + '"  Value="' + sValue + '" truevalue="' + xmlControl.getAttribute("TrueValue") + '" falsevalue="' + xmlControl.getAttribute("FalseValue") + '" ');
                            sbHtml.append(strEvent);
                            sbHtml.append(' ><input type="checkbox"  ' + sChecked + ' ><span>' + xmlControl.getAttribute("Name") + '</span></div>');
                            break;
                        }
                    case "ReadOnly":
                        {
                            sbHtml.append('<div nowrap ControlStateType="' + stateType + '" ');
                            sbHtml.append(strBaseAttribute);
                            sbHtml.append(fGetSingeData(xmlControl));
                            sbHtml.append(' SourceValue ="' + sValue + '"  Value="' + sValue + '" truevalue="' + xmlControl.getAttribute("TrueValue") + '" falsevalue="' + xmlControl.getAttribute("FalseValue") + '" ');
                            sbHtml.append(strEvent);
                            sbHtml.append('><input type="checkbox"  ' + sChecked + ' onclick="return false"  ><span>' + xmlControl.getAttribute("Name") + '</span></div>');
                            break;
                        }
                }
                break;
            }
        case "img":
            {
                switch (stateType) {
                    case "None":
                    case "Write":
                    case "View":
                        {
                            sbHtml.append('<img ControlStateType="' + stateType + '" ');
                            sbHtml.append(strBaseAttribute);
                            sbHtml.append(strEvent);
                            sbHtml.append(' src ="' + xmlControl.getAttribute("Src") + '" alt ="' + xmlControl.getAttribute("Alt") + '" ');
                            sbHtml.append('/ >');
                            break;

                        }
                    case "Hidden":
                        {
                            sbHtml.append('<img style="display:none;"  ControlStateType="' + stateType + '" ');
                            sbHtml.append(strBaseAttribute);
                            sbHtml.append(strEvent);
                            sbHtml.append(' src ="' + xmlControl.getAttribute("Src") + '" alt ="' + xmlControl.getAttribute("Alt") + '" ');
                            sbHtml.append('/ >');
                            break;
                        }
                }
                break;
            }
        case "upload":
            {
                var isPic = "0";
                var picSize = "";
                if (xmlControl.getAttribute("IsPic")) {
                    isPic = xmlControl.getAttribute("IsPic")
                }
                if (xmlControl.getAttribute("PicSize")) {
                    picSize = xmlControl.getAttribute("PicSize")
                }
                switch (stateType) {
                    case "None":
                    case "Write":
                        {
                            sbHtml.append('<div nowrap ControlStateType="' + stateType + '" ');
                            sbHtml.append(strBaseAttribute);
                            sbHtml.append(fGetSingeData(xmlControl));
                            sbHtml.append("' PathClass='" + xmlControl.getAttribute("PathClass"));
                            sbHtml.append("' FilePath='" + xmlControl.getAttribute("FilePath") + "' FileExt='" + xmlControl.getAttribute("FileExt"));
                            sbHtml.append("' FileCountLimit='" + xmlControl.getAttribute("FileCountLimit") + "' FileCurrCount='" + xmlControl.getAttribute("FileCurrCount"));
                            sbHtml.append("' DeleteFileNames=''  DeleteFilesId='' FileNameLength='" + xmlControl.getAttribute("FileNameLength"));
                            sbHtml.append("' SaveMode='" + xmlControl.getAttribute("SaveMode") + "' AttachTable='" + xmlControl.getAttribute("AttachTable") + "' ");
                            sbHtml.append("' IsPic='" + isPic + "' PicSize='" + picSize + "' align='left'>");
                            sbHtml.append("&nbsp;&nbsp;<input type='button' value='增加附件'");
                            sbHtml.append(" onclick='AddUploadFile(" + xmlControl.getAttribute("ClientId") + ");'/>");
                            sbHtml.append("<div onmouseover='ShowAllFiles(" + xmlControl.getAttribute("ClientId") + ")' onmouseout='HiddenFileDiv()' border='0'><table border=1 cellPadding=0 cellSpacing=0  frame=box style='table-layout:fixed;BORDER-COLLAPSE: collapse;font-size:13px;'></table></div></div>");

                            break;
                        }
                    case "View":
                        {
                            sbHtml.append('<div nowrap ControlStateType="' + stateType + '" ');
                            sbHtml.append(strBaseAttribute);
                            sbHtml.append(fGetSingeData(xmlControl));
                            sbHtml.append("' FilePath='" + xmlControl.getAttribute("FilePath") + "' FileExt='" + xmlControl.getAttribute("FileExt"));
                            sbHtml.append("' FileCountLimit='" + xmlControl.getAttribute("FileCountLimit") + "' FileCurrCount='" + xmlControl.getAttribute("FileCurrCount"));
                            sbHtml.append("' DeleteFilesId='' FileNameLength='" + xmlControl.getAttribute("FileNameLength"));
                            sbHtml.append("' SaveMode='" + xmlControl.getAttribute("SaveMode") + "' AttachTable='" + xmlControl.getAttribute("AttachTable") + "' ");
                            sbHtml.append("' IsPic='" + isPic + "' PicSize='" + picSize + "' >");
                            sbHtml.append("<table border=0 cellPadding=0 cellSpacing=0  frame=box style='table-layout:fixed;BORDER-COLLAPSE: collapse;font-size:13px;'>");
                            sbHtml.append("<tr><td style='border-bottom:1px solid #90a5c2;' width='100%'>&nbsp;&nbsp;");
                            sbHtml.append("</td></tr></table></div>");

                            break;
                        }
                    case "Hidden":
                        {
                            sbHtml.append('<div nowrap style="display:none;" ControlStateType="' + stateType + '" ');
                            sbHtml.append(strBaseAttribute);
                            sbHtml.append(fGetSingeData(xmlControl));
                            sbHtml.append("' FilePath='" + xmlControl.getAttribute("FilePath") + "' FileExt='" + xmlControl.getAttribute("FileExt"));
                            sbHtml.append("' FileCountLimit='" + xmlControl.getAttribute("FileCountLimit") + "' FileCurrCount='" + xmlControl.getAttribute("FileCurrCount"));
                            sbHtml.append("' DeleteFilesId='' FileNameLength='" + xmlControl.getAttribute("FileNameLength"));
                            sbHtml.append("' SaveMode='" + xmlControl.getAttribute("SaveMode") + "' AttachTable='" + xmlControl.getAttribute("AttachTable") + "' ");
                            sbHtml.append("' IsPic='" + isPic + "' PicSize='" + picSize + "' >");
                            sbHtml.append("<table border=0 cellPadding=0 cellSpacing=0  frame=box style='table-layout:fixed;BORDER-COLLAPSE: collapse;font-size:13px;'>");
                            sbHtml.append("<tr height=24><td style='border-bottom:1px solid #90a5c2;' width='80%'>&nbsp;&nbsp;<input type='button' value='增加附件'");
                            sbHtml.append(" onclick='AddUploadFile(" + xmlControl.getAttribute("ClientId") + ");'/></td><td style='border-bottom:1px solid #90a5c2;' width='20%'></td></tr></table></div>");

                            break;
                        }
                    case "ReadOnly":
                        {
                            sbHtml.append('<div nowrap ControlStateType="' + stateType + '" ');
                            sbHtml.append(strBaseAttribute);
                            sbHtml.append(fGetSingeData(xmlControl));
                            sbHtml.append("' FilePath='" + xmlControl.getAttribute("FilePath") + "' FileExt='" + xmlControl.getAttribute("FileExt"));
                            sbHtml.append("' FileCountLimit='" + xmlControl.getAttribute("FileCountLimit") + "' FileCurrCount='" + xmlControl.getAttribute("FileCurrCount"));
                            sbHtml.append("' DeleteFilesId='' FileNameLength='" + xmlControl.getAttribute("FileNameLength"));
                            sbHtml.append("' SaveMode='" + xmlControl.getAttribute("SaveMode") + "' AttachTable='" + xmlControl.getAttribute("AttachTable") + "' ");
                            sbHtml.append("' IsPic='" + isPic + "' PicSize='" + picSize + "' >");
                            sbHtml.append("<table border=0 cellPadding=0 cellSpacing=0  frame=box style='table-layout:fixed;BORDER-COLLAPSE: collapse;font-size:13px;'>");
                            sbHtml.append("<tr><td style='border-bottom:1px solid #90a5c2;' width='100%'>&nbsp;&nbsp;");
                            sbHtml.append("</td></tr></table></div>");

                            break;
                        }
                }
                break;
            }
        case "countersign":
            {
                var areaMin = xmlControl.getAttribute("AreaMin") == undefined ? "" : xmlControl.getAttribute("AreaMin");
                switch (stateType) {
                    case "None":
                    case "Write":
                        {
                            sbHtml.append('<div nowrap class="countersign" areaMin="' + areaMin + '" ControlStateType="' + stateType + '" ');
                            sbHtml.append(strBaseAttribute);
                            sbHtml.append(fGetBaseValid(xmlControl));
                            sbHtml.append(fGetCommitValidInfo(xmlControl));
                            sbHtml.append(fGetSingeData(xmlControl));
                            sbHtml.append("><table border=0 cellPadding=0 cellSpacing=0  frame=box style='table-layout:fixed;BORDER-COLLAPSE: collapse;font-size:13px;Height:100%;width:100%;'>");
                            sbHtml.append("<tr><td style='border-bottom:1px solid #90a5c2;' ><textarea style='Height:100%;width:100%;' DBId='' id='" + xmlControl.getAttribute("ClientId"));
                            sbHtml.append("_textarea'" + strEvent + "></textarea></td><td valign=\"center\" style='width:50px;'><img src='Skins/Blue/Images/words.jpg' onclick=\"fShowDiv('wordDiv_" + xmlControl.getAttribute("ClientId") + "');\" /></td></tr></table>");
                            sbHtml.append("<table border=1 cellPadding=0 cellSpacing=0  frame=box style='table-layout:fixed;BORDER-COLLAPSE: collapse;font-size:13px;width:100%;'></table></div>");

                            break;
                        }
                    case "View":
                        {
                            sbHtml.append('<div nowrap class="countersign" areaMin="' + areaMin + '" ControlStateType="' + stateType + '" ');
                            sbHtml.append(strBaseAttribute);
                            sbHtml.append(fGetSingeData(xmlControl));
                            sbHtml.append(">");
                            sbHtml.append("<table border=0 cellPadding=0 cellSpacing=0  frame=box style='table-layout:fixed;BORDER-COLLAPSE: collapse;font-size:13px;Height:100%;width:100%;display:none;'>");
                            sbHtml.append("<tr><td style='border-bottom:1px solid #90a5c2;' ><textarea style='Height:100%;width:100%;' DBId='' id='" + xmlControl.getAttribute("ClientId"));
                            sbHtml.append("_textarea' ></textarea></td><td valign=\"center\" style='width:50px;'><img src='Skins/Blue/Images/words.jpg' onclick=\"fShowDiv('wordDiv_" + xmlControl.getAttribute("ClientId") + "');\" /></td></tr></table>");
                            sbHtml.append("<table border=1 cellPadding=0 cellSpacing=0  frame=box style='table-layout:fixed;BORDER-COLLAPSE: collapse;font-size:13px;width:100%;'></table></div>");

                            break;
                        }
                    case "Hidden":
                        {
                            sbHtml.append('<div nowrap style="display:none;" areaMin="' + areaMin + '" ControlStateType="' + stateType + '" ');
                            sbHtml.append(strBaseAttribute);
                            sbHtml.append(fGetSingeData(xmlControl));
                            sbHtml.append("><table border=0 cellPadding=0 cellSpacing=0  frame=box style='table-layout:fixed;BORDER-COLLAPSE: collapse;font-size:13px;Height:100%;width:100%;'>");
                            sbHtml.append("<tr><td style='border-bottom:1px solid #90a5c2;' ><textarea style='Height:100%;width:100%;' DBId='' id='" + xmlControl.getAttribute("ClientId"));
                            sbHtml.append("_textarea' ></textarea></td><td valign=\"center\" style='width:50px;'><img src='Skins/Blue/Images/words.jpg' onclick=\"fShowDiv('wordDiv_" + xmlControl.getAttribute("ClientId") + "');\" /></td></tr></table>");
                            sbHtml.append("<table border=1 cellPadding=0 cellSpacing=0  frame=box style='table-layout:fixed;BORDER-COLLAPSE: collapse;font-size:13px;width:100%;'></table></div>");

                            break;
                        }
                    case "ReadOnly":
                        {
                            sbHtml.append('<div nowrap class="countersign" areaMin="' + areaMin + '" ControlStateType="' + stateType + '" ');
                            sbHtml.append(strBaseAttribute);
                            sbHtml.append(fGetSingeData(xmlControl));
                            sbHtml.append("><table border=0 cellPadding=0 cellSpacing=0  frame=box style='table-layout:fixed;BORDER-COLLAPSE: collapse;font-size:13px;Height:100%;width:100%;'>");
                            sbHtml.append("<tr><td style='border-bottom:1px solid #90a5c2;' ><textarea style='Height:100%;width:100%;' DBId='' id='" + xmlControl.getAttribute("ClientId"));
                            sbHtml.append("_textarea' ></textarea></td><td valign=\"center\" style='width:50px;'><img src='Skins/Blue/Images/words.jpg' onclick=\"fShowDiv('wordDiv_" + xmlControl.getAttribute("ClientId") + "');\" /></td></tr></table>");
                            sbHtml.append("<table border=1 cellPadding=0 cellSpacing=0  frame=box style='table-layout:fixed;BORDER-COLLAPSE: collapse;font-size:13px;width:100%;'></table></div>");

                            break;
                        }
                }
                break;
            }
        case "label":
            {
                switch (stateType) {
                    case "View":
                    case "None":
                        {
                            sbHtml.append('<label ControlStateType="' + stateType + '" ');
                            sbHtml.append(strBaseAttribute);
                            sbHtml.append(' >' + xmlControl.getAttribute("Name") + '</label>');
                            break;
                        }
                    case "Hidden":
                        {
                            sbHtml.append('<label style="display:none;" ControlStateType="' + stateType + '" ');
                            sbHtml.append(strBaseAttribute);
                            sbHtml.append(' >' + xmlControl.getAttribute("Name") + '</label>');
                            break;
                        }
                }
                break;
            }
        case "div":
            {
                switch (stateType) {
                    case "None":
                        {
                            sbHtml.append('<div ControlStateType="' + stateType + '"');
                            sbHtml.append(strBaseAttribute);
                            sbHtml.append(fGetSingeData(xmlControl));
                            sbHtml.append(' fieldvalue="' + unescape(xmlControl.getAttribute("FieldValue")));
                            sbHtml.append('" ></div>');
                            break;
                        }
                    case "Hidden":
                        {
                            sbHtml.append('<div style="display:none;" ControlStateType="' + stateType + '" ');
                            sbHtml.append(strBaseAttribute);
                            sbHtml.append(fGetSingeData(xmlControl));
                            sbHtml.append(' fieldvalue="' + unescape(xmlControl.getAttribute("FieldValue")));
                            sbHtml.append('"></div>');
                            break;
                        }
                }
                break;
            }
        case "a":
            {
                switch (stateType) {
                    case "None":
                        {
                            sbHtml.append('<a ControlStateType="' + stateType + '" ');
                            sbHtml.append(strBaseAttribute);
                            sbHtml.append("  href='" + xmlControl.getAttribute("Href") + "' target='" + xmlControl.getAttribute("Target") + "'");
                            sbHtml.append(' >' + xmlControl.getAttribute("Name") + '</a>');
                            break;
                        }
                    case "Hidden":
                        {
                            sbHtml.append('<a style="display:none;" ControlStateType="' + stateType + '" ');
                            sbHtml.append(strBaseAttribute);
                            sbHtml.append("  href='" + xmlControl.getAttribute("Href") + "' target='" + xmlControl.getAttribute("Target") + "'");
                            sbHtml.append('>' + xmlControl.getAttribute("Name") + '</a>');
                            break;
                        }
                }
                break;
            }
        case "iframe":
            {
                switch (stateType) {
                    case "None":
                        {
                            sbHtml.append('<iframe ControlStateType="' + stateType + '" ');
                            sbHtml.append(strBaseAttribute);
                            sbHtml.append(strEvent);
                            sbHtml.append(' longdesc="' + xmlControl.getAttribute("LongDesc"));
                            sbHtml.append('" src="' + xmlControl.getAttribute("Src") + '" frameborder="' + xmlControl.getAttribute("FrameBorder") + '" scrolling="' + xmlControl.getAttribute("Scrolling") + '" ></iframe>');
                            break;
                        }
                    case "Hidden":
                        {
                            sbHtml.append('<iframe style="display:none;" ControlStateType="' + stateType + '" ');
                            sbHtml.append(strBaseAttribute);
                            sbHtml.append(strEvent);
                            sbHtml.append(' longdesc="' + xmlControl.getAttribute("LongDesc"));
                            sbHtml.append('" src="' + xmlControl.getAttribute("Src") + '" frameborder="' + xmlControl.getAttribute("FrameBorder") + '" scrolling="' + xmlControl.getAttribute("Scrolling") + '" ></iframe>');
                            break;
                        }
                }
                break;
            }
        case "button":
            {
                switch (stateType) {
                    case "None":
                        {
                            sbHtml.append('<button ControlStateType="' + stateType + '" ');
                            sbHtml.append(strBaseAttribute);
                            sbHtml.append(strEvent);
                            sbHtml.append(' >' + xmlControl.getAttribute("Name") + '</button>');
                            break;
                        }
                    case "View":
                        {
                            sbHtml.append('<button ControlStateType="' + stateType + '" ');
                            sbHtml.append(strBaseAttribute);
                            sbHtml.append('>' + xmlControl.getAttribute("Name") + '</button>');
                            break;
                        }
                    case "Hidden":
                        {
                            sbHtml.append('<button style="display:none;" ControlStateType="' + stateType + '" ');
                            sbHtml.append(strBaseAttribute);
                            sbHtml.append(strEvent);
                            sbHtml.append('>' + xmlControl.getAttribute("Name") + '</button>');
                            break;
                        }
                }
                break;
            }
        case "webgrid":
            {
                switch (stateType) {
                    case "None":
                        {
                            sbHtml.append('<DIV ControlStateType="' + stateType + '" ');
                            sbHtml.append(strBaseAttribute);
                            sbHtml.append(" SkinType='" + xmlControl.getAttribute("SkinType") + "' ");
                            sbHtml.append(" DelColumnsId='' DelRowsId='' ");
                            sbHtml.append(" ColumnsXml='" + xmlControl.selectSingleNode("GridColumns").xml.toString() + "' >");
                            sbHtml.append('</DIV>');
                            break;
                        }
                    case "ReadOnly":
                        {
                            var wbgridId = xmlControl.getAttribute("ClientId") == undefined ? "" : xmlControl.getAttribute("ClientId");
                            sbHtml.append('<DIV ControlStateType="' + stateType + '" ');
                            sbHtml.append(strBaseAttribute);
                            sbHtml.append(" SkinType='" + xmlControl.getAttribute("SkinType") + "' ");
                            sbHtml.append(" DelColumnsId='' DelRowsId='' ");
                            sbHtml.append(" ColumnsXml='" + xmlControl.selectSingleNode("GridColumns").xml.toString() + "' >");
                        }
                        sbHtml.append('</DIV>');
                }
                break;
            }
    }
    if (sbHtml.toString() != "") {
        var ClientId = xmlControl.getAttribute("ClientId");
        oForm.addIdNode(ClientId, controlType);

        //加载数据源
        if (controlType == 'combobox' || controlType == 'checkbox' || controlType == 'checkboxlist' || controlType == 'radio' || controlType == 'upload' || controlType == 'countersign' || controlType == 'webgrid') {
            oLoadArea.innerHTML += sbHtml.toString();
            fLoadCompositeControls(document.getElementById(ClientId), "", xmlControl, Controls);
        } else {
            oForm.sbGloblHtml.append(sbHtml.toString());
        }
    }
}

function setPassWordValue() {
    if (publicform.passWordInfo != "") {
        var arr = new Array();
        arr = publicform.passWordInfo.split(';');
        for (var i = 0; i < arr.length; i++) {
            if (arr[i] != "") {
                var arr2 = arr[i].split(',');
                document.getElementById(arr2[0]).value = arr2[1];
            }
        }
    }
}

var CascadeChilds = new Array();
//初始化webgird的方法
function InitWebGrid(controlXml) {
    var strHeader = "";
    var strInitWidths = "";
    var strColAlign = "";
    var strColTypes = "";
    var strColSorting = "";
    var strHeaderId = "";
    var mygrid = new dhtmlXGridObject(controlXml.getAttribute("ClientId"));
    mygrid.setImagePath("public_js/plugin/webgrid/imgs/");
    mygrid.setSkin(controlXml.getAttribute("SkinType"));


    var xnheaders = controlXml.getElementsByTagName("GridColumns");
    var xmlheaders = $.parseXML($(xnheaders[0]).xml());
    var headers = xmlheaders.getElementsByTagName("column");
    var data = controlXml.getElementsByTagName("rows")[0];

    for (var k = 0, m = headers.length; k < m; k++) {
        strHeader += headers[k].getAttribute("HeaderName") + ",";
        strInitWidths += headers[k].getAttribute("width") + ",";
        strColAlign += headers[k].getAttribute("align") + ",";
        strColTypes += headers[k].getAttribute("type") + ",";
        strColSorting += headers[k].getAttribute("sort") + ",";
        strHeaderId += headers[k].getAttribute("ClientId") + ",";
    }

    mygrid.setHeader(strHeader.substr(0, strHeader.length - 1));
    mygrid.setInitWidths(strInitWidths.substr(0, strInitWidths.length - 1));
    mygrid.setColAlign(strColAlign.substr(0, strColAlign.length - 1));
    if (strColTypes.length == 0) return;
    mygrid.setColTypes(strColTypes.substr(0, strColTypes.length - 1));
    mygrid.setColSorting(strColSorting.substr(0, strColSorting.length - 1));
    mygrid.setColumnIds(strHeaderId.substr(0, strHeaderId.length - 1));

    mygrid.init();

    for (var i = 0; i < headers.length; i++) {
        if (headers[i].getAttribute("type") == "coro") {
            if (headers[i].getAttribute("DataSourceType") == "DbDataSource") {
                if (headers[i].getAttribute("ParentColumn") && headers[i].getAttribute("ParentColumn") != "") {
                    var paramXML = '<Param ParamType="webgridComboOptionsCascade" DbDataSource="' + headers[i].getAttribute("DbDataSource")
                                + '" DbValueColumn="' + headers[i].getAttribute("DbValueColumn")
                                + '" DbTextColumn="' + headers[i].getAttribute("DbTextColumn")
                                + '" DbParentColumn="' + headers[i].getAttribute("DbParentColumn") + '" />';
                    var xdData = createBaseXmlDoc(paramXML);

                    var childCoro = new CascadeChild();
                    childCoro.cIndex = i;
                    childCoro.pIndex = mygrid.getColIndexById(headers[i].getAttribute("ParentColumn"));
                    $.ajax({
                        type: "POST",
                        url: "../../Config/GetAjaxInfo.aspx",
                        async: true,
                        data: xdData,
                        processData: false,
                        context: document.body,
                        dataType: "xml",
                        success: function (data, textStatus, jqXHR) {
                            childCoro.optionsXML = data;
                        }
                    });
                    oForm.arrWebgridObj[controlXml.getAttribute("ClientId")].optionsXML = childCoro.optionsXML;
                    CascadeChilds[headers[i].getAttribute("ClientId")] = childCoro;
                } else {
                    var paramXML = '<Param ParamType="webgridComboOptions" DbDataSource="' + headers[i].getAttribute("DbDataSource")
                                + '" DbValueColumn="' + headers[i].getAttribute("DbValueColumn")
                                + '" DbTextColumn="' + headers[i].getAttribute("DbTextColumn") + '" />',
                         xdData = createBaseXmlDoc(paramXML);

                    $.ajax({
                        type: "POST",
                        url: "../../Config/GetAjaxInfo.aspx",
                        async: true,
                        data: xdData,
                        processData: false,
                        context: document.body,
                        dataType: "xml",
                        success: function (data, textStatus, jqXHR) {
                            var xmlOptions = $(data).find("Data>webgridComboOptions").get(0);
                            for (var n = 0; n < xmlOptions.childNodes.length; n++) {
                                var xmlOption = xmlOptions.childNodes[n].attributes;
                                mygrid.getCombo(i).put(xmlOption.getNamedItem("value").value, xmlOption.getNamedItem("text").value);
                            }
                        }
                    });
                }
            } else if (headers[i].getAttribute("DataSourceType") == "TextDataSource") {
                var valueTexts = headers[i].getAttribute("TextDataSource").split(";");
                for (var j = 0; j < valueTexts.length; j++) {
                    var datas = valueTexts[j].split(",");
                    if (datas.length == 2) {
                        mygrid.getCombo(i).put(datas[1], datas[0]);
                    }
                }
            }
        }
    }

    if (data) {
        mygrid.parse(data.xml.toString());
        for (var m = 0, n = CascadeChilds.length; m < n; m++) {
            var ids = mygrid.getAllRowIds(".").split(".");
            for (var k = 0, t = ids.length; k < t; k++) {
                var oldValue = mygrid.cells(ids[k], CascadeChilds[m].cIndex).getValue();
                var curCoro = mygrid.getCustomCombo(ids[k], CascadeChilds[m].cIndex);
                curCoro.clear();
                var $xmlOptions = $(CascadeChilds[m].optionsXML).find("options[PId='" + mygrid.cells(ids[k], CascadeChilds[m].pIndex).getValue() + "']");
                var xmlOptions = $xmlOptions[0];
                for (var n = 0; n < xmlOptions.childNodes.length; n++) {
                    var xmlOption = xmlOptions.childNodes[n].attributes;
                    curCoro.put(xmlOption.getNamedItem("value").value, xmlOption.getNamedItem("text").value);
                }
            }
        }
    }
    oForm.oWebgridObj[controlXml.getAttribute("ClientId")].oDhtmlXGrid = mygrid;

    function CascadeChild() {
        this.cIndex = 0;
        this.pIndex = 0;
        this.optionsXML = null; //表单对象包含的控件集合
    }
}

function changeSource(cRowId, cCellInd, pValue, curGrid) {
    var chgCo = curGrid.gridObj.getCustomCombo(cRowId, cCellInd); //获取要修改的下拉列表控件对象

    var cOptionsXML = curGrid.optionsXML;
    var xmlOptions = $(cOptionsXML).find("options[PId='" + pValue + "']");
    var xmlOptions = $(cOptionsXML).find("options[PId='" + pValue + "']");
    curGrid.gridObj.cells(cRowId, cCellInd).cell.innerHTML = "";
    chgCo.clear(); //清除原有数据源
    if (xmlOptions != null) {
        for (var n = 0; n < xmlOptions.childNodes.length; n++) {
            var xmlOption = xmlOptions.childNodes[n].attributes;
            chgCo.put(xmlOption.getNamedItem("value").value, xmlOption.getNamedItem("text").value);
        }
    } else {
        chgCo.put("", "无选择项");
    }
}

function getControlXmlWithDataSource($xnForm) {
    var xdData = createBaseXmlDoc();
    var root = $(xdData).find("Doc>Data").get(0);
    var $xnControl = $xnForm.find("Controls>Control[DataSourceType ='DbDataSource']");
    if ($xnControl.length > 0) {
        $xnControl.each(function (index, xnControl) {
            if (xnControl.getAttribute("Type") == 'combobox' || xnControl.getAttribute("Type") == 'radio' || xnControl.getAttribute("Type") == 'checkboxlist') {
                var xnParam = xdData.createElement("Param");
                xnParam.setAttribute("ParamType", "GetDBSourceItems");

                var sDbDataSource = xnControl.getAttribute("DbDataSource").replace(/@/g, "'");
                var sConPId = xnControl.getAttribute("ParentControlClientId");
                if (sConPId != null && sConPId != "") {
                    var xnPControl = $xnForm.find("Controls>Control[Value][ClientId ='" + sConPId + "']")[0]; // xnForm.selectSingleNode("./Controls/Control[@ClientId = '" + xnDbDataSrcs[i].getAttribute("ParentControlClientId") + "' and @Value]"); //找级联的父控件
                    if (xnPControl !== null) {
                        if (xnPControl.getAttribute("Value") != "") {
                            sDbDataSource = sDbDataSource + "'" + xnPControl.getAttribute("Value") + "'";
                        } else {
                            sDbDataSource = sDbDataSource + " null ";
                        }
                    }
                }

                xnParam.setAttribute("ClientId", xnControl.getAttribute("ClientId"));
                xnParam.setAttribute("DataSource", sDbDataSource);
                xnParam.setAttribute("DbValueColumn", xnControl.getAttribute("DbValueColumn"));
                xnParam.setAttribute("DbTextColumn", xnControl.getAttribute("DbTextColumn"));

                root.appendChild(xnParam);
            }
        });
    }

    return xdData;
}

function loadFormJS(oForm) {
    var frontEnd = new $.StringBuilder(); //前端脚本
    frontEnd.append(unescape(oForm.arrCustomScript[0]));

    var backEnd = new $.StringBuilder(); //后端脚本
    backEnd.append(unescape(oForm.arrCustomScript[1]));

    var Commit = new $.StringBuilder(); //提交事件脚本
    Commit.append("function commitScript(){");
    Commit.append(unescape(oForm.arrCustomScript[2]));
    Commit.append("\n return true;");
    Commit.append("}");

    var unCommit = new $.StringBuilder(); //提交后事件脚本
    unCommit.append("function unCommitScript(){");
    unCommit.append(unescape(oForm.arrCustomScript[3]));
    unCommit.append("\n return true;");
    unCommit.append("}");

    var frontScript = document.createElement("script");
    var backScript = document.createElement("script");
    var characters = new Array('&', '<', '>');
    frontScript.text = specifyToCharacter(frontEnd.toString(), characters);
    backScript.text = specifyToCharacter(backEnd.toString(), characters);
    backScript.text += specifyToCharacter(Commit.toString(), characters);
    backScript.text += specifyToCharacter(unCommit.toString(), characters);

    document.getElementsByTagName("head")[0].appendChild(frontScript);
    document.getElementsByTagName("body")[0].appendChild(backScript);
}

function specifyToCharacter(changedString, characters) {
    var charactersNum = characters.length;
    for (var n = 0; n < charactersNum; n++) {
        switch (characters[n]) {
            case "&": changedString = changedString.replace(/&amp;/g, "&"); break;
            case "<": changedString = changedString.replace(/&lt;/g, "<"); break;
            case ">": changedString = changedString.replace(/&gt;/g, ">"); break;
        }
    }
    return changedString;
}

//组织表单中的控件
function fAssemblyControl(ContXml) {
    var $xnHtmlTab = $(ContXml).find("Htmltable");
    $xnHtmlTab.each(function (index, elem) {
        var xnHtmlTable = this;
        for (var k = 0; k < xnHtmlTable.childNodes.length; k++) {
            var curTable = document.getElementById(xnHtmlTable.childNodes[k].firstChild.nodeValue);
            for (var i = 0, iRL = curTable.rows.length; i < iRL; i++) {
                for (var j = 0, iCL = curTable.rows[i].cells.length; j < iCL; j++) {
                    var xmlControl = $.parseXML(curTable.rows[i].cells[j].getAttribute("fieldvalue"));
                    var xmlControls = xmlControl.getElementsByTagName("id");
                    for (var y = 0; y < xmlControls.length; y++) {
                        var curControl = document.getElementById($(xmlControls[y]).text());
                        if (curControl) {
                            curTable.rows[i].cells[j].appendChild(curControl);
                        }
                    }
                }
            }
        }
    });

    var $xnDiv = $(ContXml).find("Div");
    if ($xnDiv.length > 0) {
        var DIVIds = $xnDiv[0];
        for (var k = 0; k < DIVIds.childNodes.length; k++) {
            var curDIV = document.getElementById($(DIVIds.childNodes[k]).text());
            var xmlControl = $.parseXML(document.getElementById($(DIVIds.childNodes[k]).text()).getAttribute("fieldvalue"));
            var xmlControls = xmlControl.getElementsByTagName("id");
            for (var y = 0; y < xmlControls.length; y++) {
                var curControl = document.getElementById($(xmlControls[y]).text());
                if (curControl) {
                    document.getElementById($(DIVIds.childNodes[k]).text()).appendChild(curControl);
                }
            }
        }
    }
}

//再编辑,解析DataSet节点
function addDataTable(xmlDataTable, containerArea, oForm, operationType, controlPrefix) {
    var dataTableClientId = xmlDataTable.getAttribute("ClientId");

    if (typeof controlPrefix != "undefined") {
        var tagIndex = dataTableClientId.indexOf("_", 0);
        var controlName = dataTableClientId.substring(tagIndex + 1, dataTableClientId.length);
        if (!isSpace(publicform.Form.DataTablePrefix)) {
            dataTableClientId = publicform.Form.DataTablePrefix + controlName;
        } else {
            dataTableClientId = publicform.Form.ControlPrefix + controlName;
        }
    }

    var sDisplayStyle = operationType == "print" ? "display:none;" : " ";
    var sDtStyle = xmlDataTable.getAttribute("Style").replace(/^\s+(.*?)\s+$/, "");
    if (sDtStyle.charAt(sDtStyle.length - 1) != ";") {
        sDtStyle = sDtStyle + ";" + sDisplayStyle;
    } else {
        sDtStyle = sDtStyle + sDisplayStyle;
    }

    var sRedundance = xmlDataTable.getAttribute("RedundanceColumns") == undefined ? "" : xmlDataTable.getAttribute("RedundanceColumns");

    var sHtml = "<img DbId='" + xmlDataTable.getAttribute("DbId") + "' id='" + dataTableClientId + "' ControlType='datatable'"
        + " ChineseName='" + xmlDataTable.getAttribute("Name") + "' IsMain='" + xmlDataTable.getAttribute("IsMain")
        + "' OwnerName='" + xmlDataTable.getAttribute("OwnerName") + "' TableName='" + xmlDataTable.getAttribute("TableName")
        + "' PKColumn='" + xmlDataTable.getAttribute("UniqueIndexColumn") + "' RelationType='" + xmlDataTable.getAttribute("RelationType")
        + "' FilterSql='" + xmlDataTable.getAttribute("FilterSql") + "' ParentDtClientId='" + xmlDataTable.getAttribute("ParentDtClientId")
        + "' RelationColumns='" + xmlDataTable.getAttribute("RelationColumns") + "' Style='" + sDtStyle + "' RedundanceColumns='" + sRedundance
        + "' selectfield='' selectfieldobjs  src='skins/blue/images/menu/gif32/ef_designer_dataset.gif'"
        + " onresize='resize()' onresizestart='resizeStart()' onresizeend='resizeEnd()' onmove='move()' onmovestart='moveStart()'"
        + " onmoveend='moveEnd()' oncontrolselect='controlselect()' style='position:absolute;'/>";

    AddContXml("datatable", dataTableClientId);
    oForm.InsertControlIdNode(oForm.ControlsXML, dataTableClientId);
    containerArea.innerHTML += sHtml;

    var tempStr = "<root>";

    for (var i = 0; i < $(xmlDataTable).find("Columns")[0].childNodes.length; i++) {
        var objsColumns = $(xmlDataTable).find("Columns")[0].childNodes;
        document.getElementById(dataTableClientId).selectfield += objsColumns[i].getAttribute("ColumnName") + "@";;

        var objColumn = "<field>";
        objColumn += "<ColumnName>" + objsColumns[i].getAttribute("ColumnName") + "</ColumnName>";
        objColumn += "<ColumnDes>" + objsColumns[i].getAttribute("Name") + "</ColumnDes>";
        objColumn += "<DataType>" + objsColumns[i].getAttribute("DataType") + "</DataType>";
        objColumn += "<DataLength>" + objsColumns[i].getAttribute("Length") + "</DataLength>";
        objColumn += "<IsQuickly>false</IsQuickly>";
        objColumn += "<AnotherName>" + objsColumns[i].getAttribute("AnotherName") + "</AnotherName>";

        tempStr += objColumn + "</field>";
    }

    $(dataTableClientId).selectfieldobjs = tempStr + "</root>";

    if (operationType == "application") {
        $(dataTableClientId).style.display = "none";
    }
}

//解析事件
function fGetStrEvents(xmlControl, sLoadType, stateType) {
    var controlEvents = xmlControl.getElementsByTagName("Event");
    if (controlEvents == null || controlEvents.length == 0) { return ""; }
    var onfocusEvent = "", onblurEvent = "", onchangeEvent = ""; //表单元素事件
    var onkeydownEvent = "", onkeyupEvent = ""; //键盘事件
    var onclickEvent = "", ondblclickEvent = ""; //鼠标事件
    if (xmlControl.getAttribute("Type") === 'text') {
        switch (xmlControl.getAttribute("SpecialFunc")) {
            case "f_Price":
                {
                    onfocusEvent += "fSpecialFuncPriceChange(this);";
                    onkeyupEvent += "fSpecialFuncPrice(this);";
                    onblurEvent += "fSpecialFuncPriceBlur(this);";
                    break;
                }
            case "f_Integer": { break; }
        }
    }
    //遍历所有时间给事件变量赋值
    for (var n = 0; n < controlEvents.length; n++) {
        switch (controlEvents[n].getAttribute("type")) {
            case "onclick": onclickEvent += $(controlEvents[n]).text(); break;
            case "ondblclick": ondblclickEvent += $(controlEvents[n]).text(); break;
            case "onkeydown": onkeydownEvent += $(controlEvents[n]).text(); break;
            case "onkeyup": onkeyupEvent += $(controlEvents[n]).text(); break;
            case "onfocus": onfocusEvent += $(controlEvents[n]).text(); break;
            case "onblur": onblurEvent += $(controlEvents[n]).text(); break;
            case "onchange": onchangeEvent += $(controlEvents[n]).text(); break;
        }
    }

    var strEvents = "";
    if (xmlControl.getAttribute("Type") == "editor") {
        var currId = xmlControl.getAttribute("ClientId");
        var editEvents = "";
        if (onfocusEvent) {
            strEvents += "document.getElementById('" + currId + "').contentWindow.HtmlEditor.document.body.onfocus=function(){" + onfocusEvent + "};";
            //strEvents += "document.getElementById('" + currId + "').contentWindow.HtmlEditor.document.body.attachEvent('onfocus',function(){" + onfocusEvent + "};)";
            editEvents += " _onfocus='" + onfocusEvent + "' ";
        }
        if (onclickEvent) {
            strEvents += "$(document.getElementById('" + currId + "').contentWindow.HtmlEditor.document.body).bind('click',function(){" + onclickEvent + "});";
            editEvents += " _onclick='" + onclickEvent + "' ";
        }
        if (ondblclickEvent) {
            strEvents += "$(document.getElementById('" + currId + "').contentWindow.HtmlEditor.document.body).bind('dblclick',function(){" + ondblclickEvent + "});";
            editEvents += " _ondblclick='" + ondblclickEvent + "' ";
        }
        if (onkeydownEvent) {
            strEvents += "$(document.getElementById('" + currId + "').contentWindow.HtmlEditor.document.body).bind('keydown',function(){" + onkeydownEvent + "});";
            editEvents += " _onkeydown='" + onkeydownEvent + "' ";
        }
        if (onkeyupEvent) {
            strEvents += "$(document.getElementById('" + currId + "').contentWindow.HtmlEditor.document.body).bind('keyup',function(){" + onkeyupEvent + "});";
            editEvents += " _onkeyup='" + onkeyupEvent + "' ";
        }
        if (onblurEvent) {
            strEvents += "document.getElementById('" + currId + "').contentWindow.HtmlEditor.document.body.onblur=function(){" + onblurEvent + "};";
            editEvents += " _onblur='" + onblurEvent + "' ";
        }
        if (onchangeEvent) {
            strEvents += "$(document.getElementById('" + currId + "').contentWindow.HtmlEditor.document.body).bind('change',function(){" + onchangeEvent + "});";
            editEvents += " _onchange='" + onchangeEvent + "' ";
        }

        var editorEvents = {};
        editorEvents["strEvents"] = strEvents;
        editorEvents["editEvents"] = editEvents;

        return editorEvents;
    } else {
        if (typeof sLoadType != "undefined") {
            if (sLoadType == "application") {
                switch (stateType.toLowerCase()) {
                    case "write":
                    case "none":
                        {
                            //onblurEvent += fGetBaseValidEventHandler(xmlControl);
                        }
                        break;
                }
            } else if (sLoadType == "preview") {
                onblurEvent += fGetBaseValidEventHandler(xmlControl);
            }
        }

        if (onclickEvent == "" || typeof onclickEvent == "undefined") {
            onclickEvent = "\"\"";
        }
        if (ondblclickEvent == "" || typeof ondblclickEvent == "undefined") {
            ondblclickEvent = "\"\"";
        }
        if (onfocusEvent == "" || typeof onfocusEvent == "undefined") {
            onfocusEvent = "\"\"";
        }
        if (onblurEvent == "" || typeof onblurEvent == "undefined") {
            onblurEvent = "\"\"";
        }
        if (onkeydownEvent == "" || typeof onkeydownEvent == "undefined") {
            onkeydownEvent = "\"\"";
        }
        if (onkeyupEvent == "" || typeof onkeyupEvent == "undefined") {
            onkeyupEvent = "\"\"";
        }
        if (onchangeEvent == "" || typeof onchangeEvent == "undefined") {
            onchangeEvent = "\"\"";
        }

        if (arguments.length > 1) {
            strEvents = ' onclick="' + fReplaceSemicolonWithAmp(onclickEvent) + '" ondblclick="' + fReplaceSemicolonWithAmp(ondblclickEvent) + '" onfocus="' + fReplaceSemicolonWithAmp(onfocusEvent) + '" onblur="' + fReplaceSemicolonWithAmp(onblurEvent)
                     + '" onkeydown="' + fReplaceSemicolonWithAmp(onkeydownEvent) + '" onkeyup="' + fReplaceSemicolonWithAmp(onkeyupEvent) + '" onchange="' + fReplaceSemicolonWithAmp(onchangeEvent) + '" ';
        } else {
            strEvents = ' _onclick="' + onclickEvent + '" _ondblclick="' + ondblclickEvent + '" _onfocus="' + onfocusEvent + '" _onblur="' + onblurEvent
                   + '" _onkeydown="' + onkeydownEvent + '" _onkeyup="' + onkeyupEvent + '" _onchange="' + onchangeEvent + '" ';
        }

        return strEvents;
    }
}

function fGetBaseAttribute(xmlControl, oForm) {
    var strBaseAttribute = "";
    var className = xmlControl.getAttribute("ClassName") == null ? "" : xmlControl.getAttribute("ClassName");
    var sFormId = typeof oForm == "undefined" ? "" : oForm.sDbId;

    strBaseAttribute = 'FormDbId ="' + sFormId + '" id="' + xmlControl.getAttribute("ClientId") + '" ControlType="' + xmlControl.getAttribute("Type")
    + '" ChineseName="' + xmlControl.getAttribute("Name") + '" Trace="' + xmlControl.getAttribute("Trace") + '" DbId="' + xmlControl.getAttribute("DbId")
    + '" Position="' + xmlControl.getAttribute("Position") + '" style="' + xmlControl.getAttribute("Style") + '" class="' + className + '" ';
    if (xmlControl.getAttribute("IsPrint")) {
        strBaseAttribute += ' IsPrint="' + xmlControl.getAttribute("IsPrint") + '" ';
    }
    return strBaseAttribute;
}

function fGetBaseValid(xmlControl) {
    var sNoEmptyAlertMsg = xmlControl.getAttribute("NoEmptyAlertMsg") == null ? "" : xmlControl.getAttribute("NoEmptyAlertMsg");
    var bIsLengthValid = xmlControl.getAttribute("IsLengthValid") == null ? "false" : xmlControl.getAttribute("IsLengthValid");
    var sSpecialCharAlertMsg = xmlControl.getAttribute("SpecialCharAlertMsg") == null ? "" : xmlControl.getAttribute("SpecialCharAlertMsg");
    var sLengthValidInfo = xmlControl.getAttribute("LengthValidInfo") == null ? "" : xmlControl.getAttribute("LengthValidInfo");

    var BaseValidInfo = ' IsRequired="' + xmlControl.getAttribute("IsRequired") + '" NoEmptyAlertMsg="' + sNoEmptyAlertMsg
     + '" IsLengthValid="' + bIsLengthValid + '" LengthValidInfo="' + sLengthValidInfo
     + '" IsXMLSpecialChar="' + xmlControl.getAttribute("IsXMLSpecialChar") + '" SpecialCharAlertMsg="' + sSpecialCharAlertMsg + '" ';

    return BaseValidInfo;
}

function fGetCommitValidInfo(xmlControl) {
    var sValidSeq = xmlControl.getAttribute("ValidSeq") == null ? "" : xmlControl.getAttribute("ValidSeq");
    var sCommitValidFucNames = xmlControl.getAttribute("CommitValidFucNames") == null ? "" : xmlControl.getAttribute("CommitValidFucNames");

    var sCommitValidInfo = ' ValidSeq="' + sValidSeq + '"  CommitValidFucNames="' + sCommitValidFucNames + '" ';
    return sCommitValidInfo;
}

function fGetDesignEditCommonEvent() {
    var sDesignEditCommonEvent = ' onresize="resize(event)" onresizestart="resizeStart(event)" onresizeend="resizeEnd(event)" onmove="move(event)" onmovestart="moveStart(event)" onmoveend="moveEnd(event)"'
    + ' oncontrolselect="controlselect(event)" ondragstart="dragstart(event)" ondragend="dragend(event)" ';

    return sDesignEditCommonEvent;
}

function fGetSingeData(xmlControl) {
    var strGetSingeData = ' DtClientId="' + xmlControl.getAttribute("DtClientId")
         + '" ColumnName="' + xmlControl.getAttribute("ColumnName") + '" ';

    return strGetSingeData;
}

function fGetBothData(xmlControl) {
    var strGetBothData = ' DtClientId="' + xmlControl.getAttribute("DtClientId")
    + '" DataMode="' + xmlControl.getAttribute("DataMode")
    + '" ValueColumnName="' + xmlControl.getAttribute("ValueColumnName")
    + '" TextColumnName="' + xmlControl.getAttribute("TextColumnName")
    + '" DataSourceType="' + xmlControl.getAttribute("DataSourceType")
    + '" TextDataSource="' + xmlControl.getAttribute("TextDataSource")
    + '" DbValueColumn="' + xmlControl.getAttribute("DbValueColumn")
    + '" DbTextColumn="' + xmlControl.getAttribute("DbTextColumn")
    + '" DbDataSource="' + xmlControl.getAttribute("DbDataSource")
    + '" DbParentColumn="' + xmlControl.getAttribute("DbParentColumn")
    + '" ParentControlClientId="' + xmlControl.getAttribute("ParentControlClientId") + '" ';
    return strGetBothData;
}

function fGetBaseValidEventHandler(xmlControl) {
    var sOnBlurEvent = "";

    switch (xmlControl.getAttribute("Type")) {
        case "password":
        case "text":
        case "textarea":
        case "countersign":
            {
                var fnValidLength = " SysF_IsInBoundOfLength", fnValidSpecialChar = " !SysF_IsContainSpecialChar", fnValidNoEmpty = " !SysF_IsEmpty";

                if (xmlControl.getAttribute("IsRequired") == "true") {
                    sOnBlurEvent += fnValidNoEmpty + "(this.value,'" + xmlControl.getAttribute("NoEmptyAlertMsg") + "');";
                }
                if (xmlControl.getAttribute("IsXMLSpecialChar") == "true") {
                    sOnBlurEvent += fnValidSpecialChar + "(this.value,'" + xmlControl.getAttribute("SpecialCharAlertMsg") + "');";
                }

                var lengthValidInfo = xmlControl.getAttribute("LengthValidInfo");
                if (xmlControl.getAttribute("IsLengthValid") == "true") {
                    if (lengthValidInfo == "") {
                        sOnBlurEvent += fnValidLength + "(this.value );";
                    } else {
                        sOnBlurEvent += fnValidLength + "(this.value," + lengthValidInfo + ");";
                    }
                }
                break;
            }
        case "radio":
            {
                var fnValidNoEmpty = " !SysF_IsEmptyByRadio";
                if (xmlControl.getAttribute("IsRequired") == "true") {
                    sOnBlurEvent += fnValidNoEmpty + "(this,'" + xmlControl.getAttribute("NoEmptyAlertMsg") + "');";
                }
                break;
            }
    }
    return sOnBlurEvent;
}

function fReplaceSemicolonWithAmp(sEventHandler) {
    if (sEventHandler == "\"\"" || sEventHandler == "") return "\"\"";
    var reg = /\s+$/;
    sEventHandler = sEventHandler.replace(reg, "");
    if (sEventHandler.charAt(sEventHandler.length - 1) == ";") {
        sEventHandler = sEventHandler.substr(0, sEventHandler.length - 1).replace(/;/g, " && ") + ";";
    }
    return sEventHandler;
}

function fSpecialFuncPrice(t) {
    var stmp = "";
    if (t.value == stmp) return;
    var ms = t.value.replace(/[^\d\.]/g, "").replace(/(\.\d{2}).+$/, "$1").replace(/^0+([1-9])/, "$1").replace(/^0+$/, "0");
    var txt = ms.split(".");
    while (/\d{4}(,|$)/.test(txt[0]))
        txt[0] = txt[0].replace(/(\d)(\d{3}(,|$))/, "$1,$2");
    t.value = stmp = txt[0] + (txt.length > 1 ? "." + txt[1] : "");
}

function fSpecialFuncPriceChange(ojb) {
    var a_value = ojb.value;
    var a_leng = a_value.length;

    if (a_leng > 0) {
        if (a_value.substr(0, 1) === "￥") {
            ojb.value = a_value.substr(1, a_leng);
        }
    }
}

function fSpecialFuncPriceBlur(ojb2) {
    ojb2.value = "￥" + ojb2.value;
}
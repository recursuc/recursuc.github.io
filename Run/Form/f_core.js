/* 
js变量命名规则：类型首字母+名（或节点名）
b开头表 Boolean类型 ； i表 Int；  s表String；  o表Object；arr表Array ； d表Date（属性，字段名一般为名词）;
fn表function函数（不以fn开头也行一般为动词短语容易区分）;
xd表XmlDocument， xn表XmlNode， xe表XmlElement；xnl表XmlNodeList 依次类推取首字母(如一个<Form> 节点名为：xnForm，多个则xnlForm) ;
html标签节点 标签名缩写 + id（txt; txe, chk, ）;
jquery对象以：$ + 变量名;
*/

function Form() {
    this.sDbId = "";
    this.sClientId = "";
    this.sMainTableName = "";
    this.xdControls = $.parseXML('<?xml version="1.0" encoding="utf-8"?><root></root>');
    this.xnForm = null;
    this.sDataKey = "";
    this.iOperSign = 1;
    this.sChineseName = "";
    this.sControlPrefix = "";
    this.sCategories = "";
    this.sTrace = "";
    this.iIsDataOperation = 0;
    this.oWebgridObj = {};
    this.arrCascadeChilds = [];
    //popup: window.createPopup(),
    this.arrValidSeq = [];
    this.area = null;
    this.hiddenArea = null;
    this.sKeyValue = "";
    this.obj = null;
    this.bEditable = false;
    /*    this.arrValidObj = [];*/
    this.oControls = {};
    this.sPassWordInfo = "";
    this.sbGloblHtml = new $.StringBuilder();
    /*  定义脚本;包括前端脚本[0]、后端脚本[1]、提交触发脚本[2]、提交后触发的脚本[3]、
    前端脚本展示[4]、后端脚本展示[5]、提交触发脚本展示[6]、提交后触发的脚本展示[7]*/
    this.arrCustomScript = new Array('', '', '', '', '', '', '', '');
};

Form.method({
    "addIdNode": function (sControlId, sType) {
        var sConType = sType.capitalize(),
            $xnlType = $(this.xdControls).find(sConType),
            xnType = null,
            xeId = null;

        if ($xnlType.length == 0) {
            xnType = this.xdControls.createElement(sConType);
            this.xdControls.documentElement.appendChild(xnType);
        } else {
            xnType = $xnlType.get(0);
        }
        xeId = this.xdControls.createElement("Id");
        $(xeId).text(sControlId);
        xnType.appendChild(xeId);
    },

    "xmlToAppForm": function xmlToAppForm(sLoadType) {
        var bIsControlLoadComplete = false,
            xdData = getControlXmlWithDataSource($(this.xnForm));

        if (xdData.getElementsByTagName("Param").length > 0) {
            $.ajax({
                type: "POST",
                url: "ajax_handle/datasource_handler.aspx",
                async: true,
                data: xdData,
                processData: false,
                context: document.body,
                dataType: "xml",
                success: function (data, textStatus, jqXHR) {
                    loadDataSourceAndJs(data)
                },
                error: function (jqXHR, textStatus, errorThrown) {
                }
            });
        }

        var $Script = $(this.xnForm).find("Script");
        this.arrCustomScript[0] = $Script.find("FrontEnd").text() != null ? $Script.find("FrontEnd").text() : "";
        this.arrCustomScript[1] = $Script.find("BackEnd").text() != null ? $Script.find("BackEnd").text() : "";
        this.arrCustomScript[2] = $Script.find("Commit").text() != null ? $Script.find("Commit").text() : "";
        this.arrCustomScript[3] = $Script.find("UnCommit").text() != null ? $Script.find("UnCommit").text() : "";

        this.sClientId = this.xnForm.getAttribute("ClientId");
        this.sDbId = this.xnForm.getAttribute("DbId");
        this.sChineseName = this.xnForm.getAttribute("Name");
        this.sTrace = this.xnForm.getAttribute("Trace");
        if (this.xnForm.getAttribute("IsDataOperation") == null) {
            this.iIsDataOperation = 1;
        } else {
            this.iIsDataOperation = this.xnForm.getAttribute("IsDataOperation");
        }
        window.document.title = this.ChineseName;
        if (this.xnForm.getAttribute("Categories") == null) {
            this.sCategories = "0";
        } else {
            this.sCategories = this.xnForm.getAttribute("Categories");
        }
        this.sControlPrefix = this.xnForm.getAttribute("ControlPrefix");
        this.area.style.cssText = this.xnForm.getAttribute("Style");
        this.area.style.position = "absolute";
        this.xdControls = $.parseXML('<?xml version="1.0" encoding="utf-8"?><root></root>');

        var $xnlHtmlTable = $(this.xnForm).find("Controls>Control[Type = 'htmltable']");
        var that = this;
        $xnlHtmlTable.each(function (index, elem) {
            var sControlOldHtmlId = this.getAttribute("ClientId");
            that.area.innerHTML += unescape($(this).text());
            that.addIdNode(sControlOldHtmlId, "Htmltable");
        });

        var $xnControl = $(this.xnForm).find("Controls>Control[Type != 'htmltable']");  //找出所有非htmltable控件
        for (var j = 0, k = $xnControl.length; j < k; j++) {
            fAddControl($xnControl[j], this.area, this, sLoadType, $xnControl);
        }
        this.area.innerHTML += this.sbGloblHtml;
        var xnDataSet = $(this.xnForm).find("DataSet").get(0);
        this.sDataSetId = xnDataSet.getAttribute("DbId");
        this.sMainTableName = xnDataSet.getAttribute("MainTableName");
        //获取DataSet控件集合
        var xnlDataTable = this.xnForm.getElementsByTagName("DataTable");

        fAssemblyControl(this.xdControls);

        if (typeof publicform != "undefined" && typeof publicform.forms === "object") {
            publicform.forms[publicform.forms.length] = form;
            publicform.arrValidSeqs.push(arrSortContr);
        } else {
            this.arrValidSeq = SortValidControlBySeq(this.xnForm);
            //初始化webgrid

            for (var x in this.oWebgridObj) {
                InitWebGrid(this.oWebgridObj[x].xnControl);
            }
        }

        if (xdData.getElementsByTagName("Param").length > 0) {
            bIsControlLoadComplete = true;
        } else {
            loadFormJS(this);
        }
        var that = this;
        function loadDataSourceAndJs(data) {
            if (bIsControlLoadComplete) {
                var xnDBSources = $(data).find("DBSource");
                for (var i = 0, len = xnDBSources.length; i < len; i++) {
                    var xmlDBSource = xnDBSources[i];
                    var oAttrubutes = xnDBSources[i].attributes;
                    var oOptions = xnDBSources[i].getElementsByTagName("Item");
                    var curSel = document.getElementById(oAttrubutes.getNamedItem("ClientId").value);
                    var sType = curSel.getAttribute('ControlType') || curSel.getAttribute('controltype');
                    switch (sType) {
                        case "combobox":
                            {
                                if (curSel.nodeName.toUpperCase() === "SELECT") {
                                    for (var m = curSel.options.length - 1; m >= 0; m--) {
                                        curSel.options.remove(m);
                                    }

                                    for (var n = 0, k = oOptions.length; n < k; n++) {
                                        var att = oOptions[n].attributes;
                                        oOption = document.createElement("Option");
                                        oOption.text = att.getNamedItem("name").value;
                                        oOption.value = att.getNamedItem("id").value;

                                        curSel.options.add(oOption);
                                    }
                                    //if (curSel.selectedIndex >= 0) curSel.options[curSel.selectedIndex].value;
                                    if (curSel.getAttribute('CurValue')) {
                                        for (var j = 0; j < curSel.options.length; j++) {
                                            if (curSel.options[j].value == curSel.getAttribute('CurValue')) {
                                                curSel.selectedIndex = j;
                                                break;
                                            }
                                        }
                                        if (curSel.selectedIndex != -1) {
                                            curSel.Text = curSel.options[curSel.selectedIndex].text;
                                        } else {
                                            curSel.Text = "";
                                        }
                                        if (curSel.selectedIndex >= 0) {
                                            curSel.SourceValue = curSel.options[curSel.selectedIndex].value;
                                            curSel.SourceText = curSel.options[curSel.selectedIndex].text;
                                        }
                                    }
                                    curSel.setAttribute("oldSelectedIndex", curSel.getAttribute("selectedIndex"));
                                } else {
                                    for (var n = 0, k = oOptions.length; n < k; n++) {
                                        var att = oOptions[n].attributes;
                                        if (curSel.getAttribute("Value") == att.getNamedItem("id").value) {
                                            curSel.innerHTML = att.getNamedItem("name").value;
                                            break;
                                        }
                                    }
                                }
                                break;
                            }
                        case "checkboxlist":
                            {
                                var Chbid = curSel.id;
                                for (var n = 0, k = oOptions.length; n < k; n++) {
                                    if (n == 0) {
                                        if (curSel.Value == '' || curSel.Value == ';') {
                                            curSel.Value = ';';
                                            curSel.Text = ';';
                                        }
                                    }
                                    var att = oOptions[n].attributes;
                                    var text = att.getNamedItem("name").value;
                                    var value = att.getNamedItem("id").value;

                                    var tmpCheckboxID = "Chb" + Chbid + "_" + (n + 1);
                                    var stmp = "<input type=checkbox id='" + tmpCheckboxID + "'";
                                    if (curSel.getAttribute("ControlStateType") != "View") {
                                        stmp += "name='Chb" + Chbid + "' ";
                                    }
                                    stmp += "value='" + value + "' text='" + text + "' oncontrolselect='controlselectcancel()' ";
                                    if (curSel.getAttribute("Value")) {
                                        if (curSel.Value.indexOf(';' + value + ';') > -1)
                                            stmp += "checked ";
                                    }
                                    stmp += "onclick=\"if(this.checked){" + Chbid + ".Value+=" + tmpCheckboxID + ".value + ';';" + Chbid + ".Text+=" + tmpCheckboxID + ".text + ';';}"
                                        + "else{" + Chbid + ".Value = " + Chbid + ".Value.replace(" + tmpCheckboxID + ".value + ';','');"
                                        + Chbid + ".Text = " + Chbid + ".Text.replace(" + tmpCheckboxID + ".text + ';','');}\"" + ">"
				                        + "<span>" + text + "</span>&nbsp;";

                                    strBr = "";
                                    if (curSel.getAttribute("aspect") == "纵向") {
                                        if (i != 0) {
                                            strBr = "<br>";
                                        }
                                    }
                                    curSel.innerHTML += strBr + stmp;
                                }
                                break;
                            }
                        case "radio":
                            {
                                var Rdoid = curSel.id;
                                for (var n = 0, k = oOptions.length; n < k; n++) {
                                    var att = oOptions[n].attributes;
                                    var text = att.getNamedItem("name").value;
                                    var value = att.getNamedItem("id").value;

                                    var tmpRadioID = "Rdo" + Rdoid + "_" + (n + 1);
                                    var stmp = "<input type=radio id='" + tmpRadioID + "'";
                                    if (curSel.getAttribute("ControlStateType") != "View") {
                                        stmp += "name='Rdo" + Rdoid + "' ";
                                    }
                                    stmp += "value='" + value + "' text='" + text
                        + "' oncontrolselect='controlselectcancel()' ";
                                    if (curSel.getAttribute("Value")) {
                                        if (curSel.getAttribute("Value") == value)
                                            stmp += "checked ";
                                    }
                                    stmp += "onclick=\"" + Rdoid + ".Value=" + tmpRadioID + ".value;" + Rdoid + ".Text=" + tmpRadioID + ".text;\">"
                        + "<span>" + text + "</span>&nbsp;";

                                    strBr = "";
                                    if (curSel.getAttribute("aspect") == "纵向") {
                                        if (i != 0) {
                                            strBr = "<br>";
                                        }
                                    }
                                    curSel.innerHTML += strBr + stmp;
                                }
                                break;
                            }
                        case "formContainer":
                            {
                                //生成下拉option数据
                                var oOption = document.createElement("Option");
                                oOption.text = "-------请选择-------";
                                oOption.value = "";
                                curSel.options.add(oOption);

                                for (var n = 0, k = oOptions.length; n < k; n++) {
                                    var att = oOptions[n].attributes;
                                    oOption = document.createElement("Option");
                                    oOption.text = att.getNamedItem("name").value;
                                    oOption.value = att.getNamedItem("id").value;

                                    curSel.options.add(oOption);
                                }
                                break;
                            }
                    }
                }

                //添加脚本
                loadFormJS(that);
                loadDataSource = null;
                return;
            } else {
                window.setTimeout(arguments.callee, 50);
            }
        }
    },

    "formToAppXml": function () {
        if (this.IsDataOperation == 0) {
            return;
        }
        var xmlBase = createBaseXmlDoc(),
            xeForm = fCreateXMLForm(xmlBase, this),
            xeControls = xmlBase.createElement("Controls"),
            iTypelen = this.xdControls.documentElement.childNodes.length,
            iConlen = 0,
            i = 0,
            j = 0,
            currObj = null;

        for (i = 0; i < iTypelen; i++) {
            iConlen = this.xdControls.documentElement.childNodes[i].childNodes.length;
            switch (this.xdControls.documentElement.childNodes[i].nodeName) {
                case "Password":
                case "Text":
                case "Textarea":
                case "Countersign":
                    {
                        for (j = 0; j < iConlen; j++) {
                            currObj = document.getElementById($(this.xdControls.documentElement.childNodes[i].childNodes[j]).text());
                            if (currObj && currObj.getAttribute("ControlStateType") != "View") {
                                var xmlControl = fCreateXMLControl(xmlBase);
                                fSetBaseAttribute(currObj, xmlControl);
                                fSetDataAttribute(currObj, xmlControl);
                                fSetStyleAttribute(currObj, xmlControl);
                                if (currObj.ControlType === "text") {
                                    xmlControl.setAttribute("SystemVariables", currObj.getAttribute("SystemVariables"));
                                    if (currObj.getAttribute("SrcValue") != SysF_Trim(currObj.value)) {
                                        currObj.setAttribute("ReturnValue", currObj.value);
                                    }
                                    xmlControl.setAttribute("ReturnValue", currObj.getAttribute("ReturnValue"));
                                }
                                fSetValueAttribute(currObj, xmlControl, xmlBase);
                                xeControls.appendChild(xmlControl);
                            }
                        }
                        break;
                    }
                case "Editor":
                    {
                        for (j = 0; j < iConlen; j++) {
                            currObj = document.getElementById($(this.xdControls.documentElement.childNodes[i].childNodes[j]).text());
                            if (currObj && currObj.getAttribute("ControlStateType") != "View") {
                                var xmlControl = fCreateXMLControl(xmlBase);
                                fSetBaseAttribute(currObj, xmlControl);
                                var sContent = escape(document.getElementById(currObj.id).contentWindow.HtmlEditor.document.body.innerHTML);
                                fSetDataAttribute(currObj, xmlControl);
                                fSetStyleAttribute(currObj, xmlControl);
                                xmlControl.setAttribute("Value", sContent);
                                fSetValueAttribute(currObj, xmlControl, xmlBase);
                                xeControls.appendChild(xmlControl);
                            }
                        }
                        break;
                    }
                case "Mydatetime":
                    {
                        for (j = 0; j < iConlen; j++) {
                            currObj = document.getElementById($(this.xdControls.documentElement.childNodes[i].childNodes[j]).text());
                            if (currObj && currObj.getAttribute("ControlStateType") != "View") {
                                var xmlControl = fCreateXMLControl(xmlBase);
                                fSetBaseAttribute(currObj, xmlControl);
                                fSetDataAttribute(currObj, xmlControl);
                                fSetValueAttribute(currObj, xmlControl);
                                fSetStyleAttribute(currObj, xmlControl);
                                xmlControl.setAttribute("Format", currObj.getAttribute("Format"));
                                xeControls.appendChild(xmlControl);
                            }
                        }
                        break;
                    }
                case "Datetime":
                    {
                        for (j = 0; j < iConlen; j++) {
                            currObj = document.getElementById($(this.xdControls.documentElement.childNodes[i].childNodes[j]).text());
                            if (currObj && currObj.getAttribute("ControlStateType") != "View") {
                                var xmlControl = fCreateXMLControl(xmlBase);
                                fSetBaseAttribute(currObj, xmlControl);
                                fSetDataAttribute(currObj, xmlControl);
                                fSetValueAttribute(currObj, xmlControl);
                                fSetStyleAttribute(currObj, xmlControl);
                                xmlControl.setAttribute("Format", currObj.getAttribute("Format"));
                                xeControls.appendChild(xmlControl);
                            }
                        }
                        break;
                    }
                case "Checkbox":
                    {
                        for (j = 0; j < iConlen; j++) {
                            currObj = document.getElementById($(this.xdControls.documentElement.childNodes[i].childNodes[j]).text());
                            if (currObj && currObj.getAttribute("ControlStateType") != "View") {
                                var xmlControl = fCreateXMLControl(xmlBase);
                                fSetBaseAttribute(currObj, xmlControl);
                                fSetDataAttribute(currObj, xmlControl);
                                fSetValueAttribute(currObj, xmlControl);
                                fSetStyleAttribute(currObj, xmlControl);
                                xmlControl.setAttribute("TrueValue", currObj.getAttribute("truevalue"));
                                xmlControl.setAttribute("FalseValue", currObj.getAttribute("falsevalue"));
                                xeControls.appendChild(xmlControl);
                            }
                        }
                        break;
                    }
                case "Combobox":
                case "Checkboxlist":
                case "Radio":
                    {
                        for (j = 0; j < iConlen; j++) {
                            currObj = document.getElementById($(this.xdControls.documentElement.childNodes[i].childNodes[j]).text());
                            if (currObj && currObj.getAttribute("ControlStateType") != "View") {
                                var xmlControl = fCreateXMLControl(xmlBase);
                                fSetBaseAttribute(currObj, xmlControl);
                                fSetBothDataAttribute(currObj, xmlControl);
                                fSetDBSourceAttribute(currObj, xmlControl);
                                fSetStyleAttribute(currObj, xmlControl);
                                if (currObj.ControlType === "radio" || currObj.ControlType === "checkboxlist") xmlControl.setAttribute("Aspect", currObj.getAttribute("aspect"));
                                fSetValueAttribute(currObj, xmlControl);
                                xeControls.appendChild(xmlControl);
                            }
                        }
                        break;
                    }
                case "Upload":
                    {
                        for (j = 0; j < iConlen; j++) {
                            currObj = document.getElementById($(this.xdControls.documentElement.childNodes[i].childNodes[j]).text());
                            if (currObj && currObj.getAttribute("ControlStateType") != "View") {
                                var xmlControl = fCreateXMLControl(xmlBase);
                                fSetBaseAttribute(currObj, xmlControl);
                                fSetDataAttribute(currObj, xmlControl);
                                fSetStyleAttribute(currObj, xmlControl);
                                xmlControl.setAttribute("PathClass", currObj.getAttribute("PathClass") || "");
                                xmlControl.setAttribute("FilePath", currObj.getAttribute("FilePath"));
                                xmlControl.setAttribute("FileExt", currObj.getAttribute("FileExt"));
                                xmlControl.setAttribute("FileCountLimit", currObj.getAttribute("FileCountLimit"));
                                xmlControl.setAttribute("FileNameLength", currObj.getAttribute("FileNameLength"));
                                xmlControl.setAttribute("SaveMode", currObj.getAttribute("SaveMode"));
                                xmlControl.setAttribute("AttachTable", currObj.getAttribute("AttachTable"));
                                xmlControl.setAttribute("FileCurrCount", currObj.getAttribute("FileCurrCount"));
                                xmlControl.setAttribute("DeleteFilesId", currObj.getAttribute("DeleteFilesId"));
                                xmlControl.setAttribute("DeleteFileNames", currObj.getAttribute("DeleteFileNames") || "");

                                var xmlAttachments = xmlBase.createElement("Attachments");
                                if (currObj.children.length == 2) {
                                    var oTable = currObj.children[1].children[0];
                                }
                                else {
                                    var oTable = currObj.children[0].children[0];
                                }
                                for (var k = 0; k < oTable.rows.length; k++) {
                                    var oTr = oTable.rows[k];
                                    if (oTr.TrType == 'Attachment') {
                                        var xmlAttachment = xmlBase.createElement("Attachment");
                                        xmlAttachment.setAttribute("DbId", oTr.getAttribute("AttachId"));
                                        xmlAttachment.setAttribute("ServicePathName", oTr.getAttribute("AttachServerPath"));
                                        xmlAttachment.setAttribute("FileName", oTr.getAttribute("AttachName"));
                                        xmlAttachment.setAttribute("Extension", oTr.getAttribute("AttachExt"));
                                        xmlAttachments.appendChild(xmlAttachment);
                                    }
                                }
                                xmlControl.appendChild(xmlAttachments);
                                xeControls.appendChild(xmlControl);
                            }
                        }
                        break;
                    }
                case "Webgrid":
                    {
                        for (j = 0; j < iConlen; j++) {
                            currObj = document.getElementById($(this.xdControls.documentElement.childNodes[i].childNodes[j]).text());
                            if (currObj && currObj.getAttribute("ControlStateType") != "View") {
                                var xmlControl = fCreateXMLControl(xmlBase);
                                fSetBaseAttribute(currObj, xmlControl);
                                xmlControl.setAttribute("SkinType", currObj.getAttribute("SkinType"));
                                xmlControl.setAttribute("DelColumnsId", currObj.getAttribute("DelColumnsId"));
                                xmlControl.setAttribute("IsPaging", currObj.getAttribute("IsPaging") == null ? "" : currObj.getAttribute("IsPaging"));
                                xmlControl.setAttribute("PageCount", currObj.getAttribute("PageCount") == null ? "" : currObj.getAttribute("PageCount"));
                                xmlControl.setAttribute("DelRowsId", currObj.getAttribute("DelRowsId"));
                                var xdDoc = $.parseXML(currObj.getAttribute("ColumnsXml"));
                                var xmlColumns = $(xdDoc).find("GridColumns").get(0).cloneNode(true);
                                var strVal = oForm.oWebgridObj[currObj.id].oDhtmlXGrid.serialize().substring(21);
                                var xdVal = $.parseXML(strVal);
                                var xmlDataRows = $(xdVal).find("rows").get(0).cloneNode(true);
                                xmlControl.appendChild(xmlDataRows);
                                xmlControl.appendChild(xmlColumns);
                                xeControls.appendChild(xmlControl);
                            }
                        }
                        break;
                    }
                default:
            }
            currObj = null;
        }

        var xnDataset = xmlBase.createElement("DataSet");
        xnDataset.setAttribute("DbId", this.sDataSetId);
        xnDataset.setAttribute("MainTableName", this.sMainTableName);

        var xnScript = xmlBase.createElement("Script");
        var xnFrontEnd = xmlBase.createElement("FrontEnd");
        xnScript.appendChild(xnFrontEnd);

        var xnBackEnd = xmlBase.createElement("BackEnd");
        xnScript.appendChild(xnBackEnd);

        var xnCommit = xmlBase.createElement("Commit");
        xnScript.appendChild(xnCommit);

        xeForm.appendChild(xnScript);
        xeForm.appendChild(xnDataset);
        xeForm.appendChild(xeControls);

        var root = $(xmlBase).find("Doc>Data").get(0);
        root.appendChild(xeForm);

        return xmlBase;
    }
});
(function (win) {
    var doc = win.document,
	F = $F,
	E = $E,
	P = $P,
	ET = $ET,
	SysVariable = {};
    FormControl = $C.Create({
        initialize: function (options, parent) {
            this.pControl = parent;
            this.childNodes = null;
            this.cid = options.cid;
            this.type = options.type;
            this.conStatus = options.conStatus;
            this.cfgData = {
                style: {}

            };
            this.state = options.state || "none";
            this.heContent = options.heControl;
            this.setDefaultValue(options.conStatus);
            this.isLayout = false;
            this.cascadeChild = [];
            parent && parent.appendChild(this);
        },
        setData: function (data) {
            this.data = data;
        },
        setProp: function (propName, value) {
            var aPN = propName.split(".");
            propName = aPN[0];
            if (aPN.length > 1) {
                this.cfgData.style[aPN[1]] = this.heControl.style[aPN[1]] = value;
            } else {
                this.cfgData[propName] = this.heContent[propName] = value;
            }
        },
        getProps: function () {
            var sb = new StringBuilder();
            this.cfgData.style.width = this.heControl.style.width;
            this.cfgData.style.height = this.heControl.style.height;
            this.cfgData.style.top = this.heControl.style.top;
            this.cfgData.style.left = this.heControl.style.left;
            for (var propName in this.cfgData) {
                if (propName == "style") {
                    sb.append("style='");
                    var oStyle = this.cfgData[propName]
                    for (var pn in oStyle) {
                        sb.append(pn + ":" + oStyle[pn] + ";");
                    }
                    sb.append("' ");
                } else {
                    sb.append(propName + "='" + this.cfgData[propName]+ "' ");
                }
            }
            return sb.count > 0 ? (" " + sb.serialize()) : "";
        },
        getValue: function () {
            return this.heContent.value;
        },
        serialize: function () {
            return '<' + this.type + ' value="' + this.value
				 + '" type="' + this.type + '" DataSet="' + this.heContent.getAttribute("DataSet")
				 + '" DataTable="'+ this.heContent.getAttribute("DataTable")
				 + '" DataColumn="'+ this.heContent.getAttribute("DataColumn")
				 + '" />';
        },
        getBaseProp: function () {
            return '" type="' + this.type + '" DataSet="' + this.heContent.getAttribute("DataSet")
				 + '" DataTable="' + this.heContent.getAttribute("DataTable")
				 + '" DataColumn="' + this.heContent.getAttribute("DataColumn") + '" ';
        },
        getDBSource: function (sSql, vColumn, tColumn, sURL) {
            !sURL && (sURL = "controlDSAjaxAction.action");
            var data = this.cfgData,
				xmlDoc = XmlDocument.createBase('<Operation ParamType="GetDBSourceItems" DataSource="'
						 + (sSql || data.DataSourceSQL)
						 + '" DbValueColumn="'
						 + (vColumn || data.DBValueColumn)
						 + '" DbTextColumn="'
						 + (tColumn || data.DBTextColumn) + '"/>'),
				sourceItems = [];
            $R({
                type: "post",
                url: sURL,
                async: false,
                success: function (xhr) {
                    var returnXml = xhr.responseXML;
                    if (returnXml.selectSingleNode("RAD/Doc/Result/ResCode").text == "0") {
                        var xnSourceItems = returnXml.selectNodes("RAD/Doc/Data/DBSource/Item"),
							xnDBItem;
                        for (var i = 0; i < xnSourceItems.length; i++) {
                            xnDBItem = xnSourceItems[i];
                            sourceItems.push({
                                "text": xnDBItem.getAttribute("name"),
                                "value": xnDBItem.getAttribute("id")
                            });
                        }
                    } else {
                        alert("请检查当前控件数据库数据源配置，无法查询控件数据源！");
                    }
                },
                error: function (xhr) {
                    alert('Failure: ' + xhr.status);
                },
                data: xmlDoc,
                contentType: "text/xml"
            });
            return sourceItems;
        },
        getEvents: function () {
            var sEvents = this.heContent.getAttribute("onclick") && ' onclick ="'
					+ this.heContent.getAttribute("onclick") + '"'
					+ this.heContent.getAttribute("ondblclick") && ' ondblclick ="'
					+ this.heContent.getAttribute("ondblclick") + '"'
					+ this.heContent.getAttribute("onblur") && ' onblur ="'
					+ this.heContent.getAttribute("onblur") + '"'
					+ this.heContent.getAttribute("onkeypress") && ' onkeypress ="'
					+ this.heContent.getAttribute("onkeypress") + '"'
					+ this.heContent.getAttribute("onkeyup") && ' onkeyup ="'
					+ this.heContent.getAttribute("onkeyup") + '"'
					+ this.heContent.getAttribute("onchange") && ' onchange ="'
					+ this.heContent.getAttribute("onchange") + '"'
					+ this.heContent.getAttribute("onfocus") && ' onfocus ="'
					+ this.heContent.getAttribute("onfocus") + '"';
            return sEvents == null ? "" : sEvents;
        },
        cascade: function (sValue, element) {
            this.heContent.value != "undefined" && (this.heContent.value = sValue);
        },
        replaceTagName: function (tagName) {
            var attr;
            var attrs = this.heContent.attributes;
            var newElement = document.createElement(tagName);
            for (var i = 0, l = attrs.length; i < l; i++) {
                attr = attrs[i];
                if (attr.specified) {
                    newElement.setAttribute(attr.name, attr.value);
                }
            }
            return newElement;
        },
        bindState: function () {
            switch (this.state) {
                case "None":
                    this.setNone();
                    break;
                case "ReadOnly":
                    this.setReadOnly();
                    break;
                case "Hidden":
                    this.setHidden();
                    break;
                case "View":
                    this.setView();
                    break;
                case "Disabled":
                    this.setDisabled();
                    break;
                default: break;
            }
        },
        setNone: function () {

        },
        setReadOnly: function () {
            this.heContent.readOnly = true;
        },
        setHidden: function () {
            this.heContent.style.display = "none";
        },
        setView: function () {
            var heParent = this.heContent.parentNode;
            var label = this.replaceTagName("label");
            label.innerHTML = label.getAttribute("value");
            label.setAttribute("type", "label");
            //label.style.textAlign = "left";
            //label.style.marginLeft = "5px";
            //label.style.verticalAlign = "middle";
            heParent.appendChild(label);
            heParent.removeChild(this.heContent);
        },
        setDisabled: function () {
            this.heContent.disabled = true;
        },
        setDefaultValue: function (conStatus) {
            if (conStatus == undefined || conStatus == "0") {
                if (this.heContent.getAttribute("SysVariable")) {
                    switch (this.heContent.getAttribute("SysVariable")) {
                        case "CurrentTime":
                            this.heContent.value = SysVariable["CurrTime"];
                            break;
                        case "User":
                            this.heContent.value = SysVariable["UserId"];
                            break;
                        case "UserName":
                            this.heContent.value = SysVariable["UserName"];
                            break;
                        case "Department":
                            this.heContent.value = SysVariable["DeptId"];
                            break;
                        case "DepartmentName":
                            this.heContent.value = SysVariable["DeptName"];
                            break;
                    }
                }
            }
        }
    }),
	FormAnchor = $C.Create(FormControl, {
	    initialize: function (options, parent) {
	        options.type = "a";
	        options.sControl = '<a href="#" style="width:99%;height:99%;padding:0px;margin:0px;">link</a>';
	        this.callSuper(options, parent);
	        this.setText();
	        this.bindState();
	    },
	    setText: function () {
	        this.heContent.innerText = this.heContent.getAttribute("value");
	    }
	}),
	FormText = $C.Create(FormControl, {
	    initialize: function (options, parent) {
	        options.type = "text";
	        this.callSuper(options, parent);
	        /*var state = options.heContent.getAttribute("state");
	        switch (state) {
	        case "hidden":
	        this.heContent.style = "hidden";
	        case "disable":
	        this.heContent.disable = true;
	        case "readonly":
	        this.heContent.readonly = true;
	        default:
	        break;
	        }*/
	        (this.heContent.getAttribute("IsEmpty") && this.heContent.getAttribute("IsEmpty") == "true") && Valid.bind({
	            elem: this.heContent,
	            type: "NoEmpty",
	            msg: this.heContent.getAttribute("ErrorNotice") || "不能为空！",
	            evts: ["blur"]
	        });
	        (this.heContent.getAttribute("LengthCheck")) && Valid.bind({
	            elem: this.heContent,
	            type: "InBoundOfLength",
	            msg: this.heContent.getAttribute("ErrorMessage") || "长度不符合要求！",
	            evts: ["blur"]
	        });
	        this.heContent.getAttribute("IllegalityCharCheck") && Valid.bind({
	            elem: this.heContent,
	            type: "NoContainSpecialChar",
	            msg: this.heContent.getAttribute("NoticeMessage") || "包含特殊字符！",
	            evts: ["blur"]
	        });
	        this.heContent.getAttribute("FunctionName") && Valid.bind({
	            elem: this.heContent,
	            type: "FunctionName",
	            msg: this.heContent.getAttribute("FunctionName"),
	            evts: ["blur"]
	        });
	        this.bindState();
	    },
	    serialize: function () {
	        return '<input value="' + this.heContent.value + '" type="'
				+ this.type + '" DataSet="'
				+ this.heContent.getAttribute("DataSet") + '" DataTable="'
				+ this.heContent.getAttribute("DataTable")
				 + '" DataColumn="'
				+ this.heContent.getAttribute("DataColumn")
				+ this.getEvents() + '" />';
	    }
	}),
	FormPassword = $C.Create(FormControl, {
	    initialize: function (options, parent) {
	        options.type = "password";
	        this.callSuper(options, parent);
	        (this.heContent.getAttribute("IsEmpty") && this.heContent.getAttribute("IsEmpty") == "true") && Valid.bind({
	            elem: this.heContent,
	            type: "NoEmpty",
	            msg: this.heContent.getAttribute("ErrorNotice") || "不能为空！",
	            evts: ["blur"]
	        });
	        this.heContent.getAttribute("LengthCheck") && Valid.bind({
	            elem: this.heContent,
	            type: "InBoundOfLength",
	            msg: this.heContent.getAttribute("ErrorMessage") || "长度不符合要求！",
	            evts: ["blur"]
	        });
	        this.heContent.getAttribute("IllegalityCharCheck") && Valid.bind({
	            elem: this.heContent,
	            type: "NoContainSpecialChar",
	            msg: this.heContent.getAttribute("NoticeMessage") || "包含特殊字符！",
	            evts: ["blur"]
	        });
	        this.bindState();
	    },
	    serialize: function () {
	        return '<input value="' + this.value + '" type="' + this.type
				 + '" DataSet="' + this.heContent.getAttribute("DataSet")
				 + '" DataTable="'
				+ this.heContent.getAttribute("DataTable")
				 + '" DataColumn="'
				+ this.heContent.getAttribute("DataColumn") + '" />';
	    }
	}),
	FormHidden = $C.Create(FormControl, {
	    initialize: function (options, parent) {
	        options.type = "hidden";
	        this.callSuper(options, parent);
	    },
	    serialize: function () {
	        return '<input value="' + this.value + '" type="' + this.type
				 + '" DataSet="' + this.heContent.getAttribute("DataSet")
				 + '" DataTable="'
				+ this.heContent.getAttribute("DataTable")
				 + '" DataColumn="'
				+ this.heContent.getAttribute("DataColumn") + '" />';
	    }
	}),
	FormReset = $C.Create(FormControl, {
	    initialize: function (options, parent) {
	        options.type = "text";
	        this.callSuper(options, parent);
	        this.bindState();
	    }
	}),
	FormSubmit = $C.Create(FormControl, {
	    initialize: function (options, parent) {
	        options.type = "text";
	        this.callSuper(options, parent);
	        this.bindState();
	    }
	}),
	FormTextArea = $C.Create(FormControl, {
	    initialize: function (options, parent) {
	        //options.type = "textarea";
	        this.callSuper(options, parent);
	        var heContent = this.heContent;
	        if (options.type == "richeditor") {
	            var nicPanel = new nicEditor({ fullPanel: true }).panelInstance(this.heContent).nicPanel.elm,
						editPanel = $ET.nextElementSibling(nicPanel),
						nicHeight = nicPanel.offsetHeight,
						top = heContent.style.top,
						left = heContent.style.left,
						height = parseInt(heContent.style.height),
						editHeight = height - nicHeight - 8 + "px",
						editor = editPanel.children[0];
	            nicPanel.style.position = "absolute";
	            nicPanel.style.top = top;
	            nicPanel.style.left = left;
	            editPanel.style.position = "absolute";
	            editPanel.style.top = parseInt(top) + nicHeight + "px";
	            editPanel.style.left = left;
	            editPanel.style.maxHeight = height - nicHeight + "px";
	            //editPanel.style.height = height - nicHeight + "px";
	            //editor.style.height = editHeight;
	            editor.style.minHeight = editHeight;
	            this.editor = editor;
	        }
	        this.setText();
	        (heContent.getAttribute("IsEmpty") && heContent.getAttribute("IsEmpty") == "true") && Valid.bind({
	            elem: heContent,
	            type: "NoEmpty",
	            msg: heContent.getAttribute("ErrorNotice") || "不能为空！",
	            evts: ["blur"]
	        });
	        heContent.getAttribute("LengthCheck") && Valid.bind({
	            elem: heContent,
	            type: "InBoundOfLength",
	            msg: heContent.getAttribute("ErrorMessage") || "长度不符合要求！",
	            evts: ["blur"]
	        });
	        heContent.getAttribute("IllegalityCharCheck") && Valid.bind({
	            elem: heContent,
	            type: "NoContainSpecialChar",
	            msg: heContent.getAttribute("NoticeMessage") || "包含特殊字符！",
	            evts: ["blur"]
	        });
	        this.bindState();
	    },
	    serialize: function () {
	        return '<textarea value="' + (this.type == "textarea" ? this.heContent.value
						: escape($(this.editor).html())) + '" type="'
				+ this.type + '" DataSet="'
				+ this.heContent.getAttribute("DataSet") + '" DataTable="'
				+ this.heContent.getAttribute("DataTable")
				 + '" DataColumn="'
				+ this.heContent.getAttribute("DataColumn")
				+ this.getEvents() + '" ></textarea>';
	    },
	    setText: function () {
	        if (this.type == "textarea")
	            this.heContent.innerText = this.heContent.getAttribute("Value");
	        else
	            $(this.editor).html(unescape(this.heContent.getAttribute("Value")));
	    }
	}),
	FormButton = $C.Create(FormControl, {
	    initialize: function (options, parent) {
	        options.type = "button";
	        options.sControl = '<input type="button" value="" style="width:100%;height:100%;padding:0px;margin:0px;" />';
	        this.callSuper(options, parent);
	        this.bindState();
	    },
	    writeBeginTag: function () {
	        var sb = new StringBuilder();
	        sb.append("<input type=\"button\" ");
	        for (var attr in this.cfgData) { }
	        sb.append("/>");
	        return sb.serialize();
	    }
	}),
	FormSelect = $C.Create(FormControl, {
	    initialize: function (options, parent) {
	        options.type = "combobox";
	        this.callSuper(options, parent);
	        this.heContent.getAttribute("DataSourceType") && (this.cfgData.DataSourceType = this.heContent.getAttribute("DataSourceType"));
	        this.heContent.getAttribute("DataSourceContent") && (this.cfgData.DataSourceContent = this.heContent.getAttribute("DataSourceContent"));
	        this.heContent.getAttribute("DBValueColumn") && (this.cfgData.DBValueColumn = this.heContent.getAttribute("DBValueColumn"));
	        this.heContent.getAttribute("DBTextColumn") && (this.cfgData.DBTextColumn = this.heContent.getAttribute("DBTextColumn"));
	        this.heContent.getAttribute("DataSourceSQL") && (this.cfgData.DataSourceSQL = this.heContent.getAttribute("DataSourceSQL"));
	        this.setContent();
	        this.heContent.getAttribute("Value") && this.setValue();
	        (this.heContent.getAttribute("IsEmpty") && this.heContent.getAttribute("IsEmpty") == "true") && Valid.bind({
	            elem: this.heContent,
	            type: "NoEmpty",
	            msg: this.heContent.getAttribute("ErrorNotice") || "不能为空！",
	            evts: ["blur"]
	        });
	        this.heContent.getAttribute("cascadeCIds") && (this.cascadeCIds = this.heContent.getAttribute("cascadeCIds"));
	        typeof this.cascadeCIds != "undefined" && this.cascadeCIds != "" && $E.on(this.heContent, "change", function () {
	            this.cascadeHandle();
	        }, this);
	        this.bindState();
	    },
	    setContent: function () {
	        var data = this.cfgData;
	        if (data.DataSourceType == "0") {
	            var sSql = data.DataSourceSQL,
					vColumn = data.DBValueColumn,
					tColumn = data.DBTextColumn;
	            if (sSql && vColumn && tColumn) {
	                var sourceItems = this.getDBSource();
	                if (sourceItems)
	                    var srcItem;
	                for (var i = 0; i < sourceItems.length; i++) {
	                    srcItem = sourceItems[i];
	                    this.heContent.options.add(new Option(srcItem.text, srcItem.value));
	                }
	            }
	        } else if (data.DataSourceType == "1" && data.DataSourceContent) {
	            var dsList = data.DataSourceContent.split(';'),
					list;
	            for (var n = 0, l = dsList.length; n < l; n++) {
	                list = dsList[n].split(',');
	                this.heContent.options.add(new Option(list[0], list[1]));
	            }
	        }
	    },
	    setValue: function (value) {
	        var vals = (typeof value != "undefined") ? value : this.heContent.getAttribute("value"),
				boxes = this.heContent.children;
	        if (vals != "") {
	            for (var j = boxes.length - 1; j >= 0; j--) {
	                if (vals == boxes[j].value) {
	                    boxes[j].selected = true;
	                    break;
	                }
	            }
	        }
	    },
	    setReadOnly: function () {
	        $E.on(this.heContent, "change", function () {
	            this.oControl.setValue(this.value);
	        }, { value: this.heContent.getAttribute("value"), oControl: this });
	    },
	    setView: function () {
	        var sele = this.heContent;
	        var value = sele.value;
	        var display = "";
	        if (value != "") {
	            var options = sele.children;
	            for (var i = 0; i < options.length; i++) {
	                var option = options[i];
	                if (option.value == value) {
	                    display = option.innerText;
	                    break;
	                }
	            }
	        }

	        var heParent = sele.parentNode;
	        var label = this.replaceTagName("label");
	        label.innerHTML = display;
	        label.setAttribute("type", "label");
	        heParent.appendChild(label);
	        heParent.removeChild(sele);

	    },
	    serialize: function () {
	        var heObj = this.heContent;
	        return '<select cid="' + heObj.getAttribute("cid")
				 + '" Value="' + heObj.value + '" Text="'
				+ heObj.options[heObj.selectedIndex].text
				 + '" type="combobox" DataSet="'
				+ heObj.getAttribute("dataset")
				 + '" DataTable="'
				+ heObj.getAttribute("datatable")
				 + '" DbDataSource="'
				+ heObj.getAttribute("datasourcesql")
				 + '" DbValueColumn="'
				+ heObj.getAttribute("dbvaluecolumn")
				 + '" DbTextColumn="'
				+ heObj.getAttribute("dbtextcolumn")
				 + '" DataSourceType="'
				+ heObj.getAttribute("datasourcetype")
				 + '" DataMode="'
				+ heObj.getAttribute("datamode")
				 + '" ValueColumnName="'
				+ heObj.getAttribute("valuecolumn")
				 + '" TextColumnName="'
				+ heObj.getAttribute("textcolumn")
				+ this.getEvents() + '" />';
	    },
	    cascadeHandle: function (sValue, oElem) {
	        for (var k = 0, l = this.cascadeChild.length; k < l; k++) {
	            this.cascadeChild[k].cascade(this.heContent.value, this.heContent);
	        }
	    }
	}),
	FormRadio = $C.Create(FormControl, {
	    initialize: function (options, parent) {
	        options.type = "radio";
	        this.callSuper(options, parent);
	        this.heContent.getAttribute("DataSourceType") && (this.cfgData.DataSourceType = this.heContent.getAttribute("DataSourceType"));
	        this.heContent.getAttribute("DataSourceContent") && (this.cfgData.DataSourceContent = this.heContent.getAttribute("DataSourceContent"));
	        this.heContent.getAttribute("DBValueColumn") && (this.cfgData.DBValueColumn = this.heContent.getAttribute("DBValueColumn"));
	        this.heContent.getAttribute("DBTextColumn") && (this.cfgData.DBTextColumn = this.heContent.getAttribute("DBTextColumn"));
	        this.heContent.getAttribute("DataSourceSQL") && (this.cfgData.DataSourceSQL = this.heContent.getAttribute("DataSourceSQL"));
	        this.setContent();
	        this.heContent.getAttribute("Value") && this.setValue();
	        (this.heContent.getAttribute("IsEmpty") && this.heContent.getAttribute("IsEmpty") == "true") && Valid.bind({
	            elem: this.heContent,
	            type: "NoEmpty",
	            msg: this.heContent.getAttribute("ErrorNotice") || "不能为空！",
	            evts: ["blur"]
	        });
	        this.bindState();
	    },
	    setContent: function () {
	        var data = this.cfgData;
	        if (data.DataSourceType == "0") {
	            var sSql = data.DataSourceSQL,
					vColumn = data.DBValueColumn,
					tColumn = data.DBTextColumn;
	            if (sSql && vColumn && tColumn) {
	                var sourceItems = this.getDBSource();
	                if (sourceItems)
	                    var srcItem;
	                var heList = "";
	                for (var i = 0; i < sourceItems.length; i++) {
	                    srcItem = sourceItems[i];
	                    heList += "<div style='float:left;'>"
							+ srcItem.text
							 + "<input type='radio' name='radio_"
							+ this.cid + "' value='"
							+ srcItem.value + "' /></div>";
	                }
	                this.heContent.innerHTML = heList;
	            }
	        } else if (data.DataSourceType == "1") {
	            var dsList = data.DataSourceContent.split(';'),
					list;
	            var heList = "";
	            for (var n = 0, l = dsList.length; n < l; n++) {
	                list = dsList[n].split(',');
	                heList += "<div style='float:left;'>"
						+ list[0]
						 + "<input type='radio' name='radio_"
						+ this.cid + "' value='" + list[1]
						 + "' /></div>";
	            }
	            this.heContent.innerHTML = heList;
	        }
	    },
	    setReadOnly: function () {
	        boxes = this.heContent.children;
	        for (var i = 0, l = boxes.length; i < l; i++) {
	            $E.on(boxes[i].children[0], "click", function () {
	                this.setValue();
	            }, this);
	        }
	    },
	    setView: function () {
	        var boxes = this.heContent.children, text = "";
	        for (var i = 0, l = boxes.length; i < l; i++) {
	            if (boxes[i].children[0].checked == true) {
	                text = boxes[i].innerText;
	                break;
	            }
	        }
	        var heParent = this.heContent.parentNode;
	        var label = this.replaceTagName("label");
	        label.innerHTML = text;
	        label.setAttribute("type", "label");
	        //				label.style.textAlign = "left";
	        //				label.style.marginLeft = "5px";
	        heParent.appendChild(label);
	        heParent.removeChild(this.heContent);
	    },
	    setDisabled: function () {
	        boxes = this.heContent.children;
	        for (var i = 0, l = boxes.length; i < l; i++) {
	            boxes[i].children[0].disabled = true;
	        }
	    },
	    getValue: function () {
	        var boxes = this.heContent.children,
				vals = [];
	        var sVal = "";
	        var sText = "";
	        for (var i = boxes.length - 1; i >= 0; i--) {
	            if (boxes[i].children[0].checked == true) {
	                sVal = boxes[i].children[0].value;
	                sText = boxes[i].innerText;
	            }
	        }
	        return {
	            value: sVal,
	            text: sText
	        };
	    },
	    setValue: function (value) {
	        var vals = (typeof value == "string" && typeof value != "") ? value : this.heContent.getAttribute("value"),
				boxes = this.heContent.children;
	        if (vals != "") {
	            for (var j = boxes.length - 1; j >= 0; j--) {
	                if (vals == boxes[j].children[0].value) {
	                    boxes[j].children[0].checked = true;
	                    break;
	                }
	            }
	        } else {
	            for (var i = 0, l = boxes.length; i < l; i++) {
	                boxes[i].children[0].checked = false;
	            }
	        }
	    },
	    serialize: function () {
	        var heObj = this.heContent;
	        return '<div cid="'
				+ heObj.getAttribute("cid")
				 + '" Value="'
				+ this.getValue().value
				 + '" Text="'
				+ this.getValue().text
				 + '" type="radio" DataSet="'
				+ heObj.getAttribute("dataset")
				 + '" DataTable="'
				+ heObj.getAttribute("datatable")
				 + '" DbDataSource="" DbValueColumn="" DbTextColumn="" DataSourceType="" TextDataSource="" DataMode="'
				+ heObj.getAttribute("datamode")
				 + '" ValueColumnName="'
				+ heObj.getAttribute("valuecolumn")
				 + '" TextColumnName="'
				+ heObj.getAttribute("textcolumn")
				 + '"> </div>';
	    },
	    writeBeginTag: function () {
	        var sb = new StringBuilder();
	        sb.append("<input type=\"radio\" ");
	        for (var attr in this.cfgData) { }
	        sb.append("/>");
	        return sb.serialize();
	    },
	    writeContent: function () { },
	    writeEndTag: function () { }
	}),
	FormImg = $C.Create(FormControl, {
	    initialize: function (options, parent) {
	        options.type = "img";
	        options.sControl = '<img src="Form/imgs/image.png" style="width:100%;height:100%;" />';
	        this.callSuper(options, parent);
	        this.bindState();
	    },
	    writeBeginTag: function () {
	        var sb = new StringBuilder();
	        sb.append("<img ");
	        for (var attr in this.cfgData) { }
	        sb.append("/>");
	        return sb.serialize();
	    }
	}),
	FormCheckbox = $C.Create(FormControl, {
	    initialize: function (options, parent) {
	        this.name = options.name || "";
	        options.type = "checkbox";
	        options.sControl = this.name
					 + '<input type="checkbox" value="" style="width:100%;height:100%;" />';
	        this.callSuper(options, parent);
	        (this.heContent.getAttribute("IsEmpty") && this.heContent.getAttribute("IsEmpty") == "true") && Valid.bind({
	            elem: this.heContent,
	            type: "NoEmpty",
	            msg: this.heContent.getAttribute("ErrorNotice") || "不能为空！",
	            evts: ["blur"]
	        });
	        this.bindState();
	    },
	    onStart: function () {
	        this.parent.highlight(this.data, false);
	        this.drag.dropable(this.refreshDrops());
	    },
	    writeBeginTag: function () {
	        var sb = new StringBuilder();
	        sb.append("<input type=\"checkbox\" ");
	        for (var attr in this.cfgData) { }
	        sb.append("/>");
	        return sb.serialize();
	    },
	    setValue: function () {
	        this.cfgData.value == this.heContent.value && (this.heContent.checked = true);
	    },
	    getValue: function () {
	        return this.heContent.checked ? this.heContent.value : "";
	    },
	    serialize: function () {
	        return '<input value="' + this.value + '" type="'
				+ this.type + '" DataSet="'
				+ this.heContent.getAttribute("DataSet")
				 + '" DataTable="'
				+ this.heContent.getAttribute("DataTable")
				 + '" DataColumn="'
				+ this.heContent.getAttribute("DataColumn")
				+ this.getEvents() + '" />';
	    }
	}),
	FormCheckboxList = $C.Create(FormControl, {
	    initialize: function (options, parent) {
	        options.type = "checkboxlist";
	        this.callSuper(options, parent);
	        this.heContent.getAttribute("DataSourceType") && (this.cfgData.DataSourceType = this.heContent.getAttribute("DataSourceType"));
	        this.heContent.getAttribute("DataSourceContent") && (this.cfgData.DataSourceContent = this.heContent.getAttribute("DataSourceContent"));
	        this.heContent.getAttribute("DataSet") && (this.cfgData.DataSet = this.heContent.getAttribute("DataSet"));
	        this.heContent.getAttribute("DataTable") && (this.cfgData.DataTable = this.heContent.getAttribute("DataTable"));
	        this.heContent.getAttribute("DataColumn") && (this.cfgData.DataColumn = this.heContent.getAttribute("DataColumn"));
	        this.heContent.getAttribute("DBValueColumn") && (this.cfgData.DBValueColumn = this.heContent.getAttribute("DBValueColumn"));
	        this.heContent.getAttribute("DBTextColumn") && (this.cfgData.DBTextColumn = this.heContent.getAttribute("DBTextColumn"));
	        this.heContent.getAttribute("DataSourceSQL") && (this.cfgData.DataSourceSQL = this.heContent.getAttribute("DataSourceSQL"));
	        this.setContent();
	        this.heContent.getAttribute("Value") && this.setValue();
	        (this.heContent.getAttribute("IsEmpty") && this.heContent.getAttribute("IsEmpty") == "true") && Valid.bind({
	            elem: this.heContent,
	            type: "NoEmpty",
	            msg: this.heContent.getAttribute("ErrorNotice") || "不能为空！",
	            evts: ["blur"]
	        });
	        this.bindState();
	    },
	    setReadOnly: function () {
	        boxes = this.heContent.children;
	        for (var i = 0, l = boxes.length; i < l; i++) {
	            $E.on(boxes[i].children[0], "click", function () {
	                this.setValue();
	            }, this);
	        }
	    },
	    setView: function () {
	        var text = "";
	        var boxes = this.heContent.children;
	        for (var i = 0, l = boxes.length; i < l; i++) {
	            if (boxes[i].children[0].checked == true) {
	                if (text == "") {
	                    text = boxes[i].innerText;
	                } else {
	                    text = "、" + boxes[i].innerText;
	                }
	            }
	        }
	        var heParent = this.heContent.parentNode;
	        var label = this.replaceTagName("label");
	        label.innerHTML = text;
	        label.setAttribute("type", "label");
	        //				label.style.textAlign = "left";
	        //				label.style.marginLeft = "5px";
	        heParent.appendChild(label);
	        heParent.removeChild(this.heContent);
	    },
	    setDisabled: function () {
	        boxes = this.heContent.children;
	        for (var i = 0, l = boxes.length; i < l; i++) {
	            boxes[i].children[0].disabled = true;
	        }
	    },
	    getValue: function () {
	        var boxes = this.heContent.children,
				vals = [];
	        for (var i = boxes.length - 1; i >= 0; i--) {
	            if (boxes[i].children[0].checked == true) {
	                vals.push(boxes[i].children[0].value);
	            }
	        }
	        return vals.toString();
	    },
	    setValue: function (value) {
	        var vals = (typeof value == "string" && typeof value != "") ? value.split(",") : this.heContent.getAttribute("value").split(","),
				boxes = this.heContent.children;
	        if (vals.length > 0) {
	            for (var j = boxes.length - 1; j >= 0; j--) {
	                var val = boxes[j].children[0].value, isChecked = false;
	                for (var i = vals.length - 1; i >= 0; i--) {
	                    if (vals[i] == val) {
	                        isChecked = true;
	                        break;
	                    }
	                }
	                boxes[j].children[0].checked = isChecked;
	            }
	        } else {
	            for (var i = 0, l = boxes.length; i < l; i++) {
	                boxes[i].children[0].checked = false;
	            }
	        }
	    },
	    setContent: function () {
	        var data = this.cfgData;
	        if (data.DataSourceType == "0") {
	            var sSql = data.DataSourceSQL,
					vColumn = data.DBValueColumn,
					tColumn = data.DBTextColumn;
	            if (sSql && vColumn && tColumn) {
	                var sourceItems = this.getDBSource();
	                if (sourceItems) {
	                    var srcItem,
							sItems = "";
	                    for (var i = 0; i < sourceItems.length; i++) {
	                        srcItem = sourceItems[i];
	                        sItems += '<div style="float:left;">'
								+ srcItem.text
								 + '<input type="checkbox" value="'
								+ srcItem.value
								 + '" /></div>';
	                    }
	                    this.heContent.innerHTML = sItems;
	                }
	            }
	        } else if (data.DataSourceType == "1") {
	            var dsList = data.DataSourceContent.split(';'),
					list,
					sItems = "";
	            for (var n = 0, l = dsList.length; n < l; n++) {
	                list = dsList[n].split(',');
	                sItems += '<div style="float:left;">'
						+ list[0]
						 + '<input type="checkbox" value="'
						+ list[1] + '" /></div>';
	            }
	            this.heContent.innerHTML = sItems;
	        }
	    },
	    serialize: function () {
	        return '<div value="' + this.getValue()
				 + '" type="' + this.type + '" DataSet="'
				+ this.heContent.getAttribute("DataSet")
				 + '" DataTable="'
				+ this.heContent.getAttribute("DataTable")
				 + '" DataColumn="'
				+ this.heContent.getAttribute("DataColumn")
				+ this.getEvents() + '" />';
	    }
	}),
	FormLabel = $C.Create(FormControl, {
	    initialize: function (options, parent) {
	        options.type = "label";
	        options.sControl = '<label style="width:100%;height:100%;">Label</label>';
	        this.callSuper(options, parent);
	        this.bindState();
	    },
	    onStart: function () {
	        this.parent.highlight(this.data, false);
	        this.drag.dropable(this.refreshDrops());
	    },
	    writeBeginTag: function () {
	        var sb = new StringBuilder();
	        sb.append("<label ");
	        //				for (var attr in this.cfgData) {}
	        sb.append(">");
	        return sb.serialize();
	    },
	    writeContent: function () { },
	    writeEndTag: function () {
	        return "</label>";
	    },
	    setProp: function (propName, value) {
	        this.callSuper(propName, value);
	        propName == "value" && $ET.text(this.heContent, value);
	    },
	    setView: function () {

	    }
	}),
	FormDiv = $C.Create(FormControl, {
	    initialize: function (options, parent) {
	        this.childControls = [];
	        options.type = "div";
	        this.callSuper(options, parent);
	        this.isLayout = true;
	        this.bindState();
	    },
	    appendChild: function (frmControl) {
	        this.childControls.push(frmControl);
	    },
	    contains: function (control) {
	        var node = this.data;
	        cNode = control.data;
	        return node.contains(cNode);
	    },
	    writeBeginTag: function () {
	        var sb = new StringBuilder();
	        sb.append("<div type='div'");
	        sb.append(this.getProps());
	        sb.append(">");
	        return sb.serialize();
	    },
	    writeContent: function () { },
	    writeEndTag: function () {
	        return "</div>";
	    },
	    setView: function () {

	    }
	}),
	FormIframe = $C.Create(FormControl, {
	    initialize: function (options, parent) {
	        options.type = "iframe";
	        this.callSuper(options, parent);
	        this.bindState();
	    },
	    onStart: function () {
	        this.parent.highlight(this.data, false);
	        this.drag.dropable(this.refreshDrops());
	    },
	    writeBeginTag: function () {
	        var sb = new StringBuilder();
	        sb.append("<iframe ");
	        //			for (var attr in this.cfgData) {}
	        sb.append(">");
	        return sb.serialize();
	    },
	    writeContent: function () { },
	    writeEndTag: function () {
	        return "</iframe>";
	    },
	    setProp: function (propName, value) {
	        this.callSuper(propName, value);
	        propName == "value" && $ET.text(this.heContent, value);
	    },
	    setView: function () {

	    }
	}),

	FormDateTime = $C.Create(FormControl, {
	    initialize: function (options, parent) {
	        options.type = "datetime";
	        this.callSuper(options, parent);
	        this.cfgData.DataSet = this.heContent.getAttribute("DataSet");
	        this.cfgData.DataTable = this.heContent.getAttribute("DataTable");
	        this.cfgData.DataColumn = this.heContent.getAttribute("DataColumn");
	        (this.heContent.getAttribute("IsEmpty") && this.heContent.getAttribute("IsEmpty") == "true") && Valid.bind({
	            elem: this.heContent,
	            type: "NoEmpty",
	            msg: this.heContent.getAttribute("ErrorNotice") || "不能为空！",
	            evts: ["blur"]
	        });
	        this.bindState();
	    },
	    setOptions: function (options) { },
	    serialize: function () {
	        return '<input value="' + this.heContent.value + '" type="'
				+ this.type + '" DataSet="'
				+ this.heContent.getAttribute("DataSet")
				 + '" DataTable="'
				+ this.heContent.getAttribute("DataTable")
				 + '" DataColumn="'
				+ this.heContent.getAttribute("DataColumn")
				 + '" Layout="'
				+ this.heContent.getAttribute("Layout")
				+ this.getEvents() + '" Format="'
				+ this.heContent.getAttribute("Format") + '"/>';
	    },
	    setReadOnly: function () {
	        this.change();
	    },
	    setView: function () {
	        var label = this.change();
	        label.removeAttribute("class");
	    },
	    change: function () {
	        var input = this.heContent;
	        var td = this.heContent.parentNode;
	        var value = input.getAttribute("value");
	        var label = this.replaceTagName("label");
	        label.innerHTML = value;
	        label.setAttribute("type", "label");
	        td.appendChild(label);
	        td.removeChild(input);
	        return label;
	    },
	    setDisabled: function () {
	        var input = this.heContent;
	        input.removeAttribute("onfocus");
	        input.setAttribute("type", "text");
	        input.setAttribute("disabled", "disabled");
	    }
	}),
	FormUpload = $C.Create(FormControl, {
	    initialize: function (options, parent) {
	        options.type = "upload";
	        this.callSuper(options, parent);
	        this.heContent.innerHTML = "<input id='btnAdd' type='button' value='添加附件' />";
	        $E.on(this.heContent.children[0], "click", function () {
	            AddUploadFile(this.heContent);
	        }, this);
	        this.setValue(options.xnAttachment);
	        this.bindState();
	    },
	    setOptions: function (options) { },
	    setValue: function (xnAttachment) {
	        if (xnAttachment) {
	            var stateType = this.cfgData.ControlStateType,
					attachs = xnAttachment.childNodes,
					attach;
	            if (!attachs) {
	                return;
	            }
	            for (var i = attachs.length - 1; i >= 0; i--) {
	                attach = new Attachment();
	                attach.id = attachs[i].getAttribute("DbId");
	                attach.serverpath = attachs[i].getAttribute("ServicePathName");
	                attach.fileName = attachs[i].getAttribute("FileName");
	                attach.saveName = attachs[i].getAttribute("saveName");
	                attach.ext = attachs[i].getAttribute("Extension");
	                attach.isin = attachs[i].getAttribute("IsIn");
	                AddFileToControl(this.heContent, attach, stateType);
	            }
	        }
	    },
	    hideBtn: function () {
	        document.getElementById("btnAdd").setAttribute("style", "display:none");
	        var btns = document.getElementsByName("btnDelete");
	        for (var i = 0; i < btns.length; i++) {
	            var btn = btns[i];
	            btn.setAttribute("style", "display:none");
	        }
	    },
	    setView: function () {
	        this.hideBtn();
	    },
	    setReadOnly: function () {
	        this.hideBtn();
	    },
	    setDisabled: function () {
	        this.hideBtn();
	    },
	    getValue: function () {
	        var heChildren = this.heContent.children,
				sb = new StringBuilder();
	        sb.append("<Attachments>");
	        if (heChildren[1] && heChildren[1].children[0]) {
	            var hrRows = heChildren[1].children[0].rows,
					oTr;
	            for (var k = hrRows.length - 1; k >= 0; k--) {
	                oTr = hrRows[k],
						sb.append("<Attachment DbId= '"
							+ oTr.getAttribute("AttachId")
							 + "' ServicePathName='"
							+ oTr.getAttribute("AttachServerPath")
							 + "' FileName= '"
							+ oTr.getAttribute("AttachName")
							 + "' Extension= '"
							+ oTr.getAttribute("AttachExt")
							 + "' />");
	            }
	        }
	        sb.append("</Attachments>");
	        return sb.serialize();
	    },
	    serialize: function () {
	        var heObj = this.heContent;
	        return '<div type="upload" cid="'
				+ this.cid
				 + '" DataTable="'
				+ heObj.getAttribute("DataTable")
				 + '" PathClass="'
				 + (heObj.getAttribute("pathclass") ? heObj.getAttribute("pathclass") : "")
				 + '" SaveMode="'
				+ heObj.getAttribute("SaveMode")
				 + '" AttachTable="'
				+ heObj.getAttribute("AttachTable")
				 + '" DeleteFilesId="'
				 + (heObj.getAttribute("DeleteFilesId") ? heObj.getAttribute("DeleteFilesId") : "") + this.getEvents() + '" >'
				+ this.getValue() + '</div>';
	    }
	}),
	FormWebGrid = $C.Create(FormControl, {
	    initialize: function (options, parent) {
	        options.type = "webgrid";
	        this.callSuper(options, parent);
	        this.setValue(options);
	        this.bindState();
	    },
	    setValue: function (options) {
	        var cid = options.cid,
				heTable = jQuery(options.heControl),
				colNames = eval("" + heTable.attr("colNames") + ""),
				colModel = eval("" + heTable.attr("colModel") + ""),
				colData = eval("" + heTable.attr("TableColumnData") + ""),
				lastSelId, pagerId = "#pager_" + cid, nextRowId, coMod,
				cm = colModel.length, modAttrs, dataSource,
				val, valStr, valStrs = "";
	        for (; cm--; ) {
	            coMod = colModel[cm],
					modAttrs = colData[cm];
	            if (modAttrs["DataSourceType"] == "0") {
	                dataSource = this.getDBSource(modAttrs["DbSourceSQL"], modAttrs["DbValueName"], modAttrs["DbTextName"]),
						val = dataSource.length;
	                for (; val--; ) {
	                    valStr = dataSource[val]["value"] + ":"
								+ dataSource[val]["text"];
	                    valStrs += valStrs ? ";" + valStr : valStr;
	                }
	                !coMod["editoptions"] && (coMod["editoptions"] = {});
	                coMod["editoptions"]["value"] = valStrs;
	            }
	        }
	        var pageDiv = document.createElement("div");
	        pageDiv.id = "pager_" + cid;
	        document.body.appendChild(pageDiv);
	        colNames.push("row_id");
	        colModel.push({ name: "row_id", index: "row_id", hidden: true });
	        heTable.attr("id", cid).jqGrid({
	            datatype: "local",
	            width: heTable.width(),
	            height: heTable.height() - 50,
	            colNames: colNames,
	            colModel: colModel,
	            caption: "",
	            pager: pagerId,
	            multiselect: heTable.attr("hascheckboxcol") == "1" ? true : false,
	            rownumbers: heTable.attr("hasserialnum") == "1" ? true : false,
	            onSelectRow: function (id) {
	                if (id) {
	                    if (id !== lastSelId) {
	                        heTable.jqGrid('saveRow', lastSelId, false);
	                        heTable.jqGrid('editRow', id, true);
	                        lastSelId = id;
	                    } else if (id === lastSelId) {
	                        heTable.jqGrid('editRow', id, true);
	                    }
	                    if (heTable.attr("timecols")) {
	                        var cols = heTable.attr("timecols").split(";"),
									col, rows = heTable[0].rows, currow = null,
									selrow = heTable[0].p.selrow;
	                        for (var irow = 1, irowlen = rows.length; irow < irowlen; irow++) {
	                            if (rows[irow].id == selrow) {
	                                currow = rows[irow];
	                                break;
	                            }
	                        }
	                        for (var icol = 0, icolen = cols.length; icol < icolen; icol++) {
	                            col = cols[icol].split(",");
	                            $E.on(currow.children[col[0]].children[0], "focus", function (evt, type) {
	                                WdatePicker({ isShowClear: true, dateFmt: (type == "date" ? 'yyyy-MM-dd' : 'yyyy-MM-dd HH:mm:ss') });
	                            }, null, col[1]);
	                        }
	                    }
	                }
	            }
	        });
	        var i = 0, j = 0, m = 0, gridData = [], gridRow,
				gridRows = options.xnRows ? options.xnRows.childNodes : [],
				rowsLen = gridRows.length, cellsLen, cells, name, names = {};
	        for (; i < rowsLen; i++) {
	            if (gridRows[i].nodeType !== 1)
	                continue;
	            cells = gridRows[i].childNodes,
					m = 0,
					gridRow = {};
	            for (j = 0, cellsLen = cells.length; j < cellsLen; j++) {
	                if (cells[j].nodeType !== 1)
	                    continue;
	                name = colModel[m++].name;
	                gridRow[name] = cells[j].text;
	                names[name] = "";
	            }
	            name = colModel[m].name;
	            gridRow[name] = gridRows[i].attributes[0].value;
	            names[name] = "-1";
	            gridData.push(gridRow);
	        }
	        for (var k = 0, dataLen = gridData.length; k < dataLen; k++)
	            heTable.jqGrid('addRowData', k + 1, gridData[k]);
	        nextRowId = heTable[0].rows.length;
	        heTable.jqGrid("navGrid", pagerId, {
	            search: false,
	            refresh: false,
	            edit: false,
	            addfunc: function () {
	                heTable.jqGrid('addRowData', nextRowId++, names);
	            },
	            delfunc: function () {
	                var curObj = heTable[0].p, curRowIds = curObj.selarrrow.length ? curObj.selarrrow : [curObj.selrow],
								curRowId, rowData, rowid;
	                for (var i = 0; i < curRowIds.length; i++) {
	                    curRowId = curRowIds[i],
							rowData = heTable.getRowData(curRowId),
							rowid = rowData["row_id"];
	                    curObj.DelRowsId ? (curObj.DelRowsId += rowid ? rowid + "," : "")
									: (curObj.DelRowsId = rowid ? rowid + "," : "");
	                    heTable.jqGrid("delRowData", curRowId);
	                }
	                curObj.selrow = null;
	                curObj.selarrrow = [];
	                !coMod["editoptions"] && (coMod["editoptions"] = {});
	                coMod["editoptions"]["value"] = valStrs;
	            }
	        }).navButtonAdd(pagerId, {
	            caption: "",
	            buttonicon: "ui-icon-check",
	            onClickButton: function () {
	                heTable.jqGrid('saveRow', lastSelId, false);
	            },
	            position: "third"
	        });
	        var bigBox = jQuery("#gbox_" + cid);
	        bigBox.css({ top: heTable.css("top"), left: heTable.css("left"), position: "absolute" });
	        (!(bigBox.prev().length && bigBox.prev()[0].hasAttribute("type"))) && bigBox.prev().remove();
	        heTable.css({ height: 0, width: 0, left: 0, top: 0 });
	    },
	    getValue: function () {
	        var rowArr = jQuery(this.heContent).getRowData(),
				rows = "<rows>",
				row,
				name;
	        for (var i = 0, len = rowArr.length; i < len; i++) {
	            row = rowArr[i];
	            rows += "<row id='"
					 + (row["row_id"] != "" ? row["row_id"] : "-1") + "'>";
	            for (name in row) {
	                if ("row_id" == name)
	                    continue;
	                rows += "<cell>" + row[name] + "</cell>";
	            }
	            rows += "</row>";
	        }
	        return rows + "</rows>";
	    },
	    setOptions: function (options) { },
	    writeBeginTag: function () { },
	    writeContent: function () { },
	    writeEndTag: function () { },
	    serialize: function () {
	        var heObj = this.heContent;
	        return '<table cid="' + this.cid
					 + '" type="' + this.type
					 + '" DelRowsId="' + (heObj.p.DelRowsId ? heObj.p.DelRowsId : "") + '">'
					+ unescape(heObj.getAttribute("columns"))
					+ this.getValue() + '</table>';
	    }
	}),
	FormGrid = $C.Create(FormControl, {
	    initialize: function (options, parent) {
	        this.childControls = [];
	        this.callSuper(options, parent);
	        this.isLayout = true;
	        this.bindState();
	    },
	    appendChild: function (frmControl) {
	        this.childControls.push(frmControl);
	    },
	    make: function (rect, heContainer) {
	        var sControl = '',
				heControl = document.createElement("div");
	        tabItem.data = new ReportDesign({
	            xnSheet: xnSheet,
	            name: tempName,
	            toolBarContainer: this.heToolBar,
	            toolBoxContainer: this.heFrmToolBox,
	            heTemplate: heTemplate
	        }, this);
	        $ET.setCSS(heControl, {
	            position: "absolute",
	            left: rect.left + "px",
	            top: rect.top + "px",
	            width: rect.width + "px",
	            height: rect.height + "px",
	            zIndex: 300
	        });
	        $E.on(heControl, "click", this.click, this);
	        return heControl;
	    },
	    serialize: function () {
	        alert(11);
	    }
	}),
	FormTab = $C.Create(FormControl, {
	    initialize: function (options, parent) {
	        this.childControls = [];
	        this.callSuper(options, parent);
	        this.tab = new Tab({
	            navs: ET.firstElementChild(this.heContent),
	            navs_style: {
	                width: 30,
	                height: 20
	            },
	            panelType: "3",
	            panels: ET.lastElementChild(this.heContent),
	            panels_style: {
	                width: 50,
	                height: 50
	            },
	            layout: "T",
	            collapse: false,
	            active: 0,
	            toggle: "click",
	            onBeforeToggle: F.bind(this, function () { }),
	            onAfterToggle: F.bind(this, function () { }),
	            target: this.heContent,
	            container: null
	        });

	        var FormTabItem;
	        this.heContent.style.border = "1px solid gray";
	        for (var i = 0; i < this.tab.tabItems.length; i++) {
	            FormTabItem = this.tab.tabItems[i];
	            FormTabItem.type = "TabItem";
	            FormTabItem.appendChild = this.appendChild;
	            FormTabItem.childControls = [];
	        }

	        this.isLayout = true;
	        //this.bindState();
	    },
	    appendChild: function (frmControl) {
	        this.childControls.push(frmControl);
	    },
	    serialize: function () {
	        alert(11);
	    },
	    setView: function () {

	    }
	}),
	FormTable = $C.Create(FormControl, {
	    initialize: function (options, parent) {
	        this.childControls = [];
	        this.callSuper(options, parent);
	        this.heTable = this.heContent.children[0];
	        this.isLayout = true;
	        this.heContent.style.left = parseInt(this.heContent.style.left) + 12 + "px";
	        this.heContent.style.top = parseInt(this.heContent.style.top) + 15 + "px";
	        this.bindState();
	    },
	    appendChild: function (frmControl) {
	        this.childControls.push(frmControl);
	    },
	    serialize: function () {
	        alert(11);
	    },
	    setView: function () {

	    }
	}),
	FormCountersign = $C.Create(FormControl, {
	    initialize: function (options, parent, flowId) {
	        this.flowId = flowId;
	        options.type = "countersign";
	        this.callSuper(options, parent);
	        var html = this.showContent(options, this.state, options.conStatus);
	        this.heContent.innerHTML = html;
	        this.bindState();
	    },
	    setView: function () {
	        var txts = this.heContent.selectNodes("//textarea");
	        for (var i = 0; i < txts.length; i++) {
	            var area = txts[i];
	            area.setAttribute("readonly", "readonly");
	        }
	    },
	    setReadOnly: function () {
	        var txts = this.heContent.selectNodes("//textarea");
	        for (var i = 0; i < txts.length; i++) {
	            var area = txts[i];
	            area.setAttribute("readonly", "readonly");
	        }
	    },
	    setDisabled: function () {
	        var txts = this.heContent.selectNodes("//textarea");
	        for (var i = 0; i < txts.length; i++) {
	            var area = txts[i];
	            area.setAttribute("disabled", "disabled");
	        }
	    },
	    showContent: function (options, state, isNew) {	// 0 新建流程
	        var div = options.heContent;
	        var counterInfos = div.lastChild;

	        var html = "";
	        if (this.hasNoState() == true) {
	            html += this.getMyTable(div);
	        }
	        if (isNew != "0") {
	            html += this.separator();
	        }
	        if (counterInfos != null) {
	            if (counterInfos.children.length > 0) {
	                var counterInfo = counterInfos.children[counterInfos.children.length - 1];
	                html += this.lastSign(counterInfo);
	            }
	        }
	        html += "</div>";
	        return html;
	    },
	    hasNoState: function () {
	        // 没有表单状态时, 提交本步骤的数据
	        var state = this.state;
	        if (state != "ReadOnly" && state != "Hidden" && state != "Disabled" && state != "View") {
	            return true;
	        }
	        return false;
	    },
	    separator: function () {
	        // 中间空行
	        var html = '<table width="100%"><tr style="line-height: 40px;">'
			 + '<td colspan="2" style="border-bottom: #ededed 1px solid;  '
			 + 'border-left: 0px; border-top: 0px; border-right: #ededed 1px solid" valign="center"  style="text-align: bottom;" align="left">'
			 + '<font  size="+1">上一步处理信息 :</font></td></tr></table>';
	        return html;
	    },
	    lastSign: function (counterInfo) {
	        var content = counterInfo.getAttribute("content");
	        // 上一个签收人 的签收意见
	        var table = '<div style="font-family:宋体;font-size: 12px;width:99%; padding:0px;margin:0px;border: #90a5c2 1px solid;overflow:auto;">'
				 + '  <table style="width: 100%; border-collapse: collapse; table-layout: fixed; height: 76px; font-size: 13px" border="0" cellspacing="0" cellpadding="0">'
				 + '   <tbody>'
				 + '   <tr>'
				 + '    <td style="border-bottom: #90a5c2 1px solid">'
				 + '     <textarea readonly="readonly" style="width: 98%; height: 100%">' + (content == null ? '' : content) + '</textarea>'
				 + '    </td>'
				 + '   </tr>'
				 + '   </tbody>'
				 + '  </table>';
	        table += this.infoTable(counterInfo);
	        return table;
	    },
	    getMyTable: function (div) {
	        // 当前签收人的表格 
	        var table = '<div style="font-family:宋体;font-size: 12px;width:99%;height:99%;padding:0px;margin:0px;border: #90a5c2 1px solid;overflow:auto;">'
				 + '  <table style="width: 100%; border-collapse: collapse; table-layout: fixed; height: 100px; font-size: 13px" border="0" cellspacing="0" cellpadding="0">'
				 + '   <tbody>'
				 + '   <tr>'
				 + '    <td style="border-bottom: #90a5c2 1px solid">'
				 + '     <textarea id="myTextarea" style="width: 100%; height: 100%"></textarea>'
				 + '    </td>'
				 + this.getPic(div)
				 + '   </tr>'
				 + '   </tbody>'
				 + '  </table>';
	        return table;
	    },
	    infoTable: function (countersignInfo) {
	        var time = countersignInfo.getAttribute("time");
	        var userName = countersignInfo.getAttribute("username");
	        var stepName = countersignInfo.getAttribute("stepName");

	        var counterSignTable = '<table style="border: #ededed 1px solid; width: 100%;'
				 + 'border-collapse: collapse; table-layout: fixed; font-size: 13px; border-top: #ededed 1px solid"'
				 + 'border="1" cellspacing="0" cellpadding="0">'
				 + '   <tbody>'
	        //				 + '   <tr trtype="countersigninfo">'
	        //				 + '    <td style="border-bottom: #ededed 1px solid; border-left: 0px; border-top: 0px; border-right: #ededed 1px solid" valign="top" colspan="2" align="left">'
	        //				 + '     <div style="width: 99%; text-overflow: ellipsis; overflow: hidden">审核意见：'
	        //				 + content +'</div>'
	        //				 + '    </td>'
	        //				 + '   </tr>'
				 + '   <tr style="line-height: 25px;">'
				 + '    <td  valign="center" align="left">'
				 + '处理节点：' + stepName + '</td>'
				 + '   </tr>'
				 + '   <tr style="line-height: 25px;">'
				 + '    <td valign="center" align="right">审批人:'
				 + userName + '</td>'
				 + '    <td valign="center" align="middle">'
				 + '审批时间:' + time + '</td>'
				 + '   </tr>'
				 + '   </tbody>'
				 + '  </table>';
	        return counterSignTable;
	    },
	    getPic: function (div) {
	        var flowId = window.parent.document.getElementById("flowId").value;
	        // 常用语图片
	        var cid = div.getAttribute("cid");
	        var html = '<td style="width:40px;text-align:right;" valign="center">'
			 + '<img src="../../Design/skin/blue/images/words.jpg"'
			 + 'onclick=\"fInitUsuallyUsedWords(\'' + flowId + '\',event, \'wordDiv_' + cid + '\');\"'
			 + '/>'
			 + '</td>';
	        return html;
	    },
	    serialize: function () {
	        var heObj = this.heContent,
				sStepId = "",
				sWorkFlowNodeName = "",
				value = "";
	        if (heObj.getElementsByTagName("textarea")[0]) {
	            value = heObj.getElementsByTagName("textarea")[0].value;
	        }
	        if (parent && parent.document && parent.document.getElementById("EventStepId") && parent.document.getElementById("EventStepId").value) {
	            sStepId = parent.document.getElementById("EventStepId").value;
	        }
	        if (parent && parent.document && parent.document.getElementById("WorkFlowNodeName") && parent.document.getElementById("WorkFlowNodeName").value) {
	            sWorkFlowNodeName = parent.document.getElementById("WorkFlowNodeName").value;
	        }
	        var xml = '<div type="countersign" cid="' + this.cid + '" DataTable="' + this.heContent.getAttribute("DataTable") + '">'
				+ '<CountersignInfos>';
	        if (this.hasNoState() == true) {
	            xml += '<CountersignInfo DbId="" StepId="' + sStepId + '" value="' + value + '" WorkFlowNodeName="' + sWorkFlowNodeName + '"/>';
	        }
	        xml += '</CountersignInfos></div>';
	        return xml;
	    }
	}),
	FormSheet = $C.Create({
	    initialize: function (options, frmRun) {
	        this.frmRun = frmRun;
	        this.heContainer = options.container;
	        var xnSheet = options.xnSheet;
	        this.xnSheet = xnSheet;
	        this.id = options.id || xnSheet.getAttribute("id");
	        this.name = options.name || xnSheet.getAttribute("name");
	        this.heContainer.innerHTML = xnSheet.selectSingleNode("div").xml;
	        this.dataControl = {};
	        this.cascade = [];
	        this.dsControl = [];
	        this.trace = xnSheet.getAttribute("trace");
	        this.dsId = xnSheet.getAttribute("dsid");
	        this.cid = xnSheet.getAttribute("cid");
	        this.dataKey = xnSheet.getAttribute("dataKey");
	        //当前表单数据的状态：0:添加；1:编辑
	        this.recordStatus = (this.dataKey == undefined || this.dataKey == null
						|| (this.dataKey == "" || this.dataKey == "0") ? "0" : "1");
	        this.mapControl(this.heContainer.firstChild, null, null, this.recordStatus, frmRun.flowId);
	        this.script = {};
	        var xnScript = xnSheet.selectSingleNode("script");
	        if (xnScript != null) {
	            xnScript.childNodes[0] != null && (this.script["FE"] = xnScript.childNodes[0].text);
	            xnScript.childNodes[1] != null && (this.script["BE"] = xnScript.childNodes[1].text);
	            xnScript.childNodes[2] != null && (this.script["C"] = xnScript.childNodes[2].text);
	            xnScript.childNodes[3] != null && (this.script["UC"] = xnScript.childNodes[3].text);
	        }
	        this.heContainer.style.display = "";
	        this.frmDesinContainer = this.heContainer.children[0];
	        this.frmDesin = this.frmDesinContainer.children[0];
	        this.frmDesin.style.border == "1px solid blue" && (this.frmDesin.style.borderWidth = "0px");
	        for (var i = 0, len = this.cascade.length; i < len; i++) {
	            this.bridgeCascade(this.cascade[i]);
	        }
	    },
	    setOptions: function (options) {
	        this.id = options.id;
	        this.tdWidth = options.tdWidth || 49;
	        this.tdBorderWidth = options.tdBorderWidth || 1;
	        this.trHeight = options.trHeight || 49;
	    },
	    mapControl: function (heControl, pControl, heTd, recordStatus, flowId) {
	        var sType = heControl.getAttribute("type");
	        if (!sType) return;
	        var j,
				len,
				cid = heControl.getAttribute("cid"),
				control, conArr,
				opts = {
				    cid: cid,
				    heControl: heControl,
				    heContent: heControl,
				    type: sType,
				    state: heControl.getAttribute("state"),
				    conStatus: recordStatus
				};
	        switch (sType) {
	            case "a":
	                control = new FormAnchor(opts, pControl);
	                return;
	            case "img":
	                control = new FormImg(opts, pControl);
	                return;
	            case "button":
	                control = new FormButton(opts, pControl);
	                return;
	            case "label":
	                control = new FormLabel(opts, pControl);
	                return;
	            case "text":
	                control = new FormText(opts, pControl);
	                break;
	            case "textarea":
	            case "richeditor":
	                control = new FormTextArea(opts, pControl);
	                break;
	            case "combobox":
	                control = new FormSelect(opts, pControl);
	                break;
	            case "checkbox":
	                control = new FormCheckbox(opts, pControl);
	                break;
	            case "checkboxlist":
	                control = new FormCheckboxList(opts, pControl);
	                break;
	            case "radio":
	                control = new FormRadio(opts, pControl);
	                break;
	            case "datetime":
	                control = new FormDateTime(opts, pControl);
	                break;
	            case "upload": 
	                {
	                    opts.xnAttachment = this.xnSheet.selectSingleNode(".//div[@cid=\"" + cid + "\"]/Attachments");
	                    control = new FormUpload(opts, pControl);
	                    break;
	                }
	            case "webgrid": 
	                {
	                    opts.xnRows = this.xnSheet.selectSingleNode(".//table[@cid=\"" + cid + "\"]/rows");
	                    control = new FormWebGrid(opts, pControl);
	                    break;
	                }
	            case "div": 
	                {
	                    control = new FormDiv(opts, pControl), conArr = $A.makeArray(heControl.children);
	                    for (j = 0, len = conArr.length; j < len; j++) {
	                        this.mapControl(conArr[j], control, null, recordStatus, flowId);
	                    }
	                    delete conArr;
	                    return;
	                }
	            case "tab": 
	                {
	                    control = new FormTab(opts, pControl), conArr = $A.makeArray();
	                    var tab = control.tab, tabItem, k, hePanel, jLen, kLen;
	                    for (j = 0; j < tab.tabItems.length; j++) {
	                        tabItem = tab.tabItems[j];
	                        hePanel = tabItem.panel;
	                        for (k = 0, kLen = hePanel.children.length; k < kLen; k++) {
	                            this.mapControl(hePanel.children[k], tabItem, flowId);
	                        }
	                    }

	                    return;
	                }
	            case "table": 
	                {
	                    control = new FormTable(opts, pControl);
	                    var oTable = control.heTable,
						    tBody = oTable.tBodies[0],
						    rLen = tBody.rows.length,
						    cLen,
						    oTd,
						    i = 0,
						    k,
						    j,
						    len;
	                        for (; i < rLen; i++) {
	                            oTr = tBody.rows[i];
	                            for (k = 0, cLen = oTr.cells.length; k < cLen; k++) {
	                                oTd = oTr.cells[k];
	                                for (j = 0, len = oTd.children.length; j < len; j++) {
	                                    this.mapControl(oTd.children[j], control, null, recordStatus, flowId);
	                                }
	                            }
	                        }
	                    return;
	                }
	            case "grid": 
	                {
	                    control = new FormGrid(opts, pControl);
	                    for (var oTr, i = 0, cLen = heControl.cells.length; i < len; i++) {
	                        oTd = heControl.cells[i];
	                        for (j = 0, len = oTd.children.length; j < len; j++) {
	                            this.mapControl(oTd.children[j], control, null, recordStatus, flowId);
	                        }
	                    }
	                    break;
	                }
	            case "iframe": 
	                {
	                    control = new FormIframe(opts, pControl);
	                    break;
	                }
	            case "countersign": 
	                {
	                    control = new FormCountersign(opts, pControl, flowId);
	                    break;
	                }
	            default:
	                break;
	        };
	        this.dataControl[cid] = control;
	        typeof control.cascadeCIds != "undefined" && control.cascadeCIds != "" && this.cascade.push(control);
	    },
	    getControlValue: function (cid) {
	        var oControl = this.dataControl[cid];
	        return oControl.getValue();
	    },
	    bridgeCascade: function (crc) {
	        if (!crc) {
	            return;
	        }
	        var cids = crc.cascadeCIds.split(","),
				j = 0,
				clen = cids.length,
				cc;
	        for (; j < clen; j++) {
	            cc = this.dataControl[cids[j]];
	            crc.cascadeChild.push(cc);
	        }
	    },
	    serialize: function () {
	        var sb = new StringBuilder();
	        sb.append("<sheet dsid=\"" + this.dsId + "\"  id=\""
					+ this.id + "\" cid=\"" + this.cid + "\" name=\""
					+ this.name + "\" dataKey=\"" + this.dataKey
					 + "\">");
	        for (var name in this.dataControl) {
	            sb.append(this.dataControl[name].serialize());
	        }
	        sb.append("</sheet>");
	        return sb.serialize();
	    }
	}),
	FormRun = $C.Create({
	    initialize: function (options) {
	        this.container = typeof options.container == "string" ? document.getElementById(options.container) : options.container;
	        this.heHeader = this.container.children[0];
	        this.heContent = this.container.children[1];
	        this.heFooter = this.container.children[2];
	        options.flowId && (this.flowId = options.flowId);
	        this.heBtnOK = ET.firstElementChild(this.heFooter);
	        this.heBtnCancel = ET.lastElementChild(this.heFooter);
	        if (options.isView) this.hiddenBtn();
	        this.runTab = this.heContent.children[0];
	        this.singleHidden = options.singleHidden || false;
	        var size = P.viewSize(), iCH,
					iH = options.height, iW = options.width;
	        iH > 0 || (iH = size.height);
	        iW > 0 || (iW = size.width);
	        iH > 0 && (this.container.style.height = iH + "px");
	        iCH = iH - this.heFooter.offsetHeight - this.heHeader.offsetHeight;
	        iCH > 0 && (this.heContent.style.height = iCH + "px");

	        this.name = options.name;
	        this.type = "form";
	        var xdForm = this.xdForm = options.xdForm ? options.xdForm : null,
				xnSheets = xdForm.selectSingleNode("RAD/Doc/Data/sheets");
	        if (xnSheets.childNodes.length > 0) {
	            this.tab = new Tab({
	                navs: this.runTab.children[0],
	                navs_style: {
	                    width: this.runTab.clientWidth,
	                    height: this.singleHidden ? 0 : 20
	                },
	                panelType: "3",
	                panels: this.runTab.children[1],
	                panels_style: {
	                    width: this.runTab.clientWidth,
	                    height: iCH - 20
	                },
	                layout: "T",
	                collapse: false,
	                active: 0,
	                toggle: "click",
	                onBeforeToggle: F.bind(this, this.onBeforeToggle),
	                onAfterToggle: F.bind(this, this.onAfterToggle),
	                target: this.runTab,
	                container: null
	            });
	            this.sheets = {};
	            this.add(xnSheets.childNodes, this);
	            this.loadScript(xnSheets.selectNodes(".//sheet")[0].selectSingleNode(".//script"));
	            this.xnDatasource = xnSheets.lastChild;
	            E.on(this.heFooter.children[0], "click", this.save, this);
	            E.on(this.heFooter.children[this.heFooter.children.length - 1], "click", this.close, this);
	        }
	        E.on(window, "resize", this.resize, this);
	    },
	    loadScript: function (xnScript) {
	        var script = document.createElement("script");
	        var div = document.createElement("div");
	        div.innerHTML = "a";
	        script.type = "text/javascript";
	        var commitJS = unescape(xnScript.selectSingleNode(".//commit").text);
	        script.text = unescape(xnScript.selectSingleNode(".//frontend").text)
					 + unescape(xnScript.selectSingleNode(".//backEnd").text)
					 + "function commit(){" + (commitJS || "return true;") + "}"
					 + "function afterCommit(){" + unescape(xnScript.selectSingleNode(".//uncommit").text) + "}";
	        document.body.appendChild(script);
	    },
	    close: function () { },
	    resize: function (iW, iH) {
	        var size;
	        if (!iH || !iW) {
	            size = P.viewSize();
	            iH > 0 || (iH = size.height);
	            iW > 0 || (iW = size.width);
	        }
	        this.container.style.height = iH + "px";

	        //this.container.style.width = iW + "px";
	        var iCH = iH - this.heHeader.offsetHeight - this.heFooter.offsetHeight,
					iPsH = iCH - this.tab.heNavs.offsetHeight;
	        this.heContent.style.height = iCH + "px";
	        this.heContent.style.width = "100%";
	        /*				if(this.tab.activeTab.scollWidth > this.tab.hePanels.clientWidth){
	        iPsH = iPsH - 9;
	        } */
	        this.tab.hePanels.style.height = iPsH + "px";
	        this.tab.hePanels.style.width = "100%";

	    },
	    add: function (xnSheet) {
	        if (xnSheet.length) {
	            for (var i = 0, len = xnSheet.length; i < len; i++) {
	                if (xnSheet[i].nodeType == 1) {
	                    this.add(xnSheet[i]);
	                }
	            }
	        } else {
	            if (xnSheet.nodeType != 1) {
	                return;
	            }
	            var frmName = xnSheet.getAttribute("name"),
					id = xnSheet.getAttribute("ClientId"),
					container = document.createElement("div"),
					tabItem;
	            container.className = "frmContainer";
	            tabItem = this.tab.add(frmName, container);
	            tabItem.data = new FormSheet({
	                id: id,
	                xnSheet: xnSheet,
	                name: frmName,
	                container: container
	            }, this);
	            this.sheets[frmName] = tabItem.data;
	        }
	    },
	    setOptions: function (options) { },
	    onBeforeToggle: function (evt, tabItem, preActTab) { },
	    onAfterToggle: function (evt, tabItem, preActTab) {
	        var design = tabItem.data;
	        this.activeDesign = design;
	        if (!this.activeTab) {
	            this.activeTab = tabItem;
	            this.activeTab.show();
	        } else if (this.activeTab != tabItem) {
	            this.activeTab.hidden();
	            this.activeTab = tabItem;
	            this.activeTab.show();
	        }
	    },
	    serialize: function () {
	        var s = "<sheets name=\"\" id=\"\" activicefrmid=\"" + this.tab.activeTab.data.id + "\">";
	        for (var name in this.sheets) {
	            s += this.sheets[name].serialize();
	        }
	        s += "</sheets>";
	        return s;
	    },
	    getControlValue: function (cid) {
	        var oControl = this.dataControl[cid];
	        return oControl.getValue();
	    },
	    save: function (opts) {
	        var _opts = opts, _returnVal = "";
	        if (this.commitValid() && commit()) {
	            var sXml = this.serialize(),
					_this = this,
					docXml = $X.createBase(sXml);
	            $Ajax({
	                type: "post",
	                url: "formRunAction.action?operType=2",
	                async: false,
	                success: function (xhr, data) {
	                    var strWar = "表单提交成功！",
							blnReCommit = true,
							_blnAlert = blnClose = true,
							resCode = xhr.responseXML.selectSingleNode(".//ResCode"),
							resText = xhr.responseXML.selectSingleNode(".//ResDetail");
	                    if (typeof _opts != "undefined") {
	                        if (typeof _opts.blnAlert != "undefined" && _opts.blnAlert == false) {
	                            _blnAlert = false;
	                        }
	                        if (typeof _opts.blnClose != "undefined" && _opts.blnClose == false) {
	                            blnClose = false;
	                        }
	                    }

	                    switch (resCode.text) {
	                        case "0": 
	                            {
	                                _returnVal = resText.text;
	                                break;
	                            }
	                        case "1": 
	                            {
	                                blnReCommit = false;
	                                break;
	                            }
	                        default: 
	                            {
	                                strWar = "";
	                                break;
	                            }
	                    }

	                    _blnAlert && alert(strWar);

	                    typeof afterCommit == "function" && afterCommit();

	                    if (blnClose && blnReCommit) {
	                        window.close();
	                    }
	                },
	                error: function (xhr, error) {
	                    alert('Failure: ' + xhr.status);
	                },
	                data: docXml
	            });
	        }

	        if (typeof _opts != "undefined" && typeof _opts.blnReturnVal != "undefined" && _opts.blnReturnVal == true) {
	            return _returnVal;
	        }
	    },
	    hiddenBtn: function () {
	        this.heBtnOK.style.display = "none";
	        this.heBtnCancel.style.display = "none";
	    },
	    commitValid: function () {
	        if (this.sheets) {
	            var dataControls = [];
	            var controlLength = 0;
	            for (var name in this.sheets) {
	                if (this.sheets[name].dataControl) {
	                    for (var control in this.sheets[name].dataControl) {
	                        if (this.sheets[name].dataControl[control]) {
	                            if (this.sheets[name].dataControl[control].heContent.getAttribute("IsEmpty") ||
											this.sheets[name].dataControl[control].heContent.getAttribute("LengthCheck")
											|| this.sheets[name].dataControl[control].heContent.getAttribute("IllegalityCharCheck") || this.sheets[name].dataControl[control].heContent.getAttribute("FunctionName")) {
	                                dataControls.push(this.sheets[name].dataControl[control]);
	                            }
	                        }
	                    }
	                }
	            }
	            var temp;
	            for (var i = 1; i < dataControls.length; i++) {
	                for (var j = dataControls.length - 1; j >= i; j--) {
	                    if (dataControls[j].heContent.getAttribute("SerialCheck") && (parseInt(dataControls[j].heContent.getAttribute("SerialCheck")) < parseInt(dataControls[j - 1].heContent.getAttribute("SerialCheck")))) {
	                        temp = dataControls[j - 1];
	                        dataControls[j - 1] = dataControls[j];
	                        dataControls[j] = temp;
	                    }
	                }
	            }
	            for (var i = 0; i < dataControls.length; i++) {
	                if (dataControls[i]) {
	                    var value = "";
	                    var controlType = dataControls[i].heContent.getAttribute("type");
	                    switch (controlType) {
	                        case "textarea":
	                        case "text":
	                        case "password":
	                        case "datetime":
	                            value = $Str.trim(dataControls[i].heContent.value);
	                            break;
	                        case "combobox":
	                            value = $Str.trim(dataControls[i].heContent.options[dataControls[i].heContent.selectedIndex].value);
	                            break;
	                        case "checkboxlist":
	                            value = $Str.trim(dataControls[i].getValue());
	                            break;
	                        case "radio":
	                            value = $Str.trim(dataControls[i].getValue().value);
	                            break;
	                        case "checkbox":
	                            value = dataControls[i].heContent.checked;
	                            break;
	                        default:
	                            break;
	                    }
	                    if (dataControls[i].heContent.getAttribute("IsEmpty")) {
	                        if (!Valid.execute("NoEmpty", value, dataControls[i].heContent.getAttribute("ErrorNotice"), dataControls[i].heContent))
	                            return false;
	                    }
	                    if (dataControls[i].heContent.getAttribute("LengthCheck")) {
	                        if (!Valid.execute("InBoundOfLength", value, dataControls[i].heContent.getAttribute("ErrorMessage"), dataControls[i].heContent))
	                            return false;
	                    }
	                    if (dataControls[i].heContent.getAttribute("IllegalityCharCheck")) {
	                        if (!Valid.execute("NoContainSpecialChar", value, dataControls[i].heContent.getAttribute("NoticeMessage"), dataControls[i].heContent))
	                            return false;
	                    }
	                    if (dataControls[i].heContent.getAttribute("FunctionName")) {
	                        if (!Valid.execute("FunctionName", value, dataControls[i].heContent.getAttribute("FunctionName"), dataControls[i].heContent))
	                            return false;
	                    }
	                }
	            }
	            return true;
	        }
	    }
	});
    FormRun.getDefine = function (opts) {
        var frmsDefine = null;

        $.ajax({
            type: "post",
            url: "Form/formRunAction.action",
            async: false,
            data: opts,
            scope: this,
            success: function (data) {
                frmsDefine = data;
                var sysVarArray = frmsDefine.selectSingleNode("RAD/Doc/SysVariable").attributes;
                if (sysVarArray != null && sysVarArray.length > 0) {
                    for (var i = 0; i < sysVarArray.length; i++) {
                        SysVariable[sysVarArray[i].nodeName] = sysVarArray[i].nodeValue;
                    }
                }
            },
            error: function (xhr, error) {
                alert('Failure: ' + xhr.status);
            }
        });
        return frmsDefine;
    };
    FormRun.create = function (opts) {
        var xdForm = opts.xdForm = FormRun.getDefine(opts);
        var resCode = xdForm.selectSingleNode(".//ResCode");
        switch (resCode.text) {
            case "00": 
                {
                    parent.parent.location.href = "../../Index.aspx";
                    return null;
                }
            case "01": 
                {
                    alert("操作失败：" + $(data).find("Result>ResDetail").text());
                    return null;
                }
            default: 
                {
                    return new FormRun(opts);
                    break;
                }
        }
    };
    window.FormRun = FormRun;
    window.SysVariable = SysVariable;
})(window);

(function (win) {
    var doc = win.document, queryCondition = "", F = $F, P = $P, ET = $ET,
	FormControl = $C.Create({
	    initialize: function (options, parent) {
	        this.pControl = parent;
	        this.childNodes = null;
	        this.cid = options.cid;
	        this.type = options.type;
	        this.cfgData = {
	            style: {}
	        };
	        this.state = options.state || "none";
	        this.heContent = options.heControl;
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
	    getDBSource: function (sSql, vColumn, tColumn, sURL) {
	        !sURL && (sURL = "controlDSAjaxAction.action");
	        var data = this.cfgData,
				xmlDoc = XmlDocument.createBase('<Operation ParamType="GetDBSourceItems" DataSource="'
						 + (sSql || data.DataSourceSQL)
						 + '" DbValueColumn="'
						 + (vColumn || data.DBValueColumn)
						 + '" DbTextColumn="' + (tColumn || data.DBTextColumn) + '"/>'),
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
	    cascade: function (sValue, element) {
	        this.heContent.value != "undefined" && (this.heContent.value = sValue);
	    }
	}),
	FormAnchor = $C.Create(FormControl, {
	    initialize: function (options, parent) {
	        options.type = "a";
	        options.sControl = '<a href="#" style="width:99%;height:99%;padding:0px;margin:0px;">link</a>';
	        this.callSuper(options, parent);
	        this.setText();
	    },
	    setText: function () {
	        this.heContent.innerText = this.heContent.getAttribute("value");
	    }
	}),
	FormText = $C.Create(FormControl, {
	    initialize: function (options, parent) {
	        options.type = "text";
	        this.callSuper(options, parent);
	    }
	}),
	FormTextArea = $C.Create(FormControl, {
	    initialize: function (options, parent) {
	        options.type = "textarea";
	        this.callSuper(options, parent);
	        this.setText();
	    },
	    setText: function () {
	        this.heContent.innerText = this.heContent.getAttribute("Value");
	    }
	}),
	FormButton = $C.Create(FormControl, {
	    initialize: function (options, parent) {
	        options.type = "button";
	        options.sControl = '<input type="button" value="" style="width:100%;height:100%;padding:0px;margin:0px;" />';
	        this.callSuper(options, parent);
	        !options.heControl.className && (options.heControl.className = "button");
	        var tableObj = $("table[cid]"), dataSetid = tableObj.attr("dataSetid"),
	        	sortcols = tableObj.attr("sortcols");
	        if("searchbtn" == options.cid){
	        	$E.on(options.heControl,"click",function(){
		        	var elements = $("div[cid='queryarea']").children() || doc.forms[0].elements, 
		        		element, elen = elements.length, value, query = "", douObj = {}, datacolumn;
		        	for(;elen--;){
		        		element = elements[elen];
		        		switch(element.type){
			        		case "text":{
			        			value = element.value.replace(/^\s*|\s*$/,""),
			        			datacolumn = element.getAttribute("datacolumn");
			        			if(datacolumn && value) {			        				
			        				if("datetime" == element.getAttribute("type")){
			        					douObj[datacolumn] ? (douObj[datacolumn] += value) : (douObj[datacolumn] =  value + "|");
			        				}else{
			        					query += datacolumn + "," + value +";";
			        				}
			        			}
			        			break;
		        			}
			        		case "select-one":{
			        			value = element.value.replace(/^\s*|\s*$/,""),
			        			datacolumn = element.getAttribute("valuecolumn") || element.getAttribute("textcolumn");
			        			datacolumn && value && (query += datacolumn + "," + value +";");
			        			break;
			        		}
			        		default:{
			        			break;
		        			}
		        		}
		        	}
		        	for(var key in douObj){
		        		query += key + "," + douObj[key] + ";";
		        	}
		        	queryCondition = $U.params["query"] ? (query + $U.params["query"]) : query;
		        	tableObj.setGridParam({ 
		                url : "queryListAction.action",
		                postData : {type : "view", sortcols : sortcols, dataSetid : dataSetid, query : queryCondition},
		                mtype : "post"
		            }).trigger("reloadGrid");
	        	});
		    }else if("deletebtn" == options.cid){
		    	$E.on(options.heControl,"click",function(){
			    	var rows = tableObj[0].rows, tds, tdsLen, j,
			    		selRowIds = tableObj.getGridParam("selarrrow"), rowIdsLen = selRowIds.length,
			    		delData = [];
			    	if(!rowIdsLen){
			    		alert("请选择要删除的数据！");
			    		return;
			    	}
		    		for(var i=0;i<rowIdsLen;i++){
			    		tds = rows[selRowIds[i]].children;
			    		for(j = 0, tdsLen = tds.length; j < tdsLen; j++){
			    			td = tds[j];
			    			if(new RegExp("_cb$").test(td.getAttribute("aria-describedby"))){
			    				delData.push($(td).attr("cbvalue"));
			    				break;
			    			}
			    		}
			    	}			    	
			    	tableObj.setGridParam({ 
		                url : "queryListAction.action",
		                postData : {type : "delete", dataSetid : dataSetid, sortcols : sortcols, data : delData.toString(),
		                	colname : tableObj.attr("delcolname"), deltable : tableObj.attr("deltablename"), 
		                	query : (queryCondition || $U.params["query"] || "")},
		                mtype : "post"
		            }).trigger("reloadGrid");
		    	});
		    }
	    }
	}),
	FormSelect = $C.Create(FormControl, {
	    initialize: function (options, parent) {
	        options.type = "combobox";
	        this.callSuper(options, parent);
	        var heContent = this.heContent, cfgData = this.cfgData;
	        heContent.getAttribute("DataSourceType") && (cfgData.DataSourceType = heContent.getAttribute("DataSourceType"));
	        heContent.getAttribute("DataSourceContent") && (cfgData.DataSourceContent = heContent.getAttribute("DataSourceContent"));
	        heContent.getAttribute("DBValueColumn") && (cfgData.DBValueColumn = heContent.getAttribute("DBValueColumn"));
	        heContent.getAttribute("DBTextColumn") && (cfgData.DBTextColumn = heContent.getAttribute("DBTextColumn"));
	        heContent.getAttribute("DataSourceSQL") && (cfgData.DataSourceSQL = heContent.getAttribute("DataSourceSQL"));
	        this.setContent();
	        heContent.getAttribute("Value") && this.setValue();
	        heContent.getAttribute("cascadeCIds") && (this.cascadeCIds = heContent.getAttribute("cascadeCIds"));
	        typeof this.cascadeCIds != "undefined" && this.cascadeCIds != "" && $E.on(heContent, "change", function () {
	            this.cascadeHandle();
	        }, this);
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
	        } else if (data.DataSourceType == "1") {
	            var dsList = data.DataSourceContent.split(';'),
					list;
	            for (var n = 0, l = dsList.length; n < l; n++) {
	                list = dsList[n].split(',');
	                this.heContent.options.add(new Option(list[0], list[1]));
	            }
	        }
	    },
	    setValue: function () {
	        var vals = this.heContent.getAttribute("value"),
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
	        var heContent = this.heContent, cfgData = this.cfgData;
	        heContent.getAttribute("DataSourceType") && (cfgData.DataSourceType = heContent.getAttribute("DataSourceType"));
	        heContent.getAttribute("DataSourceContent") && (cfgData.DataSourceContent = heContent.getAttribute("DataSourceContent"));
	        heContent.getAttribute("DBValueColumn") && (cfgData.DBValueColumn = heContent.getAttribute("DBValueColumn"));
	        heContent.getAttribute("DBTextColumn") && (cfgData.DBTextColumn = heContent.getAttribute("DBTextColumn"));
	        heContent.getAttribute("DataSourceSQL") && (cfgData.DataSourceSQL = heContent.getAttribute("DataSourceSQL"));
	        this.setContent();
	        heContent.getAttribute("Value") && this.setValue();
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
	    getValue: function () {
	        var boxes = this.heContent.children, sVal = "", sText = "";
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
	    setValue: function () {
	        var vals = this.heContent.getAttribute("value"),
				boxes = this.heContent.children;
	        if (vals != "") {
	            for (var j = boxes.length - 1; j >= 0; j--) {
	                if (vals == boxes[j].children[0].value) {
	                    boxes[j].children[0].checked = true;
	                    break;
	                }
	            }
	        }
	    }
	}),
	FormImg = $C.Create(FormControl, {
	    initialize: function (options, parent) {
	        options.type = "img";
	        options.sControl = '<img src="Form/imgs/image.png" style="width:100%;height:100%;" />';
	        this.callSuper(options, parent);
	    }
	}),
	FormCheckbox = $C.Create(FormControl, {
	    initialize: function (options, parent) {
	        this.name = options.name || "";
	        options.type = "checkbox";
	        options.sControl = this.name
					 + '<input type="checkbox" value="" style="width:100%;height:100%;" />';
	        this.callSuper(options, parent);
	    },
	    onStart: function () {
	        this.parent.highlight(this.data, false);
	        this.drag.dropable(this.refreshDrops());
	    },
	    setValue: function () {
	        this.cfgData.value == this.heContent.value && (this.heContent.checked = true);
	    },
	    getValue: function () {
	        return this.heContent.checked ? this.heContent.value : "";
	    }
	}),
	FormCheckboxList = $C.Create(FormControl, {
	    initialize: function (options, parent) {
	        options.type = "checkboxlist";
	        this.callSuper(options, parent);
	        var heContent = this.heContent, cfgData = this.cfgData;
	        heContent.getAttribute("DataSourceType") && (cfgData.DataSourceType = heContent.getAttribute("DataSourceType"));
	        heContent.getAttribute("DataSourceContent") && (cfgData.DataSourceContent = heContent.getAttribute("DataSourceContent"));
	        heContent.getAttribute("DataSet") && (cfgData.DataSet = heContent.getAttribute("DataSet"));
	        heContent.getAttribute("DataTable") && (cfgData.DataTable = heContent.getAttribute("DataTable"));
	        heContent.getAttribute("DataColumn") && (cfgData.DataColumn = heContent.getAttribute("DataColumn"));
	        heContent.getAttribute("DBValueColumn") && (cfgData.DBValueColumn = heContent.getAttribute("DBValueColumn"));
	        heContent.getAttribute("DBTextColumn") && (cfgData.DBTextColumn = heContent.getAttribute("DBTextColumn"));
	        heContent.getAttribute("DataSourceSQL") && (cfgData.DataSourceSQL = heContent.getAttribute("DataSourceSQL"));
	        this.setContent();
	        heContent.getAttribute("Value") && this.setValue();
	    },
	    setValue: function () {
	        var vals = this.heContent.getAttribute("value").split(","),
				boxes = this.heContent.children;
	        for (var i = vals.length - 1; i >= 0; i--) {
	            for (var j = boxes.length - 1; j >= 0; j--) {
	                if (vals[i] == boxes[j].children[0].value) {
	                    boxes[j].children[0].checked = true;
	                    break;
	                }
	            }
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
	    }
	}),
	FormLabel = $C.Create(FormControl, {
	    initialize: function (options, parent) {
	        options.type = "label";
	        options.sControl = '<label style="width:100%;height:100%;">Label</label>';
	        this.callSuper(options, parent);
	    },
	    onStart: function () {
	        this.parent.highlight(this.data, false);
	        this.drag.dropable(this.refreshDrops());
	    },
	    setProp: function (propName, value) {
	        this.callSuper(propName, value);
	        propName == "value" && $ET.text(this.heContent, value);
	    }
	}),
	FormDiv = $C.Create(FormControl, {
	    initialize: function (options, parent) {
	        this.childControls = [];
	        options.type = "div";
	        this.callSuper(options, parent);
	        this.isLayout = true;
	    },
	    appendChild: function (frmControl) {
	        this.childControls.push(frmControl);
	    },
	    contains: function (control) {
	        var node = this.data;
	        cNode = control.data;
	        return node.contains(cNode);
	    }
	}),
	FormDateTime = $C.Create(FormControl, {
	    initialize: function (options, parent) {
	        options.type = "datetime";
	        this.callSuper(options, parent);
	        this.cfgData.DataSet = this.heContent.getAttribute("DataSet");
	        this.cfgData.DataTable = this.heContent.getAttribute("DataTable");
	        this.cfgData.DataColumn = this.heContent.getAttribute("DataColumn");
	    }
	}),
	FormWebGrid = $C.Create(FormControl,{
		initialize : function(options, parent) {
			options.type = "webgrid";
			this.callSuper(options, parent);
			this.setValue(options);
		},
		setValue : function(options) {
			var cid = options.cid, heTable = jQuery(options.heControl), 
				colNames = eval("" + heTable.attr("colNames") + ""), 
				colModel = eval("" + heTable.attr("colModel") + ""), 
				rowsnum = heTable.attr("rowsnum"), pagerId = "#pager_" + cid,
				bcbox = heTable.attr("hascheckboxcol") == "1",
				bsernum = heTable.attr("hasserialnum") == "1",
				brnum = /,/.test(rowsnum);				
			var pageDiv = document.createElement("div");
			pageDiv.id = "pager_" + cid;
			document.body.appendChild(pageDiv);

			heTable.attr("id", cid).jqGrid(
			{
				url : 'queryListAction.action',
				postData : {type : "view", query : ($U.params["query"] || ""), 
					dataSetid : heTable.attr("dataSetid"), sortcols : heTable.attr("sortcols")},
				mtype : "post",
			    datatype : "json",
//						width : heTable.width(),
				height : heTable.height() - 50,
				colNames : colNames,
				colModel : colModel,
				pager : pagerId,
				multiselect : bcbox ? true : false,
				rownumbers : bsernum ? true : false,
	            rowNum : brnum ? rowsnum.split(",")[0] : rowsnum,
	            rowList : brnum ? rowsnum.split(",") : rowsnum,
	            gridview : true, //加速显示 
	            viewrecords : true,
	            loadComplete : function(data){
	            	var colLen = colModel.length, col, uData = data.userData,
		            	rows = heTable[0].rows, rowsLen = rows.length, 
		            	tdsLen = rowsLen ? rows[0].children.length : 0, 
		            	i, clickStr = "", addCol = tdsLen - colLen,
		            	paras, p, plen, para, parameter;
	            	while(tdsLen && colLen--){
	            		col = colModel[colLen],
	            		paras = col["funcpara"].split(";");	            		
	            		switch(col["edittype"])
	            		{
		            		case "button":{
		            			for(i = 1; i < rowsLen; i++){
		            				parameter = "";
		            				for(p = 0, plen = paras.length; p < plen; p++){
				            			para = paras[p].split(",");
				            			if(para[1] == 1) parameter += uData[i - 1][para[0]] + ",";
				            			else if(para[1] == 2) parameter += "\"" + uData[i - 1][para[0]] +"\",";
				            			else if(para[1] == 3) parameter += "\"" + para[0] + "\",";
				            		}
		            				parameter && (parameter = parameter.substring(0, parameter.length - 1));
		            				$(rows[i].children[colLen + addCol]).html("<input type='button' value='" + col["Columnbtname"] 
		            						+ "' onclick='" + col["Columnqfunc"] + "(" + parameter + ")'>");
		            			}
		            			break;
		            			}
		            		case "a":{
		            			for(i = 1; i < rowsLen; i++){
		            				if(/^href:/.test(col["Columnqfunc"]))
		            					clickStr = "target=_blank href='" + col["Columnqfunc"].replace(/^href:/, "") + "'";
	            					else{	
	            						parameter = "";
	            						for(p = 0, plen = paras.length; p < plen; p++){
					            			para = paras[p].split(",");
					            			if(para[1] == 1) parameter += uData[i - 1][para[0]] + ",";
					            			else if(para[1] == 2) parameter += "\"" + uData[i - 1][para[0]] +"\",";
					            			else if(para[1] == 3) parameter += "\"" + para[0] + "\",";
					            		}
	            						parameter && (parameter = parameter.substring(0, parameter.length - 1));
	            						clickStr = "onclick='" + col["Columnqfunc"] + "(" + parameter + ")'";
		            				}
		            				$(rows[i].children[colLen + addCol]).html("<a style='cursor:pointer;color:black' " + clickStr + ">" 
		            						+ col["Columnbtname"] + "</a>");
		            			}
		            			break;
		            		}
	            			default:{
	            				break;
	            			}
	            		}
	            	}	            	
	            	if(bcbox){
		            	var cbcolnum = bsernum ? 1 : 0;
		            	for(i = 1; i < rowsLen; i++){
		            		$(rows[i].children[cbcolnum]).attr("cbvalue", uData[i - 1][heTable.attr("cboxcolname")]);
		            	}
	            	}
	            },
	            gridComplete: function () {}
//						onSelectRow : function(id) {}
			});			
			$("#" + heTable.attr("aria-labelledby")).css({ top : heTable.css("top"), left : heTable.css("left"), position : "absolute" });			
			heTable.css({ height : 0, width : 0, left : 0, top : 0 });
		}
	}),
	FormGrid = $C.Create(FormControl, {
	    initialize: function (options, parent) {
	        this.childControls = [];
	        this.callSuper(options, parent);
	        this.isLayout = true;
	    },
	    appendChild: function (frmControl) {
	        this.childControls.push(frmControl);
	    },
	    make: function (rect, heContainer) {
	        var heControl = document.createElement("div");
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
	    }
	}),
    FormTable = $C.Create(FormControl, {
        initialize: function (options, parent) {
            this.childControls = [];
            this.callSuper(options, parent);
            this.heTable = this.heContent.children[0];
            this.isLayout = true;
        },
        appendChild: function (frmControl) {
            this.childControls.push(frmControl);
        }
    }),
    QuerySheet = $C.Create({
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
	        this.mapControl(this.heContainer.firstChild, null);
	        this.heContainer.style.display = "";
	        this.frmDesinContainer = this.heContainer.children[0];
	        this.frmDesin = this.frmDesinContainer.children[0];
	        this.frmDesin.style.borderWidth = "0px";
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
	    mapControl: function (heControl, pControl, heTd) {
	        var sType = heControl.getAttribute("type");
	        if (!sType) return;
	        var j, len, cid = heControl.getAttribute("cid"), control,
				opts = {
				    cid: cid,
				    heControl: heControl,
				    heContent: heControl,
				    type: sType
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
	            case "webgrid":
	                {
	                    opts.xnRows = this.xnSheet.selectSingleNode(".//table[@cid=\"" + cid
								 + "\"]/rows");
	                    control = new FormWebGrid(opts, pControl);
	                    break;
	                }
	            case "div":
	                {
	                    control = new FormDiv(opts, pControl);
	                    for (j = 0, len = heControl.children.length; j < len; j++) {
	                        this.mapControl(heControl.children[j], control);
	                    }
	                    return;
	                }
	            case "table":
	                {
	                    control = new FormTable(opts, pControl);
	                    var oTable = control.heTable,
                            tBody = oTable.tBodies[0], rLen = tBody.rows.length, cLen, oTd,
                            i = 0, //oTable.tHead.rows[0].cells.length,
                            k, j, len;
	                    for (; i < rLen; i++) {
	                        oTr = tBody.rows[i];
	                        for (k = 0, cLen = oTr.cells.length; k < cLen; k++) {
	                            oTd = oTr.cells[k];
	                            for (j = 0, len = oTd.children.length; j < len; j++) {
	                                this.mapControl(oTd.children[j], control);
	                            }
	                        }
	                    }
	                    return;
	                }
	            case "grid":
	                {
	                    control = new FormGrid(opts, pControl);
	                    for (var i = 0, cLen = heControl.cells.length; i < cLen; i++) {
	                        oTd = heControl.cells[i];
	                        for (j = 0, len = oTd.children.length; j < len; j++) {
	                            this.mapControl(oTd.children[j], control);
	                        }
	                    }
	                    break;
	                }
	            default:
	                break;
	        };
	        this.dataControl[cid] = control;
	        control.cascadeCIds && this.cascade.push(control);
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
	    }
	}),
	QueryList = $C.Create({
	    initialize: function (options) {
	        this.container = typeof options.container == "string" ? document.getElementById(options.container) : options.container;
	        this.heFooter = ET.lastElementChild(this.container);
	        this.runTab = this.container.children[0];
	        var pvs = P.viewSize(),
				iH = pvs.height - this.heFooter.offsetHeight;
	        this.container.style.height = iH + "px";
	        this.name = options.name;
	        this.type = "query";
	        this.dataKey = options.dataKey;
	        var xdForm = this.xdForm = options.xdForm ? options.xdForm : null,
				xnSheets = xdForm.selectSingleNode("RAD/Doc/Data/sheets");
	        if (xnSheets.childNodes.length > 0) {
	            this.tab = new Tab({
	                navs: this.runTab.children[0],
	                navs_style: {
	                    width: this.runTab.clientWidth,
	                    height: 20
	                },
	                panelType: "3",
	                panels: this.runTab.children[1],
	                panels_style: {
	                    width: this.runTab.clientWidth,
	                    height: iH - 20
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
	            this.xnDatasource = xnSheets.lastChild;
	        }
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
	            tabItem.data = new QuerySheet({
	                id: id,
	                xnSheet: xnSheet,
	                name: frmName,
	                container: container
	            }, this);
	            this.sheets[frmName] = tabItem.data;
	            tabItem.navItem.style.display = "none";
	            var queryarea = $("div[cid='queryarea']");
	            queryarea.length && this.initQueryArea(queryarea);	            
	        }
	    },
	    initQueryArea : function(queryarea){	    	
	    	var operTable = $("table[cid]");
	    	queryarea.css("border", "1px solid #A6C9E2");
	    	queryarea.before("<div class='ui-jqgrid-titlebar ui-widget-header ui-corner-top ui-helper-clearfix' style='line-height:25px;height:25px;width:" 
	    			+ queryarea.css("width") + ";position:absolute;top:" + (parseInt(queryarea.css("top")) - 25) + "px;left:" + queryarea.css("left") 
	    			+ ";'><span class='ui-jqgrid-title' style='float:left;'>"
	    			+ operTable.attr("queryname") + "</span><a href='javascript:void(0)' class='ui-jqgrid-titlebar-close HeaderButton' " +
	    					"style='float:right;margin-top:5px;'><span class='ui-icon ui-icon-circle-triangle-n'></span></a></div>");	    	
	    	var aControl = queryarea.prev()[0].children[1];
	    	$E.on(aControl, "click", function(){
	    		var bflag = queryarea.css("display") == "none",
	    			qaHeight = parseInt(queryarea.css("height")),
	    			dataTab = operTable[0].parentNode.parentNode,
	    			dTabHeight = parseInt(dataTab.style.height),
	    			tabContainer = $("#" + operTable.attr("aria-labelledby")),
	    			conTop = parseInt(tabContainer.css("top")),
	    			initcss = "ui-icon-circle-triangle-n", oncss = "ui-icon-circle-triangle-s";	    		
    			tabContainer.css("top", (bflag ? (conTop + qaHeight) : (conTop - qaHeight)) + "px");
    			dataTab.style.height = (bflag ? (dTabHeight - qaHeight) :(dTabHeight + qaHeight)) + "px";
    			queryarea.css("display", bflag ? "" : "none");
    			$(aControl.children[0]).addClass(bflag ?  initcss : oncss).removeClass(bflag ? oncss : initcss);
	    	});
	    },
	    getActiveSheet: function () {
	        return this.sheets.activeSheet;
	    },
	    onAfterToggle: function (evt, tabItem, preActTab) {
	        var design = tabItem.data;
	        this.activeDesign = design;
	        if (!this.activeTab) {
	            this.activeTab = tabItem;
	            design.show();
	        } else if (this.activeTab != tabItem) {
	            this.activeTab.data.hidden();
	            this.activeTab = tabItem;
	            design.show();
	        }
	    }
	});
    QueryList.getDefine = function (id) {
        var frmsDefine = null;
        $Ajax({
            type: "post",
            url: "queryListAction.action?type=getdefine&queryId=" + id,
            async: false,
            success: function (xhr, data) {
                frmsDefine = xhr.responseXML;
            },
            error: function (xhr, error) {
                alert('Failure: ' + xhr.status);
            }
        });
        return frmsDefine;
    };
    QueryList.create = function (opts) {
        if (opts.id != null && $O.getType(opts.id) == "string") {
            var xdForm = opts.xdForm = QueryList.getDefine(opts.id);
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
                        return new QueryList(opts);
                        break;
                    }
            }
        }
    };
    QueryList.getselRowData = function(cid){
    	var tableObj = cid ? $("table[cid='" + cid + "']") : $("table[cid]"), 
			rows = tableObj[0].rows, tds, tdsLen, selrowid,
    		hascbox = tableObj.attr("hascheckboxcol") == "1", cboxIndex,
    		selRowIds = hascbox ? tableObj.getGridParam("selarrrow") 
    				: ((selrowid = tableObj.getGridParam("selrow")) ? [selrowid] : []),
    		rowData, rowsData = [], j;
    	hascbox && (cboxIndex = tableObj.attr("hasserialnum") == "1" ? 1 : 0);
    	for(var i = 0, rowIdsLen = selRowIds.length; i < rowIdsLen; i++){
    		tds = rows[selRowIds[i]].children, rowData = [];    		
    		for(j = 0, tdsLen = tds.length; j < tdsLen; j++){
    			if(hascbox && (j == cboxIndex)){
    				rowData.push(tds[j].getAttribute("cbvalue"));
    				continue;
    			}
    			rowData.push($(tds[j]).text());
    		}
    		rowsData.push(rowData);
    	}    	
    	return rowsData;
    };
    window.QueryList = QueryList;
})(window);
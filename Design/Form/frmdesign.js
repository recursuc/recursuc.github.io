(function (win) {
	var doc = win.document,
	ToolBox = $C.Create({
			initialize : function (options, pDesign) {
				this.drags = [];
				this.pDesign = pDesign;
				this.heControl = options.toolBoxContainer;
				this.container = this.heControl.parentNode;
				this.accor = new Accordion({
						target : this.heControl,
						container : this.container,
						titleStyle : {},
						active : 0,
						contentStyle : {},
						maxH : 500
					});
				this.onStartHanle = $F.bind(this, this.onStart);
				this.onDropHanle = $F.bind(this, this.onDrop);
				this.onStopHanle = $F.bind(this, this.onStop);
				this.drag = null;
				var panels = this.accor.panels;
				this.dragElem = null;
				for (var i = 0, plen = panels.length; i < plen; i++) {
					$E.on(panels[i].heContent, "mousedown", this.mouseHandle, this, i);
				}
			},
			setOptions : function (options) {},
			setDesign : function (design) {
				this.pDesign = design;
			},
			mouseHandle : function (evt, sType) {
				var elem = evt.target,
				rect = $ET.getRect(elem),
				sControl = "";
				if (elem.nodeName == "IMG") {
					switch (elem.name.toLowerCase()) {
					case "text": {
							ctype = "text";
							sControl = '<input type="text"  style="width: ' + rect.width + 'px;height' + rect.height + 'px;" />';
							break;
						}
					case "button": {
							ctype = "button";
							sControl = '<input type="button" value="按钮" style="left:' + rect.left + 'px;top:' + rect.top + 'px;width: ' + rect.width + 'px;height' + rect.height + 'px;" />';
							break;
						}
					case "label": {
							ctype = "label";
							sControl = '<label ctype="label" style="left:' + rect.left + 'px;top:' + rect.top + 'px;width: ' + rect.width + 'px;height' + rect.height + 'px;">标签</label>';
							break;
						}
					case "checkbox": {
							ctype = "checkbox";
							sControl = '<input type="checkbox" value="" style="left:' + rect.left + 'px;top:' + rect.top + 'px;width: ' + rect.width + 'px;height' + rect.height + 'px;" />';
							break;
						}
					case "checkboxlist": {
							ctype = "checkboxlist";
							sControl = '<div style="left:' + rect.left + 'px;top:' + rect.top + 'px;width: ' + rect.width + 'px;height' + rect.height + 'px;">选项1<input type="checkbox" name="cbl_temp" value="1"  />选项2<input type="checkbox" name="cbl_temp" value="2"  /></div>';
							break;
						}
					case "combobox": {
							ctype = "combobox";
							sControl = '<select value="" style="left:' + rect.left + 'px;top:' + rect.top + 'px;width: ' + rect.width + 'px;height' + rect.height + 'px;"></select>';
							break;
						}
					case "datetime": {
							ctype = "datetime";
							sControl = '<input type="text" class="Wdate" onFocus="WdatePicker({isShowClear:true,readOnly:true,dateFmt:\'yyyy-MM-dd HH:mm:ss\'});document.body.focus();" style="width: ' + rect.width + 'px;height' + rect.height + 'px;" />';
							break;
						}
					case "textarea": {
							ctype = "textarea";
							sControl = '<textarea value="" style="left:' + rect.left + 'px;top:' + rect.top + 'px;width: ' + rect.width + 'px;height' + rect.height + 'px;"></textarea>';
							break;
						}
					case "richeditor": {
						ctype = "richeditor";
						sControl = '<textarea value="" style="left:' + rect.left + 'px;top:' + rect.top + 'px;width: ' + rect.width + 'px;height' + rect.height + 'px;"></textarea>';
						break;
					}
					case "radio": {
							ctype = "radio";
							sControl = '<input type="radio" value="" style="left:' + rect.left + 'px;top:' + rect.top + 'px;width: ' + rect.width + 'px;height' + rect.height + 'px;" />';
							break;
						}
					case "div": {
							ctype = "div";
							sControl = '<div style="border: 1px solid rgb(0, 0, 255);left:' + rect.left + 'px;top:' + rect.top + 'px;width:60px;height:60px;"></div>';
							break;
						}
					case "img": {
							ctype = "img";
							sControl = '<img src="" style="left:' + rect.left + 'px;top:' + rect.top + 'px;width: ' + rect.width + 'px;height' + rect.height + 'px;"/>';
							break;
						}
					case "a": {
							ctype = "a";
							sControl = '<a href="" style="left:' + rect.left + 'px;top:' + rect.top + 'px;width: ' + rect.width + 'px;height' + rect.height + 'px;">超链接</a>';
							break;
						}
					case "table": {
							ctype = "table";
							sControl = '<div style="border: 1px solid rgb(0, 0, 255);left:' + rect.left + 'px;top:' + rect.top + 'px;width:620px;height:190px;"></div>';
							break;
						}
					case "upload": {
							ctype = "upload";
							sControl = '<div style="border: 1px solid rgb(0, 0, 255);left:' + rect.left + 'px;top:' + rect.top + 'px;width:100px;height:50px;"></div>';
							break;
						}
					case "webgrid": {
							ctype = "webgrid";
							sControl = '<div style="border: 1px solid rgb(0, 0, 255);left:' + rect.left + 'px;top:' + rect.top + 'px;width:300px;height:200px;"></div>';
							break;
						}
					case "iframe": {
							ctype = "iframe";
							sControl = '<iframe style="left:' + rect.left + 'px;top:' + rect.top + 'px;"></iframe>';
							break;
						}
					case "tab": {
							ctype = "tab";
							sControl = '<div style="border: 1px solid rgb(0, 0, 255);left:' + rect.left + 'px;top:' + rect.top + 'px;width:620px;height:190px;"></div>';
							break;
						}
					case "countersign": {
							ctype = "countersign";
							sControl = '<div style="font-family:宋体;font-size: 12px;left:' + rect.left + 'px;top:' + rect.top + 'px;width:438px;border: #90a5c2 1px solid;overflow:auto;">'
								 + '  <table style="width: 100%; border-collapse: collapse; table-layout: fixed; height: 76px; font-size: 13px" border="0" cellspacing="0" cellpadding="0">'
								 + '   <tbody>'
								 + '   <tr>'
								 + '    <td style="border-bottom: #90a5c2 1px solid">'
								 + '     <textarea style="width: 100%; height: 100%">   </textarea>'
								 + '    </td>'
								 + '    <td style="width:40px;text-align:right;" valign="center">'
								 + '     <img src="http://172.16.24.18/frameworkpage-3.0.1-dlgl/application/formrun/skins/blue/images/words.jpg"/>'
								 + '    </td>'
								 + '   </tr>'
								 + '   </tbody>'
								 + '  </table>'
								 + '  <table style="border-left: #ededed 1px solid; width: 100%; border-collapse: collapse; table-layout: fixed; font-size: 13px; border-top: #ededed 1px solid" border="1" cellspacing="0" cellpadding="0">'
								 + '   <tbody>'
								 + '   <tr name="3371" content="同意" trtype="countersigninfo">'
								 + '    <td style="border-bottom: #ededed 1px solid; border-left: 0px; border-top: 0px; border-right: #ededed 1px solid" valign="top" colspan="2" align="left">'
								 + '     <div style="width: 99%; text-overflow: ellipsis; overflow: hidden" title="同意">审核意见：同意</div>'
								 + '    </td>'
								 + '   </tr>'
								 + '   <tr workflownodename="XX节点">'
								 + '    <td style="border-bottom: #ededed 1px solid; border-left: 0px; border-top: 0px; border-right: #ededed 1px solid" valign="center" align="left">处理节点：XX节点</td>'
								 + '   </tr>'
								 + '   <tr userid="" username="XX" time="2012-01-01 00:00:00">'
								 + '    <td style="border-bottom: #ededed 1px solid; border-left: 0px; border-top: 0px; border-right: #ededed 1px solid" valign="center" align="right">审批人:XX</td>'
								 + '    <td style="border-bottom: #ededed 1px solid; border-left: 0px; width: 218px; border-top: 0px" valign="center" align="middle">审批时间:2012-01-01 00:00:00</td>'
								 + '   </tr>'
								 + '   </tbody>'
								 + '  </table>'
								 + '</div>';
							break;
						}
					default: {
							break;
						}
					}
					if (sControl) {
						sControl = '<div data-ctype="' + ctype + '" style="position:absolute;left:' + rect.left + 'px;top:' + rect.top + 'px; z-index: 300;">' + sControl + '<div class="mask"></div></div>';
						document.body.insertAdjacentHTML("beforeend", sControl);
						this.dragSetting({
							target : document.body.lastChild,
							drops : this.pDesign.getActiveSheet().getCanvas()
						}, evt);
					}
				}
			},
			makeDragControl : function (sType) {
				return control;
			},
			resize : function () {
				this.callSuper();
				this.sheets && this.sheets.resize();
			},
			makeHtml : function () {},
			toolbox : function () {},
			dragSetting : function (opts, evt) {
				if (!this.drag) {
					opts.onStart = this.onStartHanle;
					opts.onDrop = this.onDropHanle;
					opts.onStop = this.onStopHanle;
					this.drag = Drag.setStart(opts, evt);
				} else {
					Drag.setStart(opts, evt);
				}
				this.drag.Start(evt);
			},
			onStart : function (oEvent) {},
			onStop : function (helper) {
				if (!this.drag.Drag) {
					return;
				}
				var elem = this.drag.Drag,
				tLeft = helper.sL,
				tTop = helper.sT,
				sL = helper.eL,
				sT = helper.eT,
				lC = tLeft - sL,
				tC = tTop - sT,
				duration = 300,
				startTime = new Date();
				elem.parentNode ? (function () {
					var newTime = new Date().getTime(),
					timestamp = newTime - startTime,
					delta = Math.pow(timestamp / duration, 2);//y=x^2
					elem.style.left = Math.ceil(sL + delta * lC) + "px";
					elem.style.top = Math.ceil(sT + delta * tC) + "px";
					if (duration <= timestamp) {
						elem.style.left = tLeft + "px";
						elem.style.top = tTop + "px";
						elem.parentNode.removeChild(elem);
					} else {
						setTimeout(arguments.callee, 1000 / 50);
					}
				})() : this.drag.Drag = null;
			},
			onDrop : function (heDropTarget, dropTarget) {
				var heDrag = this.drag.Drag,
				scrollTop = scrollLeft = 0,
				rect = $ET.getRect(heDrag),
				rectDT = dropTarget.type != "table" ? dropTarget.rect : dropTarget.tdRect,
				sheet = this.pDesign.getActiveSheet(),
				mainTable = sheet.mainTable, heBox = dropTarget.heTd,
				sLoadType = "add";
			
				dropTarget.heTd && (dropTarget.heTd.style.position = "relative");
				if (dropTarget.type == "tab") {
					var pControl = mainTable.getControl(heDropTarget.getAttribute("data-cid"));
					if (pControl.tab.activeTab) {
						var hePanel = pControl.tab.activeTab.panel;
						scrollTop = hePanel.scrollTop;
						scrollLeft = hePanel.scrollLeft;
						heBox = pControl.tab.activeTab.panel;
					}else {
						alert("请先在tab属性页中添加tab项！");
						return ;
					}
				}
				this.drag.Drag.parentNode.removeChild(this.drag.Drag);
				sheet.mainTable.drawControl(heDrag.getAttribute("data-ctype"), {
					top : rect.top - rectDT.top + scrollTop,
					left : rect.left - rectDT.left + scrollLeft,
					width : rect.width,
					height : rect.height
				}, heDropTarget, heBox, sLoadType);
				
			},
			show : function () {
				this.heControl.style.display = "";
			},
			hidden : function () {
				this.heControl.style.display = "none";
			}
		}, true),
	ToolBar = $C.Create({
			include : moduleToolBar,
			initialize : function (options, pDesign) {
				var onHanlde = $F.bind(this, this.onHandle);
				this.operBtns = [["img", "保存", "skin/blue/images/design_save.gif", ["onclick"], [onHanlde, "save"]], ["img", "数据源设置", "skin/blue/images/design_DS.gif", ["onclick"], [onHanlde, "DataSourceSet"]], ["img", "查询状态", "skin/blue/images/design_DS.gif", ["onclick"], [onHanlde, "getStates"]], ["img", "自定义脚本", "skin/blue/images/design_DS.gif", ["onclick"], [onHanlde, "formJS"]]];
				this.callSuper(options, pDesign);
			},
			setOptions : function (options) {},
			resize : function () {},
			serialize : function (sheet) {}
			
		}, true),
	AttributePage = $C.Create({
			initialize : function (options, pDesign) {
				this.pDesign = pDesign;
				this.attrPagePanel = pDesign.attrPagePanel;
				this.attrPagePanel.setIframe({
					src : "",
					border : "0",
					scrolling : "no",
					autoSize : false,
					height : "100%",
					width : "100%"
				});
				this.activeControl = null;
			},
			setOptions : function (options) {},
			location : function (src, iframe) {
				return this.attrPagePanel.location(src, iframe);
			},
			resize : function () {},
			serialize : function (sheet) {}
			
		}, true),
	FormSheets = $C.Create(Array, {
			include : [moduleSheets],
			initialize : function (aSheets, pGrid) {
				this.pGrid = pGrid || null;
				this.keyPrefix = "form";
				this.callSuper(aSheets, this.pGrid);
			},
			xmlToObj : function () {},
			addSheet : function (options) {
				return this.callSuper(options, FormSheet);
			},
			delSheet : function () {
				this.callSuper();
			},
			openAddDialog : function () {
				var _this = this;
				sDialog.open({
					scope : this,
					width : 300,
					height : 200,
					title : 'Sheet行列输入',
					content : {
						src : "form/attribute/div.htm",
						data : "nidayede"
					},
					content : '<label style="margin-right:10px;">名称:</label><input type="text" id="txtSheetName" value="form' + _this.length + '"><br/><br/>'
					 + '<label style="margin-right:10px;">高度:</label><input type="text" id="txtHeight" value=""><br/><br/>'
					 + '<label style="margin-right:10px;">宽度:</label><input type="text" id="txtWidth" value=""><br/>',
					onConfirm : function () {
						sheet = this.addSheet({
								id : document.getElementById("txtSheetName").value,
								height : document.getElementById("txtHeight").value,
								width : document.getElementById("txtWidth").value,
								active : 1
							});
						this.changeTab(sheet);
					},
					onCancel : function () {},
					fixed : true,
					overlay : true,
					drag : true,
					lock : false
				});
			},
			resize : function () {
				this.callSuper();
				this.activeSheet.resize();
			},
			serialize : function () {
				var sb = new StringBuilder();
				sb.append("<sheets id=\"" + this.pGrid.cSheetsId + "\" name=\"" + this.pGrid.cSheetsName + "\" saveway=\"" + this.pGrid.saveWay + "\">");
				for (var i = 0; i < this.length; i++) {
					sb.append(this[i].serialize());
				}
				sb.append("</sheets>");
				return sb.serialize();
			}
		}),
	FormDesign = $C.Create({
			include : moduleGrid,
			initialize : function (options, pDesign) {
				var options = options;
				if (($O.getType(options.xnSheet) == "document" || $O.getType(options.xnSheet) == "object") && options.xnSheet.selectNodes(".//sheet")[0]) {
					var xnSheets = options.xnSheet.selectNodes(".//sheets")[0],
						xnSheet = options.xnSheet.selectNodes(".//sheet");
					options.cSheetsId = xnSheets.getAttribute("id");
					options.cSheetsName = xnSheets.getAttribute("name");
					options.saveWay = xnSheets.getAttribute("saveway") && xnSheets.getAttribute("saveway").toString();
					options.id = xnSheets.getAttribute("id");
					options.name = xnSheets.getAttribute("name");
					//options.datasource = this.loadDataSource(xnSheet);
					options.script = this.loadScript(xnSheet[0].selectSingleNode(".//script"));
				}
				this.grid = options.heTemplate;
				this.container = this.grid.parentNode;
				this.name = options.name;
				this.style = "";
				this.script = "";
				this.cSheetsId = options.cSheetsId || "";
				this.cSheetsName = options.cSheetsName || "";
				this.saveWay = (options.saveWay && options.saveWay != "null") ? options.saveWay : "1";
				this.id = options.id || "";
				this.type = "form";
				this.pDesign = pDesign;
				this.setDOM({
					container : this.container,
					grid : this.grid
				});
				this.isParamDesin = !!options.isParamDesin;
				this.setPanel((this.isParamDesin ? pDesign.pDesign : pDesign)["rDockTab"]);
				this.toolBar = new ToolBar(options, this);
				this.toolBar.setDesign(this);
				this.resize();
				this.attrPage = new AttributePage(null, this);
				this.sheets = new FormSheets(options.xnSheet ? options.xnSheet : null, this);
				this.toolBox = new ToolBox(options, this);
				this.toolBox.setDesign(this);
				//this.datasource = options.datasource ? [options.datasource, options.datasource.serializeXml()] : null;
				this.script = options.script || [];
			},
			setOptions : function (options) {},
			loadScript : function(xnScript){
				return [xnScript.selectSingleNode(".//frontend").text, xnScript.selectSingleNode(".//backEnd").text,
				        xnScript.selectSingleNode(".//commit").text, xnScript.selectSingleNode(".//uncommit").text];
			},
			loadDataSource : function (xnlSheet) {
				var oDatasource = new DataSource();
				for (var i = 0, len = xnlSheet.length; i < len; i++) {
					if (xnlSheet[i].nodeType == "1" && xnlSheet[i].selectNodes(".//dataset")) {
						for (var z = 0, zLen = xnlSheet[i].selectNodes(".//dataset").length; z < zLen; z++) {
							if (xnlSheet[i].selectNodes(".//dataset")[z].nodeType == "1" && !oDatasource.IsExist(xnlSheet[i].selectNodes(".//dataset")[z].attributes["id"].value)) {
								var oDataset = new DataSet(),
								xDataset = xnlSheet[i].selectNodes(".//dataset")[z];
								oDataset.DbId = xDataset.attributes["id"] && xDataset.attributes["id"].value;
								oDataset.Name = xDataset.attributes["name"] && xDataset.attributes["name"].value;
								oDataset.Type = xDataset.attributes["type"] && xDataset.attributes["type"].value;
								oDataset.MainTable = xDataset.attributes["maintable"] && xDataset.attributes["maintable"].value;
								oDataset.ConnString = xDataset.attributes["connstring"] && xDataset.attributes["connstring"].value;
								for (var j = 0, cou = xDataset.childNodes.length; j < cou; j++) {
									if (xDataset.childNodes[j].nodeType == "1") {
										var oDatatable = new DataTable(),
										xDatatable = xDataset.childNodes[j];
										oDatatable.ClientId = xDatatable.attributes["cid"] && xDatatable.attributes["cid"].value;
										oDatatable.Name = xDatatable.attributes["name"] && xDatatable.attributes["name"].value;
										oDatatable.TableName = xDatatable.attributes["tablename"] && xDatatable.attributes["tablename"].value;
										oDatatable.IsMain = xDatatable.attributes["ismain"] && xDatatable.attributes["ismain"].value;
										oDatatable.ParentDataTableClientId = xDatatable.attributes["parentdtclientid"] && xDatatable.attributes["parentdtclientid"].value;
										oDatatable.UniqueIndexColumn = xDatatable.attributes["uniqueindexcolumn"] && xDatatable.attributes["uniqueindexcolumn"].value;
										for (var k = 0, count = xDatatable.selectNodes(".//column").length; k < count; k++) {
											var oDatacolumn = new DataColumn(),
											xDatacolumn = xDatatable.selectNodes(".//column")[k];
											oDatacolumn.Name = xDatacolumn.attributes["name"] && xDatacolumn.attributes["name"].value;
											oDatacolumn.ColumnName = xDatacolumn.attributes["columnname"] && xDatacolumn.attributes["columnname"].value;
											oDatacolumn.Length = xDatacolumn.attributes.getNamedItem("length") && xDatacolumn.attributes.getNamedItem("length").value;
											oDatacolumn.AnotherName = xDatacolumn.attributes["anothername"] && xDatacolumn.attributes["anothername"].value;
											oDatacolumn.DataType = xDatacolumn.attributes["datatype"] && xDatacolumn.attributes["datatype"].value;
											oDatatable.DataColumns.push(oDatacolumn);
										}
										oDataset.DataTables.push(oDatatable);
									}
								}
								oDatasource.DataSets.push(oDataset);
							}
						}
					}
				}
				return oDatasource;
			},
			setPanel : function (panels) {
				this.attrPagePanel = panels["attrPage"];
				this.structTreePanel = panels["structTree"];
			},
			resize : function () {
				this.callSuper();
				this.sheets && this.sheets.resize();
			},
			insertTemplate : function () {
				var rpt = this.heRpt.cloneNode(true);
			},
			getActiveSheet : function () {
				return this.sheets.activeSheet;
			},
			getParamsDesin : function () {
				return $ET.nextSibingElement(this.heGrid);
			},
			toolbox : function () {},
			show : function (id) {
				this.grid.style.display = "";
				this.toolBox.show(this);
				this.toolBox.setDesign(this);
				this.toolBar.show(this);
				this.toolBar.setDesign(this);
				this.sheets[id] ? this.sheets.activeSheet = this.sheets[id] : null;
				this.sheets.activeSheet.mainTable.show();
			},
			hidden : function () {
				this.grid.style.display = "none";
				this.toolBox.hidden(this);
				this.toolBar.hidden(this);
				this.sheets.activeSheet.mainTable.hide();
			},
			serialize : function () {
				return this.sheets.serialize();
			},
			DataSourceSet : function () {
				var _this = this;
				window.showCustomDialog("DataSource/attribute/datasource.htm", [this.sheets.activeSheet.datasource ? this.sheets.activeSheet.datasource[0] : null, window.argsDom, this.sheets.activeSheet], "dialogWidth:830px;dialogHeight:410px;resizable:no;cover:yes;id=dsSet;title:数据源设置", null, function (dsAndSqlArgs) {
					if (typeof dsAndSqlArgs != "undefined") {
//						_this.datasource = [dsAndSqlArgs[0], dsAndSqlArgs[2]];
						_this.sheets.activeSheet.datasource=[dsAndSqlArgs[0], dsAndSqlArgs[2]];
						_this.sheets.activeSheet.dsId=dsAndSqlArgs[0].DataSets[0].DbId;
					}
				});
			},
			getStates : function () {
				var _this = this;
				if (_this.sheets.activeSheet.id == "") {
					alert("请先打开一个表单");
					return;
				}
				parent.sDialog.open({
					title : (function () {
						return "表单【" + _this.sheets.activeSheet.name + "】状态管理";
					})(),
					content : {
						src : "Form/state/FormStateList.html?formId=" + _this.sheets.activeSheet.id + "&formName=" + _this.sheets.activeSheet.name
					},
					width : 800,
					height : 550,
					confirm : false
				});
			},
			formJS : function(){
				var _this = this;
				var jsEditor = sDialog.open({
                    title: "自定义脚本",
                    content: {src: "../../Javascripts/common/codeeditor/jseditor.html"},
                    width: 800,
                    height: 500,
                    onConfirm: function () {
                    	var contentJS = this.heIframe.contentWindow.editors, formJS = [];
                    	for(var i = 0, len = contentJS.length; i < len; i++){
                    		formJS.push(escape(contentJS[i].getValue()));
                    	}
                    	_this.script = formJS;
                    	return true;
                    }
                });
				jsEditor.heIframe.contentWindow.dialogArgs = this.script;
			},
			save : function () {
				var sXml = this.serialize(),
				_this = this;
				$Ajax({
					type : "post",
					url : /.list$/.test(this.cSheetsName) ? "queryListAction.aspx?type=savedefine" : "formAction.aspx?OperType=2&OperationSign=1",
					async : false,
					success : function (xhr, data) {
						var msg = $ET.text(xhr.responseXML.selectSingleNode("RAD/Doc/Result/ResCode"));
						var result = $ET.text(xhr.responseXML.selectSingleNode("RAD/Doc/Result/ResDetail")),
						results = result.split(";");
						if (msg != "0") {
							alert(result);
						} else {
							if (_this.getActiveSheet().id == "") {
								for (var i = 0, len = results.length - 1; i < len; i++) {
									if (i == 0) {
										_this.cSheetsId = _this.id = results[0];
									}
									i == len && (_this.getActiveSheet().id = results[len]);
								}
								_this.name = _this.cSheetsName;
								alert("添加成功!");
							} else {
								if (results.length > 2) {
									for (var i = 1, len = results.length - 1; i < len; i++) {
										alert("更新成功!");
									}
								}
								var i,
								otreeNode = _this.pDesign.explore.explore.root.childNodes[0].childNodes;
								for (i = 0; i < otreeNode.length; i++) {
									if (otreeNode[i].id == _this.cSheetsId) {
										otreeNode[i].heContent.innerText = _this.cSheetsName;
										otreeNode[i].tips = otreeNode[i].text = _this.cSheetsName;
									}
								}
							}
						}
					},
					error : function (xhr, error) {
						alert('Failure: ' + xhr.status);
					},
					data : $X.createBase(sXml)
				});
			},
			xmlToObj : function () {},
			FunctionSet : function () {}
			
		});
	FormDesign.getDefine = function (id, type) {
		var frmsDefine = null;
		$Ajax({
			type : "post",
			url: (type && "query" == type) ? "queryListAction.action?type=getdefine&queryId=" + id : "./Form/Handle/FormAjax.aspx?OperType=1&FormsId=" + id,
			async : false,
			success : function (xhr, data) {
				frmsDefine = xhr.responseXML;
			},
			error : function (xhr, error) {
				alert('Failure: ' + xhr.status);
			}
		});
		return frmsDefine;
	};
	FormDesign.getNameList = function (sType, callback) {
		var frmsDefine = null;
		$Ajax({
			type : "get",
			url: "./Form/Handle/FormAjax.aspx?OperType=6",
			async : false,
			success : function (xhr, data) {
				frmsDefine = xhr.responseXML.selectSingleNode(".//Forms");
				typeof callback == "function" && callback(frmsDefine);
			},
			error : function (xhr, error) {
				alert('Failure: ' + xhr.status);
			}
		});
		return frmsDefine;
	};
	FormDesign.getQueryNameList = function (sType, callback) {
		var frmsDefine = null;
		$Ajax({
			type : "get",
			url: "./Form/Handle/FormAjax.aspx?OperType=7",
			async : false,
			success : function (xhr, data) {
				frmsDefine = xhr.responseXML.selectSingleNode(".//Querys");
				typeof callback == "function" && callback(frmsDefine);
			},
			error : function (xhr, error) {
				alert('Failure: ' + xhr.status);
			}
		});
		return frmsDefine;
	};
	FormDesign.create = function (opts, parent) {
		if (opts.xnSheet && (/^\d+$/.test(opts.id) == true)) {
			var type = (/.list$/.test(opts.name) ? "query" : "form");
			sheetsDefine = FormDesign.getDefine(("query" == type ? opts.xnSheet[0].id : opts.id), type);
			var pGrid = parent.frms[opts.id] ? parent.frms[opts.id] : null;
			var sheetLen = sheetsDefine.selectNodes(".//sheet");
			for (var x = 0, stlen = sheetLen.length; x < stlen; x++) {
				for (var i = 0, xnstlen = opts.xnSheet.length; i < xnstlen; i++) {
					if (xnstlen == 1 && sheetLen[x].getAttribute("id") != opts.xnSheet[i].id) {
						sheetLen[x].parentNode.removeChild(sheetLen[x]);
					}
					if ((pGrid && pGrid.sheets[opts.xnSheet[i].id]) && sheetLen[x].getAttribute("id") == opts.xnSheet[i].id) {
						sheetLen[x].parentNode.removeChild(sheetLen[x]);
					}
				}
			}
			opts.xnSheet = sheetsDefine;
			if (sheetsDefine.selectNodes(".//sheet") && pGrid) {
				return sheetsDefine.selectNodes(".//sheet");
			} else {
				return new FormDesign(opts, parent);
			}
		}
		return new FormDesign(opts, parent);
	};
	FormDesign.deleteForms=function(pid,id,type)
	{
		var url;
		switch(type)
		{
		case "form":
				url = "formAction.aspx?OperType=2&OperationSign=3&FormsId="+pid+(id==""?"":"&FormId="+id);
			break;
		case "query":
				url = "queryListAction.aspx?type=delete&pid="+pid+"&QueryListid="+(id==""?"":id);
			break;
		case defalut:
			url="";
			break;
		}
		$Ajax({
			type : "post",
			url : url,
			async : false,
			success : function (xhr, data) {
			},
			error : function (xhr, error) {
				alert('Failure: ' + xhr.status);
			}
			});
		
	}
	window.FormDesign = FormDesign;
})(window);

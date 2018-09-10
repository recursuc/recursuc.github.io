/*
流程设计器
*/
(function (win) {
    var doc = win.document,
    ToolBox = $C.Create({
        initialize: function (options, pDesign) {
            this.drags = [];
            this.pDesign = pDesign;
            this.heControl = options.toolBoxContainer;
            this.container = this.heControl.parentNode;
            this.accor = new Accordion({
                target: this.heControl,
                container: this.container,
                titleStyle: {},
                contentStyle: {},
                maxH: 500
            });
            this.onStartHanle = $F.bind(this, this.onStart);
            this.onDropHanle = $F.bind(this, this.onDrop);
            this.drag = null;

            var panels = this.accor.panels;
            this.dragElem = null;
            for (var i = 0, plen = panels.length; i < plen; i++) {
                $E.on(panels[i].heContent, "mousedown", this.mouseHandle, this, i);
            }
        },
        setOptions: function (options) {

        },
        mouseHandle: function (evt, sType) {
            var elem = evt.target, rect = $ET.getRect(elem), sControl = "", wfmodel;
            if (elem.nodeName == "SPAN") {
                wfmodel = elem.getAttribute("wfmodel");
                if (wfmodel == null || wfmodel == "") return;
                sControl = '<div wfmodel="' + wfmodel + '" style="position:absolute;left:' + rect.left + 'px;top:' + rect.top + 'px; z-index: 300;">' + elem.outerHTML + '<div class="mask"></div></div>';
                document.body.insertAdjacentHTML("beforeend", sControl);
                if (sControl) {
                    this.dragSetting({
                        target: document.body.lastChild,
                        drops: [this.pDesign.getActiveSheet().DOM["sheetContainer"].children[0]]
                    }, evt);
                }
            }
        },
        makeDragControl: function (sType) {
            return control;
        },
        resize: function () {
            this.callSuper();
            this.sheets && this.sheets.resize();
        },
        makeHtml: function () {

        },
        toolbox: function () {

        },
        dragSetting: function (opts, evt) {
            if (!this.drag) {
                opts.onStart = this.onStartHanle;
                opts.onDrop = this.onDropHanle;
                this.drag = Drag.setStart(opts, evt);
            } else {
                Drag.setStart(opts, evt);
            }
            this.drag.Start(evt);
        },
        onStart: function (oEvent) {
            this.drag._x = 0;
            this.drag._y = 0;
        },
        onDrop: function (heDropTarget, dropTarget) {
            var sheet = this.pDesign.getActiveSheet(),
                heDrag = this.drag.Drag,
                rect = $ET.getRect(heDrag),
                x = rect.left, y = rect.top,
                xOffset = workflow.getAbsoluteX(),
                yOffset = workflow.getAbsoluteY(),
                scrollLeft = workflow.getScrollLeft(),
                scrollTop = workflow.getScrollTop();
            sheet.addModel(heDrag.getAttribute("wfmodel"), x - xOffset + scrollLeft, y - yOffset + scrollTop);
            document.body.removeChild(heDrag);
        },
        show: function () {
            this.heControl.style.display = "";
        },
        hidden: function () {
            this.heControl.style.display = "none";
        },
        toString: function (sheet) {
            if (typeof sheet == "undefined") {
                return this.sheets.toString(this.sheets);
            }
        }
    }, true),
    ToolBar = $C.Create({
        include: moduleToolBar,
        initialize: function (options, pDesign) {
            /*this.pDesign = pDesign;
            var _this = this,
               onHanlde = function (evt) {
                   var operName = (evt.srcElement || evt.target).getAttribute("data-operName");
                   _this.pDesign[operName] && _this.pDesign[operName]();
               };

            this.active = null;
            this.curDesign = null;
            this.heToolbars = [];
            this.containerWrap = options.toolBarContainer
            this.skinType = "blue";*/
        	var onHanlde = $F.bind(this, this.onHandle);
            this.operBtns = [
            //["img", "打开", "skins/blue/images/design_open.gif", ["onclick"], [onHanlde, "open"]],
					["img", "保存", "skin/blue/images/design_save.gif", ["onclick"], [onHanlde, "save"]],
					["img", "另存为", "skin/blue/images/design_saveas.gif", ["onclick"], [onHanlde, "saveAs"]],
					["img", "导入", "skin/blue/images/design_putin.png", ["onclick"], [onHanlde, "putIn"]],
                    ["img", "校验", "skin/blue/images/design_check.png", ["onclick"], [onHanlde, "check"]],
					["img", "剪切(Ctrl+X)", "skin/blue/images/design_cut.gif", ["onclick"], [onHanlde, "cut"]],
					["img", "复制(Ctrl+C)", "skin/blue/images/design_copy.gif", ["onclick"], [onHanlde, "copy"]],
					["img", "粘贴(Ctrl+V)", "skin/blue/images/design_paste.gif", ["onclick"], [onHanlde, "paste"]],
					["img", "撤销(Ctrl+Z)", "skin/blue/images/design_undo.gif", ["onclick"], [onHanlde, "reback"]],
					["img", "回撤(Ctrl+Alt+Z)", "skin/blue/images/design_redo.gif", ["onclick"], [onHanlde, "redo"]]
				];
            //this.container = this.createToolbar(this.operBtns, this.containerWrap);
            this.callSuper(options, pDesign);
        },
        setOptions: function (options) {

        },
        resize: function () {

        },
        toString: function (sheet) {
        }
    }, true),
    AttributePage = $C.Create({
        initialize: function (options, pDesign) {
            this.pDesign = pDesign;
            this.attrPagePanel = pDesign.attrPagePanel;
            this.attrPagePanel.setIframe({
                src: "",
                border: "0",
                scrolling: "no",
                autoSize: false,
                height: "100%",
                width: "100%"
            });
            this.activeControl = null;
        },
        setOptions: function (options) {

        },
        location: function (src, iframe) {
            return this.attrPagePanel.location(src, iframe);
        },
        resize: function () {
        },
        toString: function (sheet) {
        }
    }, true),
    FlowSheets = $C.Create(Array, {
        include: [moduleSheets],
        initialize: function (aSheets, pGrid) {
            this.pGrid = pGrid || null;
            this.keyPrefix = "flow";
            this.callSuper(aSheets, this.pGrid);
            this.hiddenSheetOp();
        },
        addSheet: function (options) {
            return this.callSuper(options, FlowSheet);
        },
        delSheet: function () {
            this.callSuper();
        },
        openAddDialog: function () {
            var _this = this;
            sDialog.open({
                title: 'Sheet行列输入',
                content: '<label style="margin-right:10px;">名称:</label><input type="text" id="txtSheetName" value="flow' + _this.length + '">',

                onConfirm: function () {
                        sheet = _this.addSheet({
                            id: document.getElementById("txtSheetName").value || "flow" + _this.length,
                            active: _this.length - 1
                        });
                        _this.changeTab(sheet);
                    }
            });
        },
        resize: function () {
            this.callSuper();
            this.activeSheet.resize();
        }
    }),
    FlowDesign = $C.Create({
        include: moduleGrid,
        initialize: function (options, flw) {
            this.grid = options.heTemplate;
            this.container = this.grid.parentNode;
            this.dbId = options.id || "";
            this.name = options.name;
            this.style = "";
            this.script = "";
            this.type = "flow";
            this.flw = flw;
            this.setDOM({
                container: this.container,
                grid: this.grid
            });
            this.isParamDesin = !!options.isParamDesin;
            this.setPanel((this.isParamDesin ? flw.flw : flw)["rDockTab"]); //todo： 动态生成面板
            this.toolBar = new ToolBar(options, this);
            this.toolBar.setDesign(this);
            this.resize();
            this.sheets = new FlowSheets(options.xnSheet ? options.xnSheet : null, this);
            this.toolBox = new ToolBox(options, this);
            this.attrPage = new AttributePage(null, this);
        },
        setOptions: function (options) {

        },
        setPanel: function (panels) {
            this.attrPagePanel = panels["attrPage"]; //panel对象 其实都只需要heElement
            //this.structTreePanel = panels["structTree"]; //panel对象
        },
        resize: function () {
            this.callSuper();
            this.sheets && this.sheets.resize();
        },
        insertTemplate: function () {
            var flw = this.heRpt.cloneNode(true);
            //this.heRpt = this.heTemplate.children[0];
        },
        getActiveSheet: function () {
            return this.sheets.activeSheet;
        },
        getParamsDesin: function () {
            return $ET.nextSibingElement(this.heGrid);
        },
        show: function () {
            this.toolBox.show(this);
            this.toolBar.show(this);
            workflow = this.getActiveSheet().workflow;
            //document.getElementById("flowAttr").src = "Flow/attribute/flow.htm";
            this.attrPage.location("Flow/attribute/flow.htm", {
                border: "0",
                scrolling: "no",
                autoSize: false,
                height: "100%",
                width: "100%"
            });
        },
        hidden: function () {
            this.toolBox.hidden(this);
            this.toolBar.hidden(this);
        },
        toString: function (sheet) {
            if (typeof sheet == "undefined") {
                return this.sheets.toString(this.sheets);
            }
        },
        save: function () {
        	var XMLStr = this.getActiveSheet().workflow.toXML();	
            XMLSend = $X.loadXML(XMLStr);
            if (XMLStr != "" && XMLSend.xml == "") {
                alert("XML定义有错误!");
                return;
            }
            $R({
                type: "post",
                url: "../../Flow/define/workFlowDefineAction!updateFlowDefine.action",
                async: false,
                data: XMLSend,
                contentType: "text/xml",
                success: function (xhr) {
                	if(xhr.responseXML == null){
                		alert(xhr.responseText);
                		return;
                	}
                    var returnAjaxValue = xhr.responseXML.selectSingleNode("RAD/Doc/Result/ResCode").text;
                    if (returnAjaxValue == "1") {
                        alert("保存流程错误，请联系管理员！");
                    }
                    else {
                    	var flowId = xhr.responseXML.selectSingleNode("RAD/Doc/Result/ResDetail").text;
                    	alert("保存流程成功，流程ID为：" + flowId);
                    }
                },
                error: function (xhr) {
                    alert('错误: ' + xhr.status);
                }
            });
        },
        saveAs: function () {
        	var XMLStr = this.getActiveSheet().workflow.toXML();
            XMLSend = XMLStr;
            if (XMLStr != "" && XMLSend.xml == "") {
                alert("XML定义有错误!");
                return;
            }
            var b =  function (url, args, name){
                var tempForm = document.createElement("form");
                document.body.appendChild(tempForm);
                tempForm.id="tempForm";
                tempForm.method="post";
                tempForm.action=url;
                tempForm.target=name;
                tempForm.style.display="none";
                var tempForm = document.getElementById("tempForm");
                    //可传入多个参数
                var hideInput = document.createElement("input");
                hideInput.type="hidden";
                hideInput.name= "xml";
                hideInput.value= XMLSend;
                tempForm.appendChild(hideInput);  
                
                $E.on(tempForm, "submit", function(e){
//                	window.open(url ,name,"directories=no,location=no,menubar=no,resizable=yes,scrollbars=yes,status=no,toolbar=no"); 
                });
                tempForm.submit();
                document.body.removeChild(tempForm);
            };
            var url = "workFlowDefineAction.aspx?method=exportDefineXML";
            b(url,"","aaa");
        },
        check: function () {
            alert("功能开发中");
        },
        putIn: function () {
        	var _this = this;
        	var fileName = window.showModalDialog("Flow/xmlUpload.html" ,"xmlImport", 
        			"dialogWidth: 500px; dialogHeight: 200px;   center: Yes; help: no; resizable: no; status: no;"); 
	         if(fileName){
	        	 $R({
	                 type: "get",
	                 url: "../../Flow/define/workFlowDefineAction!getWorkflowDefineXML?tempXMLFileName="+fileName,
	                 contentType: "text/xml",
	                 success: function (result) {
	                	 console.info(_this);
	                	 _this.sheets.activeSheet.parseFlowDefine(result.responseXML);
	                 },
	                 error: function (xhr) {
	                 },
	             });
	 
	         }
//        	window.open("../FormSystem/form/common/xmlUpload.html" ,name,"width=500px,height=220px,directories=no,location=no,menubar=no,resizable=yes,scrollbars=yes,status=no,toolbar=no"); 
        	
//            $R({
//                type: "post",
//                url: "Flow/dbhandle/loadxml.aspx",
//                async: false,
//                success: function (xhr) {
//                    var returnAjaxValue = xhr.responseXML.selectSingleNode("RAD/Doc/Data/Message").attributes.getNamedItem("value").value;
//                    if (returnAjaxValue != "操作成功") {
//                        alert("导入失败，请联系管理员！");
//                    }
//                    else {
//                        if (sRet != "" && typeof sRet != "undefined") {
//                            //替换脚本保留字符
//                            sRet = sRet.replace("@@@", "<Script>");
//                            sRet = sRet.replace("$$$", "<\/Script>");
//                            var reQuote = /\+\+\+/g;
//                            sRet = sRet.replace(reQuote, "'");
//
//                            this.sheets.activeSheet.parseFlowDefine(sRet);
//                        }
//                    }
//                },
//                error: function (xhr) {
//                    alert('Failure: ' + xhr.status);
//                },
//                data: XMLSend,
//                contentType: "text/xml"
//            });
        },
        cut: function () {
            this.sheets.activeSheet.cut();
        },
        copy: function () {
            this.sheets.activeSheet.copy();
        },
        paste: function () {
            this.sheets.activeSheet.paste();
        },
        reback: function () {
            this.sheets.activeSheet.reback();
        },
        redo: function () {
            this.sheets.activeSheet.redo();
        }
    });
    FlowDesign.getNameList = function(){
    	var flowDefineList = null;
    	$R({
            type: "post",
            url: "../../Flow/define/workFlowDefineAction!getAllFlowDefineJson",
            async: false,
            success: function (xhr) {
            	 var result = xhr.responseXML.selectSingleNode("RAD/Doc/Result/ResCode");
            	 if(result.text === "0"){
            		 var flowDefine = xhr.responseXML.selectSingleNode("RAD/Doc/Result/ResDetail").text;
            		 flowDefineList = eval(flowDefine);
            	 }
            },
            error: function (xhr) {
            },
            data: null,
            contentType: "text/xml"
        });
    	return flowDefineList;
    };
    FlowDesign.getDefine = function (id) {
    	var flowDefine = null;
    	$R({
            type: "post",
            url: "../../Flow/define/workFlowDefineAction!getFlowDefineById",
            async: false,
            success: function (xhr) {
            	 var result = xhr.responseXML.selectSingleNode(".//ResCode");
	           	 if(result.text === "0"){
	           		 flowDefine = xhr.responseXML;
	           	 }
            },
            error: function (xhr) {
            },
            data: { FlowId : id},
            contentType: "text/xml"
        });
    	return flowDefine;
    };
    FlowDesign.create = function (opts, parent) {
    	var lsSheetId=[];
        if (opts.xnSheet && opts.xnSheet.length > 0 && (/^\d+$/.test(opts.xnSheet[0].id) == true)) {
        	opts.xnSheet = FlowDesign.getDefine(opts.xnSheet[0].id);
        }
        return new FlowDesign(opts, parent);
    };

    window.FlowDesign = FlowDesign;
})(window);

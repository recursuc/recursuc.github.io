/*
    设计器
    树节点类型：
    1： folder
    2： sheets
    3： sheet
*/
(function () {
    var doc = window.document,
	    F = $F,
	    ET = $ET,
	    E = $E,
        O = $O,
        R = $R,
        count = 0,
	    Explore = $C.Create({
	        initialize: function (options, pDesin) {
	            this.design = pDesin;
	            this.container = options.container
	            this.roots = [{
	                id: "0",
	                text: "表单",
	                isLeaf: false,
	                data: {
	                    Catetogry: "form",
	                    CMType: "folder"
	                },
	                childNodes: null
	            }, {
	                id: "1",
	                text: "报表",
	                isLeaf: false,
	                data: {
	                    Catetogry: "report",
	                    CMType: "folder"
	                },
	                childNodes: null
	            }];
	            //, {
	            //  id: "2",
	            //  text: "查询列表",
	            //  isLeaf: false,
	            //  data: {
	            //      Catetogry: "query",
	            //      CMType: "folder"
	            //  },
	            //  childNodes: null
	            //}, {
	            //    id: "3",
	            //    text: "工作流",
	            //    isLeaf: false,
	            //    data: {
	            //        Catetogry: "form",
	            //        CMType: "folder"
	            //    },
	            //    childNodes: null
	            //}
	            this.operNodes = [];

	            this.explore = new Tree({
	                imgBasePath: "../sfk/tree/images/",
	                iconType: 0,
	                container: this.container,
	                showLine: true,
	                showCheck: false,
	                onClick: function (evt, node) {
	                    // alert(node);
	                    if (typeof node.data != "string") {
	                        pDesin.show(evt, node.data);
	                    } else {
	                        node.childNodes.length == 0 && pDesin.explore.getNameList(node);
	                    }
	                },
	                contentEditable: true,
	                roots: this.roots,
	                enableCM: true,
	                onShowCM: this.onShowCM()
	                //CM: null //this.getCM(this.container, F.bind(this, this.cmAction))
	            });
	        },
	        onShowCM: function () {
	            var _this = this, root, activeCM = null,
				heTarget = this.container,
				CMAction = function (evt, nodes, mi) {
				    var on = mi["OperName"];
				    _this[on] && _this[on](nodes[0], root.Catetogry); //evt, nodes, mi, root.Catetogry
				},
				getMenuData = function (sType) {
				    return [{
				        id: "add",
				        text: "添加",
				        icon: "",
				        action: CMAction,
				        onShow: this.onShow,
				        items: [{
				            id: "folder",
				            text: "文件夹",
				            icon: "",
				            action: CMAction,
				            data: { OperName: "addFolder" }
				        }, {
				            id: "sheets",
				            text: sType + "簿",
				            icon: "",
				            action: CMAction,
				            data: { OperName: "addSheets" }
				        }, {
				            id: "sheet",
				            text: sType + "项",
				            icon: "",
				            action: CMAction,
				            data: { OperName: "addSheet" }
				        }]
				    }, {
				        id: "open",
				        text: "打开",
				        icon: "",
				        action: CMAction,
				        data: { OperName: "open" }
				    }, {
				        id: "del",
				        text: "删除",
				        icon: "",
				        action: CMAction,
				        data: { OperName: "del" }
				    }
					];
				},
				menu = {
				    "folder": "(add(folder,sheets),open,del)",
				    "sheets": "(add(sheet),open,del)",
				    "sheet": "(open,del)"
				},
				cacheCM = { //一组一个菜单实例 子类型通过隐藏显示
				    report: {
				        data: getMenuData("report"), //报表右键菜单项集合
				        CM: null,
				        "folder": menu["folder"], //关系和实例
				        "sheets": menu["sheets"],
				        "sheet": menu["sheet"]
				    },
				    form: {
				        data: getMenuData("form"), //报表右键菜单项集合
				        "folder": menu["folder"], //关系和实例
				        "sheets": menu["sheets"],
				        "sheet": menu["sheet"]
				    }
				};

	            return function (evt, nodes, fnBindCM) {
	                var node = nodes[0], CM;
	                root = node;
	                while (root && root.level != 1) {
	                    root = root.pNode;
	                }

	                if (cacheCM[root.Catetogry].CM) {
	                    CM = cacheCM[root.Catetogry].CM;
	                } else {
	                    CM = cacheCM[root.Catetogry].CM = new ContextMenu({
	                        imgBasePath: "../sfk/contextmenu/images",
	                        target: heTarget,
	                        name: "contextMenu",
	                        items: cacheCM[root.Catetogry].data,
	                        onShow: function (evt, mi, node) {
	                            //CM.filter(cacheCM[root.Catetogry][node.CMType]);
	                        }
	                    });
	                }
	                CM.setShowItems(cacheCM[root.Catetogry][node.CMType]);
	                fnBindCM(CM);
	                if (!activeCM) {
	                    activeCM = CM;
	                } else if (activeCM != CM) {
	                    activeCM.hidden();
	                    activeCM = CM;
	                }
	            };
	        },
	        onShow: function (evt, mi) { },
	        addFolder: function (node, catetogry) {
	            var newNode = this.explore.insert({
	                text: "目录" + (++count),
	                isLeaf: false,
	                data: {
	                    Catetogry: catetogry,
	                    CMType: "folder"
	                }
	            }, node, "LC");
	            newNode.txtPosition();

	            newNode.OperFlag = "C";
	            this.operNodes.push(newNode);
	        },
	        openSheets: function (node, catetogry) {
	        },
	        openSheet: function (node, catetogry) {

	        },
	        addSheets: function (node, catetogry) {
	            var design = null, sheet;
	            switch (catetogry) {
	                case "report":
	                    design = this.design.add("report");
	                    design.Node = this.explore.insert({
	                        text: design.name,
	                        data: {
	                            CMType: "sheets",
	                            Type: "sheets",
	                            Desin: design
	                        }
	                    }, node, "LC");

	                    sheet = design.sheets[0];
	                    this.explore.insert({
	                        text: sheet.name,
	                        data: {
	                            CMType: "sheet",
	                            Type: "sheet",
	                            Desin: sheet,
	                            imgSrc: "../sfk/tree/images/tree_file.gif"
	                        }
	                    }, design.Node, "LC");
	                    break;
	                case "form":
	                    if (sDir != "open") {
	                        if (root == node) {
	                            data = this.design.add("form", null, true, node.id);
	                        } else {
	                            this.design.add("form", nodes[0]);
	                            data = this.design.add("form", null, true, node.id);
	                        }
	                        var nodeType = node.data;
	                        switch (typeof nodeType) {
	                            case "string":
	                                newNode = explore.insert({
	                                    id: data.id,
	                                    text: "form0.frm",
	                                    data: data
	                                }, nodes[0], sDir);
	                                newChildNode = explore.insert({
	                                    text: "form",
	                                    data: {
	                                        name: "form"
	                                    },
	                                    imgSrc: "../sfk/tree/images/tree_file.gif"
	                                }, newNode, sDir);
	                                break;
	                            case "object":
	                                newChildNode = explore.insert({
	                                    text: "form",
	                                    data: {
	                                        name: "form"
	                                    },
	                                    imgSrc: "../sfk/tree/images/tree_file.gif"
	                                }, nodes[0], sDir);
	                                break;
	                        }
	                    } else {
	                        data = this.design.add("form", nodes[0]);
	                    }
	                    break;
	                case "query":
	                    break;
	                case "flow":
	                    if (sDir != "open") {
	                        data = this.design.add("flow", null);
	                        var nodeType = nodes[0].data;
	                        switch (typeof nodeType) {
	                            case "string":
	                                newNode = explore.insert({
	                                    id: data.id,
	                                    text: "flow0.frm",
	                                    data: data
	                                }, nodes[0], sDir);
	                                newChildNode = explore.insert({
	                                    text: "flow",
	                                    data: {
	                                        name: "flow"
	                                    },
	                                    imgSrc: "../sfk/tree/images/tree_file.gif"
	                                }, newNode, sDir);
	                                break;
	                            case "object":
	                                newChildNode = explore.insert({
	                                    text: "flow",
	                                    data: {
	                                        name: "flow"
	                                    },
	                                    imgSrc: "../sfk/tree/images/tree_file.gif"
	                                }, nodes[0], sDir);
	                                break;
	                        }
	                    } else {
	                        data = this.design.add("flow", nodes[0]);
	                    }
	                    break;
	                default:
	                    break;
	            }
	        },
	        addSheet: function (nodes) {
	        },
	        open: function (nodes) {
	        },
	        openDialog: function () {

	        },
	        del: function (node) {
	            var oNode;
	            for (var i = 0; i < this.operNodes.length; i++) {
	                oNode = this.operNodes[i];
	                if (node.contains(oNode)) {
	                    this.operNodes.splice(i--, 1);
	                    continue;
	                }
	            }
	            node.OperFlag = "D";
	            this.operNodes.push(newNode);
	        },
	        edit: function (node) {
	            node.OperFlag = "U";
	            this.operNodes.push(newNode);
	        },
	        cmAction: function (evt, nodes, operType) {
	            if (nodes) {
	                var newNode = null,
					data = null,
					explore = this.explore,
					root,
					node = nodes[0],
					sDir = "FC";
	                while (node && node.level != 1) {
	                    node = node.parentNode;
	                }

	                if (node) {
	                    switch (node.data) {
	                        case "report":
	                            data = this.design.add("report", node.data);
	                            if (sDir != "open") {
	                                newNode = explore.insert({
	                                    text: data.name,
	                                    data: data
	                                }, node, sDir);
	                            }
	                            break;
	                        case "form":
	                            if (sDir != "open") {
	                                if (root == node) {
	                                    data = this.design.add("form", null, true, node.id);
	                                } else {
	                                    this.design.add("form", nodes[0]);
	                                    data = this.design.add("form", null, true, node.id);
	                                }
	                                var nodeType = node.data;
	                                switch (typeof nodeType) {
	                                    case "string":
	                                        newNode = explore.insert({
	                                            id: data.id,
	                                            text: "form0.frm",
	                                            data: data
	                                        }, nodes[0], sDir);
	                                        newChildNode = explore.insert({
	                                            text: "form",
	                                            data: {
	                                                name: "form"
	                                            },
	                                            imgSrc: "../sfk/tree/images/tree_file.gif"
	                                        }, newNode, sDir);
	                                        break;
	                                    case "object":
	                                        newChildNode = explore.insert({
	                                            text: "form",
	                                            data: {
	                                                name: "form"
	                                            },
	                                            imgSrc: "../sfk/tree/images/tree_file.gif"
	                                        }, nodes[0], sDir);
	                                        break;
	                                }
	                            } else {
	                                data = this.design.add("form", nodes[0]);
	                            }
	                            break;
	                        case "query":
	                            if (sDir != "open") {
	                                data = this.design.add("query", null);
	                                var nodeType = nodes[0].data;
	                                switch (typeof nodeType) {
	                                    case "string":
	                                        newNode = explore.insert({
	                                            id: data.id,
	                                            text: "query0.list",
	                                            data: data
	                                        }, nodes[0], sDir);
	                                        newChildNode = explore.insert({
	                                            text: "query",
	                                            data: {
	                                                name: "query"
	                                            },
	                                            imgSrc: "../sfk/tree/images/tree_file.gif"
	                                        }, newNode, sDir);
	                                        break;
	                                    case "object":
	                                        newChildNode = explore.insert({
	                                            text: "query",
	                                            data: {
	                                                name: "query"
	                                            },
	                                            imgSrc: "../sfk/tree/images/tree_file.gif"
	                                        }, nodes[0], sDir);
	                                        break;
	                                }

	                            } else {
	                                data = this.design.add("query", nodes[0]);
	                            }
	                            break;
	                        case 3:
	                            if (sDir != "open") {
	                                data = this.design.add("flow", null);
	                                var nodeType = nodes[0].data;
	                                switch (typeof nodeType) {
	                                    case "string":
	                                        newNode = explore.insert({
	                                            id: data.id,
	                                            text: "flow0.frm",
	                                            data: data
	                                        }, nodes[0], sDir);
	                                        newChildNode = explore.insert({
	                                            text: "flow",
	                                            data: {
	                                                name: "flow"
	                                            },
	                                            imgSrc: "../sfk/tree/images/tree_file.gif"
	                                        }, newNode, sDir);
	                                        break;
	                                    case "object":
	                                        newChildNode = explore.insert({
	                                            text: "flow",
	                                            data: {
	                                                name: "flow"
	                                            },
	                                            imgSrc: "../sfk/tree/images/tree_file.gif"
	                                        }, nodes[0], sDir);
	                                        break;
	                                }
	                            } else {
	                                data = this.design.add("flow", nodes[0]);
	                            }
	                            break;
	                        default:
	                            break;
	                    }
	                }
	            }
	        },
	        getNameList: function (node) {
	            var data = node.data, _this = this, k = 0;
	            switch (data) {
	                case "form":
	                    FormDesign.getNameList(data, function (frms) {
	                        for (var i = 0, len = frms.childNodes.length; i < len; i++) {
	                            if (frms.childNodes[i].nodeType == "1") {
	                                // data只包含当前formtabs id
	                                _this.explore.insert({
	                                    id: frms.childNodes[i]
									.getAttribute("Id"),
	                                    text: frms.childNodes[i]
									.getAttribute("Name"),
	                                    data: {
	                                        id: frms.childNodes[i]
										.getAttribute("Id")
	                                    },
	                                    imgSrc: "../sfk/tree/images/folder.gif"
	                                }, node, "LC");
	                                ++k;
	                                // data 包含当前formtab id
	                                // 、对应formtabs 名称
	                                if (frms.childNodes[i].childNodes.length != 0) {
	                                    for (var j = 0, leng = frms.childNodes[i].childNodes.length; j < leng; j++) {
	                                        frms.childNodes[i].childNodes[j].nodeType == "1"
										 && _this.explore.insert({
										     id: frms.childNodes[i].childNodes[j]
											.getAttribute("Id"),
										     text: frms.childNodes[i].childNodes[j]
											.getAttribute("Name"),
										     data: {
										         id: frms.childNodes[i].childNodes[j]
												.getAttribute("Id"),
										         name: frms.childNodes[i]
												.getAttribute("Name"),
										         dsId: frms.childNodes[i]
												.getAttribute("DataSetId"),
										         cId: frms.childNodes[i]
												.getAttribute("ClientId")
										     },
										     imgSrc: "../sfk/tree/images/tree_file.gif"
										 }, node.childNodes[k - 1], "LC");
	                                        // _this.getCM(node.childNodes[k
	                                        // - 1],
	                                        // F.bind(_this,
	                                        // _this.cmAction));
	                                    }
	                                }
	                            }
	                        }
	                    });
	                    break;
	                case "query":
	                    break;
	                case "report":
	                    // var frms = FormDesign.getDefine();
	                    // for (var i = 0, len = frms.childNodes.length; i <
	                    // len;
	                    // i++) {
	                    // if (frms.childNodes[i].nodeType == "1") {
	                    // this.explore.insert({ text:
	                    // frms.childNodes[i].getAttribute("Name"), data: { Id:
	                    // frms.childNodes[i].getAttribute("Id")} }, node,
	                    // "LC");
	                    // }
	                    // }
	                    break;
	                case "flow":
	                    var _this = this,
					flowNameList = FlowDesign
						.getNameList(data);
	                    _this.explore.insert(flowNameList, node, "LC");
	                    break;
	                default:
	                    break;
	            }
	        },
	        save: function () {
	            var oNode, sbNodes = new StringBuilder();
	            for (var i = 0; i < this.operNodes.length; i++) {
	                oNode = this.operNodes[i];
	                switch (oNode.OperFlag) {
	                    case "D":
	                        {
	                            break;
	                        }
	                    case "U": { break; }
	                    case "C":
	                        {
	                            sbNodes.append('<node pid="' + oNode.pNode.id + '" id="" cid="" pcid="" text="' + oNode.text + '" operFlag = "C">');
	                            break;
	                        }
	                    default:

	                }

	            }

	            //cid pcid 前端节点关系id 拼出xml节点 关系入库
	            //<node pid="1" id="" cid="" pcid="" text="aaa" oper = "C">
	            //    <node pid="1" text="aaa" oper = "C" /> 
	            //<node>
	            //<node pid="1" id="2" text="mmmmm" oper = "U" /> 
	            //<node pid="1" id="3" text="mmmmm" oper = "D" /> 

	            var operNodes = this.operNodes;
	            $Ajax({
	                type: "post",
	                url: "common/RptDSAjax.aspx",
	                async: true,
	                success: function (xhr, data) {
	                    alert(xhr.status);
	                },
	                error: function (xhr, error) {
	                    alert('Failure: ' + xhr.status);
	                },
	                data: {
	                    name: newNode.name //,
	                }
	            });
	        }
	    }),
	    Design = $C.Create({
	        initialize: function (options) {
	            var heToolBar = document.getElementById("toolbar1"),
				    tH = heToolBar.offsetHeight,
				    slH = document.getElementById("tdSplitLine").offsetHeight,
				    pvs = $P.viewSize(),
				    mainDesign = document.getElementById("mainDesign"),
                    lSplitLine = doc.getElementById("lSplitLine"), iSLW = lSplitLine.offsetWidth,
                    rSplitLine = doc.getElementById("rSplitLine"),
				    leftDock = document.getElementById("leftDock"),
				    rightDock = document.getElementById("rightDock"),
				    designTab = document.getElementById("designTab"),
				    heWelLogo = document.getElementById("wellcomeLogo"),
				    hePanels = designTab.children[0],
				    heHead = designTab.children[1],
				    val = tH + slH + 15,
				    iH = pvs.height - val,
				    _this = this,
				    unInitializeDesign = true;

	            mainDesign.style.height = iH + "px";
	            this.heToolBar = heToolBar;
	            this.heMainDesign = mainDesign;
	            this.heDesignTab = designTab;
	            this.hePanels = hePanels;
	            this.heTemplate = document.getElementById("template");
	            this.heRptTemplate = this.heTemplate.children[0];
	            this.heFrmTemplate = this.heTemplate.children[1];
	            this.heFlwTemplate = this.heTemplate.children[2];
	            this.heFrmToolBox = doc.getElementById("frmToolBox");
	            this.heFlwToolBox = doc.getElementById("flwToolBox");
	            this.style = "";
	            this.script = "";
	            this.designs = {
	                "rpts": [],
	                "frms": [],
	                "flws": []
	            }
	            this.rpts = [];
	            this.frms = [];
	            this.flws = [];
	            this.switchTabHanle = F.bind(this, this.switchTabHanle);
	            this.tab = new Tab({
	                navs: heHead,
	                navsSize: 20,
	                panelType: "3",
	                panels: hePanels,
	                layout: "T", // 导航头方向
	                collapse: false,
	                active: 0,
	                toggle: "click",
	                enableClose: true,
	                onAddItem: function () {
	                    if (unInitializeDesign) {
	                        /*  z-index 设为 -1啦
	                        heWelLogo.style.display = "none";
	                        */
	                        ET.setCSS(this.heNav, {
	                            borderColor: "#E7C04D",
	                            borderBottomWidth: "5px"
	                        });
	                        unInitializeDesign = false;
	                    }
	                },
	                removeItem: function () {
	                    if (this.length == 0) {
	                        /*heWelLogo.style.display = "";*/
	                        this.heNav.style.borderColor = "";
	                        unInitializeDesign = true;
	                    }
	                },
	                onBeforeToggle: F.bind(this, this.onBeforeToggle),
	                onAfterToggle: F.bind(this, this.onAfterToggle),
	                target: designTab,
	                tSize: {
	                    width: designTab.clientWidth,
	                    height: iH
	                },
	                container: designTab.parentNode
	                // heContainer
	            });

	            var drops = [leftDock.children[0], rightDock.children[0]],
			    drop = function (panel, heDockTarget) {
			        if (heDockTarget == drops[0]) {
			            _this.lDockTab.insertPanel(panel);
			        } else if (heDockTarget == drops[1]) {
			            _this.rDockTab.insertPanel(panel);
			        }
			    };

	            var iDockMargin = ET.getStyleByPx(leftDock, "marginLeft");
	            this.lDockTab = new DockTab({
	                dock: leftDock,
	                panels: leftDock.children[0],
	                header: leftDock.children[1],
	                container: leftDock.parentNode,
	                drops: drops,
	                dockDir: "L",
	                active: 0,
	                state: "undock",
	                onBeforeResize: null,
	                onHandle: function (EvtType) {
	                    var iLDW = leftDock.offsetWidth;
	                    lSplitLine.style.left = iDockMargin + iLDW + "px";
	                    designTab.style.marginLeft = iDockMargin + iLDW + iSLW + "px"; // 主设计器距离左边距离
	                    if (EvtType == "onUnDock") {
	                        leftDock.style.zIndex = "300";
	                    } else {
	                        leftDock.style.zIndex = "";
                        }
	                    _this.resize(_this, val); // 重画设计器表格
	                },
	                navsSize: 20,
	                tSize: {
	                    width: 190,
	                    height: leftDock.parentNode.clientHeight
	                },
	                onBeforeToggle: function () {
	                },
	                onAfterToggle: function () {
	                },
	                onDrop: drop
	            });
	            this.lDockTab.pDesign = this;

	            // this.attrPage =this.rDockTab.addPanel(this....)

	            this.rDockTab = new DockTab({
	                dock: rightDock,
	                panels: rightDock.children[0],
	                header: rightDock.children[1],
	                container: rightDock.parentNode,
	                dockDir: "R",
	                state: "undock",
	                drops: drops,
	                onDrop: drop,
	                onHandle: function (EvtType) {
	                    var iLDW = rightDock.offsetWidth;
	                    lSplitLine.style.right = iDockMargin + iLDW + "px";
	                    designTab.style.marginRight = iDockMargin + iLDW + iSLW + "px"; // 主设计器距离左边距离
	                    if (EvtType == "onUnDock") {
	                        rightDock.style.zIndex = "300";
	                    } else {
	                        rightDock.style.zIndex = "";
	                    }
	                    _this.resize(_this, val); // 重画设计器表格
	                },
	                navsSize: 20,
	                tSize: {
	                    width: 190,
	                    height: leftDock.parentNode.clientHeight
	                },
	                onBeforeToggle: function () {
	                },
	                onAfterToggle: function () {
	                }
	            });
	            this.rDockTab.pDesign = this;

	            this.addDesin(typeof options != "undefined" ? options.childNodes : "");


	            this.lSplitLine = new Drag(lSplitLine, {
	                mxContainer: mainDesign,
	                Limit: true,
	                lock: true,
	                lockX: true,
	                onStart: function (oEvent) {
	                    oEvent.target.style.cursor = 'col-resize';
	                },
	                onMove: function () { },
	                onStop: function (helper) {
	                    var diffX = helper.eMouseX - helper.sMouseX;
	                    var dockWidth = _this.lDockTab.width();
	                    if (dockWidth + diffX > 2) {
	                        _this.lDockTab.resize(dockWidth + diffX);
	                        designTab.style.marginLeft = parseInt(designTab.style.marginLeft) + diffX + "px";
	                    } else {
	                        oEvent.target.style.left = helper.sL + "px";
	                    }
	                    _this.resize(_this, val);
	                }
	            });
	            this.rSplitLine = new Drag(rSplitLine, {
	                mxContainer: mainDesign,
	                Limit: true,
	                lock: true,
	                lockX: true,
	                onStart: function (oEvent) {
	                    oEvent.target.style.cursor = 'col-resize';
	                },
	                onMove: function () { },
	                onStop: function (helper) {
	                    var diffX = helper.eMouseX - helper.sMouseX;
	                    var dockWidth = _this.rDockTab.width();
	                    if (dockWidth - diffX > 2) {
	                        _this.rDockTab.resize(dockWidth - diffX);
	                        designTab.style.marginRight = parseInt(designTab.style.marginRight) - diffX + "px";
	                    } else {
	                        oEvent.target.style.left = helper.sL + "px";
	                    }
	                    _this.resize(_this, val);
	                }
	            });

	            E.on(window, "resize", this.resize, this, val);

	            this.explore = new Explore({
	                container: this.lDockTab["explore"].heContent
	            }, this);

	            this.datasource = null;
	        },
	        setOptions: function (options) { },
	        swicthToParams: function () { },
	        addDesin: function (xnlSheet, activeSeq) {
	            if (xnlSheet) {
	                if (xnlSheet.length) {
	                    for (var i = 0; i < xnlSheet.length; i++) {
	                        var xnSheet = xnlSheet[i],
	                        // active = xnSheet.getAttribute("active"),
							type = xnSheet.getAttribute("type");
	                        this.add(type, xnSheet);
	                    }
	                } else {
	                    this.add(type, xnlSheet);
	                }
	            } else {
	                var de = this.add("form", null);
	                var design = this.add("report", null, true);
	                //var flw = this.add("flow", null, false);
	            }
	            // this.tab.displayTab(this.activeTab);
	        },
	        add: function (type, xnSheet, isActive, pid) {
	            var tempName,
				    heTemplate,
				    tabItem,
				    xnSheets = [],
				    pid,
				    pname,
				    xnSheetid,
				    isRoot = false;
	            isRoot = (pid && pid == ("0" || "1" || "2")) ? true : false;
	            if (Tree.isNode(xnSheet) && !isRoot) {
	                if (xnSheet.childNodes.length > 0) {
	                    pid = xnSheet.id;
	                    pname = xnSheet.text;
	                    for (var i = 0, len = xnSheet.childNodes.length; i < len; i++) {
	                        var sheet = {
	                            id: xnSheet.childNodes[i].id,
	                            name: xnSheet.childNodes[i].text
	                        };
	                        xnSheets.push(sheet);
	                    }
	                    xnSheet = xnSheets;
	                } else {
	                    pid = xnSheet.pNode.id;
	                    pname = xnSheet.pNode.text;
	                    xnSheets.push(xnSheet);
	                    xnSheet = xnSheets;
	                }
	            } else if ($O.type(xnSheet) == "object") {
	                pid = xnSheet.sheetsId;
	                pname = xnSheet.sheetsName;
	                xnSheet = xnSheets.push(xnSheet);
	            }
	            type = type || "report";
	            isActive === false || (isActive = true);
	            switch (type.toLowerCase()) {
	                case "report":
	                    {
	                        tempName = "report" + this.rpts.length + ".rpt";
	                        heTemplate = this.heRptTemplate.cloneNode(true);
	                        tabItem = this.tab.add(tempName, heTemplate);
	                        tabItem.data = new ReportDesign({
	                            xnSheet: xnSheet,
	                            name: tempName,
	                            toolBarContainer: this.heToolBar,
	                            toolBoxContainer: this.heFrmToolBox,
	                            heTemplate: heTemplate
	                        }, this);
	                        this.rpts.push(tabItem.data);
	                        break;
	                    }
	                case "form":
	                    {
	                        tempName = pname || "form" + this.frms.length + ".frm";
	                        heTemplate = this.heFrmTemplate.cloneNode(true);
	                        if (!this.frms[pid] || isRoot) {
	                            tabItem = this.tab.add(tempName, heTemplate);
	                            tabItem.data = FormDesign.create({
	                                id: pid,
	                                cSheetsId: pid,
	                                cSheetsName: tempName,
	                                xnSheet: xnSheet,
	                                name: tempName,
	                                toolBarContainer: this.heToolBar,
	                                toolBoxContainer: this.heFrmToolBox,
	                                heTemplate: heTemplate
	                            }, this);
	                            this.frms[pid] = tabItem.data;
	                        } else {
	                            var curSheet = this.frms[pid].sheets;
	                            for (var i = 0, len = this.tab.tabItems.length; i < len; i++) {
	                                if (pid == this.tab.tabItems[i].data.cSheetsId) {
	                                    tabItem = this.tab.tabItems[i];
	                                }
	                            }
	                            this.frms[pid].show();
	                            if (!xnSheet && pid) {
	                                curSheet.addSheet({
	                                    id: "",
	                                    //									width : "400px",
	                                    //									height : "400px",
	                                    active: 1
	                                });
	                                curSheet.changeTab(curSheet[curSheet.length - 1]);
	                            } else {
	                                for (var i = 0, len = xnSheet.length; i < len; i++) {
	                                    xnSheetid = xnSheet[i].id;
	                                    if (!curSheet[xnSheetid]) {
	                                        var sheet = FormDesign.create({
	                                            id: pid,
	                                            xnSheet: xnSheet
	                                        }, this);
	                                        for (var x = 0, len = sheet.length; x < len; x++) {
	                                            curSheet.addSheet({
	                                                active: 0,
	                                                xnSheet: sheet[x]
	                                            }, FormSheet);
	                                        }
	                                    }
	                                }
	                                curSheet.changeTab(curSheet[xnSheetid]);
	                            }
	                        }
	                        break;
	                    }
	                case "flow":
	                    {
	                        tempName = pname || "flow" + this.flws.length + ".flw";
	                        heTemplate = this.heFlwTemplate.cloneNode(true);
	                        tempName = (xnSheet != null && xnSheet.length > 0) ? xnSheet[0].text : tempName;
	                        tabItem = this.tab.add(tempName, heTemplate);
	                        tabItem.data = FlowDesign.create({
	                            id: pid,
	                            cSheetsId: pid,
	                            cSheetsName: tempName,
	                            xnSheet: xnSheet,
	                            name: tempName,
	                            toolBarContainer: this.heToolBar,
	                            toolBoxContainer: this.heFlwToolBox,
	                            heTemplate: heTemplate
	                        }, this);
	                        this.flws.push(tabItem.data);
	                        break;
	                    }
	                case "query":
	                    {
	                        tempName = pname || ("query" + this.frms.length + ".list");
	                        heTemplate = this.heFrmTemplate.cloneNode(true);
	                        tabItem = this.tab.add(tempName, heTemplate);
	                        tabItem.data = FormDesign.create({
	                            id: pid,
	                            cSheetsId: pid,
	                            cSheetsName: tempName,
	                            xnSheet: xnSheet,
	                            name: tempName,
	                            toolBarContainer: this.heToolBar,
	                            toolBoxContainer: this.heFrmToolBox,
	                            heTemplate: heTemplate
	                        }, this);
	                        this.frms.push(tabItem.data);
	                        break;
	                    }
	                default:
	                    break;
	            }

	            if (isActive === false) {
	                tabItem.data.hidden();
	                if (this.activeTab) {
	                    this.tab.changeTab(this.activeTab);
	                } else {
	                    tabItem.hidden();
	                }
	            } else {
	                this.activeTab && this.activeTab.data.hidden();

	                this.activeTab = tabItem;
	                (xnSheetid && this.activeTab.data.show(xnSheetid)) || this.activeTab.data.show();
	                this.tab.changeTab(this.activeTab);
	            }

	            return tabItem.data;
	        },
	        createTemplate: function () {
	            var rpt = this.heRpt.cloneNode(true);
	            // this.heRpt = this.heTemplate.children[0];
	        },
	        onBeforeToggle: function (evt, tabItem, preActTab) { },
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
	            // this.toolBar.change(this.getDesign(design));
	        },
	        show: function (evt, design) {
	            this.tab.getTabItemByData(design, function (tabItem) {
	                this.switchTab(evt, tabItem);
	            });
	        },
	        showTab: function (design) {
	            var i = 0,
				tabItems = this.tab.tabItems,
				len = tabItems.length,
				tabItem;
	            for (; i < len; i++) {
	                tabItem = tabItems[i];
	                if (tabItem.data == design) {
	                    tabItem.show();
	                } else {
	                    tabItem.hidden();
	                }
	            }
	        },
	        getDesign: function (design) {
	            return design.type == "report" ? design.grid : design;
	        },
	        resize: function (evt, diffVal) {
	            var pvs = $P.viewSize(),
				iH = pvs.height - diffVal,
				max = Math.max(this.rpts.length, this.frms.length),
				i = 0;

	            this.heMainDesign.style.height = iH + "px";
	            this.hePanels.style.height = iH - 20 + "px";
	            // this.lDockTab.resize();
	            // this.rDockTab.resize();
	            for (; i < max; i++) {
	                this.rpts[i] && this.rpts[i].resize();
	                this.frms[i] && this.frms[i].resize();
	                this.flws[i] && this.flws[i].resize();
	            }
	        }
	    });

    window.Design = Design;
})();
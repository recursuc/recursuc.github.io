/*
    sfk_dockTab.js by zcj  最后更新日期 2013-06-20

*/
(function () {
    var DockTab = window.DockTab = $C.create();
    DockTab.prototype = {
        //拖放对象
        initialize: function (options) {
            var doc = document,
                heDock, heContainer,
                heHeader, ls, nav, rs,
                hePanels, panel,
                i, len;

            this.SetOptions(options);
            //this._dock = $F.bind(this, this.dock);
            //this._undock = $F.bind(this, this.undock);
            //this._close = $F.bind(this, this.close);

            this.panels = [];
            this.dockDir = this.options.dockDir.toUpperCase();
            this.state = this.options.state;
            this.active = this.options.active || 0;
            heContainer = this.options.container;
            heDock = this.target = this.options.dock;
            hePanels = this.options.panels || heDock.children[0];
            heHeader = this.options.header || heDock.children[1];

            this.tab = new Tab({
                navs: heHeader,
                navsSize: this.options.navsSize,
                panelType: "2",
                panels: hePanels,
                layout: this.dockDir, //导航头方向
                collapse: true,
                active: this.active, //-1
                toggle: "click",
                onBeforeToggle: this.options.onBeforeToggle,
                onAfterToggle: this.options.onAfterToggle,
                target: heDock,
                tSize: this.options.tSize,
                container: heContainer // heContainer
            })

            this.extendTab(this.tab);

            $ET.addClass(heDock, "dock");
            if (this.options.state === "undock") {
                this.dock(this.active);
            }
            //this.scope = this;
            this.makePane = this.makePane();
            for (i = 0, len = hePanels.children.length; i < len; i++) {
                this.makePane(hePanels.children[i]);
            }

            //$ET.addClass(hePanels, "panels");
            //this.resize = new Resizable({
            //    target: dock,
            //    container: container,
            //    rDiv: this.options.dockDir.toLowerCase() == "l" : ? ["R"], ["L"],
            //    onBeforeResize: this.options.onBeforeResize,
            //    onResize: this.options.onResize,
            //    onAfterResize: this.options.onAfterResize
            //});
        },
        //设置默认属性
        SetOptions: function (options) {
            this.options = {//默认值
                dock: null,
                container: null,
                dockDir: "L",
                state: "undock", // "expand"
                /*onDock: null,
                onUnDock: null,*/
                onHandle:null,
                drops: null,
                onDrop: null
            };
            $O.extend(this.options, options || {});
        },
        makePane: function () {
            var dockDir = this.options.dockDir.toUpperCase(),
                onBeforeResize = $F.bind(this, this.onBeforeResize),
                onResize = $F.bind(this, this.onResize),
            //                aVal = ["浮动", "uf", "折叠", "停靠", "x"],
                aVal = ["浮动", "uf", "折叠", "停靠"],
            s = '<a href="#" panel="1">f</a><a href="#" panel="1">uf</a><a href="#" panel="1">un</a><a href="#" panel="1">pin</a><a class="close" panel="1" href="#" title="关闭">x</a>',
                opts = {
                    scope: this,
                    //                    drops: this.options.drops,
                    //                    onDrop: this.options.onDrop,
                    title_oper: [
                            {
                                tag: "a",
                                name: "f",
                                text: "浮动",
                                onclick: this.onFloat
                            },
                            {
                                tag: "a",
                                text: "uf",
                                name: "uf",
                                style: { display: "none" },
                                onclick: this.onUnFloat
                            },
                            {
                                tag: "a",
                                name: "undock",
                                text: "折叠",
                                onclick: this.onUnDock
                            },
                            {
                                tagType: "a",
                                text: "停靠",
                                style: { display: "none" },
                                name: "dock",
                                onclick: this.onDock
                            }
                            /*,
                            {
                                tagType: "a",
                                text: "x",
                                name: "x",
                                onclick: this.close
                            }*/
                    ],
                    limit: false,
                    onDrag: function () {

                    },
                    onBeforeResize: onBeforeResize,
                    onResize: onResize,
                    onAfterResize: null
                };

            return function (hePanle) {
                var heOper = $ET.lastElementChild(hePanle.children[0]),
                    options = {
                        container: hePanle.parentNode,
                        target: hePanle,
                        state: "undock",
                        drag: hePanle.children[0],
                        initHeight: this.options.container.clientHeight - 22//this.tab.navs.offsetHeight
                    }, panel, a, i = 0;

                $O.extend(options, opts);

                if (heOper.children.length == 0) {//chrome 一个一个付
                    a = document.createElement("a");
                    a.href = "#";
                    a.setAttribute("panel", "1");
                    while (true) {
                        a.innerText = aVal[i++];
                        heOper.appendChild(a);
                        if (i < aVal.length) {
                            a = a.cloneNode();
                        } else {
                            break;
                        }
                    }
                }

                //heOper.children.length > 0 || (heOper.insertAdjacentHTML("beforeend", s));
                panel = new Panel(options);
                //hePanle.style.display = "";
                this.panels.push(panel);
                panel.heTarget.id && (this[panel.heTarget.id] = panel); //支持id访问panel
                return panel;
            }
        },
        extendTab: function (tab) {
            var show = TabItem.prototype.show,
                hidden = TabItem.prototype.hidden,
                _this = this;

            this.tabExtMethod = {
                mouseover: function (evt) {
                    var preTabItem = null;
                    console.log("mouseover");
                    if (!this.clearTimer()) {
                        console.log("mouseover:show");
                        _this.scaleToHeader(false)
                        preTabItem = this.pTab.activeTab;
                        this.pTab.changeTab(this);
                        preTabItem && preTabItem.clearTimer();
                    }
                },
                mouseout: function (evt) {
                    console.log("mouseout");
                    this.clearTimer();
                    this.timer = setTimeout($F.bind(this, this.extHidden), 1000);
                    console.log("mouseout：" + this.timer);
                },
                extHidden: function () {
                    this.clearTimer();
                    hidden.apply(this, arguments);
                    _this.scaleToHeader(true);
                    console.log("hidden：" + this.isShow());
                },
                clearTimer: function () {
                    console.log("清除" + this.timer);
                    if (this.timer) {
                        clearTimeout(this.timer);
                        this.timer = null;
                        return true;
                    }
                    return false;
                }
            };

            //this.tabItemEvtBind = function () {
            //    $A.forEach(this.tab.tabItems, function (tabItem, index) {
            //        tabItem.mouseover || (tabItem.mouseover = {
            //            scope: tabItem,
            //            fn: mouseover
            //        });
            //        tabItem.mouseout || (tabItem.mouseout = {
            //            scope: tabItem,
            //            fn: mouseout
            //        });
            //        this.tabItemEvtExtend(tabItem, $E.bind, ["mouseover", "mouseout"], [tabItem.mouseover, tabItem.mouseout])
            //    }, this);
            //}

            this.tabItemEvtBind(this.tabExtMethod);
        },
        tabItemEvtBind: function (extMethod) {
            $A.forEach(this.tab.tabItems, function (tabItem, index) {
                $O.extend(tabItem, extMethod, false);
                $E.on(tabItem.navItem, "mouseover", tabItem.mouseover, tabItem);
                $E.on(tabItem.navItem, "mouseout", tabItem.mouseout, tabItem);

                if (this.state == "undock") {
                    $E.on(tabItem.panel, "mouseover", tabItem.mouseover, tabItem);
                    $E.on(tabItem.panel, "mouseout", tabItem.mouseout, tabItem);
                }
            }, this);
        },
        tabItemUnEvtBind: function () {
            $A.forEach(this.tab.tabItems, function (tabItem, index) {
                $O.unextend(tabItem, this.extMethod);

                $E.un([tabItem.panel, tabItem.navItem], "mouseover", tabItem.mouseover);
                $E.un([tabItem.panel, tabItem.navItem], "mouseout", tabItem.mouseout);
            }, this);
        },
        evtHanle: function () {

        },
        onBeforeToggle: function (oEvent, panel) {

        },
        onAfterToggle: function () {
        },
        onDock: function (oEvent, panel) {
            var target = oEvent.target;
            this.dock(panel);
            this.options.onHandle && this.options.onHandle("onDock");
        },
        onUnDock: function (oEvent, panel) {
            var target = oEvent.target;
            this.unDock(panel);
            this.options.onHandle && this.options.onHandle("onUnDock");
        },
        onFloat: function (oEvent, panel) {
            var target = oEvent.target, _this = this;
            this.floatPanel(panel.heTarget);
            if (this.tab.tabItems.length == 0) {
                this.heDock.style.display = "none";
                this.options.resize && this.options.resize(this.heDock.clientWidth, "d");
            }
            panel.state = "float";
            this.delPanel(panel);

            panel.dropable(this.options.drops, this.options.onDrop);
            this.options.onFloat && this.options.onFloat(this.target.offsetWidth);
        },
        onUnFloat: function (oEvent, panel) {
            var target = oEvent.target;
            this.unDock(panel);
            this.options.onUnDock && this.options.onUnDock(this.tab.getSize());
        },
        onBeforeResize: function (oEvent, helper) {
            if (this.state == "dock") { return false; }
            var panelToPos = helper.cur, panelSrcPos = helper.src;
            //helper.panel
            //            if (this.state == "dock" &&  panel.state != "float" &&
            //                panelToPos.left + panelToPos.width + panelSrcPos.borderLeftWidth + panelSrcPos.borderRightWidth >= 600) {
            //                return false;
            //            }
            ////console.log(panelToPos.left + panelToPos.width + panelSrcPos.borderLeftWidth + panelSrcPos.borderRightWidth);
        },
        onResize: function (helper) {

        },
        dock: function (panel) {
            this.state = "dock";
            this.tabItemUnEvtBind();
            this.tab.switchLayoutDisplay("B", panel);
            this.tab.switchToggleBind("click");

            $A.forEach(this.panels, function (panel, index) {
                panel.titleOpers['undock'].style.display = "";
                panel.titleOpers['dock'].style.display = "none";
            }, this);

            //target.style.display = "none";
            //this.panels[curPanelIndex].options.title_oper[0].elem.style.display = "";
        },
        unDock: function (panel) {
            this.state = "undock";
            $A.forEach(this.panels, function (panel, index) {
                panel.titleOpers['undock'].style.display = "none";
                panel.titleOpers['dock'].style.display = "";
            }, this);

            this.tab.switchLayoutDisplay(this.dockDir, -1);
            this.scaleToHeader(true);
            //setTimeout($F.bind(this, this.tabItemEvtBind, this.tabExtMethod), 1);
            this.tabItemEvtBind(this.tabExtMethod);
            //this.tab.swicthToggleBind("click");
            //target.style.display = "none";
            //this.panels[curPanelIndex].options.title_oper[1].elem.style.display = "";
        },
        scaleToHeader: function (bShow) {
            if (bShow) {
                this.tab.target.style.width = this.tab.heNavs.offsetWidth + "px";
                this.tab.target.style.overflow = "hidden";
            } else {
                this.tab.target.style.width = this.tab.size.width + "px";
                this.tab.target.style.overflow = "";
            }
        },
        onDrop: function (panel, heDockTarget) {
            //            var drops = this.options.drops, i = 0, len = drops.length;
            //            for (; i < len; i++) {
            //                if (drops[i] == heDockTarget) {
            //                    break;
            //                }
            //            }
            //            this.options.onDrop.call(panel, heDockTarget, i);
            //            this.insertPanel(panel);
            //            if (heDockTarget == this.options.panels) {
            //                panel.heTarget.style.left = 0 + "px";
            //                this.tab.add(panel.heTitleText, panel.heTarget);
            //            } else {

            //                //panel.heTarget.style.right = 0 + "px";
            //                this.pDesign.rDockTab.insertPanel(panel);
            //            }
        },
        unFloat: function (curPanelIndex) {
            this.state = "undock";
            $A.forEach(this.panels, function (panel, index) {
                panel.options.title_oper[0].elem.style.display = "none";
                panel.options.title_oper[1].elem.style.display = "";
            }, this);

            this.tab.switchLayoutDisplay(this.dockDir, -1);
            //setTimeout($F.bind(this, this.tabItemEvtBind, this.tabExtMethod), 1);
            this.tabItemEvtBind(this.tabExtMethod);
            //this.tab.swicthToggleBind("click");
            //target.style.display = "none";
            //this.panels[curPanelIndex].options.title_oper[1].elem.style.display = "";
        },
        width: function (iW) {
            if (iW) {
                this.options.dock.style.width = iW + "px";
            } else {
                return parseInt($ET.getStyle(this.options.dock, "width"));
            }
        },
        close: function (oEvent, curPanel) {

        },
        onDrag: function () {

        },
        unPanelBind: function (panel) {
            panel.unBind();
        },
        floatPanel: function (hePanel) {
            var w = $ET.getStyle(hePanel, "width"),
                h = $ET.getStyle(hePanel, "height");

            this.tab.delTab(hePanel);
            hePanel.style.width = w;
            hePanel.style.height = h;
            $ET.moveCenter(hePanel);
        },
        delPanel: function (panel) {
            for (var i = 0; i < this.panels.length; i++) {
                if (this.panels[i] == panel) {
                    panel.heTarget.id && (delete this[panel.heTarget.id]);
                    this.panels.splice(i, 1);
                    break;
                }
            }
        },
        insertPanel: function (panel) {
            this.tab.add(panel.heTitleText, panel.heTarget);
            if (!this.hasPanel(panel)) {
                panel.unBind();
                this.makePane(panel.heTarget);
            }
            $ET.setCSS(panel.heTarget, {
                top: 0 + "px",
                left: 0 + "px",
                width: "100%",
                heigt: "100%"
            });
            //panel.heTarget.style.top = 0 + "px";
            //panel.heTarget.style.left = 0 + "px";
            //panel.heTarget.style.width = "100%";
            //panel.heTarget.style.heigth = "100%";
        },
        hasPanel: function (panel) {
            for (var i = 0; i < this.panels.length; i++) {
                if (this.panels[i] == panel || this.panels[i].heTarget == panel) {
                    return panel;
                }
            }

            return null;
        },
        appendOperElem: function () {
            var s = '<a href="#" panel="1">f</a><a href="#" panel="1">uf</a><a href="#" panel="1">un</a><a href="#" panel="1">pin</a><a class="close" panel="1"href="#" title="关闭">X</a>';
        },
        resize: function (iW) {
            this.width(iW);
            this.tab.switchLayout(this.tab.layout);
        },
        dispose: function () {
            this.makePane = null;
        }
    };
})()


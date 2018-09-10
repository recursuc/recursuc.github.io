/*
    sfk_tab.js by zcj  2013-07-02
 
*/
(function () {
    var doc = document, E = $E, ET = $ET, Str = $Str, prefix = "tabItem_", count = 0,

	TabItem = $C.Create({
	    initialize: function (navItem, panel, p, toggle) {
	        this.navItem = navItem;
	        this.panel = panel;
	        this.pTab = p;
	        this.display = false;
	        this.create(this.navItem, this.panel);
	        this.timer = null;
	        this.index = null;
	        this.data = null;
	        this.heClose = null;
	        this.next = null;
	        this.prev = null;
	        toggle == null || this.bind(toggle);
	        $E.on(this.navItem, "dblclick", this.changItemName, this);
	    },
	    setOptions: function (options) {
	        var opt = {
	            navItem: null,
	            panel: null,
	            p: null,
	            toggle: "click"
	        };
	    },
	    switchLayout: function (layout) {
	        if (!this.heClose) { return; }
	        if (layout == "t" || layout == "b") {
	            ET.setCSS(this.heClose, {
	                marginLeft: "5px",
	                width: "11px",
	                height: "100%"
	            });
	        } else {
	            ET.setCSS(this.heClose, {
	                marginTop: "5px",
	                width: "100%",
	                height: "11px"
	            });
	        }
	    },
	    create: function (heNav, hePanel) {
	        this.heClose = document.createElement("span");
	        this.heClose.className = "ti-close";
	        ET.text(this.heClose, "x");
	        this.switchLayout(this.pTab.layout);
	        E.on(this.heClose, "click", function (evt) { this.pTab.close(this); }, this);

	        this.pTab.enableClose || (this.heClose.style.visibility = "hidden");
	        if (typeof heNav == "string") {
	            this.heA = document.createElement("a");
	            this.heA.href = "javascript:void(0)";
	            this.heA.appendChild(document.createTextNode(heNav));

	            this.navItem = document.createElement("li");
	            this.navItem.appendChild(this.heA);
	        } else {
	            this.heA = heNav.firstElementChild;
	        }
	        if (typeof hePanel == "string") {
	            this.panel = document.createElement("div");
	            this.panel.style.width = "100%";
	            this.panel.style.height = "100%";
	            // var heA = document.createElement("a");
	            // heA.appendChild(document.createTextNode(sNav));
	            // this.navItem.appendChild(heA);
	        }
	        this.heA.appendChild(this.heClose);
	        // $ET.addClass(this.navItem, "panel");
	        $ET.addClass(this.panel, "panel");
	        // this.pTab.add(this);
	    },
	    evtBind: function (evtFn, toggle, handles, he) {
	        var i = 0,
				len = toggle.length;
	        he = he || this.navItem;
	        if ($O.getType(handles) == "array") {
	            for (; i < len; i++) {
	                evtFn(he, toggle[i], handles[i]);
	            }
	        } else {
	            for (; i < len; i++) {
	                evtFn(he, toggle[i], handles);
	            }
	        }

	    },
	    unbind: function (toggle) {
	        this.evtBind($E.unbind, toggle, this.handle);
	    },
	    bind: function (toggle) {
	        this.toggle = toggle = (toggle || "click").split(/\s+/);
	        this.evtLen = toggle.length;
	        this.handle = {
	            scope: this,
	            fn: function (evt) {
	                this.pTab.switchTab(evt, this);
	            }
	        };
	        this.evtBind($E.bind, toggle, this.handle);
	    },
	    show: function () {
	        this.panel.style.display = "";
	        $ET.addClass(this.navItem, "active");
	    },
	    hidden: function () {
	        this.panel.style.display = "none";
	        $ET.removeClass(this.navItem, "active");
	    },
	    toggle: function () {
	        if (this.panel.style.display == "none") {
	            this.panel.style.display = "";
	            $ET.addClass(this.navItem, "active");
	        } else {
	            this.panel.style.display = "none";
	            $ET.removeClass(this.navItem, "active");
	        }
	    },
	    switchToggleBind: function (toggle) {
	        !this.toggle || this.unbind(this.toggle);
	        this.bind(toggle);
	    },
	    isShow: function () {
	        return this.panel.style.display == "none" ? false : true
	    },
	    clear: function () {
	        this.pTab = null;
	        this.navItem.parentNode.removeChild(this.navItem);
	        this.navItem = null;
	        this.panel.parentNode.removeChild(this.panel);
	        this.panel = null;
	    }
	}),
	Tab = $C.Create({
	    PrivateMember: {
	        navItemMaxSize: 200,
	        posProp: "left",
	        sizeProp: "width",
	        lrNavSize: 20,
	        lrNavShow: false,
	        isInBoundary: function (tabItem, size) {
	            if (!tabItem) { throw "first param is null!"; }
	            if (tabItem.navItem[this.offsetPosProp] + tabItem.navItem[this.offsetSizeProp] <= size) {
	                return true;
	            }

	            return false;
	        },
	        showLRNav: function (tabItem) {
	            if (this.lrNavShow) { return true; }
	            if (tabItem && !this.isInBoundary(tabItem, this.hcSize)) {
	                this.lrNavShow = true;
	                if (this.layout == "t" || this.layout == "b") {
	                    $ET.setCSS(this.hePrevNav, {
	                        position: "absolute",
	                        left: "0px",
	                        top: "0px",
	                        height: "100%",
	                        width: this.lrNavSize + "px",
	                        display: "block"
	                    });

	                    $ET.setCSS(this.heNextNav, {
	                        position: "absolute",
	                        top: "0px",
	                        right: "0px",
	                        height: "100%",
	                        width: this.lrNavSize + "px",
	                        display: "block"
	                    });

	                    this.hePrevNav.innerHTML = "前"; this.heNextNav.innerHTML = "后";
	                } else {
	                    $ET.setCSS(this.hePrevNav, {
	                        position: "absolute",
	                        top: "0px",
	                        left: "0px",
	                        height: this.lrNavSize + "px",
	                        width: "100%",
	                        display: "block"
	                    });

	                    $ET.setCSS(this.heNextNav, {
	                        bottom: "0px",
	                        left: "0px",
	                        position: "absolute",
	                        height: this.lrNavSize + "px",
	                        width: "100%",
	                        display: "block"
	                    });

	                    this.hePrevNav.innerHTML = "前"; this.heNextNav.innerHTML = "后";
	                }
	                this.hcSize = this.hcSize - 2 * this.lrNavSize;
	                return true;
	            }
	            return false;
	        },
	        hideLRNav: function () {
	            if (this.tabItems.length == 0 || tabItem && !this.isInBoundary(this.tabItems[this.tabItems.length - 1], this.lrNavShow ? this.hcSize + this.lrNavSize * 2 : this.hcSize)) {
	                this.hePrevNav.style.display = "none";
	                this.heNextNav.style.display = "none";
	                this.hcSize = this.hcSize + this.lrNavSize * 2;
	                return true;
	            }
	            return false;
	        },
	        setPrevNextStyle: function () {

	        }
	    },
	    initialize: function (options) {
	        var dock,
					header,
					ls,
					nav,
					navItems,
					rs,
					panels,
					pane,
					i = 0,
					pLen,
					j = 0,
					nLen,
					at;

	        this.tabItems = [];
	        this.length = 0;
	        this.first = this.last = null;
	        this.SetOptions(options);
	        this.activeStack = [];
	        this.target = this.options.target;
	        if (!this.target) return;
	        this.heContainer = this.options.container || this.target.parentNode;
	        this.collapse = this.options.collapse;
	        this.active = this.options.active;
	        this.toggle = this.options.toggle;
	        this.layout = this.options.layout;
	        this.onAddItem = this.options.onAddItem;
	        this.onRemoveItem = this.options.onRemoveItem;
	        this.enableClose = !!this.options.enableClose;
	        this.iNavWith = 0;
	        if (this.options.panels && this.options.navs) {
	            this.hePrevNav = document.createElement("div");
	            this.hePrevNav.className = "tab-PrevNav";
	            this.heNextNav = document.createElement("div");
	            this.heNextNav.className = "tab-NextNav";
	            E.on(this.hePrevNav, "mousedown", function (evt) {
	                if (evt.button == 2) {
	                    this.prevPage();
	                } else {
	                    this.prev();
	                }
	            }, this);

	            E.on(this.heNextNav, "mousedown", function (evt) {
	                if (evt.button == 2) {
	                    this.nextPage();
	                } else {
	                    this.next();
	                }
	            }, this);
	            //E.on(this.heNextNav, "dblclick", this.nextPage, this);
	            //	            E.on(this.hePrevNav, "mousedown", this.prev, this);
	            //				E.on(this.heNextNav, "mousedown", this.next, this);

	            this.iNavsSize = this.options.navsSize || 20;
	            this.size = this.options.tSize;
	            this.target.clientWidth || (this.size.width = this.heContainer.clientWidth + "px");
	            this.target.clientHeight || (this.size.height = this.heContainer.clientHeight + "px");
	            this.target.style.width = this.size.width + "px";
	            this.target.style.height = this.size.height + "px";

	            this.scrollType = this.options.scrollType.toUpperCase();
	            if (this.options.panels.ownerDocument) { // node
	                this.heNavs = this.options.navs;
	                this.hePanels = this.options.panels;
	            } else {
	                this.heNavs = document.createElement("div");
	                this.heNavs.appendChild(document.createElement("ul"));
	                this.target.appendChild(this.heNavs);

	                this.hePanels = document.createElement("div");
	                this.target.appendChild(this.hePanels);
	            }

	            this.heNav = this.heNavs.children[0];
	            this.heNavs.insertBefore(this.heNextNav, this.heNav.nextSibling);
	            this.heNavs.insertBefore(this.hePrevNav, this.heNav.nextSibling); //, this.heNav);

	            $ET.addClass(this.hePanels, "panels");
	            $ET.addClass(this.heNavs, "header");
	            $ET.addClass(this.heNav, "nav");

	            this.switchLayout(this.layout);

	            panels = this.hePanels.children;
	            plen = panels.length;
	            navItems = this.heNav.children;
	            nLen = navItems.length;
	            while (i < nLen && j < plen) {
	                navItem = navItems[i];
	                panel = panels[j];
	                if (panel.nodeType != 1) {
	                    j++;
	                    continue;
	                }
	                if (navItem.nodeType != 1) {
	                    i++;
	                    continue;
	                }

	                // $ET.addClass(panel, "panel");
	                this.add(navItem, panel, true);
	                i++;
	                j++;
	            }

	            // todo 多出内容或导航根据情况处理
	            if (this.active > -1) {
	                this.changeTab(this.getItem(this.active));
	            }
	        }
	    },
	    SetOptions: function (options) {
	        this.options = {
	            container: null, //tab所在父容器 (设置默认为其父节点)
	            target: null, //tab元素对象
	            navsSize: null, //navsSize 上下布局为高，左右为宽
	            tSize: null, //tab容器宽高  (设置默认与其所在定位父容器一样大)
	            collapse: false,
	            navs: null, //导航头htmlelement
	            panels: null, //内容htmlelement
	            active: 0,
	            layout: "b",
	            toggle: null,
	            onAddItem: null,
	            onRemoveItem: null,
	            onBeforeToggle: null,
	            onAfterToggle: null,
	            enableClose: false,
	            scrollType: "S"//tabitem内容超过头滚动方式，当前视图最后一条滚到新视图的：开始 中间 末尾 M E 
	        };

	        $O.extend(this.options, options || {}, false);
	    },
	    switchLayoutDisplay: function (name, active) {
	        var tabItem = this.getItem(active);
	        this.changeTab(tabItem);
	        this.switchLayout(name);
	    },
	    refresh: function () {
	        this.hcSize = this.heNavs["client" + this.sizeProp.capitalize()]; // 容纳tabitem有效宽度
	        this.switchLayout(this.layout);
	    },
	    recordSize: function () {
	        if (this.layout == "l" || this.layout == "r") { }
	        this.hcSize = this.heNavs["client" + Str.capitalize(this.sizeProp)]; // 容纳tabitem有效宽度
	    },
	    switchLayout: function (layout) {
	        var iL, iT, iR,
					iH,
					iW;
	        $ET.removeClass(this.heNavs, this.layout.toLowerCase() + "Header");
	        layout = layout.toLowerCase();
	        $ET.addClass(this.heNavs, layout + "Header");
	        switch (layout) {
	            case "t":
	                {
	                    $ET.setCSS(this.heNavs, {
	                        top: "0px",
	                        left: "0px",
	                        right: "",
	                        bottom: "",
	                        width: "100%",
	                        height: this.iNavsSize + "px"
	                    });

	                    $ET.setCSS(this.hePanels, {
	                        top: this.iNavsSize + "px",
	                        left: 0 + "px",
	                        right: "",
	                        bottom: "",
	                        height: this.target.clientHeight - this.iNavsSize + "px",
	                        width: "100%"
	                    });

	                    this.heNav.style.width = "9999px";
	                    this.heNav.style.height = "auto";
	                    this.posProp = "left"; this.sizeProp = "width";
	                    this.hcSize = this.heNavs.clientWidth;
	                    break;
	                }
	            case "b":
	                {
	                    $ET.setCSS(this.heNavs, {
	                        top: "",
	                        left: "0px",
	                        right: "",
	                        bottom: "0px",
	                        width: "100%",
	                        height: this.iNavsSize + "px"
	                    });

	                    $ET.setCSS(this.hePanels, {
	                        top: "0px",
	                        left: "0px",
	                        right: "",
	                        bottom: "",
	                        height: this.target.clientHeight - this.iNavsSize + "px",
	                        width: "100%"
	                    });

	                    this.heNav.style.width = "9999px";
	                    this.heNav.style.height = "auto";
	                    this.posProp = "left"; this.sizeProp = "width";
	                    this.hcSize = this.heNavs.clientWidth;
	                    break;
	                }
	            case "l":
	                {
	                    $ET.setCSS(this.heNavs, {
	                        top: "0px",
	                        left: "0px",
	                        right: "",
	                        bottom: "",
	                        height: "100%",
	                        width: this.iNavsSize + "px"
	                    });

	                    $ET.setCSS(this.hePanels, {
	                        top: "0px",
	                        left: this.iNavsSize + "px",
	                        right: "",
	                        bottom: "",
	                        height: "100%",
	                        width: this.target.clientWidth - this.iNavsSize + "px"
	                    });

	                    this.heNavs.style.height = "100%";
	                    this.heNav.style.height = "9999px";
	                    this.heNav.style.width = "auto";
	                    this.posProp = "top"; this.sizeProp = "height";
	                    this.hcSize = this.heNavs.clientHeight;
	                    break;
	                }
	            case "r":
	                {
	                    $ET.setCSS(this.heNavs, {
	                        top: "0px",
	                        left: "",
	                        right: "0px",
	                        bottom: "",
	                        height: "100%",
	                        width: this.iNavsSize + "px"
	                    });

	                    $ET.setCSS(this.hePanels, {
	                        top: "0px",
	                        left: "",
	                        right: this.iNavsSize + "px",
	                        bottom: "",
	                        height: "100%",
	                        width: this.target.clientWidth - this.iNavsSize + "px"
	                    });

	                    this.heNavs.style.height = "100%";
	                    this.heNav.style.height = "9999px";
	                    this.heNav.style.width = "auto";
	                    this.posProp = "top"; this.sizeProp = "height";
	                    this.hcSize = this.heNavs.clientHeight;
	                    break;
	                }
	            default:
	                break;
	        }

	        for (var i = 0, len = this.tabItems.length; i < len; i++) {
	            this.tabItems[i].switchLayout(layout);
	        }
	        this.offsetPosProp = "offset" + Str.capitalize(this.posProp);
	        this.offsetSizeProp = "offset" + Str.capitalize(this.sizeProp);
	        this.hcSize = this.heNavs["client" + Str.capitalize(this.sizeProp)];

	        this.lrNavShow = false; //切换布局重新初始化
	        this.tabItems.length > 0 && this.showLRNav(this.tabItems[this.tabItems.length - 1]) && this.activeTab && this.prevPage(this.activeTab);
	        this.layout = layout;
	    },
	    createNavsHtmlElem: function (length) {
	        var navs = document.createElement("div"),
					ul = document.createElement("ul"),
					li,
					i = 0;

	        for (; i < length; i++) {
	            li = document.createElement("li");
	            ul.appendChild(li);
	        }
	        var txt = document.createElement("input");
	        txt.setAttribute("style", "display: none; z-index: 0;position: absolute;width:9px; height: 6px;");
	        navs.appendChild(ul);
	        navs.appendChild(txt);
	        this.nav = ul;
	        return navs;
	    },
	    createPanelsHtmlElem: function () {
	        var i = 1, hePanels = document.createElement("div");
	        hePane = document.createElement("div");

	        hePanels.appendChild(hePane);
	        for (; i < length; i++) {
	            hePane = hePane.cloneNode();
	            hePanels.appendChild(hePane);
	        }

	        return hePanes;
	    },
	    createTab: function (navItem, pane, pt) {
	        var tabItem = new TabItem(navItem, pane, this, this.toggle, pt);
	        tabItem.index = ++count;
	        this.tabItems.push(tabItem);
	    },
	    add: function (heNavItem, hePane, bActive, uniqueID) {
	        var tabItem = null, iW, iPreNavWidth;
	        bActive === false || (bActive = true);
	        if (!(heNavItem instanceof TabItem)) {
	            tabItem = new TabItem(heNavItem, hePane, this, this.toggle);
	        } else {
	            tabItem = heNavItem;
	        }

	        tabItem.navItem.parentNode != this.heNav && this.heNav.appendChild(tabItem.navItem);
	        tabItem.panel.parentNode != this.hePanels && this.hePanels.appendChild(tabItem.panel);

	        //		        iW = tabItem.navItem.offsetWidth+ parseInt( ET.getStyle(tabItem.navItem, "marginRight")) + parseInt( ET.getStyle(tabItem.navItem, "marginLeft"));
	        //		        iPreNavWidth = this.iNavWith;
	        if (uniqueID == undefined) {
	            uniqueID = prefix + count++;
	        }

	        while (this.tabItems[uniqueID]) {
	            uniqueID = uniqueID.toString() + count++;
	        }
	        tabItem.uniqueID = uniqueID;
	        this.tabItems[this.length++] = this.tabItems[uniqueID] = tabItem;

	        if (!this.first) {
	            this.first = this.last = tabItem;
	        } else {
	            tabItem.next = this.last.next;
	            this.last.next = tabItem;
	            tabItem.prev = this.last;

	            this.last = tabItem;
	        }

	        this.showLRNav(tabItem);
	        if (bActive) {
	            this.changeTab(tabItem);
	        }

	        this.onAddItem && this.onAddItem(this);
	        return tabItem;
	    },
	    switchToggleBind: function (taggle) {
	        var i = 0,
					len = this.tabItems.length;
	        for (; i < len; i++) {
	            this.tabItems[i].switchToggleBind(taggle);
	        }
	    },
	    manageTab: function (evt) { },

	    delTab: function (tabItem) { // tabItem 可以挂到其它tab下
	        tabItem = this.getItem(tabItem);
	        if (!tabItem) { return; }
	        this.tabItems.splice(tabItem.index, 1);
	        this.length--;
	        delete this.tabItems[tabItem.uniqueID];
	        tabItem.prev && (tabItem.prev.next = tabItem.next);
	        tabItem.next && (tabItem.next.prev = tabItem.prev);

	        for (var i = tabItem.index, len = this.length; i < len; i++) {
	            this.tabItems[i].index = i;
	        }

	        if (this.activeTab == tabItem) {
	            /*
	            var len = this.activeStack.length;
	            while (len--) {
	            if (this.activeStack[len] == tabItem) {
	            this.activeStack.splice(len, 1);
	            }
	            }
	            */
	            while ((this.activeTab =this.activeStack.pop()) == tabItem);
	        }

	        tabItem && tabItem.clear();
	        this.changeTab(this.activeTab);
	        if (this.lrNavShow) {
	            this.lrNavShow = false;
	            this.hePrevNav.style.display = "none";
	            this.heNextNav.style.display = "none";
	        }
	        return;
	    },
	    switchTab: function (evt, tabItem) {
	        if (this.options.onBeforeToggle && this.options.onBeforeToggle(evt, tabItem, this.activeTab) === false) {
	            return;
	        };
	        this.changeTab(tabItem);
	        this.options.onAfterToggle && this.options.onAfterToggle(evt, tabItem, this.activeTab);
	    },
	    changeTab: function (tabItem) {
	        var preTab = null, i = 0, len = this.activeStack.length;
	        (tabItem instanceof TabItem) || (tabItem = this.getItem(tabItem));
	        if (!tabItem) { return; }

	        if (len == 0) {
	            tabItem.show();
	            this.activeTab = tabItem;
	            this.activeStack.push(this.activeTab);
	        } else if (this.activeStack[len - 1] != tabItem) {
	            this.activeTab.hidden();
	            preTab = this.activeTab;
	            this.activeTab = tabItem;
	            this.activeTab.show();

	            this.scrollView(this.activeTab);
	            for (; i < len; i++) {
	                if (this.activeStack[i] == tabItem) {
	                    this.activeStack.splice(i, 1);
	                    break;
	                }
	            }

	            this.activeStack.push(this.activeTab);
	        } else if (!this.activeTab.isShow()) {
	            this.activeTab.show();
	        }

	        return this.activeTab;
	    },
	    changeTabRecord: function () {

	    },
	    _find: function (bPrev) {//可视区域首个
	        var low = 0, high = this.tabItems.length - 1, mid, tabItem,
		    	offsetPos, offsetSize, sPos, ePos,
		    	iPos = bPrev ? Math.abs(ET.getStyleByPx(this.heNav, this.posProp)) + this.lrNavSize
		    			: Math.abs(ET.getStyleByPx(this.heNav, this.posProp)) + this.lrNavSize + this.hcSize;

	        while (low <= high) {
	            mid = Math.floor((low + high) / 2);
	            tabItem = this.tabItems[mid];
	            sPos = tabItem.navItem[this.offsetPosProp];
	            ePos = sPos + tabItem.navItem[this.offsetSizeProp];
	            if (sPos == iPos) {
	                if (bPrev) {
	                    mid > 0 && mid--;
	                }
	                break;
	            } else if (sPos < iPos) {
	                if (ePos == iPos) {
	                    if (!bPrev) {
	                        mid < this.tabItems.length - 1 && mid++;
	                    }
	                    break;
	                } else if (ePos > iPos) {
	                    break;
	                } else {
	                    low = mid + 1;
	                }
	            } else {
	                high = mid - 1;
	            }
	        }

	        if (low > high) {
	            mid = bPrev ? high : low;
	        }

	        return this.tabItems[mid];
	    },
	    prev: function () {
	        var tabItem = this._find(true);
	        this.heNav.style[this.posProp] = -(tabItem.navItem[this.offsetPosProp] - this.lrNavSize) + "px";
	    },
	    prevPage: function (tabItem) {////如果足够则显示后自身在最末
	        Tab.isTabItem(tabItem) || (tabItem = this._find(true));
	        var heNavItem = tabItem.navItem, start = 0,
					end = tabItem.navItem[this.offsetPosProp] + tabItem.navItem[this.offsetSizeProp];

	        while (heNavItem.previousSibling) {
	            if (heNavItem.previousSibling.nodeName == "LI") {
	                if (end - heNavItem.previousSibling[this.offsetPosProp] < this.hcSize) {
	                    heNavItem = heNavItem.previousSibling;
	                } else {
	                    break;
	                }
	            } else {
	                heNavItem = heNavItem.previousSibling;
	            }
	        }
	        if (!heNavItem.previousSibling) {
	            this.heNav.style[this.posProp] = this.lrNavSize + "px";
	        } else {
	            this.heNav.style[this.posProp] = this.lrNavSize + this.hcSize - end + "px";
	        }
	    },
	    next: function () {
	        var tabItem = this._find(false);
	        this.heNav.style[this.posProp] = -(tabItem.navItem[this.offsetPosProp] + tabItem.navItem[this.offsetSizeProp] - this.lrNavSize - this.hcSize) + "px";
	    },
	    nextPage: function (tabItem) {//如果足够则显示后自身在首个
	        Tab.isTabItem(tabItem) || (tabItem = this._find(false));
	        var heNavItem = tabItem.navItem, //start =0,
					start = tabItem.navItem[this.offsetPosProp], end; // + tabItem.navItem[this.offsetSizeProp];

	        while (heNavItem.nextSibling) {
	            if (heNavItem.nextSibling.nodeName == "LI") {
	                if (heNavItem.nextSibling[this.offsetPosProp] + tabItem.navItem[this.offsetSizeProp] - start < this.hcSize) {
	                    heNavItem = heNavItem.nextSibling;
	                } else {
	                    break;
	                }
	            } else {
	                heNavItem = heNavItem.nextSibling;
	            }
	        }

	        if (!heNavItem.nextSibling) {
	            end = heNavItem[this.offsetPosProp] + heNavItem[this.offsetSizeProp];
	            heNavItem = tabItem.navItem;
	            while (heNavItem.previousSibling) {
	                if (heNavItem.previousSibling.nodeName == "LI") {
	                    if (end - heNavItem.previousSibling[this.offsetPosProp] < this.hcSize) {
	                        heNavItem = heNavItem.previousSibling;
	                    } else {
	                        break;
	                    }
	                } else {
	                    heNavItem = heNavItem.previousSibling;
	                }
	            }

	            this.heNav.style[this.posProp] = this.lrNavSize + this.hcSize - end + "px";
	        } else {
	            this.heNav.style[this.posProp] = this.lrNavSize - start + "px";
	        }
	    },
	    scrollView: function (tabItem, dir, scrollType) {
	        //		    	var iSize, iNavPos,  temp, dir = 1;
	        //		    	scrollType || (scrollType = this.scrollType);
	        //		    	iSize = tabItem.navItem[this.offsetSizeProp] ;
	        //		    	iItemPos = tabItem.navItem[this.offsetPosProp];
	        //	    		iNavPos = Math.abs(ET.getStyle(this.heNav, this.posProp));
	        //	    		temp = iItemPos -  iNavPos + iSize;
	        //	    		if(temp > 0 && temp < this.hcSize + this.lrNavSize){return;} 
	        if (this.lrNavShow) {
	            this.prevPage(tabItem);
	        }
	        /*
	        if(this.hcSize < iSize){// 内容框不够内容显示
	        scrollType = "S";
	        }
	        switch(scrollType){
	        case "S":{
	        this.heNavs.style["pos"] = ET.getStyleByPx(tabItem.navItem, this.posProp) - this.iNavWith + "px";
	        break;
	        }
	        case "M":{
	        this.heNavs.style["pos"] = this.heNavs.clientWidth/2 -iItemPos - iSize/2+ "px";
	        break;
	        }
	        case "E":{
	        this.heNavs.style.left = this.hcSize - iItemPos- iSize + "px";
	        break;
	        }
	        }
	        */
	    },
	    getItem: function (uniqueID) { // hePanel li panelObject
	        var panel,
					i,
					len,
					tabItem;

	        if (this.tabItems[uniqueID]) {
	            return this.tabItems[uniqueID];
	        }
	        panel = uniqueID;
	        if (typeof Panel != "undefined" && panel instanceof Panel) {
	            panel = panel.heTarget;
	        }

	        for (i = 0, len = this.tabItems.length; i < len; i++) {
	            tabItem = this.tabItems[i];
	            if (tabItem.panel == panel || tabItem.navItem == panel) {
	                tabItem.index = i;
	                return tabItem;
	            }
	        }
	        return null;
	    },
	    delItem: function (tabItem) {

	    },
	    getTabItemByData: function (data, fn, scope) {
	        if (data) {
	            scope || (scope = this);
	            var i = 0,
						len = this.tabItems.length,
						tabItem;
	            for (; i < len; i++) {
	                tabItem = this.tabItems[i];
	                if (tabItem.data == data) {
	                    fn.call(scope, tabItem);
	                    return tabItem;
	                }
	            }
	        }
	        return null;
	    },
	    getHeadSize: function () {
	        return {
	            wdith: this.heNavs.offsetWdith,
	            height: this.heNavs.offsetHeight
	        };
	    },
	    getSize: function () {
	        var how = this.heNavs.offsetWidth,
					hoh = this.heNavs.offsetHeight;
	        return {
	            head: {
	                target: this.heNavs,
	                width: how,
	                height: hoh
	            },
	            content: {
	                target: this.target,
	                width: this.target.clientWidth - how,
	                height: this.target.clientWidth - hoh
	            }
	        };
	    }
	});

    Tab.isTabItem = function (o) {
        return o instanceof TabItem;
    };
    window.TabItem = TabItem;
    window.Tab = Tab;
})();

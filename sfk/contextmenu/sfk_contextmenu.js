/*
    sfk_contextmenu.js by zcj  2012-12-26
    右键菜单
    heTarget ： 右键DOM元素目标, 
    data : 传递的数据,
    onShow:显示菜单前触发的事件

    菜单项
    disable : 0显示()  1不显示  2显示灰色
    command: 默认点击项时触发动作处理
    onShow:显示子菜单前触发的事件
*/
(function (win, doc) {
    var E = $E, ET = $ET, F = $F,
        P = $P, pvs = null, pb, cacheCM = {},
    imgBasePath = "images",
    setPageBoundary = function () {
        pb = P.boundary();
    },
    disableCM = function () {
        return false;
    },
    repairePos = function (elem, iLeft, iTop, oMX) {
        var x, y;
        oMX = oMX || pb;
        if (iLeft + elem.offsetWidth > oMX.R) {
            x = iLeft - elem.offsetWidth;
            if (x >= oMX.L && x <= oMX.R) {
                iLeft = x;
            }
        }

        if (iTop + elem.offsetHeight > oMX.B) {
            y = iTop - elem.offsetHeight;
            if (y >= oMX.T && y <= oMX.B) {
                iTop = y;
            }
        }

        return {
            left: iLeft,
            top: iTop
        }
    },
    MenuItem = $C.Create({
        initialize: function (options, pItem, menu) {
            this.childItems = [];
            this.pItem = pItem;
            this.heUl = null;
            this.heLi = null;
            this.menu = menu; //所属菜单实例
            //this.state = "expand";
            this.activeCItem = null;
            options && (this.setOptions(options), this.createHtml());
            pItem && pItem.appendChild(this);
        },
        setOptions: function (options) {
            this.id = options.id;
            this.text = options.text;
            this.title = options.title || options.text;
            this.href = options.href;
            this.icon = options.icon;
            this.action = options.action;
            //this.actionParams = options.operName || "";
            this.evtType = options.evtType || "click";
            this.command = options.command;
            this.onShow = options.onShow;
            this.disable = options.disable || 0;

            for (var prop in options.data) {
                if (options.data.hasOwnProperty(prop) && /^[A-z]/.test(prop)) {
                    this[prop] = options.data[prop];
                }
            }

        },
        createHtml: function () {
            this.heLi = document.createElement("li");
            this.heLi.className = "Menu-Leaf";
            this.heLi.title = this.title;
            this.heLi.style.width = "120px";

            var div = document.createElement("div");
            this.heImg = document.createElement("img");
            this.heImg.src = this.icon || (imgBasePath + "/folder.gif");
            this.heImg.style.verticalAlign = "bottom";
            div.appendChild(this.heImg);

            this.heA = document.createElement("a");
            this.heA.href = this.href || "#";
            this.heA.innerHTML = this.text;
            this.disable && ET.addClass(this.heA, "disable");
            div.appendChild(this.heA);

            this.heLi.appendChild(div);

            this.action && (E.on(this.heLi, "mousedown", this.stopPropagation, this), E.on(this.heLi, this.evtType, this.actionHandle, this)); //
            E.on(this.heLi.firstChild, "mouseover", this.active, this);
            //E.on(this.heLi.firstChild, "mouseout", this.hiddenItems, this);
        },
        createHeUl: function () {
            if (!this.heUl) {
                this.heUl = document.createElement('ul');
                this.heUl.style.position = "absolute";
                this.heUl.style.display = "none";
                this.heUl.className = '';
                //E.on(this.heUl, "mouseover", this.showItems, this);
                //E.on(this.heUl, "mouseout", this.hidden, this);
                this.heLi.firstChild.insertAdjacentHTML("beforeend", "<span style='float:right;font-size:12px;'>&gt;</span>");
                this.heLi.appendChild(this.heUl);
            }
        },
        appendChild: function (menuItem) {
            this.createHeUl();
            this.heUl.appendChild(menuItem.heLi);

            this.childItems.push(menuItem);
            return menuItem;
        },
        insertBefore: function (menuItem, refMI) {
            if (!Menu.isMenuItem(menuItem) || !Menu.isMenuItem(refMI)) { return; }
            this.createHeUl();
            this.heUl.appendChild(menuItem.heLi);

            this.childItems.push(menuItem);
            return menuItem;

        },
        add: function () { },
        remove: function (mi) {//移DOM和关系
            var cmi;
            for (var i = 0, len = this.childItems.length; i < len; i++) {
                cmi = this.childItems[i];
                if (mi == cmi) {
                    cmi.menu = cmi.pItem = null;
                    this.childItems.splice(i, 1);
                    break;
                }
            }
            this.li && this.pItem.heUI.removeChild(this.li);
        },
        dispose: function () {
            this.childItems.length = 0;
            this.heA = this.heImg = this.heLi = this.heUl = null;
            //          this.action && (E.un(this.heLi, "mousedown", this.stopPropagation), E.un(this.heLi, this.evtType, this.actionHandle)); //
            //          E.un(this.heLi.firstChild, "mouseover", this.showItems);
            this.pItem.remove(this);
        },
        clearItems: function () {//DOM元素移除根就移除了孩子， 只移一次DOM
            var _clear = function () {
                var mi;
                for (var i = 0, len = this.childItems.length; i < len; i++) {
                    _clear.call(this.childItems[i]);
                }
                this.childItems.length = 0;
                this.menu = this.pItem = null;
                this.heA = this.heImg = this.heLi = this.heUl = null;
            };
            _clear.call(this);
            this.dispose();
        },
        getChild: function () { },
        hide: function () {
            this.heLi.style.display = "none";
        },
        show: function () {
            switch (this.disable) {
                case 0:
                    this.heLi.style.display = "";
                    break;
                case 1:
                    this.heLi.style.display = "none";
                    break;
                case 2:
                    this.heLi.style.display = "";
                    this.heLi.style.backgroundColor = "gray";
                    break;
                default:
            }
        },
        handleCItems: function () {
            for (var i = 0, len = this.childItems.length; i < len; i++) {
                if (this.childItems[i].disable == 0) {
                    this.childItems[i].show();
                } else {
                    this.childItems[i].hide();
                }
            }
            this._handled = true;
        },
        setActiveItem: function (mi) {
            this.activeItem = mi;
        },
        activeChild: function (mi, evt) {
            this.activeCItem && this.activeCItem.hiddenItems();
            if (mi) {
                this.activeCItem = mi;
                this.activeCItem.showItems(evt);
            }
        },
        active: function (evt) {
            this.pItem.activeChild(this, evt);
        },
        showItems: function () {
            this.active = true;
            this.heLi.firstChild.style.backgroundColor = "#E7C04D";

            if (!this.heUl || this.disable != 0) { return; }

            for (var i = 0, len = this.childItems.length; i < len; i++) {
                this.childItems[i].show();
            }

            if (this.onShow && this.onShow(this) === false) {
                return;
            }

            this.heUl.style.display = "";
            var heliPos = ET.position(this.heLi),
                            left = heliPos.left + this.heLi.parentNode.clientWidth, top = heliPos.top,
                            pos = repairePos(this.heUl, left, top);
            if (pos.left != left) {
                pos.left = pos.left - this.heLi.parentNode.clientWidth;
            }
            if (pos.top == top) {
                pos.top += this.heLi.offsetTop;
            } else {
                pos.top += this.heLi.offsetTop + this.heLi.firstChild.offsetHeight;
            }
            this.heUl.style.top = pos.top - top + "px";
            this.heUl.style.left = pos.left - heliPos.left + "px";


            //console.log("show --" + this.text + "--的子菜单");
            /*
            if (this.pItem.activeCItem) {
            this.pItem.activeCItem.hiddenItems();
            }
            this.pItem.activeCItem = this;
            this.heLi.firstChild.style.backgroundColor = "#E7C04D";
            this.active = true;
            if (this.heUl) {
            if (this.onShow && this.onShow(evt, this) === false) {
            return;
            }
            for (var i = 0, len = this.childItems.length; i < len; i++) {
            if (!this.childItems[i].display) {
            this.childItems[i].hide();
            }
            }
            this.heUl.style.display = "";
            var heliPos = ET.position(this.heLi),
            left = heliPos.left + this.heLi.parentNode.clientWidth, top = heliPos.top,
            pos = repairePos(this.heUl, left, top);
            if (pos.left != left) {
            pos.left = pos.left - this.heLi.parentNode.clientWidth;
            }
            if (pos.top == top) {
            pos.top += this.heLi.offsetTop;
            } else {
            pos.top += this.heLi.offsetTop + this.heLi.firstChild.offsetHeight;
            }
            this.heUl.style.top = pos.top - top + "px";
            this.heUl.style.left = pos.left - heliPos.left + "px";
            }

            //for (var i = 0, len = this.pItem.childItems.length; i < len; i++) {
            //    if (this.pItem.childItems[i] != this) {
            //        this.pItem.childItems[i].hiddenItems();
            //    } else {
            //        this.heLi.firstChild.style.backgroundColor = "#E7C04D";
            //        this.active = true;
            //        if (this.heUl) {
            //            this.heUl.style.display = "";
            //            var heliPos = ET.position(this.heLi),
            //                left = heliPos.left + this.heLi.parentNode.clientWidth, top = heliPos.top,
            //                pos = repairePos(this.heUl, left, top);
            //            if (pos.left != left) {
            //                pos.left = pos.left - this.heLi.parentNode.clientWidth;
            //            }
            //            if (pos.top == top) {
            //                pos.top += this.heLi.offsetTop;
            //            } else {
            //                pos.top += this.heLi.offsetTop + this.heLi.firstChild.offsetHeight;
            //            }
            //            this.heUl.style.top = pos.top - top + "px";
            //            this.heUl.style.left = pos.left - heliPos.left + "px";
            //        }
            //    }
            //}
            */
        },
        hiddenItems: function () {
            //console.log("hiden-----" + this.text + "--的子菜单");
            this.heLi.firstChild.style.backgroundColor = "";
            this.active = false;
            if (this.heUl) {
                this.heUl.style.display = "none";
                this.activeCItem && this.activeCItem.hiddenItems();
                //                for (var i = 0, len = this.childItems.length; i < len; i++) {
                //                    this.childItems[i].hide();
                //                }
            }
        },
        clearTimer: function () {
            //console.log("清除" + this.timer);
            if (this.timer) {
                clearTimeout(this.timer);
                this.timer = null;
                return true;
            }
            return false;
        },
        stopPropagation: function (evt) {
            evt.stopPropagation();
        },
        actionHandle: function (evt) {
            this.action(evt, this.menu.data, this);
            //取men 调其hiden方法
            //menu.hidden();
        }
    }),
    Menu = $C.Create({
        initialize: function (options, oItems) {
            //this.container = (options.container ? typeof options.container == "string" ? document.getElementById(options.container) : options.container
            setPageBoundary();

            this.target = options.target ? (typeof options.target == "string" ? document.getElementById(options.target) : options.target) : doc.body;
            this.onShow = options.onShow;
            this.onHidden = options.onHidden;
            options.imgBasePath && (imgBasePath = options.imgBasePath);

            var df = document.createDocumentFragment();
            this.heWrap = document.createElement("div");
            this.heWrap.style.zIndex = "1000";
            this.heWrap.className = "CM";
            this.heWrap.style.position = "absolute";
            df.appendChild(this.heWrap);
            // this.heWrap.style.display = "none";

            this.rootItem = new MenuItem();
            this.rootItem.disable = 0;
            this.rootItem.heUl = document.createElement('ul');
            this.rootItem.heUl.style.position = "absolute";
            //this.iDIS = this.iDIS * -1;
            this.CMData = oItems ? this.objToArray(oItems) : options.items;
            this.make(this.CMData, this.rootItem);

            this.heWrap.appendChild(this.rootItem.heUl);
            document.body.appendChild(df);
            E.on(this.heWrap, "click", this.clickMenuItem, this);

            E.on(this.target, "mousedown", this.showHandle, this);
            this.target != doc.body && E.on(doc.body, "mousedown", this.hidden, this);
            E.on(window, "resize", setPageBoundary);
            this.SCM = document.body.oncontextmenu;
            this.data = null;
        },
        setOptions: function (options) {

        },
        reBind: function () {

        },
        add: function (menu) {
            this.menus.push(menu);
        },
        objToArray: function (obj) {
            var a = [];
            for (var prop in obj) {
                if (obj.hasOwnProperty(prop)) {
                    a.push(obj[prop]);
                }
            }
            return a;
        },
        remove: function (name) { },
        getChild: function (name) { },
        getElement: function () {
            for (var i = 0; i < this.menus.length; i++) {
                this.element.appendChild(this.menus[i].getElement());
            }
            return this.element;
        },
        make: function (CMData, pMI) {
            if (CMData) {
                for (var mi = null, i = 0, len = CMData.length; i < len; i++) {
                    mi = new MenuItem(CMData[i], pMI, this);
                    this.make(CMData[i].items, mi);
                }
            }

            return this;
        },
        reMake: function (CMData, pMI) {
            if (!CMData) { return null; }
            $O.getType(CMData) != "array" && (CMData = [CMData]);

            pMI.clearItems();
            this.make.apply(this, arguments);

            return null;
        },
        deleteNode: function (uniId) {
            var res = this.findById(uniId), node;
            for (var i = 0, len = res.length; i < len; i++) {
                node = res[i];
                node.pNode.removeChild(node);
            }
        },
        showHandle: function (evt, data) {
            var elem = this.heTarget = evt.target || null;
            if (evt.button == 2) {
                this.preventDCM();
                this.show(evt.pageX, evt.pageY, data);
                evt.stopPropagation();
            }
            //else {// $ET.contains(this.heWrap, elem);
            //    while (elem != null) {
            //        if (elem == this.heWrap) {
            //            return;
            //        }
            //        elem = elem.parentNode;
            //    }
            //    this.hidden(evt);
            //}
        },
        show: function (iLeft, iTop, data, sItems) {
            if (sItems) { this.setShowItems(sItems) }
            this.data = data || null;
            //右键菜单显示时触发事件
            if (this.onShow && this.onShow(this.data) === false) {
                return;
            }
            for (var i = 0, len = this.rootItem.childItems.length; i < len; i++) {
                this.rootItem.childItems[i].show();
            }
            var ai = this.rootItem.activeCItem;
            while (ai) {
                ai.hiddenItems();
                ai = ai.activeCItem;
            }
            this.heWrap.style.display = "";
            var pos = repairePos(this.heWrap.firstChild, iLeft, iTop);
            this.heWrap.style.left = pos.left + "px";
            this.heWrap.style.top = pos.top + "px";
            this.display = "block";
        },
        restore: function (mi, iState) {
            if (mi.childItems.length > 0) {
                iState || (iState = 0);
                for (var j = 0, len = mi.childItems.length; j < len; j++) {
                    mi.childItems[j].disable = iState;
                    this.restore(mi.childItems[j]);
                }
            }
        },
        setShowItems: function (sItems) {
            if (!sItems || sItems.length == 0) return;
            this.restore(this.rootItem, 1);
            var stack = [], preState = "WHITE", //char white l r comon
                 chr = sName = "", aName = [], pmi = [this.rootItem], mi,
                filter = function (sName, mi) {
                    var j, tempMI, tmi;
                    for (j = 0; j < mi.childItems.length; j++) {
                        tempMI = mi.childItems[j];
                        //if (handled[sName]) continue;
                        if (tempMI.id == sName) {
                            tempMI.disable = 0;
                            //handled[sName] = 1;
                            tmi = tempMI;
                            break;
                        }
                    }
                    return tmi;
                }, restore = function (pmi) {
                    for (var j = 0, len = pmi.childItems.length; j < len; j++) {
                        pmi.childItems[j].disable = 1;
                    }
                };
            for (var i = 0, len = sItems.length; i < len; i++) {
                chr = sItems.charAt(i);
                switch (chr) {
                    case "(":
                        {
                            restore(pmi[pmi.length - 1]);
                            if (aName.length > 0) {
                                (mi = filter(aName.join(""), pmi[pmi.length - 1])) && pmi.push(mi);
                                aName.length = 0;
                            }
                            stack.push("(");
                            preState = "LPARENS";
                            break;
                        }
                    case ")":
                        {
                            if (stack[stack.length - 1] == "(") {
                                stack.pop();
                                aName.length > 0 && filter(aName.join(""), pmi[pmi.length - 1]);
                                aName.length = 0;
                                pmi.pop();
                            } else {
                                throw "括号不匹配!";
                            }
                            preState = "RPARENS";
                            break;
                        }
                    case ",":
                        {
                            aName.length > 0 && filter(aName.join(""), pmi[pmi.length - 1]);
                            aName.length = 0;
                            preState = "COMMA";
                            break;
                        }
                    case "\t":
                    case " ": { break; }
                    default:
                        {
                            if (preState == "RPARENS") { throw ")后不能跟字母!"; }
                            aName.push(chr);
                            preState = "LETTER";
                            break;
                        }
                }
            }
        },
        displayItem: function () {
        },
        clickMenuItem: function (evt) {
            this.hidden(evt);
            this.onHidden && this.onHidden(evt, this.data);
            evt.stopPropagation();
        },
        hidden: function () {
            if (this.display == "none") { return; }
            this.heWrap.style.display = "none";
            this.display = "none";
            this.restoreDCM();
        },
        preventDCM: function () {//禁用默认右键菜单
            document.body.oncontextmenu = disableCM;
        },
        restoreDCM: function () {
            document.body.oncontextmenu = this.SCM;
        }
    });
    Menu.create = function (data, relation) {
        var stack = [];
        for (var i = 0, len = relation.length; i < len; i++) {

        }
    }

    win.ContextMenu = Menu;
})(window, document);
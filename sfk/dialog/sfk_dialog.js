/*
    sfk_dialog.js by zcj 2012-11-20

*/
(function(win, undefined) {
    var doc = win.document,
        docElem = doc.documentElement,
        body = doc.body,
        P = $P,
        ET = $ET,
        E = $E,
        C = $C,
        O = $O,
        A = $A,
        F = $F,
        timer, count = 0,
        Overlay = (function() { //覆盖层
            var overlay;

            function create() {
                if (!overlay) {
                    overlay = doc.createElement('div');
                    overlay.id = 'overlay';
                    overlay.style.cssText = 'margin:0;padding:0;border:none;width:100%;height:100%;background-color:#333;opacity:0.6;filter:alpha(opacity=60);z-index:99;position:fixed;top:0;left:0;';
                    doc.body.appendChild(overlay);
                }

                return overlay;
            }
            return {
                "color": "#333", //背景色
                "opacity": 0.6,
                "zIndex": 1000,
                "show": function() {
                    create();
                    ET.setCSS(overlay, {
                        backgroundColor: this.color,
                        opacity: this.opacity,
                        zIndex: this.zIndex,
                        display: "block"
                    });

                },
                "close": function() {
                    overlay && (overlay.style.display = "none");
                }
            };
        })(),

        Dialog = $C.create();

    Dialog.prototype = {
        initialize: function(options) {
            var iPadding = 8; //内容padding 8px
            this.setOptions(options);
            this.count = 0;
            this.elems = {};
            this.scope = this.options.scope || this;
            var df = document.createDocumentFragment(); //class="close_btn"
            this.heDialogBox = document.createElement("div");
            ET.setCSS(this.heDialogBox, {
                position: "absolute",
                display: "none",
                margin: 0 + "px",
                padding: 0 + "px",
                border: "none",
                zIndex: 1001
            })
            this.heDialogBox.innerHTML = '<div class="sDialog_wrapper">' + '<div class="sDialog_title"><label></label></div>' + '<div class="sDialog_content"><div class="sDialog_text" style="text-align: center;"></div></div>' + '<div class="sDialog_footer"></div>' + '</div>';
            df.appendChild(this.heDialogBox);
            this.heDialogWrap = this.heDialogBox.firstChild;
            this.heDialogWrap.style.border = "3px solid rgba(0,0,0,0)";

            this.heHeader = this.heDialogWrap.firstChild;
            this.heTitle = this.heHeader.firstChild;

            this.heContentContainer = this.heDialogWrap.children[1];
            this.heContentContainer.style.border = "1px solid #e5e5e5";
            this.heContentContainer.style.padding = iPadding + "px";
            this.heContent = this.heContentContainer.firstChild;

            this.heFooter = this.heDialogWrap.lastChild;
            this.state = "init";
            var max = !! this.options.max,
                min = !! this.options.min,
                close = !! this.options.close,
                cancle = !! this.options.cancle,
                confirm = !! this.options.confirm;

            this.title_oper = this.options.title_oper || [];
            this.footer_oper = this.options.footer_oper || [];

            ET.text(this.heTitle, this.options.title || "窗口");
            close && this.title_oper.push({
                text: "x",
                name: "close",
                scope: this,
                style: {
                    color: "black"
                },
                onclick: {
                    fn: this.close,
                    scope: this
                }
            });
            max && this.title_oper.push({
                name: "max",
                text: "+",
                scope: this,
                style: {
                    color: "black"
                },
                onclick: {
                    fn: this.max,
                    scope: this
                }
            });
            min && this.title_oper.push({
                // tag: "a",
                name: "min",
                text: "—",
                style: {
                    color: "black"
                },
                scope: this,
                onclick: {
                    fn: this.min,
                    scope: this
                }
            });

            cancle && this.footer_oper.push({
                text: "取消",
                name: "cancle",
                scope: this,
                className: "btn_normal",
                onclick: {
                    fn: this.cancel,
                    scope: this
                }
            });
            confirm && this.footer_oper.push({
                text: "确定",
                name: "confirm",
                className: "btn_normal",
                onclick: {
                    fn: this.confirm,
                    scope: this
                }
            });

            this.autoSize = !! this.options.autoSize;
            this.resize = !! this.options.resize;
            this.drag = !! this.options.drag;
            this.setBehaviors();

            var sType = O.type(this.options.content);
            if (sType == "string") {
                this.heContent.innerHTML = this.options.content.replace(/<[\/]?script[\s\S]*?>/ig, '')
            } else if (sType == "html") {
                this.heContent.appendChild(this.options.content);
            } else if (sType == "object") {
                this.setIframe(this.options.content, this.heContent);
            }


            document.body.appendChild(df);
            this.heDialogBox.style.display = "";
            this.diffW = this.heDialogBox.clientWidth - this.heContentContainer.clientWidth + 2 * iPadding;
            this.diffH = this.heDialogBox.clientHeight - this.heContentContainer.clientHeight + 2 * iPadding;
            this.boxRect = {
                width: this.options.width ? this.options.width + this.diffW : 320,
                height: this.options.height ? this.options.height + this.diffH : 180
            };
            this.setSize();
            this.setArgs(this.heIframe);
        },
        setOptions: function(options) {
            this.options = { // 默认参数
                width: "auto",
                height: "auto",
                autoSize: true,
                title_oper: null,
                footer_oper: null,
                header: "",
                content: null, // string / object   弹处层内容的id或内容模板
                footer: null,
                overlay: true, // boolean        是否添加遮罩层
                fixed: false, // boolean         是否静止定位
                follow: null, // string / object   是否跟随自定义元素来定位
                followX: 0, // number            相对于自定义元素的X坐标的偏移
                followY: 0, // number            相对于自定义元素的Y坐标的偏移
                autoClose: 0, // number            自动关闭弹出层的时间
                lock: false, // boolean           是否允许ESC键来关闭弹出层
                drag: true, // boolean           是否绑定拖拽事件
                resize: true,
                max: true,
                min: true,
                rever: true,
                close: true,
                confirm: true,
                cancle: true,
                unload: function() {} // function          关闭弹出层后执行的回调函数
            };

            $O.extend(this.options, options);
        },
        moveToCenter: function(elem, fixed) {
            ET.moveCenter(elem, this.options.parent);
        },
        setArgs: function(heIframe) {
            if (heIframe) {
                heIframe.contentWindow.dialogArgs = this.data; //this.data;
            }
        },
        removeIframe: function() {
            if (this.heIframe) {
                this.heIframe.src = "about:blank;"
                this.heIframe.parentNode.removeChild(this.heIframe);
            }
        },
        setIframe: function(iframe, heContainer) {
            this.removeIframe();
            this.heIframe = doc.createElement("iframe");
            var heIframe = this.heIframe;
            heIframe.src = iframe.src || ""; // 
            heIframe.frameBorder = iframe.frameborder || 0;
            //heIframe.style.border = iframe.border ? (iframe.border + "px") : "0px";
            heIframe.scrolling = "no";
            //heIframe.allowtransparency = "yes";
            heIframe.height = iframe.height || "100%";
            heIframe.width = iframe.width || "100%";
            heIframe.marginHeight = "0";
            heIframe.marginWidth = "0";
            this.data = iframe.data ? ($O.getType(iframe.data) != "array" ? [iframe.data] : iframe.data) : [];
            this.autoSize = iframe.autoSize;
            heContainer || (heContainer = this.heContent);
            heContainer.appendChild(this.heIframe);
            $E.on(heIframe, "load", this.frameLoad, this);
        },
        frameLoad: function(evt) {
            var win = this.heIframe.contentWindow;
            if (this.autoSize) {
                this.heIframe.height = win.document.body.offsetHeight;
                this.heIframe.width = win.document.body.offsetWidth;
            }
        },
        location: function(src, iframe) {
            this.setIframe(iframe);
            src && (this.heIframe.src = src);

            return this.heIframe.src;
        },
        setBehaviors: function() {
            var _this = this;
            this.addBehavior(this.heHeader, this.title_oper);
            this.addBehavior(this.heFooter, this.footer_oper);
            this.resize && (this._resize = new Resizable({
                target: this.heDialogBox,
                container: this.options.container,
                min: {
                    width: 100,
                    height: 150
                },
                onBeforeResize: this.options.onBeforeResize,
                onResize: F.bind(this, this.onResize)
            }));
            this.drag && (this._drag = new Drag(this.heDialogBox, {
                Handle: this.heHeader || this.heDialogWrap,
                mxContainer: this.options.container || document.body,
                Limit: false,
                drop: this.options.drop,
                onDrop: this.onDrop,
                handle: this.options.handle,
                limit: this.options.limit,
                mxLeft: this.options.mxLeft,
                mxRight: this.options.mxRight,
                mxTop: this.options.mxTop,
                mxBottom: this.options.mxBottom,
                mxContainer: this.options.mxContainer,
                lockX: this.options.lockX,
                lockY: this.options.lockY,
                lock: this.options.lock,
                onStart: null,
                onMove: null,
                onDrop: null,
                onStop: null
            }));
        },
        addBehavior: function(heOpers, aOpers) {
            var i, len, aLen, heOper, he;
            if (!heOpers || !aOpers) {
                return;
            }
            //this.hElems
            i = 0;
            len = heOpers.children.length;
            aLen = aOpers.length;
            while (i < aLen) {
                data = aOpers[i];
                heOper = document.createElement(data.tagName || "a");
                data.name == undefined && (data.name = this.count++);
                if (!this.elems[data.name]) {
                    this.elems[data.name] = {
                        he: null,
                        evts: null
                    };
                }
                this.elems[data.name].he = heOper;
                heOper.style["float"] = "right"; //javascript parser error
                this.bindBehavior(heOper, data, this.elems[data.name]);
                heOpers.appendChild(heOper);
                i++;
            }
            return count;
        },
        bindBehavior: function(he, o, elem) {
            var reg = /^on(.*)/,
                res, value, propName, scope = this.scope,
                data = this;
            he.nodeName == "A" && (!o.href || o.href == "") && (he.href = "#");
            for (propName in o) {
                value = o[propName];
                if (reg.test(propName)) {
                    if (typeof value != "function") {
                        value.scope && (scope = value.scope);
                        value.data && (data = value.data);
                        if (value.fn) {
                            value = value.fn;
                        } else {
                            continue;
                        }
                    }
                    elem.evts || (elem.evts = {});
                    elem.evts[RegExp.$1] = value;
                    $E.on(he, RegExp.$1, value, scope, data);
                } else {
                    switch (propName) {
                        case "style":
                            $ET.setCSS(he, value);
                            break;
                        case "text":
                            {
                                switch (he.nodeName) {
                                    case "INPUT":
                                        {
                                            he.value = value;
                                            break;
                                        }
                                    case "A":
                                        {
                                            ET.text(he, value);
                                            break;
                                        }
                                    default:
                                        break;
                                }
                                break;
                            }
                        default:
                            he[propName] = value;
                            break;
                    }
                }
            }
        },
        setContentSize: function(rect) {
            if (rect) {
                this.heContentContainer.style.height = rect.height - this.diffH + "px";
                this.heContentContainer.style.width = rect.width - this.diffW + "px";
            }
        },
        onResize: function(helper) {
            var rect = helper.cur;
            //this.heDialogWraper.style.width =
            this.setContentSize(rect)
            this.options.onResize && this.options.onResize();
        },
        show: function() {
            var heDialogBox = this.heDialogBox,
                heDialogWrap = this.heDialogWrap,
                wrapW, wrapH, options = this.options;

            Dialog.clearTimer();
            Overlay.show();
            if (heDialogBox.style.display == "none") {
                heDialogBox.style.display = 'block';
            }

            //配置属性处理
            //wrapW = heDialogWrap.offsetWidth;
            //wrapH = heDialogWrap.offsetHeight,
            heDialogWrap.style.marginTop = heDialogWrap.style.marginRight = heDialogWrap.style.marginBottom = heDialogWrap.style.marginLeft = '0px';
            if (options.follow) {
                this.follow(options.follow, options.followX, options.followY);
                E.on(win, 'resize', this.follow, this);
                Overlay.close();
                options.fixed = false;
                heDialogBox.style.marginLeft = heDialogBox.style.marginTop = '0px';
            } else {
                this.moveToCenter(heDialogBox, this.options.fixed, this.options.parent);
            }

            // ESC键关闭弹出层
            if (!options.lock) {
                E.on(doc, 'keyup', this.escClose, this);
            }
            // 自动关闭弹出层
            if (options.autoClose > 0) {
                timer = setTimeout(F.bind(this, this.close), options.autoClose);
            }

            if (!options.follow && !options.fixed) {
                E.on(win, 'resize', this.resize, this);
            }

            E.on(this.heClose, 'click', this.close, this);
        },
        hidden: function() {
            if (this.heTarget.style.display != "none") {
                this.heTarget.style.display = "none";
            }
        },
        memorize: function() {
            this.boxRect.left = ET.getStyleByPx(this.heDialogBox, "left");
            this.boxRect.top = ET.getStyleByPx(this.heDialogBox, "top");
            this.boxRect.width = ET.getStyleByPx(this.heDialogBox, "width");
            this.boxRect.height = ET.getStyleByPx(this.heDialogBox, "height");
        },
        revert: function() {
            this.setSize(this.boxRect);
            this.state = "init";
        },
        setSize: function(rect) {
            rect || (rect = this.boxRect);
            var style = this.heDialogBox.style;
            isNaN(rect.top) || (style.top = rect.top + "px");
            isNaN(rect.left) || (style.left = rect.left + "px");
            style.width = rect.width + "px";
            style.height = rect.height + "px";
            style.overflow = ""
            this.setContentSize(rect);
        },
        max: function() {
            if (this.state == "max") {
                this.revert();
                return;
            } else {
                this.heDialogWrap.style.display == "none" && (this.heDialogWrap.style.display = "");
                var pvs = P.viewSize();
                this.memorize(this.heDialogBox);
                this.setSize({
                    left: 0,
                    top: 0,
                    width: pvs.width,
                    height: pvs.height
                })
                this.state = "max";
            }
        },
        min: function() {
            this.state != "max" && this.memorize(this.heDialogBox);
            var pb = P.boundary();
            $ET.setCSS(this.heDialogBox, {
                top: pb.B - 15 + "px",
                left: pb.L + "px",
                width: 50 + "px",
                height: 15 + "px"
            });
            this.heDialogWrap.style.display = "none";
            this.heDialogBox.style.backgroundColor = "red";
            E.one(this.heDialogBox, "mouseover", function() {
                this.heDialogWrap.style.display = "";
                this.heDialogBox.style.backgroundColor = "";
                this.revert();
            }, this)
            this.state = "min";
        },
        close: function(callback) {
            if (typeof callback == 'function') {
                if (callback() === false) return;
            }
            var options = this.options;
            // 执行callback
            if (typeof options.onbeforeunload == 'function') {
                options.onbeforeunload.call(this.scope, this);
            }
            //clearTimer();
            Overlay.close();
            this.heDialogBox.style.display = 'none';

            this.resize && this._resize.unBind();
            this.drag && this._drag.unBind();
            !options.lock && E.unbind(doc, 'keyup', this.escClose);

            if (!options.follow && !options.fixed) {
                E.unbind(win, 'resize', this.resize);
            }

            var name, elem, evtName;
            for (name in this.elems) {
                elem = this.elems[name];
                for (evtName in elem.evts) {
                    E.un(elem.he, evtName, elem.evts[evtName]);
                }
            }



            typeof options.unload == 'function' && options.unload.call(this.scope, this);
            this.removeIframe();
            this.heDialogBox.parentNode.removeChild(this.heDialogBox);
        },
        cancel: function() {
            this.close(this.options.onCancel && F.bind(this.scope, this.options.onCancel, this));
        },
        confirm: function() {
            this.close(this.options.onConfirm && F.bind(this.scope, this.options.onConfirm, this));
        },
        getElem: function(name) {
            return this.elems[name] ? this.elems[name].he : null;
        },
        follow: function(follow, x, y) {
            var style = elem.style,
                pos;

            follow = typeof follow == 'string' ? doc.getElementById(follow) : follow;
            pos = ET.postion(follow);
            ET.setCSS(this.heDialogBox, {
                position: 'absolute',
                left: pos.left + x + 'px',
                top: pos.top + y + 'px'
            });
        },
        resize: function() {
            this.moveToCenter(dialogBox, false);
        },
        escClose: function(e) {
            if (e.keyCode == 27) {
                this.close();
            }
        }
    };

    // 清除定时器
    Dialog.clearTimer = function() {
        if (timer) {
            clearTimeout(timer);
            timer = undefined;
        }
    };

    Dialog.open = function() {
        var dialog = new Dialog(arguments[0] || {});
        dialog.show();
        return dialog;
    };

    win.sDialog = Dialog;
})(window, undefined);

/*
//最大化按钮
oMax.onclick = function ()
{
oDrag.style.top = oDrag.style.left = 0;
oDrag.style.width = document.documentElement.clientWidth - 2 + "px";
oDrag.style.height = document.documentElement.clientHeight - 2 + "px";
this.style.display = "none";
oRevert.style.display = "block";
};
//还原按钮
oRevert.onclick = function ()
{       
oDrag.style.width = dragMinWidth + "px";
oDrag.style.height = dragMinHeight + "px";
oDrag.style.left = (document.documentElement.clientWidth - oDrag.offsetWidth) / 2 + "px";
oDrag.style.top = (document.documentElement.clientHeight - oDrag.offsetHeight) / 2 + "px";
this.style.display = "none";
oMax.style.display = "block";
};
//最小化按钮
oMin.onclick = oClose.onclick = function ()
{
oDrag.style.display = "none";
var oA = document.createElement("a");
oA.className = "open";
oA.href = "javascript:;";
oA.title = "还原";
document.body.appendChild(oA);
oA.onclick = function ()
{
oDrag.style.display = "block";
document.body.removeChild(this);
this.onclick = null;
};
};


*/

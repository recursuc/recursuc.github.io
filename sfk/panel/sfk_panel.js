/*
sfk_panel.js by zcj  最后更新日期 2012- 06-20

*/
(function (win, undefined) {
    var doc = win.document,
	docElem = doc.documentElement,
	body = doc.body,
	P = $P,
	tagName = "panel",
	ET = $ET,
	E = $E,
	C = $C,
	O = $O,
	A = $A,
	F = $F,
	Panel = $C.Create({
	    initialize: function (options) {
	        var doc = document,
				dock,
				a = ["heTitle", "heContent", "heFooter"],
				header,
				ls,
				nav,
				rs,
				panels,
				pane,
				i = 0,
				pLen,
				j = 0,
				nLen;

	        this.setOptions(options);
	        if (this.options.target != null) {
	            this.titleOpers = {}
	            this.scope = this.options.scope || document.body;
	            this.state = this.options.state; // dock ; undock;
	            // float
	            this.heTarget = this.options.target;
	            this.heTitle = ET.firstElementChild(this.heTarget);
	            this.heTitleText = this.heTitle.firstChild.nodeValue;
	            this.heContainer = this.options.container || this.heTarget.parentNode;
	            i = 1;
	            while (i < a.length) {
	                this[a[i]] = ET.nextElementSibling(this[a[i - 1]]);
	                i++
	            }

	            this.options.style === false || this.addThemeStyle(this.heTarget, this.heTitle, this.heFooter);
	            this.setBehavior();
	            if (options.titleHandle) {
	                this.titleHandle = options.titleHandle;
	                E.on(this.heTitle, this.options.titleEvtType, this.titleHandle, this.scope, this);
	            }
	            options.iframe && this.setIframe(options.iframe);
	        }
	    },
	    setOptions: function (options) {
	        this.options = { // 默认参数
	            container: null,
	            target: null,
	            state: "float",
	            container: document.body,
	            scope: null,
	            titleEvtType: "click",
	            titleHanle: null,
	            title_oper: [],
	            footer_oper: [],
	            drop: null,
	            onDrag: null,
	            onDrop: null,
	            onBeforeResize: null,
	            onResize: null,
	            onAfterResize: null,
	            onStart: null,
	            onMove: null,
	            onStop: null,
	            enableResize: true,
	            enableDrag: true,
	            drop: null,
	            handle: "",
	            limit: false,
	            mxLeft: 0,
	            mxRight: 9999,
	            mxTop: 0,
	            mxBottom: 9999,
	            mxContainer: "",
	            lockX: false,
	            lockY: false,
	            lock: false,
	            titleH: 20,
	            footerH: 20,
	            initHeight: null,
	            iframe: null
	        };

	        $O.extend(this.options, options || {});
	        return this.options;
	    },
	    addThemeStyle: function (target, title, footer) {
	        target && ET.addClass(target, "panel");
	        title && ET.addClass(title, "title");
	        footer && ET.addClass(footer, "footer");
	        this.heTitle.style.height = this.options.titleH + "px";
	        this.heFooter && (this.heFooter.style.height = this.options.footerH + "px");
	        this.setSize(this.options.initHeight);
	    },
	    setSize: function (iH) {
	        this.heFooter ? this.heContent.style.height = (iH || this.heContainer.clientHeight)
				 - this.options.footerH - this.options.titleH + "px"
				 : this.heContent.style.height = (iH || this.heContainer.clientHeight) - this.options.titleH
				 + "px";
	    },
	    setBehavior: function () {
	        var _this = this;
	        this.addBehavior(this.heTitle, this.options.title_oper, 0);
	        this.addBehavior(this.heFooter, this.options.footer_oper, 0);
	        if (this.options.enableResize) {
	            this.resize = new Resizable({
	                target: this.heTarget,
	                container: this.options.container,
	                min: {
	                    width: 100,
	                    height: 150
	                },
	                onBeforeResize: this.options.onBeforeResize,
	                onResize: this.options.onResize
	            });
	        }
	        if (this.options.enableDrag) {
	            this.drag = new Drag(this.heTarget, {
	                Handle: this.heTitle,
	                mxContainer: this.options.container,
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
	                onStart: function () {
	                    _this.heTitle.style.cursor = 'move';
	                    _this.options.onStart && _this.options.onStart();
	                },
	                onMove: function () {
	                    _this.options.onMove && _this.options.onMove();
	                },
	                onDrop: this.options.onDrop,
	                onStop: function () {
	                    _this.heTitle.style.cursor = '';
	                }
	            });
	        }
	    },
	    addBehavior: function (heOpers, aOpers, count) {
	        var i,
				len,
				aLen,
				heOper;
	        if (!heOpers || !aOpers) {
	            return;
	        }
	        i = 0;
	        len = heOpers.children.length;
	        aLen = aOpers.length;
	        while (i < len && count < aLen) {
	            heOper = heOpers.children[i]
	            if (heOper.nodeType == 1) {
	                if (heOper.getAttribute(tagName) == 1) {
	                    this.bindBehavior(heOper, aOpers[count]);
	                    this.titleOpers[aOpers[count].name || count] = aOpers[count].elem = heOper;
	                    count++;
	                }

	                count = arguments.callee.call(this, heOper, aOpers, count)
	            }
	            i++;
	        }
	        return count;
	    },
	    bindBehavior: function (he, o) {
	        var reg = /^on(.*)/,
				res,
				value,
				propName,
				scope = this.scope,
				data = this;
	        for (propName in o) {
	            value = o[propName];
	            if (reg.test(propName)) {
	                if (typeof value != "function") {
	                    value.scope && (scope = value.scope);
	                    value.data && (data = value.data);
	                }
	                $E.on(he, RegExp.$1, value, scope, data);
	            } else if (propName == "style") {
	                $ET.setCSS(he, value);
	            } else if (propName == "text") {
	                $ET.text(he, value);
	            } else if (propName == "name") { }
	            else {
	                he[propName] = value;
	            }
	        }
	    },
	    resetBind: function () {
	        this.unBind();
	        this.setBehavior();
	    },
	    evtBind: function (he, type, handle, scope, data) {
	        if (typeof handle != "function") {
	            handle.scope || (handle.scope = this.scope);
	            handle.data || (handle.data = this);
	            $E.bind(he, type, handle)
	        } else {
	            $E.on(he, type, handle, scope, data);
	        }
	    },
	    setHeader: function () { },
	    setContent: function (sVal) {
	        if (sVal != undefined) { }
	        return;
	    },
	    setFooter: function () { },
	    onResize: function (evt, helper) {
	        helper.dragSide.style.marginLeft = 8 / 2 + "px"
	    },
	    unBind: function () {
	        var aOpers = this.options.title_oper,
				len = aOpers.length,
				E = $E,
				reg = /^on(.*)/,
				value,
				propName,
				o,
				i = 0;
	        // 松开标题操作栏绑定
	        while (i < len) {
	            o = aOpers[i];
	            for (propName in o) {
	                if (reg.test(propName)) {
	                    $E.un(this.titleOpers[aOpers[i].name || i], RegExp.$1, o[propName]);
	                }
	            }
	            i++;
	        }
	        this.drag.unBind();
	        this.resize.unBind();
	    },
	    isShow: function () {
	        return $ET.getStyle(this.heTarget, "display") == "none" ? false : true;
	    },
	    open: function () { },
	    toggle: function () {
	        if (this.heTarget.style.display == "none") {
	            this.heTarget.style.display = "";
	        } else {
	            this.heTarget.style.display = "none";
	        }
	    },
	    show: function () {
	        if (this.heTarget.style.display == "none") {
	            this.heTarget.style.display = "";
	        }
	    },
	    hidden: function () {
	        if (this.heTarget.style.display != "none") {
	            this.heTarget.style.display = "none";
	        }
	    },
	    max: function () {
	        var pvs = $P.viewSize();

	        $ET.setCSS(this.heTarget, {
	            top: 0 + "px",
	            left: 0 + "px",
	            width: pvs.width + "px",
	            height: pvs.height + "px"
	        });

	        oRevert.style.display = "block";
	    },
	    min: function () {
	        this.heTarget.style.display = "none";
	        var oA = document.createElement("a");
	        oA.className = "open";
	        oA.href = "javascript:void();";
	        oA.title = "还原";
	        document.body.appendChild(oA);
	        oA.onclick = function () {
	            oDrag.style.display = "block";
	            document.body.removeChild(this);
	            this.onclick = null;
	        };
	    },
	    revert: function () {
	        this.heTarget.style.width = dragMinWidth + "px";
	        this.heTarget.style.height = dragMinHeight + "px";
	        this.heTarget.style.left = (document.documentElement.clientWidth - oDrag.offsetWidth) / 2 + "px";
	        this.heTarget.style.top = (document.documentElement.clientHeight - oDrag.offsetHeight) / 2 + "px";
	        this.style.display = "none";
	        oMax.style.display = "block";
	    },
	    expand: function () {
	        this.heContent.style.display = "";
	        this.heFooter && (this.heContent.style = "");
	    },
	    fold: function () {
	        this.heContent.style.display = "none";
	        this.heFooter && (this.heContent.style = "none");
	    },
	    expandOrFold: function () {
	        this.heContent.style.display == "none" ? this.expand() : this.fold();
	    },
	    dropable: function (drops, onDrop) {
	        this.options.onDrop = onDrop;
	        drops && this.drag
				 && this.drag.dropable(this.options.drops = drops, $F.bind(this, this.options.onDrop, this));
	    },
	    close: function (e) { },
	    escClose: function (e) {
	        if (e.keyCode == 27) {
	            this.close();
	        }
	    },
	    removeIframe: function () {
	        if (this.heIframe) {
	            this.src = "about:blank"; //
	            this.heIframe.parentNode.removeChild(this.heIframe);
	            this.heIframe = null;
	        }
	    },
	    setIframe: function (iframe) {
	        if (!iframe)
	            return;
	        this.removeIframe();
	        var heIframe = doc.createElement("iframe");
	        heIframe.src = iframe.src || "about:blank"; //
	        heIframe.frameBorder = iframe.frameborder || 0;
	        // heIframe.style.border = iframe.border ? (iframe.border +
	        // "px") : "0px";
	        heIframe.scrolling = "no";
	        // heIframe.allowtransparency = "yes";
	        heIframe.height = iframe.height;
	        heIframe.width = iframe.width;
	        heIframe.marginHeight = "0";
	        heIframe.marginWidth = "0";
	        this.autoSize = iframe.autoSize;
	        $E.on(heIframe, "load", this.frameLoad, this);

	        return heIframe;
	    },
	    frameLoad: function (evt) {
	        var win = this.heIframe.contentWindow;
	        if (this.autoSize) {
	            this.heIframe.height = win.document.body.offsetHeight;
	            this.heIframe.width = win.document.body.offsetWidth;
	        }
	    },
	    location: function (src, iframe) { //第三个参数强制刷新
	        if (src) {
	            iframe || (iframe = {});
	            iframe.src = src;
	        }
	        this.heIframe = this.setIframe(iframe);
	        this.heContent.appendChild(this.heIframe);
	        this.heIframe.contentWindow.dialogArgs = iframe.data ?
					                                     $O.getType(iframe.data) != "array" ?
				                            	            [iframe.data]
					                                     : iframe.data
					                                 : null;
	        return this.heIframe.src;
	    },
	    dispose: function () {
	        $A.forEach(this.options.title_oper, function (o, index) {
	            this.unBind(o)
	        }, this);
	        $A.forEach(this.options.footer_oper, function (o, index) {
	            this.unBind(o)
	        }, this);
	    }
	});

    // 清除定时器
    Panel.clearTimer = function () {
        if (timer) {
            clearTimeout(timer);
            timer = undefined;
        }
    };

    Panel.open = function () {
        var Panel = new Panel(arguments[0] || {});
        Panel.show();
    };

    win.Panel = Panel;
})(window, undefined);

/*
*
*
*
* //todo 考虑的 new Pane({ width: 150, height: 150, title: { text: "", oper: [ {
* tagType: "a", text: "undock", onclick: function () {
*  } }, { tagType: "a", text: "dock", style: { display: "none" }, onclick:
* function () {
*  } }, { tagType: "a", text: "X", onclick: function () {
*  } } ] }, footer: { text: "", oper: [ { tagName: "a", text: "undock",
* onclick: function () {
*  } }, { tagName: "a", text: "dock", style: { display: "none" }, onclick:
* function () {
*  } }, { tag: "a", text: "X", onclick: function () {
*  } } ] }, resize: function () { }, drag: function () {
*  } })
*
*/

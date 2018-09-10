/*
    sfk_resizable.js by zcj  最后更新日期 2013- 03-02

*/
(function (win) {
	var doc = win.document, 
		Resizable = $C.Create({
		    // 拖放对象
		    initialize: function (options) {
		        var baseStyle = "position: absolute;background-color: transparent; overflow: hidden;", // transparentopacity: 0;filter:alpha(opacity=0);",
		            aStyle = [{
		                L: "top:0px;left: -2px;width:3px;height:100%;cursor: w-resize;",
		                R: "top:0px;right:-2px;width:3px;height:100%;cursor:w-resize;",
		                T: "top:-2px;height:3px;width:100%;cursor:n-resize;",
		                B: "bottom:-2px;width:100%;height:3px;cursor:n-resize;",
		                LT: "top:-2px;left:-2px;width:3px;height:3px;background:#FF0;cursor:nw-resize;",
		                RT: "top:-2px;right:-2px;width:3px;height:3px;background:#FF0;cursor:ne-resize;",
		                LB: "left:-2px;bottom:-2px;width:3px;height:3px;background:#FF0;cursor:ne-resize;",
		                RB: "right: -2px; bottom: -2px; width: 7px; height: 7px; background:#FF0;cursor:nw-resize;"
		            }, {
		                L: "left: -8px;width:6px;height:6px;cursor: w-resize;border:1px solid gray;",
		                R: "right:-8px;width:6px;height:6px;cursor:w-resize;border:1px solid gray;",
		                T: "top:-9px;height:6px;width:6px;cursor:n-resize;border:1px solid gray;",
		                B: "bottom:-9px;height:6px;width:6px;cursor:n-resize;border:1px solid gray;",
		                LT: "top:-8px;left:-8px;width:6px;height:6px;border:1px solid gray;cursor:nw-resize;",
		                RT: "top:-8px;right:-8px;width:6px;height:6px;border:1px solid gray;cursor:ne-resize;",
		                LB: "left:-8px;bottom:-8px;width:6px;height:6px;border:1px solid gray;cursor:ne-resize;",
		                RB: "right: -8px; bottom: -8px; width: 6px; height: 6px; border:1px solid gray;cursor:nw-resize;"
		            },{
		            	L: "left: -8px;width:6px;height:6px;cursor: w-resize;border:1px solid #ACC8E7;",
		                R: "right:-8px;width:6px;height:6px;cursor:w-resize;border:1px solid #ACC8E7;",
		                T: "top:-9px;height:6px;width:6px;cursor:n-resize;border:1px solid #ACC8E7;",
		                B: "bottom:-9px;height:6px;width:6px;cursor:n-resize;border:1px solid #ACC8E7;",
		                LT: "top:-8px;left:-8px;width:6px;height:6px;border:1px solid #ACC8E7;cursor:nw-resize;",
		                RT: "top:-8px;right:-8px;width:6px;height:6px;border:1px solid #ACC8E7;cursor:ne-resize;",
		                LB: "left:-8px;bottom:-8px;width:6px;height:6px;border:1px solid #ACC8E7;cursor:ne-resize;",
		                RB: "right: -8px; bottom: -8px; width: 6px; height: 6px; border:1px solid #ACC8E7;cursor:nw-resize;"
		            }],
		            rDiv = {
		                L: {
		                    drag: {
		                        lockY: true,
		                        L: true
		                    }
		                },
		                R: {
		                    drag: {
		                        lockY: true
		                    }
		                },
		                T: {
		                    drag: {
		                        lockX: true,
		                        T: true
		                    }
		                },
		                B: {
		                    drag: {
		                        lockX: true
		                    }
		                },
		                LT: {
		                    drag: {
		                        T: true,
		                        L: true
		                    }
		                },
		                RT: {
		                    drag: {
		                        T: true
		                    }
		                },
		                LB: {
		                    drag: {
		                        L: true
		                    }
		                },
		                RB: {}
		            }, div, r, len, i, name, style, defaultStyle = aStyle[0];

		        this._getResizeDiv_ = function () {
		            return rDiv;
		        };

		        this.SetOptions(options);
		        this.mode = this.options.mode;
		        this._showByAction  = "HOVER"; //默认的悬浮显示 和 事件直接控制显示
		        this.target = this.options.target;
		        this.targetContent = this.options.targetContent;
		        typeof this.target == "string" && (this.target = document.getElementById(this.target));
		        if (this.target) {
		            // $ET.lastElementChild(this.target).style.overflow =
					// "hidden";
		            this.mode == undefined || aStyle[this.mode] == null && (this.mode = 0);
		            style = this.mode == 1 ? aStyle[1] : aStyle[0];

		            var resizeDiv = $O.getType(this.options.resizeDir) == "array" ? this.options.resizeDir : ["L", "R", "T", "B", "LT", "RT", "LB", "RB"];
		            var rlContainer = options.RLContainer || this.target;
		        
		            for (var i = 0, len = resizeDiv.length; i < len; i++) {
		                name = resizeDiv[i].toUpperCase();
		                if (rDiv[name]) {
		                    div = document.createElement("div");
		                    div.className = name;
		                    div.style.cssText = (style[name] || defaultStyle[name]) + baseStyle;

		                    rlContainer.appendChild(div);
		                    this[name] = div;
		                    $E.bind(div, "mousedown", this.bind(rDiv, name), true);
		                }
		            }
		            this.rdw = (this["R"] || this["L"]).offsetWidth;
		            this.rdh = (this["T"] || this["B"]).offsetHeight;

		            this.startX = this.startY = 0; // 记录鼠标相对拖放对象的位置
		            this._marginLeft = this._marginTop = 0; // 记录margin

		            this.minW = parseInt(this.options.min.width);
		            this.minH = parseInt(this.options.min.height);

		            this.onBeforeResize = this.options.onBeforeResize;
		            this.onResize = this.options.onResize;
		            this.onAfterResize = this.options.onAfterResize;
		            this.src = {};
		            this.cur = {};
		            this.container = (typeof this.options.container != "string" ? this.options.container : document.getElementById(this.options.container)) || null;

		            this.setResize(this.target.clientWidth, this.target.clientHeight);
		            if (!!this.options.overShow) {
		                this.timer = null;
		                this.overShow = this.options.overShow;
		                this.outDelay = this.options.outDelay;//|| 300;
		                $E.on(this.target, "mouseover", this.show, this);
		                $E.on(this.target, "mouseout",this.outDelay ? this.outDelayHide : this.hide, this);
             
		                this.hide();
		            } 
		            this.toggleShowByAction = $O.type(this.options.toggleShowByAction) == "string" ? this.options.toggleShowByAction :"" ;
		            this.toggleShowState = -1;//默认隐藏
		            if (this.toggleShowByAction != "" && this.toggleShowByAction.indexOf("mouse") == -1) {
		            	$E.on(this.target, this.toggleShowByAction.split(/\s*,\s*|\s+/), this.toggleShow, this);
		            } 
		            this._fm = {
		                scope: this,
		                fn: this.move
		            };
		            this._fs = {
		                scope: this,
		                fn: this.stop
		            };
		            this.helper = {};
		        }
		    },
		    // 设置默认属性
		    SetOptions: function (options) {
		        this.options = {// 默认值
		            target: null,
		            container: null,
		            limit: false,
		            minL: 0,
		            minT: 0,
		            maxR: 1000,
		            maxB: 1000,
		            min: {
		                width: 5,
		                height: 5
		            },
		            mode: 0,
		            resizeDir: null, // 默认["L", "R", "T", "B", "LT", "RT",
										// "LB", "RB"]
		            onBeforeResize: null,
		            onResize: null,
		            overShow: false,
		            onAfterResize: null,
		            overShow: false,
		            outDelay: 0,
		            toggleShowByAction: null
		        };
		        $O.extend(this.options, options || {});
		    },
		    memo: function (obj, storage) {
		        var a = ["clientWidth", "clientHeight", "offsetWidth", "offsetHeight"
		            , ["borderLeftWidth", "borderBottomWidth", "borderTopWidth", "borderRightWidth"
		            , "left", "top", "width", "height"]];
		        (function (src, a, obj) {
		            var i, prop, len;
		            for (i = 0, len = a.length; i < len; i++) {
		                prop = a[i];
		                if (typeof prop == "string") {
		                    src[prop] = parseInt(obj[prop]);
		                } else {
		                    arguments.callee(src, prop, $ET.getStyle(obj));
		                }
		            }
		        })(storage, a, obj);
		        // if (isNaN(this.src["left"])) {
		        // var rec = $ET.getRect(this.target);
		        // this.src["left"] = rec.left;
		        // this.src["top"] = rec.top;
		        // }
		    },
		    setToggleShowByAction :function(evtType){
		    	 this.toggleShowByAction = evtType;
		    },
		    start: function (oEvent) {// 准备拖动
		        if (this.Lock) { return; }
		        this.drag = oEvent.target;
		        // //console.log(this.drag.className);

		        this.memo(this.target, this.src);
		        this.cur.startMX = oEvent.clientX;
		        this.cur.startMY = oEvent.clientY;
		        this.cur.iTop = this.src["top"];
		        this.cur.iLeft = this.src["left"],
		        this.cur.iW = this.src["width"],
		        this.cur.iH = this.src["height"],

		        this.disX = this.cur.startMX - this.drag.offsetLeft;
		        this.disY = this.cur.startMY - this.drag.offsetTop;
		        // 记录margin
		        this._marginLeft = parseInt($ET.getStyle(this.drag, "marginLeft")) || 0;
		        this._marginTop = parseInt($ET.getStyle(this.drag, "marginTop")) || 0;
		        this._fm.data = oEvent.evtData;
		        this._fs.data = oEvent.evtData;

		        this.helper.target = this.target;
		        this.helper.side = oEvent.evtData.name;
		        this.helper.src = this.src;
		        this.helper.cur = null;
		        // 附加程序
		        // if (this.onBeforeResize && this.onBeforeResize(this.helper)
				// === false) { return; }
		        this.setResize(this.src.offsetWidth, this.src.offsetHeight);
		        $E.bind(document, "mousemove", this._fm);
		        $E.bind(document, "mouseup", this._fs);
		        // ////console.log("start");
		        if ($B.ie) {
		            // 焦点丢失
		            $E.bind(this.drag, "losecapture", this.stop);
		            // 设置鼠标捕获
		            this.drag.setCapture();
		        } else {
		            // 焦点丢失
		            $E.bind(window, "blur", this.stop);
		            // 阻止默认动作
		            oEvent.preventDefault();
		        };
		    },
		    // 拖动
		    move: function (oEvent) {
		        var mouseX = oEvent.clientX,
		            mouseY = oEvent.clientY,
		            evtData = oEvent.evtData,
		            cur = this.cur, iW, iH,
		            diffX = mouseX - cur.startMX,
		            diffY = mouseY - cur.startMY;
		        // this.drag.style.left = mouseX - this.disX - this._marginLeft
				// + "px";
		        // this.drag.style.top = mouseY - this.disY - this._marginTop +
				// "px";
		        // todo 范围限制
		        if (!evtData.drag.lockX) {
		            // //console.log(evtData.L + " " + evtData.name + " iW:" +
					// cur.iW + " diffX:" + diffX);
		            if (evtData.drag.L) {// (evtData.name == "L" || evtData.name == "LT" || evtData.name == "LB") {
		                iW = cur.iW - diffX;
		                if (iW >= this.minW) {
		                    cur.iW = iW; // cur.iW - diffX;
		                    cur.iLeft = cur.iLeft + diffX;
		                }
		            } else {
		                cur.iW = Math.max(cur.iW + diffX, this.minW);
		            }
		        }
		        if (!evtData.drag.lockY) {
		            // //console.log(evtData.T + " " + evtData.name + " iH:" +
					// cur.iH + " diffY:" + diffY);
		            if (evtData.drag.T) { // (evtData.name == "T" || evtData.name == "LT" || evtData.name == "RT") {
		                iH = cur.iH - diffY;
		                if (iH >= this.minH) {
		                    cur.iH = iH;
		                    cur.iTop = cur.iTop + diffY;
		                }
		            } else {
		                cur.iH = Math.max(cur.iH + diffY, this.minH);
		            }
		        }
		        // //console.log(cur.iLeft);
		        this.helper.cur = {
		            x: mouseX,
		            y: mouseY,
		            top: cur.iTop,
		            left: cur.iLeft,
		            width: cur.iW,
		            height: cur.iH
		        };
		        if (this.onBeforeResize && this.onBeforeResize(oEvent, this.helper) === false) {
		            return;
		        }

		        $ET.setCSS(this.target, {
		            top: cur.iTop + "px",
		            left: cur.iLeft + "px",
		            width: cur.iW + "px",
		            height: cur.iH + "px"
		        });

		        this.memo(this.target, this.cur);
		        this.setResize(this.cur.iW, this.cur.iH);
		        this.onResize && this.onResize(this.helper);

		        cur.startMX = mouseX,
		        cur.startMY = mouseY;
		    },
		    // 停止拖动
		    stop: function () {
		        // 移除事件
		        this._fm && $E.unbind(document, "mousemove", this._fm);

		        if (this._fs) {
		            $E.unbind(document, "mouseup", this._fs);
		            if ($B.ie) {
		                $E.unbind(this.drag, "losecapture", this._fs);
		                this.drag.releaseCapture();
		            } else {
		                $E.unbind(window, "blur", this._fs);
		            };
		        }

		        // 附加程序
		        this.onAfterResize && this.onAfterResize();
		    },
		    bind: function (obj, name) {
		        var curObj = obj[name];
		        if (!curObj.drag) {
		            curObj.drag = {};
		        }
		        curObj.drag["lockX"] == undefined && (curObj.drag["lockX"] = false);
		        curObj.drag["lockY"] == undefined && (curObj.drag["lockY"] = false);
		        curObj.drag["L"] == undefined && (curObj.drag["L"] = false);
		        curObj.drag["T"] == undefined && (curObj.drag["T"] = false);
		        curObj["name"] = name;
		        curObj[name] = true;
		        obj.evtBind = {
		            scope: this,
		            fn: this.start,
		            data: curObj
		        }
		        return obj.evtBind;
		    },
		    unBind: function (remove) {
		        var rDiv = this._getResizeDiv_(),
		            name;

		        for (name in rDiv) {
		            if (name != "evtBind" && this[name]) {
		                $E.unbind(this[name], "mousedown", rDiv.evtBind.fn, true);
		                this[name].parentNode.removeChild(this[name]);
		                // if (remove && remove[name]) {
		                // }
		            }
		        }
		    },
		    setResize: function (iW, iH) {
		        if (this.mode) {
		        	if(iW){
			            this["T"] && (this["T"].style.left = (iW - this.rdw) / 2 + "px");
			            this["B"] && (this["B"].style.left = (iW - this.rdw) / 2 + "px");
		        	}
		        	if(iH){
			            this["L"] && (this["L"].style.top = (iH - this.rdh) / 2 + "px");
			            this["R"] && (this["R"].style.top = (iH - this.rdh) / 2 + "px");
		        	}
		        }
		    },
		    setContainerSize: function(iW, iH){
		    	iW && (this.target.style.width =  iW + "px");
		    	iH && (this.target.style.height =  iH + "px");
		    	this.setResize(iW, iH);
		    },
		    toggleShow: function(evt){
		    	var dis = "none";
		    	this.toggleShowState =  this.toggleShowState * -1;
		    	this.toggleShowState > 0 && (dis = "");
		    	this.mode && this._display(dis);
		    	this._showByAction = "OTHER";
	            evt && evt.stopPropagation();
		    },
		    _display:function(dis){
		        var dir = ["LT", "T", "RT", "R", "RB", "B", "LB", "L"], heRB;
		        dis || (dis = "");
	            for (var i = 0; i < dir.length; i++) {
	            	(heRB =  this[dir[i]]) && (heRB.style.display = dis);
	            }
		    },
		    show: function (evt) {
		        if (this.mode) {
		        	//其它动作是否让8个调整角处于显示状态
		        	if(this._showByAction != "HOVER" && this.toggleShowState > 0){
		        		 evt && evt.stopPropagation();
		        		 return;
			        }
		        	this._showByAction ="HOVER";
		         	if (this.timer != null) {
			              window.clearTimeout(this.timer);
			              this.timer = null;
			              return;
			        }
		            this._display("");
		         
		        }
		        evt && evt.stopPropagation();
		    },
		    hide: function (evt) {
		        if (this.mode) {
		        	if(this._showByAction != "HOVER" && this.toggleShowState > 0){
		        		evt.stopPropagation();
		        		return;
		        	}
		        	this._showByAction = "HOVER"; 
		        	this._display("none");
		        }
		        evt && evt.stopPropagation();
		    },
		    outDelayHide: function (evt) {
		        if (this.mode) {
		            var _this = this;
		            this.timer = window.setTimeout(function () {
		            	_this.timer = null;
		            	_this.hide(evt);
		            }, this.outDelay);
		        }
		        evt && evt.stopPropagation();
		    },
		    dispose: function () {
		        this._f = null;
		    }
		});
	
	Resizable.create = function (options) {
	    return new Resizable({
	        target: options.target
	    });
	};
	
	window.Resizable = Resizable;
})(window);


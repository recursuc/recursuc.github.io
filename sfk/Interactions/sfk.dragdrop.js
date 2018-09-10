/*
简单 Drag 来自cloudgramar
*/
(function (win) {
    var _drag = null, E = $E, ET = $ET, O = $O, A = $A, time = (new Date()).getTime(), maxZIndex = 1000,
    Drag = $C.Create({
        //拖放对象
        initialize: function (drag, options) {
            this.Drag = typeof drag != "string" ? drag : document.getElementById(drag);
            this._x = this._y = 0; //记录鼠标相对拖放对象的位置
            this._marginLeft = this._marginTop = 0; //记录margin
            //事件对象(用于绑定移除事件)
            this._fM = $E.argBind(this, this.Move);
            this._fS = $F.bind(this, this.Stop);
            this.SetOptions(options);

            this.Limit = !!this.options.Limit;
            this.mxLeft = parseInt(this.options.mxLeft);
            this.mxRight = parseInt(this.options.mxRight);
            this.mxTop = parseInt(this.options.mxTop);
            this.mxBottom = parseInt(this.options.mxBottom);

            this.LockX = !!this.options.LockX;
            this.LockY = !!this.options.LockY;
            this.Lock = !!this.options.Lock;

            this.onStart = this.options.onStart;
            this.onMove = this.options.onMove;
            this.onStop = this.options.onStop;

            this.dropable(this.options.drops, this.options.onDrop);

            this._Handle = (typeof this.options.Handle != "string" ? this.options.Handle : document.getElementById(this.options.Handle)) || this.Drag;
            this._mxContainer = (typeof this.options.mxContainer != "string" ? this.options.mxContainer : document.getElementById(this.options.mxContainer)) || null;
            this.helper = {
            };
            //透明
            if ($B.ie && !!this.options.Transparent) {
                //填充拖放对象
                with (this._Handle.appendChild(document.createElement("div")).style) {
                    width = height = "100%"; backgroundColor = "#fff"; filter = "alpha(opacity:0)"; fontSize = 0;
                }
            }
            //修正范围
            this.Repair();
            $E.on(this._Handle, "mousedown", this.Start, this);
            this.helper = {
                target: this._Handle
            };

            this.onPosition = this.options.onPosition;
            //this.srcPosition = ET.getStyle(this.Drag, "position");
        },
        //设置默认属性
        SetOptions: function (options) {
            this.options = {//默认值
                drop: null,
                onDrop: null,
                Handle: "", //设置触发对象（不设置则使用拖放对象）
                Limit: false, //是否设置范围限制(为true时下面参数有用,可以是负数)
                mxLeft: 0, //左边限制
                mxRight: 9999, //右边限制
                mxTop: 0, //上边限制
                mxBottom: 9999, //下边限制
                mxContainer: "", //指定限制在容器内
                LockX: false, //是否锁定水平方向拖放
                LockY: false, //是否锁定垂直方向拖放
                Lock: false, //是否锁定
                Transparent: false, //是否透明
                onPosition: null,
                onStart: function () { }, //开始移动时执行
                onMove: function () { }, //移动时执行
                onStop: function () { } //结束移动时执行
            };
            $O.extend(this.options, options || {});
        },
        Start: function (oEvent) {//准备拖动
            if (this.Lock) { return; }
            //this.position = ;
            var pos = ET.getStyle(this.Drag, "position");
            if (pos != "absolute") {
                if (!this.onPosition || this.onPosition(this.Drag, pos) != "absolute") return;
            } else {
                this.onPosition && this.onPosition(this.Drag, pos);
            }

            //this._Handle.focus();
            this.Repair();
            //记录鼠标相对拖放对象的位置
            this.iSOffsetLeft = this.Drag.offsetLeft;
            this.iSOffsetTop = this.Drag.offsetTop;

            this._x = oEvent.clientX - this.iSOffsetLeft;
            this._y = oEvent.clientY - this.iSOffsetTop;
            this.zIndex = parseInt($ET.getStyle(this.Drag, "zIndex"));
            this.Drag.style.zIndex = maxZIndex;

            //记录margin
            this._marginLeft = parseInt($ET.getStyle(this.Drag, "marginLeft")) || 0;
            this._marginTop = parseInt($ET.getStyle(this.Drag, "marginTop")) || 0;
            //mousemove时移动 mouseup时停止
            if (!!this._mxContainer) {
                var posContainerRect = ET.getRect(this.Drag.offsetParent),
                    mxRect = ET.getRect(this._mxContainer);

                this.mxLeft = mxRect.left - posContainerRect.left;
                this.mxTop = mxRect.top - posContainerRect.top;
                this.mxRight = mxRect.right - posContainerRect.left;
                this.mxBottom = mxRect.bottom - posContainerRect.top;
            }
            $E.bind(document, "mousemove", this._fM);
            $E.bind(document, "mouseup", this._fS);
            if ($B.ie) {
                //焦点丢失
                $E.bind(this._Handle, "losecapture", this._fS);
                //设置鼠标捕获
                this._Handle.setCapture();
            } else {
                //焦点丢失
                $E.bind(window, "blur", this._fS);
                //阻止默认动作
                oEvent.preventDefault();
            };

            this.helper.sL = this.helper.eL = parseInt($ET.getStyle(this.Drag, "left"));
            this.helper.sT = this.helper.eT = parseInt($ET.getStyle(this.Drag, "top"));
            this.helper.sMouseX = oEvent.clientX;
            this.helper.sMouseY = oEvent.clientY;
            this.dropTarget = null;
            this.onStart && this.onStart(oEvent);
        },
        Repair: function () {
            if (this.Limit) {
                //修正错误范围参数
                this.mxRight = Math.max(this.mxRight, this.mxLeft + this.Drag.offsetWidth);
                this.mxBottom = Math.max(this.mxBottom, this.mxTop + this.Drag.offsetHeight);
                //如果有容器必须设置position为relative来相对定位，并在获取offset之前设置
                !this._mxContainer || $ET.getStyle(this._mxContainer, "position") == "relative" || $ET.getStyle(this._mxContainer, "position") == "absolute" || (this._mxContainer.style.position = "relative");
            }
        },
        //拖动
        Move: function (oEvent) {
            //console.log(oEvent.target.className);
            //判断是否锁定
            if (this.Lock) { this.Stop(); return; };
            //清除选择
            window.getSelection ? window.getSelection().removeAllRanges() : document.selection.empty();
            //设置移动参数
            this.helper.eMouseX = oEvent.clientX;
            this.helper.eMouseY = oEvent.clientY;
            this.SetPos(oEvent.clientX - this._x, oEvent.clientY - this._y, oEvent);

            this.drops && this.dropableHanle(oEvent);
        },
        isOffsetParent: function () {
            var mxContainer = this._mxContainer, //范围容器
                drag = this.Drag, posContainer = drag.offsetParent, //拖拽目标的定位容器
                pos, posContainerRect, mxRect,
                 diffX = 0, diffY = 0;
            if (dOP != mxContainer) {
                pos = ET.getStyle(mxContainer, "position");
                if (mxContainer.contains(dPosContainer)) {
                    if (pos == "absolute" || pos == "relative") {
                        while (dOP && dOP != mxContainer) {
                            diffX += dOP.offsetLeft;
                            diffY += dOP.offsetTop;
                            dOP = dOP.offsetParent;
                        }
                    }
                    this.diffX = diffX;
                    this.diffY = diffY;
                } else {
                    posContainerRect = T.getRect(dOP);
                    mxRect = ET.getRect(this._mxContainer);
                    diffX = mxRect.Left - posContainerRect.left;
                    diffY = mxRect.top - posContainerRect.top;
                }
            }
        },
        //设置位置
        SetPos: function (iLeft, iTop) {
            //设置范围限制
            if (this.Limit) {
                //设置范围参数
                var mxLeft = this.mxLeft, mxRight = this.mxRight, mxTop = this.mxTop, mxBottom = this.mxBottom;
                //如果设置了容器，再修正范围参数
                //if (!!this._mxContainer) {
                //    mxLeft = Math.max(mxLeft, 0);
                //    mxTop = Math.max(mxTop, 0);
                //    mxRight = Math.min(mxRight, this._mxContainer.clientWidth);
                //    mxBottom = Math.min(mxBottom, this._mxContainer.clientHeight);
                //};
                //修正移动参数
                iLeft = Math.max(Math.min(iLeft, mxRight - this.Drag.offsetWidth), mxLeft);
                iTop = Math.max(Math.min(iTop, mxBottom - this.Drag.offsetHeight), mxTop);
            }
            //console.log(iLeft + "  " + iTop)
            //设置位置，并修正margin
            if (!this.LockX) { this.helper.eL = iLeft - this._marginLeft; this.Drag.style.left = this.helper.eL + "px"; }
            if (!this.LockY) { this.helper.eT = iTop - this._marginTop; this.Drag.style.top = this.helper.eT + "px"; }
            this.onMove && this.onMove(this.helper);
        },
        //停止拖动
        Stop: function (evt) {
            //移除事件
            $E.unbind(document, "mousemove", this._fM);
            $E.unbind(document, "mouseup", this._fS);
            if ($B.ie) {
                $E.unbind(this._Handle, "losecapture", this._fS);
                this._Handle.releaseCapture();
            } else {
                $E.unbind(window, "blur", this._fS);
            };
            this.Drag.style.zIndex = this.zIndex;
            if (this.onDrop && this.dropTarget) {
                if (this.dropTarget.type == "table") {
                    this.dropTarget.heTd && (this.dropTarget.he.style.backgroundColor == "#FFFFAE" && (this.dropTarget.heTd.style.backgroundColor = ""));
                } else {
                    this.dropTarget.he.style.backgroundColor = this.dropTarget.backgroundColor;
                }
                this.onDrop(this.dropTarget.he, this.dropTarget);
            }
            this.onStop && this.onStop(this.helper, evt);
        },
        getMaxZIndex: function () {
            var hecDiv = document.getElementsByTagName("div"), zindex = 0;
            for (var i = 0, len = hecDiv.length; i < len; i++) {
                zindex = parseInt(hecDiv[i].style.zIndex);
                if (maxZIndex < zindex) {
                    maxZIndex = zindex + 1;
                }
            }
        },
        resetMx: function (options) {
            this.mxLeft = parseInt(options.mxLeft);
            this.mxRight = parseInt(options.mxRight);
            this.mxTop = parseInt(options.mxTop);
            this.mxBottom = parseInt(options.mxBottom);
            this.Repair();
        },
        unBind: function () {
            $E.un(this._Handle, "mousedown", this.Start);
        },

        dropableHanle: function (evt) {
            var dropTarget, rect, ET = $ET, i = 0, len = this.drops.length, L, R, T, B;
            var curTime = (new Date()).getTime();
            //console.log("C:" + curTime);
            if (curTime - time < 100) {
                return;
            }
            if (this.dropTarget) {
                console.log("开始------" + this.dropTarget);
                if (this.dropTarget.type == "table") {
                    console.log("--table--" + this.dropTarget.tdBgColor);
                    this.dropTarget.heTd && (this.dropTarget.heTd.style.backgroundColor = this.dropTarget.tdBgColor);
                } else {
                    this.dropTarget.backgroundColor && (this.dropTarget.he.style.backgroundColor = this.dropTarget.backgroundColor);
                }
            }
            for (; i < len; i++) {
                dropTarget = this.drops[i], rect = dropTarget.rect;

                if (evt.pageX > rect.left && evt.pageX < rect.right && evt.pageY > rect.top && evt.pageY < rect.bottom) {
                    //console.log(dropTarget.he);
                    if (dropTarget.type == "table") {
                        var oTable = dropTarget.he, trRects = dropTarget.trRects, PR = rect.left;
                        for (var rowIndex = 0, oCell, iRLen = trRects.length - 1, colIndex, iCLen, oTr; rowIndex < iRLen; rowIndex++) {
                            T = trRects[rowIndex]; B = trRects[rowIndex + 1];
                            if (evt.pageY > T && evt.pageY < B) {
                                do {
                                    //console.log(rowIndex);
                                    oTr = oTable.rows[rowIndex];
                                    if (!oTr) { return; }
                                    for (colIndex = 0, iCLen = oTr.cells.length; colIndex < iCLen; colIndex++) {
                                        oCell = oTr.cells[colIndex];
                                        //console.log(oCell);
                                        //dropTarget.heTd && (dropTarget.heTd.style.backgroundColor = "");
                                        L = rect.left + oCell.offsetLeft; R = L + oCell.offsetWidth;
                                        if (evt.pageX > L) {
                                            if (evt.pageX < R) {
                                                this.dropTarget = dropTarget;
                                                dropTarget.heTd = oCell;
                                                // 不对就用这个 dropTarget.tdRect = $ET.getRect(oCell);
                                                dropTarget.tdRect = {
                                                    left: L,
                                                    right: R,
                                                    top: trRects[rowIndex],
                                                    bottom: trRects[rowIndex] + oCell.offsetHeight
                                                };
                                                dropTarget.tdBgColor = ET.getStyle(dropTarget.heTd, "backgroundColor");
                                                console.log("命中:" + dropTarget.tdBgColor);
                                                dropTarget.heTd.style.backgroundColor = "#FFFFAE";
                                                this.dropTarget = dropTarget;
                                                this.dropIndex = i;
                                                time = (new Date()).getTime();

                                                return;
                                            }
                                        } else if (evt.pageX > PR) {
                                            break;
                                        }
                                        PR = R;
                                    }
                                    rowIndex--;
                                } while (oTr);
                            }
                        }
                        //dropTarget.heTd && (dropTarget.heTd.style.backgroundColor = "");
                    } else {
                        dropTarget.he.style.backgroundColor = "#FFFFAE";
                        this.dropTarget = dropTarget; //bFound = true; 放在里面会被覆盖掉……
                        this.dropIndex = i;
                        time = (new Date()).getTime();
                        return;
                    }
                    //console.log("----------------------- bFound:");
                }
                //preDropTarget = dropTarget;
            }

            time = (new Date()).getTime();
            //console.log("E:" + time);
        },
        /* 
        dropableHanle: function (evt) {
        var dropTarget, preDropTarget, rect, ET = $ET, i = 0, len = this.drops.length, bFound = false, L, R, T, B;
        var curTime = (new Date()).getTime();
        //console.log("C:" + curTime);
        if (curTime - time < 100) {
        return;
        }
        for (; i < len; i++) {
        dropTarget = this.drops[i], rect = dropTarget.rect;
        //console.log(dropTarget.he);
        if (dropTarget.type == "table") {
        dropTarget.heTd && (dropTarget.he.style.backgroundColor == "#FFFFAE" && (dropTarget.heTd.style.backgroundColor = ""));
        } else {
        dropTarget.backgroundColor && (dropTarget.he.style.backgroundColor = dropTarget.backgroundColor);
        }

        if (!bFound && evt.pageX > rect.left && evt.pageX < rect.right
        && evt.pageY > rect.top && evt.pageY < rect.bottom) {
        //console.log(dropTarget.he);
        if (dropTarget.type == "table") {
        var oTable = dropTarget.he, trRects = dropTarget.trRects;
        for (var rowIndex = 0, oCell, iRLen = trRects.length - 1, colIndex, iCLen, oTr; rowIndex < iRLen; rowIndex++) {
        T = trRects[rowIndex]; B = trRects[rowIndex + 1];
        if (evt.pageY > T && evt.pageY < B) {
        do {
        //console.log(rowIndex);
        oTr = oTable.rows[rowIndex];
        if (!oTr) { return; }
        for (colIndex = 0, iCLen = oTr.cells.length; colIndex < iCLen; colIndex++) {
        oCell = oTr.cells[colIndex];
        //console.log(oCell);
        dropTarget.heTd && (dropTarget.heTd.style.backgroundColor = "");
        L = rect.left + oCell.offsetLeft; R = L + oCell.offsetWidth
        if (evt.pageX > L && evt.pageX < R) {
        this.dropTarget = dropTarget;
        dropTarget.heTd = oCell;
        // 不对就用这个 dropTarget.tdRect = $ET.getRect(oCell);
        dropTarget.tdRect = {
        left: L,
        right: R,
        top: trRects[rowIndex],
        bottom: trRects[rowIndex] + oCell.offsetHeight
        };
        dropTarget.heTd.style.backgroundColor = "#FFFFAE";
        bFound = true;
        //console.log("-----td");
        break;
        }
        }
        rowIndex--;
        } while (!bFound && oTr);
        }
        if (bFound) {
        break;
        }
        }
        //dropTarget.heTd && (dropTarget.heTd.style.backgroundColor = "");
        } else {
        bFound = true;
        dropTarget.he.style.backgroundColor = "#FFFFAE";
        this.dropTarget = dropTarget; //bFound = true; 放在里面会被覆盖掉……
        this.dropIndex = i;
        }
        //console.log("----------------------- bFound:");
        }
        }

        if (!bFound) {
        this.dropTarget = null;
        this.dropIndex = -1;
        }
        time = (new Date()).getTime();
        //console.log("E:" + time);
        },
        */
        isInRange: function (evt, tRect) {
            if (evt.pageX > tRect.left && evt.pageX < tRect.right
            && evt.pageY > tRect.top && evt.pageY < tRect.bottom) return true;
            else return false;
        },
        getDropableTarget: function (evt) {
            for (var i = 0, len = this.drops.length, drop, rect; i < len; i++) {
                drop = this.drops[i], rect = drop.rect;
                if (evt.pageX > rect.left && evt.pageX < rect.right
                   && evt.pageY > rect.top && evt.pageY < rect.bottom) {
                    return drop;
                }
            }
            return null;
        },
        dropable: function (drops, onDrop, i) {//add dropable target 
            typeof onDrop == "function" && (this.onDrop = onDrop);
            this.insertDropTarget(drops, i);
            /*  存在就更新 否则就在指定新增
            var ET = $ET, he, A = $A,
            bFound, j, k;
            this.drops || (this.drops = []);
            $O.getType(drops) == "array" || (drops = !drops ? [] : [drops]);
            (isNaN(i) || i < 0 || i > this.drops.length) && (i = this.drops.length); //
            for (j = 0; j < drops.length; j++) {
            he = drops[j]; bFound = false;
            for (k = 0; k < this.drops.length; k++) {
            if (this.drops[k].he == he) {
            bFound = true;
            break;
            }
            }

            if (bFound) {
            this.drops[k].rect = ET.getRect(he);//更新坐标
            } else {
            this.drops.splice(i, 0, {
            rect: ET.getRect(he),
            he: he,
            hover: false,
            border: ET.getStyle(he, "border")
            });
            i++;
            }
            }
            */
        },
        insertDropTarget: function (drops, i) {//接受带heDrop或带heDrop属性的对象  或其数组形式
            var he, j;
            this.drops || (this.drops = []);
            $O.getType(drops) == "array" || (drops = !drops ? [] : [drops]);
            (isNaN(i) || i < 0 || i > this.drops.length) && (i = this.drops.length);

            for (j = 0; j < drops.length; j++) {
                this.drops.splice(i++, 0, this.convertToDropTarget(drops[j]));
            }
        },
        updateDropTargetRect: function (drop) {//更新指定drop 元素对象 的坐标
            var k = 0, he, rect;
            for (; k < this.drops.length; k++) {
                if (this.drops[k].he == he) {
                    this.drops[k].rect = rect || ET.getRect(he); //更新坐标
                    break;
                }
            }
        },
        resetDropTarget: function (drops) {//重置放置目标对象
            var drop;
            O.getType(drops) == "array" || (drops = !drops ? [] : [drops]);
            this.drops || (this.drops.length = 0);
            this.drops = drops;
            for (var k = 0; k < this.drops.length; k++) {
                this.drops[k] = this.convertToDropTarget(this.drops[k]);
            }
        },
        convertToDropTarget: function (heDrop) {
            var drop = heDrop;
            O.type(drop) == "html" && (drop = { he: heDrop });
            drop.rect || (drop.rect = ET.getRect(drop.he));
            drop.type || (drop.type = "div");
            drop.hover = false;
            drop.backgroundColor = ET.getStyle(drop.he, "backgroundColor");

            if (drop.type == "table") {
                var oTable = drop.he, trRects = drop.trRects = [drop.rect.top];
                for (var rowIndex = 0, oCell, iRLen = oTable.rows.length; rowIndex < iRLen; rowIndex++) {
                    oTr = oTable.rows[rowIndex];
                    drop.trRects.push(trRects[rowIndex] + oTr.offsetHeight);
                }
                //drop.trRects.push(drop.rect.bottom);
                drop.tdBC = "";
            }
            return drop
        },
        revertStyle: function (dropTarget) {
            dropTarget.he.style.border = "1px solid red";
            dropTarget.he.style.border = dropTarget.border;
        },
        reBind: function (heTarget) {
            this.unBind();
            this._Handle = heTarget;
            $E.on(this._Handle, "mousedown", this.Start, this);
        },
        toggle: function () {
            if (this.Drag.style.display != "none") {
                this.Drag.style.display == "none";
            } else {
                this.Drag.style.display = "";
            }
        }
    });

    Drag.setting = function () {
        if (_drag) {
            _drag = new Drag(options.target, options)
        }
    },
    Drag.setStart = function (options, oEvent) {
        if (!_drag) {
            _drag = new Drag(options.target, options)
        } else {
            _drag.reBind(options.target);
            _drag.resetDropTarget(options.drops);
        }
        _drag.Drag = options.target;

        //_drag.Start(oEvent);
        return _drag;
    };
    window.Drag = Drag;
})(window);
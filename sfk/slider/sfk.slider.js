/*
    简单 Slider
*/

var Slider = window.Slider = Common.Class.create();
Slider.prototype = {
    //容器对象，滑块
    initialize: function (options) {
        this.SetOptions(options);
        this.content = this.options.content;
        this.container = this.options.container;
        this.bar = this.options.bar;
        this.tScroll = this.options.tScroll;
        this.dScroll = this.options.dScroll;
        this.lScroll = this.options.lScroll;
        this.rScroll = this.options.rScroll;
        this.mxLeft = 0;
        this.mxTop = 0;
        this.mxBottom = 9999;
        this.mxRight = 9999;
        this.top = 0;
        this.left = 0;
        this.calcWidthHeight();
        this.initScroller();

        this._timer = null; //自动滑移的定时器
        this._ondrag = false; //解决ie的click问题 

        this.WheelSpeed = Math.max(0, this.options.WheelSpeed);
        this.KeySpeed = Math.max(0, this.options.KeySpeed);

        this.MinValue = this.options.MinValue;
        this.MaxValue = this.options.MaxValue;

        this.RunTime = Math.max(1, this.options.RunTime);
        this.RunStep = Math.max(1, this.options.RunStep);

        this.Ease = !!this.options.Ease;
        this.EaseStep = Math.max(1, this.options.EaseStep);
        this._IsMin = this._IsMax = this._IsMid = false; //是否最小值、最大值、中间值
        this.onMin = this.options.onMin;
        this.onMax = this.options.onMax;
        this.onMid = this.options.onMid;

        this.onDragStart = this.options.onDragStart;
        this.onDragStop = this.options.onDragStop;

        this.onMove = this.options.onMove;
        this._horizontal = !!this.options.Horizontal; //一般不允许修改        
        //点击控制
        $E.bind(this.container, "click", {
            scope: this,
            fn: function (e) {
                this._ondrag || this.ClickCtrl(e);
            }
        });
        //取消冒泡，防止跟Container的click冲突
        $E.bind(this.bar, "click", {
            scope: this,
            fn: function (e) {
                e.stopPropagation();
            }
        });

        //设置鼠标滚轮控制
        this.WheelBind(this.container); this._horizontal || this.WheelBind(this.content.parentNode);
        //设置方向键控制
        this.KeyBind(this.container); this.KeyBind(this.content.parentNode);

        //修正获取焦点
        var oFocus = $B.ie || $B.chrome ? (this.KeyBind(this.bar), this.bar) : this.container;
        $E.bind(this.bar, "mousedown", function () {
            oFocus.focus();
        });
        //ie鼠标捕获和ff的取消默认动作都不能获得焦点，所以要手动获取如果ie把focus设置到Container，那么在出现滚动条时ie的focus可能会导致自动滚屏

        //实例化一个拖放对象，并限定范围
        this._drag = new Drag(this.bar, {
            Limit: true,
            mxTop: this.mxTop,
            mxBottom: this.mxBottom,
            mxLeft: this.mxLeft,
            mxRight: this.mxRight,
            mxContainer: this.container,
            onStart: $F.bind(this, this.DragStart),
            onStop: $F.bind(this, this.DragStop),
            onMove: $F.bind(this, this.Move)
        });


        this._drag[this._horizontal ? "LockY" : "LockX"] = true; //锁定拖放方向
    },
    SetOptions: function (options) {
        this.options = {//默认值
            container: null,
            bar: null,
            lScroll: null,
            rScroll: null,
            tScroll: null,
            dScroll: null,
            scrollSpeed: 10,
            MinValue: 0, //最小值
            MaxValue: 100, //最大值
            WheelSpeed: 5, //鼠标滚轮速度,越大越快(0则取消鼠标滚轮控制)
            KeySpeed: 50, //方向键滚动速度,越大越慢(0则取消方向键控制)
            Horizontal: true, //是否水平滑动
            RunTime: 20, //自动滑移的延时时间,越大越慢
            RunStep: 2, //自动滑移每次滑动的百分比
            Ease: false, //是否缓动
            EaseStep: 5, //缓动等级,越大越慢
            onMin: function () { }, //最小值时执行
            onMax: function () { }, //最大值时执行
            onMid: function () { }, //中间值时执行 不是一半
            onDragStart: function () { }, //拖动开始时执行
            onDragStop: function () { }, //拖动结束时执行
            onMove: function () { } //滑动时执行
        };
        $O.extend(this.options, options || {});
    },
    DragStart: function () {
        this.Stop();
        this.onDragStart();
        this._ondrag = true;
    },
    DragStop: function () {
        this.onDragStop();
        setTimeout($F.bind(this, function () { this._ondrag = false; }), 10);
    },
    Move: function () {
        this.onMove();
        var percent = this.GetPercent();
        //最小值判断
        if (percent > 0) {
            this._IsMin = false;
        } else {
            if (!this._IsMin) { this.onMin(); this._IsMin = true; }
        }
        //最大值判断
        if (percent < 1) {
            this._IsMax = false;
        } else {
            if (!this._IsMax) { this.onMax(); this._IsMax = true; }
        }
        //中间值判断
        if (percent > 0 && percent < 1) {
            if (!this._IsMid) { this.onMid(); this._IsMid = true; }
        } else {
            this._IsMid = false;
        }
    },
    ClickCtrl: function (e) {
        var oPos = $ET.position(this.container)
        this.EasePos(e.pageX - oPos.left - this.bar.offsetWidth / 2, e.pageY - oPos.top - this.bar.offsetHeight / 2);
    },
    scrollCtrl: function (e) {
        var left = this.bar.offsetLeft,
                top = this.bar.offsetTop
        switch (e.evtData.dir) {
            case "t":
                {
                    top -= this.options.scrollSpeed;
                    break;
                }
            case "d":
                {
                    top += this.options.scrollSpeed;
                    break;
                }
            case "l":
                {
                    left -= this.options.scrollSpeed;
                    break;
                }
            case "r":
                {
                    left += this.options.scrollSpeed;
                    break;
                }
            default:

        }
        //清除选择
        window.getSelection ? window.getSelection().removeAllRanges() : document.selection.empty();
        this.SetPos(left, top);
        e.stopPropagation();
        e.preventDefault(); //防止触发其他滚动条
    },
    WheelCtrl: function (e) {
        var i = parseInt(this.WheelSpeed * e.wheelDelta / -40);
        i > 0 ? this.increase = true : this.increase = false;
        this.SetPos(this.bar.offsetLeft + i, this.bar.offsetTop + i);
        e.preventDefault(); //防止触发其他滚动条
    },
    WheelBind: function (o) {
        //鼠标滚轮控制
        $E.bind(o, $B.ie || $B.chrome ? "mousewheel" : "DOMMouseScroll", { scope: this, fn: this.WheelCtrl });
    },
    KeyCtrl: function (e) {
        if (this.KeySpeed) {
            var iLeft = this.bar.offsetLeft,
                    iWidth = this.lScroll == null ? (this.container.clientWidth - this.bar.offsetWidth) / this.KeySpeed :
                    (this.container.clientWidth - this.bar.offsetWidth - this.lScroll.offsetWidth - this.rScroll.offsetWidth) / this.KeySpeed
            iTop = this.bar.offsetTop,
                    iHeight = this.tScroll == null ? (this.container.clientHeight - this.bar.offsetHeight) / this.KeySpeed :
                     (this.container.clientHeight - this.bar.offsetHeight - this.tScroll.offsetHeight - this.dScroll.offsetHeight) / this.KeySpeed;

            switch (e.keyCode) {
                case 37: //左
                    iLeft -= iWidth; break;
                case 38: //上
                    iTop -= iHeight; break;
                case 39: //右
                    iLeft += iWidth; break;
                case 40: //下
                    iTop += iHeight; break;
                default:
                    return; //不是方向按键返回
            }
            this.SetPos(iLeft, iTop);
            //防止触发其他滚动条
            e.preventDefault();
        }
    },
    KeyBind: function (o) {//绑定方向键
        $E.bind(o, "keydown", { scope: this, fn: this.KeyCtrl });
        //设置tabIndex使设置对象能支持focus
        o.tabIndex = -1;
        //取消focus时出现的虚线框
        o.style.outline = "none"//非IE下取消获取焦点的边框
    },
    GetValue: function () {//获取当前值
        //根据最大最小值和滑动百分比取值
        return this.MinValue + (this.GetPercent() * (this.MaxValue - this.MinValue));
    },
    SetValue: function (value) {//设置值位置
        //根据最大最小值和参数值设置滑块位置
        this.SetPercent((value - this.MinValue) / (this.MaxValue - this.MinValue));
    },
    GetPercent: function () {//获取百分比
        return this._horizontal ? (this.bar.offsetLeft - this.mxLeft) / this.hScrollWidth :
          (this.bar.offsetTop - this.mxTop) / this.vScrollHeight;
    },
    SetPercent: function (value) {//设置百分比位置
        //根据百分比设置滑块位置
        this.EasePos(this.hScrollWidth * value, this.vScrollHeight * value);
    },
    initScroller: function () {
        var clickTimer = null, _this = this;
        if (this.tScroll != null && this.dScroll != null) {
            $E.bind(this.tScroll, "click", function (e) {
                e.stopPropagation();
            });
            $E.bind(this.tScroll, "mousedown", function (e) {
                var fn = $F.bind(_this, function () {
                    window.clearTimeout(clickTimer);
                    clickTimer = null;
                    _this.Run(false);
                })
                clickTimer = window.setTimeout(fn, 300);
                e.stopPropagation();
            });
            $E.bind(this.tScroll, "mouseup", {
                scope: this,
                fn: function (e) {
                    if (clickTimer) {
                        window.clearTimeout(clickTimer);
                        clickTimer = null;
                        this.scrollCtrl(e);
                    } else {
                        this.Stop();
                    }
                    e.stopPropagation();
                }, data: { dir: "t" }
            });

            $E.bind(this.dScroll, "click", function (e) {
                e.stopPropagation();
            });
            $E.bind(this.dScroll, "mousedown", function (e) {
                var fn = $F.bind(_this, function () {
                    window.clearTimeout(clickTimer);
                    clickTimer = null;
                    _this.Run(true);
                })
                clickTimer = window.setTimeout(fn, 300);
                e.stopPropagation();
            });
            $E.bind(this.dScroll, "mouseup", {
                scope: this,
                fn: function (e) {
                    if (clickTimer) {
                        window.clearTimeout(clickTimer);
                        clickTimer = null;
                        this.scrollCtrl(e);
                    } else {
                        this.Stop();
                    }
                    e.stopPropagation();
                },
                data: { dir: "d" }
            });
        } else if (this.lScroll != null && this.rScroll != null) {
            $E.bind(this.lScroll, "click", function (e) {
                e.stopPropagation();
            });

            $E.bind(this.lScroll, "mousedown", function (e) {
                var fn = $F.bind(_this, function () {
                    window.clearTimeout(clickTimer);
                    clickTimer = null;
                    _this.Run(false);
                })
                clickTimer = window.setTimeout(fn, 300);
                e.stopPropagation();
            });
            $E.bind(this.lScroll, "mouseup", {
                scope: this, fn: function (e) {
                    if (clickTimer) {
                        window.clearTimeout(clickTimer);
                        clickTimer = null;
                        this.scrollCtrl(e);
                    } else {
                        this.Stop();
                    }
                    e.stopPropagation();
                }, data: { dir: "l" }
            });

            $E.bind(this.rScroll, "click", function (e) {
                e.stopPropagation();
            });
            $E.bind(this.rScroll, "mousedown", function (e) {
                var fn = $F.bind(_this, function () {
                    window.clearTimeout(clickTimer);
                    clickTimer = null;
                    _this.Run(true);
                })
                clickTimer = window.setTimeout(fn, 300);
                e.stopPropagation();
            });
            $E.bind(this.rScroll, "mouseup", {
                scope: this,
                fn: function (e) {
                    if (clickTimer) {
                        window.clearTimeout(clickTimer);
                        clickTimer = null;
                        this.scrollCtrl(e);
                    } else {
                        this.Stop();
                    }
                    e.stopPropagation();
                },
                data: { dir: "r" }
            });
        }
    },
    calcWidthHeight: function () {
        var contentPer = this.getScrollSizePer();
        if (contentPer == 1) {
            this.bar.style.visibility = "hidden";
        } else {
            this.bar.style.visibility = "";
            if (this.tScroll != null && this.dScroll != null) {
                this.mxTop = this.tScroll.offsetHeight;
                this.mxBottom = this.container.clientHeight - this.dScroll.offsetHeight;
                this.bar.style.height = parseInt((this.mxBottom - this.mxTop) * contentPer) + "px";
                this.vScrollHeight = this.mxBottom - this.mxTop - this.bar.offsetHeight; //可以滚动的高 

                this.MaxValue = this.content.scrollHeight - this.content.clientHeight;
                this.bar.style.top = this.mxTop;
            } else if (this.lScroll != null && this.rScroll != null) {
                this.mxLeft = this.lScroll.offsetWidth;
                this.mxRight = this.container.clientWidth - this.rScroll.offsetWidth;
                this.bar.style.width = parseInt((this.mxRight - this.mxLeft) * contentPer) + "px";
                this.hScrollWidth = this.mxRight - this.mxLeft - this.bar.offsetWidth;

                this.MaxValue = this.content.scrollWidth - this.content.clientWidth; //可滚动的距离
                this.bar.style.left = this.mxLeft;
            } else {
                this.vScrollHeight = this.container.clientHeight - this.bar.offsetHeight; //可滚动的距离
                this.hScrollWidth = this.container.clientWidth - this.bar.offsetWidth;
            }
            if (this._drag) {
                this._drag.resetMx({
                    mxLeft: this.mxLeft,
                    mxRight: this.mxRight,
                    mxTop: this.mxTop,
                    mxBottom: this.mxBottom
                });
            }
            return true;
        }
        return false;
    },
    getScrollSizePer: function () {
        return this._horizontal ? this.content.clientWidth / this.content.scrollWidth : this.content.clientHeight / this.content.scrollHeight;
    },
    setContent: function (content) {
        this.content = content;
    },
    resize: function () {
        var scroll;
        //重新赋值
        if (this.calcWidthHeight()) {
            if (this._horizontal) {
                this.bar.style.left = this.mxLeft + (this.content.scrollLeft / (this.MaxValue - this.MinValue)) * this.hScrollWidth + "px";
            } else {
                this.bar.style.top = this.mxTop + (this.content.scrollTop / (this.MaxValue - this.MinValue)) * this.vScrollHeight + "px";
            }
        }
    },
    Run: function (bIncrease) {//自动滑移(是否递增)
        this.Stop();
        //修正一下bIncrease
        bIncrease = !!bIncrease;
        //根据是否递增来设置值
        var percent = this.GetPercent() + (bIncrease ? 1 : -1) * this.RunStep / 100;
        this.SetPos(this.mxLeft + (bIncrease ? Math.ceil(this.hScrollWidth * percent) : Math.floor(this.hScrollWidth * percent)), this.mxTop + (bIncrease ? Math.ceil(this.vScrollHeight * percent) : Math.floor(this.vScrollHeight * percent)));
        //如果没有到极限值就继续滑移
        if (!(bIncrease ? this._IsMax : this._IsMin)) {
            this._timer = setTimeout($F.bind(this, this.Run, bIncrease), this.RunTime);
        }
    },
    Stop: function () {//停止滑移
        clearTimeout(this._timer);
    },
    EasePos: function (iLeftT, iTopT) {//缓动滑移
        this.Stop();
        //必须是整数，否则可能死循环
        iLeftT = Math.round(iLeftT);
        iTopT = Math.round(iTopT);
        //如果没有设置缓动
        if (!this.Ease) {
            this.SetPos(iLeftT, iTopT);
            return;
        }
        //获取缓动参数
        var iLeftN = this.bar.offsetLeft,
                    iLeftS = this.GetStep(iLeftT, iLeftN),
                    iTopN = this.bar.offsetTop,
                    iTopS = this.GetStep(iTopT, iTopN);
        //如果参数有值
        if (this._horizontal ? iLeftS : iTopS) {
            this.SetPos(iLeftN + iLeftS, iTopN + iTopS); //设置位置
            //如果没有到极限值则继续缓动
            if (this._IsMid) {
                this._timer = setTimeout($F.bind(this, this.EasePos, iLeftT, iTopT), this.RunTime);
            }
        }
    },
    GetStep: function (iTarget, iNow) {//获取步长
        var iStep = (iTarget - iNow) / this.EaseStep;
        if (iStep == 0) return 0;
        if (Math.abs(iStep) < 1) {
            return (iStep > 0 ? 1 : -1)
        };
        return iStep;
    },
    SetPos: function (iLeft, iTop) {//设置滑块位置
        this.Stop();
        this._drag.SetPos(iLeft, iTop);
    }
};
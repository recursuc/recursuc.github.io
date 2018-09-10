
//todo: 容器控件 单值控件
function Control(options, data) {
    options.ds || (options.ds = data);
    this.option = options;
    this.elem = options.elem;
    this.oldValue = this.value = null;
    options.value == null && (options.value = "");
    this.observers = [];
    this.ds = options.ds || {};
    this.tag = options.tag || "select"; //"select>option, ul>li, div>span ...";
    this.init(options);
}
Control.isControl = function(o) {
    return o instanceof Control;
}
Control.prototype = {
    constructor: Control,
    init: function(options) {
        var self = this,
            elem = this.makeUI(options.value, this.ds);
        this.attachObserver(options.children);
        $(elem).on(options.event || 'change', function(event) {
            self.setValue($(elem).val(), false);
        });
    },
    /**
     * [makeUI description]
     * @param  {[type]} val  [description] data中的一个激活值
     * @param  {[type]} data [description]
     * @return {[type]}      [description]
     */
    makeUI: function(val, data) {
        data || (data = this.ds);
        //if(true){this.clearUI();}
        switch (this.tag) {
            case "ul":
            case "div":
                {
                    break;
                }
            default:
                {
                    this.elem.length = 0;
                    //this.remove();
                    this.elem.options.add(new Option("", ""));
                    for (var prop in data) {
                        this.elem.options.add(new Option(prop, prop));
                    }

                    val == undefined && (val = 0);
                    if (!isNaN(val)) { //val < this.elem.length
                        this.elem.selectedIndex = val;
                        val = this.elem.options[this.elem.selectedIndex].value;
                    }
                    break;
                }
        }
        this.setValue(val, true);
        return this.elem;
    },
    remove: function(index) {
        if (index) {
            this.elem.options[index] && this.elem.remove(index);
        } else {
            this.elem.length = 0;
            /*
                                while (this.elem.options.length) {
                                    this.elem.remove (0);
                                }*/
        }
    },
    saveVal: function(val) {
        this.oldValue = this.value;
        this.value = val;
    },
    resetVal: function() {
        this.oldValue = this.value = null;
        //this.update();
    },
    /**
     * [update description]被监视对象变化时
     * @param  {[type]} val  [description]通知的值
     * @param  {[type]} data [description]通知的的datasource
     * @return {[type]}      [description]
     */
    update: function(val, data) {
        this.ds = data || {};
        this.makeUI("", this.ds);
    },
    attachObserver: function(observers) {
        Object.prototype.toString.call(observers) == "[object Array]" || (observers = [observers]);
        for (var i = 0, len = observers.length; i < len; i++) {
            control = observers[i];
            if (control) {
                Control.isControl(control) || (control = new Control(observers[i], this.ds[this.value] || {}));
                this.observers.push(control);
            }
        }
    },
    notify: function(val) {
        for (var i = 0, len = this.observers.length; i < len; i++) {
            this.observers[i].update(val || this.value, this.ds[val], this);
        }
    },
    setValue: function(val, bNotify) {
        if (this.value != val) {
            this.saveVal(val);
            $(this.elem).val(val);
            bNotify = true;
        }
        bNotify && this.notify(val);
    },
    setDS: function(val) {
        this.ds = val;
    }
}

//处理结果事件处理
/*var heBD = document.getElementById('businessDep'),
    heBT = document.getElementById('businessType'), 
    oBD = {
        "酒店事业部": {"CPC": null,"OTATTS": null,"酒店团购": null,"一口价": null,"直销预付": null,"现付返佣": null,"夜销": null,"大鹏网": null},
        "机票事业部": {"国内机票": null,"国际机票": null},
        "旅游度假": {"度假TTS": null,"旅游团购": null},
        "门票": {"门票": null},
        "无线事业部": {"国内机票": null,"国际机票": null,"CPC": null,"OTATTS": null,"酒店团购": null,"一口价": null,"直销预付": null,"现付返佣": null,"夜销": null,"出租车接送机": null},
        "callcenter": {"火车票":null, "国内机票": null,"国际机票": null,"CPC": null,"OTATTS": null,"酒店团购": null,"一口价": null,"直销预付": null,"现付返佣": null,"夜销": null,"度假TTS": null,"旅游团购": null,"门票": null,"出租车接送机": null,"大鹏网": null}
    };
var root = new Control({
    elem: heBD,
    value: (data && data.busiUnit) || "",
    ds: oBD, //datasource
    children: [{
        elem: heBT,
        value: (data && data.busiType) || "",
        children: null
    }]
});*/

var TipWin = (function () {
    var sPopWin = '<div style="position: absolute;display:none; margin: 0px; padding: 0px; border: none; z-index: 1001;background-color: #fff;border: 1px solid rgb(229, 229, 229);">\
                    <div class="sDialog_wrapper" style="margin: 0px;">\
                        <div class="sDialog_title" style="background-color: #ECECEC;font-size: 14px;font-weight: bold; color: #666; height: 25px;">\
                            <span style="float: left;">提示</span>\
                             <span  name="close" style="cursor:pointer;float: right; color: black;">x</span>\
                             <span style="clear: both;"></span>\
                        </div>\
                        <div class="sDialog_content" style="text-align: center;  padding:20px 8px;">\
                        </div>\
                        <div class="sDialog_foot"  style="text-align:center;">\
                            <span  name="close" class="btn_normal" style="cursor:pointer;border: 1px solid;display:inline-block;padding: 0 12px; height: 24px; line-height: 24px;marign-left:10px;border-color: #c3c3c3; background: #ececec; color: #333;">关闭</span>\
                        </div>\
                     </div>\
                </div>', instance = null;

    return function (sContent, options) {
        if (instance) {
            return instance.show.apply(instance, arguments);
        }
        if (!(this instanceof arguments.callee)) {
            if (!instance) {
                instance = (new arguments.callee(sContent, options));
            }
            
            return instance;
        }else{
            var _this = this;
            this.$popWin = null;
            this.state = "close";
            this.target = options.target
            var type = options.type || "window";
            this.follow = options.follow || "target";

            this.show = function (cc, opts) {//data.thresholdDesc.replace(/\%s/
                if (!this.$popWin) {
                    var oPos =  this.target.offset(), left = oPos.left, top = oPos.top, follow = "target";
                    this.$popWin = $(sPopWin).appendTo(document.body);
                    this.$content = this.$popWin.find(".sDialog_content");
                    if (type === "tip") {
                        follow = this.follow.toLowerCase();
                        if(follow == "target"){
                            left = left +  $(opts.target || this.target).outerWidth();
                        }else{//居中

                        }
                        this.$content.siblings().css('display', 'none');
                    }else{
                        this.$content.siblings().css('display', '');
                    }
                    this.$popWin.css({
                        "zIndex": 9999,
                        'left': left+"px",
                        "top": top + "px"
                    }).find("[name=close]").click(function (evt) {
                        _this.hide();
                        evt.stopPropagation();
                    });
                }

                this.$content.html(cc || sContent);
                this.state = "open";
                this.$popWin.slideDown(); //.css("display", "block")
                return this;
            };
            this.hide = function () {
                this.state = "close";

                this.$popWin.css('display', 'none');
                if (this.onclose) {
                    this.onclose();
                };
                return this;
            };
            this.onclose = options.onclose;
            this.show(sContent, options);
        }

        return this;
    };
})();

var doc = document,
    client = doc.compatMode == 'BackCompat' ? doc.body : doc.documentElement,
    boundary = function() {
        var st = Math.max(doc.body.scrollTop, doc.documentElement.scrollTop),
            sl = Math.max(doc.body.scrollLeft, doc.documentElement.scrollLeft);
        return {
            L: sl,
            R: sl + client.clientWidth,
            T: st,
            B: st + client.clientHeight
        };
    },
    bind = function(obj, fn, arg1, arg2) {
        var args = [];
        if (arguments.length > 2) {
            args = Array.prototype.slice.call(arguments, 2);
        }

        return function() {
            return fn.apply(obj, args.concat(Array.prototype.slice.call(arguments)));
        };
    },
    throttle = function(fn, time, scope) {
        clearTimeout(fn.tId);
        fn.tId = setTimeout(function() {
            fn.apply(scope, Array.prototype.slice.call(arguments, 3));
        }, time || 100);
    },
    toString = Object.prototype.toString,
    extend = function(target, source) {
        var subVal, parentVal,
            bridge = function(subMethod, parentMethod) {
                return function() {
                    this.callSuper = parentMethod;
                    var res = subMethod.apply(this, arguments);
                    delete this.callSuper;
                    return res;
                }
            };

        for (var prop in source) {
            subVal = target[prop];
            parentVal = source[prop];
            if (typeof subVal == "function" && typeof parentVal == "function") {
                target[prop] = bridge(subVal, parentVal);
            } else {
                target[prop] = parentVal;
            }
        };

        return target;
    },
    toJSON = function(obj) {
        var sb = [],
            sType = toString.call(obj).slice(8, -1);
        sb.append = sb.push;

        switch (sType.toLowerCase()) {
            case 'object':
                {
                    sb.append("{");
                    var temp = [];
                    for (var key in obj) {
                        temp.push("\"" + key + "\":" + arguments.callee(obj[key]));
                    }
                    sb.append(temp.join(","));
                    sb.append("}");
                    break;
                }
            case "array":
                {
                    sb.append("[");
                    for (var i = 0; i < obj.length; i++) {
                        sb.append(arguments.callee(obj[i]));
                        if (i < obj.length - 1) {
                            sb.append(",");
                        }
                    }
                    sb.append("]");
                    break;
                }
            case 'null':
            case 'undefined':
                {
                    return "\"\"";
                }
            case 'string':
                {
                    return "\"" + obj.toString() + "\"";
                }
            case 'number':
            case 'boolean':
                {
                    return obj;
                }
            case 'function':
                {
                    return obj.toString();
                }
            case 'html':
                {
                    return obj.outHTML();
                }
            case 'xml':
                {
                    return XMLSerializer ? (new XMLSerializer()).serializeToString(oNode, "text/xml") : obj.xml;
                }
            default:
                {
                    break;
                }
        }
        return sb.join("");
    },
    $cls = {
        "create": function(obj, parent) {
            var constructor = function() {
                return this.init.apply(this, arguments);
            };

            constructor.prototype = typeof obj == "function" ? (obj() || {}) : obj;
            constructor.prototype.constructor = constructor;
            (toString.call(parent) == "[Object object]" || (typeof parent == "function" && (parent = parent.prototype))) && extend(constructor.prototype, parent);
            return constructor;
        }
    },
    evtEmitter = $cls.create({
        trigger: function(name, scope, args) {
            if (this.evt[name]) {
                var callback = this.evt[name];
                if (arguments.length >2) {
                    args = Array.prototype.slice.call(arguments, 2);
                }
                for (var i = 0, len = callback.length; i < len; i++) {
                    if (callback[i]) {
                       args ? callback[i].apply(scope || this, args) :  callback[i].apply(scope || this);
                    }
                }
            }
        },
        on: function(name, handle) {
            var callback = this.evt[name];
            callback || (callback = this.evt[name] = []);

            callback.push.apply(callback, handle instanceof Array ? handle : [handle]);
        },
        off: function(handle) {
            var callback = this.evt[name];
            if (callback) {
                var i = 0, len = callback.length;
                while(len--){
                    if (callback[len] == handle) {
                          callback.splice(len, 1);
                    }
                }
            }
        },
        init: function() {
            this.evt = {};
            return this;
        }
    }),

    autoComplete = $cls.create(function() {
        var $container = null,
            _filter = function(keyword) {
                var regex = RegExp("(" + keyword.replace(/([.?*+^$[\]\\(){}|-])/g, "\\$1") + ")", 'ig');
                return function(item) {
                    var exist = false,
                        val;
                    val = item.replace(regex, function(match) {
                        exist || (exist = true);
                        return "<em style='color: red;'>" + match + "</em>";
                    });

                    return exist && val;
                }
            };

        return {
            init: function($elem, options) {
                this.callSuper && this.callSuper();
                this.$elem = $elem;

                var that = this;
                if (this.$elem.length > 0) { // white-space: nowrap;
                    this.$container = $("<div  style='border: 1px solid #ccc;' class='ac' id=\"ac_" + this.$elem.attr("name") + "\"><ul style='list-type:none;' data-name='' data-code=''></ul></div>").css({
                        position: "absolute",
                        overflow: "auto",
                        border: "1px solid #ccc;",
                        backgroundColor: "White",
                        zIndex: 1000,
                        fontSize: "14px", //filter:alpha(opacity=0);
                        color: "#999999",
                        display: "none"
                    }).appendTo($(document.body));

                    //this.$container = $container;
                    this.emptyOption = true;
                    this.$ul = this.$container.find("ul").first();
                    this.searchRes = [];
                    this.keyword = "";
                    this.data = null;
                    this.datalist = [];
                    if (this.evt) {
                       options.onchange && this.on("change", options.onchange);
                       options.onload && this.on("load", options.onload);
                    }
                    options.data && this.loadData(options.data, options.keyword || "");
                    this.addHandle();
                    this.selectedItem = null;
                    //options.onload && this.trigger('load');
                }
            },
            setVal: function(val, text, $li) {
                var $elem = this.$elem, sval =$elem.attr("data-code"), stext = $elem.attr("data-name");
                if ( val != sval ||  text != stext) {
                    $elem.val(text).attr({
                        "data-code": val,
                        "data-name": text
                    });
                
                    //this.keyword = text;
                    $li !== false && this.trigger("change", null, this, $li);
                }
            },
            addHandle: function() {
                var _this = this, timer = null;

                this.$elem.attr('autocomplete', 'off') // disable IE's autocomplete feature
                    .keyup(function(event) {
                        switch (event.keyCode) {
                            case 13: // enter
                            case 16: // shift
                            case 17: // ctrl
                            case 37: // left
                            case 38: // up
                            case 39: // right
                            case 40: // down
                                break;
                            case 27: // esc
                                _this.hide(e);
                                break;
                            default:
                                if (timer) {
                                    window.clearTimeout(timer);
                                }

                                window.setTimeout(function() {

                                    _this.show(_this.$elem.val());
                                }, 300);
                        }
                    })
                    .blur(function(e) {
                        //_this.hide(e);
                    })
                    .keydown(function(event) {
                        switch (event.keyCode) {
                            case 38: // up
                                _this.selectedItem = _this.$ul.find("li.selected");
                                _this.move("up", _this.$ul.find("li"));
                                break;
                            case 40: // down
                                _this.selectedItem = _this.$ul.find("li.selected");
                                _this.move("down", _this.$ul.find("li"));
                                break;
                            case 13: // enter
                                //_this.setVal($(this).attr('value'), $(this).text());
                                // _this.hide();
                                break;
                        }
                    });

                $(document.body).on("click", function(e) {
                     if (e.target == _this.$elem[0]) {return;};
                    _this.hide(e);
                });
                this.$elem.on("click", function(evt) {
                    if (_this.$container.css("display") == "none") {
                        _this.show(_this.$elem.val());
                    }
                   // evt.stopPropagation();
                });
                //  this.$elem.on("focus", function (evt) {
                //    _this.show(_this.$elem.val());
                //    evt.stopPropagation();
                // });
                var clientY = -1, clientX = -1,
                    handle = function(evt) {
                        if (evt.type == "mousedown") {
                            var $li = $(this);
                                _this.setVal($li.attr('data-code'), $li.attr('data-name'), $li);
                        } else {
                            //鼠标悬浮在li上，键盘上下控制，当滚动时，判断坐标不变 还是会触发 bug
                            //console.log("clientY :" + clientY +" ; pageX: "+ clientX);
                            //console.log("鼠标当前 clientY :" + evt.clientY +" ; clientX: "+ evt.clientX);
                            if (evt.type == "mouseover") {
                                if (evt.clientY == clientY && evt.clientX == clientX) {
                                    return;
                                };
                                $(this).addClass("selected");
                                _this.selectedItem && _this.selectedItem.removeClass("selected");
                                _this.selectedItem = $(this);
                                clientY = evt.clientY;
                                clientX = evt.clientX;
                            } else if (evt.type == "mouseout") {
                                $(this).removeClass("selected");
                            }

                        }
                    };

                this.unMouseBind = function() {
                    this.$ul.off("mousedown mouseover mouseout", "li", handle);
                }
                this.onMouseBind = function() {
                    this.$ul.on("mousedown mouseover mouseout", "li", handle);
                }
                this.onMouseBind();
                this.bind = true;

                this.bindHandle = true;
            },
            clear: function(trigger) {
                this.$ul.empty();
                this.length = 0;
                if (this.emptyOption) {
                    this.$emptyLi = $('<li data-code="" data-name="" style="cursor: pointer; height: 12px;padding: 3px 0px;"></li>')
                        .appendTo(this.$ul).data("datasource", {name:"", code:"", children:[]});
                    this.length++;
                }
                this.$elem.attr({
                    "data-code": "",
                    "data-name": ""
                });
                //this.setVal("", "", trigger || false);
                this.data = null;
            },
            search:function(keyword, filter){
                if (this.keyword == keyword && this.searchRes.length >0 && !filter) {return};
                var item, filterRes, $ul = this.$ul, data = this.data, $li,
                    name, code, ret =[];
                
                this.clear();
                this.data = data;
                this.keyword = keyword || "";
                filter || (filter = _filter(this.keyword));
                for (var i = 0, len = data.length; i < len; i++) {
                    item = data[i];
                    filterRes = filter.call(this, item.name, item.code);
                    if (filterRes) {
                        this.length++;
                        $li = $('<li data-code="' + item.code + '" data-name="' + item.name + '" style="cursor: pointer; height: 16px;padding: 3px 0px;">' + filterRes + '</li>')
                            .appendTo($ul).data("datasource", item);
                        ret.push($li);
                    }
                }
                filter = null;
                this.trigger('load');
                
                var match  = false;//找到完全匹配项
                for(i = 0, len = ret.length; i < len; i++){
                    $li = ret[i];
                    if ($li.attr("data-name") == this.keyword) {
                         match  = true;
                         this.setVal($li.attr("data-code"), $li.attr("data-name"), $li);
                         break;
                    };
                }
                if(!match){
                    this.$elem.attr({
                        "data-code": "",
                        "data-name": ""
                    });

                    this.trigger('change', null, this, this.$emptyLi || ret);
                }
                this.searchRes = ret;
                return ret;
            },
            loadData: function(data, keyword, filter) {
                var item, filterRes, $ul = this.$ul,
                    name, code,ret =[];
                //this.getDatasource();
                if (this.data == data) {
                    this.search(keyword, filter);
                    return this;
                }
 
                data = toString.call(data) == "[object Array]" ? data : [data];
                if (keyword != null && $.trim(keyword) != "") {
                    this.data = data;
                    this.keyword = "";
                    this.search(keyword, filter);
                    return this;
                }

                this.clear();
                this.data= data; this.keyword = "";
                for (var i = 0, len = data.length; i < len; i++) {
                    item = data[i];
                    if (item) {
                        ret.push($('<li data-code="' + item.code + '" data-name="' + item.name + '" style="cursor: pointer; height: 16px;padding: 3px 0px;">' + item.name + '</li>')
                            .appendTo($ul).data("datasource", item));
                    }
                }
                this.length = this.length + len;
                this.searchRes = ret;

                this.trigger('load');

                this.$elem.attr({
                    "data-code": "",
                    "data-name": ""
                });

                this.trigger('change', null, this, this.$emptyLi);
                return this;
/*               if ($.trim(keyword) == "" || this.length == 1) {
                    this.setVal()
                }*/
            },
            getElemPos: function() {
                return this.elPos = this.$elem.offset();
            },
            move: function(dir, $lis) {
                if (!this.selectedItem) {
                    this.selectedItem = this.$ul.find("li").first();
                }

                if (!this.selectedItem) {
                    return;
                }
                var item = null;
                if (dir == "up") {
                    item = this.selectedItem.prev();
                    if (item.length == 0) {
                        item = $lis.last();
                    }
                } else {
                    item = this.selectedItem.next();
                    if (item.length == 0) {
                        item = $lis.first();
                    }
                }

                if (item != this.selectedItem) {
                    this.selectedItem.removeClass('selected');
                    this.selectedItem = item;
                    this.selectedItem.addClass('selected');
                    if (this.bind) {
                        //alert("unbind")
                        this.unMouseBind();
                        this.bind = false;
                    }

                    var iScrollTop = this.$container.scrollTop(),
                        topBoundary = parseInt(this.$container.css('paddingTop')), //div 的padding
                        bottomBoundary = topBoundary + this.$container.height();
                    itemTop = this.selectedItem.position().top;
                    if (itemTop < topBoundary) {
                        this.$container.scrollTop(this.$container.scrollTop() - topBoundary + itemTop);

                    } else if (itemTop + this.selectedItem.outerHeight() > bottomBoundary) {
                        this.$container.scrollTop(this.$container.scrollTop() + itemTop + this.selectedItem.outerHeight() - bottomBoundary);
                    }
                    var _this = this;
                    if (!this.bind) {
                        if (this.btimer) {
                            window.clearTimeout(this.btimer);
                        };
                        this.btimer = window.setTimeout(function() {
                            //if(!_this.bind){
                            //alert("bind")
                            _this.onMouseBind();
                            _this.bind = true;
                            //}

                        }, 300);
                    }


                }
            },
            show: function(keyword, filter) {
                this.search(keyword, filter); //this.filter(data, val);
                this.$container.css({
                    "top":"0px",
                    "left":"0px",
                    "width": "auto",
                    "height": "auto",
                    "display": "",
                    "visibility": "hidden"
                });
                var elPos = this.getElemPos(),
                    margin = 20,
                    t1 = elPos.top + this.$elem.outerHeight(),
                    w1 = elPos.left, //h1 = elPos.left + this.$elem.outerWidth(),  + this.$elem.outerWidth()
                    cw = this.$container.outerWidth(),
                    ch = this.$container.outerHeight(),
                    bd = boundary(),
                    top, left = w1,
                    height = ch,
                    width = cw;

                bd.B = bd.B - margin;
                bd.T = bd.T + margin;

                bd.L = bd.L + margin;
                bd.R = bd.R - margin;

                //ht上 下hb 两个空白高度
                var ht = elPos.top - bd.T,
                    hb = bd.B - t1;
                if (ch < hb || ht < hb) {
                    top = t1;
                    if (ch > hb) {
                        height = hb;
                    }
                } else { // hb < ch   hb < ht
                    if (ch > ht) {
                        height = ht;
                    }

                    top = elPos.top - height;
                }

                if(cw < bd.R - bd.L){
                     width = cw;
                     if (w1 + cw < bd.R) {
                        left = w1;
                     }else{
                        left = w1 - (w1 + cw - bd.R);
                     }
                }else{
                    width = bd.R - bd.L;
                    left = 0;
                }

                if (height < ch) { //加上滚动条宽
                    width += 20;
                    if (width > bd.R - bd.L) {
                        width = bd.R - bd.L;
                    }else if(left+width > bd.R && left > 20){
                        left -=20;
                    }
                };
                this.$container.css({
                    top: top+ "px",
                    left: left+ "px",
                    height: height + "px",
                    width: width + "px",
                    minWidth: this.$elem.outerWidth() + "px",
                    overflow: "auto",
                    //display: "",
                    visibility: "visible"
                });
            },
            hide: function() {
                if (this.$container.css('display') != "none") {
                    this.$container.hide();
                }
            }
        };
    }, evtEmitter);
var esc = function (s) {
        if (s != null) {
            return s.replace("<", '&lt;')
                .replace(">", '&gt;')
                .replace("&", '&amp;');
        }else{
            return s;
        }
  }
window.toJSON = toJSON;
var CompensateInfo = function(data, type, opts) {
    if (this.constructor != arguments.callee) {
        return new arguments.callee(data, type, opts);
    };
    if ($.type(data) == "string") {
        data = $.parseJSON(data);
    }
    var prefix = "cpi_",
        uniqueId = 0;
    this.getUniqueId = function() {
        return prefix + (uniqueId++);
    }
    this.init(data, type, opts);
};

//flowBusinessFieldExtendId
CompensateInfo.prototype = [];
CompensateInfo.prototype.constructor = CompensateInfo;
extend(CompensateInfo.prototype, {
    count: 0,
    states: {}, //应该存对象内
    getStateManager: function(opts) {
        var timer = null,
            state = function(data, context) {
            var template = { //yyyy-MM-dd HH:mm:ss
                colHead: [{
                    width: "25%"
                }, {
                    width: "25%"
                }, {
                    width: "50%"
                }],
                "editable": function(data) {//                        + '<div class="tr"><label for="" class="title">金额 </label><input class="amount" type="text" name="amount"  maxlength="10" value="' + data.amount + '" /></div>'
                    return [//<input class="radio" type="radio" name="accountType_' + data.uid + '" checked />对私<input type="radio" class="radio" name="accountType_' + data.uid + '" />对公</div>
                        '<div class="tr"><label for="" class="title">赔付日期 </label><input name ="payTime" value="' + data.payTime + '" name="userfield29" readonly class="payTime" style="border: none;" /></div>' 
                        + '<div class="tr"><label for="" class="title">收款人姓名 </label><input style="width: 60px;" type="text" name="receiver"  value="' + data.receiver + '"/><select  class="receiverType" name="receiverType" data-code="' + data.receiverType + '" data-name="' + data.receiverType + '"></select></div>' 
                        + '<div class="tr"><label for="" class="title">卡号 </label><input type="text" class="bankinfo" name="receiverAccount"  value="' + data.receiverAccount + '"/></div>' 
                        + '<div class="tr"><label class="title">账户类型</label><div style="display:inline-block;" name="accountType" data-code="' + data.accountType + '" data-name="' + data.accountTypeName + '"></div></div>'
                        + '<div class="tr"><label class="title">责任归属 </label><select class="" name="responser"  data-code="' + data.responser + '"  data-name="' + data.responser + '"></select></div>',
                        
                        '<div class="tr"><label class="title">赔付原因 </label><select class="payReason" name="payReason"  data-code="' + data.payReason + '"  data-name="' + data.payReason + '"></select></div>' 
                        + '<div class="tr"><label class="title">电话号码 </label><input type="text" name="contactWay"  maxlength="20" value="' + data.contactWay + '" /></div>' 
                        + '<div class="tr"><label class="title">银行名称 </label><input type="text" class="bankinfo"  name="bank" data-name="' + data.bankName + '" data-code="' + data.bankCode + '"/></div>'
                        + '<div class="tr"><label class="title">差价金额 </label><input type="text" class=""  name="userfield0" value="' + data.userfield0 + '" /></div>'
                        + '<div class="tr"><label class="title">业务部门 </label><select class="" name="busiUnit"  data-code="' + data.busiUnit + '"  data-name="' + data.busiUnit + '"></select></div>',
                        
                        '<div class="tr"><label class="title">详细事由 </label><textarea class="matter" name="matter" maxlength="100" rows="5" cols="" value="' + data.matter + '">' + data.matter + '</textarea></div>' 
                        + '<div class="tr tbi">\
                            <label class="title">支行信息 </label><input type="text" class="bankProvince" name="bankProvince"  data-code="' + data.bankProvince + '"  data-name="' + data.bankProvince + '" data-op="selProvince" /> \
                            省 <input type="text" class="bankCity"  style="width: 100px;" name="bankCity"  data-code="' + data.bankCity + '"  data-name="' + data.bankCity + '" data-op="selCity" /> \
                            市  <input type="text" class="bankinfo" style="width: 165px;" name="branchBank"  maxlength="20" data-name="' + data.accountbranch + '" data-code="' + data.branchBankCode + '" value="' + data.accountbranch + '" /></div>' 
                        + '<div class="tr ci">\
                            <label class="title">赔计划金额 </label><input type="text" style="width: 100px;"   class="" name="userfield1"  value ="' + data.userfield1 + '" /> \
                            <label for="" class="title">其它金额 </label><input type="text" class=""  style="width: 100px;" name="userfield2"  value ="' + data.userfield2 + '" /> \
                            <label for="" class="title">总金额 </label><input class="amount" type="text" style="width: 70px;"  name="amount"  maxlength="10" value="' + data.amount + '" /></div>' 
                        + '<div class="tr">\
                            <label class="title">业务类型 </label><select class="" style="width: 102px;" name="busiType"  data-code="' + data.busiType + '"  data-name="' + data.busiType + '"></select> \
                            <label class="title">提交人 </label><input type="text" style="width: 60px;" name="committer" disabled title="' + data.committer + '" value="' + data.committer + '" /> \
                            <label style="margin-left:0px;"class="title">打款状态 </label><span class="payStatus" style="width: 70px;" name="payStatus" data-value="" data-text="" value="' + data.payStatus + '">' + data.payStatusText + '</span></div>'];
                },
                "view": function(data) { //readonly
                    return [
                        '<div class="tr"><label for="" class="title">赔付日期 </label><span name ="payTime">' + data.payTime + '</span></div>' 
                        + '<div class="tr"><label for="" class="title">收款人姓名 </label><span style="width: 60px;" name="receiver">' + data.receiver + '</span><span class="receiverType" name="receiverType">' + data.receiverType + '</span></div>' 
                        + '<div class="tr"><label for="" class="title">卡号 </label><span class="bankinfo" name="receiverAccount">' + data.receiverAccount + '</span></div>' 
                        + '<div class="tr"><label class="title">账户类型</label><span class="radio" name="accountType">' + data.accountTypeName + '</span></div>'
                        + '<div class="tr"><label class="title">责任归属</label><span class="" name="responser">' + data.responser + '</span></div>',

                        '<div class="tr"><label class="title">赔付原因 </label><span class="payReason" name="payReason">' + data.payReason + '</span></div>' 
                        + '<div class="tr"><label class="title">电话号码 </label><span type="text" name="contactWay">' + data.contactWay + '</span></div>' 
                        + '<div class="tr"><label class="title">银行名称 </label><span class="bankinfo"  name="bank" data-name="' + data.bankName + '" data-code="' + data.bankCode + '">' + data.bankName + '</span></div>' 
                        + '<div class="tr"><label class="title">差价金额 </label><span class=""  name="userfield0">' + data.userfield0 + '</span></div>' 
                        + '<div class="tr"><label class="title">业务部门 </label><span class=""  name="busiUnit">' + data.busiUnit + '</span></div>',


                        '<div class="tr"><label class="title">详细事由 </label><span class="matter" name="matter">' + esc(data.matter) + '</span></div>' 
                        + '<div class="tr view-trunkbank tbi">\
                            <label class="title">支行信息 </label><span class="bankProvince" name="bankProvince" data-name="' + data.bankProvince + '" data-code="' + data.bankProvince + '">' + data.bankProvince + '</span> \
                            <span class="bankCity" name="bankCity" data-name="' + data.bankCity + '" data-code="' + data.bankCity + '">' + data.bankCity + '</span>  <span class="bankinfo"  name="branchBank" data-name="' + data.accountbranch + '" data-code="' + data.branchBankCode + '">' + data.accountbranch + '</span></div>' 
                        + '<div class="tr">\
                            <label class="title">赔计划金额 </label><span class="" style="width: 100px;" name="userfield1">' + data.userfield1 + '</span> \
                            <label for="" class="title">其它金额 </label><span class=""  name="userfield2" style="width: 100px;">' + data.userfield2 + '</span> \
                            <label for="" class="title">总金额 </label><span class=""  name="amount" style="width: 70px;">' + data.amount + '</span></div>'    
                        + '<div class="tr">\
                            <label class="title">业务类型 </label><span class="" style="width: 102px;" name="busiType">' + data.busiType + '</span> \
                            <label class="title">提交人 </label><span name="committer" style="width: 60px;" title="' + data.committer + '">' + data.committer + '</span> \
                            <label style="margin-left:0px;"class="title">打款状态 </label> <span  class="payStatus" style="width: 70px;" name="payStatus">' + data.payStatusText + '</span></div>'];
                }
            };
            //this.payStatusObj.text
            return ({
                init: function(data, context) {
                    this.context = context || this;
                    this.isCompensate = this.context.flowConfigName === "机票";
                    data && this.setOptions(data);
                    return this;
                },
                setOptions: function(data) {
                    this.data = {
                        "isDelete": "false",
                        "contactWay": "",
                        "matter": "",
                        "bankCity": "",
                        "flowBusinessFieldExtendId": "",
                        "accountbranch": "", //支行名
                        "branchBankCode": "", //支行代码
                        "bankCode": "", //银行code 
                        "bankName": "", //银行name 
                        "flowNo": "",
                        "committer": "",
                        "payTime": "",
                        "bankProvince": "",
                        "amount": "0.00",
                        "orderNo": "",
                        "payStatus": "",
                        "payReason": "",
                        "receiverAccount": "", //银行卡号
                        "receiverType": "",
                        "receiver": "",
                        "accountType": "0",
                        "accountTypeName":"对私",
                        "receiverType": "", 
                        "responser": "",//责任归属
                        "userfield0": "0.00",//差价金额
                        "userfield1": "0.00",//赔计划金额
                        "userfield2":"0.00",//其它金额
                        "busiUnit": "",//业务部门
                        "busiType":"",//业务类型
                        "uid": null
                    };

                    for(var prop in data){
                        if (data[prop] == null) {
                            data[prop] = "";
                        }
                    }
                    extend(this.data, data || {});
                    this.setPayStatus(this.data.payStatus);
                    this.setAccountType(this.data.accountType) || ( this.data.accountType = "0");
                    
                    var _this  = this;
                    $.each(["userfield0", "userfield1", "userfield2"], function(index, val) {
                          _this.data[val] = CompensateInfo.formateMoney( _this.data[val] );
                    });

                    this.data.amount = this.formateMoney(this.data.amount);
                },
                wrapTr: function(content, nowrap) {
                    var data = this.data,
                        colHead = template["colHead"],
                        len = colHead.length,
                        id = data.flowBusinessFieldExtendId,
                        nowrap = nowrap === false ? "" : " nowrap";

                    return $('<tr style="border-bottom: 1px solid #d7d7d7;;" fe_unid="' + data.uid + '" flowBusinessFieldExtendId="' + id + '" data-flowNo="' + data.flowNo + '">' + "<td" + nowrap + ">" + content.join("</td><td" + nowrap + ">") + "</td>" + '</tr>')
                        .find('>td')
                        .each(function(index, val) {
                            $(val).css(colHead[index]);
                        }).end();
                },
                fillTemplateData: function(type, data) {
                    var templateFn = template[type];
                    if (templateFn) {
                        if (data.uid == null) {
                            data.uid = this.context.unid;
                        }
                        return templateFn(data);
                    }
                    return "";
                },
                loadDatasource: function() {
                    var ds = opts.dsPayReason, _this = this,
                        $tr = this.$tr, uid =$tr.attr('fe_unid'),
                        cds = opts.controlDS,
                        cdsItem, _this = this,
                        childPropMap = { //每个子属性
                            "bankProvince": "cities"
                        }, //"_children_"
                        $bankProvince = this.$bankProvince = $tr.find("[name = bankProvince]"),
                        $bankCity = this.$bankCity = $tr.find("[name = bankCity]"),
                        $bank =this.$bank = $tr.find("[name =bank]"),
                        $branchBank = this.$branchBank = $tr.find("[name=branchBank]"),
                        propName, init = true,
                        keyName, $tbi = $tr.find(".tbi"),
                        load = function(name, data, cdsItem, from) {
                            var $elem = typeof name == "string" ? $tr.find("[name=" + name + "]") : name,
                                loadChild, $option;
                            if ($elem.length == 0) {
                                return;
                            };
                            var value = $elem.attr("data-name") || "", code = $elem.attr("data-code") || "";
                            $elem[0].length = 0;
                            //$("<option value=''></options>").appendTo($elem);
                            $elem.data('data-loaded', false);
                            var params = {};
                            if (cdsItem.parent && cdsItem.parent.length > 0 && from != "ajax") {
                                for (var j = 0; j < cdsItem.parent.length; j++) {
                                    if (!$tr.find("[name=" + cdsItem.parent[j] + "]").data('data-loaded')) {
                                        if ($elem.data("ac")) {
                                            var act = $elem.data("ac");
                                            act.loadData([], "");
                                        }
                                        return;
                                    }
                                }
                                //$elem.data("data-prepare", true);
                            }

                            if ($elem.attr('name') == "branchBank" && from != "ajax") {
                                params = { //deepon依赖项的索引 默认取值属性
                                    bankCode: $bank.attr("data-code"),
                                    province: $bankProvince.attr("data-code"),
                                    city: $bankCity.attr("data-code")
                                };

                                for (keyName in params) {
                                    if (params[keyName] == "" || params[keyName] == null) {
                                        if ($elem.data("ac")) {
                                            var act = $elem.data("ac");
                                            act.loadData([], "");
                                        }
                                        return;
                                    }
                                }
                                data = null;
                                //return;
                            }
                            if (data) {                  
                                switch (cdsItem.ctype) {
                                    case "radiolist":
                                        {
                                             //空白项
                                            $.each(data, function(key, val) { //<options key - code>value - name</option>
                                                var item = null,  id="",
                                                    keyIndex = key,
                                                    $option;
                                                if (typeof val == "object") {
                                                    item = val; key = val.code;  val = val.name;
                                                } else {
                                                    key = val;
                                                };

                                                //if (selected) { existSel = true;};
                                                id = $elem.attr('name') + "_"+ uid+ "_"+ keyIndex;
                                                $option = $("<input class='radio' type='radio' data-name='"+val+"' data-code='"+key+"' id='"+ id + "' name='accountType_"+uid+"' value='"+ val+ "'/><label for='"+ id + "'>" + val+"</label>")
                                                    .appendTo($elem).first().data("datasource", item);

                                                if (keyIndex == 0 || val == value) {
                                                    $option.prop('checked', true);
                                                    $elem.attr("data-name", val).attr("data-code", key);
                                                }
                                            });
                                            if (!$elem.data("bingdChange")) {
                                                $elem.data("bingdChange", true);
                                                $elem.on('click', function(event) {
                                                    //event.preventDefault();
                                                    var $option = $elem.find("input:checked"),
                                                        data = $option.data("datasource"),
                                                        $child;
                                                    $elem.attr({
                                                        "data-name": $option.attr('data-name'),
                                                        "data-code": $option.attr('data-code')
                                                    });
                                                    if (!cdsItem.child) {
                                                        return;
                                                    };
                                                    for (var i = 0, len = cdsItem.child.length; i < len; i++) {
                                                        $child = $tr.find("[name=" + cdsItem.child[i] + "]");
                                                        //$child.attr("data-name", "").attr("data-code", "").val("");
                                                        //$child.data('data-loaded', false);
                                                        load($child, data[childPropMap[$(this).attr('name')] || "children"], cds[cdsItem.child[i]], 1);
                                                    }
                                                });
                                            }
                                            $elem.data('data-loaded', true).trigger('change');
                                            break;
                                        }
                                    case "checklist":
                                        {
                                            break;
                                        }
                                    case "ac":
                                        {
                                            var tempac = $elem.data("ac");
                                            if (!tempac) {
                                                tempac = new autoComplete($elem, {
                                                    data: data,
                                                    keyword: value,
                                                    onchange:function(evt,  $option) {
                                                                //event.preventDefault();
                                                        if(cdsItem.other && _this.superBank(cdsItem.other, $elem.attr('data-name'))){return;}

                                                        if (!cdsItem.child) {
                                                            return;
                                                        }
                                                
                                                        var data = $option.data("datasource"), $child;
                                                        for (var i = 0, len = cdsItem.child.length; i < len; i++) {
                                                            $child = $tr.find("[name=" + cdsItem.child[i] + "]");
                                                            if (data.code == "" && data.name == "") {
                                                                $child.val("").attr({
                                                                    "data-code": "",
                                                                    "data-name": ""
                                                                });
                                                            }
                                                            //$child.attr("data-name", "").attr("data-code", "").val("");
                                                            //$child.data('data-loaded', false);
                                                            load($child, data[ childPropMap[$elem.attr('name')] ] || data["children"], cds[cdsItem.child[i]], 1);
                                                        }
                                                    },
                                                    onload:function(){
                                                         $elem.data('data-loaded', true);
                                                    }
                                                });
                                                $elem.data("ac", tempac);
                                            } else {
                                                tempac.loadData(data, value);
                                                //tempac.trigger('change')(code, value, tempac.$emptyLi);
                                            }
                                            break;
                                        }
                                    default:
                                        {
                                            //空白项
                                           $option = $("<option data-name='' data-code='' selected></option>")
                                                .attr("value", "").text("")
                                                .appendTo($elem);

                                            if (cdsItem.child) {
                                                $option.data("datasource", {
                                                    name: "",
                                                    code: "",
                                                    "children":[]
                                                });
                                            };
                                            $.each(data, function(key, val) { //<options key - code>value - name</option>
                                                var item = null,
                                                    keyIndex = key,
                                                    $option;
                                                if (typeof val == "object") {
                                                    item = val; key = val.code;  val = val.name;
                                                } else {
                                                    key = val;
                                                };

                                                //if (selected) { existSel = true;};
                                                $option = $("<option></option>")
                                                    .attr("value", key).text(val)
                                                    .data("datasource", item)
                                                    .appendTo($elem);

                                                if (val == value) {
                                                    $option.attr('selected', true);
                                                    $elem.attr("data-name", val).attr("data-code", key);
                                                }
                                            });
                                            if (!$elem.data("bingdChange")) {
                                                $elem.data("bingdChange", true);
                                                $elem.on('change', function(event) {
                                                    //event.preventDefault();
                                                    var $option = $elem.find("option:selected"),
                                                        data = $option.data("datasource"),
                                                        $child;
                                                    $elem.attr({
                                                        "data-name": $option.text(),
                                                        "data-code": $option.val()
                                                    });
                                                    if (!cdsItem.child) {
                                                        return;
                                                    };
                                                    for (var i = 0, len = cdsItem.child.length; i < len; i++) {
                                                        $child = $tr.find("[name=" + cdsItem.child[i] + "]");
                                                         /*if (data.code == "" && data.name == "") {
                                                            $child.attr({
                                                                "data-code": "",
                                                                "data-name": ""
                                                            });
                                                         }*/
                                                        //$child.attr("data-name", "").attr("data-code", "").val("");
                                                        //$child.data('data-loaded', false);
                                                        load($child, data[childPropMap[$(this).attr('name')] || "children"], cds[cdsItem.child[i]], 1);
                                                    }
                                                });
                                            }
                                            $elem.data('data-loaded', true).trigger('change');
                                            break;
                                        }
                                }
                            } else { //没数据 异步取数据后再加载
                                if ($elem.attr('name') == "bankCity"){
                                     return;
                                }
                                $.ajax({
                                    url: framework.addUser(cdsItem.url),
                                    dataType: cdsItem.dataType || "json",
                                    data: params || cdsItem.params || {},
                                    success: function(d) {
                                        try {
                                            if (d.ret) {
                                                cdsItem.data = d.data;
                                                load($elem, cdsItem.data, cdsItem, "ajax");
                                            } else {
                                                flowUtil.log(d.errmsg);
                                            }
                                        } catch (e) {
                                            flowUtil.log('赔付数据源 : ' + e);
                                        }
                                    }
                                });
                            }
                        },
                        indexOf = function(container, item) {
                            for (var i = 0, len = container.length; i < container.length; i++) {
                                if (container[i] == item) {
                                    return i;
                                }
                            }
                            return -1;
                        },
                        buildCascadeRelation = function(cdsItem, prop) {
                            var pcdsItem, ccdsItem, container, k, len,
                                add = function(item, name, rname) { //关系项属性名
                                    var rItem
                                    if (item[name]) {
                                        container = $.isArray(item[name]) ? item[name] : (item[name] = [item[name]]);
                                        for (k = 0, len = container.length; k < len; k++) {
                                            rItem = cds[container[k]];
                                            if (rItem) {
                                                if (rItem[rname] == null) {
                                                    rItem[rname] = [];
                                                };
                                                $.isArray(rItem[rname]) || (rItem[rname] = [rItem[rname]]);

                                                if (indexOf(rItem[rname], prop) == -1) {
                                                    rItem[rname].push(prop);
                                                }
                                            }
                                        }
                                    }
                                };
                            //cdsItem["parent"].child 关联 自己
                            add(cdsItem, "parent", "child");
                            //cdsItem["child"].parent 关联 自己
                            add(cdsItem, "child", "parent");
                        };

                    //补全父子关系 if (!cdsItem.handle) {};
                    for (var prop in cds) {
                        cdsItem = cds[prop];
                        this["$" + prop] = $tr.find("[name=" + prop + "]");
                        if (!cdsItem["_requestQueue"]) {
                            cdsItem["_requestQueue"] = []
                        };
                        buildCascadeRelation(cdsItem, prop);
                    }

                    //从根开始加载数据
                    for (var prop in cds) {
                        cdsItem = cds[prop];
                        if (!cdsItem.parent || !cdsItem.parent.length) {
                            load(prop, cdsItem["data"], cdsItem); //$tr.find("[name="+prop+"]")
                        }
                    }

                    //该行加载完还原状态 
                    for (var prop in cds) {
                        cds[prop].handle = false;
                    }
                },
                superBank:function(data, value){
                    if(typeof data == "string"){
                        value = data;
                        data =  opts.controlDS.bank.other;
                    }

                    var $tbi = this.$tr.find(".tbi");
                    if (data && data[value]) {
                        $tbi.css('visibility', 'hidden');
                        return true;
                    }else if($tbi.css('visibility') == 'hidden'){
                         $tbi.css('visibility', '');
                    }
                     return false;
                },
                onAmount:function(){
                    this.context.onAmount && this.context.onAmount();
                },
                setAmount:function(val, update){
                    this.$amount || ( this.$amount = this.$tr.find('[name=amount]') );
                    val = this.formateMoney(val);
                    if(update || this.$amount.val() != val){
                        this.$amount.val(val) ;
                        this.onAmount();
                    }

                    return val;
                },
                addHandle: function() {
                    var data = this.data, $tr = this.$tr, $clist = null,
                        _this = this;

                    this.$tr.find("input[name][type=text], textarea[name]").each(function(index, elem) {
                        $(elem).on('change', function(event) {
                            var val = $(this).val();
                            if (_this.isCompensate) {
                                switch(this.name){
                                    case "userfield0":
                                    case "userfield1":
                                    case "userfield2":{
                                        this.value = val = _this.formateMoney(val);
                                        var sum = 0;
                                        ( $clist || ($clist = $tr.find("[name=userfield0],[name=userfield1],[name=userfield2]")) ).each(function(index, el) {
                                             var digtal = parseFloat(el.value.replace(/(\s*\,\s*)/g, "") || 0) ;
                                            if (!isNaN(digtal)) {
                                                sum +=Math.round( digtal*100); //(item.nodeName.toLowerCase() == "span" ? $(item).text() : $(item).val()) || 0
                                            }
                                        }); 

                                       _this.setAmount( (sum/100).toFixed(2), true );
                                        break;
                                    }
                                }
                            }

                            if (this.name == "amount") {
                                val = _this.setAmount(val, true);
                            }
                            data[this.name] = val; 
                        });
                    }).filter("[name=userfield0],[name=userfield1],[name=userfield2]").on("focus", function(){
                        if($(this).val() == "0.00"){
                            $(this).val("");
                        }
                    }).on('blur',  function(event) {
                        event.preventDefault();
                        if ($.trim($(this).val()) == "") {
                            $(this).val("0.00");
                        }
                    });;
                },
                formateMoney: function(amount) { //
                    amount != undefined || (amount = this.data.amount);
                    return CompensateInfo.formateMoney(amount);
                },
                collect: function() {
                    return this.data;
                },
                valid:function(){
                    return true;
                },
                setPayStatus: function(payStatus) {
                    this.payStatusObj = this.getItemByCSDic(payStatus);
                    this.data.payStatusText = this.payStatusObj.ctext;
                    return this.payStatusObj;
                },
                setAccountType: function(accountType) {
                    var atdata = opts.controlDS.accountType.data,i= 0,len = atdata.length;
                    for(;i<len;i++){
                        if(atdata[i] && atdata[i].code == accountType){
                            this.data.accountTypeName = atdata[i].name;
                            return atdata[i];
                        }
                    }

                    return null;
                },
                getValByCSDic: function(key) { //根据key属性名 去控制显示状态的字典表查 属性值
                    var state = "",
                        data = this.data,
                        item = this.payStatusObj || this.setPayStatus(data.payStatus);
                    if (item) {
                        state = item[key];
                    }

                    return state;
                },
                getItemByCSDic: function(text, callback) {
                    var prop, obj, controlState = opts.controlState;
                    for (prop in controlState) {
                        obj = controlState[prop];
                        if (prop == text || obj.etext == text || obj.ctext == text) {
                            if (callback && callback(prop, obj) == true) {
                                return obj
                            }
                            return obj;
                        }
                    }
                    return null;
                },
                updatePayStatus: function(sStatus) {
                    var _this = this,
                        $payStatus = this.$tr.find("[name=payStatus]"),
                        csstate;

                    this.getItemByCSDic(sStatus.toLowerCase(), function(name, obj) {
                        csstate = obj;
                        //_this.setPayStatus()
                        _this.data.payStatus = sStatus.toLowerCase();
                        _this.data.payStatusText = obj.ctext;
                        _this.payStatusObj = obj;
                        $payStatus.text(obj.ctext).attr("value", _this.data.payStatus);
                        return true;
                    });
                    return csstate;
                },
                make: function(sOper, state) {
                    var aHtml = this.fillTemplateData(state || this.getValByCSDic("state"), this.data),
                        $tr = $(this.wrapTr(aHtml, state != "process" ? false : true));

                    sOper != null && $tr.find('td:last>div:last').append(sOper);
                    this.$tr = $tr;
                    if (this.data.bankName) {
                        this.superBank(opts.controlDS["bank"].other, this.data.bankName);
                    }
                    if (!this.isCompensate) {
                        $.each(["userfield1", "userfield2"], function(index, val) {
                             $tr.find('[name='+val+']').css('visibility', 'hidden').prev().css('visibility', 'hidden');
                        });

                        var $amount = $tr.find('[name=amount]'), $u0 = $tr.find('[name=userfield0]');
                         $amount.css('width', '').add( $amount.prev() ).appendTo( $u0.parent() );
                        $u0.add($u0.prev()).css('display', 'none');
                    }else{
                        $tr.find('[name=amount]').css('borderWidth', '0px').prop('readonly', true);
                    }

                    return $tr;
                },
                dispose: function() {
                    var prop, data = this.data;
                    for (prop in data) {
                        if (/^\$.+/.test(prop)) {
                            data[prop] = null;
                        }
                    }
                },
                toString: function() {
                    var data = this.data,
                        res = [];
                    for (var prop in data) {
                        res.push("\"" + prop + "\":\"" + data[prop] + "\"");
                    }
                    return res.join(",");
                }
            }).init(data, context);
        };
        return {
            "process": $cls.create(function() {
                var obj = null;

                return extend({
                    make: function(data) { //处理页 根据赔付状态信息表取串
                        this.callSuper('<button class="coper" data-op="del" ' + this.getValByCSDic("del") + '  value="删除">删除</button>');
                        var $tr = this.$tr, _this = this;
                        this.$op = this.$tr.find("button[data-op=del]");
                        this.$bankProvince = $tr.find("[name = bankProvince]");
                        this.$bankCity = $tr.find("[name = bankCity]");
                        this.$bank = $tr.find("[name =bank]");
                        this.$branchBank = $tr.find("[name=branchBank]");

                        if (this.getValByCSDic("state") == "editable") {
                            this.loadDatasource();
                            /*  this.$tr.find("[name=bankProvince], [name=bankCity]").hover(function() {
                                $(this).addClass('bank-procity');
                            }, function() {
                                $(this).removeClass('bank-procity');
                            });*/
                        };
                        this.addHandle();
                        if (this.isCompensate) {
                             if(timer){ 
                                window.clearTimeout(timer);
                                timer = null;
                             }
                             timer = window.setTimeout(function(){
                                _this.onAmount();//触发amount事件  
                                timer = null;
                             }, 0);
                             
                        }
                        return this;
                    },
                    init: function(data, context) {
                        this.type = "process";
                        this.callSuper(data, context);
                        return this.make(this.data);
                    },
                    add: function() {
                        this.make();
                    },
                    valid:function(){
                        var prop, reg, val, $tr = this.$tr,
                            rule = opts.validRule,
                            superBank = opts.controlDS.bank.other, data = this.data,
                            rValid = {
                                "noEmpty": /.+/,
                                "phone": /\d{11}/,
                                "length":"length"
                            };//new RegExp("\\.{"+min +","+ max+"}")

                        if (data.isDelete == "true" || data.payStatus == "1" || data.payStatus == "历史赔付" || data.payStatus == 3 || data.payStatus == 5) {//删除的 历史赔付都不校验
                            return true;
                        }; 
                        if (!superBank[data.bankName]) {
                            rule["bankCity"] =  {text:"城市", valid:"noEmpty"};
                            rule["bankProvince"] =  {text:"省份", valid:"noEmpty"};
                            if (this.$branchBank.data("ac") && this.$branchBank.data("ac").$ul.text() != "") {
                                rule["accountbranch"]=  {text:"支行", valid:"noEmpty"};
                            }else{
                               "accountbranch" in rule  &&  (delete rule["accountbranch"]);
                            }
                        }else if(rule["bankCity"]){
                            delete rule["bankCity"];
                            delete rule["bankProvince"];
                            delete rule["accountbranch"];
                        }

                        if (this.isCompensate) {
                          /*rule["userfield0"]=  {text:"差价金额", valid:"noEmpty"};
                            rule["userfield1"]=  {text:"赔计划金额", valid:"noEmpty"};
                            rule["userfield2"]=  {text:"其它金额", valid:"noEmpty"};*/
                        }
                        heMapping = {
                            "accountbranch" : "branchBank"
                        };
                        for (var prop in data) {
                            val = data[prop], vrule = rule[prop] || rule.__global__ || null;
                            if (vrule) {
                                reg = rValid[vrule.valid];
                                if (!reg) {continue;};
                                if (reg == "length") {
                                    var min = vrule.inbound[0] || 0,
                                        max = vrule.inbound[1] || Number.MAX_VALUE;

                                    if (val.length < min || val.length > max) {
                                        alert("赔付信息*： "+ vrule.text + " " + (vrule.emsg || rule.__global__.emsg || ""));
                                        $tr.find("[name=" + (heMapping[prop] || prop) + "]").focus();
                                        return false;
                                    };
                                    continue;
                                } 

                                if (!reg.test(val)) {
                                    alert(vrule.text + " " + (vrule.emsg || rule.__global__.emsg || ""));
                                    $tr.find("[name=" + (heMapping[prop] || prop) + "]").focus();
                                    return false;
                                };
                            }
                        }

                        return true;
                    },
                    collect: function(bValid) {
                        var $Control  = this.$tr.find("[name]:not([type=radio])"),
                            _this = this,
                            data = this.data;
                        if (data.payStatus == 1 || data.payStatus == 3 || data.payStatus == 5) {
                            return data;
                        }
                        $Control.each(function(index, elem) {
                            var name = elem.name || elem.getAttribute("name");
                            if (elem.nodeName.toLowerCase() == "span" || elem.nodeName.toLowerCase() == "div") {
                                value = $.trim($(elem).text());
                            }else{
                                value =  $.trim($(elem).val());
                            }
                            switch (name) {
                                case "accountType":{
                                       data.accountType = $(elem).attr('data-code');
                                       data.accountTypeName = $(elem).attr('data-name');
                                     return;
                                }
                                case "bank":
                                    {
                                        data.bankName = $(elem).attr('data-name');
                                        data.bankCode = $(elem).attr('data-code');
                                        return;
                                    }
                                case "branchBank":
                                    {
                                        if ($.trim($(elem).val()) != $(elem).attr('data-name')) {
                                            data.accountbranch = "";
                                            data.branchBankCode = "";
                                           return;
                                        }

                                        data.accountbranch = $(elem).attr('data-name');
                                        data.branchBankCode = $(elem).attr('data-code');
                                        return;
                                    }
                                case "bankProvince":
                                    {
                                        data.bankProvince = $(elem).attr('data-name');
                                        data.bankProvinceCode = $(elem).attr('data-code');
                                        return;
                                    }
                                case "bankCity":
                                    {
                                        data.bankCity = $(elem).attr('data-name');
                                        data.bankCityCode = $(elem).attr('data-code');
                                        return;
                                    }
                                case "amount":
                                    {
                                        data.amount = value.replace(/(\s*\,\s*)/g, "");
                                        return;
                                    }
                               case "userfield0":
                               case "userfield1":
                               case "userfield2":
                                    {
                                         data[name] = value.replace(/(\s*\,\s*)/g, "");
                                        return;
                                    }
                                case "payStatus":
                                    {
                                        data.payStatus = $(elem).attr('value');
                                        return;
                                    }
                                default:
                                     data[name] = value;
                                    break;
                            }
                        })

/*                        if (data.payStatus == "2" || data.payStatus == "4" ) {
                            data.committer = this.context.flow.lockName;
                        }*/
                        if (bValid !== false && !this.valid()) {return false};
                        return data;
                    }
                }, state());
            }),
            "view": $cls.create(function(data, context) {
                var obj = null,
                    constructor = function(data, context) {
                        this.init(data, context);
                    };

                return extend({
                    make: function() { 
                        this.callSuper(null, "view");
                        return this;
                    },
                    addHandle: function() {

                    },
                    init: function(data, context) {
                        this.type = "view";
                        this.callSuper(data, context);
                        return this.make(this.data);
                    },
                    add: function() {
                        this.make();
                    }
                }, state());
            }),
            "check": $cls.create(function(data, context) {
                var obj = null,
                    oAttrs = {
                        "check": {
                            value: "打款",
                            "data-op": "check"
                        },
                        "bigCheck": {
                            value: "大额审核",
                            "data-op": "bigCheck"
                        }
                    };

                return extend({
                    make: function() {
                        var rule = opts.rule,
                            attr = oAttrs[rule(parseInt(this.data.amount.replace(/\s*\,\s*/, "")))];
                        this.optype = attr["data-op"];
                        this.callSuper('<button style="margin:0px;" class="coper" ' + this.getValByCSDic("refund") + ' data-op="' + attr["data-op"] + '"  value="' + attr.value + '">' + attr.value + '</button>', "view");
                        this.$op = this.$tr.find('button[data-op=' + this.optype + ']');
                        this.addHandle();
                        return this;
                    },
                    addHandle: function() {

                    },
                    init: function(data, context) {
                        this.type = "check";
                        this.callSuper(data, context);
                        return this.make(this.data);
                    },
                    add: function() {
                        this.make();
                    }
                }, state());
            }),
            "bigCheck": $cls.create(function(data, context) {
                var obj = null;

                return extend({
                    make: function(data) {
                        this.callSuper('<button style="margin:0px;" class="coper" ' + this.getValByCSDic("refund") + ' data-op="check" value="refound">打款</button>', "view");
                        var rule = opts.rule;

                        // if (rule( parseInt( this.data.amount.replace(/\s*\,\s*/, "") ) ) == "check" ) {
                        //  this.$tr.css('display', 'none');
                        // };

                        this.$op = this.$tr.find("button[data-op=check]");
                        //this.$tr = this.callSuper('<input class="coper" data-op="bigCheck"  type="button" ' + this.getValByPaysStatus("refund") + ' value="打款" data-op="refund"/>', "view");
                        //$(this.wrapTr(this.fillTemplateData("readonly", data), ));
                        this.addHandle();
                        return this;
                    },
                    addHandle: function() {

                    },
                    init: function(data, context) {
                        this.type = "bigCheck";
                        this.callSuper(data, context);
                        return this.make(this.data);
                    },
                    add: function() {
                        this.make();
                    }
                }, state());
            }),
            "make": function(data, type, context, unid) {
                var rule = opts.rule,
                    sState = opts.pageState,
                    controlState = opts.controlState,
                    dsPayReason = opts.dsPayReason,
                    state;

                return new this[type](data, context, unid);
            }
        };
    },
    init: function(data, type, options) {
        var a = null;
        this.pageState = type;
        this.flowNodeType = options.flowNodeType; //审核 大额审核
        this.flow = options.flow;
        this.orderNo = this.flow.order["订单号"];
        this.flowConfigName = options.flowConfigName;
        this.otherData = options.otherData;
        this.onload = options.onload;
        this.maxLen = options.maxLen || 5;
        this.display = options.display;
        this.otherValid = options.otherValid || null;
        this.onAmount  =options.onAmount;
        this.now = options.now || function() {
            return (new Date()).toLocalDate();
        };
        this.list = data || options.data || [];
        this.minLen = 0;
        if (this.list.length > 0) { //有数据 编辑 审核状态
            this.minLen = 1;
        }
        this.$container = options.container || document.body;
        if (this.pageState == "process") {
            if (this.flowNodeType != "manager") {
                this.pageState = this.flowNodeType;
            }
        };

        var rootUrl = "http://api.callcenter.corp.qunar.com"; //"http://192.168.100.52:8080/";

        this.stateManager = this.getStateManager(this.configData = {
            pageState: this.pageState,
            controlState: {
                "2": {etext: "unrefund", ctext: "未打款", state: "editable", del: "", refund: ""},
                "3": {etext: "accepted", ctext: "处理中", state: "view", del: "disabled", refund: "disabled"},
                "5": {etext: "suceess", ctext: "打款成功", state: "view", del: "disabled", refund: "disabled"},
                "4": {etext: "failed", ctext: "打款失败", state: "editable", del: "disabled", refund: ""},
                "1": {etext: "", ctext: "历史赔付", state: "view", del: "", refund: "disabled"}
            },
            controlDS: {
                accountType: {
                    heElem: null,
                    ctype: "radiolist",
                    data: [{code:0,name:"对私"}, {code:1,name:"对公"}]
                },
                responser:{
                     heElem: null, //缓存不变的option 
                     ctype: "select",
                     data:["代理商","qunar"]
                },
                busiUnit: {
                    ctype: "select",
                    url: "",
                    dataType: "jsonp",
                    params: {},
                    heElem: null,
                    child: "busiType",
                    data: (function(name){
                        var data = [
                                    { 
                                        name:"酒店事业部", code:"酒店事业部",
                                        children: [
                                            { name:"CPC", code:"CPC" ,children:null} ,{ name:"OTATTS", code:"OTATTS" ,children:null} ,
                                            { name:"酒店团购", code:"酒店团购" ,children:null} , { name:"一口价", code:"一口价" ,children:null} ,
                                            { name:"直销预付", code:"直销预付" ,children:null} ,{ name:"现付返佣", code:"现付返佣" ,children:null} ,
                                            { name:"夜销", code:"夜销" ,children:null} , { name:"大鹏网", code:"大鹏网" ,children:null}
                                        ]
                                    },
                                    { 
                                       name:"机票事业部" , code:"机票事业部", 
                                       children: [
                                          { name:"国内机票", code:"国内机票" ,children:null} ,{ name:"国际机票", code:"国际机票" ,children:null}
                                       ]
                                    },
                                    { 
                                        name:"旅游度假", code:"旅游度假", 
                                        children: [
                                            { name:"度假TTS", code:"度假TTS" ,children:null} ,{ name:"旅游团购", code:"旅游团购" ,children:null}
                                        ]
                                    },
                                    { 
                                        name:"门票" , code:"门票",
                                        children: [ 
                                            {name:"门票" , code:"门票", children:null}
                                        ]
                                     },
                                      { 
                                        name:"无线事业部", code:"无线事业部", 
                                        children: [
                                            { name:"国内机票", code:"国内机票", children:null}, { name:"国际机票", code:"国际机票", children:null},
                                            { name:"CPC", code:"CPC", children:null} , { name:"OTATTS", code:"OTATTS", children:null} ,
                                            { name:"酒店团购", code:"酒店团购", children:null} ,{ name:"一口价", code:"一口价", children:null} ,
                                            { name:"直销预付", code:"直销预付", children:null} , { name:"现付返佣", code:"现付返佣", children:null},
                                            { name:"夜销", code:"夜销", children:null} , { name:"出租车接送机", code:"出租车接送机", children:null}
                                        ]
                                    },
                                    { 
                                        name:"callcenter", code:"callcenter", 
                                        children: [
                                            { name:"火车票", code:"火车票" ,children:null} ,{ name:"国内机票", code:"国内机票" ,children:null} ,
                                            { name:"国际机票", code:"国际机票" ,children:null} , { name:"CPC", code:"CPC" ,children:null} ,
                                            { name:"OTATTS", code:"OTATTS" ,children:null} ,{ name:"酒店团购", code:"酒店团购" ,children:null} ,
                                            { name:"一口价", code:"一口价" ,children:null} , { name:"直销预付", code:"直销预付" ,children:null},
                                            { name:"现付返佣", code:"现付返佣" ,children:null} , { name:"直销预付", code:"直销预付" ,children:null},
                                            { name:"度假TTS", code:"度假TTS" ,children:null} , { name:"旅游团购", code:"旅游团购" ,children:null},
                                            { name:"门票", code:"门票" ,children:null} , {name:"出租车接送机", code:"出租车接送机" ,children:null},
                                            { name:"大鹏网", code:"大鹏网" ,children:null}
                                        ]
                                    }
                            ];

                            if (name == "火车票") {
                                data.push({ 
                                        name:"火车票" , code:"火车票",
                                        children: [ 
                                            {name:"火车票" , code:"火车票", children:null}
                                        ]
                                });
                            }
                            return data;
                            })(this.flowConfigName)
                },
                busiType: {
                    ctype: "select",
                    url: "",
                    params: {},
                    heElem: null,
                    parent: "busiUnit",
                    data: null //[{"code": "", "name": "选择省", citys:[{"code": "", "name": "选择市"}]}, {"code": "ABC", "name": "北京", citys:[{"code": "ABC", "name": "海淀"}]}, {"code": "ADBC", "name": "湖南"}, {"code": "BCM", "name": "河南"} ]
                },
                payReason: {
                    url: "",
                    ctype: "select",
                    heElem: null, //缓存不变的option
                    data: (function(name) {
                        return ({
                                "租车":["页面信息有误", "其他", "司机爽约", "不可抗力", "收费项目不符", "车辆与预订不符"],
                                "门票":["页面信息描述不清、报价有误", "客服原因导致", "退款规则不明确（无线端与PC端显示不一致）", "不可抗力", "商家未及时出票", "客服原因导致", "代理商态度恶劣", "页面信息设置有误", "退款金额有误，补退客人", "无法返现","其他"],
                                "度假":["页面信息描述不清、报价有误", "客服原因导致", "退款规则不明确（无线端与PC端显示不一致）", "不可抗力", "商家未及时出票", "客服原因导致", "代理商态度恶劣", "页面信息设置有误", "退款金额有误，补退客人", "无法返现","其他"],
                                "火车票": ["配送问题", "支付后无法出票", "退票问题", "其它"],
                                "机票": ["不执行航司退改签规定", "未出票申请退票", "支付后无法出票", "行程单问题", "航变未通知", "机票无法使用", "退改签操作不及时", "支付价与行程单价不符", "其它"],
                                "旅游酒店": ["返现问题", "满房或变价", "到店无房", "QUNAR其它部门", "线下退款", "客服处理有误", "产品或页面问题", "不可抗因素", "其它"],
                                "QOTA": ["返现问题", "满房或变价", "到店无房", "线下退担保", "线下退款", "客服处理有误", "产品或页面问题", "不可抗因素"]
                            })[name];
                    })(this.flowConfigName)
                },
                receiverType: {
                    heElem: null,
                    ctype: "select",
                    data: (function(name) {
                        if (name == "旅游酒店") {
                            return ["客人", "商家"];
                        }
                        return ["乘机人", "联系人", "代理商"];
                    })(this.flowConfigName)
                },
                branchBank: {
                    url: rootUrl + "/pay/flow/branchBankList.json",
                    dataType: "jsonp",
                     ctype: "ac",
                    params: { //deepon依赖项的索引 默认取值属性
                        bankCode: 2,
                        province: 0,
                        city: 1
                    },
                    parent: ["bankCity", "bank"],
                    heElem: null,
                    data: null //  [{"code": "ABC", "name": "中国农业银行"}, {"code": "ADBC", "name": "中国农业发展银行"}, {"code": "BCM", "name": "交通银行"} ]
                },
                bank: {
                    ctype: "ac",
                    url: rootUrl + "/pay/flow/bankList.json",
                    dataType: "jsonp",
                    params: {},
                    other: {
                        "中国工商银行": 1, "中国银行": 1, "交通银行": 1, "中国建设银行": 1, "中国农业银行": 1, 
                        "招商银行": 1, "中国光大银行": 1, "华夏银行": 1, "中国民生银行": 1, "广东发展银行": 1, "平安银行（原深圳发展银行）": 1,
                        "兴业银行": 1, "中国邮政储蓄银行": 1, "渤海银行": 1, "浙商银行": 1, "天津农村商业银行": 1, 
                        "徽商银行": 1, "上海农村商业银行": 1, "国家开发银行": 1, "中国进出口银行": 1, "上海浦东发展银行": 1
                    },
                    heElem: null,
                    data: null //[{"code": "ABC", "name": "中国农业银行"}, {"code": "ADBC", "name": "中国农业发展银行"}, {"code": "BCM", "name": "交通银行"} ]
                },
                bankProvince: {
                    ctype: "ac",
                    url: rootUrl + "/pay/flow/provinceAndCityList.json",
                    onlyOne: true,
                    dataType: "jsonp",
                    params: {},
                    heElem: null,
                    child: "bankCity",
                    //_requestQueue:[],
                    data: null //[{"code": "", "name": "选择省", citys:[{"code": "", "name": "选择市"}]}, {"code": "ABC", "name": "北京", citys:[{"code": "ABC", "name": "海淀"}]}, {"code": "ADBC", "name": "湖南"}, {"code": "BCM", "name": "河南"} ]
                },
                bankCity: {
                    ctype: "ac",
                    url: rootUrl + "/pay/flow/provinceAndCityList.json",
                    dataType: "jsonp",
                    params: {},
                    heElem: null,
                    parent: "bankProvince",
                    data: null //[{"code": "", "name": "选择省", citys:[{"code": "", "name": "选择市"}]}, {"code": "ABC", "name": "北京", citys:[{"code": "ABC", "name": "海淀"}]}, {"code": "ADBC", "name": "湖南"}, {"code": "BCM", "name": "河南"} ]
                }
            },
            rule: function(money) {
                if (money > 3000) {
                    return "bigCheck";
                }
                return "check";
            },
            validRule:{
                "__global__": {emsg: "不能为空！"},
                "responser": {text: "责任归属", valid: "noEmpty"},
                "busiUnit": {text:"业务部门", valid:"noEmpty"},
                "userfield131":  {text:"业务类型", valid:"noEmpty"},

                "contactWay": {text: "电话号码", valid: "noEmpty"},
                "receiver": {text: "收款人/性质", valid: "noEmpty"},
                "matter": {text: "详细事由", valid: "length", inbound: [1, 100], emsg: "至少1，最多100"},
                "committer": {text: "提交人", valid: "noEmpty"},
                "payTime": {text: "赔付时间", valid: "noEmpty"},
                // "bankCode": {text: "银行卡号", valid: "length", inbound: [15, null], emsg: "至少15位数字"},
                "amount": {text: "总金额", valid: "noEmpty"},
                // "flowBusinessFieldExtendId": "4f061bc9-e459-4221-81d0-73821298de1c",
                // "orderNo": "h3tu131011100212709",
                // "flowNo": "NP20131011163954210412",
                // "payStatus": "打款中",
                "payReason": {text: "赔付原因", valid: "noEmpty"},
                "receiverAccount": {text: "卡号", valid: "noEmpty"},
                "receiverType": {text: "收款人类型", valid: "noEmpty"},
                "bankName": {text: "银行名称", valid: "noEmpty"},
                "accountbranch": {text:"支行", valid:"noEmpty"},
                "bankCity":  {text:"支行城市", valid:"noEmpty"},
                "bankProvince": {text:"支行省份", valid:"noEmpty"}
            }
        });

        this.$wrap = $('<div class="handle-max" style="margin:5px 0px;">\
                            <table id= "tabCompensate" class="table-compensateInfo">\
                                <thead id="thead_compensate"></thead>\
                                <tbody id="tbody_compensate"></tbody>\
                        </table></div>'); //.css("display", "none");

        this.$tbody = this.$wrap.find('#tbody_compensate');
        this.bExistFailed = false;
        if (this.pageState == "process") {
            var _this = this, oTipWin = null;

            this.$insert = $("<div style='margin-top:10px;'><input  style='padding: 0px' name='insert' type='button' value='增加' data-oper='insert' style='margin:5px 0px;background-color:white;'/></div>");
            this.$insert.appendTo(this.$wrap).find("[name=insert]").on('click', function(event) {
                event.preventDefault();

                !_this.bExistFailed && _this.insert();
            }).on("mouseover", function(event) {
                 event.preventDefault();
                 if (_this.bExistFailed) {
                     var cc = "<h3 style='color:red;'>请先修改失败的打款请求，打款成功后再进行新增操作!</h3>", opts = {
                                target:$(this),
                                follow:"target",
                                type:"tip",
                                onclose:function(){
                                   //window.setTimeout(msgTip, 30 * 1000);
                                }
                        };

                     oTipWin = TipWin(cc, opts);
                  }
            }).on("mouseout", function(event) {
                oTipWin && oTipWin.hide();
            });
        }

        this.makeContent(this.pageState);
        this.addHandle();
        this.$container.html('').append(this.$wrap); //.css('display', '');
        typeof this.onload == "function" && this.onload(this.list[0]);
    },
    show: function(display) {
        if (display) {
            this.$wrap.css('display', '');
        } else {
            this.$wrap.css('display', 'none');
        }
    },
    makeContent: function(type) {
        var i = 0,
            list = this.list,
            rLen = list.length,
            _this = this;
        for (; i < rLen; i++) {
            this.add(list[i], type, this);
        }

        return this.$wrap;
    },
    add: function(data, type, context) {
        if (this.count == this.maxLen) {
            return;
        };
        var unid = this.unid = this.getUniqueId(),
            states = this.states;
        var state = this.stateManager.make(data, type, context || this, unid);
        this.$tbody.append(state.$tr);
        this.insertFailInfo(state);
        this.states[unid] = state;
        this.count++;
        if (this.count == this.minLen) {
            for (var prop in states) {
                if (states[prop] && states[prop].isDelete != "true") {
                    states[prop].$tr.find("[name=del]").attr("disabled", "disabled");
                }
            }
        }

        if (data.payStatus == 4 && !this.bExistFailed) {
            this.bExistFailed = true;
            //this.$insert.find("[name=insert]").prop('disabled', true);
        }
    },
    collect: function(bValid) {
        var list = [],
            states = this.states,
            data;
        for (var prop in states) {
            data = states[prop].collect(bValid !== false);
            if(data === false) return false;
            extend(data, this.otherData() || {})
            list.push(data);
        }
        return list;
    },
    getOtherData: function(argument) {
        return {
            "userfield2": "10.00",
            "userfield1": "11.00",
            "userfield0": "120.00"
        };
    },
    addHandle: function() {
        var _this = this;
        this.$tbody.on('click', '[data-op]', function(event) {
            var $self = $(this),
            op = $self.attr('data-op');
            typeof _this[op] == "function" && _this[op]($self);
        });
    },
    del: function($elem) {
        if (this.count == this.minLen) {
            alert("至少一条赔付信息！");
            return;
        }
        var $tr = $elem.closest('tr'),
            uid = $tr.attr('fe_unid'),
            state = this.states[uid];
        if ($tr.next().attr('data-name') == "error") {
            $tr.next().remove();
        }
        $tr.remove();
        if ($tr.attr('flowbusinessfieldextendid') != "") {
            state.data.isDelete = "true";
        } else {
            state.dispose();
            delete this.states[uid];
        };

        this.count--;
        if (this.count == this.minLen) {
            $elem.prop("disabled", true);
        }
    },
    insertFailInfo: function(state) {
        if (!state || !state.data.failedReason) {
            return;
        };
        var data = state.data;
        state.$tr.after('<tr data-name="error"><td colspan="' + state.$tr.find("td").length + '"><span style="color:red;">失败原因：' + (state.data.failedReason || "") + '</span></td></tr>');

        //this.$tbody.append('<tr><td colspan="'+ state.$tr.find("td").length+'"><span style="color:red;">失败原因：'+ (state.data.failedReason || "")+'</span></td></tr>');
    },
    insert: function() {
        var dataCopy = {
            committer: this.flow.lockName,
            payStatus: "2",
            payTime: this.now(),
            flowNo: flowNo,
            orderNo: this.orderNo,
            contactWay: "",
            "bankCity": "",
            "accountbranch": "", //支行名
            "branchBankCode": "", //支行代码
            "bankCode": "", //银行code 
            "bankName": "", //银行name 
            "bankProvince": "",
            "receiverAccount": "", //银行卡号
            "receiverType": "", //收款类型
            "receiver": "" //收款人
        };
        var trs = this.$tbody.find("tr[fe_unid]"),
            len = trs.length,
            options, unfinished = true,
            $heElem, nodeName;
        /*  case "bank":{
                data.bankName = $(elem).attr('data-name');
                data.bankCode = $(elem).attr('data-code');
                return;
            }
            case "branchBank":{
                data.accountbranch = $(elem).attr('data-name');
                data.branchBankCode = $(elem).attr('data-code');
                return;
            }
            case "bankProvince":{
                data.bankProvince = $(elem).attr('data-name');
                data.bankProvinceCode = $(elem).attr('data-code');
                return;
            }
            case "bankCity":{
                data.bankCity = $(elem).attr('data-name');
                data.bankCityCode = $(elem).attr('data-code');
                return;
            }
            case "amount":
            {
                data.amount = data.amount.replace(/(\s*\,\s*)/g, "");
                return;
            }
        var oDic ={
            text:["receiver","contactWay", "receiverAccount"], //"matter", "amount"
            select:["payReason", "receiverType"],
            ac :["bank", "bankProvince", "bankCity", "branchBank"],
            div:["accountType"]
        }, arr, j, jLen;
        for(var prop in oDic){
            switch(prop){
                case "text":{
                    arr = oDic[prop];
                    for(j=0,jLen = arr.length;j<jLen;j++){
                            arr[j]
                    } 
                }
            }
        }*/
        var oSel = ["responser", "busiUnit","busiType","payReason",
                     "receiverType", "receiver","receiverType", "receiverAccount", "contactWay",
                     "bankProvince","bankCity","bank", "branchBank"], name, count = oSel.length;;

        while (len-- && count > 0) { //只有if 都没进 unfinished 设置true
            $tr = $(trs[len]);

            while(count--){
                name = oSel[count];
                if (!dataCopy[name]) {
                    $heElem = $tr.find("[name="+name+"]");
                    nodeName = $heElem.prop("nodeName").toLowerCase();
                    switch(name){
                        case "bank":{
                            dataCopy["bankName"] =  $heElem.attr("data-name");
                            dataCopy["bankCode"] =  $heElem.attr("data-code") || "";
                            break;
                        }
                        case "branchBank":{
                            dataCopy["accountbranch"] =  $heElem.attr("data-name");
                            dataCopy["branchBankCode"] =  $heElem.attr("data-code") || "";
                            break;
                        }
                        default:{
                            if (nodeName == "div" || nodeName == "span") {
                                dataCopy[name] = $heElem.text();
                            } else {
                                dataCopy[name] = $heElem.val();
                            }
                        }
                    }
                }
                if (dataCopy[name]) {
                    oSel.splice(count, 1);
                }
            }
            count = oSel.length;
        }

        this.add(dataCopy, this.pageState);
    },
    refund: function($elem) {
        this.check($elem);
    },
    insertTip: function(payStatus, msg) {
        if (payStatus == "1") {
            //this.$tr.css('borderBottomWidth', '0px');
            this.$tr.insertAfter('<tr data-emsg="1" style="border-bottom: 1px solid #d7d7d7;"><td colspan="' + $tr.find(".>td").length + '">' + msg + '</td></tr>');
        }
    },
    appendRemark: function(sVal) {
        var val = $("#lastRemark").val();
        $("#lastRemark").val(val ? (val + "\n" + sVal) : sVal);
    },
    getState: function(id) {
        return this.states[id] || null;
    },
    transefer: function(processStatus) {
        if ($("#lastRemark").val() == "") {
            alert("处理意见不能为空!");
        }

        var lastActivityId = "FlowActivity_4bdd9045-425c-445c-96da-c0421497c1b0";
        switch (flowConfigName) {
            case "火车票":
                lastActivityId = "63791fbd840a41eeb327f2cd226770e3";
                break;
            case "旅游酒店":
                lastActivityId = "FlowConfig_9fdef428-30cf-420c-8977-fedbb6bea5bcend";
                break;
            case "QOTA":
                lastActivityId = "5fb095428fa1419da8a3dd0c96045517";
                break;
            case "租车":
                lastActivityId = "e2f5b8ba820a49cc8f6f1124f14b3fc8";
                break;
            case "度假":
                lastActivityId = "219b4fed11db48439bf579ffbf97f4d5";
                break;
            case "门票":
                lastActivityId = "8b5afafd66664725af123e6b11f4a3ef";
            default:
                break;
        }

        flowUtil.ajaxGet({
            url: "/flowinfo/saveOrcloseOrTransferByManager.json",
            data: {
                lastRemark: $("#lastRemark").val(),
                flowConfigId: flowConfigId,
                lastActivityId: lastActivityId,
                flowId: flowId,
                flowNo: flowNo,
                processStatus: 2 //flow.processStatus
            },
            name: 'flowActivityTo',
            callback: function(d) {
                alert("成功");
                //刷新我的工单处列表
                if (iframeId) {
                    var parentDom = window.parent.frames[iframeId];
                    parentDom.$(".order-box").trigger("finishWorkOrder");
                }
                var url = "/flowinfo/go2view.call?flowId=" + flowId;
                framework.go(url);
            },
            finalcallback: function() {
                qui.close(e);
            }
        });
    },
    allRefund: function() {
        var states = this.states,
            prop, state, payState;
        if (this.count == 0) {
            return false;
        };
        for (prop in states) {
            state = states[prop];
            payState = state.updatePayStatus(state.data.payStatus);
            if (payState.etext.toLowerCase() == "failed" || payState.etext.toLowerCase() == "unrefund") { //1 4 payState.etext.toLowerCase() == "" ||
                return false;
            }
        }

        return true;
    },
    request: function(url, param, callback) {
        $.ajax({
            url: framework.addUser(url),
            data: param,
            success: function(dd) { //{"ret":true,"ver":1,data:{"payStatus":"3","failedReason":"测试"}}
                try {
                    var d = eval('(' + dd + ')');
                    if (d.ret) {
                        callback(d.data);
                    }
                } catch (e) {
                    flowUtil.log('getHistoryFlowListByPhone : ' + e);
                }
            }
        });
    },
    check: function($elem) {
        var content = [],
            id = $elem.closest("tr").attr("fe_unid"),
            qui = QUI,
            state = this.getState(id),
            data = state.data,
            _this = this,
            flow = this.flow, //flowinfo/preCommitPayOnline.json
            param = {
                flowId: flow.flowId,
                flowNo: flow.flowNo,
                orderNo: flow.order["订单号"],
                flowBusinessFieldExtendId: state.data.flowBusinessFieldExtendId
            }, handle = false;

        this.request("/flowinfo/preCommitPayOnline.json", param, function(data1) {
            param.paymentRequestLogId = data1.paymentRequestLogId;
            content.push('<div class="entrust-list">');
            content.push('<p style="padding: 5px;">是否确定打款<label style="color:red;">' + data.amount + '</label>元</p>');
            content.push('<p style="padding: 0px 5px 10px;">赔付原因：' + data.payReason + '</p>');
            content.push('</div>');
            qui.confirm('打款', content.join(''), function(e) {
                if (!handle) {
                    handle = true;
                } else {
                    alert("处理中.");
                    return;
                };
                var close1 = function() {
                    qui.close(e);
                };
                $.ajax({
                    url: framework.addUser("/flowinfo/commitPayOnline.json"),
                    data: param,
                    success: function(dd) { //{"ret":true,"ver":1,data:{"payStatus":"3","failedReason":"测试"}}
                        try {
                            var d = eval('(' + dd + ')');
                            if (d.ret) {
                                var payState = state.updatePayStatus(d.data.payStatus);
                                if (payState.refund) {
                                    $elem.attr("disabled", "disabled");
                                };
                                //payState
                                _this.appendRemark("操作打款" + data.amount + "元，赔付原因：" + data.payReason);
                                if (payState.etext.toLowerCase() == "failed") {
                                    //_this.insertTip(d.payStatus, d.failedReason);
                                    if(state.$tr.next().attr("data-emsg")){
                                        state.$tr.next().find("td:first").append('<span style="color:red;width:auto;display:block;">失败原因：' + (d.data.failedReason || "") + '</span>');
                                    }else{    
                                        state.$tr.css('borderBottomWidth', '0px');
                                        state.$tr.after('<tr data-emsg="1" style="border-bottom: 1px solid #d7d7d7;"><td colspan="' + state.$tr.find("td").length + '"><span style="color:red;width:auto;">失败原因：' + (d.data.failedReason || "") + '</span></td></tr>');
                                    }
                                } else if (d.data.allProcessing) { //_this.allRefund()
                                    close1();

                                    content.length = 0;
                                    content.push('<div class="entrust-list">');
                                    content.push('<p style="padding: 5px;">工单已进入等待打款结果状态</p>');
                                    content.push('</div>');

                                    qui.confirm('打款', content.join(''), function(e) {
                                        var iframeId = "";
                                        if ($(window.parent.document).contents().find("[title=中台处理桌面]").length > 0) {
                                            iframeId = "i" + $(window.parent.document).contents().find("[title=中台处理桌面]").parent().attr("id");
                                        }

                                        var lastActivityId = "FlowActivity_4bdd9045-425c-445c-96da-c0421497c1b0";
                                        switch (flowConfigName) {
                                            case "火车票":
                                                lastActivityId = "63791fbd840a41eeb327f2cd226770e3";
                                                break;
                                            case "旅游酒店":
                                                lastActivityId = "FlowConfig_9fdef428-30cf-420c-8977-fedbb6bea5bcend";
                                                break;
                                            case "QOTA":
                                                lastActivityId = "5fb095428fa1419da8a3dd0c96045517";
                                                break;
                                            case "租车":
                                                lastActivityId = "e2f5b8ba820a49cc8f6f1124f14b3fc8";
                                                break;
                                            case "度假":
                                                lastActivityId = "219b4fed11db48439bf579ffbf97f4d5";
                                                break;
                                            case "门票":
                                                lastActivityId = "8b5afafd66664725af123e6b11f4a3ef";
                                            default:
                                                break;
                                        }

                                        flowUtil.ajaxGet({
                                            url: "/flowinfo/saveOrcloseOrTransferByManager.json",
                                            data: {
                                                lastRemark: $("#lastRemark").val(),
                                                flowConfigId: flowConfigId,
                                                lastActivityId: lastActivityId,
                                                flowId: flowId,
                                                flowNo: flowNo,
                                                processStatus: 2 //flow.processStatus
                                            },
                                            name: 'flowActivityTo',
                                            callback: function(d) {
                                                //alert("成功");
                                                //刷新我的工单处列表
                                                if (iframeId) {
                                                    var parentDom = window.parent.frames[iframeId];
                                                    parentDom.$(".order-box").trigger("finishWorkOrder");
                                                }
                                                var url = "/flowinfo/go2view.call?flowId=" + flowId;
                                                framework.go(url);
                                            },
                                            finalcallback: function() {
                                                qui.close(e);
                                            }
                                        });
                                    }, function(e) {
                                        qui.close(e);
                                    }, function(e) {
                                        qui.close(e);
                                    });

                                    $("[role=cancl]").hide();
                                    return;
                                }
                            }
                            close1();
                            //$(".qbox_content").hide();
                            //qui.close(e);
                        } catch (e) {
                            flowUtil.log('getHistoryFlowListByPhone : ' + e);
                        }
                    },
                    complete: function() {
                        handle = false;
                    }
                });
            }, function(e) {
                qui.close(e);
            }, function(e) {
                qui.close(e);
            });
        });
    },
    bigCheck: function($elem) {
        var content = [],
            id = $elem.closest("tr").attr("fe_unid"),
            qui = QUI,
            state = this.getState(id),
            data = state.data,
            _this = this,
            flow = this.flow;

        flowUtil.ajaxGet({
            url: "/flowinfo/flowActivityTo.json",
            data: {
                flowConfigId: flow.flowConfigId,
                flowActivityId: flow.lastActivityId,
                flowId: flowId
            },
            name: 'flowActivityTo',
            callback: function(d) {
                var content = [];
                content.push('<span>节点</span><select id="actList">');
                $.each(d.list, function(i, node) {
                    if (node.flowActivityName == "大额审核") {
                        content.push('<option selected value="', node.flowActivityId, '">', node.flowActivityName, '</option>');
                    } else {
                        content.push('<option value="', node.flowActivityId, '">', node.flowActivityName, '</option>');
                    }

                });
                content.push('</select>');
                qui.confirm('工单转接', content.join(''), function(e) {
                    var lastActivityId = $('#actList').val(),
                        lockId = $("select[name=lockId]").val();
                    if (lastActivityId == "") {
                        qui.alert("工单转接", "请选择节点");
                        return;
                    } //必须选择节点1
                    _this.appendRemark("操作打款" + data.amount + "元，赔付原因：" + data.payReason);

                    if ($("#lastRemark").val() == "") {
                        alert("处理意见不能为空!");
                        qui.close(e);
                        return;
                    }

                    var params = {
                        lastRemark: $("#lastRemark").val(),
                        //flow.userfield29 :JSON.stringify(flow.userfield29);
                        lastActivityId: lastActivityId,
                        lockId: lockId,
                        flowConfigId: flow.flowConfigId,
                        flowId: flowId,
                        processStatus: flow.processStatus
                    };

                    var iframeId = "";
                    if ($(window.parent.document).contents().find("[title=中台处理桌面]").length > 0) {
                        iframeId = "i" + $(window.parent.document).contents().find("[title=中台处理桌面]").parent().attr("id");
                    }
                    flowUtil.ajaxPost({
                        url: "/flowinfo/saveOrcloseOrTransferByManager.json",
                        data: params,
                        name: 'updateProblemByManager',
                        contentType: "json",
                        callback: function() {
                            //alert("成功");
                            //刷新我的工单处列表
                            if (iframeId) {
                                var parentDom = window.parent.frames[iframeId];
                                parentDom.$(".order-box").trigger("finishWorkOrder");
                            }
                            var url = "/flowinfo/go2view.call?flowId=" + flowId;
                            framework.go(url);
                        },
                        finalcallback: function() {
                            //alert("shibai");
                            //recoverHerfStatus(hrefJQ);
                            qui.close(e);
                        }
                    });
                }, function(e) {
                    qui.close(e);
                });

                $('#actList').bind('change', function(e) {
                    var node_select = $(this),
                        flowActivityId = node_select.val();
                    flowUtil.ajaxGet({
                        url: "/flowinfo/toUser.json",
                        data: {
                            flowActivityId: flowActivityId,
                            currentId: currentId
                        },
                        name: 'toUser',
                        callback: function(activityId) {
                            var people = [];
                            people.push('<span class="person">人<select name="lockId">');
                            $.each(activityId.list, function(i, user) {
                                people.push('<option value="', user.userId, '">', user.userName, '</option>');
                            });

                            people.push('</select></span>');
                            node_select.parent().find('.person').remove();
                            var $pp = $(people.join(''))
                            $pp.find("option").first().prop("selected", true);
                            node_select.parent().append($pp);
                        }
                    });
                });
                $('#actList').trigger('change');

                function doAction(suc, error, complete) {
                    $.ajax({
                        url: framework.addUser(URL_CLOSE_TRANSFER),
                        data: params,
                        type: 'post',
                        success: function(d) {
                            try {
                                d = flowUtil.evalJson(d);
                                if (d.ret) {
                                    if (suc) {
                                        suc(d);
                                    }
                                    if (context.callback) {
                                        context.callback(d.data);
                                    }
                                } else {
                                    alert(d.errmsg);
                                }
                            } catch (e) {
                                flowUtil.log('closeOrTransfer parse error : ' + e);
                            }
                        },
                        complete: complete || null
                    });
                }
            }
        });
    },
    commit: function(bValid, bOther) {
        var list = this.collect(bValid);
        if (list === false) { return false;}
        //this.test = toJSON(list);
        if (typeof this.oncommit == "fucntion" && this.oncommit(this) === false) return false;

        if (bValid === false) {
            return list;
        }
        if (this.otherValid && !this.otherValid(list)) {
            return false;
        }
        //其它类型工单不校验
        if (bOther === true) {
            return list;
        }
        if (this.valid(list)) {
            return list;
        }

        return false;
    },
    valid: function(list) {
        list || (list = this.collect());
        var i = 0,
            len = list.length,
            prop, reg, val,
            rValid = {
                "noEmpty": /.+/,
                "phone": /\d{11}/
            }, //new RegExp("\\.{"+min +","+ max+"}")
            rule = {
                __global__: {emsg: "不能为空！"},
                "contactWay": {text: "电话号码", valid: "noEmpty"},
                "receiver": {text: "收款人/性质", valid: "noEmpty"},
                "matter": {text: "详细事由", valid: "noEmpty"},
                "flowBusinessFieldExtendId": "4f061bc9-e459-4221-81d0-73821298de1c",
                "bankName": {text: "银行名称", valid: "noEmpty"},
                "flowNo": "NP20131011163954210412",
                "committer": {text: "提交人", valid: "noEmpty"},
                "payTime": {text: "赔付时间", valid: "noEmpty"},
                "bankCode": {text: "银行卡号", valid: "length", inbound: [15, null], emsg: "至少15位数字"},
                "amount": {text: "总金额", valid: "noEmpty"},
                "orderNo": "h3tu131011100212709",
                "payStatus": "打款中",
                "payReason": {text: "赔付原因", valid: "noEmpty"},
                "receiverAccount": {text: "卡号", valid: "noEmpty"},
                "receiverType": {text: "收款人类型", valid: "noEmpty"}
            };
        /*  "branchBankCode": "",
            "bankCity":  {text:"城市", valid:"noEmpty"},
            "bankProvince": {text:"支行省份", valid:"noEmpty"},*/
        var superBank = this.configData.controlDS.bank.other;

        for (; i < len; i++) {
            data = list[i];
            if (data.isDelete == "true" || data.payStatus == "1" || data.payStatus == "历史赔付") {
                continue
            }; //删除的 历史赔付都不校验
            if (!superBank[data.bankName]) {
                rule["bankCity"] =  {text:"城市", valid:"noEmpty"};
                rule["bankProvince"] =  {text:"省份", valid:"noEmpty"};
            }else if(rule["bankCity"]){
                delete rule["bankCity"];
                delete rule["bankProvince"];
            }
            for (var prop in data) {
                val = data[prop], vrule = rule[prop] || rule.__global__ || null;
                if (vrule) {
                    reg = rValid[vrule.valid];
                    if (reg == "length") {
                        var min = vrule.inbound[0] || 0,
                            max = vrule.inbound[1] || Number.MAX_VALUE;

                        if (val.length < min || val.length > max) {
                            alert(vrule.text);
                        };
                        break;
                    };
                    if (reg && !reg.test(val)) {
                        alert(vrule.text + " " + (vrule.emsg || rule.__global__.emsg || ""));
                        $("[name=" + prop + "]").focus();
                        return false;
                    };
                }
                if (prop == "matter") {
                    if (data.matter.length > 100) {
                        alert("赔付信息: 详细事由最多100个字符！");
                        //$("[name="+data.matter+"]").focus();
                        return false;
                    }
                }
            }
        }


        return true;
    }
});

CompensateInfo.formateMoney = function(amount) { //
    if(amount == null || amount == ""){ return 0.00;  }
    var seglen = 3,
        k = 0,
        arr = amount.toString().split(/\s*\.\s*/),
        decimal = "00",
        s;
    if (arr.length > 1) {
        decimal = arr[1].replace(/[^0-9]/g, "").substr(0, 2);
        switch (decimal.length) {
            case 1:
                decimal = decimal + "0";
                break;
            case 0:
                decimal = "00";
                break;
            default:
                break;
        }
    }
    s = arr[0].replace(/[^0-9]/g, "").replace(/^0+/, '').split(""), i = s.length;
    while (i--) {
        k++;
        if (k == seglen) {
            if (i == 0) {
                break;
            };
            s.splice(i, 0, ",");
            k = 0;
        }
    }
    s = s.join("");
    if (s == "") {
        s = "0";
    }
    var bb = s + "." + decimal;
    // if (bb == "0.00") {
    //     return "";
    // }
    return bb;
};
module.exports = CompensateInfo;

/*  function Control(options, data) {
        options.ds || (options.ds = data);
        this.option = options;
        this.elem = options.elem;
        this.$elem = $(this.elem);
        this.oldValue = this.value = null;
        options.value == null && (options.value = "");
        this.observers = [];
        this.ds = options.ds || {};
        this.tag = options.tag || "select"; //"select>option, ul>li, div>span ...";
        this.init(options);
    }
    Control.isControl = function(o) {
        return o instanceof Control;
    }
    Control.prototype = {
        constructor: Control,
        init: function(options) {
            var self = this,
                elem = this.makeUI(options.value, this.ds);
            this.attachObserver(options.children);
            $(elem).bind(options.event || 'change', function(event) {
                self.setValue($(elem).val(), false);
            });
        },
        /**
         * [makeUI description]
         * @param  {[type]} val  [description] data中的一个激活值
         * @param  {[type]} data [description]
         * @return {[type]}      [description]
         */
        makeUI: function(val, data) {
            data || (data = this.ds);
            //if(true){this.clearUI();}
            switch (this.tag) {
                case "ul":
                case "div":
                    {
                        break;
                    }
                default:
                    {
                        this.elem.length = 0;
                        //this.remove();
                        this.elem.options.add(new Option("", ""));
                        var obj = null;
                        for (var prop in data) {
                        	obj = data[prop];
                            this.elem.options.add(new Option(obj.flowProblemName, obj.flowProblemId));
                        }
                        
                        val == undefined && (val = 0);
                        if (!isNaN(val)) { //val < this.elem.length
                            this.elem.selectedIndex = val;
                            val = this.elem.options[this.elem.selectedIndex].value;
                        }
                        break;
                    }
            }
            this.setValue(val, true);
            return this.elem;
        },
        remove: function(index) {
            if (index) {
                this.elem.options[index] && this.elem.remove(index);
            } else {
                this.elem.length = 0;
                /*
                                while (this.elem.options.length) {
                                    this.elem.remove (0);
                                }*/
            }
        },
        saveVal: function(val, text) {
            this.oldValue = this.value;
            this.value = val;
            if(text != null){
           	     this.oldText = this.text;
                 this.text = text;
            }
        },
        resetVal: function() {
            this.oldValue = this.value = null;
            //this.update();
        },
        update: function(val, data) {
            this.ds = data || {};
            this.makeUI("", this.ds);
        },
        attachObserver: function(observers) {
            Object.prototype.toString.call(observers) == "[object Array]" || (observers = [observers]);
            for (var i = 0, len = observers.length; i < len; i++) {
                control = observers[i];
                if (control) {
                    Control.isControl(control) || (control = new Control(observers[i], this.ds[this.value] && this.ds[this.value].children || {}));
                    this.observers.push(control);
                }
            }
        },
        notify: function(val) {
            for (var i = 0, len = this.observers.length; i < len; i++) {
                this.observers[i].update(val || this.value, this.ds[this.value] && this.ds[this.value].children || {}, this);
            }
        },
        setValue: function(val, bNotify) {
            if (this.value != val) {
                this.saveVal(val);
                $(this.elem).val(val);
                bNotify = true;
            }
            bNotify && this.notify(val);
        },
        getValue:function(val){
        	var cret = [];
       	 	 for (var i = 0, len = this.observers.length; i < len; i++) {
       	 		 var ss = this.observers[i].getValue();
       	 		 if(ss != ""){
       	 			cret.push(ss);
       	 		 }
            }

       	 	return cret.length ? (this.$elem.find(":selected").text() +"@" + cret.join("|")) : this.$elem.find(":selected").text();
        },
        setDS: function(val) {
            this.ds = val;
        }
    };
	
    jQuery(function() {
    	var heP1 = document.getElementById('p1'),
	        heP2 = document.getElementById('p2'),
	        heP3 = document.getElementById('p3'),
	        heP4 = document.getElementById('p4'),
	        datasouce = {};
    	
    	 function builtTree(data, root){
             var i=0, len = data.length, child = null, children = {}, pid = root.flowProblemId, delCount = 0;
             for(var j=0;j<len;j++){
                 child = data[j];
                 if (child.parentId == pid) {
                     children[child.flowProblemId] = child;
                     child.children = builtTree(data, child);
                 }
             }
             return children;
         }
    	 
    	
    	 function makeSelect(oDS){
    		 if(!rootProblem){
    			  rootProblem = new Control({
                      elem: heP1,
                      value: "",
                      ds: oDS, //datasource 
                      children: [{
                          elem: heP2,
                          value: "",
                          children: [{
                              elem: heP3,
                              value: "",
                              children: [{
                                  elem: heP4,
                                  value: "",
                                  children:  null
                              }]
                          }]
                      }]
                  });
    		 }else{
    			 rootProblem.update("", oDS);
    		 }
           }
    	 
        function load(flowConfigId) {
        	 var oDS = datasouce[flowConfigId]; 
        	 if(!oDS && flowConfigId != ""){
        		 getDS(flowConfigId, function(data){
        			 oDS = datasouce[flowConfigId] = builtTree(data.list, {
        				 flowProblemId: data.rootId
        			 });
        			 makeSelect(oDS);
        		 });
        		 return;
        	 }else{
        		 makeSelect(oDS);
        	 }
        }
		
        function getDS(flowConfigId, callback){
            jQuery.ajax({
                url: framework.addUser('/flowinterface/getFlowProblemListByFlowConfigId.json'),
                data: {
                    flowConfigId: flowConfigId
                },
                success: function(data) {
                    try {
                    	var d = eval("("+ data + ")");
                        if (d.ret) {
                        	
                            callback && callback(d.data);
                        } else {
                            alert(d.errmsg);
                        }
                    } catch (e) {
                        console.log && console.log(e);
                    }
                },
                error:function(d) {
                    /* Act on the event */
                     console.log && console.log(d);
                }
            });
       }
*/
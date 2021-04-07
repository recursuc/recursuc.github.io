
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

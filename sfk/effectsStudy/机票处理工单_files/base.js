
;(function(__context){
    var module = {
        id : "e0490817ddd2db761c7c1ac44680e352" , 
        filename : "base.js" ,
        exports : {}
    };
    if( !__context.____MODULES ) { __context.____MODULES = {}; }
    var r = (function( exports , module , global ){

    (function($) {
    //生成命名空间  ns("QUI.grid")
    function ns(namespace) {
        var _ns = namespace.split(".");
        var cur = window[_ns[0]];
        if(cur === undefined) cur = window[_ns[0]] = {};
        var len = _ns.length;
        for(var i = 1; i < len; i++)
            cur = cur[_ns[i]] = cur[_ns[i]] || {};
        return cur;
    }

    $.extend(window, { ns: ns,
        echo: function(msg) {
        }
    });
    $.extend(ns("util"), {
        //字符串转整型
        toint: function(str) {
            if(str.indexOf('.') != -1) return Number(str)
            var i = parseInt(str);
            if(isNaN(i)) { i = 0; }
            return i;
        }, format: function(str, obj, reStart, reEnd) {
            var re = new RegExp("\\" + (reStart || "{") + "(\\w+)\\" + (reEnd || "}"), "g");
            return str.replace(re, function(a, b) {
                return obj[b];
            })
        }, autoheight: function() {
            var top = window.top;
            var iframe;
            if(top && (iframe = top.document.getElementById("appFrame"))) {
                var h = $(document.body).height();
                h = h < 500 ? 500 : h;
                iframe.style.height = h + "px";
            }
        }
        , url: {
            urlToObj: function(urldata) {
                if(urldata) {
                    var _data = {};
                    var params = urldata.substr(1).split("&");
                    for(p in params) {
                        var pp = params[p].split("=");
                        if(pp.length > 1)
                            try {
                                _data[pp[0]] = decodeURIComponent(pp[1]);
                            } catch(e) {
                                _data[pp[0]] = "";
                            }
                    }
                    return _data;
                }
                return {};
            },
            getSearchData: function() {
                return this.urlToObj(location.search);
            },
            getHashData: function() {
                return this.urlToObj(location.hash);
            },
            back: function() {
                if(location.hash) history.back();
            }
        },
        date: {
            getDateFromStr: function(str) {
                if(str) {
                    if(typeof (str) == "string")
                        return str ? new Date(str.replace(/-/g, "/")) : null;
                    return str;
                }
                return null;
            },
            addDay: function(odate, num) {
                var date = new Date();
                if(odate) {
                    if(typeof (odate) == "string") date = this.getDateFromStr(odate);
                    else date = new Date(odate);
                    date.setDate(date.getDate() + (num || 0));
                }
                return date;
            },
            formatDate: function(num) {
                if(num < 10) return '0' + num;
                return num;
            },
            getWeek: function(num) {
                var weeks = ['日', '一', '二', '三', '四', '五', '六'];
                return weeks[num];
            }
        },
        str: {
            trim: function(str) {
                return str ? str.replace(/(^\s*)|(\s*$)/g, "") : "";
            },
            subStr: function(str, len) {
                if(str.length > len) return str.substr(0, len) + '...';
                return str;
            }
        },
        htmlParse: function(v) {
            if(typeof (v) != "string") return v;
            var parse = { "<": "&lt;",
                ">": "&gt;"
            };
            var reg = "";
            for(var key in parse) {
                reg += key;
            }
            reg = "[" + reg + "]"
            reg = new RegExp(reg, "g");
            return v.replace(reg, function(k) {
                return parse[k];
            });
            //return v.replace(/</g, "&lt;").replace(/>/g, "&gt;");
        }
    });

    function islogin() {
        $(document).ajaxComplete(function(event, xhr, settings) {
            var needLogin = xhr.getResponseHeader("NeedLogin");
            var contentType = xhr.getResponseHeader("Content-Type");
            if(needLogin && contentType && /^text\/html.*$/.test(contentType)) {
                $("body").html(xhr.responseText);
            }
            //Zhijun@0806: fix the bug of bad height compution when dialog show.
            //util.autoheight();
        });
    }

    //自适应高度
    $(function() {
        util.autoheight();
        islogin();
    });
})(jQuery);

    })( module.exports , module , __context );
    __context.____MODULES[ "e0490817ddd2db761c7c1ac44680e352" ] = module.exports;
})(this);

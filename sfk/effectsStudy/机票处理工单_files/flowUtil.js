
;(function(__context){
    var module = {
        id : "0777a46b363f82b26d1f88df891c6b04" , 
        filename : "flowUtil.js" ,
        exports : {}
    };
    if( !__context.____MODULES ) { __context.____MODULES = {}; }
    var r = (function( exports , module , global ){

    var DateEnty = {
    shortMonths:['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    longMonths:['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
    shortDays:['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    longDays:['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],

    // Day
    d:function () {
        return (this.getDate() < 10 ? '0' : '') + this.getDate();
    },
    D:function () {
        return DateEnty.shortDays[this.getDay()];
    },
    j:function () {
        return this.getDate();
    },
    l:function () {
        return DateEnty.longDays[this.getDay()];
    },
    N:function () {
        return this.getDay() + 1;
    },
    S:function () {
        return (this.getDate() % 10 == 1 && this.getDate() != 11 ? 'st' : (this.getDate() % 10 == 2 && this.getDate() != 12 ? 'nd' : (this.getDate() % 10 == 3 && this.getDate() != 13 ? 'rd' : 'th')));
    },
    w:function () {
        return this.getDay();
    },
    z:function () {
        var d = new Date(this.getFullYear(), 0, 1);
        return Math.ceil((this - d) / 86400000);
    }, // Fixed now
    // Week
    W:function () {
        var d = new Date(this.getFullYear(), 0, 1);
        return Math.ceil((((this - d) / 86400000) + d.getDay() + 1) / 7);
    }, // Fixed now
    // Month
    F:function () {
        return DateEnty.longMonths[this.getMonth()];
    },
    m:function () {
        return (this.getMonth() < 9 ? '0' : '') + (this.getMonth() + 1);
    },
    M:function () {
        return DateEnty.shortMonths[this.getMonth()];
    },
    n:function () {
        return this.getMonth() + 1;
    },
    t:function () {
        var d = new Date();
        return new Date(d.getFullYear(), d.getMonth(), 0).getDate()
    }, // Fixed now, gets #days of date
    // Year
    L:function () {
        var year = this.getFullYear();
        return (year % 400 == 0 || (year % 100 != 0 && year % 4 == 0));
    }, // Fixed now
    o:function () {
        var d = new Date(this.valueOf());
        d.setDate(d.getDate() - ((this.getDay() + 6) % 7) + 3);
        return d.getFullYear();
    }, //Fixed now
    Y:function () {
        return this.getFullYear();
    },
    y:function () {
        return ('' + this.getFullYear()).substr(2);
    },
    // Time
    a:function () {
        return this.getHours() < 12 ? 'am' : 'pm';
    },
    A:function () {
        return this.getHours() < 12 ? 'AM' : 'PM';
    },
    B:function () {
        return Math.floor((((this.getUTCHours() + 1) % 24) + this.getUTCMinutes() / 60 + this.getUTCSeconds() / 3600) * 1000 / 24);
    }, // Fixed now
    g:function () {
        return this.getHours() % 12 || 12;
    },
    G:function () {
        return this.getHours();
    },
    h:function () {
        return ((this.getHours() % 12 || 12) < 10 ? '0' : '') + (this.getHours() % 12 || 12);
    },
    H:function () {
        return (this.getHours() < 10 ? '0' : '') + this.getHours();
    },
    i:function () {
        return (this.getMinutes() < 10 ? '0' : '') + this.getMinutes();
    },
    s:function () {
        return (this.getSeconds() < 10 ? '0' : '') + this.getSeconds();
    },
    u:function () {
        var m = this.getMilliseconds();
        return (m < 10 ? '00' : (m < 100 ?
            '0' : '')) + m;
    },
    // Timezone
    e:function () {
        return "Not Yet Supported";
    },
    I:function () {
        return "Not Yet Supported";
    },
    O:function () {
        return (-this.getTimezoneOffset() < 0 ? '-' : '+') + (Math.abs(this.getTimezoneOffset() / 60) < 10 ? '0' : '') + (Math.abs(this.getTimezoneOffset() / 60)) + '00';
    },
    P:function () {
        return (-this.getTimezoneOffset() < 0 ? '-' : '+') + (Math.abs(this.getTimezoneOffset() / 60) < 10 ? '0' : '') + (Math.abs(this.getTimezoneOffset() / 60)) + ':00';
    }, // Fixed now
    T:function () {
        var m = this.getMonth();
        this.setMonth(0);
        var result = this.toTimeString().replace(/^.+ \(?([^\)]+)\)?$/, '$1');
        this.setMonth(m);
        return result;
    },
    Z:function () {
        return -this.getTimezoneOffset() * 60;
    },
    // Full Date/Time
    c:function () {
        return this.format("Y-m-d\\TH:i:sP");
    }, // Fixed now
    r:function () {
        return this.toString();
    },
    U:function () {
        return this.getTime() / 1000;
    }
};

var flowUtil = {
    log : function(d) {
        if(console) {
            console.log(d);
        } else {
            alert(d);
        }
    },
    copy : function (txt) {
        if(window.clipboardData) {
            window.clipboardData.clearData();
            window.clipboardData.setData("Text", txt);
            alert("复制成功！")
        }else if (navigator.userAgent.indexOf("Opera") != -1){
            window.location = txt;
            alert("复制成功！");
        }else if (window.netscape){
            try {
                netscape.security.PrivilegeManager.enablePrivilege("UniversalXPConnect");
            }catch (e) {
                // alert("被浏览器拒绝！\n请在浏览器地址栏输入'about:config'并回车\n然后将 'signed.applets.codebase_principal_support'设置为'true'");
                alert("被浏览器拒绝！\n请使用ie浏览器");
            }
            var clip = Components.classes['@mozilla.org/widget/clipboard;1'].createInstance(Components.interfaces.nsIClipboard);
            if (!clip)return;
            var trans = Components.classes['@mozilla.org/widget/transferable;1'].createInstance(Components.interfaces.nsITransferable);
            if (!trans) return;
            trans.addDataFlavor('text/unicode');
            var str = new Object();
            var str = Components.classes["@mozilla.org/supports-string;1"].createInstance(Components.interfaces.nsISupportsString);
            var copytext = txt;
            str.data = copytext;
            trans.setTransferData("text/unicode", str, copytext.length * 2);
            var clipid = Components.interfaces.nsIClipboard;
            if (!clip) return false;
            clip.setData(trans, null, clipid.kGlobalClipboard);
            alert("复制成功！");
        }
    },
    dateFormat:function (date, str) {
        var returnStr = '';
        for (var i = 0; i < str.length; i++) {
            var curChar = str.charAt(i);
            if (i - 1 >= 0 && str.charAt(i - 1) == "\\") {
                returnStr += curChar;
            }
            else if (DateEnty[curChar]) {
                returnStr += DateEnty[curChar].call(date);
            } else if (curChar != "\\") {
                returnStr += curChar;
            }
        }
        return returnStr;
    },
    evalJson:function(d) {
        return eval('(' + d + ')');
    },
    ajaxGet:function (args) {
        var url = framework.addUser(args.url),
            data = args.data,
            callback = args.callback,
            finalcallback = args.finalcallback || function(){} ,
            exceptionName = args.name;

        $.ajax({
            url : url,
            data : data,
            success : function(d) {
                try {
                    d = flowUtil.evalJson(d);

                    if(d.ret) {
                        if($.type(callback) === 'function') {
                            callback(d.data);
                            finalcallback();
                        }
                    } else {
                        alert(d.errmsg);
                        finalcallback();
                    }
                } catch(e) {
                    flowUtil.log((exceptionName || 'ajaxGet exception') + ' : ' + e);
                    finalcallback();
                }
            },
            error: finalcallback
        });
    },
    ajaxPost:function (args) {
        var url = framework.addUser(args.url),
            data = args.data,
            callback = args.callback,
            finalcallback = args.finalcallback || function(){} ,
            exceptionName = args.name;

        $.ajax({
            url : url,
            data : data,
            type: "POST",
            success : function(d) {
                try {
                    d = flowUtil.evalJson(d);

                    if(d.ret) {
                        if($.type(callback) === 'function') {
                            callback(d.data);
                            finalcallback();
                        }
                    } else {
                        alert(d.errmsg);
                        finalcallback();
                    }
                } catch(e) {
                    flowUtil.log((exceptionName || 'ajaxGet exception') + ' : ' + e);
                    finalcallback();
                }
            },
            error: finalcallback
        });
    }
};

window.flowUtil = flowUtil;

module.exports = flowUtil;

    })( module.exports , module , __context );
    __context.____MODULES[ "0777a46b363f82b26d1f88df891c6b04" ] = module.exports;
})(this);

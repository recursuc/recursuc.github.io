//http: //www.quirksmode.org/js/contents.html

(function ($) {
    //    Object.extend = function (dest, source, replace) {
    //        for (var prop in source) {
    //            if (replace == false && dest[prop] != null) {
    //                continue; 
    //            }
    //            dest[prop] = source[prop];
    //        }
    //        return dest;
    //    };

    Function.prototype.method = function (name, fn) {
        if (typeof name === "string") {
            this.prototype[name] = fn;
        } else if (typeof name == "object") {
            for (prop in name) {
                if (!this.prototype[prop]) {
                    this.prototype[prop] = name[prop];
                };
            }
        } else {
            throw "arguments error!"
        }

        return this;
    };
    //http://coding.smashingmagazine.com/2008/04/15/60-more-ajax-and-javascript-solutions-for-professional-coding/
    //http://coding.smashingmagazine.com/2007/06/12/tooltips-scripts-ajax-javascript-css-dhtml/
    Function.prototype.bind = function () {
        var fn = this, args = Array.prototype.slice.call(arguments), object = args.shift();
        return function () {
            return fn.apply(object,
          args.concat(Array.prototype.slice.call(arguments)));
        };
    };

    function addMethod(object, name, fn) {
        // Save a reference to the old method 
        var old = object[name];

        // Overwrite the method with our new one 
        object[name] = function () {
            // Check the number of incoming arguments, 
            // compared to our overloaded function 
            if (fn.length == arguments.length)
            // If there was a match, run the function 
                return fn.apply(this, arguments);

            // Otherwise, fallback to the old method 
            else if (typeof old === "function")
                return old.apply(this, arguments);
        };
    }
    window["cloneObject"] = function (oType, bIsDeep) {
        if (bIsDeep === true) {//deep clone
            var obj = null;
            switch (typeof (oType)) {
                case 'object':
                    {
                        obj = {};
                        if (oType instanceof Number || oType instanceof String || oType instanceof Boolean) {
                            return oType.valueOf();
                        } else if (oType instanceof Array) {
                            obj = [];
                        } else if (oType == null) {
                            return null;
                        }
                        for (var key in oType) {
                            obj[key] = arguments.callee(oType[key], bIsDeep); //原始类型会自动装箱
                        }
                        return obj;
                    }
                case 'function':
                    {
                        obj = oType;
                        return obj;
                    }
                case 'string':
                    {
                        obj = oType.toString();
                        return obj;
                    }
                case 'undefined':
                case 'number':
                case 'boolean':
                    {
                        obj = oType;
                        return obj;
                    }
                default:
                    {
                        throw "type error!"
                    }

            }
        } else if (bIsDeep === false) {//shallow clone
            var F = function () { }
            F.prototype = oType;
            return new F();
        }
    };

    window["ObjectToJSON"] = function (obj) {
        var sb = new $.StringBuilder();
        switch (typeof (obj)) {
            case 'object':
                {
                    if (obj instanceof Number || obj instanceof Boolean) {
                        sb.append(obj.valueOf());
                    } else if (obj instanceof String) {
                        sb.append("\"" + obj.valueOf() + "\"");
                    } else if (obj instanceof Array) {
                        sb.append("[");
                        for (var i = 0; i < obj.length; i++) {
                            sb.append(arguments.callee(obj[i]));
                            if (i < obj.length - 1) {
                                sb.append(",");
                            }
                        }
                        sb.append("]");
                    } else if (obj == null) {
                        return "null";
                    } else {
                        var a = []
                        sb.append("{");
                        for (var key in obj) {
                            if (obj.hasOwnProperty(key) && typeof obj[key] != "function") {
                                a.push("\"" + key + "\":" + arguments.callee(obj[key]));
                            }
                        }
                        sb.append(a.join(","));
                        sb.append("}");
                    }
                    break;
                }
            case 'string':
                {
                    sb.append("\"" + obj.toString() + "\"");
                    break;
                }
            case 'undefined':
            case 'number':
            case 'boolean':
                {
                    sb.append(obj);
                    break;
                }
            default:
                {
                    sb.append(obj.toString());
                }
        }
        return sb.toString();
    }

    window["GetType"] = function (o) {
        var _t;
        return ((_t = typeof (o)) == "object" ? o == null && "null" || Object.prototype.toString.call(o).slice(8, -1) : _t).toLowerCase();
    }

    //    alert(getType("abc")); //string
    //    alert(getType(true)); //boolean
    //    alert(getType(123)); //number
    //    alert(getType([])); //array
    //    alert(getType({})); //object
    //    alert(getType(function () { })); //function
    //    alert(getType(new Date)); //date
    //    alert(getType(new RegExp)); //regexp
    //    alert(getType(Math)); //math
    //    alert(getType(null)); //null

    //    alert([].constructor == Array);
    //    alert({}.constructor == Object);
    //    alert("123".constructor == String);
    //    alert((55).constructor == Number);
    //    alert(true.constructor == Boolean);


    $.StringBuilder = function (sParam) {
        this.arrContent = [];
        if (sParam != "") {
            this.arrContent.push(sParam);
        }
    }

    $.StringBuilder.prototype = {
        prend: function (sParam, index) {
            if (index > -1 && index < this.arrContent.length) {
                var arr = [index, 0];
                if (sParam instanceof Array) {
                    arr.push(sParam);
                }
                arr = arr.concate(sParam);

                Array.prototype.splice.call(this.arrContent, arr);
            }

            return this;
        },
        append: function (sParam) {
            this.arrContent.push(sParam);
            return this;
        },
        appendFormat: function () {
            var arg = arguments, l = arg.length, i = 1, reg = null;
            if (l > 1) {
                for (i; i < l; i++) {
                    reg = new RegExp('\\{' + (i - 1) + '\\}', 'g', 'm');
                    arg[0] = arg[0].replace(reg, arg[i]);
                }
            }
            this.arrContent.push(arg[0]);
        },
        toString: function () {
            return this.arrContent.join("");
        },
        clear: function () {
            this.arrContent.length = 0;
            return this;
        },
        reverse: function () {
            return this.arrContent.reverse().join("");
        }
    }

    $.extend(String, {
        isSpace: function (sValue) {
            if (typeof sValue == "undefind" || this.length == 0) {
                return true;
            }
            return false;
        },
        format: function (s) {
            for (var i = 1; i < arguments.length; i++) {
                s = s.replace("{" + (i - 1) + "}", arguments[i]);
            }
            return s;
        },
        isNullOrEmpty: function (s) {
            if (s == null || s.length == 0) {
                return true;
            }
            return false;
        }
    });

    String.method({
        trimLeft: function () {
            return this.replace(/^\s*/, "");
        },
        trimRight: function () {
            return this.replace(/\s*$/, "");
        },
        trim: function () {
            return this.replace(/^\s+|\s+$/, '');
        },
        trimEnd: function () {
            return this.replace(/\s+$/, '');
        },
        trimStart: function () {
            return this.replace(/^\s+/, '');
        },
        startsWith: function (sValue, bIgnoreCase) {
            var i = 0,
    				len = 0;
            if (this.length > sValue.length) {
                len = sValue.length;
                while (i < len) {
                    if (this.charAt(i) != this.charAt(i) || bIngoreCase
    					&& !(Math.abs(this.charCodeAt(i) - this.charCodeAt(i)) == 32 && this.charCodeAt(i) < 97 && 65 < this.charCodeAt(i))) {
                        return false;
                    }
                    i++;
                }
            }
            return false;
        },
        endsWith: function (sValue, bIgnoreCase) {
            var i = 0;

            if (this.length > sValue.length) {
                i = sValue.length - 1;
                while (i >= 0) {
                    if (this.charAt(i) == sValue.charAt(i)) {
                        i--;
                        continue;
                    } else if (bIngoreCase && Math.abs(this.charCodeAt(i) - sValue.charCodeAt(i)) == 32 && this.charCodeAt(i) <= 97 && this.charCodeAt(i) >= 65) {
                        i--;
                        continue;
                    }
                    return false;
                }
                return true;
            }

            return false;
        },
        padLeft: function (sChar, iCount) {
            var i = 0,
    				sb = new $.StringBuilder();

            while (i < iCount) {
                sb.append(sChar);
            }
            return sb.append(this);
        },
        padRight: function (sChar, iCount) {
            var i = 0,
    				sb = new $.StringBuilder(this);

            while (i < iCount) {
                sb.append(sChar);
            }
            return sb.toString();

        },
        remove: function (sValue, bGlobal) {
            if (sValue.length > this.length) { return this; };
            var i = 0,
                    j = 0,
                    sThis = this.toString();
            while (i < sThis.length) {
                if (sThis.charAt(i) == sValue.charAt(j)) {
                    i++;
                    j++;
                } else {
                    i = i - j + 1;
                    j = 0;
                }

                if (j == sValue.length) {
                    if (bGloba) {
                        sThis = sThis.removeFrom(i - j, j);
                        j = 0;
                        i = i - j + 1;
                    } else {
                        break;
                    }
                }
            }

            return sThis;
        },
        removeFrom: function (iPos, iCount) {
            if (iPos + iCount - 1 < this.length) {
                var i = 0;
                arr = this.toArray();
                while (i++ < iCount) {
                    arr.split(iPos);
                }

                return arr.join();
            }
        },
        toArray: function (sSeparator) {
            var sChar = sSeparator || "";
            return this.split(sChar);
        },
        split: function (c) {
            var a = [];
            if (this.length == 0) return a;
            var p = 0;
            for (var i = 0; i < this.length; i++) {
                if (this.charAt(i) == c) {
                    a.push(this.substring(p, i));
                    p = ++i;
                }
            }
            a.push(s.substr(p));
            return a;
        },
        capitalize: function () {
            var sb = new $.StringBuilder();
            for (var i = 0; i < this.length; i++) {
                if (i == 0) {
                    sb.append(this.charAt(i).toUpperCase());
                } else {
                    sb.append(this.charAt(i).toLowerCase());
                }
            }
            return sb.toString();
        }
    });

    Array.prototype.srcToString = Array.prototype.toString;
    Array.prototype.toString = function (b) {
        var s = "[", i = 0;
        if (b) {
            while (i < this.length) {
                if (typeof this[i] == "object" && this[i] instanceof Array) {
                    s += this[i].toString(true);
                } else if (typeof this[i] == "string") {
                    s += "'" + this[i] + "'"
                } else {
                    s += this[i];
                }

                if (i + 1 < this.length) {
                    s += ",";
                }

                i++;
            }
            s += "]";
            return s;
        } else {
            return this.srcToString();
        }
    }
    Array.method({
        forEach: function (fn, thisObj) {
            var scope = thisObj || window;
            for (var i = 0, len = this.length; i < len; ++i) {
                fn.call(scope, this[i], i, this);
            }
        },
        filter: function (fn, thisObj) {
            var scope = thisObj || window;
            var a = [];
            for (var i = 0, len = this.length; i < len; ++i) {
                if (!fn.call(scope, this[i], i, this)) {
                    continue;
                }
                a.push(this[i]);
            }
            return a;
        },
        addRange: function (items) {
            if (items.length > 0) {
                for (var i = 0; i < items.length; i++) {
                    this.push(items[i]);
                }
            }
        },
        clear: function () {
            this.length = 0;
            return this;
        }
    });

    if (window['DOM'] == undefined) {
        var DOM = window.DOM = function (sXml) {
            if (typeof sXml == "string") {
                this.xmlDoc = this.loadXML(sXml);
                this.length = 0;
            } else if (!(sXml instanceof window.DOM)) {
                this.xmlDoc = sXml;
                this.length = 0;
            } else {
                var obj = sXml;
                for (var prop in obj) {
                    if (obj.hasOwnProperty(prop) && typeof prop != "function") {
                        this[prop] = obj[prop];
                    }
                }
            }
        };

        DOM.createXMLDOM = function () {
            var xmlDoc = null;
            if ($.browser.msie) {
                var arrSignatures = ["MSXML2.DOMDocument 5.0", "MSXML2.DOMDocument 4.0",
                            "MSXML2.DOMDocument 3.0", "MSXML2.DOMDocument", "Microsoft.XmlDom"];
                for (var i = 0, len = arrSignatures.length; i < len; i++) {
                    try {
                        xmlDoc = new ActiveXObject(arrSignatures[i]);
                        this.createXMLDOM = function () {
                            return new ActiveXObject(arrSignatures[i]);
                        }
                        break;
                    } catch (e) {
                        //ingnore
                    }
                }
            } else {
                try {
                    xmlDoc = document.implementation.createDocument("", "", null); //Firefox, Mozilla, Opera, etc.
                } catch (e) { throw e.message }
            }

            return xmlDoc;
        }

        DOM.prototype = {
            "loadXML": function (sXml) {
                var xmlDoc = null;
                try {
                    xmlDoc = DOM.createXMLDOM();
                    xmlDoc.async = 'false';
                    xmlDoc.loadXML(sXml);
                } catch (e) {
                    throw ('Unable to parse XML');
                }

                return xmlDoc;
            },
            "selectSingleNode": function (xPathString, contextNode) {
                var that = this.clone();
                that.removeTo(0);
                if (typeof contextNode == 'undefined' || contextNode == null) {
                    if (that.xmlDoc != undefined && that.xmlDoc.documentElement != null) {
                        contextNode = that.xmlDoc.documentElement
                    } else {
                        return that;
                    }
                }
                var firstNode = null;

                if ($.browser.msie)
                    firstNode = contextNode.selectSingleNode(xPathString);
                else {
                    var xPath = new XPathEvaluator();
                    var nodes = xPath.evaluate(xPathString, contextNode, null, XPathResult.ORDERED_NODE_ITERATOR_TYPE, null);
                    if (nodes != null) {
                        var node;
                        while (node = nodes.iterateNext()) {
                            firstNode = node;
                            break;
                        }
                    }
                }

                if (firstNode != null) {
                    that[that.length++] = firstNode;
                }

                return that;
            },

            "selectNodes": function (xPathString, contextNode) {
                var that = this.clone();
                that.removeTo(0);
                if (typeof contextNode == 'undefined' || contextNode == null) {
                    if (that.xmlDoc != undefined && that.xmlDoc.documentElement != null) {
                        contextNode = that.xmlDoc.documentElement
                    } else {
                        return that;
                    }
                }

                if ($.browser.msie) {
                    var nodeList = contextNode.selectNodes(xPathString),
                        i = 0;
                    while (i < nodeList.length) {
                        that[i] = nodeList[i];
                        i++;
                    }
                } else {
                    var xPath = new XPathEvaluator(),
                        nodeList = xPath.evaluate(xPathString, contextNode, null, XPathResult.ORDERED_NODE_ITERATOR_TYPE, null);
                    if (nodeList != null) {
                        var node;
                        while (node = nodeList.iterateNext()) {
                            that[i] = nodeList[i];
                            i++;
                        }
                    }
                }

                that.length = nodeList.length;
                return that;
            },
            "toString": function () {
                var sXml = "";
                if ($.browser.msie) {
                    for (var i = 0; i < this.length; i++) {
                        sXml += this[i].xml;
                    }
                } else {
                    var oSerializer = new XMLSerializer();
                    for (var i = 0; i < this.length; i++) {
                        sXml += oSerializer.serializeToString(this[i]);
                    }
                }

                return sXml;
            },
            "removeTo": function (index) {
                var len = typeof index == "number" && index < this.length ? 0 : index;
                for (var i = this.length - 1; i >= index; i--) {
                    delete this[i];
                }
                this.length = index;
            },
            "get": function (index) {
                return index >= 0 && this.length > 0 ? this[index] : null;
            },
            "getAttribute": function (attr) {
                return this.length > 0 ? this.get(0).getAttribute(attr) : null;
            },
            "setAttribute": function (attr, val) {
                if (this.length > 0) {
                    this.get(0).setAttribute(attr, val);
                    return this.clone();
                }
                throw "null";
            },
            "firstChild": function () {
                var that = this.clone();
                if (that.length > 0) {
                    that[0] = that.get(0).firstChild;
                    that.length = 1;
                    that.removeTo(1);
                } else {
                    that.removeTo(0);
                }
                return that;
            },
            "lastChild": function () {
                var that = this.clone();
                if (that.length > 0) {
                    that[0] = that.get(0).lastChild;
                    that.length = 1;
                    that.removeTo(1);
                } else {
                    that.removeTo(0);
                }
                return that;
            },
            "childNodes": function () {
                var that = this.clone();
                that.removeTo();
                if (that.length > 0) {
                    var xnl = his.get(0).childNodes;
                    for (; that.length < xnl.length; this.length++) {
                        that[that.length] = xnl[i];
                    }
                    that.removeTo(1);
                } else {
                    that.removeTo(0);
                }
                return that;
            },
            "hasChild": function () {
                if (this.length > 0) {
                    return this.get(0).childNodes.length > 0 ? true : false;
                }
                return false;
            },
            "push": function (obj) {
                this.selectNode.push(obj);
            },
            "text": function (arrIndex) {
                var s = "", aTemp = arrIndex;
                if (this.length > 0) {
                    if (typeof aTemp == "number") {
                        aTemp = [aTemp];
                    } else if (typeof aTemp != "Array") {
                        aTemp = this;
                    }
                    for (var n = 0; n < aTemp.length; n++) {
                        (function (oNode) {
                            switch (oNode.nodeType) {
                                case 1:
                                    {
                                        for (var i = 0; i < oNode.childNodes.length; i++) {
                                            arguments.callee(oNode.childNodes[i]);
                                        }
                                        break;
                                    }
                                case 3:
                                    {
                                        s += oNode.data;
                                        break;
                                    }
                                default:
                                    {
                                        break;
                                    }
                            }
                        })(aTemp[n])
                    }

                }
                return s;
            },
            "xml": function (arrIndex) {
                var s = "", aTemp = arrIndex;
                if (this.length > 0) {
                    if (typeof aTemp == "number") {
                        aTemp = [aTemp];
                    } else if (typeof aTemp != "Array") {
                        aTemp = this;
                    }
                    for (var n = 0; n < aTemp.length; n++) {
                        s += this.constructor.serializeXml(aTemp[n]);
                    }
                }

                return s;
            },
            "each": function (fn) {
                if (typeof fn == "function") {
                    for (var i = 0; i < this.length; i++) {
                        fn(this[i], i);
                    }
                }
            },
            "clone": function () {
                return new this.constructor(this);
            }
        };

        DOM.prototype.constructor = DOM;

        DOM.serializeXml = function (oNode) {
            var sXml = "";
            if ($.browser.msie) {
                sXml = oNode.xml;
            } else {
                sXml = (new XMLSerializer()).serializeToString(oNode);
            }

            return sXml;
        }
    }


    $.Request = (function () {
        var url = location.href;
        var paraObj = {};
        if (url.indexOf("?") != -1) {
            var paraString = url.substring(url.indexOf("?") + 1, url.length).split("&");
            for (i = 0; j = paraString[i]; i++) {
                paraObj[j.substring(0, j.indexOf("=")).toLowerCase()] = j.substring(j.indexOf
("=") + 1, j.length);
            }
        }
        return paraObj;
    })();

    $.ProcessBar = function (iDelay) {
        if ($("#divLoading") != null) {
            return;
        }
        this.container = document.createElement("div");
        this.container.id = "divLoading";
        this.container.style.position = "absolute";
        this.container.style.diplay = "none";
        this.oImg = document.createElement("img");
        this.oImg.src = "skins/blue/images/run_progress_bar.gif";
        this.oImg.alt = "Loading";
        this.container.appendChild(this.oImg);

        this.oP = document.createElement("p");
        this.oP.style.fontSize = "12px";
        this.oP.innerText = "加载中,请稍等……";
        this.container.appendChild(this.oP);
        document.body.appendChild(this.container);

        this.iDelay = 350;
    }

    $.ProcessBar.prototype = {
        initProcess: function (iCurSeq) {
            if (this.container != null && this.container.style.display == "none") this.container.style.display = "block";
            var arrDis = this.sDis.split(""),
                 iLen = arrDis.length,
                 iCur = iCurSeq,
                 iForward = 1,
                 iPLen = parseInt(this.oP.style.fontSize) * iLen;

            this.oImg.style.marginLeft = Math.floor((iPLen - oImg.width) / 2).toString() + "px";
            this.container.style.left = Math.round((document.body.offsetWidth - Math.max(this.oImg.width, iPLen)) / 2).toString() + "px";
            this.container.style.top = Math.round((document.body.offsetHeight - Math.max(this.oImg.height, parseInt(this.oP.style.fontSize))) / 2).toString() + "px";

            return function () {
                if (iForward == 1) {
                    if (iCur < iLen) {
                        this.oP.innerText += arrDis[iCur++];
                    } else {
                        iForward *= -1;
                    }
                } else {
                    if (iCur >= 0) {
                        this.oP.innerText = this.sDis.substring(0, iCur--);
                    } else {
                        iForward *= -1;
                        iCur = 0;
                    }
                }
            };
        },
        show: function (sDisText, sDelay) {
            if (!this.isExist()) return;

            this.oP.innerText = sDisText;
            this.iDelay = sDelay;
            var fnDis = this.initProcess(0);
            this.iInterId = window.setInterval(fnDis, 350);
        },
        stop: function (sDisText) {
            if (!this.isExist()) return;

            if (this.iInterId) {
                window.clearInterval(this.iInterId);
            }
            this.oP.innerText = sDisText || "已成功!";
            this.container.style.display = "none";
        },
        isExist: function () {
            if (!this.container) { return false; }
            return true;
        }
    }

    window["createBaseXmlDoc"] = function (sXml) {
        var sb = new $.StringBuilder();
        sb.append('<?xml version="1.0" encoding="utf-8"?>');
        sb.append('<RAD>');
        sb.append('<Doc>');
        sb.append('<Data>');
        if (sXml != "") {
            sb.append(sXml);
        }
        sb.append('</Data>');
        sb.append('<Result>');
        sb.append('<ResCode>0</ResCode>');
        sb.append('<ResDetail />');
        sb.append('</Result>');
        sb.append('</Doc>');
        sb.append('</RAD>');

        return $.loadXML(sb.toString());
    }
})(jQuery);


/*
var DOMextend = function (name, fn) {
if (!document.all)
eval("HTMLElement.prototype." + name + " = fn");
else {
var _createElement = document.createElement;
document.createElement = function (tag) {
var _elem = _createElement(tag);
eval("_elem." + name + " = fn");
return _elem;
}
var _getElementById = document.getElementById;
document.getElementById = function (id) {
var _elem = _getElementById(id);
eval("_elem." + name + " = fn");
return _elem;
}
var _getElementsByTagName = document.getElementsByTagName;
document.getElementsByTagName = function (tag) {
var _arr = _getElementsByTagName(tag);
for (var _elem = 0; _elem < _arr.length; _elem++)
eval("_arr[_elem]." + name + " = fn");
return _arr;
}
}
};


DOMextend("getStyle", function (n) {
var _this = this
if (_this.style[n]) {
return _this.style[n];
}
else if (_this.currentStyle) {
return _this.currentStyle[n];
}
else if (document.defaultView && document.defaultView.
getComputedStyle) {
n = n.replace(/([A-Z])/g, "-$1");
n = n.toLowerCase();
var s = document.defaultView.getComputedStyle(_this, null);
if (s)
return s.getPropertyValue(n);
}
else
return null;
})

DOMextend("fromStyle", function (w, p) {
var _this = this
var p = arguments[2];
if (!p) p = 1;
if (/px/.test(w) && parseInt(w)) return parseInt(parseInt(w) * p);
else if (/\%/.test(w) && parseInt(w)) {
var b = parseInt(w) / 100;
if ((p != 1) && p) b *= p;
_this = _this.parentNode;
if (_this.tagName == "BODY") throw new Error("文档结构无尺寸，请使用其他方法获取尺寸.");
w = _this.getStyle("width");
return arguments.callee(_this, w, b);
}
else if (/auto/.test(w)) {
var b = 1;
if ((p != 1) && p) b *= p;
_this = _this.parentNode;
if (_this.tagName == "BODY") throw new Error("文档结构无尺寸，请使用其他方法获取尺寸.");
w = _this.getStyle("width");
return arguments.callee(_this, w, b);
}
else
throw new Error("元素或其父元素的尺寸定义了特殊的单位.");
})

DOMextend("setCSS", function (o) {
var _this = this
var a = {};
for (var i in o) {
a[i] = _this.style[i];
_this.style[i] = o[i];
}
return a;
})

DOMextend("resetCSS", function (o) {
var _this = this
for (var i in o) {
_this.style[i] = o[i];
}
})


DOMextend("width", function () {
var _this = this
if (_this.getStyle("display") != "none") return _this.offsetWidth ||
_this.fromStyle(_this.getStyle("width"));
var r = _this.setCSS({
display: "",
position: "absolute",
visibility: "hidden"
});
var w = _this.offsetWidth || _this.fromStyle(_this.getStyle("width"));
_this.resetCSS(r);
return w;
})

DOMextend("height", function () {
var _this = this
if (_this.getStyle("display") != "none") return _this.offsetHeight ||
_this.fromStyle(_this.getStyle("height"));
var r = _this.setCSS({
display: "",
position: "absolute",
visibility: "hidden"
});
var h = _this.offsetHeight || _this.fromStyle(_this.getStyle("height"));
_this.resetCSS(r);
return h;
})*/

//http://www.cordinc.com/projects/tooltips.html#download
if (typeof addEvent == "undefined") {
    addEvent = function (o, evType, f, capture) {
        if (o == null) { return false; }
        capture = capture || false;
        if (o.addEventListener) {
            o.addEventListener(evType, f, capture);
            return true;
        } else if (o.attachEvent) {
            var r = o.attachEvent("on" + evType, f);
            return r;
        } else {
            try { o["on" + evType] = f; } catch (e) { }
        }
    }
}
if (typeof removeEvent == "undefined") {
    removeEvent = function (o, evType, f, capture) {
        if (o == null) { return false; }
        capture = capture || false;
        if (o.removeEventListener) {
            o.removeEventListener(evType, f, capture);
            return true;
        } else if (o.detachEvent) {
            o.detachEvent("on" + evType, f);
        } else {
            try { o["on" + evType] = function () { }; } catch (e) { }
        }
    };
}

function DataStorage(sFormId, iInterval, iCacheCount) {
    var oFormCache = new LLink(),
        oForm = document.getElementById(sFormId),
        arrControl = [],
        date = (new Date()),
        time = date.getTime(),
        currObj = {},
        feObj = new FormElement(sFormId);
    oFormCache.add(time, currObj);
    window.localStorage.setItem('formCache', oFormCache);

    return {
        iLen: iCacheCount,
        iFlag: 1,
        start: function () {
            var date = (new Date()),
            time = date.getTime(),
            currObj = oFormCache[time] = {};
            for (var j = 0; j < arrControl.length; j++) {
                nodeHandle(oNode, currObj)
            }

            if (oFormCache.length == iCacheCount) {
                oFormCache.remove(oForm.tail);
            }
            oFormCache.add(time, currObj);
            if (typeof iInterval == "number" && iFlag == 1) {
                window.setTimeout(arguments.callee, iInterval)
            }
        },
        offlineStorage: function () {

        },
        stop: function () {
            iFlag = 0;
        }
    };
}


function FormElement(id, iEleTraCacheLen, tooltip, sMainId) {
    this.formId = id;
    this.mainCId = sMainId;
    this.oForm = document.getElementById(this.formId),
    this.iETCLen = iEleTraCacheLen;
    this.iFlag = 1;
    this.llFCE = new LLink(); //FCE FormChildElement 链表
    this.llFCEKeep = {};
    if (this.oForm != null) {
        this.init();
        if (tooltip) {
            this.tooltip();
        }
    }
}
FormElement.createFE = function (sFEC) {
    var oFEC = eval("(" + sFEC + ")"), //(new Function("return" + sFEC))();  
        llFCE = oFEC.llFCE;
    while (llFCE != null) {
        var oFCE = FormChildElement.makeFCE(llFCE);
        this.llFCE.add()
        llFCE = llFCE.next;
    }
}
FormElement.prototype = {
    init: function () {
        var that = this,
             sFEC = window.localStorage.getItem('FECache_' + this.formId),
             oFEC = null,
             llFCE = null;
        if (sFEC) {
            oFEC = eval("(" + sFEC + ")"), //(new Function("return" + sFEC))();  
            llFCE = oFEC.llFCE;
            while (llFCE != null) {
                var oFCE = new FormChildElement(document.getElementById(llFCE.data.elementId), this);
                if (oFCE.elementId != null) {
                    oFCE.add(llFCE.data.llFCET);
                    this.addToLL(oFCE.elementId, oFCE);
                }

                llFCE = llFCE.next;
            }
            this.llFCEKeep = oFEC.llFCEKeep;
        } else {
            (function WalkDOM(oNode) {
                if (oNode == null) {
                    return;
                } else {
                    for (var i = 0; i < oNode.childNodes.length; i++) {
                        if (oNode.childNodes[i].nodeType == 1) {
                            switch (oNode.childNodes[i].nodeName.toLowerCase()) {
                                case "input":
                                    {
                                        switch (oNode.childNodes[i].type) {
                                            case "submit":
                                            case "reset":
                                            case "button":
                                                {
                                                    break;
                                                }
                                            default:
                                                {
                                                    var fceObj = new FormChildElement(oNode.childNodes[i], that);
                                                    that.addToLL(oNode.childNodes[i].id, fceObj);
                                                    that.llFCEKeep[oNode.childNodes[i].id] = [];
                                                    break;
                                                }
                                        }
                                        break;
                                    }
                                case "select":
                                    {
                                        that.addToLL(oNode.childNodes[i].id, new FormChildElement(oNode.childNodes[i], that));
                                        that.llFCEKeep[oNode.childNodes[i].id] = [];
                                        break;
                                    }
                                default:
                                    break;
                            }

                            arguments.callee(oNode.childNodes[i]);
                        }
                    }
                }
            })(this.oForm)
        }
    },
    addToLL: function (key, value) {
        this.llFCE.add(key, value);
    },
    get: function (id) {
        return this.llFCE.find(id)
    },
    getFCE: function (llink, id) {
        return llink.find(id);
    },
    toString: function () {
        var sLL = this.llFCE.toString(),
            sLLKeep = window["ObjectToJSON"](this.llFCEKeep);
        return "{\"formId\":\"" + this.formId + "\",\"llFCE\":" + sLL + ",\"llFCEKeep\":" + sLLKeep + "}";
    },
    start: function (iInterval) {
        if (this.iFlag == 1) {
            var enuObj = new Enumerator(this.llFCE),
                fceObj = null,
                node = null;
            while ((node = enuObj.moveNext()) != null) {
                fceObj = enuObj.curData;
                fceObj.add();
            }

            window.setTimeout(arguments.callee, iInterval)
        } else {
            return;
        }

    },
    offlineStorage: function () {
        this.collectKeepingByMain();
        window.localStorage.setItem('FECache_' + this.formId, this.toString());
    },
    stop: function () {
        this.iFlag = 0;
    },
    collectKeepingByMain: function () {
        if (this.get(this.mainCId) != null) {
            var index = this.findByMain(this.get(this.mainCId).getElementVal());
            if (index != -1) {
                var enuObj = new Enumerator(this.llFCE),
                eNode = null;
                while ((eNode = enuObj.moveNext()) != null) {
                    this.llFCEKeep[enuObj.curData.elementId][index] = enuObj.curData.getElementVal();
                }
            }
        }
        //        var enuObj = null,
        //            eNode = null,
        //            etNuObj = null,
        //            etNode = null,
        //            data = [];

        //        var oFCE = this.getFCE(this.llFCEKeep, this.mainCId);
        //        if (oFCE != null) {
        //            etNuObj = new Enumerator(oFCE.llFCET);
        //            var i = 0, found = false,
        //                val = this.get(this.mainCId).getElementVal(); //取主键值
        //            while ((etNode = etNuObj.moveNext()) != null) {
        //                if (etNuObj.curData.value == val) {
        //                    found = true;
        //                    break;
        //                }
        //                i++;
        //            }

        //            if (found) {
        //                var k = 0;
        //                enuObj = new Enumerator(this.llFCEKeep);
        //                while ((eNode = enuObj.moveNext()) != null) {
        //                    if (enuObj.curData.elementId != this.mainCId) {
        //                        var etObj = enuObj.curData.llFCET.getByIndex(i);
        //                        etObj.value 
        //                        if (oNodeET != null) { 
        //                        
        //                        }
        //                        while ((etNode = etNuObj.moveNext()) != null) {
        //                            data.push(etNuObj.curData.value);
        //                        }
        //                        switch (enuObj.curData.element.type) {
        //                            case "submit":
        //                            case "reset":
        //                            case "password":
        //                            case "button":
        //                                {
        //                                    break;
        //                                }
        //                            default:
        //                                {
        //                                    enuObj.curData.tooltip = new ToolTip(enuObj.curData.elementId, { data: data }, enuObj.curData);
        //                                    break;
        //                                }

        //                        }
        //                        data = [];
        //                    }
        //                }
        //            } else {

        //            }
        //        }
    },
    findByMain: function (val) {
        if (this.mainCId && this.get(this.mainCId) != null) {
            var arrMObj = this.llFCEKeep[this.mainCId],
            index = arrMObj.length, found = false;
            for (var i = 0; i < arrMObj.length; i++) {
                if (arrMObj[i] == val) {
                    found = true;
                    index = i;
                    break;
                }
            }

            return i;
        }

        return -1;
    },
    setFCEValByMain: function (val) {
        var index = this.findByMain(val);
        if (index != -1) {
            var enuObj = new Enumerator(this.llFCE),
                eNode = null;
            while ((eNode = enuObj.moveNext()) != null) {
                if (enuObj.curData.elementId.toLowerCase() != this.mainCId.toLowerCase()) {
                    enuObj.curData.setElementVal(this.llFCEKeep[enuObj.curData.elementId][index]);
                }
            }
        }
    },
    tooltip: function () {
        var enuObj = new Enumerator(this.llFCE),
            eNode = null,
            etNuObj = null,
            etNode = null,
            data = [];
        while ((eNode = enuObj.moveNext()) != null) {
            etNuObj = new Enumerator(enuObj.curData.llFCET);
            while ((etNode = etNuObj.moveNext()) != null) {
                data.push(etNuObj.curData.value);
            }
            switch (enuObj.curData.element.type) {
                case "submit":
                case "reset":
                case "password":
                case "button":
                    {
                        break;
                    }
                default:
                    {
                        enuObj.curData.tooltip = new ToolTip(enuObj.curData.elementId, { data: data }, enuObj.curData);
                        break;
                    }

            }
            data = [];
        }
    },
    each: function (fn) {
        var enuObj = new Enumerator(this.llFCE),
            eNode = null, i = 0;
        while ((eNode = enuObj.moveNext()) != null) {
            fn(enuObj.curData, i);
            i++;
        }
    },
    filer: function (fnHandle) {
        var enuObj = new Enumerator(this.llFCE),
            eNode = null, i = 0;
        while ((eNode = enuObj.moveNext()) != null) {
            if (fnHandle(enuObj.curData)) {
                return enuObj.curData;
            }
        }
        return null;
    }
}

function FormChildElement(oEle, formEle) {
    this.element = oEle;
    if (this.element != null) {
        this.elementId = oEle.id;
        this.llFCET = new LLink(); //FCET FormChildElementTrace 链表
        this.init();
    }
    this.oPForm = formEle;
    this.tooltip = null;
}
FormChildElement.makeFCE = function (oFCE) {
    var oRetFCE = new FormChildElement(document.getElementById(oFEC.id));
    var dataNode = oFEC.data
    while (dataNode != null) {
        oRetFCE.llFCET.add(dataNode);
        dataNode = dataNode.next;
    }
    return oRetFCE;
}
FormChildElement.prototype = {
    init: function () {
        var that = this;

        $(this.element).bind("change", function () {
            that.add();
            //var head = llFCET.head;
            //if (head != null) {
            //    if (head.data.value != that.getElementVal()) {
            //        that.add();
            //    }
            //} else {
            //    that.add();
            //}
        })
    },
    getElementVal: function () {
        var val = "";
        switch (this.element.nodeName.toLowerCase()) {
            case "input":
                {
                    if (this.element.type == "checkbox") {
                        val = this.element.checked.toString();
                    } else {
                        val = this.element.value;
                    }
                    break;
                }
            case "select":
                {
                    val = this.element.options[this.element.selectedIndex].value;
                    break;
                }
            default:
                break;
        }

        return val;
    },
    setElementVal: function (val) {
        switch (this.element.nodeName.toLowerCase()) {
            case "input":
                {
                    if (this.element.type == "checkbox") {
                        this.element.checked = (val == "true" ? true : false);
                    } else {
                        this.element.value = val;
                    }
                    break;
                }
            case "select":
                {
                    for (var i = 0; i < this.element.options.length; i++) {
                        if (this.element.options[i].value == val) {
                            this.element.options[i].selected = true;
                            break;
                        }
                    }
                    break;
                }
            default:
                break;
        }
    },
    setValByLL: function (index) {
        if (index >= 0) {
            var oNode = this.getEleTraNode(index),
                val = oNode.curData.value;
            this.setElementVal(val);
            if (index != 0) {
                this.llFCET.remove(oNode.ptr);
                this.llFCET.addNode(oNode.ptr);
            }
            return val;
        }
    },
    getValByLL: function (index) {
        if (index >= 0) {
            var oNode = this.getEleTraNode(index),
                val = oNode.curData.value;
            return val;
        }
    },
    add: function (llFCET) {
        var that = this;
        if (llFCET) {
            while (llFCET != null) {
                this.addToLLTail(llFCET.data.time, llFCET.data.value);
                llFCET = llFCET.next;
            }
            //if (this.llFCET.head != null && this.llFCET.head != this.llFCET.tail) {
            //     var ptr = null;
            //     ptr = this.llFCET.head;
            //     this.llFCET.head = this.llFCET.tail;
            //     this.llFCET.tail = ptr;
            //     var head = this.llFCET.head,
            //         tail = this.llFCET.tail;
            //     swap("that.llFCET.head", "that.llFCET.tail");
            //     swap("that.llFCET.head.next", "that.llFCET.head.prev");
            //     swap("that.llFCET.tail.next", "that.llFCET.tail.prev");
            //     function swap(oPtr1, oPtr2) {
            //         var ptr = null;
            //         eval("ptr =" + oPtr1 + "; " + oPtr1 + "=" + oPtr2 + "; " + oPtr2 + " = ptr;");
            //     }
            //}
        } else {
            var oDate = new Date();
            if (this.llFCET.length == this.oPForm.iETCLen) {
                this.llFCET.remove(this.llFCET.tail);
            }
            this.addToLL(oDate.getTime(), this.getElementVal());
            if (this.tooltip != null) {
                this.tooltip.addTip(this.getElementVal(), this.oPForm.iETCLen);
            }
        }

    },
    addToLL: function (key, value) {
        var oTrace = new ElementTrace(key, value);
        this.llFCET.add(key, oTrace);
    },
    addToLLTail: function (key, value) {
        var oTrace = new ElementTrace(key, value);
        this.llFCET.addTail(key, oTrace);
    },
    getEleTraVal: function (index) {
        var etNuObj = new Enumerator(this.llFCET);
        etNode = null, i = 0;
        while ((etNode = etNuObj.moveNext()) != null) {
            if (i++ == index) {
                return etNuObj.curData.value;
            }
        }
        return null;
    },
    getEleTraNode: function (index) {
        var etNuObj = new Enumerator(this.llFCET);
        etNode = null, i = 0;
        while ((etNode = etNuObj.moveNext()) != null) {
            if (i++ == index) {
                return etNuObj;
            }
        }
        return null;
    },
    toString: function () {
        return "{\"elementId\":\"" + this.elementId + "\",\"llFCET\":" + this.llFCET.toString() + "}";
    }
}

function ElementTrace(time, value) {
    this.time = time;
    this.value = value;
}
ElementTrace.makeET = function (sVal) {
    var temp = eval("(" + sVal + ")");
    return new ElementTrace(temp.time, temp.value);
}
ElementTrace.prototype = {
    toString: function () {
        return "{"
            + "\"time\":\"" + this.time
            + "\", \"value\":\"" + this.value
            + "\"}";
    }
}

function Node(id, data) {
    this.id = id; //方便调试查找
    this.data = data;
    this.prev = null;
    this.next = null;
}

Node.prototype = {
    toString: function () {
        return "{"
            + "\"id\":\"" + this.id
            + "\",\"data\":" + this.data.toString()
            + ",\"next\":" + (this.next != null ? this.next.toString() : "null")
            + "}";
    }
}

function LLink() {
    this.head = null;
    this.tail = null
    this.length = 0;
}

LLink.prototype = {
    addNode: function (oNode) {
        if (!this.head) {
            this.tail = this.head = oNode
        } else {
            oNode.next = this.head;
            this.head.prev = oNode;
            this.head = oNode;
        }
        this.length++;
        return this;
    },
    add: function (key, value) {
        this.addNode(new Node(key, value))
        return this;
    },
    addTail: function (key, value) {
        var oNode = new Node(key, value);
        if (!this.head) {
            this.tail = this.head = oNode
        } else {
            this.tail.next = oNode;
            oNode.prev = this.tail;
            this.tail = oNode;
        }
        this.length++;
        return this;
    },
    find: function (key) {
        var oNode = this.head;
        if (typeof key == "number" || typeof key == "string") {
            while (oNode != null) {
                if (oNode.id.toLowerCase() == key.toLowerCase()) {
                    return oNode.data;
                }
                oNode = oNode.next;
            }
        } else if (oNode instanceof Node) {
            while (oNode != null) {
                if (oNode == key) {
                    return oNode;
                }
                oNode = oNode.next;
            }
        }

        return null;
    },
    getByIndex: function (index) {
        var i = 0, oNode = this.head, index = this.length - 1;
        while (oNode != null && index >= 0) {
            if (i == index) {
                return oNode.data;
            }
            oNode = oNode.next;
            i++;
        }
        return null;
    },
    pop: function () {
        if (this.head != null) {
            var temp = this.head;
            this.head = this.head.next;
            return this.temp
        }
        return null;
    },
    getHead: function () {
        return this.head;
    },
    remove: function (oNode) {
        var temp = this.find(oNode);
        if (temp != null) {
            if (this.length == 1) {
                this.head = null;
                this.tail = null;
            } else {
                if (temp == this.tail) {
                    this.tail.prev.next = this.tail.next;
                    this.tail = this.tail.prev;
                } else if (temp == this.head) {
                    this.head.next.prev = this.head.prev;
                    this.head = this.head.next;
                } else {
                    temp.next.prev = temp.prev;
                    temp.prev.next = temp.next
                }
                temp.prev = null;
                temp.next = null;
            }
            this.length--;
        }
        return temp;
    },
    each: function (fnHanle) {
        var oNode = this.head, index = this.length - 1;
        while (oNode != null) {
            fnHanle(oNode.data, index);
            oNode = oNode.next;
            index--;
        }

    },
    toString: function () {
        return this.head != null ? this.head.toString() : "null";
    },
    getEnumerator: function () {
        return new Enumerator(this);
    }
}

LLink.prototype.constructor = LLink;

function Enumerator(oLLObj) {
	this.iteratorObj = oLLObj == null ? new LLink() : oLLObj;
	this.init();
}

Enumerator.prototype = {
	init:function(){
		this.ptr = { next: this.iteratorObj.head };
		this.curData = null;
	},
    moveNext: function () {
        this.ptr = this.ptr.next;
        if (this.ptr != null) {
            this.curData = this.ptr.data;
        }
        return this.ptr
    },
    reset: function () {
        this.ptr = { next: this.iteratorObj.head };
    },
    next: function () {
        if (this.ptr != null) {
            return this.ptr.next;
        }
        return null;
    }
}

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
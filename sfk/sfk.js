/*
    sfk.js by zcj 2013 - 07 - 02
*/
(function(host) {
    var doc = window.document,
        toString = Object.prototype.toString,
        framework, sfk = framework = Common = {};

    framework.Class = window.Class = framework.Class || (function() {
        var makeBridge = function(parent) {
            var bridge = function() {}; //$F.empty();
            bridge.prototype = parent.prototype;
            return new bridge();
        },
            makeClass = function(parent, bSingleton) {
                var single = null,
                    constructor = !bSingleton ? function() {
                        return this.initialize ? this.initialize.apply(this, arguments) || this : this;
                    } : function() {
                        if (single) {
                            return single;
                        }
                        single = this;
                        return this.initialize ? this.initialize.apply(this, arguments) || this : this;
                    };
                parent = parent || Object;
                constructor.prototype = makeBridge(parent);
                constructor.prototype.constructor = constructor;
                constructor.superclass = parent;
                constructor.subclasses = [];
                if (parent.subclasses)
                    parent.subclasses.push(constructor);

                return constructor;
            },
            bridgeMethod = function(name, value, superMethod, subClass) {
                if (typeof superMethod == "function") {
                    var reg = /\(\s*([^,\s\)]+)/,
                        firstParam = reg.test(value.toString()),
                        fp = false,
                        method = value;
                    if (firstParam && RegExp.$1 == "$super") {
                        fp = true;
                    }
                    value = function() {
                        var params = [];
                        this.callSuper = $F.bind(this, superMethod);;
                        fp && params.push(this.callSuper);
                        method.apply(this, params.concat(Array.prototype.slice.apply(arguments)));
                    };
                }

                subClass.prototype[name] = value;
            },
            sortModules = function(subObejct, superObejct, modules) {
                var stack, module, incMdls, i, incLen;
                if (superObejct) {
                    stack = [superObejct];
                    while (stack.length > 0) {
                        module = stack.pop();
                        modules.push(module);
                        incMdls = module.include;
                        if (incMdls) {
                            incLen = incMdls.length ? incMdls.length : (incMdls = [incMdls], 1);
                            i = 0;
                            while (i < incLen) {
                                stack.push(incMdls[i++]);
                            }
                        }
                    }
                }
                /*
                //var modules = [superObejct];
                modules.push(superObejct);
                if (superObejct.include) {
                var include = superObejct.include, len = include.length;
                if (!len) {
                sortModules(superObejct, include, modules); // modules.concat(sortModules(superObejct, include[len]));
                } else {
                while (len--) {
                sortModules(superObejct, include[len], modules) //  modules.concat(sortModules(superObejct, include[len]));
                }
                }
                }
                */
                return modules;
            },
            bridgeModule = function(modules) {
                var bridge = function(index, name, module) {
                    var i = index - 1,
                        subModule = null,
                        superModule = module;
                    for (; i >= 0; i--) {
                        subModule = modules[i];
                        if (typeof subModule[name] == "function") {
                            bridgeModuleMethod(subModule, name, subModule[name], superModule[name]);
                            superModule = subModule;
                            index = i;
                        }
                    }
                }, len = modules.length,
                    module, handleProps = {};

                while (len--) {
                    module = modules[len];
                    for (var name in module) {
                        if (!handleProps[name]) {
                            typeof module[name] == "function" && bridge(len, name, module);
                            handleProps[name] = true;
                        }
                    }
                }
            },
            includeModules = function(subObejct, modules) {
                for (var i = 0, len = modules.length; i < len; i++) {
                    var superObejct = modules[i];
                    for (var name in superObejct) {
                        var superMethod = superObejct[name];
                        if (name == "include") {
                            continue;
                        }
                        if (!subObejct.hasOwnProperty(name)) {
                            subObejct[name] = superMethod;
                            //bridgeModuleMethod(subObejct, name, subObejct[name], superMethod);
                        }
                    }
                }
            },
            bridgeModuleMethod = function(subPrototype, name, subMethod, superMethod) {
                if (typeof superMethod == "function") {
                    //subPrototype["_" + name + "_"] = subMethod;
                    subMethod = wrap(subMethod, superMethod);
                }

                subPrototype[name] = subMethod;
            },
            addModules = function() {

            },
            wrap = function(method, superMethod, $super) {
                var reg = /\(\s*([^,\s\)]+)/,
                    firstParam = method && reg.test(method.toString()),
                    fp = false;
                if (firstParam && RegExp.$1 == "$super") {
                    fp = true;
                }

                return function() {
                    var params = [];
                    if (method == null) {
                        return superMethod.apply(this, arguments);
                    }

                    this.callSuper = $F.bind(this, superMethod);
                    $super && params.push(this.callSuper);
                    var res = method.apply(this, params.concat(Array.prototype.slice.apply(arguments)));
                    delete this.callSuper;
                    return res;
                };
            };

        return {
            "create": function() {
                return function() {
                    return this.initialize.apply(this, arguments);
                };
            },
            "Create": function(parent, extMethods, bSingleton) {
                $O.type(extMethods) == "boolean" && (bSingleton = extMethods);
                if (typeof parent != "function") {
                    extMethods = parent;
                    parent = Object;
                    //bSingleton = extMethods;
                }
                var klass = makeClass(parent, !! bSingleton),
                    superPrototype = klass.prototype;

                klass._MODULE_ = [];
                if ($O.type(extMethods) == "function") {
                    extMethods = extMethods.call(null);
                }
                var sType;
                while ((sType = $O.type(extMethods)) != "object") {
                    if (sType == "function") {
                        extMethods = extMethods.call(null);
                    } else {
                        throw "plain object !";
                    }
                }

                sortModules(null, extMethods, klass._MODULE_);
                if (!$O.isPlainObject(parent.prototype)) {
                    klass._MODULE_.push(parent.prototype);
                }
                bridgeModule(klass._MODULE_);
                includeModules(klass.prototype, klass._MODULE_);

                var PrivateMember = klass.prototype["PrivateMember"],
                    wrapPrivate;
                if ($O.isObject(PrivateMember)) {
                    invokeCount = 0; //invokeStack =[]，调前压，完后 弹也行   改 计数
                    wrapPrivate = function(method) {
                        return function() {
                            if (!invokeCount++) {
                                for (var prop in PrivateMember) {
                                    if (this[prop] != undefined) {
                                        throw prop + "in public and private";
                                    }
                                    this[prop] = PrivateMember[prop];
                                }
                            }
                            //invokeCount++;
                            var res = method.apply(this, Array.prototype.slice.apply(arguments));
                            //invokeCount--;
                            if (!--invokeCount) {
                                for (var prop in PrivateMember) {
                                    PrivateMember[prop] = this[prop];
                                    //this[prop] = undefined;
                                    delete this[prop];
                                }
                            }

                            return res;
                        };
                    };
                    delete klass.prototype["PrivateMember"];
                    for (var prop in klass.prototype) {
                        if (typeof klass.prototype[prop] == "function") {
                            klass.prototype[prop] = wrapPrivate(klass.prototype[prop]);
                        }
                    }
                }

                return klass;
                //$A.forEach(extMethods, function (value, name) {
                //    bridgeMethod(name, value, superPrototype[name], klass);
                //});
                //return klass;
            },
            "inherit": function(sub, parent) {
                sub.prototype = makeBridge(parent);
                sub.prototype.constructor = parent;

                sub.superclass = parent.prototype;
                if (parent.prototype.constructor == Object.prototype.constructor) {
                    parent.prototype.constructor = parent;
                }
            },
            "augment": function(receivingClass, givingClass) {
                if (arguments[2]) { // Only give certain methods.
                    for (var i = 2, len = arguments.length; i < len; i++) {
                        receivingClass.prototype[arguments[i]] = givingClass.prototype[arguments[i]];
                    }
                } else { // Give all methods.
                    for (methodName in givingClass.prototype) {
                        if (!receivingClass.prototype[methodName]) {
                            receivingClass.prototype[methodName] = givingClass.prototype[methodName];
                        }
                    }
                }
            }
        };
    })();

    framework.lang = (function() {
        var StringBuilder = function(sParam) {
            this.arrContent = [];
            this.count = 0;
        };

        StringBuilder.prototype = {
            prend: function(sParam, index) {
                if (index > -1 && index < this.arrContent.length) {
                    var arr = [index, 0];
                    if (sParam instanceof Array) {
                        arr.push(sParam);
                    }
                    arr = arr.concate(sParam);
                    this.count++;
                    Array.prototype.splice.call(this.arrContent, arr);
                }
                return this;
            },
            append: function(sParam) {
                this.count++;
                this.arrContent.push(sParam);
                return this;
            },
            appendFormat: function() {
                var arg = arguments,
                    l = arg.length,
                    i = 1,
                    reg = null;
                if (l > 1) {
                    for (i; i < l; i++) {
                        reg = new RegExp('\\{' + (i - 1) + '\\}', 'g', 'm');
                        arg[0] = arg[0].replace(reg, arg[i]);
                    }
                }
                this.count++;
                this.arrContent.push(arg[0]);
            },
            toString: function() {
                return this.arrContent.join("");
            },
            serialize: function() {
                return this.arrContent.join("");
            },
            clear: function() {
                this.count = 0;
                this.arrContent.length = 0;
                return this;
            },
            reverse: function() {
                return this.arrContent.reverse().join("");
            }
        };

        window.StringBuilder = StringBuilder;
        return {
            StringBuilder: StringBuilder
        };
    })();

    framework.object = (function() {
        var type = function(o) {
            if (o && o.nodeType != undefined) {
                if ((o.ownerDocument || o).documentElement.nodeName == "HTML") {
                    return "html";
                } else {
                    return "xml";
                }
            } else {
                return getType(o);
            }
        },
            getType = function(o) {
                var _t;
                return ((_t = typeof(o)) == "object" ? o == null && "null" || Object.prototype.toString.call(o).slice(8, -1) : _t).toLowerCase();
            },

            _extend = function(target, source, bDeep) { //默认为深度的
                var sType = "string",
                    i = 0,
                    prop;
                if (target == source) {
                    return;
                }
                if (bDeep) {
                    for (prop in source) {
                        sType = type(source[prop]);
                        switch (sType) {
                            case "object":
                                {
                                    type(target[prop]) != "object" && (target[prop] = {});
                                    source[prop] != target && _extend(target[prop], source[prop], bDeep);
                                    break;
                                }
                            case "array":
                                {
                                    type(target[prop]) != "array" && (target[prop] = []);
                                    source[prop] != target && _extend(target[prop], source[prop], bDeep);
                                    break;
                                }
                            case "xml":
                            case "html":
                                {
                                    target[prop] = source[prop].cloneNode(true);
                                    break;
                                }
                            default:
                                {
                                    target[prop] = source[prop];;
                                    break;
                                }
                        }
                    }
                } else {
                    for (prop in source) {
                        target[prop] = source[prop];
                    }
                }
                return target;
            };

        return {
            getType: getType,
            type: type,
            isUndefined: function(o) {
                return typeof o == "undefined";
            },
            isPlainObject: function(o) {
                if (type(o) == "object") {
                    for (var prop in o) {
                        if (o.hasOwnProperty(prop)) {
                            return false;
                        }
                    }
                    return true;
                } else {
                    return false;
                }
            },
            isNull: function(o) {
                return o === null;
            },
            isBoolean: function(o) {
                return 'Boolean' == toString.call(o).slice(8, -1);
            },
            isObject: function(o) { //null
                return o != null && 'Object' == toString.call(o).slice(8, -1);
            },
            isRegObject: function(o) { //null
                return o != null && 'RegExp' == toString.call(o).slice(8, -1);
            },
            create: Object.create || function(o) {
                var T = function() {};
                T.prototype = o;
                return new T();
            },
            clone: function(object, bIsDeep) {
                var obj = null,
                    key;
                if (bIsDeep === true) { //deep clone
                    sType = this.getType(object);
                    switch (sType) {
                        case 'object':
                            {
                                obj = {};
                                for (key in oType) {
                                    obj[key] = arguments.callee(object[key], bIsDeep); //原始类型会自动装箱
                                }
                                return obj;
                            }
                        case 'null':
                            {
                                return null;
                            }
                        case "array":
                            {
                                obj = [];
                                for (key in oType) {
                                    obj[key] = arguments.callee(object[key], bIsDeep); //原始类型会自动装箱
                                }
                                return obj;
                            }
                        case 'function':
                            {
                                obj = object;
                                return obj;
                            }
                        case 'string':
                            {
                                obj = object.toString();
                                return obj;
                            }
                        case 'undefined':
                        case 'number':
                        case 'boolean':
                            {
                                obj = object;
                                return obj;
                            }
                        default:
                            {
                                throw "type error!";
                            }
                    }
                } else { //shallow clone
                    var F = function() {};
                    F.prototype = object;
                    return new F();
                }
            },
            extend: function(target, source, bDeep) {
                var i = 0,
                    src = Array.prototype.slice.call(arguments);
                target = src.shift();
                bDeep = src[src.length - 1] === true;

                for (; i < src.length; i++) {
                    _extend.call(this, target, src[i], bDeep);
                }

                return target;
            },
            unextend: function(target, source) { //默认为深度的
                var i = 0,
                    src = Array.prototype.slice.call(arguments);
                target = src.shift();

                for (prop in source) {
                    if (prop in target) {
                        delete target[prop];
                    }
                }

                return target;
            },
            toJSON: function(obj) {
                var sb = new StringBuilder(),
                    sType = toString.call(obj).slice(8, -1);
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
                return sb.toString();
            }
        };
    })();

    framework.array = (function() {
        var arr = {
            isArray: function(obj) {
                return 'Array' == toString.call(obj).slice(8, -1);
            },
            makeArray: function(array) {
                var ret = [];
                if (array != null) {
                    var i = array.length;
                    if (i != undefined) {
                        while (i) {
                            ret[--i] = array[i];
                        }
                    } else {
                        ret.push(array);
                    }
                }
                return ret;
            },
            merge: function(first, second, sIndex, expand) { //[1].merge([2,[3,4]]); expand ? [1,2,3,4] :[1,2,[3,4]]
                var j = isNaN(sIndex) || sIndex < 0 ? 0 : sIndex; //是数字且>=0
                if (typeof second.length === "number") { //Object
                    if (!expand) {
                        first.concat(second);
                    } else {
                        for (var l = second.length; j < l; j++) {
                            if (typeof second[j] == "array") {
                                arguments[1] = second[j];
                                arguments[2] = 0;
                                arguments.callee.apply(this, arguments);
                            } else {
                                first.push(second[j]);
                            }
                        }
                    }
                } else {
                    while (second[j] !== undefined) {
                        first.push(second[j++]);
                    }
                }
                first.length = i;
                return first;
            }
        },
            each = function(obj, callback) {
                var key,
                    len;
                if (arr.isArray(obj)) {
                    for (key = 0, len = obj.length; key < len; key++) {
                        if (false === callback(obj[key], key, obj))
                            break;
                    }
                } else {
                    for (key in obj) {
                        if (false === callback(obj[key], key, obj))
                            break;
                    }
                }
            },
            extMethods = {
                indexOf: function(array, elt, from) {
                    if (array.indexOf) {
                        return isNaN(from) ? array.indexOf(elt) : array.indexOf(elt, from);
                    } else {
                        var len = array.length;
                        from = isNaN(from) ? 0 : from < 0 ? Math.ceil(from) + len : Math.floor(from);

                        for (; from < len; from++) {
                            if (array[from] === elt)
                                return from;
                        }
                        return -1;
                    }
                },
                clear: function() {
                    this.length = 0;
                },
                forEach: function(object, callback, scope) {
                    each(object, function() {
                        callback.apply(scope, arguments);
                    });
                },
                map: function(object, callback, scope) {
                    var ret = [];
                    each(object, function() {
                        ret.push(callback.apply(scope, arguments));
                    });
                    return ret;
                },
                filter: function(object, callback, scope) {
                    var ret = [];
                    each(object, function(item) {
                        callback.apply(scope, arguments) && ret.push(item);
                    });
                    return ret;
                },
                every: function(object, callback, scope) {
                    var ret = true;
                    each(object, function() {
                        if (!callback.apply(scope, arguments)) {
                            ret = false;
                            return false;
                        };
                    });
                    return ret;
                },
                some: function(object, callback, scope) {
                    var ret = false;
                    each(object, function() {
                        if (callback.apply(scope, arguments)) {
                            ret = true;
                            return false;
                        };
                    });
                    return ret;
                }
            };

        each(extMethods, function(value, key) {
            arr[key] = function(obj, callback, scope) {
                if (obj[key]) {
                    return obj[key](callback, scope);
                } else {
                    return value(obj, callback, scope);
                }
            };
        });
        return arr;
    })();

    framework.fn = (function() {
        return {
            isFunction: function(obj) {
                return 'Function' == toString.call(obj).slice(8, -1);
            },
            bind: function(obj, fn, arg1, arg2) {
                var args = [],
                    self = this;
                if (arguments.length > 2) {
                    args = Array.prototype.slice.call(arguments, 2);
                }

                return function() {
                    return fn.apply(obj, args.concat(Array.prototype.slice.call(arguments)));
                };
            },
            evtBind: function(obj, fn, arg1, arg2) {
                var args = [];
                if (arguments.length == 2) {
                    args = null;
                }
                if (arguments.length == 3) {
                    args = arg1;
                } else if (arguments.length > 3) {
                    args = Array.prototype.slice.call(arguments, 2);
                }
                return function(evt) {
                    evt = $E.formatEvent(evt);
                    evt.evtData = args;
                    fn.call(obj, evt);
                };
            },
            empty: function() {},
            throttle: function(callback, delay, scope, type) {
                var timeout_id, last_exec =  0, args = null, that = this;
                    exec = function () {
                        last_exec = +new Date();
                        callback.apply(scope || that, args);
                    },
                    clear = function () {
                        timeout_id = undefined;
                    },
                    thros = ({
                        "bounce" : function(){//mouse 移、拖动
                            timeout_id && clearTimeout(timeout_id);              
                            timeout_id = setTimeout( exec, delay);
                        },
                        "debounce" : function(elapsed){//button 重复点击
                            if (!timeout_id) {
                                exec();
                            }
                            timeout_id && clearTimeout(timeout_id);              
                            timeout_id = setTimeout( clear, delay);

                            /*  //效果不一样
                                if (!timeout_id) {
                                    exec();
                                    timeout_id = setTimeout( clear, delay);
                                } 
                                
                                //同上
                                if (!timeout_id || elapsed > delay) {
                                    exec();
                                    timeout_id && clearTimeout(timeout_id);              
                                    timeout_id = setTimeout( clear, delay );
                                } else {
                                    timeout_id && clearTimeout(timeout_id);              
                                    timeout_id = setTimeout( clear, delay - elapsed);
                                }          
                            */
                        },
                        "throttle": function(elapsed, first){
                            timeout_id && clearTimeout(timeout_id);
                            if (elapsed > delay) {
                                exec();
                            } else {             
                                timeout_id = setTimeout( exec, delay - elapsed);
                            }
                        }
                    })[type || "bounce"];

                return thros && function(){
                    args = arguments;
                    that = this

                    thros(+new Date() - last_exec, !last_exec);
                };
            },
            chain: function(obj) {}
        };
    })();

    framework.string = (function() {
        return {
            isString: function(obj) {
                return 'String' == toString.call(source).slice(8, -1);
            },
            decodeHTML: function(sVal) {
                var str = String(source)
                    .replace(/&quot;/g, '"')
                    .replace(/&lt;/g, '<')
                    .replace(/&gt;/g, '>')
                    .replace(/&amp;/g, "&");
                //处理转义的中文和实体字符
                return str.replace(/&#([\d]+);/g, function(_0, _1) {
                    return String.fromCharCode(parseInt(_1, 10));
                });
            },
            encodeHTML: function(sVal) {
                return String(sVal)
                    .replace(/&/g, '&amp;')
                    .replace(/</g, '&lt;')
                    .replace(/>/g, '&gt;')
                    .replace(/"/g, "&quot;")
                    .replace(/'/g, "&#39;");
            },
            formatColor: function(color) {
                if (reg1.test(color)) {
                    // #RRGGBB 直接返回
                    return color;
                } else if (reg2.test(color)) {
                    // 非IE中的 rgb(0, 0, 0)
                    color = "#";
                    for (var s, i = 1; i < 4; i++) {
                        s = parseInt(RegExp["\x24" + i]).toString(16);
                        color += ("00" + s).substr(s.length);
                    }
                    return color;
                } else if (/^\#[\da-f]{3}$/.test(color)) {
                    // 简写的颜色值: #F00
                    var s1 = color.charAt(1),
                        s2 = color.charAt(2),
                        s3 = color.charAt(3);
                    return "#" + s1 + s1 + s2 + s2 + s3 + s3;
                } else if (keyword[color])
                    return keyword[color];

                return "";
            },
            format: function(s) {
                for (var i = 1; i < arguments.length; i++) {
                    s = s.replace("{" + (i - 1) + "}", arguments[i]);
                }
                return s;
            },
            isNullOrEmpty: function(s) {
                if (s == null || s.length == 0) {
                    return true;
                }
                return false;
            },
            trim: function(sVal) {
                return sVal.replace(/^\s*|\s*$/g, '');
            },
            trimEnd: function() {
                return sVal.replace(/\s+$/, '');
            },
            trimStart: function() {
                return sVal.replace(/^\s+/, '');
            },
            startsWith: function(src, pattern) {
                return src.lastIndexOf(pattern, 0) === 0;
            },
            endsWith: function(sVal, pattern) {
                var d = sVal.length - pattern.length;
                return d >= 0 && sVal.indexOf(pattern, d) === d;
            },
            remove: function(sValue, bGlobal) {},
            removeFrom: function(sVal, iPos, iCount) {
                if (iPos + iCount - 1 < sVal.length) {
                    var arr = this.toArray();
                    arr.split(iPos, iCount);
                    return arr.join();
                }
            },
            toArray: function() {
                return sVal.split("");
            },
            capitalize: function(sVal) {
                return framework.string.trim(sVal).replace(/^(\w)/, function(match) {
                    return match.toUpperCase();
                });
            },
            camelize: function(sVal) {
                return sVal.replace(/-+(.)?/g, function(match, chr) {
                    return chr ? chr.toUpperCase() : '';
                });
            }
        };
    })();

    framework.number = (function() {
        return {
            isNumber: function(obj) {
                return 'Number' == toString.call(obj).slice(8, -1);
            },
            format: function(source, length) {},
            random: function(min, max) {
                return Math.floor(Math.random() * (max - min + 1) + min);
            }
        };
    })();

    framework.date = (function() {
        return {
            isDate: function(o) {
                // return o instanceof Date;
                return Object.prototype.toString.call(o) === "[object Date]";
            },
            format: function(source, pattern) {
                if ('string' != typeof pattern) {
                    return source.toString();
                }

                function replacer(patternPart, result) {
                    pattern = pattern.replace(patternPart, result);
                }

                var pad = framework.number.pad,
                    year = source.getFullYear(),
                    month = source.getMonth() + 1,
                    date2 = source.getDate(),
                    hours = source.getHours(),
                    minutes = source.getMinutes(),
                    seconds = source.getSeconds();

                replacer(/yyyy/g, pad(year, 4));
                replacer(/yy/g, pad(year.toString().slice(2), 2));
                replacer(/MM/g, pad(month, 2));
                replacer(/M/g, month);
                replacer(/dd/g, pad(date2, 2));
                replacer(/d/g, date2);

                replacer(/HH/g, pad(hours, 2));
                replacer(/H/g, hours);
                replacer(/hh/g, pad(hours % 12, 2));
                replacer(/h/g, hours % 12);
                replacer(/mm/g, pad(minutes, 2));
                replacer(/m/g, minutes);
                replacer(/ss/g, pad(seconds, 2));
                replacer(/s/g, seconds);

                return pattern;
            },

            parse: function(source) {
                var reg = new RegExp("^\\d+(\\-|\\/)\\d+(\\-|\\/)\\d+\x24");
                if ('string' == typeof source) {
                    if (reg.test(source) || isNaN(Date.parse(source))) {
                        var d = source.split(/ |T/),
                            d1 = d.length > 1 ? d[1].split(/[^\d]/) : [0, 0, 0],
                            d0 = d[0].split(/[^\d]/);
                        return new Date(d0[0] - 0,
                            d0[1] - 1,
                            d0[2] - 0,
                            d1[0] - 0,
                            d1[1] - 0,
                            d1[2] - 0);
                    } else {
                        return new Date(source);
                    }
                }

                return new Date();
            }
        };
    })();

    framework.browser = (function(ua) {
        var b = {
            msie: /msie/.test(ua) && !/opera/.test(ua),
            opera: /opera/.test(ua),
            safari: /webkit/.test(ua) && !/chrome/.test(ua),
            firefox: /firefox/.test(ua),
            chrome: /chrome/.test(ua)
        };
        var vMark = "";
        for (var i in b) {
            if (b[i]) {
                vMark = "safari" == i ? "version" : i;
                break;
            }
        }
        b.version = vMark && RegExp("(?:" + vMark + ")[\\/: ]([\\d.]+)").test(ua) ? RegExp.$1 : "0";

        b.ie = b.msie;
        b.ie6 = b.msie && parseInt(b.version, 10) == 6;
        b.ie7 = b.msie && parseInt(b.version, 10) == 7;
        b.ie8 = b.msie && parseInt(b.version, 10) == 8;
        b.ie9 = b.msie && parseInt(b.version, 10) == 9;

        return b;
    })(window.navigator.userAgent.toLowerCase());

    framework.url = (function(url) {
        var i = url.indexOf("?"),
            oParam = {}, key = "",
            value = "",
            temp = "",
            len, count = 0,
            state = 0,
            chr,
            stateStack = {
                state: [],
                pushState1: function(state) {
                    this.state.push(state);
                },
                preState: function(i) {
                    i = i || 1;
                    return this.state[this.state.length - i];
                },
                pushState: function(state) {
                    if (state != this.preState()) {
                        this.state.push(state);
                    }
                },
                reInitial: function(state) {
                    this.state.length = 0;
                    state != undefined && (this.state[0] = state);
                }
            }, readChar = function() {
                return i < len ? url.charAt(i++) : null;
            };

        if (i++ > -1) {
            url = url + "&";
            len = url.length;
            stateStack.reInitial(2);
            while (state != -1) {
                switch (state) {
                    case 0: //"letter digitl":
                        {
                            chr = readChar();
                            if (chr == null) {
                                state = -1;
                            } else if (chr == "&") {
                                state = 2;
                            } else if (chr == "=") {
                                state = 1;
                            } else {
                                temp += chr;
                            }
                            stateStack.pushState(0);
                            break;
                        }
                    case 1: //"="
                        {
                            if (stateStack.preState(2) == 2) {
                                key = temp;
                                temp = "";
                            } else {
                                temp += chr;
                            }
                            stateStack.pushState(1);
                            state = 0;
                            break;
                        }
                    case 2: //"&":
                        {
                            count++;
                            if (key == "") { //?123
                                key = "param" + count;
                            }
                            value = temp;
                            oParam[key.toLowerCase()] = value;
                            temp = "";
                            stateStack.reInitial(2);
                            state = 0;

                            break;
                        }
                    default:
                        {
                            state = -1;
                            break;
                        }
                }
            }
            oParam.Count = count;
        }

        return {
            params: oParam,
            encode: function(string) {
                if (typeof encodeURIComponent == 'function') {
                    string = encodeURIComponent(string);
                } else if (typeof escape == 'function') {
                    string = escape(string);
                }
                return string;
            },
            decode: function(string) {
                if (typeof decodeURIComponent == 'function') {
                    string = decodeURIComponent(string);
                } else if (typeof unescape == 'function') {
                    string = unescape(string);
                }
                return string;
            },
            utf8_encode: function(string) {
                string = string.replace("/\r\n/g", "\n");
                var utftext = "";

                for (var n = 0; n < string.length; n++) {
                    var c = string.charCodeAt(n);
                    if (c < 128) {
                        utftext += String.fromCharCode(c);
                    } else if ((c > 127) && (c < 2048)) {
                        utftext += String.fromCharCode((c >> 6) | 192);
                        utftext += String.fromCharCode((c & 63) | 128);
                    } else {
                        utftext += String.fromCharCode((c >> 12) | 224);
                        utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                        utftext += String.fromCharCode((c & 63) | 128);
                    }
                }
                return utftext;
            },
            utf8_decode: function(utftext) {
                var string = "";
                var i = 0;
                var c = c1 = c2 = 0;
                while (i < utftext.length) {
                    c = utftext.charCodeAt(i);
                    if (c < 128) {
                        string += String.fromCharCode(c);
                        i++;
                    } else if ((c > 191) && (c < 224)) {
                        c2 = utftext.charCodeAt(i + 1);
                        string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
                        i += 2;
                    } else {
                        c2 = utftext.charCodeAt(i + 1);
                        c3 = utftext.charCodeAt(i + 2);
                        string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
                        i += 3;
                    }
                }
                return string;
            },
            escapeSymbol: function(source) {
                return String(source).replace(/\%/g, "%25")
                    .replace(/&/g, "%26")
                    .replace(/\+/g, "%2B")
                    .replace(/\ /g, "%20")
                    .replace(/\//g, "%2F")
                    .replace(/\#/g, "%23")
                    .replace(/\=/g, "%3D");
            },
            getQueryValue: function(url, key) {
                var reg = new RegExp(
                    "(^|&|\\?|#)" + framework.string.escapeReg(key) + "=([^&]*)(&|\x24)",
                    "");
                var match = url.match(reg);
                if (match) {
                    return decodeURIComponent(match[2]);
                }
                return null;
            },
            getQuery: function(key) {
                return this.getQueryValue(window.location.href, key);
            }
        };
    })(window.location.search);

    framework.ajax = (function() {
        var rscript = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
            blankRE = /^\s*$/,
            settings = {
                timeout: -1,
                type: "get",
                async: false,
                start: null,
                beforeSend: null,
                success: null,
                error: null,
                complete: null,
                stop: null,
                statusCode: null,
                accepts: {
                    script: 'text/javascript, application/javascript',
                    json: "application/json",
                    xml: 'application/xml, text/xml',
                    html: "text/html",
                    text: 'text/plain'
                },
                crossDomain: false
            },
            ajaxBuilder,
            ajax;

        ajax = framework.Class.create();
        ajax.prototype = {
            initialize: function(url, options) {
                this.xhr = null;
                if (typeof url == "object") { // && typeof arguments[0] == "object") {
                    options = url;
                } else if (typeof options == "object") {
                    options.url = url;
                }

                this.setOptions(options);
            },
            setOptions: function(options) {
                this.options = {
                    type: "get",
                    url: "",
                    async: false,
                    context: document.body,
                    data: null,
                    success: null,
                    error: null,
                    complete: null,
                    beforeSend: null,
                    contentType: "text/xml", //"application/x-www-form-urlencoded", //发送的数据类型
                    processData: false,
                    dataType: "text", //返回的数据类型
                    timeout: null,
                    global: false,
                    retryCount: -1
                },

                $O.extend(this.options, options || {}, false);
            },
            setRequestHeader: function(sConType, sValue) {
                (this.xhr != null) && this.xhr.setRequestHeader(sConType, sValue);
                return this;
            },
            getAllResponseHeaders: function() {
                if (this.xhr && (this.xhr.readyState = 3 || this.xhr.readyState == 4)) {
                    return this.xhr.getAllResponseHeaders();
                }
                return null;
            },
            getResponseHeader: function(key) {},
            abort: function() {
                this.timer = null;
                if (this.xhr) {
                    this.xhr.onreadysteatechange = framework.fn.empty;
                    this.error || this.error.call(this.options.context, this.xhr, 'timeout');
                    return this.xhr.abort();

                }
                return this;
            },
            request: function() {
                var hasPlaceholder = false,
                    $F = framework.fn,
                    $O = framework.object,
                    data;
                if (this.options.url == "") {
                    return;
                }
                this.url = this.options.url;
                this.type = this.options.type || "get";
                this.async = !! this.options.async;
                this.data = this.options.data;
                this.dataType = this.options.dataType;
                this.contentType = this.options.contentType;
                this.processData = !! this.options.processData;
                this.timeout = isNaN(this.options.timeout) || this.options.timeout <= 0 ? -1 : this.options.timeout;

                this.beforeSend = $F.isFunction(this.options.beforeSend) ? this.options.beforeSend : null;
                this.success = $F.isFunction(this.options.success) ? this.options.success : null;
                this.error = $F.isFunction(this.options.error) ? this.options.error : null;
                this.complete = $F.isFunction(this.options.complete) ? this.options.complete : null;

                for (key in settings) {
                    if (this[key] == undefined) {
                        this[key] = settings[key];
                    }
                }!settings.start || settings.start(this.options);

                hasPlaceholder = this.url.lastIndexOf("=?") > -1; // (/=\?/.test(this.url));
                if (this.dataType == 'jsonp' || hasPlaceholder) {
                    if (!hasPlaceholder) {
                        this.url = this.url + '?callback=';
                    }
                    return ajaxBuilder.ajaxJSONP(this.url, this.success, this.error)
                }

                //this.xhr.overrideMimeType && this.xhr.overrideMimeType(mime)
                this.xhr = this.createXhrObject();
                this.xhr.onreadystatechange = framework.fn.bind(this, this.readystatechange);

                for (name in this.headers) {
                    this.setRequestHeader(name, this.headers[name])
                }
                // this.xhr.setRequestHeader("Content-Type", this.contentType); //aaaa5256066
                data = this.data;
                dataType = $O.type(this.data);
                if (this.processData || (dataType == "array" || dataType == "object")) {
                    data = ajaxBuilder.params(data);
                    this.contentType = "application/x-www-form-urlencoded";
                    //xhr.setRequestHeader("Content-length", params.length);
                    //this.setRequestHeader("Accept", "*/*");
                }

                if (this.type.toUpperCase() == 'GET' && typeof data == "string") {
                    var pos = this.url.indexOf("?", 0);
                    if (pos > -1) {
                        this.url = this.url.replece(/\?/, "?" + data + "&");
                    } else {
                        this.url += "?" + data;
                    }
                    this.contentType = "application/x-www-form-urlencoded";
                }
                this.xhr.open(this.type, this.url, this.async);
                this.xhr.setRequestHeader("Content-Type", this.contentType);

                if (this.beforeSend && this.beforeSend(this.xhr, this.options) === false) {
                    this.abort();
                    return false;
                }
                this.xhr.send(data);
                this.timeout > 0 && (this.timer = setTimeout(framework.fn.bind(this, this.abort)));
            },
            readystatechange: function() {
                var result,
                    context,
                    status,
                    dataType;
                // 0:  未初始化 尚未调用open 1: //启动 已经调用open 尚未调用send 2: //发送 已经调用send(), 但未响应 3: //接收 已经接收部分响应数据
                if (this.xhr.readyState == 4) {
                    !this.timer || (clearTimeout(this.timer), this.timer = null);
                    context = this.options.context,
                    status = this.xhr.status;
                    if ((status >= 200 && status < 300) || status == 304 || status == 1223) {
                        data = this.xhr.responseText;
                        dataType = this.dataType || mimeToDataType(this.xhr.getResponseHeader('content-type'));
                        try {
                            if (dataType == 'script') {
                                eval(result);
                            } else if (dataType == 'xml') {
                                result = this.xhr.responseXML;
                            } else if (dataType == 'json') {
                                result = blankRE.test(result) ? null : JSON ? JSON.parse(result) : eval("(" + data + ")")
                            }
                        } catch (e) {
                            this.error && this.error.call(context, this.xhr, e);
                        }

                        this.success && this.success.call(context, this.xhr, result);
                    } else {
                        this.error && this.error.call(context, this.xhr, this.xhr.statusText);
                    }

                    this.complete && this.complete.call(context, this.xhr);
                }
            },
            mimeToDataType: function(mime) {
                var scriptTypeRE = /^(?:text|application)\/javascript/i,
                    xmlTypeRE = /^(?:text|application)\/xml/i,
                    jsonType = 'application/json',
                    htmlType = 'text/html';

                return mime && (mime == htmlType ? 'html' :
                    mime == jsonType ? 'json' :
                    scriptTypeRE.test(mime) ? 'script' :
                    xmlTypeRE.test(mime) && 'xml') || 'text';
            },
            createXhrObject: function() { // Factory method.
                var methods = [

                    function() {
                        return new XMLHttpRequest();
                    },
                    function() {
                        return new ActiveXObject('Msxml2.XMLHTTP');
                    },
                    function() {
                        return new ActiveXObject('Microsoft.XMLHTTP');
                    }
                ];

                for (var i = 0, len = methods.length; i < len; i++) {
                    try {
                        methods[i]();
                    } catch (e) {
                        continue;
                    }
                    // If we reach this point, method[i] worked.
                    this.createXhrObject = methods[i]; // Memoize the method.
                    return methods[i]();
                }

                // If we reach this point, none of the methods worked.
                throw new Error('AjaxHandler: Could not create an XHR object.');
            }
        };

        ajaxBuilder = function(options) {
            (new ajax(options)).request();
        };

        ajaxBuilder.post = function(url, data, success, dataType) {
            typeof data == "function" && (success = data, data = null);
            (new ajax({
                type: "post",
                url: url,
                async: false,
                context: document.body,
                data: data,
                success: success,
                dataType: dataType
            })).request();
        };
        ajaxBuilder.get = function(url, data, success, dataType) {
            (new ajax({
                type: "get",
                url: url,
                async: false,
                context: document.body,
                data: data,
                success: success,
                dataType: dataType
            })).request();
        };
        ajaxBuilder.jsonp = function(url, success, error) {
            var callbackName = 'jsonp' + (++jsonpID),
                script = document.createElement('script'),
                abort = function() {
                    script.prarentNode.removeChild(script);
                    if (callbackName in window)
                        window[callbackName] = empty;
                    ajaxComplete('abort', xhr, options);
                },
                xhr = {
                    abort: abort
                },
                abortTimeout;

            if (error)
                script.onerror = function() {
                    xhr.abort();
                    error();
                };

            window[callbackName] = function(data) {
                clearTimeout(abortTimeout);
                script.prarentNode.removeChild(script);
                delete window[callbackName];
                !success || success(data, xhr, options);
            };

            document.getElementsByTagName('head')[0].append(script);

            if (options.timeout > 0)
                abortTimeout = setTimeout(function() {
                    xhr.abort();
                    ajaxComplete('timeout', xhr, options);
                }, options.timeout);

            return xhr;
        };
        ajaxBuilder.globalSetup = function(options) {
            for (var prop in optinos) {
                settings[prop] = options[prop];
            }
        };

        ajaxBuilder.params = function(object, name) {
            var O = framework.object,
                type = O.getType(object),
                prop,
                ret = [],
                i,
                len,
                valType;
            name = name || "";
            if (type == "object") {
                for (prop in object) {
                    if ((valType = O.getType(object[prop])) == "object" || valType == "array") {
                        ret.push(ajaxBuilder.params(object[prop], name == "" ? prop : name + "_" + prop));
                    } else {
                        ret.push(name == "" ? prop + "=" + object[prop] : name + "_" + prop + "=" + object[prop]);
                    }
                }
            } else if (type == "array") {
                for (i = 0, len = object.length; i < len; i++) {
                    if ((valType = O.getType(object[i])) == "object" || valType == "array") {
                        ret.push(ajaxBuilder.params(object[i], name == "" ? i : name + "_" + i));
                    } else {
                        ret.push(name == "" ? i + "=" + object[i] : name + "_" + i + "=" + object[i]);
                    }
                }
            }
            return ret.join("&");
        },
        ajaxBuilder.ajaxSetting = ajax.prototype;
        framework.array.forEach(settings, function(prop, val) {
            ajaxBuilder[prop] = function(param) {
                if (typeof param == "undefined") {
                    return settings[prop];
                } else {
                    settings[prop] = param;
                }
            };
        });

        return ajaxBuilder;
    })();
    framework.ajaxQueue = (function() {
        var createObserver = function() {
            return {
                fns: [],
                subscribe: function(fn) {
                    this.fns.push(fn);
                },
                unsubscribe: function(fn) {
                    this.fns = this.fns.filter(
                        function(el) {
                            if (el !== fn) {
                                return el;
                            }
                        });
                },
                fire: function(o) {
                    this.fns.forEach(
                        function(el) {
                            el(o);
                        });
                }
            };
        };
        return function() {
            var Queue = $C.create();
            Queue.prototype = {
                initialize: function() {
                    var ons = ["onComplete", "onFailure", "onFlush"],
                        i = 0;
                    this.queue = [];
                    this.setOptions();
                    this.onComplete = createObserver();
                    for (; i < ons.length; i++) {
                        this[ons[i]] = createObserver();
                        this.setOptions[ons[i]].each(function(item, index) {
                            this[ons[i]].subscribe(item);
                        });
                    }
                    this.conn = {};
                    this.timer = {};
                    this.currentRetry = 0;
                },
                setOptions: function(options) {
                    this.options = {
                        retryCount: 3,
                        paused: false,
                        timeout: 5000,
                        onComplete: [

                            function() {}

                        ],
                        onFailure: [

                            function() {}

                        ],
                        onFlush: [

                            function() {}

                        ]
                    },

                    sdk.object.extend(this.options, options || {});
                },
                flush: function() {
                    if (!this.queue.length > 0) {
                        return;
                    }
                    if (this.options["paused"]) {
                        this.options["paused"] = false;
                        return;
                    }
                    var that = this;
                    this.currentRetry++;
                    var abort = function() {
                        that.conn.abort();
                        if (that.currentRetry == that.retryCount) {
                            that.onFailure.fire();
                            that.currentRetry = 0;
                        } else {
                            that.flush();
                        }
                    };
                    this.timer = window.setTimeout(abort, this.timeout);
                    var callback = function(o) {
                        window.clearTimeout(that.timer);
                        that.currentRetry = 0;
                        that.queue.shift();
                        that.onFlush.fire(o.responseText);
                        if (that.queue.length == 0) {
                            that.onComplete.fire();
                            return;
                        }
                        // recursive call to flush
                        that.flush();
                    };
                    this.conn = sfk.asyncRequest(this.queue[0]['method'], this.queue[0]['uri'], callback, this.queue[0]['params']);
                },
                setRetryCount: function(count) {
                    this.options["retryCount"] = count;
                },
                setTimeout: function(time) {
                    this.options["timeout"] = time;
                },
                add: function(o) {
                    this.queue.push(o);
                },
                pause: function() {
                    this.options["paused"] = true;
                },
                dequeue: function() {
                    this.queue.pop();
                },
                clear: function() {
                    this.queue = [];
                }
            };

            return new Queue();
        };
    })();

    framework.cookie = (function() {
        return {
            "get": function(sName) {
                var aCookie = document.cookie.split(";");
                for (var i = 0; i < aCookie.length; i++) {
                    var aCrumb = aCookie[i].split("=");
                    if (sName == aCrumb[0] || aCrumb[0] == ' ' + sName)
                        return unescape(aCrumb[1]);
                }
                return 0;
            },
            "set": function(sName, sValue) {
                var exp = "Mon, 31 Dec 2010 23:59:59 UTC";
                if (!sValue || sValue.length == "")
                    exp = "01-Jan-80 00:00:01 GMT"; // remove cookie
                document.cookie = sName + "=" + escape(sValue) + "; expires=" + exp + "; path=/;";
            },
            "delete": function(sName) {
                var date = new Date();
                date.setTime(date.getTime() - 1);
                var cval = GetCookie(sName);
                if (cval != null)
                    document.cookie = sName + "=" + cval + ";expires=" + date.toGMTString();
            }
        };
    })();

    framework.xml = (function() {
        var XmlDocument = window.XmlDocument = function(sXml) {
            if (!(this instanceof XmlDocument)) {
                return new XmlDocument(sXml);
            }
            if (typeof sXml == "string") {
                this.xmlDoc = XmlDocument.create(sXml);
                this.length = 0;
            } else if (XmlDocument.isXML(sXml)) {
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
        XmlDocument.prototype = {
            constructor: XmlDocument,
            selectSingleNode: function(expression, context, namespaces) {
                var that = this.clone();
                that.removeTo(0);
                var doc = (context.nodeType != 9 ? context.ownerDocument : context);
                if (typeof doc.evaluate != "undefined") {
                    var nsresolver = null;
                    if (namespaces instanceof Object) {
                        nsresolver = function(prefix) {
                            return namespaces[prefix];
                        };
                    }

                    var result = doc.evaluate(expression, context, nsresolver, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
                    return (result !== null ? result.singleNodeValue : null);
                } else if (typeof context.selectSingleNode != "undefined") {
                    if (namespaces instanceof Object) {
                        var ns = "";
                        for (var prefix in namespaces) {
                            if (namespaces.hasOwnProperty(prefix)) {
                                ns += "xmlns:" + prefix + "='" + namespaces[prefix] + "' ";
                            }
                        }
                        doc.setProperty("SelectionNamespaces", ns);
                    }
                    return context.selectSingleNode(expression);
                } else {
                    throw new Error("No XPath engine found.");
                }

                var firstNode = null;

                if ($B.msie)
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
            selectNodes: function(xPathString, contextNode) {
                var that = this.clone();
                that.removeTo(0);
                if (typeof contextNode == 'undefined' || contextNode == null) {
                    if (that.xmlDoc != undefined && that.xmlDoc.documentElement != null) {
                        contextNode = that.xmlDoc.documentElement;
                    } else {
                        return that;
                    }
                }
                var nodeList;
                if ($B.msie) {
                    nodeList = contextNode.selectNodes(xPathString),
                    i = 0;
                    while (i < nodeList.length) {
                        that[i] = nodeList[i];
                        i++;
                    }
                } else {
                    var xPath = new XPathEvaluator();
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
            removeTo: function(index) {
                var len = typeof index == "number" && index < this.length ? 0 : index;
                for (var i = this.length - 1; i >= index; i--) {
                    delete this[i];
                }
                this.length = index;
            },
            get: function(index) {
                return index >= 0 && this.length > 0 ? this[index] : null;
            },
            getAttribute: function(name) {
                return this.length > 0 ? this.get(0).getAttribute(attr) : null;
            },
            setAttribute: function(name, val) {
                if (this.length > 0) {
                    this.get(0).setAttribute(name, val);
                    return this.clone();
                }
                throw "null";
            },
            firstChild: function() {
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
            lastChild: function() {
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
            childNodes: function() {
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
            hasChild: function() {
                if (this.length > 0) {
                    return this.get(0).childNodes.length > 0 ? true : false;
                }
                return false;
            },
            push: function(obj) {
                this.selectNode.push(obj);
            },
            text: function(arrIndex) {
                var s = "",
                    aTemp = arrIndex;
                if (this.length > 0) {
                    if (typeof aTemp == "number") {
                        aTemp = [aTemp];
                    } else if (typeof aTemp != "Array") {
                        aTemp = this;
                    }
                    for (var n = 0; n < aTemp.length; n++) {
                        (function(oNode) {
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
                        })(aTemp[n]);
                    }

                }
                return s;
            },
            xml: function(arrIndex) {
                var s = "",
                    aTemp = arrIndex;
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
            each: function(fn) {
                if (typeof fn == "function") {
                    for (var i = 0; i < this.length; i++) {
                        fn(this[i], i);
                    }
                }
            },
            clone: function() {
                return new this.constructor(this);
            }
        };

        XmlDocument.CreateMSXMLDocumentObject = function() {
            var xmlDOM = null;
            if (typeof ActiveXObject != "undefined") {
                var arrSignatures = ["Msxml2.DOMDocument.6.0", "Msxml2.DOMDocument.3.0", "MSXML.DOMDocument"];
                for (var i = 0, len = arrSignatures.length; i < len; i++) {
                    try {
                        xmlDOM = new ActiveXObject(arrSignatures[i]);
                        XmlDocument.CreateMSXMLDocumentObject = function(sXml) {
                            return new ActiveXObject(arrSignatures[i]);
                        };
                        break;
                    } catch (e) {
                        //ingnore
                    }
                }
            }
            //            else {
            //                xmlDOM = document.implementation.createDocument("", "", null); //Firefox, Mozilla, Opera, etc.
            //            }

            return xmlDOM;
        };
        XmlDocument.create = function(sXml) {
            return xmlDOMExt.loadXML(sXml);
        };
        //从这开始， 上面代码基本废弃啦只因兼容之前已写的代码！！！！
        var xmlDOMExt = {
            isXML: function(elem) {
                var documentElement = (elem ? elem.ownerDocument || elem : 0).documentElement;
                return documentElement ? documentElement.nodeName !== "HTML" : false;
            },
            getMSxmlAX: function() {
                var xmlDOM = null;
                if (typeof ActiveXObject != "undefined") {
                    var arrSignatures = ["Msxml2.DOMDocument.6.0", "Msxml2.DOMDocument.3.0", "MSXML.DOMDocument"];
                    for (var i = 0, len = arrSignatures.length; i < len; i++) {
                        try {
                            xmlDOM = new ActiveXObject(arrSignatures[i]);
                            xmlDOMExt.getMSxmlAX = function(sXml) {
                                return new ActiveXObject(arrSignatures[i]);
                            };
                            break;
                        } catch (e) {
                            //ingnore
                        }
                    }
                }
                return xmlDOM;
            },
            load: function(sPath) {
                var xmlDOM;
                if (framework.browser.chrome) {
                    var xhttp = new XMLHttpRequest();
                    xhttp.open("GET", sPath, false);
                    xhttp.send(null);
                    return xhttp.responseXML;
                } else if (typeof ActiveXObject != "undefined") {
                    xmlDOM = XmlDocument.CreateMSXMLDocumentObject();
                } else if (document.implementation) {
                    xmlDoc = document.implementation.createDocument("", "", null); //Firefox, Mozilla, Opera, etc.
                }
                xmlDOM.async = false;
                xmlDOM.load(sPath);
                return xmlDOM;
            },
            loadXML: function(sXml) {
                var xmlDOM;
                if (typeof ActiveXObject != "undefined") {
                    xmlDOM = XmlDocument.CreateMSXMLDocumentObject();
                    xmlDOM.loadXML(sXml || '<?xml version="1.0" encoding="utf-8"?><root></root>');
                    if (xmlDOM.parseError != 0) {
                        throw new Error("error:" + xmlDOM.parseError.reason);
                    }
                } else if (window.DOMParser) {
                    xmlDOM = (new DOMParser()).parseFromString(sXml || '<?xml version="1.0" encoding="utf-8"?><root></root>', "text/xml");
                    var errors = xmlDOM.getElementsByTagName("parseerror");
                    if (errors.length) {
                        throw new Error("error:" + errors[0].textContent);
                    }
                } else {
                    throw new Error("no support xml");
                }

                return xmlDOM;
            },
            createBase: function(sXml) {
                var sb = new StringBuilder();
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

                return xmlDOMExt.loadXML(sb.toString());
            },
            serializeXml: function(oNode) {
                return XMLSerializer ? (new XMLSerializer()).serializeToString(oNode, "texxt/xml") : oNode.xml;
            },
            selectNodes: function(xpathText, contextNode, namespaces) {
                var doc = (contextNode.nodeType != 9 ? contextNode.ownerDocument : contextNode),
                    nsresolver = null;
                if (typeof doc.evaluate != "undefined") {
                    //nsresolver = this.createNSResolver(this.documentElement);
                    if (namespaces instanceof Object) {
                        nsresolver = function(prefix) {
                            return namespaces[prefix];
                        };
                    }
                    //var oEvaluator = new XPathEvaluator(), oResult = oEvaluator.evaluate(sXPath, this, null,XPathResult.ORDERED_NODE_ITERATOR_TYPE, null),
                    var oResult = doc.evaluate(xpathText, contextNode, nsresolver, XPathResult.ORDERED_NODE_ITERATOR_TYPE, null),
                        aNodes = [],
                        oElement;

                    if (oResult != null) {
                        oElement = oResult.iterateNext();
                        while (oElement) {
                            aNodes.push(oElement);
                            oElement = oResult.iterateNext();
                        }
                    }
                    return aNodes;
                } else if (typeof contextNode.selectNodes != "undefined") {
                    if (namespaces instanceof Object) {
                        var ns = "";
                        for (var prefix in namespaces) {
                            if (namespaces.hasOwnProperty(prefix)) {
                                ns += "xmlns:" + prefix + "='" + namespaces[prefix] + "' ";
                            }
                        }
                        doc.setProperty("SelectionNamespaces", ns);
                    }
                    return context.selectNodes(xpathText);
                } else {
                    throw new Error("No XPath engine found.");
                }

            },
            selectSingleNode: function(xpathText, contextNode, namespaces) {
                var doc = (contextNode.nodeType != 9 ? contextNode.ownerDocument : contextNode),
                    nsresolver = null;
                if (typeof doc.evaluate != "undefined") {
                    //nsresolver = this.createNSResolver(this.documentElement);
                    if (namespaces instanceof Object) {
                        nsresolver = function(prefix) {
                            return namespaces[prefix];
                        };
                    }

                    var oResult = doc.evaluate(xpathText, contextNode, nsresolver, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
                    return oResult != null ? oResult.singleNodeValue : null;
                } else if (typeof contextNode.selectSingleNode != "undefined") {
                    if (namespaces instanceof Object) {
                        var ns = "";
                        for (var prefix in namespaces) {
                            if (namespaces.hasOwnProperty(prefix)) {
                                ns += "xmlns:" + prefix + "='" + namespaces[prefix] + "' ";
                            }
                        }
                        doc.setProperty("SelectionNamespaces", ns);
                    }
                    return context.selectSingleNode(xpathText);
                } else {
                    throw new Error("No XPath engine found.");
                }

            }
        };

        for (var prop in xmlDOMExt) {
            if (!XmlDocument[prop]) {
                XmlDocument[prop] = xmlDOMExt[prop];
            }
        }

        if (!framework.browser.msie) {
            XMLDocument.prototype.loadXML = function(sXml) {
                var parser = new DOMParser(),
                    i, len,
                    xmlDoc = parser.parseFromString(sXml, "text/xml");
                while (this.firstChild) {
                    this.removeChild(this.firstChild);
                }
                for (i = 0, len = xmlDoc.childNodes.length; i < len; i++) {
                    this.appendChild(this.importNode(xmlDoc.childNodes[i], true));
                }
            };

            //document.implementation.hasFeature("XPath", "3.0")
            // prototying the XMLDocument
            XMLDocument.prototype.selectNodes = Element.prototype.selectNodes = function(xpathText, contextNode, namespaces) {
                return xmlDOMExt.selectNodes(xpathText, this, namespaces);
            };
            XMLDocument.prototype.selectSingleNode = Element.prototype.selectSingleNode = function(xpathText, contextNode, namespaces) {
                return xmlDOMExt.selectSingleNode(xpathText, this, namespaces);
            };
            Node.prototype.__defineGetter__("xml", function() {
                return xmlDOMExt.serializeXml(this);
            });

            XMLDocument.prototype.__defineGetter__("text", function() {
                return this.firstChild.textContent;
            });

            Element.prototype.__defineGetter__("text", function() {
                return this.textContent;
            });
        }

        return XmlDocument;
    })();

    framework.loader = (function() {
        return {
            loadCSS: function(url) //加载CSS
            {
                var link = document.createElement('link');
                link.type = 'text/css';
                link.rel = 'stylesheet';
                link.href = url;
                document.getElementsByTagName('head')[0].appendChild(link);
            },
            /* loadJs(["a.js","b.js","c.js"],function() {alert("complete" + a + b + c); }); loadJs([{url: "a.js", charset: "", callback: function() {alert(a) } },null);*/
            "loadJS": (function() {
                var toString = toString,
                    defaultCharset = document.charset || document.characterSet || 'gb2312',
                    heHead = document.getElementsByTagName("head")[0],
                    oState = {}, guid = function() {};

                return function(urls, complete) {
                    toString.call(urls) != "[object Array]" && (urls = [urls]);
                    var count = 0,
                        i = 0,
                        len = urls.length,
                        script = null,
                        done = false,
                        load = function(i) {
                            var url = urls[i],
                                callback, charset = defaultCharset;
                            if (toString.call(url) == "[object Object]") {
                                callback = url.callback;
                                url.charset && (charset = url.charset);
                                url = url.url;
                            }
                            if (!url || !/\.js\s*$/i.test(url.toString())) {
                                urls.splice(i, 1);
                                len--;
                                i < len && load(i);
                                return;
                            }

                            var script = document.createElement('script');
                            script.type = 'text/javascript';
                            script.src = url;
                            script.charset = charset;
                            script.onload = script.onreadystatechange = script.onerror = function() {
                                if (script.readyState && /^(?!(?:loaded|complete)$)/.test(script.readyState)) return;

                                script.onload = script.onreadystatechange = script.onerror = null;
                                count++;

                                if (typeof callback == "function") {
                                    callback.call(script, url);
                                }
                                if (len == count && typeof complete == "function") {
                                    complete();
                                    return;
                                }
                                i < len && load(i + 1);
                            };

                            heHead.appendChild(script);
                        };

                    i < len && load(i);
                }
            })()
        };
    })();

    framework.element = (function() {
        var elemFn = {
            isElement: function(source) {
                return !!(source && source.nodeName && source.nodeType == 1);
            },
            contains: document.defaultView ? function(a, b) {
                return !!(a.compareDocumentPosition(b) & 16);
            } : function(a, b) {
                return a != b && a.contains(b);
            },
            position: function(el, relEle) {
                var iLeft = 0,
                    iTop = 0;
                relEle = relEle || document.body;
                do {
                    iLeft += el.offsetLeft;
                    iTop += el.offsetTop;
                } while ((el = el.offsetParent) && el != relEle);
                return {
                    left: iLeft,
                    top: iTop
                };
            },
            moveCenter: function(el, relEle, asChild) {
                var pos = $ET.getStyle(el, "position");
                if (pos == "fixed") { //一般只相对body
                    var pbdry = $P.viewSize(),
                        ps = $P.scroll();
                    el.style.top = ps.top + (pvs.height - el.offsetHeight) / 2 + "px";
                    el.style.left = ps.left + (pvs.width - el.offsetWidth) / 2 + "px";
                } else {
                    pos == "absolute" || (el.style.position = "absolute");
                    if (!relEle || relEle == document.body) { //el 的scrollWidth > relEle 暂时不考虑
                        document.body.contains(el) || document.body.appendChild(el);
                        var pvs = $P.viewSize();
                        el.style.top = (pvs.height - el.offsetHeight) / 2 + "px";
                        el.style.left = (pvs.width - el.offsetWidth) / 2 + "px";
                        return;
                    } else {
                        var rect = $ET.getRect(relEle);
                        $ET.setCSS(el, {
                            postion: "absolute",
                            top: rect.top + (rect.height - el.offsetHeight) / 2 + "px",
                            left: rect.left + (rect.width - el.offsetWidth) / 2 + "px"
                        });
                        var zIndex = $ET.getStyle(relEle, "zIndex") || 0;
                        el.style.zIndex = zIndex + 1;
                        asChild && relEle.appendChild(el);
                    }
                }
            },
            scroll: function(el, relEle) {
                var iLeft = 0,
                    iTop = 0;
                relEle = relEle || document.body;
                do {
                    iLeft += el.scrollLeft;
                    iTop += el.scrollTop;
                } while ((el = el.parentNode) && el != relEle);
                return {
                    left: iLeft,
                    top: iTop
                };
            },
            zoomFactor: function() { // always return 1, except at non-default zoom levels in IE before version 8
                var factor = 1;
                if (document.body.getBoundingClientRect) {
                    // rect is only in physical pixel size in IE before version 8
                    var rect = document.body.getBoundingClientRect();
                    var physicalW = rect.right - rect.left;
                    var logicalW = document.body.offsetWidth;

                    // the zoom level is always an integer percent value
                    factor = Math.round((physicalW / logicalW) * 100) / 100;
                }
                return factor;
            },
            getRect: function(el) {
                var offset, scrolled,
                    right, bottom, left, top,
                    width, height,
                    zoomFactor, rect;
                if (el.getBoundingClientRect) { // Internet Explorer, Firefox 3+, Google Chrome, Opera 9.5+, Safari 4+

                    rect = el.getBoundingClientRect();
                    return {
                        left: rect.left,
                        top: rect.top,
                        right: rect.right,
                        bottom: rect.bottom,
                        width: rect.width || (rect.right - rect.left),
                        height: rect.height || (rect.bottom - rect.top)
                    };

                    /*
                    if ($Browser.ie) {
                    // the bounding rectangle include the top and left borders of the client area
                    x -= document.documentElement.clientLeft;
                    y -= document.documentElement.clientTop;
                    zoomFactor = this.zoomFactor();
                    if (zoomFactor != 1) { // IE 7 at non-default zoom level
                    x = Math.round(x / zoomFactor);
                    y = Math.round(y / zoomFactor);
                    w = Math.round(w / zoomFactor);
                    h = Math.round(h / zoomFactor);
                    }
                    }
                    */
                } else { // older Firefox, Opera and Safari versions
                    var pos = elemFn.position(el);
                    scrolled = elemFn.scroll(el); // elemFn.scroll(el.parentNode, document.documentElement);
                    x = pos.left - scrolled.left;
                    y = pos.top - scrolled.top;
                    w = el.offsetWidth;
                    h = el.offsetHeight;
                    return {
                        left: x,
                        top: y,
                        right: x + w,
                        bottom: y + h,
                        width: w,
                        height: h
                    };
                }
            },
            size: function(elem) {
                var width = elem.offsetWidth,
                    height = elem.offsetHeight,
                    style,
                    cssBack;
                if (this.getStyle(elem, "display") == "none") {
                    style = elem.style,
                    cssBack = {
                        position: style.position,
                        visibility: style.visibility,
                        display: style.display,
                        left: style.left,
                        top: style.top
                    };
                    this.setStyle(elem, {
                        position: "absolute",
                        visibility: "hidden",
                        display: "block",
                        left: "-9999px",
                        top: "-9999px"
                    });
                    width = elem.offsetWidth;
                    height = elem.offsetHeight;
                    this.setStyle(elem, cssBack);
                }
                return {
                    "width": width,
                    "height": height
                };
            },
            viewSize: function(elem) {
                return {
                    "width": elem.clientWidth,
                    "height": elem.clientHeight
                };
            },
            textSize: function(text) {
                var span = document.createElement("span");
                var result = {};
                result.width = span.offsetWidth;
                result.height = span.offsetWidth;
                span.style.visibility = "hidden";
                document.body.appendChild(span);
                if (typeof span.textContent != "undefined")
                    span.textContent = text;
                else
                    span.innerText = text;
                result.width = span.offsetWidth - result.width;
                result.height = span.offsetHeight - result.height;
                span.parentNode.removeChild(span);
                return result;
            },
            addClass: function(el, clsName) {
                if (!this.hasClass(el, clsName)) {
                    el.className += (el.className == "" ? clsName : " " + clsName);
                }
            },
            hasClass: function(el, clsName) {
                return el.className.match(new RegExp('(\\s|^)' + clsName + '(\\s|$)'));
            },
            removeClass: function(el, clsName) {
                var reg = new RegExp('(\\s|^)' + clsName + '(\\s|$)');
                el.className = el.className.replace(reg, ' ');
            },
            toggleClass: function(el, clsName) {
                if (!this.hasClass(el, clsName)) {
                    el.className += " " + clsName;
                } else {
                    el.className = el.className.replace(new RegExp('(\\s|^)' + clsName + '(\\s|$)'), ' ');
                }
            },
            setStyle: function(elems, styles) {
                var prop,
                    css = styles;
                if ($O.isObject(styles) == "Object") {
                    css = "";
                    for (prop in styles) {
                        if (prop == "opacity" && $Browser.ie) {
                            css += "filter: alpha(opacity:" + styles["opacity"] * 100 + ");";
                        } else if (prop == "float") {
                            css += $Browser.ie ? "styleFloat" : "cssFloat" + ":" + styles["float"] + ";";
                        } else {
                            css += (prop = prop.replace(/([A-Z])/g, "-" + $1)) + ":" + styles[prop] + ";";
                        }
                    }
                }

                $A.forEach(elems, function(elem, index) {
                    elem.style.cssText += css;
                });
            },
            setCSS: function(elems, styles) {
                var prop;
                $A.isArray(elems) == "Array" || (elems = [elems]);
                $A.forEach(elems, function(elem, index) {
                    for (var prop in styles) {
                        switch (prop) {
                            case "opacity":
                                "opacity" in elem.style ? (elem.style[prop] = styles[prop]) : (elem.style.filter = "alpha(opacity:" + styles["opacity"] * 100 + ")");
                                break;
                            case "float":
                                elem.style["styleFloat" in elem.style ? "styleFloat" : "cssFloat"] = styles["float"];
                                break;
                            default:
                                elem.style[prop] = styles[prop];
                                break;
                        }
                    }
                    /*  for (prop in styles) {
                        if (prop == "opacity" && $B.ie) {
                            // prop in elem.style ? (elem.style[prop] = styles[prop]) :
                            (elem.style.filter = "alpha(opacity:" + styles["opacity"] * 100 + ")");
                        } else if (prop == "float") {
                            elem.style[$Browser.ie ? "styleFloat" : "cssFloat"] = styles["float"];
                        } else {
                            elem.style[prop] = styles[prop];
                        }
                    }*/
                });
            },
            getStyle: function(el, cssName) {
                var f, fv,
                    sty = window.getComputedStyle ? window.getComputedStyle(el, null) : el.currentStyle;
                switch (cssName) {
                    case undefined:
                        return sty;
                    case "opacity":
                        if ("opacity" in sty) {
                            return sty["opacity"];
                        }
                        f = el.filters;
                        f && f.length > 0 && f.alpha ? fv = f.alpha.opacity / 100 : fv = 1;
                        return fv;
                    case "float":
                        return sty["styleFloat" in elem.style ? "styleFloat" : "cssFloat"];
                        break;
                    case "border":
                        return sty[cssName] || el.style.border || ((sty = [sty["borderWidth"], sty["borderStyle"], sty["borderColor"]].join(" ")).length == 2 ? "" : sty);
                    default:
                        return sty[cssName];
                }
                /*
                var sty,
                    f,
                    fv;
                sty = window.getComputedStyle ? window.getComputedStyle(el, null) : el.currentStyle;
                if (cssName == undefined) {
                    return sty;
                }
                if (cssName == "opacity" && $Browser.ie) {
                    f = el.filters;
                    f && f.length > 0 && f.alpha ? fv = f.alpha.opacity / 100 : fv = 1;
                    return fv;
                }

                if (cssName == "float") {
                    cssName = $Browser.ie ? "styleFloat" : "cssFloat";
                }

                if (cssName == "border") {
                    return sty[cssName] || el.style.border || ((sty = [sty["borderWidth"], sty["borderStyle"], sty["borderColor"]].join(" ")).length == 2 ? "" : sty);
                }
                return sty[cssName];
                */
            },
            retCSS: function(el, styles) {
                for (var prop in styles) {
                    if (styles.hasOwnProperty(prop)) {
                        el.style[prop] = styles[prop];
                    }
                }
            },
            getStyleByPx: function(el, cssName) {
                var val = this.getStyle(el, cssName);
                if (/px/.test(val) && !isNaN(parseInt(val))) {
                    return parseInt(val);
                } else if (/\%/.test(val) && !isNaN(parseInt(val))) {
                    val = parseInt(val) / 100;
                    el = el.parentNode;
                    if (el.tagName == "BODY")
                        throw new Error("文档结构无尺寸，请使用其他方法获取尺寸.");
                    return val * arguments.callee.call(this, el, cssName);
                } else if (/auto/.test(val)) {
                    el = el.parentNode;
                    if (el.tagName == "BODY")
                        throw new Error("文档结构无尺寸，请使用其他方法获取尺寸.");
                    return arguments.callee.call(this, el, cssName);
                } else {
                    throw new Error("元素或其父元素的尺寸定义了特殊的单位.");
                }
            },
            previousElementSibling: function(oNode) {
                var ele = null;
                if ("previousElementSibling" in oNode) {
                    ele = oNode.previousElementSibling;
                } else {
                    ele = oNode.previousSibling;
                    while (ele && ele.nodeType != 1) {
                        ele = ele.previousSibling;
                    }
                }
                return ele;
            },
            nextElementSibling: function(oNode) {
                var ele = null;
                if ("nextElementSibling" in oNode) {
                    ele = oNode.nextElementSibling;
                } else {
                    ele = oNode.nextSibling;
                    while (ele && ele.nodeType != 1) {
                        ele = ele.nextSibling;
                    }
                }
                return ele;
            },
            firstElementChild: function(oNode, lev) {
                var ele = null;
                if ("firstElementChild" in oNode) {
                    ele = oNode.firstElementChild;
                } else {
                    ele = oNode.children[0];
                    while (ele && ele.nodeType != 1) {
                        ele = ele.nextSibling;
                    }
                }
                return ele;
            },
            lastElementChild: function(oNode) {
                var ele = null;
                if ("lastElementChild" in oNode) {
                    ele = oNode.lastElementChild;
                } else {
                    ele = oNode.children[oNode.children.length - 1]; //IE9 注释节点也在children中
                    while (ele && ele.nodeType != 1) {
                        ele = ele.previousSibling;
                    }
                }
                return ele;
            },
            text: function(ele, sValue) {
                if (ele) {
                    if (sValue == undefined) {
                        return "innerText" in ele ? ele.innerText :
                            "textContent" in ele ? ele.textContent : (function(ele) {
                                var text = "",
                                    node,
                                    i;
                                for (i = 0;
                                    (node = ele.childNodes[i]); i++) {
                                    switch (node.nodeType) {
                                        case 11: // document fragment
                                        case 1:
                                            text += arguments.callee(ele);
                                            break;
                                        case 3:
                                            text += node.nodeValue;
                                            break;
                                    }
                                }
                                return text;
                            })(ele);
                    } else {
                        ("innerText" in ele) ? ele.innerText = sValue : ele.textContent = sValue;
                    }
                }
            }
        };

        return elemFn;
    })();

    framework.cache = (function() {
        var unique = 2,
            cache = {},
            expando = 'sdk_cache',
            uuid = function(elem) {
                return elem == window ? 0 :
                    elem.nodeType == 9 ? 1 :
                    elem[expando] ? elem[expando] :
                    elem[expando] = unique++;
            },
            data = {
                data: function(elem, key, val) {
                    var index,
                        elemCache;
                    if (typeof elem == 'object') { //为HTMLNode对象，给其添加属性名值对
                        index = uuid(elem);
                        if (key == undefined) {
                            return cache[index];
                        }
                        elemCache = cache[index] || (cache[index] = {});
                        if (val != undefined) {
                            elemCache[key] = val;
                        }
                        return elemCache[key];
                    } else if (typeof elem == 'string') { //为string时，存键值对
                        if (key == undefined) {
                            return cache[elem];
                        }
                        cache[elem] = key;
                    }
                    return null;
                },
                remove: function(elem, key) {
                    var elemCache;
                    if (typeof elem == 'object') { //htmlElmeent
                        index = uuid(elem);
                        if (index != undefined) {
                            elemCache = cache[index];
                            key in elemCache && delete elemCache[key];
                            for (key in elemCache) {
                                return;
                            }
                            if (index < 2) {
                                return;
                            }
                            try {
                                delete elem[expando]; // IE8及标准浏览器可以直接使用delete来删除属性
                            } catch (e) {
                                elem.removeAttribute(expando); // IE6/IE7使用removeAttribute方法来删除属性(document会报错)
                            }
                        }
                    } else if (typeof elem == 'string') {
                        (elem in cache) && delete cache[elem];
                    }
                },
                get: function() {
                    return cache; //调试查看
                }
            };

        //framework.page(function () {
        //    $E.bind(window, "unload", {
        //        seq: "end",
        //        fn: function () {
        //            for (var prop in cache) {
        //                if ("unload" in cache[prop]) {
        //                    cache[prop].unload(); //删除事件绑定
        //                } else if ($O.getType(cache[prop]) === "object") {
        //                    arguments.callee(cache[prop]);
        //                }
        //           }
        //        }
        //    });
        //});

        return data;
    })();

    //event
    framework.event = (function(sdk) {
        var C = framework.cache,
            B = framework.browser,
            ET = framework.element,
            F = framework.fn,
            O = framework.object,
            A = framework.array;

        EventArg = function(evt) {
            var doc = window.document,
                k,
                item;
            for (k in evt) {
                item = evt[k];
                if ('function' != typeof item) {
                    this[k] = item;
                }
            }
            this._event = evt;
            this.fix(doc);
        },
        Event = function(elem, type, handler, capture) {
            this.elem = elem;
            this.type = type;
            this.data = [handler];
            this.capture = capture || false;
            this.init();
        };

        EventArg.prototype = {
            constructor: EventArg,
            fix: function(doc) {
                if (B.firefox && this.type == "DOMMouseScroll") {
                    this.wheelDelta = -40 * this.detail;
                }
                if (!this.target) { //$Brower.ie
                    this.target = this.srcElement || doc;
                    this.eventPhase = 2;
                    this.charCode = (this.type == "keypress") ? this.keyCode : 0;
                    this.isChar = (this.charCode > 0);
                    this.pageX = this.clientX + (doc.body.scrollLeft || doc.documentElement.scrollLeft);
                    this.pageY = this.clientY + (doc.body.scrollTop || doc.documentElement.scrollTop);
                    this.time = (new Date).getTime();
                    if (!("relatedTarget" in this)) {
                        this.type == "mouseover" && (this.relatedTarget = this.fromElemene);
                        this.type == "mouseout" && (this.relatedTarget = this.toElement);
                    }
                }
            },
            get: function(name) {
                var arg;
                if (typeof name == "function") {
                    return name in this ? this[name]() : this._event[name]();
                    //arg = Array.prototype.slice(1, arguments);
                    //return name in this ? this[name].apply(null, arg) : this._event[name].apply(null, arg);
                } else {
                    return name in this ? this[name] : this._event[name];
                }
            },
            preventDefault: function() {
                if (this._event.preventDefault) {
                    this._event.preventDefault();
                } else {
                    this._event.returnValue = false;
                }
                return this;
            },
            stopPropagation: function() {
                if (this._event.stopPropagation) {
                    this._event.stopPropagation();
                } else {
                    this._event.cancelBubble = true;
                }
                return this;
            },
            stop: function() {
                return this.stopPropagation().preventDefault();
            },
            getMouseRelPos: function() {
                //鼠标相对触发事件的元素（从其外边框算起）的坐标；
                var x = 0,
                    y = 0,
                    position = "static",
                    oTarget = this.target;
                if (B.ie) { //ie的offsetX 是从内容算起的，如果鼠标在边框上会负值
                    x = this.offsetX + oTarget.clientLeft;
                    y = this.offsetY + oTarget.clientTop;
                } else if (B.chrome) {
                    if (oTarget.nodeName.toLowerCase() == "td") {
                        x = this.offsetX;
                        y = this.offsetY;
                    } else {
                        position = ET.getStyle(oTarget, "position");
                        if (position != "relative" && position != "absolute") {
                            x = this.layerX - oTarget.offsetLeft - oTarget.offsetParent.clientLeft;
                            y = this.layerY - oTarget.offsetTop - oTarget.offsetParent.clientTop;
                        } else {
                            x = this.layerX;
                            y = this.layerY;
                        }
                    }
                } else if (B.firefox) {
                    position = ET.getStyle(oTarget, "position");
                    if (position != "relative" && position != "absolute") {
                        x = this.layerX - oTarget.offsetLeft - oTarget.offsetParent.clientLeft;
                        y = this.layerY - oTarget.offsetTop - oTarget.offsetParent.clientTop;
                    } else {
                        x = this.layerX;
                        y = this.layerY;
                    }
                }
                return {
                    left: x,
                    top: y
                };
            },
            getMousePagePos: function() {
                var posx = 0,
                    posy = 0;
                if (B.ie) {
                    posx = this.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
                    posy = this.clientY + document.body.scrollTop + document.documentElement.scrollTop;
                } else {
                    posx = this.pageX;
                    posy = this.pageY;
                }

                return {
                    x: posx,
                    y: posy
                };
            }
        };

        Event.prototype = {
            init: function() {
                this.timer = null;
                this._bindListener = F.bind(this, this.listener);
                Event.addEvent(this.elem, this.type, this._bindListener, this.capture);
            },
            listener: function(evt) {
                var _this = this;
                evt = this.fixEventArg(evt || window.event);
                if (evt.target == document || evt.target == window && evt.type == "resize") {
                    if (this.timer) {
                        clearTimeout(this.timer);
                        this.timer = null;
                    }
                    this.timer = setTimeout(function() {
                        _this.invoke(evt);
                    }, 100);
                } else {
                    this.invoke(evt);
                }
            },
            fixEventArg: function(evt) {
                if (!(evt instanceof EventArg)) {
                    return new EventArg(evt);
                }
                return evt;
            },
            invoke: function(evt) {
                var args = [evt],
                    scope = this.elem,
                    data = this.data,
                    i = -1,
                    ret,
                    fn,
                    scrFn,
                    one = false;
                while (++i < data.length) {
                    fn = data[i];
                    if (typeof fn != "function") {
                        args[0].evtData = fn.data;
                        if (typeof fn.data == "array") {
                            args.concat(fn.data);
                        } else {
                            args.push(fn.data);
                        }
                        scope = fn.scope; // || scope;
                        one = fn.one;
                        fn = fn.fn;

                    }
                    ret = fn.apply(scope, args);
                    if (one) {
                        this.remove(fn, i);
                        i--;
                    }
                    if (ret === false) {
                        break;
                    }
                }
            },
            add: function(fn) {
                var type = O.getType(fn);
                if (type == "function" || type == "object") {
                    this.data.push(fn);
                }
            },
            remove: function(handler, index) {
                var i = -1,
                    fns = this.data,
                    len = fns.length,
                    curFn, remove = function(curFn, i) {
                        if (typeof handler == "function") {
                            curFn = typeof curFn != "function" ? curFn.fn : curFn;
                            if (handler == curFn) {
                                fns.splice(i, 1);
                                return true;
                            }
                        } else { //if (O.getType(handler) == "object")
                            if (handler == curFn || handler == curFn.fn) {
                                //curFn.fn = null;
                                fns.splice(i, 1);
                                return true;
                            }
                        }
                        return false;
                    };

                if (index) {
                    remove(fns[i], index);
                } else {
                    while (++i < len) {
                        if (remove(fns[i], i)) {
                            break;
                        }
                    }
                }

                if (fns.length == 0) {
                    this.unload();
                }
            },
            unload: function() {
                Event.removeEvent(this.elem, this.type, this._bindListener, this.capture);
                C.remove(this.elem, this.type); //从缓存中移除
            }
        };
        EventManager = {
            bind: function(elem, types, handler, capture) {
                var i, len, evtObj, type;
                A.isArray(types) || (types = [types]);
                for (i = 0, len = types.length; i < len; i++) {
                    type = types[i];
                    evtObj = C.data(elem, type);
                    if (!(evtObj instanceof Event)) {
                        evtObj = new Event(elem, type, handler, capture);
                        C.data(elem, type, evtObj);
                    } else {
                        evtObj.add(handler);
                    }
                }
            },
            on: function(elems, types, handler, scope, data, capture, one) {
                var i, len;
                if (scope != undefined || data != undefined) {
                    handler = {
                        "scope": scope,
                        "fn": handler,
                        "data": data
                    };
                }
                A.isArray(elems) || (elems = [elems]);
                for (i = 0, len = elems.length; i < len; i++) {
                    one && (handler.one = true);
                    EventManager.bind(elems[i], types, handler, capture);
                }
            },
            un: function(elem, type, handler, capture) {
                var i = 0,
                    len,
                    evtObj;
                elem = $A.isArray(elem) ? elem : [elem];
                len = elem.length;

                for (; i < len; i++) {
                    evtObj = C.data(elem[i], type);
                    evtObj.remove(handler);
                }
            },
            fire: (function() {
                var rkeys = /key/i,
                    rMouses = /(click)|(mouse)/i,
                    parameters = {
                        "KeyEvents": ["bubbles", "cancelable", "view", "ctrlKey", "altKey", "shiftKey", "metaKey", "keyCode", "charCode"],
                        "MouseEvents": ["bubbles", "cancelable", "view", "detail", "screenX", "screenY", "clientX", "clientY", "ctrlKey", "altKey", "shiftKey", "metaKey", "button", "relatedTarget"],
                        "HTMLEvents": ["bubbles", "cancelable"],
                        "UIEvents": ["bubbles", "cancelable", "view", "detail"],
                        "Events": ["bubbles", "cancelable"]
                    };
                return function(elem, type, options) {
                    var evnt,
                        evtTypeName,
                        evtObj;
                    options = O.extend({
                        bubbles: true, //允许冒泡
                        cancelable: true, //允许取消
                        view: window, //document.defaultView
                        detail: 1,
                        screenX: 0,
                        screenY: 0,
                        clientX: 0,
                        clientY: 0,
                        ctrlKey: false,
                        altKey: false,
                        shiftKey: false,
                        metaKey: false,
                        keyCode: 0,
                        charCode: 0,
                        button: 0,
                        relatedTarget: null
                    }, options || {});

                    function mapParameter(array, source) {
                        var i = 0,
                            size = array.length,
                            obj = [];
                        for (; i < size; i++) {
                            obj.push(source[array[i]]);
                        }
                        return obj;
                    }

                    if (rMouses.test(type)) {
                        evtTypeName = "MouseEvents";
                    } else if (rkeys.test(type)) {
                        evtTypeName = "KeyEvents";
                    } else {
                        evtTypeName = "HTMLEvents";
                    }

                    evnt = mapParameter(parameters[evtTypeName], options);
                    evnt.unshift(type);

                    if (document.createEvent) {
                        evtObj = document.createEvent(evtTypeName);
                        //var initFunc = ;
                        evtTypeName == "HTMLEvents" && (evtTypeName = "Events");
                        evtObj["init" + evtTypeName.slice(0, -1)].apply(evtObj, evnt);
                        // var params = evnt.join(",");
                        //(new Function("o, fn, params", "o[fn](params);"))(evtObj, initFunc, params);
                        elem.dispatchEvent(evtObj);
                    } else if (document.createEventObject) { //before ie 9
                        evtObj = document.createEventObject(window.event);
                        //evtObj.[screenX, screenY..]赋值一系列属性 fireEvent 调用后会自动加上srcElement  type 属性
                        elem.fireEvent("on" + type, evtObj);
                    }
                };
            })(),
            one: function(elem, type, handler, scope, data, capture) {
                EventManager.on(elem, type, handler, scope, data, capture, true);
            },
            argBind: function(scope, fn, data) {
                return function(evt) {
                    //if (!(evt instanceof EventArg)) {
                    //    evt = new EventArg(evt || window.event);
                    //}
                    evt.evtData = data;
                    fn.call(scope, evt);
                };
            }
        };
        Event.addEvent = function(o, evType, f, capture) {
            if (o == null) {
                return false;
            }
            if (o.addEventListener) {
                o.addEventListener(evType, f, capture || false);
                return true;
            } else if (o.attachEvent) {
                var r = o.attachEvent("on" + evType, f);
                return r;
            }
        };
        Event.removeEvent = function(o, evType, f, capture) {
            if (o == null) {
                return false;
            }
            if (o.removeEventListener) {
                o.removeEventListener(evType, f, capture || false);
                return true;
            } else if (o.detachEvent) {
                o.detachEvent("on" + evType, f);
            }
        };

        EventManager.unbind = EventManager.un;
        EventManager.addEvent = Event.addEvent;
        EventManager.removeEvent = Event.removeEvent;

        return EventManager;
    })();

    framework.page = (function() {
        var fns = [],
            finish = false,
            E = framework.event,
            page = function(fn, context) {
                fns.push({
                    fn: fn,
                    scope: context || window
                });;
            };

        page.dispatch = function() {
            if (!finish) {
                finish = true;
                framework.array.forEach(fns, function(item, key) {
                    item.fn.call(item.scope);
                });
            }
        };

        if (document.addEventListener) {
            document.addEventListener("DOMContentLoaded", function() {
                document.removeEventListener("DOMContentLoaded", arguments.callee, false);
                page.dispatch();

            }, false);
        } else if (document.attachEvent) {
            document.attachEvent("onreadystatechange", function() {
                if (document.readyState === "complete") {
                    document.detachEvent("onreadystatechange", arguments.callee);
                    page.dispatch();
                }
            });
        }
        E.on(window, "load", page.dispatch);

        (function() {
            if (!finish) {
                setTimeout(arguments.callee, 200);
                return;
            }
            if (/KHTML|WebKit/i.test(navigator.userAgent)) {
                if (/loaded|complete/.test(document.readyState)) {
                    page.dispatch();
                }
            }
        })();

        framework.object.extend(page, {
            ready: page,
            position: function() {
                var d = document;
                return {
                    left: window.pageXOffset || d.documentElement.scrollLeft || d.body.scrollLeft,
                    top: window.pageYOffset || d.documentElement.scrollTop || d.body.scrollTop
                };
            },
            scroll: function(dir, val) {
                var d = document;
                if (dir == "top") {
                    return window.pageYOffset || d.documentElement.scrollTop || d.body.scrollTop;
                } else if (dir == "left") {
                    return window.pageXOffset || d.documentElement.scrollLeft || d.body.scrollLeft;
                } else {
                    return {
                        left: window.pageXOffset || d.documentElement.scrollLeft || d.body.scrollLeft,
                        top: window.pageYOffset || d.documentElement.scrollTop || d.body.scrollTop
                    };
                }
            },
            size: function() {
                var client = doc.compatMode == 'BackCompat' ? document.body : document.documentElement;
                return {
                    width: client.scrollWidth,
                    height: client.scrollHeight
                };
            },
            viewSize: function() { //CSS1Compats tandards-compliant mode is switched on (also called "strict mode"),  BackCompat also called "quirks mode"  the document is displayed as it was displayed in previous versions of Internet Explorer.
                var client = doc.compatMode == 'BackCompat' ? document.body : document.documentElement;
                return {
                    width: client.clientWidth,
                    height: client.clientHeight
                };
            },
            boundary: function() {
                var pvs = page.viewSize(),
                    ps = page.scroll();
                return {
                    L: ps.left,
                    R: ps.left + pvs.width,
                    T: ps.top,
                    B: ps.top + pvs.height
                };
            },
            isStandardMode: function() {
                return document.compatMode != 'BackCompat';
            }
        });

        return page;
    })();

    framework.json = (function() {})();

    //querySelector;
    framework.query = (function() {
        var get = {
            byId: function(id) {
                return typeof id === "string" ? document.getElementById(id) : id;
            },
            byClass: function(sClass, oParent) {
                var aClass = [];
                var reClass = new RegExp("(^| )" + sClass + "( |$)");
                var aElem = this.byTagName("*", oParent);
                for (var i = 0; i < aElem.length; i++)
                    reClass.test(aElem[i].className) && aClass.push(aElem[i]);
                return aClass;
            },
            byTagName: function(elem, obj) {
                return (obj || document).getElementsByTagName(elem);
            }
        },
            selector = function(s) {
                return "string" == typeof s ? document.getElementById(s) : s;
            };

        return selector;
    })();

    framework.animate = (function() {
        return {

        };
    })();


    host = host || this,
    host.$C = framework.Class;
    host.$O = framework.object;
    host.$A = framework.array;
    host.$F = framework.fn;
    host.$Str = host.$SS = framework.string;
    host.$D = framework.date;

    host.$S = framework.cache; //storage

    host.$B = framework.browser;
    host.$U = framework.url;
    host.$CK = framework.cookie;

    host.$Q = framework.query;
    host.$X = framework.xml;
    host.$E = framework.event;
    host.$ET = framework.element; // element tag
    host.$L = framework.loader;
    host.$P = framework.page;

    host.$R = host.$Ajax = framework.ajax; //request
    host.$JSON = framework.json;

    host.$Animate = framework.animate;
})(window);



/*
framework.Class = window.Class = framework.Class || (function () {
var makeBridge = function (parent) {
var bridge = function () { }; //$F.empty();
bridge.prototype = parent.prototype;
return new bridge();
},
makeClass = function (parent) {
var constructor = function () {
return this.initialize ? this.initialize.apply(this, arguments) || this : this;
};
parent = parent || Object;
constructor.prototype = makeBridge(parent);
constructor.superclass = parent;
constructor.subclasses = [];
if (parent.subclasses)
parent.subclasses.push(constructor);

return constructor;
},
bridgeMethod = function (name, value, superMethod, subClass, isModule) {
if (typeof superMethod == "function") {
var reg = /\(\s*([^,\s\)]+)/, firstParam = reg.test(value.toString()),
fp = false,
method = value;
if (firstParam && RegExp.$1 == "$super") {
fp = true;
}
value = function () {
var params = [];
this.callSuper = $F.bind(this, superMethod); ;
fp && params.push(this.callSuper);
method.apply(this, params.concat(Array.prototype.slice.apply(arguments)));
}
}

subClass.prototype[name] = value; ;
},
includeModules = function (subObejct, superObejct, baseObject) {
if (superObejct.include) {
var include = superObejct.include, len = include.length;
while (len--) {
includeModules(superObejct, include[len], baseObject);
}
}
$A.forEach(superObejct, function (value, name) {
if (name == "include") {
return;
}
if (typeof value === "function") {
if (subObejct[name]) {
bridgeModuleMethod(name, subObejct[name], value, subObejct);
}

bridgeModuleMethod(name, baseObject[name], value, baseObject);
}
});
},
includeModule = function (subPrototype, superPrototype) {
var len = include.length;
while (len--) {
module = include[len];
if (module["include"]) {
includeModules(module["include"], module["include"], module);
}
$A.forEach(module, function (value, name) {
if (name == "include") {
return;
}
if (typeof value === "function") {
bridgeModuleMethod(name, superPrototype.hasOwnProperty(name) ? superPrototype[name] : null, value, subPrototype, true);
}
});

}
},
bridgeModuleMethod = function (name, value, superMethod, subPrototype) {
if (typeof superMethod == "function") {
var reg = /\(\s*([^,\s\)]+)/, firstParam = reg.test(value.toString()),
fp = false;
if (firstParam && RegExp.$1 == "$super") {
fp = true;
}

if (value && value._ADD_) {
value._ADD_(superMethod);
} else {
value = wrap(value, superMethod);
}
}

subPrototype[name] = value; ;
},
wrap = function (method, superMethod) {
var methods = method == null ? [] : [superMethod],
listener = function () {
if (method == null) {
superMethod.apply(this, arguments);
}
var len = methods.length, params = [];
this.includes = [];
while (i < len) {
this.includes.push($F.bind(this, methods[i]));
i++;
//methods[i].apply(this, params.concat(Array.prototype.slice.apply(arguments)));
}
if (len > 0) {
this.callSuper = $F.bind(this, this.includes[len - 1]);
fp && params.push(this.callSuper);
}
method.apply(this, params.concat(Array.prototype.slice.apply(arguments)));
delete this.includes;
delete this.callSuper;
};
listener._ADD_ = function (fn) {
methods.push(fn);
}

return listener;
};
return {
"create": function () {
return function () {
return this.initialize.apply(this, arguments);
}
},
"Create": function (parent, extMethods) {
if (typeof parent != "function") {
extMethods = parent;
parent = Object;
}

var klass = makeClass(parent),
superPrototype = klass.prototype, inc = extMethods["include"];

if (inc) {
includeModules(klass.prototype, extMethods);
return;
}

$A.forEach(extMethods, function (value, name) {
bridgeMethod(name, value, superPrototype[name], klass);
});

return klass;
}


bridgeModules = function (subObejct, superObejct, leaf) {
var curLeaf = null;
if (superObejct.include) {
var include = superObejct.include, len = include.length, temp = null;
while (len--) {
leaf = bridgeModules(superObejct, include[len], leaf);
}

} else {
curLeaf = superObejct;
}

if (leaf != null && curLeaf != null) {

}
$A.forEach(superObejct, function (value, name) {
if (typeof value === "function") {
if (subObejct[name] && !subObejct[name]._BRIDGE_) {
bridgeModuleMethod(name, subObejct[name], value, subObejct);
subObejct[name]._BRIDGE_ = true;
}
}
});
return curLeaf == null ? leaf : curLeaf;
},
includeModules = function (subObejct, superObejct) {
for (var name in superObejct) {
var value = superObejct[name];
if (name == "include") {
continue;
}
if (typeof value === "function") {
!subObejct[name] && bridgeModuleMethod(name, subObejct[name], value, subObejct);
}
}

if (superObejct.include) {
var include = superObejct.include, len = include.length;
while (len--) {
includeModules(subObejct, include[len]);
}
}
},
bridgeModuleMethod = function (name, value, superMethod, subPrototype) {
if (typeof superMethod == "function") {
value = wrap(value, superMethod);
}

subPrototype[name] = value; ;
},
wrap = function (method, superMethod, $super) {
var reg = /\(\s*([^,\s\)]+)/,
firstParam = method && reg.test(method.toString()),
fp = false;
if (firstParam && RegExp.$1 == "$super") {
fp = true;
}

return function () {
var params = [];
if (method == null) {
return superMethod.apply(this, arguments);
}

this.callSuper = $F.bind(this, superMethod);
$super && params.push(this.callSuper);
var res = method.apply(this, params.concat(Array.prototype.slice.apply(arguments)));
delete this.callSuper;
return res;
};
};

    // The Central Randomizer 1.3 (C) 1997 by Paul Houle (houle@msc.cornell.edu)
    // See:  http://www.msc.cornell.edu/~houle/JavaScript/randomizer.html
    // Usage: rand(n) returns random integer between 0 and n-1
    
    rnd.today = new Date();
    rnd.seed  = rnd.today.getTime();
    
    function rnd()
    {
        rnd.seed = (rnd.seed*9301+49297) % 233280;
        return rnd.seed/(233280.0);
    }
    
    function rand(number)
    {
        return Math.ceil(rnd()*number);
    }
    
    function doIt()
    {
        n = document.forms[0].num.value;
        r = rand(n);
        document.forms[0].res.value = r;
    }
*/

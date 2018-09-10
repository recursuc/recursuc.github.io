(function(exports){
    var slice = Array.prototype.slice,
        toString = Object.prototype.toString,
        hasOwnProperty = Object.prototype.hasOwnProperty,
        map = function(t, callback){
            var ret = [];
            for(var i=0, len = t.length;i<len;i++){
                ret[i] = callback(t[i], i);
            }
            return ret;
        },
        typeOf = function(o) {
            if(o === null ){ return "null"; }
            if(o === undefined ){ return "undefined"; }

            return toString.call(o).slice(8, -1).toLowerCase();
        },
        getField = function(o, name){
            if(!o || !name) { return ""; }
            
            var names = name.split(/\s*\.\s*/), i =0, len = names.length, obj = o;
            while(i<len && (obj = obj[ names[i++] ]) != undefined);
            if(i == len && obj !== undefined) {
                return obj;
            }else{
                return "";
            }
        },
        Empty = function() {},
        clone = function(o) {
            var F = function() {};
            F.prototype = o || {};

            return new F();
        },
        namespace = function(){
            var modules = {};

            return function(ns, _module_) {
                if(!ns ) {return Class.extend({}, modules); }
                if(!_module_) { return getField(modules, ns); }

                var m = modules,
                    i = 0,
                    aNS = ns.split(/\s*\.\s*/),
                    len;

                for (len = aNS.length - 1; i < len; i++) {
                    m = aNS[i] in m ? m[aNS[i]] : (m[aNS[i]] = {});
                }

                if (!m[aNS[len]]) {
                    m[aNS[len]] = _module_;
                }
                
                return _module_;
            }
        },
        Constructor = function(name, bSingle) {
            if( typeOf(name) != "string" ){
                bSingle = name;
                name = "init";
            }
            
            typeOf(bSingle) == "boolean" || ( bSingle = false );

            var  instance = null,
                _constructor = function() {
                    if (bSingle) {
                        if (instance) {
                            return instance;
                        }
                        instance = this;
                    }

                    if (!(this instanceof _constructor)) {
                        var a = slice.call(arguments, 0);

                        return (new Function("t,c", "return new c(" + map(a, function(val, index) {
                            return "t[" + index + "]";
                        }).join(",") + ");"))(a, _constructor);
                    }

                    if (this.__constructor) {
                        this.Super.__constructor && this.Super.__constructor.apply(this, arguments);
                        this.__constructor.apply(this, arguments);

                        return this;
                    }

                    return ( this[name] || this.init ).apply(this, arguments);
                };

            return _constructor;
        },
        Module, MP, id = 0;

    Module = Constructor();

    Module.namespace = namespace(); 

    Module.hierarchy = ["", "self", "meta", "include", "parent", "top"];
    Module.keywords = {
        //"extend": true, //Module.root 上 extend 矛盾
        "include": true
    };

    Module.getGUID = function(){
        return id++ ;
    };

    Module.prototype = MP = {
        constructor: Module,
        init: function(name, methods, options) {
            var type = typeOf(methods),
                mproto;

            if (methods == undefined) {
                options = methods;
                methods = name;
                name = "";
            }

            options = options || {};

            if (methods == undefined) {
                return Module.root;
            }

            if (methods.__type__ == "M") {
                return methods;
            } else if (typeOf(name) == "function") {
                if (name.__type__ == "M") {
                    return name;
                }

                mproto = Module.prototype;
                for (var prop in mproto) {
                    name[prop] = mproto[prop];
                }

                name.constructor = mproto.constructor;
                this.init.call(name, options.name || "", methods, options);
     
                name.extend( methods.extend );
                //this.extend(val, methods.extend);
                return name;
            }

            //函数或者对象 转为模块对象
            this.__type__ = "M";
            this.__id__ = Module.getGUID();
            this.__hierarchy__ = options.hierarchy || 1;
            this.displayName = typeOf(name) == "string" ? name : "";
            this.__isResolved__ = false;
            //this.isTL = false;
            this.__pms__ = []; //include 的为 parentModule 
            this.__cms__ = []; //childModule
            //this.__links__ = {}; //childModule
            this.__fns__ = {};
            this.__ans__ = null;

            //soure extend target 覆盖
            this.__source__ = methods;
            this.__target__ = options.target || this.prototype || methods;

            var props = {}, name, val;

            if (typeOf(methods) == "object") {
                //methods.prototype = methods;
                for (name in methods) {
                    val = methods[name];
                    //methods.hasOwnProperty( name ) && 
                    if (!this.isKeyword(name)) {
                        props[name] = val;
                    }
                }

                this.__source__ = props;
            }

            this.includes(methods.include || [], !options || options.resolve !== false, false); //|| false

            return this;
        },
        includes: function(modules, resolve, isRecursive) {
            typeOf(modules) == "array" || (modules = [modules]);

            var pms = this.__pms__,
                slen = pms.length,
                i = 0,
                len = modules.length,
                mfns, modle;

            for (; i < len; i++) {
                modle = modules[i];
                if (modle) {
                    //todo 循环依赖
                    if (modle.__type__ != "M" || !Module.is(modle)) {
                        modle = new Module(modle);
                    }

                    if (this.contains(modle) == -1) {
                        this.__isResolved__ = false;

                        modle.__cms__.push(this);
                        pms.push(modle);
                    }
                }
            }

            //new Module 累加无需 Recursive
            resolve !== false && slen != pms.length && this.resolve(this.__target__, isRecursive);

            return this;
        },
        isKeyword: function(name) {
            return Module.keywords[name] || false;
        },
        getResolve: function() {
            return this.target;
        },
        ancestor: function(resolved) { // 祖先模块包含自己， 
            /// todo:  ancestors 未发生变化 直接收集
            var list = this.__ans__ = [this],
                pms = this.__pms__,
                pm, meta = this.meta(),
                len = pms.length;

            if( meta ){
                pms = pms.concat( meta );
                len++;
            }

            while (len--) {
                pm = pms[len];

                //list.push( pm );
                list.push.apply(list, resolved && pm.__isResolved__ ? [pm] : pm.ancestor());
            }

            return list;
        },
        resolve: function(host, isRecursive) { //isRecursive 外部动态module.include(), 全部更新
            if( this.__isResolved__ ) { return; }

            var mixpms = this.ancestor( true ),
                i = 0,
                len = mixpms.length, cms = this.__cms__, clen = cms.length, cm,
                pm, psource, source = this.__source__,
                links = this.__fns__ = {},
                name, link, toppm = null; //prev-pm

            //mixpms.unshift( this ); //add self 

            //mixpms.push( Module.root );

            for (; i < len; i++) {
                pm = mixpms[i]; //.resolve( this );
                psource = pm.__isResolved__ ? pm.__target__ : pm.__source__; //pm.__source__;  

                for (name in psource) {
                    val = psource[name];

                    if (!this.isKeyword(name)) {
                        if (typeOf(val) == "function") { //typeof this[name] == "function" && 
                            link = links[name];

                            if (!link ) {
                                link = links[name] =  [];
                                if( host[name] != val ){
                                    host[name] = val;
                                }
                            } 

                            link.push(val);
                            //link.length == 2 和 link.length == 1
                            //优点：减少调用时嵌套,调试方面；
                            //缺点：无父级的函数也有了callSuper 属性，模块动态include 需要全局resolve;
                            if(link.length == 2){
                                host[name] = this.wrap( host, name, link, 0 );
                            }
                        } else if ( !hasOwnProperty.call(host, name) ) {
                            host[name] = val;
                        }
                    }
                }
            }

            if(host != this.__target__){
                this.__target__ = host;
            }
            
            this.__isResolved__ = true;

            if(isRecursive !== false){
                for(i=0; i < clen; i++ ){
                    cm = cms[i];

                    cm.__isResolved__ = false;
                    cm.resolve( cm.__target__, isRecursive);
                }
            }
        },
        meta:function(){
            if( typeOf(this) != "function"){  return null; }
            
            if( !this.__meta__ ){
                this.__meta__ = new Module("meta", {
                    TEST:function(){}
                }, { hierarchy: 2 });
            }

            return this.__meta__;
        },
        extend:function(classMethods, override) {//扩展静态方法
            var sources = slice.apply( arguments ), 
                len= sources.length, i, 
                source, name, val;

            //_super = this.Super //不继承父
            override = sources[len - 1];
            if(typeOf(override) == "boolean"){
                sources.pop();
            }else{
                override = true;
            }

            if(override === false){
                for(i =0, len= sources.length; i< len; i++){
                    source = sources[i];
                  
                    if(typeOf(source) == "object") {
                        for (name in source) {
                            val = source[name];
                   
                            if(typeOf(val) == "function" && typeOf(this[name]) == "function") { 
                                //pval = name in this ? this[name] : name in _super ? _super[name] : null;
                                this[name] = this.bridge(name, [ val, this[name] ], 0, 2);                       
                            } else { 
                                this[name] = val;
                            }
                        }
                    }
                }
            }else{
                Class.extend(this, classMethods);
            }
 
            return;
            // if( bNew !== false ){
            //     //生成构造函数模块、对象模块  继承 this 
            //     if( typeOf(this) == "function"  ){
            //         return this.derived(source || {} );
            //     }else if(source){
            //         if( typeOf(source.include )  != "array" ){
            //             if(source.include){
            //                 source.include = [ source.include ];
            //             }else{
            //                 source.include = [];
            //             }
            //         }

            //         source.include.unshift(this);

            //         return new Module(source);
            //     }
            // }else{
            //     //自身上添加模块
            //    return this.includes(source);
            // }
        },
        wrap: function(host, name, fns, i) {
            //注入更多关键字 callsuper yield.... 
            return function() {
                var cs = this.callSuper, csname = this.callSuperName, i = 0, result;

                this.callSuperName = name;
                this.callSuper = function() {
                    var args = arguments.callee.caller.arguments, 
                        curArgs = slice.call(arguments),
                        fn, ret;

                    curArgs.push.apply( curArgs, slice.call(args, curArgs.length) );
                    i++;

                    fn = fns[i];
                    if( fn ){
                        ret = fn.apply(this, curArgs);
                    }else if( cs && name == csname){ //i == fns.length
                        this.callSuper = cs;
                        ret = cs.apply(this, curArgs);
                    }
                   
                    i--;

                    return ret;
                };

                result = fns[0] && fns[0].apply(this, arguments);

                if (cs) {
                    this.callSuper = cs;
                    this.callSuperName = csname;
                } else {
                    cs = null;
                    csname = null;
                    delete this.callSuper;
                    delete this.callSuperName;
                }

                return result;
            };
        },
        type: function() {
            return this.displayName || typeOf(this);
        },
        is: function(o) {
            //函数、对象 模块  
            return typeOf(this) == "function" ? o instanceof this :
                this.constructor ? o instanceof this.constructor :
                false;
        },
        derived: function(methods, opts) {//single, name
            return new Class(methods, this, opts);
        },
        bridge: function(name, list, j, len, unPackLast) {
            var method, parentMethod;

            if (j >= len) { return null; }
            if (unPackLast === true && j == len - 1) { return list[j]; }

            method = list[j];
            parentMethod = this.bridge(name, list, j + 1, len, unPackLast);

            return function() {
                var cs = this.callSuper, csname = this.callSuperName, result;

                this.callSuperName = name;
                this.callSuper = function() {
                    var args = arguments.callee.caller.arguments, 
                        curArgs = slice.call(arguments);

                    if( parentMethod ){
                        return parentMethod.apply(this, curArgs.concat( slice.call(args, curArgs.length) ));
                    }

                    return null;
                };

                result = method.apply(this, arguments);

                if (cs) {
                    this.callSuper = cs;
                    this.callSuperName = csname;
                } else {
                    cs = null;
                    csname = null;
                    delete this.callSuper;
                    delete this.callSuperName;
                }

                return result;
            };
        },
        define: function(name, method) { 
            return -1;
        },
        method: function(name, method) {
            var fns = this.__fns__;


            return fns[name];
        },
        contains: function(value) {
            var pms = this.__pms__,
                len = pms.length,
                pm;
            while ( len-- ) {
                pm = pms[len];
                if (pm == value) {
                    return len;
                }
            }

            return -1;
        },
        toString: function() {
            return "module-" + this.displayName;
        }
    };

    Module.is = function(o) {
        return o && o.__type__ == "M";
    };

    //构造函数无parent时 默认继承root模块
    Module.root = new Module("root", {
        isKeyword: MP.isKeyword,
        bridge : MP.bridge,
        extend:function( source ){
            var sources = slice.apply( arguments ), source, name;

            for(var i =0, len= sources.length; i< len; i++){
                source = sources[i];
                //只给对象 扩对象;  ( 不扩函数、对象Module, Module 可让 meta.include )
                if( source.type != "M" ) {
                    for (name in source) {
                        val = source[name];
                        if (!this.isKeyword(name)) {
                            if ( typeOf(val) == "function" && typeOf(this[name]) == "function" ) { 
                                this[name] = this.bridge(name, [ val, this[name] ], 0, 2); 
                            } else { 
                                this[name] = val;
                            }
                        }
                    }
                }
            }
        },
        bind: function( name ) {
            var fn = typeOf(name) == "function" ? name : this[name], _this = this, args = [];

            if ( typeOf(fn) != "function") { return ;}

            if (arguments.length > 2) {
                args = slice.call(arguments, 1);
            }

            return function() {
                return fn.apply(_this, args.concat( slice.call(arguments) ));
            };
        },
        instanceMethod: function( name ) {
           return this.bind.apply(this, arguments);
        },
        clone: function( ) {
            return Class.clone(this);
        }
    }, { hierarchy: 5 });

    var Class = Constructor();

    Class.prototype = {
        constructor: Class,
        init: function(props, parent, opts) {//name 类初始化函数名
            var _constructor, argCount = arguments.length,
                name = "init", bSingle = false;

            if( typeOf(opts) == "object" ){
                //opts = { name: "init", bSingle:false }
                name = opts.name || "init";
                bSingle = opts.bSingle || false;
            }

            _constructor = Constructor(name);

            //parent 必为 function
            typeOf(props) == "function" && (props = props.call(_constructor, _constructor));
            parent = new Module(parent);

            if (typeOf(props.include) != "array") {
                if (props.include) {
                    props.include = [props.include];
                } else {
                    props.include = [];
                }
            }

            props.include.unshift(parent);

            _constructor.prototype = clone(parent.__target__ || {});
            _constructor.prototype.Super = parent;
            _constructor.prototype.constructor = _constructor;

            new Module(_constructor, props);

            if( props.namespace ){
                Module.namespace(props.namespace, _constructor);
            }
            return _constructor;
        },
        setOtpions:function(opts){

        }
    };

    Class.typeOf = typeOf;

    Class.getField = getField; 

    Class.clone = function (o) {
        var duplicate, type = typeOf(o);

        if (o && o.cloneNode) { return o.cloneNode(); }
        
        switch( type ){
            case "regexp":{ return new RegExp(o.source); }
            case "date": { return new Date(+o); }
            case "array":
            case "object": {
                if (o.__duplicate__) { return o.__duplicate__; }

                o.__duplicate__ = duplicate = type == "array" ? [] : {};
                for (var prop in o){
                    if (prop != "__duplicate__"){
                        duplicate[prop] = arguments.callee(o[prop]);
                    }
                }
                
                delete o.__duplicate__; 
                return duplicate;
            }
            default: {//function Boolean null  undefined  Math  Number String... //RegExp
                return o;
            }
        }
    };

    Class.toString = function (o, name) {
        var sb = [], type = Class.typeOf(o);

        switch(type){
            case 'object':
            case 'array':
                {
                    name || ( name = "root");
                    if(o.___name___){ return o.___name___ ; }

                    o.___name___ = name;
                    if(type == 'object'){
                        sb.push("{");
                        var temp = [];
                        for (var key in o) {
                            if(key != "___name___"){
                                temp.push(" \"" + key + "\":" + arguments.callee( o[key], name.concat("." + key) ) );
                            }
                        }
                        sb.push(temp.join(","));
                        sb.push("}");
                    }else{
                        sb.push("[");
                        for (var i = 0, len = o.length; i < len; i++) {
                            sb.push(arguments.callee(o[i]), name.concat("[" + i + "]") );
                            if (i < len - 1) {
                                sb.push(",");
                            }
                        }
                        sb.push("]");
                    }

                    delete o.___name___;
                    return sb.join("");
                }
            case 'null': { return "null"; }
            case 'undefined': { return "\"\""; }
            case 'function': 
            case 'string': { return "\"" + o.toString().replace(/\"/g, "\\\"") + "\""; }
            case 'html': {return "\"" + o.outHTML().replace(/\"/g, "\\\"") + "\""; } 
            case 'xml': { return XMLSerializer ? (new XMLSerializer()).serializeToString(o, "text/xml") : o.xml; }
            default:
                {
                    return o.toString();  
                }
        }
    };

    Class.extend = function (deep, target, sources, overwrite) {/* sources 多个 */
        sources = slice.apply(arguments);

        var front = 0, end = sources.length, o, name, typeOf = Class.typeOf;

        typeOf( sources[front] ) === "boolean" ?  ( deep = sources[front++] ) : ( deep = false );
        typeOf( sources[end-1] ) === "boolean" ?  ( overwrite = sources[--end] ) : ( overwrite = true );
        
        target = sources[front++];
        if( !target || (name = typeof target) != "object" && name != "function" ) { return target; } 

        while( front < end ){
            o = sources[front];
            name = typeOf(o);

            if(name == "object"){            
                for(name in o){
                    if( !(name in target) || overwrite ){
                        target[name] = deep ? Class.clone(o[name]) : o[name];
                    }
                }
            }else if(name == "array"){
                sources.splice.apply(sources, [front + 1, 0].concat(o) )
                end += o.length;
            }
            
            front++;
        }

        return target;
    };

    Class.throttle = function(callback, delay, scope, type) {
        var timeout_id, last_exec =  0, args = null, that,
            exec = function () {
                last_exec = +new Date();
                callback.apply(scope || that, args);
            },
            clear = function () {
                timeout_id = undefined;
            },
            thros = ({
                "bounce" : function(){//mouse 移、拖动
                    if(timeout_id){
                        window.clearTimeout(timeout_id);     
                        timeout_id = undefined;
                    }

                    timeout_id = window.setTimeout(function(){ exec(); timeout_id = undefined; }, delay);
                },
                "debounce" : function(elapsed){//指定间隔, 首次调用执行, button 重复点击
                    if (!timeout_id) {
                        exec();
                        timeout_id =  window.setTimeout(clear, delay);
                    } 

                    /*  
                        //同上
                        if (!timeout_id || elapsed > delay) {
                            exec();
                            timeout_id &&  window.clearTimeout(timeout_id);              
                            timeout_id =  window.setTimeout( clear, delay );
                        } else {
                            timeout_id &&  window.clearTimeout(timeout_id);              
                            timeout_id =  window.setTimeout( clear, delay - elapsed);
                        }   

                        if (!timeout_id) {
                            exec();
                        }
                        //间隔内点击，重新计时
                        timeout_id && window.clearTimeout(timeout_id);              
                        timeout_id = window.setTimeout( clear, delay);       
                    */
                },
                "throttle": function(elapsed, first){//指定间隔, 首次调用不执行
                    timeout_id && window.clearTimeout(timeout_id);
                    if (elapsed > delay) {
                        exec();
                    } else {             
                        timeout_id = window.setTimeout( exec, delay - elapsed);
                    }
                }
            })[type || "bounce"];

        //scope || (scope = this);
        return thros && function(){
            args = arguments;
            that = this;
            thros(+new Date() - last_exec, !last_exec);
        };
    };

    exports.Class = Class;
    exports.Module = Module;
    
})(window);

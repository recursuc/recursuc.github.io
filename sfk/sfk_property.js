/*
    sfk_property by zcj 2012-08-27
*/

(function (win, doc) {
    //TODO:结合sfk_valid.js增加属性录入的校验功能
    var regObj = {
        number: "\d"
    },

    Property = $C.Create({
        initialize: function (options, pDesign) {
            options.walkDOM && (this.walkDOM = options.walkDOM);
            this.target = options.target ? ($O.getType(options.target) != "array" && (options.target = [options.target])) : [doc.body];
            this.control = options.control;
            //事件流
            this.onload = options.onload;
            this.onBeforeHandle = options.onBeforeHandle;
            //this.onHandle = options.onHandle;//替换默认直接赋值处理 before和after将不触发
            this.onAfterHandle = options.onAfterHandle;
            this.unload = options.unload;

            this.onchange = options.onchange;
            this.props = {};
        },
        setOptions: function (options) {

        },
        start: function (operType) {
            this.onload && this.onload();
            this.walkDOM(this.target, !operType ? this.load : this.save);
            this.unload && this.unload();
            return this;
        },
        load: function (elem) {
            if (elem.getAttribute("data-propName")) {
                var pName = elem.getAttribute("data-propName"),
                    propName, aPropName = pName.split("."), value = this.control, i = 0, temp;

                while (i < aPropName.length) {
                    propName = aPropName[i];
                    value = value[propName];
                    i++;
                }

                this.props[pName] = elem;
                this.onBeforeHandle && (temp = this.onBeforeHandle(propName, elem, value)) !== undefined && (value = temp);
                //默认处理方式, Todo: 有可能开放替换默认操作
                switch (elem.type.toLowerCase()) {
                    case "textarea":
                    case "hidden":
                    case "text":
                        elem.value = value && value != "undefined" ? value : "";
                        break;
                    case "select-one":
                        var len = elem.options.length;
                        while (len--) {
                            if (elem.options[i].value == value) {
                                elem.selectdIndex = i;
                                break;
                            }
                        }
                        break;
                    case "checkbox":
                        elem.checked = value == "1" ? true : false;
                        break;
                    default:
                        break;
                }
                this.onAfterHandle && this.onAfterHandle(propName, elem);

                $E.on(elem, "change", this.saveHandle, this, pName);
            }
        },
        saveHandle: function (evt, propName) {
            this.save(propName);
        },
        save: function (propName) {
            if (propName && this.props[propName]) {
                var elem = this.props[propName], sourceObj = this.control, value;

                switch (elem.type.toLowerCase()) {
                    case "textarea":
                    case "hidden":
                    case "text":
                        value = elem.value;
                        break;
                    case "select-one":
                        value = elem.options[elem.selectedIndex].value;
                        break;
                    case "checkbox":
                        value = elem.checked ? "1" : "0";
                        break;
                    default:
                        break;
                }

                this.onchange ? this.onchange(propName, value) : (sourceObj[propName] = value);
            }
        },
        walkDOM: function (roots, fnHandle) {
            for (var i = 0, len = roots.length; i < len; i++) {
                if (roots[i] != null && roots[i].nodeType == 1) {
                    var sPropName = roots[i].getAttribute("data-propName");
                    if (sPropName != null) {
                        fnHandle(roots[i], sPropName);
                    }
                    for (var j = 0, cou = roots[i].childNodes.length; j < cou; j++) {
                        this.walkDOM(roots[i].childNodes[j], fnHandle);
                    }
                }
            }
        }
    }, true);

    window.Property = Property;
})(window, document);
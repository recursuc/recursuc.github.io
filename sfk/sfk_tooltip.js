var Common = {
    getItself: function (id) {
        return "string" == typeof id ? document.getElementById(id) : id;
    },
    getEvent: function () {//ie/ff
        if (document.all) {
            return window.event;
        }
        func = getEvent.caller;
        while (func != null) {
            var arg0 = func.arguments[0];
            if (arg0) {
                if ((arg0.constructor == Event || arg0.constructor == MouseEvent) || (typeof (arg0) == "object" && arg0.preventDefault && arg0.stopPropagation)) {
                    return arg0;
                }
            }
            func = func.caller;
        }
        return null;
    },
    getMousePos: function (ev) {
        if (!ev) {
            ev = this.getEvent();
        }
        if (ev.pageX || ev.pageY) {
            return {
                x: ev.pageX,
                y: ev.pageY
            };
        }

        if (document.documentElement && document.documentElement.scrollTop) {
            return {
                x: ev.clientX + document.documentElement.scrollLeft - document.documentElement.clientLeft,
                y: ev.clientY + document.documentElement.scrollTop - document.documentElement.clientTop
            };
        }
        else if (document.body) {
            return {
                x: ev.clientX + document.body.scrollLeft - document.body.clientLeft,
                y: ev.clientY + document.body.scrollTop - document.body.clientTop
            };
        }
    },
    getElementPos: function (el) {
        el = this.getItself(el);
        var _x = 0, _y = 0;
        do {
            _x += el.offsetLeft;
            _y += el.offsetTop;
        } while (el = el.offsetParent);
        return { x: _x, y: _y };
    },
    getTextSize: function (text) {
        var span = document.createElement("span");
        var result = {};
        result.width = span.offsetWidth;
        result.height = span.offsetWidth;
        span.style.visibility = "hidden";
        document.body.appendChild(span);
        if (typeof span.textContent != "undefined")
            span.textContent = text;
        else span.innerText = text;
        result.width = span.offsetWidth - result.width;
        result.height = span.offsetHeight - result.height;
        span.parentNode.removeChild(span);
        return result;
    },
    attachEvent: function (o, evType, f, capture) {
        if (o == null) { return false; }
        if (o.addEventListener) {
            o.addEventListener(evType, f, capture);
            return true;
        } else if (o.attachEvent) {
            var r = o.attachEvent("on" + evType, f);
            return r;
        } else {
            try { o["on" + evType] = f; } catch (e) { }
        }
    },
    detachEvent: function (o, evType, f, capture) {
        if (o == null) { return false; }
        if (o.removeEventListener) {
            o.removeEventListener(evType, f, capture);
            return true;
        } else if (o.detachEvent) {
            o.detachEvent("on" + evType, f);
        } else {
            try { o["on" + evType] = function () { }; } catch (e) { }
        }
    }
}
function ToolTip(target, options, oFCE) {
    this.target = typeof target == "string" ? document.getElementById(target) : target;
    this.options = options;
    this.divTooltip = null;
    this.oFCE = oFCE;
    this.init();
}

ToolTip.prototype = {
    init: function () {
        var that = this;
        if (this.target != null) {
            $(this.target).bind("click", function (e) {
                that.showToolTip(e)
                e.stopPropagation();
            });

            //Common.attachEvent(this.target, "blur", function (e) {
            //    that.hidToolTip(e);
            //}, false);

            $(document.body).bind("click", function (e) {
                that.hidToolTip(e);
            });
        }
    },
    createTipDiv: function () {
        var that = this;
        if (this.divTooltip == null) {
            this.divTooltip = document.createElement("div");
            this.divTooltip.id = "toolTip" + this.target.id;
            this.divTooltip.style.cssText = "position:absolute;overflow: auto;border: #75CEE3 solid 1px;background-color:White;z-index:1000;font-size: 14px;color: #999999;"; //filter:alpha(opacity=0);
            var s = "";
            if (this.options.data != null && Object.prototype.toString.call(this.options.data) == "[object Array]") {
                s += "<ul style='list-type:none'>";
                for (var i = 0; i < this.options.data.length; i++) {
                    if (this.target.type && this.target.type.toLowerCase() == "checkbox") {
                        s += "<li>" + this.options.data[i].replace(/true/g, "是").replace(/false/g, "否") + "</li>";
                    } else {
                        s += "<li>" + this.options.data[i] + "</li>";
                    }
                }
                s += "</ul>";
            }
            this.divTooltip.innerHTML = s;
            var oUl = this.divTooltip.firstChild;
            $(oUl).bind("click", function (evt) {
                var oLi = evt.target,
                    index = 0;
                while (oLi.previousSibling != null) {
                    index++;
                    oLi = oLi.previousSibling;
                }
                that.oFCE.setValByLL(index);
                that.moveToFirst(index);
                if (that.oFCE.oPForm.mainCId  && that.oFCE.elementId.toLowerCase() == that.oFCE.oPForm.mainCId.toLowerCase()) {
                    var obj = that.oFCE.oPForm.filer(function (fceObjc) {
                        if (fceObjc.elementId.toLowerCase() == "loginkeeping" && fceObjc.getEleTraVal(0) == "true") {
                            return true;
                        }
                        return false;
                    });
                    if (obj != null && confirm("根据该选中值，自动填写前一次登陆表单的输入框值！")) {
                        that.oFCE.oPForm.setFCEValByMain(that.oFCE.getElementVal());
                    }
                }
                //that.fadeOut();
            });

            for (var j = 0; j < oUl.childNodes.length; j++) {
                $(oUl.childNodes[j]).bind("mouseover mouseout", function (evt) {
                    if (evt.type == "mouseover") {
                        $(this).addClass("over");
                    } else {
                        $(this).removeClass("over");
                    }
                })
            }

            if (s == "") {
                this.divTooltip.style.heigth = "10px";
            }
            document.body.appendChild(this.divTooltip);
            this.divTooltip.style.display = "none";
        }
    },
    showToolTip: function (e) {
        var ev = e || window.event,
             mosPos = Common.getMousePos(ev),
             elPos = Common.getElementPos(this.target);

        this.createTipDiv();

        this.divTooltip.style.top = elPos.y + this.target.offsetHeight + 1 + "px";
        this.divTooltip.style.left = elPos.x + "px";
        if (this.target.type && this.target.type.toLowerCase() == "checkbox") {
            var oNode = this.target;
            while (oNode != null) {
                if (oNode.nodeName.toLowerCase() == "label" && oNode["for"] == this.target.id) {
                    this.divTooltip.style.width = oNode.offsetWidth + "px";
                    break;
                }
                oNode = oNode.nextSibling;
            }
        } else {
            this.divTooltip.style.width = this.target.offsetWidth + "px";
        }
        $(this.divTooltip).fadeIn("normal");

        ///hide tooltip after some time
        if (this.options && this.options.time) {
            setTimeout(this.hidToolTip, this.options.time);
        }
    },
    hidToolTip: function () {
        if (this.divTooltip != null && this.divTooltip.style.display != "none") {//) {
            //this.divTooltip.style.opacity = 100;
            //this.divTooltip.style.display = "none";
            $(this.divTooltip).fadeOut("slow");
        }
    },
    addTip: function (sContent, iLength) {
        if (this.divTooltip == null) {
            this.createTipDiv();
        }
        var oUl = this.divTooltip.firstChild,
            oLi = document.createElement("li");
        if (this.target.type) {
            switch (this.target.type.toLowerCase()) {
                case "checkbox":
                    {
                        sContent = sContent.replace(/true/g, "是").replace(/false/g, "否");
                        break;
                    }
                case "password":
                    {
                        sContent = sContent.replace(/./g, "*");
                        break;
                    }
            }
        }
        oLi.innerHTML = sContent;
        oUl.insertBefore(oLi, oUl.firstChild);
        if (iLength && oUl.childNodes.length > iLength) {
            oUl.removeChild(oUl.lastChild);
        }
    },
    moveToFirst: function (index) {
        if (this.divTooltip != null && index < this.divTooltip.firstChild.childNodes.length) {
            var oUl = this.divTooltip.firstChild;
            oUl.insertBefore(oUl.childNodes[index], oUl.firstChild);
        }
    },
    fadeIn: function (a, iWidth, iHeight, time) {
        var xincr = iWidth / time, j = 0,
            yincr = iHeight / time, curOpa = a.style.opacity,
            opacity = 5;
        // a.style.width = 0;
        a.style.heigth = 0;
        (function () {
            if (a.style.display == "none") {
                a.style.height = iHeight;
                return;
            }
            j += yincr;
            if (j <= iHeight) {
                a.style.height = j + "px";
            } else {
                a.style.height = iHeight + "px";
            }

            curOpa += opacity;
            if (curOpa <= 100) {
                a.style.opacity = curOpa;
            } else {
                a.style.opacity = 100;
            }
            if (!(j >= iHeight && curOpa >= 100))
                setTimeout(arguments.callee, 30);
            //            if (!((i > iWidth) && (j > iHeight)))
            //                setTimeout(arguments.callee, 30);
        })();
    },
    fadeOut: function (a, iWidth, iHeight, time) {
        var xincr = iWidth / time,
            yincr = iHeight / time,
            j = 0,
            curOpa = a.style.opacity,
            opacity = 5;

        (function () {
            //  var i = parseInt(a.style.width) + xincr;

            //if (i <= iWidth) {
            //    a.style.width = i + "px";
            //}
            //else {
            //    a.style.width = iWidth + "px";
            //}
            //iHeight -= yincr;
            //if (iHeight >= 0) {
            //    a.style.height = iHeight + "px";
            //}
            //else {
            //    a.style.height = "0px";
            //    a.style.display = "none";
            //}

            curOpa -= opacity;
            if (curOpa > 0) {
                a.style.opacity = curOpa;
            } else {
                a.style.opacity = 0;
                a.style.display = "none";
            }
            if (curOpa > 0)
                setTimeout(arguments.callee, 30);
            //if (!(j < iHeight && curOpa < 0))
            //    setTimeout(arguments.callee, 30);
            //if (!((i > iWidth) && (j > iHeight)))
            //    setTimeout(arguments.callee, 30);
        })();
    }
}
/*
    sfk_overlay.js by zcj  最后更新日期 2012- 06-20

    简单Overlay  htmlelement 一对一 这样页面不同元素可以同时出现遮罩
*/
(function (win, undefined) {
    var doc = win.document,
	    body = doc.body,
	    P = $P,
	    ET = $ET, E = $E, F = $F,
	    C = $C;

    Overlay = $C.create();

    Overlay.prototype = {
        initialize: function (options) {
            var instance;
            this.target = this.options.target || doc.body;
            instance = Overlay.get(this.target);
            if (!instance) {
                this.setOptions(options);
                this.evtBind = {
                    scope: this,
                    fn: this.escClose
                }
                E.bind(doc, 'keyup', this.evtBind);
                Overlay.set(this.target, this);
                return instance;
            }

            return this;
        },
        setOptions: function (options) {
            this.options = { // 默认参数
                target: document.body,
                color: "#333", //背景色
                opacity: 0.6,
                zIndex: 999,
                closeTimeout: 0,
                onClose: null
            };

            $O.extend(this.options, options || {});
            return this.options;
        },
        create: function () {
            var rect;
            if (!this.overlay) {
                this.overlay = doc.createElement('div');
                if (this.target == doc.body) {
                    this.overlay.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;margin:0;padding:0;border:none;';
                } else {
                    rect = ET.rect(this.target);
                    this.overlay.style.cssText = "position:absolute;top:" + rect.top + "px;left:" + rect.left + "px;width:" + rect.width + "px;height:" + rect.height + "px;margin:0;padding:0;border:none;";
                }
                this.target.appendChild(this.overlay);
            }

            return overlay;
        },
        show: function () {
            this.create();
            ET.setCSS(overlay, {
                backgroundColor: this.color,
                opacity: this.opacity,
                zIndex: this.zIndex,
                display: "block"
            });

        },
        close: function (bDispose) {
            var close = F.bind(this, function () {
                this.overlay && (this.overlay.style.display = "none");
                this.onClose && this.onClose();
                if (bDispose) {
                    this.dispose();
                }
            });

            timeout(close, this.closeTimeout);
        },
        escClose: function (e) {
            if (e.keyCode == 27) {
                this.close();
            }
        },
        dispose: function () {
            E.unbind(doc, 'keyup', this.evtBind);
            C.removeData(this.target, "overlay");
        }
    };

    Overlay.get = function (target) {
        return C.data(target, "overlay");
    }
    Overlay.set = function (target, ol) {
        return C.data(target, "overlay", ol);
    }
    Overlay.open = function (options) {
        var ol = new Overlay(options);
        ol.show();
        return ol;
    };
    Overlay.close = function (options) {
        instance
        if (ol) {
            ol.close();
        }
        return ol;
    };
    win.Overlay = Overlay;
})(window, undefined);
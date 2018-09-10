(function () {
    var doc = document,
        E = $E,
        ET = $ET,
        Str = $Str,
        count = 0,
        ModuleLayout = $C.Create({
            initialize: function (navItem, panel, p, toggle) {
                this.navItem = navItem;
                this.panel = panel;
                this.pTab = p;
                this.display = false;
                this.create(this.navItem, this.panel);
                this.timer = null;
                this.index = null;
                this.data = null;
                this.heClose = null;
                this.next = null;
                this.prev = null;
                toggle == null || this.bind(toggle);
                $E.on(this.navItem, "dblclick", this.changItemName, this);
            },
            setOptions: function (options) {
                this.options = {
                    container: null, //tab所在父容器 (设置默认为其父节点)
                    target: null, //tab元素对象
                    navsSize: null, //navsSize 上下布局为高，左右为宽
                    tSize: null, //tab容器宽高  (设置默认与其所在定位父容器一样大)
                    collapse: false,
                    navs: null, //导航头htmlelement
                    panels: null, //内容htmlelement
                    active: 0,
                    layout: "b",
                    toggle: null,
                    onAddItem: null,
                    onRemoveItem: null,
                    onBeforeToggle: null,
                    onAfterToggle: null,
                    enableClose: false,
                    scrollType: "S"//tabitem内容超过头滚动方式，当前视图最后一条滚到新视图的：开始 中间 末尾 M E 
                };

                $O.extend(this.options, options || {}, false);
            }
        });
})()
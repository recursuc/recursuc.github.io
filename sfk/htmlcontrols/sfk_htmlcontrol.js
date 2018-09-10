/*
通用控件 
*/

(function (win, doc) {
    var E = $E, F = $F, ET = $ET,
    HtmlControl = $C.Create({
        initialize: function (options, parent) {
            if (!options.type && !options.heControl) { return; }
            var heControl = options.heControl;
            this.type = options.type;
            this.rect = options.rect;
            this.drops = options.drops || [];
            this.data = options.data;
            this.container = options.container;
            this.parent = parent;

            this.onDrop = F.bind(this, this.onDrop);
            this.heControl = heControl || (heControl = this.makeControl(this.type, this.rect, this.container));
            options.resize !== false && (this.resize = new Resizable({
                target: heControl,
                min: {
                    width: 1,
                    height: 1
                },
                mode: 1,
                overShow: true
            }));
            options.drag !== false && (this.drag = new Drag(heControl, {
                Handle: heControl.children[1],
                mxContainer: options.mxContainer,
                Limit: true,
                drops: this.drops,
                onDrop: F.bind(this, this.onDrop),
                onStart: F.bind(this, this.onStart),
                onMove: F.bind(this, this.onMove),
                onStop: F.bind(this, this.onStop)
            }));
        },
        insert: function (options, node, sDir) {
        },
        click: function () {
            this.parent.location(this);
        },
        onResize: function () {
        },
        onStart: function () {
            this.parent.highlight(this.data, false);
            this.drag.dropable(this.refreshDrops());
        },
        onMove: function () {

        },
        onStop: function () {

        },
        onDrop: function (heDropTarget, dropTarget) {

        },
        setData: function (data) {
            this.data = data;
        },
        refreshDrops: function () {
            var heContainer;
            this.drops.length = 0;
            this.drops = this.parent.getContainer();
            if (this.type == "div") {
                for (var i = 0; i < this.drops.length; i++) {
                    heContainer = this.drops[i];
                    if (heContainer == this.heControl) {
                        this.drops.splice(i, 1);
                    }
                }
            }
            return this.drops;
        },
        getElement: function () {
            return this.heControl.firstChild;
        },
        show: function () {
            this.tree.container.style.display = "";
        },
        hide: function () {
            this.tree.container.style.display = "none";
        }
    }),
    HtmlAnchor = $C.Create(HtmlControl, {
        initialize: function (options) {

        }
    }),
    HtmlText = $C.Create(HtmlControl, {
        initialize: function (options) {
            
        },
        setOptions: function (options) {

        }
    }),
    HtmlDateTime = $C.Create(HtmlControl, {
        initialize: function (options) {

        },
        setOptions: function (options) {

        }
    }),
    HtmlUpload = $C.Create(HtmlControl, {
        initialize: function (options) {

        },
        setOptions: function (options) {

        }
    }),
    HtmlTextArea = $C.Create(HtmlControl, {
        initialize: function (options) {

        },
        setOptions: function (options) {

        }
    }),
    HtmlButton = $C.Create(HtmlControl, {
        initialize: function (options) {

        },
        setOptions: function (options) {

        }
    }),
    HtmlSelect = $C.Create(HtmlControl, {
        initialize: function (options, pSheet) {
            this.controls = {};
            this.heSheetContainer = pSheet.DOM["sheetContainer"];
            var mainView = pSheet.pGrid.mainView;
            this.borderWidth = 1;
            this.width = options.width || mainView.width * 4 / 5;
            this.height = options.height || mainView.height * 4 / 5;
            this.heSheetContainer.insertAdjacentHTML("beforeend", '<div style="position:absolute;top:-' + this.borderWidth + 'px;left:-' + this.borderWidth + 'px;width:' + this.width + 'px;height:' + this.height + 'px;border:' + this.borderWidth + 'px solid blue;"></div>');

            this.heContent = $ET.lastElementChild(this.heSheetContainer); //表单内容
            //this.controls = {
            //      "text": {
            //          count: 0
            //      },
            //      "textarea": {
            //          count: 0
            //      },
            //      "button": {
            //          count: 0
            //      },
            //      "label": {
            //          count: 0
            //      },
            //      "select": {
            //          count: 0
            //      },
            //      "div": {
            //          count: 0
            //      }
            //  }
            this.pDesign = pSheet.pGrid;
            this.attrPage = this.pDesign.attrPage;
            this.structTree = new StructTree({
                container: this.pDesign.structTreePanel.heContent,
                roots: [{
                    id: "0",
                    text: "表单",
                    data: {
                        elem: this.heContent
                    },
                    childNodes: null
                }]
            }, this);

            var frmNode = this.frmNode = this.structTree.tree.root.childNodes[0],
            frmControl = new HtmlControl({
                heControl: this.heContent,
                drops: null,
                data: frmNode,
                drag: false
            }, this),
            frmContainer = new HtmlControl({
                heControl: this.heSheetContainer,
                drops: null,
                data: frmNode,
                resize: false,
                drag: false
            }, this);

            this.container = [frmControl, frmContainer];
            this.controls = [];

            options.xnForm && this.drawControl(options.xnForm.selectNodes("//Control"))
        },
        setOptions: function (options) {

        },
        show: function () {
            this.heSheetContainer.style.display = "";
            this.structTree.show();
        },
        highlight: function (node, mutliply) {
            this.structTree.tree.highlight(node, mutliply)
        },
        hide: function () {
            this.heSheetContainer.style.display = "none";
            this.structTree.hide();
        },
        drawControl: function (sType, rect, heControl) {
            var pControl;
            for (var i = 0; i < this.container.length; i++) {
                pControl = this.container[i];
                if (pControl.heControl == heControl) {
                    break;
                }
                pControl = null;
            }

            if (pControl) {
                var control = new HtmlControl({
                    type: sType,
                    rect: rect,
                    drops: null,
                    data: null,
                    container: heControl,
                    mxContainer: this.heSheetContainer
                }, this);
                this.controls.push(control);
                control.data = this.addControlToTree(control, pControl);
            }
        },
        dragResize: function (elem) {
            //            return {
            //                elem: elem,
            //                resize: new Resizable({
            //                    target: elem.parentNode,
            //                    min: {
            //                        width: 1,
            //                        height: 1
            //                    }
            //                }),
            //                drag: new Drag(elem, {
            //                    Handle: this.heTitle,
            //                    mxContainer: this.heContent,
            //                    Limit: true,
            //                    drop: null,
            //                    onDrop: null,
            //                    onStart: function () {
            //                        _this.heTitle.style.cursor = 'move';
            //                        _this.options.onStart && _this.options.onStart();
            //                    },
            //                    onMove: function () {
            //                        _this.options.onMove && _this.options.onMove();
            //                    },
            //                    onDrop: this.options.onDrop,
            //                    onStop: function () {
            //                        _this.heTitle.style.cursor = '';
            //                    }
            //                })
            //            };
        },
        addControlToTree: function (control, pControl) {
            var elem = control.heControl,
            text = elem.id ? elem.id
                   : elem.firstChild.nodeName == "INPUT" ? elem.firstChild.type
                    : elem.firstChild.nodeName,
            node = this.structTree.insert({
                text: text,
                title: '11',
                data: control
            }, pControl.data || this.frmNode);

            this.structTree.tree.highlight(node, false);
            control.type == "div" && this.addDrops(node.data);
            return node;
        },
        addDrops: function (data) {
            this.container.unshift(data)
        },
        getContainer: function () {
            var a = [];
            for (var i = 0; i < this.container.length; i++) {
                a.push(this.container[i].heControl);
            }
            return a;
        },
        location: function (control) {
            if (this.attrPage.activeControl != control) {
                this.attrPage.activeControl = control;
                this.attrPage.location(this.getAttrSrc(control.type), {
                    border: "0",
                    scrolling: "no",
                    autoSize: false,
                    height: "100%",
                    width: "100%",
                    data: [control, window.datasource]
                });
            }
        },
        getAttrSrc: function (type) {
            var src = "";
            switch (type.toLowerCase()) {
                case "text":
                    src = "Form/attribute/text.htm";
                    break;
                case "button":
                    src = "Form/attribute/button.htm";
                    break;
                case "label":
                    src = "Form/attribute/label.htm";
                    break;
                case "checkbox":
                    src = "Form/attribute/checkbox.htm";
                    break;
                case "select":
                    src = "Form/attribute/combobox.htm";
                    break;
                case "textarea":
                    src = "Form/attribute/textarea.htm";
                    break;
                case "radio":
                    src = "Form/attribute/radio.htm";
                    break;
                case "div":
                    src = "Form/attribute/div.htm";
                    break;
                case "img":
                    src = "Form/attribute/img.htm";
                    break;
                default:
                    break;
            }
            return src;
        },
        hideTree: function () {
            this.structTree && (this.structTree.container.style.display = "none");
        }, showTree: function () {
            this.structTree && (this.structTree.container.style.display = "");
        }
    }),
    HtmlRadio = $C.Create(HtmlControl, {
        initialize: function (options, pSheet) {
            this.controls = {};
            this.heSheetContainer = pSheet.DOM["sheetContainer"];
            var mainView = pSheet.pGrid.mainView;
            this.borderWidth = 1;
            this.width = options.width || mainView.width * 4 / 5;
            this.height = options.height || mainView.height * 4 / 5;
            this.heSheetContainer.insertAdjacentHTML("beforeend", '<div style="position:absolute;top:-' + this.borderWidth + 'px;left:-' + this.borderWidth + 'px;width:' + this.width + 'px;height:' + this.height + 'px;border:' + this.borderWidth + 'px solid blue;"></div>');

            this.heContent = $ET.lastElementChild(this.heSheetContainer); //表单内容
            //this.controls = {
            //      "text": {
            //          count: 0
            //      },
            //      "textarea": {
            //          count: 0
            //      },
            //      "button": {
            //          count: 0
            //      },
            //      "label": {
            //          count: 0
            //      },
            //      "select": {
            //          count: 0
            //      },
            //      "div": {
            //          count: 0
            //      }
            //  }
            this.pDesign = pSheet.pGrid;
            this.attrPage = this.pDesign.attrPage;
            this.structTree = new StructTree({
                container: this.pDesign.structTreePanel.heContent,
                roots: [{
                    id: "0",
                    text: "表单",
                    data: {
                        elem: this.heContent
                    },
                    childNodes: null
                }]
            }, this);

            var frmNode = this.frmNode = this.structTree.tree.root.childNodes[0],
            frmControl = new HtmlControl({
                heControl: this.heContent,
                drops: null,
                data: frmNode,
                drag: false
            }, this),
            frmContainer = new HtmlControl({
                heControl: this.heSheetContainer,
                drops: null,
                data: frmNode,
                resize: false,
                drag: false
            }, this);

            this.container = [frmControl, frmContainer];
            this.controls = [];

            options.xnForm && this.drawControl(options.xnForm.selectNodes("//Control"))
        },
        setOptions: function (options) {

        },
    }),
    HtmlImage = $C.Create(HtmlControl, {

    }),
    HtmlCheckbox = $C.Create(HtmlControl, {
        initialize: function (options) {

        },
        setOptions: function (options) {

        }
    }),
    HtmlDiv = $C.Create(HtmlControl, {
        initialize: function (options) {

        },
        setOptions: function (options) {

        }
    }),
    HtmlLabel = $C.Create(HtmlControl, {
        initialize: function (options) {

        },
        setOptions: function (options) {

        }
    }),
    HtmlGrid = $C.Create(HtmlControl, {
        initialize: function (options) {

        },
        setOptions: function (options) {

        }
    });

    HtmlControl.make = function (sType, rect, heContainer) {
        var heControl, sControl;
        switch (sType.toLowerCase()) {
            case "text":
                {
                    sControl = '<input type="text" style="width:99%;height:99%;padding:0px;margin:0px;" />';
                    break;
                }
            case "button":
                {
                    sControl = '<input type="button" value="" style="width:100%;height:100%;padding:0px;margin:0px;" />';
                    break;
                }
            case "label":
                {
                    sControl = '<label style="width:100%;height:100%;">Label</label>';
                    break;
                }
            case "textarea":
                {
                    sControl = '<textarea type="text"  style="width:99%;height:99%;padding:0px;margin:0px;"></textarea>';
                    break;
                }
            case "select":
                {
                    sControl = '<select value="" style="width:100%;height:100%;padding:0px;margin:0px;"></select>';
                    break;
                }
            case "datetime":
                {
                    sControl = '<label style="width:100%;height:100%;">Label</label>';
                    break;
                }
            case "radio":
                {
                    sControl = '<input type="radio"  style="width:100%;height:100%;" />';
                    break;
                }
            case "checkbox":
                {
                    sControl = '<input type="checkbox" value="" style="width:100%;height:100%;" />';
                    break;
                }
            case "image":
                {
                    sControl = '<img src="Form/imgs/image.png" style="width:100%;height:100%;" />';
                    break;
                }
            case "div":
                {
                    sControl = ''; // '<div src="" style="border: 1px solid black;width:100%;height:100%;"></div>';
                    break;
                }
            default: { break; }

        }
        if (sControl) {
            heControl = document.createElement("div");
            $ET.setCSS(heControl, {
                position: "absolute",
                left: rect.left + "px",
                top: rect.top + "px",
                width: rect.width + "px",
                height: rect.height + "px",
                zIndex: 300
            });
            sControl != "" && (heControl.innerHTML = sControl + '<div class="mask"></div>');
            heContainer && heContainer.appendChild(heControl);

            $E.on(heControl, "click", this.click, this);
        }

        return heControl;
    };
})(window, window.document)
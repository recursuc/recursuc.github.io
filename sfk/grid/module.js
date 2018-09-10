/*
设计器公用用模块

*/
var moduleToolBar = {
    initialize: function (options, pDesign) {
        this.pDesign = pDesign;
        this.containerWrap = options.toolBarContainer
        this.skinType = "blue";
        this.container = this.createToolbar(this.operBtns, this.containerWrap);
    },
    setDesign: function (design) {
        this.pDesign = design;
    },
    createToolbar: function (btns, container) {
        var divToolBar = document.createElement("div"),
            control, bind = $F.bind;

        for (var i = 0, len = btns.length; i < len; i++) {
            var controlType = btns[i][0] || "img";
            switch (controlType.toLowerCase()) {
                case "img":
                    control = document.createElement("img");
                    control.style.cssText = 'width:22px;height:22px;cursor:pointer;margin-left:3px;margin-right:3px;';
                    control.title = btns[i][1];
                    control.src = btns[i][2];
                    control.setAttribute("data-operName", btns[i][4][1]);
                    control[btns[i][3]] = btns[i][4][0];
                    break;
                case "select":
                    break;
                case "color":
                    control = document.createElement("input");
                    control.style.width = '4em';
                    control.setAttribute("data-operName", btns[i][4][1]);
                    control.className = btns[i][5];
                    control[btns[i][3]] = btns[i][4][0];
                    var col = new jscolor.color(control);
                    break;
                default:
                    break;
            }
            divToolBar.appendChild(control);
        }

        container && container.appendChild(divToolBar);
        return divToolBar;
    },
    show: function (design) {
        this.container.style.display = "";
        design && this.setDesign(design);
    },
    hidden: function () {
        this.container.style.display = "none";
    },
    onHandle: function (evt) {
        evt || (evt = window.event);
        var operName = (evt.srcElement || evt.target).getAttribute("data-operName");
        this.pDesign[operName] && this.pDesign[operName]();
    }
},
    moduleGrid = {
        setDOM: function (options) {
            this.DOM = {};
            this.container = options.container || document.body;
            var gird = this.heGrid = options.grid;
            this.mainView = {
                "width": 0,
                "height": 0
            };
            this.heDivMath = gird.children[0]; //ET.firstElementChild(gird);
            this.heHeadWrap = gird.children[1];
            this.heContentWrap = gird.children[2];
            this.heFootWrap = gird.children[3];

            this.heDivLeftTop = this.heHeadWrap.children[0];
            this.heDivTopHead = this.heHeadWrap.children[1]; // document.getElementById("divTopHead");
            this.heDivLeftHead = this.heContentWrap.children[0];
            this.heSheetsContainer = this.heContentWrap.children[1]; //document.getElementById("sheetsContainer");
            this.heVScrollBar = this.heContentWrap.children[2];
            //      $E.on(window, "resize", this.resize, this);
        },
        resize: function () {
            var iHeight = this.container.clientHeight,
            iWidth = this.container.clientWidth; //- document.getElementById("toolbar1").offsetHeight;

            this.mainView.height = iHeight - this.heDivMath.offsetHeight - this.heFootWrap.offsetHeight - this.heHeadWrap.offsetHeight;
            this.mainView.width = iWidth - this.heDivLeftHead.offsetWidth - this.heVScrollBar.offsetWidth;

            this.heGrid.style.height = iHeight + "px";
            this.heContentWrap.style.height = this.mainView.height + "px";
            this.heSheetsContainer.style.width = this.mainView.width + "px";
            this.heDivTopHead.style.width = this.mainView.width + "px";
            this.mathBar && (this.mathBar.DOM["table"].style.width = iWidth + "px");
            if (this.mainView.height >= this.heFootWrap.offsetHeight) {
                $ET.setCSS(this.heFootWrap, { "opacity": "1" });
            } else if (this.mainView.height > 3 - this.heFootWrap.offsetHeight) {
                $ET.setCSS(this.heFootWrap, {
                    "opacity": "0.5"
                });
            } else {
                $ET.setCSS(this.heFootWrap, { "opacity": "0" });
            }
        },
        toggle: function () {
            if (this.heGrid.style.display != "none") {
                this.heGrid.style.display = "none";
            } else {
                this.heGrid.style.display = "block";
            }
        },
        getActiveSheet: function () {
            return this.sheets.activeSheet;
        }
    },
    moduleSheets = {
        initialize: function (aSheets, pGrid) {
            this.keyPrefix || (this.keyPrefix = "sheet");
            this.DOM = {};
            this.DOM["sheetsContainer"] = this.pGrid.heSheetsContainer; // document.getElementById("sheetsContainer");
            this.sheetsPos = $ET.position(this.DOM["sheetsContainer"]);

            this.DOM["divLeftTop"] = pGrid.heDivLeftTop;
            this.DOM["divTopHead"] = pGrid.heDivTopHead; //document.getElementById("divTopHead");
            this.DOM["divLeftHead"] = pGrid.heDivLeftHead; // document.getElementById("divLeftHead");

            this.DOM["colRL"] = document.createElement("div");
            this.DOM["colRL"].display = "none"
            this.DOM["colRL"].className = "colResizeLine";

            this.DOM["rowRL"] = document.createElement("div");
            this.DOM["rowRL"].display = "none"
            this.DOM["rowRL"].className = "rowResizeLine";

            this.DOM["tooltip"] = document.createElement("div");
            this.DOM["tooltip"].style.display = "none";
            this.DOM["tooltip"].className = "tooltip";
            this.DOM["sheetsContainer"].appendChild(this.DOM["colRL"]);
            this.DOM["sheetsContainer"].appendChild(this.DOM["rowRL"]);
            this.DOM["sheetsContainer"].appendChild(this.DOM["tooltip"]);

            this.setTabDOM(pGrid.heFootWrap.children[0]);

            if ($O.getType(aSheets) == "document") {
                var sheets = [], sheet;
                for (var i = 0, len = aSheets.selectNodes(".//sheet").length; i < len; i++) {
                    sheet = aSheets.selectNodes(".//sheet")[i];
                    sheets.push({
                        active: sheet.attributes["active"] && sheet.attributes["active"].value || 1,
                        xnSheet: sheet
                    });
                }
                aSheets = sheets;
            }
            $O.getType(aSheets) == "array" || (aSheets = [{ active: 1, xnSheet: null}]);
            for (var i = 0; i < aSheets.length; i++) {
                this.addSheet(aSheets[i]);
            }

            this.activeSheet == null && this.length > 0 && (this.activeSheet = this[0]);
            $ET.addClass(this.activeSheet.DOM["span"], "activeSheetAnchor");

            this.setSliderDOM();
            this.makeSlider();

            this.page = new Paging({
                target: this.DOM["sheetTab"],
                container: this.DOM["sheetTab"].parent
                //pagecontain: 8,
                //leftcontrol: this.DOM["sheetOp"].children[1],
                //rightcontrol: this.DOM["sheetOp"].children[2]
            });
        },
        setTabDOM: function (heOp) {
            this.DOM["sheetOp"] = heOp.children[0];  //document.getElementById("sheetOp");
            this.DOM["add"] = this.DOM["sheetOp"].children[0]; // document.getElementById("add");
            this.DOM["ls"] = this.DOM["sheetOp"].children[1]; // document.getElementById("ls");
            this.DOM["rs"] = this.DOM["sheetOp"].children[2]; // document.getElementById("rs");
            this.DOM["sheetTabContainer"] = heOp.children[1];
            this.DOM["sheetTab"] = heOp.children[1].children[0]; //document.getElementById("sheetTab");
            $E.on(this.DOM["sheetOp"], "click", this.manageTab, this);
        },
        setSliderDOM: function () {
            this.DOM["hBar_Moveable"] = false;
            this.DOM["hBar"] = this.pGrid.heFootWrap.children[1]; // document.getElementById("HScrollBar");
            this.DOM["lScroll"] = $ET.firstElementChild(this.DOM["hBar"]);
            this.DOM["rScroll"] = $ET.lastElementChild(this.DOM["hBar"]);
            this.DOM["hTrack"] = $ET.nextElementSibling(this.DOM["lScroll"]); //略过空文本节点

            this.DOM["vBar_Moveable"] = false;
            this.DOM["vBar"] = this.pGrid.heContentWrap.children[2]; // document.getElementById("VScrollBar");
            this.DOM["tScroll"] = $ET.firstElementChild(this.DOM["vBar"]);
            this.DOM["dScroll"] = $ET.lastElementChild(this.DOM["vBar"]);
            this.DOM["vTrack"] = $ET.nextElementSibling(this.DOM["tScroll"]); //略过空文本节点
        },
        makeSlider: function () {
            var self = this;
            if (this.activeSheet == null) {
                return;
            }
            this.vSlider = new Slider({
                content: this.activeSheet.DOM["sheetContainer"], //被scrol的内容
                container: this.DOM["vBar"],
                bar: this.DOM["vTrack"],
                tScroll: this.DOM["tScroll"],
                dScroll: this.DOM["dScroll"],
                Horizontal: false,
                MinValue: 0,
                MaxValue: this.activeSheet.DOM["sheetContainer"].scrollHeight - this.activeSheet.DOM["sheetContainer"].clientHeight,
                onMove: function () {
                    var s = this.GetValue();
                    this.content.scrollTop = s;
                    self.activeSheet.DOM["leftTableContainer"] && (self.activeSheet.DOM["leftTableContainer"].scrollTop = s);
                    self.activeSheet.contentScrollTop = s;
                }
            });

            this.hSlider = new Slider({
                content: this.activeSheet.DOM["sheetContainer"], //被scrol的内容
                container: this.DOM["hBar"],
                bar: this.DOM["hTrack"],
                lScroll: this.DOM["lScroll"],
                rScroll: this.DOM["rScroll"],
                Horizontal: true,
                mxLeft: this.DOM["lScroll"].offsetWidth,
                mxRight: this.DOM["hBar"].clientWidth - this.DOM["rScroll"].offsetWidth,
                MinValue: 0,
                MaxValue: this.activeSheet.DOM["sheetContainer"].scrollWidth - this.activeSheet.DOM["sheetContainer"].clientWidth,
                onMove: function () {
                    var s = this.GetValue();
                    this.content.scrollLeft = s;
                    self.activeSheet.DOM["topTableContainer"] && (self.activeSheet.DOM["topTableContainer"].scrollLeft = s);
                    self.activeSheet.contentScrollLeft = s;
                }
            });

            this.resize();
        },
        getActiveSheet: function () {
            return this.activeSheet;
        },
        addSheet: function (options, klass) {
            var key = options.name || (options.name = this.keyPrefix + this.length);
            this[key] = new klass(options, this);
            if (this[key].active == 1) {
                this.activeSheet = this[key];
            }
            this.DOM["sheetTab"].appendChild(this[key].createTab(key));
            this.push(this[key]);
            this[key].name = key;
            return this[key];
        },
        delSheet: function () {
            var key = options.id;
            this.length--;
        },
        delSheet: function () { },
        changeTab: function (sheet) {
            if (this.activeSheet != sheet) {
                this.activeSheet.active = 0;
                this.activeSheet.hide();
                $ET.removeClass(this.activeSheet.DOM["span"], "activeSheetAnchor");

                sheet.active = 1;
                this.activeSheet = sheet;
                this.activeSheet.show();
                $ET.addClass(this.activeSheet.DOM["span"], "activeSheetAnchor");

                this.vSlider.setContent(this.activeSheet.DOM["sheetContainer"]);
                this.hSlider.setContent(this.activeSheet.DOM["sheetContainer"]);
                this.resize();
            }
        },
        manageTab: function (evt) {
            var target = evt.target;
            switch (target.getAttribute("data-opertype")) {
                case "+":
                    {
                        this.openAddDialog();
                        break;
                    }
                case "<":
                    {
                        page.turnleftone();
                        break;
                    }
                case ">":
                    {
                        page.turnrightone();
                        break;
                    }
                default:
                    break;
            }
        },
        get: function (arg) {
            var prop = null;
            if (arg.constructor == String) {
                return this.sheets[sName];
            } else if (arg.constructor == Number) {
                arg = arg + 1;
                for (prop in this.sheets) {
                    if (prop.substring(prop.lastIndexOf("_") + 1) == arg) {
                        return this.sheets[prop];
                    }
                }
            }
            return null;
        },
        resize: function () {
            this.hSlider.resize();
            this.vSlider.resize();
        },
        resizeHScroll: function () {
            this.hSlider.resize();
        },
        resizeVScroll: function () {
            this.vSlider.resize();
        },
        scroll: function (dir, evt) {
            switch (dir) {
                case "l":
                    {
                        break;
                    }
                case "r":
                    {
                        break;
                    }
                case "t":
                    {
                        break;
                    }
                case "d":
                    {
                        break;
                    }
                default:
                    break;
            }
        }
    },
    moduleSheet = {
        createTab: function (key) {
            var self = this;
            this.DOM["span"] = document.createElement("div");
            this.DOM["span"].className = "sheetTabPane";
            this.DOM["span"].appendChild(document.createTextNode(key));
            $E.bind(this.DOM["span"], "click", function (evt) {
                self.pSheets.changeTab(self, evt);
            })
            return this.DOM["span"];
        },
        show: function () {
            this.topTable.show();
            this.leftTable.show();
            this.mainTable.show();
        }, hide: function () {
            this.topTable.hide();
            this.leftTable.hide();
            this.mainTable.hide();
        }
    };
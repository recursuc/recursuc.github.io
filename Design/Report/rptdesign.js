/*
报表设计器
*/
(function (win) {
    var ToolBox = $C.Create({
        include: moduleGrid,
        initialize: function (options, rpt) {
            this.grid = options.heTemplate;
            this.toolBox = new Accordion({
                target: heControl,
                container: heControl.parentNode,
                titleStyle: {},
                contentStyle: {},
                maxH: 500
            });
        },
        setOptions: function (options) { },
        resize: function () {
            this.callSuper();
            this.sheets && this.sheets.resize();
        },
        insertTemplate: function () {
            var rpt = this.heRpt.cloneNode(true);
            //this.heRpt = this.heTemplate.children[0];
        },
        getActiveSheet: function () {
            return this.sheets.activeSheet;
        },
        makeConrolHtml: function () {
            var sb = new StringBuilder();
            //            sb.append('<ul class="acc_nav" id="frmToolBox">')
            //                                <li>
            //                                    <div>
            //                                        <div class="title">
            //                                            文本控件<div class="oper">
            //                                                <a href="#" panel="1">un</a></div>
            //                                        </div>
            //                                        <div class="content">
            //                                            <div class="controlContainer" style="position: relative; width: 100%; height: 500px;">
            //                                                <div style="position: absolute;">
            //                                                    <input type="text" value=" 文本框" style="width: 50px;" />
            //                                                    <div style="position: absolute; top: 0px; left: 0px; width: 100%; height: 100%; z-index: 10;">
            //                                                    </div>
            //                                                </div>
            //                                                <div style="position: absolute; top: 50px;">
            //                                                    <input type="text" value=" 文本框" style="width: 50px;" />
            //                                                    <div style="position: absolute; top: 0px; left: 0px; width: 100%; height: 100%; z-index: 10;">
            //                                                    </div>
            //                                                </div>
            //                                                <div style="position: absolute; top: 100px;">
            //                                                    <input type="text" value="" style="width: 50px;" />
            //                                                    <div style="position: absolute; top: 0px; left: 0px; width: 100%; height: 100%; z-index: 10;">
            //                                                    </div>
            //                                                </div>
            //                                            </div>
            //                                        </div>
            //                                    </div>
            //                                </li>
            //                                <li>
            //                                    <div>
            //                                        <div class="title">
            //                                            容器控件<div class="oper">
            //                                                <a href="#" panel="1">un</a>
            //                                            </div>
            //                                        </div>
            //                                        <div class="content">
            //                                            panel2--content</div>
            //                                    </div>
            //                                </li>
            //                                <li>
            //                                    <div>
            //                                        <div class="title">
            //                                            自定义控件<div class="oper">
            //                                                <a href="#" panel="1">un</a>
            //                                            </div>
            //                                        </div>
            //                                        <div class="content">
            //                                            panel3--content</div>
            //                                    </div>
            //                                </li>
            //                            </ul>'
            return $ET.nextSibingElement(this.heGrid);
        },
        toolbox: function () { },
        toString: function (sheet) {
            if (typeof sheet == "undefined") {
                return this.sheets.toString(this.sheets);
            }
        }
    }, true),
	ToolBar = $C.Create({
	    include: moduleToolBar,
	    initialize: function (options, pDesign) {
	        var onHanlde = $F.bind(this, this.onHandle),
                fontFamily = ["@Fixedsys", "@MingLiU", "@PMingLiU", "@SyStem", "华文彩云", "华文细黑", "华文新魏", "华文行楷", "华文中宋", "@新宋体", "隶书", "Basemic Symbol", "Book Antiaua", "Arial Black", "Comic sams MS", "Copperplate"],
                fontSize = ["8", "9", "10", "11", "12", "13", "14", "16", "18", "20", "24", "26", "28", "30", "32"],
                i = 0, hcScript = document.scripts, len = hcScript.length, hnScript, sPath="report/", iPos;
            /*
	        while (i < len) {
	            hnScript = hcScript[i]; iPos = hnScript.src.indexOf("rptdesign.js");
	            if (iPos != -1) {
	                sPath = hnScript.src.substring(0, iPos);
	                break;
	            }
	            i++;
	        }
             sPath + "skin/blue/images/rpt_tab_cell_insert_before.gif"
            */
	        this.operBtns = [
					["img", "上添加行", sPath + "/images/rpt_tab_cell_insert_before.gif", ["onclick"], [onHanlde, "addRowUp"], ""],
					["img", "下添加行", sPath + "/images/rpt_tab_cell_insert_after.gif", ["onclick"], [onHanlde, "addRowDown"], ""],
                    ["img", "删除行", sPath + "/images/rpt_tab_row_delete.gif", ["onclick"], [onHanlde, "delRows"], ""],
					["img", "左添加列", sPath + "/images/rpt_tab_col_insert_before.gif", ["onclick"], [onHanlde, "addColLeft"], ""],
					["img", "右添加列", sPath + "/images/rpt_tab_col_insert_after.gif", ["onclick"], [onHanlde, "addColRight"], ""],
					["img", "删除列", sPath + "/images/rpt_tab_col_delete.gif", ["onclick"], [onHanlde, "delCols"], ""],
					["img", "取消单元格合并", sPath + "/images/rpt_tab_cell_split.gif", ["onclick"], [onHanlde, "splitCells"], ""],
					["img", "合并单元格", sPath + "/images/rpt_tab_cell_merge.gif", ["onclick"], [onHanlde, "mergeCells"], ""],
					["img", "居左", sPath + "/images/rpt_left_align.gif", ["onclick"], [onHanlde, "setVAlignL"], ""],
					["img", "居中", sPath + "/images/rpt_v_center_align.gif", ["onclick"], [onHanlde, "setVAlignC"], ""],
					["img", "居右", sPath + "/images/rpt_right_align.gif", ["onclick"], [onHanlde, "setVAlignR"], ""],
					["img", "上对齐", sPath + "/images/rpt_top_align.gif", ["onclick"], [onHanlde, "setHAlignT"], ""],
					["img", "垂直居中", sPath + "/images/rpt_h_center_align.gif", ["onclick"], [onHanlde, "setHAlignC"], ""],
					["img", "下对齐", sPath + "/images/rpt_bottom_align.gif", ["onclick"], [onHanlde, "setHAlignB"], ""],
					["img", "加粗", sPath + "/images/rpt_bold.gif", ["onclick"], [onHanlde, "setFontWeight"], ""],
					["img", "倾斜", sPath + "/images/rpt_italic.gif", ["onclick"], [onHanlde, "setItalic"], ""],
					["img", "下划线", sPath + "/images/rpt_underline.gif", ["onclick"], [onHanlde, "setUnderLine"], ""],
					["color", "字体颜色", sPath + "/images/text_color.gif", ["onchange"], [onHanlde, "selColor"], "color {hash:true,pickerFaceColor:'transparent',pickerFace:3,pickerBorder:1,pickerInsetColor:'black'}"],
					["color", "背景色", sPath + "/images/color_fill.gif", ["onchange"], [onHanlde, "selBColor"], "color {hash:true,pickerFaceColor:'transparent',pickerFace:3,pickerBorder:1,pickerInsetColor:'black'}"],
					["color", "边框颜色", sPath + "/images/border_color.gif", ["onchange"], [onHanlde, "setBorderColor"], "color {hash:true,pickerFaceColor:'transparent',pickerFace:3,pickerBorder:1,pickerInsetColor:'black'}"],
					//["img", "边框设置", sPath + "/images/arrow.gif", ["onclick"], [onHanlde, "setBorderLineType"], ""],
					//["img", "边框样式", sPath + "/images/eb_line2.gif", ["onclick"], [onHanlde, "SetBorder"], ""],
                    ["select", "字体", "", ["onchange"], [onHanlde, "SetFont"], fontFamily],
					["select", "字体大小", "", ["onchange"], [onHanlde, "SetFontSize"], fontSize]
	        ];
	        this.callSuper(options, pDesign);
	    },
	    change: function (design) {
	        if (this.curDesign != design) {
	            this.curDesign = design;
	            this.activate(design.type);
	        }
	    },
	    activate: function (type) {
	        if (this.heToolbars[type] != null) {
	            this.active != null ? this.active.style.display = "none" : "";
	            this.heToolbars[type].style.display = "block";
	            this.active = this.heToolbars[type];
	        }
	    },
	    getCurSheet: function () {
	        return this.curDesign.getActiveSheet();
	    }
	}, true),
	ReportSheets = $C.Create(Array, {
	    include: [moduleSheets],
	    initialize: function (aSheets, pGrid) {
	        this.pGrid = pGrid || null;
	        this.keyPrefix = "rpt";
	        this.callSuper(aSheets, pGrid);
	    },
	    setOptions: function (aSheets) { },
	    addSheet: function (options) {
	        return this.callSuper(options, ReportSheet);
	    },
	    delSheet: function () {
	        this.callSuper();
	    },
	    openAddDialog: function () {
	        sDialog.open({
	            scope: this,
	            width: 300,
	            height: 200,
	            title: 'Sheet行列输入',
	            content: '<label style="margin-right:10px;">名称:</label><input type="text" id="txtSheetName" value="sheet' + this.length + '"><br/><br/>'
					+ '<label style="margin-right:10px;">行数:</label><input type="text" id="txtRow" value=""><br/><br/>'
					+ '<label style="margin-right:10px;">列数:</label><input type="text" id="txtCol" value=""><br/>',
	            onConfirm: function () {
	                var sheet = this.addSheet({
	                    id: document.getElementById("txtSheetName").value || "sheet" + this.length,
	                    row: parseInt(document.getElementById("txtRow").value) || 5,
	                    col: parseInt(document.getElementById("txtCol").value) || 5,
	                    active: 1
	                });
	                this.changeTab(sheet);
	            },
	            onCancel: function () { },
	            fixed: true,
	            overlay: true,
	            drag: true,
	            lock: false
	        });
	    },
	    mergeCells: function () {
	        this.activeSheet.mergeCells();
	    },
	    splitCells: function () {
	        this.activeSheet.splitCells();
	    },
	    hBar_MouseDown: function (evt) { },
	    hBar_MouseMove: function (evt) { },
	    hBar_MouseUp: function (evt) { },
	    toString: function (asheets) {
	        var sb = new StringBuilder();
	        sb.append("<Sheets>");
	        for (var i = 0; i < asheets.length; i++) {
	            sb.append(asheets[i].toString());
	        }
	        sb.append("</Sheets>");
	        sb.append("<DataSource><DataSet DbId=\"\" Name=\"\" Type=\"\" DataTablePrefix=\"\" State=\"\" MainTable=\"\" ConnString=\"\"/></DataSource>");
	        sb.append("<Arguments><Argument Name=\"\" DataType=\"\" Value=\"\" ChineseName=\"\" Format=\"\" MinLength=\"\" MaxLength=\"\" RefDsDetail=\"[[10,'ds_test_sql_zc',1]]\" type=\"\" /></Arguments>");
	        sb.append("<Style>.A1 { color:red; }</Style>");
	        sb.append("<RuntimeStyle/>");
	        return sb.toString();
	    }
	}),
	MathBar = $C.Create({
	    initialize: function (pGrid) {
	        //左表格123...
	        var i = 0,
				that = this,
				row,
				input,
				sbTab = new StringBuilder();
	        this.DOM = {};
	        this.pGrid = pGrid;

	        sbTab.append('<table id="MathBar" border=0  cellPadding=0 cellSpace=0 style="background-color: #c4d9f2;table-layout: fixed; height:30px;background-image: url(skin/blue/images/toolbarbg.gif);">');
	        sbTab.append('<tr align="center">');
	        sbTab.append('<td id="colName" width="65px" align="center"></td>');
	        sbTab.append('<td width="20px" align="center" style="border:0px 1px;">=</td>');
	        sbTab.append('<td></td><td width="60px"></td>');
	        sbTab.append('</tr></table>');
	        this.pGrid.heDivMath.innerHTML = sbTab.toString();

	        this.DOM["table"] = $ET.firstElementChild(this.pGrid.heDivMath);
	        this.DOM["table"].style.width = this.pGrid.container.clientWidth;
	        row = this.DOM["table"].rows[0];
	        //this.DOM["table"].onselectstart = function () { return false };
	        this.DOM["mathExp"] = document.createElement("input");
	        this.DOM["mathExp"].type = "text";

	        this.DOM["rangePos"] = this.DOM["mathExp"].cloneNode();
	        this.DOM["rangePos"].style.cssText = "width:100%;text-align:center;"
	        row.cells[0].appendChild(this.DOM["rangePos"]);

	        this.DOM["mathExp"].style.cssText = "border-bottom: medium; width: 100%;";
	        row.cells[2].appendChild(this.DOM["mathExp"]);
	    }
	}),
	Grid = $C.Create({
	    include: moduleGrid,
	    initialize: function (options, rpt) {
	        var self = this,
				ET = $ET;
	        this.rpt = rpt;
	        this.type = "report";
	        //this.heRpt = this.rpt.heTemplate.children[1];
	        this.setDOM(options);
	        this.setOptions(options.sheets);

	        this.toolBar = new ToolBar(options, this);
	        this.toolBar.setDesign(this);
	        this.mathBar = new MathBar(this);
	        this.resize();
	        this.sheets = new ReportSheets(this.data, this);
	        //this.toolBox = new toolBox(options.toolBoxContainer, this);
	    },
	    setOptions: function (options) {
	        var defalutOptions = {
	            row: 5,
	            col: 5
	        };

	        this.data = [];
	        this.srcData = options.constructor != Array ? [options] : options;
	        for (var i = 0; i < this.srcData.length; i++) {
	            this.data[i] = $O.clone(defalutOptions);
	            $O.extend(this.data[i], this.srcData[i]);
	        }
	    },
	    resize: function () {
	        this.callSuper();
	        this.sheets && this.sheets.resize();
	    },
	    getParamsDesin: function () {
	        return $ET.nextSibingElement(this.heGrid);
	    },
	    toString: function (sheet) {
	        if (typeof sheet == "undefined") {
	            return this.sheets.toString(this.sheets);
	        }
	    },
	    save: function () {

	    },
	    show: function () {
	        //this.toolBox.show(this);
	        this.toolBar.show(this);
	    },
	    hidden: function () {
	        //this.toolBox.hidden(this);
	        this.toolBar.hidden(this);
	    },
	    mergeCells: function () {
	        this.sheets.activeSheet.mergeCells();
	    },
	    splitCells: function () {
	        this.sheets.activeSheet.splitCells();
	    },
	    addRowUp: function () {
	        this.sheets.activeSheet.insertRows('u');
	    },
	    addRowDown: function () {
	        this.sheets.activeSheet.insertRows('d');
	    },
	    delRows: function () {
	        this.sheets.activeSheet.delRows();
	    },
	    addColLeft: function () {
	        this.sheets.activeSheet.insertCols("l");
	    },
	    addColRight: function () {
	        this.sheets.activeSheet.insertCols("r");
	    },
	    delCols: function () {
	        this.sheets.activeSheet.delCols();
	    },
	    DataSourceSet: function () {
	        window.showCustomDialog("DataSource/attribute/datasource.htm", [window.datasource, window.argsDom], "dialogWidth:830px;dialogHeight:410px;resizable:no;cover:yes;id=dsSet;title:数据源设置", null, function (dsAndSqlArgs) {
	            if (typeof dsAndSqlArgs != "undefined") {
	                window.datasource = dsAndSqlArgs[0]; //数据集对象
	                window.argsDom = dsAndSqlArgs[1]; //参数
	                return window.datasource;
	            }
	        });
	    }
	}),
	ReportDesign = $C.Create({
	    initialize: function (options, design) {
	        this.container = options.heTemplate;
	        this.name = options.name;
	        this.style = "";
	        this.script = "";
	        this.type = "report";
	        this.active = null;
	        this.options = options;
	        this.pDesign = design;
	        this.add(options.xnSheet);
	    },
	    setOptions: function (options) { },
	    swicthToParams: function () { },
	    add: function (xnSheet) {
	        this.grid = new Grid(xnSheet || {
	            container: this.container,
	            grid: this.container.children[0],
	            sheets: [{
	                id: "sheet0",
	                row: 6,
	                col: 4,
	                active: 1
	            }, {
	                id: "sheet1",
	                row: 8,
	                col: 30,
	                active: 0
	            }],
	            toolBarContainer: this.options.toolBarContainer,
	            toolBoxContainer: this.options.toolBoxContainer
	        }, this);
	        this.active = this.grid;

	        this.container.children[1].style.display = "";
	        this.form = new FormDesign({
	            xnSheet: xnSheet,
	            toolBarContainer: this.options.toolBarContainer,
	            toolBoxContainer: this.options.toolBoxContainer,
	            isParamDesin: true,
	            heTemplate: this.container.children[1]
	        }, this);
	        this.form.hidden();

	        var sTime, _this = this;
	        this.heQCLink = this.container.children[2];
	        this.dragLink = new Drag(this.heQCLink, {
	            mxContainer: this.container,
	            Limit: true,
	            onStart: function (evt) {
	                sTime = evt.timeStamp;
	            },
	            onMove: function () {
	                sTime = sTime - 500;
	            },
	            onStop: function (helper, evt) {
	                var diff = evt.timeStamp - sTime;
	                if (diff < 500) {
	                    _this.goParamDesin(evt);
	                }
	                //	                alert(diff);
	            }
	        })
	        //$E.on(this.heQCLink, "", this.goParamDesin, this);
	    },
	    createTemplate: function () {
	        var rpt = this.heRpt.cloneNode(true);
	        //this.heRpt = this.heTemplate.children[0];
	    },
	    resize: function () {
	        this.grid.resize.apply(this.grid, arguments);
	    },
	    getActiveSheet: function () {
	        this.active.getActiveSheet();
	    },
	    goParamDesin: function (evt) {
	        if (this.active == this.grid) {
	            this.grid.hidden();
	            this.active = this.form
	            $ET.text(this.heQCLink.children[0], "报表设计");
	        } else {
	            this.form.hidden();
	            this.active = this.grid;
	            $ET.text(this.heQCLink.children[0], "参数设计");
	        }
	        this.active.show();
	    },
	    show: function () {
	        //this.active.toolBox.show(this);
	        this.active.show();
	    },
	    hidden: function () {
	        // this.active.toolBox.hidden(this);
	        this.active.hidden();
	    }
	});

    win.ReportDesign = ReportDesign;
})(window);

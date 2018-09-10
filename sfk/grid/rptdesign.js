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
	        var onHanlde = (this, this.onHandle);
	        this.operBtns = [
					["img", "打开", "skin/blue/images/design_open.gif", ["onclick"], [onHanlde, "open"]],
					["img", "保存", "skin/blue/images/design_save.gif", ["onclick"], [onHanlde, "save"]],
					["img", "另存为", "skin/blue/images/design_saveas.gif", ["onclick"], [onHanlde, "saveAs"]],
					["img", "预览", "skin/blue/images/design_run.gif", ["onclick"], [onHanlde, "View"]],
					["img", "剪切(Ctrl+X)", "skin/blue/images/design_cut.gif", ["onclick"], [onHanlde, "cut"]],
					["img", "复制(Ctrl+C)", "skin/blue/images/design_copy.gif", ["onclick"], [onHanlde, "copy"]],
					["img", "粘贴(Ctrl+V)", "skin/blue/images/design_paste.gif", ["onclick"], [onHanlde, "paste"]],
					["img", "撤销(Ctrl+Z)", "skin/blue/images/design_undo.gif", ["onclick"], [onHanlde, "reback"]],
					["img", "回撤(Ctrl+Alt+Z)", "skin/blue/images/design_redo.gif", ["onclick"], [onHanlde, "redo"]],
					["img", "格式化(Ctrl+Shift+C)", "skin/blue/images/design_reflash.gif", ["onclick"], [onHanlde, "format"]],
					["img", "上添加行", "skin/blue/images/ef_tab_cell_insert_before.gif", ["onclick"], [onHanlde, "addRoWup"]],
					["img", "下添加行", "skin/blue/images/ef_tab_cell_insert_after.gif", ["onclick"], [onHanlde, "addRowDown"]],
                    ["img", "删除行", "skin/blue/images/ef_tab_row_delete.gif", ["onclick"], [onHanlde, "delRows"]],
					["img", "左添加列", "skin/blue/images/ef_tab_col_insert_before.gif", ["onclick"], [onHanlde, "addColLeft"]],
					["img", "右添加列", "skin/blue/images/ef_tab_col_insert_after.gif", ["onclick"], [onHanlde, "addColRight"]],
					["img", "删除列", "skin/blue/images/ef_tab_col_delete.gif", ["onclick"], [onHanlde, "delCols"]],
					["img", "报表属性", "skin/blue/images/ef_tab_table_prop.gif", ["onclick"], [onHanlde, "tableAttri"]],
					["img", "行属性", "skin/blue/images/ef_tab_row_prop.gif", ["onclick"], [onHanlde, "rowsAttri"]],
					["img", "列属性", "skin/blue/images/ef_tab_col_prop.gif", ["onclick"], [onHanlde, "columnAttri"]],
					["img", "单元格属性", "skin/blue/images/ef_tab_cell_prop.gif", ["onclick"], [onHanlde, "cellAttri"]],
					["img", "设置单元格公式", "skin/blue/images/design_TDX.gif", ["onclick"], [onHanlde, "cellMathSet"]],
					["img", "取消单元格合并", "skin/blue/images/ef_table_split.gif", ["onclick"], [onHanlde, "splitCells"]],
					["img", "合并单元格", "skin/blue/images/ef_tab_merge.gif", ["onclick"], [onHanlde, "mergeCells"]],
					["img", "数据源设置", "skin/blue/images/design_DS.gif", ["onclick"], [onHanlde, "DataSourceSet"]],
					["img", "插入图表", "skin/blue/images/design_chart.jpg", ["onclick"], [onHanlde, "InsertChart"]],
					["img", "报表参数", "skin/blue/images/args.gif", ["onclick"], [onHanlde, "SetArguments"]],
					["img", "样式自定义", "skin/blue/images/setCssStyle.gif", ["onclick"], [onHanlde, "SetCssStyle"]],
					["select", "字体", "", ["onclick"], [onHanlde, "SetFont"]],
					["select", "字体大小", "", ["onclick"], [onHanlde, "SetFontSize"]],
					["img", "居左", "skin/blue/images/left_align.gif", ["onclick"], [onHanlde, "SetVAlignL"]],
					["img", "居中", "skin/blue/images/v_center_align.gif", ["onclick"], [onHanlde, "SetVAlignC"]],
					["img", "居右", "skin/blue/images/right_align.gif", ["onclick"], [onHanlde, "SetVAlignR"]],
					["img", "上对齐", "skin/blue/images/up_align.gif", ["onclick"], [onHanlde, "SetHAlignT"]],
					["img", "垂直居中", "skin/blue/images/h_center.gif", ["onclick"], [onHanlde, "SetHAlignC"]],
					["img", "下对齐", "skin/blue/images/bottom_align.gif", ["onclick"], [onHanlde, "SetHAlignB"]],
					["img", "加粗", "skin/blue/images/bold.gif", ["onclick"], [onHanlde, "SetFontWeight"]],
					["img", "倾斜", "skin/blue/images/italic.gif", ["onclick"], [onHanlde, "SetItalic"]],
					["img", "下划线", "skin/blue/images/underline.gif", ["onclick"], [onHanlde, "SetUnderLine"]],
					["img", "字体颜色", "skin/blue/images/text_color.gif", ["onclick"], [onHanlde, "SelColor"]],
					["img", "背景色", "skin/blue/images/color_fill.gif", ["onclick"], [onHanlde, "SelBColor"]],
					["img", "边框颜色", "skin/blue/images/border_color.gif", ["onclick"], [onHanlde, "SetBorderColor"]],
					["img", "边框设置", "skin/blue/images/arrow.gif", ["onclick"], [onHanlde, "SetBorder"]],
					["img", "边框样式", "skin/blue/images/arrow.gif", ["onclick"], [onHanlde, "SetBorder"]],
					["img", "导入", "skin/blue/images/design_ds_import.gif", ["onclick"], [onHanlde, "loadXml"]]
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
	        var _this = this;
	        sDialog.open({
	            header: 'Sheet行列输入',
	            content: '<label style="margin-right:10px;">名称:</label><input type="text" id="txtSheetName" value="sheet' + _this.length + '"><br/><br/>'
					+ '<label style="margin-right:10px;">行数:</label><input type="text" id="txtRow" value=""><br/><br/>'
					+ '<label style="margin-right:10px;">列数:</label><input type="text" id="txtCol" value=""><br/>',
	            footer: [{
	                type: "button",
	                text: "确定",
	                click: function () {
	                    var sheet = _this.addSheet({
	                        id: document.getElementById("txtSheetName").value || "sheet" + _this.length,
	                        row: parseInt(document.getElementById("txtRow").value) || 5,
	                        col: parseInt(document.getElementById("txtCol").value) || 5,
	                        active: 1
	                    });
	                    _this.changeTab(sheet);
	                }
	            }, {
	                type: "button",
	                text: "取消",
	                click: function () {
	                    sDialog.close();
	                }
	            }
				],
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
	    delRow: function () {
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
	                row: 30,
	                col: 30,
	                active: 1
	            }, {
	                id: "sheet1",
	                row: 35,
	                col: 5,
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

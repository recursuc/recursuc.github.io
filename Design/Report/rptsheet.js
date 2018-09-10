/*
ReportSheet
*/
(function (win) {
    var LeftTable = $C.Create({
        initialize: function (options, pSheet) {
            //左表格123...     
            var i = 0,
            self = this,
            sbTab = new StringBuilder();
            if (arguments.length == 0) {
                return;
            }
            this.setOptions(options);
            this.DOM = {};
            this.pSheet = pSheet;
            this.pSheets = this.pSheet.pSheets;
            sbTab.append('<table  border="0px" class="leftTable" cellpadding="0" cellspacing="0" width="100%">');
            sbTab.append("<thead>");
            sbTab.append("<tr style='height:0px; background-color:#bed6ef;'>");
            sbTab.append('<td style="height:0px;"></td>');
            sbTab.append("</tr>");
            sbTab.append("</thead><tbody>");
            if (!options.xnSheet) {
                for (i = 0; i < this.row; i++) {
                    sChar = i + 1;
                    sbTab.append('<tr style="height:' + this.pSheet.trHeight + 'px;">');
                    sbTab.append('<td>' + sChar + '</td>');
                    sbTab.append('</tr>');
                }
            } else {
                var oTrs = pSheet.mainTable.DOM["table"].tBodies[0].rows;
                this.row = oTrs.length;
                for (i = 0; i < this.row; i++) {
                    sChar = i + 1;
                    sbTab.append('<tr style="height:' + parseInt(oTrs[i].style.height) + 'px;">');
                    sbTab.append('<td>' + sChar + '</td>');
                    sbTab.append('</tr>');
                }
            }
            sbTab.append('</tbody>');
            sbTab.append('</table>');
            this.pSheet.pSheets.DOM["divLeftHead"].insertAdjacentHTML("beforeend", '<div class="mgb sheetPane" style="display:' + (this.active == 1 ? ";" : "none;") + '" >' + sbTab.toString() + '</div>');
            this.pSheet.DOM["leftTableContainer"] = $ET.lastElementChild(this.pSheet.pSheets.DOM["divLeftHead"]);
            this.DOM["table"] = $ET.lastElementChild(this.pSheet.DOM["leftTableContainer"]);
        },
        setOptions: function (options) {
            this.row = options.row;
            this.active = options.active != undefined ? options.active : 0;
        },
        over: function (evt) {
            var oTd = evt.target,
            mousePos = oTd.tagName.toLowerCase() == "td" ? evt.getMouseRelPos() : null;
            if (mousePos != null) {
                if (mousePos.top <= 1 || mousePos.top >= oTd.offsetHeight - 2) {
                    oTd.style.cursor = evt.evtData.cursor; // "col-resize";
                    //evt.clientX = evt.clientX + 10;
                    evt.evtData.curTd = oTd;
                } else {
                    oTd.style.cursor = "";
                }
            }
        },
        move: function (evt) {
            var data = evt.evtData;
            window.getSelection ? window.getSelection().removeAllRanges() : document.selection.empty();
            if (data.moveable) {
                data.line.style.top = evt.clientY - data.diffMLY + "px";
            } else {
                this.over(evt);
            }
        },
        start: function (evt) {
            var data = evt.evtData,
            tdTop = 0;
            if (data.curTd.style.cursor == data.cursor) {
                data.line || (data.line = this.pSheets.DOM["rowRL"]);
                if (this.pSheet.mainTable.DOM["txtEdit"].style.display != "none") { this.pSheet.mainTable.DOM["txtEdit"].style.display = "none" }
                data.moveable = true;
                data.curTd = evt.target;
                tdTop = $ET.position(data.curTd, this.pSheet.DOM["leftTableContainer"]).top;
                if (evt.getMouseRelPos().top < 2) {
                    data.curTd = data.curTd.parentNode.previousSibling.firstChild;
                } else {
                    tdTop += data.curTd.offsetHeight;
                }

                data.lineTop = tdTop - 1 - this.pSheet.DOM["leftTableContainer"].scrollTop;
                data.diffMLY = evt.clientY - data.lineTop;
                $ET.setCSS(data.line, {
                    width: this.pSheet.mainTable.DOM["table"].offsetWidth + "px",
                    display: "block",
                    top: data.lineTop + "px",
                    zIndex: 100
                });
                if ($B.ie) {
                    //焦点丢失
                    $E.bind(this.DOM["table"], "losecapture", data.fs, true);
                    //设置鼠标捕获
                    this.DOM["table"].setCapture();
                } else {
                    //焦点丢失
                    $E.bind(window, "blur", data.fs, true);
                    //阻止默认动作
                    evt.preventDefault();
                };

                document.body.style.cursor = evt.evtData.cursor;
                return true;
            }
        },
        stop: function (evt) {
            var data = evt.evtData,
            oTr,
            height;
            if (data.moveable) {
                oTr = data.curTd.parentNode;
                height = parseInt(oTr.style.height) + parseInt(data.line.style.top) - data.lineTop;
                if (height >= 0) {
                    oTr.style.height = height + "px";
                    data.curTd.style.height = height - $ET.getStyleByPx(data.curTd, "borderBottomWidth") + "px";
                    this.pSheet.mainTable.DOM["table"].rows[oTr.rowIndex].style.height = height + "px";
                    if (height != $ET.getStyleByPx(oTr, "height")) {
                        $ET.setCSS(data.curTd, {
                            height: height + "px",
                            overflow: "hidden",
                            lineHeight: height - $ET.getStyleByPx(data.curTd, "borderBottomWidth") + "px"
                        });

                        this.pSheet.mainTable.DOM["table"].rows[oTr.rowIndex].style.lineHeight = height - $ET.getStyleByPx(data.curTd, "borderBottomWidth") + "px";
                    } else {
                        data.curTd.style.lineHeight = "";
                        this.pSheet.mainTable.DOM["table"].rows[oTr.rowIndex].style.lineHeight = "";
                    }
                }
                data.moveable = false;
                data.curTd.style.cursor = "";
                data.line.style.display = "none";

                document.body.style.cursor = "";
                $E.unbind(document, "mousemove", data.fm, true);
                $E.unbind(document, "mouseup", data.fs, true);

                if ($B.ie) {
                    $E.unbind(this.DOM["table"], "losecapture", data.fs, true);
                    this.DOM["table"].releaseCapture();
                } else {
                    $E.unbind(window, "blur", data.fs, true);
                }
                this.pSheet.pGrid.resize();
            }
        },
        insertRows: function (dir, sRow, count) {
            var row = sRow,
            table = this.DOM["table"],
            RLen,
            refTr = (dir == "u" ? table.rows[row] : (++row < table.rows.length ? table.rows[row] : null)),
            pTr = refTr ? refTr.parentNode : table.rows[sRow].parentNode,
            oTr = document.createElement("tr");

            oTr.style.height = this.pSheet.trHeight + "px";
            oTr.appendChild(document.createElement("td"));
            while (count--) {
                pTr.insertBefore(oTr, refTr);
                oTr = oTr.cloneNode(true);
            }
            RLen = table.rows.length;
            while (row < RLen) {
                $ET.text(table.rows[row].cells[0], row);
                row++;
            }
        },
        delRows: function (sRow, count) {
            var row = sRow,
            RLen,
            table = this.DOM["table"];

            while (count--) {
                table.deleteRow(sRow);
            }
            RLen = table.rows.length;
            //            row--;
            while (row < RLen) {
                $ET.text(table.rows[row].cells[0], row);
                row++;
            }
        },
        setSelectedTdStyle: function (top, bottom) {
            var table = this.DOM["table"],
             index, len;

            for (index = 0, len = table.rows.length; index < len; index++) {
                if (top <= index && index <= bottom) {
                    $ET.addClass(table.rows[index].cells[0], "tdSelected");
                } else {
                    $ET.removeClass(table.rows[index].cells[0], "tdSelected");
                }
            }
        },
        show: function () {
            this.DOM["table"].parentNode.style.display = "block";
        }, hide: function () {
            this.DOM["table"].parentNode.style.display = "none";
        }
    }),
    TopTable = $C.Create({
        initialize: function (options, pSheet) {
            //上顶表格ABC...
            var i = 0,
               that = this,
                sbTab = new StringBuilder();

            this.setOptions(options);
            this.DOM = {};
            this.pSheet = pSheet;
            this.pSheets = this.pSheet.pSheets;
            //上头ABC..
            sbTab.append('<table  class="topTable" cellpadding="0" cellspacing="0"  height="100%">');
            sbTab.append('<tr align="center" style="height: 21px;">');
            for (i = 0; i < this.col; i++) {
                var sChar = this.digitToChar(i);
                sbTab.append('<td style="border-bottom-width: 0px;width:' + this.pSheet.tdWidth + 'px;">' + sChar + '</td>'); //<div  style="float:right;width:3px;margin-right:-2px; cursor:col-resize; "></div>
            }
            sbTab.append('</tr>');
            sbTab.append('</table>');

            this.pSheet.pSheets.DOM["divTopHead"].insertAdjacentHTML("beforeend", '<div class="mgb sheetPane" style="display:' + (this.active == 1 ? ";" : "none;") + '" >' + sbTab.toString() + '</div>');
            this.pSheet.DOM["topTableContainer"] = $ET.lastElementChild(this.pSheet.pSheets.DOM["divTopHead"]);
            this.DOM["table"] = $ET.lastElementChild(this.pSheet.DOM["topTableContainer"]);
        },
        setOptions: function (options) {
            this.col = options.col;
            this.active = options.active != undefined ? options.active : 0;
        },
        over: function (evt) {
            var oTd = evt.target,
                mousePos = oTd.tagName.toLowerCase() == "td" ? evt.getMouseRelPos() : null;
            if (mousePos != null) {
                if (mousePos.left <= 1 || mousePos.left >= oTd.offsetWidth - 2) {
                    oTd.style.cursor = evt.evtData.cursor; // "col-resize";
                    //evt.clientX = evt.clientX + 10;
                    evt.evtData.curTd = oTd;
                } else {
                    oTd.style.cursor = "";
                }
            }
        },
        move: function (evt) {
            var data = evt.evtData;
            if (data.moveable) {
                window.getSelection ? window.getSelection().removeAllRanges() : document.selection.empty();
                data.line.style.left = evt.clientX - data.diffMLX + "px";
            } else {
                this.over(evt);
            }
        },
        start: function (evt) {
            var data = evt.evtData,
                    tdLeft = 0;
            if (data.curTd.style.cursor == data.cursor) {
                data.line || (data.line = this.pSheets.DOM["colRL"]);

                if (this.pSheet.mainTable.DOM["txtEdit"].style.display != "none") { this.pSheet.mainTable.DOM["txtEdit"].style.display = "none" }
                data.moveable = true;
                data.curTd = evt.target;
                tdLeft = $ET.position(evt.target, this.DOM["table"]).left;
                if (evt.getMouseRelPos().left < 2) {
                    data.curTd = data.curTd.previousSibling
                } else {
                    tdLeft += data.curTd.offsetWidth;
                }
                data.lineLeft = tdLeft - 1 - -this.pSheet.DOM["topTableContainer"].scrollLeft;

                data.diffMLX = evt.clientX - data.lineLeft;
                $ET.setCSS(data.line, {
                    height: this.pSheet.mainTable.DOM["table"].offsetHeight + "px",
                    display: "block",
                    left: data.lineLeft + "px",
                    zIndex: 100
                });
                if ($B.ie) {
                    //焦点丢失
                    $E.bind(this.DOM["table"], "losecapture", data.fs, true);
                    //设置鼠标捕获
                    this.DOM["table"].setCapture();
                } else {
                    //焦点丢失
                    $E.bind(window, "blur", data.fs, true);
                    //阻止默认动作
                    evt.preventDefault();
                };

                document.body.style.cursor = evt.evtData.cursor;
                return true;
            }
        },
        stop: function (evt) {
            var data = evt.evtData, width;
            if (data && data.moveable) {
                width = parseInt(data.curTd.style.width) + parseInt(data.line.style.left) - data.lineLeft;
                width > 0 && (data.curTd.style.width = width + "px", this.pSheet.mainTable.DOM["table"].rows[0].cells[data.curTd.cellIndex].style.width = width + "px");
                data.moveable = false;
                data.curTd.style.cursor = "";
                data.line.style.display = "none";
                document.body.style.cursor = "";
                $E.unbind(document, "mousemove", data.fm, true);
                $E.unbind(document, "mouseup", data.fs, true);

                if ($B.ie) {
                    $E.unbind(this.DOM["table"], "losecapture", data.fs, true);
                    this.DOM["table"].releaseCapture();
                } else {
                    $E.unbind(window, "blur", data.fs, true);
                }
                this.pSheet.pGrid.resize();
            }
        },
        insertCols: function (dir, sCol, count) {
            var col = sCol,
            RLen,
            oTr = this.DOM["table"].rows[0], oTd, CLen,
            refTd = dir == "l" ? oTr.cells[sCol] : (sCol + 1 < oTr.cells.length ? oTr.cells[sCol + 1] : null);

            oTd = document.createElement("td");
            oTd.style.width = this.pSheet.tdWidth + "px";
            while (count--) {
                oTr.insertBefore(oTd, refTd);
                oTd = oTd.cloneNode();
            }
            oTd = null;
            CLen = oTr.cells.length;
            while (col < CLen) {
                $ET.text(oTr.cells[col], this.digitToChar(col));
                col++;
            }
        },
        delCols: function (sCol, count) {
            var col = sCol,
            RLen,
            oTr = this.DOM["table"].rows[0], oTd, CLen;

            while (count--) {
                oTr.deleteCell(sCol);
            }

            CLen = oTr.cells.length;
            while (col < CLen) {
                $ET.text(oTr.cells[col], this.digitToChar(col));
                col++;
            }
        },
        setSelectedTdStyle: function (left, right) {
            var table = this.DOM["table"],
             index, tRow, len;

            for (index = 0, tRow = table.rows[0], len = tRow.cells.length; index < len; index++) {
                if (left <= index && index <= right) {
                    $ET.addClass(tRow.cells[index], "tdSelected");
                } else {
                    $ET.removeClass(tRow.cells[index], "tdSelected");
                }
            }
        },
        digitToChar: function (digit) {
            var aStack = [], m = 0;
            while (digit >= 0) {
                m = digit % 26;
                aStack.unshift(String.fromCharCode(65 + m));

                digit = parseInt(digit / 26) - 1;
            }
            /*  序号从1开始  1A 2B..
            while (digit > 0) {
            m = digit % 26,
            digit = parseInt(digit / 26);
            if (m == 0) {
            digit = digit - 1;
            aStack.unshift("Z");
            } else {
            aStack.unshift(String.fromCharCode(64 + m));
            }
            }*/

            return aStack.join("");
        },
        show: function () {
            this.DOM["table"].parentNode.style.display = "";
        }, hide: function () {
            this.DOM["table"].parentNode.style.display = "none";
        }
    }),
    MainTable = $C.Create({
        initialize: function (sheet, pSheet) {
            var i = 0,
            j = 0,
            sChar = "",
            sInput = "",
            sRangBox = "",
            that = this;
            sheetContainer = null,
            aLine = ["NL", "EL", "SL", "WL"], aHeLine = [], name,
            sbTab = new StringBuilder();

            this.setOptions(sheet);

            this.DOM = {};
            this.pSheet = pSheet;
            this.pSheets = this.pSheet.pSheets;
            this.sheetContainer = sheetContainer = this.pSheet.DOM["sheetContainer"];
            //主数据表格 表头
            if (!sheet.xnSheet) {//新建
                sbTab.append("<table class='fixedTable' cellpadding='0' cellspacing='0'>");
                sbTab.append("<thead>");
                sbTab.append("<tr style='background-color:#bed6ef;height:0px;'>");
                for (j = 0; j < this.col; j++) {
                    sbTab.append("<td style='width:" + this.pSheet.tdWidth + "px;'></th>");
                }
                sbTab.append("</tr>");
                sbTab.append("</thead><tbody>");

                for (i = 0; i < this.row; i++) {
                    sbTab.append("<tr style='height:" + this.pSheet.trHeight + "px;'>");
                    for (j = 0; j < this.col; j++) {
                        sbTab.append("<td class ='" + String.fromCharCode(j + 65) + (i + 1) + "'></td>");
                    }
                    sbTab.append("</tr>");
                }
                sbTab.append("</tbody>");
                sbTab.append("</table>");
            } else {//回填
                sbTab.append(sheet.xnSheet.xml); // 效率慢就单独拼
            }
            sInput = '<input  type="text" name="txtEdit" style="display: none; z-index: 0; position: absolute;text-align: ; width: 69px; height: 16px; font-family: ; font-weight: ; overflow: hidden;"  value="" />';
            sRangBox = "<div><div tabindex='-1'></div></div>";

            sheetContainer.insertAdjacentHTML("beforeend", sbTab.toString() + sInput + sRangBox);

            this.DOM["table"] = $ET.firstElementChild(sheetContainer);
            this.DOM["txtEdit"] = $ET.nextElementSibling(this.DOM["table"]); ;
            this.DOM["rangeBox"] = $ET.lastElementChild($ET.lastElementChild(sheetContainer));
            for (i = 0; i < aLine.length; i++) {
                name = aLine[i];
                this.DOM[name] = document.createElement("div");
                this.DOM[name].className = 'rangBox';
                this.DOM["rangeBox"].insertBefore(this.DOM[name], this.DOM["rangeBox"].firstChild);
                //sRangBox += "<div id='" + aLine[i] + "' class ='rangBox'></div>";
            }

            $E.bind(this.DOM["txtEdit"], "keyup", {
                scope: this,
                fn: function (evt) {
                    if (this.pSheet.pGrid.mathBar) {
                        this.pSheet.pGrid.mathBar.DOM["mathExp"].value = this.DOM["txtEdit"].value;
                    }
                    evt.stopPropagation();
                    //oRng = this.createTextRange();
                    //oRng.collapse(true);
                    //oRng.moveStart('character', this.value.length);
                    //oRng.select();
                }
            });
            $E.bind(this.DOM["txtEdit"], "keydown", {
                scope: this,
                fn: function (evt) {
                    evt.stopPropagation();
                }
            });
            this.matrix = [];
            this.totalRow = this.DOM["table"].rows.length;
            this.mapMatrix(this.DOM["table"]);

            this.rangeInit(aLine, sheetContainer);
        },
        setOptions: function (options) {
            this.row = options.row;
            this.col = options.col;
            this.active = options.active != undefined ? options.active : 0;
        },
        rangeInit: function (aLine, sheetContainer) {
            var rangeSel = {
                moveable: false,
                mainTable: this.DOM["table"],
                rangeBox: this.DOM["rangeBox"],
                fm: null,
                fs: null,
                sTd: null,
                eTd: null,
                recRange: null,
                mvRec: null
            }, i, name;

            for (i = 0; i < aLine.length; i++) {
                name = aLine[i];
                rangeSel[name] = this.DOM[name];
            }
            $E.bind(this.DOM["table"], "mousedown", {
                scope: this,
                fn: function (evt) {
                    var timer = null, data = evt.evtData;
                    data.fm || (data.fm = $E.argBind(this, this.move, data));
                    data.fs || (data.fs = $E.argBind(this, this.stop, data));
                    sheetContainer.parentNode.focus();
                    this.txtInputInRange(evt);
                    this.start(evt);
                    data.mvRect = $ET.getRect(sheetContainer);

                    if (data.moveable) {
                        $E.bind(document, "mousemove", data.fm, true);
                        $E.bind(document, "mouseup", data.fs, true);
                    }
                },
                data: rangeSel
            }, true);

            $E.bind(sheetContainer, "keydown", {
                scope: this,
                fn: this.keyCtr,
                data: rangeSel
            }, false);
            $E.bind(this.DOM["rangeBox"], "mousedown", {
                scope: this,
                fn: this.rangeMouseDown,
                data: rangeSel
            }, true);
            $E.bind(this.DOM["rangeBox"], "dblclick", { scope: this, fn: this.txtDblcickEdit, data: rangeSel }, false);
            this.setRecRange = function (curRangeSel) {
                rangeSel = curRangeSel;
            }
            this.getRange = function (curRangeSel) {
                return rangeSel;
            }
            this.getRecRange = function () {
                return rangeSel.recRange;
            }

            $E.bind(sheetContainer, "dblclick", {
                scope: this,
                fn: function (evt) {
                    window.getSelection ? window.getSelection().removeAllRanges() : document.selection.empty();
                }
            }, false);
        },
        createHrContainer: function () {
            var container = document.createElement("div");
            container.className = "borderStyle";
            return container;
        },
        createCell: function (oTd, row, col) {
            var cell = {};
            cell.td = oTd;
            cell.rowSpan = oTd.rowSpan || 1;
            cell.colSpan = oTd.colSpan || 1;
            cell.rowIndex = row;
            cell.colIndex = col;
            return cell;
        },
        mapMatrix: function (table) {
            var matrix = this.matrix,
                row, rowLen = this.totalRow,
                col, colLen,
                cell = null, oTd = null,
                i, j;

            for (row = 0; row < rowLen; row++) {
                if (!matrix[row]) {
                    matrix[row] = [];
                }
                for (col = 0, colLen = table.rows[row].cells.length; col < colLen; col++) {
                    oTd = table.rows[row].cells[col];
                    cell = this.createCell(oTd, row, col);
                    while (matrix[row][col] != null) { col++; }
                    if (cell.rowSpan > 1 || cell.colSpan > 1) {
                        for (i = 0; i < cell.rowSpan; i++) {
                            for (j = 0; j < cell.colSpan; j++) {
                                if (!matrix[row + i]) {
                                    matrix[row + i] = [];
                                }
                                matrix[row + i][col + j] = cell;
                            }
                        }
                    } else {
                        matrix[row][col] = cell;
                    }
                }
            }
            return matrix;
        },
        updateMatrix: function (sRow, sCol, eRow, eCol) {
            var matrix = this.matrix,
            row, col,
            cell = null, oTd = null,
            i, j;

            for (row = sRow; row <= eRow; row++) {
                if (!matrix[row]) {
                    matrix[row] = [];
                }
                for (col = sCol; col <= eCol; col++) {
                    oTd = table.rows[row].cells[col];
                    cell = this.createCell(oTd, row, col);
                    while (matrix[row][col] != null) { col++; }
                    if (cell.rowSpan > 1 || cell.colSpan > 1) {
                        for (i = 0; i < cell.rowSpan; i++) {
                            for (j = 0; j < cell.colSpan; j++) {
                                if (!matrix[row + i]) {
                                    matrix[row + i] = [];
                                }
                                matrix[row + i][col + j] = cell;
                            }
                        }
                    } else {
                        matrix[row][col] = cell;
                    }
                }
            }
            return matrix;
        },
        findCell: function (oTd) {
            var martix = this.matrix,
            MRow = martix[oTd.parentNode.rowIndex],
            col = oTd.cellIndex, colLen = MRow.length;


            for (col = 0, colLen = MRow.length; col < colLen; col++) {
                if (MRow[col].td == oTd) {
                    return MRow[col];
                }
            }
            return null;
        },
        getTdIndex: function (cell) {//指定cell对应于table所在tr的 前一个之前的td索引
            var martix = this.matrix,
            MRow = martix[cell.td.parentNode.rowIndex], MPreRow = cell.td.parentNode.rowIndex - 1 >= 0 ? martix[cell.td.parentNode.rowIndex - 1] : null;
            index = -1,
            colLen = MRow.length;

            if (MPreRow) {
                MRow[0] != MPreRow[0] && (index = 0);
                for (col = 1, colLen = MRow.length; col < colLen; col++) {
                    if (MRow[col] != MPreRow[col] && MRow[col] != MRow[col - 1]) {
                        index++;
                    }
                    if (MRow[col] == cell) {
                        break;
                    }
                }
            } else {
                index = 0;
                for (col = 1, colLen = MRow.length; col < colLen; col++) {
                    if (MRow[col].td != MRow[col - 1]) {
                        index++;
                        if (MRow[col] == cell) {
                            break;
                        }
                    }
                }
            }

            return index;
        },
        start: function (evt) {
            var data = evt.evtData, cell;
            if (evt.target.nodeName.toLowerCase() == "td") {
                data.moveable = true;
                data.sTd = data.eTd = evt.target;

                //data.eTd = null;
                this.setStartTd(data, data.sTd); //设置边框
                this.posTooltip(this.getCellCordit(data.recRange.sCell, data.recRange.eCell));
                //this.txtInputInRange(evt);
                if ($B.ie) {
                    //焦点丢失
                    $E.bind(this.DOM["table"], "losecapture", data.fs, true);
                    //设置鼠标捕获
                    this.DOM["table"].setCapture();
                } else {
                    //焦点丢失
                    $E.bind(window, "blur", data.fs, true);
                    //阻止默认动作
                    evt.preventDefault();
                };

                // document.body.style.cursor = evt.evtData.cursor;
                return true;
            }
            return false;
        },
        setStartTd: function (data, td) {
            var pos,
            cell = this.findCell(td); //找单元格设置范围

            data.recRange = {
                top: cell.rowIndex,
                left: cell.colIndex,
                bottom: cell.rowIndex + cell.rowSpan - 1,
                right: cell.colIndex + cell.colSpan - 1,
                sCell: cell,
                eCell: cell
            }
            this.setSelectedCSS(data, data.recRange.left, data.recRange.top, data.recRange.right, data.recRange.bottom);
        },
        posTooltip: function (recRange) {
            if (this.pSheets.pGrid.mathBar) {
                var pos = this.pSheets.pGrid.mathBar.DOM["rangePos"],
                topTable = this.pSheet.topTable;
                if (recRange.left == recRange.right && recRange.top == recRange.bottom) {
                    pos.value = recRange.top + topTable.digitToChar(recRange.left)
                } else {
                    pos.value = (recRange.bottom - recRange.top + 1) + "R" + "x" + (recRange.right - recRange.left + 1) + "C";
                }
            }
        },
        rangeMouseDown: function (evt) {
            var data = evt.evtData;
            if (!data.moveable) {
                //this.DOM["txtEdit"].style.display = "none";
                //data["rangeBox"].style.display = "none";
                //console.log("range_mousedown")
                td = this.getTdOverRangeBox(this.matrix, evt, data.recRange);
                $E.fire(td, "mousedown", evt);
                evt.preventDefault();
                // td.dispattchEvent("mousedown");
                // this.setStartTd(data, td);
                // data.moveable = true
                // recRange.style.display = "none";
            }
        },
        hiddenRangeBox: function (data) {
            data["WL"].style.display = "none";
            data["EL"].style.display = "none";
            data["NL"].style.display = "none";
            data["SL"].style.display = "none";
            data["rangeBox"].style.display = "none";
        },
        setRangeBoxCSS: function (data, sCell, eCell) {
            var sPos, ePos, rbTd;

            sPos = $ET.position(sCell.td, this.DOM["table"].parentNode);
            if (sCell != eCell) {
                ePos = $ET.position(eCell.td, this.DOM["table"].parentNode)
            } else {
                ePos = {}; ePos.left = sPos.left; ePos.top = sPos.top;
            }
            ePos.left += eCell.td.offsetWidth;
            ePos.top += eCell.td.offsetHeight;

            $ET.setCSS(data["rangeBox"], {
                position: "absolute",
                display: "block",
                top: sPos.top + "px",
                left: sPos.left + "px",
                width: ePos.left - sPos.left + "px",
                height: ePos.top - sPos.top + "px",
                backgroundColor: "yellow",
                opacity: 0.2,
                zIndex: 100
            });

            data.recRange.sPos = sPos;
            data.recRange.ePos = ePos;
        },
        setSelectedCSS: function (data, left, top, right, bottom) {//重载了一个根据首尾单元格设置 data, sCell, eCell
            var coordinate = null, sCell, eCell;

            if (arguments.length == 3) {//data, sCell, eCell
                sCell = arguments[1]; eCell = arguments[2];
                coordinate = this.getCellCordit(sCell, eCell);
                this.setRangeBoxCSS(data, sCell, eCell);
                this.setHeadSelectedCSS(coordinate.left, coordinate.right, coordinate.top, coordinate.bottom);
                coordinate = null;
            } else {
                this.setRangeBoxCSS(data, this.matrix[top][left], this.matrix[bottom][right]);
                this.setHeadSelectedCSS(left, right, top, bottom);
            }
        },
        resetSelectedCSS: function (data, left, top, right, bottom, oper) {
            var recRange = data.recRange, pos = {};
            switch (oper.dir) {
                case "l": //left
                    {
                        //                        if (recRange.left == oper.col) {
                        //                            recRange.left += oper.count;
                        //                            recRange.right += oper.count;
                        //                        } else {
                        //                            recRange.right += oper.count;
                        //                        }

                        //                        pos.left = parseInt(this.DOM["txtEdit"].style.left) + (this.pSheet.tdWidth + this.pSheet.tdBorderWidth) * oper.count;
                        break;
                    }
                case "r": //right
                    {
                        //                        if (recRange.right > oper.col) {
                        //                            recRange.right += oper.count;
                        //                        }
                        break;
                    }
                case "u": //up
                    {
                        //                        if (recRange.top == oper.row) {
                        //                            recRange.top += oper.count;
                        //                            recRange.bottom += oper.count;
                        //                        } else {
                        //                            recRange.bottom += oper.count;
                        //                        }

                        //                        pos.top = parseInt(this.DOM["txtEdit"].style.top) + this.pSheet.trHeight * oper.count;
                        break;
                    }
                case "d": //down
                    {
                        //添加后不对原始选定范围改变
                        //                        if (recRange.bottom > oper.row) {
                        //                            recRange.bottom += oper.count;
                        //                        }
                        break;
                    }
                case "dr": //deleteRow
                    {
                        break;
                    }
                case "dc": //deleteCol
                    {
                        break;
                    }
                default:

            }
            this.setSelectedCSS(data, recRange.left, recRange.top, recRange.right, recRange.bottom);
            this.txtPosition(data.sTd, pos);
        },
        setHeadSelectedCSS: function (left, right, top, bottom) {
            this.pSheet.leftTable.setSelectedTdStyle(top, bottom);
            this.pSheet.topTable.setSelectedTdStyle(left, right);
        },
        move: function (evt) {
            var data = evt.evtData, curTd = evt.target,
            tdInTable = null, cordit;
            //var td = document.elementFromPoint(evt.pageX, evt.pageY);
            window.getSelection ? window.getSelection().removeAllRanges() : document.selection.empty();
            //curTd.style.cursor = "crosshair";
            // evt.preventDefault();

            //        console.log("x:" + evt.x + ";y:" + evt.y
            //        + "\n layerX:" + evt.layerX + ";y:" + evt.layerY
            //        + "\n offsetX:" + evt.offsetX + ";offsetY:" + evt.offsetY
            //        + "\n clientX:" + evt.clientX + ";clientY:" + evt.clientY 
            //        + "  nodeName:" + curTd.nodeName + " " + document.elementFromPoint(evt.x, evt.y));
            // return;
            if (data.moveable) {
                //if (this.mouseOverTable()) {
                //curTd = this.getTdOverRangeBox(this.matrix, evt, data.recRange);
                //}
                if (curTd.nodeName.toLowerCase() != "td") {
                    if ($B.ie9 && document.compatMode == "CSS1Compat") {//始终在table上触发事件
                        curTd = this.getTdOverRangeBox(this.matrix, evt, {
                            top: 0,
                            bottom: this.DOM["table"].rows.length,
                            left: 0,
                            right: this.DOM["table"].rows[0].cells.length
                        });
                        //console.log("curTd:" + curTd.className);
                    } else {
                        if (curTd == data["rangeBox"]) {
                            curTd = this.getTdOverRangeBox(this.matrix, evt, data.recRange);
                            //console.log("x:" + evt.clientX + "  ;y:" + evt.clientY + "curTd:" + curTd.className);
                            //e.stopPropagation();
                        } else {
                            curTd = document.elementFromPoint(evt.clientX, evt.clientY);

                            if (curTd && curTd.nodeName != "TD") { return; }
                        }
                    }
                } else {
                    tdInTable = curTd.parentNode.parentNode;
                    if (tdInTable != data.mainTable && tdInTable.parentNode != data.mainTable) {
                        return;
                    }
                }
                // console.log("x:" + evt.clientX + "  ;y:" + evt.clientY + "curTd:" + curTd.className);
                if (curTd != data.eTd) {
                    data.eTd = curTd;
                    data.recRange.eCell = this.findCell(data.eTd)
                    this.getCellCordit(data.recRange.sCell, data.recRange.eCell, data.recRange); //计算首尾单元格坐标
                    this.posTooltip(data.recRange);
                    this.calRecRange(this.matrix, data.recRange); //计算首尾格所影响到的格子坐标
                    this.setSelectedCSS(data, data.recRange.left, data.recRange.top, data.recRange.right, data.recRange.bottom);
                }
            }
        },
        getCellCordit: function (sCell, eCell, coordinate) {
            var recRange = coordinate || {
                top: 0,
                bottom: 0,
                left: 0,
                right: 0
            };

            sCell.rowIndex <= eCell.rowIndex ? recRange.top = sCell.rowIndex : recRange.top = eCell.rowIndex;
            sCell.rowIndex + sCell.rowSpan > eCell.rowIndex + eCell.rowSpan ? recRange.bottom = sCell.rowIndex + sCell.rowSpan - 1 : recRange.bottom = eCell.rowIndex + eCell.rowSpan - 1;

            sCell.colIndex <= eCell.colIndex ? recRange.left = sCell.colIndex : recRange.left = eCell.colIndex;
            sCell.colIndex + sCell.colSpan > eCell.colIndex + eCell.colSpan ? recRange.right = sCell.colIndex + sCell.colSpan - 1 : recRange.right = eCell.colIndex + eCell.colSpan - 1;

            return recRange;
        },
        calRecRange: function (matrix, recRange) {
            var curTopRow = recRange.top, curBottomRow = recRange.bottom,
            curRightCol = recRange.right, curLeftCol = recRange.left,
            row, col, rowResize = true, colResize = true;

            while (rowResize || colResize) {
                rowResize = false; colResize = false;
                //最上
                for (col = curLeftCol; col <= curRightCol; col++) {
                    cell = matrix[curTopRow][col];
                    if (cell.rowIndex < curTopRow) {
                        curTopRow = cell.rowIndex;
                        col = curLeftCol;
                        rowResize = true;
                        continue;
                    }
                }
                //最下
                for (col = curLeftCol; col <= curRightCol; col++) {
                    cell = matrix[curBottomRow][col];
                    if (cell.rowIndex + cell.rowSpan - 1 > curBottomRow) {
                        curBottomRow = cell.rowIndex + cell.rowSpan - 1;
                        col = curLeftCol;
                        rowResize = true;
                        continue;
                    }
                }
                //最左
                for (row = curTopRow; row <= curBottomRow; row++) {
                    cell = matrix[row][curLeftCol];
                    if (cell.colIndex < curLeftCol) {
                        curLeftCol = cell.colIndex;
                        row = curTopRow;
                        colResize = true;
                        continue;
                    }
                }
                //最右
                for (row = curTopRow; row <= curBottomRow; row++) {
                    cell = matrix[row][curRightCol];
                    if (cell.colIndex + cell.colSpan - 1 > curRightCol) {
                        curRightCol = cell.colIndex + cell.colSpan - 1;
                        colResize = true;
                        continue;
                    }
                }
            }

            recRange.top = curTopRow;
            recRange.bottom = curBottomRow;
            recRange.left = curLeftCol;
            recRange.right = curRightCol;

            return {
                top: curTopRow,
                bottom: curBottomRow,
                left: curLeftCol,
                right: curRightCol
            };
        },
        calRecRangeByCordit: function (matrix, left, top, bottom, right) {
            var row, col,
			rowResize = true, colResize = true;

            while (rowResize || colResize) {
                rowResize = false; colResize = false;
                //最上
                for (col = left; col <= right; col++) {
                    cell = matrix[top][col];
                    if (cell.rowIndex < top) {
                        top = cell.rowIndex;
                        col = left;
                        rowResize = true;
                        continue;
                    }
                }
                //最下
                for (col = left; col <= right; col++) {
                    cell = matrix[bottom][col];
                    if (cell.rowIndex + cell.rowSpan - 1 > bottom) {
                        bottom = cell.rowIndex + cell.rowSpan - 1;
                        col = left;
                        rowResize = true;
                        continue;
                    }
                }
                //最左
                for (row = top; row <= bottom; row++) {
                    cell = matrix[row][left];
                    if (cell.colIndex < left) {
                        left = cell.colIndex;
                        row = top;
                        colResize = true;
                        continue;
                    }
                }
                //最右
                for (row = top; row <= bottom; row++) {
                    cell = matrix[row][right];
                    if (cell.colIndex + cell.colSpan - 1 > right) {
                        right = cell.colIndex + cell.colSpan - 1;
                        colResize = true;
                        continue;
                    }
                }
            }

            return {
                top: top,
                bottom: bottom,
                left: left,
                right: right
            };
        },
        getTdOverRangeBox: function (matrix, evt, recRange) {
            //var x = evt.pageX - this.pSheets.sheetsPos.left + this.pSheets.DOM["sheetContaner"].scrollLeft; //鼠标范围层下的td相对当前table的 x y
            //    y = evt.pageY - this.pSheets.sheetsPos.top + this.pSheets.DOM["sheetContaner"].scrollTop,
            //    MRow = matrix[recRange],
            var topTable = this.pSheet.topTable.DOM["table"],
            leftTable = this.pSheet.leftTable.DOM["table"],
            row, col, td, top = 0, left = 0,
            cell, preCell,
            MRow = null, MPreRow = null,
            pos = evt.getMouseRelPos(),
            sRow = recRange.top, sCol = recRange.left;

            /* 先确定列 再遍历行… 
            for (row = sRow, eRow = recRange.bottom; row <= eRow; row++) {
            MRow = matrix[row], preCell = null, cell = null;
            for (col = sCol, eCol = recRange.right; col <= eCol; col++) {
            cell = MRow[col];
            if (cell != preCell) {
            left += cell.td.offsetWidth;
            if (pos.left <= left) {
            sCol = col;
            eCol = sCol + cell.td.colSpan - 1;
            srow = (cell.rowIndex + cell.rowSpan - 1) > sRow ? (cell.rowIndex + cell.rowSpan - 1) : sRow;
            break;
            }
            }
            preCell = cell;
            // col = cell.colSpan + col;
            }
            if (!MPreRow || cell != MPreRow[col]) {
            top += cell.td.offsetHeight;
            if (pos.top <= top) {
            break;
            }
            }

            MPreRow = MRow;
            }
            */

            // 根据头行头列快速定位
            for (row = recRange.top; row <= recRange.bottom; row++) {
                // cell = matrix[row][recRange.left];
                td = leftTable.rows[row].cells[0];
                top += td.offsetHeight
                if (pos.top <= top) {
                    break;
                }
            }
            for (col = recRange.left; col < recRange.right; col++) {
                td = topTable.rows[0].cells[col];
                left += td.offsetWidth;
                if (pos.left <= left) {
                    break;
                }
            }
            //            console.log(" top:" + recRange.top + " left:" + recRange.left + " bottom:" + recRange.bottom + " right:" + recRange.right
            //        + "\n x:" + pos.left + " y:" + pos.top
            //        + " \n curTd:" + row + "   " + col);
            return matrix[row][col].td;
        },
        stop: function (evt) {
            var data = evt.evtData,
            width;
            if (data && data.moveable) {
                data.moveable = false; //this.DOM["txtEdit"].value = "";
                this.setRecRange(data);
                $E.unbind(document, "mousemove", data.fm, true);
                $E.unbind(document, "mouseup", data.fs, true);

                if ($B.ie) {
                    $E.unbind(this.DOM["table"], "losecapture", data.fs, true);
                    this.DOM["table"].releaseCapture();
                } else {
                    // $E.unbind(window, "blur", data.fs, true);
                }
            }
        },
        keyCtr: function (evt) {
            var keyCode, value = ""; //http://www.cambiaresearch.com/articles/15/javascript-char-codes-key-codes
            if (this.DOM["txtEdit"].style.display != "none" && document.activeElement != this.DOM["txtEdit"]) {
                keyCode = evt.keyCode;
                if (keyCode >= 48 && keyCode <= 57 || (keyCode >= 96 && keyCode <= 105)) {
                    value = String.fromCharCode(evt.keyCode);
                }
                if (keyCode >= 65 && keyCode <= 90) {
                    if (evt.shiftKey) {
                        value = String.fromCharCode(evt.keyCode); //默认是大写的
                    } else {
                        value = String.fromCharCode(evt.keyCode).toLowerCase();
                    }
                }
                if (keyCode == 8) {
                    this.DOM["txtEdit"].value = this.DOM["txtEdit"].value.substring(0, this.DOM["txtEdit"].value.length - 1);
                } else {
                    this.DOM["txtEdit"].value = this.DOM["txtEdit"].value + value;
                }
                if (this.pSheet.pGrid.mathBar) {
                    this.pSheet.pGrid.mathBar.DOM["mathExp"].value = this.DOM["txtEdit"].value;
                }
            }
        },
        dblclickHandle: function () {

        },
        mergeCells: function () {//修改矩阵里的单元格
            var matrix = this.matrix,
            recRange = this.getRecRange(),
            table = this.DOM["table"],
            row, col, td, top = 0, left = 0,
            topRow = recRange.top, bottomRow = recRange.bottom, rightCol = recRange.right, leftCol = recRange.left,
            cell = matrix[topRow][leftCol], ltTd = cell.td, tr = null, MRow = null, first = false, curCell, txt;

            this.DOM["table"].style.display = "none";
            cell.rowSpan = ltTd.rowSpan = bottomRow - topRow + 1;
            cell.colSpan = ltTd.colSpan = rightCol - leftCol + 1;
            for (row = topRow; row <= bottomRow; row++) {
                MRow = matrix[row];
                col = leftCol;
                tr = table.rows[row];
                for (; col <= rightCol; col++) {
                    curCell = MRow[col];
                    if (!curCell.isDel && curCell.td != ltTd) {
                        tr.removeChild(curCell.td);
                        txt = $ET.text(curCell.td);
                        if (!first && txt != "") {
                            $ET.text(ltTd, txt);
                            first = true;
                        }
                        curCell.isDel = true;
                    }
                    MRow[col] = cell;
                }
            }
            this.DOM["table"].style.display = "";
        },
        getTd: function (matrix, row, col) { // row, col矩阵中的行列号 找insertBefore所引用的单元格，即边界
            var MRow = matrix[row],
            len = MRow.length,
            cell = null;
            //if (row >= 0 && row < len && col >= 0 && col < MRow.length) {
            //    return MRow[col].td;
            //}
            //return null;

            while (col < len) {
                cell = MRow[col];
                if (cell.colIndex == col && cell.rowIndex == row) {
                    return cell.td;
                }
                //col = col + cell.colSpan;
                col = cell.colIndex + cell.colSpan;
            }
            return null;
        },
        splitCells: function () {//table, matrix, recRange
            var matrix = this.matrix,
            recRange = this.getRecRange(),
            table = this.DOM["table"],
             row, col, td = document.createElement("td"), top = 0, left = 0,
            topRow = recRange.top, bottomRow = recRange.bottom, rightCol = recRange.right, leftCol = recRange.left,
            cell = matrix[topRow][leftCol], ltTd = cell.td, tr = null, MRow = null, topTableRow = this.pSheet.topTable.DOM["table"].rows[0];
            //group = ltTd.className.match(/(\w)+(\d+)/), letter = group[1], digit = group[2] ,index;
            //ltTd.rowSpan = 1;
            //ltTd.colSpan = 1;
            this.DOM["table"].style.display = "none";
            this.mergeCells();
            for (row = bottomRow; row >= topRow; row--) {
                MRow = matrix[row];
                tr = table.rows[row];
                //refTd = null;
                //index = this.getTdIndex(MRow[rightCol + 1]);
                refTd = this.getTd(matrix, row, rightCol + 1);
                for (col = leftCol; col <= rightCol; col++) {
                    td.className = $ET.text(topTableRow.cells[col]) + row;
                    tr.insertBefore(td, refTd);
                    MRow[col] = this.createCell(td, row, col);
                    td = td.cloneNode();
                }
            }
            ltTd.parentNode.removeChild(ltTd);
            this.DOM["table"].style.display = "";
        },
        getIndexCount: function (sCell, eCell, dir) {
            var obj = {};
            if (dir == "row") {
                obj.index = sCell.rowIndex;
                if (eCell != null) {
                    if (sCell.rowIndex >= eCell.rowIndex) {
                        obj.sRow = eCell.rowIndex;
                        obj.eRow = sCell.rowIndex + sCell.rowSpan - 1;
                        obj.count = obj.eRow - obj.sRow + 1;
                    } else {
                        obj.sRow = sCell.rowIndex;
                        obj.eRow = eCell.rowIndex + eCell.rowSpan - 1;
                        obj.count = obj.eRow - obj.sRow + 1;
                    }
                } else {
                    obj.sRow = sCell.rowIndex;
                    obj.eRow = sCell.rowIndex + sCell.rowSpan - 1;
                    obj.count = sCell.rowSpan;
                }
            } else {
                obj.index = sCell.colIndex;
                if (eCell != null) {
                    if (sCell.colIndex >= eCell.colIndex) {
                        obj.sCol = eCell.colIndex;
                        obj.eCol = sCell.colIndex + sCell.colSpan - 1;
                        obj.count = obj.eCol - obj.sCol + 1;
                    } else {
                        obj.sCol = sCell.colIndex;
                        obj.eCol = eCell.colIndex + eCell.colSpan - 1;
                        obj.count = obj.eCol - obj.sCol + 1;
                    }
                } else {
                    obj.sCol = sCell.colIndex;
                    obj.eCol = sCell.colIndex + sCell.colSpan - 1;
                    obj.count = sCell.colSpan;
                }
            }
            return obj;
        },
        insertRows: function (dir, sRow, count) {
            var matrix = this.matrix,
            RLen = matrix.length,
            table = this.DOM["table"],
            topTableRow = this.pSheet.topTable.DOM["table"].rows[0],
            leftTable = this.pSheet.leftTable.DOM["table"],
            data = this.getRange(), recRange = data.recRange,
            //temp = this.getIndexCount(recRange.sCell, recRange.eCell, "row"), sRow = temp.sRow, count = temp.count,
            // sRow = recRange.sCell.td.parentNode.rowIndex,
            // count = recRange.eCell != null ? recRange.eCell.td.parentNode.rowIndex - sRow + 1 : 1,
            sRow, refRow,
            count = recRange.bottom - recRange.top + 1,
            MRow, CLen, MPreRow,
            MInsertRow, oTr,
            pTr, row, col, i = 0, refRowIndex, cellEndRowIndex, cellEndColIndex, j, res;

            //this.DOM["table"].style.display = "none";
            //判断添加行时，以选中范围起始格还是结束格为添加始点
            if (dir == "u") {
                sRow = recRange.sCell.rowIndex;
                eRow = recRange.eCell.rowIndex;
                refRow = sRow <= eRow ? table.rows[sRow] : table.rows[eRow];
                MPreRow = matrix[sRow - 1];
            } else {
                sRow = recRange.sCell.rowIndex + recRange.sCell.rowSpan - 1;
                eRow = recRange.eCell.rowIndex;
                refRow = sRow >= eRow ? (sRow + 1 < table.rows.length ? table.rows[sRow + 1] : null) : (eRow + 1 < table.rows.length ? table.rows[eRow + 1] : table.rows[eRow]);
                MPreRow = matrix[eRow + 1];
            }
            MRow = matrix[sRow];

            CLen = MRow.length;

            //if (dir == "u") {
            //    refRow = table.rows[sRow];
            //    recRange.top += count; recRange.bottom += count;
            //} else {
            //    if (sRow + 1 < table.rows.length) {
            //        refRow = table.rows[sRow + 1]
            //    }
            //    recRange.bottom += count;
            //}
            // refRow = dir == "u" ? table.rows[sRow] : (sRow + 1 < table.rows.length ? table.rows[sRow + 1] : null);

            refRowIndex = refRow != null ? refRow.rowIndex : RLen;
            pTr = table.rows[sRow].parentNode;

            while (i < count) {
                oTr = document.createElement("tr");
                oTr.style.height = this.pSheet.trHeight + "px";
                MInsertRow = [];
                for (col = 0; col < CLen; col++) {
                    cell = MRow[col];
                    if (!col || cell != MRow[col - 1]) {
                        j = col; cellEndColIndex = cell.colIndex + cell.colSpan - 1;
                        if (cell.rowIndex < sRow) {
                            if (cell.rowIndex + cell.rowSpan - 1 == sRow && dir == "d") {//单元格结束行等于sRow 且为下插行
                                while (j <= cellEndColIndex) {
                                    oTd = document.createElement("td");
                                    //oTd.style.width = this.pSheet.tdWidth + "px";
                                    oTd.className = $ET.text(topTableRow.cells[j]) + (refRowIndex + i);
                                    oTr.appendChild(oTd);
                                    cell = this.createCell(oTd, 0, j);
                                    cell.rowIndex = refRowIndex + i;
                                    MInsertRow.push(cell);
                                    j++;
                                }
                                col = cellEndColIndex;
                            } else {
                                while (j <= cellEndColIndex) {
                                    MInsertRow[j] = cell;
                                    j++;
                                }
                                col = cellEndColIndex;
                                cell.rowSpan = cell.td.rowSpan = cell.td.rowSpan + 1;
                            }
                        } else {//起始行与sRow相等
                            if (dir == "u" || cell.rowSpan == 1) {
                                while (j <= cellEndColIndex) {
                                    oTd = document.createElement("td");
                                    //oTd.style.width = this.pSheet.tdWidth + "px";
                                    oTd.className = $ET.text(topTableRow.cells[j]) + (refRowIndex + i);
                                    oTr.appendChild(oTd);
                                    cell = this.createCell(oTd, 0, j);
                                    cell.rowIndex = refRowIndex + i;
                                    MInsertRow.push(cell);
                                    j++;
                                }
                                col = cellEndColIndex;
                            } else {
                                while (j <= cellEndColIndex) {
                                    MInsertRow[j] = cell;
                                    j++;
                                }
                                col = cellEndColIndex;
                                cell.rowSpan = cell.td.rowSpan = cell.td.rowSpan + 1;
                            }
                        }
                    }
                }
                pTr.insertBefore(oTr, refRow);
                matrix.splice(refRowIndex + i, 0, MInsertRow);
                i++;
            }
            RLen = matrix.length;
            refRowIndex = refRow != null ? refRow.rowIndex : RLen;
            //更新行索引
            for (row = refRowIndex; row < RLen; row++) {
                MRow = matrix[row]; MPreRow = matrix[row - 1];
                for (col = 0; col < CLen; col++) {
                    if (MRow[col] != MRow[col - 1] && (!MPreRow || MRow[col] != MPreRow[col])) {
                        MRow[col].rowIndex = row;
                        MRow[col].td.className = $ET.text(topTableRow.cells[col]) + row;
                    }
                }
            }

            this.DOM["table"].style.display = "";
            res = {
                dir: dir,
                row: sRow,
                count: count
            };

            //移动范围选择框
            this.resetSelectedCSS(data, recRange.left, recRange.top, recRange.right, recRange.bottom, res);
            return res;
        },
        delRows: function (sRow, count) {
            var matrix = this.matrix, RLen = matrix.length,
            table = this.DOM["table"],
            topTableRow = this.pSheet.topTable.DOM["table"].rows[0],
            recRange = this.getRecRange(),
            sRow = recRange.top, eRow = recRange.bottom, count = eRow - sRow + 1,
            //temp = this.getIndexCount(recRange.sCell, recRange.eCell, "row"),sRow = temp.sRow,eRow = temp.eRow,count = eRow - sRow + 1,
            //pTr = table.rows[sRow].parentNode,
            MRow = null,
            MPreRow = null, cell = null,
            CLen = matrix[sRow].length,
            oTr, refRow, row, col, cellEndRowIndex, refTd, i, j, cellEndColIndex;
            // this.DOM["table"].style.display = "none";
            for (row = sRow; row <= eRow; row++) {
                MPreRow = MRow; MRow = matrix[row];
                for (col = 0; col < CLen; col++) {
                    cell = MRow[col];
                    if ((!col || cell != MRow[col - 1]) && (!MPreRow || cell != MPreRow[col])) {//只处理一次判断
                        if (cell.rowIndex == row) {//含头
                            cellEndRowIndex = cell.rowIndex + cell.rowSpan - 1;
                            if (cellEndRowIndex > eRow) {
                                oTd = cell.td;
                                refTd = this.getTd(matrix, eRow + 1, cell.colIndex + cell.colSpan); //----------
                                //oTd = oTd.cloneNode(true);
                                cell.rowSpan = oTd.rowSpan = oTd.rowSpan - (eRow - cell.rowIndex + 1);
                                //cell.rowIndex = eRow + 1;
                                table.rows[eRow + 1].insertBefore(oTd, refTd); // this.getTdIndex(table.rows[eRow + 1][cell.colIndex + cell.colSpan]));

                                //cell = this.createCell(oTd, row, col);
                                //for (i = eRow + 1; i <= cellEndRowIndex; i++) {
                                //    for (j = cell.colIndex, cellEndColIndex = cell.colIndex + cell.colSpan - 1; j <= cellEndColIndex; j++) {
                                //        matrix[i][j] = cell;
                                //    }
                                //}
                            }
                        } else {//不含头 if (cell.rowIndex < row)
                            oTd = cell.td; cellEndRowIndex = cell.rowIndex + cell.rowSpan - 1;
                            if (cellEndRowIndex >= eRow) {
                                cell.rowSpan = oTd.rowSpan = oTd.rowSpan - (eRow - row + 1);
                            } else if (cellEndRowIndex < eRow) {
                                cell.rowSpan = oTd.rowSpan = oTd.rowSpan - (cellEndRowIndex - row + 1);
                            }
                        }
                    }
                }
            }

            while (count--) {
                table.deleteRow(sRow);
                matrix.splice(sRow, 1);
            }

            //更新行索引
            RLen = matrix.length;
            MRow = null;
            for (row = sRow; row < RLen; row++) {
                MPreRow = MRow; MRow = matrix[row];
                for (col = 0; col < CLen; col++) {
                    cell = MRow[col];
                    if (cell.colSpan == 1 && cell.rowSpan == 1) {
                        cell.td.className = $ET.text(topTableRow.cells[col]) + row;
                        cell.rowIndex = row;
                    } else if ((!col || cell != MRow[col - 1]) && (!MPreRow || cell != MPreRow[col]) && cell.rowIndex > sRow) {
                        cell.td.className = $ET.text(topTableRow.cells[col]) + row;
                        cell.rowIndex = row;
                    }
                }
            }

            //移动范围选择框
            //this.setRangeBoxCSS();
            this.DOM["table"].style.display = "";
            //this.print();
            return {
                row: sRow,
                count: eRow - sRow + 1
            };

            //if (!cell.handle) {
            //    if (cell.rowIndex == row) {//含头
            //        if (cell.rowIndex + cell.rowSpan - 1 > eRow) {
            //            oTd = cell.td.cloneNode(true);
            //            oTd.rowSpan = oTd.rowSpan - (eRow - cell.rowIndex + 1);
            //            table.rows[eRow + 1].insertBefore(oTd, this.getTd(matrix, eRow + 1, cell.colIndex + cell.colSpan)); // this.getTdIndex(table.rows[eRow + 1][cell.colIndex + cell.colSpan]));
            //            cell = this.createCell(oTd, row, col);
            //            matrix[eRow + 1][col] = cell;
            //        }
            //    } else if (cell.rowIndex < row) {//不含头
            //        oTd = cell.td;
            //        cell.rowSpan = oTd.rowSpan = oTd.rowSpan - (eRow - cell.rowIndex + 1);
            //    }
            //    cell.handle = true;
            //}
        },
        insertCols: function (dir, startCol, count) {
            var matrix = this.matrix,
            RLen = matrix.length,
            table = this.DOM["table"],
            topTableRow = this.pSheet.topTable.DOM["table"].rows[0],
            data = this.getRange(), recRange = data.recRange,
            sCol = recRange.sCell.colIndex,
            eCol = recRange.eCell.colIndex,
            count = recRange.right - recRange.left + 1,
            //sCol = startCol >= 0 ? startCol : recRange.sCell.colIndex,
            //count = count || (recRange.eCell != null ? recRange.eCell.colIndex + recRange.eCell.colSpan - sCol : recRange.sCell.colSpan),
            MRow = null, MPreRow = null, cellEndColIndex, cellEndRowIndex, CLen, tempMRow = null,
            oTr, refTd, refTdIndex, row, i = 0, res;

            //this.DOM["table"].style.display = "none";
            oTd = document.createElement("td");
            oTd.style.width = this.pSheet.tdWidth + "px";    //oTd.rowSpan = 1; oTd.colSpan = 1;

            if (dir == "l") {//left
                refTdIndex = sCol;
                for (row = 0; row < RLen; ) {
                    MPreRow = MRow; MRow = matrix[row]; oTr = table.rows[row]; cell = MRow[sCol];
                    if (!MPreRow || !sCol || cell != MPreRow[sCol]) {
                        if (cell.colIndex < sCol) {
                            cell.colSpan = cell.td.colSpan = cell.colSpan + count;
                            //补矩阵
                            cellEndRowIndex = cell.rowIndex + cell.rowSpan;
                            for (i = row; i < cellEndRowIndex; i++) {
                                tempMRow = matrix[i];
                                for (j = 0; j < count; j++) {
                                    tempMRow.splice(refTdIndex + j, 0, cell);
                                }
                            }
                            row = cellEndRowIndex - 1;
                        } else { //cell.colIndex == sCol
                            i = 0; refTd = this.getTd(matrix, row, refTdIndex);
                            while (i < count) {
                                oTd.className = $ET.text(topTableRow.cells[sCol + i]) + row;
                                oTr.insertBefore(oTd, refTd);
                                cell = this.createCell(oTd, row, refTdIndex + i);
                                MRow.splice(sCol + i, 0, cell);
                                oTd = oTd.cloneNode();
                                i++;
                            }
                        }
                    }
                    if (row == 0) {
                        oTd.style.width = ""; //只让首行控制宽度
                    }
                    row++;
                }
            } else {
                sCol = recRange.sCell.colIndex + recRange.sCell.colSpan - 1;
                refTdIndex = sCol + 1;
                for (row = 0; row < RLen; row++) {
                    MPreRow = MRow; MRow = matrix[row]; oTr = table.rows[row];
                    cell = MRow[sCol];
                    cellEndColIndex = cell.colIndex + cell.colSpan - 1;
                    if (!sCol || !MPreRow || cell != MPreRow[sCol]) {
                        if (cellEndColIndex > sCol){// || cellEndColIndex == sCol && cell.colSpan>1 ) {
                            cell.colSpan = cell.td.colSpan = cell.colSpan + count;
                            //补矩阵
                            cellEndRowIndex = cell.rowIndex + cell.rowSpan;
                            for (i = row; i < cellEndRowIndex; i++) {
                                tempMRow = matrix[i];
                                for (j = 0; j < count; j++) {
                                    tempMRow.splice(sCol + j, 0, cell);
                                }
                            }
                            row = cellEndRowIndex - 1;
                        } else { //cellEndColIndex == sCol
                            if (cell.rowSpan > 1) {
                                cellEndRowIndex = cell.rowIndex + cell.rowSpan;
                                for (i = row; i < cellEndRowIndex; i++) {
                                    tempMRow = matrix[i]; oTr = table.rows[i];
                                    refTd = this.getTd(matrix, i, refTdIndex);
                                    for (j = 0; j < count; j++) {
                                        oTd.className = $ET.text(topTableRow.cells[refTdIndex + j]) + i;
                                        oTr.insertBefore(oTd, refTd);
                                        cell = this.createCell(oTd, i, refTdIndex + j);
                                        tempMRow.splice(refTdIndex + j, 0, cell);
                                        oTd = oTd.cloneNode();
                                    }
                                }
                                row = cellEndRowIndex - 1;
                            } else {
                                i = 0;
                                refTd = this.getTd(matrix, row, refTdIndex);
                                while (i < count) {
                                    oTd.className = $ET.text(topTableRow.cells[refTdIndex + i]) + row;
                                    oTr.insertBefore(oTd, refTd);
                                    cell = this.createCell(oTd, row, refTdIndex + i);
                                    // cell.colIndex = refTdIndex + i;
                                    MRow.splice(refTdIndex + i, 0, cell);
                                    oTd = oTd.cloneNode();
                                    i++;
                                }
                            }
                        }
                    }
                    if (row == 0) {
                        oTd.style.width = ""; //只让首行控制宽度
                    }
                }
            }

            oTd = null;
            CLen = matrix[0].length;
            MPreRow = null;
            //更新列索引
            for (row = 0; row < RLen; row++) {
                MPreRow = MRow; MRow = matrix[row];
                for (col = sCol; col < CLen; col++) {
                    cell = MRow[col];
                    if ((!col || cell != MRow[col - 1]) && (!MPreRow || cell != MPreRow[col])) {
                        cell.colIndex = col;
                        cell.td.className = $ET.text(topTableRow.cells[col]) + row;
                    }
                }
            }

            this.DOM["table"].style.display = "";
            //移动范围选择框
            res = {
                dir: dir,
                col: sCol,
                count: count
            };
            this.resetSelectedCSS(data, recRange.left, recRange.top, recRange.right, recRange.bottom, res);
            //this.print();
            return res;
        },
        delCols: function (sCol, count) {
            var matrix = this.matrix, RLen = matrix.length,
            recRange = this.getRecRange(),
            table = this.DOM["table"],
            topTableRow = this.pSheet.topTable.DOM["table"].rows[0],
            sCol = recRange.left, eCol = recRange.right, count = eCol - sCol + 1,
            // temp = this.getIndexCount(recRange.sCell, recRange.eCell, "col"),
            // sCol = temp.sCol, eCol = temp.eCol, count = temp.count,
            MRow = null, MPreRow = null, tempMRow, cell = null,
            CLen = matrix[0].length,
            oTr, refTd, refRow, row, col, cellEndRowIndex, cellEndColIndex, i, j;
            this.DOM["table"].style.display = "none";
            for (row = 0; row < RLen; row++) {
                MPreRow = MRow; MRow = matrix[row]; oTr = table.rows[row];
                for (col = sCol; col <= eCol; col++) {
                    cell = MRow[col];
                    if (!MPreRow || cell != MPreRow[col]) {//只处理一次判断
                        cellEndColIndex = cell.colIndex + cell.colSpan - 1;
                        if (cell.colIndex == col) {//含头 与下面if可以合并但是为了留口，cell.colIndex == col清楚该列内容
                            if (cell.colSpan > 1) {
                                if (cellEndColIndex > eCol) {
                                    //cell.td.innerHTML = "";
                                    cell.colSpan = cell.td.colSpan = cell.td.colSpan - (eCol - cell.colIndex + 1);
                                    break;
                                } else if (cellEndColIndex <= eCol) {
                                    //cell.colSpan = cell.td.colSpan = cell.td.colSpan - (eCol - cell.colIndex + 1);
                                    oTr.removeChild(cell.td);
                                    //cell.td = null;
                                    col = cellEndColIndex;
                                }
                            } else {
                                oTr.removeChild(cell.td);
                            }
                        } else {//不含头 if (cell.colIndex < col)
                            if (cellEndColIndex >= eCol) {
                                cell.colSpan = cell.td.colSpan = cell.td.colSpan - (eCol - col + 1);
                                break;
                            } else if (cellEndColIndex < eCol) {
                                cell.colSpan = cell.td.colSpan = cell.td.colSpan - (cellEndColIndex - col + 1);
                                col = cellEndColIndex;
                            }
                        }
                    }
                }
            }

            for (i = 0; i < RLen; i++) {
                matrix[i].splice(sCol, count);
            }

            //更新索引
            CLen = CLen - count;
            MRow = null;
            for (row = 0; row < RLen; row++) {
                MPreRow = MRow; MRow = matrix[row];
                for (col = sCol; col < CLen; col++) {
                    if ((!col || MRow[col] != MRow[col - 1]) && (!MPreRow || MRow[col] != MPreRow[col])) {
                        MRow[col].td.className = $ET.text(topTableRow.cells[col]) + row;
                        MRow[col].colIndex = col;
                    }
                }
            }

            //移动范围选择框
            //this.setRangeBoxCSS();
            this.DOM["table"].style.display = "";
            //this.print();
            return {
                sCol: sCol,
                count: count
            };
        },
        //获取被选中的单元格集合
        getSelectedCells: function () {
            var oAllSelectedCell = new Array(); //所有选中的单元格集合

            var matrix = this.matrix,
            recRange = this.getRecRange(),
            row, col, td, top = 0, left = 0,
            topRow = recRange.top, bottomRow = recRange.bottom, rightCol = recRange.right, leftCol = recRange.left,
            cell = matrix[topRow][leftCol], ltTd = cell.td, tr = null, MRow = null, first = false, curCell, txt;

            for (row = topRow; row <= bottomRow; row++) {
                MRow = matrix[row];
                col = leftCol;
                for (; col <= rightCol; col++) {
                    oAllSelectedCell.push(MRow[col]);
                }
            }
            return oAllSelectedCell;
        },
        //字体加粗
        setFontWeight: function () {
            //this.setAllSelectCellStyle(oAllSelectedCell, "cell.style.fontWeight = 'bold';");
        },
        //字体倾斜
        setItalic: function () {
               //this.setAllSelectCellStyle(oAllSelectedCell, "cell.style.fontStyle = 'normal';");
               //this.setAllSelectCellStyle(oAllSelectedCell, "cell.style.fontStyle = 'italic';");
        },
        //字体下划线
        setUnderLine: function () {
               //this.setAllSelectCellStyle(oAllSelectedCell, "cell.style.textDecoration = 'underline';");
        },
        //居左
        setVAlignL: function () {
            //td.style.textAlign = 'left';
        },
        //居中
        setVAlignC: function () {
            // td.style.textAlign = 'center';
        },
        //居右
        setVAlignR: function () {
            //td.style.textAlign = 'right';
        },
        //上对齐
        setHAlignT: function () {
            //td.style.verticalAlign = 'top';
        },
        //垂直居中
        setHAlignC: function () {
            //td.style.verticalAlign = 'middle';
        },
        //下对齐
        setHAlignB: function () {
            //td.style.verticalAlign = 'bottom';
        },
        //设置字体颜色
        selColor: function (color) {
            //td.style.color = color;
        },
        //设置背景色
        selBColor: function (color) {
            //td.style.backgroundColor = color;
        },
        //设置字体
        SetFont: function (font) {
            //td.style.fontFamily = font;
        },
        //设置字体大小
        SetFontSize: function (size) {
            //td.style.fontSize = size + "px";
        },
        //设置边框颜色
        setBorderColor: function (color) {
            //td.style.borderColor = color;
        },
        //设置边线类型
        setBorderLineType: function (oEvent) {
            this.showBorderLineTypeDiv(oEvent);
        },
        //显示边线类型DIV
        showBorderLineTypeDiv: function (oEvent) {

        },
        setBorderLineTypeStyle: function (oStyle) {
        },
        //设置边框样式
        SetBorder: function (oEvent) {
        },
        //边框样式Div
        showBorderStyleDiv: function (event) {
        },
        setBorderStyle: function (index) {

        },
        showSelectedStyle: function () {
        },
        txtDblcickEdit: function (evt) {
            var data = evt.evtData,
            x = evt.pageX - this.pSheets.sheetsPos.left + this.pSheets.DOM["sheetsContainer"].scrollLeft, //鼠标范围层下的td相对当前table的 x y
            y = evt.pageY - this.pSheets.sheetsPos.top + this.pSheets.DOM["sheetsContainer"].scrollTop,
           txt = this.DOM["txtEdit"],
           txtLeft = parseInt(txt.style.left),
           txtTop = parseInt(txt.style.top);
            //console.log("range_dblclick")
            if (x > txtLeft && x < txtLeft + txt.offsetWidth && y > txtTop && y < txtTop + txt.offsetHeight) {
                data["rangeBox"].style.display = "none";
                this.DOM["txtEdit"].focus();
                if (this.pSheet.pGrid.mathBar) {
                    this.DOM["txtEdit"].value = this.pSheet.pGrid.mathBar.DOM["mathExp"].value;
                }
            }

        },
        txtPosition: function (oTd, pos) {
            if (!pos) {
                var w = oTd.offsetWidth, h = oTd.offsetHeight, bw = 3;
                if ($P.isStandardMode()) {
                    w = w - 2 * bw;
                    h = h - 2 * bw;
                }
                pos = $ET.position(oTd, this.DOM["table"].parentNode);
                $ET.setCSS(this.DOM["txtEdit"], {
                    display: "",
                    left: pos.left + "px",
                    top: pos.top + "px",
                    width: w + "px",
                    height: h + "px", //parseInt(Common.getStyle(oTd, "borderRightWidth"))
                    border: bw + "px double  #7DB3F3",
                    zIndex: 1
                });
            } else {
                $ET.setCSS(this.DOM["txtEdit"], pos);
            }

        },
        txtInputInRange: function (evt) {
            var oTd = evt.target,
             preTd;
            if (oTd.nodeName.toLowerCase() == "td") {
                this.txtPosition(oTd)
                preTd = this.getRange().sTd;
                preTd && $ET.text(preTd, this.DOM["txtEdit"].value);
                this.DOM["txtEdit"].value = $ET.text(oTd);
                if (this.pSheet.pGrid.mathBar) {
                    this.pSheet.pGrid.mathBar.DOM["mathExp"].value = $ET.text(oTd);
                }
            }
        },
        txtBlur: function (evt) {
            var oTd = evt.target;
            $ET.text(oTd, this.DOM["txtEdit"].value);
        },
        mouseOverTable: function (event) {
            var rect = $ET.getRect(this.sheetContainer),
            mouse = event.getMousePagePos();

            return (mouse.left > oCellPos.left && mouse.left < oCellPos.left + oCell.offsetWidth
                && mouse.top > oCellPos.top && mouse.top < oCellPos.top + oCell.offsetHeight)
        },
        setTxtInput: function (oTd) {
            var oTr = oTd.parentNode;
            //        var cellPos = getCoordinate(oTd);

            //        //获得文本框的原始列索引位置
            //        indexX = getX(oTd);
            //        indexY = oTr.rowIndex;

            //        //Set the around W,N,E,S Lines
            //        //设置单元格的选取边框
            //        endX = indexX, endY = indexY;
            //        setRangeBox(indexX, indexY, endX, endY);

            //        $(this.txtEdit).val(
            //                oTd.innerText.replace(/&lt;/g, "<").replace(/&quot;/g, '"').replace(/&gt;/g, ">").replace(/&amp;/g, "&").replace(/&nbsp;/g, " ")
            //            ).css({
            //                top: cellPos.top - 133,
            //                left: cellPos.left - 36,
            //                width: oTd.offsetWidth,
            //                height: oTd.offsetHeight,
            //                display: "block",
            //                textAlign: oTd.currentStyle.textAlign,
            //                textAlign: oTd.currentStyle.textAlign,
            //                textAlign: oTd.currentStyle.textAlign,
            //                fontFamily: oTd.currentStyle.fontFamily,
            //                fontSize: oTd.currentStyle.fontSize || "14",
            //                textDecoration: oTd.currentStyle.textDecoration,
            //                fontStyle: oTd.currentStyle.fontStyle,
            //                fontWeight: oTd.currentStyle.fontWeight,
            //                color: oTd.currentStyle.color,
            //                backgroundColor: oTd.style.backgroundColor
            //            });
            //        switch (oTd.currentStyle.verticalAlign) {
            //            case "top":
            //                {
            //                    this.txtEdit.style.paddingTop = 0;
            //                    break;
            //                }
            //            case "middle":
            //                {
            //                    this.txtEdit.style.paddingTop = (oTd.clientHeight - parseInt(oTd.style.fontSize)) / 2 > 0 ? (oTd.clientHeight - parseInt(oTd.style.fontSize)) / 2 : 0;
            //                    break;
            //                }
            //            case "bottom":
            //                {
            //                    this.txtEdit.style.paddingTop = oTd.clientHeight - parseInt(oTd.style.fontSize) > 0 ? oTd.clientHeight - parseInt(oTd.style.fontSize) : 0;
            //                    break;
            //                }
            //            default:
            //                {
            //                    this.txtEdit.style.paddingTop = (oTd.clientHeight - parseInt(oTd.style.fontSize)) / 2 > 0 ? (oTd.clientHeight - parseInt(oTd.style.fontSize)) / 2 : 0;
            //                    break;
            //                }
            //        }
            //        //文本框获得输入焦点
            //        this.txtEdit.focus();

            //        if (window["isFormating"]) {
            //            DesignEdit.arrFormatCopy = [];
            //            window["isFormating"] = false;
            //            tbData.parentNode.style.cursor = "auto";
            //            event.srcElement.style.backgroundColor = "";
            //        }
        },
        show: function () {
            this.DOM["table"].parentNode.style.display = "block";
        }, hide: function () {
            this.DOM["table"].parentNode.style.display = "none";
        },
        print: function () {
            var matrix = this.matrix, s = "", CLen = this.matrix[0].length;
            for (var i = 0; i < matrix.length; i++) {
                s += (i + "[");
                for (var j = 0; j < CLen; j++) {
                    s += this.matrix[i][j].rowIndex + "_" + (this.matrix[i][j].colIndex + 1) + "_" + this.matrix[i][j].td.className + ",   ";
                }
                s += "]  <br/>";
            }

            var win = window.open("_blank");
            win.document.write(s);
            return s;
        },
        toString: function () {
            var matrix = this.matrix, CLen = this.matrix[0].length, s = "<Report Style=\"\"><Table RowNum=\"" + (matrix.length - 1) + "\" ColNum=\"" + CLen + "\"><Tbody>";
            for (var i = 1; i < matrix.length; i++) {
                s += "<Tr Style=\"\" HContentRegionType=\"\" Class=\"\">";
                for (var j = 0; j < CLen; j++) {
                    if (this.matrix[i][j].td.innerText != "") {
                        s += ("<Td ClientId=\"" + this.matrix[i][j].td.id + "\" LeftCell=\"\" TopCell=\"\" ColSpan=\"" + this.matrix[i][j].colSpan + "\" RowSpan=\"" + this.matrix[i][j].rowSpan + "\" Class=\"" + this.matrix[i][j].td.className + "\" Style=\"\" DataExp=\"\" DataValue=\"\" DisplayValue=\"\" DisplayExp=\"\" IsExt=\"\">" + this.matrix[i][j].td.innerText + "</td>");
                    }
                    else {
                        s += ("<Td ClientId=\"" + this.matrix[i][j].td.id + "\" LeftCell=\"\" TopCell=\"\" ColSpan=\"" + this.matrix[i][j].colSpan + "\" RowSpan=\"" + this.matrix[i][j].rowSpan + "\" Class=\"" + this.matrix[i][j].td.className + "\" Style=\"\" DataExp=\"\" DataValue=\"\" DisplayValue=\"\" DisplayExp=\"\" IsExt=\"\"/>");
                    }
                }
                s += "</Tr>";
            }
            s += "</Tbody></Table>";
            s += "<QueryCondition></QueryCondition>";
            s += "</Report>";
            return s;
        }
    }),
    Sheet = $C.Create({
        include: [moduleSheet],
        initialize: function (sheet, pSheets) {
            this.setOptions(sheet);
            this.DOM = {};
            this.pSheets = pSheets;
            this.pGrid = pSheets.pGrid;
            this.topTable = new TopTable(sheet, this);
            this.leftTable = new LeftTable(sheet, this);

            this.pSheets.DOM["sheetsContainer"].insertAdjacentHTML("beforeend", "<div class='sheetPane mpb' style='display:" + (sheet.active == 1 ? "block;" : "none;") + "'></div>");
            this.DOM["sheetContainer"] = $ET.lastElementChild(this.pSheets.DOM["sheetsContainer"]);
            this.mainTable = new MainTable(sheet, this);
            this.colResize();
            this.rowResize();
        },
        setOptions: function (options) {
            this.id = options.id;
            this.tdWidth = options.tdWidth || 60;
            this.tdBorderWidth = options.tdBorderWidth || 1;
            this.trHeight = options.trHeight || 19;
        },
        colResize: function () {
            var wResize = {
                cursor: "col-resize",
                moveable: false,
                mainTable: this.mainTable,
                curTd: null,
                diffMLX: 0, //按下时鼠标跟线之间的差距
                line: null,
                lineLeft: 0,
                mouseXInTd: 0,
                fm: null,
                fs: null
            };
            $E.bind(this.topTable.DOM["table"], "mousemove", {
                scope: this.topTable,
                fn: this.topTable.move,
                data: wResize
            }, true);

            $E.bind(this.topTable.DOM["table"], "mousedown", {
                scope: this.topTable,
                fn: function (evt) {
                    evt.evtData.fm || (evt.evtData.fm = $E.argBind(this, this.move, evt.evtData));
                    evt.evtData.fs || (evt.evtData.fs = $E.argBind(this, this.stop, evt.evtData));
                    this.start(evt);
                    if (evt.evtData.moveable) {
                        $E.bind(document, "mousemove", evt.evtData.fm, true);
                        $E.bind(document, "mouseup", evt.evtData.fs, true);
                    }
                },
                data: wResize
            }, true);
        },
        rowResize: function () {
            var hResize = {
                cursor: "row-resize",
                moveable: false,
                mainTable: this.mainTable,
                curTd: null,
                diffMLY: 0, //按下时鼠标跟线之间的差距
                line: null,
                lineTop: 0,
                mouseYInTd: 0,
                fm: null,
                fs: null
            };

            $E.bind(this.leftTable.DOM["table"], "mousemove", {
                scope: this.leftTable,
                fn: this.leftTable.move,
                data: hResize
            }, true);

            $E.bind(this.leftTable.DOM["table"], "mousedown", {
                scope: this.leftTable,
                fn: function (evt) {
                    evt.evtData.fm || (evt.evtData.fm = $E.argBind(this, this.move, evt.evtData));
                    evt.evtData.fs || (evt.evtData.fs = $E.argBind(this, this.stop, evt.evtData));
                    this.start(evt);
                    if (evt.evtData.moveable) {
                        $E.bind(document, "mousemove", evt.evtData.fm, true);
                        $E.bind(document, "mouseup", evt.evtData.fs, true);
                    }
                },
                data: hResize
            }, true);
        },
        selRow: function () {

        },
        selCol: function () {

        },
        mouseDownHandle: function (evt) {

        },
        mergeCells: function () {
            this.mainTable.mergeCells();
        },
        splitCells: function () {
            this.mainTable.splitCells();
        },
        insertRows: function (dir) {
            var recRange = this.mainTable.getRecRange(),
            temp = this.mainTable.getIndexCount(recRange.sCell, recRange.eCell, "row"),
            sRow = temp.index,
            // count = temp.count;
            //最初选定区域范围
            count = recRange.bottom > recRange.top ? recRange.bottom - recRange.top + 1 : recRange.top - recRange.bottom + 1;
            this.leftTable.insertRows(dir, sRow, count);
            this.mainTable.insertRows(dir);
            this.pSheets.resizeVScroll();
        },
        delRows: function () {
            var obj = this.mainTable.delRows();
            this.leftTable.delRows(obj.row, obj.count);
            this.pSheets.resizeVScroll();
        },
        insertCols: function (dir) {
            var recRange = this.mainTable.getRecRange(),
            temp = this.mainTable.getIndexCount(recRange.sCell, recRange.eCell, "col"),
            sCol = temp.sCol,
            //            count = temp.count;
            //最初选定区域范围
            count = recRange.right > recRange.left ? recRange.right - recRange.left + 1 : recRange.left - recRange.right + 1;
            this.topTable.insertCols(dir, sCol, count);
            this.mainTable.insertCols(dir, sCol, count);
            this.pSheets.resizeHScroll();
        },
        delCols: function () {
            var obj = this.mainTable.delCols();
            this.topTable.delCols(obj.sCol, obj.count);
            this.pSheets.resizeHScroll();
        },
        //字体加粗
        setFontWeight: function () {
            this.mainTable.setFontWeight();
        },
        //字体倾斜
        setItalic: function () {
            this.mainTable.setItalic();
        },
        //字体下划线
        setUnderLine: function () {
            this.mainTable.setUnderLine();
        },
        //居左
        setVAlignL: function () {
            this.mainTable.setVAlignL();
        },
        //居中
        setVAlignC: function () {
            this.mainTable.setVAlignC();
        },
        //居右
        setVAlignR: function () {
            this.mainTable.setVAlignR();
        },
        //上对齐
        setHAlignT: function () {
            this.mainTable.setHAlignT();
        },
        //垂直居中
        setHAlignC: function () {
            this.mainTable.setHAlignC();
        },
        //下对齐
        setHAlignB: function () {
            this.mainTable.setHAlignB();
        },
        //设置字体颜色
        selColor: function (color) {
            this.mainTable.selColor(color);
        },
        //设置背景色
        selBColor: function (color) {
            this.mainTable.selBColor(color);
        },
        //设置字体
        SetFont: function (font) {
            this.mainTable.SetFont(font);
        },
        //设置字体大小
        SetFontSize: function (size) {
            this.mainTable.SetFontSize(size);
        },
        //设置边框颜色
        setBorderColor: function (color) {
            this.mainTable.setBorderColor(color);
        },
        //设置边线类型
        setBorderLineType: function (oEvent) {
            this.mainTable.setBorderLineType(oEvent);
        },
        //设置边框样式
        SetBorder: function (oEvent) {
            this.mainTable.SetBorder(oEvent);
        },
        fixedTableWidth: function (oTables) {//固定单元格宽度
            var i = 0, j = 0, len = 0,
            w = 0;
            for (; i < oTables.length; i++) {
                for (len = oTables[i].rows[0].cells.length; j < len; j++) {
                    w += oTables[i].rows[0].cells[j].offsetWidth;
                }
                oTables[i].style.width = w + "px";
                w = 0;
            }
        },
        toString: function () {
            var sb = new StringBuilder();
            sb.append("<Sheet type=\"\" DbId=\"\" ClientId=\"\" ChineseName=\"\" SelectPageType=\"\" RowNumPerPage=\"\" ColNumPerPage=\"\">");
            sb.append(this.mainTable.toString());
            sb.append("</Sheet>");
            return sb.toString();
        }
    });

    win.ReportSheet = Sheet;
})(window);

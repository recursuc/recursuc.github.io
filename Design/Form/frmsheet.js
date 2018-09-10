(function (win) {
    var E = $E,
	F = $F,
	ET = $ET,
	LeftTable = $C.Create({
	    initialize: function (options, pSheet) {
	        if (arguments.length == 0) {
	            return;
	        }
	        this.setOptions(options || {});
	        this.DOM = {};
	        this.pSheet = pSheet;
	        this.pSheets = this.pSheet.pSheets;

	        // var height = this.pSheet.pSheets.DOM["divLeftHead"].clientHeight;
	        // while (i < height) {
	        // sbTab.append('<tr><td valign="top" style="width:12px;height:'
	        // +pSheet.trHeight
	        // + 'px; word-break: break-all; word-wrap: break-word;">'
	        // +i + '</td></tr>');
	        // i = i + 50;
	        // }

	        this.pSheet.pSheets.DOM["divLeftHead"].insertAdjacentHTML("beforeend", '<div class="mgb sheetPane" style="display:'
					 + (this.active == 1 ? ";" : "none;")
					 + '" >' + this.setHeight() + '</div>');
	        this.pSheet.DOM["leftTableContainer"] = $ET.lastElementChild(this.pSheet.pSheets.DOM["divLeftHead"]);
	        this.DOM["table"] = $ET.lastElementChild(this.pSheet.DOM["leftTableContainer"]);
	    },
	    setOptions: function (options) {
	        this.row = options.row;
	        this.active = options.active != undefined ? options.active : 0;
	    },
	    setHeight: function () {
	        var sbTab = new StringBuilder(),
				i = 0;
	        sbTab.append('<table class="leftTable rulerV"  width="18px" border="0px"  cellpadding="0" cellspacing="0" width="100%">');
	        height = this.pSheet.mainTable.getEditArea().clientHeight;
	        while (i < height) {
	            sbTab.append('<tr style="background-image:url(Form/imgs/ruler_v.png)"><td valign="top" style="width:12px;height:'
						 + this.pSheet.trHeight
						 + 'px; word-break: break-all; word-wrap: break-word;">'
						 + i + '</td></tr>');
	            i = i + 50;
	        }
	        sbTab.append('</table>');
	        return sbTab.serialize();
	    },
	    insertRows: function (dir, sRow, count) {
	        var row = sRow,
				table = this.DOM["table"],
				RLen,
				refTr = (dir == "u" ? table.rows[row] : (++row < table.rows.length ? table.rows[row] : null)),
				pTr = refTr.parentNode,
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
	        row--;
	        while (row < RLen) {
	            $ET.text(table.rows[row].cells[0], row + 1);
	            row++;
	        }
	    },
	    show: function () {
	        this.DOM["table"].parentNode.innerHtml = this.pSheets.activeSheet.leftTable.setHeight();
	        this.DOM["table"].parentNode.style.display = "block";
	        // this.pSheet.DOM["leftTableContainer"].style.display = "block";

	    },
	    hide: function () {
	        this.DOM["table"].parentNode.style.display = "none";
	    }
	}),
	TopTable = $C.Create({
	    initialize: function (options, pSheet) {
	        this.setOptions(options || {});
	        this.DOM = {};
	        this.pSheet = pSheet;
	        this.pSheets = this.pSheet.pSheets;
	        // sbTab.append('<table class="topTable rulerH" cellpadding="0" cellspacing="0"
	        // style="font: 10px/1 Arial, sans-serif;">');
	        // sbTab.append('<tr>');
	        // var width = this.pSheet.pSheets.DOM["divTopHead"].clientWidth;
	        // while (i < width) {
	        // sbTab.append('<td align=left style="border-bottom-width: 0px;width:'
	        // +pSheet.tdWidth
	        // + 'px;">'
	        // +i
	        // + '</td>');
	        // i = i + 50;
	        // }
	        // sbTab.append('</tr>');
	        // sbTab.append('</table>');
	        this.pSheet.pSheets.DOM["divTopHead"].insertAdjacentHTML("beforeend", '<div class="mgb sheetPane" style="display:'
					 + (this.active == 1 ? ";" : "none;")
					 + '" >' + this.setWidth() + '</div>');
	        this.pSheet.DOM["topTableContainer"] = $ET.lastElementChild(this.pSheet.pSheets.DOM["divTopHead"]);
	        this.DOM["table"] = $ET.lastElementChild(this.pSheet.DOM["topTableContainer"]);
	    },
	    setOptions: function (options) {
	        this.col = options.col;
	        this.active = options.active != undefined ? options.active : 0;
	    },
	    setWidth: function () {
	        var sbTab = new StringBuilder(),
				i = 0;
	        sbTab.append('<table class="topTable rulerH" cellpadding="0" cellspacing="0"  style="height:100%; font: 10px/1 Arial, sans-serif;">');
	        sbTab.append('<tr>');
	        var width = this.pSheet.mainTable.getEditArea().clientWidth;
	        while (i < width) {
	            sbTab.append('<td align=left style="background-image:url(Form/imgs/ruler_h.png); border-bottom-width: 0px;width:'
						 + this.pSheet.tdWidth
						 + 'px;">'
						 + i
						 + '</td>');
	            i = i + 50;
	        }
	        sbTab.append('</tr>');
	        sbTab.append('</table>');
	        return sbTab.serialize();
	    },
	    insertCols: function (dir, sCol, count) {
	        var col = sCol,
				RLen,
				oTr = this.DOM["table"].rows[0],
				oTd,
				CLen,
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
				oTr = this.DOM["table"].rows[0],
				oTd,
				CLen;
	        while (count--) {
	            oTr.deleteCell(sCol);
	        }
	        CLen = oTr.cells.length;
	        while (col < CLen) {
	            $ET.text(oTr.cells[col], this.digitToChar(col));
	            col++;
	        }
	    },
	    show: function () {
	        this.DOM["table"].parentNode.style.display = "";
	    },
	    hide: function () {
	        this.DOM["table"].parentNode.style.display = "none";
	    }
	}),
	StructTree = $C.Create({
	    initialize: function (options, parent) {
	        var heContainer = this.container = options.container;
	        if (!heContainer) {
	            return;
	        }
	        this.parent = parent;
	        var treeWrap = document.createElement("div");
	        heContainer.appendChild(treeWrap);
	        this.tree = new Tree({
	            imgBasePath: "../sfk/tree/images/",
	            iconType: 1,
	            container: treeWrap,
	            showLevel: null,
	            onClick: $F.bind(this, this.clickHandle),
	            showLine: false,
	            showCheck: false,
	            roots: options.roots,
	            CM: this.getStructTreeCM(treeWrap, F.bind(this, this.cmAction))
	        });
	    },
	    getStructTreeCM: function (heTarget, action) {
	        return {
	            imgBasePath: "../sfk/contextmenu/images",
	            target: heTarget,
	            name: "contextMenu11",
	            items: [{
	                id: "cm_delete",
	                text: "删除",
	                icon: "",
	                action: function (evt, nodes) {
	                    action(evt, nodes);
	                }
	            }
					]
	        };
	    },
	    cmAction: function (evt, nodes) {
	        if (nodes) {
	            for (var i = 0, len = nodes.length; i < len; i++) {
	                if (nodes[i].text == "表单") {
	                    alert("根节点不能删除！");
	                } else {
	                    nodes[i].remove();
	                    nodes[i].data.remove();
	                }
	            }
	        }
	    },
	    insert: function (options, node, sDir) {
	        sDir || (sDir = "LC");
	        return this.tree.insert(options, node, sDir);
	    },
	    clickHandle: function (evt, node) {
	        node.data.resize.show();
	        this.parent.location(node.data);
	    },
	    show: function () {
	        this.tree.container.style.display = "";
	    },
	    hide: function () {
	        this.tree.container.style.display = "none";
	    }
	}),
	FormControl = $C.Create({
	    initialize: function (options, parent) {
	        this.cid = options.cid;
	        this.name = options.name || this.cid;
	        this.type = options.type;
	        this.data = options.data;
	        this.parent = parent;
	        this.src = options.src;
	        this.drops = options.drops || [];
	        this.container = options.container;
	        this.mxContainer = options.mxContainer;
	        if (options.heControl) {//已有htmlelement
	            this.heControl = options.heControl;
	            this.heContent = options.heControl;
	        } else {
	            if (options.rect.nodeType) {//数据格式为xml
	                this.cfgData || (this.cfgData = {});
	                var xnControl = options.rect,
						i = 0,
						len = xnControl.attributes.length;
	                for (; i < len; i++) {
	                    var attrNode = xnControl.attributes[i],
							name = attrNode.name,
							value = attrNode.value;
	                    if (name == "style") {
	                        var oStyle = this.cfgData[name] = {},
								aAttr = value.split(/\s*;\s*/);
	                        for (var m = 0, iALen = aAttr.length; m < iALen; m++) {
	                            var attr = aAttr[m],
									res;
	                            if (attr != "") {
	                                res = aAttr[m].split(/\s*:\s*/);
	                                oStyle[res[0]] = res[1];
	                            }
	                        }
	                    } else {
	                        this.cfgData[name] = value;
	                    }
	                }
	                this.cid = this.cfgData.cid;
	            } else {//数据格式为Object
	                var cfgData = options.rect.style ? cfgData = options.rect : {
	                    className: this.className || "",
	                    value: "",
	                    style: options.rect
	                };
	                this.cfgData ? $O.extend(this.cfgData, cfgData, true) : (this.cfgData = cfgData);
	                this.cfgData.cid = this.cid;
	                this.cfgData.type = this.type;
	            }
	            this.cfgData.style.position || (this.cfgData.style.position = "absolute");
	            this.heControl = this.make(options.sControl, this.cfgData, options.container, options.zIndex, options.resize);
	        }
	        this.heControl.setAttribute("data-cid", this.cid);
	        this.heControl.setAttribute("type", this.type);
	        this.CM = options.CM ? new ContextMenu(options.CM) : null;
	        this.attachBehavior(options.resize, options.drag);
	    },
	    refreshRect: function () {
	        return this.rect = ET.getRect(this.heControl);
	    },
	    insert: function (options, node, sDir) { },
	    make: function (sControl, cfgData, heContainer, zIndex, bResize) {
	        var oStyle = cfgData.style,
				sMask = "",
				bTable = false;
	        if (!sControl) {
	            return;
	        }
	        var heControl = this.heControl = document.createElement("div");
	        heControl.style.display = "inline-block";
	        heControl.style.zIndex = zIndex || 300;
	        switch (this.type) {
	            case "div":
	            case "tab":
	            case "form":
	                {
	                    sMask = '<div style="position:relative;top:-100%;left:0px;width:100%;height:100%;z-index:10"></div>';
	                    break;
	                }
	            case "table":
	                {
	                    bTable = true;
	                    break;
	                }
	            default:
	                sMask = '<div class="mask" style="position:relative;top:-100%;left:0px;background-color: #F1FC74;"></div>';
	                break;
	        }
	        if (typeof sControl == "string") {
	            heControl.innerHTML = sControl + sMask;
	        } else if (sControl.nodeType == 1) {
	            sMask && (heControl.innerHTML = sMask);
	            heControl.insertBefore(sControl, heControl.firstChild);
	        }
	        this.heContent = heControl.children[0];
	        if (!bTable) {
	            if (bResize !== false) {
	                var rlContainer = this.rlContainer = document.createElement("div");
	                rlContainer.style.position = "relative";
	                rlContainer.style.height = "100%";
	                rlContainer.style.width = "100%";
	                rlContainer.style.top = "-200%";
	                rlContainer.style.left = "0px";
	                heControl.appendChild(rlContainer);
	            }
	            this.heMask = heControl.children[1];
	        }
	        for (var name in oStyle) {
	            this.setPropVal(name, oStyle[name], true);
	        }
	        heContainer && heContainer.appendChild(heControl);
	        $E.on(heControl, "click", this.click, this);
	        return heControl;
	    },
	    attachBehavior: function (bResize, bDrag) {
	        var F = $F;
	        bResize !== false && (this.resize = new Resizable({
	            target: this.heControl,
	            targetContent: this.heContent,
	            RLContainer: this.rlContainer,
	            min: {
	                width: 1,
	                height: 1
	            },
	            mode: 1,
	            outDelay: 300,
	            // toggleShowByAction:"click",
	            onResize: F.bind(this, this.onResize),
	            overShow: true
	        }));

	        bDrag !== false && (this.drag = new Drag(this.heControl, {
	            Handle: this.heControl.children[1],
	            mxContainer: this.mxContainer,
	            Limit: false,
	            drops: this.drops,
	            onPosition: F.bind(this, this.onPosition),
	            onDrop: F.bind(this, this.onDrop),
	            onStart: F.bind(this, this.onStart),
	            onStop: F.bind(this, this.onStop)
	        }));
	    },
	    click: function (evt) {
	        this.active(evt.ctrlKey) && this.openAttrWin();
	        evt.stopPropagation();
	    },
	    openAttrWin: function () {
	        this.parent.location(this);
	    },
	    active: function (bMulti) {
	        var actControl = this.parent.activeControl,
				i,
				len = actControl.length,
				found = false,
				control;
	        if (bMulti) {
	            this.resize.toggleShow();
	            for (i = 0; i < len; i++) {
	                if (actControl[i] == this) {
	                    actControl.splice(i, 1);
	                    found = true;
	                    break;
	                }
	            }

	            if (!found) {
	                actControl.push(this);
	                return true;
	                // this.parent.location(this);
	            }
	        } else {
	            while (len--) {
	                control = actControl[len];
	                if (control == this) {
	                    found = true;
	                } else {
	                    actControl.splice(len, 1);
	                    control.resize.toggleShow();
	                }
	            }

	            if (!found) {
	                actControl.push(this);
	                this.resize.toggleShow();
	            }
	            return true;
	            // this.parent.location(this);
	        }

	        return false;
	    },
	    onResize: function (helper) {
	        this.cfgData.style.width = this.heContent.style.width = helper.cur.width - parseInt(this.heContent.style.borderRightWidth) - parseInt(this.heContent.style.borderLeftWidth) + "px";
	        this.cfgData.style.height = this.heContent.style.height = helper.cur.height - parseInt(this.heContent.style.borderTopWidth) - parseInt(this.heContent.style.borderBottomWidth) + "px";

	        this.refreshRect();
	        // this.cfgData.style.width = this.heControl.style["width"];
	        // this.cfgData.style.height = this.heControl.style["height"];
	    },
	    onPosition: function (heDrag, pos) {
	        this.srcPos = pos;
	        if (pos != "absolute") {
	            heDrag.style.left = heDrag.offsetLeft + "px";
	            heDrag.style.top = heDrag.offsetTop + "px";
	            heDrag.style.position = "absolute";
	        }
	        return "absolute";
	    },
	    onStart: function () {
	        this.parent.highlight(this.data, false);
	        this.drag.resetDropTarget(this.refreshDrops());
	    },
	    onMove: function () { },
	    onStop: function (helper) {
	        this.refreshRect();
	        this.srcPos && (this.heControl.style.position = this.srcPos);
	    },
	    onDrop: function (heDropTarget, dropTarget) {
	        var rect = $ET.getRect(this.heControl),
				rectDT = dropTarget.rect, // dropTarget.type != "table" ?
	            // dropTarget.rect :
	            // dropTarget.tdRect,
				mainTable = this.parent,
				pControl = mainTable.getControl(heDropTarget.getAttribute("data-cid")),
				scrollLeft = 0,
				scrollTop = 0;

	        switch (dropTarget.type) {
	            case "table":
	                {
	                    rectDT = dropTarget.tdRect;
	                    // this.heControl.style.position = "static";
	                    if (heDropTarget.heTd != this.heControl.parentNode || this.srcPos == "static") { //
	                        pControl.appendChild(this, dropTarget.heTd);
	                    }
	                    break;
	                }
	            case "tab":
	                {
	                    if (pControl.tab.activeTab) {
	                        var hePanel = pControl.tab.activeTab.panel;
	                        scrollTop = hePanel.scrollTop;
	                        scrollLeft = hePanel.scrollLeft;
	                        if (this.data.pNode != pControl.data || this.srcPos == "static") { // heDropTarget
	                            // !=
	                            // this.heControl.parentNode
	                            pControl.appendChild(this);
	                        }
	                    } else {
	                        alert("请先在tab属性页中添加tab项！");
	                        this.heControl.style.position = this.srcPos; // this.srcPos;
	                        this.heControl.style.top = this.cfgData.style["top"];
	                        this.heControl.style.left = this.cfgData.style["left"];

	                        return;
	                    }
	                    pControl = pControl.tab.activeTab;
	                    break;
	                }
	            default:
	                {
	                    if (this.data.pNode != pControl.data || this.srcPos == "static") { // heDropTarget != this.heControl.parentNode
	                        pControl.appendChild(this);
	                    }
	                }
	        }

	        this.cfgData.style["top"] = this.heControl.style.top = rect.top - rectDT.top + scrollTop + "px";
	        this.cfgData.style["left"] = this.heControl.style.left = rect.left - rectDT.left + scrollLeft + "px";
	        mainTable.addControlToTree(this, pControl);
	    },
	    setData: function (data) {
	        this.data = data;
	    },
	    refreshDrops: function () {
	        var heContainer;
	        this.drops.length = 0;
	        this.drops = this.parent.getContainer();
	        if (this.type == "div" || this.type == "table" || this.type == "tab") {
	            for (var i = 0; i < this.drops.length; ) {
	                heContainer = this.drops[i].he;
	                if (heContainer == this.heControl || this.heControl.contains(heContainer)) {
	                    this.drops.splice(i, 1);
	                    continue;
	                }
	                i++;
	            }
	        }
	        return this.drops;
	    },
	    getElement: function () {
	        return this.heControl.firstChild;
	    },
	    clearDsBind: function (dsName) {
	        if (this.cfgData["dataset"] == dsName) {
	            this.cfgData["dataset"] = "";
	            this.cfgData["datatable"] = "";
	            this.cfgData["datacolumn"] = "";
	        }
	    },
	    show: function () {
	        this.tree.container.style.display = "";
	    },
	    hide: function () {
	        this.tree.container.style.display = "none";
	    },
	    writeBeginTag: function () {
	        return "<" + this.getProps();
	    },
	    writeContent: function () { },
	    writeEndTag: function () {
	        return "";
	    },
	    setProp: function (propName, value) {
	        var aPN = propName.split("."),
				bStyle = aPN.length > 1;
	        this.setPropVal(bStyle ? aPN[1] : aPN[0], value, bStyle);
	    },
	    setPropVal: function (propName, value, bStyle) {
	        // position、width、height、left、top样式属性目标对象为this.heControl其他为this.heContent
	        if (bStyle) {
	            switch (propName) {
	                case "position":
	                    {
	                        this.cfgData.style[propName] = this.heControl.style[propName] = value;
	                        break;
	                    }
	                case "width":
	                case "height":
	                case "left":
	                case "top":
	                    {
	                        this.cfgData.style[propName] = this.heControl.style[propName] = /px$/.test(value) ? value : (value + "px");
	                        break;
	                    }
	                case "font-size":
	                case "border-left-width":
	                case "border-right-width":
	                case "border-top-width":
	                case "border-bottom-width":
	                    {
	                        var sName = propName.replace(/(\-\w)/g, function (match) {
	                            return match.charAt(1).toUpperCase();
	                        });
	                        this.cfgData.style[propName] = this.heContent.style[sName] = /px$/.test(value) ? value : (value + "px");

	                        this.resize && this.resize.setContainerSize(this.heContent.offsetWidth, this.heContent.offsetHeight);
	                        break;
	                    }
	                default:
	                    {
	                        var sName = propName.replace(/(\-\w)/g, function (match) {
	                            return match.charAt(1).toUpperCase();
	                        });
	                        this.cfgData.style[propName] = value;
	                        this.heContent.style[sName] = value;
	                    }
	            }
	        } else if (propName.toLowerCase() == "editareaw") {
	            this.cfgData.editArea.cfgData.style["width"] = this.cfgData.editArea.heControl.style["width"] = /px$/.test(value) ? value : (value + "px");
	        } else if (propName.toLowerCase() == "editareah") {
	            this.cfgData.editArea.cfgData.style["height"] = this.cfgData.editArea.heControl.style["height"] = /px$/.test(value) ? value : (value + "px");
	        } else {
	            if (propName.toLowerCase() == "dataset") {
	                // var sheet = this.parent.pSheet;
	                // sheet.dsId != value && (sheet.dsId = value);
	                this.cfgData["DataTable"] = this.heContent["DataTable"] = "";
	                this.cfgData["DataColumn"] = this.heContent["DataColumn"] = "";
	            } else if (propName.toLowerCase() == "datatable") {
	                this.cfgData["DataColumn"] = this.heContent["DataColumn"] = "";
	            }

	            this.cfgData[propName] = this.heContent[propName] = value;
	        }
	    },
	    getProps: function () {
	        var sb = new StringBuilder();
	        this.cfgData.style.width = this.heControl.style.width;
	        this.cfgData.style.height = this.heControl.style.height;
	        this.cfgData.style.top = this.heControl.style.top;
	        this.cfgData.style.left = this.heControl.style.left;
	        for (var propName in this.cfgData) {
	            if (propName == "style") {
	                sb.append("style=\"");
	                var oStyle = this.cfgData[propName];
	                for (var pn in oStyle) {
	                    sb.append(pn + ":" + oStyle[pn] + ";");
	                }
	                sb.append("\" ");
	            } else {
	                sb.append(propName + "=\"" + this.cfgData[propName]
							 + "\" ");
	            }
	        }
	        return sb.count > 0 ? (" " + sb.serialize()) : "";
	    },
	    getStyle: function () {
	        var sb = new StringBuilder();
	        this.cfgData.style.width = this.heControl.style.width;
	        this.cfgData.style.height = this.heControl.style.height;
	        this.cfgData.style.top = this.heControl.style.top;
	        this.cfgData.style.left = this.heControl.style.left;
	        sb.append("style=\"");
	        var oStyle = this.cfgData["style"];
	        for (var pn in oStyle) {
	            sb.append(pn + ":" + oStyle[pn] + ";");
	        }
	        sb.append("\" ");
	        return sb.count > 0 ? (" " + sb.serialize()) : "";
	    },
	    setValue: function () {
	        this.heContent.value = this.cfgData.value;
	    },
	    getValue: function () {
	        return this.heContent.value;
	    },
	    serialize: function () {
	        if (this.type == "div") {
	            throw "must no child";
	        }
	        return "<" + this.type + "" + this.getProps() + "/>";
	    },
	    getDBSource: function (sURL, options) {
	        if (!sURL || sURL == "") {
	            sURL = "controlDSAjaxAction.action";
	        }
	        var data = this.cfgData,
				sSql = options && options.DataSourceSQL ? options.DataSourceSQL : data.DataSourceSQL,
				vColumn = options && options.DBValueColumn ? options.DBValueColumn : data.DBValueColumn,
				tColumn = options && options.DBTextColumn ? options.DBTextColumn : data.DBTextColumn,
				xmlDoc = XmlDocument.createBase('<Operation ParamType="GetDBSourceItems" DataSource="'
						 + sSql
						 + '" DbValueColumn="'
						 + vColumn
						 + '" DbTextColumn="' + tColumn + '"/>'),
				sourceItems = [];
	        $R({
	            type: "post",
	            url: sURL,
	            async: false,
	            success: function (xhr) {
	                var returnXml = xhr.responseXML;
	                if (returnXml.selectSingleNode("RAD/Doc/Result/ResCode").text == "0") {
	                    var xnSourceItems = returnXml.selectNodes("RAD/Doc/Data/DBSource/Item"),
							xnDBItem;
	                    for (var i = 0; i < xnSourceItems.length; i++) {
	                        xnDBItem = xnSourceItems[i];
	                        sourceItems.push({
	                            "text": xnDBItem.getAttribute("name"),
	                            "value": xnDBItem.getAttribute("id")
	                        });
	                    }
	                } else {
	                    alert("请检查当前控件数据库数据源配置，无法查询控件数据源！");
	                }
	            },
	            error: function (xhr) {
	                alert('Failure: ' + xhr.status);
	            },
	            data: xmlDoc,
	            contentType: "text/xml"
	        });
	        return sourceItems;
	    },
	    remove: function () {
	        this.container.removeChild(this.heControl);
	        this.parent.removeControl(this);
	    },
	    dispose: function () {
	        this.heControl.parentNode.removeChild(this.heControl);
	        this.heControl = null;
	        this.heContent = null;
	        this.rlContainer && (this.rlContainer = null);
	        // this.data=null;
	        /*
	        * 释放拖拽 缩放的交互绑定 this.resize.unbind(); this.drag.unbind();
	        */
	    }
	}),
	FormAnchor = $C.Create(FormControl, {
	    initialize: function (options, parent) {
	        options.type = "a";
	        options.sControl = '<a href="#" style="width:99%;height:99%;padding:0px;margin:0px;">'
					 + ($O.getType(options.rect) == "element" && options.rect.attributes["value"] ? options.rect.attributes["value"].value : "超链接") + '</a>';
	        this.callSuper(options, parent);
	        this.cfgData.value = ($O.getType(options.rect) == "element" && options.rect.attributes["value"] ? options.rect.attributes["value"].value : "超链接");
	    },
	    writeBeginTag: function () {
	        var sb = new StringBuilder();
	        sb.append("<a type=\"a\"");
	        for (var attr in this.cfgData) { }
	        sb.append(">");
	        sb.append(this.writeContent());
	        return sb.serialize();
	    },
	    writeContent: function () { },
	    writeEndTag: function () {
	        return "</a>";
	    },
	    setProp: function (propName, value) {
	        this.callSuper(propName, value);
	        propName == "value" && $ET.text(this.heContent, value);
	    },
	    serialize: function () {
	        return "<a" + this.getProps() + ">　</a>";
	    }
	}),
	FormText = $C.Create(FormControl, {
	    initialize: function (options, parent) {
	        options.type = "text";
	        options.sControl = '<input type="text" style="width:99%;height:99%;padding:0px;margin:0px;" />';
	        this.callSuper(options, parent);
	    },
	    writeBeginTag: function () {
	        var sb = new StringBuilder();
	        sb.append("<input type=\"text\" ");
	        for (var attr in this.cfgData) { }
	        sb.append("/>");
	        return sb.serialize();
	    },
	    writeEndTag: function () { },
	    serialize: function () {
	        return "<input" + this.getProps() + "/>";
	    }
	}),
	FormPassword = $C.Create(FormControl, {
	    initialize: function (options, parent) {
	        options.type = "text";
	        options.sControl = '<input type="password" style="width:99%;height:99%;padding:0px;margin:0px;" />';
	        this.callSuper(options, parent);
	    },
	    writeBeginTag: function () {
	        var sb = new StringBuilder();
	        sb.append("<input type=\"password\" ");
	        for (var attr in this.cfgData) { }
	        sb.append("/>");
	        return sb.serialize();
	    },
	    serialize: function () {
	        return ("<input" + this.getProps() + "/>");
	    }
	}),
	FormHidden = $C.Create(FormControl, {
	    initialize: function (options, parent) {
	        options.type = "text";
	        options.sControl = '<input type="reset" style="width:99%;height:99%;padding:0px;margin:0px;" />';
	        this.callSuper(options, parent);
	    },
	    writeBeginTag: function () {
	        var sb = new StringBuilder();
	        sb.append("<input type=\"hidden\" ");
	        for (var attr in this.cfgData) { }
	        sb.append("/>");
	        return sb.serialize();
	    },
	    serialize: function () {
	        return ("<input" + this.getProps() + "/>");
	    }
	}),
	FormReset = $C.Create(FormControl, {
	    initialize: function (options, parent) {
	        options.type = "text";
	        options.sControl = '<input type="reset" style="width:99%;height:99%;padding:0px;margin:0px;" />';
	        this.callSuper(options, parent);
	    },
	    writeBeginTag: function () {
	        var sb = new StringBuilder();
	        sb.append("<input type=\"reset\" ");
	        for (var attr in this.cfgData) { }
	        sb.append("/>");
	        return sb.serialize();
	    },
	    serialize: function () {
	        return ("<input" + this.getProps() + "/>");
	    }
	}),
	FormSubmit = $C.Create(FormControl, {
	    initialize: function (options, parent) {
	        options.type = "text";
	        options.sControl = '<input type="submit" style="width:99%;height:99%;padding:0px;margin:0px;" />';
	        this.callSuper(options, parent);
	    },
	    writeBeginTag: function () {
	        var sb = new StringBuilder();
	        sb.append("<input type=\"submit\" ");
	        for (var attr in this.cfgData) { }
	        sb.append("/>");
	        return sb.serialize();
	    },
	    serialize: function () {
	        return ("<input" + this.getProps() + "/>");
	    }
	}),
	FormTextArea = $C.Create(FormControl, {
	    initialize: function (options, parent) {
	        // options.type = "textarea";
	        options.sControl = '<textarea style="width:99%;height:99%;padding:0px;margin:0px;">　</textarea>';
	        this.callSuper(options, parent);
	    },
	    writeBeginTag: function () {
	        var sb = new StringBuilder();
	        sb.append("<textarea ");
	        for (var attr in this.cfgData) { }
	        sb.append(">");
	        return sb.serialize();
	    },
	    writeContent: function () { },
	    writeEndTag: function () {
	        return "</textarea>";
	    },
	    serialize: function () {
	        return "<textarea" + this.getProps()
				 + ">　</textarea>";
	    }
	}),
	FormButton = $C.Create(FormControl, {
	    initialize: function (options, parent) {
	        options.type = "button";
	        sValue = typeof options.rect == "object" && options.rect["value"] ? options.rect["value"] : (options.rect.attributes && options.rect.attributes["value"] ? options.rect.attributes["value"].value : "按钮");
	        options.sControl = '<input type="button" value='
					 + sValue
					 + ' style="width:100%;height:100%;padding:0px;margin:0px;" />';
	        this.callSuper(options, parent);
	        this.cfgData.value = ($O.getType(options.rect) == "element" && options.rect.attributes["value"] ? options.rect.attributes["value"].value : "按钮");
	    },
	    writeBeginTag: function () {
	        var sb = new StringBuilder();
	        sb.append("<input type=\"button\" ");
	        for (var attr in this.cfgData) { }
	        sb.append("/>");
	        return sb.serialize();
	    },
	    serialize: function () {
	        return ("<input" + this.getProps() + "/>");
	    }
	}),
	FormSelect = $C.Create(FormControl, {
	    initialize: function (options, parent) {
	        options.type = "combobox";
	        options.sControl = '<select style="width:100%;height:100%;padding:0px;margin:0px;"></select>';
	        this.callSuper(options, parent);
	        if (!options.rect.nodeType) {
	            this.cfgData.DataSourceType = "1";
	            this.cfgData.DataMode = "Both";
	        }
	    },
	    writeBeginTag: function () {
	        return this.callSuper() + ">";
	    },
	    setProp: function (propName, value) {
	        this.callSuper(propName, value);
	        if (propName == "DataSourceType" || propName == "DataSourceContent" || propName == "DBValueColumn" || propName == "DBTextColumn" || propName == "DataSourceSQL") {
	            var data = this.cfgData;
	            if (data.DataSourceType == "0") {
	                var sSql = data.DataSourceSQL,
						vColumn = data.DBValueColumn,
						tColumn = data.DBTextColumn;
	                if (sSql && vColumn && tColumn) {
	                    var sourceItems = this.getDBSource();
	                    if (sourceItems)
	                        var srcItem;
	                    for (var i = 0; i < sourceItems.length; i++) {
	                        srcItem = sourceItems[i];
	                        this.heContent.options.add(new Option(srcItem.text, srcItem.value));
	                    }
	                }
	            } else if (data.DataSourceType == "1") {
	                var dsList = data.DataSourceContent.split(';'),
						list;
	                if (dsList.length > 1) {
	                    for (var n = 0, l = dsList.length; n < l; n++) {
	                        list = dsList[n].split(',');
	                        this.heContent.options.add(new Option(list[0], list[1]));
	                    }
	                } else
	                    this.heContent.options.length = 0;
	            }
	        }
	    },
	    serialize: function () {
	        return "<select" + this.getProps() + "> </select>";
	    }
	}),
	FormRadio = $C.Create(FormControl, {
	    initialize: function (options, parent) {
	        options.type = "radio";
	        if (options.rect.nodeType) {
	            this.setControlHtml(options);
	            this.callSuper(options, parent);
	        } else {
	            var controlHtml = '<div style="width:100%;height:100%;">';
	            controlHtml += '<div style="float:left;">选项1<input type="radio" value="1" /></div>';
	            controlHtml += '<div style="float:left;">选项2<input type="radio" value="2" /></div>';
	            controlHtml += '</div>';
	            options.sControl = controlHtml;
	            this.callSuper(options, parent);
	            this.cfgData.DataSourceType = "1";
	            this.cfgData.DataSourceContent = "选项1,1;选项2,2";
	            this.cfgData.DataMode = "Both";
	        }
	    },
	    writeBeginTag: function () {
	        var sb = new StringBuilder();
	        sb.append("<input type=\"radio\" ");
	        for (var attr in this.cfgData) { }
	        sb.append("/>");
	        return sb.serialize();
	    },
	    writeContent: function () { },
	    writeEndTag: function () { },
	    setProp: function (propName, value) {
	        this.callSuper(propName, value);
	        if (propName == "DataSourceType" || propName == "DataSourceContent" || propName == "DBValueColumn" || propName == "DBTextColumn" || propName == "DataSourceSQL") {
	            var cbHtml = "",
					data = this.cfgData;
	            if (data.DataSourceType == "0") {
	                var sSql = data.DataSourceSQL,
						vColumn = data.DBValueColumn,
						tColumn = data.DBTextColumn;
	                if (sSql && vColumn && tColumn) {
	                    var sourceItems = this.getDBSource();
	                    if (sourceItems)
	                        var srcItem;
	                    for (var i = 0; i < sourceItems.length; i++) {
	                        srcItem = sourceItems[i];
	                        cbHtml += srcItem.text
								 + '<input type="radio" value="'
								 + srcItem.value + '" />';
	                    }
	                }
	            } else if (data.DataSourceType == "1") {
	                var dsList = value.split(';'),
						list;
	                for (var n = 0, l = dsList.length; n < l; n++) {
	                    list = dsList[n].split(',');
	                    cbHtml += list[0]
							 + '<input type="radio" value="'
							 + list[1] + '" />';
	                }
	            }
	            this.heContent.innerHTML = cbHtml;
	        }
	    },
	    setControlHtml: function (options) {
	        var curXnControl = options.rect;
	        var dataSourceType = curXnControl.getAttribute("DataSourceType");
	        var controlHtml = '<div style="width:100%;height:100%;">';
	        if (dataSourceType == "0") {
	            var sSql = curXnControl.getAttribute("DataSourceSQL"),
					vColumn = curXnControl.getAttribute("DBValueColumn"),
					tColumn = curXnControl.getAttribute("DBTextColumn");
	            if (sSql && vColumn && tColumn) {
	                var sourceItems = this.getDBSource("", {
	                    "DataSourceSQL": sSql,
	                    "DBValueColumn": vColumn,
	                    "DBTextColumn": tColumn
	                });
	                if (sourceItems) {
	                    var srcItem,
							sItems = "";
	                    for (var i = 0; i < sourceItems.length; i++) {
	                        srcItem = sourceItems[i];
	                        sItems += '<div style="float:left;">'
								 + srcItem.text
								 + '<input type="radio" value="'
								 + srcItem.value
								 + '" /></div>';
	                    }
	                    controlHtml += sItems;
	                }
	            }
	        } else if (dataSourceType == "1") {
	            var dsList = curXnControl.getAttribute("DataSourceContent").split(';'),
					list,
					sItems = "";
	            for (var n = 0, l = dsList.length; n < l; n++) {
	                list = dsList[n].split(',');
	                sItems += '<div style="float:left;">'
						 + list[0]
						 + '<input type="radio" value="'
						 + list[1] + '" /></div>';
	            }
	            controlHtml += sItems;
	        }
	        controlHtml += '</div>';
	        options.sControl = controlHtml;
	    },
	    serialize: function () {
	        return ("<div" + this.getProps() + ">　</div>");
	    }
	}),
	FormImg = $C.Create(FormControl, {
	    initialize: function (options, parent) {
	        options.type = "img";
	        options.sControl = '<img src="Form/imgs/image.png" style="width:100%;height:100%;" />';
	        this.callSuper(options, parent);
	    },
	    writeBeginTag: function () {
	        var sb = new StringBuilder();
	        sb.append("<img ");
	        for (var attr in this.cfgData) { }
	        sb.append("/>");
	        return sb.serialize();
	    }
	}),
	FormCheckbox = $C.Create(FormControl, {
	    initialize: function (options, parent) {
	        this.name = options.name || "";
	        options.type = "checkbox";
	        options.sControl = this.name
					 + '<input type="checkbox" value="" style="width:100%;height:100%;" />';
	        this.callSuper(options, parent);
	    },
	    writeBeginTag: function () {
	        var sb = new StringBuilder();
	        sb.append("<input type=\"checkbox\" ");
	        for (var attr in this.cfgData) { }
	        sb.append("/>");
	        return sb.serialize();
	    },
	    setValue: function () {
	        this.cfgData.value == this.heContent.value && (this.heContent.checked = true);
	    },
	    getValue: function () {
	        return this.heContent.checked ? this.heContent.value : "";
	    },
	    serialize: function () {
	        return ("<input" + this.getProps() + "/>");
	    }
	}),
	FormCheckboxList = $C.Create(FormControl, {
	    initialize: function (options, parent) {
	        options.type = "checkboxlist";
	        if (options.rect.nodeType) {
	            this.setControlHtml(options);
	            this.callSuper(options, parent);
	        } else {
	            var controlHtml = '<div style="width:100%;height:100%;">';
	            controlHtml += '<div style="float:left;">选项1<input type="checkbox" value="1" /></div>';
	            controlHtml += '<div style="float:left;">选项2<input type="checkbox" value="2" /></div>';
	            controlHtml += '</div>';
	            options.sControl = controlHtml;
	            this.callSuper(options, parent);
	            this.cfgData.DataSourceType = "1";
	            this.cfgData.DataSourceContent = "选项1,1;选项2,2";
	        }
	    },
	    setControlHtml: function (options) {
	        var curXnControl = options.rect;
	        var dataSourceType = curXnControl.getAttribute("DataSourceType");
	        var controlHtml = '<div style="width:100%;height:100%;">';
	        if (dataSourceType == "0") {
	            var sSql = curXnControl.getAttribute("DataSourceSQL"),
					vColumn = curXnControl.getAttribute("DBValueColumn"),
					tColumn = curXnControl.getAttribute("DBTextColumn");
	            if (sSql && vColumn && tColumn) {
	                var sourceItems = this.getDBSource("", {
	                    "DataSourceSQL": sSql,
	                    "DBValueColumn": vColumn,
	                    "DBTextColumn": tColumn
	                });
	                if (sourceItems) {
	                    var srcItem,
							sItems = "";
	                    for (var i = 0; i < sourceItems.length; i++) {
	                        srcItem = sourceItems[i];
	                        sItems += '<div style="float:left;">'
								 + srcItem.text
								 + '<input type="checkbox" value="'
								 + srcItem.value
								 + '" /></div>';
	                    }
	                    controlHtml += sItems;
	                }
	            }
	        } else if (dataSourceType == "1") {
	            var dsList = curXnControl.getAttribute("DataSourceContent").split(';'),
					list,
					sItems = "";
	            for (var n = 0, l = dsList.length; n < l; n++) {
	                list = dsList[n].split(',');
	                sItems += '<div style="float:left;">'
						 + list[0]
						 + '<input type="checkbox" value="'
						 + list[1] + '" /></div>';
	            }
	            controlHtml += sItems;
	        }
	        controlHtml += '</div>';
	        options.sControl = controlHtml;
	    },
	    writeBeginTag: function () {
	        var sb = new StringBuilder();
	        sb.append("<div><input type=\"checkbox\" name=\"cbl\" ");
	        for (var attr in this.cfgData) { }
	        sb.append("/></div>");
	        return sb.serialize();
	    },
	    setProp: function (propName, value) {
	        this.callSuper(propName, value);
	        if (propName == "DataSourceType" || propName == "DataSourceContent" || propName == "DBValueColumn" || propName == "DBTextColumn" || propName == "DataSourceSQL") {
	            var cbHtml = "",
					data = this.cfgData;
	            if (data.DataSourceType == "0") {
	                var sSql = data.DataSourceSQL,
						vColumn = data.DBValueColumn,
						tColumn = data.DBTextColumn;
	                if (sSql && vColumn && tColumn) {
	                    var sourceItems = this.getDBSource();
	                    if (sourceItems)
	                        var srcItem;
	                    for (var i = 0; i < sourceItems.length; i++) {
	                        srcItem = sourceItems[i];
	                        cbHtml += srcItem.text
								 + '<input type="checkbox" value="'
								 + srcItem.value + '" />';
	                    }
	                }
	            } else if (data.DataSourceType == "1") {
	                var dsList = value.split(';'),
						list;
	                for (var n = 0, l = dsList.length; n < l; n++) {
	                    list = dsList[n].split(',');
	                    cbHtml += list[0]
							 + '<input type="checkbox" value="'
							 + list[1] + '" />';
	                }
	            }
	            this.heContent.innerHTML = cbHtml;
	        }
	    },
	    setValue: function () {
	        var vals = this.cfgData.value.split(","),
				boxes = this.heContent.children;
	        for (var i = vals.length - 1; i >= 0; i--) {
	            for (var j = boxes.length - 1; j >= 0; j--) {
	                if (vals[i] == boxes[j].value) {
	                    boxes[j].checked = true;
	                    break;
	                }
	            }
	        }
	    },
	    getValue: function () {
	        var boxes = this.heContent.children,
				vals = [];
	        for (var i = boxes.length - 1; i >= 0; i--) {
	            vals.push(boxes[i].value);
	        }
	        return vals.toString();
	    },
	    serialize: function () {
	        return "<div" + this.getProps() + ">　</div>";
	    }
	}),
	FormLabel = $C.Create(FormControl, {
	    initialize: function (options, parent) {
	        options.type = "label";
	        options.sControl = '<label style="width:100%;height:100%;display:inline-block;">'
					 + ($O.getType(options.rect) == "element" && options.rect.attributes["value"] ? options.rect.attributes["value"].value : "标签") + '</label>';
	        this.callSuper(options, parent);
	        this.cfgData.value = ($O.getType(options.rect) == "element" && options.rect.attributes["value"] ? options.rect.attributes["value"].value : "标签");
	    },
	    writeBeginTag: function () {
	        var sb = new StringBuilder();
	        sb.append("<label ");
	        for (var attr in this.cfgData) { }
	        sb.append(">");
	        return sb.serialize();
	    },
	    writeContent: function () { },
	    writeEndTag: function () {
	        return "</label>";
	    },
	    setProp: function (propName, value) {
	        this.callSuper(propName, value);
	        propName == "value" && $ET.text(this.heContent, value);
	    },
	    serialize: function () {
	        return ("<label"
					 + this.getProps()
					 + ">"
					 + (this.cfgData.value ? this.cfgData.value : " ") + "</label>");
	    }
	}),
	FormDiv = $C.Create(FormControl, {
	    initialize: function (options, parent) {
	        options.type = "div";
	        options.zIndex = 200;
	        options.sControl = '<div style="border-left-width:1px;border-left-style:solid;border-left-color:#808080;'
					 + 'border-right-width:1px;border-right-style:solid;border-right-color:#808080;'
					 + 'border-top-width:1px;border-top-style:solid;border-top-color:#808080;'
					 + 'border-bottom-width:1px;border-bottom-style:solid;border-bottom-color:#808080;'
					 + 'width:100%;height:100%;padding:0px;margin:0px;">　</div>';
	        this.cfgData = {},
				this.cfgData.style = {};
	        this.cfgData.style["border-left-style"] = this.cfgData.style["border-right-style"] = this.cfgData.style["border-top-style"] = this.cfgData.style["border-bottom-style"] = "solid";
	        this.cfgData.style["border-left-width"] = this.cfgData.style["border-right-width"] = this.cfgData.style["border-top-width"] = this.cfgData.style["border-bottom-width"] = "1";
	        this.cfgData.style["border-left-color"] = this.cfgData.style["border-right-color"] = this.cfgData.style["border-top-color"] = this.cfgData.style["border-bottom-color"] = "#808080";

	        this.callSuper(options, parent);
	    },
	    appendChild: function (frmControl) {
	        frmControl && this.heContent.appendChild(frmControl.heControl);
	    },
	    contains: function (control) {
	        var node = this.data;
	        cNode = control.data;
	        return node.contains(cNode);
	    },
	    writeBeginTag: function () {
	        var sb = new StringBuilder();
	        sb.append("<div");
	        sb.append(this.getProps());
	        sb.append(">");
	        return sb.serialize();
	    },
	    writeContent: function () { },
	    writeEndTag: function () {
	        return "　</div>";
	    }
	}),
	FormDateTime = $C.Create(FormControl, {
	    initialize: function (options, parent) {
	        options.type = "datetime";
	        options.sControl = '<input type="text" class="Wdate" style="width:99%;height:99%;padding:0px;margin:0px;"> </input>';
	        this.callSuper(options, parent);
	        var loadType = false;
	    },
	    writeBeginTag: function () {
	        var sb = new StringBuilder();
	        sb.append('<input type="text" class="Wdate"');
	        for (var attr in this.cfgData) { }
	        sb.append("/>");
	        return sb.serialize();
	    },
	    writeContent: function () { },
	    writeEndTag: function () { },
	    serialize: function () {
	        if (this.getProps().indexOf("class=\"Wdate\"") >= 0) {
	            return ("<input " + this.getProps() + "/>");
	        } else {
	            return ("<input class=\"Wdate\""
						 + this.getProps() + "/>");
	        }
	    }
	}),
	FormUpload = $C.Create(FormControl, {
	    initialize: function (options, parent) {
	        options.type = "upload";
	        options.sControl = '<div style="border: 1px solid;width:100%;height:100%;"><input type="button" value="添加附件"/></div>';
	        this.callSuper(options, parent);
	        if (!this.cfgData.FileCountLimit) {
	            this.cfgData.FileCountLimit = "1";
	        }
	        if (!this.cfgData.FileLength) {
	            this.cfgData.FileLength = "10";
	        }
	        if (!this.cfgData.AttachTable) {
	            this.cfgData.AttachTable = "f_attachment";
	        }
	    },
	    setOptions: function (options) { },
	    writeBeginTag: function () { },
	    writeContent: function () { },
	    writeEndTag: function () { },
	    setValue: function () {
	        var attacs = this.cfgData.value;
	        if (attacs) {
	            var stateType = this.cfgData.ControlStateType,
					attach;
	            for (var i = attachs.length - 1; i >= 0; i--) {
	                attach = new Attachment();
	                attach.id = attachs[i]["DbId"];
	                attach.serverpath = attacs[i]["ServicePathName"];
	                attach.filename = attacs[i]["FileName"];
	                attach.fileext = attacs[i]["Extension"];
	                attach.isin = attacs[i]["IsIn"];
	                AddFileToControl(this.heContent, attach, stateType);
	            }
	        }
	    },
	    getValue: function () {
	        var heChildren = this.heContent.children,
				sb;
	        if (heChildren[1]) {
	            var hrRows = heChildren.rows,
					oTr;
	            for (var k = hrRows.length - 1; k >= 0; k--) {
	                oTr = hrRows[k],
						sb = new StringBuilder();
	                sb.append("{DbId: '"
							 + oTr.getAttribute("AttachId")
							 + "', ServicePathName:'"
							 + oTr.getAttribute("oTr.AttachServerPath")
							 + "', FileName: '"
							 + oTr.getAttribute("oTr.AttachName")
							 + "', Extension: '"
							 + oTr.getAttribute("oTr.AttachExt")
							 + "'},");
	            }
	        }
	        return sb && sb.serialize() ? sb.serialize().substring(0, sb.serialize().length - 1) : "";
	    },
	    serialize: function () {
	        this.cfgData.style.border = "1px solid";
	        this.cfgData.style["text-align"] = "left";
	        return "<div " + this.getProps() + ">　</div>";
	    }
	}),
	FormWebGrid = $C.Create(FormControl, {
	    initialize: function (options, parent) {
	        options.type = "webgrid";
	        options.sControl = '<table style="border: 1px solid;width:100%;height:100%;"><tr><td align="center">列表控件</td></tr></table>';
	        this.callSuper(options, parent);
	        this.cfgData.rowsnum = "10,20,30";
	    },
	    setOptions: function (options) { },
	    writeBeginTag: function () { },
	    writeContent: function () { },
	    writeEndTag: function () { },
	    serialize: function () {
	        var cfgdata = this.cfgData,
				colsData = cfgdata.TableColumnData,
				column,
				colStr = "<columns>",
				colName,
				colType,
				valName,
				colNames = "[",
				modelStr = "[",
				model = "",
				sortcols = [],
				funccols = [],
				paras,
				para,
				p,
				plen,
				iCols = 0,
				timecols = [],
				columns = eval("" + colsData + "").sort(function (a, b) {
				    return a["ColumnIndex"] - b["ColumnIndex"];
				});
	        cfgdata.hascheckboxcol == "1" && (funccols.push(cfgdata.cboxcolname), iCols++);
	        cfgdata.hasserialnum == "1" && iCols++;
	        for (var i = 0, len = columns.length || 0; i < len; i++) {
	            column = columns[i],
					colName = column["ColumnName"],
					valName = column["ColumnFieldValue"],
					colType = column["ColumnType"],
					colParas = column["Columnqfuncpara"];
	            valName != "null" && sortcols.push(valName);
	            colStr += "<column DataSourceType='' DataMode='' DataSet='" + column["ColumnDataSet"]
					 + "' DataTable='" + column["ColumnDataTable"]
					 + "' ValueColumn='" + valName + "' />";
	            colNames += (colNames != "[" ? ",'" + colName + "'" : "'" + colName + "'");
	            if (column["ColumnIsQ"] == "query") {
	                if (colParas) {
	                    paras = colParas.split(";");
	                    for (p = 0, plen = paras.length; p < plen; p++) {
	                        para = paras[p].split(",");
	                        (para[1] == 1 || para[1] == 2) && funccols.push(para[0]);
	                    }
	                }
	                model = "{name:'" + valName
							 + "',index:'" + valName
							 + "',width:" + column["ColumnWidth"] + ""
							 + (column["ColumnColumnSort"] == "int" ? ",sorttype:'int'" : "")
							 + ",align:'center',Columnbtname:'" + column["Columnbtname"] + "'"
							 + ",funcpara:'" + colParas + "'"
							 + ",Columnqfunc:'" + column["Columnqfunc"] + "'"
							 + (colType == "te" ? ",edittype:'text'" : (colType == "bt" ? ",edittype:'button',sortable:false" : (colType == "a" ? ",edittype:'a',sortable:false" : ""))) + "}";
	            } else {
	                model = "{name:'" + valName
							 + "',index:'" + valName
							 + "',width:" + column["ColumnWidth"] + ""
							 + (column["ColumnColumnSort"] == "int" ? ",sorttype:'int'" : "")
							 + ",align:'center',editable:" + (colType == "ro" ? false : true) + ""
							 + (column["DataSourceType"] == "1" ? ",editoptions:{value:'" + column["TextDataSource"] + "'}" : "") + ""
							 + (colType == "txt" ? ",edittype:'textarea'" : (colType == "coro" ? ",edittype:'select'" : "")) + "}";
	                (colType == "date" || colType == "time") && timecols.push(iCols + i + "," + colType);
	            }
	            modelStr += modelStr != "[" ? "," + model : model;
	        }
	        colStr += "</columns>",
				colNames += "]",
				modelStr += "]";
	        if (columns[0]["ColumnIsQ"] == "query") {
	            return '<table cid="' + this.cid
					 + '" hascheckboxcol="' + (cfgdata.hascheckboxcol)
					 + '" queryname="' + cfgdata.queryname
					 + '" hasserialnum="' + (cfgdata.hasserialnum)
					 + '" ispager="' + (cfgdata.ispager)
					 + '" cboxcolname="' + cfgdata.cboxcolname
					 + '" deltablename="' + cfgdata.deltablename
					 + '" delcolname="' + cfgdata.delcolname
					 + '" rowsnum="' + cfgdata.rowsnum
					 + '" cascadeparas="' + cfgdata.cascadeparas
					 + '" dataSetid="' + (columns.length ? columns[0]["ColumnDataSet"] : "")
					 + '" type="' + this.type + '"  '
					 + this.getStyle()
					 + ' colNames = "' + colNames
					 + '" colModel = "' + modelStr
					 + '" sortcols = "' + (sortcols.toString() + ";" + (function () {
					     var colsArr = funccols,
							_colsArr = funccols.concat().sort();
					     _colsArr.sort(function (a, b) {
					         if (a == b) {
					             colsArr.splice(colsArr.indexOf(a), 1);
					         }
					     });
					     return colsArr.toString();
					 })())
					 + '" TableColumnData = "' + colsData.replace(/"/g, "'") + '"> </table>';
	        } else {
	            return '<table cid="' + this.cid
					 + '" hascheckboxcol="' + (cfgdata.hascheckboxcol)
					 + '" hasserialnum="' + (cfgdata.hasserialnum)
					 + '" type="' + this.type
					 + '" columns="' + escape(colStr) + '"  '
					 + this.getStyle()
					 + ' colNames = "' + colNames
					 + '" timecols = "' + timecols.join(";")
					 + '" colModel = "' + modelStr
					 + '" TableColumnData = "' + colsData.replace(/"/g, "'") + '"> </table>';
	        }
	    }
	}),
	FormTable = $C.Create(FormControl, {
	    initialize: function (options, parent) {
	        if (options.rect.nodeType) {
	            var xnControl = this.xnControl = options.rect,
					str = options.rect.getAttribute("options");
	            xnControl.setAttribute("options", xnControl.getAttribute("style"));
	            xnControl.setAttribute("style", str);
	        }
	        var bDrag = options.drag;
	        options.drag = false;
	        options.zIndex = 200;
	        options.sControl = '<div style="position:absolute;border:1px solid gray;width:100%;height:100%;padding:0px;margin:0px;"></div>';
	        this.callSuper(options, parent);
	        this.grid = new Grid({
	            container: this.heContent,
	            lhW: 12,
	            thH: 12,
	            drag: true,
	            overShow: true,
	            name: this.cid,
	            toolbar: true,
	            cm: true,
	            sheets: [{
	                id: "sheet0",
	                tdWidth: 170,
	                trHeight: 35,
	                row: 3,
	                col: 3,
	                active: 1,
	                xnSheet: this.xnControl ? this.xnControl.selectSingleNode("table") : null
	            }
						]
	        }, this);
	        this.heTable = this.grid.getActiveSheet().mainTable.DOM["table"];
	        bDrag !== false && (this.drag = new Drag(this.heControl, {
	            Handle: this.grid.heDivLeftTop,
	            mxContainer: this.mxContainer,
	            Limit: true,
	            drops: this.drops,
	            onDrop: F.bind(this, this.onDrop),
	            onStart: F.bind(this, this.onStart),
	            onStop: F.bind(this, this.onStop)
	        }));
	    },
	    appendChild: function (frmControl, heTd) {
	        if (heTd) {
	            if (ET.getStyle(heTd, "position") != "relative") {
	                heTd.style.position = "relative";
	                heTd.style.overflow = "";
	            }
	            heTd.appendChild(frmControl.heControl);
	        }
	    },
	    refreshRect: function () {
	        this.rect = ET.getRect(this.heTable);
	        return this.rect;
	    },
	    contains: function (control) {
	        var node = this.data;
	        cNode = control.data;
	        return node.contains(cNode);
	    },
	    createGrid: function (sControl, rect, heContainer, zIndex) {
	        var sControl = '',
				heControl = document.createElement("div");
	        tabItem.data = new Grid({
	            container: heContainer,
	            xnSheet: xnSheet,
	            name: tempName,
	            toolBarContainer: this.heToolBar,
	            toolBoxContainer: this.heFrmToolBox,
	            heTemplate: heTemplate
	        }, this);
	        $ET.setCSS(heControl, {
	            position: "absolute",
	            left: rect.left + "px",
	            top: rect.top + "px",
	            width: rect.width + "px",
	            height: rect.height + "px",
	            zIndex: 300
	        });
	        $E.on(heControl, "click", this.click, this);
	        return heControl;
	    },
	    serialize: function () {
	        alert(11);
	    },
	    writeBeginTag: function () { },
	    writeContent: function () { },
	    writeEndTag: function () { },
	    onResize: function () {
	        this.grid.resize();
	    }
	}),
	FormIframe = $C.Create(FormControl, {
	    initialize: function (options, parent) {
	        options.type = "iframe";
	        options.zIndex = 200;
	        options.sControl = '<iframe style="width:99%;height:99%;padding:0px;margin:0px;">　</iframe>';
	        this.callSuper(options, parent);
	    },
	    writeBeginTag: function () {
	        var sb = new StringBuilder();
	        sb.append("<iframe");
	        sb.append(this.getProps());
	        sb.append(">");
	        return sb.serialize();
	    },
	    writeContent: function () { },
	    writeEndTag: function () {
	        return "　</iframe>";
	    },
	    serialize: function () {
	        return ("<iframe " + this.getProps() + ">　</iframe>");
	    }
	}),
	FormTab = $C.Create(FormControl, {
	    initialize: function (options, parent) {
	        options.zIndex = 200;
	        options.sControl = '<div style="position:relative;border:1px solid gray;width:100%;height:100%;padding:0px;margin:0px;"><div><ul class="nav"></ul></div><div></div></div>';
	        this.callSuper(options, parent);
	        this.tab = new Tab({
	            navs: this.heContent.firstChild,
	            navsSize: 20,
	            panelType: "3",
	            panels: this.heContent.lastChild,
	            layout: "T",
	            collapse: false,
	            active: 0,
	            toggle: "click",
	            onBeforeToggle: F.bind(this, function () { }),
	            onAfterToggle: F.bind(this, function () { }),
	            target: this.heContent,
	            container: null
	        });
	        this.tab.hePanels.setAttribute("data-cid", this.cid);
	        this.tab.heNavs.style.zIndex = 110;
	    },
	    getItemNames: function () {
	        return this.cfgData["tabItemName"] ? this.cfgData["tabItemName"].split(",") : [];
	    },
	    addItems: function (itemNames) {
	        itemNames || (itemNames = this.getItemNames());
	        var i = 0,
				len = itemNames.length;
	        while (i < len) {
	            this.addItem(itemNames[i++], "");
	        }
	    },
	    addItem: function (sName, panel) {
	        for (var i = 0; i < this.tab.tabItems.length; i++) {
	            if (this.tab.tabItems[i].name == sName) {
	                alert("已经存在改项了!");
	                return fase;
	            }
	        }
	        var FormTabItem = this.tab.add(sName, panel),
				mainTable = this.parent;
	        FormTabItem.name = sName;
	        FormTabItem.type = "TabItem";

	        FormTabItem.data = mainTable.addControlToTree(FormTabItem, this);
	        // this.cfgData["tabItemName"] = item;
	    },
	    getItem: function (panel) {
	        return this.tab.getItem(panel);
	    },
	    delItem: function (index) {
	        var FormTabItem = this.tab.tabItems[index];
	        this.parent.remveControl(FormTabItem);
	        this.tab.delTab(FormTabItem);
	    },
	    remove: function (index) {
	        if (index) { // 有索引值 则删tabItem 否则删tab
	            this.tab.delTab(index);
	        } else {
	            this.data.remove();
	            this.dispose();
	        }
	    },
	    dispose: function () {
	        this.heControl.parentNode.removeChild(this.heControl);
	        this.heControl = null;
	        this.heContent = null;
	        this.rlContainer && (this.rlContainer = null);
	        /*
	        * 释放拖拽 缩放的交互绑定 this.resize.unbind(); this.drag.unbind();
	        */
	    },
	    contains: function (control) {
	        var node = this.data;
	        cNode = control.data;
	        return node.contains(cNode);
	    },
	    onResize: function (helper) {
	        this.callSuper(helper);
	        this.tab.hePanels.style.height = helper.cur.height - this.tab.heNavs.offsetHeight + "px";
	    },
	    refreshRect: function () {
	        var hSize = this.tab.getHeadSize();
	        this.rect = ET.getRect(this.heContent);
	        this.rect.top = this.rect.top + hSize.height;
	        this.rect.height = this.rect.height - hSize.height;

	        return this.rect;
	    },
	    appendChild: function (frmControl, heTd) {
	        frmControl && this.tab.activeTab.panel.appendChild(frmControl.heControl);
	    },
	    writeBeginTag: function () {
	        var item = "",
				len = this.tab.tabItems.length,
				i = 0;
	        if (i < len) {
	            while (true) {
	                item += this.tab.tabItems[i++].name;
	                if (i < len) {
	                    item += ",";
	                } else {
	                    break;
	                }
	            }
	        }
	        this.cfgData["tabItemName"] = item;

	        var sb = new StringBuilder();
	        sb.append("<div");
	        sb.append(this.getProps());
	        sb.append(">");
	        return sb.serialize();
	    },
	    writeContent: function () { },
	    writeEndTag: function () {
	        return "　</div>";
	    }
	}),
	FormCountersign = $C.Create(FormControl, {
	    initialize: function (options, parent) {
	        options.type = "countersign";
	        options.sControl = '<div style="font-family:宋体;font-size: 12px;width:99%;height:99%;padding:0px;margin:0px;border: #90a5c2 1px solid;overflow:auto;">'
					 + '  <table style="width: 100%; border-collapse: collapse; table-layout: fixed; height: 76px; font-size: 13px" border="0" cellspacing="0" cellpadding="0">'
					 + '   <tbody>'
					 + '   <tr>'
					 + '    <td style="border-bottom: #90a5c2 1px solid">'
					 + '     <textarea style="width: 100%; height: 100%">    </textarea>'
					 + '    </td>'
					 + '    <td style="width:40px;text-align:right;" valign="center">'
					 + '     <img src="http://172.16.24.18/frameworkpage-3.0.1-dlgl/application/formrun/skins/blue/images/words.jpg"/>'
					 + '    </td>'
					 + '   </tr>'
					 + '   </tbody>'
					 + '  </table>'
					 + '  <table style="border-left: #ededed 1px solid; width: 100%; border-collapse: collapse; table-layout: fixed; font-size: 13px; border-top: #ededed 1px solid" border="1" cellspacing="0" cellpadding="0">'
					 + '   <tbody>'
					 + '   <tr name="3371" content="同意" trtype="countersigninfo">'
					 + '    <td style="border-bottom: #ededed 1px solid; border-left: 0px; border-top: 0px; border-right: #ededed 1px solid" valign="top" colspan="2" align="left">'
					 + '     <div style="width: 99%; text-overflow: ellipsis; overflow: hidden" title="同意">审核意见：同意</div>'
					 + '    </td>'
					 + '   </tr>'
					 + '   <tr workflownodename="XX节点">'
					 + '    <td style="border-bottom: #ededed 1px solid; border-left: 0px; border-top: 0px; border-right: #ededed 1px solid" valign="center" align="left">处理节点：XX节点</td>'
					 + '   </tr>'
					 + '   <tr userid="" username="XX" time="2012-01-01 00:00:00">'
					 + '    <td style="border-bottom: #ededed 1px solid; border-left: 0px; border-top: 0px; border-right: #ededed 1px solid" valign="center" align="right">审批人:XX</td>'
					 + '    <td style="border-bottom: #ededed 1px solid; border-left: 0px; width: 218px; border-top: 0px" valign="center" align="middle">审批时间:2012-01-01 00:00:00</td>'
					 + '   </tr>'
					 + '   </tbody>'
					 + '  </table>'
					 + '</div>';
	        this.callSuper(options, parent);
	    },
	    serialize: function () {
	        return ('<div ' + this.getProps() + ' >'
					 + '  <table style="width: 100%; border-collapse: collapse; table-layout: fixed; height: 76px; font-size: 13px" border="0" cellspacing="0" cellpadding="0">'
					 + '   <tbody>'
					 + '   <tr>'
					 + '    <td style="border-bottom: #90a5c2 1px solid">'
					 + '     <textarea style="width: 100%; height: 100%">    </textarea>'
					 + '    </td>'
					 + '    <td style="width:40px;text-align:right;" valign="center">'
					 + '     <img src="http://172.16.24.18/frameworkpage-3.0.1-dlgl/application/formrun/skins/blue/images/words.jpg"/>'
					 + '    </td>'
					 + '   </tr>'
					 + '   </tbody>'
					 + '  </table>'
					 + '  <table style="border-left: #ededed 1px solid; width: 100%; border-collapse: collapse; table-layout: fixed; font-size: 13px; border-top: #ededed 1px solid" border="1" cellspacing="0" cellpadding="0">'
					 + '   <tbody>'
					 + '   <tr name="3371" content="同意" trtype="countersigninfo">'
					 + '    <td style="border-bottom: #ededed 1px solid; border-left: 0px; border-top: 0px; border-right: #ededed 1px solid" valign="top" colspan="2" align="left">'
					 + '     <div style="width: 99%; text-overflow: ellipsis; overflow: hidden" title="同意">审核意见：同意</div>'
					 + '    </td>'
					 + '   </tr>'
					 + '   <tr workflownodename="XX节点">'
					 + '    <td style="border-bottom: #ededed 1px solid; border-left: 0px; border-top: 0px; border-right: #ededed 1px solid" valign="center" align="left">处理节点：XX节点</td>'
					 + '   </tr>'
					 + '   <tr userid="" username="XX" time="2012-01-01 00:00:00">'
					 + '    <td style="border-bottom: #ededed 1px solid; border-left: 0px; border-top: 0px; border-right: #ededed 1px solid" valign="center" align="right">审批人:XX</td>'
					 + '    <td style="border-bottom: #ededed 1px solid; border-left: 0px; width: 218px; border-top: 0px" valign="center" align="middle">审批时间:2012-01-01 00:00:00</td>'
					 + '   </tr>'
					 + '   </tbody>'
					 + '  </table>'
					 + '</div>');
	    }
	}),
	MainTable = $C.Create({
	    initialize: function (options, pSheet) {
	        this.prefix = "control";
	        this.heSheetContainer = pSheet.DOM["sheetContainer"];
	        this.scid = 0;
	        this.activeControl = [];
	        this.controls = {
	            "form": {
	                constructor: FormDiv,
	                CM: null
	            },
	            "querylist": {
	                constructor: FormDiv,
	                CM: null
	            },
	            "a": {
	                constructor: FormAnchor
	            },
	            "text": {
	                constructor: FormText
	            },
	            "textarea": {
	                constructor: FormTextArea
	            },
	            "richeditor": {
	                constructor: FormTextArea
	            },
	            "button": {
	                constructor: FormButton
	            },
	            "label": {
	                constructor: FormLabel
	            },
	            "combobox": {
	                constructor: FormSelect
	            },
	            "checkbox": {
	                constructor: FormCheckbox
	            },
	            "checkboxlist": {
	                constructor: FormCheckboxList
	            },
	            "radio": {
	                constructor: FormRadio
	            },
	            "img": {
	                constructor: FormImg
	            },
	            "datetime": {
	                constructor: FormDateTime
	            },
	            "div": {
	                constructor: FormDiv
	            },
	            "upload": {
	                constructor: FormUpload
	            },
	            "webgrid": {
	                constructor: FormWebGrid
	            },
	            "table": {
	                constructor: FormTable
	            },
	            "td": {
	                constructor: FormTable
	            },
	            "iframe": {
	                constructor: FormIframe
	            },
	            "tab": {
	                constructor: FormTab
	            },
	            "tabItem": {
	                constructor: FormTab
	            },
	            "countersign": {
	                constructor: FormCountersign
	            }
	        };
	        this.pSheet = pSheet;
	        this.pDesign = pSheet.pGrid;
	        this.attrPage = this.pDesign.attrPage;
	        this.structTree = new StructTree({
	            container: this.pDesign.structTreePanel.heContent,
	            roots: [{
	                id: "0",
	                text: "表单",
	                childNodes: null
	            }
						]
	        }, this);
	        var root = this.structTree.tree.root.childNodes[0],
				frmContainer = root.data = this.frmContainer = new FormDiv({
				    cid: -1,
				    name: "表单",
				    type: "div",
				    heControl: this.heSheetContainer,
				    drops: null,
				    data: root,
				    resize: false,
				    drag: false
				}, this);
	        this.container = [frmContainer];
	        this.container[frmContainer.cid] = frmContainer;
	        var mainView = this.pDesign.mainView,
				    index = this.pDesign.cSheetsName.indexOf("."),
				    result = this.pDesign.cSheetsName.substring(index + 1);

	        if (options.xnSheet) {
	            if (options.xnSheet.selectSingleNode("div").childNodes[0].getAttribute("name") == "可视内容区") {
	                this.editArea = this.drawControl(st, {
	                    name: "editArea",
	                    text: "编辑内容区",
	                    style: {
	                        top: "-1px",
	                        left: "-1px",
	                        width: options.width || mainView.width * 2 + "px",
	                        height: options.height || mainView.height * 2 + "px",
	                        overflow: "hidden",
	                        border: "1px solid black"
	                    },
	                    action: "no"
	                }, frmContainer.heControl);
	                var visiCid = options.xnSheet.selectSingleNode("div").childNodes[0].getAttribute("cid");
	                if (visiCid.indexOf(st) >= 0) {
	                    options.xnSheet.selectSingleNode("div").childNodes[0].setAttribute("cid", this.getClientId(st));
	                }
	                this.drawControls(options.xnSheet.selectSingleNode("div").childNodes, this.editArea);

	            } else {
	                this.drawControls(options.xnSheet.selectSingleNode("div").childNodes, frmContainer);
	                for (var i = 0, len = this.container.length; i < len; i++) {
	                    if (this.container[i].cfgData.name == "编辑内容区") {
	                        this.editArea = this.container[i];
	                        return;
	                    }
	                }
	            }
	        } else {
	            this.editArea = this.drawControl("div", {
	                name: "editArea",
	                text: "编辑内容区",
	                style: {
	                    top: "-1px",
	                    left: "-1px",
	                    width: options.width || mainView.width * 2 + "px",
	                    height: options.height || mainView.height * 2 + "px",
                        overflow: "hidden",
	                    border: "1px solid black"
	                },
	                action: "no"
	            }, frmContainer.heControl);
	            this.visiArea = this.drawControl("div", {
	                name: "visiArea",
	                text: "可视内容区",
	                style: {
	                    top: "0px",
	                    left: "0px",
	                    width: options.width || mainView.width * .95 + "px",
	                    height: options.height || mainView.height * .95 + "px",
	                    border: "1px solid blue"
	                }
	            }, this.editArea.heControl);
	            this.visiArea.cfgData["formid"] = options.id;
	            this.visiArea.cfgData["formname"] = options.name;
	        }
	    },
	    setOptions: function (options) { },
	    getEditArea: function () {
	        return this.editArea.heControl;
	    },
	    getClientId: function (sType) {
	        return (sType || this.prefix) + this.scid++;
	    },
	    show: function () {
	        this.heSheetContainer.style.display = "";
	        this.structTree.show();
	    },
	    highlight: function (node, mutliply) {
	        this.structTree.tree.highlight(node, mutliply);
	    },
	    hide: function () {
	        this.heSheetContainer.style.display = "none";
	        this.structTree.hide();
	    },
	    getControl: function (cid, sType) {
	        var controls = this.container;
	        sType && (controls = this.controls[sType = sType.toLowerCase()]);
	        return controls[cid];
	    },
	    drawControls: function (xnlControl, pControl, heBox) {
	        var control, xnControl;

	        for (var i = 0, len = xnlControl.length; i < len; i++) {
	            xnControl = xnlControl[i];
	            if (xnlControl[i].nodeType == 1) {
	                control = this.drawControl(xnControl.getAttribute("type"), xnControl, pControl.heControl, heBox);
	                switch (xnControl.getAttribute("type")) {
	                    case "div":
	                        {
	                            this.drawControls(xnControl.childNodes, control);
	                            break;
	                        }
	                    case "table":
	                        {
	                            var oTable = control.heTable,
								    tBody = oTable.tBodies[0],
								    childControl,
								    oTr,
								    oTd,
								    n,
								    a = [],
								    xnlTr = xnControl.selectNodes("table/tbody/tr"),
								    xnTd;
	                            for (var r = 0, iRLen = tBody.rows.length; r < iRLen; r++) {
	                                oTr = tBody.rows[r],
									xnTr = xnlTr[r],
									xnTd = xnTr.firstChild;
	                                for (var j = 0, iCLen = oTr.cells.length; j < iCLen; j++) {
	                                    oTd = oTr.cells[j];
	                                    while (xnTd.nodeType != 1) {
	                                        xnTd = xnTd.nextSibling;
	                                    }
	                                    oTd.innerHTML = "";
	                                    this.drawControls(xnTd.childNodes, control, oTd);
	                                    xnTd = xnTd.nextSibling;
	                                }
	                            }
	                            break;
	                        }
	                    case "tab":
	                        {
	                            var tab = control.tab,
								tabItem,
								j,
								xnlPanel = xnControl.selectNodes("./div[@class='panels']/div");
	                            control.addItems();
	                            for (j = 0, iLen = xnlPanel.length; j < iLen; j++) {
	                                this.drawControls(xnlPanel[j].childNodes, control, tab.tabItems[j].panel);
	                            }
	                            break;
	                        }
	                    default:
	                        break;
	                }
	            }
	        }
	    },
	    drawControl: function (sType, rect, heControl, heBox, sloadType) {
	        var pControl = heControl,
				control,
				cb = this.controls[sType = sType.toLowerCase()],
				i,
				container;
	        if (pControl.nodeType) {
	            pControl = this.getControl(pControl.getAttribute("data-cid"));
	        } else if (!(pControl instanceof FormControl)) {
	            throw "非表单控件!";
	        }
	        if (cb) {
	            var cid;
	            switch (pControl.type) {
	                case "tab":
	                    {
	                        if (heBox.nodeType) {
	                            container = heBox;
	                            pControl = pControl.getItem(heBox);
	                        } else if (Tab.isTabItem(heBox)) {
	                            container = heBox.panel;
	                            pControl = heBox;
	                        } else {
	                            throw "参数错误！";
	                        }

	                        break;
	                    }
	                case "table":
	                    {
	                        container = heBox;
	                        break;
	                    }
	                default:
	                    {
	                        container = pControl.heContent;
	                        break;
	                    }
	            }
	            if (rect.nodeType) {
	                this.scid++;
	                cid = rect.getAttribute("cid");
	            } else if (rect.cid != undefined) {
	                this.scid++;
	                cid = rect.cid;
	            } else {
	                cid = this.getClientId(sType);
	            }

	            control = new cb.constructor({
	                cid: cid,
	                name: rect.name || cid,
	                type: sType,
	                rect: rect,
	                drops: null,
	                data: null,
	                container: container,
	                mxContainer: this.heSheetContainer,
	                src: "Form/attribute/" + sType + ".htm",
	                loadType: sloadType
	            }, this);
	            cb[cid] = control;
	            control.data = this.addControlToTree(control, pControl);
	            return control;
	        }
	    },
	    addControlToTree: function (control, pControl) {
	        var node = control.data;
	        typeof pControl == "string" && (pControl = this.getControl(pControl));
	        if (Tree.isNode(node)) {
	            if (node.pNode == pControl.data) {
	                return;
	            }
	            pControl.data.appendChild(node);
	        } else {
	            //var elem = control.heControl,
	            //text = elem.id ? elem.id : elem.firstChild.nodeName == "INPUT" ? elem.firstChild.type : elem.firstChild.nodeName;
	            var info = control.name || control.cid;
	            node = this.structTree.insert({
	                text: info,
	                tips: info,
	                data: control,
	                imgSrc: "Form/imgs/" + control.type.toLowerCase() + "_small.png"
	            }, pControl.data || this.frmNode);
	            this.structTree.tree.highlight(node, false);
	        }

	        if (pControl.type == "TabItem") {
	            pControl = pControl.data.pNode.data;
	        }
	        (control.type == "div" || control.type == "table" || control.type == "tab") && this.addDrops(control, pControl);
	        return node;
	    },
	    addDrops: function (control, pControl) {
	        var a = [],
				existPos,
				insertPos = -1,
				i;
	        if (!this.container[control.cid]) {
	            this.container[control.cid] = control;
	            for (i = 0; i < this.container.length; ) {
	                temp = this.container[i];
	                if (temp.data.pNode.data == pControl || temp == pControl) {
	                    insertPos = i;
	                    break;
	                }
	                i++;
	            }
	            this.container.splice(insertPos, 0, control);
	        } else {
	            for (i = 0; i < this.container.length; ) {
	                temp = this.container[i];
	                if (control == temp) {
	                    existPos = i;
	                } else if (temp.data.pNode.data == pControl || temp == pControl) {
	                    insertPos >= 0 || (insertPos = i);
	                }
	                i++;
	            }
	            if (insertPos > existPos) {
	                for (i = existPos; i > -1; i--) {
	                    temp = this.container[i];
	                    if (control.contains(temp) || control == temp) {
	                        this.container.splice(insertPos--, 0, temp);
	                        this.container.splice(i, 1);
	                    } else {
	                        break;
	                    }
	                }
	            } else {
	                while (true) {
	                    temp = this.container[existPos];

	                    if (control.contains(temp) || control == temp) {
	                        this.container.splice(insertPos, 0, temp);
	                        this.container.splice(existPos + 1, 1);
	                    } else {
	                        break;
	                    }

	                }
	            }
	        }
	    },
	    getContainer: function () {
	        var a = [],
				control,
				heTable;
	        for (var i = 0; i < this.container.length; i++) {
	            control = this.container[i];
	            switch (control.type) {
	                case "table":
	                    {
	                        control.heTable.setAttribute("data-cid", control.cid);
	                        a.push({
	                            he: control.heTable,
	                            rect: control.refreshRect(),
	                            type: control.type,
	                            CW: control.grid.mainView.width,
	                            CH: control.grid.mainView.height
	                        });
	                        break;
	                    }
	                case "tab":
	                    {
	                        a.push({
	                            he: control.heControl,
	                            rect: control.refreshRect(),
	                            type: control.type
	                        });
	                        break;
	                    }
	                default:
	                    {
	                        a.push({
	                            he: control.heControl,
	                            rect: control.refreshRect(),
	                            type: control.type
	                        });
	                    }
	            }
	        }
	        return a;
	    },
	    location: (function () {
	        var preControl = null,
				oAttPagePro = {
				    border: "0",
				    scrolling: "no",
				    autoSize: false,
				    height: "100%",
				    width: "100%",
				    data: null
				};

	        return function (control) {
	            if (control == preControl) {
	                return;

	            }
	            preControl = control;
	            if ("webgrid" == control.type) {
	                if (control.src.indexOf("?") == "-1") {
	                    control.src += ("list" == this.pDesign.cSheetsName.split(".")[1]) ? ("?type=query") : ("?type=form");
	                }
	            }
	            oAttPagePro.data = [control, this.pSheet.datasource ? this.pSheet.datasource[0] : null];
	            this.attrPage.location(control.src, oAttPagePro);
	        };
	    })(),
	    hideTree: function () {
	        this.structTree && (this.structTree.container.style.display = "none");
	    },
	    showTree: function () {
	        this.structTree && (this.structTree.container.style.display = "");
	    },
	    removeControl: function (control) {
	        var sType = control.type,
				cb = this.controls[sType = sType.toLowerCase()];
	        switch (control.type) {
	            case "table":
	                {
	                    break;
	                }
	            case "tab":
	                {
	                    var tab = control.tab,
						node,
						i;
	                    for (i = 0, iLen = tab.tabItems.length; i < iLen; i++) {
	                        this.removeControl(tab.tabItems[i]);
	                    }

	                    // control.remove(); //设计器中 删除
	                    // 关系移除
	                    delete this.container[control.cid]; // 从容器中删除

	                    delete cb[control.cid]; // 从控件集合中删除
	                    break;
	                }
	            case "tabItem":
	                {
	                    var node = control.data,
						tab = node.data.PNode.data;
	                    for (var i = 0, len = node.childNodes.length; i < len; i++) {
	                        this.removeControl(node.childNodes[i]);
	                    }
	                    tab.remove(control);
	                }
	            case "div":
	                {
	                    var node = control.data;
	                    for (var i = 0, len = node.childNodes.length; i < len; i++) {
	                        this.removeControl(node.childNodes[i]);
	                    }
	                    // control.remove(); //树节点删除
	                    delete this.container[control.cid]; // 从容器中删除
	                    // control.data=null;
	                    delete cb[control.cid]; // 从控件集合中删除
	                    break;
	                }
	            default:
	                {
	                    // control.remove();
	                    // control.data=null;
	                    delete cb[control.cid];
	                    break;
	                }
	        }
	    },
	    serialize: function () {
	        var mainTable = this,
				traverse = function (node) {
				    var sb,
					control = node.data;
				    if (!control) {
				        return "";
				    }
				    sb = new StringBuilder();
				    switch (control.type) {
				        case "div":
				            {
				                sb.append(control.writeBeginTag());
				                for (var i = 0, len = node.childNodes.length; i < len; i++) {
				                    sb.append(traverse(node.childNodes[i]));
				                }
				                sb.append(control.writeEndTag());
				                break;
				            }
				        case "table":
				            {
				                var heControl = control.heControl,
							oTable = control.heTable,
							mainView = control.grid.mainView,
							iTop,
							ileft,
							pos,
							sDiv,
							childControl,
							sThead = "",
							sTrs = new StringBuilder(),
							i = 0;
				                if (heControl.style.position == "absolute") {
				                    pos = ET.position(oTable, heControl);
				                    iTop = parseInt(heControl.style.top) + pos.top;
				                    ileft = parseInt(heControl.style.left)
									 + pos.left;
				                } else {
				                    pos = ET.position(oTable, heControl.offsetParent);
				                    iTop = pos.top;
				                    ileft = pos.left;
				                }
				                sb.append("<div cid=\"" + control.cid + "\" type=\"" + control.type
								 + "\" style=\"position:absolute;overflow:auto;left:" + ileft + "px;top:" + iTop + "px;width:" + mainView.width + "px;height:" + mainView.height + "px;\"  options=\""
								 + heControl.style.cssText + "\">");
				                if (oTable.tHead) {
				                    sThead = oTable.tHead.outerHTML;
				                    i = oTable.tHead.rows.length;
				                }
				                for (var iRLen = oTable.rows.length; i < iRLen; i++) {
				                    var oTr = oTable.rows[i],
								sTds = new StringBuilder();
				                    for (var j = 0, iCLen = oTr.cells.length; j < iCLen; j++) {
				                        var oTd = oTr.cells[j],
									sChild = "";
				                        if (j == 0) {
				                            if (oTd.style.borderLeftWidth == "") {
				                                oTd.style.borderLeftWidth = "1px";
				                                oTd.style.borderLeftStyle = "solid";
				                                oTd.style.borderLeftColor = "gray";
				                            }
				                        }
				                        for (var k = 0, iLen = oTd.children.length; k < iLen; k++) {
				                            childControl = mainTable.getControl(oTd.children[k].getAttribute("data-cid"), oTd.children[k].getAttribute("type"));
				                            if (childControl) {
				                                sChild += traverse(childControl.data);
				                            }
				                        }
				                        sTds.append(oTd.cloneNode().outerHTML.replace(/(<\/td>$)/, sChild + "$1"));
				                    }
				                    sTrs.append(oTr.cloneNode().outerHTML.replace(/(<\/tr>$)/, sTds.toString() + "$1"));
				                }
				                if (oTable.tHead) {
				                    sThead = oTable.tHead.outerHTML;
				                }
				                if (oTable.tBodies.length > 0) {
				                    sb.append(oTable.cloneNode().outerHTML.replace(/(<\/table>)$/, sThead + "<tbody>"
										 + sTrs.toString() + "</tbody>"
										 + "$1"));
				                } else {
				                    sb.append(oTable.cloneNode().outerHTML.replace(/(<\/table>)$/, sThead
										 + sTrs.toString() + "$1"));
				                }
				                sb.append("</div>");
				                break;
				            }
				        case "tab":
				            {
				                sb.append(control.writeBeginTag());
				                var tab = control.tab,
							node,
							tabItem,
							sPanels = "",
							i,
							j;
				                sb.append(tab.heNavs.outerHTML);
				                for (i = 0, iLen = tab.tabItems.length; i < iLen; i++) {
				                    tabItem = tab.tabItems[i];
				                    node = tabItem.data;
				                    sPanels += '<div style="width:100%;height:100%;" class="panel">';
				                    for (j = 0, len = node.childNodes.length; j < len; j++) {
				                        sPanels += traverse(node.childNodes[j]);
				                    }
				                    sPanels += "</div>";
				                }
				                sb.append(tab.hePanels.cloneNode().outerHTML.replace(/(<\/div>$)/, sPanels + "$1"));
				                sb.append(control.writeEndTag());
				                break;
				            }
				        default:
				            {
				                sb.append(control.serialize());
				                break;
				            }
				    }
				    return sb.serialize();
				};
	        var sb = new StringBuilder(),
				root = this.frmContainer.data;
	        sb.append("<div cid=\"" + this.frmContainer.cid
					 + "\" type=\"" + this.frmContainer.type + "\">");
	        for (var i = 0, len = root.childNodes.length; i < len; i++) {
	            sb.append(traverse(root.childNodes[i]));
	        }
	        sb.append("</div>");
	        return sb.serialize();
	    }
	}),
	FormSheet = $C.Create({
	    include: [moduleSheet],
	    initialize: function (sheet, pSheets) {
	        var sheet = sheet;
	        if ($O.getType(sheet.xnSheet) == "element") {
	            var sDatasource = sheet.xnSheet.selectSingleNode("datasource");
	            sheet.id = sheet.xnSheet.attributes["id"] && sheet.xnSheet.attributes["id"].value;
	            sheet.name = sheet.xnSheet.attributes["name"] && sheet.xnSheet.attributes["name"].value;
	            sheet.dsId = sheet.xnSheet.attributes["dsid"] && sheet.xnSheet.attributes["dsid"].value;
	            sheet.cId = sheet.xnSheet.attributes["cid"] && sheet.xnSheet.attributes["cid"].value;
	            sheet.datasource = sDatasource && this.loadDataSource(sheet.xnSheet);
	        }
	        this.setOptions(sheet || {});
	        this.DOM = {};
	        this.pSheets = pSheets;
	        this.pGrid = pSheets.pGrid;
	        this.pSheets.DOM["sheetsContainer"].insertAdjacentHTML("beforeend", "<div class='sheetPane mpb' style='display:block;"
	        // + (sheet.active == 1 ? "block;" : "none;")
					 + "'></div>");
	        this.DOM["sheetContainer"] = $ET.lastElementChild(this.pSheets.DOM["sheetsContainer"]);
	        this.mainTable = new MainTable(sheet, this);
	        //
	        // if (this.pSheets.length == 0) {
	        this.topTable = new TopTable(sheet, this);
	        this.leftTable = new LeftTable(sheet, this);
	        // } else {
	        // this.topTable = this.pSheets[0].topTable;
	        // this.leftTable = this.pSheets[0].leftTable;
	        // }
	        this.colLine = [];
	        this.rowLine = [];
	        this.active = sheet.active;
	    },
	    setOptions: function (options) {
	        this.id = options.id || "";
	        this.name = options.name || "";
	        this.dsId = options.dsId || "";
	        this.cId = options.cId || this.getClientId();
	        this.tdWidth = options.tdWidth || 49;
	        this.tdBorderWidth = options.tdBorderWidth || 1;
	        this.trHeight = options.trHeight || 49;
	        this.datasource = options.datasource ? [options.datasource, options.datasource.serializeXml()] : null;
	    },
	    clearDsBind: function (sDsName) {
	        var control,
				    controls = this.mainTable.controls,
				    dct = ["text", "textarea"],
				    i = 0,
				    cs;
	        for (; i < dct.length; i++) {
	            cs = controls[dct[i]];
	            for (control in cs) {
	                control.clearDsBind && control.clearDsBind(sDsName);
	            }
	        }
	    },
	    colResize: function () {
	        var heColResize = this.pSheets.DOM["colRL"],
				heContainer = this.DOM["sheetContainer"],
				line = heColResize.cloneNode(true);
	        line.style.display = "block";
	        heContainer.appendChild(line);
	        this.drag.setStart(line);
	    },
	    rowResize: function () {
	        var hResize = {
	            cursor: "row-resize",
	            moveable: false,
	            mainTable: this.mainTable,
	            curTd: null,
	            diffMLY: 0,
	            line: null,
	            lineTop: 0,
	            mouseYInTd: 0,
	            fm: null,
	            fs: null
	        };
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
	    selRow: function () { },
	    selCol: function () { },
	    getCanvas: function () {
	        return this.mainTable.getContainer();
	    },
	    mouseDownHandle: function (evt) { },
	    serialize: function () {
	        var sb = new StringBuilder();
	        sb.append("<sheet dsid=\"" + (this.dsId || "-1")
					 + "\" type=\"" + (/.list$/.test(this.pGrid.cSheetsName) ? "query" : "form")
					 + "\"  id=\"" + this.id + "\" cid=\"" + this.cId + "\" name=\"" + this.name
					 + "\">");
	        sb.append(this.mainTable.serialize());
	        sb.append("<script>");
	        var script = this.pGrid.script;
	        if (this.cId == this.pSheets[0].cId && script.length) {
	            sb.append("<frontend>" + script[0] + "</frontend><backEnd>" + script[1]
						 + "</backEnd><commit>" + script[2] + "</commit><uncommit>" + script[3] + "</uncommit>");
	        } else {
	            sb.append("<frontend/><backEnd/><commit/><uncommit/>");
	        }
	        sb.append("</script>");
	        // sb.append(this.pGrid.datasource ? this.pGrid.datasource[1] :
	        // "<datasource/>");
	        sb.append(this.datasource ? this.datasource[1] : "<datasource/>");
	        sb.append("</sheet>");
	        return sb.serialize();
	    },
	    resize: function () { },
	    show: function () {
	        this.callSuper();
	    },
	    hide: function () {
	        this.callSuper();
	    },
	    loadDataSource: function (xnlSheet) {
	        var oDatasource = new DataSource();
	        if (xnlSheet.nodeType == "1" && xnlSheet.selectNodes(".//dataset")) {
	            for (var z = 0, zLen = xnlSheet.selectNodes(".//dataset").length; z < zLen; z++) {
	                if (xnlSheet.selectNodes(".//dataset")[z].nodeType == "1" && !oDatasource.IsExist(xnlSheet.selectNodes(".//dataset")[z].attributes["id"].value)) {
	                    var oDataset = new DataSet(),
							xDataset = xnlSheet.selectNodes(".//dataset")[z];
	                    oDataset.DbId = xDataset.attributes["id"] && xDataset.attributes["id"].value;
	                    oDataset.Name = xDataset.attributes["name"] && xDataset.attributes["name"].value;
	                    oDataset.Type = xDataset.attributes["type"] && xDataset.attributes["type"].value;
	                    oDataset.MainTable = xDataset.attributes["maintable"] && xDataset.attributes["maintable"].value;
	                    oDataset.ConnString = xDataset.attributes["connstring"] && xDataset.attributes["connstring"].value;
	                    for (var j = 0, cou = xDataset.childNodes.length; j < cou; j++) {
	                        if (xDataset.childNodes[j].nodeType == "1") {
	                            var oDatatable = new DataTable(),
									xDatatable = xDataset.childNodes[j];
	                            oDatatable.ClientId = xDatatable.attributes["cid"] && xDatatable.attributes["cid"].value;
	                            oDatatable.Name = xDatatable.attributes["name"] && xDatatable.attributes["name"].value;
	                            oDatatable.TableName = xDatatable.attributes["tablename"] && xDatatable.attributes["tablename"].value;
	                            oDatatable.IsMain = xDatatable.attributes["ismain"] && xDatatable.attributes["ismain"].value;
	                            oDatatable.ParentDataTableClientId = xDatatable.attributes["parentdtclientid"] && xDatatable.attributes["parentdtclientid"].value;
	                            oDatatable.UniqueIndexColumn = xDatatable.attributes["uniqueindexcolumn"] && xDatatable.attributes["uniqueindexcolumn"].value;
	                            for (var k = 0, count = xDatatable.selectNodes(".//column").length; k < count; k++) {
	                                var oDatacolumn = new DataColumn(),
										xDatacolumn = xDatatable.selectNodes(".//column")[k];
	                                oDatacolumn.Name = xDatacolumn.attributes["name"] && xDatacolumn.attributes["name"].value;
	                                oDatacolumn.ColumnName = xDatacolumn.attributes["columnname"] && xDatacolumn.attributes["columnname"].value;
	                                oDatacolumn.Length = xDatacolumn.attributes.getNamedItem("length") && xDatacolumn.attributes.getNamedItem("length").value;
	                                oDatacolumn.AnotherName = xDatacolumn.attributes["anothername"] && xDatacolumn.attributes["anothername"].value;
	                                oDatacolumn.DataType = xDatacolumn.attributes["datatype"] && xDatacolumn.attributes["datatype"].value;
	                                oDatatable.DataColumns.push(oDatacolumn);
	                            }
	                            oDataset.DataTables.push(oDatatable);
	                        }
	                    }
	                    oDatasource.DataSets.push(oDataset);
	                }
	            }
	        }
	        return oDatasource;
	    },
	    getClientId: function () {
	        var nDate = new Date();
	        return nDate.getYear() + "" + (nDate.getMonth() + 1) + ""
				 + nDate.getDate() + "" + nDate.getHours() + ""
				 + nDate.getMinutes() + "" + nDate.getSeconds();
	    }
	});
    win.FormSheet = FormSheet;
})(window);

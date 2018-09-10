TrDrag = {
    oTable: null,
    oTabPos: null,
    moveable: false,
    dragDiv: null,
    lineDiv: null,
    SourceTr: null,
    SrcTrBgColor: "",
    TargetTr: null, //储存当前拖拽的DOM对象引用
    TgtTrBgColor: "",
    dragPreBgColor: "lavender",
    dragEndBgColor: "#FFCCFF",
    InitDragTable: function (oTab) { //传递一个DOM对象，给其中的a添加mouseover和mouseout事件
        this.oTable = oTab;
        this.oTabPos = getPos(this.oTable);
        this.dragDiv = document.createElement("div");
        this.dragDiv.id = "fllowDiv";
        this.dragDiv.onselectstart = function () { return false };
        this.oTable.onselectstart = function () { return false };
        this.dragDiv.style.cursor = "hand";
        this.dragDiv.style.position = "absolute";
        this.dragDiv.style.border = "1px solid black";
        this.dragDiv.style.backgroundColor = this.dragEndBgColor;
        this.dragDiv.style.display = "none";
        var tab = document.createElement("table");
        tab.cellPadding = 0;
        tab.cellSpacing = 0;
        tab.border = 1;
        this.dragDiv.appendChild(tab);
        document.body.appendChild(this.dragDiv);

        this.lineDiv = document.createElement("div");
        this.lineDiv.id = "lineDiv";
        this.lineDiv.onselectstart = function () { return false };
        this.lineDiv.style.position = "absolute";
        this.lineDiv.style.height = "3px";
        this.lineDiv.style.backgroundColor = "red";
        this.lineDiv.style.display = "none";
        document.body.appendChild(this.lineDiv);

        document.body.attachEvent("onmousedown", bind(TrDrag.DragBegin, TrDrag));
        document.body.attachEvent("onmousemove", bind(TrDrag.DragMove, TrDrag));
        document.body.attachEvent("onmouseup", bind(TrDrag.DragEnd, TrDrag));

        var that = this, 
            bFound = false,
            i = 0,
            j = 0;
        for (i = 1; i < this.oTable.rows.length; i++) {
            if (!bFound) {
                for (j = 0; j < this.oTable.rows[i].cells.length; j++) {
                    if (this.oTable.rows[i].cells[j].firstChild.type
                     && this.oTable.rows[i].cells[j].firstChild.type == "checkbox") {
                        bFound = true;
                        break;
                    }
                }

                if (j == this.oTable.rows[i].cells.length) {
                    return;
                }
            }

            this.oTable.rows[i].cells[j].onclick = function () {
                that.checkNode(event.srcElement);
            }
        }
    },
    DragBegin: function () {
        if (event.button == 1) {
            var oNode = event.srcElement,
                oTd = null;
            while (oNode != this.oTable) {
                switch (oNode.nodeName) {
                    case "BODY": return;
                    case "TD":
                        {
                            oTd = oNode;
                            break;
                        }
                    case "TR":
                        {
                            this.SourceTr = oNode;
                            break;
                        }
                    default:
                        {
                            break;
                        }
                }

                oNode = oNode.parentNode;
            }

            if (oTd == this.SourceTr.childNodes[2]) {
                this.dragDiv.firstChild.appendChild(this.SourceTr.cloneNode(true));
                this.SrcTrBgColor = this.SourceTr.style.backgroundColor;
                this.SourceTr.style.backgroundColor = this.dragPreBgColor;
                var oPos = getPos(this.SourceTr);
                this.dragDiv.firstChild.style.width = this.SourceTr.offsetWidth;
                this.dragDiv.firstChild.style.height = this.SourceTr.offsetHeight;
                this.dragDiv.style.top = oPos.top;
                this.dragDiv.style.left = oPos.left;
                this.dragDiv.style.display = "block";
                this.dragDiv.setAttribute("RelLeft", event.clientX - oPos.left);
                this.dragDiv.setAttribute("RelTop", event.clientY - oPos.top);
                this.moveable = true;

                this.lineDiv.style.width = this.SourceTr.offsetWidth;
                this.oTable.onselectstart = function () { return false };
            }
        }
    },
    DragMove: function () {
        if (this.moveable) {
            var iHeight, i = 0, j = 0,
                 preTop = 0, curTop = 0, nextTop = 0,
                oCell, oTrPos,
                iMouseLeft = event.clientX + document.body.scrollLeft,
                iMouseTop = event.clientY + document.body.scrollTop;

            this.dragDiv.style.top = event.clientY - parseInt(this.dragDiv.getAttribute("RelTop"));
            this.dragDiv.style.left = event.clientX - parseInt(this.dragDiv.getAttribute("RelLeft"));

            for (i = 0; i < this.oTable.rows.length; i++) {
                this.TargetTr = this.oTable.rows[i];
                oTrPos = getPos(this.TargetTr);
                if (this.TargetTr != this.SourceTr) {
                    if (iMouseLeft > oTrPos.left && iMouseLeft < oTrPos.left + this.TargetTr.offsetWidth
                        && iMouseTop > oTrPos.top && iMouseTop < oTrPos.top + this.TargetTr.offsetHeight) {
                        this.lineDiv.style.left = oTrPos.left;
                        iHeight = iMouseTop - oTrPos.top
                        if (iHeight < 3) {
                            if (this.TargetTr != this.SourceTr.nextSibling) {
                                this.lineDiv.setAttribute("direction", "up");
                                this.lineDiv.style.top = oTrPos.top;
                                this.lineDiv.style.display = "block";
                            }
                            this.TargetTr.style.backgroundColor = this.SrcTrBgColor;
                        } else if (iHeight < this.TargetTr.offsetHeight - 3) {
                            this.lineDiv.setAttribute("direction", "middle");
                            this.lineDiv.style.display = "none";
                            this.TargetTr.style.backgroundColor = this.dragEndBgColor;
                        } else {
                            if (this.TargetTr.nextSibling != this.SourceTr) {
                                this.lineDiv.setAttribute("direction", "down");
                                this.lineDiv.style.top = oTrPos.top + this.TargetTr.offsetHeight;
                                this.lineDiv.style.display = "block";
                            }
                            this.TargetTr.style.backgroundColor = this.SrcTrBgColor;
                        }
                    } else {
                        this.TargetTr.style.backgroundColor = this.SrcTrBgColor;
                    }
                }
            }
            //window.defaultStatus = document.elementFromPoint(event.clientX, event.clientY).outerHTML;
        }
    },
    DragEnd: function () {
        if (this.moveable && this.SourceTr != null) { // && this.TargetTr != null && this.SourceTr != this.TargetTr
            var iHeight, i = 0, j = 0,
                 preTop = 0, curTop = 0, nextTop = 0,
                oCell, oTrPos, oPosTr,
                iMouseLeft = event.clientX + document.body.scrollLeft,
                iMouseTop = event.clientY + document.body.scrollTop;

            for (i = 0; i < this.oTable.rows.length; i++) {
                this.TargetTr = this.oTable.rows[i];
                oTrPos = getPos(this.TargetTr);
                if (this.TargetTr != this.SourceTr) {
                    if (iMouseLeft > oTrPos.left && iMouseLeft < oTrPos.left + this.TargetTr.offsetWidth
                        && iMouseTop > oTrPos.top && iMouseTop < oTrPos.top + this.TargetTr.offsetHeight) {
                        switch (this.lineDiv.getAttribute("direction")) {
                            case "up":
                                {
                                    var arrNode = [];
                                    arrNode.push({ oTr: this.SourceTr, oPTr: this.TargetTr });
                                    var oData = null,
                                        oTempTr = this.SourceTr.nextSibling,
                                        sCurNodePId = "",
                                        sPNodeId = this.SourceTr.getAttribute("NodeId"),
                                        sCurNodeId = "",
                                        isDescendant = true,
                                        refTr = null,
                                        firstTr = oTempTr,
                                        lastTr = null,
                                        i = 0, isFoundRange = false;
                                    this.SourceTr.parentNode.insertBefore(this.SourceTr, this.TargetTr);

                                    //第一种 非递归遍历
                                    while (arrNode.length != 0) {
                                        oData = arrNode.shift();
                                        refTr = oData.oTr.nextSibling;
                                        oTempTr = firstTr;
                                        while (oTempTr != lastTr) {
                                            sCurNodeId = oTempTr.getAttribute("NodeId");
                                            sCurNodePId = oTempTr.getAttribute("PNodeId");

                                            i = 0;
                                            isDescendant = true;
                                            while (i < sPNodeId.length) {
                                                if (i >= sCurNodeId.length || sCurNodeId.charAt(i) != sPNodeId.charAt(i)) {
                                                    isDescendant = false;
                                                    break;
                                                }
                                                i++;
                                            }
                                            if (!isDescendant) {
                                                if (!isFoundRange) {
                                                    lastTr = oTempTr;
                                                }
                                                break;
                                            } else if (sCurNodePId.length == oData.oTr.getAttribute("NodeId").length) {
                                                var obj = oTempTr;
                                                obj = obj.nextSibling
                                                if (oTempTr == firstTr) {
                                                    firstTr = obj;
                                                }
                                                if (refTr != null) {
                                                    oData.oTr.parentNode.insertBefore(oTempTr, refTr);
                                                } else {
                                                    oData.oTr.parentNode.appendChild(oTempTr);
                                                }
                                                arrNode.push({ oTr: oTempTr, oPTr: oData.oTr });
                                                oTempTr = obj;
                                                continue;
                                            }
                                            oTempTr = oTempTr.nextSibling;
                                        }
                                    }

                                    this.SourceTr.childNodes[2].style.paddingLeft = this.TargetTr.childNodes[2].style.paddingLeft != "" ? parseInt(this.TargetTr.childNodes[2].style.paddingLeft) : 0;
                                    break;
                                }
                            case "middle": 
                                {
                                    //作为目标TargetTr的子节点
                                    var srcpading = this.SourceTr.childNodes[2].style.paddingLeft != "" ? parseInt(this.SourceTr.childNodes[2].style.paddingLeft) : 0;
                                    var tgtpading = this.TargetTr.childNodes[2].style.paddingLeft != "" ? (parseInt(this.TargetTr.childNodes[2].style.paddingLeft) / 10 + 1) * 10 : 10;
                                    var res = srcpading - tgtpading;

                                    this.SourceTr.setAttribute("PNodeId", this.TargetTr.getAttribute("NodeId"));
                                    this.SourceTr.setAttribute("Deepth", parseInt(this.TargetTr.getAttribute("Deepth")) + 1);
                                    if (res != 0) {
                                        this.SourceTr.childNodes[2].style.paddingLeft = this.SourceTr.childNodes[2].style.paddingLeft != "" ? parseInt(this.SourceTr.childNodes[2].style.paddingLeft) - res : 0 - res;
                                    }
                                    var i = 0,
                                            isDescendant = true,
                                            sid = "",
                                           oCTr = this.SourceTr.nextSibling;
                                    this.SourceTr.parentNode.insertBefore(this.SourceTr, this.TargetTr.nextSibling);

                                    //第二种 递归遍历 修改节点之间的关系属性
                                    (function handlertr(oCTr, oPTr) {
                                        var sCurNodePId = "",
                                            sPNodeId = "",
                                            sCurNodeId = "",
                                            temp = null,
                                            refTr = null;

                                        while (oCTr != null) {
                                            sPNodeId = oPTr.getAttribute("NodeId");
                                            sCurNodeId = oCTr.getAttribute("NodeId");
                                            sCurNodePId = oCTr.getAttribute("PNodeId");

                                            i = 0;
                                            isDescendant = true;
                                            while (i < sPNodeId.length) {
                                                if (i >= sCurNodeId.length || sCurNodeId.charAt(i) != sPNodeId.charAt(i)) {
                                                    isDescendant = false;
                                                    break;
                                                }
                                                i++;
                                            }
                                            if (!isDescendant) {
                                                break;
                                            } else if (sCurNodePId.length == sPNodeId.length) {
                                                oCTr.setAttribute("PNodeId", oPTr.getAttribute("NodeId"));
                                                oCTr.setAttribute("Deepth", parseInt(oPTr.getAttribute("Deepth")) + 1);
                                                temp = oCTr.nextSibling;
                                                refTr = oPTr.nextSibling;
                                                while (refTr != null && refTr != oCTr) {
                                                    if (refTr.getAttribute("PNodeId").indexOf(oPTr.getAttribute("NodeId"), 0) != -1) {
                                                        refTr = refTr.nextSibling;
                                                    } else {
                                                        break;
                                                    }
                                                }
                                                if (refTr != null) {
                                                    oCTr.parentNode.insertBefore(oCTr, refTr);
                                                } else {
                                                    oCTr.parentNode.appendChild(oCTr);
                                                }
                                                //oCTr.parentNode.insertBefore(oCTr, oPTr.nextSibling);
                                                oCTr = handlertr(temp, oCTr);
                                                //oCTr = oCTr.nextSibling;
                                            }
                                            oCTr = oCTr.nextSibling;
                                        }
                                        return oCTr;
                                    })(oCTr, this.SourceTr);

                                    break;
                                }
                            case "down":
                                {

                                    this.SourceTr.childNodes[2].style.paddingLeft = this.TargetTr.childNodes[2].style.paddingLeft != "" ? parseInt(this.TargetTr.childNodes[2].style.paddingLeft) : 0;

                                    //第三种 非递归遍历
                                    var arrNode = [];
                                    arrNode.push({ oTr: this.SourceTr, oPTr: this.TargetTr });
                                    var oData = null,
                                        oTempTr = this.SourceTr.nextSibling,
                                        sCurNodePId = "",
                                        sPNodeId = this.SourceTr.getAttribute("NodeId"),
                                        sCurNodeId = "",
                                        isDescendant = true,
                                        refTr = null,
                                        firstTr = oTempTr,
                                        lastTr = null,
                                        i = 0, isFoundRange = false;
                                    this.SourceTr.parentNode.insertBefore(this.SourceTr, this.TargetTr);
                                    break;
                                }
                            default:
                        }
                        break;
                    }
                }
            }
        }

        this.moveable = false;
        for (var i = this.dragDiv.firstChild.childNodes.length - 1; i >= 0; i--) {
            this.dragDiv.firstChild.removeChild(this.dragDiv.firstChild.childNodes[i]);
        }
        this.dragDiv.style.display = "none";
        this.lineDiv.style.display = "none";

        for (var i = 0; i < this.oTable.rows.length; i++)
            this.oTable.rows[i].style.backgroundColor = "";
    },
    isInTableRange: function (oCellPos, oCell) {
        var iMouseLeft = event.clientX + document.body.scrollLeft,
            iMouseTop = event.clientY + document.body.scrollTop;
        return (iMouseLeft > oCellPos.left && iMouseLeft < oCellPos.left + oCell.offsetWidth
            && iMouseTop > oCellPos.top && iMouseTop < oCellPos.top + oCell.offsetHeight)
    },
    getPos: function (oNode) {
        var iLeft, iTop;
        while (oNode != null) {
            iTop += oNode.offsetLeft;
            iLeft += oNode.offsetTop;
            oNode = oNode.offsetParent;
        }

        return { left: iLeft, top: iTop };
    },
    checkNode: function (obj) {
        if (obj.checked) {
            
        }
    },
    ToggleChild:function (){
  
    }
};
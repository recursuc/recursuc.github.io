
//全局变量说明：
var isChecked = 0;
/*
* isChecked 变量值说明：
*
* 0,没有发生拖拽；
* 1,水平向东拖拽；
* 2,水平向东西拖拽；
* 3,竖直向北拖拽；
* 4,竖直向南北拖拽；
*/

var toMove = false;          //标识鼠标是否摁下
var toTdMove = false;        //标识鼠标是否在数据区摁下

var originalX, originalY, currentX, currentY, indexValue;
/*
* originalX, originalY, currentX, currentY, indexValue 变量说明：
*
* originalX，鼠标摁下瞬间鼠标指针的x坐标
* originalY，鼠标摁下瞬间鼠标指针的y坐标
* currentX，鼠标释放瞬间鼠标指针的x坐标
* currentY，鼠标释放瞬间鼠标指针的y坐标
* 以上四个变量主要用于数据区域选取时，便于蓝色边框框选选中区域
*
* indexValue 鼠标松开时所在单元格的索引，主要用于拖拽表示要改变宽度或者高度的列或者行
*/

var cellWidth, cellHeight; //单元格宽、高

var oTdPos = { x: -1, y: -1 }; //记录当前焦点TD的相对table位置（因为合会并补RAD）
var indexX = -1, indexY = -1, endX = -1, endY = -1; //记录当前焦点TD的位置
/*
* indexX, indexY, endX, endY变量说明：
* 默认值：-1，其目的在于表示没有单元格或区域被选取
*
* indexX, 鼠标《摁下》时所在单元格位置的《列》索引
* indexX, 鼠标《释放》时所在单元格位置的《列》索引
*/
var isSelectedRow = false, isSelectedCol = false;
//拖拽时的鼠标事件
function MouseDown() {
    if (event.srcElement.style.cursor == "default") {
        return;
    }
    if (isChecked > 0) {
        toMove = true;
        //IF块判断是否是水平拖拽，否则为竖直方向拖拽
        if (isChecked == 1 || isChecked == 2) {
            myDivCol.style.display = ""; //竖直层可见，默认为none

            //动态设置竖直标识线和竖直层的高度
            myLineCol.style.height = myDivCol.style.height = divTopHead.offsetHeight + divMain.offsetHeight - 15;

            //动态确定竖直标识线的坐标位置，竖直表示线主要在水平拖拽中起到跟随鼠标位置水平移动
            //如下的event.x为当前鼠标的水平坐标值，因为竖直层的宽度是100px，
            //用竖直层左端坐标减去50个像素正好可以使竖直线处于坐标指针的正下方
            //附录：宽度设置为100个像素是为了加强层对鼠标移动的敏感程度，如下的+5意在于字母行完美结合
            myDivCol.style.top = divTopHead.offsetTop + 20;
            myDivCol.style.left = event.x - 50;
        } else {
            //详细注释如上所叙
            myDivRow.style.display = ""; //水平层可见，默认为none
            myLineRow.style.width = myDivRow.style.width = divTopLeft.offsetWidth + divMain.offsetWidth;
            myDivRow.style.top = event.y - 50;
            myDivRow.style.left = divTopLeft.offsetLeft;
        }

        //记录鼠标的原始位置
        originalX = event.x;
        originalY = event.y;
    }
}

//拖拽时的鼠标事件
function MouseUp() {

    //下面的判断：
    //如果之前没有摁下鼠标，则不做任何处理，
    //主要用于屏蔽在行头或列头摁下鼠标，而在数据区松开鼠标，
    //导致对象为空的情况
    if (toMove == false || event.srcElement.style.cursor == "default") {
        return;
    }

    //鼠标松开，表示当前的水平坐标和竖直坐标
    currentX = event.x;
    currentY = event.y;

    var minStep = 5;
    //该变量主要用于拖拽改变鼠标形状的最小敏感像素，
    //建议不要将该值甚至过大或过小

    //以下if块用于释放鼠标时改变列宽或者行高
    //当然如果拖拽的像素大小小于最小敏感像素则不做任何处理
    //isChecked为1、2为水平拖拽，3、4为竖直拖拽
    if ((isChecked == 1 || isChecked == 2) && Math.abs(currentX - originalX) >= minStep) {

        //isChecked为1为水平向东拖拽，2为水平向西拖拽
        //这里之所以划分东西方向在于水平向西拖拽时，
        //若拖拽区域大于相邻列的宽度，则需要折叠相邻列的所有单元格
        if (isChecked == 1) {
            if (cellWidth + currentX > originalX) {//“document.getElementById("tbData").firstChild”为数据区单元格对象
                document.getElementById("tbData").firstChild.childNodes[indexValue].style.width =
document.getElementById("tbTopHead").rows[0].cells[indexValue].style.width = cellWidth + currentX - originalX;
            } else {//折叠单元格；indexValue 鼠标松开时所在单元格的索引
                document.getElementById("tbData").firstChild.childNodes[indexValue].style.width =
document.getElementById("tbTopHead").rows[0].cells[indexValue].style.width = 0;
            }
        } else {//详情参考上方注释
            if (parseInt(document.getElementById("tbData").firstChild.childNodes[indexValue - 1].style.width) +
currentX > originalX) {
                document.getElementById("tbData").firstChild.childNodes[indexValue - 1].style.width =
document.getElementById("tbTopHead").rows[0].cells[indexValue - 1].style.width = parseInt(document.getElementById
("tbTopHead").rows[0].cells[indexValue - 1].currentStyle.width) + currentX - originalX;
            } else {
                document.getElementById("tbData").firstChild.childNodes[indexValue - 1].style.width =
document.getElementById("tbTopHead").rows[0].cells[indexValue - 1].style.width = 0;
            }
        }
    } else if ((isChecked == 3 || isChecked == 4) && Math.abs(currentY - originalY) >= minStep) {
        if (isChecked == 3) {
            if (document.getElementById("tbLeftHead").rows[indexValue - 1].cells[0].offsetHeight + currentY > originalY)
             {
                document.getElementById("tbData").rows[indexValue - 1].style.height = document.getElementById
("tbLeftHead").rows[indexValue - 1].cells[0].style.height = parseInt(document.getElementById("tbLeftHead").rows
[indexValue - 1].cells[0].offsetHeight) + currentY - originalY;
            } else {
                document.getElementById("tbData").rows[indexValue - 1].style.height = document.getElementById
("tbLeftHead").rows[indexValue - 1].cells[0].style.height = 0;
            }
        } else {
            if (cellHeight + currentY > originalY) {
                document.getElementById("tbData").rows[indexValue].style.height = document.getElementById
("tbLeftHead").rows[indexValue].cells[0].style.height = cellHeight + currentY - originalY;
            } else {
                document.getElementById("tbData").rows[indexValue].style.height = document.getElementById
("tbLeftHead").rows[indexValue].cells[0].style.height = 0;
            }
        }
    }

    isChecked = 0; //改为默认值，标识为没有发生拖拽
    toMove = false;

    //隐藏竖线和水平线
    myDivCol.style.display = "none";
    myDivRow.style.display = "none";

    //重新加载文本框
    if (divNorthLine.style.display != "none") {
        var oTd = tbData.rows[indexY].cells[indexX];
        SetTextFrame(indexX, indexY, endX, endY);
        txtEdit.style.display = "none";
    }
}

//拖拽时的鼠标事件
function MouseMove(oCell) {
    //判断是否摁下了鼠标右键，event.button == 1为true表示摁下了左键
    if (toMove && event.button == 1) {
        //水平拖拽
        if (isChecked == 1 || isChecked == 2) {
            //设置层离理左端的距离，其中-50是因为该层的总宽度为100，如此可让竖直线居中
            myDivCol.style.left = event.x - 50;
            //该表鼠标样式
            oCell.style.cursor = "col-resize";
            return;
        } else {
            //设置层离上端端的距离，其中-50是因为该层的总高度为100，如此可让水平直线居中
            myDivRow.style.top = event.y - 50;
            oCell.style.cursor = "row-resize";
            return;
        }
    }
    else {
        var minStep = 2; //设置敏感边框区域的像素

        var cellPos = getCoordinate(oCell); //单元格的左上角坐标集合

        //cellPos如果为false，说明获取单元格坐标失败
        if (cellPos == "false") {
            toMove = false;
            return;
        }

        //屏蔽掉头标签行最左边单元格的敏感区域，防止引发不必要的错误
        if (oCell.id == "A" || oCell.id == "1") {
            oCell.style.cursor = "default"; //不该表鼠标样式，因为鼠标样式直接关系到能否拖拽
            return;
        }
        cellWidth = oCell.offsetWidth;     //记录鼠标所在单元格的宽度
        cellHeight = oCell.offsetHeight;   //记录鼠标所在单元格的高度
        var mouseX = window.event.clientX; //鼠标的x坐标
        var mouseY = window.event.clientY; //鼠标的y坐标
        var leftX = cellPos.left;          //单元格左上角的点坐标x坐标
        var leftY = cellPos.top;           //单元格做上角点坐标y坐标
        var rightX = cellWidth + leftX;    //单元格的右下角的点x坐标
        var rightY = cellHeight + leftY;   //单元格的右下角的点y坐标

        //改变鼠标的样式
        //首先判断是在上端水平字母头标签还是左边竖直数字头标签
        if (oCell.parentNode.parentNode.parentNode.id == "tbTopHead") {
            //正东
            if (rightX - mouseX > 0 && rightX - mouseX < minStep) {
                oCell.style.cursor = "col-resize"; //横向拖拽的鼠标样式
                isChecked = 1; //记录拖拽方向
            } else if (mouseX > leftX && mouseX - leftX < minStep + 2) {//正西
                oCell.style.cursor = "col-resize";
                isChecked = 2; //记录拖拽方向
            } else {//其他，则为默认鼠标样式
                oCell.style.cursor = "default";
                isChecked = 0; //记录拖拽方向
                return false;
            }
            indexValue = chartoNum(oCell.id);
        } else { //正北        
            if (mouseY > leftY && mouseY - leftY < minStep + 2) {
                oCell.style.cursor = "row-resize";
                isChecked = 3;
            } else if (rightY > mouseY && rightY - mouseY < minStep) { //正南
                oCell.style.cursor = "row-resize";
                isChecked = 4;
            } else {
                oCell.style.cursor = "default";
                return false;
            }
            indexValue = oCell.id - 1;
        }
    }
} //End MouseMove Event

//转换列标id值为索引号
function chartoNum(sId) {
    var arrId = sId.split("");
    var reNum = 0;
    var power = 1; //用于次方算值
    var times = 1;  //最高位需要加1
    var num = arrId.length; //得到字符串个数
    reNum += Char_num(arrId[num - 1]); //得到最后一个字母的尾数值
    //得到除最后一个字母的所有值,多于两位才执行这个函数
    if (num >= 2) {
        for (var i = num - 1; i > 0; i--) {
            power = 1; //致1，用于下一次循环使用次方计算
            for (var j = 0; j < i; j++)           //幂，j次方，应该有函数
            {
                power *= 26;
            }
            reNum += (power * (Char_num(arrId[num - i - 1]) + times));  //最高位需要加1，中间位数不需要加一
            times = 0;
        }
    }
    return reNum;
}
function Char_num(num) {
    var reChartoNum = num.charCodeAt() - 65;
    return reChartoNum;
}

//获取单元格左上角相对于divMain的左上角离左边和顶端的距离
//参数：单元格对象
//返回值：表格左上角坐标,left->X,top->Y
function getCoordinate(oCell, oParent) {
    var sumTop = 0, sumLeft = 0;
    try {
        if (oParent == undefined) {
            for (var sumTop = 0, sumLeft = 0; oCell && oCell != document.body; ) {
                sumTop += oCell.offsetTop, sumLeft += oCell.offsetLeft, oCell = oCell.offsetParent;
            }
        } else {
            while (oParent.style.position == "absolute" && oCell != oParent) {
                sumTop += oCell.offsetTop;
                sumLeft += oCell.offsetLeft;
                oCell = oCell.offsetParent;
            }
        }
        return { left: sumLeft, top: sumTop }
    } catch (err) {
        return "false";
    }
}

//数据区的单击选取事件，鼠标摁下
var onselstart = null;
function clickEventDown(event) {
    //下面的方法作用为：摁下鼠标后，不能选中数据区的数据，用于数据区的区域选择时不选中数据，造成样式美观问题
    if (event.button == 2) {
        return;
    }
    onselstart = document.getElementById("divAll").onselectstart;
    document.getElementById("divAll").onselectstart = function () {
        return false;
    };

    toTdMove = true; //表明在数据区摁下了鼠标左键，能够触发数据区td的移动事件

    var oTd = event.srcElement;
    var oTr = oTd.parentNode;

    //获得单元格坐标
    indexX = getX(oTd);
    indexY = oTr.rowIndex;
    //获得单元格真实坐标
    oTdPos.y = indexX;
    oTdPos.x = indexY;
    //拷贝单元格内容
    txtMathExp.value = oTd.innerText.replace(/&lt;/g, "<").replace(/&quot;/g, '"').replace(/&gt;/g, ">").replace(/&amp;/g, "&").replace(/&nbsp;/g, " ");
    //设置单元格的位置展示，形式如：B2，C3
    colName.innerHTML = String.fromCharCode(65 + indexX) + (indexY + 1);
    //可编辑文本框不可见
    txtEdit.style.display = "none";
}

//数据区的单击选取事件，鼠标松开
function clickEventUp(event) {
    if (event.button == 2) {
        return;
    }
    menuDiv.style.display = "none";
    if (toTdMove == false) {
        return;
    }
    var oTd = event.srcElement;
    var oTr = oTd.parentNode;
    if (onselstart != null) {
        document.getElementById("divAll").onselectstart = onselstart;
    }
    //获取单元格位置
    endX = getX(oTd);
    endY = oTr.rowIndex;

    if (endX == indexX && endY == indexY) {
        txtEdit.style.display = "none";
    }
    //重新画边框
    SetTextFrame(indexX, indexY, endX, endY);

    //回填单元格内容样式
    table = document.getElementById("tbData");
    cell = table.rows[oTdPos.x].childNodes[oTdPos.y];
    callbackCellStyle(cell);
    if (DesignEdit.arrFormatCopy.length > 0) DesignEdit.formatPasteOperate(tbData);

}


function clickEventMove(event) {
    if (event.button == 2) {
        return;
    }
    if (toTdMove == false || event.button != 1) {
        return;
    }
    var oTd = event.srcElement;
    var oTr = oTd.parentNode;

    //获得文本框的原始列索引位置
    endX = getX(oTd);
    endY = oTr.rowIndex;

    //重新设置边框选区
    SetTextFrame(indexX, indexY, endX, endY);
}
//数据区的双击事件
function dblclickEvent(event) {
    var oTd = event.srcElement;
    var oTr = oTd.parentNode;
    var cellPos = getCoordinate(oTd);

    //获得文本框的原始列索引位置
    indexX = getX(oTd);
    indexY = oTr.rowIndex;

    //Set the around W,N,E,S Lines
    //设置单元格的选取边框
    endX = indexX, endY = indexY;
    SetTextFrame(indexX, indexY, endX, endY);

    txtEdit.style.display = "";
    txtEdit.value = oTd.innerText.replace(/&lt;/g, "<").replace(/&quot;/g, '"').replace(/&gt;/g, ">").replace(/&amp;/g, "&").replace(/&nbsp;/g, " ");
    //设置文本框位置
    txtEdit.style.top = cellPos.top - 120;
    txtEdit.style.left = cellPos.left - 36;

    //设置文本框的高宽
    txtEdit.style.width = oTd.offsetWidth;
    txtEdit.style.height = oTd.offsetHeight;
    //设置文本框
    txtEdit.style.textAlign = oTd.currentStyle.textAlign;
    txtEdit.style.textAlign = oTd.currentStyle.textAlign;
    txtEdit.style.textAlign = oTd.currentStyle.textAlign;
    txtEdit.style.fontFamily = oTd.currentStyle.fontFamily;
    txtEdit.style.fontSize = oTd.currentStyle.fontSize;
    txtEdit.style.textDecoration = oTd.currentStyle.textDecoration;
    txtEdit.style.fontStyle = oTd.currentStyle.fontStyle;
    txtEdit.style.fontWeight = oTd.currentStyle.fontWeight;
    txtEdit.style.color = oTd.currentStyle.color;
    txtEdit.style.backgroundColor = oTd.style.backgroundColor;
    if (!oTd.style.fontSize) {
        oTd.style.fontSize = "14";
    }
    switch (oTd.currentStyle.verticalAlign) {
        case "top":
            {
                txtEdit.style.paddingTop = 0;
                break;
            }
        case "middle":
            {
                txtEdit.style.paddingTop = (oTd.clientHeight - parseInt(oTd.style.fontSize)) / 2 > 0 ? (oTd.clientHeight - parseInt(oTd.style.fontSize)) / 2 : 0;
                break;
            }
        case "bottom":
            {
                txtEdit.style.paddingTop = oTd.clientHeight - parseInt(oTd.style.fontSize) > 0 ? oTd.clientHeight - parseInt(oTd.style.fontSize) : 0;
                break;
            }
        default:
            {
                txtEdit.style.paddingTop = (oTd.clientHeight - parseInt(oTd.style.fontSize)) / 2 > 0 ? (oTd.clientHeight - parseInt(oTd.style.fontSize)) / 2 : 0;
                break;
            }
    }
    //文本框获得输入焦点
    txtEdit.focus();

    if (window["isFormating"]) {
        DesignEdit.arrFormatCopy = [];
        window["isFormating"] = false;
        tbData.parentNode.style.cursor = "auto";
        event.srcElement.style.backgroundColor = "";
    }
}

//获取当前单元格原始索引，即没有发生合并前的索引位置
function getX(oTd) {
    var count = -1;
    while (oTd != null) {
        oTd = oTd.previousSibling;
        count++;
    }
    return count;
}

//坐标均为页面单元格索引坐标（x为所在列的索引值，y为所在行的索引值），从零开始
//x1,y1为鼠标摁下时的单元格坐标
//x2,y2为鼠标松开时的单元格坐标
//区域划分为九个区域（八个方向+原点）
function SetTextFrame(x1, y1, x2, y2) {
    if (x1 == undefined || y1 == undefined || x2 == undefined || y2 == undefined) {
        return;
    }
    if (x1 == -1 && x2 == -1 && y1 == -1 && y2 == -1) {
        x1 = x2 = y1 = y2 = 0;
    }
    var cellPos, w, h;

    if (x1 == x2) {
        if (y1 == y2) {//中心区，摁下鼠标时的单元格区域
            cellPos = getCoordinate(tbData.rows[y1].childNodes[x1], document.getElementById("divMain"));
            w = tbData.rows[y1].childNodes[x1].offsetWidth;
            h = tbData.rows[y1].childNodes[x1].offsetHeight;
        } else if (y1 > y2) {//正北区
            cellPos = getCoordinate(tbData.rows[y2].childNodes[x2], document.getElementById("divMain"));
            w = tbData.rows[y2].childNodes[x2].offsetWidth;
            h = 0;
            for (var i = 0; i <= y1 - y2; i++) {
                h += tbData.rows[y2 + i].childNodes[x2].offsetHeight;
                i += tbData.rows[y2 + i].childNodes[x2].rowSpan - 1;
            }
        } else {//正南区
            cellPos = getCoordinate(tbData.rows[y1].childNodes[x1], document.getElementById("divMain"));
            w = tbData.rows[y1].childNodes[x1].offsetWidth;
            h = 0;
            for (var i = 0; i <= y2 - y1; i++) {
                h += tbData.rows[y1 + i].childNodes[x1].offsetHeight;
                i += tbData.rows[y1 + i].childNodes[x1].rowSpan - 1;
            }
        }
    }
    else if (x1 < x2) {
        if (y1 == y2) {//正东区
            cellPos = getCoordinate(tbData.rows[y1].childNodes[x1], document.getElementById("divMain"));
            w = 0;
            for (var i = 0; i <= x2 - x1; i++) {
                w += tbData.rows[y1].childNodes[x1 + i].offsetWidth;
                i += tbData.rows[y1].childNodes[x1 + i].colSpan - 1;
            }
            h = tbData.rows[y1].childNodes[x1].offsetHeight;
        } else if (y1 > y2) {//东北区
            cellPos = getCoordinate(tbData.rows[y2].childNodes[x1], document.getElementById("divMain"));
            w = h = 0;
            for (var i = 0; i <= x2 - x1; i++) {
                w += tbData.rows[y2].childNodes[x1 + i].offsetWidth;
                i += tbData.rows[y2].childNodes[x1 + i].colSpan - 1;
            }

            for (var i = 0; i <= y1 - y2; i++) {
                h += tbData.rows[y2 + i].childNodes[x1].offsetHeight;
                i += tbData.rows[y2 + i].childNodes[x1].rowSpan - 1;
            }
        } else {//东南区
            cellPos = getCoordinate(tbData.rows[y1].childNodes[x1], document.getElementById("divMain"));
            w = h = 0;
            for (var i = 0; i <= x2 - x1; i++) {
                w += tbData.rows[y1].childNodes[x1 + i].offsetWidth;
                i += tbData.rows[y1].childNodes[x1 + i].colSpan - 1;
            }

            for (var i = 0; i <= y2 - y1; i++) {
                h += tbData.rows[y1 + i].childNodes[x1].offsetHeight;
                i += tbData.rows[y1 + i].childNodes[x1].rowSpan - 1;
            }
        }
    }
    else {
        if (y1 == y2) {//正西区
            cellPos = getCoordinate(tbData.rows[y2].childNodes[x2], document.getElementById("divMain"));
            w = 0;
            for (var i = 0; i <= x1 - x2; i++) {
                w += tbData.rows[y2].childNodes[x2 + i].offsetWidth;
                i += tbData.rows[y2].childNodes[x2 + i].colSpan - 1;
            }
            h = tbData.rows[y2].childNodes[x2].offsetHeight;
        } else if (y1 > y2) {//西北区
            cellPos = getCoordinate(tbData.rows[y2].childNodes[x2], document.getElementById("divMain"));
            w = h = 0;
            for (var i = 0; i <= x1 - x2; i++) {
                w += tbData.rows[y2].childNodes[x2 + i].offsetWidth;
                i += tbData.rows[y2].childNodes[x2 + i].colSpan - 1;
            }
            for (var i = 0; i <= y1 - y2; i++) {
                h += tbData.rows[y2 + i].childNodes[x2].offsetHeight;
                i += tbData.rows[y2 + i].childNodes[x2].rowSpan - 1;
            }
        } else {//西南区
            cellPos = getCoordinate(tbData.rows[y1].childNodes[x2], document.getElementById("divMain"));
            w = h = 0;
            for (var i = 0; i <= x1 - x2; i++) {
                w += tbData.rows[y1].childNodes[x2 + i].offsetWidth;
                i += tbData.rows[y1].childNodes[x2 + i].colSpan - 1;
            }
            for (var i = 0; i <= y2 - y1; i++) {
                h += tbData.rows[y1 + i].childNodes[x2].offsetHeight;
                i += tbData.rows[y1 + i].childNodes[x2].rowSpan - 1;
            }
        }
    }
    var oCellTest = tbData.rows[y1].childNodes[x1];
    if (Math.abs(x2 - x1) == 0 && (oCellTest.rowSpan == tbData.rows.length || Math.abs(y2 - y1) + 1 == tbData.rows.length)) {
        isSelectedCol = true;
    } else {
        isSelectedCol = false;
    }
    if (Math.abs(y2 - y1) == 0 && (oCellTest.colSpan == tbData.rows[0].childNodes.length || Math.abs(x2 - x1) + 1 == tbData.rows[0].childNodes.length)) {
        isSelectedRow = true;
    } else {
        isSelectedRow = false;
    }

    setSelectDiv(cellPos, w, h);
}

//拷贝单元格内容
function CopyEditText(oText) {
    //setTimeout(code, time);
    if (indexX == -1) {
        alert("您当前未选择单元格");

        //屏蔽输入的键值
        event.keyCode = 0;
        event.returnValue = false;

        return;
    }

    if (event.keyCode == 37 || event.keyCode == 39) {
        return event.returnValue = true;
    }
    if (oText == txtMathExp) {
        tbData.rows[indexY].childNodes[indexX].innerHTML = txtEdit.value = oText.value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/ /g, "&nbsp;");
    } else {
        tbData.rows[indexY].childNodes[indexX].innerHTML = oText.value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/ /g, "&nbsp;");
        txtMathExp.value = oText.value;
    }
}

//添加行
//包含同时添加多行的情况
function AddRow(direction) {
    try {
        if (indexY == -1) {
            alert("您当前还没有选择单元格");
            return;
        }

        //统计一共要添加多少行
        var areaTotal = getSelectedObject();
        var rightBottomCell = tbData.rows[areaTotal.rightBottomPoint_Y].childNodes[areaTotal.rightBottomPoint_X]; //取得右下单元格
        var leftTopCell = tbData.rows[areaTotal.leftTopPoint_Y].childNodes[areaTotal.leftTopPoint_X]; //取得左上单元格
        //var rowSpanCount = rightBottomCell.rowSpan >= leftTopCell.rowSpan ? rightBottomCell.rowSpan : rightBottomCell.rowSpan;
        var total = areaTotal.rightBottomPoint_Y - areaTotal.leftTopPoint_Y + parseInt(rightBottomCell.rowSpan);

        //统计有多少列
        var colCount = tbTopHead.rows[0].cells.length;

        var oRow, pos;

        //判断是上添加还是下添加
        if (direction == "up") {
            pos = areaTotal.leftTopPoint_Y;
            for (var i = 0; i < total; i++) {
                oRow = tbData.insertRow(pos);
                oRow.style.height = "19px";
                for (var j = 0; j < colCount; j++) {
                    oRow.insertCell();
                }
            }
            // indexY += total;
            endY += parseInt(rightBottomCell.rowSpan) - 1;
            endX += parseInt(rightBottomCell.colSpan) - 1
        } else {
            // pos = areaTotal.rightBottomPoint_Y + 1;
            pos = areaTotal.rightBottomPoint_Y + parseInt(rightBottomCell.rowSpan);
            for (var i = 0; i < total; i++) {
                oRow = tbData.insertRow(pos);
                oRow.style.height = "19px";
                for (var j = 0; j < colCount; j++) {
                    oRow.insertCell();
                }
            }
        }

        //移动选择框的位置
        SetTextFrame(indexX, indexY, endX, endY);

        //在左边最末尾添加一个行的标号
        var rowCount = tbLeftHead.rows.length;
        for (var i = 0; i < total; i++) {
            oRow = tbLeftHead.insertRow(pos);
            var oTd = oRow.insertCell();

            //添加事件
            oTd.onmousedown = MouseDown;
            oTd.onmousemove = function () {
                MouseMove(this);
            };

            oTd.innerText = pos + total - i;
            oTd.setAttribute("id", oTd.innerText);
        }

        rowCount = tbLeftHead.rows.length;
        for (var i = pos + total; i < rowCount; i++) {
            tbLeftHead.rows[i].cells[0].innerText = i + 1;
            tbLeftHead.rows[i].cells[0].id = i + 1;
        }

        //重新设置id，因为增删查该会改变单元格的id
        ResetId();
    } catch (e) {
        alert("暂时不支持这种操作！");
    }

}

//添加列
//包含同时添加多列的情况
function AddCol(direction) {
    try {
        if (indexX == -1) {
            alert("您当前还没有选择单元格");
            return;
        }

        //统计一共要添加多少列
        var areaTotal = getSelectedObject();
        var rightBottomCell = tbData.rows[areaTotal.rightBottomPoint_Y].childNodes[areaTotal.rightBottomPoint_X]; //取得左下单元格
        var leftTopCell = tbData.rows[areaTotal.leftTopPoint_Y].childNodes[areaTotal.leftTopPoint_X]; //取得右上单元格
        var total = areaTotal.rightBottomPoint_X - areaTotal.leftTopPoint_X + parseInt(rightBottomCell.colSpan); //总共要插入的列数
        var rowCount = tbData.rows.length;
        var colCount = tbTopHead.rows[0].cells.length; //头div的长度
        var leftPos = areaTotal.rightBottomPoint_X + parseInt(rightBottomCell.rowSpan);
        //判断是右添加还是左添加

        if (direction == "right") {
            for (var i = 0; i < rowCount; i++) {
                for (var j = 0; j < total; j++) {
                    var oTemp = document.createElement("<td/>");
                    if (leftPos == colCount) {
                        tbData.rows[i].appendChild(oTemp);
                    } else {
                        tbData.rows[i].insertBefore(oTemp, tbData.rows[i].childNodes[leftPos]);
                    }
                }
            }
            //设置列集合中该列的跨度
            for (var j = 0; j < total; j++) {
                var obj = tbData.firstChild.childNodes[colCount - 1].cloneNode(true);
                obj.style.width = 60;
                if (leftPos == colCount) {
                    tbData.firstChild.appendChild(obj);
                } else {
                    tbData.firstChild.insertBefore(obj, tbData.firstChild.childNodes[leftPos]);
                }
            }
        }
        else {
            leftPos = areaTotal.leftTopPoint_X;
            for (var obj, i = 0; i < rowCount; i++) {
                for (var j = 0; j < total; j++) {
                    tbData.rows[i].insertBefore(document.createElement("<td>"), tbData.rows[i].childNodes[leftPos]);
                }
            }
            for (var j = 0; j < total; j++) {
                var obj = tbData.firstChild.childNodes[colCount - 1].cloneNode(true);
                obj.style.width = 60;
                tbData.firstChild.insertBefore(obj, tbData.firstChild.childNodes[leftPos]);
            }
        }

        //设置列的字母标号
        for (var i = 0; i < total; i++) {
            var topTbCellLength = tbTopHead.rows[0].childNodes.length;
            var oCell = tbTopHead.rows[0].appendChild(document.createElement("td"));
            oCell.innerHTML = charFormCode(topTbCellLength);
            oCell.setAttribute("id", oCell.innerHTML);
            //添加事件
            oCell.onmousedown = function () { MouseDown() };
            oCell.onmouseup = function () { MouseUp() };
            oCell.onmousemove = function () {
                MouseMove(this);
            };


        }

        //更新字符
        colCount = tbTopHead.rows[0].cells.length;
        //        for (var i = areaTotal.leftTopPoint_X + total; i < colCount; i++) {
        //            tbTopHead.rows[0].cells[i].id = tbTopHead.rows[0].cells[i].innerText = String.fromCharCode(i + 65);
        //        }
        for (var i = 0; i < colCount; i++) {
            tbTopHead.rows[0].cells[i].style.width = tbData.firstChild.childNodes[i].style.width;
        }
        //设置单元格选中区域
        if (direction == "left") {
            endX += parseInt(rightBottomCell.colSpan) - 1;
            endY += parseInt(rightBottomCell.rowSpan) - 1;
        }

        //重新设置id
        ResetId();

        //重新设置蓝色边框的区域
        SetTextFrame(indexX, indexY, endX, endY);
    } catch (e) {
        alert("暂时不支持这种操作！")
    }

}

//删除行
//包括同时删除多行的情况
function DelRow() {
    try {
        if (indexY == -1) {
            alert("您当前还没有选择单元格");
            return;
        }

        var areaTotal = getSelectedObject();
        var total = areaTotal.rightBottomPoint_Y - areaTotal.leftTopPoint_Y + 1;

        var colCount = tbTopHead.rows[0].cells.length;
        var pos = -1;
        var oTd = tbData.rows[indexY].cells[areaTotal.leftTopPoint_X];

        while (oTd != null) {
            oTd = oTd.previousSibling;
            pos++;
        }

        //删除多列
        for (var i = 0; i < total; i++) {
            //采用一次删除一列的机制
            for (var j = 0; j < colCount; j++) {
                if (tbData.rows[areaTotal.rightBottomPoint_Y - i].childNodes[j].nodeName == "RAD") {
                    var oTemp = tbData.rows[areaTotal.rightBottomPoint_Y - i].childNodes[j];
                    var oTdIndexY = areaTotal.leftTopPoint_Y;
                    while (oTemp.nodeName.toLowerCase() != "td") {
                        oTemp = tbData.rows[oTdIndexY].childNodes[j];
                        oTdIndexY -= 1;
                    }
                    var total = oTemp.colSpan;
                    if (oTemp.rowSpan > 1) {
                        oTemp.rowSpan -= 1;
                        j += total - 1;
                    }
                }
            }
            tbData.deleteRow(areaTotal.rightBottomPoint_Y - i);
        }

        var rowCount = tbLeftHead.rows.length - 1;
        for (var i = indexY; i < rowCount; i++) {
            tbLeftHead.rows[i].cells[0].style.height = tbLeftHead.rows[i + 1].cells[0].style.height
        }

        //删除操作完成后初始化文本框和边框线条
        divWestLine.style.display = divNorthLine.style.display = divEastLine.style.display = divSouthLine.style.display
= txtEdit.style.display = "none";
        indexX = indexY = endX = endY = -1;

        for (var i = 0; i < total; i++) {
            //"-1"将删除tbLeftHead表最后一行记录,删除左边行的最后一个标号
            tbLeftHead.deleteRow(-1);
        }

        //重新设置id
        ResetId();
    } catch (e) {
        alert("暂时不支持这种删除操作！");
    }

}

//删除列
//包括同时选中多列的情况
function DelCol() {
    try {
        if (indexX == -1) {
            alert("您当前还没有选择单元格");
            return;
        }

        var areaTotal = getSelectedObject();
        var total = areaTotal.rightBottomPoint_X - areaTotal.leftTopPoint_X + 1;

        var rowCount = tbData.rows.length;
        var pos = -1;
        var oTd = tbData.rows[indexY].childNodes[areaTotal.leftTopPoint_X];

        while (oTd != null) {
            oTd = oTd.previousSibling;
            pos++;
        }

        //同时删除多列
        for (var j = 0; j < total; j++) {
            //采用一次删除一行的单删机制
            for (var i = 0; i < rowCount; i++) {
                //如果出现已经剔除的单元格
                if (tbData.rows[i].childNodes[pos].nodeName == "RAD") {
                    var oTemp = tbData.rows[i].childNodes[pos];

                    //遍历兄弟节点，寻找单元格
                    while (oTemp.nodeName.toLowerCase() != "td") {
                        oTemp = oTemp.previousSibling;
                    }

                    var oRowTotal = oTemp.rowSpan;
                    if (oRowTotal > 1) {
                        oTemp.colSpan -= 1;
                    }

                    //删除跨行框内的RAD标签
                    for (var k = 0; k < oRowTotal; k++) {
                        tbData.rows[i + k].childNodes[pos].removeNode(true);
                    }
                    i += oRowTotal - 1;

                } else if (tbData.rows[i].childNodes[pos].colSpan > 1) {//如果出现跨列的情况
                    var oTemp = tbData.rows[i].childNodes[pos];
                    oTemp.colSpan -= 1;
                    oTemp.nextSibling.replaceNode(oTemp.cloneNode(true));
                    oTemp.removeNode(true);
                } else if (tbData.rows[i].childNodes[pos].rowSpan > 1) { //如果出现跨行的情况
                    var oTemp = tbData.rows[i].childNodes[pos];
                    var oRowTotal = oTemp.rowSpan;

                    for (var k = 0; k < oRowTotal; k++) {
                        tbData.rows[i + k].childNodes[pos].removeNode(true);
                    }
                    i += oRowTotal - 1;
                }
                else {
                    tbData.rows[i].childNodes[pos].removeNode(true);
                }
            }
        }

        //改变列的头字号标签
        var colCount = tbTopHead.rows[0].cells.length - 1;
        for (var i = 0; i < total; i++) {
            tbTopHead.rows[0].deleteCell(colCount);
            tbData.firstChild.childNodes[indexX].removeNode(true);
            colCount = tbTopHead.rows[0].cells.length - 1;
        }

        for (var i = 0; i < tbTopHead.rows[0].cells.length; i++) {
            tbTopHead.rows[0].cells[i].style.width = tbData.firstChild.childNodes[i].style.width;
        }
        //删除操作完成后初始化文本框和边框线条
        divWestLine.style.display = divNorthLine.style.display = divEastLine.style.display = divSouthLine.style.display
= txtEdit.style.display = "none";
        indexX = indexY = endX = endY = -1;

        //重新设置id
        ResetId();
    } catch (e) {
        alert("暂时不支持这种删除操作！");
    }

}

//调整整个显示区域界面的大小
function AdjustSize() {
    var topDiv = document.getElementById("divTopHead");
    var leftDiv = document.getElementById("divLeftHead");
    var mainDiv = document.getElementById("divMain");
    var leftTopDiv = document.getElementById("divTopLeft");
    var MathBar = document.getElementById("MathBar");
    MathBar.style.width = document.body.clientWidth;
    mainDiv.style.width = document.body.clientWidth - leftTopDiv.offsetWidth;
    try {
        document.getElementById("divTopHead").style.width = document.body.clientWidth - leftTopDiv.offsetWidth - (mainDiv.offsetWidth - mainDiv.clientWidth);
        mainDiv.style.height = leftDiv.style.height = document.body.clientHeight - leftTopDiv.offsetHeight - 114;
    } catch (e) {
        document.getElementById("divTopHead").style.width = document.documentElement.clientWidth - leftTopDiv.offsetWidth - (mainDiv.offsetWidth - mainDiv.clientWidth);
        mainDiv.style.height = leftDiv.style.height = document.documentElement.clientHeight - leftTopDiv.offsetHeight - 114;
    }

    leftDiv.style.width = leftTopDiv.offsetWidth + 1;
    leftDiv.style.height = parseInt(leftDiv.style.height) > 17 ? parseInt(leftDiv.style.height) - 17 : parseInt(leftDiv.style.height);
}

//合并单元格
function UniteCells() {
    var oSelected = getSelectedObject();
    if (oSelected == null) {
        alert("您当前还没有选择单元格");
        return;
    }

    //选中区域只有一个单元格时，不做任何操作
    if (indexX == endX && indexY == endY) {
        return;
    }

    var colsCount = oSelected.rightBottomPoint_X - oSelected.leftTopPoint_X + 1;
    var rowsCount = oSelected.rightBottomPoint_Y - oSelected.leftTopPoint_Y + 1;
    var oTable = document.getElementById("tbData");

    //判断是否同时存在多个内容框
    var textTemp = "";
    for (var i = 0; i < rowsCount; i++) {
        for (var j = 0; j < colsCount; j++) {
            var objTd = oTable.rows[oSelected.leftTopPoint_Y + i].childNodes[oSelected.leftTopPoint_X + j];

            //判断是否选中了带有pent标签或者跨行跨列的节点
            if (objTd.nodeName == "RAD" || objTd.rowSpan > 1 || objTd.colSpan > 1) {
                alert("您选择的区域内已经存在合并区域，无法合并...");
                return;
            }

            //判断事都同时存在超过一个文本节点
            if (objTd.innerText.length > 0) {
                if (textTemp.length > 0) {
                    alert("您选择的区域内存在多个文字框，无法合并...");
                    return;
                } else {
                    textTemp = objTd.innerText;
                }
            }
        }
    }

    var oCell = oTable.rows[indexY].childNodes[indexX].cloneNode(true);
    oCell.colSpan = colsCount;
    oCell.rowSpan = rowsCount;
    oCell.innerText = textTemp;

    //单独处理选区左上角所在行
    var oTemp = oTable.rows[oSelected.leftTopPoint_Y].childNodes(oSelected.leftTopPoint_X);
    var leftStep = -1;
    while (oTemp != null) {
        leftStep++;
        oTemp = oTemp.previousSibling;
    }

    //用RAD标签替换td标签
    for (var i = 1; i < colsCount; i++) {
        oTable.rows[oSelected.leftTopPoint_Y].childNodes[leftStep + i].replaceNode(document.createElement
("<RAD/>"));
    }
    for (var i = 1; i < rowsCount; i++) {
        for (var j = 0; j < colsCount; j++) {
            oTable.rows[oSelected.leftTopPoint_Y + i].childNodes[leftStep + j].replaceNode(document.createElement
("<RAD/>"));
        }
    }

    if (oSelected.leftTopPoint_X == 0) {
        oTable.rows[oSelected.leftTopPoint_Y].firstChild.replaceNode(oCell);
    } else {
        oTable.rows[oSelected.leftTopPoint_Y].childNodes[oSelected.leftTopPoint_X].replaceNode(oCell);
    }

    endX = indexX = oSelected.leftTopPoint_X; endY = indexY = oSelected.leftTopPoint_Y;

    //重新设置id
    ResetId();
}

//拆分单元格
function SplitCells() {
    if (indexX > -1 && (indexX == endX) && (indexY == endY)) {
        var oTable = document.getElementById("tbData");
        var oTd = oTable.rows[indexY].childNodes[indexX]; //获得节点对象
        //统计节点的跨行跨列情况
        var rowsCount = oTd.rowSpan;
        var colsCount = oTd.colSpan;

        var oTemp = oTable.rows[indexY].childNodes[indexX];
        oTemp.colSpan = 1;
        oTemp.rowSpan = 1;

        var leftStep = -1;
        while (oTemp != null) {
            leftStep++;
            oTemp = oTemp.previousSibling;
        }

        //操作首行
        for (var i = 1; i < colsCount; i++) {
            oTable.rows[indexY].childNodes[leftStep + i].replaceNode(document.createElement("<td/>"));
        }

        //用td标签替换pent标签
        for (var i = 1; i < rowsCount; i++) {
            for (var j = 0; j < colsCount; j++) {
                oTable.rows[indexY + i].childNodes[leftStep + j].replaceNode(document.createElement("<td/>"));
            }
        }
        endX = indexX + colsCount - 1;
        endY = indexY + rowsCount - 1;
        SetTextFrame(indexX, indexY, endX, endY);

        //重新设置id
        ResetId();
    } else {
        alert("您选择的单元格不具备取消合并的条件");
    }
}

//返回选中去对象的一个集合
//返回参数说明：
//leftTopPoint_X为左上角坐标X坐标索引
//leftTopPoint_Y为左上角坐标Y坐标索引
//rightBottomPoing_X为右下角X坐标索引
//rightBottomPoint_Y为右下角Y坐标索引
function getSelectedObject() {
    //没有选择区域时，返回空。
    if (divWestLine.style.display == "none") {
        return null;
    }
    var lx, ly, rx, ry;
    if (indexX > endX) {
        lx = endX; rx = indexX;
    } else {
        lx = indexX; rx = endX;
    }

    if (indexY > endY) {
        ly = endY; ry = indexY;
    } else {
        ly = indexY; ry = endY;
    }
    return { leftTopPoint_X: lx, leftTopPoint_Y: ly, rightBottomPoint_X: rx, rightBottomPoint_Y: ry }
}

//选择一列
function SelectCol(event) {
    $("#tbLeftHead tr").children(".selrowclass").removeClass("selrowclass");
    $("#tbData tr").children(".selcellclass").removeClass("selcellclass");
    $("#divTopLeft")[0].style.backgroundImage = "url(skins/blue/images/chbg.gif)";
    if (event.srcElement.nodeName.toLocaleLowerCase() != "td") {
        return;
    }
    var r = event.srcElement.cellIndex;
    endX = indexX = r; indexY = 0; endY = document.getElementById("tbData").rows.length - 1;
    var w = 0;
    var cellPos = getCoordinate(tbData.rows[0].childNodes[r], document.getElementById("divMain"));
    for (var i = 0; i < tbData.rows.length; i++) {
        if (w > 0) {
            break;
        }
        cellPos.top = 0;
        cellPos.left = tbData.rows[i].childNodes[r].offsetLeft;
        w = tbData.rows[i].childNodes[r].colSpan == 1 ? tbData.rows[i].childNodes[r].offsetWidth : 0;
    }
    var h = 0;
    for (var i = 0; i < tbData.rows.length; i++) {
        h += tbData.rows[i].childNodes[0].offsetHeight;
    }
    isSelectedCol = true;
    isSelectedRow = false;
    setSelectDiv(cellPos, w, h);
}

//选择一行
function SelectRow(event) {
    $("#tbLeftHead tr").children(".selrowclass").removeClass("selrowclass");
    $("#tbData tr").children(".selcellclass").removeClass("selcellclass");
    $("#divTopLeft")[0].style.backgroundImage = "url(skins/blue/images/chbg.gif)";
    if (event.srcElement.nodeName.toLocaleLowerCase() != "td") {
        return;
    }
    var r = event.srcElement.parentNode.rowIndex;
    indexX = 0; endY = indexY = r; endX = document.getElementById("tbData").rows[r].cells.length - 1;
    var cellPos = getCoordinate(tbData.rows[r].childNodes[0], document.getElementById("divMain"));
    var w = 0;
    for (var i = 0; i < tbTopHead.rows[0].childNodes.length; i++) {
        w += tbTopHead.rows[0].childNodes[i].offsetWidth;
    }
    var h = tbLeftHead.rows[r].childNodes[0].offsetHeight;
    isSelectedRow = true;
    isSelectedCol = false;
    setSelectDiv(cellPos, w, h);
}

//该函数的以下代码用于设置四个方向的单元格选中框的边框线
function setSelectDiv(cellPos, w, h) {
    divWestLine.style.display = divNorthLine.style.display = divEastLine.style.display = divSouthLine.style.display
= ""; //四条边框线可见

    //因为线的层位于数据层内，下面的加减操作主要是获得单元格相对于数据层的坐标
    //cellPos.top -= 69; cellPos.left -= 36;

    //设置西线的位置和高度，宽度默认为1px
    divWestLine.style.top = cellPos.top - 1;
    divWestLine.style.left = cellPos.left - 1;
    divWestLine.style.height = h;

    //设置北线的位置和宽度，高度默认为1px
    divNorthLine.style.top = cellPos.top - 1;
    divNorthLine.style.left = cellPos.left;
    divNorthLine.style.width = w;

    //设置东线的位置和高度（+2是减去重叠区的高度），宽度默认为1px
    divEastLine.style.top = cellPos.top - 1;
    divEastLine.style.left = cellPos.left + w - 1;
    divEastLine.style.height = h + 2;

    //设置南线的位置和宽度，高度默认为1px
    divSouthLine.style.top = cellPos.top + h - 1;
    divSouthLine.style.left = cellPos.left;

    divSouthLine.style.width = w;
}

//重新设置单元格的id属性
var arrBuildChar = (function () {//存储A-Z
    var arrChar = [];
    for (var i = 0; i < 26; i++) {
        arrChar[i] = String.fromCharCode(i + 65);
    }
    return arrChar;
})();

function charFormCode(digit) {
    var cFormChar = [];
    var m = digit % 26;
    var n = parseInt(digit / 26);
    cFormChar.push(arrBuildChar[m]);
    while (n > 0) {
        if (parseInt(n / 26) == 0 && n % 25 != 0) {
            m = (n - 1) % 26;
        } else {
            m = n % 26;
        }
        n = parseInt(n / 26);
        cFormChar.unshift(arrBuildChar[m]);
    }
    return cFormChar.join('');
}

function ResetId() {
    var colsCount = document.getElementById("tbTopHead").rows[0].cells.length;
    var rowsCount = document.getElementById("tbLeftHead").rows.length;
    var oTable = document.getElementById("tbData");
    var oTopTb = document.getElementById("tbTopHead");
    for (var i = 0; i < rowsCount; i++) {
        for (var j = 0; j < colsCount; j++) {
            if (oTable.rows[i].childNodes[j].nodeName != "RAD") {
                var topChar = oTopTb.rows[0].cells[j].id;
                oTable.rows[i].childNodes[j].setAttribute("id", topChar + (i + 1));
                oTable.rows[i].childNodes[j].className = topChar + (i + 1);
                oTable.rows[i].childNodes[j].ClientId = topChar + (i + 1);
            }
        }
    }
}

var table = null;
var cell = null;
table = document.getElementById("tbData");

/******************单元格内容样式设置********************************/
//设置水平方向 上对齐   垂直所有方向对齐方式可优化
//水平对齐设置
function setVAlignL() {
    table = document.getElementById("tbData");
    cell = table.rows[oTdPos.x].cells[oTdPos.y];
    setAllSelectCellStyle("cell.style.textAlign = 'left';");
    setLeft.style.backgroundColor = "darkgoldenrod";
    setRight.style.backgroundColor = "";
    setCenter.style.backgroundColor = "";
    txtEdit.style.textAlign = cell.style.textAlign;
}
function setVAlignR() {
    table = document.getElementById("tbData");
    cell = table.rows[oTdPos.x].cells[oTdPos.y];
    setAllSelectCellStyle("cell.style.textAlign = 'right';");
    //cell.style.textAlign = "right";
    setLeft.style.backgroundColor = "";
    setRight.style.backgroundColor = "darkgoldenrod";
    setCenter.style.backgroundColor = "";
    txtEdit.style.textAlign = cell.style.textAlign;
}
function setVAlignC() {
    table = document.getElementById("tbData");
    cell = table.rows[oTdPos.x].cells[oTdPos.y];
    setAllSelectCellStyle("cell.style.textAlign = 'center';");
    //cell.style.textAlign = "center";
    setLeft.style.backgroundColor = "";
    setRight.style.backgroundColor = "";
    setCenter.style.backgroundColor = "darkgoldenrod";
    txtEdit.style.textAlign = cell.style.textAlign;
}

//设置垂直方向 上对齐   垂直所有方向对齐方式可优化
function setHAlignT() {
    table = document.getElementById("tbData");
    cell = table.rows[oTdPos.x].cells[oTdPos.y];
    setAllSelectCellStyle("cell.style.verticalAlign = 'top';");
    //cell.style.verticalAlign = "top";
    setTop.style.backgroundColor = "darkgoldenrod";
    setBottom.style.backgroundColor = "";
    setMiddle.style.backgroundColor = "";
    txtEdit.style.paddingTop = 0;
}
//设置垂直方向 居中
function setHAlignC() {
    table = document.getElementById("tbData");
    cell = table.rows[oTdPos.x].cells[oTdPos.y];
    setAllSelectCellStyle("cell.style.verticalAlign = 'middle';");
    //cell.style.verticalAlign = "middle";
    setTop.style.backgroundColor = "";
    setBottom.style.backgroundColor = "";
    setMiddle.style.backgroundColor = "darkgoldenrod";
    if (!cell.style.fontSize) {
        cell.style.fontSize = "14px";
    }
    //txtEdit.style.paddingTop = Math.floor((cell.clientHeight - parseInt(cell.style.fontSize)) / 2)+1;
    txtEdit.style.paddingTop = (cell.clientHeight - parseInt(cell.style.fontSize)) / 2;
}
//设置垂直方向 下对齐
function setHAlignB() {
    table = document.getElementById("tbData");
    cell = table.rows[oTdPos.x].cells[oTdPos.y];
    setAllSelectCellStyle("cell.style.verticalAlign = 'bottom';");
    //cell.style.verticalAlign = "bottom";
    setTop.style.backgroundColor = "";
    setBottom.style.backgroundColor = "darkgoldenrod";
    setMiddle.style.backgroundColor = "";
    if (!cell.style.fontSize) {
        cell.style.fontSize = "14px";
    }
    //txtEdit.style.paddingTop =Math.floor(cell.clientHeight - parseInt(cell.style.fontSize))+1;
    txtEdit.style.paddingTop = cell.clientHeight - parseInt(cell.style.fontSize);
}

//设置字体样式
function setFont() {
    table = document.getElementById("tbData");
    cell = table.rows[oTdPos.x].childNodes[oTdPos.y];
    var obj = document.getElementById("Font");
    //cell.style.fontFamily = obj.options[obj.selectedIndex].text;

    setAllSelectCellStyle("cell.style.fontFamily = '" + obj.options[obj.selectedIndex].text + "';");
    txtEdit.style.fontFamily = cell.style.fontFamily;
}
//设置字体大小
function setFontSize() {
    table = document.getElementById("tbData");
    cell = table.rows[oTdPos.x].cells[oTdPos.y];
    var obj = document.getElementById("FontSize");
    setAllSelectCellStyle("cell.style.fontSize = '" + obj.options[obj.selectedIndex].text + "';");
    // cell.style.fontSize = obj.options[obj.selectedIndex].text;
    txtEdit.style.fontSize = cell.style.fontSize;
}
//设置下划线
function setUnderLine() {
    table = document.getElementById("tbData");
    cell = table.rows[oTdPos.x].cells[oTdPos.y];
    if (cell.style.textDecoration != "underline") {
        //cell.style.textDecoration = "underline";
        setAllSelectCellStyle("cell.style.textDecoration = 'underline';");
        setUnderline.style.backgroundColor = "darkgoldenrod";
    } else {
        // cell.style.textDecoration = "";
        setAllSelectCellStyle("cell.style.textDecoration = '';");
        setUnderline.style.backgroundColor = "";
    }
    txtEdit.style.textDecoration = cell.style.textDecoration;
}
//设置字体倾斜
function setItalic() {
    table = document.getElementById("tbData");
    cell = table.rows[oTdPos.x].cells[oTdPos.y];
    if (cell.style.fontStyle != "italic") {
        //cell.style.fontStyle = "italic";
        setAllSelectCellStyle("cell.style.fontStyle = 'italic';");
        setIncline.style.backgroundColor = "darkgoldenrod";
    } else {
        //cell.style.fontStyle = "normal";
        setAllSelectCellStyle("cell.style.fontStyle = 'normal';");
        setIncline.style.backgroundColor = "";
    }
    txtEdit.style.fontStyle = cell.style.fontStyle;

}
//设置字体加粗
function setFontWeight() {
    table = document.getElementById("tbData");
    cell = table.rows[oTdPos.x].cells[oTdPos.y];
    if (cell.style.fontWeight == "bold") {
        //cell.style.fontWeight = "normal";
        setAllSelectCellStyle("cell.style.fontWeight = 'normal';");
        setBlod.style.backgroundColor = "";
    } else {
        // cell.style.fontWeight = "bold";
        setAllSelectCellStyle("cell.style.fontWeight = 'bold';");
        setBlod.style.backgroundColor = "darkgoldenrod";
    }
    txtEdit.style.fontWeight = cell.style.fontWeight;
}
//设置颜色
function selColor(obj, sTag) {
    try {
        var table = document.getElementById("tbData");
        var oSelected = getSelectedObject();
        var rowsCount = oSelected.rightBottomPoint_Y - oSelected.leftTopPoint_Y + 1;
        var colsCount = oSelected.rightBottomPoint_X - oSelected.leftTopPoint_X + 1;
        var cell = table.rows[oTdPos.x].cells[oTdPos.y];
        var oFont = cell;
        var oFont;
        if (rowsCount == 1 && colsCount == 1) {

            if (typeof obj != "undefined") oFont = $id(obj.id);
            var sInitColor = oFont.style.color;
            //    if (sTag == 1) oFont.style.backgroundColor;
            if (sInitColor.length == 0) sColor = dlgHelper.ChooseColorDlg();
            else sColor = dlgHelper.ChooseColorDlg(sInitColor);
            sColor = sColor.toString(16);
            if (sColor.length < 6) {
                var sTempString = "000000".substring(0, 6 - sColor.length);
                sColor = sTempString.concat(sColor);

            }
        } else {
            sColor = dlgHelper.ChooseColorDlg();
            sColor = sColor.toString(16);
            if (sColor.length < 6) {
                var sTempString = "000000".substring(0, 6 - sColor.length);
                sColor = sTempString.concat(sColor);
            }
        }

        if (sTag == 2) {
            var selectedColor = document.getElementById("selectedColor");
            selectedColor.style.backgroundColor = sColor;
            DrawLine(sColor);
            return;
            //oFont.style.borderColor = sColor;
        }
        for (var i = oSelected.leftTopPoint_Y; i <= oSelected.rightBottomPoint_Y; i++) {
            for (var j = oSelected.leftTopPoint_X; j <= oSelected.rightBottomPoint_X; j++) {
                cell = table.rows[i].childNodes[j];
                oFont = cell;
                if (sTag == 0) {
                    oFont.style.color = sColor;
                    txtEdit.style.color = oFont.style.color;
                }
                if (sTag == 1) {
                    //设置文本框的背景颜色
                    oFont.style.backgroundColor = sColor;
                    txtEdit.style.backgroundColor = oFont.style.backgroundColor;
                }
            }
        }
    } catch (e) {
        alert("请选择单元格！");
    }
}

//回填字体样式设置单元格
function callbackCellStyle(cell) {
    var fontStyleObj = document.getElementById("Font");
    var fontSizeObj = document.getElementById("FontSize");
    //回填字体大小
    if (cell.style.fontSize) {
        for (var i = 0; i < fontSizeObj.options.length; i++) {
            if (fontSizeObj.options[i].text == parseInt(cell.style.fontSize)) {
                fontSizeObj.selectedIndex = i;
                break;
            }
        }
    } else {
        fontSizeObj.selectedIndex = 6;
    }
    //回填字体样式
    if (cell.style.fontFamily) {
        for (var i = 0; i < fontStyleObj.options.length; i++) {
            if (fontStyleObj.options[i].text == cell.style.fontFamily) {
                fontStyleObj.selectedIndex = i;
                break;
            }
        }
    } else {
        fontStyleObj.selectedIndex = 0; //"@Fixedsys"
    }
    //回填字体加粗
    if (cell.style.fontWeight == "bold") {
        setBlod.style.backgroundColor = "darkgoldenrod";
    } else {
        setBlod.style.backgroundColor = "";
    }
    //回填斜体
    if (cell.style.fontStyle == "italic") {
        setIncline.style.backgroundColor = "darkgoldenrod";
    } else {
        setIncline.style.backgroundColor = "";
    }
    //回填下划线
    if (cell.style.textDecoration == "underline") {
        setUnderline.style.backgroundColor = "darkgoldenrod";
    } else {
        setUnderline.style.backgroundColor = "";
    }
    //回填水平对齐方式
    switch (cell.style.textAlign) {
        case "left":
            {
                setLeft.style.backgroundColor = "darkgoldenrod";
                setRight.style.backgroundColor = "";
                setCenter.style.backgroundColor = "";
                break;
            }
        case "right":
            {
                setLeft.style.backgroundColor = "";
                setRight.style.backgroundColor = "darkgoldenrod";
                setCenter.style.backgroundColor = "";
                break;
            }
        case "center":
            {
                setLeft.style.backgroundColor = "";
                setRight.style.backgroundColor = "";
                setCenter.style.backgroundColor = "darkgoldenrod";
                break;
            }
        default:
            {
                setLeft.style.backgroundColor = "";
                setRight.style.backgroundColor = "";
                setCenter.style.backgroundColor = "darkgoldenrod";
                break;
            }
    }
    //回填垂直对齐方式

    switch (cell.style.verticalAlign) {
        case "top":
            {
                setTop.style.backgroundColor = "darkgoldenrod";
                setBottom.style.backgroundColor = "";
                setMiddle.style.backgroundColor = "";
                break;
            }
        case "middle":
            {
                setTop.style.backgroundColor = "";
                setBottom.style.backgroundColor = "";
                setMiddle.style.backgroundColor = "darkgoldenrod";
                break;
            }
        case "bottom":
            {
                setTop.style.backgroundColor = "";
                setBottom.style.backgroundColor = "darkgoldenrod";
                setMiddle.style.backgroundColor = "";
                break;
            }
        default:
            {
                setTop.style.backgroundColor = "";
                setBottom.style.backgroundColor = "";
                setMiddle.style.backgroundColor = "darkgoldenrod";
                break;
            }
    }
    //    //回填边框
    //    var selectedColor = document.getElementById("selectedColor");
    //    selectedColor.style.borderColor = cell.style.borderColor;

}

function setAllSelectCellStyle(operateStr) {
    var oSelected = getSelectedObject();
    var rowsCount = oSelected.rightBottomPoint_Y - oSelected.leftTopPoint_Y + 1;
    var colsCount = oSelected.rightBottomPoint_X - oSelected.leftTopPoint_X + 1;
    for (var i = oSelected.leftTopPoint_Y; i <= oSelected.rightBottomPoint_Y; i++) {
        for (var j = oSelected.leftTopPoint_X; j <= oSelected.rightBottomPoint_X; j++) {
            cell = table.rows[i].childNodes[j];
            eval(operateStr);
        }
    }
}
/*******************边框样式设置***************************/
//设置边框
function DrawLine(lineColor) {
    try {
        var showLine = document.getElementById("showLine");
        var key = parseInt(showLine.name);
        var selectedColor = document.getElementById("selectedColor");
        var selectedStyle = document.getElementById("selectedStyle");
        var LineStyle = selectedStyle.style.borderStyle;
        var LineWidth = selectedStyle.style.borderWidth;
        var table = document.getElementById("tbData");
        var oSelected = getSelectedObject();
        var cell;
        if (key == null) {
            key = 1;
        }
        if (lineColor == null) {
            lineColor = selectedColor.style.borderColor;
        }
        for (var i = oSelected.leftTopPoint_Y; i <= oSelected.rightBottomPoint_Y; i++) {
            for (var j = oSelected.leftTopPoint_X; j <= oSelected.rightBottomPoint_X; j++) {
                cell = table.rows[i].childNodes[j];
                switch (key) {
                    case 0: //无边框
                        cell.style.borderWidth = "0em";
                        // cell.style.borderStyle = "";
                        break;
                    case 1: //所有单元格有边框
                        cell.style.borderStyle = LineStyle;
                        cell.style.borderWidth = LineWidth;
                        cell.style.borderColor = lineColor;
                        break;
                    case 2: //所有外层单元格外边有边框大小
                        if (i == oSelected.leftTopPoint_Y) {
                            cell.style.borderTopWidth = LineWidth;
                            cell.style.borderTopColor = lineColor;
                            cell.style.borderTopStyle = LineStyle;

                            cell.style.borderBottomWidth = "0em";
                            cell.style.borderBottomColor = "gray";
                            cell.style.borderBottomStyle = "solid";

                            cell.style.borderLeftWidth = "0em";
                            cell.style.borderLeftColor = "gray"; ;
                            cell.style.borderLeftStyle = "solid";

                            cell.style.borderRightWidth = "0em";
                            cell.style.borderRightColor = "gray";
                            cell.style.borderRightStyle = "solid";
                        }
                        if (i == oSelected.rightBottomPoint_Y) {
                            cell.style.borderBottomWidth = LineWidth;
                            cell.style.borderBottomColor = lineColor;
                            cell.style.borderBottomStyle = LineStyle;

                            if (oSelected.leftTopPoint_Y != oSelected.rightBottomPoint_Y) {
                                cell.style.borderTopWidth = "0em";
                                cell.style.borderTopColor = "gray";
                                cell.style.borderTopStyle = "solid";
                            }

                            cell.style.borderLeftWidth = "0em";
                            cell.style.borderLeftColor = "gray";
                            cell.style.borderLeftStyle = "solid";

                            cell.style.borderRightWidth = "0em";
                            cell.style.borderRightColor = "gray";
                            cell.style.borderRightStyle = "solid";
                        }
                        if (j == oSelected.leftTopPoint_X) {
                            cell.style.borderLeftWidth = LineWidth;
                            cell.style.borderLeftColor = lineColor;
                            cell.style.borderLeftStyle = LineStyle;

                            if (i != oSelected.leftTopPoint_Y && i != oSelected.rightBottomPoint_Y) {
                                cell.style.borderTopWidth = "0em";
                                cell.style.borderTopColor = "gray";
                                cell.style.borderTopStyle = "solid";

                                cell.style.borderBottomWidth = "0em";
                                cell.style.borderBottomColor = "gray";
                                cell.style.borderBottomStyle = "solid";
                            }

                            cell.style.borderRightWidth = "0em";
                            cell.style.borderRightColor = "gray";
                            cell.style.borderRightStyle = "solid";
                        }
                        if (j == oSelected.rightBottomPoint_X) {
                            cell.style.borderRightWidth = LineWidth;
                            cell.style.borderRightColor = lineColor;
                            cell.style.borderRightStyle = LineStyle;

                            if (i != oSelected.leftTopPoint_Y && i != oSelected.rightBottomPoint_Y) {
                                cell.style.borderTopWidth = "0em";
                                cell.style.borderTopColor = "gray";
                                cell.style.borderTopStyle = "solid";

                                cell.style.borderBottomWidth = "0em";
                                cell.style.borderBottomColor = "gray";
                                cell.style.borderBottomStyle = "solid";
                            }
                            if (oSelected.leftTopPoint_X != oSelected.rightBottomPoint_X) {
                                cell.style.borderLeftWidth = "0em";
                                cell.style.borderLeftColor = "gray"; ;
                                cell.style.borderLeftStyle = "solid";
                            }
                        }
                        if (i != oSelected.leftTopPoint_Y && i != oSelected.rightBottomPoint_Y && j != oSelected.leftTopPoint_X && j != oSelected.rightBottomPoint_X) {
                            cell.style.borderWidth = "0em";
                            cell.style.borderStyle = "solid";
                            cell.style.borderColor = "gray";
                        }
                        break;
                    case 5: //有左边框大小
                        if (j == oSelected.leftTopPoint_X) {
                            cell.style.borderTopWidth = "0em";
                            cell.style.borderTopColor = "gray";
                            cell.style.borderTopStyle = "solid";

                            cell.style.borderBottomWidth = "0em";
                            cell.style.borderBottomColor = "gray";
                            cell.style.borderBottomStyle = "solid";

                            cell.style.borderLeftWidth = LineWidth;
                            cell.style.borderLeftColor = lineColor;
                            cell.style.borderLeftStyle = LineStyle;

                            cell.style.borderRightWidth = "0em";
                            cell.style.borderRightColor = "gray";
                            cell.style.borderRightStyle = "solid";
                        } else {
                            cell.style.borderWidth = "0em";
                            cell.style.borderStyle = "solid";
                            cell.style.borderColor = "gray";
                        }
                        break;
                    case 6: //有右边框大小
                        if (j == oSelected.rightBottomPoint_X) {
                            cell.style.borderBottomWidth = "0em";
                            cell.style.borderBottomColor = "gray";
                            cell.style.borderBottomStyle = "solid";

                            cell.style.borderTopWidth = "0em";
                            cell.style.borderTopColor = "gray";
                            cell.style.borderTopStyle = "solid";

                            cell.style.borderLeftWidth = "0em";
                            cell.style.borderLeftColor = "gray";
                            cell.style.borderLeftStyle = "solid";

                            cell.style.borderRightWidth = LineWidth;
                            cell.style.borderRightColor = lineColor;
                            cell.style.borderRightStyle = LineStyle;
                        } else {
                            cell.style.borderWidth = "0em";
                            cell.style.borderStyle = "solid";
                            cell.style.borderColor = "gray";
                        }
                        break;
                    case 3: //有上边框大小
                        if (i == oSelected.leftTopPoint_Y) {
                            cell.style.borderTopWidth = LineWidth;
                            cell.style.borderTopColor = lineColor;
                            cell.style.borderTopStyle = LineStyle;

                            cell.style.borderBottomWidth = "0em";
                            cell.style.borderBottomColor = "gray";
                            cell.style.borderBottomStyle = "solid";

                            cell.style.borderLeftWidth = "0em";
                            cell.style.borderLeftColor = "gray";
                            cell.style.borderLeftStyle = "solid";

                            cell.style.borderRightWidth = "0em";
                            cell.style.borderRightColor = "gray";
                            cell.style.borderRightStyle = "solid";
                        } else {
                            cell.style.borderWidth = "0em";
                            cell.style.borderStyle = "solid";
                            cell.style.borderColor = "gray";
                        }
                        break;
                    case 4: //有下边框大小
                        if (i == oSelected.rightBottomPoint_Y) {
                            cell.style.borderBottomWidth = LineWidth;
                            cell.style.borderBottomColor = lineColor;
                            cell.style.borderBottomStyle = LineStyle;

                            cell.style.borderTopWidth = "0em";
                            cell.style.borderTopColor = "gray";
                            cell.style.borderTopStyle = "solid";

                            cell.style.borderLeftWidth = "0em";
                            cell.style.borderLeftColor = "gray";
                            cell.style.borderLeftStyle = "solid";

                            cell.style.borderRightWidth = "0em";
                            cell.style.borderRightColor = "gray";
                            cell.style.borderRightStyle = "solid";
                        } else {
                            cell.style.borderWidth = "0em";
                            cell.style.borderStyle = "solid";
                            cell.style.borderColor = "gray";
                        }
                        break;
                }
            }
        }
    } catch (e) {
        alert("请选择单元格区域！");
    }

}

function changeBg(srcObject) {
    srcObject.style.backgroundColor = "#DDA0DD";
    //oDiv.style.borderWidth = "1px";
    //oDiv.style.borderStyle = "solid"; 
}
function recoverBg(srcObject) {
    srcObject.style.backgroundColor = "";
    // oDiv.style.borderWidth = "0px";
}
function showBorderStyleDiv(oSetBorder) {
    var selecteBorderStyle = document.getElementById("selectBorderStyle");
    var srcObject = oSetBorder ? oSetBorder : event.srcElement;
    selectBorderStyle.setCapture(false);
    selecteBorderStyle.style.top = srcObject.offsetTop + srcObject.clientHeight + 48;
    selecteBorderStyle.style.left = srcObject.offsetLeft - 50;
    if (selecteBorderStyle.style.display == "none") {
        selecteBorderStyle.style.display = "";
    } else {
        selecteBorderStyle.style.display = "none";
        selectBorderStyle.releaseCapture();
    }
    event.cancelBubble = true;
}

function showSelectedStyle(srcObject) {
    var selectedStyle = document.getElementById("selectedStyle");
    var setLine = document.getElementById("setLine");
    var selecteBorderStyle = document.getElementById("selectBorderStyle");
    var srcObject = event.srcElement;
    if (srcObject.children.length != 0) {
        selectedStyle.style.borderStyle = srcObject.children[0].style.borderStyle;
        selectedStyle.style.borderWidth = srcObject.children[0].style.borderWidth;
        selectedStyle.style.height = srcObject.children[0].style.height;
    } else {
        selectedStyle.style.borderStyle = srcObject.style.borderStyle;
        selectedStyle.style.borderWidth = srcObject.style.borderWidth;
        selectedStyle.style.height = srcObject.style.height;
    }
    selecteBorderStyle.style.display = "none";
    setLine.style.border = "";
    // setLine.style.margin = (parseInt(setLine.style.marginTop) + 1) + "px " + (parseInt(setLine.style.marginLeft) + 1) + "px";
    DrawLine();
    event.cancelBubble = true;
}

function showSelecteBorderLine() {
    var selecteBorderLine = document.getElementById("selecteBorderLine");
    var srcObject = event.srcElement;
    selecteBorderLine.setCapture(false);
    selecteBorderLine.style.top = srcObject.offsetTop + srcObject.clientHeight + 48;
    selecteBorderLine.style.left = srcObject.offsetLeft;
    if (selecteBorderLine.style.display == "none") {
        selecteBorderLine.style.display = "";
    } else {
        selecteBorderLine.style.display = "none";
        selecteBorderLine.releaseCapture();
    }
    event.cancelBubble = true;
}

function showSelectedLine() {
    var selecteBorderLine = document.getElementById("selecteBorderLine");
    var showLine = document.getElementById("showLine");
    var srcObject = event.srcElement;
    var borderKey;
    if (srcObject.children.length != 0) {
        showLine.src = srcObject.children[0].src;
        borderKey = srcObject.children[0].name;
    } else {
        showLine.src = srcObject.src;
        borderKey = srcObject.name;
    }
    selecteBorderLine.style.display = "none";
    showLine.style.border = "";
    showLine.style.margin = (parseInt(showLine.style.marginTop) + 1) + "px " + (parseInt(showLine.style.marginLeft) + 1) + "px";
    DrawLine();
    showLine.name = borderKey;
    event.cancelBubble = true;
    if (borderKey != null) {
        DrawLine(); //当选中了单元格区域时设置边框
    }

}

//同步滚动条动作
function scrollHead() {
    document.getElementById("divTopHead").scrollLeft = event.srcElement.scrollLeft;
    document.getElementById("divLeftHead").scrollTop = event.srcElement.scrollTop;

    SetTextFrame(indexX, indexY, endX, endY);
}

//参数类型转换
var argsType = { 0: "整型", 1: "实数", 2: "字符串", 3: "日期", 4: "时间", 5: "日期时间", 6: "整数组", 7: "实数组", 8: "字符串组" };
function sArgsToEnum(type) {
    for (var sEnum in argsType) {
        if (argsType[sEnum] == type) {
            return sEnum;
        }
    }
    return "2";
}

function enumTosArgs(argEnum) {
    return argsType[argEnum];
}

//数据集转换
var dsArryType = { 0: "SQL", 1: "自定义数据集", 2: "内建数据集", 3: "XML数据集" ,4:"表单数据集"};
function enumToStype(dsEnum) {
    return dsArryType[dsEnum];
}

function sTypeToEnum(dsType) {
    for (var dsEnum in dsArryType) {
        if (dsArryType[dsEnum] == dsType) {
            return dsEnum;
        }
    }
    return "0";
}
/***************************右键菜单**********************************/
function mouseoverEvent() {
    var oSrc = event.srcElement;
    if (oSrc.nodeName.toLocaleLowerCase() == "td") {
        if (oSrc.id == "clearUpStyle" || oSrc.id == "clearUpText")
            oSrc.parentNode.style.backgroundColor = "blanchedalmond";
    }
}

function mouseoutEvent() {
    var oSrc = event.srcElement;
    if (oSrc.nodeName.toLocaleLowerCase() == "td") {
        oSrc.parentNode.style.backgroundColor = "";
    }
}

function selOperate() {
    var oSrc = event.srcElement;
    if (oSrc.nodeName.toLocaleLowerCase() == "td") {
        var operateType = oSrc.id;
        switch (operateType) {
            case "clearUpStyle":
                {
                    DesignEdit.cleanUpStyleOperate(tbData);
                    break;
                }
            case "clearUpText":
                {
                    DesignEdit.cleanUpTextOperate(tbData);
                    break;
                }
        }
    }
    menuDiv.style.display = "none";
}
function showMenu() {
    menuDiv.style.left = event.clientX - 2;
    menuDiv.style.top = event.clientY - 2;
    menuDiv.style.display = "";
    menuDiv.setCapture(false)
}

function cellSelected(t) {
    var regexp = /([A-Z]*)(\d*)/;
    $("#tbLeftHead tr").children(".selrowclass").removeClass("selrowclass");
    $("#tbTopHead tr").children(".seltbToptd").removeClass("seltbToptd");
    $("#divTopLeft")[0].style.backgroundImage = "url(skins/blue/images/chbg.gif)";
    for (var i = 0; i < t.rows.length; i++)   //遍历行
        for (var j = 0; j < t.rows[i].cells.length; j++)//遍历列
        {
            t.rows[i].cells[j].className = t.rows[i].cells[j] == event.srcElement ? 'selcellclass' : '';  //改变背景色
            if(t.rows[i].cells[j] == event.srcElement ) {
                var rowid = t.rows[i].cells[j].id.match(regexp)[2];
                var colid = t.rows[i].cells[j].id.match(regexp)[1];
                document.getElementById(rowid).className = 'selrowclass';
                document.getElementById(colid).className = 'seltbToptd';      }
        }
    }
    function SelectColRow() {
        $("#tbLeftHead tr").children().addClass("selrowclass");
        $("#tbTopHead tr").children().addClass("seltbToptd");
        $("#tbData tr").children().addClass("selcellclass");
        $("#divTopLeft")[0].style.backgroundImage = "url(skins/blue/images/chm.bng)";
    }
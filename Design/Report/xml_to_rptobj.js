
function XmlToReportObj(xnReport, isLoad) {
    var divWestLine = document.getElementById("divWestLine");
    var divNorthLine = document.getElementById("divNorthLine");
    var divEastLine = document.getElementById("divEastLine");
    var divSouthLine = document.getElementById("divSouthLine");
    var txtEdit = document.getElementById("txtEdit");
    var txtMathExp = document.getElementById("txtMathExp");
    divWestLine.style.display = divNorthLine.style.display = divEastLine.style.display = divSouthLine.style.display = txtEdit.style.display = "none";
    txtMathExp.value = "";

    var xnColGroup = xnReport.selectSingleNode("./Table/ColGroup");
    var xnTable = xnReport.selectSingleNode("./Table");
    if (isLoad != null && isLoad == true) {
        document.getElementById("ReportId").value = "";
        document.getElementById('OperationSign').value = "0";
    } else {
        document.getElementById("ReportId").value = xnReport.getAttribute("DbId");
    }
    var iColNum = parseInt(xnTable.getAttribute("ColNum"));

    //回填上顶表格ABC...
    var sbTopTab = new StringBuilder();
    sbTopTab.append('<table id="tbTopHead" class="mainData"  cellpadding="0" cellspacing="0"  height="100%" style="table-layout: fixed;">');
    sbTopTab.append('<tr align="center" style="line-height: 21px;">');
    for (var i = 0; i < iColNum; i++) {
        var sChar = charFormCode(i);
        sbTopTab.append('<td id="' + sChar + '" onmousedown="MouseDown()" style="' + xnColGroup.childNodes[i].getAttribute("Style") + '" onmouseup="MouseUp()" onmousemove="MouseMove(this)">' + sChar + '</td>');
    }
    sbTopTab.append('</tr>');
    sbTopTab.append('</table>');
    document.getElementById("divTopHead").innerHTML = sbTopTab.toString();

    //回填左表格123...
    var iRowNum = parseInt(xnTable.getAttribute("RowNum"));
    var sbLeftTab = sbTopTab.clear();
    var xnTbody = xnReport.selectSingleNode("./Table/Tbody");
    sbTopTab.append('<table id="tbLeftHead" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;">');

    for (var j = 0; j < iRowNum; j++) {
        var sChar = j + 1;
        sbTopTab.append('<tr>');
        sbTopTab.append('<td id="' + sChar + '" onmousedown="MouseDown()" style="' + xnTbody.childNodes[j].getAttribute("Style") + '" onmouseup="MouseUp()" onmousemove="MouseMove(this)">' + sChar + '</td>');
        sbTopTab.append('</tr>');
    }
    sbTopTab.append('</table>');
    document.getElementById("divLeftHead").innerHTML = sbLeftTab.toString();

    //回填设计器表格
    xnTable.setAttribute("class", "mainData");
    xnTable.setAttribute("id", "tbData");
    xnTable.setAttribute("ClientId", xnReport.getAttribute("ClientId"));
    xnTable.setAttribute("ChineseName", xnReport.getAttribute("ChineseName"));
    xnTable.setAttribute("RowNumPerPage", xnReport.getAttribute("RowNumPerPage"));
    xnTable.setAttribute("ColNumPerPage", xnReport.getAttribute("ColNumPerPage"));
    var strTemp = document.getElementById("txtEdit").outerHTML + document.getElementById("divWestLine").outerHTML +
                                      document.getElementById("divNorthLine").outerHTML + document.getElementById("divEastLine").outerHTML + document.getElementById("divSouthLine").outerHTML;

    document.getElementById("divMain").innerHTML = xnTable.xml.replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&").replace(/&nbsp;/g, " ") + strTemp;
    //.replace(/&quot;/g, '"')
    //回填数据源
    window.datasource = xnReport.selectSingleNode("./DataSource").xml;
    //回填全局参数
    window.argsDom = xnReport.selectSingleNode("./Arguments");
    //统计图chartsjson
    window.chartsJson = xnReport.selectSingleNode("./Charts").text;
    //回填自定义样式
    if (xnReport.selectSingleNode("./Style").childNodes.length > 0) {
        window.oCssStyle = xnReport.selectSingleNode("./Style").childNodes[0].xml;
    } else {
        window.oCssStyle = "";
    }
    if (window.chartsJson) {
        window.oCharts.clearChart();
        oCharts.jsonToCharts(window.chartsJson);
    }
    (function () {
        var eIFrame = $("iframe"), len = eIFrame.length, oDig = null;
        while (len--) {
            oDig = eIFrame[len].contentWindow.frameElement.lhgDG;
            if (oDig) {
                oDig.cancel();
            }
        }
    })()
}


//将前台table对象转化为xml对象
function ReportHtmlToXML(oTable) {
    var nDate = new Date();
    var sRptName = oTable.ChineseName || "新报表" + nDate.getYear() + "" + (nDate.getMonth() + 1) + "" + nDate.getDate() + "" + nDate.getHours() + "" + nDate.getMinutes() + "" + nDate.getSeconds();

    var sClientId = oTable.ClientId || nDate.getYear() + "" + (nDate.getMonth() + 1) + "" + nDate.getDate() + " " + nDate.getHours() + "" + nDate.getMinutes() + "" + nDate.getSeconds();
    var sSelectPageType = oTable.SelectPageType || "1";
    var sRowNumPerPage = oTable.RowNumPerPage || "0";
    var sColNumPerPage = oTable.ColNumPerPage || "0";
    var sbRptXml = new StringBuilder();
    sbRptXml.append('<?xml version="1.0" encoding="UTF-8" ?>');
    sbRptXml.append('<RAD><Doc><Data>');
    sbRptXml.append('<Report DbId="' + document.getElementById("ReportId").value + '"  ClientId="' + sClientId + '"  ChineseName="' + sRptName + '"  SelectPageType = "' + sSelectPageType + '"  RowNumPerPage ="' + sRowNumPerPage + '"  ColNumPerPage = "' + sColNumPerPage + '">');
    sbRptXml.append('<Table  RowNum="' + oTable.rows.length + '" ColNum="' + oTable.rows[0].childNodes.length + '">');

    var oColGroup = oTable.firstChild; //ColGroup节点
    sbRptXml.append("<ColGroup>");
    for (var j = 0, len = oColGroup.childNodes.length; j < len; j++) {
        var vContentType = oColGroup.childNodes[j].VContentRegionType || "3";
        sbRptXml.append('<Col Style="' + oColGroup.childNodes[j].style.cssText + '" VContentRegionType ="' + vContentType + '"/>');

    }
    sbRptXml.append("</ColGroup>");

    sbRptXml.append('<Tbody>');
    for (var i = 0; i < oTable.rows.length; i++) {
        var hContentType = oTable.rows[i].HContentRegionType || "3";
        sbRptXml.append('<Tr Style="height:' + oTable.rows[i].style.height + '" HContentRegionType ="' + hContentType + '" Class="Tr' + i + '">');
        for (var j = 0, len = oTable.rows[i].childNodes.length; j < len; j++) {
            var oCell = oTable.rows[i].childNodes[j];

            if (oCell.nodeName.toLowerCase() == "td") {
                var Id = oCell.id || oCell.className;
                sbRptXml.append('<Td ClientId="' + Id + '" ColSpan="' + oCell.colSpan + '" RowSpan="' + oCell.rowSpan + '" Style="' + oCell.style.cssText + '"');

                var sDataValue = oCell.DataValue || "";
                var sDataExp = oCell.DataExp || "";
                var sCellInnerText = oCell.innerText.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
                sCellInnerText = sCellInnerText.replace(/\"/mg, function (sMatch) {
                    return sMatch.replace(sMatch, "&quot;");
                });
                if (sDataValue != "") {
                    sDataValue = sCellInnerText;
                } else if (sDataExp != "") {
                    sDataExp = sCellInnerText;
                } else {
                    sDataValue = sCellInnerText; //都空默认给数据值
                }

                sbRptXml.append(' DataExp="' + sDataExp + '"');
                sbRptXml.append(' DataValue="' + sDataValue + '"');
                var sDisplayValue = oCell.DisplayValue || "";
                sbRptXml.append(' DisplayValue="' + sDisplayValue + '"');

                var sDisplayExp = oCell.DisplayExp || "";
                sDisplayExp = sDisplayExp.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
                sDisplayExp = sDisplayExp.replace(/\"/mg, function (sMatch) {
                    return sMatch.replace(sMatch, "&quot;");
                });
                sbRptXml.append(' DisplayExp="' + sDisplayExp + '"');

                var sStartCol = oCell.StartCol || "";
                sbRptXml.append(' StartCol="' + sStartCol + '"');

                var sEndCol = oCell.EndCol || "";
                sbRptXml.append(' EndCol="' + sEndCol + '"');

                var sStartRow = oCell.StartRow || "";
                sbRptXml.append(' StartRow="' + sStartRow + '"');

                var sEndRow = oCell.EndRow || "";
                sbRptXml.append(' EndRow="' + sEndRow + '"');

                var sDisplayFormatType = oCell.DisplayFormatType || "1"; //默认数值型
                sbRptXml.append(' DisplayFormatType="' + sDisplayFormatType + '"');

                var sDisplayString = oCell.DisplayString || "";
                sDisplayString = sDisplayString.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
                sDisplayString = sDisplayString.replace(/\"/mg, function (sMatch) {
                    return sMatch.replace(sMatch, "&quot;");
                });
                sbRptXml.append(' DisplayString="' + sDisplayString + '"');

                var sExtensible = oCell.Extensible || "0"; //默认不扩展
                sbRptXml.append(' Extensible="' + sExtensible + '"');

                var sIsExt = oCell.IsExt || "0"; //默认为非扩展单元格
                sbRptXml.append(' IsExt="' + sIsExt + '"');

                var sLeftCell = oCell.LeftCell || "";
                sbRptXml.append(' LeftCell="' + sLeftCell + '"');

                var sTopCell = oCell.TopCell || "";
                sbRptXml.append(' TopCell="' + sTopCell + '"');

                var sChildCell = oCell.ChildCells || "";
                sbRptXml.append(' ChildCells="' + sChildCell + '"');

                var sIsPaginatingAfterRow = oCell.IsPaginatingAfterRow || "";
                sbRptXml.append(' IsPaginatingAfterRow="' + sIsPaginatingAfterRow + '"');

                var sIsPaginatingAfterCol = oCell.IsPaginatingAfterCol || "";
                sbRptXml.append(' IsPaginatingAfterCol="' + sIsPaginatingAfterCol + '"');

                var sClass = oCell.className || oCell.id;
                //sbRptXml.append(' Class="' + sClass + '"');
                sbRptXml.append(' Class="' + sClass + '"');

                var sCellDisplayType = oCell.CellDisplayType || "0";
                sbRptXml.append(' CellDisplayType="' + sCellDisplayType + '"');

                var sVContentRegionType = oTable.rows[i].childNodes[j].VContentRegionType || oColGroup.childNodes[j].VContentRegionType || "3";
                sbRptXml.append(' VContentRegionType="' + sVContentRegionType + '"');

                var sHContentRegionType = oTable.rows[i].childNodes[j].HContentRegionType || oColGroup.childNodes[j].HContentRegionType || "3";
                sbRptXml.append(' HContentRegionType="' + sHContentRegionType + '"');

                sbRptXml.append(' Merge="' + (i + 1) + ',' + (j + 1) + '-' + (i + parseInt(oCell.rowSpan)).toString() + ',' + (j + parseInt(oCell.colSpan)).toString() + '">' + sCellInnerText + '</Td>');

            } else {
                sbRptXml.append('<RAD/> ');
            }
        }
        sbRptXml.append('</Tr>');
    }
    sbRptXml.append('</Tbody>');
    sbRptXml.append('</Table>');
    sbRptXml.append(window.datasource == undefined ? "<DataSource></DataSource>" : window.datasource);
    if (window.argsDom != null && window.argsDom.xml != "") {
        sbRptXml.append(window.argsDom.xml);
    } else {
        sbRptXml.append("<Arguments></Arguments>");
    }
    sbRptXml.append("<Style>");
    sbRptXml.append(window.oCssStyle);
    sbRptXml.append("</Style>");
    sbRptXml.append("<RuntimeStyle/>");
    sbRptXml.append("<Charts>");
    sbRptXml.append(window.oCharts.chartsToJSON());
    sbRptXml.append("</Charts>");
    sbRptXml.append('</Report>');
    sbRptXml.append('</Data><Result><ResCode>0</ResCode><ResDetail/></Result></Doc></RAD>');
    var xmlDoc = new createXMLDOM();
    xmlDoc.loadXML(sbRptXml.toString());
    return xmlDoc;
}
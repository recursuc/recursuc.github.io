/*
* 版本 :2.1
* 维护者: 陈文
* 最近维护日期: 2010.3.10
* webgrid操作脚本
*/

/*
* 当前位置添加行（obj：）
*/
function gridAddCurrRow(gridId) {
    publicform.webgridObj[gridId].gridObj.addRow(-parseInt(publicform.webgridObj[gridId].gridObj.getUID()), '', publicform.webgridObj[gridId].gridObj.getRowIndex(publicform.webgridObj[gridId].gridObj.getSelectedId()));
}

/*
* 表格最后添加行（obj：）
*/
function gridAddLastRow(gridId) {
    publicform.webgridObj[gridId].gridObj.addRow(-parseInt(publicform.webgridObj[gridId].gridObj.getUID()), '');
}

/*
* 删除选中行（obj：）
*/
function gridDeleteSelRow(gridId) {
    if (publicform.webgridObj[gridId].gridObj.getSelectedRowId() && publicform.webgridObj[gridId].gridObj.getSelectedRowId().toString().substring(0, 1) != "-") {
        document.getElementById(gridId).DelRowsId += publicform.webgridObj[gridId].gridObj.getSelectedRowId() + ",";
    }
    publicform.webgridObj[gridId].gridObj.deleteSelectedRows();
}

/*
* 删除标记行（obj：）
*/
function gridDeleteTaglineRow(obj) {

}

function DataSource() {
    this.DataSets = [];
}

DataSource.prototype.serializeXml = function () {
    var sXml = '<DataSource>';
    for (var i = 0; i < this.DataSets.length; ++i) {
        sXml += this.DataSets[i].serializeXml();
    }
    return sXml + '</DataSource>';
};
function DataSet() {
    this.DbId = "";
    this.Name = "";
    this.DataTablePrefix = "";
    this.Type = "";
    this.State = "";
    this.ConnString = "";
    this.MainTable = null;
    this.DataTables = [];
}

DataSet.prototype.serializeXml = function () {
    var sXml = '<DataSet DbId="' + this.DbId + '" Name="' + this.Name + '" DataTablePrefix="' + this.DataTablePrefix + '" Type="' + this.Type
    + '" State="' + this.State + '" MainTable="' + this.MainTable + '" ConnString="' + this.ConnString + '">';
    for (var i = 0; i < this.DataTables.length; i++) {
        sXml += this.DataTables[i].serializeXml();
    }
    return sXml + '</DataSet>';
};

function DataTable() {
    this.DbId = "";
    this.ClientId = "";
    this.Name = "";
    this.OwnerName = "";
    this.TableName = "";
    this.UniqueIndexColumn = "";
    this.RedundanceColumns = "";
    this.IsMain = "";
    this.RelationType = "";
    this.RelationColumns = "";
    this.FilterSql = "";
    this.ParentDataTableClientId = "";
    this.ParentDataTable = "";

    this.Sql = "";
    this.DataTablePrefix = "";

    this.DataColumns = [];
}

DataTable.prototype.serializeXml = function () {
    var sXml = '<DataTable DbId="' + this.DbId + '" ClientId="' + this.ClientId + '" Name="' + this.Name
    + '" OwnerName="' + this.OwnerName + '" TableName="' + this.TableName
    + '" UniqueIndexColumn="' + this.UniqueIndexColumn + '" IsMain="' + this.IsMain
    + '" RelationType="' + this.RelationType + '" RelationColumns="' + this.RelationColumns + '" RedundanceColumns="' + this.RedundanceColumns
    + '" FilterSql="' + this.FilterSql + '" ParentDtClientId="' + this.ParentDataTableClientId
    + '" Style="" Sql="' + this.Sql + '"><Columns>';
    for (var i = 0; i < this.DataColumns.length; i++) {
        sXml += this.DataColumns[i].serializeXml();
    }
    return sXml + '</Columns></DataTable>';
};
function DataColumn() {
    this.DbId = "";
    this.Name = "";
    this.ColumnName = "";
    this.AnotherName = "";
    this.DataType = "";
    this.Length = "";
    this.IsCheck = "";

    this.ParentDataTable = null;
}

DataColumn.prototype.serializeXml = function () {
    var sXml = '<Column DbId="' + this.DbId + '" Name="' + this.Name + '" AnotherName="' + this.AnotherName
    + '" ColumnName="' + this.ColumnName + '" DataType="' + this.DataType + '" Length="' + this.Length + '" />';
    return sXml;
};


function extend(fnSubClass, fnSuperClass) {
    var F = function () { };
    F.prototype = fnSuperClass.prototype;
    fnSubClass.prototype = new F();
    fnSubClass.prototype.constructor = fnSubClass;

    fnSubClass.superClass = fnSuperClass.prototype;
    if (fnSuperClass.prototype.constructor == Object.prototype.constructor) {
        fnSuperClass.prototype.constructor = fnSuperClass;
    }
}

function DS(sName, sDsType, sId) {
    this.sDsType = sDsType || "";
    this.sName = sName || "";
    this.sId = sId || "";
}
DS.prototype = {
};

function SqlDS(sName, sDsType, sId, sSql, oSqlArgs, oDataSet) {
    this.sSql = "";
    this.oSqlArgs = oArgs || null;
    this.oDataSet = null;
    DS.call(this, sName, sDsType, sId);
}
SqlDS.prototype = {};
extend(SqlDS, DS);

function BulidInDS(sName, sDsType, sId, oTable) {
    this.oDsTable = oTable;
}
BulidInDS.prototype = {};
extend(BulidInDS, DS);

function CustomDS(sClassName, oArgs) {
    this.oDsArgs = oArgs || null;
    this.sClassFullName = sClassName || "";  //外接扩展程序用于创建DataSet对象的类名
}
CustomDS.prototype = {};
extend(CustomDS, DS);

function XmlDS(sFilePath) {
    this.fileName = "";
    this.sFilePath = sFilePath;
}
XmlDS.prototype = {};
extend(XmlDS, DS);



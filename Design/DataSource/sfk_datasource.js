/*
通用数据源对象 zouchao 2012-09-03
*/

(function (win, doc) {
    var DataSet = $C.Create({
        initialize: function (options) {
            this.DbId = options.id || "id";
            this.DataTablePrefix = options.dtPrefix || "";
            this.Type = options.type || "0";
            this.State = options.state || "";
            this.ConnString = options.connstring || "";
            this.MainTable = options.maintable || null;
            this.Name = options.name || "DefaultDataSet";
            this.DataTables = options.datatables || [];
        },
        setOptions: function (options) {

        },
        serializeXml: function () {
            var sb = new StringBuilder();
            sb.append("<DataSet DbId='" + this.DbId + "' Name='" + this.Name + "' DataTablePrefix='" + this.DataTablePrefix + "' Type='" + this.Type
                    + "' State='" + this.State + "' MainTable='" + this.MainTable + "' ConnString='" + this.ConnString + "'>");

            for (var i = 0, len = this.DataTables.length; i < len; i++) {
                sb.append(this.DataTables[i].serializeXml());
            }
            sb.append("</DataSet>");
            return sb.toString();
        },
        getSpecifyDt: function (dtName) {
            var odataTables = null;
            for (var i = 0, len = this.DataTables.length; i < len; i++) {
                if (this.DataTables[i].TableName.toLowerCase() == dtName.toLowerCase()) {
                    odataTables = this.DataTables[i];
                    break;
                }
            }
            return odataTables;
        },
        getHeString: function () {
            return "<option value='" + this.Name + "'>" + this.Name + "</option>";
        },
        createDataTable: function () {
            return new DataTable();
        }
    }, true),
    DataTable = $C.Create({
        initialize: function (options) {
            this.DbId = "";
            this.ClientId = "";
            this.Name = options.name || "DefaultDataTable";
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
            this.DataColumns = options.datacolumns || [];
        },
        setOptions: function (options) {

        },
        serializeXml: function () {
            var sb = new StringBuilder();
            sb.append("<DataTable DbId='" + this.DbId + "' ClientId='" + this.ClientId + "' Name='" + this.Name
                    + "' OwnerName='" + this.OwnerName + "' TableName='" + this.TableName
                    + "' UniqueIndexColumn='" + this.UniqueIndexColumn + "' IsMain='" + this.IsMain
                    + "' RelationType='" + this.RelationType + "' RelationColumns='" + this.RelationColumns + "' RedundanceColumns='" + this.RedundanceColumns
                    + "' FilterSql='" + this.FilterSql + "' ParentDtClientId='" + this.ParentDataTableClientId
                    + "' Style='' Sql='" + this.Sql + "'>");

            sb.append("<Columns>")
            for (var i = 0, len = this.DataColumns.length; i < len; i++) {
                sb.append(this.DataColumns[i].serializeXml());
            }
            sb.append("</Columns></DataTable>");
            return sb.toString();
        },
        getHeString: function () {
            return "<option value='" + this.Name + "'>" + this.Name + "</option>";
        },
        createDataColumn: function () {
            return new DataColumn();
        }
    }, true),
    DataColumn = $C.Create({
        initialize: function (options) {
            this.DbId = "";
            this.Name = options.name || "DefaultDataColumn";
            this.ColumnName = "";
            this.AnotherName = "";
            this.DataType = "";
            this.Length = "";
            this.IsCheck = "";
            this.ParentDataTable = null;
        },
        setOptions: function (options) {

        },
        serializeXml: function () {
            var sb = new StringBuilder();
            sb.append("<Column DbId='" + this.DbId + "' Name='" + this.Name + "' AnotherName='" + this.AnotherName + "' ColumnName='" + this.ColumnName + "' DataType='" + this.DataType + "' Length='" + this.Length + "'/>");
            return sb.toString();
        },
        getHeString: function () {
            return "<option value='" + this.Name + "'>" + this.Name + "</option>";
        }
    }, true),
    DataSource = $C.Create({
        initialize: function (options) {
            this.name = options.name || "DefaultDataSource";
            this.DataSets = options.datasets || [];
        },
        setOptions: function (options) {

        },
        serializeXml: function () {
            var sb = new StringBuilder();
            sb.append("<DataSource>");
            for (var i = 0, len = this.DataSets.length; i < len; i++) {
                sb.append(this.DataSets[i].serializeXml());
            }
            sb.append("</DataSource>");
            return sb.toString();
        },
        getSpecifyDs: function (dsName) {
            var odataSets = null;
            for (var i = 0, len = this.DataSets.length; i < len; i++) {
                if (this.DataSets[i].Name.toLowerCase() == dsName.toLowerCase()) {
                    odataSets = this.DataSets[i];
                    break;
                }
            }
            return odataSets;
        },
        getDsByType: function (type) {
            var odataSets = [],
                dsType = type || "0";

            for (var i = 0, len = this.DataSets.length; i < len; i++) {
                if (this.DataSets[i].Type == dsType) {
                    odataSets.push(this.DataSets[i]);
                }
            }
            return odataSets;
        },
        createDataSet: function () {
            return new DataSet();
        }
    }, true);

    window.DataSource = DataSource;
})(window, document);
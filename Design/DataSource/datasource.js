function DataSource() {
	this.DataSets = [];
}
DataSource.prototype.getDsByType = function(type) {
	var odataSets = [], dsType = type || "0";
	for ( var i = 0, len = this.DataSets.length; i < len; i++) {
		if (this.DataSets[i].Type == dsType) {
			odataSets.push(this.DataSets[i]);
		}
	}
	return odataSets;
};
DataSource.prototype.IsExist = function(dsId) {
	var exist = false;
	for ( var i = 0, len = this.DataSets.length; i < len; i++) {
		if (this.DataSets[i].DbId == dsId) {
			exist = true;
			break;
		}
	}
	return exist;
};
DataSource.prototype.getSpecifyDs = function(dsId) {
	var odataSets = null;
	for ( var i = 0, len = this.DataSets.length; i < len; i++) {
		if (this.DataSets[i].DbId == dsId) {
			odataSets = this.DataSets[i];
			break;
		}
	}
	return odataSets;
};
DataSource.prototype.serializeXml = function() {
	var sXml = '<datasource>';
	for ( var i = 0; i < this.DataSets.length; i++) {
		sXml += DataSet.prototype.serializeXml.apply(this.DataSets[i]);
	}
	return sXml + '</datasource>';
};
DataSource.prototype.createDataSet = function() {
	return new DataSet();
};
DataSource.prototype.createDataTable = function() {
	return new DataTable();
};
DataSource.prototype.createDataColumn = function() {
	return new DataColumn();
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
DataSet.prototype.serializeXml = function() {
	var sXml = '<dataset id="' + this.DbId + '" name="' + this.Name
			+ '" datatableprefix="' + this.DataTablePrefix + '" type="'
			+ this.Type + '" state="' + this.State + '" maintable="'
			+ this.MainTable + '" connstring="' + this.ConnString + '">';
	for ( var i = 0; i < this.DataTables.length; i++) {
		sXml += DataTable.prototype.serializeXml.apply(this.DataTables[i]);
	}
	return sXml + '</dataset>';
};
DataSet.prototype.getHeString = function() {
	return "<option value='" + this.DbId + "'>" + this.Name + "</option>";
};
DataSet.prototype.getSpecifyDt = function(cid) {
	var odataTables = null;
	for ( var i = 0, len = this.DataTables.length; i < len; i++) {
		if (this.DataTables[i].ClientId == cid) {
			odataTables = this.DataTables[i];
			break;
		}
	}
	return odataTables;
};
DataSet.prototype.getColumnFields = function() {
	var columns = [], xmlDoc = $X.createBase('<Operation value="' + this.DbId + '"/>');
	
	$R({
		type : "post",
		url : "datasourceAction!getDsColName",
		async : false,
		success : function(xhr) {
			var returnAjaxValue = xhr.responseXML.selectSingleNode("RAD/Doc/Result/ResCode").text;
			if (returnAjaxValue != "0") {
				alert(xhr.responseXML.selectSingleNode("RAD/Doc/Result/ResDetail").text);
			} else {
				var cols = xhr.responseXML.selectSingleNode("RAD/Doc/Data/Cols");
				for ( var i = 0, len = cols.childNodes.length; i < len; i++) {
					if (cols.childNodes[i].nodeType == "1") {
						var column = new DataColumn();
						column.Name = cols.childNodes[i].text;
						columns.push(column);
					}
				}
			}
		},
		failure : function(xhr) {
			alert('Failure: ' + xhr.status);
		},
		data : xmlDoc,
		contentType : "text/xml"
	});
	return columns;
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
DataTable.prototype.serializeXml = function() {
	var sXml = '<datatable id="' + this.DbId + '" cid="' + this.ClientId
			+ '" name="' + this.Name + '" ownername="' + this.OwnerName
			+ '" tablename="' + this.TableName + '" uniqueindexcolumn="'
			+ this.UniqueIndexColumn + '" ismain="' + this.IsMain
			+ '" relationtype="' + this.RelationType + '" relationcolumns="'
			+ this.RelationColumns + '" redundancecolumns="'
			+ this.RedundanceColumns + '" filtersql="' + this.FilterSql
			+ '" parentdtclientid="' + this.ParentDataTableClientId
			+ '" style="" sql="' + this.Sql + '"><columns>';
	for ( var i = 0; i < this.DataColumns.length; i++) {
		sXml += DataColumn.prototype.serializeXml.apply(this.DataColumns[i]);
	}
	return sXml + '</columns></datatable>';
};
DataTable.prototype.getHeString = function() {
	return "<option value='" + this.ClientId + "'>" + this.TableName
			+ "</option>";
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
DataColumn.prototype.serializeXml = function() {
	var sXml = '<column id="' + this.DbId + '" name="' + this.Name
			+ '" anothername="' + this.AnotherName + '" columnname="'
			+ this.ColumnName + '" datatype="' + this.DataType + '" length="'
			+ this.Length + '" />';
	return sXml;
};
DataColumn.prototype.getHeString = function() {
	return "<option value='" + this.Name + "'>" + this.Name + "</option>";
};

function extend(fnSubClass, fnSuperClass) {
	var F = function() {
	};
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
DS.prototype = {};

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
	this.sClassFullName = sClassName || ""; // 外接扩展程序用于创建DataSet对象的类名
}
CustomDS.prototype = {};
extend(CustomDS, DS);

function XmlDS(sFilePath) {
	this.fileName = "";
	this.sFilePath = sFilePath;
}
XmlDS.prototype = {};
extend(XmlDS, DS);

function selectChange(type, pId, subId, hasDefultOption) {
	var pObj = document.getElementById(pId), subObj = document.getElementById(subId), hasDefault = hasDefultOption || true, 
	dType = type || "dataset", data = null;

	switch (dType.toLowerCase()) {
	case "dataset":
		curDs = DataSource.prototype.getSpecifyDs.apply(datasource,[pObj.options[pObj.selectedIndex].value]);
		if(document.getElementById("IsQueryList") && document.getElementById("IsQueryList").value == "query"){
			data = curDs ? DataSet.prototype.getColumnFields.apply(curDs,[]) : [];
			subObj = document.getElementById("datacolumn");
			cascade(data, subObj, hasDefault);
		}
		else{
			data = curDs && curDs.DataTables || [];
			cascade(data, subObj, hasDefault);
			selectChange('datatable', 'datatable', 'datacolumn');
		}
		break;
	case "datatable":
		curDt = curDs && curDs.getSpecifyDt(pObj.options[pObj.selectedIndex].value);
		data = curDt && curDt.DataColumns || [];
		cascade(data, subObj, hasDefault);
		break;
	}
}

function TableSelectInit(pId, subId) {
	var hasDefultOption = 'table';
	var pObj = document.getElementById(pId), subObj = document
			.getElementById(subId), hasDefault = true;

	if (pObj.value == "null") {
		curDs = [];
	} else {
		curDs = datasource.getSpecifyDs(pObj.options[pObj.selectedIndex].value)
	}

	var data = curDs && curDs.DataTables || [];
	cascade(data, subObj, hasDefultOption);
}

function ColumnSelectInit(pId, subId) {
	var hasDefultOption = 'column';
	var pObj = document.getElementById(pId), subObj = document
			.getElementById(subId), hasDefault = true;
	if (document.getElementById("dataset").value == "null") {
		curDs = [];
	} else {
		curDs = datasource
				.getSpecifyDs(document.getElementById("dataset").options[document
						.getElementById("dataset").selectedIndex].value);
	}

	var datas = curDs && curDs.DataTables || [];
	cascade(datas, subObj, hasDefultOption);

	if (pObj.value == "null") {
		curDt = [];
	} else {
		curDt = curDs.getSpecifyDt(pObj.options[pObj.selectedIndex].value);
	}
	var data = curDt && curDt.DataColumns || [];
	cascade(data, subObj, hasDefultOption);
}

function cascade(data, subObj, hasDefultOption) {
	var shtml = "";
	if (data && subObj) {
		if (hasDefultOption) {
			shtml += "<option value=''>---请选择---</option>";
		}
		for ( var i = 0, len = data.length; i < len; i++) {
			shtml += (data[i] && data[i].getHeString() ? data[i].getHeString()
					: "");
		}
		subObj.innerHTML = shtml;
	}
}

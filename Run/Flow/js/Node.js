//*************************************************************
// 功能描述： 流程属性
// 参数描述： 无
//-------------------------------------------------------------
function FlowAttributes()
{
	this.FlowName = "";
	this.Remark = "";

	// 以下废弃
	this.RelatingFormID = "";
	this.IsUseRule = false;
	this.RelatingFormType = ""; // 表单类别，临时属性
}

//*************************************************************
// 功能描述： 节点属性
// 参数描述： 无
//-------------------------------------------------------------
function NodePropertys() {
    this.BusiFormId = "";
	this.Name = "";
	this.HandlerProject = "";
	this.HandlerNames = "";
	this.RespondLimit = 0;
	this.DisposalLimit = 0;
	this.WarningLimit = 0;
	this.EndLimit = 0;
	this.Permissions = new Array();
	
	this.AllowRollback = false;
	this.AllowDelay = false;
	this.AllowSupervise = false;
	this.AllowJump = false;
	this.AllowContinueJump = false;
	this.UnionNumber = "";
	this.UnionLeader = "";
	this.UnionLeaderName = "";
	this.IsDefaultStartNode = false;
	this.IsStartNode = false;
	this.IsEndNode = false;
	
	// 环节所挂的页面
	this.PageForEdit = "";
	this.PageForView = "";
	this.PageForEditSize = "";
	this.PageForViewSize = "";
	
	//外接节点调用Web服务
    this.WsUrl = "";
    this.WsMethod = "";
	
	this.IsAutoTurn = false;
	this.NodeConditions = new Array();
	this.TaskCollections = new Array();
}

//*************************************************************
// 功能描述： 条件流向属性对象
// 参数描述： 无
//-------------------------------------------------------------
function NodeCondition()
{
	this.NodeIdentify = -1;
	this.NodeName = "";
	this.IsDefault = false;
	this.ConditionNote = "";
	this.ConditionName = "";
	this.Conditions = new Array;
}


//*************************************************************

//功能描述：

//

//-------------------------------------------------------------
/*
function CreateCondition(cName, cId, cIndex, cBsForm, cForm, cControl, cSigle, cOpenation, cRelation) {

    var Condition = new Object;
    Condition.CName = cName;
    Condition.CId = cId;
    Condition.CIndex = cIndex;
    Condition.CBsFormId = cBsForm[0];
    Condition.CBsFormName = cBsForm[1];
    Condition.CFormId = cForm[0];
    Condition.CFormName = cForm[1];
    Condition.CControlName = cControl[1];
    Condition.CControlId = cControl[0];
    Condition.CLeftSigle = cSigle[0];
    Condition.CRightSigle = cSigle[1];
    Condition.COperation = cOpenation;
    Condition.CRelation = cRelation;
    return Condition;
}
*/
//*************************************************************

//功能描述：条件表达式类

//参数描述：无

//-------------------------------------------------------------
function Condition() {

   // this.ConditionName = "";
   // this.ConditionId = "";
    this.Serialid = 0;
    this.BusiFormId = "";
    this.BusiFormName = "";
    this.FormId = "";
    this.FormName = "";
    this.ControlName = "";
    this.ControlId = "";
    this.LeftSigle = "";
    this.RightSigle = "";
    this.Operation = "";
    this.ConditionValue = "";
    this.ConditionRelation = "";
    
    }

    //*************************************************************

    //功能描述：表单状态类

    //参数描述：无

    //-------------------------------------------------------------
    function FormState() {
        this.SerialId = 0;
        this.FormType = "";
        this.FormId = "";
        this.FormName = "";
        this.MainTable = "";
        this.FormStateId = "";
        this.FormStateName = "";
        this.FormDataState = "";
        this.FormDataStateName = "";
        this.IsButtonForm = 0;
        this.NodeDataState = "";
        this.NodeDataStateName = "";
        this.FormAlias = "";
    }
//*************************************************************
// 功能描述： 任务属性
// 参数描述： 无
//-------------------------------------------------------------
function TaskInfo()
{
	this.ID = "";
	this.ContentRemark = "";
}

//*************************************************************
// 功能描述： 流转条件
// 参数描述： 无
//-------------------------------------------------------------
function FlowCondition()
{
}


//*************************************************************
// 功能描述： 切换Tab页
// 参数描述： 无
//-------------------------------------------------------------
var oldObjTabName = "";
function ChangeTab(strTabName)
{
	if( oldObjTabName != "" )
	{
		document.getElementById(oldObjTabName + "1").src = "../images/sub_uncur_left.gif";
		document.getElementById(oldObjTabName).background = "../images/sub_uncur_bg.gif"
		document.getElementById(oldObjTabName + "3").src = "../images/sub_uncur_right.gif";
		document.getElementById("Table" + oldObjTabName).style.display = "none";
	}

	document.getElementById(strTabName + "1").src = "../images/sub_cur_left.gif";
	document.getElementById(strTabName).background = "../images/sub_cur_bg.gif"
	document.getElementById(strTabName + "3").src = "../images/sub_cur_right.gif";
	oldObjTabName = strTabName;
	document.getElementById("Table" + strTabName).style.display = "block";
}

//*************************************************************
// 功能描述： 设置处理人
// 参数描述： 无
//-------------------------------------------------------------
function SetTextValue()
{
//	switch (document.all.SelectDealMan.value)
//	{
//	    case "submiter":
//	        document.all.TxtDealMan.value = "#Submiter#";
//	        document.all.txtUser.value = "当前用户";
//	        break;
//	    case "user":
//	        var strReturn = ShowUsersDialog(document.all.TxtDealMan.value);
//	        if (strReturn) {
//	            if (strReturn != "") {
//	                document.all.TxtDealMan.value = strReturn.split('@')[0];
//	                document.all.txtUser.value = strReturn.split('@')[1];
//	            }
//	        }
//	        break;
//	    case "":
//	        document.all.TxtDealMan.value = "";
//	        document.all.txtUser.value = "";
//	        break;
    //	}

    var strReturn = ShowUsersDialog(document.all.TxtDealMan.value);
    if (strReturn) {
        if (strReturn != "") {
            document.all.TxtDealMan.value = strReturn.split('@')[0];
            document.all.txtUser.value = strReturn.split('@')[1];
        }
    }
}

//*************************************************************
// 功能描述： 显示用户/角色对话框
// 参数描述： 无
//-------------------------------------------------------------
function ShowUsersDialog(strHandler)
{
	var strReturn = window.showModalDialog("UsersRoles.aspx?Handler=" + strHandler, window, "dialogHeight:485px; dialogWidth:300px;help:no;center:yes;status:no;resizable:no;location:yes;scroll:no;dialogLeft:260;dialogTop:353");

	return strReturn;
}

//----------------------------------------------
//函数：SetAllRecord
//功能：选择或不选择记录
//参数：Null
//----------------------------------------------
var b_Allchecked = false;
function SetAllRecord()
{	
	if( b_Allchecked == false )
	{
		b_Allchecked = true;
		document.datafrm.imgSelect.src = "../../images/all_select.gif";
	}
	else
	{
		b_Allchecked = false;
		document.datafrm.imgSelect.src = "../../images/none_select.gif";
	}
	if( document.datafrm.strPKey.length )
	{
		for( var i = 1; i < document.datafrm.strPKey.length; i++ )
		{			
			document.datafrm.strPKey[i].checked = b_Allchecked;
		}
	}
}

// 获取流程所关联表单的权限字符串
function GetPermissionString()
{
	var strPermissions = "";
	var objTabPermission = document.all("formState");
	var objTabDataState = document.all("formDataState");
	if (objTabPermission) {
	    // 当只有一个下拉框时（即只有一张表单）
	    if (objTabPermission.value) {
	        return objTabPermission.formid.replace('_', ',') + "," + objTabPermission.value.replace('_', ',') + "0," + objTabDataState.value+",''";
	    }

	    // 当有多个下拉框时（即有多个表单）
	    for (var i = 0; i < objTabPermission.length; i++) {
	        if (i == (objTabPermission.length -1)) {
	            strPermissions += objTabPermission[i].formid.replace('_', ',') + "," + objTabPermission[i].value.replace('_', ',') + "0," + objTabDataState[i].value + ",''";
	        }
	        else {
	            strPermissions += objTabPermission[i].formid.replace('_', ',') + "," + objTabPermission[i].value.replace('_', ',') + "0," + objTabDataState[i].value + ",''" + ";";
	        }
	    }
	}
	return strPermissions;
}

//功能：去掉字符串两边空格
//返回：true ---- 包含此不合法字符  false ---- 不包含
function TrimString(str)
{
  var i,j;
  if(str == "") return "";
  for(i=0;i<str.length;i++)
    if(str.charAt(i) != ' ') break;
  if(i >= str.length) return "";

  for(j=str.length-1;j>=0;j--)
    if(str.charAt(j) != ' ') break;

  return str.substring(i,j+1);
}
		
//整数
function check_num(objName)
{
	var regExpInfo = /^-?\d+$/; ///d+/;
	if( objName.value.search(regExpInfo) >= 0 )
	{
		return true;
	}
	else
	{
		alert ("输入内容必须为整数!");
		objName.value="";
		return false;
	}
}

//==================================================================
//功能：检查是否存在 “< > " '& \ / ; |”等特殊字符
//返回：true ---- 包含此不合法字符  false ---- 不包含
function CheckSpecialChar(strSource)
{
	var intIndex = -1;	//没找到此字符，返回-1

	var regExpInfo = /&/;
	intIndex = strSource.search(regExpInfo);

	if(intIndex == - 1) 
	{
		regExpInfo = /</;
		intIndex = strSource.search(regExpInfo);
	}

	if(intIndex == - 1) 
	{
		regExpInfo = />/;
		intIndex = strSource.search(regExpInfo);
	}

	if(intIndex == - 1) 
	{
		regExpInfo = /"/;
		intIndex = strSource.search(regExpInfo);
	}

	if(intIndex == - 1) 
	{
		regExpInfo = /'/;
		intIndex = strSource.search(regExpInfo);
	}

	if(intIndex == - 1) 
	{
		regExpInfo = /;/;
		intIndex = strSource.search(regExpInfo);
	}
	
	if(intIndex == - 1) 
	{
		regExpInfo = /\|/;
		intIndex = strSource.search(regExpInfo);
	}
	
	if(intIndex == - 1) 
	{
		regExpInfo = /\//;
		intIndex = strSource.search(regExpInfo);
	}
	
	if(intIndex == - 1) 
	{
		regExpInfo = /\\/;
		intIndex = strSource.search(regExpInfo);
	}
	
	if(intIndex == - 1)
	{
		return false;
	}
	else
	{
		return true;
	}
}

//function Flow_ModifyActiveNodeName()
//{
//	//******************** start *****************************************
//	var obj = Flow_GetCurrentActiveNode();
////	Flow_ShowNodeNameDiv(obj.Name);
//	G_NodePropertys = obj.NodePropertys;
//	Flow_ShowActiveNodePropertys(obj);
//	//----------------------- end --------------------------------------
//}

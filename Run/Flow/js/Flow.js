//*************************************************************
// 功能描述： 创建新的流程
// 参数描述： 无
//-------------------------------------------------------------
function Flow_CreateWorkFlow()
{
	// 判断是否已经存在流程
	if (FlowArea.FlowNodes.Nodes.length > 0)
	{
		if (confirm("是否要保存当前的流程，再建立新的流程？"))
		{
			// 保存流程
			Flow_SaveFlow();
			return;
		}
	}
	
	// 清除当前流程
	Flow_RemoveAllActiveNode();
	
	//********************* start ****************************************
	//清除当前流程的属性
	Flow_RemoveFlowAttributes();
    
	//清除历史操作
	Flow_ClearOperations();

	//设置工具栏编辑状态
	Flow_SetFlowToolBarEditStatus();
	
	//设置流程属性
	var isNotCancel = Flow_ShowFlowAttribute();
	if( !isNotCancel )
	{
		Setup_InitFlowToolBar();
		return;
	}	
	
	//重新设置序列号
	G_NodeSerialID = 3;
	
	//------------------------ end -------------------------------------
	
	// 创建起始节点
	Flow_CreateStartAndEndNode("StartNode");
	// 设置第一个开始节点为默认开始节点
	var startNode = FlowArea.FlowNodes.Nodes[0];
	startNode.NodePropertys.IsDefaultStartNode = true;
	
	// 创建结束节点
	Flow_CreateStartAndEndNode("EndNode");
}

//*************************************************************
// 功能描述： 清除当前流程的属性
// 参数描述： 无
//-------------------------------------------------------------
function Flow_RemoveFlowAttributes()
{
	FlowArea.FlowAttributes = null;
}

//*************************************************************
// 功能描述： 清除历史操作
// 参数描述： 无
//-------------------------------------------------------------
function Flow_ClearOperations()
{
	G_CurrentHistoryIndex = -1;
	
	var objs = FlowArea.OperationLists.Operations;
	objs.splice(0, objs.length);
}

//*************************************************************
// 功能描述： 创建起始节点
// 参数描述： 无
//-------------------------------------------------------------
var G_NodeSerialID = 3;
function Flow_CreateStartAndEndNode(strNodeType)
{
	var rnd_no = Math.round(Math.random() * 1000);
	var date_time = new Date();
	var Node_id = "Node_" + date_time.valueOf() + rnd_no

	var activeNode = document.createElement("<div />");
	activeNode.style.position = "absolute";
	activeNode.style.visibility = "visible";
	activeNode.style.zIndex = "799";
	activeNode.style.border = "0px solid #000000";
	activeNode.id = Node_id;
	activeNode.NodeType = strNodeType;
	activeNode.style.textAlign = "center";
	if (strNodeType == "StartNode")
	{
		strNodeName = "开始节点";
		strImageSrc = "../images/start.gif";
		intTop = 80;
		intLeft = 30;
		//********************** start ***************************************
		activeNode.SerialID = 1;
		var objProperty = new NodePropertys();
		objProperty.Name = strNodeName;
		objProperty.HandlerProject = "#Submiter#";
		objProperty.RespondLimit = 30;
		objProperty.WarningLimit = 7;
		objProperty.DisposalLimit = 8;
		objProperty.EndLimit = 3;
		objProperty.Permissions = new Array();
		objProperty.IsStartNode = true;
		activeNode.NodePropertys = objProperty;
		//------------------------- end ------------------------------------
	}
	else
	{
		strNodeName = "结束节点";
		strImageSrc = "../images/end.gif";
		intTop = document.body.offsetHeight - 100;
		intLeft = document.body.offsetWidth - 100;
		//********************** start ***************************************
		activeNode.SerialID = 2;
		var objProperty = new NodePropertys();
		objProperty.Name = strNodeName;
		var objTaskInfo = new TaskInfo();
		objTaskInfo.ID = "1";
		objTaskInfo.ContentRemark = "End";
		objProperty.IsEndNode = true;
		objProperty.TaskCollections[objProperty.TaskCollections.length] = objTaskInfo;
		activeNode.NodePropertys = objProperty;
		//------------------------- end ------------------------------------
	}
	activeNode.style.width = strNodeName.length * 16;
	activeNode.style.height = 50;
	activeNode.style.left = intLeft;
	activeNode.style.top = intTop;
	activeNode.Name = strNodeName;
	activeNode.Activate = Flow_SetNodeActivate;
	activeNode.Deactivate = Flow_SetNodeDeActivate;
	activeNode.onmousedown = Flow_MoveActiveNode;
	activeNode.oncontextmenu = Flow_ShowActiveNodeContextmenu;
	activeNode.onclick = Flow_ShowActiveNodeDetail;
	activeNode.onmouseover = Flow_ActiveNodeOver;
	activeNode.onmouseout = Flow_ActiveNodeOut;
	activeNode.ondblclick = Flow_ChangeActiveNodeName;
	
	// Create active image element
	var activeImage = document.createElement("<img src='"+ strImageSrc +"' style='border: 0px solid #000000;>");
	var activeText = document.createElement("<font class='actName' />");
	activeText.style.cursor = "default";
	activeText.innerHTML = strNodeName;

	// Add the activeNode to the document body:
	FlowArea.appendChild(activeNode);

	activeNode.appendChild(activeImage);
	activeNode.appendChild(activeText);
	
	FlowArea.FlowNodes.Nodes[FlowArea.FlowNodes.Nodes.length] = activeNode;
	//Flow_SetCurrentActiveNode(activeNode);
}

//*************************************************************
// 功能描述： 丛系统重新恢复节点输出
// 参数描述： strNodeID		- 对象ID
//			strNodeName	- 节点名称
//			strNodeImage	- 节点图片路径
//			strStyleFilter	- 节点样式
//			strScrX			- 节点屏幕坐标X
//			strScrY			- 节点屏幕坐标Y
//-------------------------------------------------------------
function Flow_BuildActiveNode(strNodeID, strNodeName, strNodeType, strNodeImage, strStyleFilter, strScrX, strScrY)
{
	var activeNode = document.createElement("<div />");
	activeNode.style.position = "absolute";
	activeNode.style.visibility = "visible";
	activeNode.style.width = strNodeName.length * 15;
	activeNode.style.left = strScrX;
	activeNode.style.top = strScrY;
	activeNode.style.zIndex = "799";
	activeNode.style.border = "0px solid #000000";
	activeNode.id = "Node_" + strNodeID;
	activeNode.NodeType = strNodeType;
	activeNode.Name = strNodeName;
	activeNode.Activate = Flow_SetNodeActivate;
	activeNode.Deactivate = Flow_SetNodeDeActivate;
	activeNode.onmousedown = Flow_MoveActiveNode;
	activeNode.oncontextmenu = Flow_ShowActiveNodeContextmenu;
	activeNode.onclick = Flow_ShowActiveNodeDetail;
	activeNode.onmouseover = Flow_ActiveNodeOver;
	activeNode.onmouseout = Flow_ActiveNodeOut;
	activeNode.ondblclick = Flow_ChangeActiveNodeName;
	
	// Create active image element
	var activeImage = document.createElement("<img src='"+ strNodeImage +"' style='border: 0px solid #000000;>");
	activeImage.style.filter = strStyleFilter;
	var activeText = document.createElement("<font class='actName' />");
	activeText.style.cursor = "default";
	activeText.innerHTML = strNodeName;

	// Add the activeNode to the document body:
	FlowArea.appendChild(activeNode);

	activeNode.appendChild(activeImage);
	activeNode.appendChild(activeText);
	
	FlowArea.FlowNodes.Nodes[FlowArea.FlowNodes.Nodes.length] = activeNode;
}

//*************************************************************
// 功能描述： 创建节点
// 参数描述： strOrigiSrc - 图片源路径
//           strNodeName - 节点名称
//-------------------------------------------------------------
function Flow_CreateActiveNode(strOrigiSrc, strNodeType)
{
	var obj = Flow_GetCurrentActiveNode();
	
	if(obj)
	{
		// 如果上一一个对象没有取名字，则自动给它使用默认名称
		if(obj.Name == "None")
		{
			// 取得默认名称
			obj.Name = Flow_GetNodeDefaultName(obj.NodeType);
			Flow_SetActiveNodeName();
		}
	}

	var rnd_no = Math.round(Math.random() * 1000);
	var date_time = new Date();
	var Node_id = "Node_" + date_time.valueOf() + rnd_no

	var activeNode = document.createElement("<div />");
	activeNode.style.position = "absolute";
	activeNode.style.visibility = "visible";
	activeNode.style.zIndex = "799";
	activeNode.style.width = 1;
	activeNode.style.height = 50;
	activeNode.style.border = "0px solid #000000";
	activeNode.style.textAlign = "center";
	activeNode.id = Node_id;
	activeNode.NodeType = strNodeType;
	activeNode.Name = "None";
	activeNode.Activate = Flow_SetNodeActivate;
	activeNode.Deactivate = Flow_SetNodeDeActivate;
	activeNode.onmousedown = Flow_MoveActiveNode;
	activeNode.oncontextmenu = Flow_ShowActiveNodeContextmenu;
	activeNode.onclick = Flow_ShowActiveNodeDetail;
	activeNode.onmouseover = Flow_ActiveNodeOver;
	activeNode.onmouseout = Flow_ActiveNodeOut;
	activeNode.ondblclick = Flow_ChangeActiveNodeName;
	
	// Create active image element
	var activeImage = document.createElement("<img src='"+ strOrigiSrc +"' style='border: 0px solid #000000;>");	
	activeImage.style.filter = "alpha(opacity=60)";
	var activeText = document.createElement("<font class='actName' />");
	activeText.style.cursor = "default";

	// Add the activeNode to the document body:
	FlowArea.appendChild(activeNode);

	activeNode.appendChild(activeImage);
	activeNode.appendChild(activeText);
	//********************** start ***************************************
	activeNode.NodePropertys = new NodePropertys();
	
	activeNode.SerialID = G_NodeSerialID;
	
	G_NodeSerialID = G_NodeSerialID + 1;
	//------------------------- end ------------------------------------
	
	FlowArea.FlowNodes.Nodes[FlowArea.FlowNodes.Nodes.length] = activeNode;
	Flow_SetCurrentActiveNode(activeNode);
	
	Flow_SetActiveNode();
	document.onmousedown = Flow_PutActiveNode;
	document.onmousemove = Flow_SetActiveNode;
}

//*************************************************************
// 功能描述： 创建被复制的节点
// 参数描述： strOrigiSrc - 图片源路径
//           strNodeName - 节点名称
//-------------------------------------------------------------
function Flow_CreateActiveNodePasted(objParmNode)
{
	if( !objParmNode )
	{
		return;
	}

	var rnd_no = Math.round(Math.random() * 1000);
	var date_time = new Date();
	var Node_id = "Node_" + date_time.valueOf() + rnd_no

	var activeNode = document.createElement("<div />");
	activeNode.style.position = "absolute";
	activeNode.style.visibility = "visible";
	activeNode.style.zIndex = "799";
	activeNode.style.width = 1;
	activeNode.style.height = 50;
	activeNode.style.top = parseInt(objParmNode.style.top) + 10;
	activeNode.style.left = parseInt(objParmNode.style.left) + 10;
	activeNode.style.border = "0px solid #000000";
	activeNode.style.textAlign = "center";
	activeNode.id = Node_id;
	activeNode.NodeType = objParmNode.NodeType;
	activeNode.Name = objParmNode.Name;
	
	activeNode.Activate = Flow_SetNodeActivate;
	activeNode.Deactivate = Flow_SetNodeDeActivate;
	activeNode.onmousedown = Flow_MoveActiveNode;
	activeNode.oncontextmenu = Flow_ShowActiveNodeContextmenu;
	activeNode.onclick = Flow_ShowActiveNodeDetail;
	activeNode.onmouseover = Flow_ActiveNodeOver;
	activeNode.onmouseout = Flow_ActiveNodeOut;
	activeNode.ondblclick = Flow_ChangeActiveNodeName;
	
	// Create active image element
	var activeImage = document.createElement("<img src='"+ objParmNode.childNodes[0].src +"' style='border: 0px solid #000000;>");	
	activeImage.style.filter = "alpha(opacity=60)";
	var activeText = document.createElement("<font class='actName' />");
	activeText.style.cursor = "default";

	FlowArea.appendChild(activeNode);
	activeNode.appendChild(activeImage);
	activeNode.appendChild(activeText);
	
	activeNode.style.width = activeNode.Name.length * 14;
	activeNode.childNodes[1].innerHTML = activeNode.Name;

	//条件节点不能被复制节点属性，因为与流向有关
	if( objParmNode.NodeType != "Action" )
		activeNode.NodePropertys = objParmNode.NodePropertys;
	else
		activeNode.NodePropertys = new NodePropertys();
	
	activeNode.SerialID = G_NodeSerialID;
	G_NodeSerialID = G_NodeSerialID + 1;
	
	FlowArea.FlowNodes.Nodes[FlowArea.FlowNodes.Nodes.length] = activeNode;
	Flow_SetCurrentActiveNode(activeNode);
	
//	Flow_SetActiveNode();
	MUp();
	
	// 保存操作到列表
	Flow_SaveOperation(activeNode, "Add", null);
}

//*************************************************************
// 功能描述： 根据节点类型设置默认名称
// 参数描述： 无
//-------------------------------------------------------------
function Flow_GetNodeDefaultName(strNodeType)
{
	var strNodeName = null;
	switch (strNodeType)
	{
		case "StartNode":
			strNodeName = "开始节点";
			break;
		case "EndNode":
			strNodeName = "结束节点";
			break;
		case "ClusterNode":
			strNodeName = "处理节点";
			break;
        case "ExternalNode":
			strNodeName = "外接节点";
			break;
		case "CodeterminantNode":
			strNodeName = "协同节点";
			break;
		case "CaseNode":
			strNodeName = "条件节点";
			break;
		case "TaskNode":
			strNodeName = "任务节点";
			break;
		case "SubFlowNode":
			strNodeName = "子流程节点";
			break;
		case "ParallelNode":
			strNodeName = "并行节点";
			break;
	}

	return strNodeName;
}

//*************************************************************
// 功能描述： 放置节点到流程区域
// 参数描述： 无
//-------------------------------------------------------------
var G_NodePropertys = null;
function Flow_PutActiveNode()
{
	// 如果是直接在工具上取消添加节点对象
	if( event.srcElement.id )
	{
		// 取消添加节点对象
		var obj = Flow_GetCurrentActiveNode();
		// 点击右键取消创建对象
		if( obj && obj.Name == "None" )
		{
			// 如果还没有取名就要删除说明用户不想建立该对象则关闭对象命名窗口
//			Flow_HiddenNodeNameDiv();
			Flow_RemoveNodeFromFlow(obj);

			document.onmousemove = MMove;
			document.onmousedown = null;
		}

		return;
	}

	if( event.button == 1 )
	{
		Flow_SetActiveNode();		
		var obj = Flow_GetCurrentActiveNode();
		//********************* start ****************************************
		// 确定创建后的默认名称
		//var strNodeName = Flow_GetNodeDefaultName(obj.NodeType);
		//Flow_ShowNodeNameDiv(strNodeName);
		MUp();
		G_NodePropertys = null;
		Flow_ShowActiveNodePropertys(obj);
		// 点击取消，取消创建对象
		if( obj.Name == "None" )
		{
			// 如果还没有取名就要删除说明用户不想建立该对象则关闭对象命名窗口
			Flow_RemoveNodeFromFlow(obj);

			// 设置取消标识
			//G_CancelAddNode = true;
			//设置tool浮起 
			if( FlowArea.activeToolControl )
			{
				FlowArea.activeToolControl.Deactivate(FlowArea.activeToolControl);
				FlowArea.style.cursor = "default";
				Flow_SetCurrentTool("None");
				// 设置FlowArea下面全部元素鼠标样式
				Flow_SetCursorStyle("");
			}
			
			document.onmousemove = MMove;
			document.onmousedown = null;
			return;
		}
		//--------------------- end ----------------------------------------

		// 保存操作到列表
		Flow_SaveOperation(obj, "Add", null);
	}

	// 恢复设置动作连线工具状态
	Flow_ResetFlowToolBar();
	// 对象发生改变
	Flow_NodeHasChanged();

	document.onmousemove = MMove;
	document.onmousedown = null;
}

//*************************************************************
// 功能描述： 节点的闪动偏移
// 参数描述： 无
//-------------------------------------------------------------
var G_HasRestoration = true;
function Flow_ActiveNodeOver()
{
	// 实现对象闪动效果
	var obj = event.srcElement;
	// 如果没有得到对象则直接退出
	if (!obj)
	{
		return;
	}
	// 如果得到的是目标对象的子对象
	if (obj.id == "")
	{
		obj = obj.parentNode;
	}
	// 判断是否已经复位同时如果正在使用动作工具则不允许移动节点
	if (G_HasRestoration && !G_Started)
	{
	    if (obj.style)
	    {
		    obj.style.pixelLeft += 0;
		    obj.style.pixelTop += 0;
		    G_HasRestoration = false;

		    var repTime = setTimeout("Flow_ActiveNodeRestoration('"+ obj.id +"')", 500);
		}
	}
	// 判断鼠标是否松开
	if (Obj == '' && MTy == '')
	{
		// 显示设置节点信息
		Flow_ShowActiveNodeInfo(obj);
	}
}

//*************************************************************
// 功能描述： 通过鼠标事件的节点闪动复位
// 参数描述： 无
//-------------------------------------------------------------
function Flow_ActiveNodeOut()
{
	// 关闭信息显示层
	Flow_CloseActiveNodeInfo();
}

//*************************************************************
// 功能描述： 节点闪动定时复位
// 参数描述： strNodeId - 对象ID
//-------------------------------------------------------------
function Flow_ActiveNodeRestoration(strNodeId)
{
	try
	{
		G_HasRestoration = true;
		// 对象闪动复位
		var obj = document.getElementById(strNodeId);
		obj.style.pixelLeft -= 0;
		obj.style.pixelTop -= 0;
	}
	catch(wError){}
}

//*************************************************************
// 功能描述： 显示设置节点信息
// 参数描述： obj - 指定对象
//			srcX - 屏幕坐标X
//			srcY - 屏幕坐标Y
//-------------------------------------------------------------
function Flow_ShowActiveNodeInfo(obj)
{
	var infoDiv = document.getElementById("ActiveNodeInfoDiv");
	if(!infoDiv)
	{
		infoDiv = document.createElement("<div />");
		infoDiv.style.position = "absolute";
		infoDiv.style.visibility = "visible";
		// 没有命名前不显示信息层
		infoDiv.style.display = "none";
		infoDiv.style.zIndex = "999999999";
		infoDiv.style.width = 1;
		infoDiv.style.height = 44;
		infoDiv.style.background = "#FEFFF0";
		infoDiv.style.paddingLeft = "2px";
		infoDiv.style.paddingTop = "2px";
		infoDiv.style.border = "1px solid #DF8202";
		infoDiv.id = "ActiveNodeInfoDiv";

		// Add the activeNode to the document body:
		FlowArea.appendChild(infoDiv);
	}
	var strNodeTypeName = Flow_GetNodeDefaultName(obj.NodeType);
	var strInfo0 = "类型:【" + strNodeTypeName + "】";
	var strInfo1 = "<br>";
	var strInfo2 = "名称:【" + obj.Name + "】";
	var intMaxLength = Math.max(strInfo0.length, strInfo2.length);
	var strInfo = strInfo0 + strInfo1 + strInfo2;
	if(strInfo == "None" || !strInfo) strInfo = "没有相关信息";
	infoDiv.innerHTML = strInfo;
	infoDiv.style.width = intMaxLength * 12;
	infoDiv.style.pixelLeft = obj.style.pixelLeft + obj.style.pixelWidth;
	infoDiv.style.pixelTop = obj.style.pixelTop;
	// 处理出界情况
	if(infoDiv.style.pixelTop <= FlowNodeElement.style.pixelHeight)
	{
		infoDiv.style.pixelTop = FlowNodeElement.style.pixelHeight;
	}
	if(infoDiv.style.pixelLeft >= document.body.offsetWidth - infoDiv.style.pixelWidth - 1)
	{
		infoDiv.style.pixelLeft = obj.style.pixelLeft - infoDiv.style.pixelWidth + 5;
	}
	if(infoDiv.style.pixelTop >= document.body.offsetHeight - infoDiv.style.pixelHeight)
	{
		infoDiv.style.pixelTop = document.body.offsetHeight - infoDiv.style.pixelHeight - 1;
	}
	// 如果还没有取名则不显示
	if(obj.Name != "None")
		infoDiv.style.display = "block";
}

//*************************************************************
// 功能描述： 显示设置节点详细信息
// 参数描述： 无
//-------------------------------------------------------------
function Flow_ShowActiveNodeDetail()
{
}

//*************************************************************
// 功能描述： 关闭节点信息显示层
// 参数描述： 无
//-------------------------------------------------------------
function Flow_CloseActiveNodeInfo()
{
	var infoDiv = document.getElementById("ActiveNodeInfoDiv");
	if (infoDiv)
	{
		infoDiv.style.display = "none";
	}
}

//*************************************************************
// 功能描述： 显示设置节点名称层
// 参数描述： strNodeName - 对象名称
//-------------------------------------------------------------
function Flow_ShowNodeNameDiv(strNodeName)
{
	var obj = Flow_GetCurrentActiveNode();	
	
	var bStillShow = false;
	// 关闭所有窗口
	HideAllWindow(NodeNameDiv);

	NodeNameDiv.style.display = "block";

	FocusMe(NodeNameDivHead, null, NodeNameDiv);

	intLeft = obj.style.pixelLeft + 30;
	intTop = obj.style.pixelTop + 30;
	
	if(intLeft > document.body.offsetWidth - NodeNameDiv.style.pixelWidth)
	{
		intLeft = document.body.offsetWidth - NodeNameDiv.style.pixelWidth - 1;
	}
	
	if(intTop > document.body.offsetHeight - NodeNameDiv.style.pixelHeight)
	{
		intTop = document.body.offsetHeight - NodeNameDiv.style.pixelHeight - 1;
	}

	NodeNameDiv.style.pixelLeft = intLeft;
	NodeNameDiv.style.pixelTop = intTop;

	NodeName.value = strNodeName;
}

//*************************************************************
// 功能描述： 隐藏所有层窗口
// 参数描述： 无
//-------------------------------------------------------------
function HideAllWindow(objDiv)
{
	// 对象名称设置窗口
//	NodeNameDiv.style.display = "none";
}

//*************************************************************
// 功能描述： 隐藏节点名称设置层
// 参数描述： 无
//-------------------------------------------------------------
function Flow_HiddenNodeNameDiv()
{
//	NodeNameDiv.style.display = "none";
}

//*************************************************************
// 功能描述： 设置节点位置
// 参数描述： 无
//-------------------------------------------------------------
function Flow_SetActiveNode()
{
	var obj = Flow_GetCurrentActiveNode();

	obj.style.left = event.x - obj.childNodes[0].width / 2;
	obj.style.top = event.y - obj.childNodes[0].height / 2;
}

//*************************************************************
// 功能描述： 设置节点名称
// 参数描述： 无
//-------------------------------------------------------------
function Flow_SetActiveNodeName()
{
//	Flow_HiddenNodeNameDiv();

	var obj = Flow_GetCurrentActiveNode();

	obj.Name = NodeName.value;
	obj.style.width = NodeName.value.length * 14;
	obj.childNodes[1].innerHTML = NodeName.value;
}

//*************************************************************
// 功能描述： 修改节点名称
// 参数描述： flag - 名称标识
//-------------------------------------------------------------
function Flow_ChangeActiveNodeName(flag)
{
	if(flag)
	{
		var obj = Flow_GetCurrentActiveNode();
//		Flow_ShowNodeNameDiv(obj.Name);
	}
	else
	{
		var obj = document.elementFromPoint(event.x, event.y);

		Flow_SetCurrentActiveNode(obj.parentNode);
		//******************** start *****************************************
//		var strNodeName = obj.parentNode.Name;
//
//		// 如果是创建对象时候直接双击对象则会出现修改时候其名称为None情况
//		if( strNodeName == "None" )
//			strNodeName = Flow_GetNodeDefaultName(obj.parentNode.NodeType);
//		Flow_ShowNodeNameDiv(strNodeName);
		G_NodePropertys = obj.parentNode.NodePropertys;
		Flow_ShowActiveNodePropertys(obj.parentNode);
		//----------------------- end --------------------------------------
	}
}

//*************************************************************
// 功能描述： 显示节点属性窗口
// 参数描述： 无
//-------------------------------------------------------------
function Flow_ShowActiveNodePropertys(objParm)
{
	var strPage = "";
	if( objParm.NodeType == "StartNode" )
		strPage = "ClusterNode.aspx";
	else if( objParm.NodeType == "EndNode" )
		strPage = "TaskNode.aspx";
	else
		strPage = objParm.NodeType + ".aspx";

	var strStyle = "dialogHeight:350px; dialogWidth:500px;help:no;center:yes;status:no;resizable:no;location:yes;scroll:auto;dialogLeft:" + (event.x + 35) + ";dialogTop:" + (event.y + 150)
	var objReturn = window.showModalDialog(strPage + "?RelatingForm=" + FlowArea.FlowAttributes.RelatingFormID, window, strStyle);
	var obj = Flow_GetCurrentActiveNode();
	if( objReturn )
	{
		obj.Name = objReturn.Name;
		obj.style.width = objReturn.Name.length * 14;
		obj.childNodes[1].innerHTML = objReturn.Name;
		obj.NodePropertys = objReturn;
	}
	else
	{
		if( obj.Name == null || obj.Name == "" )
			obj.Name = Flow_GetNodeDefaultName(obj.NodeType);
		obj.style.width = obj.Name.length * 14;
		obj.childNodes[1].innerHTML = obj.Name;
	}
}

//*************************************************************
// 功能描述： 修改节点名称
// 参数描述： 无
//-------------------------------------------------------------
function Flow_ModifyActiveNodeName()
{
	//******************** start *****************************************
	var obj = Flow_GetCurrentActiveNode();
//	Flow_ShowNodeNameDiv(obj.Name);
	G_NodePropertys = obj.NodePropertys;
	Flow_ShowActiveNodePropertys(obj);
	//----------------------- end --------------------------------------
}

//*************************************************************
// 功能描述： 保存所有节点类
// 参数描述： 无
//-------------------------------------------------------------
function Flow_FlowNodes()
{
}

//*************************************************************
// 功能描述： 移动节点
// 参数描述： 无
//-------------------------------------------------------------
var bActiveNodeChange = false;
var G_CancelAddNode = false;
function Flow_MoveActiveNode()
{
	// 关闭右键菜单
	Flow_CloseActiveNodeContextmenu();
	Flow_CloseFlowContextmenu();
	// 关闭详细信息
	Flow_CloseActiveNodeInfo();

	var obj = document.elementFromPoint(event.x, event.y);

	// 如果没有得到对象则直接退出
	if (!obj)
	{
		return false;
	}
	// 如果是动作对象单独处理
	if (obj.NodeType == "Action")
	{
		Flow_SetCurrentActiveNode(obj);
		return;
	}
	// 如果得到的是目标对象的子对象
	if (obj.id == "")
	{
		obj = obj.parentNode;
	}

	if(event.button == 1)
	{
		// 激活当前对象
		Flow_SetCurrentActiveNode(obj);
		// 如果正在使用动作工具则不允许移动节点
		if (!G_Started)
		{
			MDown(obj);
		}
		else
		{
			// 创建动作连线对象
			Flow_PolyLineOnMouseClick(obj);
		}
	}
	else
	{
		// 点击右键取消创建对象
		if(obj.Name == "None")
		{
			// 如果还没有取名就要删除说明用户不想建立该对象则关闭对象命名窗口
//			Flow_HiddenNodeNameDiv();
			Flow_RemoveNodeFromFlow(obj);

			document.onmousemove = MMove;
			document.onmousedown = null;

			// 恢复设置动作连线工具状态
			Flow_ResetFlowToolBar();
			// 设置取消标识
			G_CancelAddNode = true;

			return false;
		}
	}
}

//*************************************************************
// 功能描述： 取得流程区域当前节点
// 参数描述： 无
//-------------------------------------------------------------
function Flow_GetCurrentActiveNode()
{
	var act = FlowArea.CurrentActiveNode;

	return act;
}

//*************************************************************
// 功能描述： 设定指定节点的活动状态
// 参数描述： obj - 指定对象
//-------------------------------------------------------------
function Flow_SetNodeActivate(obj)
{
	if(obj)
	{
		// 动作连线
		if (obj.NodeType == "Action")
		{	
			obj.strokecolor = "#CC0000";
			return;
		}
		else
		{
			if(obj.childNodes[0].style.filter.indexOf("alpha(opacity=60)") == -1)
			{
				obj.childNodes[0].style.filter = "alpha(opacity=60)" + obj.childNodes[0].style.filter;
			}
			Flow_SetNodeStyle(obj.childNodes[1], "#FF0000");
		}
	}
}

//*************************************************************
// 功能描述： 设定流转过节点的样式
// 参数描述： obj - 指定对象
//          serialnum - 序号
//-------------------------------------------------------------
function Flow_ResetNodeStyle(obj,serialnum)
{
    Flow_SetNodeStyle(obj.childNodes[1], "#c0c0c0");
    obj.innerHTML += "<FONT class='actName' style='CURSOR: default; COLOR: #000000'><" + serialnum + "></FONT>";
}

//*************************************************************
// 功能描述： 设定流转过流向的样式
// 参数描述： obj - 指定对象

//           strPassNodes - 流转过的节点ID
//-------------------------------------------------------------
function Flow_ResetActionStyle(obj,strPassNodes)
{
    if(strPassNodes.indexOf(obj.FromNode) > -1 && strPassNodes.indexOf(obj.ToNode) > -1)
    {
        obj.childNodes[0].dashstyle = "Solid";
        obj.strokeweight="2pt";
        obj.strokecolor = "#2caa06";
    }
}

//*************************************************************
// 功能描述： 取消指定对象活动状态
// 参数描述： obj - 指定对象
//-------------------------------------------------------------
function Flow_SetNodeDeActivate(obj)
{
	if(obj)
	{
		// 动作连线
		if (obj.NodeType == "Action")
		{
			obj.strokecolor = "#003300";
			return;
		}
		if(obj.childNodes[0].style.filter.indexOf("alpha(opacity=60)") > -1)
		{
			obj.childNodes[0].style.filter = obj.childNodes[0].style.filter.replace("alpha(opacity=60)", "");
		}
		Flow_SetNodeStyle(obj.childNodes[1], "#0000FF");
	}
}

//*************************************************************
// 功能描述： 设置对象样式
// 参数描述： 无
//-------------------------------------------------------------
function Flow_SetNodeStyle(obj, strColor)
{
	obj.style.color = strColor;
}

//*************************************************************
// 功能描述： 将指定对象设当前选中对象
// 参数描述： obj - 当前对象
//-------------------------------------------------------------
function Flow_SetCurrentActiveNode(obj)
{
	try
	{
		if(obj == null)
		{
			FlowArea.CurrentActiveNode = null;
		}
		else
		{
			if (FlowArea.CurrentActiveNode != null && FlowArea.CurrentActiveNode.id != obj.id)
			{
				FlowArea.CurrentActiveNode.Deactivate(FlowArea.CurrentActiveNode);
			}
			if (obj.id)
			{
				FlowArea.CurrentActiveNode = obj;
				FlowArea.CurrentActiveNode.Activate(obj);
			}
		}
	}
	catch(wError){}
	
	// 设置工具栏编辑状态
	Flow_SetFlowToolBarEditStatus();
}

//*************************************************************
// 功能描述： 创建节点表单
// 参数描述： 无
//-------------------------------------------------------------
function Flow_CreateActiveNodeField()
{
	var objs = FlowArea.FlowNodes.Nodes;
	var strFlowNodes = "";
	for(var i = 0; i < objs.length; i++)
	{
		var strStyleFilter = objs[i].childNodes[0].style.filter.replace("alpha(opacity=60)", "");
		if(strFlowNodes == "")
			strFlowNodes = objs[i].id +","+ objs[i].Name +","+ objs[i].NodeType +","+ objs[i].childNodes[0].src +","+ objs[i].style.pixelLeft +","+ objs[i].style.pixelTop +","+ strStyleFilter +","+ objs[i].MapX +","+ objs[i].MapY +","+ objs[i].WorkId;
		else
			strFlowNodes += ";" + objs[i].id +","+ objs[i].Name +","+ objs[i].NodeType +","+ objs[i].childNodes[0].src +","+ objs[i].style.pixelLeft +","+ objs[i].style.pixelTop +","+ strStyleFilter +","+ objs[i].MapX +","+ objs[i].MapY +","+ objs[i].WorkId;
	}
	//alert(strFlowNodes);
	Flow_CreateHiddenField("FlowNodes", strFlowNodes);
}

//*************************************************************
// 功能描述： 通过键盘移动对象
// 参数描述： 无
//-------------------------------------------------------------
document.onkeydown = CheckKeyPress;
function CheckKeyPress()
{
	var obj = Flow_GetCurrentActiveNode();
	// 如果没有设置当前对象则退出
	if(!obj)
	{
		return;
	}

	var intStep = 5;

	if(event.ctrlKey)
		intStep = 1;
	
	// 记录移动前的位置
	var aryNodePosition = new Array();
	if (event.keyCode != 46)
	{
		aryNodePosition[0] = obj.style.pixelLeft;
		aryNodePosition[1] = obj.style.pixelTop;
	}

	// 使用键盘操作对象
	switch(event.keyCode)
	{
		case 46:
			//******************** start ***************************************	
			//Flow_RemoveActiveNode();
			var obj = Flow_GetCurrentActiveNode();
			if( obj && obj.NodeType != "StartNode" && obj.NodeType != "EndNode" )
			{
				Flow_RemoveActiveNode();
			}
			//----------------------- end --------------------------------------
			return;
		case 40:
			obj.style.pixelTop += intStep;
			break;
		case 39:
			obj.style.pixelLeft += intStep;
			break;
		case 38:
			obj.style.pixelTop -= intStep;
			break;
		case 37:
			obj.style.pixelLeft -= intStep;
			break;
		default:
			return;
	}
	
	// 记录移动后的位置
	aryNodePosition[2] = obj.style.pixelLeft;
	aryNodePosition[3] = obj.style.pixelTop;
	// 保存位置移动操作
	Flow_SaveOperation(obj, "Move", aryNodePosition);
	// 重新设置连接对象位置
	Flow_ResetActionPosition(obj);
}

//*************************************************************
// 功能描述： 通过右键移除对象
// 参数描述： 无
//-------------------------------------------------------------
function Flow_RemoveActiveNode()
{
	// 如果鼠标焦点在当前要删除对象才删除
	if( event.srcElement.type != "text" )
	{
		var obj = Flow_GetCurrentActiveNode();
		if( obj )
		{
			var strNodeName = obj.Name;
			if( strNodeName == "None" )
			{
				// 取得相关的动作对象
				var objActions = Flow_GetRelationActions(obj);
				// 保存操作到列表
				Flow_SaveOperation(obj, "Delete", objActions);

				// 如果还没有取名就要删除说明用户不想建立该对象则关闭对象命名窗口
//				Flow_HiddenNodeNameDiv();
				Flow_RemoveNodeFromFlow(obj);
			}
			else
			{
				if( obj && confirm("确认要删除【"+ strNodeName +"】对象？") )
				{
					// 取得相关的动作对象
					var objActions = Flow_GetRelationActions(obj);
					// 保存操作到列表
					Flow_SaveOperation(obj, "Delete", objActions);

					Flow_RemoveNodeFromFlow(obj);
				}
			}
		}
	}
}

//*************************************************************
// 功能描述： 移除所有节点
// 参数描述： 无
//-------------------------------------------------------------
function Flow_RemoveAllActiveNode()
{
	Flow_SetCurrentActiveNode(null);
	var objs = FlowArea.FlowNodes.Nodes;
	for(var i = 0; i < objs.length; i++)
	{
		FlowArea.removeChild(objs[i]);
	}
	objs.splice(0, objs.length)
}

//*************************************************************
// 功能描述： 丛流程区域删除指定对象
// 参数描述： obj - 要删除的对象
//-------------------------------------------------------------
function Flow_RemoveNodeFromFlow(obj)
{
	// 设置当前活动节点为空
	Flow_SetCurrentActiveNode(null);

	var objs = FlowArea.FlowNodes.Nodes;
	for( var i = 0; i < objs.length; i++ )
	{
		// --------------- edit by zyn -------------------------
		// 因为 流向线 的名称都一样，按名称来匹配时，从数组中删除流向线对象就删错了
		// if( objs[i].Name && objs[i].Name == obj.Name )
		if( objs[i].id && objs[i].id == obj.id )
		// --------------- end ---------------------------------
		{
			//************************ start *************************************
			if( obj.NodeType == "Action" )
			{
				if( obj.FromNode )
				{
					//如果是条件节点，去除条件节点的某一个连接节点属性
					if( document.getElementById(obj.FromNode).NodeType == "CaseNode" )
					{
						Flow_RemoveCaseNodeAttribute(document.getElementById(obj.FromNode), document.getElementById(obj.ToNode).SerialID);
					}
				}
			}
			//--------------------------- end ----------------------------------
			
			// 丛工作区域移出对象
			FlowArea.removeChild(obj);
			// 丛数组移出对象
			objs.splice(i, 1);
			// 删除相关动作连线
			Flow_RemoveActionFromFlow(obj);
			// 对象发生改变
			Flow_NodeHasChanged();
			return;
		}
	}
}

//*************************************************************
// 功能描述： 丛流程区域删除相关动作连线
// 参数描述： obj
//-------------------------------------------------------------
function Flow_RemoveActionFromFlow(obj)
{
	var objs = FlowArea.FlowNodes.Nodes;
	for( var i = 0; i < objs.length; i++ )
	{
		if( (objs[i].FromNode && objs[i].FromNode == obj.id) || (objs[i].ToNode && objs[i].ToNode == obj.id) )
		{
			//************************ start *************************************
			if( objs[i].ToNode && objs[i].ToNode == obj.id )
			{
				//如果是条件节点，去除条件节点的某一个连接节点属性
				if( document.getElementById(objs[i].FromNode).NodeType == "CaseNode" )
				{
					Flow_RemoveCaseNodeAttribute(document.getElementById(objs[i].FromNode), obj.SerialID);
				}
			}
			//--------------------------- end ----------------------------------
			FlowArea.removeChild(objs[i]);
			objs.splice(i, 1);
			Flow_RemoveActionFromFlow(obj);
			
			return;
		}
	}
}

//*************************************************************
// 功能描述： 显示节点右键菜单
// 参数描述： 无
//-------------------------------------------------------------
function Flow_ShowActiveNodeContextmenu()
{
	var obj = document.elementFromPoint(event.x, event.y);
	// 如果没有得到对象则直接退出
	if (!obj)
	{
		return;
	}
	// 如果得到的是目标对象的子对象
	if (obj.id == "")
	{
		obj = obj.parentNode;
	}
	Flow_SetCurrentActiveNode(obj);
	
	//处理删除节点或删除流向的文字显示控制
	if( obj.NodeType && obj.NodeType == "Action" )
		DeleteTd.innerText = "删除流向";
	else
		DeleteTd.innerText = "删除节点";

	// 处理菜单出界情况
	var intLeft = event.x + 5;
	var intTop = event.y;
	if(intLeft > document.body.offsetWidth - ActiveNodeContextmenuDiv.style.pixelWidth)
	{
		intLeft = document.body.offsetWidth - ActiveNodeContextmenuDiv.style.pixelWidth - 1;
	}
	
	if(intTop > document.body.offsetHeight - ActiveNodeContextmenuDiv.style.pixelHeight)
	{
		intTop = document.body.offsetHeight - ActiveNodeContextmenuDiv.style.pixelHeight - 1;
	}
	ActiveNodeContextmenuDiv.style.pixelLeft = intLeft;
	ActiveNodeContextmenuDiv.style.pixelTop = intTop;

	ActiveNodeContextmenuDiv.filters.revealTrans.Apply();
	ActiveNodeContextmenuDiv.style.display = "block";
	ActiveNodeContextmenuDiv.filters.revealTrans.Play();

	// 开始节点和结束节点不允许复制和删除
	Flow_SetNodeContentMenuStatus(obj);
}

//*************************************************************
// 功能描述： 关闭节点右键菜单
// 参数描述： 无
//-------------------------------------------------------------
function Flow_CloseActiveNodeContextmenu()
{
	ActiveNodeContextmenuDiv.style.display = "none";
}

//*************************************************************
// 功能描述： 显示流程区域右键菜单
// 参数描述： 无
//-------------------------------------------------------------
function Flow_ShowFlowContextmenu()
{
	// 处理菜单出界情况
	var intLeft = event.x + 5;
	var intTop = event.y;
	if(intLeft > document.body.offsetWidth - FlowContextmenuDiv.style.pixelWidth)
	{
		intLeft = document.body.offsetWidth - FlowContextmenuDiv.style.pixelWidth - 1;
	}
	
	if(intTop > document.body.offsetHeight - FlowContextmenuDiv.style.pixelHeight)
	{
		intTop = document.body.offsetHeight - FlowContextmenuDiv.style.pixelHeight - 1;
	}

	FlowContextmenuDiv.style.pixelLeft = intLeft;
	FlowContextmenuDiv.style.pixelTop = intTop;

	FlowContextmenuDiv.filters.revealTrans.Apply()
	FlowContextmenuDiv.style.display = "block";
	FlowContextmenuDiv.filters.revealTrans.Play()

	// 判断是否有可粘贴内容
	if(objCopy)
	{
		PlastTd.disabled = false;
		PlastTd.onclick = Flow_PlastActiveNode;
	}
	else
	{
		PlastTd.disabled = true;
		PlastTd.onclick = "";
	}

	// 判断是否已经建立流程
	if (FlowArea.FlowNodes.Nodes.length > 0)
	{
		// 流程属性	
		AttributeTd.disabled = false;
		//********************* start ****************************************
		//AttributeTd.onclick = Flow_ShowFlowAttributeDiv;
		AttributeTd.onclick = Flow_ShowFlowAttribute;
		//------------------------ end -------------------------------------
		// 保存流程
		SaveFlowTd.disabled = false;
		SaveFlowTd.onclick = Flow_SaveFlow;
	}
	else
	{
		// 流程属性
		AttributeTd.disabled = true;
		AttributeTd.onclick = "";
		// 保存流程
		SaveFlowTd.disabled = true;
		SaveFlowTd.onclick = "";
	}
}

//*************************************************************
// 功能描述： 显示流程属性界面
// 参数描述： 无
//-------------------------------------------------------------
function Flow_ShowFlowAttribute()
{
	var objReturn = window.showModalDialog("FlowAttribute.aspx", window, "dialogHeight:230px; dialogWidth:450px;help:no;center:yes;status:no;resizable:no;location:yes;scroll:no;dialogLeft:260;dialogTop:353");
	if( objReturn == null )
	{
		if( FlowArea.FlowAttributes == null || FlowArea.FlowAttributes.FlowName == null || FlowArea.FlowAttributes.FlowName == "" )
		{
			// 清除当前流程
		    Flow_RemoveAllActiveNode();
			
			//清除当前流程的属性			Flow_RemoveFlowAttributes();

			//清除历史操作
			Flow_ClearOperations();

			// 初始化工具栏
			Setup_InitFlowToolBar();

			return false;
		}
	}
	else
	{
		FlowArea.FlowAttributes = objReturn;
		return true;
	}
}

//*************************************************************
// 功能描述： 关闭流程区域右键菜单
// 参数描述： 无
//-------------------------------------------------------------
function Flow_CloseFlowContextmenu()
{
	FlowContextmenuDiv.style.display = "none";
}

//*************************************************************
// 功能描述： 复制对象
// 参数描述： 无
//-------------------------------------------------------------
var objCopy = null;
function Flow_CopyActiveNode()
{
	var obj = Flow_GetCurrentActiveNode();
	objCopy = obj;

	// 设置工具栏编辑状态
	Flow_SetFlowToolBarEditStatus();
}

//*************************************************************
// 功能描述： 粘贴对象
// 参数描述： 无
//-------------------------------------------------------------
function Flow_PlastActiveNode()
{
	// 创建新的对象
	//Flow_CreateActiveNode(objCopy.childNodes[0].src, objCopy.NodeType);
	Flow_CreateActiveNodePasted(objCopy);

	// 将记录粘贴对象设为空
	objCopy = null;
}

//*************************************************************
// 功能描述： 对象发生改变设置函数
// 参数描述： 无
//-------------------------------------------------------------
function Flow_NodeHasChanged()
{
	// 改变右键菜单保存选项状态
	Flow_EnableSaveFlowMenu();
	// 对象发生改变
	bActiveNodeChange = true;
	// 创建对象表单
	Flow_CreateHiddenField("bActiveNodeChange", bActiveNodeChange);
}

function Flow_CreateHiddenField(elemID, elemValue)
{
	//alert("Name:"+ elemID);
	//alert("Value:"+ elemValue);
	//theform = _win.GISWin.tool_form;
	//var elem = _win.GISWin.document.getElementById(elemID);
	//if(elem != null)
	//{
		//elem.value = elemValue;
	//}
}

//*************************************************************
// 功能描述： 改变右键菜单保存选项状态
// 参数描述： 无
//-------------------------------------------------------------
function Flow_EnableSaveFlowMenu()
{
	SaveFlowTd.disabled = false;
}

//*************************************************************
// 功能描述： 改变右键菜单保存选项状态
// 参数描述： 无
//-------------------------------------------------------------
function Flow_DisableSaveFlowMenu()
{
	SaveFlowTd.disabled = true;
}

//*************************************************************
// 功能描述： 恢复对象发生改变设置函数
// 参数描述： 无
//-------------------------------------------------------------
function Flow_RestoreNodeChangedStatus()
{
	// 恢复对象未发生改变状态
	bActiveNodeChange = false;
}

//*************************************************************
// 功能描述： 添加流程动作
// 参数描述： 无
//-------------------------------------------------------------
function Flow_AddAction()
{
	Flow_PolyLineStart();
}

//*************************************************************
// 功能描述： 流程动作连线
// 参数描述： 无
//-------------------------------------------------------------
function Flow_PolyLineOnMouseMove()
{
	var line = document.getElementById("FlowWebEntity");
	
	if(line)
	{
		Flow_UpdatePolyLine(new Flow_Point(event.x+document.body.scrollLeft, event.y+document.body.scrollTop));
	}

	return false;
}

//*************************************************************
// 功能描述： 重画动作连线
// 参数描述： 无
//-------------------------------------------------------------
function Flow_UpdatePolyLine(currentPoint)
{
	var line = document.getElementById("FlowWebEntity");

	// Clip the current point based on the size of the image:
	currentPoint.x = Math.max(0, Math.min(currentPoint.x, FlowArea.offsetWidth+2));
	currentPoint.y = Math.max(0, Math.min(currentPoint.y, FlowArea.offsetHeight+2));

	// Now set the polylines points collection so that it draws the segments
	// it contains all the previously clicked points + current point (which is moving)
	// + the first point to complete the PolyLine
	var offset = line.lineOffset;
	currentPoint.x = currentPoint.x - offset.x;
	currentPoint.y = currentPoint.y - offset.y;
	line.points.value = G_StartPoint.x +","+ G_StartPoint.y + 
				" " + currentPoint.x + "," + currentPoint.y;
}

//*************************************************************
// 功能描述： 准备开始画动作连线
// 参数描述： 无
//-------------------------------------------------------------
var G_Started = false;
function Flow_PolyLineStart()
{
	if(!G_Started)
	{
		// Add event handlers to Flow
		FlowArea.onmousemove = Flow_PolyLineOnMouseMove;
		FlowArea.ondragstart = Flow_PolyLineOnMouseMove;
		FlowArea.ondblclick = Flow_CancelAction;
		
		G_Started = true;
	}
}

//*************************************************************
// 功能描述： 停止画动作连线
// 参数描述： 无
//-------------------------------------------------------------
function Flow_PolyLineStop()
{
	if(G_Started)
	{
		// -------- edit by zyn --------------
		var line = document.getElementById("FlowWebEntity");
		if( line )
			// 移除动作线
			FlowArea.removeChild(line);
		// 恢复设置动作连线工具状态
		//Flow_ResetFlowToolBar();
		// 恢复动作连线标识变量
		G_StartPoint = null;
		// ---------- end --------------------
		
		FlowArea.onmousemove = null;
		FlowArea.ondragstart = null;
		FlowArea.ondblclick = null;

		G_Started = false;
	}
}

//*************************************************************
// 功能描述： 取消动作连接
// 参数描述： 无
//-------------------------------------------------------------
function Flow_CancelAction()
{
	Flow_ClearTempAction();
}

//*************************************************************
// 功能描述： 画出连线对象
// 参数描述： 无
//-------------------------------------------------------------
var G_StartPoint;
var G_FromId;
var G_EndId;
function Flow_PolyLineOnMouseClick(obj)
{
	if (obj && obj.id 
		&& obj.id.indexOf("Node") > -1 
		|| (obj.parentNode && obj.parentNode.id.indexOf("Node") > -1))
	{
		if (obj.parentNode.id.indexOf("Node") > -1)
		{
			obj = obj.parentNode;
		}
		var line = document.getElementById("FlowWebEntity");
		if(!line)
		{
			line = document.createElement("<v:polyline filled='false' points=\"0,0\"/>");
			line.style.position = "absolute";
			line.style.visibility = "visible";
			line.id = "FlowWebEntity";			
			line.style.zIndex = 200;
					
			var stroke = document.createElement("<v:stroke dashstyle='dash' color='#CC0000' EndArrow='Classic' />");
			
			FlowArea.appendChild(line);			
			line.appendChild(stroke);
			
			line.lineOffset = new Flow_Point(line.offsetLeft, line.offsetTop);

			if (!G_StartPoint)
			{
				G_StartPoint = new Flow_Point(event.x, event.y);
				var offset = line.lineOffset;
				G_StartPoint.x = G_StartPoint.x - offset.x;
				G_StartPoint.y = G_StartPoint.y - offset.y;
				
				// 结束节点不能指向其它节点
				if (obj.NodeType != "EndNode")
				{
					G_FromId = obj.id;
				}
			}
		}
		else
		{
			G_EndId = obj.id;
			// 不能重复连线，并且不能指向开始节点
			if( !Flow_CheckActionBeExisted(G_FromId, G_EndId) && obj.NodeType != "StartNode" )
			{
				Flow_CreateAction(G_FromId, G_EndId);
				// 清除临时连线
				Flow_ClearTempAction();
			}
			//***************** start ********************************************
			//添加条件节点的属性
			var obj = document.getElementById(G_FromId);
			if( obj.NodeType == "CaseNode" )
				Flow_AddCaseNodeAttribute(obj, G_EndId);
			//------------------- end ------------------------------------------
		}
	}
	else
	{
		// 如果不是节点对象则不连线
		Flow_ClearTempAction();
	}

	return false;
}

//*************************************************************
// 功能描述： 添加条件节点的属性
// 参数描述： 无
//-------------------------------------------------------------
function Flow_AddCaseNodeAttribute(objNode, strEndId)
{
	if( objNode.NodePropertys.NodeConditions.length == 0 )
	{
		objNode.NodePropertys.NodeConditions = new Array();
	}

	var objCondition = new NodeCondition();
	var objNodeTmep = document.getElementById(strEndId);
	objCondition.NodeIdentify = objNodeTmep.SerialID;
	objCondition.NodeName = objNodeTmep.NodePropertys.Name;
	objCondition.ConditionNote = " ";
	objNode.NodePropertys.NodeConditions[objNode.NodePropertys.NodeConditions.length] = objCondition;
	// alert(objNode.NodePropertys.NodeConditions.length);
}

//*************************************************************
// 功能描述： 去除条件节点的某一个连接节点属性
// 参数描述： 无
//-------------------------------------------------------------
function Flow_RemoveCaseNodeAttribute(objNode, strToNodeSerialId)
{
	try
	{
		var objNodeConditions = objNode.NodePropertys.NodeConditions;
		for( var i = 0; i < objNodeConditions.length; i++ )
		{
			var objCondition = objNodeConditions[i];
			var strNodeIdentify = objCondition.NodeIdentify;
			// alert(strNodeIdentify);
			// alert(strToNodeSerialId);
			if( strNodeIdentify == strToNodeSerialId )
			{
				objNodeConditions.splice(i, 1);
			}
		}
	}
	catch(e)
	{
		alert("ErrorNumber:" + e.number + ". Error:" + e.description);
	}
}

//*************************************************************
// 功能描述： 添加新的动作对象
// 参数描述： 无
//-------------------------------------------------------------
var G_ActionSerialID = 1;
function Flow_CreateAction(strFromId, strEndId)
{
	var line = document.getElementById("FlowWebEntity");
	if (line)
	{
		var activeNode = line;

		var rnd_no = Math.round(Math.random() * 1000);
		var date_time = new Date();
		var Node_id = "Action_" + date_time.valueOf() + rnd_no;

		activeNode.id = Node_id;
		activeNode.NodeType = "Action";
		activeNode.Name = "Action";
		activeNode.FromNode = strFromId;
		activeNode.ToNode = strEndId;
		activeNode.Activate = Flow_SetNodeActivate;
		activeNode.Deactivate = Flow_SetNodeDeActivate;
		activeNode.onmousedown = Flow_MoveActiveNode;
		activeNode.oncontextmenu = Flow_ShowActiveNodeContextmenu;
		//***************** start ********************************************
		activeNode.SerialID = G_ActionSerialID;
		G_ActionSerialID = G_ActionSerialID + 1;
		//------------------- end ------------------------------------------

		// Add the activeNode to the document body:
		FlowArea.appendChild(activeNode);
		
		FlowArea.FlowNodes.Nodes[FlowArea.FlowNodes.Nodes.length] = activeNode;
		Flow_SetCurrentActiveNode(activeNode);
		
		var objFromNode = document.getElementById(strFromId);
		var objToNode = document.getElementById(strEndId);
		var strPointsValue = getActionPoints("PolyLine", objFromNode, objToNode);
		activeNode.points.value = strPointsValue;
		// 保存操作到列表
		Flow_SaveOperation(activeNode, "Add", null);
	}
}

//*************************************************************
// 功能描述： 从系统重新恢复动作对象
// 参数描述： strNodeID		- 对象ID
//			strNodeName	- 节点名称
//			strNodeImage	- 节点图片路径
//			strStyleFilter	- 节点样式
//			strScrX			- 节点屏幕坐标X
//			strScrY			- 节点屏幕坐标Y
//-------------------------------------------------------------
function Flow_BuildAction(strActionId, strFromId, strEndId)
{
	var line = document.createElement("<v:polyline filled='false' points=\"0,0\"/>");
	line.style.position = "absolute";
	line.style.visibility = "visible";
	line.id = "FlowWebEntity";			
	line.style.zIndex = 200;	
	//var stroke = document.createElement("<v:stroke dashstyle='dash' color='#CC0000' EndArrow='Classic' />");
	FlowArea.appendChild(line);			
	//line.appendChild(stroke);
	line.lineOffset = new Flow_Point(line.offsetLeft, line.offsetTop);

	var activeNode = line;
	activeNode.id = "Action_" + strActionId;
	activeNode.NodeType = "Action";
	activeNode.Name = "Action";
	activeNode.FromNode = strFromId;
	activeNode.ToNode = strEndId;
	activeNode.points.value = "";
	
	activeNode.Activate = Flow_SetNodeActivate;
	activeNode.Deactivate = Flow_SetNodeDeActivate;
	activeNode.onmousedown = Flow_MoveActiveNode;
	activeNode.oncontextmenu = Flow_ShowActiveNodeContextmenu;
	//***************** start ********************************************
	activeNode.SerialID = G_ActionSerialID;
	G_ActionSerialID = G_ActionSerialID + 1;
	//------------------- end ------------------------------------------

	FlowArea.appendChild(activeNode);
	
	FlowArea.FlowNodes.Nodes[FlowArea.FlowNodes.Nodes.length] = activeNode;
}

//*************************************************************
// 功能描述： 重新设置动作连线的位置
// 参数描述： 无
//-------------------------------------------------------------
function Flow_ResetActionPosition(obj)
{
	if (obj.id && obj.id.indexOf("Node") > -1)
	{
		// 取得相关的动作对象
		var objActions = Flow_GetRelationActions(obj);
		var intTop = obj.style.top;
		var intLeft = obj.style.left;
		for (var i = 0; i < objActions.length; i++)
		{
			var objFromNode = document.getElementById(objActions[i].FromNode);
			var objToNode = document.getElementById(objActions[i].ToNode);
			var strPointsValue = getActionPoints("PolyLine", objFromNode, objToNode);
			objActions[i].points.value = strPointsValue;
		}
	}
}

//*************************************************************
// 功能描述： 取得相关的动作对象
// 参数描述： 无
//-------------------------------------------------------------
function Flow_GetRelationActions(obj)
{
	var objs = FlowArea.FlowNodes.Nodes;
	var objActions = new Array();
	var intIndex = 0;
	for(var i = 0; i < objs.length; i++)
	{
		// 如果是节点图像则进行检查
		if(objs[i].NodeType == "Action" && (objs[i].FromNode == obj.id || objs[i].ToNode == obj.id))
		{
			objActions[intIndex] = objs[i];
			intIndex++;
		}
	}
	return objActions;
}

//*************************************************************
// 功能描述： 检查动作连线是否已经存在两个对象之间
// 参数描述： 无
//-------------------------------------------------------------
function Flow_CheckActionBeExisted(strFromId, strEndId)
{
	// 只有当起始和终止节点有效后才判断
	if (strFromId && strEndId)
	{
		// 如果是指向自己则自动退出
		if (strFromId == strEndId)
		{
			return true;
		}

		var objs = FlowArea.FlowNodes.Nodes;
		for(var i = 0; i < objs.length; i++)
		{
			// 如果是节点图像则进行检查
			if(objs[i].NodeType == "Action")
			{
				if (objs[i].FromNode == strFromId && objs[i].ToNode == strEndId)
				{
					return true;
				}
			}
		}
	}
	return false;
}

//*************************************************************
// 功能描述： 清除动作连线
// 参数描述： 无
//-------------------------------------------------------------
function Flow_ClearTempAction()
{
	var line = document.getElementById("FlowWebEntity");
	if(line)
	{
		// 移除动作线
		FlowArea.removeChild(line);
	}
	Flow_PolyLineStop();
	// 恢复设置动作连线工具状态
	Flow_ResetFlowToolBar();
	// 恢复动作连线标识变量
	G_StartPoint = null;
}

//*************************************************************
// 功能描述： 恢复设置动作连线工具状态
// 参数描述： 无
//-------------------------------------------------------------
function Flow_ResetFlowToolBar()
{
	// 粘贴对象时候可能出错
	try
	{
		// 判断是否已经恢复过
		var obj = Flow_GetCurrentActiveNode();
		if (obj)
		{
			FlowArea.activeToolControl.Deactivate(FlowArea.activeToolControl);
			FlowArea.style.cursor = "default";
			Flow_SetCurrentTool("None");
			// 设置FlowArea下面全部元素鼠标样式
			Flow_SetCursorStyle("");
		}
	}
	catch(wError){}
}

//*************************************************************
// 功能描述： 组织点对象
// 参数描述： 无
//-------------------------------------------------------------
function Flow_Point(x, y)
{
	this.x = parseInt(x);
	this.y = parseInt(y);
}

//*************************************************************
// 功能描述： 判断点对象位置是否重复
// 参数描述： 无
//-------------------------------------------------------------
function Flow_IfNodeRepeat(fromStepX, fromStepY, fromStepWidth, fromStepHeight, toStepX, toStepY, toStepWidth, toStepHeight)
{
	return (fromStepX + fromStepWidth >= toStepX) && (fromStepY + fromStepHeight >= toStepY) && (toStepX + toStepWidth >= fromStepX) && (toStepY + toStepHeight >= fromStepY);
}

//*************************************************************
// 功能描述： 重新组织点对象位置
// 参数描述： 无
//-------------------------------------------------------------
function getActionPoints(actionType, fromStep, toStep)
{
	if (fromStep==null || toStep==null) return '';

	var pointsHTML = '';

	var fromStepWidth = parseInt(fromStep.style.width);
	var fromStepHeight = parseInt(fromStep.style.height);
	var toStepWidth = parseInt(toStep.style.width);
	var toStepHeight = parseInt(toStep.style.height);
	var fromStepX = parseInt(fromStep.style.left);
	var fromStepY = parseInt(fromStep.style.top);
	var toStepX = parseInt(toStep.style.left);
	var toStepY = parseInt(toStep.style.top);

	//FromStep Center X,Y
	fromCenterX = fromStepX + parseInt(fromStepWidth/2);
	fromCenterY = fromStepY + parseInt(fromStepHeight/2);
	//ToStep Center X,Y
	toCenterX = toStepX + parseInt(toStepWidth/2);
	toCenterY = toStepY + parseInt(toStepHeight/2);

	if(actionType=='Line' && fromStep!=toStep)
	{
		//以下是Line的画线算法
		//ToStep：左上顶点
		toStepX1 = toStepX;
		toStepY1 = toStepY;
		//ToStep：右上顶点
		toStepX2 = toStepX + toStepWidth;
		toStepY2 = toStepY;
		//ToStep：左下顶点
		toStepX3 = toStepX;
		toStepY3 = toStepY + toStepHeight;
		//ToStep：右下顶点
		toStepX4 = toStepX + toStepWidth;
		toStepY4 = toStepY + toStepHeight;

		//如果ToStep在FromStep的右下方，则取ToStep的左上顶点
		if (toStepX>fromStepX && toStepY>fromStepY) {toX = toStepX1;toY = toStepY1;}
		//如果ToStep在FromStep的左下方，则取ToStep的右上顶点
		if (toStepX<fromStepX && toStepY>fromStepY) {toX = toStepX2;toY = toStepY2;}
		//如果ToStep在FromStep的右上方，则取ToStep的左下顶点
		if (toStepX>fromStepX && toStepY<fromStepY) {toX = toStepX3;toY = toStepY3;}
		//如果ToStep在FromStep的左上方，则取ToStep的右下顶点
		if (toStepX<fromStepX && toStepY<fromStepY) {toX = toStepX4;toY = toStepY4;}

		pointsHTML = 'from="'+fromCenterX+','+fromCenterY+'" to="'+toX+','+toY+'"'; 
	}
	else
	{
		//以下是PolyLine的画线算法

		if(fromStep!=toStep)
		{
			//步骤是否叠盖: 叠盖就不画连线
			if (Flow_IfNodeRepeat(fromStepX, fromStepY, fromStepWidth, fromStepHeight, toStepX, toStepY, toStepWidth, toStepHeight)) 
			{
				return "";
			} 

			point2X = fromCenterX;
			point2Y = toCenterY;

			if (toCenterX > fromCenterX) 
			{		  
				absY = toCenterY>=fromCenterY?toCenterY-fromCenterY:fromCenterY-toCenterY;
				if (parseInt(fromStepHeight/2)>=absY) 
				{
					point1X = fromStepX + fromStepWidth;
					point1Y = toCenterY;
					point2X = point1X;
					point2Y = point1Y;
				}
				else
				{
					point1X = fromCenterX;
					point1Y = fromCenterY<toCenterY?fromStepY+fromStepHeight:fromStepY;
				}
				absX = toCenterX-fromCenterX;
				if (parseInt(fromStepWidth/2) >= absX)
				{
					point3X = fromCenterX;
					point3Y = fromCenterY<toCenterY?toStepY:toStepY+toStepHeight;
					point2X = point3X;
					point2Y = point3Y;
				}
				else
				{
					point3X = toStepX;
					point3Y = toCenterY;
				}		   
			}
			if (toCenterX < fromCenterX)
			{
				absY = toCenterY>=fromCenterY?toCenterY-fromCenterY:fromCenterY-toCenterY;
				if (parseInt(fromStepHeight/2) >= absY)
				{
					point1X = fromStepX;
					point1Y = toCenterY;
					point2X = point1X;
					point2Y = point1Y;
				}
				else
				{
					point1X = fromCenterX;
					point1Y = fromCenterY<toCenterY?fromStepY+fromStepHeight:fromStepY;
				}
				absX = fromCenterX-toCenterX;
				if (parseInt(fromStepWidth/2)>=absX) 
				{
					point3X = fromCenterX;
					point3Y = fromCenterY<toCenterY?toStepY:toStepY+toStepHeight;
					point2X = point3X;
					point2Y = point3Y;
				}
				else
				{
					point3X = toStepX + toStepWidth;
					point3Y = toCenterY;
				}		   
			}
			if (toCenterX == fromCenterX)
			{
				point1X = fromCenterX;
				point1Y = fromCenterY>toCenterY?fromStepY:fromStepY+fromStepHeight;
				point3X = fromCenterX;
				point3Y = fromCenterY>toCenterY?toStepY+toStepHeight:toStepY;
				point2X = point3X;point2Y = point3Y;
			}
			if (toCenterY == fromCenterY) 
			{
				point1X = fromCenterX>toCenterX?fromStepX:fromStepX+fromStepWidth;
				point1Y = fromCenterY;
				point3Y = fromCenterY;
				point3X = fromCenterX>toCenterX?toStepX+toStepWidth:toStepX;
				point2X = point3X;point2Y = point3Y;
			}	   

			pointsHTML = point1X+','+point1Y+' '+point2X+','+point2Y+' '+point3X+','+point3Y;
		}
		else
		{
			var constLength = 30;
			point0X = fromStepX+fromStepWidth-constLength;
			point0Y = fromStepY+fromStepHeight;
			point1X = point0X;
			point1Y = point0Y+constLength;
			point2X = fromStepX+fromStepWidth+constLength;
			point2Y = point1Y;
			point3X = point2X;
			point3Y = point0Y-constLength;
			point4X = fromStepX+fromStepWidth;
			point4Y = point3Y;

			pointsHTML = point0X+','+point0Y+' '+point1X+','+point1Y+' '+point2X+','+point2Y+' '+point3X+','+point3Y+' '+point4X+','+point4Y;
		}
	}

	return pointsHTML;
}

//*************************************************************
// 功能描述： 工具初始化设置
// 参数描述： 无
//-------------------------------------------------------------
function SetupTool(objTool, strCursor, objCommand, objOrder)
{
	
	objTool.Activate = Flow_ToolActivate;
	objTool.Deactivate = Flow_ToolDeactivate;
//	objTool.activeSrc = activeSrc;
//	objTool.inactiveSrc = inactiveSrc;
	if (strCursor)
	{
		objTool.cursorUrl = strCursor;
	}
	if (objCommand)
	{
		objTool.command = objCommand;
	}
	if (objOrder)
	{
		objTool.order = objOrder;
	}
}

//*************************************************************
// 功能描述： 当前流程工具
// 参数描述： 无
//-------------------------------------------------------------
function Flow_FlowTool()
{
	this.Name = "";
}

//*************************************************************
// 功能描述： 流程工具集合
// 参数描述： 无
//-------------------------------------------------------------
function Flow_FlowTools()
{
}

//*************************************************************
// 功能描述： 激活当前工具
// 参数描述： 无
//-------------------------------------------------------------
var objTimer = null;
function Flow_ActivateTool(tool, strNodeImage, strNodeType) {
	// 如果点击了任意工具即停止流程模拟
	if (!G_StopSimulation)
	{
		// 清除临时示意图
		Flow_ClearMovingHintChart();
	}

	// 如果点击了动作连线工具则取消动作连线
	Flow_PolyLineStop();

	if(tool.order)
	{
		tool.Activate(tool);
		tool.order();
		objTimer = setTimeout("Flow_DeactivateCommandTool('"+ tool.id +"')", 200);

		if( tool.id != "NewFlow" && tool.id != "DownloadFlow" )
		{
			// 恢复工具栏状态
			Flow_SetFlowToolBarStatus();
			// 恢复设置动作连线工具状态
			Flow_ResetFlowToolBar();
		}
		else
		{
			if( FlowArea.FlowAttributes != null && FlowArea.FlowAttributes.FlowName != null && FlowArea.FlowAttributes.FlowName != "" )
			{
				// 恢复工具栏状态
			    Flow_SetFlowToolBarStatus();
				
				// 恢复设置动作连线工具状态
				Flow_ResetFlowToolBar();
			}
		}
		
		return;
	}
	
	if (FlowArea.activeToolControl != null && FlowArea.activeToolControl.id == tool.id && FlowArea.activeToolControl.active) {
		FlowArea.activeToolControl.Deactivate(FlowArea.activeToolControl);
		Flow_SetCurrentTool("None");
		// 设置FlowArea下面全部元素鼠标样式
		Flow_SetCursorStyle("");
	} 
	else
	{
		if (FlowArea.activeToolControl != null) FlowArea.activeToolControl.Deactivate(FlowArea.activeToolControl);
		FlowArea.activeToolControl = tool;
		if(FlowArea.activeToolControl != null)
		{
			FlowArea.activeToolControl.Activate(tool);
		}
		
		Flow_SetCurrentTool(tool);
		// 设置FlowArea下面全部元素鼠标样式
		Flow_SetCursorStyle(tool.cursorUrl);
		
		tool.command(strNodeImage, strNodeType);
	} 
}

//*************************************************************
// 功能描述： 恢复工具按钮状态
// 参数描述： 无
//-------------------------------------------------------------
function Flow_DeactivateCommandTool(toolId)
{
	var tool = document.getElementById(toolId);
	tool.Deactivate(tool);
	clearTimeout(objTimer);
}

//*************************************************************
// 功能描述： 设置流程区域的当前工具
// 参数描述： 无
//-------------------------------------------------------------
function Flow_SetCurrentTool(objTool)
{
	if (FlowArea != null && FlowArea.FlowTools != null)
	{
		for (i = 0; i < FlowArea.FlowTools.Tools.length; i++)
		{
			var tool = FlowArea.FlowTools.Tools[i];
			if (tool != null)
			{
				if (objTool.id == tool.Name)
				{
					FlowArea.FlowTools.CurrentTool = objTool;
				}
			}
		}
	}
}

//*************************************************************
// 功能描述： 取得流程区域的当前工具
// 参数描述： 无
//-------------------------------------------------------------
function Flow_GetCurrentTool()
{
	if (FlowArea != null && FlowArea.FlowTools != null)
	{
		return FlowArea.FlowTools.CurrentTool;
	}
}

//*************************************************************
// 功能描述： 激活当前工具
// 参数描述： 无
//-------------------------------------------------------------
function Flow_ToolActivate(tool)
{
    //	tool.src = tool.activeSrc;
    tool.parentNode.className = "down";
	tool.active = true;
}

//*************************************************************
// 功能描述： 恢复当前工具
// 参数描述： 无
//-------------------------------------------------------------
function Flow_ToolDeactivate(tool)
{
    //	tool.src = this.inactiveSrc;
    tool.parentNode.className = "aFilter";
	tool.active = false;
}

//*************************************************************
// 功能描述： 取消节点焦点
// 参数描述： 无
//-------------------------------------------------------------
function Flow_CancelActiveNodeFocus()
{
	// 如果在节点上点击右键则不取消对象焦点
	if((!event.srcElement.NodeType && !event.srcElement.parentNode.NodeType) && event.srcElement.id && !G_CancelAddNode)
	{
		var obj = Flow_GetCurrentActiveNode();
		Flow_SetNodeDeActivate(obj);
		Flow_SetCurrentActiveNode(null);
		// 显示右键菜单
		Flow_ShowFlowContextmenu();
		// 恢复取消标识
		G_CancelAddNode = false;
	}
	
	event.cancelBubble = true
	event.returnValue = false;
	return false;
}

//*************************************************************
// 功能描述： 关闭相关漂浮菜单
// 参数描述： 无
//-------------------------------------------------------------
function Flow_ClosePopuMenueDiv()
{
	// 关闭右键菜单
	Flow_CloseActiveNodeContextmenu();
	Flow_CloseFlowContextmenu();
}

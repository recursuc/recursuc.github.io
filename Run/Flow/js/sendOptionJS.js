/*****************成员变量*****************************************************************************/

//节点对象
function Node() {
	this.EventStepId="";
    this.Id = "";
    this.Name = "";
    this.NodeType = "";
    this.ParentNodeClientId = "";
    this.AccepterIds = "";
    this.AccepterNames = "";
    this.AllowAddAccepter = "";
    this.DisposalLimitNumber = "";
    this.DisposalLimitUnit = "";
    this.RespondLimitNumber = "";
    this.RespondLimitUnit = "";
    this.IsCodeterminant = "";
    this.DecisionerManIds = "";
    this.DecisionerManNames = "";
    this.DecisionerManId = "";
    this.TerminateMansNumber = "";
    this.Importance = "";
    this.IsRememberSendUser = "";
    this.ChildNodes = new Array();
}

var nodesList = new Array(); //节点对象集合
var childNodeList = new Array(); //选择的子节点对象
var requestObj = window.dialogArgs;
var treeType = "node"; //标识树控件展现方式:node、all
var tabArray = new Array("node", "all", "select"); //Tab页标签名
var proveChildNotice = ""; // 提供子节点选择的提示信息
var submitType = ""; //提交类型
var returnAcceptIds = ""; //返回接收人ID集合
var returnAcceptNames = ""; //返回接收人名称集合
var currentRadio; //当前选择的子流程节点下的开始节点
var div_UserChoice = null; //蒙版区域
/*****************页面加载*****************************************************************************/

//初始化页面
function InitPage() {
    div_UserChoice = document.getElementById("div_sendOptionMain");
    submitType = document.getElementById("submitType").value;
    if (requestObj) {
        //初始化索引
        var initIndex = 0;

        //设置下一环节下拉列表数据源
        var selectObj = document.getElementById("sel_node");

        //交办、传阅都设置选择节点控件灰化
        if (submitType == "Delegate" || submitType == "CopySend") {
            selectObj.disabled = true;
        }

        //加载下拉列表
        if ($(requestObj[0]).find("Nodes")) {
            for (var i = 0; i < $(requestObj[0]).find("Nodes>Node").size(); i++) {
                var node = $(requestObj[0]).find("Nodes>Node")[i];

                if (typeof selectObj != "undefined") {
                    var option = new Option(node.getAttribute("Name"), node.getAttribute("Id"));
                    selectObj.options.add(option);

                    //初始化全局对象
                    var newNode = GetNodeByNodeXml(node);
                    nodesList[i] = newNode;
                }
            }
        }
        //加载树、时限等
        LoadLimit(initIndex);
    }
}

//获取节点对象，通过传入节点xml对象
//nodeXml -- 节点xml对象
//return: Node对象
function GetNodeByNodeXml(nodeXml) {
    var newNode = new Node();
    
    newNode.EventStepId=nodeXml.getAttribute("EventStepId") ? nodeXml.getAttribute("EventStepId") : "";
    
    newNode.Id = nodeXml.getAttribute("Id") ? nodeXml.getAttribute("Id") : "";
    newNode.Name = nodeXml.getAttribute("Name") ? nodeXml.getAttribute("Name") : "";
    newNode.NodeType = nodeXml.getAttribute("NodeType") ? nodeXml.getAttribute("NodeType") : "";
    newNode.AccepterIds = nodeXml.getAttribute("AccepterIds") ? nodeXml.getAttribute("AccepterIds") : "";
    newNode.AccepterNames = nodeXml.getAttribute("AccepterNames") ? nodeXml.getAttribute("AccepterNames") : "";
    newNode.AllowAddAccepter = nodeXml.getAttribute("AllowAddAccepter") ? nodeXml.getAttribute("AllowAddAccepter") : "";
    newNode.DisposalLimitNumber = nodeXml.getAttribute("DisposalLimitNumber") ? nodeXml.getAttribute("DisposalLimitNumber") : "8";
    newNode.RespondLimitNumber = nodeXml.getAttribute("RespondLimitNumber") ? nodeXml.getAttribute("RespondLimitNumber") : "8";
    newNode.IsCodeterminant = nodeXml.getAttribute("IsCodeterminant") ? nodeXml.getAttribute("IsCodeterminant") : "0";
    newNode.ParentNodeClientId = nodeXml.getAttribute("ParentNodeClientId") ? nodeXml.getAttribute("ParentNodeClientId") : "";
    newNode.IsRememberSendUser = nodeXml.getAttribute("IsRememberSendUser") ? nodeXml.getAttribute("IsRememberSendUser") : "0";
    if (newNode.IsCodeterminant == 1) {
        //会签
        newNode.DecisionerManIds = nodeXml.getAttribute("DecisionerManIds") ? nodeXml.getAttribute("DecisionerManIds") : "";
        newNode.DecisionerManNames = nodeXml.getAttribute("DecisionerManNames") ? nodeXml.getAttribute("DecisionerManNames") : "";
        newNode.TerminateMansNumber = nodeXml.getAttribute("TerminateMansNumber") ? nodeXml.getAttribute("TerminateMansNumber") : "0";
        document.getElementById("txt_terminateMansNumber").value = newNode.TerminateMansNumber;
    }

    //加载子节点
    if ($(nodeXml).find("Node").size() > 0) {
        for (var i = 0; i < $(nodeXml).find("Node").size(); i++) {
            newNode.ChildNodes.push(GetNodeByNodeXml($(nodeXml).find("Node")[i]));
        }
    }
    return newNode;
}

//加载时限控件和树控件
function LoadLimit(initIndex) {
    var node = nodesList[initIndex];
    currNode = node;
   
    if (node) {
        if (submitType == "CopySend") {
            //传阅（抄送）
            LoadLimitOnCopySend(node);
        }
        else {
            LoadLimitOnElse(node);
        }
    }
}

//传阅（抄送）加载时限和树控件
function LoadLimitOnCopySend(node) {
    //并行开始下一步节点区域
    document.getElementById("tb_pstartNextNode").style.display = "none";

    //会签相关
    SetDecisionerMan("none");

    //用户选择树
    document.getElementById("UserSelect").disabled = false;
    document.getElementById("choiseBtn").disabled = false;
    document.getElementById("deleteBtn").disabled = false;
    var iframeObj = document.getElementById("UserSelect");
    if (iframeObj) {
    	iframeObj.src = "";
    	iframeObj.src = "userSelect.html?typeTree=" + treeType + "&userIds=" + node.AccepterIds 
    		+ "&userNames=" + node.AccepterNames + "&allowAddAccepter=" + node.AllowAddAccepter;
        //iframeObj.contentWindow.document.getElementById("form1").src = "userSelect.html?typeTree=" + treeType;
        //iframeObj.contentWindow.document.getElementById("hid_userIds").value = node.AccepterIds;
        //iframeObj.contentWindow.document.getElementById("hid_userNames").value = node.AccepterNames;
        //iframeObj.contentWindow.document.getElementById("hid_AllowAddAccepter").value = node.AllowAddAccepter;
        //iframeObj.contentWindow.document.getElementById("form1").submit();
    }

    //允许添加所有人
    if (node.AllowAddAccepter == "1") {
        document.getElementById("tab_all").style.display = "block";
    }
}

//其它操作加载时限和树控件
function LoadLimitOnElse(node) {
    var nodeType = node.NodeType.toString();

    switch (nodeType) {
        case "EndNode":
            {
                if (node.ChildNodes.length > 0) {
                    //子流程节点处理
                    proveChildNotice = "选择下一步节点";
                    document.getElementById("td_childNotice").innerHTML = proveChildNotice + "：";
                    //子流程的开始节点区域
                    document.getElementById("tb_pstartNextNode").style.display = "block";

                    SetDecisionerMan("none");

                    var n = 0;
                    for (var i = 0; i < node.ChildNodes.length; i++) {
                        if (node.ChildNodes[i].NodeType == "SubFlowNode" || node.ChildNodes[i].NodeType == "ParallelStartNode" || node.ChildNodes[i].NodeType == "ParallelEndNode") {
                            n++;
                        }
                    }
                    if (n > 0) {
                        LoadChildNode(node, "select");
                    } 
                    else {
                        LoadChildNode(node, "radio");
                    }
                    if (n == 0) {
                        //响应时限
                        document.getElementById("txt_respondLimit").disabled = true;
                        document.getElementById("drp_respondLimitUnit").disabled = true;
                        //处理时限
                        document.getElementById("txt_disposalLimit").disabled = true;
                        document.getElementById("drp_disposalLimitUnit").disabled = true;
                        //树
                        document.getElementById("UserSelect").disabled = true;

                        //重要度
                        document.getElementById("drp_important").disabled = true;
                        document.getElementById("choiseBtn").disabled = true;
                        document.getElementById("deleteBtn").disabled = true;

                        SetDecisionerMan("none");

                        DisableDiv(div_UserChoice);
                    } 
                    else {
                        node = node.ChildNodes[0];
                        if (node.NodeType == "SubFlowNode") {
                            //子流程节点处理
                            proveChildNotice = "选择子流程的开始节点";
                            document.getElementById("td_childNotice").innerHTML = proveChildNotice + "：";
                            //子流程的开始节点区域
                            document.getElementById("tb_pstartNextNode").style.display = "block";

                            SetDecisionerMan("none");

                            //1. 加载开始节点的复选框
                            LoadChildNode(node, "radio");

                            //2. 树
                            document.getElementById("UserSelect").disabled = true;
                            document.getElementById("UserSelect").style.display = "none";

                            //3.清空值
                            //响应时限
                            document.getElementById("txt_respondLimit").value = node.DisposalLimitNumber;
                            document.getElementById("drp_respondLimitUnit").value = "Hour";
                            //处理时限
                            document.getElementById("txt_disposalLimit").value = node.RespondLimitNumber;
                            document.getElementById("drp_disposalLimitUnit").value = "Hour";

                        }
                        else if (node.NodeType == "ParallelStartNode") {
                            //并行开始处理
                            proveChildNotice = "选择并行开始后的节点";
                            document.getElementById("td_childNotice").innerHTML = proveChildNotice + "：";
                            //并行开始下一步节点区域
                            document.getElementById("tb_pstartNextNode").style.display = "block";

                            SetDecisionerMan("none");

                            var n = 0;
                            for (var i = 0; i < node.ChildNodes.length; i++) {
                                if (node.ChildNodes[i].NodeType == "SubFlowNode") {
                                    n++;
                                }
                            }
                            if (n > 0) {
                                LoadChildNode(node, "selectSub");
                            } else {
                                LoadChildNode(node, "checkbox");
                            }

                            if (n == 0) {
                                //1. 加载子节点的复选框
                                //                LoadChildNode(node, "checkbox");

                                //2. 蒙版用户选择区
                                DisableDiv(div_UserChoice);

                                //3. 树
                                document.getElementById("UserSelect").disabled = true;
                                document.getElementById("UserSelect").style.display = "none";

                                //4.清空值
                                //响应时限
                                document.getElementById("txt_respondLimit").value = node.DisposalLimitNumber;
                                document.getElementById("drp_respondLimitUnit").value = "Hour";
                                //处理时限
                                document.getElementById("txt_disposalLimit").value = node.RespondLimitNumber;
                                document.getElementById("drp_disposalLimitUnit").value = "Hour";
                                document.getElementById("drp_returnUser").style.display = "none";
                            } else {
                                node = node.ChildNodes[0];
                                if (node.NodeType == "SubFlowNode") {
                                    proveChildNotice = "选择子流程的开始节点";
                                    document.getElementById("td_childNotice").innerHTML = proveChildNotice + "：";
                                }
                                //1. 加载子节点的复选框
                                LoadChildNode(node, "radio");
                                if (node.ChildNodes.length <= 0) {
                                    document.getElementById("td_childNotice").innerHTML = "";
                                }
                                //2. 蒙版用户选择区
                                DisableDiv(div_UserChoice);

                                //3. 树
                                document.getElementById("UserSelect").disabled = true;
                                document.getElementById("UserSelect").style.display = "none";

                                //4.清空值
                                //响应时限
                                document.getElementById("txt_respondLimit").value = node.DisposalLimitNumber;
                                document.getElementById("drp_respondLimitUnit").value = "Hour";
                                //处理时限
                                document.getElementById("txt_disposalLimit").value = node.RespondLimitNumber;
                                document.getElementById("drp_disposalLimitUnit").value = "Hour";
                                document.getElementById("drp_returnUser").style.display = "none";
                            }
                        }
                        else if (node.NodeType == "ParallelEndNode") {
                            //并行结束处理
                            proveChildNotice = "选择并行结束后的节点";
                            document.getElementById("td_childNotice").innerHTML = proveChildNotice + "：";
                            //并行开始下一步节点区域
                            document.getElementById("tb_pstartNextNode").style.display = "block";

                            SetDecisionerMan("none");

                            var n = 0;
                            for (var i = 0; i < node.ChildNodes.length; i++) {
                                if (node.ChildNodes[i].NodeType == "SubFlowNode") {
                                    n++;
                                }
                            }
                            if (n > 0) {
                                LoadChildNode(node, "selectRadio");
                            } else {
                                LoadChildNode(node, "radio");
                            }
                            if (n == 0) {
                                node = node.ChildNodes[0];
                                if (node.IsCodeterminant == "1") {
                                    SetDecisionerMan("block");
                                    if (!GetDecisionerManInf(node.DecisionerManIds)) {
                                        return;
                                    };
                                    var selectDecisionerMan = document.getElementById("sel_decisionerMan");
                                } else {
                                    SetDecisionerMan("none");
                                }
                                document.getElementById("drp_returnUser").style.display = "block";
                                //并行开始下一步节点区域
                                document.getElementById("tb_pstartNextNode").style.display = "none";

                                //响应时限
                                document.getElementById("txt_respondLimit").disabled = false;
                                document.getElementById("drp_respondLimitUnit").disabled = false;
                                //处理时限
                                document.getElementById("txt_disposalLimit").disabled = false;
                                document.getElementById("drp_disposalLimitUnit").disabled = false;

                                //重要度
                                document.getElementById("drp_important").disabled = false;
                                document.getElementById("choiseBtn").disabled = false;
                                document.getElementById("deleteBtn").disabled = false;

                                //树
                                LoadUserSelectTree(node);

                                //允许添加所有人
                                if (node.AllowAddAccepter == "1") {
                                    document.getElementById("tab_all").style.display = "block";
                                }

                                //处理节点
                                //响应时限
                                document.getElementById("txt_respondLimit").value = node.DisposalLimitNumber;
                                document.getElementById("drp_respondLimitUnit").value = "Hour";
                                //处理时限
                                document.getElementById("txt_disposalLimit").value = node.RespondLimitNumber;
                                document.getElementById("drp_disposalLimitUnit").value = "Hour";

                                //并行处理的展现恢复
                                //取消蒙版
                                AbleDiv();
                                document.getElementById("tb_pstartNextNode").style.display = "block";
                            } else {
                                node = node.ChildNodes[0];
                                if (node.NodeType != "SubFlowNode") {
                                    document.getElementById("td_childNotice").innerHTML = "";
                                    if (node.IsCodeterminant == "1") {
                                        SetDecisionerMan("block");
                                        if (!GetDecisionerManInf(node.DecisionerManIds)) {
                                            return;
                                        };
                                        var selectDecisionerMan = document.getElementById("sel_decisionerMan");
                                    } else {
                                        SetDecisionerMan("none");
                                    }
                                    document.getElementById("drp_returnUser").style.display = "block";
                                    //并行开始下一步节点区域
                                    document.getElementById("tb_pstartNextNode").style.display = "none";

                                    //响应时限
                                    document.getElementById("txt_respondLimit").disabled = false;
                                    document.getElementById("drp_respondLimitUnit").disabled = false;
                                    //处理时限
                                    document.getElementById("txt_disposalLimit").disabled = false;
                                    document.getElementById("drp_disposalLimitUnit").disabled = false;

                                    //重要度
                                    document.getElementById("drp_important").disabled = false;
                                    document.getElementById("choiseBtn").disabled = false;
                                    document.getElementById("deleteBtn").disabled = false;

                                    //树
                                    LoadUserSelectTree(node);

                                    //允许添加所有人
                                    if (node.AllowAddAccepter == "1") {
                                        document.getElementById("tab_all").style.display = "block";
                                    }

                                    //处理节点
                                    //响应时限
                                    document.getElementById("txt_respondLimit").value = node.DisposalLimitNumber;
                                    document.getElementById("drp_respondLimitUnit").value = "Hour";
                                    //处理时限
                                    document.getElementById("txt_disposalLimit").value = node.RespondLimitNumber;
                                    document.getElementById("drp_disposalLimitUnit").value = "Hour";

                                    //并行处理的展现恢复
                                    //取消蒙版
                                    AbleDiv();
                                    document.getElementById("tb_pstartNextNode").style.display = "block";
                                } else {
                                    //1. 加载子节点的复选框
                                    LoadChildNode(node, "radio");

                                    //2. 蒙版用户选择区
                                    DisableDiv(div_UserChoice);

                                    //3. 树
                                    document.getElementById("UserSelect").disabled = true;
                                    document.getElementById("UserSelect").style.display = "none";

                                    //4.清空值
                                    //响应时限
                                    document.getElementById("txt_respondLimit").value = node.DisposalLimitNumber;
                                    document.getElementById("drp_respondLimitUnit").value = "Hour";
                                    //处理时限
                                    document.getElementById("txt_disposalLimit").value = node.RespondLimitNumber;
                                    document.getElementById("drp_disposalLimitUnit").value = "Hour";
                                    document.getElementById("drp_returnUser").style.display = "none";
                                }
                            }
                        }
                        else {
                            if (node.IsCodeterminant == "1") {
                                SetDecisionerMan("block");
                                if (!GetDecisionerManInf(node.DecisionerManIds)) {
                                    return;
                                };
                                var selectDecisionerMan = document.getElementById("sel_decisionerMan");
                            } else {
                                SetDecisionerMan("none");
                            }
                            document.getElementById("drp_returnUser").style.display = "block";
                            //并行开始下一步节点区域
                            document.getElementById("tb_pstartNextNode").style.display = "none";

                            //响应时限
                            document.getElementById("txt_respondLimit").disabled = false;
                            document.getElementById("drp_respondLimitUnit").disabled = false;
                            //处理时限
                            document.getElementById("txt_disposalLimit").disabled = false;
                            document.getElementById("drp_disposalLimitUnit").disabled = false;

                            //重要度
                            document.getElementById("drp_important").disabled = false;
                            document.getElementById("choiseBtn").disabled = false;
                            document.getElementById("deleteBtn").disabled = false;

                            //树
                            LoadUserSelectTree(node);

                            //允许添加所有人
                            if (node.AllowAddAccepter == "1") {
                                document.getElementById("tab_all").style.display = "block";
                            }

                            //处理节点
                            //响应时限
                            document.getElementById("txt_respondLimit").value = node.DisposalLimitNumber;
                            document.getElementById("drp_respondLimitUnit").value = "Hour";
                            //处理时限
                            document.getElementById("txt_disposalLimit").value = node.RespondLimitNumber;
                            document.getElementById("drp_disposalLimitUnit").value = "Hour";

                            //并行处理的展现恢复
                            //取消蒙版
                            AbleDiv();
                            //取消子节点显示
                            document.getElementById("td_choiceNextNode").innerHTML = "";
                        }
                    }

                } else {
                    //结束节点
                    //隐藏整个面板
                    DisableDiv(div_sendOptionMain);

                    //并行开始下一步节点区域
                    document.getElementById("tb_pstartNextNode").style.display = "none";

                    //响应时限
                    //document.getElementById("txt_respondLimit").disabled = true;
                    //document.getElementById("drp_respondLimitUnit").disabled = true;
                    //处理时限
                    //document.getElementById("txt_disposalLimit").disabled = true;
                    //document.getElementById("drp_disposalLimitUnit").disabled = true;
                    //树
                    //document.getElementById("UserSelect").disabled = true;

                    //重要度
                    //document.getElementById("drp_important").disabled = true;
                    //document.getElementById("choiseBtn").disabled = true;
                    //document.getElementById("deleteBtn").disabled = true;

                    //会签相关
                    SetDecisionerMan("none");
                }
            } break;
        case "SubFlowNode":
            {
                //子流程节点处理
                proveChildNotice = "选择子流程的开始节点";
                document.getElementById("td_childNotice").innerHTML = proveChildNotice + "：";
                document.getElementById("td_childNotice").style.display = "block";
                //子流程的开始节点区域
                document.getElementById("tb_pstartNextNode").style.display = "block";

                SetDecisionerMan("none");

                //1. 加载开始节点的复选框
                LoadChildNode(node, "radio");
                //蒙版用户选择区
                DisableDiv(div_UserChoice);
                //2. 树
                //document.getElementById("UserSelect").disabled = true;
                document.getElementById("UserSelect").style.display = "none";

                //3.清空值
                //响应时限
                //document.getElementById("txt_respondLimit").value = node.DisposalLimitNumber;
                //document.getElementById("drp_respondLimitUnit").value = "Hour";
                //处理时限
                //document.getElementById("txt_disposalLimit").value = node.RespondLimitNumber;
                //document.getElementById("drp_disposalLimitUnit").value = "Hour";
            } break;
        case "ParallelStartNode":
            {
                //并行开始处理
                proveChildNotice = "选择并行开始后的节点";
                document.getElementById("td_childNotice").innerHTML = proveChildNotice + "：";
                //并行开始下一步节点区域
                document.getElementById("tb_pstartNextNode").style.display = "block";

                SetDecisionerMan("none");

                var n = 0;
                for (var i = 0; i < node.ChildNodes.length; i++) {
                    if (node.ChildNodes[i].NodeType == "SubFlowNode") {
                        n++;
                    }
                }
                if (n > 0) {
                    LoadChildNode(node, "selectSub");
                } else {
                    LoadChildNode(node, "checkbox");
                }

                if (n == 0) {
                    //1. 加载子节点的复选框
                    //LoadChildNode(node, "checkbox");

                    //2. 蒙版用户选择区
                    DisableDiv(div_UserChoice);

                    //3. 树
                    document.getElementById("UserSelect").disabled = true;
                    document.getElementById("UserSelect").style.display = "none";

                    //4.清空值
                    //响应时限
                    document.getElementById("txt_respondLimit").value = node.DisposalLimitNumber;
                    document.getElementById("drp_respondLimitUnit").value = "Hour";
                    //处理时限
                    document.getElementById("txt_disposalLimit").value = node.RespondLimitNumber;
                    document.getElementById("drp_disposalLimitUnit").value = "Hour";
                    document.getElementById("drp_returnUser").style.display = "none";
                } else {
                    node = node.ChildNodes[0];
                    //1. 加载子节点的复选框
                    LoadChildNode(node, "radio");
                    if (node.ChildNodes.length <= 0) {
                        document.getElementById("td_childNotice").innerHTML = "";
                    }
                    //2. 蒙版用户选择区
                    DisableDiv(div_UserChoice);

                    //3. 树
                    document.getElementById("UserSelect").disabled = true;
                    document.getElementById("UserSelect").style.display = "none";

                    //4.清空值
                    //响应时限
                    document.getElementById("txt_respondLimit").value = node.DisposalLimitNumber;
                    document.getElementById("drp_respondLimitUnit").value = "Hour";
                    //处理时限
                    document.getElementById("txt_disposalLimit").value = node.RespondLimitNumber;
                    document.getElementById("drp_disposalLimitUnit").value = "Hour";
                    document.getElementById("drp_returnUser").style.display = "none";
                }
            } break;
        case "ParallelEndNode":
            {
                //并行结束处理
                proveChildNotice = "选择并行结束后的节点";
                document.getElementById("td_childNotice").innerHTML = proveChildNotice + "：";
                //并行开始下一步节点区域
                document.getElementById("tb_pstartNextNode").style.display = "block";

                SetDecisionerMan("none");

                var n = 0;
                for (var i = 0; i < node.ChildNodes.length; i++) {
                    if (node.ChildNodes[i].NodeType == "SubFlowNode") {
                        n++;
                    }
                }
                if (n == 0) {
                    LoadChildNode(node, "select");
                } else {
                    LoadChildNode(node, "checkbox");
                }
                if (n == 0) {
                    //加载第一个节点
                    node = node.ChildNodes[0];
                    LoadLimitOnElse(node);
                } 
                else {
                    node = node.ChildNodes[0];
                    //1. 加载子节点的复选框
                    LoadChildNode(node, "radio");

                    //2. 蒙版用户选择区
                    //DisableDiv(div_UserChoice);

                    //3. 树
                    document.getElementById("UserSelect").disabled = true;
                    document.getElementById("UserSelect").style.display = "none";

                    //4.清空值
                    //响应时限
                    document.getElementById("txt_respondLimit").value = node.DisposalLimitNumber;
                    document.getElementById("drp_respondLimitUnit").value = "Hour";
                    //处理时限
                    document.getElementById("txt_disposalLimit").value = node.RespondLimitNumber;
                    document.getElementById("drp_disposalLimitUnit").value = "Hour";
                    document.getElementById("drp_returnUser").style.display = "none";
                }
            } break;
        default:
            {
                if (node.IsCodeterminant == "1") {
                    SetDecisionerMan("block");
                    if (!GetDecisionerManInf(node.DecisionerManIds)) {
                        return;
                    };
                    var selectDecisionerMan = document.getElementById("sel_decisionerMan");
                } else {
                    SetDecisionerMan("none");
                }
                document.getElementById("drp_returnUser").style.display = "block";
                //并行开始下一步节点区域
                document.getElementById("tb_pstartNextNode").style.display = "none";
                //树
                LoadUserSelectTree(node);

                //允许添加所有人
                if (node.AllowAddAccepter == "1") {
                    document.getElementById("tab_all").style.display = "block";
                }

                //处理节点
                //响应时限
                document.getElementById("txt_respondLimit").value = node.DisposalLimitNumber;
                document.getElementById("drp_respondLimitUnit").value = "Hour";
                //处理时限
                document.getElementById("txt_disposalLimit").value = node.RespondLimitNumber;
                document.getElementById("drp_disposalLimitUnit").value = "Hour";

                //并行处理的展现恢复
                //取消蒙版
                AbleDiv();
                //取消子节点显示
                document.getElementById("td_choiceNextNode").innerHTML = "";
            } break;
    }
}

//设置会签展示
function SetDecisionerMan(isDisplay) {
    document.getElementById("td_label1").style.display = "" + isDisplay + "";
    document.getElementById("td_label2").style.display = "" + isDisplay + "";
    document.getElementById("td_label3").style.display = "" + isDisplay + "";
    document.getElementById("td_label4").style.display = "" + isDisplay + "";
}

function changeSubFlowcheck(obj) {
    if (obj.checked == true) {
        proveChildNotice = "选择子流程的开始节点";
        document.getElementById("td_childNotice").innerHTML = proveChildNotice + "：";
        var index = document.getElementById("sel_node").selectedIndex;
        var node = nodesList[index];
        var selectChildNode = document.getElementById("sel_childnode");
        if (selectChildNode.length > 0) {
            for (var i = 0; i < node.ChildNodes.length; i++) {
                if (node.ChildNodes[i].Id == selectChildNode.options(selectChildNode.selectedIndex).value) {
                    for (var j = 0; j < node.ChildNodes[i].ChildNodes.length; j++) {
                        if (obj.value == node.ChildNodes[i].ChildNodes[j].Id) {
                            LoadChildNode(node.ChildNodes[i].ChildNodes[j], "radio");
                        }
                    }
                }
            }
        } else {
            for (var i = 0; i < node.ChildNodes.length; i++) {
                if (obj.value == node.ChildNodes[i].Id) {
                    LoadChildNode(node.ChildNodes[i], "radio");
                }
            }
        }
    } else {
        DisableDiv(div_UserChoice);
        document.getElementById("td_choiceNextNode").innerHTML = "";
        document.getElementById("td_childNotice").innerHTML = "";
    }
}

//加载子节点选择复选框
function LoadChildNode(node, type) {
    var childNodeHtml = "";
    var nodeType = node.NodeType.toString();
    switch (type) {
        case "checkbox":
            {
                for (var i = 0; i < node.ChildNodes.length; i++) {
                    childNodeHtml += '<label><input type="checkbox" name="checkNode" checked  value="' + node.ChildNodes[i].Id + '"  />' + node.ChildNodes[i].Name + '</label>&nbsp;&nbsp;';
                    //if (i > 5) 
                    childNodeHtml += '<br/>'
                }
                document.getElementById("td_choiceNextNode").innerHTML = childNodeHtml;
            } break;
        case "radio":
            {
                if (nodeType == "SubFlowNode") {
                    for (var i = 0; i < node.ChildNodes.length; i++) {
                        childNodeHtml += '<label><input type="radio" onclick="changeSubFlowNodestart(this)" name="checkNode"  value="' + node.ChildNodes[i].Id + '"  />' + node.ChildNodes[i].Name + '</label>&nbsp;&nbsp;';
                        if (i > 5) childNodeHtml += '<br/>';
                    }
                } else {
                    for (var i = 0; i < node.ChildNodes.length; i++) {
                        childNodeHtml += '<label><input type="radio"  onclick="changeSubFlowNodestart(this)" name="checkNode"  value="' + node.ChildNodes[i].Id + '"  />' + node.ChildNodes[i].Name + '</label>&nbsp;&nbsp;';
                        if (i > 5) childNodeHtml += '<br/>';
                    }
                }
                document.getElementById("td_choiceNextNode").innerHTML = childNodeHtml;
            } break;
        case "select":
            {
                var obj = document.getElementById("sel_childnode");
                obj.style.display = "block";
                for (var i = 0; i < node.ChildNodes.length; i++) {
                    var option = new Option(node.ChildNodes[i].Name, node.ChildNodes[i].Id);
                    obj.options.add(option);
                }
            } break;
        case "selectSub":
            {
                var subNodeHtml = "";
                for (var i = 0; i < node.ChildNodes.length; i++) {
                    if (node.ChildNodes[i].NodeType == "SubFlowNode") {
                        proveChildNotice = "选择子流程的开始节点";
                        childNodeHtml += '<label><input type="checkbox" name="SubFlowcheckNode" onClick="changeSubFlowcheck(this)"   value="' + node.ChildNodes[i].Id + '"  />' + node.ChildNodes[i].Name + '</label>&nbsp;&nbsp;';
                    } else {
                        childNodeHtml += '<label><input type="checkbox" name="SubFlowcheckNode"  checked   value="' + node.ChildNodes[i].Id + '"  />' + node.ChildNodes[i].Name + '</label>&nbsp;&nbsp;';
                    }
                    if (i > 5) childNodeHtml += '<br/>'
                }
                document.getElementById('checkSubNode').style.display = "block";
                document.getElementById("checkSubNode").innerHTML = childNodeHtml;
            } break;
        case "selectRadio":
            {
                var obj = document.getElementById("sel_Subchildnode");
                obj.style.display = "block";
                for (var i = 0; i < node.ChildNodes.length; i++) {
                    var option = new Option(node.ChildNodes[i].Name, node.ChildNodes[i].Id);
                    obj.options.add(option);
                }
            } break;
    }
}

//获取会签决策人员列表
function GetDecisionerManInf(decisionerManIds) {
    var decisionerManObj = document.getElementById("sel_decisionerMan");
    decisionerManObj.options.length = 1;
    var decisionerManInf = GetUserListByAcceptIds(decisionerManIds);
    if (decisionerManInf != "") {
        var userInfList = decisionerManInf.split(";");
        for (var n = 0, l = userInfList.length; n < l; n++) {
            var userInf = userInfList[n].split(",");
            if (userInf.length = 2) {
                var option = new Option(userInf[1], userInf[0]);
                decisionerManObj.options.add(option);
            }
        }

        return true;
    } else {
        return false;
    }
}

//根据节点定义中的处理人（机构、岗位、人员）集合，获取处理人用户集合
//节点处理人ID集合 (ex: 1,张三;2,李四)
function GetUserListByAcceptIds(acceptIds) {
    var sXML = "<?xml version=\"1.0\" encoding=\"utf-8\"?><RAD><Doc><Data><Param DecisionerManIds=\"" + acceptIds
            + "\" DecisionerManInf=\"\" ParamType=\"GetDecisionerManInf\"></Param></Data><Result><ResCode></ResCode><ResDetail></ResDetail></Result></Doc></RAD>";
    //发送XML对象
//    var XMLSend = new ActiveXObject("Microsoft.XMLDOM");
//    XMLSend.loadXML(sXML);

//    var XMLPoster = new ActiveXObject("Microsoft.XMLHTTP");
//    XMLPoster.Open("Post", "CommonAjax.aspx", false);
//    XMLPoster.Send(XMLSend);
//    //接收返回参数Xml
//    var XMLObj = new ActiveXObject("Microsoft.XMLDOM");
//    XMLObj.loadXML(XMLPoster.responseText);

//    if (XMLObj.selectSingleNode("RAD/Doc/Result/ResCode").text == "0") {
//        var userListInf = XMLObj.selectSingleNode("RAD/Doc/Data/Param").getAttribute("DecisionerManInf");
//        return userListInf;
//    }
//    else {
//        alert(XMLObj.selectSingleNode("RAD/Doc/Result/ResDetail").text);
//        return "";
//    }

    var userListInf = "";
    $.ajax({
        type: "post",
        url: "workFlowRunAction!getDecisionerManInf",
        async: false,
        processData: false,
        contentType: "xml",
        data: $.parseXML(sXML) ,
        success: function (data) {
            if ($(data).find("Result>ResCode").text() == "0") {
                userListInf = $(data).find("Data>Param").attr("DecisionerManInf");
            }
            else {
                alert($(data).find("Result>ResDetail").text());
            }
        }
    });
    return userListInf;
}

/*****************操作方法*****************************************************************************/

//改变下一步节点
function ChangeFlowNode(index) {
    LoadLimit(index);
    document.getElementById('drp_returnUser').options.length = 0;
    returnAcceptIds = "";
    returnAcceptNames = "";
}

function ChangeFlowChildNode(index) {
    if (document.getElementById('sel_Subchildnode') != null) {
        document.getElementById('sel_Subchildnode').options.length = 0;
    }
    var selNode = document.getElementById('sel_node');
    var PnodeId = selNode.options(selNode.selectedIndex).value;
    var selectChildNodeId = document.getElementById('sel_childnode').options[index].value;
    for (var i = 0; i < nodesList.length; i++) {
        if (PnodeId == nodesList[i].Id) {
            for (var j = 0; j < nodesList[i].ChildNodes.length; j++) {
                if (selectChildNodeId == nodesList[i].ChildNodes[j].Id) {
                    if (nodesList[i].ChildNodes[j].NodeType != "SubFlowNode" || nodesList[i].ChildNodes[j].NodeType != "ParallelStartNode" || nodesList[i].ChildNodes[j].NodeType != "ParallelEndNode") {
                        document.getElementById('checkSubNode').style.display = "none";
                    }
                    if (submitType == "CopySend") {
                        //传阅（抄送）
                        LoadLimitOnCopySend(nodesList[i].ChildNodes[j]);
                    }
                    else {
                        LoadLimitOnElse(nodesList[i].ChildNodes[j]);
                    }
                }
            }
        }
    }
    document.getElementById('drp_returnUser').options.length = 0;
    returnAcceptIds = "";
    returnAcceptNames = "";
}

function ChangeFlowSubChildNode(index) {
    var selNode = document.getElementById('sel_node');
    var selChildNode = document.getElementById('sel_childnode');

    var PnodeId = selNode.options(selNode.selectedIndex).value;
    var selectChildNodeId = selChildNode.options(selChildNode.selectedIndex).value;

    var selectSubChildNodeId = document.getElementById('sel_Subchildnode').options[index].value;

    for (var i = 0; i < nodesList.length; i++) {
        if (PnodeId == nodesList[i].Id) {
            for (var j = 0; j < nodesList[i].ChildNodes.length; j++) {
                if (selectChildNodeId == nodesList[i].ChildNodes[j].Id) {
                    for (var k = 0; k < nodesList[i].ChildNodes[j].ChildNodes.length; k++) {
                        if (selectSubChildNodeId == nodesList[i].ChildNodes[j].ChildNodes[k].Id) {
                            if (submitType == "CopySend") {
                                //传阅（抄送）
                                LoadLimitOnCopySend(nodesList[i].ChildNodes[j].ChildNodes[k]);
                            }
                            else {
                                if (nodesList[i].ChildNodes[j].ChildNodes[k].NodeType == "SubFlowNode") {
                                    proveChildNotice = "选择子流程的开始节点";
                                    document.getElementById("td_childNotice").innerHTML = proveChildNotice + "：";
                                    document.getElementById("tb_pstartNextNode").style.display = "block";
                                    LoadChildNode(nodesList[i].ChildNodes[j].ChildNodes[k], "radio");
                                } else {
                                    LoadLimitOnElse(nodesList[i].ChildNodes[j].ChildNodes[k]);
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    document.getElementById('drp_returnUser').options.length = 0;
    returnAcceptIds = "";
    returnAcceptNames = "";
}

//修改选择形式
function ChangeSelect(strType) {
    treeType = strType;
    var index = document.getElementById("sel_node").selectedIndex;
    node = nodesList[index];
    if (node.NodeType == "SubFlowNode") {
        for (var i = 0; i < node.ChildNodes.length; i++) {
            if (node.ChildNodes[i].Id == currentRadio.value) {
                //树
                LoadUserSelectTree(node.ChildNodes[i]);
            }
        }
    } else {
        if (document.getElementById('sel_childnode').options.length > 0) {
            var selectedNodeId = document.getElementById('sel_childnode').options[document.getElementById('sel_childnode').selectedIndex].value;
            for (var i = 0; i < node.ChildNodes.length; i++) {
                if (node.ChildNodes[i].Id == selectedNodeId) {
                    if (node.ChildNodes[i].NodeType == "SubFlowNode") {
                        for (var j = 0; j < node.ChildNodes[i].ChildNodes.length; j++) {
                            if (node.ChildNodes[i].ChildNodes[j].Id == currentRadio.value) {
                                //树
                                LoadUserSelectTree(node.ChildNodes[i].ChildNodes[j]);
                            }
                        }
                    } else {
                        var startNextNodeList = document.getElementsByName("checkNode");
                        for (var k = 0; k < startNextNodeList.length; k++) {
                            for (var a = 0; a < node.ChildNodes.length; a++) {
                                if (node.ChildNodes[a].Id == selectedNodeId) {
                                    for (var b = 0; b < node.ChildNodes[a].ChildNodes.length; b++) {
                                        if (node.ChildNodes[a].ChildNodes[b].NodeType == "SubFlowNode") {
                                            for (var c = 0; c < node.ChildNodes[a].ChildNodes[b].ChildNodes.length; c++) {
                                                if (node.ChildNodes[a].ChildNodes[b].ChildNodes[c].Id == currentRadio.value) {
                                                    LoadUserSelectTree(node.ChildNodes[a].ChildNodes[b].ChildNodes[c]);
                                                }
                                            }
                                        }
                                        else if (node.ChildNodes[a].ChildNodes[b].Id == currentRadio.value) {
                                            LoadUserSelectTree(node.ChildNodes[a].ChildNodes[b]);
                                        }
                                    }
                                }
                            }
                        }
                        if (startNextNodeList.length == 0) {
                            //树
                            LoadUserSelectTree(node.ChildNodes[i]);
                        }
                    }
                }
            }
        } else {
            LoadLimit(index);
        }
    }

    //改变图片,显示Tab页
    ViewTab(strType);
}


//加载用户选择树
function LoadUserSelectTree(node) {
	console.info(node);
	/**
	 * alert(node.NodeType);
	 */
    //树
    document.getElementById("UserSelect").disabled = false;
    document.getElementById("UserSelect").style.display = "block";

    var iframeObj = document.getElementById("UserSelect");
    if (iframeObj) {
    	
//    	iframeObj.src = "userSelect.html?typeTree=" + treeType + "&userIds=" + node.AccepterIds 
//		+ "&userNames=" + node.AccepterNames + "&allowAddAccepter=" + node.AllowAddAccepter 
//		+ "&isRememberSendUser=" + node.IsRememberSendUser ;
	
    	iframeObj.src = "userSelect.html?typeTree=" + treeType + "&userIds=" + node.AccepterIds 
		 + "&userNames=" + node.AccepterNames + "&allowAddAccepter=" + node.AllowAddAccepter 
		 + "&nodeType="+node.NodeType + "&isRememberSendUser=" + node.IsRememberSendUser
		 +"&nodeId=" +node.Id +"&eventStepId="+node.EventStepId;
    	
        //iframeObj.contentWindow.document.getElementById("form1").action = "userSelect.html?typeTree=" + treeType;
        //iframeObj.contentWindow.document.getElementById("hid_userIds").value = node.AccepterIds;
        //iframeObj.contentWindow.document.getElementById("hid_userNames").value = node.AccepterNames;
        //iframeObj.contentWindow.document.getElementById("hid_AllowAddAccepter").value = node.AllowAddAccepter;
        //iframeObj.contentWindow.document.getElementById("hid_IsRememberSendUser").value = node.IsRememberSendUser;
        //iframeObj.contentWindow.document.getElementById("form1").submit();
    }
}

//显示某Tab页
// tabName -- 将要显示的tab ID 号
function ViewTab(tabName) {
    for (var i = 0; i < tabArray.length; i++) {
        if (tabName == tabArray[i]) {
            //背景显示
            document.getElementById("tab_" + tabName).style.backgroundImage = "url(../Skins/Blue/Image/SelectOptionImage/tab_on_bg.gif)";
            document.getElementById("tab_" + tabName).style.fontWeight = "bold";
            document.getElementById("tab_left_img_" + tabName).src = "../Skins/Blue/Image/SelectOptionImage/tab_on_t.gif";
            document.getElementById("tab_right_img_" + tabName).src = "../Skins/Blue/Image/SelectOptionImage/tab_on_b.gif";

        } else {
            //背景暗图
            document.getElementById("tab_" + tabArray[i]).style.backgroundImage = "url(../Skins/Blue/Image/SelectOptionImage/tab_bg.gif)";
            document.getElementById("tab_" + tabArray[i]).style.fontWeight = "normal";
            document.getElementById("tab_left_img_" + tabArray[i]).src = "../Skins/Blue/Image/SelectOptionImage/tab_t.gif";
            document.getElementById("tab_right_img_" + tabArray[i]).src = "../Skins/Blue/Image/SelectOptionImage/tab_b.gif";
        }
    }
}

//选择用户
function ChoiseUser() {
    var checkUser = document.getElementById("UserSelect").contentWindow.SelectUser();
    var checkIds = checkUser.split('*')[0];
    var checkNames = checkUser.split('*')[1];
    var choiseObj = document.getElementById("drp_returnUser");
    for (var i = 0; i < checkIds.split(',').length; i++) {

        var objId = checkIds.split(',')[i];
        var objName = checkNames.split(',')[i];
        if (returnAcceptIds.indexOf(objId) != -1) {
            continue;
        }
        var tempText = "";
        if (objId.indexOf('[') != -1) {
            tempText = "用户 - ";
        }
        var objValue = objId;
        var objText = tempText + objName;
        var option = new Option(objText, objValue);
        choiseObj.options.add(option);
        returnAcceptIds += objValue;
        returnAcceptNames += objName + ",";
        //        if (document.getElementById("txt_terminateMansNumber")) {
        //            var numValue = document.getElementById("txt_terminateMansNumber").value;
        //            document.getElementById("txt_terminateMansNumber").value = Number(numValue != "" ? numValue : 0) + 1;
        //        }
    }
}

//删除处理人
function deleteOption(obj, index) {
    if (index != -1) {
        for (var i = 0; i < obj.length; i++) {
            if (obj.options[i].selected) {
                returnAcceptIds = returnAcceptIds.replace(obj.options[i].value, '');
                var repaceText = obj.options[i].text;
                repaceText = repaceText.replace('用户 - ', '');

                returnAcceptNames = returnAcceptNames.replace(repaceText + ',', '');

                document.getElementById("drp_returnUser").remove(i);
                i = i - 1;
                //                if (document.getElementById("txt_terminateMansNumber")) {
                //                    var numValue = document.getElementById("txt_terminateMansNumber").value;
                //                    document.getElementById("txt_terminateMansNumber").value = Number(numValue != "" ? numValue : 0) - 1;
                //                }
            }
        }
    }
}

//更换子流程的开始节点
function changeSubFlowNodestart(obj) {
    currentRadio = obj;
    //清空已选择人员
    document.getElementById("drp_returnUser").style.display = "block";
    document.getElementById("drp_returnUser").options.length = 0;
    returnAcceptIds = "";
    returnAcceptNames = "";
    //获取当前节点
    var index = document.getElementById("sel_node").selectedIndex;
    var node = nodesList[index];

    var selectChildNode = document.getElementById("sel_childnode");
    var selectSubChildNode = document.getElementById("sel_Subchildnode");
    if (selectChildNode.length > 0) {
        if (selectSubChildNode != null) {
            if (selectSubChildNode.length > 0) {
                for (var i = 0; i < node.ChildNodes.length; i++) {
                    for (var j = 0; j < node.ChildNodes[i].ChildNodes.length; j++) {
                        if (node.ChildNodes[i].ChildNodes != null) {
                            for (var k = 0; k < node.ChildNodes[i].ChildNodes[j].ChildNodes.length; k++) {
                                if (node.ChildNodes[i].ChildNodes[j].ChildNodes != null) {
                                    if (node.ChildNodes[i].ChildNodes[j].ChildNodes[k].Id == currentRadio.value) {
                                        var newNode = node.ChildNodes[i].ChildNodes[j].ChildNodes[k];
                                        //树
                                        LoadUserSelectTree(newNode);
                                        //取消蒙版
                                        AbleDiv();
                                    }
                                }
                            }
                        }
                    }
                }
            } else {
                for (var i = 0; i < node.ChildNodes.length; i++) {
                    if (node.ChildNodes[i].ChildNodes != null) {
                        for (var j = 0; j < node.ChildNodes[i].ChildNodes.length; j++) {
                            if (node.ChildNodes[i].ChildNodes[j].Id == currentRadio.value) {
                                var newNode = node.ChildNodes[i].ChildNodes[j];
                                //树
                                LoadUserSelectTree(newNode);
                                //取消蒙版
                                AbleDiv();
                            }
                        }
                    }
                }
            }
        } else {
            for (var i = 0; i < node.ChildNodes.length; i++) {
                if (node.ChildNodes[i].Id == selectChildNode.options(selectChildNode.selectIndex).value) {
                    var childNodes = document.getElementsByName("SubFlowcheckNode");
                    if (childNodes.length > 0) {
                        for (var j = 0; j < childNodes.length; j++) {
                            if (childNodes[j].checked) {
                                var nodeId = childNodes[j].value;
                                for (var k = 0; k < node.ChildNodes[i].ChildNodes.length; k++) {
                                    if (node.ChildNodes[i].ChildNodes[k].Id == nodeId) {
                                        for (var l = 0; l < node.ChildNodes[i].ChildNodes[k].ChildNodes.length; l++) {
                                            if (node.ChildNodes[i].ChildNodes[k].ChildNodes[l].Id == obj.value) {
                                                AbleDiv();
                                                //树
                                                LoadUserSelectTree(node.ChildNodes[i].ChildNodes[k].ChildNodes[l]);
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    } else {
        for (var i = 0; i < node.ChildNodes.length; i++) {
            var childNodes = document.getElementsByName("SubFlowcheckNode");
            if (childNodes.length > 0) {
                for (var j = 0; j < childNodes.length; j++) {
                    if (childNodes[j].checked) {
                        if (node.ChildNodes[i].Id == childNodes[j].value) {
                            for (var k = 0; k < node.ChildNodes[i].ChildNodes.length; k++)
                                if (node.ChildNodes[i].ChildNodes[k].Id == currentRadio.value) {
                                    var newNode = node.ChildNodes[i].ChildNodes[k];
                                    AbleDiv();
                                    //树
                                    LoadUserSelectTree(newNode);
                                }
                        }
                    }
                }

            } else {
                if (currentRadio != undefined) {
                    if (node.ChildNodes[i].Id == currentRadio.value) {
                        var newNode = node.ChildNodes[i];
                        if (newNode.NodeType != "EndNode") {
                            //树
                            LoadUserSelectTree(newNode);
                            //取消蒙版
                            AbleDiv();
                        }
                    }
                } else {
                    if (node.ChildNodes[i].Id == obj.value) {
                        var newNode = node.ChildNodes[i];
                        if (newNode.NodeType != "EndNode") {
                            //树
                            LoadUserSelectTree(newNode);
                            //取消蒙版
                            AbleDiv();
                        }
                    }
                }
            }
        }
    }
}



/*****************数据提交*****************************************************************************/

//提交数据
function SubmitDate() {
    if (returnAcceptIds != "" || currNode.NodeType == "ParallelStartNode" || currNode.NodeType == "EndNode" || currNode.NodeType == "1") {
        if (currNode.NodeType != "EndNode" && currNode.NodeType != "1") {
            //非结束节点时验证数据
            //if (!ValidData()) {
            //    return;
            //}
            //处理节点
            //响应时限
            currNode.RespondLimitNumber = document.getElementById("txt_respondLimit").value;
            currNode.RespondLimitUnit = document.getElementById("drp_respondLimitUnit").value;
            //处理时限
            currNode.DisposalLimitNumber = document.getElementById("txt_disposalLimit").value;
            currNode.DisposalLimitUnit = document.getElementById("drp_disposalLimitUnit").value;
            currNode.Importance = document.getElementById("drp_important").value;

            if (currNode.IsCodeterminant == "1") {
                currNode.TerminateMansNumber = document.getElementById("txt_terminateMansNumber").value;
                currNode.DecisionerManId = document.getElementById("sel_decisionerMan").value;

                if (currNode.DecisionerManId != "") {
                    var reg = new RegExp("[" + currNode.DecisionerManId + "]", "gi");
                    if (!reg.test(returnAcceptIds)) {
                        alert('请将决策人选入处理人中！');
                        return;
                    }
                }
            }
        }
        var selectChildNode = document.getElementById("sel_childnode");
        if (selectChildNode.length > 0) {
            var selectSubChildNode = document.getElementById("sel_Subchildnode");
            if (selectSubChildNode != null) {
                if (selectSubChildNode.length > 0) {
                    var retunrValue = "<Nodes>";
                    retunrValue += BeSubmitXml(currNode, returnAcceptIds, returnAcceptNames, 1);
                    for (var i = 0; i < currNode.ChildNodes.length; i++) {
                        if (selectChildNode.options[selectChildNode.selectedIndex].value == currNode.ChildNodes[i].Id) {
                            retunrValue += BeSubmitXml(currNode.ChildNodes[i], returnAcceptIds, returnAcceptNames, 1);
                            for (var j = 0; j < currNode.ChildNodes[i].ChildNodes.length; j++) {
                                if (selectSubChildNode.options[selectSubChildNode.selectedIndex].value == currNode.ChildNodes[i].ChildNodes[j].Id) {
                                    retunrValue += BeSubmitXml(currNode.ChildNodes[i].ChildNodes[j], returnAcceptIds, returnAcceptNames, 1);
                                }
                            }
                        }
                    }
                } else {
                    var retunrValue = "<Nodes>";
                    retunrValue += BeSubmitXml(currNode, returnAcceptIds, returnAcceptNames, 1);
                    for (var i = 0; i < currNode.ChildNodes.length; i++) {
                        if (selectChildNode.options[selectChildNode.selectedIndex].value == currNode.ChildNodes[i].Id) {
                            retunrValue += BeSubmitXml(currNode.ChildNodes[i], returnAcceptIds, returnAcceptNames, 1);
                            if (currNode.ChildNodes[i].NodeType == "ParallelStartNode") {
                                var childNodes = document.getElementsByName("SubFlowcheckNode");
                                if (childNodes.length > 0) {
                                    for (var j = 0; j < childNodes.length; j++) {
                                        if (childNodes[j].checked) {
                                            for (var k = 0; k < currNode.ChildNodes[i].ChildNodes.length; k++) {
                                                if (childNodes[j].value == currNode.ChildNodes[i].ChildNodes[k].Id) {
                                                    retunrValue += BeSubmitXml(currNode.ChildNodes[i].ChildNodes[k], returnAcceptIds, returnAcceptNames, 1);
                                                    if (currNode.ChildNodes[i].ChildNodes[k].NodeType == "SubFlowNode") {
                                                        for (var l = 0; l < currNode.ChildNodes[i].ChildNodes[k].ChildNodes.length; l++) {
                                                            if (currentRadio.value == currNode.ChildNodes[i].ChildNodes[k].ChildNodes[l].Id) {
                                                                retunrValue += BeSubmitXml(currNode.ChildNodes[i].ChildNodes[k].ChildNodes[l], returnAcceptIds, returnAcceptNames, 1);
                                                                retunrValue += "</Node>";
                                                            }
                                                        }
                                                    }
                                                    retunrValue += "</Node>";
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
            else {
                var retunrValue = "<Nodes>";
                retunrValue += BeSubmitXml(currNode, returnAcceptIds, returnAcceptNames, 1);
                for (var i = 0; i < currNode.ChildNodes.length; i++) {
                    if (selectChildNode.options[selectChildNode.selectedIndex].value == currNode.ChildNodes[i].Id) {
                        retunrValue += BeSubmitXml(currNode.ChildNodes[i], returnAcceptIds, returnAcceptNames, 1);
                        if (currNode.ChildNodes[i].NodeType == "ParallelStartNode") {
                            var childNodes = document.getElementsByName("SubFlowcheckNode");
                            if (childNodes.length > 0) {
                                for (var j = 0; j < childNodes.length; j++) {
                                    if (childNodes[j].checked) {
                                        for (var k = 0; k < currNode.ChildNodes[i].ChildNodes.length; k++) {
                                            if (childNodes[j].value == currNode.ChildNodes[i].ChildNodes[k].Id) {
                                                if (currNode.ChildNodes[i].ChildNodes[k].NodeType != "SubFlowNode") {
                                                    //其子节点需要将接收人转成全为用户
                                                    var userList = GetUserListByAcceptIds(currNode.ChildNodes[i].ChildNodes[k].AccepterIds);
                                                    var nodeAcceptIds = "";
                                                    var nodeAcceptNames = "";
                                                    for (var t = 0; t < userList.split(';').length; t++) {
                                                        var user = userList.split(';')[t];
                                                        nodeAcceptIds += "[" + user.split(',')[0] + "]";
                                                        nodeAcceptNames += user.split(',')[1] + "；";
                                                    }
                                                    if (returnAcceptIds == "" || currNode.ChildNodes[i].NodeType == "ParallelStartNode") {
                                                        retunrValue += BeSubmitXml(currNode.ChildNodes[i].ChildNodes[k], nodeAcceptIds, nodeAcceptNames, 1);
                                                    } else {
                                                        retunrValue += BeSubmitXml(currNode.ChildNodes[i].ChildNodes[k], returnAcceptIds, returnAcceptNames, 1);
                                                    }
                                                } else {
                                                    retunrValue += BeSubmitXml(currNode.ChildNodes[i].ChildNodes[k], returnAcceptIds, returnAcceptNames, 1);
                                                }
                                                if (currNode.ChildNodes[i].ChildNodes[k].NodeType == "SubFlowNode") {
                                                    for (var l = 0; l < currNode.ChildNodes[i].ChildNodes[k].ChildNodes.length; l++) {
                                                        if (currentRadio.value == currNode.ChildNodes[i].ChildNodes[k].ChildNodes[l].Id) {
                                                            //其子节点需要将接收人转成全为用户
                                                            var userList = GetUserListByAcceptIds(currNode.ChildNodes[i].ChildNodes[k].ChildNodes[l].AccepterIds);
                                                            var nodeAcceptIds = "";
                                                            var nodeAcceptNames = "";
                                                            for (var t = 0; t < userList.split(';').length; t++) {
                                                                var user = userList.split(';')[t];
                                                                nodeAcceptIds += "[" + user.split(',')[0] + "]";
                                                                nodeAcceptNames += user.split(',')[1] + "；";
                                                            }
                                                            if (returnAcceptIds == "" || currNode.ChildNodes[i].ChildNodes[k].NodeType == "ParallelStartNode") {
                                                                returnAcceptIds = nodeAcceptIds;
                                                                returnAcceptNames = nodeAcceptNames;
                                                            }
                                                            retunrValue += BeSubmitXml(currNode.ChildNodes[i].ChildNodes[k].ChildNodes[l], returnAcceptIds, returnAcceptNames, 1);
                                                            retunrValue += "</Node>";
                                                        }
                                                    }
                                                }
                                                retunrValue += "</Node>";
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        } else {
            var retunrValue = "<Nodes>";
            retunrValue += BeSubmitXml(currNode, returnAcceptIds, returnAcceptNames, 1);
            var childNodes = document.getElementsByName("SubFlowcheckNode");
            if (childNodes.length > 0) {
                for (var j = 0; j < childNodes.length; j++) {
                    if (childNodes[j].checked) {
                        for (var i = 0; i < currNode.ChildNodes.length; i++) {
                            if (childNodes[j].value == currNode.ChildNodes[i].Id) {
                                if (currNode.ChildNodes[i].NodeType == "SubFlowNode") {
                                    retunrValue += BeSubmitXml(currNode.ChildNodes[i], returnAcceptIds, returnAcceptNames, 1);
                                }
                            }
                        }
                    }
                }
            }
        }
        //如果为节点包含子节点，但一个也未选时则返回
        var choiceNodeFlag = true;

        //子节点转换
        var childNodes = document.getElementsByName("checkNode");
        if (childNodes.length > 0) {
            choiceNodeFlag = false;
            for (var i = 0; i < childNodes.length; i++) {
                if (childNodes[i].checked) {
                    var nodeId = childNodes[i].value;
                    var selectChildNode = document.getElementById("sel_childnode");
                    if (selectChildNode.length > 0) {
                        var selectSubChildNode = document.getElementById("sel_Subchildnode");
                        if (selectSubChildNode != null) {
                            if (selectSubChildNode.length > 0) {
                                for (var i = 0; i < currNode.ChildNodes.length; i++) {
                                    for (var j = 0; j < currNode.ChildNodes[i].ChildNodes.length; j++) {
                                        for (var k = 0; k < currNode.ChildNodes[i].ChildNodes[j].ChildNodes.length; k++) {
                                            var childNode = currNode.ChildNodes[i].ChildNodes[j].ChildNodes[k];
                                            if (nodeId == childNode.Id) {
                                                //标记已选择了节点
                                                if (!choiceNodeFlag) choiceNodeFlag = true;

                                                //其子节点需要将接收人转成全为用户
                                                var userList = GetUserListByAcceptIds(childNode.AccepterIds);
                                                var nodeAcceptIds = "";
                                                var nodeAcceptNames = "";
                                                for (var t = 0; t < userList.split(';').length; t++) {
                                                    var user = userList.split(';')[t];
                                                    nodeAcceptIds += "[" + user.split(',')[0] + "]";
                                                    nodeAcceptNames += user.split(',')[1] + "；";
                                                }
                                                if (returnAcceptIds == "" || currNode.ChildNodes[i].ChildNodes[j].NodeType == "ParallelStartNode") {
                                                    returnAcceptIds = nodeAcceptIds;
                                                    returnAcceptNames = nodeAcceptNames;
                                                }
                                                retunrValue += BeSubmitXml(childNode, returnAcceptIds, returnAcceptNames, 0);
                                                retunrValue += "</Node>";
                                            }
                                        }
                                    }
                                }
                            } else {
                                for (var i = 0; i < currNode.ChildNodes.length; i++) {
                                    for (var j = 0; j < currNode.ChildNodes[i].ChildNodes.length; j++) {
                                        var childNode = currNode.ChildNodes[i].ChildNodes[j];
                                        if (nodeId == childNode.Id) {
                                            //标记已选择了节点
                                            if (!choiceNodeFlag) choiceNodeFlag = true;

                                            //其子节点需要将接收人转成全为用户
                                            var userList = GetUserListByAcceptIds(childNode.AccepterIds);
                                            var nodeAcceptIds = "";
                                            var nodeAcceptNames = "";
                                            for (var t = 0; t < userList.split(';').length; t++) {
                                                var user = userList.split(';')[t];
                                                nodeAcceptIds += "[" + user.split(',')[0] + "]";
                                                nodeAcceptNames += user.split(',')[1] + "；";
                                            }
                                            if (returnAcceptIds == "" || currNode.ChildNodes[i].NodeType == "ParallelStartNode") {
                                                returnAcceptIds = nodeAcceptIds;
                                                returnAcceptNames = nodeAcceptNames;
                                            }
                                            retunrValue += BeSubmitXml(childNode, returnAcceptIds, returnAcceptNames, 0);
                                            retunrValue += "</Node>";
                                        }
                                    }
                                }
                            }
                        } else {
                            for (var i = 0; i < currNode.ChildNodes.length; i++) {
                                if (currNode.ChildNodes[i].NodeType == "ParallelStartNode") {
                                    var childNodes = document.getElementsByName("SubFlowcheckNode");
                                    if (childNodes.length > 0) {
                                        for (var k = 0; k < childNodes.length; k++) {
                                            if (childNodes[k].checked) {
                                                for (var j = 0; j < currNode.ChildNodes[i].ChildNodes.length; j++) {
                                                    if (currNode.ChildNodes[i].ChildNodes[j].Id == childNodes[k].value) {
                                                        if (currNode.ChildNodes[i].ChildNodes[j].NodeType == "SubFlowNode") {
                                                            if (currentRadio != null) { choiceNodeFlag = true; }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                    else {
                        for (var j = 0; j < currNode.ChildNodes.length; j++) {
                            var childNode = currNode.ChildNodes[j];
                            if (childNode.NodeType == "SubFlowNode") {
                                var childNodes = document.getElementsByName("SubFlowcheckNode");
                                if (childNodes.length > 0) {
                                    for (var i = 0; i < childNodes.length; i++) {
                                        if (childNodes[i].checked) {
                                            if (childNodes[i].value == currNode.ChildNodes[j].Id) {
                                                for (var k = 0; k < currNode.ChildNodes[j].ChildNodes.length; k++) {
                                                    if (nodeId == currNode.ChildNodes[j].ChildNodes[k].Id) {
                                                        //标记已选择了节点
                                                        if (!choiceNodeFlag) choiceNodeFlag = true;

                                                        //其子节点需要将接收人转成全为用户
                                                        var userList = GetUserListByAcceptIds(currNode.ChildNodes[j].ChildNodes[k].AccepterIds);
                                                        var nodeAcceptIds = "";
                                                        var nodeAcceptNames = "";
                                                        for (var t = 0; t < userList.split(';').length; t++) {
                                                            var user = userList.split(';')[t];
                                                            nodeAcceptIds += "[" + user.split(',')[0] + "]";
                                                            nodeAcceptNames += user.split(',')[1] + "；";
                                                        }
                                                        if (returnAcceptIds == "" || currNode.NodeType == "ParallelStartNode") {
                                                            returnAcceptIds = nodeAcceptIds;
                                                            returnAcceptNames = nodeAcceptNames;
                                                        }
                                                        retunrValue += BeSubmitXml(currNode.ChildNodes[j].ChildNodes[k], returnAcceptIds, returnAcceptNames, 0);
                                                        retunrValue += "</Node>";
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            } else {
                                if (nodeId == childNode.Id) {
                                    //标记已选择了节点
                                    if (!choiceNodeFlag) choiceNodeFlag = true;

                                    //其子节点需要将接收人转成全为用户
                                    var userList = GetUserListByAcceptIds(childNode.AccepterIds);
                                    var nodeAcceptIds = "";
                                    var nodeAcceptNames = "";
                                    for (var t = 0; t < userList.split(';').length; t++) {
                                        var user = userList.split(';')[t];
                                        nodeAcceptIds += "[" + user.split(',')[0] + "]";
                                        nodeAcceptNames += user.split(',')[1] + "；";
                                    }
                                    if (returnAcceptIds == "" || currNode.NodeType == "ParallelStartNode") {
                                        returnAcceptIds = nodeAcceptIds;
                                        returnAcceptNames = nodeAcceptNames;
                                    }
                                    retunrValue += BeSubmitXml(childNode, returnAcceptIds, returnAcceptNames, 0);
                                    retunrValue += "</Node>";
                                }
                            }
                        }
                    }
                }
            }
        }

        //判断标记是否包含子且未选择其子节点
        if (!choiceNodeFlag) { alert("请" + proveChildNotice + "！"); return; }
        var selectChildNode = document.getElementById("sel_childnode");
        if (selectChildNode.length > 0) {
            var selectSubChildNode = document.getElementById("sel_Subchildnode");
            if (selectSubChildNode != null) {
                if (selectSubChildNode.length > 0) {
                    retunrValue += "</Node>";
                }
            }
            retunrValue += "</Node>";
        } else {
            var childNodes = document.getElementsByName("SubFlowcheckNode");
            if (childNodes.length > 0) {
                retunrValue += "</Node>";
            }
        }

        retunrValue += "</Node></Nodes>";
        window.returnValue = retunrValue;
        window.close();
    }
    else {
        alert("已选项中处理人不能为空，请选择下一步处理人！");
        return;
    }
}

//传阅提交
function SubmitCopy() {
    if (returnAcceptIds != "") {
        var retunrValue = "<Nodes><Node Id=\"" + currNode.Id + "\" Name=\"" + currNode.Name + "\" NodeType=\"" + currNode.NodeType
                    + "\" AccepterIds=\"" + returnAcceptIds + "\" AccepterNames=\"" + returnAcceptNames + "\"  SubmitInfo=\""
                    + document.getElementById("txt_SubmitInfo").value + "\"></Node></Nodes>";
        window.returnValue = retunrValue;
        window.close();
    }
    else {
        alert("已选项中传阅人不能为空，请选择要传阅的用户！");
        return;
    }
}

function BeSubmitXml(node, nodeAcceptIds, nodeAcceptNames, no) {
    var retunrValue = "";
    //将其中的时限、重要度、备注都使用当前节点的，而不使用子节点本身的
    if (no == 1) {
        retunrValue += "<Node Id=\"" + node.Id + "\" ParentNodeClientId=\"" + node.ParentNodeClientId + "\" Name=\"" + node.Name + "\" NodeType=\"" + node.NodeType
                    + "\" AccepterIds=\"" + nodeAcceptIds + "\" AccepterNames=\"" + nodeAcceptNames + "\" AllowAddAccepter=\"" + node.AllowAddAccepter
                    + "\" DisposalLimitNumber=\"" + currNode.DisposalLimitNumber + "\" DisposalLimitUnit=\"" + currNode.DisposalLimitUnit + "\" RespondLimitNumber=\"" + currNode.RespondLimitNumber
                    + "\" RespondLimitUnit=\"" + currNode.RespondLimitUnit + "\" IsCodeterminant=\"" + node.IsCodeterminant + "\" TerminateMansNumber=\""
                    + node.TerminateMansNumber + "\" DecisionerManId=\"" + node.DecisionerManId + "\" Importance=\"" + currNode.Importance + "\" SubmitInfo=\""
                    + document.getElementById("txt_SubmitInfo").value + "\">";
    } else {
        retunrValue += "<Node Id=\"" + node.Id + "\" ParentNodeClientId=\"" + node.ParentNodeClientId + "\" Name=\"" + node.Name + "\" NodeType=\"" + node.NodeType
                    + "\" AccepterIds=\"" + nodeAcceptIds + "\" AccepterNames=\"" + nodeAcceptNames + "\" AllowAddAccepter=\"" + node.AllowAddAccepter
                    + "\" DisposalLimitNumber=\"" + currNode.DisposalLimitNumber + "\" DisposalLimitUnit=\"" + currNode.DisposalLimitUnit + "\" RespondLimitNumber=\"" + currNode.RespondLimitNumber
                    + "\" RespondLimitUnit=\"" + currNode.RespondLimitUnit + "\" IsCodeterminant=\"" + node.IsCodeterminant + "\" TerminateMansNumber=\""
                    + node.TerminateMansNumber + "\" DecisionerManIds=\"" + node.DecisionerManIds + "\" DecisionerManNames=\"" + node.DecisionerManNames + "\" Importance=\"" + currNode.Importance + "\" SubmitInfo=\""
                    + document.getElementById("txt_SubmitInfo").value + "\">";
    }
    return retunrValue;
}

//校验提交的数据
function ValidData() {
    var validResult = true;

    if (currNode.IsCodeterminant == "1" && !SysF_IsPositiveInt(document.getElementById("txt_terminateMansNumber").value, "指定签订人数必须为正整数!")) {
        validResult = false;
    }
    if (!(SysF_IsNoContainSpecialChar(document.getElementById("txt_SubmitInfo").value))) {
        alert("备注不能包含特殊字符！");
        validResult = false;
    }
    if (document.getElementById("txt_SubmitInfo").value.length > 500) {
        alert("备注不能超过500个字符！");
        validResult = false;
    }
    if (validResult == true && currNode.IsCodeterminant == "1" && document.getElementById("drp_returnUser").options.length < document.getElementById("txt_terminateMansNumber").value) {
        alert("您选择的处理人小于下一步会签环节定义的通过人数，请选取用户或修改会签人数！");
        validResult = false;
    }

    if (validResult == true && !SysF_IsPositiveInt(document.getElementById("txt_respondLimit").value, "响应时限必须为正整数!")) {
        validResult = false;
    }
    if (validResult == true && !SysF_IsPositiveInt(document.getElementById("txt_disposalLimit").value, "处理时限必须为正整数!")) {
        validResult = false;
    }
    return validResult;
}

/*****************蒙版操作*****************************************************************************/

//灰化Div
//ableDiv -- 需要灰化的div对象
function DisableDiv(ableDiv) {
    //显示蒙版div,并将其覆盖在当前div上
    if (ableDiv) {
        var divMask = document.getElementById("mask");
        divMask.style.width = "701px";
        divMask.style.height = "467px";
        divMask.style.left = "148px";
        divMask.style.top = "12px";
        divMask.style.display = "block";
    }
}

//恢复div显示
function AbleDiv() {
    //蒙版的div隐藏
    var divMask = document.getElementById("mask");
    divMask.style.width = 0;
    divMask.style.height = 0;
    divMask.style.display = "none";
}

//获取对象的绝对位置
function fGetXY(aTag) {
    var oTmp = aTag;
    var pt = new Point(0, 0);
    do {
        pt.x += oTmp.offsetLeft;
        pt.y += oTmp.offsetTop;
        oTmp = oTmp.offsetParent;
    } while (oTmp.tagName != "BODY");
    return pt;
}

//位置对象
function Point(iX, iY) {
    this.x = iX;
    this.y = iY;
}

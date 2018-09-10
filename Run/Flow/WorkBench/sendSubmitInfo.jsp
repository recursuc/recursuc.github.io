<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<%
	String submitType = request.getParameter("submitType");
	String nodeName = request.getParameter("nodeName");
	String receiveObjectNames = request.getParameter("receiveObjectNames");
	String isCodeterminant = request.getParameter("isCodeterminant");
	if("1".equals(isCodeterminant)){
		isCodeterminant = "多人";		
	} else {
		isCodeterminant = "单人";
	}
	String operationFlag = "" ;
	if(submitType.equals("BackWork" )) {
		operationFlag = "回退";
	}
%>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <title>【<%= operationFlag%>】 操作 - 发送选项　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　</title>
    <link href="../Skins/Blue/Style/SelectOptionStyle.css" rel="stylesheet" type="text/css" />
    <script type="text/javascript" language="javascript" >
        function SumbitDate() {
            window.returnValue = document.getElementById("txt_SubmitInfo").value;
            window.close();
        }


        function Change(value) {  //add by zhangfj
            if (value.length > 50) {
                document.getElementById("txt_SubmitInfo").value = value.substring(0, 50);
                alert('输入信息太长，请重新输入！');
            }
        }
    </script>
    <style type="text/css">
        .style1
        {
            height: 30px;
        }
    </style>
</head>
<body style="font-size: 12px" bgcolor="#C9E3FB">
    <form id="form1">
    <table width="100%" cellpadding="0" cellspacing="0">
        <tr>
            <td width="10"><img src="../Skins/Blue/Image/SelectOptionImage/top01.gif" width="10" height="40" /></td>
            <td background="../Skins/Blue/Image/SelectOptionImage/top02.gif">
                <table width="98%" cellpadding="0" cellspacing="0">
                    <tr>
                        <td width="100px" align="right">
                            <%= operationFlag%>的环节：
                        </td>
                        <td width="150px" align="left">
                            <%= nodeName %>
                        </td>
                        <td width="120px" align="right" id="td_label1">
                            <%= operationFlag%> 给<%=isCodeterminant%>：
                        </td>
                        <td align="left" id="td_label2">
                            <%= receiveObjectNames%>
                        </td>
                    </tr>
                </table>
            </td>
            <td width="10" align="right"><img src="../Skins/Blue/Image/SelectOptionImage/top03.gif" width="10" height="40" /></td>
        </tr>
    </table>
    <table width="100%" height="110px" cellpadding="0" cellspacing="0" style="border-left: #425DD2   1px solid;
        border-right: #425DD2 1px solid; background-color: #F5FBFE;">
        <tr>
            <td style="padding: 10px;">
                <table width="100%" height="100%" cellpadding="0" style="border: #C7CFDA 1px solid"
                    cellspacing="0" bgcolor="#FFFFFF">
                    <tr>
                        <td valign="middle">
                            <table width="94%" align="center" cellpadding="0">
                                <tr>
                                    <td align="left" class="style1">备 注：<br/></td>
                                </tr>
                                <tr>
                                    <td class="style1" >
                                        <input type="text" id="txt_SubmitInfo" style="width: 500px" onchange="Change(this.value);" />
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
    <table width="100%" cellpadding="0" cellspacing="0">
        <tr>
            <td width="10"><img src="../Skins/Blue/Image/SelectOptionImage/buttom01.gif" width="10" height="8" /></td>
            <td background="../Skins/Blue/Image/SelectOptionImage/buttom02.gif"><img src="../Skins/Blue/Image/SelectOptionImage/buttom02.gif" width="2" height="8" /></td>
            <td width="10"><img src="../Skins/Blue/Image/SelectOptionImage/buttom03.gif" width="10" height="8" /></td>
        </tr>
    </table>
    <br>
    <table width="100%" cellpadding="0" cellspacing="0">
        <tr>
            <td height="31" align="center">
                <input type="button" style="width: 60px" value="确定" class="divButtons_Button" onclick="SumbitDate()" />&nbsp;<input
                    type="button" value="取消" style="width: 60px; margin-right: 5px" class="divButtons_Button"
                    onclick="javascript:window.close();" />
            </td>
        </tr>
    </table>
    </form>
</body>
</html>
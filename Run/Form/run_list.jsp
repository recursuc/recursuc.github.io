﻿<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<%@page import="java.util.Map"%>
<%@page import="java.util.List"%>
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
    <title></title>
    <style type="text/css">
        
    </style>
    <script src="../../sfk/sfk.js" type="text/javascript"></script>
    <script type="text/javascript">
        /*$P.ready(function () {
           
            $R({
                type: "get",
                url: "formRunTestAction.action?ParamType=select&FID=",
                async: false,
                success: function (xhr) {
                    var xmlhttpResult = eval(xhr.responseText);   //反序列化
                    var str = "";
                    for (var i = 0; i < xmlhttpResult.length; i++) {
                        str += "<tr id='" + i + "'><td>" + xmlhttpResult[i].F_ID + "</td><td>"
                                                                 + xmlhttpResult[i].F_NAME + "</td><td>"
                                                                + xmlhttpResult[i].F_S_VALUE + "</td><td>"
                                                                + xmlhttpResult[i].F_S_TEXT + "</td><td>"
                                                                + xmlhttpResult[i].F_TA_VALUE + "</td>"
                                                                + "<td><input type='button' id='btupdate" + i + "' value='编辑' onclick='updateform(" + xmlhttpResult[i].F_ID + ")'/></td></tr>";
                    }
                    var runlist = document.getElementById("runlist");
                    runlist.innerHTML = "<table><thead><tr><th>F_ID</th><th>邮箱地址</th><th>职业ID</th><th>职业名称</th><th>家庭地址</th><th>编辑</th></tr></thead>" + str;
                },
                error: function (xhr) {
                    alert('Failure: ' + xhr.status);
                },
                contentType: "text/xml"
            });
        });*/

        function updateform(runid) {
            var request = $U.params,
                        formtabid = request["formtabid"] || "";
            var returnvalue = window.showModalDialog("f_run.htm?datakey=" + runid + "&formid=344", window, "dialogWidth=610px;dialogHeight=570px;center:yes;edge:sunken;help:no;resizable:no;scroll:yes;status:no;unadorned:no");
                window.location.reload();
        }
        function addform() {
            /*var request = $U.params,
                        formtabid = request["formtabid"] || "";*/
            window.location.href="Application/Run/Form/f_run.htm?formid=344";
            //var returnvalue = window.showModalDialog("f_run.htm?formid=285", window, "dialogWidth=610px;dialogHeight=570px;center:yes;edge:sunken;help:no;resizable:no;scroll:yes;status:no;unadorned:no");
                //window.location.reload();
        }
    </script>
</head>
<body>
    <input type="button" value="添加" onclick="addform()" />
    <div id="runlist">
    </div>
    <% 
    List list = (List)request.getAttribute("list");
    System.out.println(list);
    
    %>
    <table>
    	<thead><tr><th>F_ID</th><th>姓名</th><th>联系电话</th><th>户籍地</th><th>编辑</th></tr></thead>
    	<tbody>
    	<%
    	for(int i =0 ; i<list.size(); i ++){
    		Map<String, Object> map = (Map<String, Object>)list.get(i);
    	%>
    		<tr>
    			<td><%=map.get("F_ID") %></td>
    			<td><%=map.get("F_PROPOSER") %></td>
    			<td><%=map.get("F_PPHONE") %></td>
    			<td><%=map.get("F_DOMICILE") %></td>
    			<td><a href="Application/Run/Form/f_run.htm?formid=344&DataKey=<%=map.get("F_ID") %>" >编辑</a></td>
    		</tr>
    		<% 
    	}
    		
    		%>
    	</tbody>
    </table>
</body>
</html>

<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="upload_file.aspx.cs" Inherits="ReportSystem.Application.Design.Form.Handle.upload_file" %>

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.0 Transitional//EN" >

<html xmlns="http://www.w3.org/1999/xhtml" >
<head>
    <title>附件上传</title>
    <script src="../../commonjs/upload.js" type="text/javascript"></script>
    <script language="javascript" type="text/javascript">
        ExtensionCol = '<%=FileExtensionCol %>';
    
        function submitFile() {
            if (document.getElementById("uploadFiles").value == "") {
                alert('请选择要上传的文件！');
                return false;
            }
            return true;
        }

        function onSelf() {
            window.name = "win_self";
        }
    </script>
</head>
<body onload="onSelf()">
    <form id="form1" name="form1" runat="server" method="post" target="win_self" >
    <table style="width:100%;height:100%">
        <tr>
            <td align="center">
                <table width="90%" height="100%" style="font-size:13px;border: 1px solid #90a5c2;">
                    <tr style="height:20px" align="left">
                        <td style="border-bottom: 1px solid #90a5c2;">
                            请选择要上传的文件：
                        </td>
                    </tr>
                    <tr style="height:35px" align="left">
                        <td style="border-bottom: 1px solid #90a5c2;">
                            <div id="uploadDiv">
                                <input type="file" id="uploadFiles" name="uploadFiles" onchange="UploadBox_Changed(this);" unselectable="on" runat="server" />
                            </div>
                        </td>
                    </tr>
                    <tr style="height:35px" align="right">
                        <td>
                            <input type="submit" value="上传" onclick="return submitFile();" />&nbsp;&nbsp;
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
    </form>
    <script language="javascript" type="text/javascript">
        ParentObj = document.getElementById("uploadDiv");
    </script>
</body>
</html>
<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="UP_Xml.aspx.cs" Inherits=" ReportSystem.Application.Design.Report.Handle.UP_Xml" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html>
<head>
    <title></title>
    <style type="text/css">
        body
        {
            background-color: #B6CFEE;
        }
    </style>
</head>
<body>
    <form id="upXmlForm" method="post" enctype="multipart/form-data">
    <div>
        <table id="tbXml">
            <tr>
                <td style="font-size: 12px">
                    文件路径：
                </td>
                <td>
                    <input type="text" id="filePath" disabled="disabled" style="position: absolute;" name="filePath"/>
                    <input type="file" id="selFile" onchange="checkXmlFile()" style="height:19px;" name="selFile"/>
                </td>
            </tr>
        </table>
        <input type="hidden" id="oldXmlName" value=""  name="oldXmlName"/>
        <input type="hidden" id="nowXmlName" value="" name="nowXmlName" />
    </div>
    </form>
    <script type="text/javascript">
        window.onload = function () {
            upXmlForm.filePath.value = parent.xmlURL.value;
        };

        function checkXmlFile() {
            var reg = /.*\\(.*\.xml)/ig;

            if (upXmlForm.selFile.value == "" || !reg.test(upXmlForm.selFile.value)) {
                alert("必须上传xml文件！");
                return;
            } else {
                parent.nowXmlName.value = RegExp.$1;
                upXmlForm.filePath.value = upXmlForm.selFile.value;
            }
        }
    </script>
</body>
</html>

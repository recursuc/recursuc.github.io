<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="Up_File.aspx.cs" Inherits=" ReportSystem.Application.Design.Report.Handle.Up_File" %>

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
    <form id="upCustomClass" method="post" enctype="multipart/form-data">
    <table style="font-size: 12px;" id="fileTb">
        <tr>
            <td>
                自定义类
                <input type="text" id="upFileText" style="font-size: 12px; position: absolute;" disabled="disabled" />
                <input type="file" id="upClassFile" onchange="selectFileURL()" name="filePath" />
            </td>
        </tr>
        <tr>
            <td>
                <a id="loadClassFile" href=""></a>
            </td>
        </tr>
    </table>
    <input type="hidden" id="classFileName" name="classFileName" value="" />
    <input type="hidden" id="newClassFileName" name="newClassFileName" value="" />
    </form>
    <script type="text/javascript">
        window.onload = function () {
            upCustomClass.upFileText.value = parent.iframeFileURL.value;
            upCustomClass.classFileName.value = parent.oldFileName.value;
            loadClassFile.href = "../customClass/" + upCustomClass.classFileName.value;
            upCustomClass.upFileText.style.top = upCustomClass.upClassFile.offsetTop + upCustomClass.upClassFile.parentNode.offsetTop + document.body.clientTop + fileTb.offsetTop;
            upCustomClass.upFileText.style.left = upCustomClass.upClassFile.offsetLeft + upCustomClass.upClassFile.parentNode.offsetLeft + document.body.clientLeft + fileTb.offsetLeft;
            upCustomClass.upFileText.style.width = upCustomClass.upClassFile.offsetWidth - 76;
            upCustomClass.upFileText.style.heigth = upCustomClass.upClassFile.offsetHeigth + 5;
            if (parent.oldFileName.value != "") {
                loadClassFile.innerHTML = "下载上传类";
            }
        }
        function selectFileURL() {
            upCustomClass.upClassFile.click();
            if (upCustomClass.upClassFile.value != "") {
                var filePath = upCustomClass.upClassFile.value;
                var reg = /.*\\(.*\.dll)/ig;
                if (!reg.test(filePath)) {
                    alert("请上传dll文件");
                    return;
                } else {
                    parent.classNameMessage.value = RegExp.$1;
                    parent.iframeFileURL.value = upCustomClass.upFileText.value = filePath;
                }
            }
        }

    </script>
</body>
</html>

<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="imgManage.aspx.cs" Inherits="ReportSystem.Application.Design.Form.Handle.imgManage" %>

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.0 Transitional//EN" >
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
    <title></title>
    <style type="text/css">
        body
        {
            margin: 0px;
            padding: 0px;
            overflow: hidden;
        }
        .imageDiv
        {
            background-image: url(../skins/blue/images/border_default.gif);
            height: 100px;
            width: 100px;
            text-align: center;
            vertical-align: middle;
            padding-top: 10px;
        }
        .imageHoverDiv
        {
            background-image: url(../skins/blue/images/border_hover.gif);
            height: 100px;
            width: 100px;
            text-align: center;
            vertical-align: middle;
            padding-top: 10px;
        }
        .imageSelectedDiv
        {
            background-image: url(../skins/blue/images/border_down.gif);
            height: 100px;
            width: 100px;
            text-align: center;
            vertical-align: middle;
            padding-top: 10px;
        }
        
        #upLoadDiv
        {
            border-bottom-style: solid;
            border-bottom-color: Gray;
            border-bottom-width: 1px;
            background-color: #e5f4fb;
            height: 30px;
            width: 100%;
        }
        #upLoadTable
        {
            font-family: 宋体;
            font-size: 12px;
        }
        #warningInf
        {
            height: 25px;
            width: 100%;
            padding: 0px;
            margin: 0px;
            font-size: 12px;
            vertical-align: middle;
            padding-left: 30px;
            padding-top: 5px;
            color: Gray;
        }
        #imagesDiv
        {
            overflow-y: auto;
            overflow-x: hidden;
            height: 540px;
            width: 100%;
            margin-top: 2px;
        }
        #ImagesTable
        {
            font-size: 12;
        }
    </style>
</head>
<body onload="windowOpen();">
    <form id="form1" name="form1" runat="server" method="post">
    <div id="upLoadDiv">
        <table id="upLoadTable">
            <tr>
                <td>
                    请选择图片：
                </td>
                <td>
                    <input type="file" id="uploadFiles" name="uploadFiles" onchange="UploadBox_Changed(this,'img');"
                        runat="server" unselectable="on" />
                </td>
                <td>
                    <input id="cmdUpLoad" type="submit" style="display: block; font-size: 12px; width: 65px;
                        height: 21px; background-color: #ffffff; border-style: none; border: 0px;" value=""
                        onclick="return submitFile();" />
                </td>
                <td>
                    <button id="cmdSelect" style="display: block; font-size: 12px; width: 65px; height: 21px;
                        background-color: #ffffff; border-style: none; border: 0px;" onclick='SelectImage();' />
                </td>
                <td>
                    <button id="cmdClose" style="display: block; font-size: 12px; width: 65px; height: 21px;
                        background-color: #ffffff; border-style: none; border: 0px;" onclick='WindowClose();' />
                </td>
            </tr>
            <tr>
                <td>
                </td>
                <td colspan="4" style="color: #ee0000;">
                    注意：建议不要上传超过2M的图片，以免上传失败
                </td>
            </tr>
        </table>
    </div>
    <div id="warningInf">
        温馨提示：支持鼠标框选图片、支持双击左键查看原图
    </div>
    <div id="imagesDiv">
        <%=_smallImagesHtml %>
    </div>
    </form>
    <script type="text/javascript" src="../../ext/adapter/ext/ext-base.js"></script>
    <script type="text/javascript" src="../../ext/ext-all.js"></script>
    <script type="text/javascript" src="../../commonjs/public_api.js"></script>
    <script type="text/javascript" src="../js/f_core.js"></script>
    <script type="text/javascript" src="../../commonjs/design_operation.js"></script>
    <script type="text/javascript" src="../../commonjs/property.js"></script>
    <script type="text/javascript" src="../../commonjs/opencommonform.js"></script>
    <script type="text/javascript" src="../../commonjs/browser_version.js"></script>
    <script type="text/javascript" src="../../commonjs/upload.js"></script>
    <script type="text/javascript" src="../../commonjs/imagemanage.js"></script>
    <script type="text/javascript" src="../../commonjs/sys_common_valid_library.js"></script>
    <script type="text/javascript">
        var curImageObj = null; //当前选择的图片对象

        function windowOpen() {
            var obj = parent.designobj;
            var selectButton = document.getElementById("cmdSelect");
            if (obj == null) {
                if (typeof selectButton != "undefined") {
                    selectButton.style.display = "none";
                }
            }

            SetButtonImage($id("cmdSelect"), "../skins/blue/images/buttons/ef_tb_button_select.gif");
            SetButtonImage($id("cmdUpLoad"), "../skins/blue/images/buttons/ef_run_button_upload.gif");
            SetButtonImage($id("cmdClose"), "../skins/blue/images/buttons/ef_run_button_close.gif");
        }

        function submitFile() {
            //         if (document.getElementById("uploadFiles").value == "") {
            //             alert('请选择要上传的文件！');
            //             return false;
            //         }
            //         return true;
            var fileName = document.getElementById("uploadFiles").value;
            var seat = fileName.lastIndexOf(".");
            var extension = fileName.substring(seat).toLowerCase();
            if (document.getElementById("uploadFiles").value == "") {
                alert("请选择要上传的文件!");
                return false;
            }
            else {
                if (extension != ".jpg" && extension != ".jpeg" && extension != ".gif" && extension != ".png" && extension != ".bmp") {
                    alert("不支持" + extension + "文件的上传");
                    return false;
                }
                else {
                    return true;
                }
            }
            return true;

        }

        //设置当前经过的图片状态
        function ChangeDivState(imgObj) {
            if (imgObj.parentNode.className != "imageSelectedDiv") {
                if (typeof imgObj == "object") {
                    if (imgObj.parentNode.nodeName == "DIV") {
                        imgObj.parentNode.className = "imageHoverDiv";
                    }
                }
            }
        }

        //还原上次鼠标的图片DIV状态
        function ReturnDivState(imgObj) {
            if (imgObj.parentNode.className != "imageSelectedDiv") {
                if (typeof imgObj == "object") {
                    if (imgObj.parentNode.nodeName == "DIV") {
                        imgObj.parentNode.className = "imageDiv";
                    }
                }
            }
        }

        //选择当前图片对象
        function SelectCurImgObj(imgObj) {

            if (curImageObj != null) {
                curImageObj.parentNode.className = "imageDiv";
            }
            imgObj.parentNode.className = "imageSelectedDiv";
            curImageObj = imgObj;
        }

        function SelectImage() {
            if (curImageObj != null) {
                var obj = parent.designobj;
                if (obj != null) {
                    //var sPathBase = location.protocol + "//" + location.host + publicform.path ;
                    //var imgPath = curImageObj.BigSrc.replace("../", "");
                    //imgPath = sPathBase  + imgPath;
                    obj.src = curImageObj.src;
                    obj.RelativeSrc = curImageObj.RelativeSrc;
                    obj.alt = curImageObj.alt;
                    obj.BigSrc = curImageObj.BigSrc;
                    obj.BigWidth = curImageObj.BigWidth;
                    obj.BigHeight = curImageObj.BigHeight;
                }
                window.close();
            }
            else {
                alert('请选择图片！');
            }
        }

        function WindowClose() {
            if (confirm("您确定要取消窗口吗？")) {
                window.close();
            }
        }

    </script>
</body>
</html>

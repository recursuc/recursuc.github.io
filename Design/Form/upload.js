//相对于根目录路径
var rootPath = (function() {
    var strFullPath = window.document.location.href;
    var strPath = window.document.location.pathname;
    var pos = strFullPath.indexOf(strPath);
    var prePath = strFullPath.substring(0, pos);
    var postPath = strPath.substring(0, strPath.substr(1).indexOf('/') + 1);
    return (prePath + postPath);
})();

function Attachment() {
    this.id;
    this.filename;
    this.fileext;
    this.serverpath;
    this.isin;
};

function AddUploadFile(objUpload) {
    var limit = parseInt(objUpload.getAttribute("FileCountLimit")),
        tableObj = objUpload.getElementsByTagName("table");
    objUpload.setAttribute("FileCurrCount", tableObj.length ? tableObj[0].rows.length : 0);

    if (limit != 0 && objUpload.getAttribute("FileCurrCount") >= limit) {
        alert('超过上传的最大个数！');
        return;
    }
    else {
        var path = rootPath + "/Application/Run/Form/Attachment/Uploader.html?operType=upload&FileCountLimit=" + 
        		(objUpload.getAttribute("FileCountLimit") == null ? "`" : objUpload.getAttribute("FileCountLimit")) + 
        		"&FileLength=" + (objUpload.getAttribute("FileLength") == null ? "10" : objUpload.getAttribute("FileLength")) +
        		"&Unit=" + objUpload.getAttribute("FileUnit") + 
        		"&FileExt=" + (objUpload.getAttribute("AreaFileExt") == null ? "" : objUpload.getAttribute("AreaFileExt")) + 
        		"&SaveMode=" + (objUpload.getAttribute("SaveMode") == null ? "Service" : objUpload.getAttribute("SaveMode")) + 
        		"&AttachTable=" + (objUpload.getAttribute("AttachTable") == null ? "f_attachment" : objUpload.getAttribute("AttachTable"));
        json = window.showModalDialog(path, "", 
        		"dialogWidth:469px; dialogHeight:225px;help:no;center:yes;status:no;resizable:no;location:yes;scroll:no;");  //+ "&UserId=" + userId + "&UserName=" + userName + "&DBLink=" + dbLink
        
        // 返回 json 
        if (json) {
//                var attachments = sRet.getElementsByTagName("File");
        	// 数组 
        	var attachments = eval('('+ json +')');
            for (var i = 0; i < attachments.length; i++) {
                var att = new Attachment();
                att.id = attachments[i].id;
                att.serverpath = attachments[i].servicePathName;
                att.saveName = attachments[i].fileSaveName;
                att.fileName = attachments[i].fileName;
                att.ext = attachments[i].extension;
                att.isin = "True";

                AddFileToControl(objUpload, att);
                objUpload.setAttribute("FileCurrCount", parseInt(objUpload.getAttribute("FileCurrCount")) + 1);
            }
        }
    }
}

function ShowAllFiles(obj) {
    if (!(event.srcElement.tagName == "TD" && event.srcElement.cellIndex == 0)) return;
    if (obj.scrollHeight > obj.clientHeight) {
        var upload = document.getElementById("UploadDiv");
        with (upload.style) {
            top = event.clientY;
            left = obj.parentNode.offsetLeft + obj.parentNode.parentNode.parentNode.parentNode.parentNode.offsetLeft;
            if (obj.offsetWidth < 375) {
                width = 375 + "px";
            } else {
                width = obj.offsetWidth
            }
            height = obj.children[1].children[0].offsetHeight;
        }
        //if (!UploadDiv.hasChildNodes() || UploadDiv.firstChild.rows.length != obj.children[1].children[0].rows.length) {
        upload.innerHTML = obj.children[1].children[0].cloneNode(true).outerHTML;
        for (var i = 0; i < upload.firstChild.rows.length; i++) {
            upload.firstChild.rows[i].cells[1].lastChild.onclick = function () {
                //if (obj.getElementsByTagName("table")[0].rows[this.parentNode.parentNode.rowIndex]) {
                //删除当前行, 触发对应点击事件
                obj.getElementsByTagName("table")[0].rows[this.parentNode.parentNode.rowIndex].cells[this.parentNode.cellIndex].lastChild.fireEvent("onclick");
                //}
                this.parentNode.parentNode.removeNode(true);
            }
        }
        //}
        document.getElementById("UploadDiv").style.display = "block";
        //document.getElementById("UploadDiv").focus();
    } else { return false; }
}

function HiddenFileDiv() {
    document.getElementById("UploadDiv").style.display = "none";
}

function ShowFileDiv() {
    document.getElementById("UploadDiv").style.display = "block";
}

function AddFileToControl(objUpload, objAtt, objState) {
    var tableObj = objUpload.getElementsByTagName("table"), oTable;
    if (tableObj.length) {
        oTable = tableObj[0];
    } else {
        var oDiv = document.createElement("div");
        oDiv.style.height = parseInt(objUpload.style.height) - 23 + "px";
        oDiv.style.overflow = "auto";
        objUpload.appendChild(oDiv);
        oTable = document.createElement("table");
        oTable.style.width = "100%";
        oDiv.appendChild(oTable);
    }

    var oTr = upload_addrow(oTable, objAtt, objUpload);
    var fileviewname = objAtt.fileName;
    if (objUpload.IsPic === "1") {
        var prams = new Array();
        prams = objUpload.PicSize.split("*");
        var picPath = "";
        var strRe = "";
        if (objAtt.isin == "True" || objAtt.isin == "true") {
            path = objAtt.serverpath.split("Application");
            picPath = rootPath + "Application" + path[1];
        }
        else {
            picPath = "../../../Application/FormSystem/form/skins/blue/images/border_down.gif";
        }

        if (objState && (objState == "ReadOnly" || objState == "View")) {

        } else {
            strRe = "<span type='button' value='移除' style='position:absolute;top:2px;left:5px;background-color:red;cursor:hand;' onclick='upload_removerow(this);'>移除</span>";
        }

        strImg = "<img style='position:absolute;top:0px;left:0px;height:" + prams[0] + "px;width:" + prams[1] + "px;' src='" + picPath + "' />" + strRe;
        oTr.cells[0].innerHTML = strImg;
        
        objUpload.style.overflow = "hidden";
    }
    else {
        var filenamelimit = 0;
        if (objUpload.FileNameLength != "") {
            filenamelimit = parseInt(objUpload.FileNameLength);
        }

        if (fileviewname.length > filenamelimit && filenamelimit != 0) {
            fileviewname = fileviewname.substring(0, filenamelimit) + "...";
        }
        var innerHtml; 
        var path ;
        if (objAtt.isin == "True" || objAtt.isin == "true") {
        	path = rootPath 
            + "/Application/Run/Form/Attachment/servlet/AttachmentServlet?operType=download&saveMode="
            + (objUpload.getAttribute("SaveMode") == null ? "Both" : objUpload.getAttribute("SaveMode"))
//            + "&PathClass=" + objUpload.PathClass 
            + "&attachTable=" + (objUpload.getAttribute("AttachTable") ==null ? "f_attachment" : objUpload.getAttribute("AttachTable")) 
            + "&fileId=" + objAtt.id
            + "&filePath="+ objAtt.serverpath 
            + "&saveName=" + objAtt.saveName 
            + "&fileName=" +  objAtt.fileName 
            + "&ext=" + objAtt.ext;
        	innerHtml = "&nbsp;&nbsp;<u onclick=\"window.open('" + path
            + "') \" style=\"cursor:pointer;\"  title=" 
            + objAtt.fileName + ">" + fileviewname + "</u>" ;
            oTr.cells[0].innerHTML = innerHtml; //DBLink=" + dbLink + "&
        } else {
            oTr.cells[0].innerHTML = "&nbsp;&nbsp;<a href='' onclick='alert(\"文件缺失，无法下载！\")' title='" + objAtt.filename + "'>" + fileviewname + "</a>";
        }

        if (objState && (objState == "ReadOnly" || objState == "View")) {

        } else {
        	path += "&isOpen=true";
            oTr.cells[1].style.width = "29%";
            oTr.cells[1].innerHTML = 
            	"<input type='button' style='cursor:pointer' value='浏览' onclick=\"window.open('"
            	+ path
            	+"') \">&nbsp;&nbsp;" +
            			"<input name='btnDelete' type='button' value='移除' style='cursor:hand' onclick='upload_removerow(this);'>";
        }
    }
}

function upload_addrow(tb, objAtt, objUpload) {
    var oTr = tb.insertRow(tb.rows.length);
    oTr.setAttribute("TrType", "Attachment");
    oTr.setAttribute("AttachId", objAtt.id);
    oTr.setAttribute("AttachName", objAtt.saveName);
    oTr.setAttribute("AttachExt" , objAtt.ext);
    oTr.setAttribute("AttachServerPath", objAtt.serverpath);
    oTr.style.height = "24px";

    var oTd;
    oTd = oTr.insertCell(0);
    //oTd.style.borderBottom = "1px solid #90a5c2";
    //oTd.style.borderRight = "1px solid #90a5c2";

    oTd = oTr.insertCell(0);
    //oTd.style.borderBottom = "1px solid #90a5c2";
    oTd.align = "center";

    return oTr;
}

function upload_removerow(objFileInput) {
    var objUpload = objFileInput.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode;
    var oTr = objFileInput.parentNode.parentNode;
    var AttachId = oTr.getAttribute("attachid");
    var AttachServerPath = oTr.getAttribute("attachserverpath");
    //删除DIV上的附件
//    if (document.getElementById("UploadDiv").firstChild) {
//        document.getElementById("UploadDiv").firstChild.rows[oTr.rowIndex].removeNode(true);
//    }
//    if(!oTr.removeNode(true)){
//    	oTr.removeNode(true);
//    } else {
    	oTr.parentNode.removeChild(oTr);
//    }

    //var objUpload = document.getElementById(objUploadId);
    currcount = parseInt(objUpload.FileCurrCount);
    objUpload.FileCurrCount = currcount - 1;
    // 已删除的文件id 和名称
    var deletedFileId = objUpload.getAttribute("deleteFilesId");
    var deletedFileName = objUpload.getAttribute("deleteFileNames");
    if(!deletedFileId){
    	deletedFileId = "";
    }
    if(!deletedFileName){
    	deletedFileName ="";
    }
    if (AttachId != "") {
        //历史的删除
    	deletedFileId += AttachId + ";";
        deletedFileName += oTr.getAttribute("attachname") +",";
    }
    
    else if (AttachServerPath != "") {
        //新增的删除：
        //根据objAttServerPath通过Ajax删除
    }
    objUpload.setAttribute("deleteFilesId", deletedFileId);
    objUpload.setAttribute("deleteFileNames",deletedFileName);
//    if (!objUpload.children[1].children[0].children[0].children[0]) {
//        document.getElementById("UploadDiv").style.display = "none";
//    }
}
//允许的扩展名称集合
var ExtensionCol = "";
var ParentObj;  //添加附件上传控件的父对象

//input 控件的onchange事件
function UploadBox_Changed(objName) {
    //校验文件扩展名称
    var bChk = false;
    if (arguments.length > 1) {
        bChk = CheckAttachment(objName, arguments[1]);
    } else {
        bChk = CheckAttachment(objName);
    }
    if (!bChk)  //文件类型不符合要求
    {
        //移除这个inputFile控件

        if (!ParentObj) {
            ParentObj = objName.parentNode;
        }
        ParentObj.removeChild(objName);

        ParentObj.innerHTML = '<input type="file" id="uploadFiles" name="uploadFiles" onchange="UploadBox_Changed(this);" unselectable="on" runat="server" />';
    }
}

//检查附件的类型
//objName ：file控件对象
function CheckAttachment(objName) {
    var strExtension, strFileName;
    var intPos;

    strFileName = objName.value;

    if (strFileName == "") {
        alert('请选择要上传的文件！');
        return false;
    }

    intPos = strFileName.lastIndexOf("."); //判断最后一个点既扩展名前的那个点
    try {
        strExtension = strFileName.substring(intPos + 1); //取得扩展名
    }
    catch (e) {
        alert('请上传允许类型的文件。\n允许类型：' + tempExtension);
        return false;
    }

    strExtension = strExtension.toLowerCase();
    var isAllow = false;
    if (ExtensionCol === "") {
        ExtensionCol = "doc|docx|jpg|gif|bmp|png|txt|mht|rar|ppt|pptx|zip";
        if (arguments.length > 1) {
            ExtensionCol = "jpg|gif|bmp|png";
        }
    }
    if (ExtensionCol.toLowerCase() == "") {
        isAllow = true;
    }
    else if (ExtensionCol.toLowerCase().indexOf("|") != -1) {
        if (ExtensionCol.toLowerCase().indexOf(strExtension) != -1) { //if (ExtensionCol.toLowerCase().indexOf(strExtension + "|") != -1 || ExtensionCol.toLowerCase().indexOf("|" + strExtension) != -1) {
            isAllow = true;
        }
    }
    else {
        if (ExtensionCol.toLowerCase() == strExtension) {
            isAllow = true;
        }
    }

    //允许的类型
    if (isAllow) {
        return true;
    }
    else {
        alert('请上传允许类型的文件。\n允许类型：' + ExtensionCol);
        return false;
    }
}
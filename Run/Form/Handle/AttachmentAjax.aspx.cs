using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using RAD.Component.Bussiness;
using System.Xml;
using RAD.Common;
using System.Text;

namespace FrameWorkPage.Application.Design.Form.Handle
{
    public partial class AttachmentAjax : PageBase
    {
        private string operType;    //跳转到此页面的标记位
        private BaseAttachmentService attachmentService = new BaseAttachmentService();
        private XmlDocument xmlData = new XmlDocument();
        private XmlDocument xmlReturn = SysFunction.getXmlDocModel();

        // 表单附件的存储方式
	    private string STORAGEMODE_SERVICE = "Service";
	    private string STORAGEMODE_DATABASE = "Database";
	    private string STORAGEMODE_BOTH = "Both";

        protected void Page_Load(object sender, EventArgs e)
        {
            try
            {
                //加载xml
                Response.Clear();
                Response.ContentType = "Text/Xml";

                if (Request.Params["operType"] != null && Request.Params["operType"].Length != 0)
                {
                    operType = Request.Params["operType"].ToString().Trim();

                    if (operType != null && "download" == operType)
                    {
                        download();
                    }
                    else
                    {
                        
                    }
                }
            }
            catch (Exception ex)
            {
                xmlReturn = SysFunction.getXmlDocWithResult("1", ex.Message);
                xmlReturn.Save(Response.OutputStream);
            }
            finally
            {

            }
        }

        private void download()
        {
		    // 原始文件名
		    string originalName = Request.Params["fileName"].ToString().Trim();
            string saveName = Request.Params["saveName"].ToString().Trim();
            string extName = Request.Params["ext"].ToString().Trim();
		    if (extName == null) {
			    extName = "";
		    }
            string saveMode = Request.Params["saveMode"].ToString().Trim();
            string isOpen = Request.Params["isOpen"].ToString().Trim();
            //response.reset();
            //response.setCharacterEncoding("utf-8");
            //response.setContentType("text/html");
            //response.setHeader("Content-Type", "text/html;charset=UTF-8");

            Response.ContentType = "text/html";
            Response.ContentEncoding = Encoding.UTF8;
            
		    if (isOpen != null) {
                //response.addHeader("Content-Disposition", "inline; filename=" + originalName);
		    } else {
                //response.addHeader("Content-Disposition", "attachment; filename=\"" + originalName + "\"");
		    }
            //if (!STORAGEMODE_DATABASE.Equals(saveMode)) {
            //    // 不是只存数据库, 就从服务器硬盘中下载
            //    string path = request.getParameter("filePath");
            //    if (path == null || "" == path)) {
            //        path = Constants.ATTACHMENT_TEMP_PATH;
            //    }
            //    File file = new File(path, saveName + "."+extName);
            //    if (file != null) {
            //        FileUtil.writeFileToStream(file, response);
            //    }
            //} else {
            //    // 读数据库中附件
            //    string attachTable = request.getParameter("attachTable");
            //    string fid = request.getParameter("fileId");

            //    byte[] content = attachmentService.getAttachmentContent(fid,
            //            attachTable);
            //    response.getOutputStream().write(content);
            //}
	    }
    }
}
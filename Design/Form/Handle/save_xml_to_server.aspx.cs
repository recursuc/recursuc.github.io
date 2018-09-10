using System;
using System.Collections.Generic;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Xml;
using System.Text;
using System.IO;

using RAD.Common;

namespace ReportSystem.Application.Design.Form.Handle
{
    public partial class save_xml_to_server : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {
            string FormName = "";
            XmlDocument xmlDel = new XmlDocument();
            try
            {
                if (Request.Params["FormName"] != null && Request.Params["FormName"] != "")
                {
                    FormName =Request.Params["FormName"].ToString()+"_";
                }
                //生成随机文件名
                string fileServerName =FormName+DateTime.Now.ToString("yyyyMMddHHmmssffff") + SysFunction.FsRandomString(10);
                string filePath = Server.MapPath("../uploadfile") + "\\" + fileServerName + ".xml";

                //加载xml
                Response.Clear();
                Response.ContentType = "Text/Xml";

                xmlDel.Load(Request.InputStream);
                xmlDel.Save(filePath);

                xmlDel = SysFunction.getXmlDocWithResult("0", filePath);
            }
            catch (Exception ex)
            {
                xmlDel = SysFunction.getXmlDocWithResult("1", "XML文件保存失败！");
            }
            finally
            {
                //返回xml
                xmlDel.Save(HttpContext.Current.Response.OutputStream);
            }
        }
    }
}

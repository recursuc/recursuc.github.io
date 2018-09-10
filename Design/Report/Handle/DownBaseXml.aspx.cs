using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.IO;
using System.Xml;
using System.Text;

namespace ReportSystem.Application.Design.Report.Handle
{
    public partial class DownBaseXml : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {
            string destFileName = Request.Params["downXmlName"];
            if (destFileName == null || destFileName == "")
            {
                destFileName = "BaseXml.xml";
            }
            string destPtah= Request.MapPath(@"../xmlFiles/" + destFileName);
            destPtah =Server.UrlDecode(destPtah);
            if (File.Exists(destPtah))
            {
                FileInfo fi = new FileInfo(destPtah);
                Response.Clear();
                Response.ClearHeaders();
                Response.Buffer = true;
                Response.AppendHeader("Content-Disposition", "attachment;filename=" + HttpUtility.UrlEncode(Path.GetFileName(destPtah), System.Text.Encoding.UTF8));
                Response.AppendHeader("Content-Length", fi.Length.ToString());
                Response.ContentType = "application/octet-stream";
                Response.WriteFile(destPtah);
                Response.Flush();
                Response.End();
            }
            else
            {
                Response.Write("<script type='text/javascript'>alert('获取下载信息失败，请尝试重新下载！');</script>");
                Response.End();
            }

        }

    }

}
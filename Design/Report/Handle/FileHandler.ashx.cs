using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.IO;
using System.Xml;
using System.Text;

namespace ReportSystem.Application.Design.Report.Handle
{
    /// <summary>
    /// FileHandler 的摘要说明
    /// </summary>
    public class FileHandler : IHttpHandler
    {
        public void ProcessRequest(HttpContext context)
        {
            HttpRequest Request = context.Request;
            HttpResponse Response = context.Response;
            HttpServerUtility Server = context.Server;

            //指定输出头和编码   
            Response.ContentType = "text/html";
            Response.Charset = "gbk";

            try
            {
                if (context.Request.Files["upfile"] != null)
                {
                    byte[] bytes = new byte[context.Request.Files[0].InputStream.Length];
                    context.Request.Files[0].InputStream.Position = 0;
                    context.Request.Files[0].InputStream.Read(bytes, 0, (int)context.Request.Files[0].InputStream.Length);
                    string xml = Encoding.UTF8.GetString(bytes).Replace("\r\n", "").Replace("\'", " &apos;");
                    //string xmlHead = "<?xml version=\"1.0\"  encoding=\"gbk\" ?>";
                    Response.Write("<script type=\"text/javascript\">parent.callback('" + xml + "');</script>");
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public bool IsReusable
        {
            get
            {
                return false;
            }
        }
    }
}
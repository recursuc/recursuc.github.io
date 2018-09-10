using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Xml;
using System.Text;
using System.IO;

using RAD.Core.Common;
using RAD.BusinessInterfaces;
using RAD.BusinessObjects.DataSource;
using RAD.BusinessDataInterfaces;
using System.Data;

namespace ReportSystem.Application.Run.Report.Handle
{
    public partial class RptToHTML : PageBase
    {
        public string tableCreateHtml = "";//表字符串
        protected void Page_Load(object sender, EventArgs e)
        {
            XmlDocument xmlDoc = null;
            try
            {
                string rptName = Request.Params["rptName"];
                if (rptName != null)
                {
                    if (rptName != "")
                    {
                        string rptTitle = rptName;
                        ToHTML(Page.Application["rptHTMLSession"].ToString(), rptName, rptTitle);
                    }
                    else
                    {
                        xmlDoc = new XmlDocument();
                        xmlDoc.Load(Request.InputStream);
                        XmlElement xe = (XmlElement)xmlDoc.SelectSingleNode("//PNTHTML");
                        Page.Application["rptHTMLSession"] = xe.InnerText;
                    }
                }
            }
            catch (System.Exception ex)
            {
                throw ex;
            }
        }
        public static void ToHTML(string sTb, string FileName, string Title)
        {
            try
            {
                byte[] bytes = Encoding.Default.GetBytes(sTb);
                sTb = Encoding.GetEncoding("gb2312").GetString(bytes);
                HttpContext.Current.Response.Clear();
                HttpContext.Current.Response.Charset = "gb2312";
                HttpContext.Current.Response.ContentEncoding = System.Text.Encoding.GetEncoding("gbk");
                HttpContext.Current.Response.AppendHeader("Content-Disposition", "attachment;filename=" + "" + System.Web.HttpUtility.UrlEncode(FileName, System.Text.Encoding.GetEncoding("utf-8")) + ".html");
                HttpContext.Current.Response.ContentType = "application/ms-excel";
                HttpContext.Current.Response.Write(sTb);
                HttpContext.Current.Response.Flush();
                HttpContext.Current.Response.Clear();
                HttpContext.Current.ApplicationInstance.CompleteRequest();
                HttpContext.Current.Response.Close();
            }
            catch (Exception ex)
            {
                throw ex;
            }
            finally
            {
                HttpContext.Current.Response.End();
            }
        }
    }
}
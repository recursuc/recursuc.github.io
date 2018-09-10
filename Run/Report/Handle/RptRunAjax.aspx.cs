using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Xml;
using System.Data;

using RAD.BusinessInterfaces;
using ReportNS = RAD.BusinessObjects.Report;
using RAD.BusinessObjects.DataSource;
using RAD.BusinessObjects.Report.DataSourceConfig;
using RAD.BusinessAdoProvider;
using RAD.BusinessObjects.Report.Run.Html;
using RAD.Core.Common;
using RAD.BusinessObjects.Report.Run;
using RAD.BusinessObjects.Report.ArgumentConfig;

namespace ReportSystem.Application.Run.Report.Handle
{
    public partial class RptRunAjax : PageBase
    {
        protected void Page_Load(object sender, EventArgs e)
        {
            //设置流的参数
            Response.Clear();
            Response.ContentType = "text/xml";
            Response.Charset = "gb2312";

            try
            {
                
                int pageNo = 1;
                if (Request["PageNo"] != null && Request["PageNo"].ToString() != "")
                {
                    int.TryParse(Request["PageNo"].ToString(), out pageNo);
                }

                if (Request["IsView"] != null && Request["IsView"].ToString() == "1")   //预览 根据报表定义模型
                {
                    #region 预览
                    XmlDocument xmlRptDefineDoc = new XmlDocument();
                    xmlRptDefineDoc.Load(Request.InputStream);
                    //Report report = GetService<IReportService>().RptXmlToRptObj(xmlRptDefineDoc, false);
                    IReportService iReportService = GetService<IReportService>();
                    //iReportService.AddSysConfig("DatabaseType", DataCommon.GetdbType(xmlRptDefineDoc.SelectSingleNode("RAD/Doc/Data/Report/DataSource/DataSet").Attributes["ConnString"].Value));
                    //iReportService.AddSysConfig("ConnStr", xmlRptDefineDoc.SelectSingleNode("RAD/Doc/Data/Report/DataSource/DataSet").Attributes["ConnString"].Value);
                    //iReportService.AddSysConfig("IsUseDefaultStr", "yes");
                    ReportNS.Report report = iReportService.RptXmlToRptObj(xmlRptDefineDoc, false);
                    XmlDocument xmlRptDoc = report.GetHtmlReport(pageNo, true);
                    if (xmlRptDoc != null)
                    {
                        xmlRptDoc.Save(Response.OutputStream);
                    }
                    #endregion
                }
                else if (Request["reportId"] != null && Request["reportId"].ToString() != "") //运行 根据报表ID
                {
                    #region 运行
                    //报表参数收集，转为字典类型
                    IDictionary<string, string> argDic = new Dictionary<string, string>();
                    foreach (string argName in Request.QueryString.AllKeys)
                    {
                        if (argName.ToLower() != "reportid" && argName.ToLower() != "reportcacheid" && argName.ToLower() != "pageno" && argName != "AspxAutoDetectCookieSupport" && argName != "RptCacheId")
                        {
                            argDic.Add(argName, Request.QueryString[argName]);
                        }
                    }
                    XmlDocument xdRptDoc = ReportNS.Report.GetHtmlRptFromCache(Request["reportId"], argDic, pageNo);//调用缓存
                    //XmlDocument xdRptDoc = null;
                    if (xdRptDoc == null)//缓存不存在，或者改变重新调用报表引擎生产
                    {
                        IReportService iReportService = GetService<IReportService>();
                        ReportNS.Report report = iReportService.SelectReportObj(Request["reportId"].ToString(), false);
                        xdRptDoc = report.GetHtmlReport(argDic, pageNo, false);
                        if (xdRptDoc != null)
                        {
                            xdRptDoc.Save(Response.OutputStream);
                        }
                        else
                        {
                            Response.Write("不存在Id编号为:" + Request["reportId"].ToString() + "报表");
                        }
                    }
                    else//否则调用缓存
                    {
                        xdRptDoc.Save(Response.OutputStream);
                    }

                    #endregion
                }

            }
            catch (System.Exception ex)
            {
                Response.Write(ex.Message);
            }
        }
    }
}
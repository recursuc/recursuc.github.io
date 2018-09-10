using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Data;
using System.Text;
using System.Text.RegularExpressions;
using System.Configuration;

using RAD.Core.Service;
using RAD.BusinessInterfaces;
using RAD.BusinessDataInterfaces;
using RAD.BusinessServices;
using RAD.BusinessObjects.Report;
using RAD.BusinessObjects.DataSource;
using RAD.Core.Common;
using RAD.BusinessAdoProvider;
using System.Xml;

namespace ReportSystem.Application.Design.Report.Handle
{
    public partial class RptDesignAjax_Json : PageBase
    {
        protected void Page_Load(object sender, EventArgs e)
        {
            Response.Clear();
            byte[] byts = new byte[Request.InputStream.Length];
            Request.InputStream.Read(byts, 0, byts.Length);
            string textJson = Encoding.Default.GetString(byts);
            string operSign = Request.QueryString["operSign"].ToString();
            string dbId = Request.QueryString["dbId"].ToString();
            string args = Request.QueryString["args"].ToString();
            switch (operSign)
            {
                case "getDsFieldName":
                    {
                        #region 取数据集名称
                        XmlNode xnDataset = GetService<IReportService>().SelectRptDSXML(dbId);
                        string type = xnDataset.Attributes["Type"].Value;
                        StringBuilder sbJson = new StringBuilder();
                        switch (type)
                        {
                            case "0":
                                {
                                    #region sql数据集
                                    try
                                    {
                                        DataTable dt = GetService<IReportService>().GetSqlDSFilds(dbId, args);
                                        sbJson.Append("[");
                                        if (dt != null)
                                        {
                                            for (int i = 0; i < dt.Columns.Count; i++)
                                            {
                                                if (i < dt.Columns.Count - 1)
                                                    sbJson.AppendFormat("\"{0}\",", dt.Columns[i].ColumnName);
                                                else sbJson.AppendFormat("\"{0}\"", dt.Columns[i].ColumnName);
                                            }
                                        }
                                        sbJson.Append("]");
                                    }
                                    catch (Exception ex)
                                    {
                                        Response.Write(ex.Message);
                                    }

                                    break;
                                    #endregion
                                }
                            case "1":
                                {
                                    #region 自定义数据集
                                    break;

                                    #endregion
                                }
                            case "2":
                                {
                                    #region  内建数据集
                                    XmlNode fileInfoXn = xnDataset.ChildNodes[0];
                                    sbJson.Append("[");
                                    foreach (XmlNode xnFileInfo in fileInfoXn)
                                    {
                                        sbJson.AppendFormat("\"{0}\",", xnFileInfo.ChildNodes[0].Attributes["ColName"].Value);
                                    }
                                    sbJson.Append("]");
                                    break;
                                    #endregion
                                }
                            case "3":
                                {
                                    #region xml数据集
                                    string xmlPath = Request.PhysicalApplicationPath.Replace("\\", "/") + xnDataset.Attributes["FilePath"].Value;
                                    XmlDocument dataDoc = new XmlDocument();
                                    dataDoc.Load(xmlPath);
                                    XmlElement xeTb = (XmlElement)dataDoc.SelectSingleNode("RAD/Doc/DataTable");
                                    XmlElement xeField = (XmlElement)dataDoc.SelectSingleNode("RAD/Doc/DataTable/FieldInfo");
                                    XmlElement xeData = (XmlElement)dataDoc.SelectSingleNode("RAD/Doc/DataTable/Data");
                                    sbJson.Append("[");
                                    for (int i = 0; i < xeField.ChildNodes.Count; i++)
                                    {
                                        if (xeField.ChildNodes[i].NodeType == XmlNodeType.Element)
                                        {
                                            for (int j = 0; j < xeField.ChildNodes[i].ChildNodes.Count; j++)
                                            {
                                                if (xeField.ChildNodes[i].ChildNodes[j].NodeType == XmlNodeType.Element)
                                                {
                                                    if (j < xeField.ChildNodes[i].ChildNodes.Count - 1)
                                                        sbJson.AppendFormat("\"{0}\",", xeField.ChildNodes[i].ChildNodes[j].Attributes["ColName"].Value);
                                                    else sbJson.AppendFormat("\"{0}\"", xeField.ChildNodes[i].ChildNodes[j].Attributes["ColName"].Value);
                                                }
                                            }
                                        }
                                    }
                                    sbJson.Append("]");
                                    break;
                                    #endregion
                                }
                        }
                        Response.Write(sbJson.ToString());
                        break;
                        #endregion
                    }
                case "getDsData":
                    {
                        #region 取数据
                        IReportService iReportService = GetService<IReportService>();
                        //iReportService.AddSysConfig("DatabaseType", DataCommon.GetdbType(Request.QueryString["ConnString"].ToString()));
                        //iReportService.AddSysConfig("ConnStr", Request.QueryString["ConnString"].ToString());
                        //iReportService.AddSysConfig("IsUseDefaultStr", "yes");
                        string dataJson = iReportService.GetDSJsonData(dbId, Request.QueryString["data"].ToString(), args);
                        Response.Write(dataJson);
                        #endregion
                        break;
                    }
            }
        }
        #region 获得当前数据库连接字符串
        //获得当前数据库连接字符串
        private string GetNowConnString()
        {
            string nowConnString = null;
            if (Session["nowConnString"] != null && (string)Session["nowConnString"] != "")
            {
                nowConnString = (string)Session["nowConnString"];
                Session["ColumnsConnString"] = nowConnString;
            }
            else
            {
                nowConnString = ConfigurationManager.ConnectionStrings["defaultConnString"].ConnectionString;
            }
            return nowConnString;
        }
        #endregion
    }
}
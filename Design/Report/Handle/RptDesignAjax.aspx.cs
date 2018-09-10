using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Xml;

using RAD.Core.Service;
using RAD.BusinessInterfaces;
using RAD.BusinessDataInterfaces;
using RAD.BusinessServices;
using RAD.BusinessObjects.Report;
using RAD.BusinessObjects.DataSource;
using RAD.Core.Common;
using System.Data;
using RAD.BusinessAdoProvider;
using System.IO;
using System.Text;
using System.Text.RegularExpressions;
using System.Configuration;

namespace ReportSystem.Application.Design.Report.Handle
{
    public partial class RptDesignAjax : PageBase
    {
        protected void Page_Load(object sender, EventArgs e)
        {
            //设置流的参数
            Response.Clear();

            XmlDocument xmlDoc = null;
            string reportId = "";
            string responseMsg = "";                    //返回给前台设计器的信息
            string operSign = Request["OperationSign"].ToString();     //URL后面第一个参数是指操作类型：如0-增、1-改、2-查、3-删、4-另存文件，第二个参数可选,指报表Id
            //CommonJsonObject c = (CommonJsonObject)JsonManager.DeserializeObject("{name:\"123\",value:\"2321\"}",typeof( CommonJsonObject));
            if (Request["ReportId"] != null)
            {
                reportId = Request["ReportId"].ToString();
            }
            else
            {
                //加载参数Xml
                xmlDoc = new XmlDocument();
                XmlNode xmlRAD = xmlDoc.CreateNode(XmlNodeType.Element, "RAD", null);
                xmlDoc.AppendChild(xmlRAD);
                xmlDoc.Load(Request.InputStream);           //加载请求时发送的xml对象
            }

            try
            {
                switch (operSign)
                {
                    case "0":
                        {
                            #region 新增
                                IReportService iReportService = GetService<IReportService>();
                                string ReturnreportId = iReportService.InsertReportObj(xmlDoc);//入库
                                this.saveFile(xmlDoc, ReturnreportId);//存文件
                                responseMsg = ReturnreportId;
                            }
                            break;
                            #endregion
                    case "1":
                        {
                            #region 更新
                            GetService<IReportService>().UpdateReportObj(xmlDoc);
                            XmlElement xeReport = (XmlElement)xmlDoc.SelectSingleNode("RAD/Doc/Data//Report");
                            string rptId = xeReport.Attributes["DbId"].Value;
                            this.saveFile(xmlDoc, rptId);//存文件
                            responseMsg = "文件更新成功";
                            break;
                            #endregion
                        }
                    case "2":
                        {
                            #region 查询
                            if (reportId != "")
                            {
                                XmlDocument xmldoc = GetService<IReportService>().SelectReportXml(reportId, true);
                                Response.ContentType = "text/xml";
                                Response.Charset = "utf-8";
                                xmldoc.Save(Response.OutputStream);
                                return;
                            }
                            break;
                            #endregion
                        }
                    case "3":
                        {
                            #region 删除
                            if (reportId != "")
                            {
                                if (GetService<IReportService>().DeteleReportObj(reportId))
                                {
                                    responseMsg = "文件删除成功";
                                }
                            }
                            break;
                            #endregion
                        }
                    case "4":
                        {
                            #region 另存为
                            string filePath = saveFile(xmlDoc);
                            if (filePath != "")
                            {
                                responseMsg = "result:true,fileName:\"" + Path.GetFileNameWithoutExtension(filePath) + "\",filePath:\"" + filePath + "\"";
                            }
                            break;
                            #endregion
                        }
                    case "loadXml"://导入XML
                        {
                            #region 导入XML
                            XmlDocument xmlLoadDoc = new XmlDocument();
                            xmlLoadDoc.Load(Request.MapPath(@"../file/scratchFile.xml"));
                            Response.Clear();
                            Response.ContentType = "text/xml";
                            Response.Charset = "gbk";
                            xmlLoadDoc.Save(Response.OutputStream);
                            return;
                            #endregion
                        }
                    case "ViewReportModel":
                        {
                            #region 取所有已存报表模型
                            if (reportId != "")
                            {
                                //获取指定ID报表定义
                                XmlDocument xmldoc = GetService<IReportService>().SelectReportXml(reportId, true);
                                Response.ContentType = "text/xml";
                                Response.Charset = "utf-8";
                                xmldoc.Save(Response.OutputStream);
                                return;
                            }
                            else
                            {
                                string sql = "select F_ID, F_Name from RPT_report order by F_Name asc";
                                DataTable dt = GetService<IReportService>().SelectData(sql);
                                if (dt != null)
                                {
                                    XmlDocument xmlReturnModel = this.getXmlDocumentModel();
                                    XmlNode xnReturn = xmlReturnModel.SelectSingleNode("RAD/Doc/Data");
                                    XmlElement xeTable = xmlReturnModel.CreateElement("Table");
                                    // xeTable.SetAttribute("border"," 1px");
                                    xeTable.SetAttribute("width", "600px");
                                    xeTable.SetAttribute("cellspacing", "0px");
                                    xnReturn.AppendChild(xeTable);
                                    XmlElement xeTr = xmlReturnModel.CreateElement("colgroup");
                                    xeTable.AppendChild(xeTr);
                                    XmlElement xeTd = null;
                                    for (int i = 0; i < dt.Columns.Count; i++)
                                    {
                                        xeTd = xmlReturnModel.CreateElement("col");
                                        if (i == 0)
                                        {
                                            xeTd.SetAttribute("width", "25%");
                                        }
                                        else
                                        {
                                            xeTd.SetAttribute("width", "60%");
                                        }
                                        //xeTd.InnerText = dt.Columns[i].ColumnName;
                                        xeTr.AppendChild(xeTd);
                                    }
                                    xeTd = xmlReturnModel.CreateElement("col");
                                    xeTd.SetAttribute("width", "15%");
                                    // xeTd.InnerText = "查看";
                                    xeTr.AppendChild(xeTd);
                                    //获取数据表数据
                                    for (int i = 0; i < dt.Rows.Count; i++)
                                    {
                                        xeTr = xmlReturnModel.CreateElement("Tr");
                                        xeTable.AppendChild(xeTr);
                                        for (int j = 0; j < dt.Columns.Count; j++)
                                        {
                                            xeTd = xmlReturnModel.CreateElement("Td");
                                            xeTd.InnerText = dt.Rows[i][j].ToString();
                                            xeTr.AppendChild(xeTd);
                                        }

                                        XmlElement xeTdEidt = xmlReturnModel.CreateElement("Td");
                                        xeTdEidt.InnerXml = "<input type=\"button\" id=\"btn_" + dt.Rows[i]["F_ID"].ToString() + "\" onclick=\"ViewModel('" + dt.Rows[i]["F_ID"].ToString() + "')\" value=\"查看\"/>";
                                        xeTr.AppendChild(xeTdEidt);
                                    }

                                    Response.Clear();
                                    Response.ContentType = "text/xml";
                                    Response.Charset = "utf-8";
                                    xmlReturnModel.Save(Response.OutputStream);
                                    return;
                                }
                                else
                                {
                                    responseMsg = GetService<IReportService>().ToString();
                                }
                                break;
                            }
                            #endregion
                        }
                    case "getDsColName":
                        {
                            #region 获得数据集列名
                            XmlDocument xmlReturnModel = SysFunction.getXmlDocModel();
                            XmlNode xnReturn = xmlReturnModel.SelectSingleNode("RAD/Doc/Data");
                            XmlElement xeTable = xmlReturnModel.CreateElement("Table");
                            xnReturn.AppendChild(xeTable);
                            string tbID = Request["tbID"].ToString();
                            IReportService iReportService = GetService<IReportService>();
                            XmlNode xnDataset = iReportService.SelectRptDSXML(tbID);
                            string type = xnDataset.Attributes["Type"].Value;
                            StringBuilder sbTable = new StringBuilder();
                            switch (type)
                            {
                                case "0":
                                    {
                                        #region sql数据集
                                        string args = Request["args"].ToString();
                                        DataTable dt = GetService<IReportService>().GetSqlDSFilds(tbID, args);
                                        if (dt != null)
                                        {
                                            for (int i = 0; i < dt.Columns.Count; i++)
                                            {
                                                sbTable.AppendFormat("<Tr><Td width=\"100%\">{0}</Td></Tr>", dt.Columns[i].ColumnName);
                                            }
                                        }
                                        else
                                        {
                                            responseMsg = GetService<IReportService>().ToString();
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
                                        string buildInXML = xnDataset.InnerXml;
                                        XmlNode fileInfoXn = xnDataset.ChildNodes[0];
                                        foreach (XmlNode xnFileInfo in fileInfoXn)
                                        {
                                            sbTable.AppendFormat("<Tr><Td width=\"100%\" style='font-size:12px'>{0}</Td></Tr>", xnFileInfo.ChildNodes[0].Attributes["ColName"].Value);
                                        }
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
                                        for (int i = 0; i < xeField.ChildNodes.Count; i++)
                                        {
                                            if (xeField.ChildNodes[i].NodeType == XmlNodeType.Element)
                                            {
                                                for (int j = 0; j < xeField.ChildNodes[i].ChildNodes.Count; j++)
                                                {
                                                    if (xeField.ChildNodes[i].ChildNodes[j].NodeType == XmlNodeType.Element)
                                                    {
                                                        sbTable.AppendFormat("<Tr><Td width=\"100%\"  style='font-size:12px'>{0}</Td></Tr>", xeField.ChildNodes[i].ChildNodes[j].Attributes["ColName"].Value);
                                                    }
                                                }
                                            }
                                        }
                                        break;
                                        #endregion
                                    }
                            }
                            xeTable.InnerXml = sbTable.ToString();
                            Response.Clear();
                            Response.ContentType = "text/xml";
                            Response.Charset = "utf-8";
                            xmlReturnModel.Save(Response.OutputStream);
                            break;
                            #endregion
                        }
                    case "getReportName":
                        {
                            string sql = "select F_ID, F_Name from RPT_report order by F_Name asc";
                            DataTable dt = GetService<IReportService>().SelectData(sql);
                            if (dt != null)
                            {
                                XmlDocument xmlReturnModel = this.getXmlDocumentModel();
                                XmlNode xnReturn = xmlReturnModel.SelectSingleNode("RAD/Doc/Data");
                                StringBuilder data = new StringBuilder();
                                int len = dt.Rows.Count;
                                data.Append("[");
                                for (int i = 0; i < len; i++)
                                {
                                    if (i < len - 1)
                                    {
                                        data.AppendFormat("\"{0}\",", dt.Rows[i]["F_NAME"]);
                                    }
                                    else
                                    {
                                        data.AppendFormat("\"{0}\"", dt.Rows[i]["F_NAME"]);
                                    }
                                }
                                data.Append("]");
                                xnReturn.InnerText = data.ToString();
                                Response.Clear();
                                Response.ContentType = "text/xml";
                                Response.Charset = "utf-8";
                                xmlReturnModel.Save(Response.OutputStream);
                                return;
                            }
                            else
                            {
                                responseMsg = GetService<IReportService>().ToString();
                            }
                            break;
                        }
                }
                Response.Write(responseMsg);
            }
            catch (System.Exception ex)
            {
                Response.Write(ex.Message);
            }
        }

        #region 文件保存
        /// <summary>
        /// 文件保存(另存)
        /// </summary>
        /// <param name="xmldoc"></param>
        public string saveFile(XmlDocument xmlDoc)
        {
            string filePath = "";
            //FileStream fileStream = null;
            try
            {
                XmlNode xnReport = xmlDoc.SelectSingleNode("RAD/Doc/Data/Report");
                string fileName = xnReport.Attributes["ChineseName"].Value;
                string nFileName = fileName + "_" + DateTime.Now.ToString("yyyyMMddHHmmssffff");
                filePath = Request.PhysicalApplicationPath + "Application\\ReportSystemV1.2\\file\\" + nFileName + ".xml";
                xmlDoc.Save(filePath);
            }
            catch (Exception e)
            {

                throw e;
            }
            return filePath;
        }

        /// <summary>
        /// 文件保存(保存)
        /// </summary>
        /// <param name="xmlDoc"></param>
        public void saveFile(XmlDocument xmlDoc, string rptId)
        {
            try
            {
                XmlNode xnReport = xmlDoc.SelectSingleNode("RAD/Doc/Data/Report");
                string filePath = Request.PhysicalApplicationPath + "Application\\ReportSystemV1.2\\rptFiles\\" + rptId + ".xml";
                FileInfo fileInfo = new FileInfo(filePath);
                if (fileInfo.Exists)
                {
                    File.Delete(filePath);
                }
                xmlDoc.Save(filePath);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        #endregion

        #region xmlDoc模型
        private XmlDocument getXmlDocumentModel()
        {
            System.Text.StringBuilder sbXmlModel = new System.Text.StringBuilder("");
            sbXmlModel.Append("<?xml version=\"1.0\" encoding=\"utf-8\"?>");
            sbXmlModel.Append("<RAD>");
            sbXmlModel.Append("<Doc>");
            sbXmlModel.Append("<Data>");
            sbXmlModel.Append("</Data>");
            sbXmlModel.Append("</Doc>");
            sbXmlModel.Append("</RAD>");
            XmlDocument xmlDoc = new XmlDocument();
            xmlDoc.LoadXml(sbXmlModel.ToString());
            return xmlDoc;
        }
        #endregion

        #region 下载文件
        /// <summary>
        /// 下载文件
        /// </summary>
        public void DownLoadFile(string filePath)
        {
            string fileName = Path.GetFileName(filePath);
            //获取文件后缀名
            string postfix = Path.GetExtension(filePath).ToLower();

            //读取服务器文件
            FileStream fs = new FileStream(filePath, FileMode.Open, FileAccess.Read);
            BinaryReader br = new BinaryReader(fs);
            try
            {
                byte[] br1 = br.ReadBytes((int)fs.Length);

                if (br1.Length != 0)
                {
                    Response.Clear();
                    Response.BufferOutput = true;
                    Response.AddFileDependency(fileName);
                    Response.AppendHeader("Content-Disposition", "attachment;filename=" + HttpUtility.UrlEncode(fileName, Encoding.UTF8));
                    Response.ContentType = SysFunction.GetContentType(postfix);
                    Response.OutputStream.Write(br1, 0, br1.Length);
                    Response.Flush();
                    Response.Close();
                }
            }
            catch (Exception ex)
            {
                Response.Write("<script type='text/javascript'>alert('获取下载信息失败，请尝试重新下载！');</script>");
            }
            finally
            {
                fs.Dispose();
                fs.Close();
                br.Close();
            }
        }
        #endregion

        #region 获得当前数据库连接字符串
        //获得当前数据库连接字符串
        private string GetNowConnString(string currentDsConn)
        {
            string nowConnString = null;
            if (currentDsConn == "")
            {
                if (Session["nowConnString"] != null && (string)Session["nowConnString"] != "")
                {
                    nowConnString = (string)Session["nowConnString"];
                }
                else
                {
                    nowConnString = ConfigurationManager.ConnectionStrings["defaultConnString"].ConnectionString;
                }
            }
            else
            {
                nowConnString = currentDsConn;
            }
            return nowConnString;
        }
        #endregion
    }
}
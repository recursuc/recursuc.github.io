using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Xml;
using RAD.Form.Bussiness;
using RAD.Common;
using System.Data;

namespace FrameWorkPage.Application.Design.Form.Handle
{
    public partial class ControlDSAjax : PageBase
    {
        private XmlDocument xmlData = new XmlDocument();
        private XmlDocument xmlReturn = SysFunction.getXmlDocModel();
        private FormService formService = new FormService();

        protected void Page_Load(object sender, EventArgs e)
        {
            try
            {
                //加载xml
                Response.Clear();
                Response.ContentType = "Text/Xml";

                xmlData.Load(Request.InputStream);
                //根据参数获取信息
                XmlNode xnParams = xmlData.SelectSingleNode("RAD/Doc/Data");
                XmlNode xnReturn = xmlReturn.SelectSingleNode("RAD/Doc/Data");

                foreach (XmlNode xnParam in xnParams.ChildNodes)
                {
                    if (xnParam.Attributes["ParamType"] != null && xnParam.Attributes["ParamType"].Value != "")
                    {
                        switch (xnParam.Attributes["ParamType"].Value)
                        {
                            case "GetDBSourceItems":
                                // 取xml数据
                                string strDataSource = "";
                                string strValueMember = "";
                                string strTextMember = "";
                                strDataSource = xnParam.Attributes["DataSource"].Value;
                                strValueMember = xnParam.Attributes["DbValueColumn"].Value;
                                strTextMember = xnParam.Attributes["DbTextColumn"].Value;
                                DataTable dt = this.GetDictionaryDataByParm(strDataSource);
                                if (strDataSource != "" && strValueMember != "" && strTextMember != "")
                                {
                                    XmlElement xeDBSource = xmlReturn.CreateElement("DBSource");
                                    //XmlAttribute xaId = xmlReturn.CreateAttribute("ClientId");
                                    //xaId.Value = xnParam.Attributes["ClientId"].Value;
                                    //xeDBSource.Attributes.Append(xaId);

                                    //生成需要返回的xml数据
                                    foreach (DataRow dr in dt.Rows)
                                    {
                                        XmlNode newNode = xmlReturn.CreateNode(XmlNodeType.Element, "Item", "");

                                        XmlAttribute xa = xmlReturn.CreateAttribute("id");
                                        xa.Value = dr[strValueMember].ToString();
                                        newNode.Attributes.Append(xa);

                                        xa = xmlReturn.CreateAttribute("name");
                                        xa.Value = dr[strTextMember].ToString();
                                        newNode.Attributes.Append(xa);

                                        xeDBSource.AppendChild(newNode);
                                    }
                                    xnReturn.AppendChild(xeDBSource);
                                }
                                break;
                            default:
                                break;
                        }
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
            //返回获取的信息
            xmlReturn.Save(Response.OutputStream);
        }

        /// <summary>
        /// 通过指定数据源，返回含有指定字段的DataTable数据。
        /// </summary>
        /// <param name="strDataSource">指定数据源。如：select * from pnet_base_data where parent_id = 'test'。</param>
        /// <returns>返回含有指定值字段和文本字段的DataTable数据</returns>
        private DataTable GetDictionaryDataByParm(string dataSourceSql)
        {
            DataTable dictionaryData = new DataTable();
            
            try
            {
                dictionaryData = formService.getDictionaryDataByParm(dataSourceSql);
            }
            catch (Exception err)
            {
                throw err;
            }
            finally
            {
                //formClient.Close();
            }
            return dictionaryData;
        }
    }
}
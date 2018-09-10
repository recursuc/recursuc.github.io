using System;
using System.Collections.Generic;
using System.Xml;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Collections;
using System.Data;

namespace ReportSystem.Application.Design.Form.Handle
{
    public partial class get_selectdata : PageBase
    {
        RAD.Form.Bussiness.FormService formServiceClient = new RAD.Form.Bussiness.FormService();

        protected void Page_Load(object sender, EventArgs e)
        {
            //加载xml
            Response.Clear();
            Response.ContentType = "Text/Xml";
            System.Xml.XmlDocument xmlDel = new XmlDocument();
            xmlDel.Load(Request.InputStream);

            //取xml数据
            string strDataSource = "";
            string strValueMember = "";
            string strTextMember = "";
            XmlNodeList BaseNodes = xmlDel.GetElementsByTagName("MyData");
            XmlAttributeCollection attr = BaseNodes[0].Attributes;
            strDataSource = attr.GetNamedItem("DataSource").InnerText;
            strValueMember = attr.GetNamedItem("ValueMember").InnerText;
            strTextMember = attr.GetNamedItem("TextMember").InnerText;

            try
            {
                if (strDataSource != "" && strValueMember != "" && strTextMember != "")
                {
                    formServiceClient.AddSysConfig("TenentConnStr", "");
                    formServiceClient.AddSysConfig("PlateConnStr", DataCommon.DefaultConnectionString);
                    DataTable dt = this.GetDictionaryDataByParm(strDataSource.Replace("@", "'"));
                    //生成需要返回的xml数据
                    foreach (DataRow dr in dt.Rows)
                    {
                        XmlNode newNode = xmlDel.CreateNode(XmlNodeType.Element, "MyOption", "");
                        XmlAttribute xa = xmlDel.CreateAttribute("id");
                        xa.Value = dr[strValueMember].ToString();
                        newNode.Attributes.Append(xa);

                        xa = xmlDel.CreateAttribute("name");
                        xa.Value = dr[strTextMember].ToString();
                        newNode.Attributes.Append(xa);

                        BaseNodes.Item(0).AppendChild(newNode);
                    }
                }
            }
            catch (Exception) { }
            //finally {
            //    formServiceClient.Close();
            //}

            //返回xml
            xmlDel.Save(Response.OutputStream);
        }

        /// <summary>
        /// 通过指定数据源，返回含有指定字段的DataTable数据。
        /// </summary>
        /// <param name="strDataSource">指定数据源。如：from pnet_base_data where parent_id = 'test'。</param>
        /// <param name="strValueMember">值字段</param>
        /// <param name="strTextMember">文本字段</param>
        /// <returns>返回含有指定值字段和文本字段的DataTable数据</returns>
        public DataTable GetDictionaryDataByParm(string strDataSource)
        {
            DataTable dictionaryData = new DataTable();
            try
            {
                dictionaryData = formServiceClient.GetDictionaryDataByParm(strDataSource);
            }
            catch (Exception err)
            {
                throw err;
            }
            return dictionaryData;
        }
    }
}

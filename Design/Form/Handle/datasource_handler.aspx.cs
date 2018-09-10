using System;
using System.Data;
using System.Configuration;
using System.Collections;
using System.Web;
using System.Web.Security;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Web.UI.WebControls.WebParts;
using System.Web.UI.HtmlControls;
using System.Data.OracleClient;
using System.Xml;

namespace ReportSystem.Application.Design.Form.Handle
{
    public partial class datasource_handler : PageBase
    {
        RAD.Form.Bussiness.FormService formClient = new RAD.Form.Bussiness.FormService();

        private void Page_Load(object sender, System.EventArgs e)
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
            XmlNodeList BaseNodes = xmlDel.GetElementsByTagName("MyDatas");
            XmlAttributeCollection attr = BaseNodes[0].Attributes;
            strDataSource = attr.GetNamedItem("DataSource").InnerText;
            strValueMember = attr.GetNamedItem("DbValueColumn").InnerText;
            strTextMember = attr.GetNamedItem("DbTextColumn").InnerText;

            if (strDataSource != "" && strValueMember != "" && strTextMember != "")
            {
                DataTable dt = this.GetDictionaryDataByParm(strDataSource);
                //生成需要返回的xml数据
                foreach (DataRow dr in dt.Rows)
                {
                    XmlNode newNode = xmlDel.CreateNode(XmlNodeType.Element, "MyData", "");
                    XmlAttribute xa = xmlDel.CreateAttribute("id");
                    xa.Value = dr[strValueMember].ToString();
                    newNode.Attributes.Append(xa);

                    xa = xmlDel.CreateAttribute("name");
                    xa.Value = dr[strTextMember].ToString();
                    newNode.Attributes.Append(xa);

                    BaseNodes.Item(0).AppendChild(newNode);
                }
            }

            //返回xml
            xmlDel.Save(Response.OutputStream);
        }

        /// <summary>
        /// 通过指定数据源，返回含有指定字段的DataTable数据。
        /// </summary>
        /// <param name="strDataSource">指定数据源。如：select * from pnet_base_data where parent_id = 'test'。</param>
        /// <returns>返回含有指定值字段和文本字段的DataTable数据</returns>
        private DataTable GetDictionaryDataByParm(string dataSourceSql)
        {
            DataTable dictionaryData = new DataTable();
            formClient.AddSysConfig("TenentConnStr", "");
            formClient.AddSysConfig("PlateConnStr", DataCommon.DefaultConnectionString);

            try
            {
                dictionaryData = formClient.GetDictionaryDataByParm(dataSourceSql);
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

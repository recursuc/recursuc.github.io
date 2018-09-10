using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Xml;
using RAD.Common;
using RAD.Form.Model;
using RAD.Component.Model.SysAdmin;
using RAD.Form.Bussiness;

namespace FrameWorkPage.Application.Run.Form.Handle
{
    public partial class FormRun : PageBase
    {
        private string operType;    //跳转到此页面的标记位
        private XmlDocument xmlData = new XmlDocument();
        private XmlDocument xmlReturn = new XmlDocument();
        private FormService formService = new FormService();

        protected void Page_Load(object sender, EventArgs e)
        {
            try
            {
                formService.AddSysConfig("TenentConnStr", "");
                formService.AddSysConfig("PlateConnStr", DataCommon.DefaultConnectionString);

                //加载xml
                Response.Clear();
                Response.ContentType = "Text/Xml";

                if (Request.Params["operType"] != null && Request.Params["operType"].Length != 0)
                {
                    operType = Request.Params["operType"].ToString().Trim();

                    switch (operType)
                    {
                        case "1":// 打开表单
                            loadData();
                            break;
                        case "2":// 提交表单
                            updateData();
                            break;
                        case "6":
                            xmlReturn = formService.getAllBaseFormTabs();
                            xmlReturn.Save(Response.OutputStream);
                            break;
                        case "7":
                            xmlReturn = formService.getAllBaseQueryTabs();
                            xmlReturn.Save(Response.OutputStream);
                            break;
                        default:
                            break;
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
        }

        private void loadData()
        {
            FormTabs formTabs = convertToFormTabs();
            xmlReturn = formService.getForms(formTabs);
            xmlReturn.Save(Response.OutputStream);
        }

        private FormTabs convertToFormTabs()
        {
            FormTabs formTabs = new FormTabs();
            List<FormTab> formList = new List<FormTab>();

            string reqFormsId = Request.Params["formsId"].ToString().Trim();
            string reqFormCount = Request.Params["formCount"].ToString().Trim();// 非展现的表单个数，而是配置了表单状态或表单数据KEY的表单个数，为了取JSON数组定制处理的属性

            int formCount = 0;

            if (reqFormsId != null && reqFormsId.Length != 0)
            {
                formTabs.Id = int.Parse(reqFormsId);
            }
            if (reqFormCount != null && reqFormCount.Length != 0)
            {
                formCount = int.Parse(reqFormCount);
            }

            for (int i = 0; i < formCount; i++)
            {
                string reqId = Request.Params["objForms_" + i + "_id"].ToString().Trim();
                string reqDataKey = Request.Params["objForms_" + i + "_dataKey"].ToString().Trim();
                string reqFormStateId = Request.Params["objForms_" + i + "_formStateId"].ToString().Trim();

                FormTab formTab = new FormTab();
                if (reqId != null && reqId.Length != 0)
                {
                    formTab.Id = int.Parse(reqId);
                }
                if (reqDataKey != null && reqDataKey.Length != 0)
                {
                    formTab.DataKey = int.Parse(reqDataKey);
                }
                if (reqFormStateId != null && reqFormStateId.Length != 0 && !"0".Equals(reqFormStateId))
                {
                    formTab.FormStateId = int.Parse(reqFormStateId);
                }

                formList.Add(formTab);
            }

            formTabs.ObjForms = formList;

            // 未配置表单簿也未配置表单则异常
            if (formTabs.Id == 0 && formList.Count == 0)
            {
                formTabs = null;
            }

            return formTabs;
        }

        private void updateData() 
        {
            BaseUserObject user=(BaseUserObject)Session[DataCommon.LoginedUserKey];
		    string formName = "";// 表单名称
		    string formDataKey = "";// 表单数据KEY
		    string returnVal = "";

		    try {
			    xmlData.Load(Request.InputStream);
			    if (xmlData != null) {
				    xmlData = formService.commitForms(xmlData, user);
			    }

			    XmlNode xnSheets = xmlData.SelectSingleNode("RAD/Doc/Data/sheets");
			    XmlNodeList xnSheetList = xnSheets.SelectNodes("sheet");
			    foreach (XmlNode xnSheet in xnSheetList) {
				    if (returnVal.Equals("")) {
					    returnVal += xnSheet.Attributes["id"].Value + ","
							    + xnSheet.Attributes["dataKey"].Value + ","
							    + xnSheet.Attributes["mainTable"].Value;
				    } else {
					    returnVal += ";" + xnSheet.Attributes["id"].Value + ","
							    + xnSheet.Attributes["dataKey"].Value + ","
                                + xnSheet.Attributes["mainTable"].Value;
				    }
			    }
			    xmlData = SysFunction.getXmlDocWithResult("0", returnVal);
		    } catch (Exception ex) {
			    string DetailLog = "给名称为【" + formName + "】的表单更新数据KEY为【" + formDataKey + "】的数据";
			    xmlData = SysFunction.getXmlDocWithResult("1", "更新表单数据失败！" + ex.Message);
		    }
            xmlData.Save(Response.OutputStream);
	    }
    }
}
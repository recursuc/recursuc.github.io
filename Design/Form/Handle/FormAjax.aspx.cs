using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Xml;
using System.Text;
using System.Data;

using RAD.Common;
using RAD.Component.Bussiness;
using RAD.Form.Model;
using RAD.Form.Model.Enumerations;
using RAD.Form.Bussiness;

namespace FrameWorkPage.Application.Design.Form.Handle
{
    public partial class FormAjax : PageBase
    {
        private string operType;    //跳转到此页面的标记位
        private XmlDocument xmlData = new XmlDocument();
        private XmlDocument xmlReturn = new XmlDocument();
        private FormService formService = new FormService();
        private DataSetService datasetService = new DataSetService();
        private FormStateService formStateService = new FormStateService();

        protected void Page_Load(object sender, EventArgs e)
        {
            try
            {
                formService.AddSysConfig("TenentConnStr", "");
                formService.AddSysConfig("PlateConnStr", DataCommon.DefaultConnectionString);


                //加载xml
                Response.Clear();
                Response.ContentType = "Text/Xml";

                if (Request.Params["OperType"] != null && Request.Params["OperType"].Length != 0)
                {
                    operType = Request.Params["OperType"].ToString().Trim();

                    switch (operType)
                    { 
                        case "1":
                            getFormDefine();
                            break;
                        case "2":
                            upDate();
                            break;
                        case "getAllForms":
                            getAllForms();
                            break;
                        case "getFormsByFormBook":
                            getFormsByFormBook();
                            break;
                        case "5":
                            break;
                        case "6":
                            xmlReturn = formService.getAllBaseFormTabs();
                            xmlReturn.Save(Response.OutputStream);
                            break;
                        case "7":
                            xmlReturn = formService.getAllBaseQueryTabs();
                            xmlReturn.Save(Response.OutputStream);
                            break;
                        case "getFormControls":
                            getFormControls();
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

        private void getAllForms()
        {
            List<FormTabs> allFormTabs = formService.getAllFormTabls();
            string json = SysFunction.Json(allFormTabs);
            Response.ContentType = "text/json";
            Response.Write(json);
        }

        private void getFormsByFormBook()
        {
            string formbookId = Request.Params["formTabId"].ToString().Trim();
            List<FormTab> forms = formService.getFormsByFormBook(formbookId);
            string json = "";
            if (forms.Count > 0)
            {
                json = SysFunction.Json(forms);
            }
            Response.ContentType = "text/json";
            Response.Write(json);
        }

        private void getFormControls()
        {
		    string formId = Request.Params["formId"].ToString().Trim();
            XmlNodeList controls = getFormControls(formId);
            //logger.debug(controls.size() + "个控件");
            List<Dictionary<String, String>> list = new List<Dictionary<String, String>>();
            if (controls.Count > 0) {
                foreach (XmlNode control in controls) {
                    Dictionary<String, String> map = getControlInfo(control, null);
                    list.Add(map);
                }
            }
            string json = SysFunction.Json(list);
            Response.ContentType = "text/json";
		    string result = "{\"rows\" : " + json + "}";
		    try {
                Response.Write(result);
		    } catch (Exception ex) {
			    xmlReturn = SysFunction.getXmlDocWithResult("1", ex.Message);
                xmlReturn.Save(Response.OutputStream);
		    }
	    }

        private void getControlByForm()
        {
		    string formId = Request.Params["formId"].ToString().Trim();
		    XmlNodeList controls = getValuedFormControls(formId);
		    string json = "";
		    List<Dictionary<string, string>> list = new List<Dictionary<string, string>>();
		    if (controls.Count >0) {
			    foreach (XmlNode element in controls) {
				    Dictionary<string, string> map = getControlInfo(element);
				    list.Add(map);
			    }
                json = SysFunction.Json(list);
		    }
            Response.ContentType = "text/json";
            Response.Write(json);
	    }

        private XmlNodeList getValuedFormControls(String formId)
        {
            XmlDocument doc = formService.selectFormDefineDoc(formId);
            XmlNode contentNode = doc.SelectSingleNode("//sheets/sheet/div/div");
            XmlNodeList controls = contentNode.SelectNodes(".//*[@type='text'] " + "| .//*[@type='combobox'] " + "| .//*[@type='textarea']" + "| .//*[@type='checkbox']");
            return controls;
        }

        private Dictionary<string, string> getControlInfo(XmlNode control)
        {
            Dictionary<string, string> map = new Dictionary<string, string>();
            if (control == null)
            {
                return map;
            }
            string type = control.Attributes["type"].Value;
            string controlId = control.Attributes["cid"].Value;
            string controlName = control.Attributes["value"].Value;
            string controlType = EnumDescription.GetFieldText(Enum.Parse(typeof(EnumControlType),type)); //EnumControlType.valueOf(type).getDisplayName();
            map.Add("controlId", controlId);
            map.Add("controlName", controlName);
            map.Add("controlType", controlType);
            return map;
        }

        private Dictionary<string, string> getControlInfo(XmlNode control, string currentState)
        {
            Dictionary<String, String> map = new Dictionary<String, String>();
            if (control == null)
            {
                return map;
            }
            string type = control.Attributes["type"].Value;
            string controlId = control.Attributes["cid"].Value;
            string controlName = control.Attributes["value"].Value;
            string controlType = EnumDescription.GetFieldText(Enum.Parse(typeof(EnumControlType),type));//EnumControlType.valueOf(type).getDisplayName();
            map.Add("controlId", controlId);
            map.Add("controlName", controlName);
            map.Add("controlType", controlType);
            map.Add("controlState", getOptions(controlId, currentState));
            return map;
        }

        private string getOptions(string controlId, string selectedValue)
        {
            //EnumControlStateType[] values = EnumControlStateType.values();
            EnumDescription[] values = EnumDescription.GetFieldTexts(typeof(EnumControlStateType));
		    StringBuilder sb = new StringBuilder();
            //for (EnumControlStateType enumControlStateType : values) {
            //    sb.append(getOption(enumControlStateType.getStorageValue(),
            //            enumControlStateType.getDisplayName(), selectedValue));
            //}
             foreach (EnumDescription enumControlStateType in values) {
			    sb.Append(getOption(enumControlStateType.FieldName,
					    enumControlStateType.EnumDisplayText, selectedValue));
		    }
		    return "<select cid='" + controlId + "' style='width:80px;'>" + sb.ToString() + "</select>";
	    }

        private string getOption(string value, string name, string selectedValue)
        {
            string select = "selected='selected'";
            return "<option value='" + value + "' " + (value.Equals(selectedValue) ? select : "") + ">" + name + "</option>";
        }

        private XmlNodeList getFormControls(String formId)
        {
            XmlDocument doc = formService.selectFormDefineDoc(formId);
            XmlNode contentNode = doc.SelectSingleNode("//sheets/sheet/div/div");
            XmlNodeList controls = contentNode.SelectNodes(".//*[@type]");
            return controls;
        }

        private void getFormDefine()
        {
            if (Request.Params["FormsId"] != null && Request.Params["FormsId"].Length != 0)
            {
                try
                {
                    // 获取表单定义XML
                    xmlReturn = formService.selectFormsDefineDoc(Request.Params["FormsId"].ToString().Trim());
                    //Element e = (Element)xmlData.selectSingleNode("RAD/Doc/Data/sheets/sheet");
                    //e.addAttribute("id", request.getParameter("FormId"));
                }
                catch (Exception ex)
                {
                    //String detailLog = "加载ID为【" + request.getParameter("FormId") + "】的表单";
                    xmlReturn = SysFunction.getXmlDocWithResult("1", ex.Message);
                }
                finally
                {
                    xmlReturn.Save(Response.OutputStream);
                }
            }
        }

        private void upDate()
        {
		    if (Request.Params["OperationSign"] != null && Request.Params["OperationSign"].Length != 0) {
                string op = Request.Params["OperationSign"].ToString().Trim();
			    if (op == "3") {
				    if (Request.Params["FormId"] != null && Request.Params["FormId"].Length != 0) {
					    string formName = formService.getWebFormName(Request.Params["FormId"].ToString().Trim());
                        //string DetailLog = "删除名称为【" + formName + "】的表单";
				    }
			    } else {
				    xmlData.Load(Request.InputStream);

				    // 新修改
				    if (op == "1") {
					    List<String> formId = formService.insertFormDefine_New(xmlData, null);
					    StringBuilder sb = new StringBuilder();
					    foreach (string str in formId) {
						    sb.Append(str).Append(";");
					    }

					    xmlReturn = SysFunction.getXmlDocWithResult("0",sb.ToString());

                        xmlReturn.Save(Response.OutputStream);
				    } else if (op == "2") {
					    // 更新表单
					    if (xmlData.SelectNodes(".//DataSet/DataTable").Count != 0 && isDsNameAlreadyExist(xmlData.SelectSingleNode("RAD/Doc/Data/Form/DataSet"))) {
                            xmlReturn = SysFunction.getXmlDocWithResult("1", "所填的数据集名称已存在，请重新命名 ！");
					    }

                        string operSign = formService.updateFormDefine(xmlData.DocumentElement, null);

                        if (operSign == "")
                        {
                            //string DetailLog = "更新名称为【" + formName + "】的【表单定义】";
					    } else {
                            //string DetailLog = "更新名称为【" + formName + "】的【表单定义】";
                            xmlReturn = SysFunction.getXmlDocWithResult("1", "更新表单定义失败！");
					    }

                        xmlReturn.Save(Response.OutputStream);
				    }
			    }
		    }
        }

        private bool isDsNameAlreadyExist(XmlNode xnDataSet) {
		    string dsName = xnDataSet.Attributes["Name"].Value;
		    DataTable dtDataset = datasetService.GetAllDsName();
		    if (xnDataSet.Attributes["DbId"].Value == "") {
			    foreach (DataRow dr in dtDataset.Rows) {
				    if (dsName == dr["F_NAME"].ToString()) {
					    return true;
				    }
			    }
		    } else {
			    foreach (DataRow dr in dtDataset.Rows) {
                    if (!(dr["F_ID"].ToString() == xnDataSet.Attributes["DbId"].Value) && dsName == dr["F_NAME"].ToString())
                    {
					    return true;
				    }
			    }
		    }
		    return false;
	    }
    }
}
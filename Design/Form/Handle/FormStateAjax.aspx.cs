using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Xml;
using RAD.Form.Model;
using RAD.Common;
using RAD.Component.Model.SysAdmin;
using RAD.Form.Bussiness;
using RAD.Form.Model.Enumerations;
using Newtonsoft.Json.Linq;
using Newtonsoft.Json;

namespace FrameWorkPage.Application.Design.Form.Handle
{
    public partial class FormStateAjax : PageBase
    {
        private string operType;    //跳转到此页面的标记位
        private XmlDocument xmlData = new XmlDocument();
        private XmlDocument xmlReturn = new XmlDocument();
        private FormStateService formStateService = new FormStateService();

        protected void Page_Load(object sender, EventArgs e)
        {
            try
            {
                //加载xml
                Response.Clear();
                Response.ContentType = "Text/Xml";

                if (Request.Params["operType"] != null && Request.Params["operType"].Length != 0)
                {
                    operType = Request.Params["operType"].ToString().Trim();

                    switch (operType)
                    {
                        case "saveFormState"://保存表单状态定义
                            saveFormState();
                            break;
                        case "deleteStates"://删除表单状态
                            deleteStates();
                            break;
                        case "getFormStatesByForm":
                            getFormStatesByForm();
                            break;
                        case "updateFormState":
                            updateFormState();
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

        private void saveFormState()
        {
            string formId = Request.Params["formId"].ToString().Trim();
            string stateName = Request.Params["stateName"].ToString().Trim();
            bool exist = formStateService.IsNameExist(stateName);
            if (exist)
            {
                Response.Write("状态名称已经存在");
                return;
            }

            string data = Request.Params["data"].ToString().Trim();
            FormState formState = parseFormState(formId, stateName, data);
            formStateService.InsertFormState(formState);
            Response.Write("true");
        }

        private FormState parseFormState(string formId, string stateName, string data)
        {
            FormState formState = new FormState(int.Parse(formId), stateName);
            BaseUserObject user = (BaseUserObject)Session[DataCommon.LoginedUserKey];
            if (user != null)
            {
                formState.CreaterId = user.Id;
                formState.CreaterName = user.Name;
            }

            JObject javascript = (JObject)JavaScriptConvert.DeserializeObject(data);
           JToken t= javascript.First;
            JArray json = (JArray)javascript["rows"];
            for (int j = 0; j < json.Count; j++)
            {
                JObject jsonobj = (JObject)json[j];
                string name = ((Newtonsoft.Json.Linq.JProperty)(jsonobj.First)).Name;
                string value = (((Newtonsoft.Json.Linq.JValue)(jsonobj.First).Last)).Value.ToString();
                formState.Controls.Add(name, (EnumControlStateType)(Enum.Parse(typeof(EnumControlStateType), value)));
            }
            //JSONObject json = JSONObject.fromObject(data);
            //List<Dictionary<string, string>> controls = (List<Dictionary<string, string>>)json.getJSONArray("rows");
            //foreach (Dictionary<string, string> map in controls)
            //{
            //    foreach (KeyValuePair<string, string> dic in map)
            //    {
            //        string cid = dic.Key;
            //        string state = dic.Value;
            //        formState.Controls.Add(cid, EnumControlStateType.valueOf(state));
            //    }
            //    //while (iter.hasNext()) {
            //    //    Entry<string, string> next = iter.next();
            //    //    string cid = next.getKey();
            //    //    string state = next.getValue();
            //    //    formState.addControl(cid, EnumControlStateType.valueOf(state));
            //    //}
            //}
            return formState;
        }

        private void deleteStates()
        {
            string idStr = Request.Params["id"].ToString().Trim();
            string[] arr = idStr.Split(',');
            List<int> stateId = new List<int>();
            foreach (string id in arr)
            {
                stateId.Add(int.Parse(id));
            }
            if (stateId.Count != 0)
            {
                formStateService.DeleteFormState(stateId);
            }
            Response.Write("true");
        }

        private void getFormStatesByForm()
        {
            int formId = int.Parse(Request.Params["formId"].ToString().Trim());
            List<FormState> states = formStateService.GetFormStates(formId);
            //JSONArray arr = new JSONArray();
            List<Dictionary<string, string>> states_New = new List<Dictionary<string, string>>();
            foreach (FormState state in states)
            {
                Dictionary<string, string> map = toMap(state);
                states_New.Add(map);
            }
            string result = "{\"rows\" : " + SysFunction.Json(states_New) + "}";
            //HttpServletResponse response = getResponse();
            //response.setContentType("text/json");
            //response.getWriter().print(result);
            Response.ContentType = "text/json";
            Response.Write(result);
        }

        private Dictionary<String, String> toMap(FormState state)
        {
            Dictionary<String, String> map = new Dictionary<String, String>();
            map.Add("id", state.Id + "");
            map.Add("name", state.Name);
            map.Add("createrName", state.CreaterName);
            map.Add("createDate", SysFunction.formatDate(state.CreateDate, "yyyy-MM-dd HH:mm:ss"));
            map.Add("modifierName", state.ModifierName == null ? "" : state.ModifierName);
            map.Add("modifyDate", state.ModifyDate == null ? "" : SysFunction.formatDate(state.ModifyDate, "yyyy-MM-dd HH:mm:ss"));
            map.Add("op", "<input type='button' value='编辑' onclick='update(\"" + state.Id + "\", " + state.FormId + ")' />");
            return map;
        }

        private void updateFormState()
        {
            string stateIdStr = Request.Params["stateId"].ToString().Trim();
            string data = Request.Params["data"].ToString().Trim();
            string formId = Request.Params["formId"].ToString().Trim();
            string stateName = Request.Params["stateName"].ToString().Trim();
            int stateId = int.Parse(stateIdStr);
            FormState state = formStateService.getById(stateId);
            BaseUserObject user = (BaseUserObject)Session[DataCommon.LoginedUserKey];
            if (user != null)
            {
                state.ModifierId = user.Id;
                state.ModifierName = user.Name;
            }
            FormState formState = parseFormState(formId, stateName, data);
            state.Id = stateId;
            state.Name = formState.Name;
            state.Controls = formState.Controls;
            formStateService.UpdateFormState(state);
            Response.Write(true);
        }
    }
}
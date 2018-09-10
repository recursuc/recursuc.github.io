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
using System.Xml;
using System.Transactions;

using RAD.Common;
using RAD.Component.Model.SysAdmin;

namespace ReportSystem.Application.Design.Form.Handle
{
    public partial class run_form_handler : PageBase
    {
        private string operType;//跳转到此页面的标记位 1:根据FORM的ID获得XML对象 2:获得XML保存数据
        RAD.Form.Bussiness.FormService formClient = new RAD.Form.Bussiness.FormService();
        RAD.Component.Bussiness.LogService logClient = new RAD.Component.Bussiness.LogService();

        protected void Page_Load(object sender, EventArgs e)
        {
            try
            {
                //加载xml
                Response.Clear();
                Response.ContentType = "Text/Xml";
                XmlDocument xmlDel = new XmlDocument();

                if (HttpContext.Current.Request.Params["OperType"] != null && HttpContext.Current.Request.Params["OperType"].Length != 0)
                {
                    operType = HttpContext.Current.Request.Params["OperType"].ToString();

                    BaseUserObject user = DataCommon.GetLoginedUser(this.Session).BaseUser;

                    if (user == null)
                    {
                        xmlDel = SysFunction.getXmlDocWithResult(operType, "登陆超时");
                        xmlDel.Save(Response.OutputStream);
                        return;
                    }

                    formClient.AddSysConfig("TenentConnStr", "");
                    formClient.AddSysConfig("PlateConnStr", DataCommon.DefaultConnectionString);

                    logClient.AddSysConfig("TenentConnStr", "");
                    logClient.AddSysConfig("PlateConnStr", DataCommon.DefaultConnectionString);

                    //点击修改时过来加载数据
                    if (operType == "1")
                    {
                        //数据扭转获取XML
                        if (HttpContext.Current.Request.Params["FormId"] != null && HttpContext.Current.Request.Params["FormId"].Length != 0)
                        {

                            try
                            {
                                if (HttpContext.Current.Request.Params["DataKey"].ToString() == "")
                                {
                                    if (HttpContext.Current.Request.Params["FormState"].ToString() == "")
                                    {
                                        xmlDel = formClient.SelectFormDefine(HttpContext.Current.Request.Params["FormId"].ToString());
                                    }
                                    else
                                    {
                                        xmlDel = SysFunction.XmlElementToXmlDocument(formClient.SelectFormDefine(HttpContext.Current.Request.Params["FormId"].ToString(), HttpContext.Current.Request.Params["FormState"].ToString()));
                                    }
                                }
                                else
                                {
                                    #region 多租户业务系统配置定制

                                    if (HttpContext.Current.Request.Params["FormId"].ToString() == "50")
                                    {
                                        formClient.AddSysConfig("TenentConnStr", DataCommon.DefaultConnectionString);
                                    }

                                    #endregion

                                    if (HttpContext.Current.Request.Params["FormState"].ToString() == "")
                                    {
                                        xmlDel = SysFunction.XmlElementToXmlDocument(formClient.SelectFormData(HttpContext.Current.Request.Params["FormId"].ToString(), HttpContext.Current.Request.Params["DataKey"].ToString()));
                                    }
                                    else
                                    {
                                        xmlDel = SysFunction.XmlElementToXmlDocument(formClient.SelectFormData(HttpContext.Current.Request.Params["FormId"].ToString(), HttpContext.Current.Request.Params["DataKey"].ToString(), HttpContext.Current.Request.Params["FormState"].ToString()));
                                    }
                                }
                            }
                            catch (Exception ex)
                            {
                                string detailLog = "加载ID为【" + HttpContext.Current.Request.Params["FormId"].ToString() + "】的表单";
                                logClient.SetLog(user.Id.ToString(), user.Name, DateTime.Now, "加载表单", detailLog, "加载失败！", 0);

                                xmlDel = SysFunction.getXmlDocWithResult("1", ex.Message);
                            }
                            finally
                            {
                                //返回xml
                                xmlDel.Save(HttpContext.Current.Response.OutputStream);
                            }
                        }
                    }
                    //点击保存获取更新数据
                    else if (operType == "2")
                    {
                        if (HttpContext.Current.Request.Params["OperationSign"] != null && HttpContext.Current.Request.Params["OperationSign"].Length != 0)
                        {
                            string formName = "";//表单名称
                            string formDataKey = "";//表单数据KEY

                            //开启事务
                            TransactionScope transactionScope = new TransactionScope(TransactionScopeOption.Required, SysFunction.GetSysTransactionOptions());

                            try
                            {
                                string newDataKey = "";

                                xmlDel.Load(Request.InputStream);
                                formName = xmlDel.SelectSingleNode("RAD/Doc/Data/Form").Attributes["Name"].Value;

                                if (xmlDel != null)
                                {
                                    if (HttpContext.Current.Request.Params["OperationSign"].ToString() == "1")
                                    {
                                        newDataKey = formClient.InsertFormData(SysFunction.XmlDocumentToXmlElement(xmlDel), user);
                                        formDataKey = newDataKey;

                                        xmlDel = SysFunction.getXmlDocWithResult("0", newDataKey);

                                        string DetailLog = "给名称为【" + formName + "】的表单添加数据KEY为【" + formDataKey + "】的数据";
                                        logClient.SetLog(user.Id.ToString(), user.Name, DateTime.Now, "添加【表单数据】", DetailLog, "添加成功！", 0);
                                    }
                                    else if (HttpContext.Current.Request.Params["OperationSign"].ToString() == "2")
                                    {
                                        #region 多租户业务系统配置定制

                                        if (xmlDel.SelectSingleNode("RAD/Doc/Data/Form").Attributes["DbId"].Value == "50")
                                        {
                                            formClient.AddSysConfig("TenentConnStr", DataCommon.DefaultConnectionString);
                                        }

                                        #endregion

                                        if (HttpContext.Current.Request.Params["DataKey"].ToString() != "" && HttpContext.Current.Request.Params["DataKey"].Length != 0)
                                        {
                                            formDataKey = HttpContext.Current.Request.Params["DataKey"].ToString();
                                            formClient.UpdateFormData(SysFunction.XmlDocumentToXmlElement(xmlDel), user, HttpContext.Current.Request.Params["DataKey"].ToString());

                                            formClient.FormTraceHandle(SysFunction.XmlDocumentToXmlElement(xmlDel), user, HttpContext.Current.Request.Params["DataKey"].ToString());
                                            string DetailLog = "给名称为【" + formName + "】的表单更新数据KEY为【" + formDataKey + "】的数据";
                                            logClient.SetLog(user.Id.ToString(), user.Name, DateTime.Now, "更新【表单数据】", DetailLog, "更新成功！", 0);
                                        }
                                    }
                                }
                                else
                                {
                                    xmlDel = SysFunction.getXmlDocWithResult("1", "数据为空，无法更新！");
                                    string DetailLog = "给名称为【" + formName + "】的表单更新数据KEY为【" + formDataKey + "】的数据";
                                    logClient.SetLog(user.Id.ToString(), user.Name, DateTime.Now, "更新【表单数据】", DetailLog, "更新失败；数据为空，无法更新！", 0);
                                }

                                transactionScope.Complete();
                            }
                            catch (Exception ex)
                            {
                                //开启独立事务
                                TransactionScope transa = new TransactionScope(TransactionScopeOption.RequiresNew, SysFunction.GetSysTransactionOptions());
                                try
                                {
                                    string DetailLog = "给名称为【" + formName + "】的表单更新数据KEY为【" + formDataKey + "】的数据";
                                    logClient.SetLog(user.Id.ToString(), user.Name, DateTime.Now, "更新【表单数据】", DetailLog, "更新失败！", 0);
                                    transa.Complete();
                                }
                                catch (Exception err)
                                { }
                                finally
                                {
                                    transa.Dispose();
                                    xmlDel = SysFunction.getXmlDocWithResult("1", ex.Message);
                                }
                            }
                            finally
                            {
                                transactionScope.Dispose();
                                //返回xml
                                xmlDel.Save(HttpContext.Current.Response.OutputStream);
                            }
                        }
                    }
                }
            }
            catch (Exception err)
            { }
            finally
            {
                //formClient.Close();
                //logClient.Close();
            }
        }
    }
}

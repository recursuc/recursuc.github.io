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
        private string operType;//��ת����ҳ��ı��λ 1:����FORM��ID���XML���� 2:���XML��������
        RAD.Form.Bussiness.FormService formClient = new RAD.Form.Bussiness.FormService();
        RAD.Component.Bussiness.LogService logClient = new RAD.Component.Bussiness.LogService();

        protected void Page_Load(object sender, EventArgs e)
        {
            try
            {
                //����xml
                Response.Clear();
                Response.ContentType = "Text/Xml";
                XmlDocument xmlDel = new XmlDocument();

                if (HttpContext.Current.Request.Params["OperType"] != null && HttpContext.Current.Request.Params["OperType"].Length != 0)
                {
                    operType = HttpContext.Current.Request.Params["OperType"].ToString();

                    BaseUserObject user = DataCommon.GetLoginedUser(this.Session).BaseUser;

                    if (user == null)
                    {
                        xmlDel = SysFunction.getXmlDocWithResult(operType, "��½��ʱ");
                        xmlDel.Save(Response.OutputStream);
                        return;
                    }

                    formClient.AddSysConfig("TenentConnStr", "");
                    formClient.AddSysConfig("PlateConnStr", DataCommon.DefaultConnectionString);

                    logClient.AddSysConfig("TenentConnStr", "");
                    logClient.AddSysConfig("PlateConnStr", DataCommon.DefaultConnectionString);

                    //����޸�ʱ������������
                    if (operType == "1")
                    {
                        //����Ťת��ȡXML
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
                                    #region ���⻧ҵ��ϵͳ���ö���

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
                                string detailLog = "����IDΪ��" + HttpContext.Current.Request.Params["FormId"].ToString() + "���ı�";
                                logClient.SetLog(user.Id.ToString(), user.Name, DateTime.Now, "���ر�", detailLog, "����ʧ�ܣ�", 0);

                                xmlDel = SysFunction.getXmlDocWithResult("1", ex.Message);
                            }
                            finally
                            {
                                //����xml
                                xmlDel.Save(HttpContext.Current.Response.OutputStream);
                            }
                        }
                    }
                    //��������ȡ��������
                    else if (operType == "2")
                    {
                        if (HttpContext.Current.Request.Params["OperationSign"] != null && HttpContext.Current.Request.Params["OperationSign"].Length != 0)
                        {
                            string formName = "";//������
                            string formDataKey = "";//������KEY

                            //��������
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

                                        string DetailLog = "������Ϊ��" + formName + "���ı��������KEYΪ��" + formDataKey + "��������";
                                        logClient.SetLog(user.Id.ToString(), user.Name, DateTime.Now, "��ӡ������ݡ�", DetailLog, "��ӳɹ���", 0);
                                    }
                                    else if (HttpContext.Current.Request.Params["OperationSign"].ToString() == "2")
                                    {
                                        #region ���⻧ҵ��ϵͳ���ö���

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
                                            string DetailLog = "������Ϊ��" + formName + "���ı���������KEYΪ��" + formDataKey + "��������";
                                            logClient.SetLog(user.Id.ToString(), user.Name, DateTime.Now, "���¡������ݡ�", DetailLog, "���³ɹ���", 0);
                                        }
                                    }
                                }
                                else
                                {
                                    xmlDel = SysFunction.getXmlDocWithResult("1", "����Ϊ�գ��޷����£�");
                                    string DetailLog = "������Ϊ��" + formName + "���ı���������KEYΪ��" + formDataKey + "��������";
                                    logClient.SetLog(user.Id.ToString(), user.Name, DateTime.Now, "���¡������ݡ�", DetailLog, "����ʧ�ܣ�����Ϊ�գ��޷����£�", 0);
                                }

                                transactionScope.Complete();
                            }
                            catch (Exception ex)
                            {
                                //������������
                                TransactionScope transa = new TransactionScope(TransactionScopeOption.RequiresNew, SysFunction.GetSysTransactionOptions());
                                try
                                {
                                    string DetailLog = "������Ϊ��" + formName + "���ı���������KEYΪ��" + formDataKey + "��������";
                                    logClient.SetLog(user.Id.ToString(), user.Name, DateTime.Now, "���¡������ݡ�", DetailLog, "����ʧ�ܣ�", 0);
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
                                //����xml
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

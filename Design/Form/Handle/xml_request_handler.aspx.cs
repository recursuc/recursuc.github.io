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
using System.Xml.Linq;

using RAD.Common;
using RAD.Form.Model;
using RAD.Component.Model.SysAdmin;

namespace ReportSystem.Application.Design.Form.Handle
{
    public partial class xml_request_handler : PageBase
    {
        private string operType;//跳转到此页面的标记位 1:根据FORM的ID获得XML对象 2:获得XML保存数据
        RAD.Form.Bussiness.FormService formClient = new RAD.Form.Bussiness.FormService();
        RAD.Component.Bussiness.DataSetService dsClient = new RAD.Component.Bussiness.DataSetService();
        RAD.Component.Bussiness.LogService logClient = new RAD.Component.Bussiness.LogService();

        /// <summary>
        /// 根据表单ID获取表单XML对象
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        protected void Page_Load(object sender, EventArgs e)
        {
            try
            {
                //加载xml
                Response.Clear();
                Response.ContentType = "Text/Xml";
                XmlDocument xmlData = new XmlDocument();
                XmlDocument xmlReturn = new XmlDocument();

                //string operType = xmlData.SelectSingleNode("RAD/Doc/Operation").Attributes["OperType"].Value;       //获得操作标识

                if (Request.Params["OperType"] != null && Request.Params["OperType"].Length != 0)
                {
                    operType = Request.Params["OperType"].ToString();

                    #region 判断用户对象

                    //BaseUserObject currUser = new BaseUserObject();

                    ////判定是页面传递的还是构建工具传递的
                    //if (Request.Params["RoleName"] != null && Request.Params["RoleName"] != "")
                    //{
                    //    currUser.Id = 2;
                    //    currUser.Name = "AppUser";
                    //}
                    //else
                    //{
                    //    currUser = DataCommon.GetLoginedUser(this.Session).BaseUser;
                    //}

                    //if (currUser == null)
                    //{
                    //    xmlData = SysFunction.getXmlDocWithResult(operType, "登陆超时！");
                    //    xmlData.Save(Response.OutputStream);
                    //    return;
                    //}

                    formClient.AddSysConfig("TenentConnStr", "");
                    formClient.AddSysConfig("PlateConnStr", DataCommon.DefaultConnectionString);

                    dsClient.AddSysConfig("TenentConnStr", "");
                    dsClient.AddSysConfig("PlateConnStr", DataCommon.DefaultConnectionString);

                    logClient.AddSysConfig("TenentConnStr", "");
                    logClient.AddSysConfig("PlateConnStr", DataCommon.DefaultConnectionString);

                    #endregion

                    //根据FORM的ID获得XML对象
                    if (operType == "1")
                    {
                        if (Request.Params["FormId"] != null && Request.Params["FormId"].Length != 0)
                        {
                            try
                            {
                                //获取表单定义XML
                                xmlData = formClient.SelectFormDefineDoc(Request.Params["FormId"].ToString());
                                xmlData.SelectSingleNode("RAD/Doc/Data/sheets/sheet").Attributes["id"].Value = Request.Params["FormId"].ToString();
                            }
                            catch (Exception ex)
                            {
                                string detailLog = "加载ID为【" + Request.Params["FormId"] + "】的表单";
                                //logClient.SetLog(currUser.Id.ToString(), currUser.Name, DateTime.Now, "加载表单", detailLog, "加载失败！", 0);
                                xmlData = SysFunction.getXmlDocWithResult("1", ex.Message);
                            }
                            finally
                            {
                                //返回表单定义xml
                                xmlData.Save(Response.OutputStream);
                            }
                        }
                    }
                    else if (operType == "2")
                    {
                        string formName = "";//表单名称

                        //开启事务
                        TransactionScope transactionScope = new TransactionScope(TransactionScopeOption.Required, SysFunction.GetSysTransactionOptions());

                        try
                        {
                            if (xmlData != null)
                            {
                                if (Request.Params["OperationSign"] != null && Request.Params["OperationSign"] != "")
                                {
                                    if (Request.Params["OperationSign"].ToString() == "3")
                                    {
                                        if (Request.Params["FormId"] != null && Request.Params["FormId"].Length != 0)
                                        {
                                            formName = formClient.GetWebFormName(Request.Params["FormId"].ToString());
                                            //formClient.DeleteFormDefine(Request.Params["FormId"].ToString(), currUser);

                                            string DetailLog = "删除名称为【" + formName + "】的表单";
                                            //logClient.SetLog(currUser.Id.ToString(), currUser.Name, DateTime.Now, "删除表单", DetailLog, "删除成功！", 0);
                                        }
                                    }
                                    else
                                    {
                                        xmlData.Load(Request.InputStream);

                                        //formName = xmlData.SelectSingleNode("RAD/Doc/Data/Form").Attributes["Name"].Value;//获得表单名称
                                        if (Request.Params["OperationSign"].ToString() == "1")
                                        {
                                            string formId = formClient.InsertFormDefine_New(xmlData, null);

                                            xmlReturn = SysFunction.getXmlDocWithResult("0", formId);

                                            xmlReturn.Save(Response.OutputStream);
                                        }
                                        else if (Request.Params["OperationSign"].ToString() == "2")
                                        {
                                            //更新表单
                                            if (xmlData.SelectNodes(".//DataSet/DataTable").Count != 0 && IsDsNameAlreadyExist(xmlData.SelectSingleNode("RAD/Doc/Data/Form/DataSet")))
                                            {
                                                xmlData = SysFunction.getXmlDocWithResult("1", "所填的数据集名称已存在，请重新命名 ！");
                                                return;
                                            }

                                            string operSign = formClient.UpdateFormDefine(SysFunction.XmlDocumentToXmlElement(xmlData), null);

                                            if (operSign == "")
                                            {
                                                string DetailLog = "更新名称为【" + formName + "】的【表单定义】";
                                                //logClient.SetLog(currUser.Id.ToString(), currUser.Name, DateTime.Now, "更新【表单定义】", DetailLog, "更新成功！", 0);
                                            }
                                            else
                                            {
                                                string DetailLog = "更新名称为【" + formName + "】的【表单定义】";
                                                //logClient.SetLog(currUser.Id.ToString(), currUser.Name, DateTime.Now, "更新【表单定义】", DetailLog, "更新失败！", 0);
                                                xmlData = SysFunction.getXmlDocWithResult("1", "更新表单定义失败！");
                                                return;
                                            }
                                        }
                                    }
                                }
                            }
                            else
                            {
                                xmlData = SysFunction.getXmlDocWithResult("1", "数据为空，无法更新！");
                                return;
                            }
                            transactionScope.Complete();
                        }
                        catch (Exception ex)
                        {
                            xmlData = SysFunction.getXmlDocWithResult("1", ex.Message);
                            xmlData.Save(Response.OutputStream);
                        }
                        finally
                        {
                            transactionScope.Dispose();
                            //返回xml
                            //xmlData.Save(Response.OutputStream);
                        }
                    }
                    else if (operType == "6")
                    {
                        xmlReturn = formClient.GetAllBaseFormTabs();
                        xmlReturn.Save(Response.OutputStream);
                    }
                }
            }
            catch (Exception ex) { }
            finally
            {
                //formClient.Close();
                //dsClient.Close();
                ////logClient.Close();
            }
        }

        private bool IsDsNameAlreadyExist(XmlNode xnDataSet)
        {
            string dsName = xnDataSet.Attributes["Name"].Value;
            DataTable dtDataset = dsClient.GetAllDsName();

            if (xnDataSet.Attributes["DbId"].Value == "")
            {
                foreach (DataRow dr in dtDataset.Rows)
                {
                    if (dsName == dr["F_NAME"].ToString())
                    {
                        return true;
                    }
                }
            }
            else
            {
                foreach (DataRow dr in dtDataset.Rows)
                {
                    if (dr["F_ID"].ToString() != xnDataSet.Attributes["DbId"].Value && dsName == dr["F_NAME"].ToString())
                    {
                        return true;
                    }
                }
            }
            return false;
        }
    }
}
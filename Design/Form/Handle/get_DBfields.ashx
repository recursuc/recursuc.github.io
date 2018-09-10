<%@ WebHandler Language="C#" Class="get_DBfields" %>

using System;
using System.Web;
using System.Data;
using System.Data.OracleClient;
using System.Web.SessionState;

public class get_DBfields : PageBase, IHttpHandler, IReadOnlySessionState
{
    RAD.Component.Bussiness.DataSetService dataSetClient = new RAD.Component.Bussiness.DataSetService();

    public void ProcessRequest(HttpContext context)
    {
        context.Response.ContentType = "text/plain";
        try
        {
            // 获取参数
            string strUserName = "";
            if (context.Request["userName"] != null)
                strUserName = context.Request["userName"].ToString();
            else
                return;
            string strTableName = "";
            if (context.Request["tableName"] != null)
                strTableName = context.Request["tableName"].ToString();

            string Tablecontent = "";
            string Selectcontent = "";
            string retXMLString = "";
            dataSetClient.AddSysConfig("TenentConnStr", "");
            dataSetClient.AddSysConfig("PlateConnStr", DataCommon.DefaultConnectionString);
                try
                {
                    DataTable dtCon = new DataTable();
                    dtCon = dataSetClient.GetTableColumnsByName(strTableName.ToUpper());
                    for (int i = 0; i < dtCon.Rows.Count; i++)
                    {
                        Tablecontent += "<tr id=\"Row_" + dtCon.Rows[i][0].ToString() + "\"><td><input id=\"chk_" + dtCon.Rows[i][0].ToString() + "\" type=\"checkbox\" name=\"selectfield\" value=\"" + dtCon.Rows[i][0].ToString() + "\" onclick=\"GetValidField(this)\" AnotherName=\"" + dtCon.Rows[i][0].ToString() + "\" /></td><td>" + dtCon.Rows[i][0].ToString() + "</td><td></td><td>" + dtCon.Rows[i][1].ToString() + "</td><td>" + dtCon.Rows[i][2].ToString() + "</td></tr>";
                        Selectcontent += "<option value = \"" + dtCon.Rows[i][0].ToString() + "\">" + dtCon.Rows[i][0].ToString() + "</option>";
                    }
                    retXMLString = "<root><tbody>" + Tablecontent + "</tbody><select>" + Selectcontent + "</select></root>";
                }
                catch (Exception ex)
                {
                    throw ex;
                }
            
            context.Response.Write(retXMLString);
        }
        catch (Exception err)
        {
            context.Response.Write("");
        }
    }

    public bool IsReusable
    {
        get
        {
            return false;
        }
    }
}
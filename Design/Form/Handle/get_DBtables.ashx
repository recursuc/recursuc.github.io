<%@ WebHandler Language="C#" Class="get_DBtables" %>

using System;
using System.Web;
using System.Data;
using System.Data.OracleClient;
using System.Web.SessionState;

public class get_DBtables : PageBase, IHttpHandler, IReadOnlySessionState
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

            string content = "";
            dataSetClient.AddSysConfig("TenentConnStr", "");
            dataSetClient.AddSysConfig("PlateConnStr", DataCommon.DefaultConnectionString);
            try
            {
                DataTable dtCon = new DataTable();
                dtCon = dataSetClient.GetTablesByName();
                for (int i = 0; i < dtCon.Rows.Count; i++)
                {
                    content += dtCon.Rows[i][0].ToString() + ";";
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }

            context.Response.Write(content);
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
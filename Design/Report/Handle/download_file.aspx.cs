using System;
using System.Collections.Generic;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Text;
using System.IO;

using RAD.Core.Common;

namespace ReportSystem.Application.Design.Report.Handle
{
    public partial class download_file : System.Web.UI.Page
    {
        public string filePath = "";//文件路径
        public string fileName = "";//文件名称

        protected void Page_Load(object sender, EventArgs e)
        {
            if (Request.Params["filePath"] != null)
            {
                filePath = Server.UrlDecode(Request.Params["filePath"].ToString());

                if (Request.Params["fileName"] != null)
                {
                    fileName = Request.Params["fileName"].ToString();
                }

                DownLoadFile();
            }
        }

        #region 下载文件
        /// <summary>
        /// 下载文件
        /// </summary>
        /// 
        public void DownLoadFile()
        {
            FileInfo fi = null;
            try
            {
                fi = new FileInfo(filePath);
                if (fi.Length > 0)
                {
                    Response.Clear();
                    Response.ClearHeaders();
                    Response.Charset = "gb2312";
                    Response.BufferOutput = true;
                    Response.AppendHeader("Content-Disposition", "attachment;filename=" + HttpUtility.UrlEncode(Path.GetFileName(filePath), Encoding.UTF8));
                    Response.AppendHeader("Content-Length", fi.Length.ToString());
                    Response.ContentType = "application/octet-stream";
                    Response.WriteFile(filePath);
                    Response.Flush();
                    Response.Close();
                }
            }
            catch (Exception ex)
            {
                Response.Write("<script type='text/javascript'>alert('获取下载信息失败，请尝试重新下载！');</script>");
            }
        }
        #region 废弃
        //public void DownLoadFile()
        //{
        //    //文件名
        //    if (fileName == "")
        //    {
        //        fileName = filePath.Substring(filePath.LastIndexOf("\\") + 1);
        //    }

        //    //获取文件后缀名
        //    string postfix = fileName.Substring(fileName.LastIndexOf(".")).ToLower();

        //    //读取服务器文件
        //    FileStream fs = new FileStream(filePath, FileMode.Open, FileAccess.Read);
        //    BinaryReader br = new BinaryReader(fs);
        //    try
        //    {
        //        byte[] br1 = br.ReadBytes((int)fs.Length);
        //        if (br1.Length != 0)
        //        {
        //            Response.Clear();
        //            Response.BufferOutput = true;
        //            Response.AddFileDependency(fileName);
        //            Response.AppendHeader("Content-Disposition", "attachment;filename=" + HttpUtility.UrlEncode(fileName, Encoding.UTF8));
        //            Response.ContentType = SysFunction.GetContentType(postfix);
        //            Response.OutputStream.Write(br1, 0, br1.Length);
        //            Response.Write(">");
        //            Response.Flush();
        //            Response.Close();
        //        }
        //    }
        //    catch (Exception ex)
        //    {
        //        Response.Write("<script type='text/javascript'>alert('获取下载信息失败，请尝试重新下载！');</script>");
        //    }
        //    finally
        //    {
        //        fs.Dispose();
        //        fs.Close();
        //        br.Close();
        //    }
        //}
        #endregion
        #endregion
    }
}

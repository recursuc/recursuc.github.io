using System;
using System.Collections.Generic;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.IO;
using System.Text;

namespace ReportSystem.Application.Design.Form.Handle
{
    public partial class downLoad : System.Web.UI.Page
    {
        #region 成员变量
        public string filePath = "";//文件路径
        #endregion

        #region 加载页面
        /// <summary>
        /// 加载页面
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        protected void Page_Load(object sender, EventArgs e)
        {
            filePath = Request.Params["filePath"].ToString();
            DownLoadFile(filePath);
        }
        #endregion

        #region 下载文件
        /// <summary>
        /// 下载文件
        /// </summary>
        /// <param name="filePath">文件路径</param>
        public void DownLoadFile(string filePath)
        {
            //文件名
            string filename = filePath.Substring(filePath.LastIndexOf("\\") + 1);
            //获取文件后缀名
            string strPostfix = filePath.Substring(filePath.LastIndexOf("."));
            if (strPostfix == ".xml")
            {
                //读取服务器文件
                FileStream fs = new FileStream(filePath, FileMode.Open, FileAccess.Read);
                BinaryReader br = new BinaryReader(fs);
                try
                {
                    byte[] br1 = br.ReadBytes((int)fs.Length);

                    if (br1.Length != 0)
                    {
                        Response.Clear();
                        Response.BufferOutput = true;
                        Response.AddFileDependency(filename);
                        Response.AppendHeader("Content-Disposition", "attachment;filename=" + HttpUtility.UrlEncode(filename, Encoding.UTF8));
                        Response.ContentType = "application/octet-stream";
                        Response.OutputStream.Write(br1, 0, br1.Length);
                        Response.Flush();
                        Response.Close();
                    }
                    
                }
                catch (Exception ex)
                {
                    Response.Write("<script type='text/javascript'>alert('获取下载信息失败，请尝试重新下载！');</script>");
                }
                finally
                {
                    fs.Dispose();
                    fs.Close();
                    br.Close();
                    //删除服务器中的当前文件
                    File.Delete(filePath);
                }
            }
        }
        #endregion
    }
}

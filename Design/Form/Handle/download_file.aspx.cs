using System;
using System.Collections.Generic;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Text;
using System.IO;

using RAD.Common;
using RAD.Form.Model;


namespace ReportSystem.Application.Design.Form.Handle
{
    public partial class download_file : PageBase
    {
        public string filePath = "";//文件路径
        public string fileName = "";//文件名称
        public string PathClass = "";//路径类型
        public int fileId ;//文件ID
        public string SaveMode = "";//保存数据模式
        public string AttachTable = "";//存储物理表空间

        protected void Page_Load(object sender, EventArgs e)
        {
            if (Request.Params["filePath"] != null)
            {
                filePath = Request.Params["filePath"].ToString();

                if (Request.Params["fileName"] != null)
                {
                    fileName = Request.Params["fileName"].ToString();
                }
                if (Request.Params["PathClass"] != null)
                {
                    PathClass = Request.Params["PathClass"].ToString();
                }
                if (Request.Params["fileId"] != null && Request.Params["fileId"] !="")
                {
                    fileId =Convert.ToInt32(Request.Params["fileId"].ToString());
                }
                if (Request.Params["SaveMode"] != null)
                {
                    SaveMode = Request.Params["SaveMode"].ToString();
                }
                if (Request.Params["attachTable"] != null)
                {
                    AttachTable = Request.Params["attachTable"].ToString();
                }
                if (SaveMode != "Database")
                {
                    DownLoadFile();
                }
                else
                {
                    DownLoadFileForDatabase(fileId, AttachTable);
                }
            }
        }

        #region 下载文件
        /// <summary>
        /// 下载文件
        /// </summary>
        public void DownLoadFile()
        {
            //文件名
            if (fileName == "")
            {
                fileName = filePath.Substring(filePath.LastIndexOf("\\") + 1);
            }

            //获取文件后缀名
            string postfix = fileName.Substring(fileName.LastIndexOf(".")).ToLower();
            string fileFullName = filePath;
            //读取服务器文件
            if (PathClass == "1")
            {
                fileFullName = Server.MapPath("~/") + filePath;
            }
            FileStream fs = new FileStream(fileFullName, FileMode.Open, FileAccess.Read);
            BinaryReader br = new BinaryReader(fs);
            try
            {
                byte[] br1 = br.ReadBytes((int)fs.Length);

                if (br1.Length != 0)
                {
                    Response.Clear();
                    Response.BufferOutput = true;
                    Response.AddFileDependency(fileName);
                    Response.AppendHeader("Content-Disposition", "attachment;filename=" + HttpUtility.UrlEncode(fileName, Encoding.UTF8));
                    Response.ContentType = SysFunction.GetContentType(postfix);
                    Response.OutputStream.Write(br1, 0, br1.Length);
                    Response.Flush();
                    //Response.End();
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
            }
        }
        #endregion

        #region 从数据库下载文件

        public void DownLoadFileForDatabase(int fileId, string AttachTable)
        {
            ControlUpLoad controlUpload = new ControlUpLoad {
                AttachTable = AttachTable,
                Id = fileId
            };
            FormAttachment formAttachment = new FormAttachment(); ;//= GetService<IFormRepository>().GetFormAttachment(controlUpload);

            //文件名
            if (fileName == "")
            {
                fileName = filePath.Substring(filePath.LastIndexOf("\\") + 1);
            }

            //获取文件后缀名
            string postfix = fileName.Substring(fileName.LastIndexOf(".")).ToLower();
            try
            {
                if (formAttachment.Content != null)
                {
                    if (formAttachment.Content.Length != 0)
                    {
                        Response.Clear();
                        Response.BufferOutput = true;
                        Response.AddFileDependency(fileName);
                        Response.AppendHeader("Content-Disposition", "attachment;filename=" + HttpUtility.UrlEncode(fileName, Encoding.UTF8));
                        Response.ContentType = SysFunction.GetContentType(postfix);
                        Response.OutputStream.Write(formAttachment.Content, 0, formAttachment.Content.Length);
                        Response.Flush();
                        //Response.End();
                        Response.Close();
                    }
                }
                else
                {
                    Response.Write("<script type='text/javascript'>alert('该控件为只上传到数据库，且该文件尚未上传到数据库！');</script>");
                }
            }
            catch (Exception ex)
            {
                Response.Write("<script type='text/javascript'>alert('获取下载信息失败，请尝试重新下载！');</script>");
            }
        }

        #endregion
    }
}

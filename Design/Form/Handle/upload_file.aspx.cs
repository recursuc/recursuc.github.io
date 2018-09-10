using System;
using System.Collections.Generic;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.IO;

using RAD.Common;

namespace ReportSystem.Application.Design.Form.Handle
{
    public partial class upload_file : System.Web.UI.Page
    {
        public string FileExtensionCol = "doc|docx|jpg|gif|bmp|txt|mht|rar|ppt|pptx|zip";
        public string FileServerPath = "";
        public string returnValue = "";

        protected void Page_Load(object sender, EventArgs e)
        {
            if (IsPostBack)
            {
                try
                {
                    string PathClass = "";
                    if (Request.Params["PathClass"] != null)
                    {
                        PathClass = Request.Params["PathClass"].ToString();
                    }
                    string FilePath = "";
                    if (Request.Params["FilePath"] != null)
                    {
                        FilePath = Request.Params["FilePath"].ToString();
                    }

                    if (FilePath != "")
                    {
                        FileServerPath = Server.MapPath("~") + "/" + FilePath;
                    }
                    else
                    {
                        FileServerPath = Server.MapPath("~") + "/Application/FormSystem/form/uploadfile";
                    }

                    if (!Directory.Exists(FileServerPath))
                    {
                        Directory.CreateDirectory(FileServerPath);
                    }

                    //把前台的附件上传到服务器
                    for (int i = 0; i < Request.Files.Count; i++)
                    {
                        //获得文件客户端路径
                        string filePath = Request.Files[i].FileName;

                        string filename = filePath.Substring(filePath.LastIndexOf("\\") + 1);
                        string fileExt = filePath.Substring(filePath.LastIndexOf("."));
                        string FileFullName = DateTime.Now.ToString("yyyyMMddHHmmssffff") + SysFunction.FsRandomString(10) + fileExt;
                        string FileServerFullPath = FileServerPath + "\\" + FileFullName;

                        Request.Files[i].SaveAs(FileServerFullPath);
                        //路径类型为相对路径则为1
                        if (PathClass == "1")
                        {
                            FileServerFullPath = "/Application/FormSystem/form/uploadfile" + "\\" + FileFullName;
                        }
                        returnValue += FileServerFullPath + "," + filename + "," + fileExt + ";";
                    }
                    returnValue = returnValue.Replace("/", "【目录】");
                    returnValue = returnValue.Replace("\\", "【目录】");
                    Response.Write("<script type='text/javascript'>window.returnValue='" + returnValue + "';window.close();</script>");
                }
                catch (Exception ex)
                {
                    Response.Write("<script type='text/javascript'>alert('上传失败，请重试！');window.returnValue='';window.close();</script>");
                }
            }
            else
            {
                try
                {
                    if (Request.Params["FileExt"] != null && Request.Params["FileExt"].ToString() != "")
                    {
                        FileExtensionCol = Request.Params["FileExt"].ToString();
                    }
                }
                catch (Exception ex)
                {
                    Response.Write("<script type='text/javascript'>alert('加载失败，请重试！');window.returnValue='';window.close();</script>");
                }
            }
        }
    }
}

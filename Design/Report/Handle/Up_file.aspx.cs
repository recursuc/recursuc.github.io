using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.IO;

namespace ReportSystem.Application.Design.Report.Handle
{
    public partial class Up_File : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {
            string fileName = "";
            try
            {
                if (Request.Files != null)
                {
                    string oldFileName = Request.Params["classFileName"];
                    HttpFileCollection files = Request.Files;

                    for (int i = 0; i < files.Count; i++)
                    {
                        fileName = Request.Params["newClassFileName"];
                        FileInfo fileInfo = new FileInfo(Request.MapPath(@"../customClass/" + oldFileName));
                        if (fileInfo.Exists)
                        {
                            File.Delete(Request.MapPath(@"../customClass/" + oldFileName));
                        }
                        files[i].SaveAs(Request.MapPath(@"../customClass/" + fileName));
                    }
                }

            }
            catch (Exception err)
            {
                throw err;
            }
            Response.Write("<script type=\"text/javascript\">");
            Response.Write(" parent.oldFileName.value ='" + fileName + "'");
            Response.Write("</script>");
        }
    }
}

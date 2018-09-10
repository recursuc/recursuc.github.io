using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.IO;

namespace ReportSystem.Application.Design.Report.Handle
{
    public partial class UP_Xml : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {
            string fileName = "";

            try
            {
                if (Request.Files != null)
                {
                    string oldFileName = Request.Params["oldXmlName"];
                    HttpFileCollection files = Request.Files;

                    for (int i = 0; i < files.Count; i++)
                    {
                        if (files[i].ContentLength <= 0)
                        {
                            continue;
                        }
                        fileName = Request.Params["nowXmlName"];
                        FileInfo fileInfo = new FileInfo(Request.MapPath(@"../xmlFiles/" + oldFileName));
                        if (fileInfo.Exists)
                        {
                            File.Delete(Request.MapPath(@"../xmlFiles/" + oldFileName));
                        }
                        files[i].SaveAs(Request.MapPath(@"../xmlFiles/" + fileName));
                    }
                }

            }
            catch (Exception err)
            {
                throw err;
            }
            Response.Write("<script type=\"text/javascript\">");
            Response.Write("parent.oldXmlFileName.value ='" + fileName + "'");
            Response.Write("</script>");
        }
    }
}

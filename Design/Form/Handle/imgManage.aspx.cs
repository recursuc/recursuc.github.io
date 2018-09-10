using System;
using System.Collections.Generic;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.IO;
using System.Text;
using System.Xml;

namespace ReportSystem.Application.Design.Form.Handle
{
    public partial class imgManage : System.Web.UI.Page
    {
        #region 成员变量

        public string _smallImagesHtml = "";//图片列表HTML
        public string FileServerPath = "";

        #endregion

        #region 成员方法

        #region 加载页面
        /// <summary>
        /// 加载页面
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        protected void Page_Load(object sender, EventArgs e)
        {
            if (Request.Files.Count > 0)
            {
                try
                {
                    //把前台的附件上传到服务器
                    for (int i = 0; i < Request.Files.Count; i++)
                    {
                        UpLoadImageFile(Request.Files[i], "../../sysimages/baseimages/", "../../sysimages/smallimages/", "small_", 80, 80);
                    }
                }
                catch (Exception ex)
                {
                    Response.Write("<script languge='javascript'>alert('" + ex.ToString() + "');</script>");
                }
            }

            GetSmallImageHtml();
        }
        #endregion

        #region 获得图片列表HTML
        /// <summary>
        /// 获得图片列表HTML
        /// </summary>
        public void GetSmallImageHtml()
        {
            try
            {
                //获取系统图片XML
                XmlDocument xmlDoc = new XmlDocument();
                string imagesPath = Server.MapPath("../configfile") + "\\SysImages.xml";
                xmlDoc.Load(imagesPath);

                //拼装展示系统图片的HTML
                StringBuilder sbImagesHtml = new StringBuilder();
                sbImagesHtml.Append("<table id='ImagesTable'>\n");

                //获取图片节点集合
                XmlNodeList xnlImages = xmlDoc.SelectSingleNode("RAD/Images").ChildNodes;
                int tempNum = xnlImages.Count % 5;
                int rowNum = tempNum > 0 ? xnlImages.Count / 5 + 1 : xnlImages.Count / 5; //获得图片列表行数

                for (int rn = 0; rn < rowNum; rn++)
                {
                    sbImagesHtml.Append("<tr>\n");
                    for (int cn = 0; cn < 5; cn++)
                    {
                        sbImagesHtml.Append("<td>\n");
                        if (rn * 5 + cn < xnlImages.Count)
                        {
                            string imageSmallSrc = xnlImages[rn * 5 + cn].Attributes["SmallSrc"].Value;//小图片连接地址
                            string imageBigSrc = xnlImages[rn * 5 + cn].Attributes["BigSrc"].Value;//大图片连接地址
                            string altInf = xnlImages[rn * 5 + cn].Attributes["Alt"].Value;
                            string BigWidth = xnlImages[rn * 5 + cn].Attributes["Width"].Value;
                            string BigHeight = xnlImages[rn * 5 + cn].Attributes["Height"].Value;
                            string imageHtml = "";
                            if (File.Exists(Server.MapPath(imageSmallSrc)))
                            {
                                imageHtml = "<img src='" + imageSmallSrc + "' alt='" + altInf + "' BigSrc='" + imageBigSrc + "' BigWidth='" + BigWidth + "' BigHeight='" + BigHeight + "' RelativeSrc ='" + imageSmallSrc
                                    + "' ondblclick='ImgShow();' style='cursor:hand;' onmousemove='ChangeDivState(this);' onmouseout='ReturnDivState(this);'onmouseup='SelectCurImgObj(this);'/>";
                            }
                            else
                            {
                                imageHtml = "<img src='../../sysimages/smallimages/图片无法显示.jpg' alt='图片无法显示'/>";
                            }
                            sbImagesHtml.Append("<div class='imageDiv'>\n");
                            sbImagesHtml.Append(imageHtml + "\n");
                            sbImagesHtml.Append("</div>\n");
                        }
                        else
                        {
                            sbImagesHtml.Append("\n");
                        }
                        sbImagesHtml.Append("</td>\n");
                    }
                    sbImagesHtml.Append("</tr>\n");
                }

                sbImagesHtml.Append("</table>\n");

                _smallImagesHtml = sbImagesHtml.ToString();
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        #endregion

        #region 上传图片文件并生成缩略图
        /// <summary>
        /// 上传图片文件并生成缩略图
        /// </summary>
        /// <param name="imageFileObj">图片文件</param>
        /// <param name="baseSavePath">原图图保存的路径,些为相对服务器路径的下的文件夹</param>
        /// <param name="smallSavePath">缩略图保存的路径,些为相对服务器路径的下的文件夹</param>
        /// <param name="sThumbExtension">缩略图的thumb</param>
        /// <param name="intThumbWidth">生成缩略图的宽度</param>
        /// <param name="intThumbHeight">生成缩略图的高度</param>
        public void UpLoadImageFile(HttpPostedFile imageFileObj, string baseSavePath, string smallSavePath, string thumbExtension, int intThumbWidth, int intThumbHeight)
        {
            int nFileLen = imageFileObj.ContentLength;//上载文件的大小（以字节为单位）
            if (nFileLen == 0)
            {
                throw new Exception("没有选择上传图片!");
            }

            //获取文件在客户端计算机上的完全路径名(例如"D:\myfiles\lo.txt")
            string fullFileName = imageFileObj.FileName;

            //获取文件的具体文件名（例如"lo.txt")
            string fileName = fullFileName.Substring(fullFileName.LastIndexOf(@"\") + 1);

            //获取文件的扩展名（例如"txt")
            string typeName = (fullFileName.Substring(fullFileName.LastIndexOf(".") + 1)).ToLower();

            //缩略图保存的绝对路径 
            string smallImagePath = "";
            string smallFileName = "";

            //原图宽度和高度 
            int width;
            int height;

            if (typeName == "jpg" || typeName == "bmp" || typeName == "gif" || typeName == "jpeg" || typeName == "png")
            {
                #region 上传原图

                byte[] myData = new Byte[nFileLen];
                imageFileObj.InputStream.Read(myData, 0, nFileLen);

                int fileAppend = 0;
                //检查当前文件夹下是否有同名图片,有则在文件名+1 
                while (System.IO.File.Exists(System.Web.HttpContext.Current.Server.MapPath(baseSavePath + fileName)))
                {
                    fileAppend++;
                    fileName = System.IO.Path.GetFileNameWithoutExtension(fullFileName)
                        + fileAppend.ToString() + '.' + typeName;
                }

                System.IO.FileStream newFile = new System.IO.FileStream(System.Web.HttpContext.Current.Server.MapPath(baseSavePath + fileName), 
                System.IO.FileMode.Create, System.IO.FileAccess.Write); 
                newFile.Write(myData, 0, myData.Length); 
                newFile.Close();
                #endregion

                #region 上传缩略图

                //原图加载 
                using (System.Drawing.Image sourceImage = System.Drawing.Image.FromFile(System.Web.HttpContext.Current.Server.MapPath(baseSavePath + fileName)))
                {
                    //原图宽度和高度 
                    width = sourceImage.Width;
                    height = sourceImage.Height;
                    int smallWidth;
                    int smallHeight;

                    //获取第一张绘制图的大小,(比较 原图的宽/缩略图的宽  和 原图的高/缩略图的高) 
                    if (((decimal)width) / height <= ((decimal)intThumbWidth) / intThumbHeight) 
                    { 
                        smallWidth = intThumbWidth; 
                        smallHeight = intThumbWidth * height / width; 
                    } 
                    else 
                    { 
                        smallWidth = intThumbHeight * width / height; 
                        smallHeight = intThumbHeight; 
                    }

                    //判断缩略图在当前文件夹下是否同名称文件存在 
                    fileAppend = 0;
                    smallFileName = thumbExtension + System.IO.Path.GetFileNameWithoutExtension(fullFileName) + "." + typeName;
                    while (System.IO.File.Exists(System.Web.HttpContext.Current.Server.MapPath(smallSavePath + smallFileName))) 
                    {
                        fileAppend++;
                        smallFileName = thumbExtension + System.IO.Path.GetFileNameWithoutExtension(fullFileName) +
                            fileAppend.ToString() + "." + typeName;
                    }

                    smallImagePath = System.Web.HttpContext.Current.Server.MapPath(smallSavePath) + smallFileName; 

                    //新建一个图板,以最小等比例压缩大小绘制原图 
                    using (System.Drawing.Image bitmap = new System.Drawing.Bitmap(smallWidth, smallHeight))
                    {
                        //绘制中间图 
                        using (System.Drawing.Graphics g = System.Drawing.Graphics.FromImage(bitmap)) 
                        { 
                            //高清,平滑 
                            g.InterpolationMode = System.Drawing.Drawing2D.InterpolationMode.High; 
                            g.SmoothingMode = System.Drawing.Drawing2D.SmoothingMode.HighQuality;
                            g.Clear(System.Drawing.Color.Black); 
                            g.DrawImage( 
                            sourceImage, 
                            new System.Drawing.Rectangle(0, 0, smallWidth, smallHeight), 
                            new System.Drawing.Rectangle(0, 0, width, height), 
                            System.Drawing.GraphicsUnit.Pixel 
                            ); 
                        }

                        //新建一个图板,以缩略图大小绘制中间图 
                        using (System.Drawing.Image bitmap1 = new System.Drawing.Bitmap(intThumbWidth, intThumbHeight)) 
                        { 
                            //绘制缩略图 
                            using (System.Drawing.Graphics g = System.Drawing.Graphics.FromImage(bitmap1)) 
                            { 
                                //高清,平滑 
                                g.InterpolationMode = System.Drawing.Drawing2D.InterpolationMode.High; 
                                g.SmoothingMode = System.Drawing.Drawing2D.SmoothingMode.HighQuality; 
                                g.Clear(System.Drawing.Color.Black); 
                                int lwidth = (smallWidth - intThumbWidth) / 2; 
                                int bheight = (smallHeight - intThumbHeight) / 2; 
                                g.DrawImage(bitmap, new System.Drawing.Rectangle(0, 0, intThumbWidth, intThumbHeight), lwidth, bheight, intThumbWidth, intThumbHeight, System.Drawing.GraphicsUnit.Pixel); 
                                g.Dispose(); 
                                bitmap1.Save(smallImagePath, System.Drawing.Imaging.ImageFormat.Jpeg); 
                            } 
                        }
                    }
                }

                #endregion

                AddImageNode("", smallSavePath + smallFileName, baseSavePath + fileName, fileName, width, height);
            }
            else
            {
                throw new Exception("您的图片格式不正确请重新选择！");
            }
        }

        #endregion

        #region 添加上传的图片信息到XML文件

        /// <summary>
        /// 添加上传的图片信息到XML文件
        /// </summary>
        /// <param name="imageName">图片描述</param>
        /// <param name="smallSrc">缩略图文件路径</param>
        /// <param name="bigSrc">原图文件路径</param>
        /// <param name="alt">提示内容</param>
        /// <param name="width">原图宽</param>
        /// <param name="height">原图高</param>
        public void AddImageNode(string imageName, string smallSrc, string bigSrc, string alt, int width, int height)
        {
            try
            {
                //获取系统图片XML
                XmlDocument xmlDoc = new XmlDocument();
                string imagesPath = Server.MapPath("../configfile") + "\\SysImages.xml";
                xmlDoc.Load(imagesPath);

                XmlNode root = xmlDoc.SelectSingleNode("RAD/Images");//查找<bookstore> 
                XmlElement xe1 = xmlDoc.CreateElement("Image");//创建一个<book>节点 
                xe1.SetAttribute("Name", imageName);//设置该节点genre属性 
                xe1.SetAttribute("SmallSrc", smallSrc);//设置该节点ISBN属性
                xe1.SetAttribute("BigSrc", bigSrc);//设置该节点genre属性 
                xe1.SetAttribute("Alt", alt);//设置该节点ISBN属性
                xe1.SetAttribute("Width", width.ToString());//原图宽
                xe1.SetAttribute("Height", height.ToString());//原图高
                root.AppendChild(xe1);

                xmlDoc.Save(imagesPath);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        #endregion

        #endregion
    }
}

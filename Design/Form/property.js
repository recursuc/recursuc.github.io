function public_Form() {
    publicform.keyValue = parent.designobj;
    publicform.obj = publicform.keyValue;
    if (typeof publicform.keyValue == "object") {
        publicform.keyValue = "";
    }
    var skinJs = "<script src='../css/skins/skins.js'></" + "script>";
    //    window.attachEvent("onunload",
    //    function() {
    //        publicform.obj = null;
    //        publicform.controls = null;
    //        publicform.popup = null;
    //        publicform.arrValidObj = null;
    //        publicform.area = null;
    //    });
    window.onunload = function () {
        publicform.obj = null;
        publicform.controls = null;
        publicform.popup = null;
        publicform.arrValidObj = null;
        publicform.area = null;
    };
}

function public_window_onkeypress() {
    publicform.isEdit = true;
}

function public_window_onbeforeunload() {
    try {
        eval(publicform.area.BLONclose);
    } catch (e) { }
}

/******************* 加载表单 ***********************/
function public_window_onload(strName) {
    publicform.area = document.getElementById(strName);

    eval(publicform.area.BLONopenBefore);

    //给页面中的复选框控件增加事件
    if (SysF_IsNoEmpty(publicform.obj) == false) {
        if (SysF_IsNoEmpty(publicform.area.keyfield)) {
            try {
                publicform.keyValue = publicform.obj.Field(publicform.area.keyfield).Value;
            } catch (E) { }
        }
    }

    eval(publicform.area.BLONopen);

    o = window.document.all.tags("div");
    l = o.length;
    for (i = 0; i < l; i++) {
        if (o[i].controltype != "checkbox") continue;
        for (var jj = 0; jj < o[i].childNodes.length; jj++) {
            o[i].childNodes(jj).attachEvent("onclick", radio_checkbox_click);
        }
    }
}

var Prop = Class.create();
Prop.prototype = {
    displayAction: PropWinDisplayAction,
    fontAction: PropWinFontAction,
    changePosition: PropWinChangePosition,
    selField: PropWinSelField,
    selFieldText: PropWinSelFieldText,
    onload: PropWinOnload,
    clickOk: PropWinClickOk
}

function RepDqMarks(obj) {
    if (obj.value.indexOf('"') != -1) return false;
}

function IsCheckDataField(obj1, obj2) {
    if (SysF_IsNoEmpty(obj1.value) && SysF_IsNoEmpty(obj2.value) == false || SysF_IsNoEmpty(obj1.value) == false && SysF_IsNoEmpty(obj2.value)) return false;
}

//改变定位模式时，变化位置控件的显示
function PropWinChangePosition() {
    if (cboPosition.value != "absolute") {
        txtLeft.value = "";
        txtTop.value = "";
    }
    if (cboPosition.value != "absolute") {
        txtLeft.disabled = true;
        txtTop.disabled = true;
    } else {
        txtLeft.disabled = false;
        txtTop.disabled = false;
    }
}

//单值数据表绑定
function PropWinSelField() {
    var arr = new Array();
    arr[0] = $id("txtDataTable").value + ";" + $id("txtField").value;
    arr[1] = publicform.obj[1];
    arr[2] = publicform.obj[6];
    oDesignWindow = arr[2];
    var arrtmp = contselfield(arr);
    if (typeof arrtmp != "undefined") {
        ClearBinged(arrtmp);
        $id("txtDataTable").value = arrtmp[0];
        $id("txtField").value = arrtmp[1];
        $id("txtDescript").value = arrtmp[2];
    }
}
function ClearBinged(arrtmp) {
    if (arrtmp.length > 3 && arrtmp[3] == "true") {
        for (var i = 4, len = arrtmp.length; i < len; i++) {
            var oEle, sType;
            if (arrtmp[i].indexOf("|") > -1) {
                arrDoubleValContInfo = arrtmp[i].split("|");
                oEle = oDesignWindow.document.getElementById(arrDoubleValContInfo[0]);
                sType = arrDoubleValContInfo[1];
            } else {
                oEle = oDesignWindow.document.getElementById(arrtmp[i]);
            }

            if (!oEle.ControlType) { continue; }
            switch (oEle.ControlType.toLowerCase()) {
                case "text":
                case "password":
                case "textarea":
                case "checkbox":
                case "datetime":
                    {
                        oEle.ColumnName = "";
                        oEle.DtClientId = "";
                        break;
                    }

                case "radio":
                case "combobox":
                    {
                        arrtmp[i].DtClientId = "";
                        if (oEle.DataMode == "Value" || (oEle.ValueColumnName != "" && oEle.TextColumnName == "")) {
                            oEle.ValueColumnName = "";
                        } else if (oEle.DataMode == "Text" || (oEle.ValueColumnName == "" && oEle.TextColumnName != "")) {
                            oEle.TextColumnName = ""
                        } else if (oEle.DataMode == "both" || (oEle.ValueColumnName != "" && oEle.TextColumnName != "")) {
                            if (sType == "Value") oEle.ValueColumnName = "";
                            if (sType == "Text") oEle.TextColumnName = "";
                        }
                    }
            }
        }
    }
}
//双值数据表绑定：value
function PropWinSelFieldValue() {
    var arr = new Array();
    arr[0] = $id("txtDataTableValue").value + ";" + $id("txtFieldValue").value;
    arr[1] = publicform.obj[1];
    arr[2] = publicform.obj[6];
    oDesignWindow = arr[2];
    var arrtmp = contselfield(arr);
    if (typeof arrtmp != "undefined") {
        ClearBinged(arrtmp);
        $id("txtDataTableValue").value = arrtmp[0];
        $id("txtFieldValue").value = arrtmp[1];
        $id("txtDescriptValue").value = arrtmp[2];
    }
}
//双值数据表绑定：text
function PropWinSelFieldText() {
    var arr = new Array();
    arr[0] = $id("txtDataTableText").value + ";" + $id("txtFieldText").value;
    arr[1] = publicform.obj[1];
    arr[2] = publicform.obj[6];
    oDesignWindow = arr[2];
    var arrtmp = contselfield(arr);
    if (typeof arrtmp != "undefined") {
        ClearBinged(arrtmp);
        $id("txtDataTableText").value = arrtmp[0];
        $id("txtFieldText").value = arrtmp[1];
        $id("txtDescriptText").value = arrtmp[2];
    }
}

//打开字段选择页选取字段
function contselfield(arr) {
    if (arr.length == 0) {
        alert("请增加了数据表后再试!");
        return;
    }
    var sRet = OpenAttributeForm('selectfield', arr, '选择字段');

    if (typeof sRet != "undefined") {
        var arr1 = sRet.split(",");
        return arr1;
    }
}

var PropWinOnload = {
    //当前控件对象
    obj: null,

    //加载当前控件对象
    loadCurObj: function () {

        if (!publicform.obj.nodeType) {
            this.obj = publicform.obj[0];
        } else {
            this.obj = publicform.obj;
        }

        if (typeof this.obj == "string") {
            this.obj = eval(this.obj);
        }
    },

    //回填基础数据
    loadBaseAttr: function () {
        if (this.obj == null) this.loadCurObj();

        //回填控件Id
        var tagIndex = this.obj.id.indexOf("_", 0);
        if (typeof controlPrefixLabel == "object") SetTextValue(this.obj.id.substring(0, tagIndex + 1), controlPrefixLabel);
        if (typeof txtId == "object") SetTextValue(this.obj.id.substring(tagIndex + 1, this.obj.id.length), txtId);

        //回填控件中文名
        if (typeof txtFieldChn == "object") SetTextValue(this.obj.ChineseName, txtFieldChn);

        //回填痕迹属性
        if (typeof isTrace == "object") {
            if (this.obj.Trace == "true")
                isTrace.checked = true;
            else
                isTrace.checked = false;
        }

        //自定义属性
        if (typeof txtCustomAttr == "object") {
            SetTextValue(this.obj.CustomAttr, txtCustomAttr);
            txtCustomAttr.ondblclick = EventCodeOpenBigWindow;
        }

        if (typeof txtSystemVariables == "object") {
            if (!SysF_IsNoEmpty(this.obj.SystemVariables)) {
                txtSystemVariables.selectedIndex = 0;
            } else {
                txtSystemVariables.value = this.obj.SystemVariables;
            }
        }

        if (typeof txtDefaultValue == "object") {
            txtDefaultValue.value = this.obj.DefaultValue;
        }

        if (typeof controlPrefixLabel == "object" && typeof txtId == "object") {
            //给Id号输入框，添加Id非同名验证事件
            txtId.onchange = function uf_id_onchange() {
                var sR = CheckContSameName(publicform.obj[3], controlPrefixLabel.value + txtId.value, publicform.obj[0], publicform.obj[2]);
                if (sR != "") {
                    alert(sR);
                    event.returnValue = false;
                }
            }
        }
        if (typeof txtDefaultValue == "object") SetTextValue(this.obj.DefaultValue, txtDefaultValue); //默认值
        if (typeof txtFieldSrc == "object") SetTextValue(this.obj.src, txtFieldSrc);
        if (typeof txtContainerImgSrc == "object") SetTextValue(this.obj.style.backgroundImage.substr(4, this.obj.style.backgroundImage.length - 5), txtContainerImgSrc);

        //单值数据表绑定
        if (typeof txtDataTable == "object") SetTextValue(this.obj.DtClientId, txtDataTable); //数据表
        if (typeof txtField == "object") SetTextValue(this.obj.ColumnName, txtField); //字段

        //（下拉列表\Radio控件）双值数据表绑定
        if (typeof selDataMode == "object") {
            SetTextValue(this.obj.DataMode, selDataMode);
            if (selDataMode.value == "Value") {
                if (typeof txtDataTableValue == "object") SetTextValue(this.obj.DtClientId, txtDataTableValue);
                if (typeof txtFieldValue == "object") SetTextValue(this.obj.ValueColumnName, txtFieldValue);
            } else if (selDataMode.value == "Text") {
                if (typeof txtDataTableText == "object") SetTextValue(this.obj.DtClientId, txtDataTableText);
                if (typeof txtFieldText == "object") SetTextValue(this.obj.TextColumnName, txtFieldText);
            } else if (selDataMode.value == "Both") {
                if (typeof txtDataTableValue == "object") SetTextValue(this.obj.DtClientId, txtDataTableValue);
                if (typeof txtFieldValue == "object") SetTextValue(this.obj.ValueColumnName, txtFieldValue);
                if (typeof txtDataTableText == "object") SetTextValue(this.obj.DtClientId, txtDataTableText);
                if (typeof txtFieldText == "object") SetTextValue(this.obj.TextColumnName, txtFieldText);
            }
        }

        //回填打印
        if (typeof isPrint == "object") {
            isPrint.value = this.obj.IsPrint;
        }

        if (typeof selScroll == "object") {
            selScroll.value = this.obj.scrolling;
        }

        if (typeof selFrameBorder == "object") {
            selFrameBorder.value = this.obj.frameBorder;
        }

        if (typeof txtClass == "object") {
            txtClass.value = this.obj.className;
        }
    },

    loadTableAtrr: function () {
        if (this.obj == null) this.loadCurObj();

        //回填单元格边距
        if (typeof NumEdit1 == "object") {
            if (this.obj.cellPadding == "") {
                NumEdit1.value = "-1";
            }
            else {
                NumEdit1.value = this.obj.cellPadding;
            }
        }
        //回填单元格间距
        if (this.obj.cellSpacing == "") {
            NumEdit2.value = "-1";
        }
        else {
            NumEdit2.value = this.obj.cellSpacing;
        }

        //表格指定宽度
        if (typeof txtWidth == "object") {
            if (this.obj.style.width == "") {
                txtWidth.value = "";
                if (typeof chkWidth == "object") {
                    chkWidth.checked = false;
                    chkWidth.fireEvent("onclick");
                }
            } else {
                txtWidth.value = parseInt(this.obj.style.width);
                if (typeof chkWidth == "object") {
                    chkWidth.checked = true;
                    chkWidth.fireEvent("onclick");
                }
            }
        }

        //表格指定高度
        if (typeof txtHeight == "object") {
            if (this.obj.style.height == "") {
                txtHeight.value = "";
                if (typeof txtHeight == "object") {
                    chkHeight.checked = false;
                    chkHeight.fireEvent("onclick");
                }
            } else {
                txtHeight.value = parseInt(this.obj.style.height);
                if (typeof txtHeight == "object") {
                    chkHeight.checked = true;
                    chkHeight.fireEvent("onclick");
                }
            }
        }

        //设置表格指定高度宽度的单位
        //得到当前单元格的宽度
        if (typeof widthRadioGroup == "object") {
            var s1 = this.obj.style.width;
            var s2 = s1.substring(s1.length, s1.length - 2);

            if (s2 == "px") {
                //widthPixelPercentGroup[0].checked = true;
                widthPixelPercentGroup[0].nextSibling.fireEvent("onclick");
            }
            else {
                // widthPixelPercentGroup[1].checked = true;
                widthPixelPercentGroup[1].nextSibling.fireEvent("onclick");
            }
        }

        if (typeof heightRadioGroup == "object") {
            //得到当前单元格的高度
            var ss = this.obj.style.height;
            var ss2 = ss.substring(ss.length, ss.length - 2);
            if (ss2 == "px") {
                // heightPixelPercentGroup[0].checked = true;
                heightPixelPercentGroup[0].nextSibling.fireEvent("onclick");
            }
            else {
                // heightPixelPercentGroup[1].checked = true;
                heightPixelPercentGroup[1].nextSibling.fireEvent("onclick");
            }
        }

        //文本框对齐方式
        if (typeof SKDBcombobox1 == "object") {
            if (isSpace(this.obj.align)) {
                SKDBcombobox1.value = "left";
            }
            else {
                SKDBcombobox1.value = this.obj.align;
            }
        }

        //边框粗细
        if (typeof NumEdit3 == "object") {
            if (isSpace(this.obj.style.borderWidth)) {
                NumEdit3.value = "-1"
            }
            else {
                NumEdit3.value = parseInt(this.obj.style.borderWidth);
            }
        }

        //回填表格背景与边框颜色
        if (typeof bgColorShow == "object") {
            bgColorShow.style.backgroundColor = this.obj.style.backgroundColor;
        }
        if (typeof borderColorShow == "object") {
            borderColorShow.style.backgroundColor = this.obj.style.borderColor;
        }

        //设置图片平铺类型
        SetRepeatType(this.obj.style.backgroundRepeat);

        if (typeof demoImageObj == "object" && typeof txtContainerImgSrc == "object") {
            if (typeof this.obj.SmallImageSrc != "undefined") {
                demoImageObj.src = this.obj.SmallImageSrc;
            }
            demoImageObj.BigSrc = txtContainerImgSrc.value;
        }
    },

    //加载样式属性页
    loadStyleAttr: function () {
        if (this.obj == null) this.loadCurObj();

        //回填大小以及定位属性值
        if (typeof txtWidth == "object") SetTextValue(this.obj.offsetWidth, txtWidth);
        if (typeof txtHeight == "object") SetTextValue(this.obj.offsetHeight, txtHeight);
        if (typeof txtTop == "object") SetTextValue(this.obj.style.top, txtTop);
        if (typeof txtLeft == "object") SetTextValue(this.obj.style.left, txtLeft);
        //按定位类型控制绝对定位可填属性
        if (typeof cboPosition == "object") cboPosition.value = this.obj.style.position;
        var tmpB = true;
        if (this.obj.style.position == "absolute") tmpB = false;
        if (typeof txtLeft == "object") txtLeft.disabled = tmpB;
        if (typeof txtTop == "object") txtTop.disabled = tmpB;

        if (typeof selDisplay == "object") {
            if (this.obj.style.display == "") {
                selDisplay.selectedIndex = 1;
            } else {
                selDisplay.value = this.obj.style.display;
            }
        }

        if (typeof cboVAlign == "object") {
            if (this.obj.vAlign == "") {
                cboVAlign.selectedIndex = 1;
            } else {
                cboVAlign.value = this.obj.vAlign;
            }
        }
        //是否可见
        if (typeof chkDisplay == "object") {
            if (this.obj.style.display == "none" || this.obj.style.display == "") {
                chkDisplay.checked = false;
            }
            else {
                chkDisplay.checked = true;
            }
        }

        //是否可用
        if (typeof chkDisabled == "object") {
            if (this.obj.disabled == true) {
                chkDisabled.checked = false;
            } else {
                chkDisabled.checked = true;
            }
        }
        //是否只读
        if (typeof chkReadOnly == "object") {
            if (this.obj.readOnly == true) {
                chkReadOnly.checked = true;
            } else {
                chkReadOnly.checked = false;
            }
        }
        //是否透明
        if (typeof chkNotBg == "object") {
            if (this.obj.style.backgroundColor == "") {
                chkNotBg.checked = true;
            } else {
                chkNotBg.checked = false;
            }
        }

        if (typeof cboAlign == "object") cboAlign.value = this.obj.style.textAlign; //对齐方式

        //回填字体属性
        if (typeof displayfont == "object") {
            var obj1 = displayfont;
            if (this.obj.style.backgroundColor == "") {
                obj1.style.backgroundColor = "#ffffff";
            }
            else {
                obj1.style.backgroundColor = this.obj.style.backgroundColor;
            }
            obj1.style.color = this.obj.style.color;
            obj1.style.fontStyle = this.obj.style.fontStyle;
            obj1.style.textDecoration = this.obj.style.textDecoration;
            obj1.style.fontFamily = this.obj.style.fontFamily;
            obj1.style.fontSize = this.obj.style.fontSize;
            obj1.style.fontWeight = this.obj.style.fontWeight;
        }

        //回填下划线属性值
        if (typeof chkUnderline == "object") {
            if (this.obj.style.textDecoration == 'underline') {
                SetCheckBoxValue(chkUnderline, "是");
            }
            else {
                SetCheckBoxValue(chkUnderline, "否");
            }
        }

        //回填边框属性值
        if (typeof chkLeftLine == "object") SetCheckValueByBorder(this.obj, "borderLeft", chkLeftLine);
        if (typeof chkTopLine == "object") SetCheckValueByBorder(this.obj, "borderTop", chkTopLine);
        if (typeof chkBottomLine == "object") SetCheckValueByBorder(this.obj, "borderBottom", chkBottomLine);
        if (typeof chkRightLine == "object") SetCheckValueByBorder(this.obj, "borderRight", chkRightLine);
    },

    loadFontList: function () {
        if (this.obj == null) this.loadCurObj();

        if (typeof displayfont == "object") {
            displayfont.style.fontStyle = this.obj.style.fontStyle; //字体样式
            displayfont.style.textDecoration = this.obj.style.textDecoration; //
            displayfont.style.fontFamily = this.obj.style.fontFamily; //字体类型
            displayfont.style.fontSize = this.obj.style.fontSize; //字体大小
            displayfont.style.fontWeight = this.obj.style.fontWeight; //字体粗细
            displayfont.style.color = this.obj.style.color; //字体颜色
        }

        if (typeof SKDBListBox1 == "object") {
            for (var i = SKDBListBox1.length - 1; i >= 0; i--) {
                if (SKDBListBox1.options(i).value == this.obj.style.fontFamily) {
                    SKDBListBox1.options(i).selected = true;
                }
                if (this.obj.style.fontFamily == "" && SKDBListBox1.options(i).value == "宋体") {
                    SKDBListBox1.options(i).selected = true;
                }
            }
        }

        if (typeof SKDBListBox2 == "object") {
            for (var i = SKDBListBox2.length - 1; i >= 0; i--) {
                if (SKDBListBox2.options(i).value == "常规" && this.obj.style.fontStyle == "normal" && this.obj.style.fontWeight == "") {
                    SKDBListBox2.options(i).selected = true;
                }
                if (SKDBListBox2.options(i).value == "粗体" && this.obj.style.fontWeight == "bold" && this.obj.style.fontStyle == "") {
                    SKDBListBox2.options(i).selected = true;
                }
                if (SKDBListBox2.options(i).value == "斜体" && this.obj.style.fontStyle == "italic" && this.obj.style.fontWeight == "") {
                    SKDBListBox2.options(i).selected = true;
                }
                if (SKDBListBox2.options(i).value == "粗斜体" && this.obj.style.fontStyle == "italic" && this.obj.style.fontWeight == "bold") {
                    SKDBListBox2.options(i).selected = true;
                }
                if (this.obj.style.fontStyle == "" && this.obj.style.fontWeight == "" && SKDBListBox2.options(i).value == "常规") {
                    SKDBListBox2.options(i).selected = true;
                }
            }
        }

        if (typeof SKDBListBox3 == "object") {
            if (this.obj.style.fontSize.toString() != "") {
                for (var i = SKDBListBox3.length - 1; i >= 0; i--) {
                    if (SKDBListBox3.options(i).value == this.obj.style.fontSize || SKDBListBox3.options(i).value + "px" == this.obj.style.fontSize) {
                        SKDBListBox3.options(i).selected = true;
                    }
                    if (this.obj.style.fontSize == "12px" && SKDBListBox3.options(i).value == "12px") {
                        SKDBListBox3.options(i).selected = true;
                    }
                }
            }
            else {//默认字体大小
                for (var i = SKDBListBox3.length - 1; i >= 0; i--) {
                    if (SKDBListBox3.options(i).value == "16px") {
                        SKDBListBox3.options(i).selected = true;
                    }
                }
            }
        }

        this.loadFontList.loadFontFamily();
        this.loadFontList.loalFontStyle();
        this.loadFontList.loadFontSize();
    },

    //加载事件属性
    loadEvent: function () {
        if (this.obj == null) this.loadCurObj();

        //加载事件
        /* 加载单击触发的事件 */
        if (typeof txtEclick == "object") {
            if (this.obj._onclick) {
                txtEclick.value = this.obj._onclick;
            } else {
                txtEclick.value = ""
            }
            txtEclick.ondblclick = EventCodeOpenBigWindow;
        }

        /* 加载双击触发的事件 */
        if (typeof txtEdblclick == "object") {
            if (this.obj._ondblclick) {
                txtEdblclick.value = this.obj._ondblclick;
            } else {
                txtEdblclick.value = ""
            }
            txtEdblclick.ondblclick = EventCodeOpenBigWindow;
        }

        /* 加载聚焦触发的事件 */
        if (typeof txtEfocus == "object") {
            if (this.obj._onfocus) {
                txtEfocus.value = this.obj._onfocus;
            } else {
                txtEfocus.value = ""
            }
            txtEfocus.ondblclick = EventCodeOpenBigWindow;
        }

        /* 加载失去聚焦触发的事件 */
        if (typeof txtEblur == "object") {
            if (this.obj._onblur) {
                txtEblur.value = this.obj._onblur;
            } else {
                txtEblur.value = "";
            }
            txtEblur.ondblclick = EventCodeOpenBigWindow;
        }

        /* 加载键盘输入触发的事件 */
        if (typeof txtEkey == "object") {
            if (this.obj._onkeydown) {
                txtEkey.value = this.obj._onkeydown;
            } else {
                txtEkey.value = "";
            }
            txtEkey.ondblclick = EventCodeOpenBigWindow;
        }

        if (typeof txtEkeyup == "object") {
            if (this.obj._onkeyup) {
                txtEkeyup.value = this.obj._onkeyup;
            } else {
                txtEkeyup.value = "";
            }
            txtEkeyup.ondblclick = EventCodeOpenBigWindow;
        }

        /* 加载内容改变触发的事件 */
        if (typeof txtEchange == "object") {
            if (this.obj._onchange) {
                txtEchange.value = this.obj._onchange;
            } else {
                txtEchange.value = "";
            }
            txtEchange.ondblclick = EventCodeOpenBigWindow;
        }
    },

    //回填按钮图片
    loadButtonImg: function () {
        var bmpPath = "../skins/" + publicform.toolBarStyle + "/images/buttons/ef_run_downarrow.gif";
        //事件按钮设置
        if (typeof cmdEclick == "object") SetButtonImage(cmdEclick, bmpPath);
        if (typeof cmdEdblclick == "object") SetButtonImage(cmdEdblclick, bmpPath);
        if (typeof cmdEfocus == "object") SetButtonImage(cmdEfocus, bmpPath);
        if (typeof cmdEblur == "object") SetButtonImage(cmdEblur, bmpPath);
        if (typeof cmdEkey == "object") SetButtonImage(cmdEkey, bmpPath);
        if (typeof cmdEkeyup == "object") SetButtonImage(cmdEkey, bmpPath);
        if (typeof cmdEchange == "object") SetButtonImage(cmdEchange, bmpPath);

        if (typeof cmdBgcolor == "object") SetButtonImage(cmdBgcolor, "../skins/" + publicform.toolBarStyle + "/images/buttons/ef_run_button_color.gif");
        if (typeof bgColorButton == "object") SetButtonImage(bgColorButton, "../skins/" + publicform.toolBarStyle + "/images/buttons/ef_run_button_color.gif");
        if (typeof borderColorButton == "object") SetButtonImage(borderColorButton, "../skins/" + publicform.toolBarStyle + "/images/buttons/ef_run_button_color.gif");
        if (typeof cmdFont == "object") SetButtonImage(cmdFont, "../skins/" + publicform.toolBarStyle + "/images/buttons/ef_run_button_font.gif");
        if (typeof cmdSelectFiled == "object") SetButtonImage(cmdSelectFiled, "../skins/" + publicform.toolBarStyle + "/images/buttons/ef_run_button_choose.gif");
        if (typeof cmdSelectValueFiled == "object") SetButtonImage(cmdSelectValueFiled, "../skins/" + publicform.toolBarStyle + "/images/buttons/ef_run_button_choose.gif");
        if (typeof cmdClear == "object") SetButtonImage(cmdClear, "../skins/" + publicform.toolBarStyle + "/images/buttons/button_clear.gif");
        if (typeof cmdClear1 == "object") SetButtonImage(cmdClear1, "../skins/" + publicform.toolBarStyle + "/images/buttons/button_clear.gif");
        if (typeof cmdSelect == "object") SetButtonImage(cmdSelect, "../skins/" + publicform.toolBarStyle + "/images/buttons/ef_tb_button_select.gif");

        //设置确定和取消按钮图片
        if (typeof cmdOk == "object") SetButtonImage(cmdOk, "../skins/" + publicform.toolBarStyle + "/images/buttons/ef_run_button_ok.gif");
        if (typeof cmdClose == "object") SetButtonImage(cmdClose, "../skins/" + publicform.toolBarStyle + "/images/buttons/ef_run_button_close.gif");

        if (typeof cmdRelevanceWizard == "object") SetButtonImage(cmdRelevanceWizard, "../skins/" + publicform.toolBarStyle + "/images/buttons/ef_run_button_choose.gif");
    },

    //回填数据源
    loadDataSource: function () {
        if (this.obj == null) this.loadCurObj();

        //加载数据来源方式(自定义数据源、数据库数据源)
        if (typeof dataSourceType == "object") {
            for (var n = 0; n < dataSourceType.length; n++) {
                if (dataSourceType[n].value == this.obj.DataSourceType) {
                    dataSourceType[n].checked = true;
                    if (dataSourceType[n].value == "TextDataSource") {
                        if (typeof txtDBValueColumn == "object") {
                            txtDBValueColumn.disabled = true;
                        }
                        if (typeof txtDBTextColumn == "object") {
                            txtDBTextColumn.disabled = true;
                        }
                        if (typeof txtAreaDBSql == "object") {
                            txtAreaDBSql.disabled = true;
                        }
                        if (typeof txtTextSource == "object") {
                            txtTextSource.disabled = false;
                        }
                    }
                    else if (dataSourceType[n].value == "DbDataSource") {
                        if (typeof txtTextSource == "object") {
                            txtTextSource.disabled = true;
                        }
                        if (typeof txtDBValueColumn == "object") {
                            txtDBValueColumn.disabled = false;
                        }
                        if (typeof txtDBTextColumn == "object") {
                            txtDBTextColumn.disabled = false;
                        }
                        if (typeof txtAreaDBSql == "object") {
                            txtAreaDBSql.disabled = false;
                        }
                    }
                    break;
                }
            }
        }
        //加载自定义数据源内容
        if (typeof txtTextSource == "object") {
            SetTextValue(this.obj.TextDataSource, txtTextSource);
        }

        //加载数据库数据源值字段名
        if (typeof txtDBValueColumn == "object") {
            SetTextValue(this.obj.DbValueColumn, txtDBValueColumn);
        }

        //加载数据库数据源文本字段名
        if (typeof txtDBTextColumn == "object") {
            SetTextValue(this.obj.DbTextColumn, txtDBTextColumn);
        }

        //加载数据库数据数据源SQL
        if (typeof txtAreaDBSql == "object") {
            txtAreaDBSql.innerText = this.obj.DbDataSource;
        }
    },

    loadBaseValid: function () {
        if (this.obj.IsRequired == "true" && typeof chkIsRequired == "object") {
            chkIsRequired.checked = true;
            chkIsRequired.fireEvent("onclick");
            txtNoEmptyAlertMsg.value = this.obj.NoEmptyAlertMsg;

        } else if (typeof chkIsRequired == "object") {
            chkIsRequired.checked = false;
            chkIsRequired.fireEvent("onclick");
        }

        if ((this.obj.IsXMLSpecialChar == "true" || this.obj.IsXMLSpecialChar == undefined) && typeof chkIsXMLSpecialChar == "object") {
            chkIsXMLSpecialChar.checked = true;
            chkIsXMLSpecialChar.fireEvent("onclick");
            txtSpecialCharAlertMsg.value = this.obj.SpecialCharAlertMsg;
        } else if (typeof chkIsXMLSpecialChar == "object") {
            chkIsXMLSpecialChar.checked = false;
            chkIsXMLSpecialChar.fireEvent("onclick");
        }

        if (this.obj.IsLengthValid == "true" && typeof chkLengthValid == "object") {
            var arrValidInfo = [];
            chkLengthValid.checked = true;
            chkLengthValid.fireEvent("onclick");
            if (this.obj.LengthValidInfo.indexOf(";")) {
                arrValidInfo = this.obj.LengthValidInfo.split(",");
            }
            if (arrValidInfo.length > 2) {
                if (typeof txtValidLengthMin == "object") {
                    txtValidLengthMin.value = arrValidInfo[0];
                }
                if (arrValidInfo[1] == "") {
                    arrValidInfo[1] = Number.MAX_VALUE;
                }
                if (typeof txtValidLengthMax == "object") {
                    txtValidLengthMax.value = arrValidInfo[1];
                }
                if (typeof txtlengthValidAlertMsg == "object") {
                    txtlengthValidAlertMsg.value = arrValidInfo[2].substring(1, arrValidInfo[2].length - 1);
                }

            }
        } else if (typeof chkLengthValid == "object") {
            chkLengthValid.checked = false;
            chkLengthValid.fireEvent("onclick");

        }
        if (typeof txtValidSeq == "object") {
            if (typeof this.obj.ValidSeq == "undefined") this.obj.ValidSeq = "";
            txtValidSeq.value = this.obj.ValidSeq;
        }
        if (typeof txtCommitValidFucNames == "object") {
            if (typeof this.obj.CommitValidFucNames == "undefined") this.obj.CommitValidFucNames = "";
            txtCommitValidFucNames.value = this.obj.CommitValidFucNames;
        }
    }
}

PropWinOnload.loadFontList.loadFontFamily = function () {
    //回填字体
    if (typeof SKDBListBox1 == "object" && typeof displayfont == "object") {
        for (var i = SKDBListBox1.length - 1; i >= 0; i--) {
            if (SKDBListBox1.options(i).selected) {
                SKDBedit1.value = SKDBListBox1.options(i).value;   //被选中的值
                break;
            }
        }
        if (SKDBedit1.value != "") {
            displayfont.style.fontFamily = SKDBedit1.value;
        }
    }
}

//回填样式
PropWinOnload.loadFontList.loalFontStyle = function () {
    if (typeof displayfont == "object" && typeof SKDBListBox2 == "object") {
        displayfont.style.fontStyle = "";
        displayfont.style.fontWeight = "";
        for (var i = SKDBListBox2.length - 1; i >= 0; i--) {
            if (SKDBListBox2.options(i).selected) {
                SKDBedit2.value = SKDBListBox2.options(i).value;
                break;
            }
        }
        if (SKDBedit2.value != "") {
            displayfont.style.fontWeight = "";
            displayfont.style.fontStyle = "";
            switch (SKDBedit2.value) {
                case "常规": displayfont.style.fontStyle = "normal"; break;
                case "粗体": displayfont.style.fontWeight = "bold"; break;
                case "斜体": displayfont.style.fontStyle = "italic"; break;
                case "粗斜体": displayfont.style.fontWeight = "bold"; displayfont.style.fontStyle = "italic"; break;
            }
        }
    }
}

//回填字体大小
PropWinOnload.loadFontList.loadFontSize = function () {
    if (typeof SKDBListBox3 == "object" && typeof displayfont == "object") {
        for (var i = SKDBListBox3.length - 1; i >= 0; i--) {
            if (SKDBListBox3.options(i).selected) {
                SKDBedit3.value = SKDBListBox3.options(i).text;
                break;
            }
        }
        if (SKDBedit3.value != "") {
            displayfont.style.fontSize = SKDBListBox3.value;
        }
    }
}

//回填字体下滑线
PropWinOnload.loadFontList.loadUnderline = function () {
    if (typeof chkUnderline == "object" && typeof displayfont == "object") {
        if (chkUnderline.value == '否') {
            displayfont.style.textDecoration = "underline";
            chkUnderline.value = '是';
        }
        else {
            displayfont.style.textDecoration = "none";
            chkUnderline.value = '否';
        }
    }
}

function CheckBoxPutValue(oP, oCont, vValue) {
    if (oP == vValue) {
        SetCheckBoxValue(oCont, "否");
    } else {
        SetCheckBoxValue(oCont, "是");
    }
}

function CheckContSameName(oContXml, sid, obj, SKbillsheet) {
    var oldid = obj.id;
    sid = new Str().trim(sid);
    var re = /\W/g;
    if (re.test(sid)) {
        sRet = "控件名称只能为a-z或A-Z或0-9或_";
        return sRet;
    }
    var sRet = "";
    var oList = oContXml.documentElement.selectNodes("//id[. ='" + sid + "']");
    if (oList.length > 0) {
        sRet = sid + "控件名称重复! 请另外输入一个名称! ";
    } else if (oList.length <= 0) {
        var oNode = oContXml.documentElement.selectSingleNode("//id[. ='" + oldid + "']");
        if (oNode != null) {
            oNode.text = sid;
            obj.id = sid;
            SKbillsheet.ownerDocument.parentWindow.parent.Objlist.execScript("objlist_edit('" + oldid + "','" + sid + "')");
        }
        var sxml = SKbillsheet.billtaborder;
        if (SysF_IsNoEmpty(sxml)) {
            var oXml = SetDom(sxml);
            oNode = oXml.documentElement.selectSingleNode("//taborder[. ='" + oldid + "']");
            if (oNode != null) {
                oNode.text = sid;
                SKbillsheet.billtaborder = oXml.documentElement.xml;
            }
        }
    }
    return sRet;
}

//打开单独代码编辑窗口
function EventCodeOpenBigWindow() {
    var obj = event.srcElement;
}

var PropWinClickOk = {
    obj: null, //当前控件对象
    isPassValid: true, //属性页信息是否通过验证
    arrAttrGroup: null,
    iCurHasValidGroup: -1,
    //加载当前控件对象
    loadCurObj: function () {
        //        if (!this.isHaveValid) this.commonValid();
        //        if (this.isPassValid) {
        if (!publicform.obj.nodeType) {
            this.obj = publicform.obj[0];
        } else {
            this.obj = publicform.obj;
        }
        //        }

        var oCurObj = publicform.obj.nodeType == undefined ? publicform.obj[0] : publicform.obj;

        this.loadCurObj = function () {
            return oCurObj;
        }

        return oCurObj;
    },

    synchronAttr: function (arrSynAttrGroup) {
        this.arrAttrGroup = arrSynAttrGroup;
        if (!(this.arrAttrGroup instanceof Array)) {
            this.arrAttrGroup = [this.arrAttrGroup];
        }

        this.obj = this.loadCurObj();
        this.commonValid();
        if (!this.isPassValid) return false;

        for (var j = 0; j < this.arrAttrGroup.length; j++) {
            switch (this.arrAttrGroup[j].toLowerCase()) {
                case "base":
                    {
                        this.synchronBaseAttr();
                        break;
                    }
                case "style":
                    {
                        this.synchronStyleAttr();
                        break;
                    }
                case "event":
                    {
                        this.synchronEvent();
                        break;
                    }
                case "datasource":
                    {
                        this.synchronDataSource();
                        break;
                    }
                case "valid":
                    {
                        this.synchronBaseValid();
                        break;
                    }
                default:

            }
        }

        return true;
    },

    //属性页校验方法
    commonValid: function () {
        var attTabs = Ext.getCmp("attTabs");
        for (var i = this.iCurHasValidGroup != -1 ? this.iCurHasValidGroup : 0; i < this.arrAttrGroup.length; i++) {
            switch (this.arrAttrGroup[i].toLowerCase()) {
                case "base":
                    {
                        if (typeof txtId == "object") {
                            if (!SysF_IsNoEmpty(txtId.value, "控件ID不能为空,请重新输入!")) {
                                this.isPassValid = false;
                                return;
                            }
                            if (txtId.value != "") {
                                if (SysF_IsContainSpecialChar(txtId.value, "控件ID不能包含特殊字符,请重新输入!")) {
                                    this.isPassValid = false;
                                    return;
                                }
                            }
                        }
                        if (typeof txtFieldChn == "object") {
                            if (typeof txtFieldChn == "object") {
                                if (!SysF_IsNoEmpty(txtFieldChn.value, "中文名不能为空,请重新输入!")) {
                                    this.isPassValid = false;
                                    return;
                                }
                                if (txtFieldChn.value != "") {
                                    if (SysF_IsContainSpecialChar(txtFieldChn.value, "中文名不能包含特殊字符,请重新输入!")) {
                                        this.isPassValid = false;
                                        return;
                                    }
                                }
                            }
                        }
                        if (typeof txtCustomAttr == "object") {
                            if (txtCustomAttr.value.indexOf('"') != -1 || txtCustomAttr.value.indexOf("'") != -1) {
                                alert("自定义属性中不支持双引号或单引号。")
                                this.isPassValid = false;
                                return;
                            }
                        }
                        if (typeof txtDataset == "object" && typeof txtField == "object") {
                            if (IsCheckDataField(txtDataset, txtField) == false) {
                                alert("数据集和字段名称必须同时填写或不填写，请输入!");
                                this.isPassValid = false;
                                return;
                            }
                        }

                        break;
                    }
                case "style":
                    {
                        if (cboPosition.value == "absolute") {
                            if (typeof txtLeft == "object") {
                                if (!txtLeft.value.match(/^\s*(\d+\s*(px)?)\s*$/)) {
                                    attTabs.setActiveTab('st');
                                    txtLeft.focus();
                                    alert("位置属性不对!必须为数字");
                                    this.isPassValid = false;
                                    return;
                                }
                            }
                            if (typeof txtTop == "object") {
                                if (!txtTop.value.match(/^\s*(\d+\s*(px)?)\s*$/)) {
                                    attTabs.setActiveTab('st');
                                    txtTop.focus();
                                    alert("位置属性不对!必须为数字");
                                    this.isPassValid = false;
                                    return;
                                }
                            }
                        }
                        if (typeof txtWidth == "object") {
                            if (!SysF_IsPositive(txtWidth.value)) {
                                if (this.obj.ControlType != "webgrid") {
                                    attTabs.setActiveTab('st');
                                } else {
                                    attTabs.setActiveTab('ab');
                                }
                                txtWidth.focus();
                                alert("控件值为整数,请重新输入");
                                this.isPassValid = false;
                                return;
                            }
                        }
                        if (typeof txtHeight == "object") {
                            if (!SysF_IsPositive(txtHeight.value)) {
                                if (this.obj.ControlType != "webgrid") {
                                    attTabs.setActiveTab('st');
                                } else {
                                    attTabs.setActiveTab('ab');
                                }
                                txtHeight.focus();
                                alert("控件值为整数,请重新输入");
                                this.isPassValid = false;
                                return;
                            }
                        }
                        if (typeof areaMin == "object") {
                            if (!SysF_IsPositiveInt(areaMin.value)) {
                                attTabs.setActiveTab('st');
                                areaMin.focus();
                                alert("控件值为正整数,请重新输入!");
                                this.isPassValid = false;
                                return;
                            }
                        }
                        break;
                    }
                case "event":
                    {
                        if (typeof txtEclick == "object") {
                            if (RepDqMarks(txtEclick) == false) {
                                alert("不支持双引号!")
                                txtEclick.focus();
                                this.isPassValid = false;
                                return;
                            }
                        }
                        break;
                    }
                case "datasoure":
                    {
                        if (typeof dataSourceType == "object") {
                            for (var n = 0; n < dataSourceType.length; n++) {
                                if (dataSourceType[n].checked == true) {
                                    if (dataSourceType[n].value == "TextDataSource") {
                                        if (typeof textSource == "object" && typeof dbSource == "object") {
                                            if (typeof txtTextSource == "object") {
                                                var numdatas = 0;
                                                var valueTexts = txtTextSource.value.split(";");
                                                for (var k = 0; k < valueTexts.length; k++) {
                                                    var datas = valueTexts[k].split(",");
                                                    if (datas.length == 2) {
                                                        numdatas++;
                                                    }
                                                }
                                                if (valueTexts.length != numdatas) {
                                                    alert("数据源设置错误,请返回重新设置！");
                                                    this.isPassValid = false;
                                                    return;
                                                }
                                            }
                                        }
                                    }
                                    else if (dataSourceType[n].value == "DbDataSource") {
                                        if (typeof txtDBValueColumn == "object" && typeof txtDBTextColumn == "object" && typeof txtAreaDBSql == "object") {
                                            if (!SysF_IsNoEmpty(txtDBValueColumn.value, "值字段不能为空,请重新输入!")) {
                                                this.isPassValid = false;
                                                return;
                                            }
                                            if (!SysF_IsNoEmpty(txtDBTextColumn.value, "显示字段不能为空,请重新输入!")) {
                                                this.isPassValid = false;
                                                return;
                                            }
                                            if (!SysF_IsNoEmpty(txtAreaDBSql.value, "条件Sql语句不能为空,请重新输入!")) {
                                                this.isPassValid = false;
                                                return;
                                            }
                                        }
                                    }
                                }
                            }
                        }
                        break;
                    }
                case "valid":
                    {
                        if (typeof chkLengthValid == "object" && chkLengthValid.checked) {
                            if (!SysF_IsPositiveInt(txtValidLengthMin.value)) {
                                attTabs.setActiveTab('evtVal');
                                txtValidLengthMin.focus();
                                alert('输入值必须为正整S数!');
                                this.isPassValid = false;
                                return;
                            }

                            if (!SysF_IsPositiveInt(txtValidLengthMax.value)) {
                                attTabs.setActiveTab('evtVal');
                                txtValidLengthMax.focus();
                                alert('输入值必须为正整数!');
                                this.isPassValid = false;
                                return;
                            }

                            var iMinLength, iMaxLength;
                            iMinLength = parseInt(txtValidLengthMin.value);
                            iMaxLength = parseInt(txtValidLengthMax.value);
                            if (iMinLength > iMaxLength) {
                                attTabs.setActiveTab('st');
                                txtValidLengthMin.focus();
                                alert('最小长度大于最大长度!');
                            }
                        }

                        if (typeof txtValidSeq == "object") {
                            if (txtValidSeq.value != "" && !SysF_IsPositiveInt(txtValidSeq.value)) {
                                attTabs.setActiveTab('evtVal');
                                txtValidSeq.focus();
                                alert('输入值必须为正整数!');
                                this.isPassValid = false;
                                return;
                            }
                        }
                        break;
                    }
                default:

            }
        }

        return this.isPassValid;
    },

    //同步基本信息
    synchronBaseAttr: function () {
        //自定义属性
        if (typeof txtCustomAttr == "object") {
            if (txtCustomAttr.value.indexOf('"') != -1 || txtCustomAttr.value.indexOf("'") != -1) {
                alert("自定义属性中不支持双引号或单引号。")
                return false;
            }

            if (!SysF_IsNoEmpty(txtCustomAttr.value)) {
                this.obj.removeAttribute("CustomAttr");
            }
            else {
                this.obj.CustomAttr = txtCustomAttr.value;
            }
        }

        //控件ID
        if (typeof txtId == "object") {
            if (typeof controlPrefixLabel == "object") {
                this.obj.id = controlPrefixLabel.value + txtId.value;
            }
            else {
                this.obj.id = txtId.value;
            }
        }

        //控件中文名
        if (typeof txtFieldChn == "object") {
            this.obj.ChineseName = txtFieldChn.value;
            // this.obj.innerHTML = txtFieldChn.value;
        }

        //是否保留痕迹
        if (typeof isTrace == "object") {
            if (isTrace.checked == true)
                this.obj.Trace = "true";
            else
                this.obj.Trace = "false";
        }

        //控件默认值
        if (typeof txtDefaultValue == "object") {
            this.obj.DefaultValue = txtDefaultValue.value;
        }

        if (typeof txtSystemVariables == "object") {
            this.obj.SystemVariables = txtSystemVariables.options[txtSystemVariables.selectedIndex].value;
        }

        if (typeof txtFieldAlt == "object") {
            this.obj.alt = txtFieldAlt.value;
        }

        if (typeof txtFieldSrc == "object") {
            this.obj.src = txtFieldSrc.value;
        }

        //打印
        if (typeof isPrint == "object") {
            this.obj.IsPrint = isPrint.value;
        }

        if (typeof selScroll == "object") {
            this.obj.scrolling = selScroll.value;
        }

        if (typeof selFrameBorder == "object") {
            this.obj.frameBorder = selFrameBorder.value;
        }

        if (typeof txtClass == "object") {
            this.obj.className = txtClass.value;
        }

    },

    //同步样式信息
    synchronStyleAttr: function () {
        if (this.obj == null) this.loadCurObj();
        if (this.obj == null) return;
        //显示字体、字号、背景色等属性
        if (typeof displayfont == "object") {
            var obj1 = displayfont;
            if (obj1.changebg == "是") {
                this.obj.style.backgroundColor = obj1.style.backgroundColor;
            }
            PropWinFontAction(this.obj, obj1);
        }

        //是否活动
        if (typeof chkDisabled == "object") {
            if (chkDisabled.checked == true) {
                this.obj.disabled = false;
            } else {
                this.obj.disabled = true;
            }
        }

        //是否可见
        if (typeof chkDisplay == "object") {
            if (chkDisplay.checked == true) {
                this.obj.style.display = "block";
            } else {
                this.obj.style.display = "none";
            }
        }

        //是否只读
        if (typeof chkReadOnly == "object") {
            if (chkReadOnly.checked == true) {
                this.obj.readOnly = true;
            } else {
                this.obj.readOnly = false;
                this.obj.removeAttribute("readOnly")
            }
        }

        //是否透明
        if (typeof chkNotBg == "object") {
            if (chkNotBg.checked == true) {
                this.obj.style.backgroundColor = "";
            }
        }

        //边界风格-是否有左边线
        if (typeof chkLeftLine == "object") {
            if (chkLeftLine.checked) {
                this.obj.style.cssText = RepStr(this.obj.style.cssText, "BORDER-LEFT: 0px;", "")
                if (this.obj.tagName == "DIV") {
                    this.obj.style.borderLeft = "1px solid black";
                }
            } else {
                this.obj.style.borderLeft = "0px";

            }
        }

        //边界风格-是否有上边线
        if (typeof chkTopLine == "object") {
            if (!chkTopLine.checked) {
                this.obj.style.borderTop = "0px";
            } else {
                this.obj.style.cssText = RepStr(this.obj.style.cssText, "BORDER-TOP: 0px;", "")
                if (this.obj.tagName == "DIV") {
                    this.obj.style.borderTop = "1px solid black";
                }
            }
        }

        //边界风格-是否有下边线
        if (typeof chkBottomLine == "object") {
            if (!chkBottomLine.checked) {
                this.obj.style.borderBottom = "0px";
            } else {
                this.obj.style.cssText = RepStr(this.obj.style.cssText, "BORDER-BOTTOM: 0px;", "")
                if (this.obj.tagName == "DIV") {
                    this.obj.style.borderBottom = "1px solid black";
                }
            }
        }

        //边界风格-是否有右边线
        if (typeof chkRightLine == "object") {
            if (!chkRightLine.checked) {
                this.obj.style.borderRight = "0px";
            } else {
                this.obj.style.cssText = RepStr(this.obj.style.cssText, "BORDER-RIGHT: 0px;", "")
                if (this.obj.tagName == "DIV") {
                    this.obj.style.borderRight = "1px solid black";
                }
            }
        }

        //定位模式
        if (typeof cboPosition == "object")
            this.obj.style.position = cboPosition.value;

        //对其方式    
        if (typeof cboAlign == "object") {
            this.obj.style.textAlign = cboAlign.value;
        }

        if (typeof txtContainerImgSrc == "object") {
            this.obj.style.backgroundImage = "url(" + txtContainerImgSrc.value + ")";
        }

        if (typeof demoImageObj == "object") {
            if (typeof this.obj.SmallImageSrc != "undefined") {
                this.obj.SmallImageSrc = demoImageObj.src;
            }
            else {
                this.obj.setAttribute("SmallImageSrc", demoImageObj.src);
            }
        }

        if (typeof repeatType == "object") {
            this.obj.style.backgroundRepeat = GetRepeatType();
        }

        if (typeof selDisplay == "object") {
            this.obj.style.display = selDisplay.value;
        }

        if (typeof cboVAlign == "object") {
            this.obj.vAlign = cboVAlign.value;
        }
    },

    synchronFontList: function () {
        if (this.obj == null) this.loadCurObj();
        if (this.obj == null) return;
        if (typeof displayfont == "object") {
            this.obj.style.fontStyle = displayfont.style.fontStyle;
            this.obj.style.textDecoration = displayfont.style.textDecoration;
            this.obj.style.fontFamily = displayfont.style.fontFamily;
            this.obj.style.fontSize = displayfont.style.fontSize;
            this.obj.style.fontWeight = displayfont.style.fontWeight;
            this.obj.style.color = displayfont.style.color;
            this.obj.change = "是";
        }
    },

    //同步事件
    synchronEvent: function () {
        if (this.obj == null) this.loadCurObj();
        if (this.obj == null) return;
        var s = "";
        //点击事件
        if (typeof txtEclick == "object") {
            s = new Str().trim(txtEclick.value);
            if (s == "") {
                this.obj.removeAttribute('_onclick');
            } else {
                if (this.obj.id.substr(this.obj.id.indexOf('_') + 1, 6) == "editor") {
                    this.obj._onclick = s.replace("this.value", "this.document.body.innerText");
                } else {
                    this.obj._onclick = s;
                }
            }
        }
        //改变事件
        if (typeof txtEchange == "object") {
            s = new Str().trim(txtEchange.value);
            if (s == "") {
                this.obj.removeAttribute('_onchange');
            } else {
                if (this.obj.id.substr(this.obj.id.indexOf('_') + 1, 6) == "editor") {
                    this.obj._onchange = s.replace("this.value", "this.document.body.innerText");
                } else {
                    this.obj._onchange = s;
                }
            }
        }
        //双击事件
        if (typeof txtEdblclick == "object") {
            s = new Str().trim(txtEdblclick.value);
            if (s == "") {
                this.obj.removeAttribute('_ondblclick');
            } else {
                if (this.obj.id.substr(this.obj.id.indexOf('_') + 1, 6) == "editor") {
                    this.obj._ondblclick = s.replace("this.value", "this.document.body.innerText");
                } else {
                    this.obj._ondblclick = s;
                }
            }
        }
        //获取焦点事件
        if (typeof txtEfocus == "object") {
            s = new Str().trim(txtEfocus.value);
            if (s == "") {
                this.obj.removeAttribute('_onfocus');
            } else {
                if (this.obj.id.substr(this.obj.id.indexOf('_') + 1, 6) == "editor") {
                    this.obj._onfocus = s.replace("this.value", "this.document.body.innerText");
                } else {
                    this.obj._onfocus = s;
                }
            }
        }
        //移出事件
        if (typeof txtEblur == "object") {
            s = new Str().trim(txtEblur.value);
            if (s == "") {
                this.obj.removeAttribute('_onblur');
            }
            else {
                if (this.obj.id.substr(this.obj.id.indexOf('_') + 1, 6) == "editor") {
                    this.obj._onblur = s.replace("this.value", "this.document.body.innerText");
                } else {
                    this.obj._onblur = s;
                }
            }
        }
        //按键事件
        if (typeof txtEkey == "object") {
            s = new Str().trim(txtEkey.value);
            if (s == "") {
                this.obj.removeAttribute('_onkeydown');
            }
            else {
                if (this.obj.id.substr(this.obj.id.indexOf('_') + 1, 6) == "editor") {
                    this.obj._onkeydown = s.replace("this.value", "this.document.body.innerText");
                } else {
                    this.obj._onkeydown = s;
                }
            }
        }
        //按键事件
        if (typeof txtEkeyup == "object") {
            s = new Str().trim(txtEkeyup.value);
            if (s == "") {
                this.obj.removeAttribute('_onkeyup');
            }
            else {
                if (this.obj.id.substr(this.obj.id.indexOf('_') + 1, 6) == "editor") {
                    this.obj._onkeyup = s.replace("this.value", "this.document.body.innerText");
                } else {
                    this.obj._onkeyup = s;
                }
            }
        }


    },

    //同步数据源
    synchronDataSource: function () {
        if (this.obj == null) this.loadCurObj();
        if (this.obj == null) return;
        //所属数据集ID
        if (typeof txtDataTable == "object") {
            this.obj.DtClientId = txtDataTable.value;
        }

        //对应的数据集字段
        if (typeof txtField == "object") {
            this.obj.ColumnName = txtField.value;
        }

        //对应的数据集字段
        if (typeof selDataMode == "object") {
            this.obj.DataMode = selDataMode.value;
            if (selDataMode.value == "Value") {
                //所属数据集ID
                if (typeof txtDataTableValue == "object") {
                    this.obj.DtClientId = txtDataTableValue.value;
                }

                //对应的数据集字段
                if (typeof txtFieldValue == "object") {
                    this.obj.ValueColumnName = txtFieldValue.value;
                }
            } else if (selDataMode.value == "Text") {
                //所属数据集ID
                if (typeof txtDataTableText == "object") {
                    this.obj.DtClientId = txtDataTableText.value;
                }

                //对应的数据集字段
                if (typeof txtFieldText == "object") {
                    this.obj.TextColumnName = txtFieldText.value;
                }
            } else if (selDataMode.value == "Both") {
                //所属数据集ID
                if (typeof txtDataTableValue == "object") {
                    this.obj.DtClientId = txtDataTableValue.value;
                }

                //对应的数据集字段
                if (typeof txtFieldValue == "object") {
                    this.obj.ValueColumnName = txtFieldValue.value;
                }

                //所属数据集ID
                if (typeof txtDataTableText == "object") {
                    this.obj.DtClientId = txtDataTableText.value;
                }

                //对应的数据集字段
                if (typeof txtFieldText == "object") {
                    this.obj.TextColumnName = txtFieldText.value;
                }
            }
        }

        /****************** 下拉列表，单选框属性页数据源配置 ****************/
        //数据来源方式(自定义数据源、数据库数据源)
        if (typeof dataSourceType == "object") {
            //获取radio控件集合
            var chkObjs = document.getElementsByName("dataSourceType");
            //获取选中值
            for (var i = 0; i < chkObjs.length; i++) {
                if (chkObjs[i].checked) {
                    this.obj.DataSourceType = chkObjs[i].value;
                    break;
                }
            }
        }

        if (this.obj.DataSourceType == "TextDataSource") {
            //自定义数据源内容
            if (typeof txtTextSource == "object") {
                this.obj.TextDataSource = txtTextSource.value;
            }
        }
        if (this.obj.DataSourceType == "DbDataSource") {
            //数据库数据源值字段名
            if (typeof txtDBValueColumn == "object") {
                this.obj.DbValueColumn = txtDBValueColumn.value;
            }

            //数据库数据源文本字段名
            if (typeof txtDBTextColumn == "object") {
                this.obj.DbTextColumn = txtDBTextColumn.value;
            }

            //数据库数据数据源SQL
            if (typeof txtAreaDBSql == "object") {
                this.obj.DbDataSource = txtAreaDBSql.innerHTML;
            }
        }
    },

    //同步基本校验信息
    synchronBaseValid: function () {
        if (this.obj == null) this.loadCurObj();
        if (this.obj == null) return;
        if (typeof chkIsRequired == "object" && chkIsRequired.checked) {
            var sEmptyMsg = "";
            if (typeof txtNoEmptyAlertMsg == "object") {
                sEmptyMsg = txtNoEmptyAlertMsg.value;
            }
            this.obj.IsRequired = "true";
            this.obj.NoEmptyAlertMsg = sEmptyMsg;
        } else if (typeof chkIsRequired == "object") {
            this.obj.IsRequired = "false";
            this.obj.NoEmptyAlsertMsg = "";
        }

        if (typeof chkIsXMLSpecialChar == "object" && chkIsXMLSpecialChar.checked) {
            this.obj.IsXMLSpecialChar = "true";
            var sSpecialMsg = "";
            if (typeof txtSpecialCharAlertMsg == "object") {
                sSpecialMsg = txtSpecialCharAlertMsg.value;
            }
            this.obj.IsXMLSpecialChar = "true";
            this.obj.SpecialCharAlertMsg = sSpecialMsg;
        }
        else if (typeof chkIsXMLSpecialChar == "object") {
            this.obj.IsXMLSpecialChar = "false";
            this.obj.SpecialCharAlertMsg = "";
        }

        if (typeof chkLengthValid == "object" && chkLengthValid.checked) {
            var minLength, maxLength, msg = "";
            if (typeof txtValidLengthMin == "object") {
                minLength = parseInt(txtValidLengthMin.value);
                maxLength = parseInt(txtValidLengthMax.value);

            }
            if (typeof chkLengthValid == "object") {
                msg = txtlengthValidAlertMsg.value;
            }
            this.obj.IsLengthValid = "true";
            this.obj.LengthValidInfo = minLength + "," + maxLength + ",'" + msg + "'";
        } else if (typeof chkLengthValid == "object") {
            this.obj.IsLengthValid = "false";
            this.obj.LengthValidInfo = "";
        }

        if (typeof SystemVariables == "object") {
            this.obj.SystemVariables = SystemVariables.value;
        }
        if (typeof txtValidSeq == "object") {
            this.obj.setAttribute("ValidSeq", txtValidSeq.value);
        }
        if (typeof txtCommitValidFucNames == "object") {
            this.obj.setAttribute("CommitValidFucNames", txtCommitValidFucNames.value);
        }
    }
}

/*--显示字体、字号等属性同步--*/
function PropWinFontAction(obj, obj1) {
    if (obj1.change == "是") {
        obj.style.color = obj1.style.color;
        obj.style.fontStyle = obj1.style.fontStyle;
        obj.style.textDecoration = obj1.style.textDecoration;
        obj.style.fontFamily = obj1.style.fontFamily;
        obj.style.fontSize = obj1.style.fontSize;
        obj.style.fontWeight = obj1.style.fontWeight;
    }
}

/*--是否可见属性同步--*/
function PropWinDisplayAction(obj, chkObj) {
    if (chkObj.value == '否') {
        obj.style.display = "none";
    } else {
        obj.style.cssText = RepStr(obj.style.cssText, "DISPLAY: none;", "");
    }
}

function SetTextValue(oP, oCont) {
    if (!SysF_IsNoEmpty(oP)) {
        oCont.value = "";
    } else {
        oCont.value = oP;
    }
}

function SetCheckBoxPutValue(oP, oCont) {
    if (!SysF_IsNoEmpty(oP)) {
        SetCheckBoxValue(oCont, "否");
    } else {
        SetCheckBoxValue(oCont, oP);
    }
}

function SetCheckBoxValue(obj, sValue) {
    var oInput = obj.children[0];
    var oSpan = null;
    if (obj.children[0] && obj.children[0].tagName == "SPAN") {
        oInput = obj.children[1];
        oSpan = obj.children[0];
    }
    if (obj.truevalue == sValue) {
        oInput.checked = true;
        if (oSpan != null) {
            oSpan.className = oSpan.className.replace("_nocheck_", "_check_");
        }
    } else {
        oInput.checked = false;
        if (oSpan != null) {
            oSpan.className = oSpan.className.replace("_check_", "_nocheck_");
        }
    }
    obj.Value = sValue;
}

function SelectAddOption(obj, sHtml) {
    var ss = obj.outerHTML;
    return ss.substring(0, ss.length - 9) + sHtml + "</select>";
}


var SysForm = Class.create();
SysForm.prototype = {
    initialize: function () { },
    selColor: SelColor,
    selFgColor: SelFgColor,
    selFunction: SelFunction,
    setButtonImage: function () {
        var i = 1;
        var bmpPath = "../skins/" + publicform.toolBarStyle + "/images/buttons/ef_run_downarrow.gif";
        while ($id("cmdDropDown" + i) != null) {
            var obj = $id("cmdDropDown" + i);
            obj.style.width = "16px";
            obj.style.height = "18px";
            SetButtonImage(obj, bmpPath);
            i++;
        }
    },
    setValue: function (oCont, value) {
        if (SysF_IsNoEmpty(value) == false) {
            if (oCont.controltype == "radio") {
                new Napi.BaseCont().setRadioValue(oCont, value);
            } else if (oCont.controltype == "checkbox") {
                new Napi.BaseCont().setCheckBoxValue(oCont, value);
            } else {
                oCont.value = value;
            }
        }
    },
    jsonToCont: function (oJson, arrContId) {
        for (var i = 0; i < arrContId.length; i++) {
            this.setValue($id(arrContId[i]), oJson[arrContId[i]]);
        }
    },
    contToJson: function (oJson, arrContId) {
        for (var i = 0; i < arrContId.length; i++) {
            oJson[arrContId[i]] = $id(arrContId[i]).value;
        }
    }
}

/****************** 选中颜色框中的颜色 *****************/
function SelColor(obj, sTag) {
    var oFont = document.getElementById('displayfont');
    if (typeof obj != "undefined") oFont = $id(obj.id);
    var sInitColor = oFont.style.backgroundColor;
    if (sTag == 1) sInitColor = oFont.style.borderColor;
    var sColor;
    if (SysF_IsNoEmpty(sInitColor) == false) sColor = dlgHelper.ChooseColorDlg();
    else sColor = dlgHelper.ChooseColorDlg(sInitColor);
    sColor = sColor.toString(16);
    if (sColor.length < 6) {
        var sTempString = "000000".substring(0, 6 - sColor.length);
        sColor = sTempString.concat(sColor);
    }
    if (typeof (sTag) == "undefined") {
        oFont.style.backgroundColor = sColor;
        oFont.changebg = "是";
    } else {
        if (sTag == 1) sTag = "borderColor";
        var sCommand = obj.id + ".style." + sTag + "=\"" + sColor + "\"";
        eval(sCommand);
    }
}

function SelFgColor(obj) {
    var oFont = document.getElementById('displayfont');
    if (typeof obj != "undefined") oFont = $id(obj.id);

    var sInitColor = oFont.style.color;
    var sColor;
    if (SysF_IsNoEmpty(sInitColor) == false) sColor = dlgHelper.ChooseColorDlg();
    else sColor = dlgHelper.ChooseColorDlg(sInitColor);
    sColor = sColor.toString(16);
    if (sColor.length < 6) {
        var sTempString = "000000".substring(0, 6 - sColor.length);
        sColor = sTempString.concat(sColor);
    }
    oFont.style.color = sColor;
}

function SelFunction(obj) {
    var arr = new Array();
    arr[0] = publicform.obj[5];
    try {
        arr[1] = arrRegFuncList;
    } catch (e) { }

    var arrMutexValid = [
         ["$valid('正数')", "$valid('负数')"],
         ["$valid('正整数')", "$valid('负整数')"],
         ["$valid('零或正数')", "$valid('零或负数')"],
         ["$valid('零或正整数')", "$valid('零或负整数')"]];

    var sRet = OpenAttributeForm('funclist', arr, '选择函数');
    if (SysF_IsNoEmpty(sRet)) {
        sRet = SysF_Trim(sRet);
        if (sRet.match(/^\$valid\(("|').*\1\)/)) {
            if (obj.value == "") {
                obj.value = sRet;
            } else if (obj.value.toString().indexOf(sRet) > -1) {
                alert("该函数已被选择了！");
            } else if (!mutex(obj, sRet, arrMutexValid)) {
                obj.value += sRet;
            }

        } else {
            obj.value = sRet;
        }
    }
}

function mutex(obj, sRet, arrMutexValid) {
    var bExistMutex = false;
    var arrValid = null, bFound = false, row = -1, col = -1;
    if (obj.value.toString().indexOf(";") != -1) {
        arrValid = (obj.value + sRet).toString().split(";");

    }
    for (var i = 0; i < arrValid.length - 1; i++) { //要比较的轮数
        for (var j = 0; j < arrMutexValid.length; j++) {
            for (var k = 0; k < arrMutexValid[j].length; k++) {
                if (arrValid[i].match(/^\$valid\(("|').*\1\)/) && arrValid[i] == arrMutexValid[j][k]) {
                    bFound = true;
                    row = j;
                    col = k;
                    break;
                }
            }
            if (bFound) break;
        }
        if (bFound) {
            for (var m = 0; m < arrValid.length - 1; m++) {
                for (var n = 0; n < arrMutexValid[row].length; n++) {
                    if (m == i) {
                        break;
                    } else if (n == col) {
                        continue;
                    }
                    if (arrValid[m] == arrMutexValid[row][n]) {
                        alert("存在互斥的验证！" + arrMutexValid[row][n] + "和" + arrMutexValid[row][col]);
                        bExistMutex = true;
                        return true;
                    }
                }
            }
        }
        bFound = false;
    }
    return false;
}

/* 设置Radio值 */
function SetRadioValue(r1, sValue) {
    r1.value = sValue;
    for (var i = 1; i < r1.childNodes.length; i++) {
        if (typeof r1.childNodes(i).tagName != "undefined") {
            if (r1.childNodes(i).tagName.toUpperCase() == "INPUT") {
                if (r1.childNodes(i).value == r1.value) {
                    r1.childNodes(i).checked = true;
                    if (r1.childNodes(i).className == "ef_out") {
                        var radioEl = document.getElementsByName(r1.childNodes(i).name);
                        for (var i = radioEl.length; i > 0; i--) {
                            if (radioEl[i - 1].type && radioEl[i - 1].type == "radio") {
                                radioEl[i - 1].previousSibling.className = radioEl[i - 1].previousSibling.className.replace(/ef_input_radio_[^_]+_(out|over)/, "ef_input_radio_" + (radioEl[i - 1].checked ? "" : "no") + "check_$1");
                            }
                        }
                    }
                    break;
                }
            }

            if (r1.childNodes(i).tagName.toUpperCase() == "TABLE") {
                var oTable = r1.childNodes(i);
                for (var j = 0; j < oTable.rows.length; j++) {
                    for (var k = 0; k < oTable.rows(j).cells.length; k++) {
                        var oRadio = oTable.rows(j).cells(k).childNodes(0);
                        if (oRadio.value == sValue) {
                            oRadio.checked = true;
                            return;
                        }
                    }
                }
            }
        }
    }
}

/************ 鼠标单击的事件 *************/
// sKey: 要调用的方法
function bill_onclick(sKey) {
    // LoadMod(sKey, "click");
}

/************ 鼠标双击的事件 *************/
// sKey: 要调用的方法
function bill_ondblclick(sKey, ogrid) {
    //  LoadMod(sKey, "click");
}

/************ 鼠标进入的事件 *************/
// sKey: 要调用的方法
function bill_onenter(sKey) {
    // LoadMod(sKey, "click");
}

/************ 鼠标移出的事件 *************/
// sKey: 要调用的方法

function bill_onexit(sKey) {
    if (document.elementFromPoint) {
        var obj = document.elementFromPoint(event.x, event.y);
        if (obj != null && obj.type && obj.type == "button" && obj.id == "btnCancle") {
            obj.click();
            return;
        }
    }
    if (event.y < -22) {//模态框地址栏高度
        document.getElementById("btnCancle").click();
        return;
    }
    //alert(event.clientX + ' blur  ' + event.clientY);
    //  LoadMod(sKey, "click");
}


/* 按键触发的事件 */
// sKey: 要调用的方法
function bill_onkeydown(sKey) {
    //LoadMod(sKey, "click");
}

/* 按键事件 */
function RunTabindex() {
    var sXml = publicform.area.billtaborder;
    if (sXml == "<root></root>") return;
    var ikeycode = event.keyCode;

    if (ikeycode == 9) {
        var bRunUp = false;
        if (ikeycode == 38) bRunUp = true;
        curID = event.srcElement.id;
        if (curID == "chk") curID = event.srcElement.parentNode.parentNode.id;
        if (SysF_IsNoEmpty(curID) == false) curID = event.srcElement.parentNode.id;
        if (curID == "fc_txtName") curID = event.srcElement.parentNode.id;
        if (curID == "Numedit") curID = event.srcElement.parentNode.id;
        if (event.srcElement.id == "txtMyGrid") curID = event.srcElement.parentNode.parentNode.id;
        if (event.srcElement.id == "t") curID = event.srcElement.parentNode.parentNode.id;
        if (event.srcElement.tagName.toUpperCase() == "TD") curID = event.srcElement.parentNode.parentNode.parentNode.parentNode.parentNode.id;

        sXml = publicform.area.billtaborder;
        var oXml = new ActiveXObject("Microsoft.XMLDOM");
        oXml.async = false;
        oXml.loadXML(sXml);
        var b1 = false;
        for (var i = 0; i < oXml.documentElement.childNodes.length; i++) {
            if (oXml.documentElement.childNodes(i).text == curID) {
                b1 = true;
                break;
            }
        }
        if (b1 == false) {
            i = 0;
        }

        var iLoops = 1;
        while (iLoops < 20) {
            if (bRunUp) {
                if (i == 0) i = oXml.documentElement.childNodes.length - 1;
                else i = i - 1;
            } else {
                if (i == oXml.documentElement.childNodes.length - 1) i = 0;
                else i = i + 1;
            }

            var nextObj = eval(oXml.documentElement.childNodes(i).text);
            var stagname1 = nextObj.tagName.toUpperCase();
            if (nextObj.disabled || nextObj.style.display == "none") {
                iLoops++;
                continue;
            } else {
                if (stagname1 == "FIELDSET") {
                    if (nextObj.childNodes.length > 1) try {
                        nextObj.childNodes(1).focus();
                    } catch (E) { }
                } else if (stagname1 == "FC_CODE") {
                    nextObj.txt.focus();
                } else if (stagname1 == "DIV") {
                    try {
                        nextObj.txt.focus();
                    } catch (e) { }
                } else if (stagname1 == "WEBGRID") {
                    if (nextObj.visible == "是") {
                        if (nextObj.tab.rows.length >= nextObj.FixRows) {
                            nextObj.SetFocus(nextObj.FindFirstTD(nextObj.FixRows), "程序给焦点");
                        } else {
                            nextObj.SetFocus(null, "");
                            nextObj.curTD.focus();
                        }
                    } else {
                        iLoops++;
                        continue;
                    }
                } else {
                    try {
                        nextObj.focus();
                    } catch (E) { }
                }
            }
            iLoops = 21;
        }
        event.returnValue = false;
    }

}

/********************* 自动布局 **********************/
function PropWinClickAutoSize() {
    var arr = new Array();
    arr[0] = publicform.obj[0];
    arr[1] = publicform.obj[2];
    //DjOpen("FormAutoResize", arr, "展现", "有模式窗口", "直接", "自动布局");
    //OpenAttributeForm('userfunction', arr, "自动布局");
}

/********************* 同步位置大小属性 **********************/
function SetPosOnChange(oCont, pos) {
    var obj = event.srcElement;
    obj.value = obj.value.replace(/\s+/g, "");
    if (!obj.value.match(/^\s*(\d+\s*(px)?)\s*$/)) {
        alert("高、宽以及位置属性须为数字！");
        return;
    }
    if (typeof txtLeft == "object" && obj.value == txtLeft.value) {
        oCont.style.left = obj.value;
    }
    if (typeof txtTop == "object" && obj.value == txtTop.value) {
        oCont.style.top = obj.value;
    }
    if (typeof txtWidth == "object" && obj.value == txtWidth.value) {
        oCont.style.width = obj.value;
    }
    if (typeof txtHeight == "object" && obj.value == txtHeight.value) {
        oCont.style.height = obj.value;
    }
    if (typeof txtAreaWidth == "object" && obj.value == txtAreaWidth.value) {
        oCont.style.width = obj.value;
    }
    if (typeof txtAreaHeight == "object" && obj.value == txtAreaHeight.value) {
        oCont.style.height = obj.value;
    }
    if (typeof txtEditingWidth == "object" && obj.value == txtEditingWidth.value) {
        oCont.style.width = obj.value;
    }
    if (typeof txtEditingHeight == "object" && obj.value == txtEditingHeight.value) {
        oCont.style.height = obj.value;
    }
}

/******************* 清空属性页选择的字段 **********************/
function ClearField() {
    if (typeof txtDataTable == "object") {
        txtDataTable.value = "";
    }
    if (typeof txtField == "object") {
        txtField.value = "";
    }
    if (typeof txtDescript == "object") {
        txtDescript.value = "";
    }
}

function ClearValueField() {
    if (typeof txtDescriptValue == "object") {
        txtDescriptValue.value = "";
    }
    if (typeof txtDataTableValue == "object") {
        txtDataTableValue.value = "";
    }
    if (typeof txtFieldValue == "object") {
        txtFieldValue.value = "";
    }
}

function ClearTextField() {
    if (typeof txtDescriptText == "object") {
        txtDescriptText.value = "";
    }
    if (typeof txtDataTableText == "object") {
        txtDataTableText.value = "";
    }
    if (typeof txtFieldText == "object") {
        txtFieldText.value = "";
    }
}


/*************** 获得图片平铺类型 ***************/
function GetRepeatType() {
    var selectedRepeatTyle = "";
    if (typeof repeatType == "object") {
        for (var n = 0; n < repeatType.options.length; n++) {
            if (repeatType.options[n].selected == true) {
                selectedRepeatTyle = repeatType.options[n].value;
                break;
            }
        }
    }
    return selectedRepeatTyle;
}

/*************** 设置图片平铺类型 ***************/
function SetRepeatType(selectedRepeatTyle) {
    if (typeof repeatType == "object") {
        for (var n = 0; n < repeatType.options.length; n++) {
            if (repeatType.options[n].value == selectedRepeatTyle) {
                repeatType.options[n].selected = true;
                break;
            }
        }
    }
}

function SelectImgObj() {
    var sRet = OpenAttributeForm('imgManage', demoImageObj, "图片管理器");
    if (typeof txtFieldSrc == "object") {
        txtFieldSrc.value = demoImageObj.BigSrc;
    }
    if (typeof txtFieldAlt == "object") {
        txtFieldAlt.value = demoImageObj.alt;
    }
}

/************* 清除容器背景图片 ***************/
function ClearBgImage() {
    if (typeof txtFieldSrc == "object") {
        txtFieldSrc.value = "";
    }
    if (typeof demoImageObj == "object") {
        demoImageObj.alt = "暂无";
        demoImageObj.removeAttribute("src");
    }
}


//获得控件样式选择项字符串
function GetControlStyleOption(controlName) {
    var baseOption = "";
    var controlStyleNodes = GetControlStyleNodes(controlName);

    if (controlStyleNodes.length > 0) {
        for (var n = 0; n < controlStyleNodes.length; n++) {
            baseOption += GetOptionString(controlStyleNodes[n].getAttribute("Value"), controlStyleNodes[n].getAttribute("Name"));
        }
    }

    return baseOption;
}

//获得控件样式XML节点
function GetControlStyleNodes(controlName) {
    var skinNodes = null; //控件样式节点结合

    //获得控件样式配置文件的路径
    var sPathBase = location.protocol + "//" + location.host + publicform.path;
    sPathBase += "configfile/control_style.xml";
    var oXmlFile = SetDomFile(sPathBase);

    var controlNode = oXmlFile.getElementsByTagName("WebGrid"); //控件节点
    if (controlNode.length > 0) {
        skinNodes = controlNode[0].childNodes;
    }

    return skinNodes;
}

function GetOptionString(value, text) {
    var optionString = "<option value='" + value + "'>";
    optionString += text;
    optionString += "</option>";
    return optionString;
}

function SetCheckValueByBorder(oSource, sBorderType, oCheck) {
    if (parseInt(oSource.style[sBorderType]) != 0) {
        oCheck.checked = true;
    } else {
        oCheck.checked = false;
    }

}

function disableOrEnableContrsByFlag(bChkFlag) {
    var oControls = [];
    if (arguments.length >= 2) {
        oControls = Array.apply(oControls, arguments).slice(1);
        if (bChkFlag) {
            for (var i = 0, l = oControls.length; i < l; i++) {
                oControls[i].disabled = false;
            }
        } else {
            for (var i = 0, l = oControls.length; i < l; i++) {
                oControls[i].disabled = true;
            }
        }
    }
}


function validMax(oMax, oMin) {
    if (!SysF_IsNoEmpty(oMax.value)) {
        alert('不填值, 系统验证时默认最大值为1000');
        changeBorderColor(false, oMax, 1);
    } else if (SysF_IsPositiveInt(oMax.value)) {
        if (SysF_IsPositiveInt(oMin.value, undefined, oMin)) {
            if (parseInt(oMax.value) < parseInt(oMin.value)) {
                changeBorderColor(true);
                alert('最大值小于最小值了');
                if (document.activeElement != txtValidLengthMin) {
                    oMax.focus();
                } else {
                    changeBorderColor(false);
                }
            } else {
                changeBorderColor(false);
            }
        } else {
            alert('最小值必须为正整数!');
            if (document.activeElement != txtValidLengthMax) {
                oMin.focus();
            }
        }
    } else {
        alert('最大值必须为整数');
        if (document.activeElement != txtValidLengthMin) {
            oMax.focus();
        }
    }
}
function validMin(oMin) {
    var regExtraSpace = /^\s+(.*)\s+$/;
    var sMax = txtValidLengthMax.value.toString().replace(regExtraSpace, "$1");
    if (!SysF_IsPositiveInt(oMin.value)) {
        alert('输入值必须为正整数!');
        if (document.activeElement != txtValidLengthMax) {
            oMin.focus();
        }
    } else if (sMax.length != 0) {
        if (SysF_IsPositiveInt(txtValidLengthMax.value, undefined, txtValidLengthMax)) {
            if (parseInt(oMin.value) > parseInt(txtValidLengthMax.value)) {
                changeBorderColor(true);
                alert('最小值大于最大值');
                if (document.activeElement != txtValidLengthMax) {
                    oMin.focus();
                } else {
                    changeBorderColor(false);
                }
            } else {
                changeBorderColor(false);
            }
        } else {
            alert('输入的最大值必须为整数');
            if (document.activeElement != txtValidLengthMin) {
                txtValidLengthMax.focus();
            }
        }
    }
}

function PropWinChangeDisplay() {

}
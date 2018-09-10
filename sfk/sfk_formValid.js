
/******************** 系统通用验证库 *********************/


/*****************************数字处理函数*******************************************/

/* 验证是否为分机 */
function SysF_IsExtNum(sValue, sMsg, oToValidObj) {
    ///<summary>验证是否为分机</summary>
    ///<param name="sValue">要验证的值</param>
    ///<param name="sMsg">错误提示消息</param>
    ///<returns>是返回true否则返回false</returns>

    var reg = /^\d{2}-\d{3}-\d{8}(-\d{1,4})?$/;
    var bRet = reg.test(sValue);
    if (!bRet) {
        changeBorderColor(true, oToValidObj, oValidType.ExtNum);
        if (sMsg) {
            alert(sMsg);
        }
        return false;
    } else {
         changeBorderColor(false, oToValidObj, oValidType.ExtNum);
        return true;
    }

}

/* 验证数字 */
function SysF_IsNumber(sValue, sMsg) {
    ///<summary>验证是否为数字</summary>
    ///<param name="sValue">要验证的值</param>
    ///<param name="sMsg">错误提示消息</param>
    ///<returns>是返回true否则返回false</returns>

    var regNumber = /^(\d)*$/;
    var bRet = regNumber.test(sValue);
    if (!bRet) {
        changeBorderColor(true);
        if (sMsg) {
            alert(sMsg);
        }
        return false;
    } else {
        changeBorderColor(false);
        return true;
    }
}

/* 验证小数 */
function SysF_IsDecimal(sValue, sMsg) {
    ///<summary>验证是否为小数</summary>
    ///<param name="sValue">要验证的值</param>
    ///<param name="sMsg">错误提示消息</param>
    ///<returns>是返回true否则返回false</returns>

    var regDecimal = /^(-|\+)?\d+(\.\d+)?$/;
    var bRet = regDecimal.test(sValue);
    if (!bRet) {
        changeBorderColor(true);
        if (sMsg) {
            alert(sMsg);
        }
        return false;
    } else {
        changeBorderColor(false);
        return true;
    }
}

/* 验证浮点数 */
function SysF_IsFloat(sValue, sMsg) {
    ///<summary>验证是否为浮点数</summary>
    ///<param name="sValue">验证的值</param>
    ///<param name="sMsg">错误提示消息</param>
    ///<returns>是返回true否则返回false</returns>

    var regFloat = /^(-)?(\d)*(\.)?(\d)*$/;
    var bRet = regFloat.test(sValue);
    if (!bRet) {
        changeBorderColor(true);
        if (sMsg) {
            alert(sMsg);
        }
        return false;
    } else {
        changeBorderColor(false);
        return true;
    }
}

/* 验证浮点数 */
function SysF_IsPositiveFloat(sValue, sMsg, oToValidObj) {
    ///<summary>验证是否为浮点数</summary>
    ///<param name="sValue">验证的值</param>
    ///<param name="sMsg">错误提示消息</param>
    ///<returns>是返回true否则返回false</returns>

    var regFloat = /^(\d)*(\.)?(\d)*$/;
    var bRet = regFloat.test(sValue);
    if (!bRet) {
        changeBorderColor(true, oToValidObj, oValidType.PositiveFloat);
        if (sMsg) {
            alert(sMsg);
        }
        return false;
    } else {
        changeBorderColor(false, oToValidObj, oValidType.PositiveFloat);
        return true;
    }
}


/* 验证整数(包含正整数和负整数) */
function SysF_IsInt(sValue, sMsg, oToValidObj) {
    ///<summary>验证整数,包含正整数和负整数</summary>
    ///<param name="sValue">要验证的值</param>
    ///<param name="sMsg">错误提示消息</param>
    ///<returns>是返回true否则返回false</returns>

    var regPositive = /^(-|\+)?(\d)+$/;
    var bRet = regPositive.test(sValue);
    if (!bRet) {
        changeBorderColor(true, oToValidObj, oValidType.PositiveValid);
        if (sMsg) {
            alert(sMsg);
        }
        return false;
    } else {
        changeBorderColor(false, oToValidObj, oValidType.PositiveValid);
        return true;
    }
}

/* 验证是否为正整数 */
function SysF_IsPositiveInt(sValue, sMsg, oToValidObj) {
    ///<summary>验证是否为正整数</summary>
    ///<param name="sValue">要验证的值</param>
    ///<param name="sMsg">错误提示消息</param>
    ///<returns>是返回true否则返回false</returns>

    var reg = /^[0-9]+\d*$/;
    var bRet = reg.test(sValue);
    if (!bRet) {
        changeBorderColor(true, oToValidObj, oValidType.PositiveIntValid);
        if (sMsg) {
            alert(sMsg);
        }
        return false;
    } else {
         changeBorderColor(false, oToValidObj, oValidType.PositiveIntValid);
        return true;
    }

}

/* 验证是否为负整数 */
function SysF_IsNegativeInt(sValue, sMsg) {
    ///<summary>验证是否为负整数</summary>
    ///<param name="sValue">要验证的值</param>
    ///<param name="sMsg">错误提示消息</param>
    ///<returns>是返回true否则返回false</returns>

    var regNegativeInt = /^-[1-9]+\d*$/;
    var bRet = regNegativeInt.test(sValue);
    if (!bRet) {
        changeBorderColor(true);
        if (sMsg) {
            alert(sMsg);
        }
        return false;
    } else {
        changeBorderColor(false);
        return true;
    }
}


/* 验证是否为零或正数 */
function SysF_IsZeroOrPositive(sValue, sMsg) {
    ///<summary>验证是否为零或正数</summary>
    ///<param name="sValue">要验证的值</param>
    ///<param name="sMsg">错误提示消息</param>
    ///<returns>是返回true否则返回false</returns>

    var regZeroOrPositive = /^\+?\d+(\.\d+)?$/;
    var bRet = regZeroOrPositive.test(sValue);
    if (!bRet) {
        changeBorderColor(true);
        if (sMsg) {
            alert(sMsg);
        }
        return false;
    } else {
        changeBorderColor(false);
        return true;
    }
}

/* 验证是否为正数 */
function SysF_IsPositive(sValue, sMsg) {
    ///<summary>验证是否为正数</summary>
    ///<param name="sValue">要验证的值</param>
    ///<param name="sMsg">错误提示消息</param>
    ///<returns>是返回true否则返回false</returns>

    var regPositive = /^\d+(?=\.{0,1}\d+$|$)/;
    var bRet = regPositive.test(sValue);
    if (!bRet) {
        changeBorderColor(true);
        if (sMsg) {
            alert(sMsg);
        }
        return false;
    } else {
        changeBorderColor(false);
        return true;
    }
}

/* 验证是否为零或负数 */
function SysF_IsZeroOrNegative(sValue, sMsg) {
    ///<summary>验证是否为零或负数</summary>
    ///<param name="sValue">要验证的值</param>
    ///<param name="sMsg">错误提示消息</param>
    ///<returns>是返回true否则返回false</returns>

    var regZeroOrNegative = /^((-\d+(\.\d+)?)|(0+(\.0+)?))$/;
    var bRet = regZeroOrNegative.test(sValue);
    if (!bRet) {
        changeBorderColor(true);
        if (sMsg) {
            alert(sMsg);
        }
        return false;
    } else {
        changeBorderColor(false);
        return true;
    }
}

/* 验证是否为负数 */
function SysF_IsNegative(sValue, sMsg) {
    ///<summary>验证是否为负数</summary>
    ///<param name="sValue">要验证的值</param>
    ///<param name="sMsg">错误提示消息</param>
    ///<returns>是返回true否则返回false</returns>

    var regNegative = /^((-\d+(\.\d+)?))$/;
    var bRet = regNegative.test(sValue);
    if (!bRet) {
        changeBorderColor(true);
        if (sMsg) {
            alert(sMsg);
        }
        return false;
    } else {
        changeBorderColor(false);
        return true;
    }
}


/* 验证是否为零或正整数 */
function SysF_IsZeroOrPositiveInt(sValue, sMsg) {
    ///<summary>验证是否为零或正整数</summary>
    ///<param name="sValue">要验证的值</param>
    ///<param name="sMsg">错误提示消息</param>
    ///<returns>是返回true否则返回false</returns>  

    var regZeroOrPositiveInt = /^\+?\d+$/;
    var bRet = regZeroOrPositiveInt.test(sValue);
    if (!bRet) {
        changeBorderColor(true);
        if (sMsg) {
            alert(sMsg);
        }
        return false;
    } else {
        changeBorderColor(false);
        return true;
    }
}


/* 验证是否为零或负整数 */
function SysF_IsZeroOrNegativeInt(sValue, sMsg) {
    ///<summary>验证是否为零或负整数</summary>
    ///<param name="sValue">要验证的值</param>
    ///<param name="sMsg">错误提示消息</param>
    ///<returns>是返回true否则返回false</returns>

    var regZeroOrNegativeInt = /^([0?]$)|(-\d*$)/;
    var bRet = regZeroOrNegativeInt.test(sValue);
    if (!bRet) {
        changeBorderColor(true);
        if (sMsg) {
            alert(sMsg);
        }
        return false;
    } else {
        changeBorderColor(false);
        return true;
    }
}


/********************************字母，符号，汉字处理**********************************************/

/* 验证是否含有字母、数字或下划线_ */
function SysF_IsContainWordChar(sValue, sMsg) {
    ///<summary>验证是否含有字母、数字或_任意一种</summary>
    ///<param name="sValue">要验证的值</param>
    ///<param name="ssMsg">错误提示消息</param>
    ///<returns>是返回true否则返回false</returns>

    var regWordChar = /[_|a-z|A-Z|0-9]/;
    var bRet = regWordChar.test(sValue);
    if (!bRet) {
        changeBorderColor(true);
        if (sMsg) {
            alert(sMsg);
        }
        return false;
    } else {
        changeBorderColor(false);
        return true;
    }
}

/*字母，数字或下划线字符*/
function SysF_IsName(sValue, sMsg) {
    ///<summary>验证字符串是否为字母，数字或下划线字符</summary>
    ///<param name="sValue">要验证的值</param>
    ///<param name="sMsg">错误提示消息</param>
    ///<returns>是返回true否则返回false</returns>

    var reg = /\W/;
    var bRet = reg.test(sValue);
    if (!bRet) {
        changeBorderColor(true);
        if (sMsg) {
            alert(sMsg);
        }
        return false;
    } else {
        changeBorderColor(false);
        return true;
    }
}

/* 验证字符串是否包含汉字 */
function SysF_IsContainChineseChar(sValue, sMsg) {
    ///<summary>验证字符串是否包含汉字</summary>
    ///<param name="sValue">要验证的值</param>
    ///<param name="sMsg">错误提示消息</param>
    ///<returns>是返回true否则返回false</returns>

    var reg = /[^\x00-\xFF]/g;
    var bRet = reg.test(sValue);
    if (!bRet) {
        changeBorderColor(true);
        if (sMsg) {
            alert(sMsg);
        }
        return false;
    } else {
        changeBorderColor(false);
        return true;
    }
}

/* 验证是否含有汉字、字母、数字或_ */
function SysF_IsContainChinaCharOrWord(sValue, sMsg) {
    ///<summary>验证是否含有汉字、字母、数字或_</summary>
    ///<param name="sValue">要验证的值</param>
    ///<param name="sMsg">错误提示消息</param>
    ///<returns>是返回true否则返回false</returns>

    //    var regChinaCharOrWordChar = /[_|a-z|A-Z|0-9|\u4e00-\u9fa5]/;
    var p = "^[0-9a-zA-Z\u4e00-\u9fa5]+$";
    var regChinaCharOrWordChar = new RegExp(p);
    var bRet = regChinaCharOrWordChar.test(sValue);
    if (!bRet) {
        changeBorderColor(true);
        if (sMsg) {
            alert(sMsg);
        }
        return false;
    } else {
        changeBorderColor(false);
        return true;
    }
}

/* 验证是否含有汉字 */
function SysF_IsContainChinaChar(sValue, sMsg) {
    ///<summary>验证是否含有汉字</summary>
    ///<param name="sValue">要验证的值</param>
    ///<param name="sMsg">错误提示消息</param>
    ///<returns>是返回true否则返回false</returns>

    var regChinaChar = /[^\x00-\xFF]/;
    var bRet = regChinaChar.test(sValue);
    if (!bRet) {
        changeBorderColor(true);
        if (sMsg) {
            alert(sMsg);
        }
        return false;
    } else {
        changeBorderColor(false);
        return true;
    }
}

/* 验证是否只包含汉字 */
function SysF_IsOnlyContainChinaChar(sValue, sMsg) {
    ///<summary>验证是否只包含汉字</summary>
    ///<param name="sValue">要验证的值</param>
    ///<param name="sMsg">错误提示消息</param>
    ///<returns>是返回true否则返回false</returns>

    var reg = /^[\u4e00-\u9fa5]*$/;
    var bRet = reg.test(sValue);
    if (!bRet) {
        changeBorderColor(true);
        if (sMsg) {
            alert(sMsg);
        }
        return false;
    } else {
        changeBorderColor(false);
        return true;
    }
}

/* 验证是否只包含小写英文字母 */
function SysF_IsOnlyContainLowerCase(sValue) {
    ///<summary>验证是否全是小写英文字母(只包含a-z之间)</summary>
    ///<param name="sValue">要验证的值</param>
    ///<param name="sMsg">错误提示消息</param>
    ///<returns>是返回true否则返回false</returns>

    var reg = /^[a-z]*$/;
    var bRet = reg.test(sValue);
    if (!bRet) {
        changeBorderColor(true);
        if (sMsg) {
            alert(sMsg);
        }
        return false;
    } else {
        changeBorderColor(false);
        return true;
    }
}

/* 验证是否只包含大写英文字母 */
function SysF_IsOnlyContainUpperCase(sValue) {
    ///<summary>验证是否全是大写英文字母(只包含A-Z之间)</summary>
    ///<param name="sValue">要验证的值</param>
    ///<param name="sMsg">错误提示消息</param>
    ///<returns>是返回true否则返回false</returns>

    var reg = /^[A-Z]*$/;
    var bRet = reg.test(sValue);
    if (!bRet) {
        changeBorderColor(true);
        if (sMsg) {
            alert(sMsg);
        }
        return false;
    } else {
        changeBorderColor(false);
        return true;
    }
}

/* 验证英文字母，不区分大小写  */
function SysF_IsOnlyContainLetter(sValue, sMsg) {
    ///<summary>验证是否为英文字母，不区分大小写</summary>
    ///<param name="sValue">要验证的值</param>
    ///<param name="sMsg">错误提示消息</param>
    ///<returns>是返回true否则返回false</returns>

    var regLetter = /^[a-zA-Z]*$/;
    var bRet = regLetter.test(sValue);
    if (!bRet) {
        changeBorderColor(true);
        if (sMsg) {
            alert(sMsg);
        }
        return false;
    } else {
        changeBorderColor(false);
        return true;
    }
}

/* 验证英文字母和数字，不区分大小写  */
function SysF_IsLetterOrNumber(sValue, sMsg) {
    ///<summary>验证是否为英文字母和数字，不区分大小写</summary>
    ///<param name="sValue">要验证的值</param>
    ///<param name="sMsg">错误提示消息</param>
    ///<returns>是返回true否则返回false</returns>

    var regLetterOrNumber = /^[a-zA-Z0-9]*$/;
    var bRet = regLetterOrNumber.test(sValue);
    if (!bRet) {
        changeBorderColor(true);
        if (sMsg) {
            alert(sMsg);
        }
        return false;
    } else {
        changeBorderColor(false);
        return true;
    }
}



/* 验证是否含有双引号 */
function SysF_IsContainDoubleQuote(sValue, sMsg) {
    ///<summary>验证是否含有双引号</summary>
    ///<param name="sValue">要验证的值</param>
    ///<param name="sMsg">错误提示消息</param>
    ///<returns>是返回true否则返回false</returns>

    var regDoubleQuote = /[\"]/;
    var bRet = regDoubleQuote.test(sValue);
    if (!bRet) {
        changeBorderColor(true);
        if (sMsg) {
            alert(sMsg);
        }
        return false;
    } else {
        changeBorderColor(false);
        return true;
    }
}


/* 验证是否含有单引号 */
function SysF_IsContainSingleQuote(sValue, sMsg) {
    ///<summary>验证是否含有单引号</summary>
    ///<param name="sValue">要验证的值</param>
    ///<param name="sMsg">错误提示消息</param>
    ///<returns>是返回true否则返回false</returns>   

    var regSingleQuote = /[\']/;
    var bRet = regSingleQuote.test(sValue);
    if (!bRet) {
        changeBorderColor(true);
        if (sMsg) {
            alert(sMsg);
        }
        return false;
    } else {
        changeBorderColor(false);
        return true;
    }
}





/************************************************验证********************************************/


/* 验证钱数,带单位 */
function SysF_IsMoney(sValue, strUnit, sMsg) {
    ///<summary>验证钱数,带单位</summary>
    ///<param name="sValue">验证的值</param>
    ///<param name="sMsg">错误提示消息</param>
    ///<param name="strUnit">单位</param>
    ///<returns>是返回true否则返回false</returns>

    var regMoney = eval("/^\\d+(\\.\\d{0," + (strUnit.length - 1) + "})?$/");
    var bRet = regMoney.test(sValue);
    if (!bRet) {
        changeBorderColor(true);
        if (sMsg) {
            alert(sMsg);
        }
        return false;
    } else {
        changeBorderColor(false);
        return true;
    }
}


/* 验证电话号码  */
function SysF_IsPhone(sValue, sMsg) {
    ///<summary>验证是否为电话号码</summary>
    ///<param name="sValue">要验证的值</param>
    ///<param name="sMsg">错误提示消息</param>
    ///<returns>是返回true否则返回false</returns>

    var regPhone = /^(\(\d{3,4}\)|\d{3,4}-|\s)?\d{7,14}$/;
    var bRet = regPhone.test(sValue);
    if (!bRet) {
        changeBorderColor(true);
        if (sMsg) {
            alert(sMsg);
        }
        return false;
    } else {
        changeBorderColor(false);
        return true;
    }
}


/* 判断是否为手机号码  */
function SysF_IsMobile(sValue, sMsg) {
    ///<summary>验证是否为手机号码</summary>
    ///<param name="sValue">要验证的值</param>
    ///<param name="sMsg">错误提示消息</param>
    ///<returns>是返回true否则返回false</returns>

    var regMobile = /(^0?[1][3|4|5|8][0-9]{9}(,0?[1][3|5|8][0-9]{9})*$)/;
    var bRet = regMobile.test(sValue);
    if (!bRet) {
        changeBorderColor(true);
        if (sMsg) {
            alert(sMsg);
        }
        return false;
    } else {
        changeBorderColor(false);
        return true;
    }
}


/* 判断是否为邮编 */
function SysF_IsPostcode(str, sMsg) {
    ///<summary>验证是否为邮编</summary>
    ///<param name="sValue">要验证的值</param>
    ///<param name="sMsg">错误提示消息</param>
    ///<returns>是返回true否则返回false</returns>

    var regPostcode = /^\d{6}$/;
    var bRet = regPostcode.test(str);
    if (!bRet) {
        changeBorderColor(true);
        if (sMsg) {
            alert(sMsg);
        }
        return false;
    } else {
        changeBorderColor(false);
        return true;
    }
}


/* 验证EMail */
function SysF_IsEmail(sValue, sMsg) {
    ///<summary>验证是否为EMail</summary>
    ///<param name="sValue">要验证的值</param>
    ///<param name="sMsg">错误提示消息</param>
    ///<returns>是返回true否则返回false</returns>

    var regEmail = /^[\w-]+@[\w-]+(\.(\w)+)*(\.(\w){2,3})$/;
    var bRet = regEmail.test(sValue);
    if (!bRet) {
        changeBorderColor(true);
        if (sMsg) {
            alert(sMsg);
        }
        return false;
    } else {
        changeBorderColor(false);
        return true;
    }
}

/* 验证URL */
function SysF_IsURL(sValue, sMsg) {
    ///<summary>验证是否为URL</summary>
    ///<param name="sValue">要验证的值</param>
    ///<param name="sMsg">错误提示消息</param>
    ///<returns>是返回true否则返回false</returns>

    var regURL = /^(file|http|https|ftp|mms|telnet|news|wais|mailto):\/\/(.+)$/;
    var bRet = regURL.test(sValue);
    if (!bRet) {
        changeBorderColor(true);
        if (sMsg) {
            alert(sMsg);
        }
        return false;
    } else {
        changeBorderColor(false);
        return true;
    }
}

/* 验证QQ */
function SysF_IsQQ(sValue, sMsg) {
    ///<summary>验证是否为QQ</summary>
    ///<param name="sValue">要验证的值</param>
    ///<param name="sMsg">错误提示消息</param>
    ///<returns>是返回true否则返回false</returns>

    var regQQ = /^[1-9]\d{4,9}$/;
    var bRet = regQQ.test(sValue);
    if (!bRet && sMsg) {
        alert(sMsg);
    }
    return bRet;
}

/* 验证身份证 */
//function SysF_IsIdCard(sValue, sMsg) {
//    ///<summary>验证是否为身份证</summary>
//    ///<param name="sValue">要验证的值</param>
//    ///<returns>是返回true否则返回false</returns>
//    var regExpInfo = /^(\w{15}|\w{18})$/;
//    return regExpInfo.test(sValue);
//}

function SysF_IsIdcard(sId, sMsg) {
        ///<summary>验证是否为身份证</summary>
        ///<param name="sId">要验证的值</param>
        ///<param name="sMsg">错误提示消息</param>
        ///<returns>是返回true否则返回false</returns>

        var aCity = {
            11: "北京", 12: "天津", 13: "河北", 14: "山西", 15: "内蒙古",
            21: "辽宁", 22: "吉林", 23: "黑龙江", 31: "上海", 32: "江苏",
            33: "浙江", 34: "安徽", 35: "福建", 36: "江西", 37: "山东", 41: "河南",
            42: "湖北", 43: "湖南", 44: "广东", 45: "广西", 46: "海南", 50: "重庆",
            51: "四川", 52: "贵州", 53: "云南", 54: "西藏", 61: "陕西", 62: "甘肃",
            63: "青海", 64: "宁夏", 65: "新疆", 71: "台湾", 81: "香港",
            82: "澳门", 91: "国外"
        };
        if (!/^\d{15}(\d{2}(\d|x))?$/i.test(sId)) {
            if (sMsg) alert(sMsg);
            return false;
        }
        if (aCity[parseInt(sId.substr(0, 2))] == null) {
            if (sMsg) alert(sMsg);
            return false;
        }
        if (sId.length == 15) {
            sBirthday = "19" + sId.substr(6, 2) + "-" + Number(sId.substr(8, 2)) + "-" + Number(sId.substr(10, 2));
        }
        else {
            sBirthday = sId.substr(6, 4) + "-" + Number(sId.substr(10, 2)) + "-" + Number(sId.substr(12, 2));
        }
        var d = new Date(sBirthday.replace(/-/g, "/"));
        if (sBirthday != (d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate())) {
            if (sMsg) alert(sMsg);
            return false;
        }
        if (sId.length == 18) {
            var iSum = 0
            sId = sId.replace(/x$/i, "a");
            for (var i = 17; i >= 0; i--) {
                iSum += (Math.pow(2, i) % 11) * parseInt(sId.charAt(17 - i), 11)
            }
            /*if (iSum % 11 != 1) {
                if (sMsg) alert(sMsg);
                return false;
            }*/
        }
        return true;
    }





    /**********************************日期时间处理**********************************************************/

    /* 验证时间  (XXX问题 只是时间格式) */
    function SysF_IsTime(sValue, sMsg) {
        ///<summary>验证是否为时间</summary>
        ///<param name="sValue">要验证的值</param>
        ///<param name="sMsg">错误提示消息</param>
        ///<returns>是返回true否则返回false</returns>

        var regTime = /^(\d+):(\d{1,2}):(\d{1,2})$/;
        var bRet = regTime.test(sValue);
        if (!bRet) {
            changeBorderColor(true);
            if (sMsg) {
                alert(sMsg);
            }
            return false;
        } else {
            changeBorderColor(false);
            return true;
        }
    }

    /* 验证日期  (可指定日期格式) */
    function SysF_IsDateByFormat(op, formatString, sMsg) {
        ///<summary>验证是否为时间</summary>
        ///<param name="op">要验证的值</param>
        ///<param name="formatString">日期格式("ymd","dmy") 默认"YMD"  Y四位或两位；</param>
        ///<param name="sMsg">错误提示消息</param>
        ///<returns>是返回true否则返回false</returns> ([12]\d{3})([-\.\/年])(0[1-9]|1[0-2])(\2|月)([0][1-9]|[12]\d|3[01])(日?)
        /// ([12]\d{3})([-\.\/])(0[1-9]|1[0-2])([-\.\/])([0][1-9]|[12]\d|3[01])

        formatString = formatString || "YYYY-MM-DD";
        var m, year, month, day;
        switch (formatString) {
            case "YYYY-MM-DD":
            case "YY-MM-DD":
                {
                    m = op.match(new RegExp("^((\\d{4})|(\\d{2}))([-./])(\\d{1,2})\\4(\\d{1,2})$"));
                    if (m == null) {
                        alert(sMsg);
                        return false;
                    }
                    day = m[6];
                    month = m[5] * 1;
                    year = (m[2].length == 4) ? m[2] : GetFullYear(parseInt(m[3], 10));
                    break;
                }
            case "DD-MM-YYYY":
                {
                    m = op.match(new RegExp("^(\\d{1,2})([-./])(\\d{1,2})\\2((\\d{4})|(\\d{2}))$"));
                    if (m == null) {
                        alert(sMsg);
                        return false;
                    }
                    day = m[1];
                    month = m[3] * 1;
                    year = (m[5].length == 4) ? m[5] : GetFullYear(parseInt(m[6], 10));
                    break;
                }
            case "YYYY年MM月DD日":
            default:
                {
                    break;
                }
        }
        if (!parseInt(month)) return false;
        month = month == 0 ? 12 : month;
        var date = new Date(year, month - 1, day);
        return (typeof (date) == "object" && year == date.getFullYear() && month == (date.getMonth() + 1) && day == date.getDate());
        function GetFullYear(y) {
            return ((y < 30 ? "20" : "19") + y) | 0;
        } 
    } 


/* 比较两个时间大小 (日期格式:yyyy-mm-dd hh:mi:ss,eg 2008-08-08) */
function SysF_CheckComDate(obj_dateBegain, obj_dateEnd) {
    ///<summary>比较两个时间大小(日期格式:yyyy-mm-dd hh:mi:ss,eg 2008-08-08);若开始时间比结束时间早则返回true，否则返回false</summary>
    ///<param name="obj_dateBegain">开始时间字符串</param>
    ///<param name="obj_dateEnd">结束时间字符串</param>
    ///<param name="sMsg">错误提示消息</param>
    ///<returns>若开始时间比结束时间早则返回true，否则返回false</returns>

    var dates, datee;
    dates = new Date(obj_dateBegain.substr(0, 4), parseInt(obj_dateBegain.substr(5, 2), 10)-1, obj_dateBegain.substr(8, 2));
    datee = new Date(obj_dateEnd.substr(0, 4), parseInt(obj_dateEnd.substr(5, 2), 10)-1, obj_dateEnd.substr(8, 2));
    if (dates <= datee) {
        if (dates == datee) {
            var dates1, datee1;
            dates1 = new Date(obj_dateBegain.substr(0, 4), obj_dateBegain.substr(5, 2)
                , obj_dateBegain.substr(8, 2), obj_dateBegain.substr(11, 2), obj_dateBegain.substr(14, 2)
                , obj_dateBegain.substr(17, 2));
            datee1 = new Date(obj_dateEnd.substr(0, 4), obj_dateEnd.substr(5, 2), obj_dateEnd.substr(8, 2)
            , obj_dateEnd.substr(11, 2), obj_dateEnd.substr(14, 2), obj_dateEnd.substr(17, 2));
            if (dates1 <= datee1)
                return true;
            else {
                return false;
            }
        }
        else {
            return true;
        }
    }
    else {
        return false;
    }
}


/************************限制键盘输入的数据类型********************************/

/*只允许输入数字 */
function SysF_NumOnly() {
    var i = window.event.keyCode;
    if ((i <= 57 && i >= 45) || (i >= 96 && i <= 105) || (i == 8) || (i == 9) || (i == 37) || (i == 39) || (i == 46) || (i == 17)) {
        return true;
    }
    else {
        event.returnValue = false;
        return false;
    }
}


/* 只允许输入数字和小数点,负号 */
function SysF_FloatOnly() {
    var i = window.event.keyCode;
    if ((i <= 57 && i >= 45) || (i >= 96 && i <= 105) || (i == 8) || (i == 9) || (i == 37) || (i == 39) || (i == 46) || (i == 17) || (i == 189) || (i == 190)) {
        return true;
    }
    else {
        event.returnValue = false;
        return false;
    }
}

/* 验证非空 */
function SysF_IsNoEmpty(str, sMsg, oToValidObj) {
    ///<summary>验证是否为空</summary>
    ///<param name="str">要验证的值</param>
    ///<param name="sMsg">错误提示消息</param>
    ///<returns>返回编码后的字符串</returns>
    if (typeof str == "undefined") {
        return false;
    }
    str = SysF_Trim(str);
    if (str.length > 0) {
        changeBorderColor(!true, oToValidObj, oValidType.NoEmptyValid);
        return true;
    } else {
        changeBorderColor(!false, oToValidObj, oValidType.NoEmptyValid);
        if (sMsg) {
            alert(sMsg);
        }
        return false;
    }
}

/* 验证是否为空 */
function SysF_IsEmpty(str, sMsg) {
    ///<summary>验证是否为空</summary>
    ///<param name="str">要验证的值</param>
    ///<param name="sMsg">错误提示消息</param>
    ///<returns>返回编码后的字符串</returns>

    if (closeModalWin()) return;
    //var reg = /^\S+$/;
    str = SysF_Trim(str);
    if (!str.length) {
        changeBorderColor(true);
        if (sMsg) {
            alert(sMsg);

        }
        //if (event.srcElement) event.srcElement.focus();
        return true;
    } else {
        changeBorderColor(false);
        return false;
    }
}


/* 点关闭按钮失焦事件触发弹提示；关闭模态对话框*/
function closeModalWin() {
    ///<summary>窗体需要有ID为btnCancle的按钮且该按钮的点击事件处理为window.close()</summary>
    ///<param name="str">要除空白的字符串</param>
    ///<returns>返回一个字符串</returns>

    var bRet = false;
    if (document.elementFromPoint) {
        var obj = document.elementFromPoint(event.x, event.y);
        if (obj != null && obj.type && obj.type == "button" && obj.id == "btnCancle") {
            obj.click();
            bRet = true;
        }
    }
    if (event.y < -22) {//模态框地址栏高度
        //window.close();
        if (document.getElementById("btnCancle")) document.getElementById("btnCancle").click();
        bRet = true;
    }
    return bRet;
}





/***************************************字符串处理***************************************/


/* 检查字符串是否为空,为空则返回true */
function SysF_IsNull(sValue, sMsg) {
    ///<summary>验证字符串是否为NUll</summary>
    ///<param name="sValue">要验证的值</param>
    ///<param name="sMsg">错误提示消息</param>
    ///<returns>是返回true否则返回false</returns>
    if (sValue == null) {
        if (sMsg) alert(sMsg);
        return true;
    } else {
        return false;
    }
}


/* 检查文本输入的有效值超长后截取指定长度 */
function SysF_CheckLength(sValue, maxlength, sMsg) {
    ///<summary>检查文本输入的有效值超长后截取指定长度（一个中文算两个字符）</summary>
    ///<param name="sValue">要检查文本值</param>
    ///<param name="maxlength">指定长度</param>
    ///<param name="sMsg">错误提示消息</param>
    ///<returns>是返回截取后的字符串</returns>

    var sLength = sValue.replace(/[^\x00-\xFF]/g, "**").length;
    if (sLength > maxlength) {
        alert(sMsg);
        return sValue.substring(0, maxlength);
    }
}


/* 检查字符串长度,超过最大长度返回false; */
function SysF_IsInBoundOfLength(oParam, minLength, maxLength, sMsg, obj) {
    ///<summary>验证字符串长度是否在制定范围内（一个中文算两个字符）</summary>
    ///<param name="oParam">要验证的对象或是对象值</param>
    ///<param name="minLength">指定最小值；默认为1</param>
    ///<param name="maxLength">指定最大值</param>
    ///<param name="sMsg">错误提示消息（不指定则为默认消息）</param>
    ///<param name="obj">截掉超长部分后余下的串要赋值给的对象，若第一参数为对象则默认给第一个参数</param>
    ///<returns>在指定范围内返回true否则返回false</returns>
    var sValue;
    if (typeof oParam == "object" && oParam.value) {
        sValue = oParam.value;
    } else if (typeof oParam == "string") {
        sValue = oParam;
    }
    //if (closeModalWin()) return;
    if (typeof minLength == "undefined" || minLength == "") minLength = 0;
    if (typeof maxLength == "undefined" || maxLength == "") maxLength = 1000;
    var sLength = sValue.replace(/[^\x00-\xFF]/g, "**").length;
    if (sLength <= maxLength && sLength >= minLength) {
        return true;
    }
    var iCurrentCharCount = 0;
    for (var i = 0, j = sValue.length; i < j; i++) {
        if (sValue.charCodeAt(i) > 128) {
            iCurrentCharCount += 2;
        } else {
            iCurrentCharCount += 1;
        }
        if (iCurrentCharCount > maxLength) {
            break;
        }
    }
    if (iCurrentCharCount < minLength) {
        if (typeof sMsg == "undefined" || sMsg == "") {
            sMsg = "文本长度至少为" + minLength + "；你只输入了" + iCurrentCharCount + "！(一个中文算两个字符)";
        }
        alert(sMsg);
        return false;
    }
    if (i < j) {
        if (typeof sMsg == "undefined" || sMsg == "") {
            sMsg = "你输入了" + sLength + "字符超出了系统设定的最大值" + maxLength + "！(一个中文算两个字符)；超长的是否由系统自动截掉！";
        } else {
            sMsg += "\n(一个中文算两个字符)超长的是否由系统自动截掉！";
        }
        if (confirm(sMsg)) {
            if (typeof oParam == "object" && oParam.value) {
                oParam.value = sValue.substring(0, i);
            } else if ((typeof obj != "undefined" && obj.value)) {
                obj.value = sValue.substring(0, i);
            } else if (event.srcElement.value) {
                event.srcElement.value = sValue.substring(0, i);
            } else {
                alert("系统截取失败， 请手动清除！");
                return false;
            }
            return true;
        } else {
            return false;
        }
    }
}



/* 验证普通字串 */
function SysF_IsCommonChar(sValue, sMsg) {
    ///<summary>验证是否为普通字串，只要字串中不包含特殊字符星号、大于号、小于号、单引号、左括号、右括号、空格等即可</summary>
    ///<param name="sValue">要验证的值</param>
    ///<param name="sMsg">错误提示消息</param>
    ///<returns>是返回true否则返回false</returns>

    var regCommonChar = /[\*\"\'<>\/\(\&\)\卐\卍\ ]/;
    var bRet = regCommonChar.test(sValue);
    if (bRet) {
        changeBorderColor(true);
        if (sMsg) {
            alert(sMsg);
        }
        return false;
    } else {
        changeBorderColor(false);
        return true;
    }
}


/*检查是否存在 “< > " '& \ / ; |”等特殊字符*/
function SysF_IsContainSpecialChar(sValue, sMsg) {
    ///<summary>验证字符串是否存在 “< > " '& \ / ; |”特殊字符</summary>
    ///<param name="strSource">要验证的值</param>
    ///<param name="sMsg">错误提示消息</param>
    ///<returns>是返回true否则返回false</returns>

    var regSpecialChar = /[\/<>\\&:|\"\']/;
    var bRet = regSpecialChar.test(sValue);
    changeBorderColor(bRet);
    if (bRet) {
        if (sMsg) alert(sMsg);
        return true;
    } else {
        return false;
    }

}

function SysF_IsNoContainSpecialChar(sValue, sMsg, oToValidObj) {
    ///<summary>验证字符串是否存在 “< > " '& \ / ; |”特殊字符</summary>
    ///<param name="strSource">要验证的值</param>
    ///<param name="sMsg">错误提示消息</param>
    ///<returns>是返回true否则返回false</returns>

    var regSpecialChar = /[\/<>\\&:|\"\']/;
    var bRet = regSpecialChar.test(sValue);
    changeBorderColor(bRet, oToValidObj, oValidType.SpecailCharValid);
    if (bRet) {
        if (sMsg) alert(sMsg);
        return false;
    } else {
        return true;
    }

}


/*功能：利用正则表达式，在字符串中，对特殊的字符： ' " < > & 进行编码*/
function SysF_EncodeSpecialChar(strSource) {
    ///<summary>对字符串中，对特殊的字符： ' " < > & 进行编码</summary>
    ///<param name="strSource">需要替换的源字符串</param>
    ///<returns>返回编码后的字符串</returns>

    var stEncodeResult = strSource;

    //空字符串
    if (stEncodeResult == "") {
        return stEncodeResult;
    }

    //把字符串中的 "&" 字符替换成 "&amp;"
    //替换时，一定得先替换 "&" 字符，否则，会把 "<" 等编码中的 "&" 也进行替换，从而产生错误的结果
    var regExpInfo = /&/g;
    stEncodeResult = stEncodeResult.replace(regExpInfo, "＆");

    //把 ' 替换成 "‘" 
    regExpInfo = /'/g;
    stEncodeResult = stEncodeResult.replace(regExpInfo, "’");

    //把 " 替换成 "“" 
    regExpInfo = /"/g;
    stEncodeResult = stEncodeResult.replace(regExpInfo, "“");

    //把 < 替换成 "《" 
    regExpInfo = /</g;
    stEncodeResult = stEncodeResult.replace(regExpInfo, "《");

    //把 > 替换成 "》" 
    regExpInfo = />/g;
    stEncodeResult = stEncodeResult.replace(regExpInfo, "》");

    //把 % 替换成 "％" 
    regExpInfo = /%/g;
    stEncodeResult = stEncodeResult.replace(regExpInfo, "％");

    return stEncodeResult;
}

function EscapeChar(sValue) {

    var regSpecial = /\<|\>|\"|\'|\&/g
    var str = sValue.replace(RexStr,
        function(MatchStr) {
            switch (MatchStr) {
                case "<":
                    return "& lt;";
                    break;
                case ">":
                    return "& gt;";
                    break;
                case "\"":
                    return "& quot;";
                    break;
                case "'":
                    return "& #39;";
                    break;
                case "&":
                    return "& amp;";
                    break;
                default:
                    break;
            }
        }
    )
    return str;

}

/*获得 除去前字符串前空白符 函数实现*/
function SysF_Ltrim(sValue) {
    ///<summary>返回去除前空白符的字符串</summary>
    ///<param name="str">要除空白的字符串</param>
    ///<returns>返回一个字符串</returns>

    return sValue.toString().replace(/^\s+/, '');
}


/* 获得 除去字符串末尾空白符 函数实现*/
function SysF_Rtrim(sValue) {
    ///<summary>返回去除末尾空白符的字符串</summary>
    ///<param name="str">要除空白的字符串</param>
    ///<returns>返回一个字符串</returns>

    return sValue.toString().replace(/\s+$/, '');
}


/* 除去字符串空白符 */
function SysF_Trim(sValue) {
    ///<summary>返回去除前后空白符的字符串</summary>
    ///<param name="str">要除空白的字符串</param>
    ///<returns>返回一个字符串</returns>

    var regExtraSpace = /^\s+(.*)\s+$/;
    return sValue.toString().replace(regExtraSpace, "$1");
}

function InvokeValidFunction(fnName, vArg) {
    var oEvent = event.srcElemnt;

    return fnName(oEvent.value, sMsg);

}

var oValidType = {
    "NoEmptyValid": 1,
    "SpecailCharValid": 2,
    "PositiveIntValid": 3,
    "ExtNum": 4,
    "PositiveFloat": 5,
    "PositiveValid":6
};
var oStyle = {

}; //用于事件验证时改变边框颜色
function changeBorderColor(bChange, oControl, sValidType,ev) {
    var event = ev || window.event;
    if (!event || typeof oStyle == "undefined") return;
    var oSrcObj = event.srcElement;
    if (typeof oControl == "object") {
        oSrcObj = oControl;
    } 
    if (oSrcObj) {
        if (!oSrcObj.id || (oSrcObj.type && oSrcObj.type.search(/button|img/) != -1)) return;
        if (bChange) {
            if (!oStyle.hasOwnProperty(oSrcObj.id.toString())) {
                oStyle[oSrcObj.id.toString()] = [];
                var arr = [sValidType, oSrcObj.style.cssText];
                oStyle[oSrcObj.id.toString()].push(arr);
            } else {
                var bFound = false, iPos = -1;
                for (var i = 0; i < oStyle[oSrcObj.id.toString()].length; i++) {
                    if (oStyle[oSrcObj.id.toString()][i][0] == sValidType) {
                        iPos = i;
                        bFound = true;
                    }
                }
                if (!bFound) {
                    if (oStyle[oSrcObj.id.toString()].length > 0) {
                        var arr = [sValidType, oStyle[oSrcObj.id.toString()][0][1]];
                        oStyle[oSrcObj.id.toString()].push(arr);
                    }
                }
            }
            oSrcObj.style.border = "red 1px solid";
        } else {
            if (oStyle.hasOwnProperty(oSrcObj.id.toString())) {
                var arr = oStyle[oSrcObj.id.toString()];
                for (var i = 0; i < arr.length; i++) {
                    if (sValidType == arr[i][0]) {
                        oSrcObj.style.cssText = oStyle[oSrcObj.id.toString()][i][1];
                        oStyle[oSrcObj.id.toString()].splice(i, 1);
                        break;
                    }
                }
                if (oStyle[oSrcObj.id.toString()].length == 0) {
                    delete oStyle[oSrcObj.id.toString()];
                }
            }
        }
    }
}


/*验证radio是否选中*/
function SysF_IsEmptyByRadio(obj, sMsg) {
    var j = 0;
    var objlist = document.getElementsByName(obj.childNodes[0].name);
    for (var i = 0; i < objlist.length; i++) {
        if (objlist[i].checked) {
            j++;
        }
    }
    if (j == 0) {
        changeBorderColor(true);
        if (sMsg) {
            alert(sMsg);
        }
        return false;
    }
    else {
        changeBorderColor(false);
        return true;
    }

}
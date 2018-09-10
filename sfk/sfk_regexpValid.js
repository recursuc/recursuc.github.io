/*
-----------------依赖sfk.js----------------
*/
(function (win, doc) {
    /** ****************** 系统通用验证库 ******************** */
    var count = 1,
	    elems = {},
	    ET = $ET,
	    regValid = {
	        /** ***************************数字处理函数****************************************** */
	        Number: /^(\d)+$/,
	        /* 验证数字 */
	        ExtNum: /^\d{2}-\d{3}-\d{8}(-\d{1,4})?$/,
	        /* 验证是否为分机 */
	        Decimal: /^(-|\+)?\d+(\.\d+)?$/,
	        /* 验证小数 */
	        Float: /^(-)?(\d)*(\.)?(\d)*$/,
	        /* 验证浮点数 */
	        PositiveFloat: /^(\d)*(\.)?(\d)*$/,
	        /* 验证正浮点数 */
	        Int: /^(-|\+)?(\d)+$/,
	        /* 验证整数(包含正整数和负整数) */
	        PositiveInt: /^[0-9]+\d*$/,
	        /* 验证是否为正整数 */
	        NegativeInt: /^-[1-9]+\d*$/,
	        /* 验证是否为负整数 */
	        ZeroOrPositive: /^\+?\d+(\.\d+)?$/,
	        /* 验证是否为零或正数 */
	        Positive: /^\d+(?=\.{0,1}\d+$|$)/,
	        /* 验证是否为正数 */
	        ZeroOrNegative: /^((-\d+(\.\d+)?)|(0+(\.0+)?))$/,
	        /* 验证是否为零或负数 */
	        Negative: /^((-\d+(\.\d+)?))$/,
	        /* 验证是否为负数 */
	        ZeroOrPositiveInt: /^\+?\d+$/,
	        /* 验证是否为零或正整数 */
	        ZeroOrNegativeInt: /^([0?]$)|(-\d*$)/,
	        /* 验证是否为零或负整数 */

	        /** ******************************字母，符号，汉字处理********************************************* */
	        ContainWordChar: /[_|a-z|A-Z|0-9]/,
	        /* 验证是否含有字母、数字或下划线_ */
	        Name: /\W/,
	        /* 字母，数字或下划线字符 */
	        ContainChineseChar: /[^\x00-\xFF]/g,
	        /* 验证字符串是否包含汉字 */
	        ContainChinaCharOrWord: /^[0-9a-zA-Z\u4e00-\u9fa5]+$/,
	        /* 验证是否含有汉字、字母、数字或_ */
	        ContainChinaChar: /[^\x00-\xFF]/,
	        /* 验证是否含有汉字 */
	        OnlyContainChinaChar: /^[\u4e00-\u9fa5]*$/,
	        /* 验证是否只包含汉字 */
	        OnlyContainLowerCase: /^[a-z]*$/,
	        /* 验证是否只包含小写英文字母 */
	        OnlyContainUpperCase: /^[A-Z]*$/,
	        /* 验证是否只包含大写英文字母 */
	        OnlyContainLetter: /^[a-zA-Z]*$/,
	        /* 验证英文字母，不区分大小写 */
	        LetterOrNumber: /^[a-zA-Z0-9]*$/,
	        /* 验证英文字母和数字，不区分大小写 */
	        ContainDoubleQuote: /[\"]/,
	        /* 验证是否含有双引号 */
	        NoContainDoubleQuote: /^[^\"]+$/,
	        /* 验证不包含双引号 */
	        ContainSingleQuote: /[\']/,
	        /* 验证是否含有单引号 */

	        /** **********************************************验证******************************************* */
	        Money: /(^[-+]?[1-9]\d*(\.\d{1,2})?$)|(^[-+]?[0]{1}(\.\d{1,2})?$)/,
	        /* 验证钱数,带单位 */
	        Phone: /^(\(\d{3,4}\)|\d{3,4}-|\s)?\d{7,14}$/,
	        /* 验证电话号码 */
	        Mobile: /(^0?[1][3|4|5|8][0-9]{9}(,0?[1][3|5|8][0-9]{9})*$)/,
	        /* 判断是否为手机号码 */
	        Postcode: /^\d{6}$/,
	        /* 判断是否为邮编 */
	        Email: /^[\w-]+@[\w-]+(\.(\w)+)*(\.(\w){2,3})$/,
	        /* 验证EMail */
	        URL: /^(file|http|https|ftp|mms|telnet|news|wais|mailto):\/\/(.+)$/,
	        /* 验证URL */
	        QQ: /^[1-9]\d{4,9}$/,
	        /* 验证QQ */
	        Idcard: /(^\d{15}$)|(^\d{17}([0-9]|X)$)/,
	        /* 验证身份证 */

	        /** ********************************日期时间处理********************************************************* */
	        Time: /^(([01][0-9])|(2[0-4])|([0-9])):(([0-6][0-9])|([0-9])):(([0-6][0-9])|[0-9])$/,
	        /*
	        * 验证时间
	        * (XXX问题
	        * 只是时间格式)
	        */
	        DateByFormat: /^(([12]\d{3}))-(([1][012])|(0[1-9])|[1-9])-(\d{1,2})$/,
	        /*
	        * 验证日期
	        * (可指定日期格式)
	        */
	        CheckComDate: "CheckComDate",
	        /*
	        * 比较两个时间大小 (日期格式:yyyy-mm-dd hh:mi:ss,eg
	        * 2008-08-08)
	        */

	        /** **********************限制键盘输入的数据类型******************************* */
	        NumOnly: /[^\d]/g,
	        /* 只允许输入数字 */
	        FloatOnly: /^(\-)?\d+(\.\d+)?$/,
	        /* 只允许输入数字和小数点,负号 */
	        NoEmpty: "NoEmpty",
	        /* 验证非空 */
	        Empty: /^[ ]$/,
	        /* 验证是否为空 */
	        closeModalWin: "closeModalWin",
	        /* 点关闭按钮失焦事件触发弹提示；关闭模态对话框 */
	        /** *************************************字符串处理************************************** */
	        Null: "Null",
	        /* 检查字符串是否为空,为空则返回true */
	        CheckLength: "CheckLength",
	        /* 检查文本输入的有效值超长后截取指定长度 */
	        InBoundOfLength: "InBoundOfLength",
	        /* 检查字符串长度,超过最大长度返回false; */
	        CommonChar: "CommonChar",
	        /* 验证普通字串 */
	        FunctionName: "FunctionName",
	        ContainSpecialChar: /[\/<>\\&:|\"\']/,
	        /*
	        * 检查是否存在 “< > " '& \ / ;
	        * |”等特殊字符
	        */
	        NoContainSpecialChar: "NoContainSpecialChar",
	        /*
	        * 检查是否不存在 “< > " '& \ / ;
	        * |”等特殊字符
	        */
	        EncodeSpecialChar: "",
	        /* 功能：利用正则表达式，在字符串中，对特殊的字符： ' " < > & 进行编码 */
	        EscapeChar: /\<|\>|\"|\'|\&/g,
	        Ltrim: /^\s+/,
	        /* 获得 除去前字符串前空白符 函数实现 */
	        Rtrim: /\s+$/,
	        /* 获得 除去字符串末尾空白符 函数实现 */
	        Trim: /^\s+(.*)\s+$/,
	        /* 除去字符串空白符 */
	        EmptyByRadio: "EmptyByRadio" /* 验证radio是否选中 */
	    },
	    Valid = {
	        border: "red 1px solid",
	        getVid: function (validObj) {
	            var vid = validObj.getAttribute("vid");
	            if (!vid) {
	                vid = count++;
	                validObj.setAttribute("vid", vid);
	                elems[vid] = {};
	            }
	            return elems[vid];
	        },
	        evtHandle: function (validObj, evtType, sType, sMsg) {
	            $E.on(validObj, evtType, function (evt) {
	                var elem = validObj,
				value;
	                switch (elem.type.toLowerCase()) {
	                    case "textarea":
	                    case "text":
	                        value = elem.value;
	                        break;
	                    case "select-one":
	                        value = elem.options[elem.selectedIndex].value;
	                        break;
	                    case "checkbox":
	                        value = elem.checked;
	                        break;
	                    default:
	                        break;
	                }
	                this.execute(sType, value, sMsg, validObj);
	            }, this);
	        },
	        bind: function (opts) {
	            var sType = opts.type,
			        sValue = opts.value,
			        validObj = opts.elem,
			        sMsg = opts.msg || "",
			        evts = opts.evts || null,
			        i = 0;

	            if ((validObj.ownerDocument || validObj).documentElement.nodeName == "HTML") {
	                if (evts) {
	                    var vType = this.getVid(validObj); // elems[vid];
	                    vType[opts.type] == undefined && (vType[opts.type] = true);

	                    for (i = 0; i < evts.length; i++) {
	                        this.evtHandle(validObj, evts[i], sType, sMsg);
	                    }
	                }
	            }
	        },
	        execute: function (sType, sValue, sMsg, validObj) {
	            var i = 0,
			        bRet = false;
	            reg = regValid[sType];
	            if ($O.getType(reg) != "regexp") {
	                switch (sType) {
	                    case "CommonChar":
	                        {
	                            var regSpecialChar = /[\*\"\'<>\/\(\&\)\卐\卍\ ]/;
	                            var bRet = regSpecialChar.test(sValue);
	                            // changeBorderColor(bRet, oToValidObj,
	                            // oValidType.SpecailCharValid);
	                            if (bRet) {
	                                if (sMsg)
	                                    bRet = false;
	                            } else {
	                                bRet = true;
	                            }
	                            break;
	                        }
	                    case "NoContainSpecialChar":
	                        {

	                            var regSpecialChar = /[\/<>\\&:|\"\']/;
	                            var bRet = regSpecialChar.test(sValue);
	                            // changeBorderColor(bRet, oToValidObj,
	                            // oValidType.SpecailCharValid);
	                            if (bRet) {
	                                if (sMsg)
	                                    bRet = false;
	                            } else {
	                                bRet = true;
	                            }
	                            break;
	                        }

	                    case "NoEmpty":
	                        {
	                            sValue = $Str.trim(sValue);
	                            if (sValue.length > 0) {
	                                bRet = true;
	                            }
	                            break;
	                        }
	                    case "CheckComDate":
	                        {
	                            // var dates, datee;
	                            // dates = new Date(obj_dateBegain.substr(0, 4),
	                            // parseInt(obj_dateBegain.substr(5, 2), 10) - 1,
	                            // obj_dateBegain.substr(8, 2));
	                            // datee = new Date(obj_dateEnd.substr(0, 4),
	                            // parseInt(obj_dateEnd.substr(5, 2), 10) - 1,
	                            // obj_dateEnd.substr(8, 2));
	                            // if (dates <= datee) {
	                            // if (dates == datee) {
	                            // var dates1, datee1;
	                            // dates1 = new Date(obj_dateBegain.substr(0, 4),
	                            // obj_dateBegain.substr(5, 2)
	                            // , obj_dateBegain.substr(8, 2), obj_dateBegain.substr(11,
	                            // 2), obj_dateBegain.substr(14, 2)
	                            // , obj_dateBegain.substr(17, 2));
	                            // datee1 = new Date(obj_dateEnd.substr(0, 4),
	                            // obj_dateEnd.substr(5, 2), obj_dateEnd.substr(8, 2)
	                            // , obj_dateEnd.substr(11, 2), obj_dateEnd.substr(14, 2),
	                            // obj_dateEnd.substr(17, 2));
	                            // if (dates1 <= datee1)
	                            // bRet = true;
	                            // else {
	                            // bRet = false;
	                            // }
	                            // }
	                            // else {
	                            // bRet = true;
	                            // }
	                            // }
	                            // else {
	                            // bRet = false;
	                            // }

	                        }
	                    case "closeModalWin":
	                        {
	                            if (document.elementFromPoint) {
	                                var obj = document.elementFromPoint(event.x, event.y);
	                                if (obj != null && obj.type && obj.type == "button"
								 && obj.id == "btnCancle") {
	                                    obj.click();
	                                    bRet = true;
	                                }
	                            }
	                            if (event.y < -22) { // 模态框地址栏高度
	                                // window.close();
	                                if (document.getElementById("btnCancle"))
	                                    document.getElementById("btnCancle").click();
	                                bRet = true;
	                            }

	                        }
	                    case "InBoundOfLength":
	                        {
	                            var sValue;
	                            var minLength = validObj.getAttribute("StartLengthRange"),
						maxLength = validObj
							.getAttribute("EndLengthRange");
	                            if (typeof oParam == "object" && oParam.value) {
	                                sValue = oParam.value;
	                            } else if (typeof oParam == "string") {
	                                sValue = oParam;
	                            }
	                            // if (closeModalWin()) return;
	                            if (typeof minLength == "undefined" || minLength == "")
	                                minLength = 0;
	                            if (typeof maxLength == "undefined" || maxLength == "")
	                                maxLength = 1000;
	                            var sLength = sValue.replace(/[^\x00-\xFF]/g, "**").length;
	                            if (sLength <= maxLength && sLength >= minLength) {
	                                bRet = true;
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
	                                    sMsg = "文本长度至少为" + minLength + "；你只输入了"
									 + iCurrentCharCount + "！(一个中文算两个字符)";
	                                }

	                                bRet = false;
	                            }
	                            if (i < j) {
	                                if (typeof sMsg == "undefined" || sMsg == "") {
	                                    sMsg = "你输入了" + sLength + "字符超出了系统设定的最大值"
									 + maxLength + "！(一个中文算两个字符)；超长的是否由系统自动截掉！";
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
	                                        bRet = false;
	                                    }
	                                    bRet = true;
	                                } else {
	                                    bRet = false;
	                                }
	                            }

	                        }
	                        break;
	                    case "EmptyByRadio":
	                        {
	                            var j = 0;
	                            var objlist = document
							.getElementsByName(validObj.childNodes[0].name);
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
	                            } else {
	                                changeBorderColor(false);
	                                bRet = true;
	                            }
	                        }
	                        break;
	                    case "FunctionName":
	                        myObj = validObj;
	                        bRet = eval(sMsg);

	                        break;
	                    default:
	                        break;
	                }
	            } else {
	                bRet = reg.test(sValue);
	            }

	            validObj && this.changeBorderColor(validObj, !bRet, sType);
	            if (sType != "FunctionName") {
	                !bRet && sMsg && alert(sMsg);
	            }

	            return bRet;
	        },
	        changeBorderColor: function (heValidObj, bChange, sType) {
	            if (!heValidObj) { return; }
	            var oVType = this.getVid(heValidObj),
			        border = ET.getStyle(heValidObj, "border");

	            border == "2px inset rgb(0, 0, 0)" && (border = "");
	            oVType["border"] == undefined && (oVType["border"] = border);

	            if (bChange) {
	                oVType[sType] = false;
	                border == oVType["border"] && (heValidObj.style.border = this.border);
	            } else {
	                oVType[sType] = true;
	                for (var vtype in oVType) {
	                    if (oVType[vtype] === false) {
	                        return;
	                    }
	                }
	                border != oVType["border"] && (heValidObj.style.border = oVType["border"]);
	            }
	        }
	    };

    window.Valid = Valid;
})(window, document);

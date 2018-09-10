

function isNumber() {

	var a = true;
	if (myObj.value.trim() != "") {
		a = SysF_IsNumber(myObj.value.trim(), "必须为数字");
	}
	return a;
}

function dblclick() {
	alert("双击");
}

function keypress() {
	alert("按键");
}

function keyup() {
	alert("松键");
}

function isPhone() {
	var a = true;
	if (myObj.value.trim() != "") {
		a = SysF_IsMobile(myObj.value.trim(), "手机号格式不对");
	}
	return a;
}

function blur1() {
	alert("退出");
}

function change() {
	alert("改变");
}

function isCardNum()
{
	var a = true;
	if (myObj.value.trim() != "") {
		a = SysF_IsIdcard(myObj.value.trim(), "证件号码格式不对");
	}
	return a;
}
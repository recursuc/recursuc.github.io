function AjaxUtil() {
}

/**执行异步事件成功*/
function ajaxSuccess(data,fun){
	var revalue;
	try{
		revalue=eval('('+data+')')
	}catch(e){
		throw e;
	}
	fun(revalue);
	try{
		$("input[type='button']").finish();
	}catch(e){
		
	}
	
}

with (AjaxUtil) {
	prototype.update=function(url,fun,debug){
		if(url.search('\\?')==-1){
			url+="?";
		}else{
			url+="&";
		}
		url+="forward=update";
		this.json(url,fun,debug);
	};
	prototype.downloadFile=function(url,data,fun){
		url=framework.addUser(url);
		$("#downloadFrom").remove();
		var form=$("<form></form>").appendTo($(document.body));
		form.attr("action",url);
		form.attr("method","post");
		form.attr("id","downloadFrom");
		form.attr("target","_blank");
		for(var i=0;i<data.length;i++){
			var input=$('<input type="hidden" name="'+data[i].name+'">');
			var value = encodeURIComponent(data[i].value);
			input.val(value);
			form.append(input);
		}
		form.submit();
	};
	prototype.downloadFileByFrom=function(frm,url){
		var oldUrl = frm.action;
		var method = frm.method;
		var target = frm.target;
		framework.addUserInput(frm);
		frm.action = url;
		//frm.method = "post";
		frm.target = "_blank";
		framework.query(fm);
		frm.action = oldUrl;
		frm.method = method;
		frm.target = target;
	};
	prototype.postJson=function(url,data,fun){
		var form=$("<form></form>");
		for(var i=0;i<data.length;i++){
			var input=$('<input type="hidden" name="'+data[i].name+'">');
			input.val(data[i].value)
			form.append(input);
		}
		var data=form.serialize()
		ajaxUtil.json(url,fun,data);
	}
	
	prototype.json=function(url,fun,data,debug){
		url=framework.addUser(url);
		//调试用
		if(debug){
			window.open(url);
			return;
		}
		jQuery.ajax({
			dataType: "html",
            url: url,   // 提交的页面
            type: "post",                   // 设置请求类型为"POST"，默认为"GET"
            beforeSend: function(){ // 设置表单提交前方法
            },
            data:data,
            error: function(request) {      // 设置表单提交出错
            	throw "调用json返回错误,请确认请求是否正确:"+url;
            },
            success: function(data) {
            	ajaxSuccess(data,fun)
            }
        });
	};
	prototype.ajaxSyncJsonp = function(url,params,callback, completeCallback){
		url=framework.addUser(url);
	    $.ajax({
	        url : url,
	        type : "post",
	        data : params,
	        dataType : "JSONP",
	        async:false,
	        success : function(d) {
	        	try{
	        		$("input[type='button']").finish();
	        	}catch(e){
	        		
	        	}
	            if (d.ret && d.errcode===0) {
	                if (callback) {
	                    callback(d);
	                }
	            } else {
	                alert(d.errmsg);
	            }
	        },
	        error : function(d) {
	            alert("服务端出错");
	            try{
	        		$("input[type='button']").finish();
	        	}catch(e){
	        		
	        	}
	        },
	        complete : completeCallback ||function(d) {
	        }
	    });
	};
	
	prototype.subForm=function(preSubForm,fun){
		framework.addUserInput(preSubForm);
		//异步提交的东西全部都转到updateResult页面
		if(preSubForm.forward){
			preSubForm.forward.value="update";
		}else{
			var forward="<input type='hidden' name='forward' value='update'>";
			$(preSubForm).append($(forward));
		}
		jQuery.ajax({
			dataType: "html",
            url: preSubForm.action,   // 提交的页面
            data: $(preSubForm).serialize(), // 从表单中获取数据
            type: "POST",                   // 设置请求类型为"POST"，默认为"GET"
            beforeSend: function(){ // 设置表单提交前方法
            },
            error: function(request) {      // 设置表单提交出错
                alert("表单提交出错，请联系管理员");
            },
            success: function(data) {
            	ajaxSuccess(data,fun)
            }
        });
	}

}
var ajaxUtil=new AjaxUtil();
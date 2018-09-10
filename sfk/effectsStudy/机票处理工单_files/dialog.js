
;(function(__context){
    var module = {
        id : "4a39feabefba364d45b4314009817934" , 
        filename : "dialog.js" ,
        exports : {}
    };
    if( !__context.____MODULES ) { __context.____MODULES = {}; }
    var r = (function( exports , module , global ){

    /*
 依赖于 jquery.qbox.js  jquery.js base.js
 用法
 QUI.alert(title, content, okfun)    okfun默认为关闭,此方法接受参数e
 QUI.confirm(title, content, okfun, canclfun)   canclfun默认为关闭,此方法接受参数e
 QUI.dialog(jobj)   iobj可以使字符串，可以是dom 可以是jquery对象
 QUI.close(e) ,此方法接受参数e
 */
 

(function($) {
    function gettemplate() {
        return '<div class="layer_box" >\
	 	<div class="layer_ct">\
	 		<div class="title_lay"><span class="icon_close" role="close"></span>{title}</div>\
	        <p class="dele_tip">{content}</p>\
	        <p class="tct">\
	            <button class="bt_buton plr25 ml5" type="button" role="ok"><em><em>{oktxt}</em></em></button>\
	            <button class="bt_buton plr25 ml5" type="button" role="cancl"><em><em>{cancltxt}</em></em></button>\
            </p>\
	    </div>\
	 </div>';
    }

    function close(e) {
        $.qbox.close(e);
    }

    function getjobj(type, title, content, okfun, canclfun, closefun, oktxt, cancltxt) {
        var jobj = $(util.format(gettemplate(), {title:title,content:content,oktxt:oktxt||"确定",cancltxt:cancltxt||"取消"}));

        jobj.find("[role='ok']").click(function(e) {
            if (okfun)okfun(e);
            else close(e);
        });
        jobj.find("[role='cancl']").click(function(e) {
            if (canclfun)canclfun(e);
            else close(e);
        });
        jobj.find("[role='close']").click(function(e) {
            if (closefun)closefun(e);
            close(e);
        });
        if (type == "alert")jobj.find("[role='cancl']").remove();
        return jobj;
    }

    function show(box) {
        $.qbox.show($.qbox($(box).css("display", "block")));
    }

    function alert(title, content, okfun, closefun) {
        show(getjobj("alert", title, content, okfun, closefun));
    }

    function confirm(title, content, okfun, canclfun, closefun, oktxt, cancltxt) {
        show(getjobj("confirm", title, content, okfun, canclfun, closefun, oktxt, cancltxt));
    }

    function dialog(jobj) {
        show(jobj);
    }

    $.extend(ns("QUI"), {
        alert:alert,
        confirm:confirm,
        dialog:dialog,
        close:close
    })
})(jQuery);



    })( module.exports , module , __context );
    __context.____MODULES[ "4a39feabefba364d45b4314009817934" ] = module.exports;
})(this);

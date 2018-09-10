
;(function(__context){
    var module = {
        id : "096be4eaa00bbf19e1a91ccb5af31eee" , 
        filename : "softPhoneInit.js" ,
        exports : {}
    };
    if( !__context.____MODULES ) { __context.____MODULES = {}; }
    var r = (function( exports , module , global ){

    /**
 * Created with IntelliJ IDEA.
 * User: root
 * Date: 13-9-24
 * Time: 下午7:39
 * To change this template use File | Settings | File Templates.
 */

function softPhoneInit(flag){
    $("#js-appoint-phoneNum").click(function(){
        if(flag === true){
            dialOut($(this));
        }

        return false;
    });

    $("#appointResult").change(function(){
        if(this.value === "again" || this.value === "failure"){
            $("#appintTimeUpdateSpan").show();
        }else{
            $("#appintTimeUpdateSpan").hide();
        }
    });
}

/**外拨回调*/
window.callbackForZTcallout=function(){
    $("#js-appointComplete-li").show();
    $("#js-appointComplete-hide-li").hide();
    $("#callflag").val("true");
}

/**外拨电话*/
function dialOut(phoneJQ){
    try{
        var state = phoneFramework.getAgentStatus();
        

        phoneFramework.preCallForZT(phoneJQ, phoneJQ.text(), flowId, "window.callbackForZTcallout")
    }catch(e){
        alert("请登录软电话!");
    }
}


module.exports = softPhoneInit;

    })( module.exports , module , __context );
    __context.____MODULES[ "096be4eaa00bbf19e1a91ccb5af31eee" ] = module.exports;
})(this);

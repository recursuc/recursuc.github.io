
;(function(__context){
    var module = {
        id : "349ee61124ebeb8ddfed16962b67e6b3" , 
        filename : "compensateValidate.js" ,
        exports : {}
    };
    if( !__context.____MODULES ) { __context.____MODULES = {}; }
    var r = (function( exports , module , global ){

    /**
 * Created with IntelliJ IDEA.
 * User: root
 * Date: 13-9-23
 * Time: 下午12:37
 * To change this template use File | Settings | File Templates.
 */


function checkResult(type, isManager){

    var userfield11 = $("input[name='userfield11']").val();
    var userfield12 = $("select[name='userfield12']").val();//责任归属
    var userfield13 = $("select[name='userfield13']").val(); //需赔付
    var userfield14 = $("select[name='userfield14']").val();//赔付类型
    var userfield22 = $("select[name='userfield22']").val(); //需判罚
    var userfield27 = $("select[name='userfield27']").val(); //礼品
    var userfield30 = $("select[name='userfield30']").val(); // 业务部门
    var userfield31 = $("select[name='userfield31']").val(); //业务类型
    var userfield29 = $("input[name='userfield29']").val(); //赔付日期
    var userfield32 = $("input[name='userfield32']").val(); // 提交人：
    var userfield33 = $("input[name='userfield33']").val(); // 赔付原因
    var userfield34 = $("input[name='userfield34']").val(); // 事由
    var userfield35 = $("input[name='userfield35']").val(); // 收款人
    var userfield36 = $("input[name='userfield36']").val(); // 收款人性质
    var userfield37 = $("input[name='userfield37']").val(); // 开户支行
    var userfield38 = $("input[name='userfield38']").val(); // 收款账号
    var userfield39 = $("input[name='userfield39']").val(); //联系方式
    var userfield15 = $("input[name='userfield15']").val(); //赔付金额
    var userfield23 = $("input[name='userfield23']").val(); //判罚金额
    var userfield5 = $("input[name='userfield5']").val(); //是否有效投诉   投诉判定

    if(isManager === false){
        return true;
    }

    // 检验 是否有效投诉  必须选择
    if(userfield5 == "" && type == -2){
        alert("投诉判定 必须选择 ");
        return false;
    }

    if(userfield12 == "代理商" || userfield12 == "qunar"){
        // 检验赔付 必须选择
        if(userfield13 == "" && type == -2){
            alert("需赔付 必须选择 ");
            return false;
        }

        //检验判罚 必须选择
        if(userfield13 == "是"){
            if(userfield14 == "" && type == -2){
                alert("赔付类型 必须选择 ");
                return false;
            }

            if(userfield14 == "礼品"){
                if(userfield27 == "" && type == -2){
                    alert("礼品 必须选择 ");
                    return false;
                }
            }

            if(userfield14 == "直接赔付" || userfield14 == "代赔付"){
                if(userfield15 == ""&&type==-2){
                    alert("赔付金额 必须输入 ");
                    return false;
                }

                if(userfield30 == "" && type == -2){
                    alert("业务部门 必须选择 ");
                    $("select[name='userfield30']").focus()
                    return false;
                }

                if(userfield31 == "" && type == -2){
                    alert("业务类型  必须选择 ");
                    $("select[name='userfield31']").focus()
                    return false;
                }

                if(userfield29 == "" && type == -2){
                    alert("赔付日期  必须输入 ");
                    $("input[name='userfield29']").focus()
                    return false;
                }

                if(userfield32 == "" && type == -2){
                    alert("提交人  必须输入 ");
                    $("input[name='userfield32']").focus()
                    return false;
                }

                if(userfield33 == "" && type == -2){
                    alert("赔付原因  必须输入 ");
                    $("input[name='userfield33']").focus()
                    return false;
                }

                if(userfield34 == "" && type == -2){
                    alert("事由  必须输入 ");
                    $("input[name='userfield34']").focus()
                    return false;
                }

                if(userfield35 == "" && type == -2){
                    alert("收款人  必须输入 ");
                    $("input[name='userfield35']").focus()
                    return false;
                }

                if(userfield36 == "" && type == -2){
                    alert("收款人性质  必须输入 ");
                    $("input[name='userfield36']").focus()
                    return false;
                }


                if(userfield37 == "" && type == -2){
                    alert("开户支行  必须输入 ");
                    $("input[name='userfield37']").focus()
                    return false;
                }


                if(userfield38 == "" && type == -2){
                    alert("收款账号  必须输入 ");
                    $("input[name='userfield38']").focus()
                    return false;
                }

                if(userfield39 == "" && type == -2){
                    alert("联系方式  必须输入 ");
                    $("input[name='userfield39']").focus()
                    return false;
                }
            }
        }

        if(userfield22 == "" && type == -2){
            alert("需判罚 必须选择 ");
            return false;
        }

        if(userfield22 == "是"){
            if(userfield23 == "" && type == -2){
                alert("判罚金额 必须输入 ");
                return false;
            }
        }

    }

    return true;
}

module.exports = checkResult;

    })( module.exports , module , __context );
    __context.____MODULES[ "349ee61124ebeb8ddfed16962b67e6b3" ] = module.exports;
})(this);


;(function(__context){
    var module = {
        id : "b52d3314fe66856fb076f89552c3a1da" , 
        filename : "orderViewMod.js" ,
        exports : {}
    };
    if( !__context.____MODULES ) { __context.____MODULES = {}; }
    var r = (function( exports , module , global ){

    var compensateValidate =__context.____MODULES['349ee61124ebeb8ddfed16962b67e6b3'];

function go2process(){
    try{
        var url = "/flowinfo/go2process.call?flowId=" + flowId;
        framework.go(url, "工单处理");
    }catch(e){
        alert('go2process error:' + e.description);
    }
}

function go2view(){
    try{
        var url = "/flowinfo/go2view.call?flowId=" + flowId;
        framework.go(url);
    }catch(e){
        alert('go2view error:' + e.description);
    }
}

var viewMod = {
    process: function(hrefJQ){
        flowUtil.ajaxGet({
            url: "/flowinfo/updateLockId.json",
            data: {
                flowId: flowId
            },
            name: 'updateLockId',
            callback: function(){
                go2process();
            },
            finalcallback: function(){
                recoverHerfStatus(hrefJQ);
            }
        });
    },
    unlock: function(hrefJQ){
        flowUtil.ajaxGet({
            url: "/flowinfo/unLockByManager.json",
            data: {
                flowId: flowId
            },
            name: 'unLockByManager',
            callback: function(){
                go2view();
            },
            finalcallback: function(){
                recoverHerfStatus(hrefJQ);
            }
        });
    },
    appoint: function(hrefJQ){
        try{
            framework.go("/flowinfo/go2appoint.call?flowId=" + flowId);
        }catch(e){
            alert('go2process error:' + e.description);
            recoverHerfStatus(hrefJQ);
        }
    },
    appointComplete: function(hrefJQ){//回访完成
        appointCompleteOperation(hrefJQ);
    },
    getback: function(hrefJQ){
        flowUtil.ajaxGet({
            url: "/flowinfo/updateBackByManager.json",
            data: {
                flowId: flowId
            },
            name: 'unLockByManager',
            callback: function(){
                alert("强回成功");
                go2view();
            },
            finalcallback: function(){
                recoverHerfStatus(hrefJQ);
            }
        });
    },
    reopen: function(hrefJQ){
        flowUtil.ajaxGet({
            url: "/flowinfo/flowActivityListForReopen.json",
            data: {
                flowId: flowId
            },
            name: 'flowActivityListForReopen',
            callback: function(d){
                showReopenDialog(d, hrefJQ);
            }
        });
    },
    closeOrder: function(hrefJQ){//关单
        saveOrcloseOrTransferByManager(-2, hrefJQ);
    },
    tempSave: function(hrefJQ){//暂存
        saveOrcloseOrTransferByManager(-1, hrefJQ);
    },
    tempSaveOuter: function(hrefJQ){//外部节点的暂存
        saveOrcloseOrTransferByManager(-3, hrefJQ);
    },
    transferOrder: function(hrefJQ){//工单转接
        flowUtil.ajaxGet({
            url: "/flowinfo/flowActivityTo.json",
            data: {
                flowConfigId: flowConfigId,
                flowActivityId: lastActivityId,
                flowId: flowId
            },
            name: 'flowActivityTo',
            callback: function(d){
                transferDialog(d, hrefJQ);
            }
        });
    },
    delegate: function(hrefJQ){//委托
        flowUtil.ajaxGet({
            url: "/flowinfo/userListForDelegate.json",
            data: {
                flowConfigId: flowConfigId,
                flowActivityId: lastActivityId,
                flowId: flowId
            },
            name: 'userListForDelegate',
            callback: function(d){
                delegateDiaglog(d, hrefJQ);
            }
        });
    },
    designate: function(hrefJQ){//指派
         flowUtil.ajaxGet({
            url: "/flowinfo/userListForDesignate.json",
            data: {
                flowConfigId: flowConfigId,
                flowActivityId: lastActivityId,
                flowId: flowId
            },
            name: 'userListForDesignate',
            callback: function(d){
                designateDiaglog(d, hrefJQ);
            }
        });
    },
    update: function(hrefJQ){
        var $lastRemark = $("#lastRemark"),
            params = {
                flowId: flowId,
                flowNo: flowNo,
                userId:userId,
                currentId:currentId,
                lastRemark: $.trim($lastRemark.val())
            };
        if(params.lastRemark.length == 0){
            alert("处理意见不能为空!");
            $lastRemark.focus();
            recoverHerfStatus(hrefJQ);
            return;
        }
        flowUtil.ajaxPost({
            url: "/flowinfo/updateForPhoneTrans.json",
            data: params,
            name: 'updateForPhoneTrans',
            callback: function(){
                alert("更新成功!");
                $lastRemark.prop('disabled', true);
                hrefJQ.addClass("disabled");
                //$lastRemark
            }
        });
    }
};

/**
 * 重开操作的弹层
 * @param data
 */
function showReopenDialog(data, hrefJQ){
    var content = [];
    content.push('<span>节点</span><select id="actList">');
    $.each(data.list, function(i, node){
        content.push('<option value="', node.flowActivityId, '">', node.flowActivityName, '</option>');
    });
    content.push('</select>');
    content.push('<br /><br />重开备注：<textarea rows="5" cols="20" name="reopenLastRemark"></textarea>');

    QUI.confirm('重开工单', content.join(''), function(e){
        var lastActivityId = $('#actList').val();
        if(lastActivityId == ""){
            QUI.alert("重开工单", "请选择节点");//必须选择节点
            recoverHerfStatus(hrefJQ);
            return;
        }

        var params = {flowId: flowId};
        params.lastActivityId = lastActivityId;
        params.lastRemark = $.trim($("textarea[name=reopenLastRemark]").val());

        flowUtil.ajaxGet({
            url: "/flowinfo/reOpenByManager.json",
            data: params,
            name: 'reOpenByManager',
            callback: function(d){
                QUI.alert("重开工单", "操作成功");
                go2view()
            },
            finalcallback: function(){
                recoverHerfStatus(hrefJQ);
            }
        });

        QUI.close(e);
    }, function(e){
        recoverHerfStatus(hrefJQ);
        QUI.close(e);
    }, function(e){
        recoverHerfStatus(hrefJQ);
        QUI.close(e);
    });
}

/**
 * 回访完成处理
 */
function appointCompleteOperation(hrefJQ){
    var param = {
        flowId: flowId,
        appointResult: $("[name='appointResult']").val(),
        newAppointTime: $.trim($("[name='newAppointTime']").val()),
        lastRemark: $.trim($("#lastRemark").val())
    };

    var _valid = appointValidate(param, hrefJQ);
    if(_valid === false){
        return;
    }

    flowUtil.ajaxGet({
        url: "/flowinfo/appointByManager.json",
        data: param,
        name: 'appointByManager',
        callback: function(d){
            alert("回访完成");
            go2view();
        },
        finalcallback: function(){
            recoverHerfStatus(hrefJQ);
        }
    });
}

/**
 * 预约回访的校验
 * @returns {boolean}
 */
function appointValidate(param, hrefJQ){

    if(param.lastRemark === ''){
        recoverHerfStatus(hrefJQ);
        alert("处理意见不能为空");
        return false;
    }

    if($("#callflag").val() == "true"){
        var appointResult = $("select[name='appointResult']").val();
        var newAppointTime = $("input[name='newAppointTime']").val();
        if(appointResult == ""){
            alert("请选择回访结果!");
            $("select[name='appointResult']").focus();
            recoverHerfStatus(hrefJQ);
            return false;
        }else if(appointResult == "again" || appointResult == "failure"){
            if(newAppointTime == ""){
                alert("请选择再次预约时间!");
                $("input[name='newAppointTime']").focus();
                recoverHerfStatus(hrefJQ);
                return false;
            }
        }
    }

    return true;
}

/**
 * 工单处理页面
 * @param type
 * @param hrefJQ
 */
function saveOrcloseOrTransferByManager(type, hrefJQ){
    try{
        var lastRemark = $("#lastRemark").val();
        if(jQuery.trim(lastRemark) == ''){
            alert("处理意见不能为空");
            recoverHerfStatus(hrefJQ);
            return;
        }
        var lastActivityId = "";
        var lockId = "";
        var processStatus = $("#processStatus").val();
        if($("#spcialNode") && ($("#sCompensateType").val() === "直接赔付" || $("#sCompensateType").val() === "代赔付")){
            if(Number($("#totalCost").val()) === 0){
                alert("请输入赔付金额");
                $(document).scrollTop(750);
                recoverHerfStatus(hrefJQ);
                return;
            }
        }
        if(type == -1){ //暂存
            lastActivityId = "-1";
            if(jQuery.trim(processStatus) == '' || parseInt(processStatus) == 0){
                alert("暂存必须选择工单特殊状态");
                recoverHerfStatus(hrefJQ);
                return;
            }
        }

        if(type == -2){ //关单
            lastActivityId = "-2";
            if(jQuery.trim(processStatus) == '' || (parseInt(processStatus) != 0 && parseInt(processStatus) != 99)){
                alert("关单时工单特殊状态必须是 无 或 风险关单");
                recoverHerfStatus(hrefJQ);
                return;
            }
        }

        if(type == -3){
            lastActivityId = "-1";
        }

        if(type == 0){//flowActivityTo toUser
            lastActivityId = $("#actList").val();
            lockId = $("select[name=lockId]").val();
            if(jQuery.trim(lastActivityId) == ''){
                alert("可转组不能为空");
                recoverHerfStatus(hrefJQ);
                return;
            }
            //转接给财务必填项验证
            if(lastActivityId === 'FlowActivity_ea6f06e0-6638-4efa-a309-303521a2b01b' ){
                if(jQuery.trim($("[name = 'drawBack']").val()) === ""){
                    alert("退款金额不能为空");
                    recoverHerfStatus(hrefJQ);
                    return;
                }
                if(jQuery.trim($("[name = 'drawNumber']").val()) === ""){
                    alert("退款份数不能为空");
                    recoverHerfStatus(hrefJQ);
                    return;
                }
                if(jQuery.trim($("[name = 'tradeId']").val()) === ""){
                    alert("交易单号不能为空");
                    recoverHerfStatus(hrefJQ);
                    return;
                }
            }
        }

        var newAppointTime = $("[name='newAppointTime']").val();
        var appointResult = $("[name='appointResult']").val();
        var priority = $("#js-down-select").val() ||$("#js-priority").attr("data-priority");
        var data = {
            "flowConfigId": flowConfigId,
            "flowId": flowId,
            "processStatus": processStatus,
            "lastRemark": lastRemark,
            "lastActivityId": lastActivityId,
            "lockId": lockId,
            "newAppointTime": newAppointTime,
            "appointResult": appointResult,
            'userfield3': $("[name=tuanId]").val(),
            'userfield9': $("[name=drawBack]").val(),
            'userfield10': $("[name=drawNumber]").val(),
            'userfield4': $("[name=tradeId]").val(),
            'priority' : priority
        };
        if($("#spcialNode")){
            var priceDifference = Number($("[name=priceDifference]").val());
            var priceCompensation = Number($("[name=priceCompensation]").val());
            var priceRest = Number($("[name=priceRest]").val());
            var sum = 0; 
            sum = Number(priceDifference + priceCompensation + priceRest).toFixed(2);

            data.priceDifference = priceDifference.toFixed(2);
            data.priceCompensation = priceCompensation.toFixed(2);
            data.priceRest =  priceRest.toFixed(2);
            data.userfield15 = sum;
        } else {
            data.userfield15 = $("[name=userfield15]").val();
        };
        $("input[name='fileInfoId']").each(function(index, el){
            data["fileInfoId[" + index + "]"] = $(el).val();
        });

        $("[name^='userfield']").each(function(index, item){
            data[$(item).attr("name")] = $(item).val();
        });

        var _validate = compensateValidate(type, window.isManager);
        if(_validate === false){
            recoverHerfStatus(hrefJQ);
            return;
        }
        var iframeId = "";
        if($(window.parent.document).contents().find("[title=中台处理桌面]").length > 0){
            iframeId = "i" + $(window.parent.document).contents().find("[title=中台处理桌面]").parent().attr("id");
        }
        flowUtil.ajaxPost({
            url: "/flowinfo/saveOrcloseOrTransferByManager.json",
            data: data,
            name: 'updateProblemByManager',
            callback: function(){
                alert("成功");
                //刷新我的工单处列表
                if( iframeId ) {
                   var parentDom = window.parent.frames[iframeId];
                   parentDom.$(".order-box").trigger("finishWorkOrder");
                }
                go2view();
            },
            finalcallback: function(){
                recoverHerfStatus(hrefJQ);
            }
        });

    }catch(e){
        alert('saveOrcloseOrTransferByManager error:' + e.description);
        recoverHerfStatus(hrefJQ);
    }
}

function recoverHerfStatus(hrefJQ){
    hrefJQ.attr("isProcess", "0");
}

/**
 * 工单转接弹层
 */
function transferDialog(data, hrefJQ){
    var content = [];
    content.push('<span>节点</span><select id="actList">');
    $.each(data.list, function(i, node){
        content.push('<option value="', node.flowActivityId, '" isManager=' + node.isManager + '>', node.flowActivityName, '</option>');
    });
    content.push('</select>');

    QUI.confirm('工单转接', content.join(''), function(e){
        var lastActivityId = $('#actList').val();
        if(lastActivityId == ""){
            QUI.alert("工单转接", "请选择节点");//必须选择节点
            recoverHerfStatus(hrefJQ);
            return;
        }

        saveOrcloseOrTransferByManager(0, hrefJQ);
        QUI.close(e);
    }, function(e){
        recoverHerfStatus(hrefJQ);
        QUI.close(e);
    }, function(e){
        recoverHerfStatus(hrefJQ);
        QUI.close(e);
    });

    bindGetUser();

    $('#actList').trigger('change');

    function bindGetUser(){
        $('#actList').bind('change', function(e){
            var node_select = $(this);
            var flowActivityId = node_select.val();

            if($("#actList").find("option:selected").attr("isManager") == "true"){//则不需要选人
                node_select.parent().find('.person').remove();
                return;
            }

            flowUtil.ajaxPost({
                url: "/flowinfo/toUser.json",
                data: {
                    flowActivityId: flowActivityId,
                    currentId: currentId
                },
                name: 'toUser',
                callback: function(activityId){
                    var people = [];
                    people.push('<span class="person">人<select name="lockId"><option value=""></option>');
                    $.each(activityId.list, function(i, user){
                        people.push('<option value="', user.userId, '">', user.userName, '</option>');
                    });
                    people.push('</select></span>');
                    node_select.parent().find('.person').remove();
                    node_select.parent().append(people.join(''));
                }
            });

        });
    }
}

/**
 * 委托弹层
 * @param entrustData
 */
function delegateDiaglog(entrustData, hrefJQ){

    var entrustHtml = [];
    entrustHtml.push('<div class="entrust-list"><div class="person_list">');
    $.each(entrustData.list, function(i, person){
        entrustHtml.push('<label><input type="radio" class="delegate" col="1" name="entrustlist" ', i == 0 ? 'checked=""' : '', ' value="', person.userId, '">', person.userName, '</label>');
    });
    entrustHtml.push('</div><br /><p>委托说明<font color=red>*</font></p><textarea id="entrustTxt" cols="36"></textarea>')
    entrustHtml.push('<div class="error" style="display:none" id="entrustError">委托说明不能超过1000字</div></div>');
    QUI.confirm('委托', entrustHtml.join(''), function(e){
        var entrustTxt = $('#entrustTxt').val();
        if(entrustTxt.length > 1000){
            $('#entrustError').show();
            recoverHerfStatus(hrefJQ);
            return;
        }
        $('#entrustError').hide();
        var userId = $('input[col=1][checked]').val();

        var _param = {
            flowId: flowId,
            lastRemark: entrustTxt,
            "lockId": userId
        };

        flowUtil.ajaxPost({
            url: "/flowinfo/delegateByOther.json",
            data: _param,
            callback: function(d){
                alert("委托成功");
                go2view();
            },
            finalcallback: function(){
                recoverHerfStatus(hrefJQ);
            }
        });

        QUI.close(e);
    }, function(e){
        recoverHerfStatus(hrefJQ);
        QUI.close(e);
    }, function(e){
        recoverHerfStatus(hrefJQ);
        QUI.close(e);
    });
}


/**
 * 指派弹层
 * @param entrustData
 */
function designateDiaglog(entrustData, hrefJQ){

    var entrustHtml = [];
    entrustHtml.push('<div class="entrust-list"><div class="person_list">');
    $.each(entrustData.list, function(i, person){
        entrustHtml.push('<label><input type="radio" class="delegate" col="1" name="entrustlist" ', i == 0 ? 'checked=""' : '', ' value="', person.userId, '">', person.userName, '</label>');
    });
    entrustHtml.push('</div><br /><p>指派说明<font color=red>*</font></p><textarea id="entrustTxt" cols="36"></textarea>')
    entrustHtml.push('<div class="error" style="display:none" id="entrustError">指派说明不能超过1000字</div></div>');
    QUI.confirm('指派', entrustHtml.join(''), function(e){
        var entrustTxt = $('#entrustTxt').val().replace(/^\s+|\s+$/g, "");
        if(entrustTxt.length == 0){
            alert("指派说明不能为空");
            return;
        }
        if(entrustTxt.length > 1000){
            $('#entrustError').show();
            recoverHerfStatus(hrefJQ);
            return;
        }
        $('#entrustError').hide();
        var userId = $('input[col=1][checked]').val();

        var _param = {
            flowId: flowId,
            lastRemark: entrustTxt,
            "lockId": userId
        };

        flowUtil.ajaxPost({
            url: "/flowinfo/designateByOther.json",
            data: _param,
            callback: function(d){
                alert("指派成功");
                go2view();
            },
            finalcallback: function(){
                recoverHerfStatus(hrefJQ);
            }
        });

        QUI.close(e);
    }, function(e){
        recoverHerfStatus(hrefJQ);
        QUI.close(e);
    }, function(e){
        recoverHerfStatus(hrefJQ);
        QUI.close(e);
    });
}


module.exports = viewMod;

    })( module.exports , module , __context );
    __context.____MODULES[ "b52d3314fe66856fb076f89552c3a1da" ] = module.exports;
})(this);

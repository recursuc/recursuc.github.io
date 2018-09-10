
;(function(__context){
    var module = {
        id : "399f855e64c6f75bd942191182b4cfcb" , 
        filename : "talkingM.js" ,
        exports : {}
    };
    if( !__context.____MODULES ) { __context.____MODULES = {}; }
    var r = (function( exports , module , global ){

    // 依赖jquery.qbox.js
var talking = function(){
    var _self = this;
    var Url = "/flowproblem/getProblemWordToSayView.json?t="+new Date().getTime();
    this.steps = {};
    this.$stepdom = $('#stepdom');
    this.load = function(url,param,callback){
        $.ajax({
            url : url ,
            type : "get",
            data : param ,
            dataType : "JSON",
            success : function(d){
                if(d.ret){
                    if(!!callback){
                        callback(d.data);
                    }else{
                        _self.dealdata(d.data);
                    }
                }else{
                    alert(d);
                }
            }
        });
    };
    this.dealdata = function(datas){
        if(!!datas){
            _self.$stepdom.empty();
            _self.steps = datas.script;
            if(!!datas.script){
                _self.creatStep("1");
            }
        }
    };
    this.creatStep = function(step){
        var current_step = _self.steps[step];
        if(!!current_step){
            var prevstep = current_step[0].relateSuperStep;
            var html = [];
            html.push('<div class="light"><img src="/app/workflow/flow/flowApi/img/talking.png"><span>处理指导及话术</span></div>')
            $.each(current_step,function(i,word){
                html.push('<div class="order-ti-hsm">');
                //下一个关联步骤没有 鼠标形状默认 class="cursor0"
                html.push('<p class="js-next order-ti-title cursor ',word.relateStep,'" data-curstep="',step,'" data-relateSuperStep="',word.relateSuperStep,'" data-relateStep="',word.relateStep,'">>>',word.problem,'</p>');
                html.push('<p class="clearfix"><span>客服：</span>');
                html.push('<span class="order-ti-kf">',word.answer,'</span>');
                html.push('</p></div>');
            });
            if(prevstep !== -1){
                html.push('<div id="prev-word" class="prevstep" data-prevstep="',prevstep,'">上一步</div>')
            };
            _self.$stepdom.empty().append(html.join(''));
            _self.bindChangestep();
        }

    };
    this.bindChangestep = function(){
        $('.js-next').bind('click',function(e){
            var el = $(this);
            var nextstep = el.attr('data-relateStep');
            _self.creatStep(nextstep);
        });
        $('#prev-word').bind('click',function(){
            var el = $(this);
            var prevstep = el.attr('data-prevstep');
            _self.creatStep(prevstep);
        });
    };
    this.bindevent = function(){
        $(document).delegate('.js-talking','click',function(e){
            var el = $(e.target);
            var param = {};
            var flowProblemId  = el.attr('data-proid');
            var flowConfigId  = el.attr('data-confid') == undefined ? el.closest('dt').attr('data-confid') :el.attr('data-confid');
            param.flowProblemId = flowProblemId;
            param.flowConfigId = flowConfigId;
            param.currentId = currentId;
            _self.load(Url,param);
        });
    };
    _self.bindevent();
}
var smsReSendUrl = "/flowapi/smsReSend.json?t="+new Date().getTime()+"&currentId="+currentId;
function sync(url,params,callback){
    $.ajax({
        url : url ,
        type : "get",
        data : params ,
        dataType : "JSON",
        success : function(d){
            if(d.success){
                if(callback){
                    callback(d.data);
                }
            }else{
                alert(d.data);;
            }
        },
        error : function(d){
            alert("服务端出错");
        },
        complete : function(d){
        }

    });
}
function initTalk(){
    return new talking();
}
function initTab(){
    var activeCls = 'cur';
    $('#tab a[data-tab]').bind('click',function(e){
        e.preventDefault();
        var $this = $(this);
        var eq = $this.attr('data-tab');
        $('#tab').find('.cur').removeClass('cur');
        $this.addClass('cur');
        $('#tab').find('.js-showtab').hide();
        $('[data-tabshow]').hide();
        $('[data-tabshow='+eq+']').show();
    });
    $('#reSendsms').bind('click',function(e){
        var me = $(this), ctn = $('#usetools');
        var smsEle = $(smsTemplate);
        show(smsEle, ctn);
        $('#resend_cal').click(function(event){
            closeHandler(smsEle);
        });
        $('#resend_ok').click(function(event){
            var $error = $('.remsg-error');
            $error.empty();
            var param = {};
            param.phoneNo = $.trim(smsEle.find('input').val());
            param.content = $.trim(smsEle.find('textarea').val());
            if(vali($error,param.phoneNo,param.content)){
                param.content = encodeURI(param.content);
                sync(smsReSendUrl,param,function(){
                    closeHandler(smsEle);
                    alert("操作成功");
                })
            }
        });
        var vali = function vali(dom,phone,text){
            var error = [];
            var phonePattern = new RegExp("^1[3458][0-9]{9}$");
            var isphone = phonePattern.test(phone);
            var islength = text.length <= 200;
            if(!isphone){
                error.push('请正确填写手机号');
            }
            if(!islength){
                error.push('短信内容不能超过200字');
            }
            dom.append(error.join(' '));
            return isphone && islength;
        }
        function show(sub, ctn) {
            ctn.children().hide();
            smsEle.find('input').val($.trim($('#callnumber').text()));
            ctn.append(sub);
        }
        function closeHandler(ele){
            ele.hide();
            $('#resend_ok').unbind('click');
            $('#resend_cal').unbind('click');
            ele.remove();
            ctn.children().show();
        };
    });
    return initTalk();
}
var smsurl = "/flowapi/smsReSend.json?t="+new Date().getTime()+"&currentId="+currentId;
/*
var smsTemplate = '<div class="layer_box">\
                      <div>\
                      <div class="md10 ft14">短信发送</div>\
                      <div class="md10">电话号码：</div>\
                      <div class="md20"><input name="" class="ipt"></div>\
                      <div class="md10">短信内容：</div>\
                      <div class="md20"><textarea name="smstext" class="ipt"></textarea></div>\
                      <div class="remsg-error"></div>\
                      <div class="resendsms-btn"><button id="resend_ok">发送</button><button id="resend_cal">取消</button></div></div></div>';
*/
var smsTemplate = ['<div class="order-ti-mc">',
    '<!-- 常用工具切换的内容 -->',
    '<div class="order-ti-hs">',
    '<!-- 常用工具点击短信发送后内容 -->',
    '<div class="order-cy order-cy-main">',
    '<div>短信发送</div>',
    '<div>电话号码： <br><input name="" class="ipt"></div>',
    '<div class="order-cy-center">短信内容： <br><textarea name="smstext" class="ipt"></textarea></div>',
    '<div class="remsg-error"></div>',
    '<div class="order-cy-but"><a href="javascript:;" id="resend_ok" title="">发送</a><a href="javascript:;" id="resend_cal" title="">取消</a></div>',
    '</div>',
    '</div>',
    '</div>'].join('');

exports.initTab = initTab;


    })( module.exports , module , __context );
    __context.____MODULES[ "399f855e64c6f75bd942191182b4cfcb" ] = module.exports;
})(this);

var orderViewRender = require('./tmp'),
    orderViewMod = require('./orderViewMod'),
    pageType = 'process';

var softPhoneInit = require('./softPhoneInit');
var otaInfoDialog = require('./otaInfoDialog');
var talking = require('common.talkingM');
//初始化话术
var talkingOrder = talking.initTab();
require('base.jquery-switchable');

function ajaxGet(args) {
    var url = framework.addUser(args.url),
        data = args.data,
        callback = args.callback,
        exceptionName = args.name;

    $.ajax({
        url : url,
        data : data,
        success : function(d) {

            try {
                d = flowUtil.evalJson(d);
                if(d.ret) {
                    if($.type(callback) === 'function') {
                        callback(d.data);
                    }
                } else {
                    alert(d.errmsg);
                }
            } catch(e) {
                flowUtil.log((exceptionName || 'ajaxGet exception') + ' : ' + e);
            }
        }
    });
}

//渲染来电历史
function telHistoryRender(container) {
    var $container = $(container);

    //获取来电历史
    ajaxGet({
        url : '/flowinfo/getFlowContactListByFlowId.json',
        data : {
            flowId : flowId
        },
        name : 'getFlowContactListByFlowId',
        callback : function(d) {
            var list = d.list;
            if(list && list.length > 0) {
                $.each(list, function(i, item) {
                    //拷贝单条数据至根节点
                    item = $.extend(item, item.list[0]);
                    //判断是否为已关单
                    item.expire = item.isClose === 'Y';

                    if(item.list.length > 1) {
                        item.multi = true;
                        item.rows = item.list.length;
                        item.list.splice(0, 1);
                    }

                    item.No = i + 1;
                    item.problemText = item.problemNames.split(',').join('-->');
                });
                $container.append(orderViewRender.renderTelHistory(d));
                mplayerRender($('#audioContainer'), list[0].playUrl);
                $(document).on('click', '.js-playAudio', function() {
                    var playUrl = $(this).data('playurl');
                    mplayerPlay(playUrl);
                });
            } else {
                $container.hide();
            }
        }
    });
}

function mplayerRender(container, playUrl) {
    $(container).html(orderViewRender.renderMplayer({
        playUrl : playUrl
    }));
}

function mplayerPlay(url) {
    var MediaPlayer = document.MediaPlayer;
    if (MediaPlayer) {
        MediaPlayer.URL=url;
        MediaPlayer.controls.play();
    }
}

//渲染处理历史
function shRender(container) {

    //获取处理历史
    ajaxGet({
        url : '/flowinfo/flowUserFullLogsById.json',
        data : {
            flowId : flowId
        },
        name : 'flowUserFullLogsById',
        callback : function(d) {
            $(container).html(orderViewRender.renderSh(d));
        }
    });
}

//详细日志
function dlRender(container) {

    //获取详细日志
    ajaxGet({
        url : '/flowinfo/flowFullLogsById.json',
        data : {
            flowId : flowId
        },
        name : 'flowFullLogsById',
        callback : function(d) {
            $(container).html(orderViewRender.renderDl(d));
        }
    });
}

//通话记录
function rRender(container) {

    //获取详细日志
    ajaxGet({
        url : '/flowinfo/flowRecordById.json',
        data : {
            flowId : flowId
        },
        name : 'flowRecordById',
        callback : function(d) {
            $(container).html(orderViewRender.renderRecord(d));
        }
    });
}

//回访记录
function hfRender(container) {

    //获取详细日志
    ajaxGet({
        url : '/flowinfo/flowAppointLogsById.json',
        data : {
            flowId : flowId
        },
        name : 'flowhfRecordById',
        callback : function(d) {
            $(container).html(orderViewRender.renderhfRecord(d));
        }
    });
}
//特殊状态
function specialStatusRender(container, status, isManager, canDesignate) {
    ajaxGet({
        url : '/flowinfo/getProcessStatus.json',
        name : 'getProcessStatus',
        callback : function(d) {
            var processStatusSelect = $(container).html("");
            $("<option "+ (status=="无"?"selected":"") +"></option>").attr("value","0").html("无").appendTo(processStatusSelect);
            jQuery.each(d.list,function(index,item){
                $("<option "+ (status==item.name?"selected":"") +"></option>").attr("value",item.id).html(item.name).appendTo(processStatusSelect);
            });

            setTimeout(function(){
                opRender(container, $('#opContainer'), isManager, canDesignate);//渲染操作按钮
            }, 0);
        }
    });
}

/**
 * 处理结果栏目--特殊状态
 * @param selectJQ
 */
function opRender(selectJQ, opContainer, isManager, canDesignate){
    selectJQ.change(function(){
        var command = [];

        if(isManager){
            switch(selectJQ.val()){
                case "0":
                    command = ["closeOrder", "transferOrder"];
                    if(canDesignate){
                        command.push("designate");
                    }
                    break;

                case "1":
                case "2":
                case "3":
                    command = ["tempSave"];
                    break;
                case "4":
                    command = ["tempSave"];
                    break;
                case "99":
                    command = ["closeOrder"];
            }
        }else{
            command.push("closeOrder", "transferOrder", "tempSaveOuter", "delegate");
        }

        opContainer.html(orderViewRender.renderOp(command).join(''));
    }).change();
}

//处理综合查询
function allSearch(container, data) {
    //获取综合查询
    $.ajax({
        url : '/flowbussiness/queryTuanAndHotelOrders.json',
        data : data,
        success : function(d) {
            var html = "", d= eval(d), type = "", obj = {}, applyTypeObj = {};
                obj = {
                    "voucher" : "商户券",
                    "coupon" : "骆驼券",
                    "through_coupon" : "通票",
                    "2dcode" : "二维码",
                    "express" : "快递"
                };
                applyTypeObj = {
                    "alipay": "支付宝",
                    "tenpay": "财付通",
                    "credit": "余额",
                    "cash": "现金",
                    "1": "现付",
                    "2": "预付",
                    "cmb": "招商银行",
                    "bill": "快钱",
                    "lakala": "拉卡拉"
               };
               html ='<tr><th>序号</th><th>类别</th><th>订单号</th><th>商户（用户）</th>';
               html += '<th>代理商</th><th>产品</th><th>支付总额</th><th>支付方式</th></tr>';
            if(d.length>0){
                for(i = 0; i < d.length ; i++){
                    type = obj[d[i]['delivery']] || d[i]['delivery'];
                    d[i]['otaName'] = d[i]['otaName'] || "无";
                    applyType = applyTypeObj[d[i]['service']] || d[i]['service']
                    html += '<tr><td>'+(i+1)+'</td>';
                    html += '<td><a href="javascript:;" onclick=showCoupon(\"'+d[i]['id']+'\",\"'+ type +'\") class="font-color">'+type+'</a></td>';
                    html += '<td><a href="javascript:;" onclick=showTuanDetailInfo(\"'+d[i]['id']+'\") class="font-color">'+d[i]['id']+'</a></td>';
                    html += '<td>'+d[i]['username']+'</td><td>'+ d[i]['otaName']+'</td>';
                    html += '<td><a href="javascript:;"  onclick=showProduce(\"'+d[i]['team_id']+'\") class="font-color">'+d[i]['stitle']+'</a></td><td>'+d[i]['origin']+'</td>';
                    html += '<td>'+applyType+'</td></tr>';
                }
            $(container).find("table").html(html);
            } else{
                alert("没有相关数据");
            } 
        }
    });
}

//处理团购
function tuanSearch(container, data) {
    //获取团购
    $.ajax({
        url : '/flowbussiness/queryTuan.json',
        data : data,
        success : function(d) {
            var html = "", d = $.parseJSON(d),
            typeObj = {},applyTypeObj = {},typeSecObj ={};
            typeObj = {
                "voucher": "商户券",
                "coupon": "骆驼券",
                "through_coupon": "通票",
                "2dcode": "二维码",
                "express": "快递"
            };
            applyTypeObj = {
                "alipay": "支付宝",
                "tenpay": "财付通",
                "credit": "余额",
                "cash": "现金",
                "1": "现付",
                "2": "预付",
                "cmb": "招商银行",
                "bill": "快钱",
                "lakala": "拉卡拉"
            };
            typeSecObj = {
                "hotelteam": "酒店",
                "travelteam": "旅游"
            }
            html = '<tr>\
                <th>序号</th>\
                <th>订单号</th>\
                <th>券类别</th>\
                <th>用户名</th>\
                <th>产品</th>\
                <th>数量</th>\
                <th>总额</th>\
                <th>余额支付</th>\
                <th>支付</th>\
                <th>支付方式</th>\
                <th>支付状态</th>\
                <th>类型</th>\
              </tr>'
            if(d){
                var type ="", applyType = "", typeSec= "", type ={};
                for(i = 0; i < d.data.length ; i++){
                    type = typeObj[d.data[i]['delivery']] || d.data[i]['delivery'];
                    applyType = applyTypeObj[d.data[i]['service']] || d.data[i]['service'];
                    typeSec = typeSecObj[d.data[i]['czone']] || d.data[i]['czone'];
                    html += '<tr><td>'+(i+1)+'</td>';
                    html += '</td><td><a href="javascript:;" onclick=showTuanDetailInfo(\"'+d.data[i]['id']+'\") class="font-color">'+d.data[i]['id']+'</a></td>';
                    html += '<td><a href="javascript:;" onclick=showCoupon(\"'+d.data[i]['id']+'\",\"'+ type+'\") class="font-color">'+ type+'</a></td><td>'+d.data[i]['username']+'</td>';
                    html += '<td><a href="javascript:;"  onclick=showProduce(\"'+d.data[i]['team_id']+'\") class="font-color">'+d.data[i]['stitle']+'</a></td>';
                    html += '<td>'+d.data[i]['quantity']+'</td><td>'+d.data[i]['origin']+'</td>';
                    html +='<td>'+d.data[i]['credit']+'</td><td>'+d.data[i]['money']+'</td><td>'+applyType+'</td><td>'+d.data[i]['state']+'</td><td>'+typeSec+'</td></tr>'
                }
                $(container).find("table").html(html);
            } else {
                alert("暂无相关数据");
            }
        }
    });
}

//处理酒店查询
function hotelSearch(container, data) {
    //获取查询
    $.ajax({
        url : '/flowbussiness/queryHotelOrders.json',
        data :data,
        success : function(d) {
    var html = "", d = $.parseJSON(d), obj ={};
        d = d.data;
        obj = {
            "1" : "现付",
            "2" : "预付"
        };
        html = '<tr>\
                <th>序号</th>\
                <th>订单类型</th>\
                <th>订单来源</th>\
                <th>订单号</th>\
                <th>代理商一口价名称</th>\
                <th>酒店名称</th>\
                <th>房型</th>\
                <th>联系人</th>\
                <th>联系人电话</th>\
                <th>入住人姓名</th>\
                <th>入住时间</th>\
                <th>离店时间</th>\
                <th>预定时间</th>\
                <th>价格</th>\
                <th>房间数</th> \
                <th>付款方式</th>\
                <th>订单状态</th>\
              </tr>';
    if (d.length>0){
            for(i = 0; i < d.length ; i++){
                var type = "";
                type = obj[d[i]['payType']] || d[i]['payType'];
                html += '<tr><td>'+(i+1)+'</td>';
                html +='<td>'+d[i]["type"]+'</td><td>'+d[i]['orderFrom']+'</td>';
                html +='<td>'+d[i]['orderNo']+'</td>';
                html +='<td>'+d[i]['logoText']+'</td><td>'+d[i]['hotelName']+'</td>';
                html +='<td>'+d[i]['roomName']+'</td><td>'+d[i]['contactName']+'</td>';
                html +='<td>'+d[i]['contactPhone']+'</td><td>'+d[i]['guests']+'</td>';
                html +='<td>'+d[i]['checkInDate']+'<br/>'+d[i]['arrivalTime']+'</td>';
                html +='<td>'+d[i]['checkOutDate']+'<br/>'+d[i]['arrivalTime']+'</td>';
                html +='<td style="width:70px;">'+d[i]['created']+'</td><td>'+d[i]['totalPrice']+'</td>';
                html +='<td>'+d[i]['roomCount']+'</td><td>'+ type +'</td>';
                html +='<td>'+d[i]['statusText']+'</td> </tr>'
            } 
            $(container).find("table").html(html);
        } else {
            alert("没有相关数据");
        }
    }
});}

function down(fileInfoId){
    var url="/fileinfo/downloadPage.call";
    url+="?fileInfoId="+fileInfoId;
    url=framework.addUser(url);
    window.open(url);
}
//显示团购 券信息
function showCoupon(orderId,type){
      var url="";
    //根据type 跳转到不同的界面
    //"二维码"
      if(type=="商户券"||type=="骆驼券"||type=="通票"){
             url=webRoot+"/flowbussiness/prepareQueryTuanCouponDetail.call?id="+orderId; 
             framework.open(url,type+"详情");
         }else if(type=="快递"){
             url=webRoot+"/flowbussiness/prepareQueryTuanExpressDetail.call?id="+orderId;
             framework.open(url,"快递详情");
         } else{
             alert("暂时不提供 "+type+" 的详情查询");
         }      
    
}

//显示团购订单
function showTuanDetailInfo(id){
    var url=webRoot+"/flowbussiness/prepareQueryTuanDetail.call?id="+id;
    framework.open(url,"团购订单详情");
}
//产品
function showProduce(teamId){
    var url="http://tuan.qunar.com/team.php";
    url+="?id="+teamId;
    window.open(url);
}
function showTargetOtaPpbDetailInfo(orderNum,wrappId ){
  var url=webRoot+"/flowbussiness/queryTargetOtaPpbDetail.call?forward=otappbDetail&orderNum="+orderNum+"&wrapperId="+wrappId;
 framework.open(url,"otappb订单详情");
}
window.showTargetOtaPpbDetailInfo =showTargetOtaPpbDetailInfo;
window.showCoupon =showCoupon;
window.showTuanDetailInfo = showTuanDetailInfo; 
window.showProduce =showProduce;
function init_page() {
    //获取基本信息
    ajaxGet({
        url : '/flowinfo/flowById.json',
        data : {
            flowId : flowId
        },
        name : 'flowById',
        callback : function(d) {
            d.flow.compensateInfoFlag = false;

            var flow = d.flow;
            flow.designate = d.canDesignate || false;
            var $root = $(orderViewRender.renderPage(flow, flow.flowConfigName, pageType));
            $(document.body).prepend($root);
            $("#problemNames").text($("#problemNames").text().split(",").join("->"));
            telHistoryRender($('#tHistoryContainer'));
            //历史记录
            getHistoryFlowList();
            //处理结果事件处理
		 
			 var oBD = {
                "机票事业部": {"国内机票":null,"国际机票":null},
                "酒店事业部": {"CPC":null,"OTATTS":null,"酒店团购":null,"一口价":null,"直销预付":null,"先付返佣":null},
                "旅游度假" : {"CPC":null,"OTATTS":null,"酒店团购":null,"一口价":null,"直销预付":null,"先付返佣":null},
                "无线事业部" : {"国内机票":null,"国际机票":null, "CPC":null,"OTATTS":null,"酒店团购":null,"一口价":null,"直销预付":null,"先付返佣":null},
                "callcenter" : {"国内机票":null,"国际机票":null,"CPC":null,"OTATTS":null,"酒店团购":null,"一口价":null,"直销预付":null,"先付返佣":null}
            };
      
            var heOption = null,
                heBD = document.getElementById('businessDep'), 
                heBT =  document.getElementById('businessType'), iSel = 0,
                cascade = [{
                    he: heBD, 
                    cascade: [{he:heBT,cascade:null}]
                }], hecVal = [],  sCurToSelVal = "";

            function createOption(heSel, oData, selectedIndex){
                if(!heSel) return;
                heSel.length = 0;
                heSel.appendChild(new Option("", ""));
                for (var prop in oData) {
                    heSel.appendChild(new Option(prop, prop));
                }
                heSel.selectedIndex = selectedIndex || 0;
                return heSel.options[heSel.selectedIndex].value;
            }

            function setVal(heSel, val){
                var arr = oBD[val];
                heSel.setAttribute("data-name", val);
            };

           
            function cascadeBulid(cascade){
                var evtBind = function(parent){
                        $(parent.he).on('change', function(event){
                            var val = $(parent).val(), arr = oBD[val];
                            parent.he.setAttribute("data-name", val);
                            
                            var cascadeChild = parent.cascade;
                            for (var j = 0, len =cascadeChild.length-1; j < len; j++) {
                                child = cascadeChild[j];
                                child && createOption(child, arr);
                            }
                        });
                    },
                    bind = function(parent, level){
                         if(!parent){ return;}
                         var cascadeChild = parent.cascade;
                         for (var j = 0, len =cascadeChild.length-1; j < len; j++) {
                            child = cascadeChild[j];
                            evtBind(parent.he);

                            arguments.callee(child, level+1);
                        }
                    };

                cascade instanceof Array || (cascade = [cascade]);
                for (var i = 0, len =cascade.length-1; i < len; i++) {
                    var parent = cascade[i];
                    bind(parent, parent.cascade, 1);
                };
            }
 
            cascadeBulid(cascade);
            createOption(heBD, oBD, iSel++);

           if($("#rDuty").attr("data-name") === "用户" || $("#rDuty").attr("data-name")===""){
                $('[data-display]').hide();
            } else {
                $('[data-display]').show();
            }
            $("#rDuty").bind("change",function(){
                if($(this).val() === "用户"){
                    $("[data-display='rDuty']").hide().find("select").val("");
                    $('input[name=userfield5]').val('无效投诉');
                } else {
                    $("[data-display='rDuty']").show();
                    $('input[name=userfield5]').val('有效投诉');
                }
            });
            $("#sCompensate").bind("change", function(){
                if($(this).val() === "是"){
                    $("[data-display='sCompensate']").show();
                    $("#sCompensate-infoDiv").show();
                } else {
                    $("[data-display='sCompensate']").hide().find("select").val("");
                    $("[data-display='sCompensateType']").hide();
                    $("#sCompensate-infoDiv").hide().find("input").val("");
                    $("[data-dpv='礼品").hide().val("");
                }
            });
            $("#sPenalty").bind("change", function(){
                if($(this).val() === "是"){
                        $("[data-display='sPenalty']").show();
                } else {
                        $("[data-display='sPenalty']").hide().find("input").val("");
                }
            });
            $("#sCompensateType").bind("change", function(){
                if($(this).val() ==="直接赔付" || $(this).val() ==="代赔付"){
                    $("[data-dpv='直接赔付,代赔付']").show();
                        $("[data-dpv='礼品").hide().val("");
                } else if ($(this).val() ==="礼品"){
                    $("[data-dpv='礼品").show();
                    $("[data-dpv='直接赔付,代赔付']").hide().val("");
                }
            }) 
            //处理状态
            $.each($('#dealInfo').find('select'), function(){
                $(this).find("option[value='"+ $(this).data("name")+"']").attr("selected",true);
            });
            $.each($("#dealInfoRs").find('select'), function(){
                $(this).find("option[value='"+ $(this).data("name")+"']").attr("selected",true);
            });
            $.each($('#dealInfo').find('select'), function(){
                $(this).find("option[value='"+ $(this).data("name")+"']").attr("selected",true);
            });
            $.each($("#dealInfoRs").find('select'), function(){
                $(this).find("option[value='"+ $(this).data("name")+"']").attr("selected",true);
            });
            $('#dealInfo select').on("change", function(){
               $(this).attr("data-name",$(this).val());
            });
            if($("#sCompensate").attr("data-name") === "是"){
                $("#sCompensate-infoDiv").show();
                $("[data-display='sPenalty']").show();
            } else {
                $("#sCompensate-infoDiv").hide();
                $("[data-display='sPenalty']").hide();
                $("[data-display ='sCompensate']").hide();
                $("[data-display ='sCompensateType']").hide();
            }
            if($("#sPenalty").attr("data-name") === "是"){
                $("[data-display='sPenalty']").show();
            }
            if(!$("[data-dpv='礼品']").attr("data-name")){
                $("[data-dpv='礼品']").hide().val("");
            }
            if(!$('[data-display="sPenalty"]').find("input").val()){
                $('[data-display="sPenalty"]').hide().val();
            } else {
                $('[data-display="sPenalty"]').show();
            }
            if( $("#sCompensateType").attr("data-name") === "礼品"){
                $("[data-display ='sCompensateType']").hide().val();
                $("[data-dpv='礼品']").show();
            }
            if(flow.flowConfigName === "机票"){
                //金额
                var resetMoney =  function(){
                    $("#spcialNode input").each(function(){
                        var sum = 0;
                        if($(this).val() === ""){
                            $(this).val("0.00");
                        } else {
                            sum = Number($("#spcialNode input").eq(0).val()) + Number($("#spcialNode input").eq(1).val()) + Number($("#spcialNode input").eq(2).val());
                            $("#totalCost").val(sum.toFixed(2));
                        }
                    }); 
                }
                resetMoney();
                $("#spcialNode input").not("#totalCost").change(function(){
                    var sum = 0, valueArray=[];
                    if(isNaN($(this).val())){
                        alert("请输入有效数字");
                        $(this).val("0.00");
                        return;
                    };
                    //处理数据显示
                    $(this).val().indexOf(".") >0 ?  valueArray = $(this).val().split(".") : valueArray = [];
                    if(valueArray[1] && valueArray[1].length >2){
                        alert("精确到小数点后2位");
                        var value = $(this).val().split(".") , len;
                         len = value[1].length -2;
                        $(this).val(Number($(this).val().slice(0,$(this).val().length-len)));
                    }
                    if($(this).val() === ""){
                        $(this).val("0.00");
                    }
                    sum = Number($("#spcialNode input").eq(0).val()) + Number($("#spcialNode input").eq(1).val()) + Number($("#spcialNode input").eq(2).val());
                    $("#totalCost").val(sum.toFixed(2));
                }).focus(function(){
                    if(parseInt($(this).val()) === 0){
                        $(this).val("");
                    }
                }).blur(function(){
                    resetMoney();
                });
                $("#hotelPay").remove();
            } else {
                $("#spcialNode").remove();
            }
            //处理历史、日志和通话记录tab
            $('#recordContainer').switchable({
                activeTriggerCls : 'cur',
                events : ['click'],
                activeIndex : 0
            });

            //处理历史
            shRender($('#shContainer'));

            //详细信息
            dlRender($('#dlContainer'));

            //通话记录
            rRender($('#rContainer'));

            //降级按钮
            if($("#js-priority").attr("data-priority") > 0){
                 $("#js-down").remove();
                 $("#js-setStyle").text("工单号：").removeClass("red");
            } else{
                 $("#js-down").show();
                 $("#js-setStyle").text("*紧急工单号：").addClass("red");
            }
            if($("#js-manager").data("manager") === false){
                $("#js-down").remove();
            }
            //回访记录
            hfRender($('#hfContainer'));
            //特殊状态
            specialStatusRender($('#processStatus'), flow.processStatusName, flow.isManager, flow.designate);
            //用户性别显示
            if($("#uSex").val() === "M"){
                $("#sex").text(" 先生");
            } else {
                $("#sex").text(" 女士");
            }
            if(pageType == "process"){
                $("#modName").show();
            }
            //用户姓名保存
            var name = "";
            $("#modName").live("click", function(){
                var html ="";
                var sex = $("#uSex").val();
                var uName = $("#uName").val();
                html = '<input type="text" name="realName" ';
                html +='class="input-width-long" value="'+ uName +'">';
                html +=' <select name="realName" id="selectSex"><option value="F">先生</option><option value="W">女士</option></select>'
                html +=' <button id="saveName">保存</button><button id="resetBtn">取消</button><input type="hidden" value="'+sex+'" id="uSex"/><input type="hidden" value="'+uName+'" id="uName"/>'
                $(this).parent().html(html);
                $("#selectSex").find("option[value='"+ sex +"']").attr("selected",true);
                
            });
            $("#resetBtn").live("click", function(){
                var html = "", sex = "";
                if($("#uSex").val() === "F"){
                  sex = " 先生";
                } else {
                  sex = " 女士";
                }
                html = $("#uName").val() + ' <span id="sex"> '+ sex +'</span><button id="modName" style=""> 修改</button><input type="hidden" value="'+$("#uSex").val()+'" id="uSex"/><input type="hidden" value="'+$("#uName").val()+'" id="uName"/>';
                $("#realName").html(html);
            });
            $("#saveName").live("click", function(){
                var html = "", sex="",realName = $("#realName");
                if(realName.find("select").val() === "F"){
                    sex = "先生";
                } else {
                    sex ="女士";
                }
                html = realName.find("input").val() + ' ' + sex + ' <button id="modName">修改</button><input type="hidden" value="'+realName.find("select").val()+'" id="uSex"/><input type="hidden" value="'+realName.find("input").val()+'" id="uName"/>';
                ajaxGet({
                    url : '/flowinfo/updateCustomerByManager.json',
                    data :{
                        flowId : flowId,
                        customerInfoId : realName.data("id"),
                        realName : realName.find("input").val(),
                        gender : realName.find("select").val(),
                        phone : realName.data("phone")
                    },
                    name : 'getFlowrRealNameByFlowId',
                    callback : function(d) { 
                        $("#realName").html(html);
                    }
                });
            });
            //附件下载
            $('#atachContainer').on('click', '.js-download', function(e) {
                e.preventDefault();
                down($(this).data('id'));
            });
            //处理意见
            var paseFtn = function(){
                if($(this).val().length>1000){
                    alert("最多可输入1000字");
                    $(this).val($(this).val().substring(0,999)).focus();
                }
            }
            $("#lastRemark").bind("keypress",paseFtn);
            $("#lastRemark").bind("blur",paseFtn);
             //处理查询信息
            $('#searchTabs span').bind("click", function(){
                $(this).siblings().removeClass("cur");
                $(this).addClass("cur");
                $(this).parent().parent().find(".handle-center").hide();
               $(this).parent().parent().find(".handle-center").eq($(this).index()).show();
            })
            //处理综合查询
            $("#searchForm01 .searchBtn").bind("click", function(){
                if(!$(this).siblings("input").val()){
                    alert("手机号不能为空");
                } else{
                    allSearch($('#allContainer'), {
                        flowId : flowId,
                        mobile : $("#telephone").val(),
                        currentId : currentId
                    });
                }
            })
            //处理团购查询
            $("#searchForm02 .searchBtn").bind("click", function(){
                var orderNo = $(this).parent().find("input[type='text']").eq(0).val();
                var orderType = $(this).parent().find("input[type='text']").eq(1).val();
                var mobile = $(this).parent().find("input[type='text']").eq(2).val();
                var user_id = $(this).parent().find("input[type='text']").eq(3).val();
                var username = $(this).parent().find("input[type='text']").eq(4).val();
                var realname = $(this).parent().find("input[type='text']").eq(5).val();
                if(!orderNo && !orderType && !mobile && !user_id && !username && !realname){
                    alert("查询条件不能为空");
                } else {
                    tuanSearch($('#tuanContainer'),{
                           flowId : flowId,
                           id : orderNo,
                           coupon : orderType,
                           mobile : mobile,
                           user_id : user_id,
                           username : username,
                           realname : realname,
                           currentId : currentId
                    });
                }
                
            });
            //处理酒店查询
            $("#searchForm03 .searchBtn").bind("click", function(){
                var orderNo = $(this).parent().find("input[type='text']").eq(0).val();
                var contactPhone = $(this).parent().find("input[type='text']").eq(1).val();
                var contactName = $(this).parent().find("input[type='text']").eq(2).val();
                var checkInDate =  $(this).parent().find(".call-time").eq(0).val();
                var checkOutDate = $(this).parent().find(".call-time").eq(1).val();
                if(!orderNo && !contactPhone && !contactName && !checkInDate && !checkOutDate){
                    alert("查询条件不能为空");
                } else {
                    hotelSearch($('#hotelContainer'),{
                           flowId : flowId,
                           orderNo : orderNo,
                           contactPhone : contactPhone,
                           contactName : contactName,
                           checkInDate : checkInDate,
                           checkOutDate : checkOutDate,
                           currentId : currentId
                    });
                }
            });
            // resetBtn
            $(".resetBtn").bind("click", function(){
                $(this).parent().find("input[type='text']").val("");
            });

            //操作按钮点击处理
            $('#opContainer').delegate('.js-op', 'click', function() {
                var thisJQ = $(this);
                if(thisJQ.attr("isProcess") === "1"){
                    return;
                }else{
                    thisJQ.attr("isProcess", "1");
                }

                var type = thisJQ.data('type');
                orderViewMod[type] && orderViewMod[type](thisJQ);
            });
            softPhoneInit(true);
            otaInfoDialog();

            //附件上传初始化
            setTimeout(function(){
                initUpload();
            }, 0);

            //删除附件
            $(document).delegate('.js-deletefile','click',function(e){
                e.preventDefault();
                $(this).parent().remove();
            });

           //酒店不显示赔付信息模块 机票不显示查询模块
            if(flow.flowConfigName == "旅游酒店"||flow.flowConfigName == "火车票"||flow.flowConfigName == "其它"){
                $("#sCompensate-infoDiv").remove();
            } else {
                $("#searchContainer").remove();
            }

            if(flow.isManager == false && flow.isFangKong == false){//不是中台节点或者房控组
                window.isManager =false;
                disabledProcessCompensateResult();
            }
        }
    });
    //话术相关信息
    talkingFtn();
}

/**
 * 禁用处理结果和赔付信息部分
 */
function disabledProcessCompensateResult(){
    $("#resultContainer").find("input:visible,select:visible").attr("disabled",true);
    $("#sCompensate-infoDiv").find("input:visible,select:visible,textarea:visible").attr("disabled",true);
}

//修改问题列别
var modifyProblem = function(){
    _this = this;
    _this.flowProblemRootId ="";
    _this.flowProblemList = [];
    _this.selectIndex =  0;
    _this.problemNames =[];
    _this.problemIds = [];
    $(this).bind('talkingUpdate', function(e, d) {
            talkingOrder.dealdata(d);
    });
};
modifyProblem.prototype.getFlowProblemList =  function(flowConfigId){
        try{
            var flowConfigId = flowConfigId;
            var url = "/flowinterface/getFlowProblemListByFlowConfigId.json";
            var data = {"flowConfigId":flowConfigId};
            if(_this.flowProblemList.length>0 ){
                _this.buildSelectType(flowConfigId, _this.flowProblemList);
            } else {
                ajaxUtil.json(url,function(result){
                    if(result.ret){
                        _this.flowProblemRootId = result.data.rootId;
                        _this.flowProblemList = result.data.list;
                        _this.buildSelectType(_this.flowProblemRootId, _this.flowProblemList);
                    }else{
                            alert(result.errmsg);
                    }
                },data);
            }

        }catch(e){
            alert('getFlowByOrderNo error:'+e.description);
        }
};
modifyProblem.prototype.buildSelectType = function(flowProblemRootId, data){
    var topType  = [], parentIds = [];
        for(var i = 0 ; i< data.length; i++){
            var flowProblemName = data[i].flowProblemName,
                parentId = data[i].parentId,
                flowProblemId = data[i].flowProblemId;
                if(parentId === flowProblemRootId){
                    topType.push(flowProblemName);
                    parentIds.push(flowProblemId);
                } 
                        
        }
    if(topType.length>0){
        _this.buildSelectProblemDiv(topType, parentIds);
    } else {
        _this.problemNames =[], _this.problemIds = [];
        $.map($(".js-oqc ul .cur"), function(item){
            _this.problemNames.push($(item).attr("data-name"));
            _this.problemIds.push($(item).attr("data-parentid"));
        });
    }
}
modifyProblem.prototype.buildSelectProblemDiv = function(typeData, parentId){
        var select =  $(".js-oqc").html(), pTag="";
        if(_this.selectIndex > 0){
            pTag = "<p></p>";
        }
        select += pTag+'<ul style="width: auto;" id="select'+ _this.selectIndex +'">';
        for(var i = 0; i < typeData.length; i++){
            select += "<li data-parentId='"+ parentId[i] +"' data-name='"+typeData[i]+"'><a href='javascript:;'>"+ typeData[i] +"</a></li>";
        }
        select +="</ul>";
        $(".js-oqc #select"+_this.selectIndex).find("li").live("click",function(){
            $(this).addClass("cur");
            $(this).siblings().removeClass("cur");
            $(this).parent().nextAll().remove();
            _this.getFlowProblemList($(this).attr("data-parentId"));
            _this.getScriptByFlowProblemId($(this).attr("data-parentId"), {
                callback : function(d) {
                    $(_this).trigger('talkingUpdate', d);
                }
            });
        });
        $(".js-oqc").html(select);
        _this.selectIndex +=1;
};
modifyProblem.prototype.getScriptByFlowProblemId = function(flowProblemId, config) {
    $.ajax({
        url : framework.addUser('/flowinterface/getScriptByFlowProblemId.json'),
        data : {
            flowProblemId : flowProblemId
        },
        success : function(d) {
            try {
                d = flowUtil.evalJson(d);

                if(d.ret) {
                    if(config && $.type(config.callback) === 'function') {
                        config.callback(d.data);
                    }
                } else {
                    alert(d.errmsg);
                }
            } catch (e) {
                flowUtil.log('getScriptByFlowProblemId error : ' + e);
            }
        },
        error : function(xhr, s) {
            flowUtil.log('getScriptByFlowProblemId ajax error : ' + s);
        }
    });
};
//修改分类
$("#modifyType").live("click", function(){
    if($(this).attr("data-statue")){
        $("#modifyCallType").show();
        $(".hask").show();
    } else {
        var flowConfigId = $("#modifyCallType").data("info"),
        modifyFtn = new modifyProblem();
        $("#modifyCallType").show();
        $("#modifyCallType").css({"position":"absolute",
                            "top" : "138px",
                            "z-index":"1001",
                            "left" : "50%",
                            "margin-left" : "-500px",
                            "width" : "750px"
                        });
        $("#modifyCallType ul").css("width" ,"auto");
        $("#modifyCallType .call-table-main").css({"padding-bottom":"20px","border-bottom":"1px solid #ccc"});
        //获取一级分类
        modifyFtn.getFlowProblemList(flowConfigId); 
        $(".hask").show();
        $(".hask").bind("click", function(){
            $(this).hide();
            $("#modifyCallType").hide();
            $("#modifyType").attr("data-statue","true");
        });
        $("#saveData").bind("click", function(){
            if(_this.problemNames.length>0){
                $("#modifyCallType").hide();
                 $(".hask").hide();
                $("#modifyType").attr("data-statue","true");
                $("#problemNames").text(" " + _this.problemNames.join("->"));
                $.ajax({
                    type : "POST",
                    data : {
                        flowId : flowId,
                        problemNames: _this.problemNames.join(","),
                        problemIds : _this.problemIds.join(","),
                        currentId : currentId
                    },
                    url : "/flowinfo/updateProblemByManager.json",
                    dataType : "json",
                    success : function(msg){
                       if(!msg.ret){
                         alert("修改失败");
                       }
                    }
                });
            } else {
                alert("请选择修改类别");
            }
         });     
    }
 
});
var talkingFtn = function (){
    // 显示隐藏话术
    $('#showTalk').bind('click',function(e){
        var visible = $('#tab').is(':visible');
        if(visible){
            $('#tab').hide();
        }else{
            $('#tab').show();
        }
    });
    window.openFlightServiceRule = function (){
        var url="http://kegui.jptonghang.com/dm/Prescribe/guiding.html?Airways=#";
        framework.open(url,'服务规范');
    }
    window.findCustomer = function (){
        var url="/customerinfo/selectQunarIndex.call";
        framework.open(url,"客户查询");
    }

}
var getHistoryFlowList = function(){
   //历史工单
    var url = framework.addUser("/flowinfo/getHistoryFlowListByPhone.json"),
        data = {"phone":channelText},
        $historyOrderContainer = $('#historyOrderContainer');
        $.ajax({
            url:url,
            data:data,
            success:function(d) {
                try {
                    d = eval('(' + d + ')');
                    if(d.ret) {
                        var data = d.data;
                        $.each(data.list, function(i, item) {
                            if(item.currentNode === '结束') {
                                item.hl = true;
                            }
                        });
                        $historyOrderContainer.append(orderViewRender.renderHistoryOrder(data));
                        $("#flowHistorySizeSpan").text(data.list.length);
                    } else {
                        flowUtil.log(d.errmsg);
                    }
                } catch (e) {
                    flowUtil.log('getHistoryFlowListByPhone : ' + e);
                }
            }
        });
};
$(init_page);
var orderViewRender = require('./tmp'),
    orderViewMod = require('./orderViewMod'),
    pageType = 'process';

var softPhoneInit = require('./softPhoneInit');
var otaInfoDialog = require('./otaInfoDialog');
var talking = require('common.talkingM');
//��ʼ������
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

//��Ⱦ������ʷ
function telHistoryRender(container) {
    var $container = $(container);

    //��ȡ������ʷ
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
                    //�����������������ڵ�
                    item = $.extend(item, item.list[0]);
                    //�ж��Ƿ�Ϊ�ѹص�
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

//��Ⱦ������ʷ
function shRender(container) {

    //��ȡ������ʷ
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

//��ϸ��־
function dlRender(container) {

    //��ȡ��ϸ��־
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

//ͨ����¼
function rRender(container) {

    //��ȡ��ϸ��־
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

//�طü�¼
function hfRender(container) {

    //��ȡ��ϸ��־
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
//����״̬
function specialStatusRender(container, status, isManager, canDesignate) {
    ajaxGet({
        url : '/flowinfo/getProcessStatus.json',
        name : 'getProcessStatus',
        callback : function(d) {
            var processStatusSelect = $(container).html("");
            $("<option "+ (status=="��"?"selected":"") +"></option>").attr("value","0").html("��").appendTo(processStatusSelect);
            jQuery.each(d.list,function(index,item){
                $("<option "+ (status==item.name?"selected":"") +"></option>").attr("value",item.id).html(item.name).appendTo(processStatusSelect);
            });

            setTimeout(function(){
                opRender(container, $('#opContainer'), isManager, canDesignate);//��Ⱦ������ť
            }, 0);
        }
    });
}

/**
 * ��������Ŀ--����״̬
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

//�����ۺϲ�ѯ
function allSearch(container, data) {
    //��ȡ�ۺϲ�ѯ
    $.ajax({
        url : '/flowbussiness/queryTuanAndHotelOrders.json',
        data : data,
        success : function(d) {
            var html = "", d= eval(d), type = "", obj = {}, applyTypeObj = {};
                obj = {
                    "voucher" : "�̻�ȯ",
                    "coupon" : "����ȯ",
                    "through_coupon" : "ͨƱ",
                    "2dcode" : "��ά��",
                    "express" : "���"
                };
                applyTypeObj = {
                    "alipay": "֧����",
                    "tenpay": "�Ƹ�ͨ",
                    "credit": "���",
                    "cash": "�ֽ�",
                    "1": "�ָ�",
                    "2": "Ԥ��",
                    "cmb": "��������",
                    "bill": "��Ǯ",
                    "lakala": "������"
               };
               html ='<tr><th>���</th><th>���</th><th>������</th><th>�̻����û���</th>';
               html += '<th>������</th><th>��Ʒ</th><th>֧���ܶ�</th><th>֧����ʽ</th></tr>';
            if(d.length>0){
                for(i = 0; i < d.length ; i++){
                    type = obj[d[i]['delivery']] || d[i]['delivery'];
                    d[i]['otaName'] = d[i]['otaName'] || "��";
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
                alert("û���������");
            } 
        }
    });
}

//�����Ź�
function tuanSearch(container, data) {
    //��ȡ�Ź�
    $.ajax({
        url : '/flowbussiness/queryTuan.json',
        data : data,
        success : function(d) {
            var html = "", d = $.parseJSON(d),
            typeObj = {},applyTypeObj = {},typeSecObj ={};
            typeObj = {
                "voucher": "�̻�ȯ",
                "coupon": "����ȯ",
                "through_coupon": "ͨƱ",
                "2dcode": "��ά��",
                "express": "���"
            };
            applyTypeObj = {
                "alipay": "֧����",
                "tenpay": "�Ƹ�ͨ",
                "credit": "���",
                "cash": "�ֽ�",
                "1": "�ָ�",
                "2": "Ԥ��",
                "cmb": "��������",
                "bill": "��Ǯ",
                "lakala": "������"
            };
            typeSecObj = {
                "hotelteam": "�Ƶ�",
                "travelteam": "����"
            }
            html = '<tr>\
                <th>���</th>\
                <th>������</th>\
                <th>ȯ���</th>\
                <th>�û���</th>\
                <th>��Ʒ</th>\
                <th>����</th>\
                <th>�ܶ�</th>\
                <th>���֧��</th>\
                <th>֧��</th>\
                <th>֧����ʽ</th>\
                <th>֧��״̬</th>\
                <th>����</th>\
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
                alert("�����������");
            }
        }
    });
}

//����Ƶ��ѯ
function hotelSearch(container, data) {
    //��ȡ��ѯ
    $.ajax({
        url : '/flowbussiness/queryHotelOrders.json',
        data :data,
        success : function(d) {
    var html = "", d = $.parseJSON(d), obj ={};
        d = d.data;
        obj = {
            "1" : "�ָ�",
            "2" : "Ԥ��"
        };
        html = '<tr>\
                <th>���</th>\
                <th>��������</th>\
                <th>������Դ</th>\
                <th>������</th>\
                <th>������һ�ڼ�����</th>\
                <th>�Ƶ�����</th>\
                <th>����</th>\
                <th>��ϵ��</th>\
                <th>��ϵ�˵绰</th>\
                <th>��ס������</th>\
                <th>��סʱ��</th>\
                <th>���ʱ��</th>\
                <th>Ԥ��ʱ��</th>\
                <th>�۸�</th>\
                <th>������</th> \
                <th>���ʽ</th>\
                <th>����״̬</th>\
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
            alert("û���������");
        }
    }
});}

function down(fileInfoId){
    var url="/fileinfo/downloadPage.call";
    url+="?fileInfoId="+fileInfoId;
    url=framework.addUser(url);
    window.open(url);
}
//��ʾ�Ź� ȯ��Ϣ
function showCoupon(orderId,type){
      var url="";
    //����type ��ת����ͬ�Ľ���
    //"��ά��"
      if(type=="�̻�ȯ"||type=="����ȯ"||type=="ͨƱ"){
             url=webRoot+"/flowbussiness/prepareQueryTuanCouponDetail.call?id="+orderId; 
             framework.open(url,type+"����");
         }else if(type=="���"){
             url=webRoot+"/flowbussiness/prepareQueryTuanExpressDetail.call?id="+orderId;
             framework.open(url,"�������");
         } else{
             alert("��ʱ���ṩ "+type+" �������ѯ");
         }      
    
}

//��ʾ�Ź�����
function showTuanDetailInfo(id){
    var url=webRoot+"/flowbussiness/prepareQueryTuanDetail.call?id="+id;
    framework.open(url,"�Ź���������");
}
//��Ʒ
function showProduce(teamId){
    var url="http://tuan.qunar.com/team.php";
    url+="?id="+teamId;
    window.open(url);
}
function showTargetOtaPpbDetailInfo(orderNum,wrappId ){
  var url=webRoot+"/flowbussiness/queryTargetOtaPpbDetail.call?forward=otappbDetail&orderNum="+orderNum+"&wrapperId="+wrappId;
 framework.open(url,"otappb��������");
}
window.showTargetOtaPpbDetailInfo =showTargetOtaPpbDetailInfo;
window.showCoupon =showCoupon;
window.showTuanDetailInfo = showTuanDetailInfo; 
window.showProduce =showProduce;
function init_page() {
    //��ȡ������Ϣ
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
            //��ʷ��¼
            getHistoryFlowList();
            //�������¼�����
		 
			 var oBD = {
                "��Ʊ��ҵ��": {"���ڻ�Ʊ":null,"���ʻ�Ʊ":null},
                "�Ƶ���ҵ��": {"CPC":null,"OTATTS":null,"�Ƶ��Ź�":null,"һ�ڼ�":null,"ֱ��Ԥ��":null,"�ȸ���Ӷ":null},
                "���ζȼ�" : {"CPC":null,"OTATTS":null,"�Ƶ��Ź�":null,"һ�ڼ�":null,"ֱ��Ԥ��":null,"�ȸ���Ӷ":null},
                "������ҵ��" : {"���ڻ�Ʊ":null,"���ʻ�Ʊ":null, "CPC":null,"OTATTS":null,"�Ƶ��Ź�":null,"һ�ڼ�":null,"ֱ��Ԥ��":null,"�ȸ���Ӷ":null},
                "callcenter" : {"���ڻ�Ʊ":null,"���ʻ�Ʊ":null,"CPC":null,"OTATTS":null,"�Ƶ��Ź�":null,"һ�ڼ�":null,"ֱ��Ԥ��":null,"�ȸ���Ӷ":null}
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

           if($("#rDuty").attr("data-name") === "�û�" || $("#rDuty").attr("data-name")===""){
                $('[data-display]').hide();
            } else {
                $('[data-display]').show();
            }
            $("#rDuty").bind("change",function(){
                if($(this).val() === "�û�"){
                    $("[data-display='rDuty']").hide().find("select").val("");
                    $('input[name=userfield5]').val('��ЧͶ��');
                } else {
                    $("[data-display='rDuty']").show();
                    $('input[name=userfield5]').val('��ЧͶ��');
                }
            });
            $("#sCompensate").bind("change", function(){
                if($(this).val() === "��"){
                    $("[data-display='sCompensate']").show();
                    $("#sCompensate-infoDiv").show();
                } else {
                    $("[data-display='sCompensate']").hide().find("select").val("");
                    $("[data-display='sCompensateType']").hide();
                    $("#sCompensate-infoDiv").hide().find("input").val("");
                    $("[data-dpv='��Ʒ").hide().val("");
                }
            });
            $("#sPenalty").bind("change", function(){
                if($(this).val() === "��"){
                        $("[data-display='sPenalty']").show();
                } else {
                        $("[data-display='sPenalty']").hide().find("input").val("");
                }
            });
            $("#sCompensateType").bind("change", function(){
                if($(this).val() ==="ֱ���⸶" || $(this).val() ==="���⸶"){
                    $("[data-dpv='ֱ���⸶,���⸶']").show();
                        $("[data-dpv='��Ʒ").hide().val("");
                } else if ($(this).val() ==="��Ʒ"){
                    $("[data-dpv='��Ʒ").show();
                    $("[data-dpv='ֱ���⸶,���⸶']").hide().val("");
                }
            }) 
            //����״̬
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
            if($("#sCompensate").attr("data-name") === "��"){
                $("#sCompensate-infoDiv").show();
                $("[data-display='sPenalty']").show();
            } else {
                $("#sCompensate-infoDiv").hide();
                $("[data-display='sPenalty']").hide();
                $("[data-display ='sCompensate']").hide();
                $("[data-display ='sCompensateType']").hide();
            }
            if($("#sPenalty").attr("data-name") === "��"){
                $("[data-display='sPenalty']").show();
            }
            if(!$("[data-dpv='��Ʒ']").attr("data-name")){
                $("[data-dpv='��Ʒ']").hide().val("");
            }
            if(!$('[data-display="sPenalty"]').find("input").val()){
                $('[data-display="sPenalty"]').hide().val();
            } else {
                $('[data-display="sPenalty"]').show();
            }
            if( $("#sCompensateType").attr("data-name") === "��Ʒ"){
                $("[data-display ='sCompensateType']").hide().val();
                $("[data-dpv='��Ʒ']").show();
            }
            if(flow.flowConfigName === "��Ʊ"){
                //���
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
                        alert("��������Ч����");
                        $(this).val("0.00");
                        return;
                    };
                    //����������ʾ
                    $(this).val().indexOf(".") >0 ?  valueArray = $(this).val().split(".") : valueArray = [];
                    if(valueArray[1] && valueArray[1].length >2){
                        alert("��ȷ��С�����2λ");
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
            //������ʷ����־��ͨ����¼tab
            $('#recordContainer').switchable({
                activeTriggerCls : 'cur',
                events : ['click'],
                activeIndex : 0
            });

            //������ʷ
            shRender($('#shContainer'));

            //��ϸ��Ϣ
            dlRender($('#dlContainer'));

            //ͨ����¼
            rRender($('#rContainer'));

            //������ť
            if($("#js-priority").attr("data-priority") > 0){
                 $("#js-down").remove();
                 $("#js-setStyle").text("�����ţ�").removeClass("red");
            } else{
                 $("#js-down").show();
                 $("#js-setStyle").text("*���������ţ�").addClass("red");
            }
            if($("#js-manager").data("manager") === false){
                $("#js-down").remove();
            }
            //�طü�¼
            hfRender($('#hfContainer'));
            //����״̬
            specialStatusRender($('#processStatus'), flow.processStatusName, flow.isManager, flow.designate);
            //�û��Ա���ʾ
            if($("#uSex").val() === "M"){
                $("#sex").text(" ����");
            } else {
                $("#sex").text(" Ůʿ");
            }
            if(pageType == "process"){
                $("#modName").show();
            }
            //�û���������
            var name = "";
            $("#modName").live("click", function(){
                var html ="";
                var sex = $("#uSex").val();
                var uName = $("#uName").val();
                html = '<input type="text" name="realName" ';
                html +='class="input-width-long" value="'+ uName +'">';
                html +=' <select name="realName" id="selectSex"><option value="F">����</option><option value="W">Ůʿ</option></select>'
                html +=' <button id="saveName">����</button><button id="resetBtn">ȡ��</button><input type="hidden" value="'+sex+'" id="uSex"/><input type="hidden" value="'+uName+'" id="uName"/>'
                $(this).parent().html(html);
                $("#selectSex").find("option[value='"+ sex +"']").attr("selected",true);
                
            });
            $("#resetBtn").live("click", function(){
                var html = "", sex = "";
                if($("#uSex").val() === "F"){
                  sex = " ����";
                } else {
                  sex = " Ůʿ";
                }
                html = $("#uName").val() + ' <span id="sex"> '+ sex +'</span><button id="modName" style=""> �޸�</button><input type="hidden" value="'+$("#uSex").val()+'" id="uSex"/><input type="hidden" value="'+$("#uName").val()+'" id="uName"/>';
                $("#realName").html(html);
            });
            $("#saveName").live("click", function(){
                var html = "", sex="",realName = $("#realName");
                if(realName.find("select").val() === "F"){
                    sex = "����";
                } else {
                    sex ="Ůʿ";
                }
                html = realName.find("input").val() + ' ' + sex + ' <button id="modName">�޸�</button><input type="hidden" value="'+realName.find("select").val()+'" id="uSex"/><input type="hidden" value="'+realName.find("input").val()+'" id="uName"/>';
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
            //��������
            $('#atachContainer').on('click', '.js-download', function(e) {
                e.preventDefault();
                down($(this).data('id'));
            });
            //�������
            var paseFtn = function(){
                if($(this).val().length>1000){
                    alert("��������1000��");
                    $(this).val($(this).val().substring(0,999)).focus();
                }
            }
            $("#lastRemark").bind("keypress",paseFtn);
            $("#lastRemark").bind("blur",paseFtn);
             //�����ѯ��Ϣ
            $('#searchTabs span').bind("click", function(){
                $(this).siblings().removeClass("cur");
                $(this).addClass("cur");
                $(this).parent().parent().find(".handle-center").hide();
               $(this).parent().parent().find(".handle-center").eq($(this).index()).show();
            })
            //�����ۺϲ�ѯ
            $("#searchForm01 .searchBtn").bind("click", function(){
                if(!$(this).siblings("input").val()){
                    alert("�ֻ��Ų���Ϊ��");
                } else{
                    allSearch($('#allContainer'), {
                        flowId : flowId,
                        mobile : $("#telephone").val(),
                        currentId : currentId
                    });
                }
            })
            //�����Ź���ѯ
            $("#searchForm02 .searchBtn").bind("click", function(){
                var orderNo = $(this).parent().find("input[type='text']").eq(0).val();
                var orderType = $(this).parent().find("input[type='text']").eq(1).val();
                var mobile = $(this).parent().find("input[type='text']").eq(2).val();
                var user_id = $(this).parent().find("input[type='text']").eq(3).val();
                var username = $(this).parent().find("input[type='text']").eq(4).val();
                var realname = $(this).parent().find("input[type='text']").eq(5).val();
                if(!orderNo && !orderType && !mobile && !user_id && !username && !realname){
                    alert("��ѯ��������Ϊ��");
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
            //����Ƶ��ѯ
            $("#searchForm03 .searchBtn").bind("click", function(){
                var orderNo = $(this).parent().find("input[type='text']").eq(0).val();
                var contactPhone = $(this).parent().find("input[type='text']").eq(1).val();
                var contactName = $(this).parent().find("input[type='text']").eq(2).val();
                var checkInDate =  $(this).parent().find(".call-time").eq(0).val();
                var checkOutDate = $(this).parent().find(".call-time").eq(1).val();
                if(!orderNo && !contactPhone && !contactName && !checkInDate && !checkOutDate){
                    alert("��ѯ��������Ϊ��");
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

            //������ť�������
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

            //�����ϴ���ʼ��
            setTimeout(function(){
                initUpload();
            }, 0);

            //ɾ������
            $(document).delegate('.js-deletefile','click',function(e){
                e.preventDefault();
                $(this).parent().remove();
            });

           //�Ƶ겻��ʾ�⸶��Ϣģ�� ��Ʊ����ʾ��ѯģ��
            if(flow.flowConfigName == "���ξƵ�"||flow.flowConfigName == "��Ʊ"||flow.flowConfigName == "����"){
                $("#sCompensate-infoDiv").remove();
            } else {
                $("#searchContainer").remove();
            }

            if(flow.isManager == false && flow.isFangKong == false){//������̨�ڵ���߷�����
                window.isManager =false;
                disabledProcessCompensateResult();
            }
        }
    });
    //���������Ϣ
    talkingFtn();
}

/**
 * ���ô��������⸶��Ϣ����
 */
function disabledProcessCompensateResult(){
    $("#resultContainer").find("input:visible,select:visible").attr("disabled",true);
    $("#sCompensate-infoDiv").find("input:visible,select:visible,textarea:visible").attr("disabled",true);
}

//�޸������б�
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
//�޸ķ���
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
        //��ȡһ������
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
                         alert("�޸�ʧ��");
                       }
                    }
                });
            } else {
                alert("��ѡ���޸����");
            }
         });     
    }
 
});
var talkingFtn = function (){
    // ��ʾ���ػ���
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
        framework.open(url,'����淶');
    }
    window.findCustomer = function (){
        var url="/customerinfo/selectQunarIndex.call";
        framework.open(url,"�ͻ���ѯ");
    }

}
var getHistoryFlowList = function(){
   //��ʷ����
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
                            if(item.currentNode === '����') {
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
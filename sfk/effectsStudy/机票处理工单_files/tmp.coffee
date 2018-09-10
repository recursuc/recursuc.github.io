
;(function(__context){
    var module = {
        id : "cdb0db4f57d5d59f86e44fb2f9c33576" , 
        filename : "tmp.coffee" ,
        exports : {}
    };
    if( !__context.____MODULES ) { __context.____MODULES = {}; }
    var r = (function( exports , module , global ){

    (function() {
  var orderViewRender, partial_attach_display, partial_attach_process, partial_compensateInfo_display, partial_compensateInfo_process, partial_flight, partial_flight_process, partial_hotel, partial_hotel_process, partial_other, partial_process, partial_result_display, partial_result_process, partial_searchInfo, partial_telInfo, partial_train, render, tmp_all, tmp_dl, tmp_hf, tmp_historyOrder, tmp_hotel, tmp_mplayer, tmp_page, tmp_r, tmp_sh, tmp_telHistory, tmp_tuan;

  tmp_page = '<div class="order-title clearfix adjust">\n  <div class="call-main-title f_l"><strong id="js-priority" data-priority="{{priority}}"><span id="js-setStyle">工单号:</span> {{flowNo}}</strong><span id="js-manager" data-manager="{{isManager}}">处理结点：{{lastActivityName}}</span><span id="js-down"><select id="js-down-select"><option value="0">紧急</option><option value="2" selected>降级</option></select></span></div>\n</div>\n<div class="order-box" style="width: 98%;">\n  <div class="basic-box clearfix basic-box-t" id="basicContainer">\n    {{> partial_telInfo}}\n    {{> partial_typeInfo}}\n  </div>\n  <div class="basic-handle" id="tHistoryContainer">\n    <p><strong>来电历史</strong></p>\n  </div>\n  <div id="audioContainer" class="basic-main-box"></div>\n\n  <div id="resultContainer" class="basic-handle call-handle">\n    <p><strong>处理结果</strong><i>*</i></p>\n    {{> partial_result}}\n  </div>\n  <div id="sCompensate-infoDiv" class="basic-handle call-handle" style="{{^compensateInfoFlag}}display: none;{{/compensateInfoFlag}}">\n      <strong>赔付信息<i>* {{PAGETYPE}}</i></strong>\n      <br>\n      {{> partial_compensateInfo}}\n  </div>\n  <div id="atachContainer" class="basic-handle call-handle">\n    <strong>附件</strong>\n    {{> partial_attach}}\n  </div>\n  <div id="recordContainer" class="handle-center">\n    <div class="handle-top able-switchable-nav"><span class="cur">处理历史</span><span>详细日志</span><span>通话记录</span><span>回访记录</span></div>\n    <div class="handle-max able-switchable-content">\n      <table id="shContainer"></table>\n      <table id="dlContainer" style="display:none;"></table>\n      <table id="rContainer" style="display:none;"></table>\n      <table id="hfContainer" style="display:none;"></table>\n    </div>\n  </div>\n  {{> partial_process}}\n  {{> partial_reciprocal}}\n  <div id="opContainer" class="call-but clearfix"></div>\n</div>\n<div class="call-mina-box" id="modifyCallType" style="display:none;" data-info="{{flowConfigId}}">\n  <div class="call-table-main">\n            <p><strong>修改问题类型</strong><i>*</i> <button id="saveData" class="saveBtn">保存</button></p>     \n            <div class="call-filter clearfix js-oqc">\n            </div>\n   </div>\n</div>\n<div class="hask"></div>';

  /*查询
  */


  partial_searchInfo = '<div id="searchContainer" class="basic-handle call-handle">\n      <p><strong>订单信息</strong></p>\n      <div  id="searchTabs" class="call-order"><span class="cur">综合查询</span><span>团购</span><span>酒店</span></div>\n      \n        <!--01-->\n       <div id="allContainer" class="handle-center"> \n        <div id="searchForm01" class="call-mina-box">\n            <div class="minute-box">\n             <form method="post" action="">\n               手机号<input type="text" name="" value="" id="telephone"><a href="javascript:;" class="searchBtn">查询</a><a href="javascript:;" class="resetBtn">重置</a></span>\n             </form>        \n           </div>\n        </div>\n         <div id="" class="handle-max">\n           <table>\n             <tr>\n               <th>序号</th>\n               <th>类别</th>\n               <th>订单号</th>\n               <th>商户（用户）</th>\n               <th>代理商</th>\n               <th>产品</th>\n               <th>支付总额</th>\n               <th>支付方式</th>\n             </tr>\n             </table>\n          </div>\n        </div>\n        <!--E 01-->\n       <div id="tuanContainer" class="handle-center"  style="display:none;">\n         <div id="searchForm02" class="call-mina-box">\n            <div class="minute-box">\n             <form method="post" action="">\n               <span>订单号<input type="text" name="" value=""></span><span>券号<input type="text" name="" value=""></span><span>手机号<input type="text" name="" value=""></span><span>用户ID<input type="text" name="" value=""></span><span>购买者姓名<input type="text" name="" value=""></span><span>真实姓名<input type="text" name="" value=""></span><a href="javascript:;" class="searchBtn">查询</a><a href="javascript:;" class="resetBtn">重置</a>\n             </form>        \n           </div>\n        </div>\n          <div id="" class="handle-max">\n           <table>\n             <tr>\n               <th>序号</th>\n               <th>订单号</th>\n               <th>券类别</th>\n               <th>用户名</th>\n               <th>产品</th>\n               <th>数量</th>\n               <th>总额</th>\n               <th>余额支付</th>\n               <th>支付</th>\n               <th>支付方式</th>\n               <th>支付状态</th>\n               <th>类型</th>\n             </tr>\n             </table>\n             </div>\n       </div>\n       <!--E 02-->\n       <div id="hotelContainer" class="handle-center"  style="display:none;">\n         <div id="searchForm03" class="call-mina-box">\n            <div class="minute-box">\n             <form method="post" action="">\n               <span class="">订单号<input type="text" name="" value=""></span><span class="">联系人电话<input type="text" name="" value=""></span><!--<span class="">联系人姓名<input type="text" name="" value=""></span><span class="">入住时间<input value="" name="createTimeBegin" class="call-time" onfocus="WdatePicker({dateFmt:\'yyyy-MM-dd\'})">-\n               <input value="" name="createTimeBegin"  class="call-time" onfocus="WdatePicker({dateFmt:\'yyyy-MM-dd\'})"></span>-->\n               <a href="javascript:;" class="searchBtn">查询</a><a href="javascript:;" class="resetBtn">重置</a>\n             </form>        \n           </div>\n        </div>\n        <div id="" class="handle-max">\n           <table>\n             <tr>\n               <th>序号</th>\n               <th>订单类型</th>\n               <th>订单来源</th>\n               <th>订单号</th>\n               <th>代理商一口价名称</th>\n               <th>酒店名称</th>\n               <th>房型</th>\n               <th>联系人</th>\n               <th>联系人电话</th>\n               <th>入住人姓名</th>\n               <th>入住时间</th>\n               <th>离店时间</th>\n               <th>预定时间</th>\n               <th>价格</th>\n               <th>房间数</th>                \n               <th>付款方式</th>\n               <th>订单状态</th>\n             </tr>\n             </table>\n             </div>\n       </div>\n      </div>   \n   <!--E 03-->\n   ';

  /* 附件列表
  */


  partial_attach_display = '<br>\n{{#flowAttachList}}\n<a href="javascript:;" class="js-download" data-id="{{fileInfoId}}">{{fileName}}</a>\n<br>\n{{/flowAttachList}}';

  /* 附件列表
  */


  partial_attach_process = '<div id="uploadcontainer" class="e_upload_keyup" style="display: inline-block;">\n  <b class="btn_green" id="uploadimg" style="visibility: visible;"><div id="upload" class="pointer"><img src="/app/workflow/config/img/upload.png">  添加</div></b>\n</div>\n<div id="uploadfilebox"></div>\n<br>\n{{#flowAttachList}}\n<a href="javascript:;" class="js-download" data-id="{{fileInfoId}}">{{fileName}}</a>\n<br>\n{{/flowAttachList}}';

  /* 赔付信息
  */


  partial_compensateInfo_process = '<div id="dealInfoRs" class="call-handle-table clearfix">\n    <ul class="f_l">\n        <li><span class="basic-title">赔付日期</span><span class=""><input value="{{userfield29}}" name="userfield29" readonly validate="" class="WdateTime" onfocus="WdatePicker({startDate:\'%y-%M-01 00:00:00\',dateFmt:\'yyyy-MM-dd HH:mm:ss\',alwaysUseStartDate:true})"></span></li>\n         <li><span class="basic-title">提交赔付日期</span><span class=""><input value="{{comitPayTime}}" name="comitPayTime" readonly validate="" class="WdateTime" onfocus="WdatePicker({startDate:\'%y-%M-01 00:00:00\',dateFmt:\'yyyy-MM-dd HH:mm:ss\',alwaysUseStartDate:true})"></span></li>\n        <li><span class="basic-title basic-text-more">赔付原因</span><span class=""><textarea name="userfield33" rows="" cols="" style="margin: 0px; width: 250px; height:50px;" value="{{userfield33}}">{{userfield33}}</textarea></span></li>\n        <li><span class="basic-title basic-text-more">事由</span><span class=""><textarea name="userfield34" rows="" cols="" value="{{userfield34}}">{{userfield34}}</textarea></span></li>\n    </ul>\n    <ul class="f_l">\n        <li><span class="basic-title">收款人</span><span class=""><input type="text" name="userfield35"  maxlength="20" value="{{userfield35}}"></span></li>\n        <li><span class="basic-title">收款人性质</span><span class=""><input type="text" name="userfield36"  maxlength="20" value="{{userfield36}}" ></span></li>\n        <li><span class="basic-title">开户支行</span><span class=""><input type="text" name="userfield37"  maxlength="20" value="{{userfield37}}" ></span></li>\n        <li><span class="basic-title">收款账号</span><span class=""><input type="text" name="userfield38"  maxlength="20" value="{{userfield38}}" ></span></li>\n        <li><span class="basic-title">联系方式</span><span class=""><input type="text" name="userfield39"  maxlength="20" value="{{userfield39}}" ></span></li>\n         <li><span class="basic-title">供应代理商</span><span class=""><input type="text" name="suppOta"  maxlength="20" value="{{suppOta}}" ></span></li>\n    </ul>\n    <ul class="f_l">\n        <li>\n            <span class="basic-title">业务部门</span>\n            <span class="">\n                <select name="userfield30" data-name="{{userfield30}}">\n                    <option value="" selected></option>\n                    <option value="机票事业部">机票事业部</option>\n                    <option value="无线事业部">无线事业部</option>\n                    <option value="callcenter">callcenter</option>\n                </select>\n            </span>\n        </li>\n        <li>\n            <span class="basic-title">业务类型</span>\n                <span class="">\n                <select name="userfield31" data-name="{{userfield31}}">\n                    <option value=""></option>\n                    <option value="国内机票">国内机票</option>\n                    <option value="国际机票">国际机票</option>\n                </select>\n            </span>\n        </li>\n        <li><span class="basic-title">提交人</span><span class=""><input type="text" readonly name="userfield32" value="{{lockName}}"></span></li> \n         <li>\n            <span class="basic-title">是否二次打款</span>\n                <span class="">\n                <select name="isSencondePay" data-name="{{isSencondePay}}">\n                    <option value="" selected></option>\n                     <option value="是" >是</option>\n                     <option value="否">否</option>\n                </select>\n            </span>\n        </li>\n    </ul>\n</div>';

  /* 赔付信息
  */


  partial_compensateInfo_display = ' <div id="" class="call-handle-table clearfix">\n     <ul class="f_l">\n         <li><span class="basic-title">赔付日期</span><span class="">{{userfield29}}</span></li>\n          <li><span class="basic-title">提交赔付日期</span><span class="">{{comitPayTime}}</span></li>\n         <li><span class="basic-title basic-text-more">赔付原因</span><span class="">{{userfield33}}</span></li>\n         <li><span class="basic-title basic-text-more">事由</span><span class="">{{userfield34}}</span></li>\n     </ul>\n     <ul class="f_l">\n         <li><span class="basic-title">收款人</span><span class="">{{userfield35}}</span></li>\n         <li><span class="basic-title">收款人性质</span><span class="">{{userfield36}}</span></li>\n         <li><span class="basic-title">开户支行</span><span class="">{{userfield37}}</span></li>\n         <li><span class="basic-title">收款账号</span><span class="">{{userfield38}}</span></li>\n         <li><span class="basic-title">联系方式</span><span class="">{{userfield39}}</span></li>\n         <li><span class="basic-title">供应代理商</span><span class="">{{suppOta}}</span></li>\n     </ul>\n     <ul class="f_l">\n         <li>\n            <span class="basic-title">业务部门</span><span class="">{{userfield30}}</span>\n         </li>\n         <li>\n            <span class="basic-title">业务类型</span><span class="">{{userfield31}}</span>\n         </li>\n         <li><span class="basic-title">提交人</span><span class="">{{userfield32}}</span></li>\n         <li><span class="basic-title">是否二次打款</span><span class="">{{isSencondePay}}</span></li>\n     </ul>\n</div>';

  /* 电话信息
  */


  partial_telInfo = '<ul class="basic-handle basic-box-ulittle f_l">\n  <p><strong>电话信息</strong></p>\n  <li>\n     <span class="basic-title">来电时间：</span><span>{{pageTime}}</span>\n  </li>\n  <li class="basic-ul-zoom">\n     <span class="basic-title">来电号码：</span><span><a id="js-appoint-phoneNum" href="#" title="">{{channelText}}</a>{{province}}&nbsp;{{city}}</span><span class="basic-ls">历史工单：\n     <span class="float"><i id="flowHistorySizeSpan" class="blue"></i>\n        <div class="call-pop-ca historydetail">\n            <table>\n                <tbody id="historyOrderContainer">\n                  <tr>\n                      <th>创建时间</th>\n                      <th class="call-pop-l">工单号</th>\n                                        <th>工单类型</th>\n                                        <th class="call-pop-l">问题类型</th>\n                                        <th>当前节点</th>\n                                    </tr>\n                </tbody>\n            </table>\n        </div>\n  </span>个</span>\n  </li>\n  <li id="js-appointComplete-li" style="display:none">\n    <span class="basic-title">回访结果：</span>\n    <input type="hidden" id="callflag" value="false"/>\n    <span id="phoneOutSpan">\n        <select id="appointResult" name="appointResult" style="width: 80px;height:20.2px">\n            <option value="">请选择</option><option value="success">回访完成</option><option value="again">再次预约</option><option value="failure">联系失败</option>\n        </select>\n        <span id="appintTimeUpdateSpan" style="display: none"><input id="newAppointTime" name="newAppointTime" class="WdateTime"  onfocus="WdatePicker({dateFmt:\'yyyy-MM-dd HH:mm\',minDate:\'%y-%M-%d %H:#{%m+5}\'})"></span>\n    </span>\n  </li>\n  <li id="js-appointComplete-hide-li">\n    <span class="basic-title">预约回访：</span><span class="red">{{appointTime}}</span>\n  </li>\n  <li>\n    <span class="basic-title">用户类型：</span><span>{{customerType}}</span>\n  </li>\n  <li>\n    <span class="basic-title">咨询产品：</span><span>{{productType}}</span>\n  </li>\n  <li>\n    <span class="basic-title">查询号码：</span><span>{{inputPhone}}</span>\n  </li>\n  <li>\n    <span class="basic-title">来电轨迹：</span><span>{{ivrTrace}}</span>\n  </li>\n  <li>\n    <span class="basic-title">姓名：</span><span data-id="{{customerInfoId}}" data-phone="{{phone}}" id="realName"><i id="nameInfo">{{realName}}</i> <span id="sex"></span><button id="modName" style="display:none"> 修改</button><input type="hidden" value="{{gender}}" id="uSex"/><input type="hidden" value="{{realName}}" id="uName"/></span>\n  </li>\n</ul>';

  /* 机票信息
  */


  partial_flight = '<ul class="basic-handle f_r">\n  <p><strong>机票信息</strong></p>\n  <li>\n     <span class="basic-title l_float">问题类别：</span><span class="len">{{problemNames}}</span>\n  </li>\n  {{#order}}\n    <li>\n       <span class="basic-title l_float">代理商：</span><span class="len js-agent float_table" data-site="{{代理商网址}}"><i class="blue">{{代理商}}</i></span>\n    </li>\n    <li>\n      <span class="basic-title">订单号：</span><span><a href="javascript:;" onclick=\'showOrderDetail("{{订单号}}","{{订单类型}}","{{业务id}}")\'>{{订单号}}</a> <a href="http://kegui.jptonghang.com/dm/Prescribe/guiding.html?Airways=#&currentId=37366231656539353761646534666431623561343332393934623165343135652C313338303136383030303030302C3139322E3136382E3132322E3531,37366231656539353761646534666431623561343332393934623165343135652C313338303136383030303030302C3139322E3136382E3132322E3531&currentId=37366231656539353761646534666431623561343332393934623165343135652C313338303136383030303030302C3139322E3136382E3132322E3531&tid=aHR0cDovL2tlZ3VpLmpwdG9uZ2hhbmcuY29tL2RtL1ByZXNjcmliZS9\n"  target="_blank">服务规范</a></span>\n    </li>\n    <li>\n      <span class="basic-title">订单类型：</span><span>{{订单类型}}</span>\n    </li>\n    <li>\n      <span class="basic-title">cs处理过：</span><span>{{cs处理过}}</span>\n    </li>\n    <li>\n      <span class="basic-title">联系人手机：</span><span>{{联系人手机}}</span>\n    </li>\n    <li>\n      <span class="basic-title">pe详细信息：</span>{{{pe详细信息}}}\n    </li>\n  {{/order}}\n</ul>';

  /* 机票信息修改
  */


  partial_flight_process = '<ul class="basic-handle f_r">\n  <p><strong>机票信息</strong></p>\n  <li>\n     <span class="basic-title l_float">问题类别：</span><span class="len"><i id="problemNames">{{problemNames}}</i><a href="javascript:;" id="modifyType">修改</a> </span>\n  </li>\n  {{#order}}\n    <li>\n       <span class="basic-title l_float">代理商：</span><span class="len js-agent" data-site="{{代理商网址}}">{{代理商}}</span>\n    </li>\n    <li>\n      <span class="basic-title" id="flowId" data-info="{{flowid}}">订单号：</span><span><a href="javascript:;" onclick=\'showOrderDetail("{{订单号}}","{{订单类型}}","{{业务id}}")\'>{{订单号}}</a> <a href="" title="">服务规范</a></span>\n    </li>\n    <li>\n      <span class="basic-title">订单类型：</span><span>{{订单类型}}</span>\n    </li>\n    <li>\n      <span class="basic-title">cs处理过：</span><span>{{cs处理过}}</span>\n    </li>\n    <li>\n      <span class="basic-title">联系人手机：</span><span>{{联系人手机}}</span>\n    </li>\n    <li>\n      <span class="basic-title">pe详细信息：</span>{{{pe详细信息}}}\n    </li>\n  {{/order}}\n</ul>';

  /* 酒店信息
  */


  partial_hotel = '<div id="" class="basic-handle basic-box-ulong f_r">\n  <p><strong>酒店信息</strong></p>\n  <ul class="w60">\n    <li>\n       <span class="basic-title l_float">问题类别：</span><span class="len">{{problemNames}}</span>\n    </li>\n    {{#order}}\n      <li>\n         <span class="basic-title">订单号：</span><span class="len"><a href="javascript:;" onclick=\'showTuanOrderDetail("{{订单类型}}","{{订单号}}","{{商家id}}")\'>{{订单号}}</a></span>\n      </li>\n      <li>\n        <span class="basic-title">产品名称：</span><span class="len">{{产品名称}}</span>\n      </li>\n      <li>\n        <span class="basic-title">团品ID：</span><span class="len float_table" id="tuan" data-wrapperId="{{商家id}}" data-orderNo="{{订单号}}"><i class="blue">{{团品Id}}</i></span>\n      </li>\n      <li>\n        <span class="basic-title l_float">商家名称：</span><span class="len">{{商家名称}}</span>\n      </li>\n      <li>\n        <span class="basic-title">交易单号：</span><span class="len">{{交易单号}}</span>\n      </li>\n      <li>\n        <span class="basic-title">单价：</span><span>{{单价}}</span>\n      </li>\n      <li>\n        <span class="basic-title">购买数量：</span><span>{{购买数量}}</span>\n      </li>\n    </ul>\n    <ul class="w40">\n      <li>\n        <span class="basic-title">支付总额：</span><span >{{支付总额}}</span>\n      </li>\n      <li>\n        <span class="basic-title">支付方式：</span><span>{{支付方式}}</span>\n      </li>\n      <li>\n        <span class="basic-title">退款金额：</span><span>{{退款金额}}</span>\n      </li>\n      <li>\n        <span class="basic-title">退款份数：</span><span>{{退款份数}}</span>\n      </li>\n      <li>\n        <span class="basic-title">二次退款：</span><span class="basic-select-st">{{二次退款}}</span>\n      </li>\n      <li>\n        <span class="basic-title">订单来源:</span><span>{{订单来源}}</span>\n     </li>\n    {{/order}}\n  </ul>\n</div>';

  /* 酒店信息（可处理）
  */


  partial_hotel_process = '<div id="" class="basic-handle basic-box-ulong f_r">\n  <p><strong>酒店信息</strong></p>\n  <ul class="w60">\n    <li>\n       <span class="basic-title l_float">问题类别：</span><span class="len"><i id="problemNames">{{problemNames}}</i><a href="javascript:;" id="modifyType">修改</a> </span>\n    </li>\n    {{#order}}\n      <li>\n         <span class="basic-title" id="flowId" data-info="{{flowNo}}">订单号：</span><span class="len"><a href="javascript:;" onclick=\'showTuanOrderDetail("{{订单类型}}","{{订单号}}","{{商家id}}")\'>{{订单号}}</a></span>\n      </li>\n      <li>\n        <span class="basic-title">产品名称：</span><span class="len">{{产品名称}}</span>\n      </li>\n      <li>\n        <span class="basic-title">团品ID：</span><span class="len"><input type="text" name="tuanId" class="input-width-long" value="{{团品Id}}"></span>\n      </li>\n      <li>\n        <span class="basic-title l_float">商家名称：</span><span class="len">{{商家名称}}</span>\n      </li>\n      <li>\n        <span class="basic-title">交易单号：</span><span class="len"><input type="text" name="tradeId" class="input-width-long" value="{{交易单号}}"></span>\n      </li>\n      <li>\n        <span class="basic-title">单价：</span><span class="len">{{单价}}</span>\n      </li>\n      <li>\n        <span class="basic-title">购买数量：</span><span class="len">{{购买数量}}</span>\n      </li>\n    </ul>\n    <ul class="w40">\n      <li>\n        <span class="basic-title">支付总额：</span><span>{{支付总额}}</span>\n      </li>\n      <li>\n        <span class="basic-title">支付方式：</span><span>{{支付方式}}</span>\n      </li>\n      <li>\n        <span class="basic-title">退款金额：</span><input type="text" name="drawBack" value="{{退款金额}}">\n      </li>\n      <li>\n        <span class="basic-title">退款份数：</span><input type="text" name="drawNumber" value="{{退款份数}}">\n      </li>\n      <li>\n        <span class="basic-title">二次退款：</span><span class="basic-select-st">{{二次退款}}</span>\n      </li>\n    {{/order}}\n  </ul>\n</div>';

  /*partial_hotel = '''
    <div id="" class="basic-handle basic-box-ulong f_r">
      <p><strong>酒店信息</strong></p>
      <ul class="">
        <li>
           <span class="basic-title l_float">问题类别：</span><span class="len">{{problemNames}} <a href="" target="_blank" title="">修改</a> </span>
        </li>
        {{#order}}
          <li>
             <span class="basic-title">订单号：</span><span><input type="text" name="" class="input-width-long" value="{{订单号}}"></span>
          </li>
          <li>
            <span class="basic-title">产品名称：</span><input type="text" name="" class="input-width-long" value="{{产品名称}}">
          </li>
          <li>
            <span class="basic-title">团品ID：</span><span><input type="text" name="" class="input-width-long" value="{{团品Id}}"></span>
          </li>
          <li>
            <span class="basic-title l_float">商家名称：</span><span class="len"><input type="text" name="" class="input-width-long" value="{{商家名称}}"></span>
          </li>
          <li>
            <span class="basic-title">交易单号：</span><span><input type="text" name="" class="input-width-long" value="{{交易单号}}"></span>
          </li>
          <li>
            <span class="basic-title">单价：</span><input type="text" name="" value="{{单价}}">
          </li>
          <li>
            <span class="basic-title">购买数量：</span><input type="text" name="" value="{{购买数量}}">
          </li>
        </ul>
        <ul class="">
          <li>
            <span class="basic-title">支付总额：</span><input type="text" name="" value="{{支付总额}}">
          </li>
          <li>
            <span class="basic-title">支付方式：</span><input type="text" name="" value="{{支付方式}}">
          </li>
          <li>
            <span class="basic-title">退款金额：</span><input type="text" name="" value="{{退款金额}}">
          </li>
          <li>
            <span class="basic-title">退款份数：</span><input type="text" name="" value="退款份数">
          </li>
          <li>
            <span class="basic-title">二次退款：</span><span class="basic-select-st"><select name="" value="{{二次退款}}">
              <option value="">是
              </option><option value="">否
            </option></select></span>
          </li>
        {{/order}}
      </ul>
    </div>
  '''
  */


  /* 处理结果
  */


  partial_result_display = '<div class="call-handle-table clearfix">\n    <ul class="f_l">\n    <li>\n       <span class="basic-title">处理结果</span><span>{{userfield11}}</span>\n    </li>\n    <li>\n       <span class="basic-title">特殊状态</span><span>{{processStatusName}}</span>\n    </li>\n    <li>\n       <span class="basic-title">投诉判定</span><span>{{userfield5}}</span>\n    </li>\n    <li>\n       <span class="basic-title">责任归属</span><span>{{userfield12}}</span>\n    </li>\n    </ul>\n  <ul class="f_l">\n    <li>\n       <span class="basic-title">需赔付</span><span>{{userfield13}}</span>\n    </li>\n    {{#userfield14}}\n    <li>\n       <span class="basic-title">赔付类型</span><span>{{userfield14}}</span>\n    </li>\n     {{/userfield14}}\n    {{#isNotGift}}\n    {{#userfield15}}\n    <li class="spcialNode" id="spcialNode" style="width:290px">\n       <div class="pay_money"><span class="basic-title">差价金额</span><span>{{extend_userfield0}}</span></div>\n       <div class="pay_money"><span class="basic-title">赔计划金额</span><span>{{extend_userfield1}}</span></div>\n        <div class="pay_money"><span class="basic-title">其它金额</span><span>{{extend_userfield2}}</span></div>\n        <div class="pay_money"><span class="basic-title">总金额</span><span>{{userfield15}}</span></div>\n    </li>\n    <li style="width:290px" id="hotelPay">\n        <span class="basic-title">赔付金额</span><span>{{userfield15}}</span>\n    </li>\n    {{/userfield15}}\n    {{/isNotGift}}\n    {{#isGift}}\n    <li>\n       <span class="basic-title">礼物</span><span>{{userfield27}}</span>\n    </li>\n    {{/isGift}}\n    </ul>\n  <ul class="f_l">\n    <li>\n       <span class="basic-title">需判罚</span><span>{{userfield22}}</span>\n    </li>\n    {{#userfield23}}\n    <li>\n       <span class="basic-title">判罚付金额</span><span>{{userfield23}}</span>\n    </li>\n    {{/userfield23}}\n    </ul>\n</div>';

  /* 处理结果-处理中
  */


  partial_result_process = '<div id="dealInfo" class="call-handle-table clearfix">\n    <ul class="f_l">\n    <li>\n      <span class="basic-title">处理结果</span><span><input type="text" name="userfield11" value="{{userfield11}}"></span>\n    </li>\n    <li>\n       <span class="basic-title">投诉判定</span><span><input type="text" name="userfield5" readonly value="{{userfield5}}"></span>\n    </li>\n    <li>\n       <span class="basic-title">责任归属</span><span>\n       <select name="userfield12" id="rDuty" class="js-fTrigger" data-name="{{userfield12}}">\n        <option value=""></option>\n        <option value="代理商">代理商</option>\n        <option value="qunar">qunar</option>\n        <option value="用户">用户</option>\n      </select></span>\n    </li>\n    <li>\n       <span class="basic-title">特殊状态</span><span>\n       <select name="" id="processStatus" data-name="{{processStatus}}">\n          <option value=""></option>\n       </select></span>\n    </li>\n    </ul>\n   <ul class="f_l" data-display="rDuty" data-dpv="代理商,qunar">\n    <li data-display="rDuty" data-dpv="代理商,qunar">\n        <span class="basic-title">需赔付</span><span>\n        <select name="userfield13" id="sCompensate" class="js-fTrigger" data-name="{{userfield13}}">\n        <option value="" selected></option>\n        <option value="是" >是</option>\n        <option value="否">否</option>\n        </select></span>\n    </li>\n    <li data-display="sCompensate" data-dpv="是">\n        <span class="basic-title">赔付类型</span><span>\n        <select name="userfield14" id="sCompensateType" class="js-fTrigger" data-name="{{userfield14}}">\n        <option value=""></option>\n        <option value="直接赔付">直接赔付</option>\n        <option value="代赔付">代赔付</option>\n        <option value="礼品">礼品</option>\n      </select>\n      </span>\n    </li>\n    <li data-display="sCompensateType" data-dpv="直接赔付,代赔付" id="spcialNode">\n       <div class="pay_money"><span class="basic-title">差价金额</span><span><input type="text" name="priceDifference" value="{{extend_userfield0}}"></span></div>\n       <div class="pay_money"><span class="basic-title" style="width:69px;">赔计划金额</span><span><input type="text" name="priceCompensation" value="{{extend_userfield1}}"></span></div>\n      <div class="pay_money"><span class="basic-title">其它金额</span><span><input type="text" name="priceRest" value="{{extend_userfield2}}"></span></div>\n      <div class="pay_money"><span class="basic-title" style="width:69px; color:red;">总金额</span><span><input type="text" name="userfield15" value="{{userfield15}}" id="totalCost" readonly style="border:0px"></span></div>\n    </li>\n    <li data-display="sCompensateType" data-dpv="直接赔付,代赔付" id="hotelPay">\n      <span class="basic-title">赔付金额</span><span><input type="text" name="userfield15" value="{{userfield15}}"></span>\n    </li>\n    <li data-display="sCompensateType" data-dpv="礼品" >\n        <span class="basic-title">礼品</span><span>\n        <select name="userfield27" data-name="{{userfield27}}">\n        <option value="0"></option>\n        <option value="大骆驼">大骆驼</option>\n        <option value="小骆驼">小骆驼</option>\n        <option value="U盘">U盘</option>\n        <option value="背包">背包</option>\n        <option value="水杯">水杯</option>\n        <option value="其他">其他</option>\n      </select>\n      </span>\n    </li>\n    </ul>\n  <ul class="f_l" data-display="rDuty" data-dpv="代理商,qunar">\n    <li data-display="rDuty" data-dpv="代理商,qunar">\n        <span class="basic-title">需判罚</span><span>\n        <select name="userfield22" id="sPenalty" class="js-fTrigger" data-name="{{userfield22}}">\n        <option value=""></option>\n        <option value="是">是</option>\n        <option value="否">否</option>\n      </select>\n      </span>\n    </li>\n    <li data-display="sPenalty" data-dpv="是">\n       <span class="basic-title">判罚金额</span><span><input type="text" name="userfield23" value="{{userfield23}}"></span>\n    </li>\n    </ul>\n</div>';

  /* 处理意见
  */


  partial_process = '<div class="basic-handle-nb call-handle">\n    <p><strong>处理意见</strong><i>*</i></p>\n  <div><textarea class="text-handle" id="lastRemark"></textarea></div>\n</div>';

  partial_train = "";

  partial_other = "";

  tmp_mplayer = '<object id="MediaPlayer" width="100%" height="64px" classid="CLSID:6BF52A52-394A-11d3-B153-00C04F79FAA6" type="application/x-mplayer2">\n  <param name="DisplayBackColor" value="red">\n  <param name="URL" value="{{playUrl}}">\n  <param name="autoStart" value="false">\n  <param name="invokeURLs" value="false">\n  <param name="playCount" value="1">\n  <param name="defaultFrame" value="datawindow">\n </object>';

  tmp_telHistory = '<div class="call-history-yes">\n  <table>\n      <tbody><tr>\n        <th class="sall-hy-tab1">问题类型</th>\n        <th class="sall-hy-tab2">更新时间</th>\n        <th class="sall-hy-tab3">来电号码</th>\n        <th class="sall-hy-tab4">来电轨迹</th>\n        <th class="sall-hy-tab5">创建人</th>\n        <th class="sall-hy-tab6">详细信息</th>\n        <th class="sall-hy-tab7">录音</th>\n      </tr>\n      {{#list}}\n        {{#multi}}\n          <tr {{#expire}} class="call-expire" {{/expire}}>\n             <td rowspan="{{rows}}" valign="top"><span>{{No}}&nbsp;{{problemText}}</span></td>\n             <td>{{createTime}}</td>\n             <td>{{channelText}}</td>\n             <td>{{ivrTrace}}</td>\n             <td>{{createId}}</td>\n             <td>{{businessInfo}}</td>\n             <td class="basic-but-han"><button data-playurl="{{playUrl}}" class="js-playAudio"><img src="http://source.qunar.com/callcenter/order/begin-but.png"></button></td>\n          </tr>\n          {{#list}}\n          <tr>\n             <td>{{createTime}}</td>\n             <td>{{channelText}}</td>\n             <td>{{ivrTrace}}</td>\n             <td>{{createId}}</td>\n             <td>{{businessInfo}}</td>\n             <td class="basic-but-han"><button data-playurl="{{playUrl}}" class="js-playAudio"><img src="http://source.qunar.com/callcenter/order/begin-but.png"></button></td>\n          </tr>\n          {{/list}}\n        {{/multi}}\n        {{^multi}}\n          <tr {{#expire}} class="call-expire" {{/expire}}>\n             <td><span>{{No}}&nbsp;{{problemText}}</span></td>\n             <td>{{createTime}}</td>\n             <td>{{channelText}}</td>\n             <td>{{ivrTrace}}</td>\n             <td>{{createId}}</td>\n             <td>{{businessInfo}}</td>\n             <td class="basic-but-han"><button data-playurl="{{playUrl}}" class="js-playAudio"><img src="http://source.qunar.com/callcenter/order/begin-but.png"></button></td>\n          </tr>\n        {{/multi}}\n      {{/list}}\n    </tbody>\n  </table>\n</div>';

  tmp_sh = '<tbody><tr>\n  <th>节点</th>\n  <th>操作人</th>\n  <th>操作时间</th>\n  <th>系统日志</th>\n  <th>备注</th>\n</tr>\n{{#list}}\n  <tr>\n    <td>{{nodeName}}</td>\n    <td>{{userName}}</td>\n    <td>{{createTime}}</td>\n    <td>{{systemRemark}}</td>\n    <td>{{remark}}</td>\n  </tr>\n{{/list}}\n</tbody>';

  tmp_dl = '<tbody><tr>\n  <th>节点</th>\n  <th>操作人</th>\n  <th>操作时间</th>\n  <th>系统日志</th>\n  <th>备注</th>\n</tr>\n{{#list}}\n  <tr>\n    <td>{{flowActivityName}}</td>\n    <td>{{userName}}</td>\n    <td>{{createTime}}</td>\n    <td>{{logTypeText}}</td>\n    <td>{{remark}}</td>\n  </tr>\n{{/list}}\n</tbody>';

  tmp_r = '<tbody><tr>\n  <th>处理人</th>\n  <th>主叫号码</th>\n  <th>被叫号码</th>\n  <th>呼叫方向</th>\n  <th>呼叫标识</th>\n  <th>开始时间</th>\n  <th>通话时长</th>\n  <th>播放/下载</th>\n</tr>\n{{#list}}\n  <tr>\n    <td>{{userName}}</td>\n    <td>{{ani}}</td>\n    <td>{{dnis}}</td>\n    <td>{{callType}}</td>\n    <td>{{callType}}</td>\n    <td>{{beginTime}}</td>\n    <td>{{recordLength}}</td>\n    <td>\n      <a href="javascript:;" data-playurl="{{playUrl}}" class="js-playAudio blue">播放</a>&nbsp;|&nbsp;<a href="{{playUrl}}" class="blue">下载</a>\n    </td>\n  </tr>\n{{/list}}\n</tbody>';

  tmp_hf = '<tbody><tr>\n  <th>创建人</th>\n  <th>最后操作人</th>\n  <th>创建时间</th>\n  <th>备注</th>\n  <th>回访结果</th>\n  <th>预约时间</th>\n  <th>回复时间</th>\n  <th>是否异常</th>\n  <th>是否超时</th>\n  \n</tr>\n{{#list}}\n  <tr>\n    <td>{{createName}}</td>  \n    <td>{{updateName}}</td>\n    <td>{{createTime}}</td>\n    <td>{{remark}}</td>\n    <td>{{appointResult}}</td>\n    <td>{{appointTime}}</td>\n    <td>{{appointBackTime}}</td>\n    <td>{{abnormal}}</td>\n    <td>{{timeout}}</td>\n   \n  </tr>\n{{/list}}\n</tbody>';

  tmp_historyOrder = '{{#list}}\n  <tr>\n    <td>{{createTime}}</td>\n    <td class="call-pop-l"><a href="javascript:;" onclick="showFlow(\'{{flowId}}\',\'{{flowType}}\',\'{{flowNo}}\')" title="{{flowNo}}">{{flowNo}}</a></td>\n    <td>{{flowType}}</td>\n    <td class="call-pop-l">{{problem0}}--&gt;{{problem1}}--&gt;{{problem2}}&nbsp;{{problem3}}</td>\n    <td>{{#hl}}<font>{{currentNode}}</font>{{/hl}}{{^hl}}{{currentNode}}{{/hl}}</td>\n  </tr>\n{{/list}}';

  tmp_all = '{{#list}}\n  <tr>\n    <td><label><input type="radio" name="" class="font-color" value="{{id}}"></label></td>\n    <td><a href="" target="_blank" title="" class="font-color">{{delivery}}</a></td><!--判断-->\n    <td><a href="" target="_blank" title="" class="font-color">{{id}}</a></td>\n    <td>{{username}}</td>\n    <td>{{otaName}}</td>\n    <td><a href="" target="_blank" title="" class="font-color">{{stitle}}</a></td>\n    <td>{{origin}}</td>\n    <td>{{service}}</td><!--判断-->\n  </tr>\n{{/list}}';

  tmp_tuan = '{{#list}}\n  <tr>\n    <td><label><input type="radio" name="" class="font-color" value="{{id}}"></label></td>\n    <td><a href="" target="_blank" title="" class="font-color">{{delivery}}</a></td><!--判断-->\n    <td><a href="" target="_blank" title="" class="font-color">{{id}}</a></td>\n    <td>{{username}}</td>\n    <td>{{otaName}}</td>\n    <td><a href="" target="_blank" title="" class="font-color">{{stitle}}</a></td>\n    <td>{{origin}}</td>\n    <td>{{service}}</td><!--判断-->\n  </tr>\n{{/list}}';

  tmp_hotel = '{{#list}}\n  <tr>\n    <td><label><input type="radio" name="" class="font-color" value="{{id}}"></label></td>\n    <td><a href="" target="_blank" title="" class="font-color">{{delivery}}</a></td><!--判断-->\n    <td><a href="" target="_blank" title="" class="font-color">{{id}}</a></td>\n    <td>{{username}}</td>\n    <td>{{otaName}}</td>\n    <td><a href="" target="_blank" title="" class="font-color">{{stitle}}</a></td>\n    <td>{{origin}}</td>\n    <td>{{service}}</td><!--判断-->\n  </tr>\n{{/list}}';

  render = function(tmp, data, partials) {
    tmp = Hogan.compile(tmp);
    return tmp.render(data, partials);
  };

  orderViewRender = {
    renderPage: function(data, type, pageType) {
      var partial_attach, partial_compensateInfo, partial_result, partial_search, partial_typeInfo, partials;
      partial_typeInfo = (function() {
        switch (type) {
          case "机票":
            return partial_flight;
          case "旅游酒店":
            return partial_hotel;
          case "火车票":
            return partial_train;
          case "其它":
            return partial_other;
          default:
            return null;
        }
      })();
      partial_result = (function() {
        switch (pageType) {
          case "process":
            return partial_result_process;
          default:
            return partial_result_display;
        }
      })();
      partial_process = (function() {
        switch (pageType) {
          case "process":
          case "phonetrans":
            return partial_process;
          case "appoint":
            return partial_process;
          default:
            return null;
        }
      })();
      partial_attach = (function() {
        switch (pageType) {
          case "process":
            return partial_attach_process;
          default:
            return partial_attach_display;
        }
      })();
      partial_compensateInfo = (function() {
        switch (pageType) {
          case "process":
            return partial_compensateInfo_process;
          default:
            return partial_compensateInfo_display;
        }
      })();
      if (partial_typeInfo === partial_hotel) {
        if (pageType === "process") {
          partial_typeInfo = partial_hotel_process;
        } else {
          partial_typeInfo = partial_hotel;
        }
      }
      if (partial_typeInfo === partial_flight) {
        if (pageType === "process") {
          partial_typeInfo = partial_flight_process;
        } else {
          partial_typeInfo = partial_flight;
        }
      }
      if (partial_typeInfo === partial_hotel) {
        if (pageType === "process") {
          partial_search = partial_searchInfo;
        } else {

        }
        null;
      }
      partials = {
        partial_telInfo: partial_telInfo,
        partial_typeInfo: partial_typeInfo,
        partial_result: partial_result,
        partial_attach: partial_attach,
        partial_compensateInfo: partial_compensateInfo,
        partial_process: partial_process,
        partial_search: partial_searchInfo
      };
      return render(tmp_page, data, partials);
    },
    renderTelHistory: function(data) {
      return render(tmp_telHistory, data);
    },
    renderMplayer: function(data) {
      return render(tmp_mplayer, data);
    },
    renderSh: function(data) {
      return render(tmp_sh, data);
    },
    renderDl: function(data) {
      return render(tmp_dl, data);
    },
    renderRecord: function(data) {
      return render(tmp_r, data);
    },
    renderhfRecord: function(data) {
      return render(tmp_hf, data);
    },
    renderAll: function(data) {
      return render(tmp_all, data);
    },
    renderTuan: function(data) {
      return render(tmp_tuan, data);
    },
    renderHotel: function(data) {
      return render(tmp_hotel, data);
    },
    renderHistoryOrder: function(data) {
      return render(tmp_historyOrder, data);
    },
    renderOp: function(data) {
      var command, i, ops, _results;
      ops = {
        'appoint': '<a href="javascript:;" class="handle-but js-op" data-type="appoint"><i>回访</i></a>',
        'appointComplete': '<a href="javascript:;" class="handle-but js-op" data-type="appointComplete"><i>回访完成</i></a>',
        'unlock': '<a href="javascript:;" class="handle-but js-op" data-type="unlock"><i>解锁</i></a>',
        'reopen': '<a href="javascript:;" class="handle-but js-op" data-type="reopen"><i>重开</i></a>',
        'process': '<a href="javascript:;" class="handle-but js-op" data-type="process"><i>处理</i></a>',
        'getback': '<a href="javascript:;" class="handle-but js-op" data-type="getback"><i>强制取回</i></a>',
        'tempSave': '<a href="javascript:;" class="handle-but js-op" data-type="tempSave"><i>暂存</i></a>',
        'closeOrder': '<a href="javascript:;" class="handle-but js-op" data-type="closeOrder"><i>关单</i></a>',
        'transferOrder': '<a href="javascript:;" class="handle-but js-op" data-type="transferOrder"><i>工单转接</i></a>',
        'tempSaveOuter': '<a href="javascript:;" class="handle-but js-op" data-type="tempSaveOuter"><i>暂存</i></a>',
        'delegate': '<a href="javascript:;" class="handle-but js-op" data-type="delegate"><i>委托</i></a>',
        'designate': '<a href="javascript:;" class="handle-but js-op" data-type="designate"><i>指派</i></a>',
        'update': '<a href="javascript:;" class="update-but js-op" data-type="update"><i>更新</i></a>'
      };
      _results = [];
      for (i in data) {
        command = data[i];
        _results.push(ops[command]);
      }
      return _results;
    }
  };

  module.exports = orderViewRender;

}).call(this);


    })( module.exports , module , __context );
    __context.____MODULES[ "cdb0db4f57d5d59f86e44fb2f9c33576" ] = module.exports;
})(this);


var tasks = [],
    timer = null,
    control = {
        pause: false,
        start: function (task, oTks) {
            var _this = this;
            oTks && (this.oTks = oTks);
            task && this.add(task);
            if (tasks.length == 0 ||　!timer) {
                 timer = window.setTimeout(function () {
                    var t = null, s = _this, params;
                    while (tasks.length && !_this.pause) {  //Array.prototype.push.apply([], tasks)
                        t = tasks.shift(); params= [];
                        if(Object.prototype.toString.call(obj).slice(8, -1)  == "object"){
                            t = t.handle;
                            t.scrope && (s = t.scope);
                            t.params instanceof Array ? (params =  t.params) : (params.push(t.params));
                        }
                        typeof t == "function" && t.call(s, params.concat(_this));
                    }

                    //window.setTimeout(_this.finish, 0);
                }, 0);
            }
            return this;
        },
        finish:function(){
            if (tasks.length == 0) {
                timer = null;
            }
        },
        add: function (task) {
            if (typeof task == "string" && task!="start" && (!this.oTks || !(task = this.oTks[task]))) {
                return;
            }
            tasks.push.apply(tasks, task instanceof Array && task || [task]);
            return this;
        },
        clear: function () {
            tasks.length = 0;
        },
        resume: function () {
            this.pause = false;
            this.start();
        },
        stop: function () {
            this.pause = true;
        }
    };

module.exports = {
    start:function(task){
        return control.start.call(control, task, this);
    },
    fixOrderData:function(flow){
        $('<button style="margin-left:35px;padding: 0px 10px; height: 24px; vertical-align: middle;">修复订单数据</button>')
            .appendTo("#basicContainer>*:eq(1)>p:eq(0)")
            .on('click', function(event) {
                event.preventDefault();
                var url = framework.addUser("/flowapi/fillOrderInfoToFlow.json"),
                    data = {'flowNo': flowNo,"orderNo":flow.order["订单号"]};
                $.ajax({
                    url:url,
                    // type:"post",
                    data:data,
                    success:function(d) {
                        try {
                            d = eval('(' + d + ')');
                            if(d.ret) {

                            } else {
                                //$("#email-msg").text(d.errmsg);
                            }
                        } catch (e) {
                            flowUtil.log('fillOrderInfoToFlow : ' + e);
                        }
                    }
                });
            });
    },
    heightHandle: function() {
        var max = 0, $ul = $("#basicContainer").find(">ul, >div");
        (function(index) {
            if (index < $ul.length) {
                var el = $ul[index];
                var $UL = $(el).css('height', 'auto');
                if (el.nodeName.toLowerCase() == "div") {
                    $UL = $UL.find(">ul").css('height', 'auto');
                }

                $UL.find(">li").css({"height": "auto", "wordBreak":"break-all", "padding":"0px 0px 16px"});
                if (el.clientHeight > max) {
                    max = el.clientHeight;
                }
                arguments.callee(index + 1);
                el.style.height = max + "px";
            }
        })(0);

        $("#basicContainer").css('zoom', '1');
    },
    syncHotel_QOTA:function(type, relationFlow){
        //flowConfigName，flowConfigId，flowNo，isTicketRequried
        if(relationFlow && type == "旅游酒店" || type.toUpperCase() == "QOTA"){
            var $he = $('<div style="float: left;">< `123>' + type+'工单号：</span>'+flowNo+'</div>')
                .css('color', 'red');
                .appendTo($("#js-priority").css('display', 'inline-block'))
                .on('click', function(event) {
                    event.preventDefault();

                    window.showFlow && window.showFlow(relationFlow.flowConfigId, type, relationFlow.flowNo);
                });

            if(relationFlow.isTicketRequried){
                $he.css('color', 'red').append(' (有赔付订单)');
            }   
        }
    }
};
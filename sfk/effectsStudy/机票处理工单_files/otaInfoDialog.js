
;(function(__context){
    var module = {
        id : "f711fda305b00cd77d8bd3d2c839acc9" , 
        filename : "otaInfoDialog.js" ,
        exports : {}
    };
    if( !__context.____MODULES ) { __context.____MODULES = {}; }
    var r = (function( exports , module , global ){

    /**
 * Created with IntelliJ IDEA.
 * User: root
 * Date: 13-9-29
 * Time: 下午9:27
 * To change this template use File | Settings | File Templates.
 */

function otaInfoDialog(){
    $(document).find('.js-agent').bind('mouseover',function(e){
        var agent_container = $(this);

        var param = {
            webSite: $(this).attr('data-site')
        };

        window.timer_ota = setTimeout(function(){
            if(agent_container.find("div.flow-ota").length > 0 || param.webSite.length == 0){
                agent_container.find("div.flow-ota").show();
                return;
            }

            $.ajax({
                url:  "/flowapi/otaInfo.json?currentId=" + currentId,
                type: "GET",
                cache: false,
                data: param,
                dataType: 'json',
                async: true,
                contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
                success: function(result){
                    if(!!result){
                        var html = pushdetail(result.data.otcInfo);
                        agent_container.append(html.join(''));
                        agent_container.find("div.flow-ota").show();
                    }
                }
            });

        }, 300);

        function pushdetail(d){
            var html = [];
            html.push('<div class="flow-ota">');
            html.push('<div class="ota"><span class="otaname">', d.name, '</span><span class="blue">', d.webSite, '</span></div>');
            html.push('<table>');
            html.push('<tr><td class="keyname" width="60px;">类型：</td><td colspan="3">', d.otcType, '</td></tr>');
            html.push('<tr><td class="keyname">工作时间：</td><td colspan="3">', d.workingTimeText, '</td></tr>');
            html.push('<tr><td class="keyname">转接电话：</td><td colspan="3">', d.otcPhone, '</td></tr><tr><td class="keyname">备注：</td><td colspan="3">', d.other ? d.other : '', '</td></tr>');
            html.push('<tr><td class="keyname">热线电话：</td><td colspan="3">', d.hotlinePhone, '</td></tr></tr><td class="keyname" width="60px;">紧急电话：</td><td colspan="3">', d.emergencyPhone, '</td></tr>');
            html.push('<tr><td class="keyname">投诉电话：</td><td colspan="3">', d.complaintPhone, '</td></tr>');
            html.push('</table>');
            html.push('</div>');
            return html;
        }
    }).bind('mouseout', function(e){
            clearTimeout(window.timer_ota);
    });
    $("div.flow-ota").live("mouseover", function(){
        $(this).show();
    }).live("mouseout", function(){
        $(this).delay(800).hide();
    });
}

module.exports = otaInfoDialog;

    })( module.exports , module , __context );
    __context.____MODULES[ "f711fda305b00cd77d8bd3d2c839acc9" ] = module.exports;
})(this);

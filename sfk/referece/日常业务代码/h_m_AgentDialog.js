function floatInfo($he, d){
	 var time_tip_hide = null,
        time_tip_show = null,
        $flowOta = null,
        clearTimer = function($he, timer) {
            if ($he.data(timer)) {
                clearTimeout($he.data(timer));
                $he.data(timer, null);
                return true;
            }

            return false;
        };

    $he.bind('mouseover', function(e) {
        var $td = $(this);
        //console.log('S-mouseover        time_tip_show = ' +  $td.data("time_tip_show") +' -----  time_tip_hide = ' +  $td.data("time_tip_hide"));
        if (!$td.data("init")) {
            $td.data({
                "time_tip_hide": null,
                "time_tip_show": null,
                "$flowOta": null,
                "init": true
            });
        }

        if (clearTimer($td, "time_tip_hide")) {
            //$td.data("$flowOta") && $td.data("$flowOta").show();
            return;
        }
        //if ($td.data("$flowOta") && $td.data("$flowOta").css("display") != "none") {return;}

        $td.data("time_tip_show", window.setTimeout(function() {
            var name = d.supplierName;
            //if(!name || name ===''){ return;}

            var $flowOta = $td.find('.flow-ota');

            if ($flowOta.length === 0) {
                var html = [],
                    tPhone = d.supplierPhone;
                //var para = "','" + d.orderNo + "','" + name + "','" + d.productType + "','" + d.telephone + "'";
                //var transfPhone = d.workingTime ? '<a class="transfering"  href="javaScript:"  onclick="transPhoneToIvr('+para+')">转接</a>': "";
                var sWebSite = ""; // /http:\/\//.test(d.webSite) ? d.webSite : ('http://' + d.webSite);
                html.push('<div class="flow-ota">');
                html.push('<div class="ota"><span class="otaname">', name, '</span><span onclick="window.open(\'', sWebSite, '\')" class="blue">', d.webSite, '</span></div>');
                html.push('<table>');
                d.productPhone != undefined && html.push('<tr><td class="keyname">产品电话：</td><td>', d.productPhone, '</td></tr>');

                html.push('<tr><td class="keyname">供应商联系电话：</td><td>', d.supplierPhone, '</td></tr>');//, '<a class="transfering"  href="javaScript:"  onclick="transPhoneToIvr(\'\',\'' + tPhone + para + ')">转接</a>'
                html.push('</table>');
                html.push('</div>');
                $flowOta = $(html.join('')).appendTo($td)
                    .on('mouseover', function(evt) {
                        evt.stopPropagation();

                        clearTimer($td, "time_tip_hide")
                    }).on('mouseout', function(evt) {
                        evt.stopPropagation();

                        clearTimer($td, "time_tip_hide");
                        $td.data("time_tip_hide", window.setTimeout(function() {
                            $flowOta.hide();
                            $td.data("time_tip_hide", null);
                        }, 300));
                    });

                $td.data("$flowOta", $flowOta);
            }

            $flowOta.show();
            $td.data("time_tip_show", null);
        }, 300));
    }).bind('mouseout', function(e) {
        var $td = $(this);
        if (clearTimer($td, "time_tip_show")) {
            return;
        }

        $td.data("time_tip_hide", window.setTimeout(function() {
            $td.data("$flowOta").hide();
            $td.data("time_tip_hide", null);
        }, 300));
    });
}


module.exports = function(type) {
    var dataJSON = {}, $he = $('#basicContainer [data-float=true]');
    switch(type){
    	case "门票":{
    		 //dataJSON.telephone = $.find("input[name='telephone']").val()
    		 dataJSON.orderNo = $he.attr('data-orderNo');
    		 dataJSON.webSite="";// $he.attr('data-site');  
    		 //dataJSON.productType = $he.attr('data-productType');
    		 dataJSON.supplierName = $he.attr('data-supplierName');

    		 dataJSON.supplierPhone = $he.attr('data-supplierPhone');
    		break;
    	}
    	case "度假":{
    		 dataJSON.orderNo = $he.attr('data-orderNo');
    		 dataJSON.webSite="";// $he.attr('data-site');  
    		 dataJSON.productType = $he.attr('data-productType');
    		 dataJSON.supplierName = $he.attr('data-supplierName');
    		break;
    	}
    	default:{
    		return;
    	}
    }

    floatInfo($he, dataJSON);
}

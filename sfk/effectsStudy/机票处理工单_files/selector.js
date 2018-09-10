
;(function(__context){
    var module = {
        id : "0c6bf0b52b332a4001b8cc517ff83031" , 
        filename : "selector.js" ,
        exports : {}
    };
    if( !__context.____MODULES ) { __context.____MODULES = {}; }
    var r = (function( exports , module , global ){

    window.getPrpblem = function(firstUrl,url,params,container,typeName){
    var _self = this;
    this.firstUrl = firstUrl;
    this.url = url;
    this.params = params;
    this.$container = $(container);
    this.typeName = typeName;
    this.flag = true;
    this.load = function(_url,_param,callback){
        $.ajax({
            url : _url ,
            type : "get",
            data : _param ,
            dataType : "JSON",
            success : function(d){
                if(d.success){
                    if(!!callback){
                        callback(d);
                    }else{
                        _self.dealdata(d.data.flowProblemList);                            
                    }
                }else{
                }
            }
        });
    };
    this.dealdata = function(d){
        if(!!d && d.length>0){
            _self.resetId(d);
            _self.creatDom(d);
        }
    };
    this.resetId = function(d){
        _self.flowConfigId = d.flowConfigId;
        _self.flowConfigId = d.flowProblemId;
    }
    this.creatDom = function(d){
        var html = [];
        html.push('<li>');
        $.each(d,function(i,config){
            html.push('<p class="p js-p js-talking" data-name="',config.flowProblemName,'" data-proid="',config.flowProblemId,'" data-confid="',config.flowConfigId,'">',config.flowProblemName,'</p>');
        });   
        html.push('</li>');         
        _self.$container.append(html.join(''));
        _self.bindevents(_self.$container.find('li:last'));
        var obj = _self.typeName;
        if(_self.flag){
			if(obj){
        		_self.$container.find("p[data-name='"+obj+"']").trigger('click');
			}

        	_self.flag=false;
    	}
    };
    this.bindevents = function(dom){
        dom.find('.js-p').bind('click',function(e,callback){
            var el =  $(e.target);        
            var next_param = _self.getParam(el);
            el.siblings().removeClass('onselect');
            el.addClass('onselect');
            el.closest('li').nextAll().remove();
            _self.dealnext(next_param);       
        });
    };
    this.getParam = function(el){
       return {
                flowProblemId : el.attr('data-proid'),
                flowConfigId : el.attr('data-confid')
             };
    };
    this.dealnext = function(param){
        _self.load(_self.url,param,function(d){
            var flowProblemList = d.data.flowProblemList;
            if(flowProblemList.length>0){
                 var html = ['<div class="next"></div>'];
                _self.$container.append(html.join(''));   
                _self.dealdata(flowProblemList);                 
            }
        });
    };

    /**
     *
     * @param path {Array | string}
     */
    this.setValue = function(path) {
        if($.type(path) === 'string') {
            path = path.split('');
        }

        var container = this.$container,
            i = 0;

        function copy(i) {
            if(i==path.length)return;
            var li = container.find('li').eq(i);
            $(li).find('p[data-name'+path[i]+']').trigger('click');
            i++;
            setTimeout(function(){copy(i)},1500);
        }

        copy(i);

    };

    _self.load(_self.firstUrl,_self.params);
};

    })( module.exports , module , __context );
    __context.____MODULES[ "0c6bf0b52b332a4001b8cc517ff83031" ] = module.exports;
})(this);

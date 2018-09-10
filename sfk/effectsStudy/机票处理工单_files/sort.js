
;(function(__context){
    var module = {
        id : "8c09a5588c0c532cf52f7616793ece4a" , 
        filename : "sort.js" ,
        exports : {}
    };
    if( !__context.____MODULES ) { __context.____MODULES = {}; }
    var r = (function( exports , module , global ){

    window.sortable = function(select,index,func){
	var _self = this;
	var _index = index;
	var _t = $(select);
	var _sorted = _t.attr('data-sortd');
	this.init = function(){
		_self.dealtable();
	};
	this.dealtable = function(){
		if(!!_t){
            var a = _self.gettable(_t);
            var _func = func ? func : _self.compareByColumn();			
			if(_sorted == _index){
				a.reverse();//如果已经排序过 反序
			}else{
				a.sort(_func);
			}
	    	_self.drawtable(a);
		}
	};
	this.gettable = function(_t){
		var a = [];
		_t.find('tr').each(function(i,v) {
    		a.push(v);
    	});
    	return a;
	};
	this.compareByColumn = function(){
        return function(n1,n2){
            var t1 = $(n1).find('td').eq(_index).text();
            var t2 = $(n2).find('td').eq(_index).text();
            if(t1 < t2){
                return +1;
            }else if(t1 > t2){
                return -1;
            }else{           
                return 0;
            }
        }
    };
    this.drawtable = function(a){
    	_t.empty().append(a);
    	_t.attr('data-sortd',_index);
    };
    _self.init();
}

    })( module.exports , module , __context );
    __context.____MODULES[ "8c09a5588c0c532cf52f7616793ece4a" ] = module.exports;
})(this);

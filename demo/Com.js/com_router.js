(function(c){
   
	// 地址不能带有 ? 和 # 等字符( 所有特殊字符必须转译后拼接) ;

    var R = c.Router = function(routes){
    	this.routes = routes ;
    	this.linkArr = [] ;
    	this.linkTarget = null ;

    	var urlKey_detail = {} ;
    	var path_detail   = {} ;
       	var render = function( r , linkPath ){
       		r.linkPath = linkPath+'/'+r.path ;
       		r.component = null ;
       		urlKey_detail[r.linkPath] = r ;
       		path_detail[r.path] = r ;
			if( r.children ){
				r.children.map(function( v ){
					render( v , r.linkPath )
				});
			}      		
    	};
    	render( routes , '' );

    	this.urlKey_detail = urlKey_detail ;
    	this.path_detail = path_detail ;

    	// 默认定向路由 ;
   //  	var hasDefault = false ;
   //  	for(var k in path_detail){
   //  		var each = path_detail[k] ;
			// if( each.default ){
			// 	hasDefault = true ;
			// 	this.push( each.linkPath );
			// }
   //  	};
   //  	!hasDefault ? error('没有设置默认路由') : null ;

    	var this_ = this ;
    	setTimeout(function(){
    		this_.watchChange();
    	},500);
    };

    R.prototype.findActiveRouterView = function(){
    	var l = location.href ;
    	var str = l.match(/#([^\?]*)/)[1] ;
    	var arr = str.split('/') ;
    		arr = arr.filter(function(v){
    		return v&&1
    	});
    	return {
    		str:str ,
    		arr:arr
    	}
    };


    // 得到路由地址 ( # 到 ? 之间 ) ;
    Object.defineProperty( R.prototype , 'linkPath' , {
    	get:function(){
    	    var l = location.href ;
    	    return l.match(/#([^\?]*)/)[1] ;
    	}
    });
    // 得到queryString ;
    Object.defineProperty( R.prototype , 'queryString' , {
    	get:function(){
    	    var l = location.href ;
    	    var arr = l.match(/\?(.*)/);
    	    var str = (arr ? arr[1] : '') ; 
    	    return str ;
    	}
    });

    // 得到getQueryObj
    R.prototype.getQueryObj = function( str ){ 
    	var params = {} ;
    	if( str.includes('?') ){
    		str = str.match(/\?(.*)/)[1];
    	};
		var arr = str.split('&') ;
			arr.map(function(v){
				if( v.includes('=') ){
					var key   = decodeURIComponent( v.split('=')[0] );
					var value = decodeURIComponent( v.split('=')[1] );
                        value=='true' ? value=true : null ;
                        value=='false' ? value=false : null ;
                        value=='undefined' ? value=undefined : null ;
					params[ key ] = value ;
				}
			});	
    	
    	return params ;
    };
    // 设置getQueryObj
    R.prototype.setQueryObj = function( obj ){
		var arr = [];
        for(var k in obj ){
        	var v = obj[k]
        	if(!k||!v){ continue };
        	arr.push( encodeURIComponent(k) +'='+ encodeURIComponent(v) );
        };
        return arr.join('&');  	
    };
    // *** 用户设置query对象 , 用户得到query对象 ; 
    Object.defineProperty( R.prototype , 'query' , {
    	set:function(obj){
    		var qs = this.setQueryObj(obj) ;
    		var href = location.href.split('?')[0] ;
    		location.href = href+'?'+qs ;
    	},
    	get:function(){
    		var qs = this.queryString ;
    		return this.getQueryObj( qs );
    	}
    });

    R.prototype.watchChange = function(){
    	var this_ = this ;
    	window.onhashchange=function( evt ){ 
    		var newURL_match = evt.newURL.match(/#([^\?]*)/) ;
    		var oldURL_match = evt.oldURL.match(/#([^\?]*)/) ;

    		var newURL = newURL_match ? newURL_match[1] : null ;
    		var oldURL = oldURL_match ? oldURL_match[1] : null ;
    		if( newURL==oldURL ){
    			return ;
    		}else{
                // 路由根元素 ;
                var ROOT = this_.ROOT ;
                // 路由钩子
                var beforeEnter = this.routes.beforeEnter ;
                if( beforeEnter ){
                    var allowed = beforeEnter.call(this, newURL,oldURL );
                    allowed!==false&&ROOT ? ROOT.hashChange() : null ;
                }else{
                    ROOT ? ROOT.hashChange() : null ;
                }
            }
    	}
    }

    R.prototype.push = function( str ){
    	if( c.type(str)!='String' ){ alert('push 方法 只接受字符串'); return };

    	var path = str.split('?')[0];
    	var qs   = str.split('?')[1];
    	var href = location.href.split('#')[0];
    		href = href+'#'+path ;
    		qs ? href=href+'?'+qs : null ;

    	window.location.href = href ;
    }

    
}(Com));
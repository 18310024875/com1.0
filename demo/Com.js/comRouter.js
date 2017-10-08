(function(){

	window.router = Com.router = {
		params:{} ,
		routerView:undefined ,
		oldComponent:undefined,
		routes:[]
	};

	var callbackFun = function(){};

	router.beforeRun = function( callback ){
		if(callback){
			callbackFun = callback ;
		}
		
		callbackFun()
		return router ;
	}	

	router.run = function( routes ){
		router.params = getParams() ;

		router.routes = routes ;
		// 当不存在location.hash 时候寻找默认组件 ;
		if( !window.location.hash ){
			for (var i=0 ; i<routes.length ; i++) {
				var each = routes[i] ;
				if( each.default ){
					var config_name = each.component ;

					router.beforeRun()
					
			  		getRoute( config_name )
				}
			}			
		}else{
			var hash = window.location.hash.split('#')[1] ;
			var link_name = hash.split('/')[0] ;

			var config_name ;

			for (var i=0 ; i<routes.length ; i++) {
				var each = routes[i] ;
				if( each.path == link_name ){
					config_name = each.component ;
					break ;
				}
			}

			router.beforeRun()
			
	  		getRoute( config_name )	
		}

		return router ;
	};
	router.addParam = function( obj ){

		var params = router.params ;
		var str = '' ;

		for(var k in obj){
			params[k] = obj[k]
		}

		var i=0 ;
		for(var each in params){
			if(i==0){
				str += each+'='+params[each]
			}else{
				str += '&'+each+'='+params[each]
			};
			i++
		}

		try{
			location.search = str ;
		}catch(e){
			log(e)
		}

		return router
	}

	window.onhashchange = function(){
		router.params = getParams() ;

		var routes = router.routes ;
		var hash = window.location.hash.split('#')[1] ;
		var link_name = hash.split('/')[0] ;

		var config_name ;

		for (var i=0 ; i<routes.length ; i++) {
			var each = routes[i] ;
			if( each.path == link_name ){
				config_name = each.component ;
				break ;
			}
		}

		router.beforeRun();

  		getRoute( config_name , true )
	}

	// params
	function getParams (){
		var params = {} ;
		if( location.search ){
			var str = location.search.split('?')[1] ;
			var arr = str.split('&') ;	
			arr.map(function(v){
				var key   = v.split('=')[0] ;
				var value = v.split('=')[1] ;
				params[ key ] = value ;
			})
		}
		return params		
	}	

	// 请求组件
	function getRoute( config_name ){
		var old = router.oldComponent ;
		// 异步请求 ;
  		if( tool.saveExports[config_name] ){
  			var options = tool.saveExports[config_name] ;
  			// opeions 添加 el 才能挂载 ;
  			// el是变量 -- 需要动态添加
  			if( old && old.beforeDestroy ){
  				old.beforeDestroy()
  			}
  			router.routerView.$DOM.html('');

  			options.el = router.routerView.$DOM ;
			router.oldComponent = new Component( options )
 		}else{
			Com.require( config_name ,function( options ){
				// opeions 添加 el 才能挂载 ;
				// el是变量 -- 需要动态添加
	  			if( old && old.beforeDestroy ){
	  				old.beforeDestroy()
	  			}
				router.routerView.$DOM.html('');
				options.el = router.routerView.$DOM ;
				router.oldComponent = new Component( options )
			})
		}
	}

}())
(function(){

	window.router = Com.router = {
		params:{} ,
		routerView:undefined ,
		routes:[]
	};
	router.run = function( routes ){
		router.params = getParams() ;

		router.routes = routes ;
		// 当不存在location.hash 时候寻找默认组件 ;
		if( !window.location.hash ){
			for (var i=0 ; i<routes.length ; i++) {
				var each = routes[i] ;
				if( each.default ){
					var config_name = each.component ;

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

	  		getRoute( config_name )	
		}
	};

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

  		getRoute( config_name )
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

		// 异步请求 ;
  		if( tool.saveExports[config_name] ){
  			var options = tool.saveExports[config_name] ;
  			// opeions 添加 el 才能挂载 ;
  			// el是变量 -- 需要动态添加
  			router.routerView.$DOM.html('');
  			options.el = router.routerView.$DOM ;
			var Son = new Component( options )
 		}else{
			Com.require( config_name ,function( options ){
				// opeions 添加 el 才能挂载 ;
				// el是变量 -- 需要动态添加
				router.routerView.$DOM.html('');
				options.el = router.routerView.$DOM ;
				var Son = new Component( options )
			})
		}
	}

}())
(function(){

		window.log = console.log ;
		window.error = console.error ;
		window.warn = console.warn ;

	// 全局 Com 对象 ;
	window.Com = function( options ){
		return new Component(options);
	};
	// 2017 11 13 组件可在js中创建 ;
	Com.make = function( options ){
		if( !options.template || typeof options.template !='string' ){
			alert('组件template不合法');
		}

		var tpl = options.template ;
			// 换行会对 match 造成影响 先去换行 ;
			tpl = tpl.replace(/\r/g,'') ;
			tpl = tpl.replace(/\n/g,'') ; 
		new_options = template.readTPL( tpl , options );
		return new Component( new_options ) ;
	};


	// 唯一id ;
	var only_index =  Date.parse(new Date()); 

	// 工具对象
	window.tool = {
		// *** 缓存所有组件( options ) ;
		saveExports:{} ,

		// 唯一 ID ;
		onlyId:function(){
			return only_index++ ;
		},

		// 深度克隆  ( 只克隆 对象 和 数组 ) ;
		deepClone:function( tree ) {
			var return_ ;
			var type = typeof tree  ;
			// 引用类型 ;
			if( type=='function' ){ // 函数
				return_ = tree ;
			}
			else if(type=='object'){ // 对象 数组 ;
				if( tree instanceof Array){
					// 数组
					return_ = tree.map(function( v ){
						return tool.deepClone( v )
					})
				}else{
					//对象
					var obj = {} ;
					for(var each in tree){
						// 防止克隆 jquery ;;;
						if( each=="DOM"||each=="$DOM" ){
							obj[each] = tree[each] ;
						}else{
							var val_ = tool.deepClone( tree[each] ) ;
							obj[each] = val_ ;
						}
					} //for over ;
					return_ = obj ;
				}
			}
		 	// 基本类型 ;
			else{
				return_ = tree ;
			}
			return return_ ;
		},

	}

}())


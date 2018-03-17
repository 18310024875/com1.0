(function( c ){

	// 唯一id ;
	var __onlyId =  Date.parse(new Date()); 
	c.onlyId = function(){
		return __onlyId++ ;
	}

	// 得到类型 ;
	c.type = function( x ){
		// 分辨数据类型 
		// RegExp Function Object Array 
		// Null Undefined Boolean Number String
		return Object.prototype.toString.call( x ).slice(8, -1) ;
	};

	// 是否为空 ;
	c.empty = function( x ){
		if( c.type(x)=='Array' ){
			if( x.length==0 ){
				return true ;
			}else{
				return false ;
			}
		}else if( c.type(x)=='Object' ){
			var ind = 0 ;
			for(var i in x){
				i?ind++:null;
			}
			if( !ind ){
				return true ;
			}else {
				return false ;
			}
		}else {
			if( !x ){
				return true; 
			}else{
				return false;
			}
		}
	};

	// 深度克隆  ( 只克隆 对象 和 数组 ) ;
	c.clone = function( tree ) {
		var return_ ;
		var type = c.type(tree);

		if( type=='Array' ){
			return_ = tree.map(function( v ){
				return c.clone( v );
			});
		}else if( type=='Object' ){
			var obj = {} ;
			for(var i in tree){
				// 防止克隆 jquery ;;;
				if( i=="DOM"||i=="$DOM" ){
					obj[i] = tree[i] ;
				}else{
					obj[i] = c.clone( tree[i] );
				}
			}
			return_ = obj ;
		}else{
			return_ = tree ;
		}

		return return_ ;
	}


}( Com ));





window.log = console.log ;
window.error = console.error ;
window.warn = console.warn ;

(function(){

	// 全局
	window.Com = {} ;

	var only_index =  Date.parse(new Date()); 

	// 工具对象
	window.tool = {
		// *** 缓存所有组件( options ) ;
		saveExports:{} ,
		// 事件类型
		allMethods:{},

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
					var arr = [] ;
					tree.map(function( v ){
						val = tool.deepClone( v )
						arr.push(val)
					})
					return_ = arr ;
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

		// 收集事件 统一出发 ;
		// Emitter:Emitter,

	}

	function Emitter () {
		this.its = [] ;
		this.cbs = [] ;
		this.vals = [] ;
	}
	Emitter.prototype.add=function( it , cb , val ){
		this.its.push(it)   ;
		this.cbs.push(cb)   ;
		this.vals.push(val) ;
	}
	Emitter.prototype.doAll=function(){

	   for( var i=0,j=cbs.length ; i<j ; i++ ){
	   		if( !its[i] ){
	   			continue
	   		};
			var it  = its[i]  ;
			var val = vals[i] ;

			eval( "it"+cbs[i]+"(val)" ) ;
		}
		its.length  = 0 ;
		cbs.length  = 0 ;
		vals.length = 0 ;
	}

}())


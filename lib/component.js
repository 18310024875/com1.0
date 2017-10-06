
// !!! export_options 转化成 组件实例 ;

var Component = function(opt){ log(opt)

	var this_ = this ;

// DOM ;
    this.$el =  $(opt.el) ;
    this.el = this.$el.get(0) ;
    // //所有的 子元素 在一个对象中 可以根据id 查找 ;;;
    // this.All_Vnodes = opt.All_Vnodes ; 

 	this.VnodeTree = opt.VnodeTree ;

 	// 组件 ;
 	this.components = opt.components ;

    Object.defineProperty(this,'$refs',{
    	get:function(){

    	}
    })

// WATCH
	// var watchs = {} ;
	// if( opt.watch ){
	// 	for(let each in opt.watch){
	// 		let callback = opt.watch[each] ;
	// 		watchs[each] = callback ;
	// 	}		
	// }

// 数据绑定
	// 数据库 data ;
	var data = opt.data||{} ;
	// 数据库代理 ;
	var __data__ = {} ;
	var __data__wrapper = {} ; //代理包装层 ;
	// 便利 ;
	if( Object.keys(data).length>0 ){
	  // *** 这里必须用闭包 否则出错 !!! ;
		for( var name in data ){
			(function(name){
				// !!!! name 为闭包里的一个 参数 所以可以访问 name  !!!!
				var obj = {
					set:function( new_ ){
						if(this_.$data[name]==new_){ console.warn('same change');return } ;
						// 给数据库 赋值 ;
						var old_ = data[name] ;
						data[name] = new_ ;

					},
					get:function(){
						// *** 其实是死的 !!!!
						return data[name]
					}
				} ;
				__data__wrapper[name] = obj ;	

			}(name))
		}
	}
	Object.defineProperties(__data__,__data__wrapper);
	// 真正的 this.data ;
	this.$data = __data__ ;


// 生命周期
	var beforeMount = opt.willMount ;
	var mounted   = opt.mounted   ;
	var render    = opt.render	;

// 渲染 ;
	var dom = this.reedTree( this.VnodeTree  ) ;

// // 渲染组件 ;

// 	for( var s in this.components ){
// 		var scope_name  = s ;
// 		var config_name = this.components[ scope_name ] ;
// 		if( tool.saveExports[config_name] ){
// 			console.log( saveExports[config_name] )
// 		}else{
// 			Com.require( config_name ,function( options ){
// 				window.son = new Component( options )
// 			})
// 		}		
// 	}
	


	this.$el.append(dom)

// 克隆一份数据 用于比较 ;;
	this.VnodeTree_DIFF = tool.deepClone( this.VnodeTree ) ; 
}




// *** 初次渲染 template ;
Component.prototype.reedTree=function(tree){

	// 本身dom ;
	var tagName = tree.tagName ;
	var father = $("<"+tagName+">");


	// *** 寻找组件 !!!
  	var components = this.components ;
  	if( components ){
  		// tagName 为 挂载父级元素模板内名字 ;
  		if( components[tagName] ){
    		// config_name 为config 对应模块地址 ;
  			var config_name = components[tagName] ;

    		// 元素替换成section ; 添加class
  			father = $("<section>");
  			tree.class = [{value:'configName.'+config_name}]

  			// 异步请求 ;
  			if( tool.saveExports[config_name] ){
  				var options = tool.saveExports[config_name] ;
  				// opeions 添加 el 才能挂载 ;
  				// el是变量 -- 需要动态添加
  				options.el = father ;
				window.son = new Component( options )
  			}else{
				Com.require( config_name ,function( options ){
					// opeions 添加 el 才能挂载 ;
					// el是变量 -- 需要动态添加
					options.el = father ;
					window.son = new Component( options )
				})
  			}

  		  // ******* 组件树暂时不不会有子组件 ; 所以在子组件 改变data 在父组件setState 子组件不会刷新 ;

  			// ***  之后添加 props 会用到 !!!! 
  
  		}	
  	};

  	// 渲染之后 VNode.DOM 不为空 ;
	tree.$DOM = father ;
	tree.DOM = father.get(0);

	// children ; 
	var arr = tree.children ;
	if( arr.length !=0 ){
		for ( var i=0,j=arr.length ; i<j ; i++ ) {
			// 递归
			var child = this.reedTree( arr[i] )
			father.append( child )			
		}
	}

	// 文字
	var text = tree.text ;
	if( text ){
		father.text(text);
	}
	// {{}} 双括号
	var double = tree.double ;
	if( !$.isEmptyObject(double) ){
		father.html( double.value );
	}
	// 属性 Array ;;;
	var class_ = tree.class ; 
	var style_ = tree.style ;
	var prop_ = tree.prop ; 
	var attr_ = tree.attr ; 

	// class
	if( class_.length!=0 ){
		var str = '' ;
		class_.map(function(v){
			str += (" "+v.value)
		})	
		father.addClass( str ) ;
	}
	// style
	if( style_.length!=0 ){
		style_.map(function(v){
			var obj={} ;
				obj[v.dom_key] = v.value ;
			father.css( obj ) ;
		})
	}
	// prop
	if( prop_.length!=0 ){
		prop_.map(function(v){
			var obj={} ;
				obj[v.dom_key] = v.value ;
			father.prop( obj ) ;
		})
	}
	// attr
	if( attr_.length!=0 ){
		attr_.map(function(v){
			var obj={} ;
				obj[v.dom_key] = v.value ;
			father.attr( obj ) ;
		})
	}

	return father ;
}
// reedTree over

Component.prototype.setState = function(){

	var new_tree = this.VnodeTree ;
	var old_tree = this.VnodeTree_DIFF ;

	var this_ = this ;
	var Data = this.$data ;
	

  // **** 开始递归 **** ;
	(function( x , old , x_father){

		// * 子组件 del
		if(   x == undefined ){
			old.$DOM.remove() ;
			return ;
		}
		// * 子组件 add		
		if( old == undefined ){
			var addDOM = this_.reedTree(x)  ;
			x_father.$DOM.append(addDOM)
			return ;
		}
	  // *** 响应 vfor 绑定对象的长度改变 ;;;
		// 存在vfor ;
		var vf = x.VFOR_template ;
		if( vf ){
			var vf_length = vf.length ;
			var vf_data_key = vf.data_key ;
			var ArrObj = eval('Data.'+vf_data_key) ;
			
			var new_vf_length = Object.keys(ArrObj).length ;
			// 数组长度变化 ;
			if( new_vf_length!=vf_length ){
				// 以我的能力 这里的优化写不出 ; 应该根据key判断错位 ;
				var new_tree = doVFOR.readAgainVF( vf.clone_VF_tree , Data ) ;
				// 返回的结构是错位的 这里复位 ;
				x = new_tree ;
				x_father.children = [x] ;

				// *** vfor 复位之后 恢复DOM $DOM ;
				( function( x_ , old_ ){
					x_.DOM = old_.DOM ;
					x_.$DOM = old_.$DOM ;
					for( var i=0;i<x_.children.length;i++){
						var one_x   = x_.children[i] ;
						var one_old = old_.children[i] ;
						if(one_old){
							arguments.callee(one_x,one_old)
						}						
					}					
				}( x , old) );

			}	
		} // vf over

		var father = x.$DOM ;

	// *** 属性改变 ;

		// {{}} 双括号
		var new_dbl = eval('Data.'+x.double.data_key) ;
		var old_dbl = old.double.value ;
		if( new_dbl!= old_dbl ){

			x.double.value = new_dbl ;

			this_.EmitArr( father, '.html' , new_dbl ) ;
		}

		// 属性 Array ;;;
		var c=[] , c_=[] ;
		x.class.map(function(v){
			if(v.data_key){
				var new_c = eval('Data.'+v.data_key) ;
				c.push( new_c ) ;
				v.value = new_c ;
			}
		}); 
		old.class.map(function(v){
			if(v.data_key){
				c_.push( v.value ) ;			
			}
		}); 

		var s  =   x.style ; 
		var s_ = old.style ; 

		var p  =   x.prop ; 
		var p_ = old.prop ; 

		var a  =   x.attr ; 
		var a_ = old.attr ; 


		// class
		if( c.length!=0 ){

			if(c.join()!=c_.join()){

				var it__ = getDiff_class( c , c_ ) ;

				var addStr = it__.add ;
				var delStr = it__.del ;

				if(delStr){
					this_.EmitArr( father, '.removeClass' , delStr ) ;					
				}
				if(addStr){
					this_.EmitArr( father, '.addClass' , addStr ) ;	
				}
			}
		}
		// style
		if( s.length!=0 ){
			var diff_s = getDiff(s , s_ ,Data) ;

			!$.isEmptyObject( diff_s )? this_.EmitArr( father, '.css' , diff_s ) :null;
		}
		// prop
		if( p.length!=0 ){
			var diff_p = getDiff(p , p_ ,Data) ;
			
			!$.isEmptyObject( diff_p )? this_.EmitArr( father, '.prop' , diff_p ):null ;
		}
		// attr
		if( a.length!=0 ){
			var diff_a = getDiff(a , a_, Data) ;
			
			!$.isEmptyObject( diff_a )? this_.EmitArr( father, '.attr' , diff_a ):null ;
		}

		// *** 递归 ;; 

		  // 这个length 取 new 和 old 最大值 ;
		  // 因为娶取不到会undefined ; 在下一步会处理 ; 不会存在报错 ;
		var len1 = x.children.length ;
		var len2 = old.children.length ;
		var len = Math.max(len1,len2) ;

		for( var i=0 ; i<len ; i++  ){
			var n_child = x.children[i] ;
			var o_child = old.children[i] ;
			arguments.callee( n_child , o_child , x ) ;
		}
		// 递归over ;

	} ( new_tree , old_tree, null ) );
	
	// 事件 全部触发 !!!! ;
	this.EmitGO();

	// *** 克隆一份新的信息 ;
	this.VnodeTree_DIFF = tool.deepClone( this.VnodeTree ) ; 
};
// 比较不同 ;
function getDiff( new_ , old_ , Data){
	var change = {} ;
	new_.map( function(v,k){
		if(v.data_key){
			var new_val = eval('Data.'+v.data_key)
			var old_val = old_[k].value ;		
			if( new_val!=old_val ){
				change[v.dom_key] = new_val ;
				v.value = new_val ;
			}	
		}
	})

	return change ;
}
function getDiff_class( new_ , old_ ){ 
log(new_ , old_)
	var add  = new_.concat([]); //concat 克隆新数组 ;
	var del  = old_.concat([]); //concat 克隆新数组 ;

	var same = [] ;
	new_.map(function(v1,k1){		  // new ;
		old_.map(function(v2,k2){   // old ;
			v1==v2?same.push(v1):null ;
		});
	});
	same.map(function(s){
		add.splice( add.indexOf(s),1) ;
		del.splice( del.indexOf(s),1) ;
	})
	return {
		add:add.join(' ') ,
		del:del.join(' ')
	}
}



(function(){
	var its  = [] ; window.i = its ;
	var cbs  = [] ; window.c = cbs ;
	var vals = [] ; window.v = vals ;
	Component.prototype.EmitArr=function( it , cb , val ){
		its.push(it)   ;
		cbs.push(cb)   ;
		vals.push(val) ;
	} 	 
	Component.prototype.EmitGO=function(){

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
}());

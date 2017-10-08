
// !!! export_options 转化成 组件实例 ;

var Component = function(opt){ 

	var this_ = this ;

	// DOM ;
    this.$el =  $(opt.el) ;
    this.el = this.$el.get(0) ;
    // //所有的 子元素 在一个对象中 可以根据id 查找 ;;;
    // this.All_Vnodes = opt.All_Vnodes ; 

    // DOM树
 	this.VnodeTree = opt.VnodeTree ;

 	// 生命周期 ;
 	this.mounted = opt.mounted ;
 	this.updated = opt.updated ;
 	this.beforeDestroy = opt.beforeDestroy ;

 	// refs
 	this.$refs = {} ;

 	// 组件 ;
 	this.components = opt.components ;

 	// 事件
 	this.methods = opt.methods||{} ;
 	// 事件绑定到this
 	var methods = this.methods ;
 	if( $.isEmptyObject() ){
 		(function(){
	 		for(var each in methods){
	 			(function(each){

	 				Object.defineProperty( this_ , each , {
	 					get:function(){
	 						return this_.methods[each]
	 					}
	 				})

	 			}(each))
	 		}
 		}())
 	}

	// WATCH
	this.watch = opt.watch || {} ;
	this.watchCallbacks = [] ;
	this.watchReady = function(){
		this.watchCallbacks.map(function(v){
			eval('this_.watch.'+v)
		})
		this.watchCallbacks = [] ;
	}

	// 数据绑定
	this.$data = opt.data||{} ;
	// this.$data.key 响应到 this.key ;
	(function(){
		var data = this_.$data ;
		for(var each in data){
			(function(each){

				Object.defineProperty( this_ , each , {
					set:function( new_ ){
						var old_ = data[each] ;
						if( old_!= new_ ){
							data[each] = new_ ;

							// watch
							if( this_.watch[each] ){
								var w = each+'("'+new_+'","'+old_+'")' ;
								this_.watchCallbacks.push(w)
								log(this.watchCallbacks)
							}

						}else{
							warn('same change')
						}
					},
					get:function(){
						return data[each]
					}
				})

			}(each));
		}
	}());


// 渲染 ;
	var dom = this.reedTree( this.VnodeTree  ) ;
	this.$el.append(dom) ;

// 克隆一份数据 用于比较 ;;
	this.VnodeTree_DIFF = tool.deepClone( this.VnodeTree ) ; 

// 生命周期
	if( this.mounted ){
		this.mounted()
	}
}




// *** 初次渲染 template ;
Component.prototype.reedTree=function(tree){

	var this_ = this ;
	var isRefInComponents = false ; 
	var ref_NewAComponent ;

	// 本身dom ;
	var tagName = tree.tagName ;
	var father = $("<"+tagName+">");

	// router-view
	if( tagName=='router-view' ){
		father = $("<section>")
		tree.class = [{value:'router-view'}]
		window.router.routerView = tree ;
	}

	// *** 寻找组件 !!!
  	var components = this.components ;
  	if( components ){
  		// tagName 为 挂载父级元素模板内名字 ;
  		if( components[tagName] ){
  			isRefInComponents = true ;
    		// config_name 为 config.js 注册模块名 ;
  			var config_name = components[tagName] ;

    		// 元素替换成section ; 添加class
  			father = $("<section>");
  			tree.class = [{value:'configName_'+config_name}]

  			// 异步请求 ;
  			if( tool.saveExports[config_name] ){
  				alert(1)
  				var options = tool.saveExports[config_name] ;
  				// opeions 添加 el 才能挂载 ;
  				// el是变量 -- 需要动态添加
  				options.el = father ;
				ref_NewAComponent = new Component( options )
  			}else{

				Com.require( config_name ,function( options ){

					// opeions 添加 el 才能挂载 ;
					// el是变量 -- 需要动态添加
					options.el = father ;
					ref_NewAComponent = new Component( options )
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
	// attr !!! 当绑定的是一个对象 或者数组 应该转化成 JSON ;
	if( attr_.length!=0 ){
		attr_.map(function(v){
			// $refs
			if( v.dom_key=='ref' ){
				  // 组件上的 ref ;
				if( isRefInComponents ){
					this_.$refs[v.value] = ref_NewAComponent ;
				}else{
				  // dom上的ref
					this_.$refs[v.value] = tree.$DOM ;
				}
			}
			// v-if
			if( v.dom_key=='vifkey' ){
				if(v.value){
					tree.$DOM.css({display:'block'})
				}else{
					tree.$DOM.css({display:'none'})
				}
			}

			// *** 事件绑定
			if( v.dom_key.includes('v-on')){
				
				// if(!window.arr){
				// 	window.arr = [] ;
				// }
				// (function($dom){
				// 	log($dom)
				// 	window.arr.push( $dom ) ;
				// }(  tree.$DOM ));
				// log(tree);
				// log(tree.DOM)
				// log(tree.$DOM)
				// 方法名
				var Event_name = v.dom_key.split(':')[1] ;
				// "name(val1,'val2')"
				var von = v.value ;	
				// "name"			
				var method_name = von.split('(')[0] ;
				// 回传参数
				var pushArgumentsKeys = [] ;

				if( von.includes('(') ){
				  // 事件是 "name(val1,val2)"
					var agmts = von.match(/\((.*)\)/)[1];
					agmts.split(',').map(function( one ){
						one = one.trim();

						pushArgumentsKeys.push( '$dom.attr("vonkey_'+one+'")' )
					})
				}else{
				  // 事件是 "name" 
				}

				// *** 一个巨大的BUG tree为引用类型传递 ; target==tree.DOM 实际上不准确 vfor后tree会被最后一个覆盖 ;;;;
				// *** 可以利用闭包 吧tree.DOM 传递进去 复制一个指针! ;
				(function( dom , $dom ){
					// jquery 的事件委托有BUG 不知道什么原因 ; 自己弄一个吧 !
					document.body.addEventListener( Event_name , function(e){
						(function( t ){
							if( t== dom ){
								var arr = [] ;
								pushArgumentsKeys.map(function(v){
									arr.push( eval(v) )
								})
								// 调用组件方法 ;
								this_.methods[method_name].call(this_, arr , e );
							}else if(t == document.body){
								return ;
							}else{
								arguments.callee( t.parentNode )
							}

						}( e.target ))
					},false);

				}( tree.DOM , tree.$DOM ));


			} // 事件绑定结束 ; 

			// 对象编程JSON ( 只针对attr就行 )
			if( typeof v.value == 'object' ){
				v.value = JSON.stringify(v.value)
			}

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
				var resolution = vf.resolution ;
				var new_tree = doVFOR.readAgainVF( vf.clone_VF_tree , Data , resolution ) ;
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
			var diff_a = getDiff(a , a_, Data , true) ;
			// v-if
			if( diff_a.vifkey ){

				x.$DOM.css({display:'block'})
			}	
			if( diff_a.vifkey==''||diff_a.vifkey==0||diff_a.vifkey==false ){
				x.$DOM.css({display:'none'})
			}
			
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

	// 这里调用 updated ;
	if(this.updated){
		this.updated() ;
	}
	// updated 后调用 watch ;
	this.watchReady() ;

};
// 比较不同 ;
function getDiff( new_ , old_ , Data , fromAttr){
	var change = {} ;
	new_.map( function(v,k){
		if(v.data_key){
			var new_val = eval('Data.'+v.data_key);
			// JSON stringify ;
			if( (fromAttr) && (typeof new_val == 'object') ){
				new_val = JSON.stringify( new_val );
			}

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

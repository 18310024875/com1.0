(function(){

	var componentMaker = Com.component = function( opt ){ 

		var this_ = this ;

		// 路由记录当前位置 ;
		this.__urlKey = opt.__urlKey ;
		this.$router = this.router = Com.router || null ;

		// DOM ;
	    this.$el =  $(opt.el) ;
	    this.el = this.$el.get(0) ;

	    // DOM树
	 	this.vnodeTree = opt.vnodeTree ;

	 	// 生命周期 ;
	 	this.mounted = opt.mounted || function(){};
	 	this.updated = opt.updated || function(){};
	 	this.beforeDestroy = opt.beforeDestroy || function(){};

	 	// refs
	 	this.$refs = {} ;

	 	// 组件 ;
	 	this.components = opt.components || {};

	 	// 事件
	 	this.methods = opt.methods||{} ;
	 	// *** methods 绑定到 this *** ;
	 	var methods = this.methods ;
 		(function(){
	 		for(var each in methods){
	 			(function(each){

	 				Object.defineProperty( this_ , each , {
	 					get:function(){
	 						return this_.methods[each]
	 					}
	 				})

	 			}(each))
	 		};
 		}());

		// WATCH
		this.watch = opt.watch || {} ;
		this.watchCallbacks = [] ;
		this.watchReady = function(){
			this_.watchCallbacks.map(function(v){
				// 调用 watchCallbacks ;
				eval('this_.watch.'+v);
			})
			this.watchCallbacks = [] ;
		}

		// 数据绑定
		this.$data = opt.data||{} ;
		// *** data 绑定到 this *** ;
		(function(){
			// ** data 是 this.data ;
			var data = this_.$data ;
			for(var each in data){
				(function(each){

					Object.defineProperty( this_ , each , {
						set:function( new_ ){
							// warn(new_);
							var old_ = data[each] ;
							if( old_!= new_ ){

								data[each] = new_ ;

								// watch
								if( this_.watch[each] ){
									// watch 以字符串方式放入 watchCallbacks ;
									var w = each+'("'+new_+'","'+old_+'")' ;
									this_.watchCallbacks.push(w);
								}
							}else{
								console.warn('same change')
							}
						},
						get:function(){
							return data[each]
						}
					})

				}(each));
			};
		}());


		/*
			渲染 
			  根组件必须有el属性 , 子组件自动添加el 所以el一定存在!!!
		*/
			var $dom = this.reedTree( this.vnodeTree  ) ;
			this.$el.append( $dom ) ;

		/*
			克隆一份数据 用于比较 ;;
		*/ 
			this.vnodeTree_DIFF = Com.clone( this.vnodeTree ) ; 

		
		/*
			调用 生命周期 mounted
		*/ 
		this.mounted();
	}
	componentMaker.prototype.remove=function(){
		this.beforeDestroy();
		this.vnodeTree.$DOM.remove();
	}

	// *** 初次渲染 template ;
	componentMaker.prototype.reedTree=function(tree){

		var this_ = this ;
		/*
			判断是否ref属性绑定到组件上 , 绑定到组件上 返回组件 , 绑定到元素上 返回 dom
		*/
		var Ref_InComponent = false ; 
		var Ref_NewAComponent = null ;

		// 本身dom ;
		var tagName = tree.tagName ;
		var jqueryDOM = $("<"+tagName+">");

		/*
			router-view 控制路由 ;
		 */
		if( tagName=='router-view' && this.router ){
			jqueryDOM = $("<section>");tree.class = [{value:'router-view'}];
			tree.routerView = true ;

			var R = this_.router ;
			var rinfo = R.findActiveRouterView() ;
			var path_detail = R.path_detail ;

			var new_linkArr = rinfo.arr ;
			var old_linkArr = R.linkArr ;

			// 找到相同的层级 ;
			var min  = Math.min(new_linkArr.length , old_linkArr.length);
			var same = [] ;
			for( var i=0 ; i<min ; i++ ){
				if(new_linkArr[i]==old_linkArr[i]){
					same.push( new_linkArr[i] );
				}
			};

			var nextStr = new_linkArr[same.length];
			R.linkArr=same ;
			R.linkArr.push(nextStr);
			R.linkTarget = path_detail[ nextStr ];

	  		// 已经加载过 从 Com.exportInfo.urlKey 取 ;
	  		var url = R.linkTarget.url ;

			var a_option = Com.getOptionFromUrlKey( url );
			if( a_option ){
				a_option.el = jqueryDOM.get(0);
				R.linkTarget.component = new Com( a_option );
			}else{
				// 没加载过动态加载
				Com.require( url ,function( a_option ){
					a_option.el = jqueryDOM.get(0);
					R.linkTarget.component = new Com( a_option );
				})
			};
		};

		// *** 寻找组件 !!!
	  	var components = this.components ;
  		if( components[tagName] ){

  			Ref_InComponent = true ;

			// 改变 jqueryDOM 为section ; 添加class ;
  			jqueryDOM = $("<section>");
  			tree.class = [{value:'componentName_'+tagName}]

  			var component_child = components[tagName] ;
  			// 对象类型 子组件 ;
  			if( Com.type(component_child)=='Object' ){
				component_child.el = jqueryDOM.get(0);
  				Ref_NewAComponent = new Com( component_child );
  			};
  			// 字符类型 子组件 ;
  			if( Com.type(component_child)=='String' ){
  				// 已经加载过 从 Com.exportInfo.urlKey 取 ;
  				var a_option = Com.getOptionFromUrlKey( component_child );
  				if( a_option ){
  					a_option.el = jqueryDOM.get(0);
  					Ref_NewAComponent = new Com( a_option );
  				}else{
  				// 没加载过动态加载
  					Com.require( component_child ,function( a_option ){
  						a_option.el = jqueryDOM.get(0);
						Ref_NewAComponent = new Com( a_option );
					});
  				}
  			};

  		    // ???  组件树暂时不不会有子组件 ; 所以在子组件 改变data 在父组件setState 子组件不会刷新 ;
  			// ???  之后添加 props 会用到 !!!! 
  		};

	  	// 渲染之后 VNode.DOM 不为空 ;
		tree.$DOM = jqueryDOM ;
		tree.DOM = jqueryDOM.get(0);

	/*
		!!! 递归 children ___ 递归之所以在这个位置 需要创建完 操作 !!! ; 
	*/ 
		var arr = tree.children ;
		if( arr.length !=0 ){
			for ( var i=0,j=arr.length ; i<j ; i++ ) {
				// 递归
				var child = this.reedTree( arr[i] );
				jqueryDOM.append( child );		
			}
		}

		// 文字
		var text = tree.text ;
		if( text ){
			jqueryDOM.text(text);
		}
		// {{}} 双括号
		var double = tree.double ;
		if( !$.isEmptyObject( double ) ){
			jqueryDOM.html( double.value );
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
				str += (" "+v.value) ;
			})	
			jqueryDOM.addClass( str ) ;
		}
		// style
		if( style_.length!=0 ){
			style_.map(function(v){
				var obj={} ;
					obj[v.dom_key] = v.value ;
				jqueryDOM.css( obj ) ;
			})
		}
		// prop
		if( prop_.length!=0 ){
			prop_.map(function(v){
				var obj={} ;
					obj[v.dom_key] = v.value ;
				jqueryDOM.prop( obj ) ;
			})
		}
		// attr !!! 当绑定的是一个对象 或者数组 应该转化成 JSON ;
		if( attr_.length!=0 ){
			attr_.map(function(v){
			/*
				*** $refs 会按照 attr 解析 !!! ;
			*/ 
				if( v.dom_key=='ref' ){
					  // 组件上的 ref ;
					if( Ref_InComponent ){
						this_.$refs[v.value] = Ref_NewAComponent ;
					}else{
					  // dom上的ref
						this_.$refs[v.value] = tree.$DOM ;
					}
				};
			/*
				*** v-if *** ;
			*/ 
				if( v.dom_key=='V_IF' ){
					if(v.value){
						tree.$DOM.css({display:'block'})
					}else{
						tree.$DOM.css({display:'none'})
					}
				};
			/*
			    *** v-on *** 事件绑定 ;
			*/
				if( v.dom_key.includes('v-on')){
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

								pushArgumentsKeys.push( 'tree.$DOM.attr("V_ON_keyNameIs_'+one+'")' );
							});
					}else{
					  // 事件是 "name" 
					};
					
					// *** 绑定事件 ;
					tree.$DOM.on( Event_name , function(e){
						var arr = [] ;
						pushArgumentsKeys.map(function(v){
							// 调用每一项 取到值
							arr.push( eval(v) );
						});	

						// 调用函数 ;
						var eventStr='' ; 
						for( var i=0,j=arr.length ; i<j ; i++ ){
							try{
								arr[i] = JSON.parse(arr[i]);
							}catch(e){};
							eventStr+='arr['+i+'],' ;
						};
						eval('this_.methods[method_name].call(this_,'+eventStr+'e)');
					});
				}; 

			/*
				对象 变成JSON再赋值 ( 只针对attr就行 );;;
			*/ 
				if( typeof v.value == 'object' ){
					v.value = JSON.stringify(v.value)
				};

				var obj={} ;
					obj[v.dom_key] = v.value ;
				// 赋值
				jqueryDOM.attr( obj ) ;
			})
		}

		return jqueryDOM ;
	};
	// reedTree over


	componentMaker.prototype.setState = function(){

		var new_tree = this.vnodeTree ;
		var old_tree = this.vnodeTree_DIFF ;

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

		  // *** 响应 vfor 绑定对象的长度改变 (长度变化再解析一次模板) ;
			if( x.readAgain_vfor_info ){
				var INFO = x.readAgain_vfor_info ;
				var vf_data = INFO.data ;
				var vf_data_key = INFO.data_key ;
				var vf_resolution = INFO.resolution ;

				var old_vfor_length = x.children.length ;
				var new_vfor_length = eval('vf_data.'+vf_data_key).length ;
				if( new_vfor_length!=old_vfor_length ){
					// 再解析一遍vfor ;
					var new_vfor_tree = Com.readAgain_vfor( x , vf_resolution , vf_data );

					// 改变模板 ;
					x = new_vfor_tree ;

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
			};

		// *** 属性改变 ;
		var jqueryDOM = x.$DOM ;

			// {{}} 双括号
			var new_dbl = eval('Data.'+x.double.data_key) ;
			var old_dbl = old.double.value ;
			if( new_dbl!= old_dbl ){

				x.double.value = new_dbl ;

				this_.EmitArr( jqueryDOM, '.html' , new_dbl ) ;
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
						this_.EmitArr( jqueryDOM, '.removeClass' , delStr ) ;					
					}
					if(addStr){
						this_.EmitArr( jqueryDOM, '.addClass' , addStr ) ;	
					}
				}
			}
			// style
			if( s.length!=0 ){
				var diff_s = getDiff(s , s_ ,Data) ;

				!$.isEmptyObject( diff_s )? this_.EmitArr( jqueryDOM, '.css' , diff_s ) :null;
			}
			// prop
			if( p.length!=0 ){
				var diff_p = getDiff(p , p_ ,Data) ;
				
				!$.isEmptyObject( diff_p )? this_.EmitArr( jqueryDOM, '.prop' , diff_p ):null ;
			}
			// attr
			if( a.length!=0 ){
				var diff_a = getDiff(a , a_, Data , true) ;
				// v-if
				if( diff_a.V_IF ){

					x.$DOM.css({display:'block'})
				}	
				if( diff_a.V_IF==''||diff_a.V_IF==0||diff_a.V_IF==false ){
					x.$DOM.css({display:'none'})
				}
				
				!$.isEmptyObject( diff_a )? this_.EmitArr( jqueryDOM, '.attr' , diff_a ):null ;
			}

			// *** 递归 ;; 

			  // 这个length 取 new 和 old 最大值 ;
			  // 因为娶取不到会undefined ; 在下一步会处理 ; 不会存在报错 ;
			var len1 = x.children.length ;
			var len2 = old.children.length ;
			var len = Math.max(len1,len2) ;

			/*
				递归;;;
			*/
			for( var i=0 ; i<len ; i++  ){
				var n_child = x.children[i] ;
				var o_child = old.children[i] ;
				arguments.callee( n_child , o_child , x ) ;
			}


		} ( new_tree , old_tree, null ) );
		// 递归over ;
		
		// 事件 全部触发 !!!! ;
		this.EmitGO();

		// *** 克隆一份新的信息 ;
		this.vnodeTree_DIFF = Com.clone( this.vnodeTree ) ; 

		// 这里调用 updated ;
		this.updated() ;
		
		// updated 后调用 watch ;
		this.watchReady() ;

	};

	componentMaker.prototype.hashChange = function(){
		var this_ = this ;

		var R = this_.router ;
		var rinfo = R.findActiveRouterView() ;
		var path_detail = R.path_detail ;

		var new_linkArr = rinfo.arr ;
		var old_linkArr = R.linkArr ;

		// 找到相同的层级 ;
		var min  = Math.min(new_linkArr.length , old_linkArr.length);
		var same = [] ;
		for( var i=0 ; i<min ; i++ ){
			if(new_linkArr[i]==old_linkArr[i]){
				same.push( new_linkArr[i] );
			}
		};
		// 旧的和相同的比较 不一样的删除 ;
		for( var i=old_linkArr.length-1 ; i>=same.length ; i-- ){
			path_detail[ old_linkArr[i] ].component.remove();
			path_detail[ old_linkArr[i] ].component = null ;
		};
		// 删除完赋值
		R.linkArr = same ;

		// 找到活动节点
		var activeTarget = path_detail[ same[same.length-1] ];
		var nextStr = new_linkArr[same.length];

		render( activeTarget.component.vnodeTree );

		function render ( tree ){
			if( tree.routerView==true ){

				R.linkArr.push( nextStr ) ;
				R.linkTarget = path_detail[ nextStr ];

		  		// 已经加载过 从 Com.exportInfo.urlKey 取 ;
		  		var jqueryDOM = tree.$DOM ;
		  		var url = R.linkTarget.url ;
				var a_option = Com.getOptionFromUrlKey( url ); 
				if( a_option ){
					a_option.el = jqueryDOM.get(0);
					R.linkTarget.component = new Com( a_option );
				}else{
					// 没加载过动态加载
					Com.require( url ,function( a_option ){
						a_option.el = jqueryDOM.get(0);
						R.linkTarget.component = new Com( a_option );
					})
				}
			}

			var arr = tree.children ;
			if( arr.length !=0 ){
				for ( var i=0,j=arr.length ; i<j ; i++ ) {
					var child = render( arr[i] ); //递归
				}
			};
		};
		render=null ;
	}


	Object.defineProperty( componentMaker.prototype , 's' , {
		get:function(){
			this.setState();
		}
	})


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

	// 收集事件 ;
	(function(){
		var its  = [] ; window.i = its ;
		var cbs  = [] ; window.c = cbs ;
		var vals = [] ; window.v = vals ;
		componentMaker.prototype.EmitArr=function( it , cb , val ){
			its.push(it)   ;
			cbs.push(cb)   ;
			vals.push(val) ;
		} 	 
		componentMaker.prototype.EmitGO=function(){

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

}( Com ));
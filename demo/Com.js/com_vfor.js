
// !!!*****!!! v-bind:style 对象语法 ;;;
// !!!*****!!! v-bind:class 数组语法 , 或者字符串语法 ;;;

// 需要转译的
// , . * ? $ ^ | \/ ( ) { } [] ;

// [`~!@#$^&*()=|{};:'".,[\]./?~@#&*{}]

// \s空 \S !空 
// \n 换行 \r 回车 \0 空字符 \t 缩进
// \w = [a-zA-Z0-9_]
// \d = [0-9]

// *** 不支持key绑定 ; 排序不可识别 ;

// \b 单词边界 \B非单词边界 
// \t 缩进符
// (\r|\n) 换行符
 
// {n,}最少n次
// 禁止贪婪模式 必须有量词 ,例如 .*? .{3,6}?  --- 量词后面加?
// 反向引用    必须有分组 ,例如 2016-11-22  str.replace(/(\d*)-(\d*)-(\d*)/,"$2/$3/$1")
// 忽略选组    必须有组  , (?:\d{3})
// 前瞻断言   'a2*3'.replace(/\w(?=\d)/,'X') --- X2*3  'a2*3'.replace(/\w(?!\d)/,'X') --- aX*3 ; 


(function(c){

	// 查找带有 v-for的元素 进行分组 ;
	c.FIND_vforScopedWrapper = function( tags ){
		var after_tags = []; // 处理后的tags ;
		var vforInfo = [];   // 发现作用域储存在数组 ;
		
		var isRootVF = false ; // 是否是vfor跟节点 ;
		var len = 0 ;  // 层级计数器 ;
		var notEndTag = /<(?!\/).*>/ ; // 不是结尾标签

		var vforScopedWrapper = '';
		
		for(var i=0 ; i<tags.length ; i++){
			var each = tags[i];
			// 标签包括 v-for && 计数器==0 ;(防止v-for嵌套干扰!) ;
			if( each.includes('v-for')==true && len==0 ){
				isRootVF=true ;
				vforScopedWrapper={
			  		id: c.onlyId() ,
				  	tagName:'section' ,
					children:[],
					text:'',
					double:{},
					class:[{value:'vforScopedWrapper'}], style:[], prop:[], attr:[], 
				}
				after_tags.push( vforScopedWrapper );
				vforInfo.push({
					vforScopedWrapper:vforScopedWrapper ,
					tags:[]
				})
			}

			// 操作
			if( isRootVF ){
				// 是 vfor作用域最外层 ;
				if( notEndTag.test(each) ){
					// 开始标签 计数器++ ;
					len++ ;
				}else {
					// 结束标签 计数器-- ;
					len-- ;
				}
				// ** 计数器归零时 停止 ;
				if( len===0 ){
					vforScopedWrapper='';
					after_tags.push('</overVforScoped>')
					isRootVF = false ;
				}
				vforInfo[ vforInfo.length-1 ].tags.push(each);
			}else{
				// 不是 vfor作用域最外层 ;
				after_tags.push( each );
			}
		};

		// 返回结果 ;
		return {
			after_tags : after_tags ,
			vforInfo : vforInfo
		};
	}

	var vforMaker = c.vforMaker = function( info , option ){

		var tags = info.tags ;
		// 处理tags 存在v-for外层包裹一个标签 ;
			tags = this.wrap_vfor( tags );
		// 初级结构树( v-for还没有克隆 )
		var simpleTree = this.make_simpleTree( tags );  
		/*
************************************************************************************************************************
			双递归解析 完善树结构 (作用域默认为空);
		 */ 
		var data = option.data ;
		var readyTree =  this.RENDER_one_vforScope( simpleTree , {} , data);
		
		// 添加到对应父级 ;
		info.vforScopedWrapper.children.push(readyTree);
	}	

	/*
		***双递归解析1
			读取一个作用域 , 查找v-for , 找到交给--->RENDER_vforScopeMaker 制作*vfor镜像元素;
	 */
	vforMaker.prototype.RENDER_one_vforScope = function( tree , resolution , data ) { 
		// tree 变 vnode ;
		tree = this.makeOneVforNode( tree , resolution , data );

		if( tree.vfor_children ){ 
			// 存在vfor 解析模板 ;
			this.RENDER_vforScopeMaker( tree , resolution , data );
		}else{ 
			// 正常标签递归自身 , 生成vnode ;
			var children = tree.children ;
			for( var i=0,j=children.length ; i<j ; i++ ){
				this.RENDER_one_vforScope( children[i] , resolution , data );
			};
		}
		return tree ;
	};

	/*
		***双递归解析2
			解析*vfor镜像元素 , 解析完成调用RENDER_one_vforScope , 查找是否内部还存在vfor ;
	 */
	vforMaker.prototype.RENDER_vforScopeMaker = function( tree , resolution , data ){  
		// 数据源 ;
		var Data = data ;
		// 参照第一个子元素克隆(镜像元素) ;
		var vfor_children = tree.vfor_children[0] ; 

		// *** 解析 v-for="( item , index ) in items ;
		var vkitems = vfor_children.tagName.match(/v-for="\s*\(\s*([\w-]+)\s*,\s*([\w-]+)\s*\)\s+in\s+([\w-\.\[\]]+)\s*"/) ;

		var __item__  = vkitems[1] ;  
		var __index__ = vkitems[2] ; 
		var __ITEMS__ = vkitems[3] ;

		// ***** 处理特殊字符( [] . );
		__ITEMS__ = this.replaceResKey( resolution , __ITEMS__).data_key ;

		// *** 便利的数组 ;
		var ARRAY ; 
			// 作用域中 存在!!!
			try{
				if( eval('resolution.'+__ITEMS__) ){
					// 作用域存在 从作用域中取
					ARRAY = eval('Data.'+resolution[__ITEMS__]);
				}
			}catch(e){};
			// 作用域中 不存在 , 在组件中找 !!! ;
			if(!ARRAY){
				try{
					// *** 添加到作用域 ;;;
					resolution[__ITEMS__] = __ITEMS__ ;

					ARRAY = eval('Data.'+resolution[__ITEMS__]);
				}catch(e){};
			}
			// 解析失败 
			if( !ARRAY ){
				console.warn('作用域解析失败 数组置为 []')
				ARRAY = [] ;
			};

			// 在此处添加 响应vfor变化的信息 ;
			tree.readAgain_vfor_info = { 
				data : data ,
				data_key : resolution[__ITEMS__] ,
				resolution : resolution 
			};

			// ******************* 便利v-for ****************************
			if( c.type(ARRAY)=='Array' ){
			   for( var i=0,j=ARRAY.length; i<j ;i++ ){
					var v = ARRAY[i] 
					var k = i ;
					// 新作用域( 增加键值对 ) ;
					var new_resolution = c.clone( resolution ) ;
						// *** 添加到作用域
						new_resolution[ __item__ ]  = new_resolution[ __ITEMS__ ]+'["'+i+'"]' ;
						new_resolution[ __index__ ] = '#'+i+'#' ; 

					// *** 参照镜像元素克隆 ;
					var new_vfor_children = c.clone( vfor_children ) ;
					// add
					tree.children.push( new_vfor_children );
					// 处理代码块
					this.RENDER_one_vforScope( new_vfor_children , new_resolution , data );
				}
			}else{
				alert('v-for暂时不支持非数组便利,需要便利对象可以构造成数组')
			}
		return tree ;
	} 

	/*
		制作一个vfor状态 vnode ;
	 */
	vforMaker.prototype.makeOneVforNode = function( vnode , resolution , data ){ 
		// 数据源
		var Data = data ;
		// 开始标签
		var startTag = vnode.tagName ;
		// 赋值 ;
			vnode.id      = c.onlyId() ;
			vnode.tagName = startTag.match(/<([\w-]+).*>/)[1] ;
			vnode.class   = vnode.class || [] ;
			vnode.style   = [] ;
			vnode.prop    = [] ;
			vnode.attr    = [] ;
			vnode.double  = {} ;
			vnode.text    = '' ;
			vnode.DOM     = '' ;
		/*
			*** 处理 v-on 
			*** 如果 v-on 事件需要传值 , 添加v-bind 到attr上 , 元素改变attr会自动变化 , 触发事件时再从标签上获取attr的新值 ; 
		*/ 
		if( startTag.includes('v-on') ){
			var save_vonkey = {} ;

			startTag.match(/v-on:[^\s\/]+="(.*?)"+/g).map(function( method ){
				var evt_arr = method.match(/v-on:(\w+)="(.*)"/) ;
				var evt_key = evt_arr[1] ;
				var evt_value = evt_arr[2] ;
				// 事件是 v-on:click="name(val1,val2)" 
				if( evt_value.includes('(') ){

					var agmts = evt_value.match(/\((.*)\)/)[1]
					agmts.split(',').map(function( one ){
						one = one.trim();
						// 过滤重复替换 ;
						if( !save_vonkey[one] ){
							save_vonkey[one] = one ;
							startTag = startTag.replace('>',' v-bind:V_ON_keyNameIs_'+one+'="'+one+'" >')
						}
					})
				}
				// 事件是 v-on:click="name" 
				else{ }					
			})
		}

		// 所有的属性 ;
		var all = startTag.match(/[^\s\/]+="(.*?)"+/g) ;

		// 没属性直接返回
		if(!all){ return vnode };

		// 有属性的处理 ;
		var replaceResKey = this.replaceResKey ;
		all.map(function( each ){
			// *** 每一个属性 ;
			var each = each ;

			// 含有v-bind 属性 ;
			if( each.includes('v-bind') ){
	 			var vk = each.match(/v-bind:([\w\.]+)="(.*)"/);
				var key   = vk[1].trim() ; // 绑定种类
				var value = vk[2];		   // 绑定值

				// 文字
				if( key =='V_TEXT' ){
					vnode.text = value ; 
				}
				// {{}}
				else if( key=='V_DOUBLE' ){

					value = value.trim() ;
					var dom_key  = '' ;
					var data_key = value ;
					var vvv , hasForKey ,forKey;

					var RepDataKeyObject = replaceResKey( resolution , data_key ) ;
						data_key  = RepDataKeyObject.data_key  ;
						hasForKey = RepDataKeyObject.hasForKey ;
						forKey   = RepDataKeyObject.forKey   ;
						
						if(forKey){ 
							vvv = forKey 
						}else{
							vvv = eval('Data.'+data_key) ;
						}

					var obj = {
						dom_key:dom_key,
						data_key:data_key,
						value:vvv
					};
					if( hasForKey ){
						delete obj.data_key ;
					}
					vnode.double = obj ; 
				}
				// calss
				else if(key=="class"){
					value[0]=="["?value=value.match(/\[(.*)\]/)[1]:null;

					// class为 数组 !!! (不支持对象);
					value.match(/[^\,]+/g).map(function(v,k){
						
						var dom_key  = '' ;
						var data_key = v  ;	
						var vvv , hasForKey ,forKey;

						var RepDataKeyObject = replaceResKey( resolution , data_key ) ;
							data_key  = RepDataKeyObject.data_key  ;
							hasForKey = RepDataKeyObject.hasForKey ;
							forKey   = RepDataKeyObject.forKey   ;
							
							if(forKey){ 
								vvv = forKey 
							}else{
								vvv = eval('Data.'+data_key) ;
							}	

						typeof vvv == 'number'? vvv=vvv.toString() : null ; 

						var obj = {
							dom_key:dom_key,
							data_key:data_key,
							value:vvv
						};
						if( hasForKey ){
							delete obj.data_key ;
						}
						vnode.class.push(obj) ;
					})
				}
				// style
				else if( key=='style' ){
					value.match(/[^\{\,]+:[^\}\,]+/g).map(function(v,k){

						var v_k = v.match(/(.*):(.*)/) ;
						var dom_key  = v_k[1] ;
						var data_key = v_k[2] ;
						var vvv , hasForKey ,forKey;

						var RepDataKeyObject = replaceResKey( resolution , data_key ) ;
							data_key  = RepDataKeyObject.data_key  ;
							hasForKey = RepDataKeyObject.hasForKey ;
							forKey   = RepDataKeyObject.forKey   ;
							
							if(forKey){ 
								vvv = forKey 
							}else{
								vvv = eval('Data.'+data_key) ;
							} 

						var obj = {
							dom_key:dom_key,
							data_key:data_key,
							value:vvv
						};
						if( hasForKey ){
							delete obj.data_key ;
						}
						vnode.style.push(obj)
					})
				}
				// prop
				else if( key=='id'||key=='src'||key=='placeholder'||key=='value'||key=='selected'||key=='disabled' ){

					var dom_key  = key ;
					var data_key = value ;
					var vvv , hasForKey ,forKey;

					var RepDataKeyObject = replaceResKey( resolution , data_key ) ;
						data_key  = RepDataKeyObject.data_key  ;
						hasForKey = RepDataKeyObject.hasForKey ;
						forKey   = RepDataKeyObject.forKey   ;
						
						if(forKey){ 
							vvv = forKey 
						}else{
							vvv = eval('Data.'+data_key) ;
						}

					var obj = {
						dom_key:dom_key,
						data_key:data_key,
						value:vvv
					};
					if( hasForKey ){
						delete obj.data_key ;
					}
					vnode.prop.push(obj)
				}
				// attr 
				else{
					var dom_key  = key ;
					var data_key = value ;
					var vvv , hasForKey ,forKey;

					var RepDataKeyObject = replaceResKey( resolution , data_key ) ;
						data_key  = RepDataKeyObject.data_key  ;
						hasForKey = RepDataKeyObject.hasForKey ;
						forKey   = RepDataKeyObject.forKey   ;
						
						if(forKey){ 
							vvv = forKey 
						}else{
							vvv = eval('Data.'+data_key) ;
						} 

					var obj = {
						dom_key:dom_key,
						data_key:data_key,
						value:vvv
					};
					if( hasForKey ){
						delete obj.data_key ;
					}
				
					vnode.attr.push(obj)
				}	

			}else{
			// 正常属性
			    var it = each.match(/(.*)=["](.*)["]/)
			    var k = it[1];
			    var v = it[2];

			    if( k=='class' ){
			    	var obj = { value:v } ;
			    	vnode.class.push(obj)
			    } else if(k=="style"){
			    	// 替换font-size 为 fontSize ;;
			    	v=v.replace(/(-)(\w)/g,function($2){return $2.toLocaleUpperCase()}) ;
			    	v=v.replace(/-/g,'')

				    v.match(/(\w+):([^;]+)/g).map(function(v,k){
			    		var sty = v.match(/(\w+):([^;]+)/) ;
			    		var k_ = sty[1];
			    		var v_ = sty[2];
			    		var obj = {
			    			dom_key:k_,
			    			value:v_
			    		};
			    		vnode.style.push(obj)
			    	})
			    }else if( k=='id'||k=='src'||k=='placeholder'||k=='value'||k=='selected'||k=='disabled' ){
			    	var obj = {
			    		dom_key:k,
			    		value:v
			    	}
			    	vnode.prop.push(obj)
			    } else{
			    	var obj = {
			    		dom_key:k,
			    		value:v
			    	}
			    	vnode.attr.push(obj)
			    }
			}
		});

		return vnode ;
	}
	

	// 存在v-for外层包裹一个标签 , 目的是把循环后的变迁加入到其中 ;
	vforMaker.prototype.wrap_vfor = function( tags ){

		// 指针( 计算层级计数器 );
		var len = 0 ;			// 开始标签 len++ ; 每一个结束标签 len-- ;
		var len_arr = [] ;		// 标签含有 v-for 层级数组.push(层级) ; 当层级==层级数组最后一位嵌套结束 ;
		var notEndTag = /<(?!\/).*>/ ;   // 不是结尾标签

		// 处理后的标签数组 ;
		var wrap_tags = [] ;			
		for(var m=0,n=tags.length ;m<n; m++){
			// 每个标签 ;
			var tag = tags[m];

			if( notEndTag.test(tag) ){
			// 开始标签
				// 含有 v-for的 特殊处理 ;;;
				if( tag.includes('v-for') ){
					wrap_tags.push( {
						// 镜像儿子数组 ,
						vfor_children:[] ,
							class:[{ value:'vfor_begin' }],
							tagName:'<article>',
							children:[] 
					}); 
					wrap_tags.push( {
						tagName:tag ,
						children:[]
					}); 

						len_arr.push(len); // 层级数组 add ;
				}else{
					wrap_tags.push( {
						tagName:tag,
						children:[]
					});
				}

				len++ ; // 计数器++
			}else{
			// 结尾标签 ;
				len-- ; // 计数器--

				if( len==len_arr[len_arr.length-1] ){
					wrap_tags.push( 'over' ) ;
					wrap_tags.push( 'over');

						len_arr.pop() ;    // 层级数组 del ;
				}else{
					wrap_tags.push( 'over' ) ;
				}
			}
		}

		return wrap_tags ;
	};

	// 树结构骨架---初级树 , v-for还没有克隆 ;
	vforMaker.prototype.make_simpleTree = function( tags ){
		// 指针 ;
		var activeArr = [{ tagName:'$ROOT',children:[] }] ;
		var active = activeArr[ activeArr.length-1 ] ;

		for( var i=0 ; i<tags.length ; i++ ){
			var each = tags[i] ;
			if( each != 'over'){
				// 操作
				active.children.push(each);
				// 指针add 
				activeArr.push(each);
				// 改变指针
				active = activeArr[activeArr.length-1];	
			}else{
				// 指针del
				activeArr.pop();
				// 改变指针
				active = activeArr[activeArr.length-1];
			}
			// **控制** vfor_children 和 children ; 
			if( i>0 && tags[i-1].vfor_children ){
				tags[i-1].vfor_children[0] = tags[i-1].children.pop();
			};	
		}
		
		return active.children[0];
	};

/*
	解析 dataKey(存在限制);
		1 只解析 v-for="( v,k ) in items" ;
		2 只能兼容{
			otherItems[k]
			otherItems[v.name]
			otherItmes[v.name][k] 
		} 
		3 不支持 otherItems[v[k]] --> [[]]嵌套
 */
	vforMaker.prototype.replaceResKey = function( resolution , data_key ){ 
		var hasForKey = false ;
		var forKey ;

		// ** 存在 [] 全替换 ;
		var arr = data_key.match(/\[(.*?)\]/g) ;
		if(arr){
			arr.map(function(each){
				var pass = false ;
				each = each.match(/\[(.*)\]/)[1]; 

				if( /['"]/.test(each) || isNaN( Number(each) )==false ){
					pass = true ;
				}
				var it ;
				// []中 存在.
				if( /\./.test(each) ){
					it = each.split('.')[0] ;
				}
				// []中不存在.
				else{
					it = each ;
				}
				// 如果作用域中存在
				var val = resolution[it] ;
				if( val ){
					var repIt ;
					// v-for 的 key 特殊处理 ;
					if( val.includes('#') ){
						val = val.split('#')[1] ; 
						repIt = '['+val ;
					}else{
						repIt = '[Data.'+val ;
					}

					data_key = eval( 'data_key.replace(/\\['+it+'/,\''+repIt+'\')') ;
				}
				// 作用域不存在 ; 需要加上Data前缀 ;
				else{
					// 静态属性 ;
					if(pass){
						var repIt = '['+it ;
					}
					// 动态属性
					else{
						var repIt = '[Data.'+it ;
					}
					data_key = eval( 'data_key.replace(/\\['+it+'/,\''+repIt+'\')') ;
				};
			})
		}

		// 替换头部 ;
		(function(){
			// 首先截取掉 [] ;
			var it ;
			var has_dot = false ;

			var each = data_key.split('[')[0] ;
			// 存在.
			if( /\./.test(each) ){
				it = each.split('.')[0] ;
				has_dot = true ;
			}
			// 不存在.
			else{
				it = each ;
			}

			// 如果作用域中存在
			var val = resolution[it] ;
			if( val ){
				var repIt ;
				// v-for 的 key 特殊处理 ;
				if( val.includes('#') ){
					val = val.split('#')[1];
					hasForKey = true ;
				}
				if(has_dot){
					repIt = val+'.';
					data_key = eval( 'data_key.replace(/'+it+'\\./,\''+repIt+'\')') ;
				}else{
					repIt = val ;
					data_key = eval( 'data_key.replace(/'+it+'/,\''+repIt+'\')') ;
					// ** 直接输出key
					if( hasForKey ){
						forKey = eval( 'data_key.replace(/'+it+'/,\''+repIt+'\')');
					}
				}
			};
		}())
		
		return {
			data_key:data_key , 
			hasForKey:hasForKey,
			forKey:forKey
		};
	}

	c.readAgain_vfor = function( tree , resolution , data ){
		tree.children = [] ;
		return c.vforMaker.prototype.RENDER_vforScopeMaker( tree , resolution , data ); 
	};

}( Com ));
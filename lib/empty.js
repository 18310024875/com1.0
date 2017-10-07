<template>
	<div 
		v-bind:class="[c1,c2,obj.class]"
		v-bind:ok="width_" 
		v-bind:ok1="width_" 
		v-bind:ok2="width_" 
		v-bind:attrddd="ddd"
		v-bind:attrddd2="ddd"
		v-bind:id="items.b.name"
		v-bind:ididid="arr[2]"
		v-bind:iiiiiiid="arr[1]"
		v-bind:style="{width:fff[0].wid,height:height_,background:background}"
		style="font-size:20px" 
		class="ppp" 
	>
		<template>
			<ul v-for="(v,k) in arr" kv-bind:key="k">
			sadasd
				{{v}}
				<h1>111</h1>
			</ul>
		</template>

		<template>
			<ul v-for="(v,k) in items" 
				v-bind:keykkk="k" 
				v-bind:style="{width:width2_,background:bac}"
				style="line-height:30px" 
			>
				<h3 v-for="(v2,k2) in v" v-bind:style="background:bac2">
					{{k2}} = {{v2}}
					外层 {{width_}}

					<h6 v-for="(v3,k3) in items.b" v-bind:style="background:bac3">
						{{k3}} = {{v3}}
					</h6>
				</h3>
				<div style="background:red">{{v.name}}是啊</div>
			</ul>
		</template>
	</div>
</template>




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


window.doVFOR={}

// ------------------------------------------------------------------------------------
// 处理 vfor
window.doVFOR.readVF = function( tpl , exoprt_options ,each_forW ){ 

		var tpl = tpl.match(/<template>(.*)<\/template>/)[1] ;

	// ****************************************** 制作树 **************************************🌲

		var len = 0 ;			// 每一个 开始标签 len++ ; 每一个结束标签 len-- ;
		var len_arr = [] ;		// 每一个 v-for len-arr.push( len );  ( 到结束标签时候 同意判断 ) ;
		var notEndTag = /<(?!\/).*>/ ;  //不是结尾标签
		var arr = tpl.match(/<.*?>/g) ; // 所有标签 ;
		
		var ARR = [] ;			// 处理后的标签数组 ;

		if(arr.length==0){console.error('没有解析完成 template');return};
		for(var m=0,n=arr.length;m<n;m++){
			// 每个标签 ;
			var each = arr[m];

			if( notEndTag.test(each) ){
			// ** 开始标签 ;
				// 含有 v-for的 特殊处理 ;;;
				if( each.includes('v-for') ){
					ARR.push( {
						tagName:'<VF_begin>',
						VF_Children:[],
						CHILDREN:[], // 真正的代替 VF_Children的数组 最后CHILDREN被children替换 ;
					}) ; 
					ARR.push( {
						tagName:each ,
						children:[]
					}) ; 

						len_arr.push(len); // 计算 ;;;
				}else{
					ARR.push( {
						tagName:each,
						children:[]
					}) ;
				}

				len++ ;

			}else{
			// ** 结尾标签 ;
				len-- ;

				if( len==len_arr[len_arr.length-1] ){
					ARR.push( 'over' ) ;
					ARR.push( 'over');

						len_arr.pop() ; // 计算 ;;;
				}else{
					ARR.push( 'over' ) ;
				}
			}
		} //for over ;;;

	// **********************************************
	// 整理格式 初级树 🌲 ;;;
	var VF_tree ;
	(function(){
		var realPush_Arr = [] ; // 用来储存对象 ( 为了push到children );
		var push = null ;   // 真正的push元素 ;  
		var isVFbegin ;//是否是 v-for的wrapper ;;;
		for ( var i=0,j=ARR.length ; i<j ; i++) {//log(realPush_Arr);
			// 每个 未处理的 vnode ;
			var each = ARR[i] ;

			if( each != 'over'){
			// 开始标签
				if( i==0 ){ 
					// *** 组件跟标签
					realPush_Arr[0] = each ;
				}else{
					// *** 限定 ;;;
					ARR[i-1].tagName=='<VF_begin>'?isVFbegin=true:null;

					push = realPush_Arr[realPush_Arr.length-1] ; //最后一位 ( 真正要添加到children的vnode );
					if( isVFbegin ){
						push.VF_Children.push(each) ;
						isVFbegin=false ;
					}else{
						push.children.push(each) ;
					}
				  // !!!!!! 推向下一个 vnode ;
					realPush_Arr.push( each )
				}	
			}else{
			// 结束标签
				i!=j-1?realPush_Arr.pop():null; // 把 处理完的 vnode 移除数组( 最后一位不移除 );
			}
		} ;
		VF_tree = realPush_Arr.pop() ;
	}());
	

//  ********************************************************
//  编译 v-for 代码块!!! ( 解决v-for嵌套问题 );

	//数据源 ;
	var Data = exoprt_options.data ; 
	// 作用域 !!!!!!! ;
	var RESOLUTION={}; 

	MAKE_VF_SCOPE( VF_tree, RESOLUTION ); 

	// 加入到对应 wrapper ( template 生成的 section标签 ) ;
	each_forW.children.push(VF_tree) ;

	// *** 查找 <VF_start> , 制作代码块  !!!
	function MAKE_VF_SCOPE( tree , resolution  ){  // 第一次默认执行!   

		if(!tree.VF_Children){console.error('v-for items must be a Object or Array');return } ; 

		// *** 默认第一次解析 只有一个子元素( tagName带有v-for ) ;
		var vf_child = tree.VF_Children[0] ; 

		// *** 解析 v-for="( item index ) in items ;
		var vkitems = vf_child.tagName.match(/v-for="\s*\(\s*([\w-]+)\s*,\s*([\w-]+)\s*\)\s+in\s+([\w-\.\[\]]+)\s*"/) ;

		var __item__  = vkitems[1] ;  // 在作用域拼接'['+...+']' ;
		var __index__ = vkitems[2] ;  // index 在作用域用 #...#包裹 ;
		var __ITEMS__ = vkitems[3] ;

		// *** 赋值运算 !!!!
		var dataKey = __ITEMS__ ; //数据键 ;
		var ArrObj ; //值
		// 作用域中 存在!!!
		try{
			if( eval('resolution.'+dataKey) ){
				// 作用域存在 从作用域中取
				ArrObj = eval('Data.'+resolution[__ITEMS__]);
			}
		}catch(e){};
		// 作用域中 不存在 , 在组件中找 !!! ;
		if(!ArrObj){
			try{
				// *** 添加到作用域 ;;;
				resolution[__ITEMS__] = __ITEMS__ ;

				ArrObj = eval('Data.'+resolution[__ITEMS__]);
			}catch(e){};
		}
		!ArrObj?console.error('作用域解析失败'):null;

		// 在此处添加 VFOR_template 绑定的 数组|对象 ;
		// 把模板添加到父级元素 acticle 对比的时候 可以相应数组的变化 ;;;
		(function(){
			var arr_obj_len = Object.keys( ArrObj ).length ;
			tree.VFOR_template = {
				data_key:resolution[__ITEMS__],
				length:arr_obj_len,
				clone_VF_tree:tool.deepClone(tree)
			}
		}())

		// *** v-for 外壳 acticle ( VF_begin 替换成 acticle 标签)
		tree.tagName='acticle' ; tree.children=[] ;
	  	tree.id = tool.onlyId() ;
		tree.class = [{ value:'VF_begin' }] ;
		tree.style = [] ;
		tree.prop  = [] ;
		tree.attr  = [] ;
		tree.double = {} ;
		tree.text   = '' ;
		tree.DOM = '';

		// 便利的对象 ;
		if( typeof ArrObj =='object' ){
				// Array
				if(ArrObj instanceof Array){
					for( var i=0,j=ArrObj.length; i<j ;i++ ){
						var v = ArrObj[i] ;//每一项;
						var k = i ; //index

						// 新作用域( 增加键值对 ) ;
						var new_resolution = tool.deepClone( resolution ) ;

							// *** 添加到作用域
							new_resolution[ __item__ ]  = new_resolution[ __ITEMS__ ] +'["'+i+'"]'
							new_resolution[ __index__ ] = '#'+i+'#' ; 

						// 新元素
						var new_vfchild = tool.deepClone( vf_child ) ;
						// add
						tree.CHILDREN.push( new_vfchild )
						// 处理代码块
						one_VFSCOPE( new_vfchild, new_resolution ) ;
					}
					// 全部添加完 替换 ;
					tree.children=tree.CHILDREN ;
					delete tree.VF_Children ;
					delete tree.CHILDREN ;
				} 
				// object
				else{
					for( var each in ArrObj ){
						var v = ArrObj[each] ;//每一项;
						var k = each ; //index

						// 新作用域( 增加键值对 ) ;
						var new_resolution = tool.deepClone( resolution );

							// *** 添加到作用域
							new_resolution[ __item__ ]  = new_resolution[ __ITEMS__ ] +'["'+each+'"]'
							new_resolution[ __index__ ] = '#'+each+'#' ; 
							//log(new_resolution) 

						// 新元素
						var new_vfchild = tool.deepClone( vf_child ) ;
						//add
						tree.CHILDREN.push( new_vfchild )
						// 处理代码块
						one_VFSCOPE( new_vfchild, new_resolution ) ;
					}
					// 全部添加完 替换 ;
					tree.children=tree.CHILDREN ;
					delete tree.VF_Children ;
					delete tree.CHILDREN ;
				}
		}

	} // MAKE_VF_SCOPE over ;;

	// 处理每一个代码块 !!! ;
	function one_VFSCOPE ( tree , resolution ) {

		if(!tree.children){console.error('no children init');return };

		var tag=tree.tagName ;

		// 改变 tree ;
		make_a_VFNode( tree , tag , resolution  ) ;

		var children = tree.children ;

		if( children.length!=0 ){
			for(var i=0,j=children.length;i<j;i++){
				// 如果存在V-For嵌套 ; 返回 MAKE_VF_SCOPE函数 ;;;
				if(children[i].VF_Children){
					MAKE_VF_SCOPE( children[i] , resolution );
				}else{
					arguments.callee( children[i] , resolution );			
				}
			}
		}
	} // one_VFSCOPE over ;;;

	// 制作一个 VFN
	function make_a_VFNode( tree , startTag , resolution ){

		var only_id = tool.onlyId() ;
		var tagName = startTag.match(/<([\w-]+).*>/)[1] ;
	  		tree.id = only_id ;
		  	tree.tagName = tagName ;
			tree.class = [] ;
			tree.style = [] ;
			tree.prop  = [] ;
			tree.attr  = [] ;
			tree.double = {} ;
			tree.text   = '' ;
			tree.DOM = '';
		
		var VNode = tree ;

		exoprt_options.All_Vnodes[only_id] = VNode ;


		// 所有的属性 ;
		var all = startTag.match(/[^\s\/]+="(.*?)"+/g) ;

		// 没属性直接返回
		if(!all){ return VNode };

		// 有属性的处理 ;
		all.map(function( each ){
			// *** 每一个属性 ;
			var each = each ;

			// 含有v-bind 属性 ;
			if( each.includes('v-bind') ){

	 			var vk = each.match(/v-bind:(\w+)="(.*)"/);
				var key   = vk[1].trim() ; // 绑定种类
				var value = vk[2];		   // 绑定值

				// ***** 
				// 文字
				if( key =='vTEXT' ){
					VNode.text = value ; 
				}
				// *****
				// {{}}
				else if( key=='vDOUBLE' ){

					value = value.trim() ;

					var dom_key  = '' ;
					var data_key = value ;
					var hasForKey = false ;
					var vvv ;

					// 先从Data中找 ;
					try{
						vvv=eval('Data.'+data_key)
					}catch(e){} ;
					// data 中不存在再从作用域中查找
					if( !vvv ){
						// 处理data_key 中存在 . [] 的情况 ;
						if( /[\[\.]/.test(data_key) ){
							var arr = data_key.match(/([^\.\[])(.*)/) ;
							var arr_head = arr[1] ;
							var arr_main = arr[2] ;
							data_key = resolution[arr_head]+arr_main
						}else{
							data_key = resolution[data_key] ;
						}
						// 处理 vfor 中的索引 ;
						if( data_key.indexOf('#')!=-1 ){
							hasForKey = true ;
							vvv = data_key.split('#')[1]
						}else{
							vvv=eval('Data.'+data_key)	
						}
					}	 

					var obj = {
						dom_key:dom_key,
						data_key:data_key,
						value:vvv
					};
					if( hasForKey ){
						delete obj.data_key ;
					}
					VNode.double = obj ; 
				}
				// ***** 
				// 属性
				else if(key=="class"){
					value[0]=="["?value=value.match(/\[(.*)\]/)[1]:null;

					// class为 数组 !!! (不支持对象);
					value.match(/[^\,]+/g).map(function(v,k){
						
						var dom_key  = '' ;
						var data_key = v  ;	
						var hasForKey = false ;
						var vvv ;

						// 先从Data中找 ;
						try{
							vvv=eval('Data.'+data_key)
						}catch(e){} ;
						// data 中不存在再从作用域中查找
						if( !vvv ){
							// 处理data_key 中存在 . [] 的情况 ;
							if( /[\[\.]/.test(data_key) ){
								var arr = data_key.match(/([^\.\[])(.*)/) ;
								var arr_head = arr[1] ;
								var arr_main = arr[2] ;
								data_key = resolution[arr_head]+arr_main
							}else{
								data_key = resolution[data_key] ;
							}
							// 处理 vfor 中的索引 ;
							if( data_key.indexOf('#')!=-1 ){
								hasForKey = true ;
								vvv = data_key.split('#')[1]
							}else{
								vvv=eval('Data.'+data_key)	
							}
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
						VNode.class.push(obj) ;
					})
				}
				else if( key=='style' ){
					value.match(/[^\{\,]+:[^\}\,]+/g).map(function(v,k){

						var v_k = v.match(/(.*):(.*)/) ;
						var dom_key  = v_k[1] ;
						var data_key = v_k[2] ;
						var hasForKey = false ;
						var vvv ;

						// 先从Data中找 ;
						try{
							vvv=eval('Data.'+data_key)
						}catch(e){} ;
						// data 中不存在再从作用域中查找
						if( !vvv ){
							// 处理data_key 中存在 . [] 的情况 ;
							if( /[\[\.]/.test(data_key) ){
								var arr = data_key.match(/([^\.\[])(.*)/) ;
								var arr_head = arr[1] ;
								var arr_main = arr[2] ;
								data_key = resolution[arr_head]+arr_main
							}else{
								data_key = resolution[data_key] ;
							}
							// 处理 vfor 中的索引 ;
							if( data_key.indexOf('#')!=-1 ){
								hasForKey = true ;
								vvv = data_key.split('#')[1]
							}else{
								vvv=eval('Data.'+data_key)	
							}
						}	 

						var obj = {
							dom_key:dom_key,
							data_key:data_key,
							value:vvv
						};
						if( hasForKey ){
							delete obj.data_key ;
						}
						VNode.style.push(obj)
					})
				}
				else if( key=='id'||key=='src'||key=='placeholder'||key=='value'||key=='selected'||key=='disabled' ){

					var dom_key  = key ;
					var data_key = value ;
					var hasForKey = false ;
					var vvv ;

					// 先从Data中找 ;
					try{
						vvv=eval('Data.'+data_key)
					}catch(e){} ;
					// data 中不存在再从作用域中查找
					if( !vvv ){
						// 处理data_key 中存在 . [] 的情况 ;
						if( /[\[\.]/.test(data_key) ){
							var arr = data_key.match(/([^\.\[])(.*)/) ;
							var arr_head = arr[1] ;
							var arr_main = arr[2] ;
							data_key = resolution[arr_head]+arr_main
						}else{
							data_key = resolution[data_key] ;
						}
						// 处理 vfor 中的索引 ;
						if( data_key.indexOf('#')!=-1 ){
							hasForKey = true ;
							vvv = data_key.split('#')[1]
						}else{
							vvv=eval('Data.'+data_key)	
						}
					}	 

					var obj = {
						dom_key:dom_key,
						data_key:data_key,
						value:vvv
					};
					if( hasForKey ){
						delete obj.data_key ;
					}
					VNode.prop.push(obj)
				}
				else{

					var dom_key  = key ;
					var data_key = value ;
					var hasForKey = false ;
					var vvv ;

					// 先从Data中找 ;
					try{
						vvv=eval('Data.'+data_key)
					}catch(e){} ;
					// data 中不存在再从作用域中查找
					if( !vvv ){
						// 处理data_key 中存在 . [] 的情况 ;
						if( /[\[\.]/.test(data_key) ){
							var arr = data_key.match(/([^\.\[])(.*)/) ;
							var arr_head = arr[1] ;
							var arr_main = arr[2] ;
							data_key = resolution[arr_head]+arr_main
						}else{
							data_key = resolution[data_key] ;
						}
						// 处理 vfor 中的索引 ;
						if( data_key.indexOf('#')!=-1 ){
							hasForKey = true ;
							vvv = data_key.split('#')[1]
						}else{
							vvv=eval('Data.'+data_key)	
						}
					}	 

					var obj = {
						dom_key:dom_key,
						data_key:data_key,
						value:vvv
					};
					if( hasForKey ){
						delete obj.data_key ;
					}
					VNode.attr.push(obj)
				}	

			}else{
			// 正常属性
			    var it = each.match(/(.*)=["](.*)["]/)
			    var k = it[1];
			    var v = it[2];

			    if( k=='class' ){
			    	var obj = { value:v } ;
			    	VNode.class.push(obj)
			    }
			    else if(k=="style"){
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
			    		VNode.style.push(obj)
			    	})
			    }
			    else if( k=='id'||k=='src'||k=='placeholder'||k=='value'||k=='selected'||k=='disabled' ){
			    	var obj = {
			    		dom_key:k,
			    		value:v
			    	}
			    	VNode.prop.push(obj)
			    }
			    else{
			    	var obj = {
			    		dom_key:k,
			    		value:v
			    	}
			    	VNode.attr.push(obj)
			    }
			}// 正常属性 over ;;;
		})// 有属性的处理 over ;;;
	};	

	window.doVFOR.readAgainVF = function( tree , data ){
		Data = data
		RESOLUTION = {} ;
		MAKE_VF_SCOPE( tree , RESOLUTION ); 
		return tree ;
	};
}


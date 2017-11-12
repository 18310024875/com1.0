// !!!*****!!! v-bind:style 对象语法 ;;;
// !!!*****!!! v-bind:class 数组语法 , 或者字符串语法 ;;;

// 需要转译的
// , . * ? $ ^ | \/ ( ) { } [] ;

// [`~!@#$^&*()=|{};:'".,[\]./?~@#&*{}]

// \s空 \S !空 
// \n 换行 \r 回车 \0 空字符 \t 缩进
// \w = [a-zA-Z0-9_]
// \d = [0-9]

// \b 单词边界 \B非单词边界 
// \t 缩进符
// (\r|\n) 换行符
 
// {n,}最少n次
// 禁止贪婪模式 必须有量词 ,例如 .*? .{3,6}?  --- 量词后面加?
// 反向引用    必须有分组 ,例如 2016-11-22  str.replace(/(\d*)-(\d*)-(\d*)/,"$2/$3/$1")
// 忽略选组    必须有组  , (?:\d{3})
// 前瞻断言   'a2*3'.replace(/\w(?=\d)/,'X') --- X2*3  'a2*3'.replace(/\w(?!\d)/,'X') --- aX*3 ;


(function(){

	window.template={
		// 处理template
		readTPL:function( tpl, exoprt_options , callback ) {

			// 制作所有的 容器 ;;;;;;
			//exoprt_options.All_Vnodes = {} ;

		// (1) 把单标签 全部换成双标签 ;!!!
			tpl = tpl.replace(/\/>/g,'></aloneOver>') ;

		// (2) 替换 {{ key }} 为 <span class='v-double' > key </span> ;
			var double = tpl.match(/\{\{.*?\}\}/g) ;
			if( double ){
				double.map(function(v,k){
					var data_key = v.match(/\{\{(.*)\}\}/)[1];
					tpl = tpl.replace(/\{\{.*?\}\}/,'<font class="template_font" v-double" v-bind:vDOUBLE="'+data_key+'"></font>');
				});
			}

		// (3) 替换 标签内 文字
			tpl = tpl.replace(/>\s{1,}</g,'><');

			tpl = tpl.replace(/>([^<>]+?)</g,'><font class="template_font" v-bind:vTEXT="'+'$1'+'"></font><');
		// (3.5) 替换v-if
			tpl = tpl.replace(/v-if/g,'v-bind:vifkey');

		// ********* vFOR ********
		// (4) 把 v-for截取下来 , 其他继续
			var VFor_Tpl_Arr = tpl.match(/<template.*?>(.*?)<\/template>/g) ;
			tpl = tpl.replace(/<template.*?>.*?<\/template>/g,'<vForWrapper></vForWrapper>');

			var forWrap = [] ;
			exoprt_options.forWrap = forWrap ;

		// (5) template 转换成 VNodeTemplate ;(数组)
			var vnode_arr = this.make_VNode_Arr( tpl , exoprt_options ) ;

		// (6) 生成 VDOM 树 ;
			var VnodeTree = this.make_VnodeTree( vnode_arr , forWrap ) ;	
			exoprt_options.VnodeTree = VnodeTree ;

		// ********* vFOR ********
		// (7) 处理vfor函数 ; ( 必须等到生成dom树之后处理 ) ;
			if( VFor_Tpl_Arr ){
				for(var i=0;i<VFor_Tpl_Arr.length;i++){

					doVFOR.readVF( VFor_Tpl_Arr[i] , exoprt_options ,forWrap[i] )
				}				
			}
		// 7.5 如果存在 template 说明不是异步请求组件 不需要回调 ~!!
			if( exoprt_options.template ){
				delete exoprt_options.template ;
				return exoprt_options;
			}

		// (8) 调用回调函数 ;
			callback( exoprt_options )
		},

		// template格式 转换 VNodeTemplate格式 ;(数组)
		make_VNode_Arr:function(tpl,exoprt_options ){

			var vnode_arr = [] ; //所有的子组件都放进来 方便通过 i 查找 ;
			var arr = tpl.match(/<.*?>/g) ; // 所有标签 ;

			if(arr.length==0){console.error('没有解析完成 template');return};

			var isSingleTag = /<.*\/>/ ;    //单标签
			var notEndTag = /<(?!\/).*>/ ;  //不是结尾标签

			for(var i=0,j=arr.length;i<j;i++){
				// 每个标签 ;
				var each = arr[i];

				if( notEndTag.test(each) ){
				// ** 开始标签 ;

				  	var VNode = this.makeOneVNode(each,exoprt_options);
					vnode_arr.push( VNode ) ;
				}else{
				// ** 结尾标签 ;

					vnode_arr.push( 'over' ) ;
				}
			}

			return vnode_arr ;
		},

		// 制作一个 VNode ;
		makeOneVNode:function( startTag , exoprt_options ){

			var Data = exoprt_options.data ; //数据源 ;

			var only_id = tool.onlyId() ;
			var tagName = startTag.match(/<([\w-]+).*>/)[1] ;

		  	var VNode = {
		  		id: only_id ,
			  	tagName:tagName ,
			  	DOM:'',
				children:[],
				text:'',
				double:{},
				class:[], style:[], prop:[], attr:[], 
			}

			//exoprt_options.All_Vnodes[only_id] = VNode ;

			//*** 事件的处理 先把v-on拆分 再把事件传参绑定到虚拟DOM上
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
								startTag = startTag.replace('>',' v-bind:vonkey_'+one+'="'+one+'" >')
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
			if(!all){ return VNode };

			// 有属性的处理 ;
			all.map(function( each ){
				// *** 每一个属性 ;
				var each = each ;

				// 含有v-bind 属性 ;
				if( each.includes('v-bind') ){

		 			var vk = each.match(/v-bind:([\w\.]+)="(.*)"/) ;
					var key   = vk[1].trim() ; // 绑定种类
					var value = vk[2];		   // 绑定值

					// ***** 
					// 文字
					if( key =='vTEXT' ){
						VNode.text = value ; //data_key 为值 特殊!! ;不关联订阅 ;
					}
					// *****
					// {{}}
					else if( key=='vDOUBLE' ){
						value = value.trim() ;

						var dom_key  = '' ;
						var data_key = value ;

						var obj = {
							dom_key:dom_key,
							data_key:data_key,
							value:eval('Data.'+data_key)
						}
						VNode.double = obj ; 
					}
					// ***** 
					// class
					else if(key=="class"){
						value[0]=="["?value=value.match(/\[(.*)\]/)[1]:null;
						// class为 数组 !!! (不支持对象);
						value.match(/[^\,]+/g).map(function(v,k){

							var dom_key  = '' ;
							var data_key	= v  ;

							var c = eval('Data.'+data_key) ;
							typeof c == 'number'? c=c.toString() : null ; 
							var obj = {
								dom_key:dom_key,
								data_key:data_key,
								value:c
							}
							VNode.class.push(obj) ;				
						})
					}
					else if( key=='style' ){
						value.match(/[^\{\,]+:[^\}\,]+/g).map(function(v,k){

							var v_k = v.match(/(.*):(.*)/) ;
							var dom_key  = v_k[1] ;
							var data_key = v_k[2] ;

							var v_k = v.match(/(.*):(.*)/) ;
							var obj = {
								dom_key:dom_key,
								data_key:data_key,
								value:eval('Data.'+data_key)
							}
							VNode.style.push(obj)
						})
					}
					else if( key=='id'||key=='src'||key=='placeholder'||key=='value'||key=='selected'||key=='disabled' ){

						var dom_key  = key ;
						var data_key = value ;

						var obj = {
							dom_key:dom_key,
							data_key:data_key,
							value:eval('Data.'+data_key)
						}
						VNode.prop.push(obj)
					}
					else{

						var dom_key  = key ;
						var data_key = value ;

						var obj = {
							dom_key:dom_key,
							data_key:data_key,
							value:eval('Data.'+data_key)
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
				    		}
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

			return VNode ;
		},

		// 生成Vnode树
		make_VnodeTree : function ( Arr_VNode , forW ){

			var realPush_Arr = [] ; // 用来储存对象 ( 为了push到children );
			var push = null ;   // 真正的push元素 ;  

			for ( var i=0,j=Arr_VNode.length ; i<j ; i++) {//log(realPush_Arr);
				// 每个 未处理的 vnode ;
				var each = Arr_VNode[i] ;

				if( each != 'over'){
					// 开始标签
					if( i==0 ){ 
						// *** 组件跟标签
						realPush_Arr[0] = each ;
					}else{
						// *** 非 组件跟标签 ;

						if(each.tagName=='vForWrapper'){
							each.tagName='section'
							each.class=[{value:'vForWrapper'}]
							// each.tagName="section"
							forW.push( each );
						}
						push = realPush_Arr[realPush_Arr.length-1] ; //最后一位 ( 真正要添加到children的vnode );
						push.children.push(each) ;

					  // !!!!!! 推向下一个 vnode ;
						realPush_Arr.push( each )
					}	
				}else{
					// 结束标签
					i!=j-1?realPush_Arr.pop():null; // 把 处理完的 vnode 移除数组( 最后一位不移除 );
				}
			} ;

			return realPush_Arr.pop() ;
		}

		// 
	}











	
}())
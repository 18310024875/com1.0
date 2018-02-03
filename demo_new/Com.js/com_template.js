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


(function( c ){

	c.template = function( option ){
		var tpl  = option.template ;
		if( !tpl ){ console.error(' 缺少template'); return };
		!option.data ? option.data={} : null ;
		// (0) 去注释
			tpl = tpl.replace(/<\!\-\-(.*?)\-\->/g,'');
		// (1) 去换行 ; 		
			tpl = tpl.replace(/\r/g,'') ;
			tpl = tpl.replace(/\n/g,'') ; 

		// (2) 把单标签变双标签
			tpl = tpl.replace(/\/>/g,'></aloneOver>') ;

		// (3) 替换 {{key}} 
			var dbls = tpl.match(/\{\{.*?\}\}/g) ;
			if( dbls ){
				dbls.map(function(v,k){
					var data_key = v.match(/\{\{(.*)\}\}/)[1];
					tpl = tpl.replace(/\{\{.*?\}\}/,'<font class="template_font" v-bind:V_DOUBLE="'+data_key+'"></font>');
				});
			}

		// (4) 替换 标签内文字 >123< 
			tpl = tpl.replace(/>\s{1,}</g,'><');
			tpl = tpl.replace(/>([^<>]+?)</g,'><font class="template_font" v-bind:V_TEXT="'+'$1'+'"></font><');

		// (5) 替换v-if
			tpl = tpl.replace(/v-if/g,'v-bind:V_IF');

		// (6) 生成vnode树 
			var vnodeTree = new c.vnodeTreeMaker( tpl , option );

			option.vnodeTree=vnodeTree ;
			return option;
	}

	// 制作vnode树类
	var vnodeTreeMaker = c.vnodeTreeMaker = function( tpl , option ){
		this.tpl = tpl ;
		this.option = option ;

		var vnode_array = this.make_vnode_array();
		var vnodeTree   = this.make_vnodeTree( vnode_array );
		return vnodeTree ;
	}
	// 制作 vnode_array
	vnodeTreeMaker.prototype.make_vnode_array = function(){
		var tpl = this.tpl ;
		var option = this.option ;
		var vnode_array = [] ;
		// 所有标签 ;
		var tags = tpl.match(/<.*?>/g) ; 
		if( tags.length==0 ){console.error('template内 没有标签');return};

// ************************************************************************************************
// 在这一步分辨 有没有v-for在模板内 ; 取出元素交给v-for函数 ;
	
 		var backObj = c.FIND_vforScopedWrapper( tags );
 			tags = backObj.after_tags ; 
 			// 如果发现存在v-for作用域 交给vforMaker ;
 			if( backObj.vforInfo.length ){
 				backObj.vforInfo.map(function(v){
 					new c.vforMaker( v , option );
 				})
 			};

// ************************************************************************************************
// 继续下文操作
		
		//不是结尾标签
		var notEndTag = /<(?!\/).*>/ ;  
		for(var i=0,j=tags.length;i<j;i++){
			var each = tags[i] ;
			// ** 兼容 vfor 特殊处理 ;
			if( c.type( each )=='Object' ){
				vnode_array.push( each ) ;
				continue;
			};

			if( notEndTag.test( each ) ){
				// ** 开始标签 
				var vnode = this.makeOneVnode( each );
				vnode_array.push( vnode ) ;
			}else{
				// ** 结尾标签 ;
				vnode_array.push( 'over' ) ;
			}
		}
		return vnode_array ;	
	}
	// 制作每一个 vnode
	vnodeTreeMaker.prototype.makeOneVnode = function( startTag ){ 
			var Data = this.option.data ;
			var only_id = c.onlyId() ;
			var tagName = startTag.match(/<([\w-\$]+).*>/)[1] ;

		  	var vnode = {
		  		id: only_id ,
			  	tagName:tagName ,
				children:[],
				text:'',
				double:{},
				class:[], style:[], prop:[], attr:[], 
			};

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
			if(!all){ return vnode };

			// 有属性的处理 ;
			all.map(function( each ){
				// *** 每一个属性 ;
				var each = each ;

				// 含有v-bind 属性 ;
				if( each.includes('v-bind') ){
		 			var vk = each.match(/v-bind:([\w\.]+)="(.*)"/) ;
					var key   = vk[1].trim() ; // 绑定种类
					var value = vk[2];		   // 绑定值

					// 文字
					if( key =='V_TEXT' ){
						vnode.text = value ; //data_key 为值 特殊!! ;不关联订阅 ;
					}
					// {{}}
					else if( key=='V_DOUBLE' ){
						value = value.trim() ;

						var dom_key  = '' ;
						var data_key = value ;
						var obj = {
							dom_key:dom_key,
							data_key:data_key,
							value: eval('Data.'+data_key)
						}
						vnode.double = obj ; 
					}
					// class
					else if(key=="class"){
						value[0]=="["?value=value.match(/\[(.*)\]/)[1]:null;
						// class为 数组 !!! (不支持对象);
						value.match(/[^\,]+/g).map(function(v,k){

							var dom_key  = '' ;
							var data_key	= v  ;
							// class 不能为数字 ;
							var c = eval('Data.'+data_key) ;
							typeof c == 'number'? c=c.toString() : null ; 

							var obj = {
								dom_key:dom_key,
								data_key:data_key,
								value: c
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
							var obj = {
								dom_key:dom_key,
								data_key:data_key,
								value: eval('Data.'+data_key)
							}
							vnode.style.push(obj)
						})
					}
					// prop
					else if( key=='id'||key=='src'||key=='placeholder'||key=='value'||key=='selected'||key=='disabled' ){

						var dom_key  = key ;
						var data_key = value ;
						var obj = {
							dom_key:dom_key,
							data_key:data_key,
							value: eval('Data.'+data_key)
						}
						vnode.prop.push(obj)
					}
					// attr
					else{

						var dom_key  = key ;
						var data_key = value ;
						var obj = {
							dom_key:dom_key,
							data_key:data_key,
							value: eval('Data.'+data_key)
						}
						vnode.attr.push(obj)
					}	

				} else {
				// 正常属性
				    var it = each.match(/(.*)=["](.*)["]/)
				    var k = it[1];
				    var v = it[2];
				    if( k=='class' ){
				    	var obj = { value:v } ;
				    	vnode.class.push(obj)
				    }else if(k=="style"){
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
				    		vnode.style.push(obj)
				    	})
				    }else if( k=='id'||k=='src'||k=='placeholder'||k=='value'||k=='selected'||k=='disabled' ){
				    	var obj = {
				    		dom_key:k,
				    		value:v
				    	}
				    	vnode.prop.push(obj)
				    }else{
				    	var obj = {
				    		dom_key:k,
				    		value:v
				    	}
				    	vnode.attr.push(obj)
				    }
				}
			})// map over ;

			return vnode ;
	}
	// 根据 vnode_array 生成 vnode树 ;
	vnodeTreeMaker.prototype.make_vnodeTree = function ( vnode_array ){
		// 指针
		var activeArr = [ this.makeOneVnode('<$ROOT>') ]; 
		var active = activeArr[activeArr.length-1];   

		for ( var i=0,j=vnode_array.length ; i<j ; i++) {
			// 每个 未处理的 vnode ;
			var each = vnode_array[i] ;
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
		} ;

		// $ROOT 的子元素只有一个 就是根节点 ;
		return active.children[0] ;
	}


}( Com ));
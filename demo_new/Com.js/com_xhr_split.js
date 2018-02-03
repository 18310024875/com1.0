(function( c ){
	/*
		读ajax返回字符串 ;
			1. xhr 字符串
			2. urlAsKey 组件地址作唯一标示
	 */ 
	c.xhrSplit = function( xhr , urlAsKey ){
	    // 换行会对 match 造成影响 先去换行 ;
		xhr = xhr.replace(/\r/g,'__ENTER__') ;
		xhr = xhr.replace(/\n/g,'__ENTER__') ; 

		// 1 获取 style (可能不存在) ;
		var lessArr  = xhr.match(/<style.*?>(.*)<\/style>/) ;
		var str_less = lessArr ? lessArr[1] : ''; 

		// 2 获取 js ( 必有 )
		var str_js   = xhr.match(/<script.*?>(.*)<\/script>/)[1] ;
		// 3 获取 template ( 必有 )
		var str_tpl  = xhr.match(/<template.*?>(.*)<\/template>/)[1] ;  

		// *** 处理less
		c.lessMaker.read( str_less );

		// *** 处理js template 制作导出的option ;
		c.optionMaker.read( str_js , str_tpl , urlAsKey);
	};

	/*
		制作less 以换行为分界线 ;
	 */
	c.lessMaker={
		read:function( str ){
			if( !str.replace('__ENTER__').trim() ){
				return ;
			};
			// 生成less树 ;
			var tree = this.makeTree(str);
			// 生成标签 ;
			this.makeStyleTag( tree );
		},
		// 生成less树 ;
		makeTree( str ){
			// 去注释
			str = str.replace(/\/\*(.*)\*\//g,'');
			str = str.replace(/\/\//g,'__ENTER__//');
			/*
				防止错乱规则 例如
			 		1 span  {
						color: white }
					2 span  {color: white}
					3 span  
						{
							color: white
						}

			 */
			str = str.replace(/}/g,'__ENTER__}__ENTER__');
			str = str.replace(/(__ENTER__)*\s*{/g,'{__ENTER__');

			var makeLessNode = this.makeLessNode ;
			// 制作指针
			var activeArray = [makeLessNode('$ROOT')];
			var active = activeArray[activeArray.length-1];

			var split_enter = str.split('__ENTER__');

				split_enter.map(function(v){
					if(v){
						// 开始标签
						if(v.includes('{')){
							// 找到less标题
							var title = (v.match(/(.*){/))[1];
								title = title.trim();
							// 制作树
							var node = makeLessNode(title);
							// 添加到 -- 指针children中
							active.children.push(node);
							// 指针 add ;
							activeArray.push(node);
							// 改变指针指向 ;
							active = activeArray[activeArray.length-1];
						}
						// 结束标签
						else if(v.includes('}')){
							// 指针 del ;
							activeArray.pop();
							// 改变指针指向 ;
							active = activeArray[activeArray.length-1];						
						}
						// 添加到对应样式
						else{
							// 去注释
							if(v.includes('//')){
								active.str += '';
							}else{
								active.str += v+'\n';
							}
						}
					}
				});
			return active ;
		},
		// 制作一个less Node ;
		makeLessNode( title ){
			return {
				title:title,
				str:'',
				children:[]
			}			
		},
		// 制作style标签并插入 HTML ;
		makeStyleTag( tree ){
			var str='';
			// 递归函数
			var render=function(tree , renderTitle ){
				var rt = '';
				var f  = tree.title[0];
					if( f=='&' ){
						rt += renderTitle+tree.title.replace(/&/g,'') ;
					}else if( f=='>' ){
						rt += renderTitle+tree.title ;
					}else if( f==':' ){
						rt += renderTitle+tree.title ;
					}else {
						rt += renderTitle+' '+tree.title ;
					}
				str += ( rt+'{\n'+tree.str+'\n}\n' )
				if( tree.children.length ){
					tree.children.map( function(v){
						// 递归
						render(v , rt );
					})
				}
			}
			// 调用递归函数
			tree.children.map( function(v){
				render(v,'');
			})

			$('<style>').html(str).appendTo($('head'));
		}
	}

	/*
		制作js
	 */
	c.optionMaker={
		read:function( js , tpl , urlAsKey){
			/*
				js 处理换行
				tepl 处理换行 ' " 
					*** (现在拿到的tpl是处理后的 , 现在要做的是统一格式 , 变成对象执行Com.export 所以需要转译回去!)
			 */
			js  = js.replace(/__ENTER__/g,"\n");
			tpl = tpl.replace(/__ENTER__/g,"").replace(/'/g,'\\\'').replace(/"/g,'\\\"');
			/*
				导出对象预处理添
					1 添加url作为唯一标识 
					2 添加template
					3 添加初次渲染 回调函数名( 用作加载后执行请求require组件的回调函数 , 唯一标识拼接_loadSuccess为通讯函数名)
			 */
			js = js.replace(/Com\.exports\s*=\s*{/g,
							"Com.exports={\n"+
								"__urlKey:\""+urlAsKey+"\",\n"+
								"template:\""+tpl+"\",\n");
			/*
				包裹成自执行函数
			 */
			js = "(function(){"+"\n"+ js +"\n"+"}());";
			/*
				动态插入script ;
					!!!!******
					插入后调用 Com.exports !!!!!!!!!
			 */
			var script = $('<script>');
				script.html(js);
			$('body').after( script );
		}
	}

}( Com ));



// require xhr ;
(function(){

	// XML 请求对象 , 暂时为同步请求 ; 
	var req = function(url,callback){
		var xhr = new XMLHttpRequest() ;
	    xhr.open("get", url, false);
	    xhr.onreadystatechange = function () {
	        if (xhr.readyState == 4) {
	            xhr.status == 200?callback(xhr.responseText):console.error('req maked xhr not load it');
	        }
	    }
	   xhr.send(null);	
	}

	Object.defineProperty(Com,"exports",{
		set:function( obj ){
			// autoName 已经在解析模板 自动添加了
			!obj.autoName?console.error('no export autoName !!!'):null ;
			tool.saveExports[obj.autoName] = obj ;
		},
		get:function(){ }
	})

	Com.require=function(name,callback){
		if( tool.saveExports[name] ){
			callback( tool.saveExports[name] ) ;
		}else{
			var url = Com.config[name] ;
			// 调用 req 返回函数得到未处理的 XHR ;
			req(url,function(XHR){

				// 未处理的XHR 交给函数处理 ;
				// *** 默认 require 的 [name] 来自 Com.config.js ;
				// *** 当做 script 导出的 [name] , 当做查找索引;
				doXHR.Read_xhr(XHR,name, callback)
			})
		}
	}

}()) ;

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


// 组件在使用前 需要先注册 ( com.config.js ) ;
(function () {

	window.doXHR = {
		// 处理  *.vue ;
		Read_xhr:function (xhr,only_exp_name ,callback){ 

		    // 换行会对 match 造成影响 先去换行 ;
			xhr = xhr.replace(/\r/g,'__换行__') ;
			xhr = xhr.replace(/\n/g,'__换行__') ; 

			// 1 动态生成 script 标签( 必须有 )
			var JS = xhr.match(/<script.*?>(.*)<\/script>/)[1] ;
			var export_options = this.Make_script( JS , only_exp_name ) ;

			// 2 动态生成style标签 ( 可无 );
			var CSS = undefined ;
			var scoped = '' ;
			try{
				var str = xhr.match(/<style(.*?)>/)[1];
				if(str,str.includes('scoped')){
					var styleArr = xhr.match(/<style.*?scoped=["']([\w\.\#]+)["']\s*>(.*)<\/style>/) ;	
					scoped = styleArr[1];
					CSS = styleArr[2]
				}else{
					var styleArr = xhr.match(/<style.*?>(.*)<\/style>/) ;	
					CSS = styleArr[1]		
				}
			}catch(e){}

			CSS? this.Make_style( CSS , scoped ) : null ;


			// 3 截取 tpl ( 必须有 )
			var tpl = xhr.match(/<template.*?>(.*)<\/template>/)[1] ;   
				tpl = tpl.replace(/__换行__/g,'')

				// 处理 template 和 导出对象 ;
				template.readTPL( 
					tpl ,     // template
					export_options , // 导出对象
					callback  // 回调 new Component( Exp_Opt )
				) ;
		},

		// 生成script标签
		Make_script:function( js, only_exp_name, ){
			js = js.replace(/__换行__/g,"\n") 

			// 组件 config配置文件 名字 --- 地址 ;
			// 根据名字 加载.vue文件 ; 生成js ; 但是js和config无法呼应 (得不到加载script导出的对象)
			// 这一步 把字符串加上一个名字作为标识 , 加载之后 就可以得到组件导出的对象 ;;;
			js = js.replace(/Com\.exports\s*=\s*{/g,"Com.exports={     autoName:'"+only_exp_name+"',") ;

			js = "(function(){"+"\n"+ js +"\n"+"}());" ;

			$('body').after($('<script>').html(js));

			// *** 一个组件 ********* ; ;  ; ; ; ; 
			var options = tool.saveExports[only_exp_name] ;
			return options ;
		},

		// 生成style标签 ;
		Make_style:function( str,css_el ){
			str = str.replace(/__换行__/g,'');
			str = str.replace(/\s{1,}/g,' ')

			//添加标识符
			str = str.replace(/}/g,'}_cut_');
			//切割
			var CSS = '' ;
			str.split('_cut_').map(function(v,k){ //最后一位为空 ;
			  if(Number(v)!=0){
				var each = v.trim() ;
					each = css_el+' '+each ;
				CSS += each+'\n';
			  }
			})
			$('<style>').html(CSS).appendTo($('head'))
		},

			
	}

}())
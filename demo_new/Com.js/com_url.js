(function( c ){

	function req( url , loadok ){ 
		!url.includes('.com') ? url=url+'.com' : null ;
		var xhr = new XMLHttpRequest() ;
	    xhr.open("get", url , false);
	    xhr.onreadystatechange = function () {
	        if (xhr.readyState == 4) {
	            xhr.status == 200 ? loadok(xhr.responseText) : console.error('加载失败---url= '+url);
	        }
	    }
	   xhr.send(null);			
	}

	// 储存所有导出对象 ;
	c.exportInfo={
		// 先储存 ! 地址标识回调函数名 ;
		urlKey_loadSuccess:{} ,
		// 后储存 ! 地址标识导出的对象 ;
		urlKey:{} 
	};

	c.getOptionFromUrlKey=function( url ){
		var obj = c.exportInfo.urlKey[url] ;
		if( obj ){
			return c.clone(obj)
		}else{
			return null ;
		}
	};

	/*
		导入函数 
			1. url 为唯一标示
			2. 第一次加载 储存*通讯函数 到 urlKey_loadSuccess
			3. 第一次加载 处理不完整的option
	 */
	c.require=function( url , getOptionCallback ){
		var a_option = c.getOptionFromUrlKey( url );
		if( a_option ){
			/*
				已加过 返回储存对象 
			 */
			getOptionCallback(a_option);
		}else{
			/*
				没加载过
					1. 请求xhr ;
					2. 生成*地址通讯函数 ( Com.firstLoadOk 根据url生成唯一标识 指向wantComponentOption)
					3. 处理返回xhr , 生成正确格式的 option ;
					4. 动态插入script ;
					5. js执行时调用Com.export 得到导出对象并储存;
					6. 回调*地址通讯函数 == getOptionCallback( option ) ;
			 */
			req( url , function( xhr ){
				// 绑定*地址通讯函数
				c.exportInfo.urlKey_loadSuccess[ url+'_loadSuccess' ] = getOptionCallback ;
				// 处理返回数据
				c.xhrSplit( xhr , url );
			})
		}
	}

	/*
		导出函数
			1. 接受处理后的option
			2. 储存*完整option 到 urlKey
			3. 从urlKey_loadSuccess 找到通讯函数并通讯 ;
	 */
	Object.defineProperty(c,"exports",{
		// 返回经过处理的option ;
		set:function( option ){
			// 找到*地址标识 ;
			var url = option['__urlKey'];
			// 1 根据地址储存导出option ;
				c.exportInfo.urlKey[ url ] = option ;
			// 2 找到*地址通讯函数 ;
			var getOptionCallback=c.exportInfo.urlKey_loadSuccess[ url+'_loadSuccess' ];
			// 3 调用回调函数 ;
			var a_option = c.getOptionFromUrlKey( url );
				getOptionCallback( a_option );
				
		},
		get:function(){}
	})

}( Com ));
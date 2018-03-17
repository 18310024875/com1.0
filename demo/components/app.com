<template>
	<!-- Com根组件 中的 路由根组件 -->
	<div id="app">
		<app_header/>
		<app_leftMenu/>
		<div class="appScroll">
			<router-view></router-view>
		</div>
	</div>
</template>
<script>
	// 储存组件 用于通讯 ;
	window.bus={} ;
	// ajax
	window.$get = function(url,CALLBACK){
		$.ajax({
			url:'./src/json/'+url,
			success:function(res){
				CALLBACK(res)
			}
		})
	}
	// 下拉刷新 
	window.$load = function(dom,CALLBACK){  
	    var obj = {once:false} ;
	    CALLBACK() ;
		obj.destroy = function(){ dom.onscroll=null ;obj=null ; return };
		dom.onscroll=function(){
			if(obj.once){
			    if(dom.scrollTop+dom.offsetHeight+20>=dom.scrollHeight){
			        console.log('_____loadReady____')
			        CALLBACK() ;
			        obj.once = false ;
			    }           
			}
		};
		return obj ;
	};

	// 根组件 ;
	Com.exports = {
		components:{
			app_header:'./components/header',
			app_leftMenu:'./components/leftMenu',
		},
		data:{

		},
		watch:{

		},
		methods:{

		},
		mounted(){
			
		}
	}
</script>
<style lang="less">
	#app{
		width:100%;height: 100%;
		overflow: hidden;
		position: relative;
		.appScroll{
		    width: 100%;height: calc(100% - 1rem);
		    position: absolute;
		    left: 0;top: 1rem;
		    overflow: auto;
		}
	}
</style>
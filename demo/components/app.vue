<template>
	<div id="app">
		<app_header/>
		<app_leftMenu/>
		<div id="main">
			<router-view></router-view>
		</div>
	</div>
</template>
<style scoped="#app" >
	#main{
	    width: 100%;height: calc(100% - 1rem);
	    position: relative;
	    overflow: auto;
	}
	.router-view{
		width: 100%;height: 100%;
		position: relative;
	}
</style>

<script>
	// 储存组件 用于通讯 ;
	window.bus={} ;
	// ajax
	window.$get = function(url,callback){
		$.ajax({
			url:'./src/json/'+url,
			success:function(res){
				callback(res)
			}
		})
	}
	// 下拉刷新 
	window.$load = function(dom,callback){  
	    var obj = {once:false} ;
	    callback() ;
	      
		// 卸载方法
		obj.destroy = function(){ dom.onscroll=null ;obj=null ;return ;}
		// 滚动方法
		dom.onscroll=function(){
			if(obj.once){
			    if(dom.scrollTop+dom.offsetHeight+20>=dom.scrollHeight){
			        console.log('_____loadReady____')
			        callback() ;
			        obj.once = false ;
			    }           
			}
		} // onscroll end 
		return obj ;
	};

	// 根组件 ;
	Com.exports = {
		// 跟组件需要el属性 ;
		el:'body',

		components:{
			app_header:'header',
			app_leftMenu:'leftMenu',
		},

		data:{
			app:'app'
		},
		watch:{

		},
		methods:{

		},

		updated(){

		},
		mounted:function () {
		
		}
	}


</script>
<template>
	<div id="home" ref="home">

	    <div class="swiper-container" ref="sc" style="height:211px;margin-bottom: 40px;">
	        <div class="swiper-wrapper" ref="sw">

	        	<template>
		        	<div class="swiper-slide" v-for="(v,k) in banner">
		        		<img v-bind:src="v.imageUrl"/>
		        	</div>	        		
	        	</template>

	        </div>
	    </div>

	    <ul class="m_box">

	    	<template>
				<li v-for="(v,k) in now" v-on:click="toDetail(v.cover.origin)">
					<img v-bind:src="v.cover.origin"/>
					<div>
						<p class="p1">{{v.name}}</p>
						<p class="p2">{{v.watchCount}}家影院上映 {{v.cinemaCount}}人购票</p>
						<span class="fen">{{v.grade}}</span>					
					</div>
				</li>	    		
	    	</template>

	    	<button class="more" v-on:click="toMovie">
	    		更多热映电影
	    	</button>
	    </ul>

	    <div class="cut">即将上映</div>
	    <div class="cut_after"></div>

	     <ul class="m_box">

	     	<template>
				<li v-for="(v,k) in will" v-on:click="toDetail(v.cover.origin)">
					<img v-bind:src="v.cover.origin"/>
					<div>
						<p class="p1">{{v.name}}</p>
						<p class="p2">{{v.watchCount}}家影院上映 {{v.cinemaCount}}人购票</p>
						<span class="fen">{{v.grade}}</span>					
					</div>
				</li>		     		
	     	</template>
	    	
	    	<button class="more" v-on:click="toMovie">
	    		更多即将上映电影
	    	</button>
	    </ul>

	</div>
</template>
<style scoped="#home" >
	.swiper-slide img {
	  width: 100%;
	}
	.m_box {
	  width: 90%;
	  margin: .3rem auto 0 auto;
	  background: #f0f0f0;
	}
	.m_box li {
	  color: #9a9a9a ;
	  margin-bottom: .34rem;
	  padding-bottom: .1rem;
	  box-shadow: 0.5px 0.5px 1px #a8a8a8;
	  background: #f9f9f9 ;
	}
	.m_box li img {
	  width: 100%;
	}
	.m_box li div {
	  margin-top: .2rem;
	  position: relative;
	}
	.m_box li div p {
	  padding-left: 0.3rem;
	}
	.m_box li div .p1 {
	  color: #333;
	  font-size: .25rem;
	}
	.m_box li div .fen {
	  color: #f78360;
	  font-size: .37rem;
	  position: absolute;
	  right: .34rem;
	  top: 1px ;
}
</style>

<script>

	var swiper ;

	Com.exports = {

		data:{
			banner:[],
			swiper:undefined ,
			will:[],
			now:[]
		},
		watch:{

		},
		methods:{
			toDetail:function( ags ){
				var url = ags[0] ;
				localStorage.detailImgUrl = url ;
				location.hash = 'detail' ;
			},
			toMovie:function(){
				location.hash = 'movie' ;
			},
			addSiwper(){
		        swiper = new Swiper('.swiper-container', {
		            loop: true, 
		            autoplay:3000,
		            autoplayDisableOnInteraction : false,
		            pagination: '.swiper-pagination',// 如果需要分页器
		            paginationClickable:true,
		        }) ;				
			},
		},

		updated(){

		},
		mounted:function () {
			var this_ = this ;
			bus.home = this ;

			$get('banner.json',function(res){
				this_.banner = res.data.billboards ;
				this_.setState() ;
				// 解析v-for时候会添加元素 swiper格式不对需要处理一下 ;
				this_.$refs.sc.removeClass('swiper-container') ;
				this_.$refs.sw.removeClass('swiper-wrapper') ;
				this_.$refs.home.find('.vForWrapper').eq(0).addClass('swiper-container').append('<div class="swiper-pagination"></div>') ;
				this_.$refs.home.find('.VF_begin').eq(0).addClass('swiper-wrapper') ;

				this_.addSiwper()
			})
			$get('now_movie.json',function(res){
				this_.now = res.data.films ;
				this_.setState() ;
			})
			$get('will_movie.json',function(res){
				this_.will = res.data.films ;
				this_.setState() ;
			})

		},
		beforeDestroy:function(){
			if( swiper&&swiper.destroy){
				swiper.destroy(false)				
			}
		}
	}


</script>
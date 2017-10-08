<template>
	<section id="home">
	<it :op="will" ><h1>asdasdas</h1></it>

	<h1>{{$store.state.part2.name}}{{$store.state.name}}</h1>
	    <div class="swiper-container">
	        <div class="swiper-wrapper">
	        	<div class="swiper-slide" v-for="x in banner">
	        		<img :src="x.imageUrl">
	        	</div>
	        </div>
	        <div class="swiper-pagination"></div>
	    </div>

		    <ul class="m_box">
				<li v-for="(v,k) in now" @click="toDetails(v.cover.origin)">
					<img :src="v.cover.origin"/>
					<div>
						<p class="p1">{{v.name}}</p>
						<p class="p2">{{v.watchCount}}家影院上映 {{v.cinemaCount}}人购票</p>
						<span class="fen">{{v.grade}}</span>					
					</div>
				</li>
		    	<button class="more" @click="toMovie(['active',''])">
		    		更多热映电影
		    	</button>
		    </ul>

		    <div class="cut">即将上映</div>
		    <div class="cut_after"></div>

		     <ul class="m_box">
				<li v-for="(v,k) in will">
					<img :src="v.cover.origin"/>
					<div>
						<p class="p1">{{v.name}}</p>
						<p class="p2">{{v.watchCount}}家影院上映 {{v.cinemaCount}}人购票</p>
						<span class="fen">{{v.grade}}</span>					
					</div>
				</li>		    	
		    	<button class="more" @click="toMovie(['','active'])">
		    		更多即将上映电影
		    	</button>
		    </ul>
	</section>
</template>
<script type="text/javascript">
	import it from '../it.jsx';

	import * as type from '../../mutation-type.js' ;
	import oo from 'vv/jjj.vue';
	console.warn(oo)
	export default {
		name:'home',
		data(){
			return {
				banner:[],
				swiper:undefined ,
				will:[],
				now:[]
			}
		},
		created(){
		},
		activated(){ // keep-alive  ; 组件切换时调用
			//alert('activated')
		},
		deactivated(){
			//alert('de activated home')
		},
		mounted(){
			$get('banner.json',(res)=>{
				this.banner = res.data.billboards ;
				this.$nextTick(()=>{
					this.addSiwper()
				})
			})
			$get('now_movie.json',(res)=>{
				this.now = res.data.films ;
			})
			$get('will_movie.json',(res)=>{
				this.will = res.data.films ;
			})
			window.ok = this ;
		},
		destroyed(){
			this.swiper.destroy(false)
		},
		components:{
			it
		},
		methods:{
			do(){
				console.log(this.$store)
				console.log(this.$store.state.part2)
				this.$store.commit(type.changeName , 'kkk')
			},
			toMovie(arr){
				this.$router.push({path:'/movie',query:{arr:arr}})
			},
			addSiwper(){
		        this.swiper = new Swiper('.swiper-container', {
		            loop: true, 
		            autoplay:3000,
		            autoplayDisableOnInteraction : false,
		            pagination: '.swiper-pagination',// 如果需要分页器
		            paginationClickable:true,
		        }) ;				
			},
			toDetails(url){
				this.$router.push({
					path:'/details',
					query:{
						imgUrl:url
					}
				})
			}
		}
	}
	var a={
		name:[12,3],
		age:9
	}
	var b = {
		age:'000',
		name:'[1,2,3]'
	}
	console.log({...a,...b})
</script>
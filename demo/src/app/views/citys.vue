<template>

	<section id="citys">
		<p>GPS定位你所在城市</p>
		<p>北京</p>
		<p>热门城市</p>
		<ul>
			<li v-for="(v,k) in imp" @click="toHome(v)">{{v}}</li>
		</ul>
		<p>按字母排序</p>
		<ul>
			<li v-for="(v,k) in arr" @click="scrollTo(v)">
				{{v}}
			</li>
		</ul>

		<div v-for="(v,k) in arr">
			<p class="citys_p">{{v}}</p>
			<ul>
				<li v-for="(v2,k2) in citys[k]" @click="toHome(v)">
					{{v2.name}}
				</li>
			</ul>
		</div>	
	</section>

</template>
<script type="text/javascript">
	export default {
		name:'citys',
		data(){
			return {
				imp:['北京','上海','广州','深圳'],
				arr:['A','B','C','D','E','F','G','H','J','K','L','M','N',
					'P','Q','R','S','T','W','X','Y','Z'],
				citys:[],
				lis:[]		
			}
		},
		methods:{
			toHome(city){
				this.$router.push('/home');
				this.$commit('changeCity',city)
			},
			scrollTo(name){
				this.lis.forEach((v,k)=>{
					if(v.innerHTML==name){
						var top = v.offsetTop ;
						var stop ;
						var dom = document.querySelector('#main');
						var i=0 ;
						var speet = top/30 ;
						function run() {
							i+=1 ;
						    dom.scrollTop += speet;
							if (i==30) {
							   cancelAnimationFrame(stop);
							   run = null ;
							   dom.scrollTop = top ;
							   return ;
							}
							stop = requestAnimationFrame(run);
						}
						run()	
					}
				})
			}
		},
		updated(){
			this.lis = document.querySelectorAll('.citys_p') ;
		},
		created(){
		},
		activated(){ // keep-alive  ; 组件切换时调用
			//alert('activated')
		},
		deactivated(){
			//alert('de activated city')
		},
		mounted(){
			console.log(this.$route)

			$get('citys.json',(res)=>{
				// 重构数组
				let arr=[] ;
				this.arr.map((v,k)=>{
					arr.push([])
				})
				res.data.cities.map((v,k)=>{
					let pinyin = v.pinyin[0] ;
					let i = this.arr.indexOf(pinyin) ;
					arr[i].push(v)
				})
				this.citys = arr ;
			})
		}
	}
</script>
<template>
  <section id="movie">
	<div class="movie_wrapper">
			
		<ul class="tit">
			<li :class="tab[0]" @click="changeTab(0)">正在热映</li>
			<li :class="tab[1]" @click="changeTab(1)">即将上映</li>
		</ul>

		<ul class="box" v-if="tab[0]=='active'">
			<li v-for="(v,k) in arr" @click="toDetails(v.cover.origin)">
				<div class="fen">
					<span>{{v.grade}}</span>
					<i></i>
				</div>
				<div class="fl"> 
					<img :src="v.poster.origin"/>
				</div>
				<div class="fr"> 
					<p class="p1">{{v.name}}</p>
					<p class="p2">{{v.intro}}</p>
					<div class="div">
						<div>
							<span>{{v.cinemaCount}}</span>
							家影院上映
						</div>
						<div>
							<span>{{v.watchCount}}</span>
							人购票								
						</div>
					</div>
				</div>
			</li>
		</ul>
		<ul class="box" v-if="tab[1]=='active'">
			<li v-for="(v,k) in arr" @click="toDetails(v.cover.origin)">
				<div class="fen">
					<span></span>
					<i></i>
				</div>
				<div class="fl"> 
					<img :src='v.poster.origin'/>
				</div>
				<div class="fr"> 
					<p class="p1">{{v.name}}</p>
					<p class="p2">{{v.intro}}</p>
					<div clas="div2">
						<div>
							<span>{{time(v.premiereAt).day}}</span>
							上映
						</div>
						<div>
							<span>{{time(v.premiereAt).week}}</span>								
						</div>
					</div>
				</div>
			</li>
		</ul>
	</div>
  </section>
</template>
<script type="text/javascript">
	export default {
		name:"movie",
		data(){
			let arr=['active',''] ;
			if(this.$route.query.arr instanceof Array){
				arr=this.$route.query.arr
			}
			return{
				tab:arr,
				arr:[],
				page:0,
				load:'load',
			}
		},
		methods:{
			toDetails(url){
				this.$router.push({path:'/details',query:{imgUrl:url}})
			},
			changeTab(x){
				let i = this.tab.indexOf('active');
			  // 过滤 active
				if(i==x){
					return
				}

			// 内部属性只能set方法
			// 除非new新数组 !!!!!!!!!!!!!!!
				this.$set(this.tab,i,'')
				this.$set(this.tab,x,'active')
				this.arr=[];
				this.page=0;
				this.ajax()
			},
			ajax(){
				this.page += 1 ;
				if(this.tab[0]=='active'){
					//正在上映
					$get('now'+this.page+'.json',(res)=>{
						if(res.data.films.length==0){
							alert('没有数据了') ;return;
						}
						this.arr = this.arr.concat(res.data.films) ;
					  // 元素加载之后再重置load
						this.$nextTick(()=>{
							this.load.once=true;								
						})
					})
				}else{
					//即将上映
					$get('will'+this.page+'.json',(res)=>{
						if(res.data.films.length==0){
							alert('没有数据了') ;return;
						}
						this.arr = this.arr.concat(res.data.films) ;
					  // 元素加载之后再重置load
						this.$nextTick(()=>{
							this.load.once=true;								
						})
					})
				}
			},
			time(shijianchuo){
				//shijianchuo是整数，否则要parseInt转换
				var time = new Date(shijianchuo);
				var y = time.getFullYear();
				var m = time.getMonth()+1;
				var d = time.getDate();
				var h = time.getHours();
				var mm = time.getMinutes();
				var s = time.getSeconds();
				var week ;
				 switch (time.getDay()) {
				  case 0:week="星期天";break
				  case 1:week="星期一";break
				  case 2:week="星期二";break
				  case 3:week="星期三";break
				  case 4:week="星期四";break
				  case 5:week="星期五";break
				  case 6:week="星期六";break
				 }
				//return y+'-'+m+'-'+d+' '+h+':'+mm+':'+s+week;
				return {
					day:m+'月'+d+'日',
					week:week
				}
			}
		},
		mounted(){
			let dom = document.querySelector('#main') ;
			this.load=$load(dom,()=>{
				this.ajax() ;
			})
			console.log(this.$route.query.arr)
		},
		destroyed(){
			this.load.destroy()
		}
	}
</script>
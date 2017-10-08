<template>
	<div id="movie">
		<div class="movie_wrapper">
				
			<ul class="tit">
				<template>
					<li v-for="(v,k) in tab" v-bind:class="v.class" v-on:click="changeTab(k)">{{v.name}}</li>				
				</template>
			</ul>

			<ul class="box" v-if="tab[0].class">
				<template>
					<li v-for="(v,k) in arr" >
						<div class="fen">
							<span>{{v.grade}}</span>
							<i></i>
						</div>
						<div class="fl"> 
							<img v-bind:src="v.poster.origin"/>
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
				</template>
	
			</ul>
			<ul class="box" v-if="tab[1].class">
				<template>
					<li v-for="(v,k) in arr" >
						<div class="fen">
							<span></span>
							<i></i>
						</div>
						<div class="fl"> 
							<img v-bind:src="v.poster.origin"/>
						</div>
						<div class="fr"> 
							<p class="p1">{{v.name}}</p>
							<p class="p2">{{v.intro}}</p>
							<div clas="div2">
								<div>
									<span>{{v.day}}</span>
									上映
								</div>
								<div>
									<span>{{v.week}}</span>								
								</div>
							</div>
						</div>
					</li>					
				</template>

			</ul>

		</div>
	</div>
</template>

<style scoped="#movie" >

</style>

<script>

	var page = 0 ; 
	var load = undefined ;

	Com.exports = {

		data:{
			tab:[
				{
					name:'正在热映',
					class:'active'
				},{
					name:'即将上映',
					class:''
				}
			],
			arr:[]
		},
		watch:{

		},
		methods:{
			changeTab:function(ags){
				var act = ags[0];
				var tab = this.tab ;
				if(ags==0){
					if(tab[0].class!='active'){
						tab[0].class = 'active';
						tab[1].class = '';
						this.arr = [] ;
						this.setState()
						page = 0 ;
						this.ajax()

					}	
				}else{
					if(tab[1].class!='active'){
						tab[0].class = '';
						tab[1].class = 'active';
						this.arr = [] ;
						this.setState()
						page = 0 ;
						this.ajax()
					}
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
			},
			ajax:function(){
				var this_ = this ;
				page++ ;
				if(this.tab[0].class=='active'){
					//正在上映
					$get('now'+page+'.json',function(res){
						if(res.data.films.length==0){
							alert('没有数据了') ;return;
						}
						this_.arr = this_.arr.concat(res.data.films) ;

						load.once = false ;
						this_.setState() ;
					})
				}else{
					//即将上映
					$get('will'+page+'.json',function(res){
						if(res.data.films.length==0){
							alert('没有数据了') ;return;
						}
						var arr = res.data.films ;
						arr = arr.map(function(v){
							var obj = this_.time(v.premiereAt) ;
							v.day = obj.day ;
							v.week = obj.week ;
							return v
						})
						this_.arr = this_.arr.concat(res.data.films) ;

						load.once=false ;
						this_.setState() ;
					})
				}
			}

		},

		updated:function(){
			load.once=true;
		},
		mounted:function () {
			page = 0 ; 
			var this_ = this ;
			bus.movie = this ;

			var dom = $('#main').get(0) ;
			load = $load(dom,function(){
				this_.ajax() ;
			})
		},
		beforeDestroy:function(){
			if(load){
				load.destroy()
			}
		}
	}


</script>
<template>
	<div id="shop">
		<ul class="tit">

			<template>
				<li v-for="(v,k) in types" v-bind:key="k">
					<img v-bind:src="v.image"/>
					<p>{{v.name}}</p>
				</li>				
			</template>

		</ul>
		<p><span>精彩推荐</span></p>
		<ul class="box">

			<template>
				<li v-for="(v,k) in shop">
					<div class="fl"><img v-bind:src="v.skuList[0].image"/></div>
					<div class="fr">
						<p class="p1">{{v.masterName}}</p>
						<p class="p2">{{v.slaveName}}</p>
						<p class="p3">
							<span>￥{{v.price}}</span>
							<span>已售{{v.displaySalesCount}}</span>
						</p>
					</div>
				</li>			
			</template>

		</ul>
	</div>
</template>
<style scoped="#cinema" >

</style>

<script>

	var page = 0 ;
	var load = undefined ;

	Com.exports = {

		data:{
			types:[],
			shop:[],
		},
		watch:{

		},
		methods:{
			ajax:function(){
				page ++ ;
				var this_ = this ;
				$get('shop'+page+'.json',function(res){
					if(res.data.list.length==0){
						alert('没有数据了');return;
					}
					var arr = res.data.list ;
					arr = arr.map(function(v){
						v.price = (v.skuList[0].price/100).toFixed(2)
						return v 
					})

					this_.shop=this_.shop.concat(res.data.list) ;
					load.once = false ;
					this_.setState() ;
				})	
			}
		},

		updated:function(){
			load.once=true;
		},
		mounted:function () {
			page = 0 ;
			var this_ = this ;
			$get('shop_type.json',function(res){
				this_.types = res.data ;
				this_.setState() ;
			}) ;
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
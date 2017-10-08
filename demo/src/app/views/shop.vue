<template>
	<section id="shop">
		<ul class="tit">
			<li v-for="(v,k) in types">
				<img :src="v.image"/>
				<p>{{v.name}}</p>
			</li>
		</ul>
		<p><span>精彩推荐</span></p>
		<ul class="box">
			<li v-for="(v,k) in shop">
				<div class="fl"><img :src="v.skuList[0].image"/></div>
				<div class="fr">
					<p class="p1">{{v.masterName}}</p>
					<p class="p2">{{v.slaveName}}</p>
					<p class="p3">
						<span>￥{{(v.skuList[0].price/100).toFixed(2)}}</span>
						<span>已售{{v.displaySalesCount}}</span>
					</p>
				</div>
			</li>
		</ul>
	</section>
</template>
<script type="text/javascript">
	export default {
		name:'shop',
		data(){
			return{
				types:[],
				shop:[],
				load:'load'
			}
		},
		destroyed(){
			this.load.destroy() ;
		},
		mounted(){
			$get('shop_type.json',(res)=>{
				this.types = res.data ;
			}) ;

			let i = 0 ;
			let dom = document.querySelector('#main') ;

			this.load = $load(dom,()=>{
				i+=1 ;
				$get('shop'+i+'.json',(res)=>{
					if(res.data.list.length==0){
						alert('没有数据了');return;
					}
					this.shop=this.shop.concat(res.data.list)

					this.$nextTick(()=>{
						this.load.once=true ;
					})
				})
			})
		}
	}
</script>

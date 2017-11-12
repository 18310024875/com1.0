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
<style scoped="#shop" >
	.tit {
	  overflow: hidden;
	  padding: .2rem 0 .12rem 0;
	}
	.tit li {
	  float: left;
	  width: 25%;
	  height: 1.5rem;
	  text-align: center;
	}
	.tit li img {
	  width: .8rem;
	  margin-bottom: 0.05rem;
	}
	.tit li p {
	  color: #333;
	  opacity: 0.5;
	}
	> p {
	  background: #f2f2f2;
	  height: .5rem;
	  line-height: .5rem;
	  text-indent: .22rem;
	  font-size: .24rem;
	}
	> p span {
	  opacity: .8;
	  color: #333333;
	}
	.box {
	  overflow: hidden;
	  width: 100%;
	}
	.box li {
	  padding: .2rem;
	  overflow: hidden;
	  border-bottom: 1px solid #efefef ;
	}
	.box li > div {
	  float: left;
	}
	.box li .fl {
	  width: 1.6rem;
	  height: 1.6rem;
	  overflow: hidden;
	}
	.box li .fl img {
	  width: 100%;
	  height: 100%;
	}
	.box li .fr {
	  position: relative;
	  width: 3.95rem;
	  margin-left: .22rem;
	  height: 1.6rem;
	}
	.box li .fr .p1 {
	  font-size: .28rem;
	  color: #111;
	  line-height: .3rem;
	  min-height: .45rem;
	  max-height: .6rem;
	  overflow-y: hidden;
	}
	.box li .fr .p2 {
	  margin-top: .12rem;
	  color: #999;
	  overflow: hidden;
	  text-overflow: ellipsis;
	  white-space: nowrap;
	}
	.box li .fr .p3 {
	  position: absolute;
	  bottom: 0;
	  width: 100%;
	  color: #999;
	  opacity: .8;
	}
	.box li .fr .p3 span:nth-of-type(1) {
	  color: #ff5000;
	  font-size: .31rem;
	}
	.box li .fr .p3 span:nth-of-type(2) {
	  float: right;
	  margin-right: -0.1rem;
	}
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
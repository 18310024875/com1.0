<template>
	<div id="shop">
		<ul class="tit">
			<li v-for="(v,k) in types" v-bind:key="k">
				<img v-bind:src="v.image"/>
				<p>{{v.name}}</p>
			</li>				
		</ul>
		<p><span>精彩推荐</span></p>
		<ul class="box">
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
		</ul>
	</div>
</template>
<script>

	Com.exports = {

		data:{
			types:[],
			shop:[],

			load:null,
			page:0,
		},
		watch:{

		},

		mounted:function () {
			var this_ = this ;
			
			this.getTypes();

			setTimeout(function(){
				var dom = $('.appScroll').get(0) ;
				this_.load = $load(dom,function(){
					this_.getList() ;
				})
			},200)
		},
		updated:function(){
			this.load ? this.load.once=true : null ;
		},
		beforeDestroy:function(){
			if(this.load){
				this.load.destroy()
			}
		},
		methods:{
			getTypes:function(){
				var this_ = this ;
				$get('shop_type.json',function(res){
					this_.types = res.data ;
					this_.setState() ;
				});
			},
			getList:function(){
				this.page ++ ;
				var this_ = this ;
				$get('shop'+this.page+'.json',function(res){
					if(res.data.list.length==0){
						alert('没有数据了');return;
					}
					var arr = res.data.list ;
					arr = arr.map(function(v){
						v.price = (v.skuList[0].price/100).toFixed(2)
						return v 
					})

					this_.shop=this_.shop.concat(res.data.list) ;
					this_.load.once = false ;
					this_.setState() ;
				})	
			}
		}
	}
</script>
<style lang="less">
#shop{
	.tit{
		overflow: hidden;
		padding: .2rem 0 .12rem 0;
		li{
			float: left;
			width: 25%;
			height: 1.5rem;
			text-align: center;
			img{
				width: .8rem;
				margin-bottom: 0.05rem;
			}
			p{
				color: #333;
				opacity: 0.5;
			}
		}
	}
	&>p{
		background: #f2f2f2;
		height: .5rem;
		line-height: .5rem;
		text-indent: .22rem;
		font-size: .24rem;
		span{
			opacity: .8;
			color: #333333;
		}
	}
	.box{
		overflow: hidden;
		width: 100%;
		li{
			padding: .2rem;
			overflow: hidden;
			border-bottom: 1px solid #efefef ;
			&>div{
				float: left;
			}
			.fl{
				width: 1.6rem;
				height: 1.6rem;
				overflow: hidden;
				img{
					width: 100%;height: 100%;
				}
			}
			.fr{
				position: relative;
				width: 3.95rem;
				margin-left: .22rem;
				height: 1.6rem;
				.p1{
					font-size: .28rem;
					color: #111;
					line-height: .3rem;
					min-height: .45rem;
					max-height: .6rem;
					overflow-y: hidden;
				}
				.p2{
					margin-top: .12rem;
					color: #999;
					overflow: hidden;
					text-overflow: ellipsis;
					white-space: nowrap;
				}
				.p3{
					position: absolute;
					bottom: 0;
					width: 100%;
					color: #999;
					opacity: .8;	
					span{
						&:nth-of-type(1){
							color: #ff5000;
							font-size: .31rem;
						}
						&:nth-of-type(2){
							float: right;
							margin-right: -0.1rem;	
						}
					}
				}
			}
		}
	}
}
</style>
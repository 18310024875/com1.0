<template>
	<div id="cinema">

		<div v-for="(v,k) in address">
			<div class="div" v-on:click="show(k)">{{v}}</div>
			<ul v-if="address_click[k]">
				<li v-for="(v2,k2) in cinemas[k]">
					<h6></h6>
					<div>
						<p>{{v2.name}}</p>
						<span>座</span><span>通</span>
					</div>

					<div>
						<div>
							<h5 class="h1">可乐爆米花</h5> 
							<h5 class="h2">优惠活动</h5>
						</div>					
					</div>

					<p class="p1">{{v2.address}}</p>
					<p class="p2">位置距离</p>
				</li>
			</ul>
		</div>

	</div>
</template>
<script>

	Com.exports = {

		data:{
			address:['密云县','朝阳区','西城区','海淀区','大兴区','东城区',
					 '昌平区', '丰台区','房山区','平谷区','顺义区','石景山区',
					 '门头沟区','通州区','黄岛区','怀柔区','下城区','延庆县'],
			address_click:[],
			cinemas:[],
		},
		watch:{

		},
		methods:{
			show(k){
				this.address_click[k] = !this.address_click[k] ;

				this.setState() ;
			}
		},

		updated(){
			
		},
		mounted:function () {
			var this_ = this ;
			$get('cinema.json',function(res){
				let arr = res.data.cinemas;
				
			  // 构造新数组
				let c_arr = [] ;
				let span_arr = []
				for(let i=0;i<18;i++){
					c_arr.push([])
					span_arr.push(false)
				}

				arr.map(function(v,k){
					let i = this_.address.indexOf(v.district.name) ;
						i!=-1?c_arr[i].push(v):null ;
				})
				this_.cinemas = c_arr ;
				this_.address_click = span_arr ;

				this_.setState() ;
			})
		},
		beforeDestroy:function(){
	
		}
	}
</script>

<style lang="less">
#cinema{
	.div {
		height: .8rem;
		line-height: .8rem;
		font-size: .28rem;
		padding-left: .32rem;
		background: #e1e1e1;
		margin-bottom: 1px;
		color: #636363;
		cursor: pointer;
	}
	ul{
		li {
			padding: .2rem 0 .24rem .32rem;
			cursor: pointer;
			position: relative;
			border-bottom: 1px solid #e1e1e1;
			p{
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;
			}
			.p1 {
				color: #ccc;
				margin-top: .1rem;
				max-width: 83%;
			}
			.p2 {
				color: #ccc;
				margin-top: .1rem;
			}
			.h1 {
				background: #51add0;
			}
			.h2 {
				background: #ff9658;
			}
			h5 {
				display: inline-block;
				margin-top: .1rem;
				margin-bottom: 1px;
				height: .32rem;
				line-height: .32rem;
				padding: 0 .1rem;
				color: white;
				font-weight: normal;
				border-radius: 0.07rem;
				transform: scale(0.95);
				font-size: .2rem;
			}
			h6{
				width: .17rem;
				height: .17rem;
				display: inline-block;
				border: 1px solid #ccc;
				transform: rotate(45deg);
				border-left: none;
				border-bottom: none;
				position: absolute;
				right: .3rem;
				top: .35rem;
				&>div{
					font-size: .32rem;
					width: 100%;
					height: .5rem;
					p{
						display: inline-block;
						color: #111;
						max-width: 4rem;
					}
					span{
						border-radius: 50%;
						font-size: .3rem;
						display: inline-block;
						width: .55rem;
						height: .55rem;
						line-height: .55rem;
						text-align: center;
						transform: scale(0.6, 0.6);
						position: relative;
						top: -0.1rem;
						&:nth-of-type(1){
							border: 1px solid #ff9658;
							color: #ff9658;
						}
						&:nth-of-type(2){
							border: 1px solid #9ebdd2;
							color: #9ebdd2;
							position: relative;
							left: -0.1rem;
						}
					}
				}
			}
		}
	}
}
</style>
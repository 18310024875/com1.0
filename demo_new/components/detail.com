<template>

	<div id="detail">
		<img v-bind:src="imgSrc" style="min-height:100px" />		
		<div class="part1"><span><span style="opacity:0">1</span></span>影片简介</div>
		<p>
			<span>导演 :</span>
			邱礼涛
		</p>
		<p>
			<span>主演 :</span>
			刘德华 | 姜武 | 宋佳
		</p>
		<p>
			<span>地区语言 :</span>
			香港(普通话、粤语)
		</p>
		<p>
			<span>类型 :</span>
			动作|悬疑|犯罪
		</p>
		<p>
			<span>上映时间</span>
			4月28日上映
		</p>
		<div class="part2">
			 最新警匪动作电影《拆弹专家》（Shock Wave）将于4月份开拍，刘德华担任制作人和主演，由寰宇公司、博纳影业和刘德华的新公司梦造者联合制作，邱礼涛担任导演，投资2300万美元。片中刘德华将饰演一名卧底，追缉炸弹狂徒。预计将在2017年中期上映。之前该片曾曝出的阵容为张家辉、谢霆锋（反派）、张智霖。
		</div>

		<div class="bth" v-on:click="toCinema">立即购票</div>
	</div>

</template>

<style lang="less">
	#detail{
		padding-bottom: .6rem;
		font-size: .24rem;
		background: #f0f0f0;
		color: #333;
		&>img{
			width: 100%;
		}
		.part1{
			font-size: .32rem ;
			margin: .28rem 0 .2rem 0;	
			span{
				display: inline-block;
				width: .3rem;
				background: #e4c89c;
				margin-right: .1rem;				
			}		
		}
		p{
			text-indent: .4rem;
			line-height: .6rem;	
			span{
				margin-right: 0.1rem;
			}
		}
		.part2{
			margin-top: .1rem;
			padding-left: .4rem;
			line-height: .38rem;
			padding-right: .4rem;
		}
		.bth{
			text-align: center;
			margin: .4rem auto;
			margin-bottom: 0;
			font-size: .28rem;
			width: 3.12rem;
			height: .72rem;
			line-height: .72rem;
			border: none;
			background-color: #fe8233;
			padding: 0;
			border-radius: .36rem;
			color: #fff;			
		}
	}
</style>

<script type="text/javascript">

	Com.exports = {
		data:{
			imgSrc:'1.jpg'
		},
		methods:{
			toCinema:function(){
				this.$router.push('/app/cinema');
			}
		},
		mounted:function(){
			var url = this.$router.query.url ;
				url = decodeURIComponent(url);
				this.imgSrc = url ;
				this.setState();
		}
	}
</script>
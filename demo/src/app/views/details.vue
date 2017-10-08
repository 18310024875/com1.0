<template>
	<section>
		<div id="details">
			<img :src="this.$route.query.imgUrl"/>		
			<div class="part1"><span>&nbsp;</span>影片简介</div>
			<p>
				<span>导&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;演 :</span>
				邱礼涛
			</p>
			<p>
				<span>主&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;演 :</span>
				刘德华 | 姜武 | 宋佳
			</p>
			<p>
				<span>地区语言 :</span>
				香港(普通话、粤语)
			</p>
			<p>
				<span>类&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;型 :</span>
				动作|悬疑|犯罪
			</p>
			<p>
				<span>上映时间</span>
				4月28日上映
			</p>
			<div class="part2">
				 最新警匪动作电影《拆弹专家》（Shock Wave）将于4月份开拍，刘德华担任制作人和主演，由寰宇公司、博纳影业和刘德华的新公司梦造者联合制作，邱礼涛担任导演，投资2300万美元。片中刘德华将饰演一名卧底，追缉炸弹狂徒。预计将在2017年中期上映。之前该片曾曝出的阵容为张家辉、谢霆锋（反派）、张智霖。
			</div>

			<div class="bth" @click="toCinema">立即购票</div>
		</div>
	</section>
</template>
<script type="text/javascript">
	export default {
		name:'details',
		mounted(){
			console.log(this.$route.query.imgUrl)
		},
		watch:{
			$route(){
				
			}
		},
		methods:{
			toCinema(){
				this.$router.push('/cinema')
			}
		}
	}
</script>
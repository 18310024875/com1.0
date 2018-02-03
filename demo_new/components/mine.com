<template>
	<div id="mine">
		<div class="part1">
			<div>
				<img src="https://pic.maizuo.com/usr/default/maizuomoren66.jpg"/>
			</div>
			<ul>
				<li>手机用户4875</li>
				<li>ID:216447183</li>
				<li>退出</li>
			</ul>
		</div>
		<div class="part2">
			<h5></h5>
			<div>影票订单<i/><span class="span"><span>0</span>张</span></div>
			<h5></h5>
			<div>影票待付订单<i/><span class="span"><span>0</span>张</span></div>
			<h5></h5>
			<div>商城订单<i/></div>
			<h5></h5>
			<ul>
				<li><span>我的现金券<i/><span class="span"><span>0</span>张</span></span></li>
				<li><span>账户余额<i/><span class="span"><span>0</span>张</span></span></li>
				<li><span>我的卖座卡<i/><span class="span"><span>0</span>张</span></span></li>
			</ul>
			<h5></h5>
			<div>设置<i/></div>
			<h5></h5>
		</div>
	</div>
</template>
<style lang="less">

#mine{
	.part1 {
		height: 3.03rem;
		background: #303030;
		padding: .72rem .24rem .48rem 10%;
		box-sizing: border-box;
		&>div{
			width: 1.84rem;
			height: 1.84rem;
			border-radius: 50%;
			margin-right: .28rem;
			float: left;
			overflow: hidden;	
			img{
				width: 100%;
			}
		} 
		ul{
			float: left;
			color: white;
			margin-top: .32rem;
			li{
				margin-bottom: 0.1rem;
				&:nth-of-type(1){
					font-size: .28rem;
				}
				&:nth-of-type(3){
					cursor: pointer;
					color: #ffbd80;
					text-decoration: underline;
				}
			}
		} 
	}
	.part2{
		h5{
			height: .28rem;
			width: 100%;
			background: #f0f0f0;
		}
	}
}

// less 嵌套不支持 &配合 , ; 需要使用 , 必须排成一排 ;
.part2>div,.part2 li {
	padding: 0 .25rem 0 .35rem;
	line-height: 1.1rem;
	background-color: #fff;
	cursor: pointer;
	font-size: .25rem;
	color: #222;
}
.part2>div i,.part2 li i {
	width: .16rem;
	height: .16rem;
	display: inline-block;
	border: 1px solid #999;
	opacity: .7;
	transform: rotate(45deg);
	border-left: none;
	border-bottom: none;
	float: right;
	margin-top: .45rem;
	margin-right: .1rem;
}
.part2>div>span,.part2 li>span {
	display: block;
	border-bottom: solid 1px #eaeaea;
}
.part2>div .span,.part2 li .span {
	float: right;
	margin-right: .06rem;
}
.part2>div .span span,.part2 li .span span {
	color: #e7a858;
	margin-right: 0.06rem;
}
</style>

<script>

	Com.exports = {

		data:{

		},
		watch:{

		},
		methods:{

		},

		updated:function(){

		},
		mounted:function () {

		},
		beforeDestroy:function(){
	
		}
	}


</script>
<template>
	<header class="app_header">
		<div 
			class="nav_bth" 
			v-on:click="toggleShowMenu">
			<img src="src/images/icon/我的订单.png"/>
		</div>
		<span class="title">{{name}}</span>
		<div 
			class="mine_bth" 
			v-on:click="toMine">
			<img src="src/images/icon/我的聚划算.png"/>
		</div>
		<div 
			class="city" 
			v-on:click="toCitys">
			<span>北京</span>
			<img src="src/images/icon/向下箭头.png"/>
		</div>
	</header>
</template>
<script>

	Com.exports = {
		data:{
			name:'卖座电影'
		},
		watch:{

		},
		methods:{
			toMine:function(){
				this.name='我的卖座';
				this.setState();
				this.$router.push('/app/mine');
			},
			toCitys:function(){
				this.name='所在城市';
				this.setState();
				this.$router.push('/app/citys');
			},
			toggleShowMenu:function(){
				bus.leftMenu.toggleShowMenu();
			},
			setHeaderName( name ){
				this.name = name ;
				this.setState() ;
			}
		},

		updated:function(){

		},
		mounted:function () {
			bus.header = this ;
		}
	}
</script>
<style lang="less">
	.app_header{
		width: 100%;height: 1rem;line-height: 1rem;
		position: absolute;
		left: 0;top: 0;
		z-index: 10;
		background: #282828;
		box-shadow: 0px 1px 1px black;	
		.nav_bth{
			position: relative;
			float: left;
			width: 1rem;
			height: 1rem;
			border-right: 1px solid #222;
			box-shadow: 1px 0 2px #363636;
			img{
				position: absolute;
				width: .5rem;
				left: .25rem;
				top: .25rem;				
			}
		}
		.title{
			float: left;
			margin-left: .4rem;
			color: #efefef;
			text-shadow: 0 -1px 0 #000000;
			max-width: 2.4rem ;
			text-overflow: ellipsis;
			white-space: nowrap;
			overflow: hidden;
		}
		.mine_bth{
			position: relative;
			float: right;
			width: 1rem;
			height: 1rem;	
			img{
				position: absolute;
				width: .4rem;
				left: .3rem;
				top: .3rem;
			}	
		}
		.city {
			float: right;
			height: 1rem;
			color: #999;
			font-size: .27rem;
			span{
				position: relative;
				top: 1px;				
			}
			img{
				width: .25rem;
				vertical-align: middle;
				margin-left: .1rem;				
			}
		}
	}

</style>
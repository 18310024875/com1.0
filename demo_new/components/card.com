<template>
  	<div id="card">
		<div class="card_wrapper">
			<ul class="tit">
				<li v-for="(v,k) in tab" v-bind:class="v.class" v-on:click="changeTab(k)">{{v.name}}</li>
			</ul>

			<div class="box" v-if="tab[0].class">
				<div>
					<div>
						<p>卡号:</p>
						<input placeholder="请输入卡号"/>
					</div>
					<h5></h5>
				</div>
				<div>
					<div>
						<p>密码:</p>
						<input placeholder="请输入密码"/>
					</div>
					<h5></h5>
				</div>
				<div class="bth">查询</div>					
			</div>

			<div class="box" v-if="tab[1].class">
				<div>
					<div>
						<p>卡号:</p>
						<input placeholder="请输入15位电子卡号"/>
					</div>
					<h5></h5>
				</div>
				<div class="bth">查询</div>					
			</div>
		</div>
  	</div>
</template>
<style slang="less">
	#card {
		width: 100%;
		margin: 0 auto;
		.card_wrapper{
			width: 90%;
			margin: 0 auto;
		}
		.tit {
			height: 1rem;
			line-height: 1rem;
			overflow: hidden;
			border-bottom: solid #fe6e00 1px;
			li{
				height: 1rem;
				float: left;
				color: #6a6a6a;
				width: 50%;
				text-align: center;
				box-sizing: border-box;
				font-size: .3rem;
				border-bottom: 3px solid transparent ;			
			}
			.active{
				color: #fe6e00;
				border-bottom: 3px solid #fe6e00;			
			}
		}
		.box{
			.bth{
				width: 3.2rem;
				margin: .9rem auto .6rem;
				border-radius: .36rem;
				background-color: #fe8233;
				height: .72rem;
				color: #fff;
				font-size: .28rem;
				line-height: .72rem;
				text-align: center;
			}
			&>div{
				width: 5.12rem ;
				height: .68rem;
				margin: 0 auto;
				h5{
					height: 5px;
					width: 100%;
					border: 1px solid #ccc;
					border-top: none;
					margin-top: -0.1rem;
				}
				&>div{
					width: 100%;
					overflow: hidden;
					color: #333;
					font-size: .28rem;
					margin-top: .6rem;	
					p{
						line-height: .68rem;
						margin: 0 .3rem 0 .2rem;
						float: left;
					}
					input{
						float: left;
						line-height: .68rem ;
						font-size: .28rem;
						margin-left: 0.15rem;
						height: .6rem;
					}
				}
			}
		}
	}
</style>

<script>

	Com.exports = {

		data:{
			tab:[
				{
					name:'卖座卡',
					class:'active'
				},{
					name:'电子卖座卡',
					class:''
				}
			],
		},
		watch:{

		},
		methods:{
			changeTab:function(k){
				var tab = this.tab ;
				if(k==0){
					if(tab[0].class!='active'){
						tab[0].class = 'active';
						tab[1].class = '';

						this.setState()
					}	
				}else{
					if(tab[1].class!='active'){
						tab[0].class = '';
						tab[1].class = 'active';

						this.setState()
					}
				}
			},
		}

	}


</script>
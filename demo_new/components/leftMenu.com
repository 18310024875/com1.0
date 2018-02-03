<template>
	<div class="app_menu">

		<div class="app_menu_mask" 
			 v-bind:style="{display:display}" 
			 v-on:click="closeMenu">	
		</div>

		<ul class="app_menu_list"
			v-bind:style="{left:left}" 
			v-on:click="closeMenu">
			<li v-for="(v,k) in list">
				<a v-on:click="setHeaderName(v.headerName,v.link)">
					{{v.name}}
					<div className="rt">
						<span></span>
					</div>				
				</a>
			</li>		
		</ul>

	</div>
</template>
<script>

	Com.exports = {

		data:{
			display:'none',
			left:'-100%',
			open:false,
			list:[
				{
					name:'首页',
					link:'/app/home',
					headerName:'卖座电影'
				},
				{
					name:'影片',
					link:'/app/movie/left',
					headerName:'全部影片'
				},
				{
					name:'影院',
					link:'/app/cinema',
					headerName:'全部影院'
				},
				{
					name:'商城',
					link:'/app/shop',
					headerName:'商城'
				},
				{
					name:'我的',
					link:'/app/mine',
					headerName:'我的卖座'
				},
				{
					name:'卖座卡',
					link:'/app/card',
					headerName:'查询/绑定/激活卖座卡'
				},
			]
		},
		watch:{
			display(j,k){
				// console.log(j,k)
			}
		},
		methods:{
			closeMenu:function(){
				this.display = 'none' ;
				this.left = '-100%' ;
				this.setState();
				this.open = false ;
			},
			showMenu:function(){
				this.display = 'block' ;
				this.left = '0%' ;
				this.setState();
				this.open = true ;
			},
			toggleShowMenu:function(){
				this.open ? this.closeMenu() : this.showMenu() ;
			},
			setHeaderName:function( name , link ){
				
				bus.header.setHeaderName(name)

				var this_ = this ;
				if( location.hash!=link ){
					setTimeout(function(){
						this_.$router.push(link);
					},300);
				}
			}
		},

		updated:function(){

		},
		mounted:function () {
			bus.leftMenu = this ;
		}	
	}
</script>
<style lang="less">
	.app_menu{
		height: 100%;
		margin-top: 1rem;
		.app_menu_mask{
			position: fixed;
			z-index: 100;
			top: 1rem;
			bottom: 0;
			left: 0;
			right: 0;
			background: rgba(0, 0, 0, 0.5);
			transition: all 0.2s ease-in-out;
		}
		.app_menu_list{
			position: fixed;
			z-index: 101;
			top: 1rem;
			bottom: 0;
			width: 65%;
			background: #282828;
			transition: all 0.4s ease-in-out;
			li{
				width: 100%;
				border-bottom: 1px dotted #333;
				height: 1rem;
				line-height: 1rem;
				color: #999;
				font-size: .28rem;	
				&:nth-of-type(1){
					border-top: 1px solid #333;
				}	
				a{
					display: block;
					padding: 0 .33rem;
					color: #999;
					.rt{
						height: 100%;
						float: right;
						span{
							width: 7px;
							height: 7px;
							display: inline-block;
							border: 1px solid #999;
							transform: rotate(45deg);
							border-left: none;
							border-bottom: none;							
						}
					}
				}	
			}

		}
	}
</style>
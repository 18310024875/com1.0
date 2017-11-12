<template>
	<div id="leftMenu">

		<div id="mask" v-bind:style="{display:display}" v-on:click="closeMenu"></div>

		<ul id="menu" v-bind:style="{left:left}" v-on:click="closeMenu">

		  <template>
			<li v-for="(v,k) in arr" >
				<a v-on:click="setHeaderName(v.headerName,v.link)">
					{{v.name}}
					<div className="rt"><span></span></div>				
				</a>
			</li>		
		  </template>

		</ul>
	</div>
</template>
<style scoped="#leftMenu">
	#mask {
	  position: fixed;
	  z-index: 100;
	  top: 1rem;
	  bottom: 0;
	  left: 0;
	  right: 0;
	  background: rgba(0, 0, 0, 0.5);
	  transition: all 0.2s ease-in-out;
	}
	#menu {
	  position: fixed;
	  z-index: 101;
	  top: 1rem;
	  bottom: 0;
	  width: 65%;
	  background: #282828;
	  transition: all 0.4s ease-in-out;
	}
	#menu li {
	  display: block;
	  width: 100%;
	  border-bottom: 1px dotted #333;
	  height: 1rem;
	  line-height: 1rem;
	  color: #999;
	  font-size: .28rem;
	}
	#menu li:nth-of-type(1){
	  border-top: 1px solid #333;
	}
	#menu li a {
	  display: block;
	  padding: 0 .33rem;
	  color: #999;
	}
	#menu li a .rt {
	  height: 100%;
	  float: right;
	}
	#menu li a .rt span {
	  width: 7px;
	  height: 7px;
	  display: inline-block;
	  border: 1px solid #999;
	  transform: rotate(45deg);
	  border-left: none;
	  border-bottom: none;
	}
</style>

<script>

	var isShow = false ; 

	Com.exports = {

		data:{
			display:'none',
			left:'-100%',
			arr:[
				{
					name:'首页',
					link:'#home',
					headerName:'卖座电影'
				},
				{
					name:'影片',
					link:'#movie',
					headerName:'全部影片'
				},
				{
					name:'影院',
					link:'#cinema',
					headerName:'全部影院'
				},
				{
					name:'商城',
					link:'#shop',
					headerName:'商城'
				},
				{
					name:'我的',
					link:'#mine',
					headerName:'我的'
				},
				{
					name:'卖座卡',
					link:'#card',
					headerName:'查询/绑定/激活卖座卡'
				},
			]
		},
		watch:{

		},
		methods:{
			closeMenu:function(){
				this.display = 'none' ;
				this.left = '-100%' ;
				this.setState();
				isShow = false ;
			},
			showMenu:function(){
				this.display = 'block' ;
				this.left = '0%' ;
				this.setState();
				isShow = true ;
			},
			toggleShowMenu:function(){
				isShow ? this.closeMenu() : this.showMenu() ;
			},
			setHeaderName:function( ags){
				var name = ags[0]
				var link = ags[1]
				bus.header.setHeaderName(name)
				
				if( location.hash!=link ){
					setTimeout(function(){
						location.hash = link ;
					},300);
				}
			}
		},

		updated:function(){

		},
		mounted:function () {
			// 因为组件不能通讯 , 所以在挂载后添加到全局 ;
			bus.leftMenu = this ;
		}	
	}


</script>
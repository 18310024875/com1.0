<template>
	<div class="cover_mask_menu">
		<span style="display:none">{{$state.menu}}</span>
		<div id="mask" :style="{display:display}"></div>
		<ul id="menu" :style="{transform:'translate3d'+tran,opacity:opacity}">
			<h1></h1>
			<li v-for="(v,k) in arr" @click="closeIt(headerName[k])">
				<router-link :to="link[k]">
					{{v}}
					<div className="rt"><span></span></div>				
				</router-link>
			</li>
		</ul>
	</div>
</template>
<script type="text/javascript">
	export default {
		name:'nav',
		data(){
			return {
				arr:['首页','影片','影院','商城','我的','卖座卡'],
				link:['/home','/movie','/cinema','/shop','/mine','/card'],
				headerName:['卖座电影','卖座电影','全部影院','卖座商城',
					'我的','查询/绑定/激活卖座卡'],
				display:'none',
				tran:'(-101%,0,0)',
				opacity:'.3',
			}
		},
		methods:{
			closeIt(name){
				this.$commit('changeMenu')
				this.$commit('changeHeaderName',name)
			}
		},
		updated(){
			let pd = this.$state.menu ;
			if(pd){
				this.display='block'
				this.tran="(0,0,0)"
				this.opacity='1'				
			}else{
				this.display='none'
				this.tran="(-101%,0,0)"
				this.opacity='.3'
			}
		}
	}
</script>
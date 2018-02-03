<template>
	<div id="movie">
		<div class="movie_wrapper">
				
			<ul class="tit">
				<li v-for="(v,k) in tab" 
					v-bind:class="v.class" 
					v-on:click="changeTab(k)">{{v.name}}</li>				
			</ul>

			<router-view></router-view>

		</div>
	</div>
</template>
<script>

	Com.exports = {
		data:{
			tab:[
				{
					name:'正在热映',
					class:''
				},{
					name:'即将上映',
					class:''
				}
			]
		},
		watch:{

		},
		mounted(){
			// 设置默认选中tab ;
			var query = this.$router.query ;
			var activeIndex = ( query.active=='1'? 1 : 0 ) ;
			
			this.tab[ activeIndex ].class='active';
			this.setState();
		},
		methods:{
			changeTab:function( k ){
				var tab = this.tab ;
				if(k==0){
					if(tab[0].class!='active'){
						tab[0].class = 'active';
						tab[1].class = '';
						this.arr = [] ;
						this.setState();
						this.$router.push('/app/movie/left');
					}	
				}else{
					if(tab[1].class!='active'){
						tab[0].class = '';
						tab[1].class = 'active';
						this.arr = [] ;
						this.setState();
						this.$router.push('/app/movie/right');
					}
				}
			}
		}
	}

</script>
<style lang="less">
	#movie {
		width: 100%;
		margin: 0 auto;
		.movie_wrapper{
			width: 90%;
			margin: 0 auto;			
		}
		.tit{
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
	}
</style>
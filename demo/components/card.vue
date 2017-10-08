<template>
  	<div id="card">
		<div class="card_wrapper">
			<ul class="tit">
				<template>
					<li v-for="(v,k) in tab" v-bind:class="v.class" v-on:click="changeTab(k)">{{v.name}}</li>
				</template>
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
<style scoped="#mine" >

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
			changeTab:function(ags){
				var act = ags[0];
				var tab = this.tab ;
				if(ags==0){
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
<template>
  <section id="card">
	<div class="card_wrapper">
		<ul class="tit">
			<li :class="tab[0]" @click="change_tab(0)">卖座卡</li>
			<li :class="tab[1]" @click="change_tab(1)">电子卖座卡</li>
		</ul>

		<div class="box" v-if="tab[0]=='active'">
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

		<div class="box" v-if="tab[1]=='active'">
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
  </section>
</template>
<script type="text/javascript">
	export default {
		name:'card',
		data(){
			return {
				tab:['active','']
			}
		},
		methods:{
			change_tab(ind){
				// 过滤点击
				if(this.tab[ind]=='active'){return}
				let i = this.tab.indexOf('active')
				this.$set(this.tab,i,'')
				this.$set(this.tab,ind,'active')
			}
		}
	}
</script>
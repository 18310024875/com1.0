<template>
	<section id="cinema">
		<div v-for="(v,k) in address">
			<div class="div" @click="show(k)">{{v}}</div>
			<ul v-if="address_click[k]">
				<li v-for="(v2,k2) in cinemas[k]">
					<h6></h6>
					<div><p>{{v2.name}}</p><span>座</span><span>通</span></div>

					<div v-if="v2.labels[0]">
						<h5 class="h2" v-if="v2.labels[0].name=='优惠活动'">优惠活动</h5>
						<div v-if="v2.labels.length==2">
							<h5 class="h1">可乐爆米花</h5> 
							<h5 class="h2">优惠活动</h5>
						</div>					
					</div>

					<p class="p1">{{v2.address}}</p>
					<p class="p2">位置距离</p>
				</li>
			</ul>
		</div>
	</section>
</template>
<script type="text/javascript">
	export default {
		name:'cinema',
		data(){
			return{
				address:['密云县','朝阳区','西城区','海淀区','大兴区','东城区',
						 '昌平区', '丰台区','房山区','平谷区','顺义区','石景山区',
						 '门头沟区','通州区','黄岛区','怀柔区','下城区','延庆县'],
				address_click:[],
				cinemas:[]
			}
		},
		methods:{
			show(ind){
				let ok = !this.address_click[ind]
				this.$set(this.address_click,ind,ok)
			}
		},
		mounted(){
			$get('cinema.json',(res)=>{
				let arr = res.data.cinemas;
				
			  // 构造新数组
				let c_arr = [] ;
				let span_arr = []
				for(let i=0;i<18;i++){
					c_arr.push([])
					span_arr.push(false)
				}

				arr.map((v,k)=>{
					let i = this.address.indexOf(v.district.name) ;
						i!=-1?c_arr[i].push(v):null ;
				})
				this.cinemas = c_arr ;
				this.address_click = span_arr ;
				console.log(this.address_click)
			})
		}
	}
</script>
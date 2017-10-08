<template>

	<div id="citys">
		<p>GPS定位你所在城市</p>
		<p>北京</p>
		<p>热门城市</p>
		<ul>
			<template>
				<li v-for="(v,k) in imp" >{{v}}</li>
			</template>
		</ul>
		<p>按字母排序</p>
		<ul>
			<template>
				<li v-for="(v,k) in arr" >
					{{v}}
				</li>
			</template>
		</ul>
		<template>
			<div v-for="(v,k) in arr">
				<p class="citys_p">{{v}}</p>
				<ul>
					<li v-for="(v2,k2) in citys[k]" >
						{{v2.name}}
					</li>					
				</ul>
			</div>	
		</template>
	</div>

</template>
<script type="text/javascript">

	Com.exports = {
		data:{
			imp:['北京','上海','广州','深圳'],
			arr:['A','B','C','D','E','F','G','H','J','K','L','M','N',
				'P','Q','R','S','T','W','X','Y','Z'],
			citys:[],	
		},
		methods:{

		},
		mounted:function(){
			var this_ = this ;
			$get('citys.json',function(res){
				// 重构数组
				var  arr=[] ;
				this_.arr.map((v,k)=>{
					arr.push([])
				})
				res.data.cities.map((v,k)=>{
					let pinyin = v.pinyin[0] ;
					let i = this_.arr.indexOf(pinyin) ;
					arr[i].push(v)
				})
				this_.citys = arr ;

				this_.setState();
			})
		}
	}
</script>
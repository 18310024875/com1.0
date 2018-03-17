<template>

	<div id="citys">
		<p>GPS定位你所在城市</p>
		<p>北京</p>
		<p>热门城市</p>
		<ul>
			<li v-for="(v,k) in imp" >{{v}}</li>
		</ul>
		<p>按字母排序</p>
		<ul>
			<li v-for="(v,k) in arr" >
				{{v}}
			</li>
		</ul>
			<div v-for="(v,k) in arr">
				<p class="citys_p">{{v}}</p>
				<ul>
					<li v-for="(v2,k2) in citys[k]" >
						{{v2.name}}
					</li>					
				</ul>
			</div>
	</div>

</template>

<style lang="less">
	#citys{
		p{
			height: .8rem;
			background: #ebebeb;
			padding-left: .32rem;
			line-height: .8rem;
			font-size: .28rem;
			font-weight: bold;
			color: #333;
		}
		// 这是个问题 , 目前先这么用吧 !!!;
		&>p:nth-of-type(1),#citys>p:nth-of-type(3),#citys>p:nth-of-type(4){
			font-weight: normal;
		}
		&>p:nth-of-type(2){
			background: white;
			font-size: .32rem;
			font-weight: normal;
			color: #e2941a;
			height: .94rem;
			line-height: .94rem;
			padding-left: .5rem;
		}
		ul{
			overflow: hidden;
			width: 100%;	
			li{
				height: .94rem;
				line-height: .94rem;
				color: #838383;
				font-size: .32rem;
				width: 25%;
				text-align: center;
				float: left;
				border-bottom: #ebebeb 1px solid;
				text-overflow: ellipsis;
				white-space: nowrap;
				overflow: hidden;
			}
		}
	}
</style>

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
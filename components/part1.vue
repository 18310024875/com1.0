<template>
	<div 
		v-bind:class="[c1,c2,obj.class]"
		v-bind:ok="width_" 
		v-bind:ok1="width_" 
		v-bind:ok2="width_" 
		v-bind:attrddd="ddd"
		v-bind:attrddd2="ddd"
		v-bind:id="items.b.name"
		v-bind:ididid="arr[2]"
		v-bind:iiiiiiid="arr[1]"
		v-bind:style="{width:fff[0].wid,height:height_,background:background}"
		style="font-size:20px" 
		class="ppp" 
	>
		<my_son></my_son>

		<template>
			<ul v-for="(v,k) in arr" v-bind:key="k">
				{{v}} 是吧 {{k}}
				<my_son></my_son>
			</ul>
		</template>

		<template>
			<ul v-for="(v,k) in items" 
				v-bind:keykkk="k" 
				v-bind:style="{width:width2_,background:bac}"
				style="line-height:30px" 
			>
				<h3 v-for="(v2,k2) in v" v-bind:style="background:bac2">
					{{k2}} = {{v2}}
					外层 {{width_}}

					<h6 v-for="(v3,k3) in items.b" v-bind:style="background:bac3">
						{{k3}} = {{v3}}
					</h6>
				</h3>
				<div style="background:red">{{v.name}}是啊</div>
			</ul>
		</template>
	</div>
</template>
<style scoped='#ok'>
	div{width:500px;background: pink;opacity: .7;font-size: 20px}
	h2{color: red}
	#wrapper>h1{
		line-height: 50px;background: #f0f0f0;
	}
	h5{background: pink}
</style>

<script>
	function ok(){
		alert(0)
	}
	Com.exports = {
		components:{
			my_son:'son1'
		},
		data:{
			arr:[1,2,'3arr',4,5,6],
			do:{
				key:1
			},
			// arr3:[
			// 	{
			// 		name:'name111',
			// 		tall:'一米八',
			// 		key:1
			// 	},
			// 	{
			// 		name:'name222',
			// 		tall:'一米九',
			// 		key:2
			// 	}
			// ],
			// arr3:[
			// 	'aaa','bbb'
			// ],
			arr3:{
				a:{name:'aaaaa'},
				b:{name:'bbbbb'}
			},
			arr4:['41',
			[{
				name:'42'
			},{
				name:'42.5'
			}],
			[{},{
				name:'43'
			}],
			'44'],

			fff:[{
				wid:'998px'
			}],
			c1:'c11',
			c2:'c22',
			c3:'c33',
			c4:'c44',
			val:'3',
			background:'orange',
			class_3:'class_3asdadad',
			value_:'value____',
			height_:'200px',
			name:'jack',
			age:'18岁',
			tall:'160cm',
			width_:'100px',
			width__:'100px',
			dis:'dis___',
			dis2:'dis2_____',
			open:'open___',
			aaa:'aaa___',
			www:'components/b.png',
			imgW:'10px',
			placeholder1:'111111',
			placeholder2:'222222',
			ss:'components/pointitle.png',
			ddd:'12321px',
			obj:{
				name:'KKKKKKKKK',
				class:'lllll'
			},
			width2_:'300px',
			bac:'#f0f0f0',
			bac2:'#999',
			bac3:'#555',
			items:{
				a:{
					name:'lucy',
					age:50,
					tall:'150cm',
					ok:'okokok',
				},
				b:{
					name:'james',
					age:100,
					tall:'203cm'
				}
			},
			imgH:'70px',
			arr2:[8,9,10,11]
		},
		watch:{
			name:function(){
				return {}
			}
		},
		el:'body',
		mounted:function () {

		}
	}


</script>
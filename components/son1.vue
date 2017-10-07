<template>

	<div id="son1">
		<template>
			<ul v-for="(v,k) in arr" v-if="v.ifif" v-on:click="click(v,k)">
				{{v.name}}
			</ul>			
		</template>

		<h1>
			name={{name}}
			age={{age}}
			tall={{tall}}
		</h1>	
	</div>

</template>
<style type="text/css" scoped='#son1'>
	h1 {
		background: green
	}
</style>
<script type="text/javascript">
	Com.exports = {
		data:{
			name: '他妈的,成功了;;;',
			age:222,
			tall:'190com',
			arr:[
				{
					name:'name1111',
					ifif:true
				},
				{
					name:'name2222',
					ifif:true
				},
				{
					name:'name3333',
					ifif:true
				}
			]
		},
		watch:{
			age:function (n,o) {
				error(n,o)
			},
			name:function(n,o){
				error(n,o)
			}
		},
		methods:{
			click:function(vals,e){
				log(vals,e)
			}
		},
		mounted(){

		},
		updated(){
			error(this)
		}
	}
</script>
var c = {
	props:['rr'],
	data(){
		return {name:'ccccccc'}
	},
	render(){
		return (<div><h1>{this.name}</h1></div>)
	},
	mounted(){
		console.log(this.$props)
	}
}




export default {
	props:['op'],
	data() {
		return {
			name:'jaxlkkll'
		}
	},
// *** 设置这个属性之后 才可以有 context 对象 !!! ;
	functional: true,
	components:{
		c
	},
	render(h,context){
		console.log(context)
		console.log(context.data)
		var it = 'it_____'
		return (
			<div class="__it" style="height:100px;background:red" it={it}>
				{it}
			</div>)
	}
}

// var a={
// 	name:'asdasd'
// }
// var b = {
// 	age:10
// }
// console.log({...a,...b})
Com.config = {
	part1:'./components/part1.vue',
	son1:'./components/son1.vue',

	main:'./components/main.vue',
	main2:'./components/main2.vue',
}




var routes = [
	{path:'main',component:'main',default:true},
	{path:'main2',component:'main2'},
]

Com.require('part1',function( options ){
	// new跟组件 ; 
	window.ok = new Component( options )
	// 挂载路由  ;
	Com.router.run(routes)
})

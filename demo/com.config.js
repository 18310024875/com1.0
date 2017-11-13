
Com.config = {
	// 固定组件
	app:'./components/app.vue',
	header:'./components/header.vue',
	leftMenu:'./components/leftMenu.vue',
	// 路由组件
	home:'./components/home.vue',
	movie:'./components/movie.vue',
	cinema:'./components/cinema.vue',
	shop:'./components/shop.vue',
	mine:'./components/mine.vue',
	card:'./components/card.vue',
	citys:'./components/citys.vue',
	detail:'./components/detail.vue',
}


var routes = [
	{path:'home',component:'home',default:true},
	{path:'movie',component:'movie'},
	{path:'cinema',component:'cinema'},
	{path:'shop',component:'shop'},
	{path:'mine',component:'mine'},
	{path:'card',component:'card'},
	{path:'citys',component:'citys'},
	{path:'detail',component:'detail'},
];

// 根组件 ;
Com.require('app',function( options ){
	// new跟组件实例 ;
	window.app = new Com( options ) ;
	// 挂载路由  ;
	Com.router.beforeRun(function(){
		try{
			$('#main').get(0).scrollTop = 0 ;
		}catch(e){}
	}).run(routes)
})

Com.config = {
	part1:'./components/part1.vue',
	son1:'./components/son1.vue'
}


Com.require('part1',function( options ){
	window.ok = new Component( options )
})

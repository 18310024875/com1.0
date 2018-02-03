服务器打开index.html ;

标签必须要有结尾标签 例如 `<img src="" />`

支持路由 , 可嵌套 ;
支持less ;
支持v-bind , v-on ;
支持v-if
		(v-if相当于Vue的v-show);

支持v-for 语法
		(
			v-for语法 必须是 (val , k) in items ; 不支持 item in items ;
			v-for 语法不支持[[]] 嵌套 静态属性不支持["key"] 请用.key 动态属性可以[key]
		  	[]内可以带.
	  	);

{{}}内不能做判断 ;
	所有绑定的data 都是静态的 不能像Vue一样 不支持!例如: `<div v-for="(v,k) in items" ref="'key_'+k"></div> `; 


模块开发
导出为 Com.exports = {
	
}
导入为 Com.require(...,function( res ){
	var app = new Com( res );
})	
也可直接传入对象 ;

new Com({
	template:"........." ,
	data:{

	},
})

生命周期 mounted , updated ,destroyed ,beforeDestroy;

组件暂不支持 props 通讯 , 可以通过类似 eventBus 之类的方法 mounted后存this到对象中 ;

Jquery 只是我的工具 没什么卵用 大家不要吐槽 ;


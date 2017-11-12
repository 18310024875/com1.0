服务器打开index.html ;

标签必须要有结尾标签呀!!!!!!!!!!!!!!!!!!!!!!!!!!! `<img src="" />`
v-for 必须是 (item , index) in items ; 不支持 item in items ;


属性绑定只能用 "" 例如 v-on:click="....."

路由暂时不支持嵌套 ;

{{}}内不能做判断 ;
所有绑定的data 都是静态的 不能像Vue一样 不支持!例如: `<div v-for="(v,k) in items" ref="'key_'+k"></div> `; 
!!! 这种语法会报错---- 想使用需要在绑定之前构造 添加新属性才行 ;


框架为ajax请求文件 以什么结尾都可以  ;

使用组件需要现在 Com.config.js 中注册{
	component1 : url1 ,
	component2 : url2
}; 
导出为 Com.exports = {
	
}


`<style scoped="#someId"> ... </style>`
在解析 css时候 会把所有样式前 添加scoped内的前缀 可以实现css模块化 ;

使用v-for 需要在最外层的 v-for 套上`<template></template>`标签 ; 
v-for 语法不支持[[]] 嵌套 静态属性不支持["key"] 请用.key 动态属性可以[key]
[]内可以带.

组件嵌套 需要先在 Com.config 中注册

子组件目前不能通讯 ; 切不能绑定属性 ;
改变 子组件 $data 在调用 this.setState() 会响应变化 ;
组件的domTree 没有响应到父级组件 ;所以子组件改变 data 父组件 setState不会变化 ;

支持ref ;
支持v-if !!!!! 这里的v-if 只是控制显示隐藏 === Vue中的v-show (太难不会写) ;
v-if 如果和绑定的 style冲突 , 会按照 style 解析( 别问我为什么 ) ;

组件 data不是函数 所以不能再内部做判断 ;
生命周期 mounted , updated ,destroyed ,beforeDestroy;

//不支持 computed 可以在生命周期计算 ;

methods中只可以传递data中存在的或者for循环中的属性 ;不支持直接传递数组对象 例如 v-on:click([1,2,3],'name') ; 静态属性不支持传递也没有必要传递
同时 methods方法接受的参数为( ags , e )
ags为数组 ; e是事件 ;
例如 v-on:click=handleClick(k1,k2,k3) 
methods:{
	handleClick:function( ags , e)
	var k1 = ags[0] ;
	var k2 = ags[1] ;
	var k3 = ags[3] ;
};
 
组件目前不能通过props通讯 , 只能借助全局对象 ;

Jquery 只是我的工具 没什么卵用 大家不要吐槽 ;

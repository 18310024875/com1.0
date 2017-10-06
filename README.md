服务器打开index.html ;

{{}}内不能做判断 ;

框架为ajax请求文件 以什么结尾都可以 

使用组件需要现在 Com.config.js 中注册{
	component1 : url1 ,
	component2 : url2
}; 
导出为 Com.exports = {
	
}

<style scoped="#someId"> ... </style>
在解析 css时候 会把所有样式前 添加scoped内的前缀 可以实现css模块化 ;

v-for 语法不支持[[]] 嵌套 静态属性不支持["key"] 请用.key 动态属性可以[key]
[]内可以带.

组件嵌套 需要先在 Com.config 中注册

改变 子组件 $data 在调用 this.setState() 会响应变化 ;
组件的domTree 没有响应到父级组件 ;所以子组件改变 data 父组件 setState不会变化 ;

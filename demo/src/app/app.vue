<template>
	<div id="app">
		<slot name="header"></slot>
		<slot name="main"></slot>
	</div>
</template>
<script type="text/javascript">
	export default {
		name:'app'
	}
</script>
// src/components/HelloWorld.vue
<template>
	<div class="hello-world">
		<h1>{{ title }}</h1>
		<button @click="incrementCount">Clicked: {{ count }} times</button>
		<p>{{ message }}</p>
	</div>
</template>

<script>
	export default {
	name: 'HelloWorld',
	data() {
	return {
	title: 'Welcome to Your Vue.js App',
	count: 0,
	message: 'This is your first Vue component!'
	}
	},
	methods: {
	incrementCount() {
	this.count++
	}
	}
	}
</script>

<style scoped="">
	.hello-world {
	text-align: center;
	margin-top: 60px;
	}

	button {
	padding: 10px 20px;
	font-size: 16px;
	margin: 20px;
	cursor: pointer;
	}
</style>
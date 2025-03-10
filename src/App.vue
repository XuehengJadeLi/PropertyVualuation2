<!-- App.vue -->
<template>
	<div id="app">
		<CesiumViewer />
	</div>
</template>

<script>
	import CesiumViewer from './components/CesiumViewer.vue'

	export default {
	name: 'App',
	components: {
	CesiumViewer
	}
	}
</script>

<style>
	#app {
	margin: 0;
	padding: 0;
	width: 100%;
	height: 100vh;
	}
</style>
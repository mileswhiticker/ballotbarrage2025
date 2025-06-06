<script setup lang="ts">
	import PlayerPanels from '@components/PlayerPanels.vue';
</script>

<template>
	<div id="topPanel">
		<PlayerPanels />
	</div>
</template>

<style scoped>
	#topPanel {
		opacity: 0.5;
		grid-row-start: 1;
		grid-row-end: 1;
	}
</style>

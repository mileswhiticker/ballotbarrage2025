<script setup lang="ts">
	import { ref, watchEffect, computed } from 'vue';
	import BottomPanel from './BottomPanel.vue';
	const props = defineProps<{
		gameWindowWidth: Ref<number>,
		gameWindowHeight: Ref<number>
	}>();

	watchEffect(() => {
		//console.log(`${props.gameWindowWidth},${props.gameWindowHeight}`, props.gameWindowWidth, props.gameWindowHeight);
	});

</script>

<template>
	<div id="gameInterface">
		<BottomPanel />
	</div>
</template>

<style scoped>
div
{
	display: grid;
	grid-template-rows: 4fr 100px;
	position: absolute;
	width: 100%;
	height: 100%;
}
#bottomPanel
{
	background-color: purple;
	grid-row-start: 2;
}
</style>

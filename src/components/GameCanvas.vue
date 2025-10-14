<script setup lang="ts">
	import { watchEffect } from 'vue';
	// import { type PlayerInfo } from '@game/Player.ts';

	defineProps<{
		// canvasWidth: Ref<number>,
		// canvasHeight: Ref<number>
		canvasWidth: number,
		canvasHeight: number
	}>();

	watchEffect(() => {
		//console.log(`${props.canvasWidth},${props.canvasHeight}`, props.canvasWidth, props.canvasHeight);
	});
</script>

<template>
    <canvas id="gameCanvas" :width=canvasWidth :height=canvasHeight></canvas>
</template>

<style scoped>
canvas{
	position: absolute;
}
</style>

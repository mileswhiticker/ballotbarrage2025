<script setup lang="ts">
	import { ref, watchEffect } from 'vue';
	const props = defineProps<{
		canvasWidth: Ref<number>,
		canvasHeight: Ref<number>
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

<script setup lang="ts">
	import GameCanvas from '@components/GameCanvas.vue';
	import GameInterface from '@components/GameInterface.vue';
	import { onMounted, onUnmounted, ref, computed, watchEffect } from 'vue';
	import { PlayerInfo } from '@game/Player.ts';
	import playerController from '@game/PlayerController';
	
	let gameWindowWidth = ref(0);
	let gameWindowHeight = ref(0);

	let canvasWidth = ref(0);
	let canvasHeight = ref(0);

	function resizeCanvas() {
		//grab the new window size
		let newWidth = window.innerWidth - 4;
		let newHeight = window.innerHeight - 4;	//4 pixels offset to stop scroll bar

		//do we have a header element on the page? we need to take that into account
		const header_element = document.getElementById("header");
		if (header_element) {
			//take this into account when calculating the new size
			const rect = header_element.getBoundingClientRect();
			const headerHeight = rect.height;
			newHeight -= headerHeight;
			//console.log("adjusting by header height: " + headerHeight,rect);
		}

		//maintain 4:3 dimensions by constraining width or height if necessary
		newHeight = Math.min(newHeight, 3 * newWidth / 4);
		newWidth = Math.min(newWidth, 4 * newHeight / 3);

		canvasWidth.value = newWidth;
		canvasHeight.value = newHeight - 100;

		gameWindowWidth.value = newWidth;
		gameWindowHeight.value = newHeight;
		//console.log(`${canvasWidth.value},${canvasHeight.value}`,canvasWidth,canvasHeight);
	}

	onMounted(() => {
		resizeCanvas()
		window.addEventListener('resize', resizeCanvas)
	})

	onUnmounted(() => {
		window.removeEventListener('resize', resizeCanvas)
	})
	
	const width = computed(() => `${gameWindowWidth.value}px`);
	const height = computed(() => `${gameWindowHeight.value}px`);

	const currentPlayer = computed(() => playerController.getCurrentPlayer());
	
	watchEffect(() => {
		//console.log(`${width.value},${height.value}`);
	});
</script>

<template>
	<div id="gameWrapper" :style="{width, height}">
		<GameCanvas :canvasWidth :canvasHeight />
		<GameInterface :gameWindowWidth :gameWindowHeight :playerInfo={currentPlayer} />
	</div>
</template>

<style scoped>
div {
	position: absolute;
}
</style>

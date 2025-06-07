<script setup lang="ts">
	import { computed, onMounted, ref, Ref } from 'vue';
	import { renderTimer, initialiseTimer, sampleTimerdata, SetTimerData } from '@utils/Timer.ts';
	import Vector2 from '@utils/Vector2.ts';
	import Timer from '@utils/Timer.ts';
	import gameController from '@controllers/GameController.ts';

	const timerCanvas = ref<HTMLCanvasElement | null>(null);
	let gameTimer: Ref<Timer | null> = ref(null);
	const textBgColor = computed(() => {
		if (gameTimer.value) {
			//console.log("new color:", gameTimer.value.currentColour);
			return gameTimer.value.currentColour;
		}
		//console.log('default colour');
		return "#000000"
	});

	onMounted(() => {
		gameTimer.value = gameController.timer;
		//console.log(gameTimer);
		gameTimer.value.Initialise(
			timerCanvas.value.getContext('2d'),
			new Vector2(25, 25),
			new Vector2(50, 50));
	});
</script>

<template>
	<div>
		<canvas ref="timerCanvas" width="50" height="50"></canvas>
		<div id="textTime" :style="{backgroundColor: textBgColor}">{{gameTimer?.formattedTimeLeft}}</div>
	</div>
</template>

<style scoped>
	#timer {
		width: 50px;
		height: 100px;
	}
	#textTime{
/*		background-color: yellow;*/
		color: black;
	}
</style>

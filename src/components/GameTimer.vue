<script setup lang="ts">
import {computed, onMounted, ref, type Ref} from 'vue';
	// import { renderTimer, initialiseTimer, sampleTimerdata, SetTimerData } from '@utils/Timer.ts';
	import Vector2 from '@utils/Vector2.ts';
	import Timer from '@utils/Timer.ts';
	import gameController from '@controllers/GameController.ts';

	const timerCanvas = ref<HTMLCanvasElement | null>(null);
	const gameTimer: Ref<Timer | null> = ref(null);
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
		// console.log("gameTimer onMounted", gameTimer.value);
		if (timerCanvas.value) {
			gameTimer.value.Initialise(
				timerCanvas.value.getContext('2d') as CanvasRenderingContext2D,
				new Vector2(25, 25),
				new Vector2(50, 50));
		} else {
			console.error("Could not initialise timer due to null canvas");
		}
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

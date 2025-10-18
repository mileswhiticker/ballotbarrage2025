<script setup lang="ts">
import appController, { GAMESCENE } from '@controllers/AppController.ts';
import { FwbButton } from "flowbite-vue";
import {EnemyWave} from "@controllers/EnemyController.ts";
import WaveEnemyDef from "@components/WaveEnemyDef.vue";
import {ref} from "vue";

	export interface SceneRoundPreProps {
		enemyWaves: EnemyWave[];
	}
	defineProps<SceneRoundPreProps>();

	function handleClick() {
		appController.changeScene(GAMESCENE.ROUND_ACTIVE);
	}

	const waveSelectIndex = ref(0);

	function onClickWave(waveIndex: number){
		waveSelectIndex.value=waveIndex;
	}

</script>

<template>
	<div class="flex flex-row justify-center">
		<div v-for="(waveDef, index) in enemyWaves" :key="index" @click="onClickWave(index)"
			 :class="{ 'transform scale-110 z-1': index===waveSelectIndex, ' z-0': index!=waveSelectIndex}"
			 class="relative flex justify-center bg-white border border-gray-200 rounded-lg shadow-sm md:flex-row w-40 dark:border-gray-700 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 hover:cursor-pointer">
			<div class="p-4 leading-normal items-center">
				<h5 v-if="index > 0" class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Wave {{index}}</h5>
				<h5 v-else class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white pulse-text">Next wave</h5>
			</div>
		</div>
	</div>
	<div class="mb-4 flex flex-row justify-center font-bold text-lg p-4 flex-col">
		<div class="w-100">
		<h1 v-if="waveSelectIndex ===0">Incoming wave of punters:</h1>
		<h1 v-else>Wave {{waveSelectIndex}} of upcoming punters:</h1>
		<em>Mobs: {{enemyWaves[waveSelectIndex].totalMobs}}, estimated difficulty: {{enemyWaves[waveSelectIndex].totalDifficulty}}</em>
		</div>
	</div>
	<div v-if="waveSelectIndex >= 0 && waveSelectIndex < enemyWaves.length">
		<div class="mb-4 flex flex-wrap justify-center font-bold text-lg p-4">
			<div v-for="(enemyDef, index) in enemyWaves[waveSelectIndex].enemyDefs" :key="index" class="m3">
				<WaveEnemyDef :waveEnemyDef="enemyDef"></WaveEnemyDef>
			</div>
		</div>
	</div>
	<div v-else>
		<h2>No punters in this wave.</h2>
	</div>
	<div class="mb-4 flex justify-center font-bold text-lg p-4">
		<fwb-button size="lg" @click="handleClick()" :disabled="waveSelectIndex!=0" :color="waveSelectIndex!=0 ? 'alternative' : 'default'"
		>Begin round</fwb-button>
	</div>
</template>

<style scoped>
.pulse-text{
	color: white;
	text-shadow: 0 0 6px rgba(255,255,255,0.9), 0 0 18px rgba(255,255,255,0.6);
	animation: textPulse 2s ease-in-out infinite;
}

@keyframes textPulse {
	0%   { text-shadow: 0 0 4px rgba(255,255,255,0.85), 0 0 10px rgba(255,255,255,0.4); transform: translateZ(0); }
	50%  { text-shadow: 0 0 14px rgba(255,255,255,1), 0 0 30px rgba(255,255,255,0.6); }
	100% { text-shadow: 0 0 4px rgba(255,255,255,0.85), 0 0 10px rgba(255,255,255,0.4); }
}

@media (prefers-reduced-motion: reduce){
	.pulse-text { animation: none; text-shadow: 0 0 8px rgba(255,255,255,0.8); }
}
</style>

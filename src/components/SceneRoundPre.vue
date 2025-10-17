<script setup lang="ts">
import appController, { GAMESCENE } from '@controllers/AppController.ts';
import { FwbButton } from "flowbite-vue";
import {EnemyWave} from "@controllers/EnemyController.ts";
import WaveEnemyDef from "@components/WaveEnemyDef.vue";

	export interface SceneRoundPreProps {
		enemyWave: EnemyWave|null;
	}
	defineProps<SceneRoundPreProps>();

	function handleClick() {
		appController.changeScene(GAMESCENE.ROUND_ACTIVE);
	}
</script>

<template>
	<div class="mb-4 flex justify-center font-bold text-lg p-4">
		<h1>Incoming wave of punters:</h1>
	</div>
	<div v-if="enemyWave">
		<div class="mb-4 flex flex-wrap justify-center font-bold text-lg p-4">
			<div v-for="(enemyDef, index) in enemyWave.enemyDefs" :key="index" class="m3">
				<WaveEnemyDef :waveEnemyDef="enemyDef"></WaveEnemyDef>
			</div>
		</div>
	</div>
	<div v-else>
		<h2>No punters in this wave.</h2>
	</div>
	<div class="mb-4 flex justify-center font-bold text-lg p-4">
		<fwb-button size="lg" @click="handleClick()">Begin round</fwb-button>
	</div>
</template>

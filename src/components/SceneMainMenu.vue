<script setup lang="ts">
	import appController from '@controllers/AppController.ts';
	import {GAMESCENE} from '@controllers/AppController.ts';
	import { FwbButton } from 'flowbite-vue';

	function handleClick(event: MouseEvent) {
		appController.changeScene(GAMESCENE.CHARSELECT);
	}
</script>

<template>
	<div class="mb-4 flex justify-center font-bold text-lg p-4">
	<fwb-button size="lg" @click="handleClick($event)">Begin New Game</fwb-button>
	</div>
</template>

<style scoped>

.menuButton{
	border: 5px solid;
	background-color: red;
	height: 75px;
	width: 250px;
	display: flex;
}

.menuButton:hover {
	border: 5px ridge;
}
</style>

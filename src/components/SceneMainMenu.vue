<script setup lang="ts">
import appController, { GAMESCENE } from '@controllers/AppController.ts';
// import { FwbAlert } from 'flowbite-vue';
import { FwbButton } from 'flowbite-vue';

function handleClick() {
	appController.changeScene(GAMESCENE.CHARSELECT);
}
</script>

<template>
	<div class="mb-4 flex justify-center font-bold text-lg p-4">
		<fwb-button size="lg" @click="handleClick()">Begin New Game</fwb-button>
	</div>
</template>

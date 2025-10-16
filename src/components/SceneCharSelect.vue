<script setup lang="ts">
	import appController, { GAMESCENE } from '@controllers/AppController.ts';
	import { FwbButton } from "flowbite-vue";

	function handleClick(event: MouseEvent) {
		appController.changeScene(GAMESCENE.ROUND_PRE);
	}
</script>

<template>
	<div class="mb-4 flex justify-center font-bold text-lg p-4">
		<fwb-button size="lg" @click="handleClick($event)">Choose this character</fwb-button>
	</div>
</template>

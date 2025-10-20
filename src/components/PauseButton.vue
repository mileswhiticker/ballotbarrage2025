<script setup lang="ts">
	import {FwbButton} from "flowbite-vue";
	import {ref} from "vue";
	import gameController from "@controllers/GameController.ts";

	const paused = ref(false);
	function onClick(){
		if(gameController.isPaused() != paused.value){
			console.warn(`WARNING: PauseButton.vue onClick() the locally stored value of \'paused\' (${paused.value}) does not match gameController.isPaused() (${gameController.isPaused()})`);
		}
		gameController.togglePause();
		paused.value = gameController.isPaused();
		// paused.value = ! paused.value;
	}

</script>

<template>
	<fwb-button size="lg" @click="onClick()" :color="paused ? 'alternative' : 'default'">{{paused ? 'Unpause' : '*Pause*'}}</fwb-button>
</template>

<style scoped>

</style>
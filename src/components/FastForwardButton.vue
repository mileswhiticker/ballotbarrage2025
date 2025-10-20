<script setup lang="ts">
import {FwbButton} from "flowbite-vue";
import {ref} from "vue";
import gameController from "@controllers/GameController.ts";

const fastforwarding = ref(false);
function onClick(){
	if(gameController.tryFastForwardRound())
	{
		fastforwarding.value = true;
	}
}

</script>

<template>
	<fwb-button size="lg" @click="onClick()" :disabled="fastforwarding" :color="fastforwarding ? 'red' : 'green'">
		<div v-html="fastforwarding ? 'Fast Forward' : '<em>Fast Forward</em>'"></div>
	</fwb-button>
</template>

<style scoped>

</style>
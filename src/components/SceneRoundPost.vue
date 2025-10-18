<script setup lang="ts">
import {FwbButton} from "flowbite-vue";
import appController, {GAMESCENE} from "@controllers/AppController.ts";

function onClickContinue(){
		appController.changeScene(GAMESCENE.ROUND_SHOP);
	}
</script>

<template>
	<div><h1>Wave complete!</h1></div>
	<div>Results (todo)</div>
	<div class="mb-4 flex justify-center font-bold text-lg p-4">
		<fwb-button size="lg" @click="onClickContinue()" >Continue</fwb-button>
	</div>
</template>

<style scoped>

</style>
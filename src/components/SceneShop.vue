<script setup lang="ts">
import {FwbButton} from "flowbite-vue";
import appController, {GAMESCENE} from "@controllers/AppController.ts";

function onClickContinue(){
	//todo: game over screen?
	appController.changeScene(GAMESCENE.ROUND_PRE);
}
</script>

<template>
	<div><h1>Shop</h1></div>
	<div>Options to buy (todo)</div>
	<div class="mb-4 flex justify-center font-bold text-lg p-4">
		<fwb-button size="lg" @click="onClickContinue()" >Continue</fwb-button>
	</div>
</template>

<style scoped>

</style>
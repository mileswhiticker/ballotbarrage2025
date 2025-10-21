<script setup lang="ts">
	import {FwbButton} from "flowbite-vue";
	import appController, {GAMESCENE} from "@controllers/AppController.ts";
	import playerController from "@controllers/PlayerController.ts";
	import PlayerRankingCard from "@components/PlayerRankingCard.vue";

	function onClickContinue(){
			appController.changeScene(GAMESCENE.ROUND_SHOP);
		}
</script>

<template>
	<div class="mb-4 flex justify-center font-bold text-lg p-4">
		<h1>Wave complete!</h1>
	</div>
	<div v-for="(playerDef, index) in playerController.sortedPlayerCharacters" :key="index" class="m3 flex flex-col items-center">
		<PlayerRankingCard :playerInfo="playerDef" :leadingCandidate="index===0" />
	</div>
	<div class="mb-4 flex justify-center font-bold text-lg p-4">
		<fwb-button size="lg" @click="onClickContinue()" >Continue</fwb-button>
	</div>
</template>

<style scoped>

</style>
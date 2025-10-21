<script setup lang="ts">
import {FwbButton} from "flowbite-vue";
import appController, {GAMESCENE} from "@controllers/AppController.ts";
import playerController from "@controllers/PlayerController.ts";
import PlayerRankingCard from "@components/PlayerRankingCard.vue";

	function onClickContinue(){
		appController.changeScene(GAMESCENE.ROUND_PRE);
	}

	const humanPlayerInfo = playerController.getHumanPlayer();
</script>

<template>
	<div class="flex flex-col mx-20 items-center">
		<div class="shop_upper flex flex-row justify-between">
			<div>
				<h1 class="text-3xl font-bold">Electoral HQ for {{humanPlayerInfo.playerParty}}</h1>
				<p>Here you can review your progress and purchase additions to your campaign.</p>
				<p>According to the polls, your position is: <em>{{playerController.getPlayerRanking(humanPlayerInfo.id)}}</em></p>
				<br/>
				<div>Available funds: <p class="text-2xl">${{humanPlayerInfo.money}}</p></div>
			</div>
			<PlayerRankingCard :playerInfo="humanPlayerInfo"
							   :leadingCandidate="false"
							   :isHumanPlayer="true"
							   :hideTitle="true"/>
		</div>
		<div class="shop_main">Options to buy (todo)</div>
		<div class="mb-4 flex justify-center font-bold text-lg p-4">
			<fwb-button size="lg" @click="onClickContinue()" >Begin...</fwb-button>
		</div>
	</div>
</template>

<style scoped>
.shop_upper{
	width: 100%;
	height: 10%;
}

.shop_main{
	width: 100%;
	height: 85%;
}

</style>
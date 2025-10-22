<script setup lang="ts">
	import {FwbButton} from "flowbite-vue";
	import appController, {GAMESCENE} from "@controllers/AppController.ts";
	import playerController from "@controllers/PlayerController.ts";
	import PlayerRankingCard from "@components/PlayerRankingCard.vue";
	import BuyableMob from "@components/BuyableMob.vue";

	function onClickContinue(){
		appController.changeScene(GAMESCENE.ROUND_PRE);
	}

	const humanPlayerInfo = playerController.getHumanPlayer();
</script>

<template>
	<div class="flex flex-col mx-20 items-center">
		<div class="shop_upper flex flex-row justify-between mb-8">
			<div>
				<div class="text-3xl font-bold">Electoral HQ for {{humanPlayerInfo.playerParty}}</div>
				<p>Here you can review your progress and purchase additions to your campaign.</p>
				<p>According to the polls, your position is: <em>{{playerController.getPlayerRanking(humanPlayerInfo.id)}}</em></p>
				<br/>
				<div>Available funds: <p class="text-2xl">${{humanPlayerInfo.money}}</p></div>
				<br/>
			</div>
			<PlayerRankingCard :playerInfo="humanPlayerInfo"
							   :leadingCandidate="false"
							   :isHumanPlayer="true"
							   :hideTitle="true"/>
		</div>
		<div class="mx-auto text-2xl mb-6">Tactics available to add to your campaign:</div>
		<div class="relative flex flex-col w-4/5 overflow-hidden">
			<div class="absolute inset-0 flex flex-row justify-between items-center">
				<div class="fadeRight w-60  h-72 relative z-20"></div>
				<div class="fadeLeft w-60  h-72 relative z-20"></div>
			</div>
			<div class="absolute inset-0 flex flex-row justify-between items-center h-72">
				<div><img src="../assets/chevron-double-left.svg" alt="My logo" width="200" height="200" class="relative z-20 chevron"></div>
				<div><img src="../assets/chevron-double-right.svg" alt="My logo" width="200" height="200" class="relative z-20 chevron"></div>
			</div>
			<div class="flex flex-row">
			<div v-for="(curBuyableMob, index) in playerController.humanBuyableMobs" :key="index" class="m3 h-72" :id="`buyableMob${index}`">
				<BuyableMob :buyableMob="curBuyableMob" :alreadyBought="false" />
			</div>
			</div>
		</div>
		<br/>
		<div class="mx-auto text-2xl mb-6">Tactics unlocked for your campaign:</div>
		<div class="w-4/5 mx-auto flex flex-row">
			<div v-for="(curBuyableMob, index) in playerController.humanPlaceableMobs" :key="index" class="m3" :id="`buyableMob${index}`">
				<BuyableMob :buyableMob="curBuyableMob" :alreadyBought="true" />
			</div>
		</div>
		<div class="mb-4 flex justify-center font-bold text-lg p-4">
			<fwb-button size="lg" @click="onClickContinue()" >Begin...</fwb-button>
		</div>
	</div>
</template>

<style scoped>

.shop_upper {
	width: 100%;
	height: 10%;
}

.chevron {
	/* this is #000080 based on https://codepen.io/sosuke/pen/Pjoqqp */
	filter: invert(8%) sepia(74%) saturate(7286%) hue-rotate(245deg) brightness(74%) contrast(127%);
}

.fadeLeft {
	background: linear-gradient(to left, rgba(0,0,0,1), transparent);
}

.fadeRight {
	background: linear-gradient(to right, rgba(0,0,0,1), transparent);
}

</style>
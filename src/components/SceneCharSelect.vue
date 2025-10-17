<script setup lang="ts">
	import appController, { GAMESCENE } from '@controllers/AppController.ts';
	import {FwbButton} from "flowbite-vue";
	import { ref, type Ref} from "vue";
	import type {PlayerInfo} from "@game/Player.ts";
	import SelectableCharacter from "@components/SelectableCharacter.vue";
	import playerController from "@controllers/PlayerController.ts";
	import enemyController from "@controllers/EnemyController.ts";
	import gameController from "@controllers/GameController.ts";

	export interface CharSelectProps {
		choosableChars: Ref<PlayerInfo,PlayerInfo>[];
	}
	const props = defineProps<CharSelectProps>();

	function onClickChooseChar() {
		// console.log(`SceneCharSelect onClickChooseChar()`);
		//find which player object this is referring to
		const chosenChar = props.choosableChars[charSelectIndex.value];

		//apply the human player selectino
		playerController.setHumanPlayer(chosenChar.value.id);

		//waves are customised based on player selection
		enemyController.Initialise();
		gameController.setupNextRound();

		//advance to the next scene
		appController.changeScene(GAMESCENE.ROUND_PRE);
	}

	const charSelectIndex = ref(0);

	function handleCharClick(charIndex: number){
		// console.log(`handleCharClick() ${charIndex}`);
		charSelectIndex.value = charIndex;
	}
</script>

<template>
	<div class="mb-4 flex justify-center font-bold text-lg p-4">
		<h1>Choose your character!</h1>
	</div>
	<div class="mb-4 flex justify-center font-bold text-lg p-4">
		<div v-for="(user, index) in choosableChars" :key="index" class="m3">
			<SelectableCharacter :focussed="index === charSelectIndex" :playerInfo="user" :handleCardClick="handleCharClick" :charIndex="index"/>
		</div>
	</div>
	<div class="mb-4 flex justify-center font-bold text-lg p-4">
		<fwb-button size="lg" @click="onClickChooseChar()">Choose this character</fwb-button>
	</div>
</template>

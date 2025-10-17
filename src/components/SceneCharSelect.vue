<script setup lang="ts">
	import appController, { GAMESCENE } from '@controllers/AppController.ts';
	import {FwbButton} from "flowbite-vue";
	import { ref, type Ref} from "vue";
	import type {PlayerInfo} from "@game/Player.ts";
	import SelectableCharacter from "@components/SelectableCharacter.vue";
	import playerController from "@controllers/PlayerController.ts";

	export interface CharSelectProps {
		choosableChars: Ref<PlayerInfo,PlayerInfo>[];
	}
	const props = defineProps<CharSelectProps>();

	function onClickChooseChar() {
		//find which player object this is referring to
		const chosenChar = props.choosableChars[charSelectIndex.value];

		//apply it
		playerController.setHumanPlayer(chosenChar.value.id);

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
		<div v-for="(user, index) in choosableChars" :key="index" class="m3">
			<SelectableCharacter :focussed="index === charSelectIndex" :playerInfo="user" :handleCardClick="handleCharClick" :charIndex="index"/>
		</div>
	</div>
	<div class="mb-4 flex justify-center font-bold text-lg p-4">
		<fwb-button size="lg" @click="onClickChooseChar($event)">Choose this character</fwb-button>
	</div>
</template>

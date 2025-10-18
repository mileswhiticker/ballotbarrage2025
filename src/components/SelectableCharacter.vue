<script setup lang="ts">
	import {FwbCard} from "flowbite-vue";
	import { type Ref } from "vue";
	import type {PlayerInfo} from "@game/Player.ts";
	// import appController, {GAMESCENE} from "@controllers/AppController.ts";

	export interface SelectableCharacterProps {
		playerInfo: Ref<PlayerInfo,PlayerInfo>;
		focussed: boolean;
		handleCardClick: (cardIndex: number) => void;
		charIndex: number;
	}
	const props = defineProps<SelectableCharacterProps>();

	function onCardClick() {
		// console.log(`onCardClick() ${props.charIndex}`);
		props.handleCardClick(props.charIndex);
	}

</script>

<template>

	<fwb-card
		:class="{ 'w-md': focussed, 'w-xs opacity-25': !focussed }"
		class="hover:cursor-pointer"
		:img-alt="`Player ${playerInfo.value.playerName}`"
		:img-src="playerInfo.value.playerImagePath"
		variant="image"
		@click="onCardClick"
	>
		<div class="p-5">
			<h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
				{{playerInfo.value.playerName}}
			</h5>
			<div class="font-normal text-gray-700 dark:text-gray-400">
				<ul class="list-disc pl-5">
					<li>{{playerInfo.value.playerParty}}</li>
					<li>{{playerInfo.value.standsFor}}</li>
				</ul>
			</div>
		</div>
	</fwb-card>
</template>

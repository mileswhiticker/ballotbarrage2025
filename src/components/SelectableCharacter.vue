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
		img-alt="Desk"
		img-src="https://flowbite.com/docs/images/blog/image-1.jpg"
		variant="image"
		@click="onCardClick"
	>
		<div class="p-5">
			<h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
				Noteworthy technology acquisitions 2021
			</h5>
			<p class="font-normal text-gray-700 dark:text-gray-400">
				Here are the biggest enterprise technology acquisitions of 2021 so far, in reverse chronological order.
			</p>
		</div>
	</fwb-card>
</template>

<script setup lang="ts">
	import PlaceableMob from '@components/PlaceableMob.vue';
	import { PlayerInfo } from '@game/Player.ts';
	import playerController from '@controllers/PlayerController.ts';
	import mouseController from '@controllers/MouseController.ts';
	const props = defineProps<{
		playerInfo: Ref<PlayerInfo>
	}>();
</script>

<template>
	<div id="bottomPanel">
		<div id="placeableDiv">
			<div v-for="(value, key) in playerController.playerPlaceableMobs" :key="key">
				<PlaceableMob :playerInfo :placeableMob="value" />
			</div>
			<!--<PlaceableMob :playerInfo />
			<PlaceableMob :playerInfo />
			<PlaceableMob :playerInfo />
			<PlaceableMob :playerInfo />
			<PlaceableMob :playerInfo />
			<PlaceableMob :playerInfo />-->
		</div>
	</div>
</template>

<style scoped>
	#bottomPanel {
		background-color: purple;
		overflow-x: scroll;
		overflow-y: hidden;
		background-color: purple;
		grid-row-start: 3;
	}
	#placeableDiv {
		display: flex;
	}
</style>

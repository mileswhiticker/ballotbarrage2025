<script setup lang="ts">
	import PlaceableMob from './PlaceableMob.vue';
	import {PlayerInfo} from '../game/Player.ts';
	const props = defineProps<{
		playerInfo: Ref<PlayerInfo>
	}>();
</script>

<template>
	<div id="bottomPanel">
		<div id="placeableDiv">
			<PlaceableMob :playerInfo />
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

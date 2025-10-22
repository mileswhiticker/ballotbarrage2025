<script setup lang="ts">
	import PlaceableMob from '@components/PlaceableMob.vue';
	import { type PlayerInfo } from '@game/Player.ts';
	import playerController from '@controllers/PlayerController.ts';
	import { type Ref } from "vue";
	defineProps<{
		playerInfo: Ref<PlayerInfo>
	}>();
</script>

<template>
	<div id="bottomPanel">
		<div id="placeableDiv">
			<div v-for="(value, key) in playerController.humanPlaceableMobs" :key="key">
				<PlaceableMob :playerInfo :placeableMob="value" />
			</div>
		</div>
	</div>
</template>

<style scoped>
	#bottomPanel {
		background-color: purple;
		overflow-x: scroll;
		overflow-y: hidden;
		grid-row-start: 3;
	}
	#placeableDiv {
		display: flex;
	}
</style>

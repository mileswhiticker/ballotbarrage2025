<script setup lang="ts">
	import { ref, watchEffect } from 'vue';
	import mouseController from '../game/MouseController.ts';
	import { PlayerInfo } from '../game/Player.ts';
	const props = defineProps<{
		playerInfo: Ref<PlayerInfo>
	}>();

	function handleClick(event: MouseEvent) {
		//console.log(event.target);
		mouseController.SetBuildGhost(0);
	}

	watchEffect(() => {
		//console.log(`playerInfo inside PlaceableMob:`, props.playerInfo);
	});
</script>

<template>
	<div class="placeableMob" @click="handleClick($event)">
		here is a placeable mob ()-|-<
	</div>
</template>

<style scoped>
.placeableMob {
	background-color: red;
	height: 75px;
	width: 200px;
	border-style: solid;
	border-width: 5px;
}

.placeableMob:hover {
	border-style: ridge;
}
</style>

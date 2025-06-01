<script setup lang="ts">
	import PlayerPanel from './PlayerPanel.vue';
	import playerController from '../game/PlayerController.ts';
	//const props = defineProps<{
	//	playerInfo: Ref<PlayerInfo>
	//}>();
</script>

<template>
	<div id="playerPanels">
		<PlayerPanel :playerInfo="playerController.getCurrentPlayer()" :isCurrentPlayer="false" />
	</div>
</template>

<style scoped>
	#playerPanels {
		display: flex;
		justify-content: end;
	}
</style>

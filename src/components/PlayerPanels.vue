<script setup lang="ts">
	import PlayerPanel from '@components/PlayerPanel.vue';
	import playerController from '@controllers/PlayerController.ts';
	//const props = defineProps<{
	//	playerInfo: Ref<PlayerInfo>
	//}>();
</script>

<template>
	<div id="playerPanels">
		<div v-for="curPlayerInfo in playerController.getNonPlayerCharacters().value" :key="curPlayerInfo.id">
			<PlayerPanel :playerInfo="curPlayerInfo" :isCurrentPlayer="false" />
		</div>
		<PlayerPanel :playerInfo="playerController.getCurrentPlayer()" :isCurrentPlayer="true" />
	</div>
</template>

<style scoped>
	#playerPanels {
		display: flex;
		justify-content: end;
	}
</style>

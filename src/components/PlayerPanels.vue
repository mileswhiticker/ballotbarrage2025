<script setup lang="ts">
	import PlayerPanel from '@components/PlayerPanel.vue';
	import playerController from '@controllers/PlayerController.ts';
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

<script setup lang="ts">
	import PlayerPanels from '@components/PlayerPanels.vue';
	import PlayerMoney from '@components/PlayerMoney.vue';
	import { PlayerInfo } from '@game/Player.ts';
	import { watchEffect } from 'vue';

	const props = defineProps<{
		playerInfo: Ref<PlayerInfo|null>
	}>();

	watchEffect(() => {
		//console.log(`TopPanel.vue playerInfo`, props.playerInfo);
	});
</script>

<template>
	<div id="topPanel">
		<PlayerMoney :playerInfo />
		<PlayerPanels />
	</div>
</template>

<style scoped>
#topPanel {
	display: flex;
	justify-content: space-between;
	opacity: 0.5;
	grid-row-start: 1;
	grid-row-end: 1;
}
</style>

<script setup lang="ts">
	import { ref, watchEffect, computed } from 'vue';
	import BottomPanel from './BottomPanel.vue';
	import TopPanel from './TopPanel.vue';
	import { PlayerInfo } from '../game/Player.ts';
	const props = defineProps<{
		gameWindowWidth: Ref<number>,
		gameWindowHeight: Ref<number>,
		playerInfo: Ref<PlayerInfo>
	}>();

	watchEffect(() => {
		//console.log(`${props.gameWindowWidth},${props.gameWindowHeight}`, props.gameWindowWidth, props.gameWindowHeight);
	});

</script>

<template>
	<div id="gameInterface">
		<TopPanel :playerInfo />
		<BottomPanel :playerInfo />
	</div>
</template>

<style scoped>
div
{
	display: grid;
	grid-template-rows: 100px 1fr 100px;
	position: absolute;
	width: 100%;
	height: 100%;
}
</style>

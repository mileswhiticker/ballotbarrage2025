<script setup lang="ts">
	import { ref, watchEffect, computed } from 'vue';
	import BottomPanel from '@components/BottomPanel.vue';
	import TopPanel from '@components/TopPanel.vue';
	import { PlayerInfo } from '@game/Player.ts';
	import mouseController from '@controllers/MouseController.ts';
	const props = defineProps<{
		gameWindowWidth: Ref<number>,
		gameWindowHeight: Ref<number>,
		playerInfo: Ref<PlayerInfo|null>
	}>();

	//const x = ref(0);
	//const y = ref(0);

	function handleMouseMove(event: MouseEvent) {
		//x.value = event.offsetX;
		//y.value = event.offsetY;
		//console.log(`${x.value},${y.value}`);
		mouseController.mouseMove(event);
		return;
	}

	function handleMouseClick(event: MouseEvent) {
		//console.log('GameInterface::handleMouseClick()', event);
		mouseController.mouseClick(event);
		return;
	}

	watchEffect(() => {
		//console.log(`GameInterface.vue playerInfo`, props.playerInfo);
	});
</script>

<template>
	<div id="gameInterface" @mousemove="handleMouseMove" @click="handleMouseClick">
		<TopPanel :playerInfo="props.playerInfo" />
		<BottomPanel :playerInfo="props.playerInfo" />
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

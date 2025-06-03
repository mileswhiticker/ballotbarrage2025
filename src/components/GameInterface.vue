<script setup lang="ts">
	import { ref, watchEffect, computed } from 'vue';
	import BottomPanel from './BottomPanel.vue';
	import TopPanel from './TopPanel.vue';
	import { PlayerInfo } from '../game/Player.ts';
	import mouseController from '../game/MouseController.ts';
	const props = defineProps<{
		gameWindowWidth: Ref<number>,
		gameWindowHeight: Ref<number>,
		playerInfo: Ref<PlayerInfo>
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
		//console.log(`${props.gameWindowWidth},${props.gameWindowHeight}`, props.gameWindowWidth, props.gameWindowHeight);
	});

</script>

<template>
	<div id="gameInterface" @mousemove="handleMouseMove" @click="handleMouseClick">
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

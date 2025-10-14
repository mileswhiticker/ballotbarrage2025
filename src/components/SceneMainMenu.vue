<script setup lang="ts">
	import appController from '@controllers/AppController.ts';

	function handleClick(event: MouseEvent) {
		appController.onNewGame();
	}
</script>

<template>
	<div class="menuButton" @click="handleClick($event)">Start new game</div>
</template>

<style scoped>

.menuButton{
	border: 5px solid;
	background-color: red;
	height: 75px;
	width: 250px;
	display: flex;
}

	.menuButton:hover {
		border-style: ridge;
		border: 5px ridge;
	}
</style>

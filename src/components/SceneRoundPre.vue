<script setup lang="ts">
import appController, {GAMESCENE} from '@controllers/AppController.ts';

function handleClick(event: MouseEvent) {
	appController.changeScene(GAMESCENE.ROUND_ACTIVE);
}
</script>

<template>
	<div class="button" @click="handleClick($event)">Begin round</div>
</template>

<style scoped>

.button{
	border: 5px solid;
	background-color: red;
	height: 75px;
	width: 250px;
	display: flex;
}

.button:hover {
	border: 5px ridge;
}
</style>
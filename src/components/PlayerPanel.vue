<script setup lang="ts">
	const props = defineProps<{
		playerInfo: Ref<PlayerInfo>,
		isCurrentPlayer: boolean,
	}>();
</script>

<template>
	<div class="playerPanelWrapper">
		<div class="playerImage" :style="{backgroundImage: `url(${playerInfo.playerImagePath})`}"></div>
		<div class="playerPanel" :style="{background: playerInfo.themePrimary.hex_string}">
			{{playerInfo.playerName}}
		</div>
	</div>
</template>

<style scoped>
	.playerPanelWrapper {
		display: flex;
		border-style: solid;
	}
	.playerImage {
		background-size: contain;
		width: 100px;
	}
	.playerPanel
	{
		width: 150px;
	}
</style>

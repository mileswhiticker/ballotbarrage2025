<script setup lang="ts">
	import { type Ref, ref, watchEffect } from "vue";

	const props = defineProps<{
		playerInfo: Ref<PlayerInfo>,
		isCurrentPlayer: boolean,
	}>();

	watchEffect(() => {
		//console.log("PlayerPanel.vue", props.playerInfo, props.playerInfo.value);

		//if (props.playerInfo.value) {
		//	console.log("playerInfo", props.playerInfo.value.themePrimary);
		//}
		//else {
		//	console.log("playerInfo is null");
		//}
	});

	let playerExists: boolean = (props.playerInfo.value != null);
</script>

<template>
	<div v-if="playerInfo.value" class="playerPanelWrapper" :class="{ playerCharacter: isCurrentPlayer }" :style="{background: playerInfo.value.themePrimary.hex_string}">
		<div class="playerImage" :class="{ playerCharacterImage: isCurrentPlayer }" :style="{backgroundImage: `url(${playerInfo.value.playerImagePath})`}"></div>
		<div class="playerPanel" :class="{ pcPanel: isCurrentPlayer }">
			<div class="playerName">{{playerInfo.value.playerName}}</div>
			<div class="playerParty">* {{playerInfo.value.playerParty}} *</div>
				<div v-if="isCurrentPlayer">
					{{playerInfo.value.standsFor}}
				</div>
				{{playerInfo.value.formattedVotes}}
			</div>
		</div>
	<div v-else class="playerPanelWrapper">
		invalid playerInfo
	</div>
</template>

<style scoped>
	.playerName {
		white-space: nowrap;
		font-style: italic;
		font-weight: bolder;
	}
	.playerParty {
		white-space: nowrap;
	}
	.playerPanelWrapper {
		display: flex;
		border-style: solid;
		/*		font-weight: bold;*/
		height: 65px;
	}
	.playerCharacter{
		height: 100px;
	}
	.playerImage {
		background-size: contain;
		background-repeat: no-repeat;
		width: 50px;
	}
	.playerCharacterImage {
		width: 100px;
	}
	.playerPanel
	{
		width: 110px;
		padding: 5px;
	}
	.pcPanel {
		width: 150px;
	}
</style>

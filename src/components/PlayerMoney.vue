<script setup lang="ts">
	import { watchEffect, ref, Ref, computed } from "vue";
	import { type PlayerInfo, random_name, startingMoney } from '@game/Player.ts';
	import playerController from '@controllers/PlayerController.ts';

	const props = defineProps<{
		playerInfo: Ref<PlayerInfo>
	}>();

	const isValid = computed(() => !!playerInfo.value);

	watchEffect(() => {
		//console.log(`PlayerMoney.vue playerInfo`, props.playerInfo, props.playerInfo.value);
	});

	//const localPlayerInfo = Ref<PlayerInfo | null> = ref(null);
</script>

<template>
	<div v-if="props.playerInfo" id="playerMoney" :style="{backgroundColor: playerInfo.themePrimary.hex_string}">
		${{playerInfo.money}}
	</div>
	<div v-else id="playerMoney">
		$-----
	</div>
</template>

<style scoped>
#playerMoney{
	width: 100px;
	height: 20px;
	border-radius: 15px;
	border-width: 15px;
	border-style: double;
	background-color: grey;
	padding: 5px;
/*	opacity: 1;*/
}
</style>

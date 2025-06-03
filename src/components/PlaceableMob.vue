<script setup lang="ts">
	import Mob from '../game/Mob.ts';
	import { ref, watchEffect, computed } from 'vue';
	import mouseController from '../game/MouseController.ts';
	import { PlayerInfo } from '../game/Player.ts';
	const props = defineProps<{
		playerInfo: Ref<PlayerInfo>,
		placeableMob: Mob
	}>();

	function handleClick(event: MouseEvent) {
		//console.log("PlaceableMob::handleClick()", event);

		//we will take over this event for now
		event.stopImmediatePropagation();
		//console.log(event.target);
		mouseController.SetBuildGhost(props.placeableMob.mobType);
	}

	const isSelected = computed(() => {
		if (props.placeableMob && mouseController) {
				//return true;
				return props.placeableMob.mobType === mouseController.GetBuildGhostType().value;
		}
		return true;
	});

	watchEffect(() => {
		//console.log('mouseController.GetBuildGhostType()', mouseController.GetBuildGhostType());
	});

	watchEffect(() => {
		//console.log(`playerInfo inside PlaceableMob:`, props.playerInfo);
		//console.log(`placeableMob inside PlaceableMob:`, props.placeableMob);
		//console.log("isSelected", isSelected);
	});
</script>

<template>
	<div class="placeableMob" :class="{ placeableMobSelected: isSelected }" @click="handleClick($event)">
		<div class="mobImg" :style="{backgroundImage: `url(${placeableMob.imagePath})`}"></div>
		<div class="mobDesc">
			<em>{{placeableMob.name}}</em><br />
			{{placeableMob.placeableDesc}}
		</div>
	</div>
</template>

<style scoped>

.placeableMob {
	border: 5px solid;
	background-color: red;
	height: 75px;
	width: 250px;
	display: flex;
}

.placeableMob:hover {
	border-style: ridge;
	border: 5px ridge;
}

.placeableMobSelected, .placeableMobSelected:hover {
	border-image: url('./src/assets/buildable_border.png') 15 stretch;
}

.mobDesc
{
	width: 175px;
}

.mobImg {
	background-size: contain;
	width: 75px;
}
</style>

<script setup lang="ts">
	import PlaceableMob from './PlaceableMob.vue';
</script>

<template>
	<div id="bottomPanel">
		<div id="placeableDiv">
			<PlaceableMob />
			<PlaceableMob />
			<PlaceableMob />
			<PlaceableMob />
			<PlaceableMob />
			<PlaceableMob />
			<PlaceableMob />
		</div>
	</div>
</template>

<style scoped>
	#bottomPanel {
		background-color: purple;
		overflow-x: scroll;
		overflow-y: hidden;
	}
	#placeableDiv {
		display: flex;
	}
</style>

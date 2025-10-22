<script setup lang="ts">

	// import {ref} from "vue";
	import type Mob from "@game/Mob.ts";
	import {FwbButton} from "flowbite-vue";

	export interface BuyableMobProps {
		buyableMob: Mob;
		alreadyBought: boolean;
	}
	const props = defineProps<BuyableMobProps>();

	// const leadingCandidateElement = ref(null);

	function onClickBuy(){
		console.log(`Buying mob`, props.buyableMob);
	}
</script>

<template>
	<div class="flex flex-col items-center bg-white border border-gray-200 rounded-lg shadow-sm md:flex-row md:w-xl dark:border-gray-700 dark:bg-gray-800 h-72">
		<img class="max-w-min max-h-min w-full rounded-t-lg md:h-auto md:w-48 md:rounded-none md:rounded-s-lg" :src="buyableMob.imagePath" :alt="`Image of buyable mob ${buyableMob.name}`">
		<div class="flex flex-col justify-between p-4 leading-normal w-100">
			<h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{{buyableMob.name}}</h5>
			<p class="mb-3 font-normal text-gray-700 dark:text-gray-400">{{buyableMob.desc}}</p>
			<p class="mb-3 font-normal text-gray-700 dark:text-gray-400"><b>Cost at a booth:</b> ${{ buyableMob.buildCost }}</p>
			<p v-if="!alreadyBought" class="mb-3 font-normal text-gray-700 dark:text-gray-400"><b>Cost to add to your campaign:</b> ${{buyableMob.buyCost}}</p>
			<div v-if="!alreadyBought" class="relative mb-4 flex justify-center font-bold text-lg p-4 z-10">
				<fwb-button size="lg" color="green" @click="onClickBuy()">Add to your campaign</fwb-button>
			</div>
		</div>
	</div>
</template>

<style scoped>

</style>
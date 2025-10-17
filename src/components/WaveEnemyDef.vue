<script setup lang="ts">

	import {type WaveEnemyDef} from "@controllers/EnemyController.ts";
	import {onMounted} from "vue";

	export interface WaveEnemyDefProps {
		waveEnemyDef: WaveEnemyDef;
	}
	defineProps<WaveEnemyDefProps>();

	onMounted(() => {
		// console.log('Component has been mounted!', props);
	});

</script>

<template>

	<div class="flex flex-col items-center bg-white border border-gray-200 rounded-lg shadow-sm md:flex-row md:w-xl dark:border-gray-700 dark:bg-gray-800 ">
		<img class="object-cover w-full rounded-t-lg md:h-[32rem] md:h-auto md:w-48 md:rounded-none md:rounded-s-lg" :src="waveEnemyDef.mobInfo?.imgPath" :alt="`Incoming punter ${waveEnemyDef.mobInfo?.name}`">
		<div class="flex flex-col justify-between p-4 leading-normal">
			<h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{{waveEnemyDef.mobInfo?.name}}</h5>
			<div class="mb-3 font-normal text-gray-700 dark:text-gray-400">
				<ul>
					<li>
						{{waveEnemyDef.mobInfo?.desc}}
					</li>
					<li>
						<b>Move speed:</b> {{waveEnemyDef.mobInfo.moveSpeed + waveEnemyDef.mobInfo.speedMod}}
					</li>
					<li>
						<b>Maximum possible loyalty:</b> {{100 * (waveEnemyDef.mobInfo.health + waveEnemyDef.mobInfo.healthMod)}}%
					</li>
					<li>
						<b>Party member:</b> {{waveEnemyDef.mobInfo.party ? waveEnemyDef.mobInfo.party : "No party"}}
					</li>
					<li>
						<b>Quantity:</b> {{waveEnemyDef.amountMax}}
					</li>
				</ul>
			</div>
		</div>
	</div>
</template>

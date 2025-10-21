<script setup lang="ts">

	import type {PlayerInfo} from "@game/Player.ts";
	import {onMounted, ref} from "vue";

	export interface PlayerRankingCardProps {
		playerInfo: PlayerInfo;
		leadingCandidate: boolean;
		isHumanPlayer: boolean;
	}
	const props = defineProps<PlayerRankingCardProps>();

	const ordinals = ['1st','2nd','3rd','4th','5th','6th'];
	function getOrdinalFromNum(number: number){
		if(number < ordinals.length){
			return ordinals[number];
		}
		return `${number}st`;
	}

	const leadingCandidateElement = ref(null);

	onMounted(() => {
		if(leadingCandidateElement.value){
			(leadingCandidateElement.value as HTMLElement).style.setProperty('--bg-color', `${props.playerInfo.themePrimary.hex_string}`);
		}
	});

</script>

<template>
	<div v-if="leadingCandidate" class="racing-stripes" ref="leadingCandidateElement">
		<div v-if="isHumanPlayer">YOU ARE IN THE LEAD</div>
		<div v-else>Leading candidate:</div>
	</div>
	<div v-else>
		<em v-if="isHumanPlayer">Runner up (you)</em>
		<em v-else>Runner up</em>
	</div>
	<div class="flex flex-col items-center bg-white border border-gray-200 rounded-lg shadow-sm md:flex-row md:w-xl dark:border-gray-700 dark:bg-gray-800 "
		 :class="{'leader' : leadingCandidate}">
		<img class="object-cover w-full rounded-t-lg md:h-[32rem] md:h-auto md:w-48 md:rounded-none md:rounded-s-lg" :src="playerInfo.playerImagePath" :alt="`Image of candidate ${playerInfo.playerName}`">
		<div class="flex flex-col justify-between p-4 leading-normal w-100">
			<h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{{playerInfo.playerName}}</h5>
			<div class="mb-3 font-normal text-gray-700 dark:text-gray-400">Candidate for {{playerInfo.playerParty}}</div>
			<table>
				<tr><td><b>Preference</b></td><td><b>Number of Votes</b></td></tr>
				<tr v-for="(voteDef, index) in playerInfo.votes" :key="index">
					<td>{{getOrdinalFromNum(index)}}</td>
					<td>{{voteDef}}</td>
				</tr>
			</table>
		</div>
	</div>

</template>

<style scoped>

table {
	width: 100%;
	border-collapse: collapse;
	font-family: sans-serif;
	font-size: 0.95rem;
}

th, td {
	border: 1px solid #ddd;
	padding: 0.2em;
	text-align: left;
}

.leader{
	margin: 2em;
	transform: scale(1.1);
}

img{
	margin: 1em;
}

.racing-stripes{
	--angle: 120deg;		/* stripe angle */
	--stripe-size: 18px;	/* width of each stripe band */
	--speed: 1.6s;			/* animation duration */
	--text-color: #fff;		/* base text color (visible where stripe is) */
	--bg-color: #000080;	/* fallback background behind text */

	font-weight: 900;
	font-size: clamp(2rem, 8vw, 6rem);
	letter-spacing: .04em;
	text-transform: uppercase;
	color: transparent; /* text color is from background */
	background-color: var(--bg-color);

	/* repeating stripe pattern used as background */
	background-image:
		repeating-linear-gradient(
			var(--angle),
			rgba(255,255,255,0.18) 0 calc(var(--stripe-size) * 1),
			transparent calc(var(--stripe-size) * 1) calc(var(--stripe-size) * 2)
		);

	background-size: calc(var(--stripe-size) * 4) calc(var(--stripe-size) * 4);
	/* clip the background into the text */
	-webkit-background-clip: text;
	background-clip: text;
	-webkit-text-fill-color: transparent;

	/* move the stripes */
	animation: stripes-move var(--speed) linear infinite;
	display: inline-block;
}

/* Animation moves the repeating background along the X axis */
@keyframes stripes-move {
	to { background-position: calc(var(--stripe-size) * 4) 0; }
}


</style>
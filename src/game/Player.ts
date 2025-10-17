import { ColourInfo } from '@utils/ColourInfo.ts';
//import type { Ref } from 'vue';

export interface PlayerInfo {
	themePrimary: ColourInfo;
	themeSecondary: ColourInfo;
	playerName: string;
	playerImagePath: string;
	playerParty: string;
	standsFor: string;
	money: number;
	id: number;
	votes: number[];
	formattedVotes: string;
}

const first_names = ["John", "Jane", "Mary", "Martin", "Michael", "Molly", "Josie", "Joe", "Serena", "Max"];
const last_names = ["Doe", "Derren", "Smith", "Mollen", "Minta", "Marygale", "Chandler", "Mather"];

export function random_name(): string {
	let name = first_names[Math.floor(Math.random() * first_names.length)];
	name += " ";
	name += last_names[Math.floor(Math.random() * last_names.length)];

	return name;
}

export const startingMoney: number = 10;

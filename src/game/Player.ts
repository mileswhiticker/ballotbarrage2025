import { ColourInfo } from '@utils/ColourInfo.ts';

export interface PlayerInfo {
	themePrimary: ColourInfo;
	themeSecondary: ColourInfo;
	playerName: string;
	playerImagePath: string;
}

const first_names = ["John", "Jane", "Mary", "Martin", "Michael", "Molly", "Josie", "Joe", "Serena"];
const last_names = ["Doe", "Derren", "Smith", "Mollen", "Minta", "Marygale"];

export function random_name(): string {
	let name = first_names[Math.floor(Math.random() * first_names.length)];
	name += last_names[Math.floor(Math.random() * last_names.length)];

	return name;
}

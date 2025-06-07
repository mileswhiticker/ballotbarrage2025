
export class ColourInfo {
	hex_string: string;
	constructor(hex_string: string) {
		this.hex_string = hex_string;
	}
}

export const COLOUR_RED = new ColourInfo("#f44336");
export const COLOUR_BLUE = new ColourInfo("#2196f3");
export const COLOUR_GREEN = new ColourInfo("#4caf50");

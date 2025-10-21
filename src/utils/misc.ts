
	const ordinals = ['1st','2nd','3rd','4th','5th','6th'];
	export function getOrdinalFromNum(number: number){
		if(number < ordinals.length){
			return ordinals[number];
		}
		return `${number}st`;
	}


import { type PlayerInfo, random_name, startingMoney } from '@game/Player.ts';
import { ColourInfo } from '@utils/ColourInfo.ts';
import Mob from '@game/Mob.ts';
import { MOBTYPE } from '@game/Mob.ts';
import mobController from '@controllers/MobController.ts';
import { ref, type Ref } from 'vue';

export enum PLAYERS {
	PLAYER_UNKNOWN = -1,
	//
	PLAYER_PURPLE,
	PLAYER_RED,
	PLAYER_BLUE,
}

class PlayerController {
	allPlaceableMobs: Mob[] = [];
	playerPlaceableMobs: Mob[] = [];

	private allPlayerCharacters: Ref<PlayerInfo>[] = [];
	private nonPlayerCharacters: Ref<Ref<PlayerInfo>[]> = ref([]);
	private currentPlayer: Ref<PlayerInfo|null> = ref(null);
	private noPlayer: PlayerInfo = {
		themePrimary: new ColourInfo("#808080"),
		themeSecondary: new ColourInfo("#000000"),
		playerName: "No player selected",
		playerParty: "No party selected",
		standsFor: "No one",
		playerImagePath: './src/assets/greyquestion.png',
		money: 0,
		id: PLAYERS.PLAYER_UNKNOWN
	};

	Initialise() {
		//what mobs should the player be able to place?
		this.allPlaceableMobs.push(mobController.createMobInstance(MOBTYPE.VOLUNTEER));
		this.allPlaceableMobs.push(mobController.createMobInstance(MOBTYPE.AFRAME));
		this.allPlaceableMobs.push(mobController.createMobInstance(MOBTYPE.SAUSAGESIZZLE));

		//for now, let the player place all of them
		for (const curMob of this.allPlaceableMobs) {
			this.playerPlaceableMobs.push(curMob);
		}

		//create all player archetypes and default them to being NPCs

		this.allPlayerCharacters.push(ref({
			themePrimary: new ColourInfo("#800080"),
			themeSecondary: new ColourInfo("#000000"),
			playerName: random_name(),
			playerParty: "The Purple Party",
			standsFor: "Scientists, engineers, environmentalists",
			playerImagePath: './src/assets/purpleface.png',
			money: startingMoney,
			id: PLAYERS.PLAYER_PURPLE
		}));

		this.allPlayerCharacters.push(ref({
			themePrimary: new ColourInfo("#ff0000"),
			themeSecondary: new ColourInfo("#0000ff"),
			playerName: random_name(),
			playerParty: "The Red Party",
			standsFor: "Unions, workers, tradespeople",
			playerImagePath: './src/assets/redface.png',
			money: startingMoney,
			id: PLAYERS.PLAYER_RED
		}));

		this.allPlayerCharacters.push(ref({
			themePrimary: new ColourInfo("#0000ff"),
			themeSecondary: new ColourInfo("#ffffff"),
			playerName: random_name(),
			playerParty: "The Blue Party",
			standsFor: "Banks and big business",
			playerImagePath: './src/assets/blueface.png',
			money: startingMoney,
			id: PLAYERS.PLAYER_BLUE
		}));

		this.currentPlayer.value = this.allPlayerCharacters[PLAYERS.PLAYER_PURPLE].value;
		this.nonPlayerCharacters.value.push(this.allPlayerCharacters[PLAYERS.PLAYER_RED]);
		this.nonPlayerCharacters.value.push(this.allPlayerCharacters[PLAYERS.PLAYER_BLUE]);
		//this.currentPlayer.value = this.noPlayer;
	}

	//newCurrentPlayer() {
	//	this.currentPlayer = {
	//		themePrimary: new ColourInfo("#808080"),
	//		themeSecondary: new ColourInfo("#808080"),
	//		playerName: random_name(),
	//		playerImagePath: './src/assets/greyface.png',
	//		money: 0
	//	}
	//}

	getCurrentPlayer(){
		return this.currentPlayer;
	}

	getNonPlayerCharacters() {
		return this.nonPlayerCharacters;
	}
}

const playerController = new PlayerController();
export default playerController;

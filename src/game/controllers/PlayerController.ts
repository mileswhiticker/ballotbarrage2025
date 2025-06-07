
import { type PlayerInfo, random_name, startingMoney } from '@game/Player.ts';
import { ColourInfo } from '@utils/ColourInfo.ts';
import Mob from '@game/Mob.ts';
import { MOBTYPE } from '@game/Mob.ts';
import mobController from '@controllers/MobController.ts';
import { ref, type Ref } from 'vue';
import { IMGPATH_PURPLEMAN, IMGPATH_REDMAN, IMGPATH_BLUEMAN } from '../../assets/_AssetPaths';

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
	private noPlayer: PlayerInfo = {
		themePrimary: new ColourInfo("#808080"),
		themeSecondary: new ColourInfo("#000000"),
		playerName: "No player selected",
		playerParty: "No party selected",
		standsFor: "No one",
		playerImagePath: './src/assets/greyquestion.png',
		money: 0,
		id: PLAYERS.PLAYER_UNKNOWN,
		votes: [],
		formattedVotes: "No votes yet"
	};
	private humanPlayer: Ref<PlayerInfo> = ref(this.noPlayer);

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
			id: PLAYERS.PLAYER_PURPLE,
			votes: [],
			formattedVotes: "No votes yet"
		}));

		this.allPlayerCharacters.push(ref({
			themePrimary: new ColourInfo("#ff0000"),
			themeSecondary: new ColourInfo("#0000ff"),
			playerName: random_name(),
			playerParty: "The Red Party",
			standsFor: "Unions, workers, tradespeople",
			playerImagePath: './src/assets/redface.png',
			money: startingMoney,
			id: PLAYERS.PLAYER_RED,
			votes: [],
			formattedVotes: "No votes yet"
		}));

		this.allPlayerCharacters.push(ref({
			themePrimary: new ColourInfo("#0000ff"),
			themeSecondary: new ColourInfo("#ffffff"),
			playerName: random_name(),
			playerParty: "The Blue Party",
			standsFor: "Banks and big business",
			playerImagePath: './src/assets/blueface.png',
			money: startingMoney,
			id: PLAYERS.PLAYER_BLUE,
			votes: [],
			formattedVotes: "No votes yet"
		}));

		//record starting votes
		for (const playerInfo of this.allPlayerCharacters) {
			for (let i = 0; i < this.allPlayerCharacters.length; i++) {
				playerInfo.value.votes.push(0);
			}
		}

		this.humanPlayer.value = this.allPlayerCharacters[PLAYERS.PLAYER_PURPLE].value;
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

	getPartyName(playerId: PLAYERS): string {
		if (playerId < this.allPlayerCharacters.length) {
			const playerInfo = this.allPlayerCharacters[playerId];
			return playerInfo.value.playerParty;
		}

		console.warn("PlayerController::getPartyName() unknown playerId: ", playerId);
		return "Unknown Party";
	}

	getHumanPlayer(){
		return this.humanPlayer;
	}

	getNonPlayerCharacters() {
		return this.nonPlayerCharacters;
	}
	
	GetPartyColour(partyName: string): ColourInfo {
		for (const curPlayer of this.allPlayerCharacters) {
			if (curPlayer.value.playerParty === partyName) {
				return curPlayer.value.themePrimary;
			}
		}
		console.warn("PlayerController::GetPartyColour() unknown player party: ", partyName);
		return new ColourInfo("#000000"); // default to black if party not recognized
	}

	getPlayerInfoByPartyName(partyName: string): PlayerInfo | null {
		for (const playerInfo of this.allPlayerCharacters) {
			if (playerInfo.value.playerParty === partyName) {
				return playerInfo.value;
			}
		}
		console.warn("PlayerController::getPlayerInfoByPartyName() unknown party name: ", partyName);
		return null;
	}

	castVote(partyName: string, preference: number) {
		//console.log(`Casting vote for ${partyName} with preference ${preference}`);

		//note: 0 is for first preference, 1 for second preference, etc.
		const playerInfo = this.getPlayerInfoByPartyName(partyName);
		if (playerInfo) {
			playerInfo.votes[preference] += 1;
			let voteString = "";
			for (let i = 0; i < playerInfo.votes.length; i++) {
				voteString += `${playerInfo.votes[i]} `;
			}
			playerInfo.formattedVotes = voteString;
		}
	}

	getPartyLoyalistMobType(partyName: string): MOBTYPE | null {
		//return the mob type that is loyal to the party
		switch (partyName) {
			case "The Purple Party":
				return MOBTYPE.VOTER_PURPLE;
			case "The Red Party":
				return MOBTYPE.VOTER_RED;
			case "The Blue Party":
				return MOBTYPE.VOTER_BLUE;
			default:
				console.warn("PlayerController::getPartyLoyalistMobType() unknown party name: ", partyName);
				return null;
		}
	}

	getPartyLoyalistImgPath(partyName: string): string | undefined {
		switch (partyName) {
			case "The Purple Party":
				return IMGPATH_PURPLEMAN;
			case "The Red Party":
				return IMGPATH_REDMAN;
			case "The Blue Party":
				return IMGPATH_BLUEMAN;
			default:
				console.warn("PlayerController::getPartyLoyalistImgPath() unknown party name: ", partyName);
		}

		return undefined;
	}

	slightlyRandomiseLoyalty(partyLoyalty: Map<string, number>) {
		//check if there are any parties missing
		for (const playerInfo of this.allPlayerCharacters) {
			if (!partyLoyalty.has(playerInfo.value.playerParty)) {
				partyLoyalty.set(playerInfo.value.playerParty, 1);
			}
		};

		//add some randomness to the loyalty
		for (const playerInfo of this.allPlayerCharacters) {
			const existingLoyalty = partyLoyalty.get(playerInfo.value.playerParty) || 0;
			partyLoyalty.set(playerInfo.value.playerParty, 2 * existingLoyalty / 3 + existingLoyalty * Math.random() / 3);
		}
	}
}

const playerController = new PlayerController();
export default playerController;

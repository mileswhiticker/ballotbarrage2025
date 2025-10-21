
import { type PlayerInfo, random_name, startingMoney } from '@game/Player.ts';
import { ColourInfo } from '@utils/ColourInfo.ts';
import Mob, {BASE_MOB_HEALTHCAP, MOBTYPE} from '@game/Mob.ts';
import mobController from '@controllers/MobController.ts';
import { ref, type Ref } from 'vue';
import { IMGPATH_PURPLEMAN, IMGPATH_REDMAN, IMGPATH_BLUEMAN } from '@assets/_AssetPaths.ts';
import gridController from './GridController';
import  Vector2 from '../../utils/Vector2';
import {getOrdinalFromNum} from "@utils/misc.ts";

export enum PLAYERS {
	PLAYER_UNKNOWN = -1,
	//
	PLAYER_PURPLE,
	PLAYER_RED,
	PLAYER_BLUE,
	//
	PLAYER_MAX
}

class PlayerController {
	get allPlayerCharacters(): Ref<PlayerInfo>[] {
		return this._allPlayerCharacters;
	}
	allPlaceableMobs: Mob[] = [];
	playerPlaceableMobs: Mob[] = [];

	private _allPlayerCharacters: Ref<PlayerInfo>[] = [];
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

	async Initialise() {
		// console.log("PlayerController::Initialise()");
		//what mobs should the player be able to place?
		this.allPlaceableMobs.push(mobController.createMobInstance(MOBTYPE.VOLUNTEER));
		this.allPlaceableMobs.push(mobController.createMobInstance(MOBTYPE.AFRAME));
		this.allPlaceableMobs.push(mobController.createMobInstance(MOBTYPE.SAUSAGESIZZLE));

		//for now, let the player place all of them
		for (const curMob of this.allPlaceableMobs) {
			this.playerPlaceableMobs.push(curMob);
		}

		//create all player archetypes and default them to being NPCs

		this._allPlayerCharacters.push(ref({
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

		this._allPlayerCharacters.push(ref({
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

		this._allPlayerCharacters.push(ref({
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
		for (const playerInfo of this._allPlayerCharacters) {
			for (let i = 0; i < this._allPlayerCharacters.length; i++) {
				playerInfo.value.votes.push(0);
			}
		}

		this.nonPlayerCharacters.value.push(this._allPlayerCharacters[PLAYERS.PLAYER_RED]);
		this.nonPlayerCharacters.value.push(this._allPlayerCharacters[PLAYERS.PLAYER_BLUE]);
		this.nonPlayerCharacters.value.push(this._allPlayerCharacters[PLAYERS.PLAYER_PURPLE]);
		this.setHumanPlayer(PLAYERS.PLAYER_PURPLE);
		//this.currentPlayer.value = this.noPlayer;
	}

	setHumanPlayer(playerId: PLAYERS) {
		// console.log(`PlayerController::setHumanPlayer(${playerId})`);
		if(this.humanPlayer.value.id < PLAYERS.PLAYER_MAX && this.humanPlayer.value.id > PLAYERS.PLAYER_UNKNOWN) {
			//add old player to NPC list
			this.nonPlayerCharacters.value.push(this._allPlayerCharacters[this.humanPlayer.value.id]);
		}

		//is it a valid id for the new human player?
		if(playerId < PLAYERS.PLAYER_MAX && playerId > PLAYERS.PLAYER_UNKNOWN){

			//have we defined it correctly?
			if(playerId < this._allPlayerCharacters.length){

				//warning: this may be unsafe to do during a game. only do it out of game for now
				this.humanPlayer.value = this._allPlayerCharacters[playerId].value;

				//remove from NPC list
				let success = false;
				for(let index=0; index < this.nonPlayerCharacters.value.length; index++){
					const checkPlayerInfo = this.nonPlayerCharacters.value[index];
					if(checkPlayerInfo.value.id === playerId){
						//remove this index
						this.nonPlayerCharacters.value.splice(index, 1);
						success = true;
						break;
					}
				}

				//sanity check
				if(!success){
					console.warn(`PlayerController::setHumanPlayer() unable to remove player ID ${playerId} from NPC list`);
				}
			} else {
				console.error(`PlayerController::setHumanPlayer() unable to find the playerInfo object for player ID ${playerId}`);
			}
		} else {
			console.error(`PlayerController::setHumanPlayer() undefined player ID ${playerId}`);
		}
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

	getAllPlayerCharacters(){
		return this._allPlayerCharacters;
	}

	getPartyName(playerId: PLAYERS): string {
		if (playerId < this._allPlayerCharacters.length) {
			const playerInfo = this._allPlayerCharacters[playerId];
			return playerInfo.value.playerParty;
		}

		console.warn("PlayerController::getPartyName() unknown playerId: ", playerId);
		return "Unknown Party";
	}

	getFirstPrefMoneyReward(): number {
		return 7.68;
	}

	getHumanPlayer(){
		return this.humanPlayer;
	}

	getNonPlayerCharacters() {
		return this.nonPlayerCharacters;
	}

	getPlayerRanking(playerId: PLAYERS): string {
		if(!this.sortedPlayerCharacters.length){
			return "No polling";
		}

		for(let index=0; index<this.sortedPlayerCharacters.length; index++){
			const checkPlayerInfo = this.sortedPlayerCharacters[index];
			if(checkPlayerInfo.id === playerId){
				return getOrdinalFromNum(index);
			}
		}
		return "Unknown candidate";
	}

	sortedPlayerCharacters: PlayerInfo[] = [];
	sortPlayerCharacters(){
		this.sortedPlayerCharacters = [];
		// console.log(`sortPlayerCharacters()`);

		for(const curPlayerInfo of this._allPlayerCharacters) {
			// console.log(`sorting: `, curPlayerInfo);

			//no sorting possible for length 1 arrays
			if(!this.sortedPlayerCharacters.length){
				this.sortedPlayerCharacters.push(curPlayerInfo.value);
				// console.log(`adding at front of array`);
				continue;
			}

			//check all other entries
			let success = false;
			for(let index=0; index<this.sortedPlayerCharacters.length; index++) {
				const checkPlayerInfo = this.sortedPlayerCharacters[index];
				// console.log(`checking: `, checkPlayerInfo);

				//recursively loop through preferences to see if we are winning
				//this is not the correct way of doing preference allocation but it's computationally simpler which is ok for basic checks
				for(let prefNum = 0; prefNum < checkPlayerInfo.votes.length; prefNum++){
					if(checkPlayerInfo.votes[prefNum] < curPlayerInfo.value.votes[prefNum]){
						//found it
						this.sortedPlayerCharacters.splice(index, 0, curPlayerInfo.value);
						success = true;
						// console.log(`found prefNum ${prefNum} with index ${index}`);
						break;
					} else if(checkPlayerInfo.votes[prefNum] > curPlayerInfo.value.votes[prefNum]) {
						//no point checking more
						break;
					}
				}

				if(success){
					break;
				}
			}

			//if we didn't find a place, add it to the end
			if(!success){
				this.sortedPlayerCharacters.push(curPlayerInfo.value);
				// console.log(`adding to end`);
			}
		}
	}
	
	GetPartyColour(partyName: string): ColourInfo {
		for (const curPlayer of this._allPlayerCharacters) {
			if (curPlayer.value.playerParty === partyName) {
				return curPlayer.value.themePrimary;
			}
		}
		console.warn("PlayerController::GetPartyColour() unknown player party: ", partyName);
		return new ColourInfo("#000000"); // default to black if party not recognized
	}

	getPlayerInfoByPartyName(partyName: string): PlayerInfo | null {
		for (const playerInfo of this._allPlayerCharacters) {
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
			let voteString = "Votes: ";
			for (let i = 0; i < playerInfo.votes.length; i++) {
				voteString += `${playerInfo.votes[i]} `;
			}
			playerInfo.formattedVotes = voteString;

			// a first preference vote gets a small amount of electoral funding
			if (preference == 0) {
				playerInfo.money += this.getFirstPrefMoneyReward();
				playerInfo.money = Math.round(playerInfo.money * 100) / 100;
			}
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
		for (const playerInfo of this._allPlayerCharacters) {
			if (!partyLoyalty.has(playerInfo.value.playerParty)) {
				partyLoyalty.set(playerInfo.value.playerParty, BASE_MOB_HEALTHCAP / 2);
			}
		}

		//add some randomness to the loyalty
		for (const playerInfo of this._allPlayerCharacters) {
			const existingLoyalty = partyLoyalty.get(playerInfo.value.playerParty) || 0;
			partyLoyalty.set(playerInfo.value.playerParty, 2 * existingLoyalty / 3 + existingLoyalty * Math.random() / 3);
		}
	}

	humanCreateBuildGhost(sampleMob: Mob, gridPos: Vector2) {

		//check if this grid cell is free to place something
		const turf = gridController.getTurfAtCoords(gridPos);
		if (!turf?.MobCanEnter(sampleMob)) {
			console.warn(`Player is trying to place a mobType ${sampleMob.mobType} in grid ${gridPos.x},${gridPos.y}\
					but it is blocked`);
			return;
		}

		const humanPlayerInfo = playerController.getHumanPlayer().value;

		//can the player afford this?
		if (humanPlayerInfo.money < sampleMob.baseBuildCost) {
			console.warn(`Player cannot afford mobType ${sampleMob.mobType}, costs ${sampleMob.baseBuildCost} but has ${humanPlayerInfo.money}`);
			return;
		}

		//console.log(`building new placeable mob...`);
		const newMob = mobController.createPlayerMob(sampleMob.mobType, humanPlayerInfo.playerParty);
		newMob.jumpToGrid(gridPos);

		//subtract the money
		humanPlayerInfo.money -= sampleMob.baseBuildCost;
	}
}

const playerController = new PlayerController();
export default playerController;

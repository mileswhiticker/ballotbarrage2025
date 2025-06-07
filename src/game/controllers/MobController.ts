
//import resourceController from '@controllers/ResourceController.ts';

import Mob, { AI_GOAL } from '@game/Mob.ts';
import { MOBTYPE, type MobInfo } from '@game/Mob.ts';
import Vector2 from '@utils/Vector2.ts';
import { PLAYERS } from '@controllers/PlayerController.ts';
//import gridController from '@controllers/GridController.ts';

import {
	IMGPATH_GREYMAN,
	IMGPATH_REDMAN,
	IMGPATH_BLUEMAN,
	IMGPATH_PURPLEMAN,
	IMGPATH_MOB_VOLUNTEER,
	IMGPATH_MOB_AFRAME,
	IMGPATH_MOB_BBQ,
	IMGPATH_MOB_UNKNOWN,
	IMGPATH_BOOTHENTRY,
	IMGPATH_BUS
} from '@assets/_AssetPaths.ts'; 
import playerController from './PlayerController';

class MobController {
	allMobs: Mob[] = [];
	enemyMobs: Mob[] = [];
	playerMobs: Mob[] = [];
	game2dRenderContext: CanvasRenderingContext2D | null = null;
	//playerGridMobs: (Mob|null)[][] = [];		//	[x grid number][y grid number] = mob in this grid cell
	envMobs: Mob[] = [];
	boothMobs: Mob[] = [];
	enemySpawners: Mob[] = [];

	Initialise(game2dRenderContext: CanvasRenderingContext2D) {
		this.game2dRenderContext = game2dRenderContext;

		//for testing: create an enemy mob
		//const newMob = this.createMobInstance(MOBTYPE.WANDER_ENEMY)
		//newMob.isAlive = true;
		//newMob.randomWander = true;
		//newMob.pos.x = 0;
		//newMob.pos.y = 0;
		//this.gameMobs.push(newMob);

		//for testing: create a booth environmental mob
		let boothMob = this.createMobInstance(MOBTYPE.BOOTHENTRY);
		this.envMobs.push(boothMob);
		this.boothMobs.push(boothMob);
		boothMob.jumpToGridFromRawPos(new Vector2(792, 450));

		boothMob = this.createMobInstance(MOBTYPE.BOOTHENTRY);
		this.envMobs.push(boothMob);
		this.boothMobs.push(boothMob);
		boothMob.jumpToGridFromRawPos(new Vector2(792, 130));
	}

	createActiveEnemyMob(mobType: MOBTYPE, spawnloc: Vector2) {
		const newMob = this.createMobInstance(mobType);
		this.enemyMobs.push(newMob);
		newMob.jumpToGridFromRawPos(spawnloc);
		newMob.isAlive = true;
		newMob.myGoal = AI_GOAL.SEEK_BOOTH;
		newMob.party = "voter";
		//console.log(`createActiveEnemyMob(${mobType})`, newMob);
	}

	createActiveEnemyMobAdvanced(mobType: MOBTYPE, spawnloc: Vector2, mobInfo: MobInfo) {

		//create the basic mob and apply starting settings
		const newMob: Mob = new Mob(new Vector2(-9999, -9999), mobInfo.imgPath ? mobInfo.imgPath : IMGPATH_GREYMAN, mobType);
		newMob.jumpToGridFromRawPos(spawnloc);
		newMob.isAlive = true;
		newMob.myGoal = AI_GOAL.SEEK_BOOTH;
		newMob.party = "voter";

		//some other customisable aspects
		if (mobInfo.name) {
			newMob.name = mobInfo.name;
		}
		else {
			newMob.name = "Ordinary Voter";
		}
		if (mobInfo.desc) {
			newMob.desc = mobInfo.desc;
		}
		else {
			newMob.desc = "Just a punter heading in to vote";
		}
		if (mobInfo.health) {
			newMob.health = mobInfo.health;
		}
		if (mobInfo.moveSpeed) {
			newMob.moveSpeed = mobInfo.moveSpeed;
		}
		if (mobInfo.party) {
			const startingLoyalty = newMob.health / 4 + 3 * Math.random() * newMob.health / 4;
			newMob.addPartyLoyalty(mobInfo.party, startingLoyalty);
		}

		//track it
		this.enemyMobs.push(newMob);
		this.allMobs.push(newMob);

		return newMob;
	}

	createPlayerMob(mobType: MOBTYPE, playerFaction: string) {
		const newMob = this.createMobInstance(mobType);
		newMob.isAlive = true;
		newMob.party = playerFaction;
		this.playerMobs.push(newMob);

		return newMob;
	}

	createMobInstance(mobType: MOBTYPE): Mob {
		let newMob: Mob;
		switch (mobType) {
			case MOBTYPE.AFRAME:
				{
					newMob = new Mob(new Vector2(-9999, -9999), IMGPATH_MOB_AFRAME, MOBTYPE.AFRAME);
					newMob.name = "A-Frame with posters";
					newMob.desc = "A stationary poster saying \'Vote for me!\'";
					newMob.isSolid = true;
					break;
				}
			case MOBTYPE.SAUSAGESIZZLE:
				{
					newMob = new Mob(new Vector2(-9999, -9999), IMGPATH_MOB_BBQ, MOBTYPE.SAUSAGESIZZLE);
					newMob.name = "Sausage sizzle";
					newMob.desc = "A stall selling a tasty snack.";
					newMob.isSolid = true;
					break;
				}
			case MOBTYPE.VOLUNTEER:
				{
					newMob = new Mob(new Vector2(-9999, -9999), IMGPATH_MOB_VOLUNTEER, MOBTYPE.VOLUNTEER);
					newMob.name = "Volunteers";
					newMob.desc = "Your front line troopers, handing out flyers to voters.";
					newMob.isSolid = true;
					//newMob.presetAttackType(MISSILETYPE.FLYER);
					break;
				}
			case MOBTYPE.WANDER_ENEMY:
				{
					newMob = new Mob(new Vector2(-9999, -9999), IMGPATH_REDMAN, MOBTYPE.WANDER_ENEMY);
					newMob.name = "Wandering enemy";
					newMob.desc = "A bad dude";
					break;
				}
			case MOBTYPE.VOTER_UNDECIDED:
				{
					newMob = new Mob(new Vector2(-9999, -9999), IMGPATH_GREYMAN, MOBTYPE.VOTER_UNDECIDED);
					newMob.name = "Wandering enemy";
					newMob.desc = "A bad dude";
					break;
				}
			case MOBTYPE.VOTER_RED:
				{
					newMob = new Mob(new Vector2(-9999, -9999), IMGPATH_REDMAN, MOBTYPE.VOTER_RED);
					newMob.name = "Wandering enemy";
					newMob.desc = "A bad dude";
					const startingLoyalty = newMob.health / 4 + 3 * Math.random() * newMob.health / 4;
					newMob.addPartyLoyalty(playerController.getPartyName(PLAYERS.PLAYER_RED), startingLoyalty);
					break;
				}
			case MOBTYPE.VOTER_BLUE:
				{
					newMob = new Mob(new Vector2(-9999, -9999), IMGPATH_BLUEMAN, MOBTYPE.VOTER_BLUE);
					newMob.name = "Wandering enemy";
					newMob.desc = "A bad dude";
					const startingLoyalty = newMob.health / 4 + 3 * Math.random() * newMob.health / 4;
					newMob.addPartyLoyalty(playerController.getPartyName(PLAYERS.PLAYER_BLUE), startingLoyalty);
					break;
				}
			case MOBTYPE.VOTER_PURPLE:
				{
					newMob = new Mob(new Vector2(-9999, -9999), IMGPATH_PURPLEMAN, MOBTYPE.VOTER_PURPLE);
					newMob.name = "Wandering enemy";
					newMob.desc = "A bad dude";
					const startingLoyalty = newMob.health / 4 + 3 * Math.random() * newMob.health / 4;
					newMob.addPartyLoyalty(playerController.getPartyName(PLAYERS.PLAYER_PURPLE), startingLoyalty);
					break;
				}
			case MOBTYPE.BOOTHENTRY:
				{
					newMob = new Mob(new Vector2(-9999, -9999), IMGPATH_BOOTHENTRY, MOBTYPE.BOOTHENTRY);
					newMob.name = "An entrance into the voting booth";
					newMob.desc = "The voters are trying to get here.";
					break;
				}
			case MOBTYPE.ENEMYSPAWNER:
				{
					newMob = new Mob(new Vector2(-9999, -9999), IMGPATH_BUS, MOBTYPE.ENEMYSPAWNER);
					newMob.name = "Voter arrival point";
					newMob.desc = "Voters arrive from here";
					break;
				}
			default:
				{
					newMob = new Mob(new Vector2(-9999, -9999), IMGPATH_MOB_UNKNOWN, MOBTYPE.UNKNOWN);
					console.warn(`MobController::createMobInstance() unknown mob type ${mobType} requested!`);
					break;
				}
		}

		this.allMobs.push(newMob);
		return newMob;
	}

	despawnMe(mob: Mob) {
		const mobIndex = this.allMobs.indexOf(mob);
		if (mobIndex >= 0) {
			this.allMobs.splice(mobIndex, 1);
		}

		//console.log(`MobController::despawnMe()`, mob);
		//remove from player mobs
		const playerIndex = this.playerMobs.indexOf(mob);
		if (playerIndex >= 0) {
			this.playerMobs.splice(playerIndex, 1);
			return;
		}

		//remove from enemy mobs
		const enemyIndex = this.enemyMobs.indexOf(mob);
		if (enemyIndex >= 0) {
			this.enemyMobs.splice(enemyIndex, 1);
			return;
		}
		//console.warn(`MobController::despawnMe() mob not found in player or enemy mobs!`, mob);
	}

	update(deltaTime: number) {
		for (let i = 0; i < this.enemyMobs.length; i++) {
			const curMob = this.enemyMobs[i];
			curMob.update(deltaTime);
		}

		for (let i = 0; i < this.playerMobs.length; i++) {
			const curMob = this.playerMobs[i];
			//console.log("mobcontroller upadting player mob", curMob);
			curMob.update(deltaTime);
		}
	}

	renderMobs() {
		if (this.game2dRenderContext) {
			for (let i = 0; i < this.allMobs.length; i++) {
				const curMob = this.allMobs[i];
				curMob.render(this.game2dRenderContext);

				//for debugging
				for (const debugSprite of curMob.debugSprites) {
					debugSprite.render(this.game2dRenderContext);
				}
			}
		}
	}

	renderEnvMobs() {
		if (this.game2dRenderContext) {
			for (let i = 0; i < this.envMobs.length; i++) {
				const curMob = this.envMobs[i];
				if (curMob.sprite) {
					curMob.sprite.render(this.game2dRenderContext);
				}
			}
		}
	}

	/*
	updatePlayerMobGridPos(mob: Mob, oldGridPos: Vector2) {
		//console.log('MobController::updatePlayerMobGridPos()', mob, oldGridPos);

		//bypass game legality checks. they should already have occurred before this
		//const blockingMob = this.getPlayerMobInGridCell(mob.gridCoords);
		//if (blockingMob && blockingMob.blocksMovement(mob)) {
		//	console.error(`ERROR MobController::updatePlayerMobGridPos() a mob tried to jump to grid ${mob.gridCoords.x},${mob.gridCoords.y} but it was already occupied!`, mob);
		//	return;
		//}

		//safety check: the old grid position should already be valid 
		//it will default to -1, -1 for uninitialised mobs
		if (oldGridPos.x >= 0 && oldGridPos.y >= 0) {

			//is the X grid dimension big enough?
			if (mob.gridCoords.x >= this.playerGridMobs.length) {
				console.error(`ERROR MobController:: updatePlayerMobGridPos() mob.gridCoords.x is out of bounds!`, mob);
			}
			//is the Y grid dimension big enough?
			else if (mob.gridCoords.y >= this.playerGridMobs[mob.gridCoords.x].length) {
				console.error(`ERROR MobController:: updatePlayerMobGridPos() mob.gridCoords.y is out of bounds!`, mob);
			}
			else {
				this.playerGridMobs[mob.gridCoords.x][mob.gridCoords.y] = null;
			}
		}

		//is the X grid dimension big enough?
		while (this.playerGridMobs.length <= mob.gridCoords.x) { 
			//enlarge it
			this.playerGridMobs.push([]);
		}

		//is the Y grid dimension big enough?
		while (this.playerGridMobs[mob.gridCoords.x].length <= mob.gridCoords.y) { 
			//enlarge it
			this.playerGridMobs[mob.gridCoords.x].push(null);
		}

		//finally, update the new grid coords
		this.playerGridMobs[mob.gridCoords.x][mob.gridCoords.y] = mob;

		//console.log('MobController::updatePlayerMobGridPos() success', this.playerGridMobs);

		//update the turf
		const turf = gridController.getTurfAtCoords(mob.gridCoords);
		turf?.MobEnter(mob);
	}
	*/

	/*
	getPlayerMobInGridCell(gridCoords: Vector2): Mob|null {
		//console.error(`getPlayerMobInGridCell()`, gridCoords);

		//is the X grid dimension big enough?
		if (this.playerGridMobs.length > gridCoords.x) {
			//is the Y grid dimension big enough?
			if (this.playerGridMobs[gridCoords.x].length > gridCoords.y) {
				return this.playerGridMobs[gridCoords.x][gridCoords.y];
			}
		}

		//could not find anything
		return null;
	}
	*/

	getRandomBoothMob(): Mob | null {
		if (this.boothMobs.length > 0) {
			const index = Math.round(Math.random() * (this.boothMobs.length - 1));
			const chosenBooth = this.boothMobs[index];
			//console.log(`getRandomBoothMob()`, index, chosenBooth, this.boothMobs);
			return chosenBooth;
		}
		return null;
	}
}

const mobController = new MobController();
export default mobController;


//import resourceController from '@controllers/ResourceController.ts';

import Mob, { AI_GOAL } from '@game/Mob.ts';
import { MOBTYPE } from '@game/Mob.ts';
import Vector2 from '@utils/Vector2.ts';
import gridController from '@controllers/GridController.ts';

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

class MobController {
	enemyMobs: Mob[] = [];
	playerMobs: Mob[] = [];
	game2dRenderContext: CanvasRenderingContext2D | null = null;
	playerGridMobs: (Mob|null)[][] = [];		//	[x grid number][y grid number] = mob in this grid cell
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

		//for testing: create some random player mobs
		let numMobs = 0;
		let tries = 3;
		while (numMobs > 0) {
			const gridCoords = new Vector2(Math.floor(Math.random() * 27), Math.floor(Math.random() * 19));
			//console.log("trying to create mob at...", gridCoords);
			const blockingmob = mobController.getPlayerMobInGridCell(gridCoords);
			if (blockingmob) {

				//safety check
				tries--;
				if (tries <= 0) {
					//console.warn("too many failed attempts in a row! finishing early");
					break;
				}

				//skip this cell
				//console.log("skipping blocker");
				continue;
			}
			tries = 3;
			numMobs--;

			//create a random player mob
			const result = Math.random() * 3;
			let mobType;
			if (result < 1) {
				mobType = MOBTYPE.VOLUNTEER;
			}
			else if (result < 2) {
				mobType = MOBTYPE.AFRAME;
			}
			else {
				mobType = MOBTYPE.SAUSAGESIZZLE;
			}
			const playerMob = this.createPlayerMob(mobType);
			playerMob.jumpToGridFromRawPos(gridController.getRawPosFromGridCoords(gridCoords));

			//console.log("checking if grid update was successful", mobController.getPlayerMobInGridCell(gridCoords));
		}
	}

	createActiveEnemyMob(mobType: MOBTYPE, spawnloc: Vector2) {
		const newMob = this.createMobInstance(mobType);
		this.enemyMobs.push(newMob);
		newMob.jumpToGridFromRawPos(spawnloc);
		newMob.isAlive = true;
		newMob.myGoal = AI_GOAL.SEEK_BOOTH;
		newMob.party = "enemy";
		//console.log(`createActiveEnemyMob(${mobType})`, newMob);
	}

	createPlayerMob(mobType: MOBTYPE) {
		const newMob = this.createMobInstance(mobType);
		newMob.isAlive = true;
		newMob.party = "player";
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
					newMob.placeableDesc = "A stationary poster saying \'Vote for me!\'";
					newMob.isSolid = true;
					break;
				}
			case MOBTYPE.SAUSAGESIZZLE:
				{
					newMob = new Mob(new Vector2(-9999, -9999), IMGPATH_MOB_BBQ, MOBTYPE.SAUSAGESIZZLE);
					newMob.name = "Sausage sizzle";
					newMob.placeableDesc = "A stall selling a tasty snack.";
					newMob.isSolid = true;
					break;
				}
			case MOBTYPE.VOLUNTEER:
				{
					newMob = new Mob(new Vector2(-9999, -9999), IMGPATH_MOB_VOLUNTEER, MOBTYPE.VOLUNTEER);
					newMob.name = "Volunteers";
					newMob.placeableDesc = "Your front line troopers, handing out flyers to voters.";
					newMob.isSolid = true;
					//newMob.presetAttackType(MISSILETYPE.FLYER);
					break;
				}
			case MOBTYPE.WANDER_ENEMY:
				{
					newMob = new Mob(new Vector2(-9999, -9999), IMGPATH_REDMAN, MOBTYPE.WANDER_ENEMY);
					newMob.name = "Wandering enemy";
					newMob.placeableDesc = "A bad dude";
					break;
				}
			case MOBTYPE.VOTER_UNDECIDED:
				{
					newMob = new Mob(new Vector2(-9999, -9999), IMGPATH_GREYMAN, MOBTYPE.VOTER_UNDECIDED);
					newMob.name = "Wandering enemy";
					newMob.placeableDesc = "A bad dude";
					break;
				}
			case MOBTYPE.VOTER_RED:
				{
					newMob = new Mob(new Vector2(-9999, -9999), IMGPATH_REDMAN, MOBTYPE.VOTER_RED);
					newMob.name = "Wandering enemy";
					newMob.placeableDesc = "A bad dude";
					break;
				}
			case MOBTYPE.VOTER_BLUE:
				{
					newMob = new Mob(new Vector2(-9999, -9999), IMGPATH_BLUEMAN, MOBTYPE.VOTER_BLUE);
					newMob.name = "Wandering enemy";
					newMob.placeableDesc = "A bad dude";
					break;
				}
			case MOBTYPE.VOTER_PURPLE:
				{
					newMob = new Mob(new Vector2(-9999, -9999), IMGPATH_PURPLEMAN, MOBTYPE.VOTER_PURPLE);
					newMob.name = "Wandering enemy";
					newMob.placeableDesc = "A bad dude";
					break;
				}
			case MOBTYPE.BOOTHENTRY:
				{
					newMob = new Mob(new Vector2(-9999, -9999), IMGPATH_BOOTHENTRY, MOBTYPE.BOOTHENTRY);
					newMob.name = "An entrance into the voting booth";
					newMob.placeableDesc = "The voters are trying to get here.";
					break;
				}
			case MOBTYPE.ENEMYSPAWNER:
				{
					newMob = new Mob(new Vector2(-9999, -9999), IMGPATH_BUS, MOBTYPE.ENEMYSPAWNER);
					newMob.name = "Voter arrival point";
					newMob.placeableDesc = "Voters arrive from here";
					break;
				}
			default:
				{
					newMob = new Mob(new Vector2(-9999, -9999), IMGPATH_MOB_UNKNOWN, MOBTYPE.UNKNOWN);
					console.warn(`MobController::createMobInstance() unknown mob type ${mobType} requested!`);
					break;
				}
		}

		return newMob;
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

	renderEnemyMobs() {
		if (this.game2dRenderContext) {
			for (let i = 0; i < this.enemyMobs.length; i++) {
				const curMob = this.enemyMobs[i];
				if (curMob.sprite) {
					curMob.sprite.Render(this.game2dRenderContext);
				}
			}
		}
	}

	renderPlayerMobs() {
		if (this.game2dRenderContext) {
			for (let i = 0; i < this.playerMobs.length; i++) {
				const curMob = this.playerMobs[i];
				if (curMob.sprite) {
					curMob.sprite.Render(this.game2dRenderContext);
				}

				for (const debugSprite of curMob.debugSprites) {
					debugSprite.Render(this.game2dRenderContext);
				 }
			}
		}
	}

	renderEnvMobs() {
		if (this.game2dRenderContext) {
			for (let i = 0; i < this.envMobs.length; i++) {
				const curMob = this.envMobs[i];
				if (curMob.sprite) {
					curMob.sprite.Render(this.game2dRenderContext);
				}
			}
		}
	}

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

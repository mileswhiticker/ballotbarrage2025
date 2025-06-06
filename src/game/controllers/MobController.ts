
import resourceController from '@controllers/ResourceController.ts';

import Mob from '@game/Mob.ts';
import { MOBTYPE } from '@game/Mob.ts';
import Vector2 from '@utils/Vector2.ts';
import gridController from '@controllers/GridController.ts';

const IMGPATH_GREYMAN: string = './src/assets/greyman.png';
const IMGPATH_REDMAN: string = './src/assets/redman.png';
const IMGPATH_BLUEMAN: string = './src/assets/blueman.png';
//const PATH_BORDER10: string = './src/assets/10 Border 01.png';

const IMGPATH_MOB_UNKNOWN: string = './src/assets/pinkquestion.png';
//const IMGPATH_MOB_VOLUNTEER: string = './src/assets/greyman.png';
const IMGPATH_MOB_AFRAME: string = './src/assets/aframe.png';
const IMGPATH_MOB_SAUSAGESIZZLE: string = './src/assets/sausagesizzle.png';
const IMGPATH_MOB_BBQ: string = './src/assets/bbq.png';

const IMGPATH_BOOTHENTRY: string = './src/assets/boothentry.png';

class MobController {
	gameMobs: Mob[] = [];
	playerMobs: Mob[] = [];
	game2dRenderContext: CanvasRenderingContext2D | null = null;
	playerGridMobs: (Mob|null)[][] = [];		//	[x grid number][y grid number] = mob in this grid cell
	envMobs: Mob[] = [];
	boothMobs: Mob[] = [];

	Initialise(game2dRenderContext: CanvasRenderingContext2D) {
		this.game2dRenderContext = game2dRenderContext;

		resourceController.LoadImage(IMGPATH_GREYMAN);
		resourceController.LoadImage(IMGPATH_REDMAN);
		resourceController.LoadImage(IMGPATH_BLUEMAN);
		resourceController.LoadImage(IMGPATH_MOB_AFRAME);
		resourceController.LoadImage(IMGPATH_MOB_BBQ);
		//resourceController.LoadImage(IMGPATH_MOB_VOLUNTEER);
		resourceController.LoadImage(IMGPATH_MOB_UNKNOWN);
		resourceController.LoadImage(IMGPATH_BOOTHENTRY);

		//for testing: create an enemy mob
		const newMob = this.createMobInstance(MOBTYPE.WANDER_ENEMY)
		newMob.isAlive = true;
		newMob.randomWander = true;
		newMob.pos.x = 0;
		newMob.pos.y = 0;
		this.gameMobs.push(newMob);

		//for testing: create a booth environmental mob
		const boothMob = this.createMobInstance(MOBTYPE.BOOTHENTRY);
		this.envMobs.push(boothMob);
		this.boothMobs.push(boothMob);
		boothMob.jumpToGridFromRawPos(new Vector2(792, 480));

		//for testing: create some random player mobs
		let numMobs = 30;
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

	createPlayerMob(mobType: MOBTYPE) {
		const newMob = this.createMobInstance(mobType);
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
					break;
				}
			case MOBTYPE.SAUSAGESIZZLE:
				{
					newMob = new Mob(new Vector2(-9999, -9999), IMGPATH_MOB_BBQ, MOBTYPE.SAUSAGESIZZLE);
					newMob.name = "Sausage sizzle";
					newMob.placeableDesc = "A stall selling a tasty snack.";
					break;
				}
			case MOBTYPE.VOLUNTEER:
				{
					newMob = new Mob(new Vector2(-9999, -9999), IMGPATH_BLUEMAN, MOBTYPE.VOLUNTEER);
					newMob.name = "Volunteers";
					newMob.placeableDesc = "Your front line troopers, handing out flyers to voters.";
					break;
				} 
			case MOBTYPE.WANDER_ENEMY:
				{
					newMob = new Mob(new Vector2(-9999, -9999), IMGPATH_REDMAN, MOBTYPE.WANDER_ENEMY);
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
			default:
				{
					newMob = new Mob(new Vector2(-9999, -9999), IMGPATH_MOB_UNKNOWN, MOBTYPE.UNKNOWN);
					break;
				}
		}

		return newMob;
	}

	update(deltaTime: number) {
		for (let i = 0; i < this.gameMobs.length; i++) {
			const curMob = this.gameMobs[i];
			curMob.update(deltaTime);
		}
	}

	renderGameMobs() {
		if (this.game2dRenderContext) {
			for (let i = 0; i < this.gameMobs.length; i++) {
				const curMob = this.gameMobs[i];
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

		//todo: safety checks before it gets to this point
		const blockingMob = this.getPlayerMobInGridCell(mob.gridCoords);
		if (blockingMob) {
			console.error(`ERROR MobController::updatePlayerMobGridPos() a mob tried to jump to grid ${mob.gridCoords.x},${mob.gridCoords.y} but it was already occupied!`, mob);
			return
		}

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
}

const mobController = new MobController();
export default mobController;

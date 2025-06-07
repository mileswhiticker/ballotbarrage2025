import Vector2 from '@utils/Vector2.ts';
import { Sprite } from '@utils/Sprite.ts';
import gridController, { GridRoute } from '@controllers/GridController.ts';
import mobController from '@controllers/MobController.ts';
import { MISSILETYPE } from '@game/Missile';
import Turf from '@game/Turf.ts';
import {generateUUID} from '@utils/uuid.ts';
import { MobAttack } from './MobAttack';

export enum MOBTYPE {
	UNKNOWN = -1,
	NONE,
	//
	VOLUNTEER,
	AFRAME,
	SAUSAGESIZZLE,
	//
	WANDER_ENEMY,
	VOTER_UNDECIDED,
	VOTER_RED,
	VOTER_BLUE,
	VOTER_PURPLE,
	//
	BOOTHENTRY,
	ENEMYSPAWNER,
}

export enum AI_GOAL {
	UNKNOWN = -1,
	IDLE,
	WANDER,
	SEEK_BOOTH
}

export default class Mob {
	pos: Vector2;
	dims: Vector2;
	targetPos: Vector2 | null = null;
	moveRoute: GridRoute | null = null;
	moveSpeed: number = 128;
	sprite: Sprite;
	imagePath: string;
	age: number = 0;
	isAlive: boolean = false;
	randomWander: boolean = false;
	name: string = "UNKNOWN_NAME_NA";
	placeableDesc: string = "UNKNOWN_DESC_NA";
	mobType: MOBTYPE = MOBTYPE.UNKNOWN;
	renderOpacity = 1;
	isSolid: boolean = false; //can this mob block movement of other mobs?

	gridCoords: Vector2 = new Vector2(-1, -1);
	thinkingTime: number = 1;
	tLeftThinking: number = 1;
	myGoal: AI_GOAL = AI_GOAL.UNKNOWN;

	partyLoyalty: Map<string, number> = new Map<string, number>();

	party: string = "na"; //which party does this mob belong to? (for missiles, voters, etc)

	uuid: string = generateUUID(); //unique identifier for this mob
	mobAttack: MobAttack | null = null;
	listeningTurfs: Turf[] = []; //turf this mob is listening to for nearby mobs

	debugSprites: Sprite[] = [];
	curTurf: Turf | null = null;

	constructor(startPos: Vector2, imagePath: string, mobType: MOBTYPE) {
		this.pos = startPos;
		this.imagePath = imagePath;
		this.sprite = new Sprite(imagePath);
		this.sprite.pos = this.pos;
		this.dims = new Vector2(64, 64);
		this.mobType = mobType;

		switch (mobType) {
			case MOBTYPE.VOLUNTEER: {
				//console.error('setting up flyer attack in Mob constructor');
				this.mobAttack = new MobAttack(this);
				this.mobAttack.presetAttackType(MISSILETYPE.FLYER);
			}
		}
	}

	update(deltaTime: number, doDebug: boolean = false) {
		if (doDebug)	console.log("mob update",this);
		if (this.isAlive) {
			this.age += deltaTime;

			if (this.targetPos || this.moveRoute) {
				this.doMove(deltaTime);
			}
			else {
				this.doThink(deltaTime);
			}

			if (this.mobAttack) {
				//console.log("upadting mob with attack", this);
				if (this.mobAttack.tLeftAttack <= 0) {
					this.mobAttack.tryAttackMob();
				}
				else {
					this.mobAttack.tLeftAttack -= deltaTime;
				}
			}
		}
	}

	blocksMovement(other?: Mob) {
		switch (other?.mobType) {
			//
		}

		//switch (this.mobType) {
		//	case MOBTYPE.ENEMYSPAWNER:
		//		{
		//			return false;
		//		}
		//	case MOBTYPE.BOOTHENTRY:
		//		{
		//			return false;
		//		}
		//}
		return this.isSolid;
	}

	jumpToGridFromRawPos(rawPos: Vector2) {

		//take the raw pixel position and snap it to the nearest grid coordinates
		const snappedPos = gridController.snapToGrid(rawPos);
		//const snappedPos = new Vector2(Math.round(rawPos.x / gridController.gridCellDim) * gridController.gridCellDim, Math.round(rawPos.y / gridController.gridCellDim) * gridController.gridCellDim);

		//set the position
		this.pos.x = snappedPos.x;
		this.pos.y = snappedPos.y;

		//remmeber the old grid coords we were in
		const oldGridPos = this.gridCoords.clone();

		//apply the new grid coordinates
		this.gridCoords = gridController.getGridCoords(rawPos);
		//this.gridCoords.x = snappedPos.x / gridController.gridCellDim;
		//this.gridCoords.y = snappedPos.y / gridController.gridCellDim;

		//tell the grid to update its grid contents tracking
		mobController.updatePlayerMobGridPos(this, oldGridPos);
		this.postMoveUpdates();
	}

	postMoveUpdates() {
		for (const curTurf of this.listeningTurfs) {
			curTurf.MobStopListening(this);
		}

		//clear old debug sprites for garbage collection
		this.debugSprites = [];

		if (this.mobAttack) {

			const listeningTurfs = gridController.getTurfsInRange(this.gridCoords, this.mobAttack.getRange());
			for (const turf of listeningTurfs) {
				turf.MobStartListening(this);
				this.listeningTurfs.push(turf);

				//now create a debug sprite for this turf
				//const newDebugSprite = new Sprite();
				//newDebugSprite.pos = gridController.getRawPosFromGridCoords(turf.gridCoords);
				//newDebugSprite.pos.add(new Vector2(gridController.gridCellDim / 2, gridController.gridCellDim / 2));
				//this.debugSprites.push(newDebugSprite);
			}
		}

		if (this.curTurf) {
			this.curTurf.MobLeave(this);
		}
		this.curTurf = gridController.getTurfAtPosition(this.pos);
		if (this.curTurf) {
			this.curTurf.MobEnter(this);
		}
	}

	mobEnteredTurfNearby(mob: Mob, turf: Turf) {
		if (this.mobAttack) {
			//console.log("mob entered turf nearby", mob, turf);
			this.mobAttack.mobEnteredTurfNearby(mob, turf);
		};
	}

	mobLeftTurfNearby(mob: Mob, turf: Turf) {
		if (this.mobAttack) {
			//console.log("mob entered turf nearby", mob, turf);
			this.mobAttack.mobLeftTurfNearby(mob, turf);
		};
	}

	doMove(deltaTime: number) {
		if (!this.targetPos) {
			if (this.moveRoute) {
				const gridTarget = this.moveRoute.squares[0];
				const nextTurf = gridController.getTurfAtCoords(gridTarget);
				if (nextTurf && !nextTurf.MobCanEnter(this)) {
					//console.warn(`Mob is unexpectedly blocked! Invalidating old route...`);
					this.moveRoute = null;
				}
				else {
					this.targetPos = gridController.getRawPosFromGridCoords(gridTarget);
					//console.log("getting new target pos: ", this.targetPos);
				}
			}
			else {
				console.error('trying to move, but no moveRoute!', this);
			}
		}
		if (this.targetPos) {
			//console.log("moving", this.targetPos);

			//how far away are we?
			const distLeftSqrd = this.pos.distSqrd(this.targetPos);
			const thresholdSqrd = 1;
			const arrived = distLeftSqrd <= thresholdSqrd || distLeftSqrd <= (this.moveSpeed * deltaTime) ** 2;

			//have we arrived?
			if (arrived) {
				//console.log("arrived at targetPos");
				//trigger any turf events
				if (this.curTurf) {
					this.curTurf.MobLeave(this);
				}
				this.curTurf = gridController.getTurfAtPosition(this.pos);
				if (this.curTurf) {
					this.curTurf.MobEnter(this);
				}

				//reset the target
				this.targetPos = null;

				//remove it from the route
				if (this.moveRoute) {
					this.moveRoute.squares.splice(0, 1);

					//is this the end of the path?
					if (this.moveRoute.squares.length == 0) {
						//console.log("reached end of route");
						this.moveRoute = null;

						switch (this.myGoal) {
							case AI_GOAL.SEEK_BOOTH:
								{
									this.myGoal = AI_GOAL.IDLE;
								}
						}
					}
				}
			}
			else {
				//move towards target
				const dir = this.targetPos.clone();
				//console.log(dir);
				dir.subtract(this.pos);
				dir.normalise();
				dir.multiply(this.moveSpeed * deltaTime);
				this.pos.add(dir);
			}
		}
	}

	doThink(deltaTime: number) {
		this.tLeftThinking -= deltaTime;
		if (this.tLeftThinking <= 0) {
			//reset the think counter
			this.tLeftThinking = this.thinkingTime;

			//do something
			switch (this.myGoal) {
				case AI_GOAL.SEEK_BOOTH: {

					const startCoords = gridController.getGridCoords(this.pos);
					const targetBooth = mobController.getRandomBoothMob();
					if (targetBooth) {
						const targetCoords = gridController.getGridCoords(targetBooth.pos);
						this.moveRoute = gridController.pathToGrid(startCoords, targetCoords, false);
						//console.log("Enemy deciding to move to booth:", targetBooth, this.moveRoute);
					}
					break;
				}

				case AI_GOAL.WANDER: {

					//console.log("picking new path");
					//random new move target
					//let  = new Vector2(Math.random() * 500, Math.random() * 500);

					const startCoords = gridController.getGridCoords(this.pos);
					const targetCoords = new Vector2(Math.floor(Math.random() * gridController.gridMax.x), Math.floor(Math.random() * gridController.gridMax.y));
					const blockingMob = mobController.getPlayerMobInGridCell(targetCoords);
					if (blockingMob) {
						//do another round
						this.tLeftThinking = deltaTime * 0.1;
						return;
					}
					this.moveRoute = gridController.pathToGrid(startCoords, targetCoords, true);

					//console.log(`new grid route:`, gridController.debugRoute);

					break;
				}
			}
		}
		else {
			//console.log("thinking", this);
		}
	}

	addPartyLoyalty(party: string, loyalty: number) {
		if (this.partyLoyalty.has(party)) {
			this.partyLoyalty.set(party, this.partyLoyalty.get(party)! + loyalty)
		}
		else {
			this.partyLoyalty.set(party, loyalty);
		}
	}
}

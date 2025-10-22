import Vector2 from '@utils/Vector2.ts';
import { Sprite } from '@utils/Sprite.ts';
import gridController, { GridRoute } from '@controllers/GridController.ts';
import mobController from '@controllers/MobController.ts';
import { MISSILETYPE } from '@game/Missile';
import Turf from '@game/Turf.ts';
import {generateUUID} from '@utils/uuid.ts';
import { MobAttack } from '@game/MobAttack';
import type { ColourInfo } from '@utils/ColourInfo';
import playerController from '@controllers/PlayerController';
import enemyController from "@controllers/EnemyController.ts";
import gameController from "@controllers/GameController.ts";

export const BASE_MOB_HEALTHCAP = 1;

export enum MOBTYPE {
	UNKNOWN = -1,
	NONE,
	//
	VOLUNTEER,
	VOLUNTEER2,
	AFRAME,
	SAUSAGESIZZLE,
	//
	WANDER_ENEMY,
	VOTER_UNDECIDED,
	VOTER_RED,
	VOTER_BLUE,
	VOTER_PURPLE,
	//
	VOTER_UNDECIDED_EASY,
	VOTER_UNDECIDED_MED,
	VOTER_UNDECIDED_HARD,
	//
	VOTER_DECIDED_EASY,
	VOTER_DECIDED_MED,
	VOTER_DECIDED_HARD,
	//
	VOTER_HOSTILE_EASY,
	VOTER_HOSTILE_MED,
	VOTER_HOSTILE_HARD,
	//
	BOOTHENTRY,
	ENEMYSPAWNER,
}

export interface MobInfo {
	health: number;
	healthMod: number;
	imgPath: string;
	party?: string;
	moveSpeed: number;
	speedMod: number;
	mobLevel: number;
	name: string;
	desc: string;
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
	moveSpeed: number = 64;
	sprite: Sprite;
	imagePath: string;
	age: number = 0;
	isAlive: boolean = false;
	randomWander: boolean = false;
	name: string = "UNKNOWN_NAME_NA";
	desc: string = "UNKNOWN_DESC_NA";
	mobType: MOBTYPE = MOBTYPE.UNKNOWN;
	renderOpacity = 1;
	isSolid: boolean = false; //can this mob block movement of other mobs?
	buildCost: number = 5;
	buyCost: number = 20;

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
	health: number = 5;

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
				this.mobAttack = new MobAttack(this, MISSILETYPE.FLYER);
				break;
			}
			case MOBTYPE.VOLUNTEER2: {
				//console.error('setting up flyer attack in Mob constructor');
				this.mobAttack = new MobAttack(this, MISSILETYPE.CONVINCE);
				break;
			}
			case MOBTYPE.SAUSAGESIZZLE: {
				this.mobAttack = new MobAttack(this, MISSILETYPE.SAUSAGE);
				break;
			}
			case MOBTYPE.AFRAME: {
				this.mobAttack = new MobAttack(this, MISSILETYPE.AFRAME);
				break;
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
					this.mobAttack.tryAttackMob(deltaTime);
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

		//apply the new grid coordinates
		this.gridCoords = gridController.getGridCoords(rawPos);
		//this.gridCoords.x = snappedPos.x / gridController.gridCellDim;
		//this.gridCoords.y = snappedPos.y / gridController.gridCellDim;

		this.postMoveUpdates();
	}

	jumpToGrid(gridPos: Vector2) {
		const rawPos = gridController.getRawPosFromGridCoords(gridPos);

		this.pos.x = rawPos.x;
		this.pos.y = rawPos.y;

		this.gridCoords = gridPos.clone();

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

	mobEnteredTurfNearby(mob: Mob) {
		if (this.mobAttack) {
			//console.log("mob entered turf nearby", mob, turf);
			this.mobAttack.mobEnteredTurfNearby(mob);
		}
	}

	mobLeftTurfNearby(mob: Mob) {
		if (this.mobAttack) {
			//console.log("mob entered turf nearby", mob, turf);
			this.mobAttack.mobLeftTurfNearby(mob);
		}
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
									if (this.curTurf) {
										this.curTurf.MobLeave(this);
										this.curTurf = null;
									}
									mobController.despawnMe(this);

									//add a bit of randomness to the voting
									playerController.slightlyRandomiseLoyalty(this.partyLoyalty);

									//sort the party names in order of loyalty
									const sortedParties = Array.from(this.partyLoyalty.entries())
										.sort((a, b) => b[1] - a[1]) // sort by loyalty descending
										.map(entry => entry[0]); // extract party names

									//console.log(`sortedParties:`,sortedParties);

									//cast votes
									for (let pref = 0; pref < sortedParties.length; pref++) {
										const partyName = sortedParties[pref];
										playerController.castVote(partyName, pref);
									}

									//ready to finish the round?
									if(enemyController.areEnemiesDefeated()){
										gameController.tryFinishRound();
									}
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
					const targetTurf = gridController.getRandomTurf();
					if (targetTurf.MobCanEnter(this)) {
						//do another round
						this.tLeftThinking = deltaTime * 0.1;
						return;
					}
					this.moveRoute = gridController.pathToGrid(startCoords, targetTurf.gridCoords, true);

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

		if (this.partyLoyalty.get(party)! > this.health) {
			this.partyLoyalty.set(party, this.health);
		}

		if (this.partyLoyalty.get(party)! < 0) {
			this.partyLoyalty.set(party, 0);
			//console.log(`Enemy mob loyalty for ${party} is nulled!`);
		} else {
			//console.log(`Enemy mob loyalty for ${party} set to ${this.partyLoyalty.get(party) }`);
		}

		//console.log(`addPartyLoyalty()`, this.partyLoyalty);
	}

	yum(yumAmount: number) {
		this.partyLoyalty.forEach((value: number, key: string) => {
			this.addPartyLoyalty(key, yumAmount);
		});
	}

	isMaxLoyalty(party: string): boolean {
		return this.partyLoyalty.has(party) && this.partyLoyalty.get(party)! >= this.health;

	}

	hasEnemyLoyalty(party: string): boolean {
		for (const item of this.partyLoyalty) {
			if (item[0] != party && item[1] > 0) {
				return true;
			}
		}
		return false;
	}

	underlayHalo: ColourInfo | null = null;
	doDebug: boolean = false;
	render(context: CanvasRenderingContext2D) {
		//if (this.doDebug) console.log('rendermob', this);

		/*if (this.underlayHalo) {
			context.beginPath();
			context.ellipse(
				this.pos.x, this.pos.y,	// centerX, centerY
				16, 32,					// radiusX, radiusY
				0,						// rotation (in radians)
				0, Math.PI * 2			// startAngle, endAngle
			);
			context.fillStyle = this.underlayHalo.hex_string;
			context.fill();
			context.strokeStyle = "black";
			context.stroke();
		}*/

		for (let i = 0; i < this.partyLoyalty.size; i++) {

			const party = Array.from(this.partyLoyalty.keys())[i];
			const loyalty = this.partyLoyalty.get(party);

			if (loyalty) {
				context.strokeStyle = playerController.GetPartyColour(party).hex_string;
				context.lineWidth = 3;

				context.beginPath();
				const lineStartX = this.pos.x;
				const lineEndX = lineStartX + gridController.gridCellDim * (loyalty / Math.max(loyalty, this.health));
				const lineY = this.pos.y + i * 6;
				context.moveTo(lineStartX, lineY);
				context.lineTo(lineEndX, lineY);
				context.stroke();
			}
		}

		if (this.sprite) {
			this.sprite.render(context);
		}
	}
}

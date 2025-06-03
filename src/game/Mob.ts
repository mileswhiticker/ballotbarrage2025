import Vector2 from './Vector2.ts';
import { Sprite } from './Sprite.ts';
import gridController from './GridController.ts';

export enum MOBTYPE {
	UNKNOWN = -1,
	NONE,
	//
	VOLUNTEER,
	AFRAME,
	SAUSAGESIZZLE,
	//
	WANDER_ENEMY
}

export default class Mob {
	pos: Vector2;
	dims: Vector2;
	targetPos: Vector2 = new Vector2(0, 0);
	moveSpeed: number = 0.2;
	sprite: Sprite;
	imagePath: string;
	age: number = 0;
	isAlive: boolean = false;
	randomWander: boolean = false;
	name: string = "UNKNOWN_NAME_NA";
	placeableDesc: string = "UNKNOWN_DESC_NA";
	mobType: MOBTYPE = MOBTYPE.UNKNOWN;
	renderOpacity = 1;

	constructor(startPos: Vector2, imagePath: string, mobType: MOBTYPE) {
		this.pos = startPos;
		this.imagePath = imagePath;
		this.sprite = new Sprite(imagePath);
		this.sprite.pos = this.pos;
		this.dims = new Vector2(64, 64);
		this.mobType = mobType;
	}

	update(deltaTime: number) {
		if (this.isAlive) {
			this.age += deltaTime;

			if (this.randomWander) {
				this.doWander(deltaTime);
			}
		}
	}

	jumpToGridFromRawPos(pos: Vector2) {
		const snappedPos = new Vector2(Math.round(pos.x / gridController.gridCellDim) * gridController.gridCellDim, Math.round(pos.y / gridController.gridCellDim) * gridController.gridCellDim);
		this.pos.x = snappedPos.x;
		this.pos.y = snappedPos.y;
	}

	doWander(deltaTime: number) {

		//have we reached out target?
		const distLeftSqrd = this.pos.distSqrd(this.targetPos);
		const thresholdSqrd = 5 ** 2;
		const arrived = distLeftSqrd <= thresholdSqrd || distLeftSqrd <= (this.moveSpeed * deltaTime) ** 2;
		//console.log(`Mob distLeftSqrd: ${distLeftSqrd}`);
		if (arrived) {
			//random new move target
			this.targetPos.x = Math.random() * 500;
			this.targetPos.y = Math.random() * 500;

			//console.log(`Arrived! new targetPos:`, this.targetPos);
		}
		else {
			//move towards target
			const dir = this.targetPos.clone();
			dir.subtract(this.pos);
			dir.normalise();
			dir.multiply(this.moveSpeed * deltaTime);
			this.pos.add(dir);

			//console.log(`Mob dir:`, dir);
		}
	}
}

import Vector2 from './Vector2.ts';
import { Sprite } from './Sprite.ts';
import gridController from './GridController.ts';
import mobController from './MobController.ts';

export enum MOBTYPE {
	UNKNOWN = -1,
	NONE,
	//
	VOLUNTEER,
	AFRAME,
	SAUSAGESIZZLE,
	//
	WANDER_ENEMY,
	//
	BOOTHENTRY
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

	gridCoords: Vector2 = new Vector2(-1, -1);

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

			const startCoords = gridController.getGridCoords(this.pos);
			const targetCoords = gridController.getGridCoords(this.targetPos);
			gridController.debugRoute = gridController.pathToGrid(startCoords, targetCoords);

			console.log(`new grid route:`, gridController.debugRoute);
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

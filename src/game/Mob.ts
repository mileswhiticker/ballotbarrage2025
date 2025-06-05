import Vector2 from '@utils/Vector2.ts';
import { Sprite } from '@utils/Sprite.ts';
import gridController, { GridRoute } from '@controllers/GridController.ts';
import mobController from '@controllers/MobController.ts';

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

	gridCoords: Vector2 = new Vector2(-1, -1);
	thinkingTime: number = 1;
	tLeftThinking: number = 1;

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

			if (this.targetPos || this.moveRoute)
			{
				this.doMove(deltaTime);
			}
			else {
				this.doThink(deltaTime);
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

	doMove(deltaTime: number) {
		if (!this.targetPos) {
			if (this.moveRoute) {
				const gridTarget = this.moveRoute.squares[0];
				this.targetPos = gridController.getRawPosFromGridCoords(gridTarget);
				//console.log("getting new target pos: ", this.targetPos);
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

				//reset the target
				this.targetPos = null;

				//remove it from the route
				if (this.moveRoute) {
					this.moveRoute.squares.splice(0, 1);

					//is this the end of the path?
					if (this.moveRoute.squares.length == 0) {
						//console.log("reached end of route");
						this.moveRoute = null;
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

			if (this.randomWander) {
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
			}
			else {
				console.log("doThink() but no logic defined for this mob", this);
			}
		}
		else {
			//console.log("thinking", this);
		}
	}
}

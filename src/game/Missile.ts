import Vector2 from '@utils/Vector2';
import { Sprite } from '@utils/Sprite';
import Mob from '@game/Mob';

export enum MISSILETYPE {
	UNKNOWN = -1,
	FLYER,
	CONVINCE,
	SAUSAGE,
	DRINK,
	AFRAME
}

export default class Missile {
	pos: Vector2;
	dims: Vector2;
	targetPos: Vector2 | null = null;
	moveSpeed: number = 512;
	sprite: Sprite;
	imagePath: string;
	mobTarget: Mob | null = null; //target mob to attack
	missileType: MISSILETYPE = MISSILETYPE.UNKNOWN;
	party: string = "na";
	isAlive: boolean = true;

	constructor(startPos: Vector2, targetPos: Vector2, imagePath: string, missileType: MISSILETYPE) {
		this.pos = startPos;
		this.targetPos = targetPos;
		this.imagePath = imagePath;
		this.sprite = new Sprite(imagePath);
		this.sprite.pos = this.pos;
		this.dims = new Vector2(64, 64);
		this.missileType = missileType;
	}

	update(deltaTime: number) {
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
				this.isAlive = false;

				//todo: what effect?
				switch (this.missileType) {
					case MISSILETYPE.FLYER: {
						if (this.mobTarget) {
							this.mobTarget.addPartyLoyalty(this.party, 0.2);
						}
						break;
					}
					case MISSILETYPE.CONVINCE: {
						if (this.mobTarget) {
							this.mobTarget.addPartyLoyalty(this.party, 0.4);
						}
						break;
					}
					case MISSILETYPE.SAUSAGE: {
						if (this.mobTarget) {
							this.mobTarget.yum(-1);
						}
						break;
					}
				}
			} else {
				//move towards target
				const dir = this.targetPos.clone();
				dir.subtract(this.pos);
				dir.normalise();
				dir.multiply(this.moveSpeed * deltaTime);
				this.pos.add(dir);
			}
		}
	}
}

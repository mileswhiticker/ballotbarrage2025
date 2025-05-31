import Vector2 from './Vector2.ts';
import {Sprite} from './Sprite.ts';

export default class Mob {
	pos: Vector2;
	dims: Vector2;
	targetPos: Vector2 = new Vector2(0, 0);
	moveSpeed: number = 0.2;
	sprite: Sprite;
	age: number = 0;
	isAlive: boolean = false;
	randomWander: boolean = false;

	constructor(startPos: Vector2, imagePath: string) {
		this.pos = startPos;
		this.sprite = new Sprite(imagePath);
		this.sprite.pos = this.pos;
		this.dims = new Vector2(64, 64);
	}

	update(deltaTime: number) {
		if (this.isAlive) {
			this.age += deltaTime;

			if (this.randomWander){

				//have we reached out target?
				const distLeftSqrd = this.pos.distSqrd(this.targetPos);
				const thresholdSqrd = 5**2;
				const arrived = distLeftSqrd <= thresholdSqrd || distLeftSqrd <= (this.moveSpeed * deltaTime)**2;
				//console.log(`Mob distLeftSqrd: ${distLeftSqrd}`);
				if (arrived) {
					//random new move target
					this.targetPos.x = Math.random() * 500;
					this.targetPos.y = Math.random() * 500;

					//console.log(`Arrived! new targetPos:`, this.targetPos);
				}
				else
				{
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
	}
}

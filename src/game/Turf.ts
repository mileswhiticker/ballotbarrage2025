import Vector2 from '@utils/Vector2.ts';
import { Sprite } from '@utils/Sprite.ts';
import Mob from '@game/Mob.ts';

export class Turf {
	gridCoords: Vector2 = new Vector2(-1, -1);
	sprite: Sprite | null = null;
	mobsPresent: Mob[] = [];
	blockingMobsPresent: Mob[] = [];

	MobCanEnter(mob: Mob) {
		if (this.blockingMobsPresent.length > 0) {
			return false;
		}
		return true;
	}

	MobEnter(mob: Mob) {
		this.mobsPresent.push(mob);
		if (mob.isSolid) {
			this.blockingMobsPresent.push(mob);
		};
	}

	MobLeave(mob: Mob) {
		//remove from regular mobs
		for(let i = 0; i < this.mobsPresent.length; i++) {
			if (this.mobsPresent[i] === mob) {
				this.mobsPresent.splice(i, 1);
				break;
			}
		}

		//remove from blocking mobs
		if (mob.isSolid) {
			for (let i = 0; i < this.blockingMobsPresent.length; i++) {
				if (this.blockingMobsPresent[i] === mob) {
					this.blockingMobsPresent.splice(i, 1);
					break;
				}
			}
		}
	}
}

import Vector2 from '@utils/Vector2.ts';
import { Sprite } from '@utils/Sprite.ts';
import Mob from '@game/Mob.ts';

export default class Turf {
	gridCoords: Vector2 = new Vector2(-1, -1);
	sprite: Sprite | null = null;
	mobsPresent: Mob[] = [];
	blockingMobsPresent: Mob[] = [];

	private entryListeningMobs: Mob[] = []; //mobs that are listening for entry events on this turf

	MobStartListening(mob: Mob) {
		for (const checkMob of this.entryListeningMobs) {
			if (checkMob.uuid === mob.uuid) {
				//already listening
				//console.warn(`mob already listening`, this.gridCoords, mob);
				return;
			}
		}
		//console.log(`mob is listening`, this.gridCoords, mob);
		this.entryListeningMobs.push(mob);
	}

	MobStopListening(mob: Mob) {
		//console.warn(`mob stop listening`, this.gridCoords, mob);
		for (let i = 0; i < this.entryListeningMobs.length; i++) {
			if (this.entryListeningMobs[i].uuid === mob.uuid) {
				this.entryListeningMobs.splice(i, 1);
				break;
			}
		};
	}

	MobCanEnter(mob: Mob) {
		if (this.blockingMobsPresent.length > 0) {
			return false;
		}
		if (mob.isSolid) {
			//return false;
		}
		return true;
	}

	MobEnter(mob: Mob) {
		//console.log(`Turf::MobEnter()`, this);
		this.mobsPresent.push(mob);
		if (mob.isSolid) {
			this.blockingMobsPresent.push(mob);
		};

		for (const listeningMob of this.entryListeningMobs) {
			listeningMob.mobEnteredTurfNearby(mob);
		}
	}

	MobLeave(mob: Mob) {
		//console.log(`Turf::MobLeave()`, this.gridCoords);
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

		for (const listeningMob of this.entryListeningMobs) {
			listeningMob.mobLeftTurfNearby(mob);
		}
	}
}

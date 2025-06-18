import Mob from '@game/Mob';
//import Turf from '@game/Turf';
import Missile, {MISSILETYPE} from '@game/Missile.ts';
import { IMGPATH_MSL_FLYER, IMGPATH_MSL_SAUSAGESIZZLE } from '@assets/_AssetPaths.ts';
import missileController from '@controllers/MissileController.ts';

export class MobAttack {
	private ownerMob: Mob;
	private range: number = 0;
	private missileType: MISSILETYPE = MISSILETYPE.UNKNOWN;
	private attackCooldown: number = 1;
	tLeftAttack: number = 0;
	private imgPath: string = "na";
	private nearbyEnemyMobs: Mob[] = [];
	private auraRate: number = 1;	//used by aframe

	constructor(mob: Mob, missileType: MISSILETYPE) {
		this.ownerMob = mob;
		this.missileType = missileType;
		switch (missileType) {
			case MISSILETYPE.FLYER: {
				this.range = 5;
				this.attackCooldown = 0.5;
				this.imgPath = IMGPATH_MSL_FLYER;
				break;
			}
			case MISSILETYPE.SAUSAGE: {
				this.range = 3;
				this.attackCooldown = 1;
				this.imgPath = IMGPATH_MSL_SAUSAGESIZZLE;
				break;
			}
			case MISSILETYPE.AFRAME: {
				this.range = 4;
				break;
			}
		}
	}

	getRange() {
		return this.range;
	}

	mobEnteredTurfNearby(mob: Mob) {
		if(mob.party == this.ownerMob.party) {
			//if the mob is not on the same party, do nothing
			//console.log("MobAttack::mobEnteredTurfNearby() mob is friendly: ", mob.party, this.ownerMob.party);
			return;
		}

		//this.doAttackMob(mob);
		//console.log("MobAttack::mobEnteredTurfNearby() mob is enemy");
		this.nearbyEnemyMobs.push(mob);
	}

	mobLeftTurfNearby(mob: Mob) {

		for (let i = 0; i < this.nearbyEnemyMobs.length; i++) {
			//there could be multiple entries in here
			//this is technically a bug bug it's not a big deal
			if (this.nearbyEnemyMobs[i].uuid == mob.uuid) {
				this.nearbyEnemyMobs.splice(i, 1);
				i--;
			}
		}
	}

	chooseTargetMob(): Mob | null {
		switch (this.missileType) {
			case MISSILETYPE.FLYER: {
				for (const enemy of this.nearbyEnemyMobs) {
					if (!enemy.isMaxLoyalty(this.ownerMob.party)) {
						return enemy;
					}
				}
				break;
			}
			case MISSILETYPE.SAUSAGE: {
				for (const enemy of this.nearbyEnemyMobs) {
					if (enemy.hasEnemyLoyalty(this.ownerMob.party)) {
						return enemy;
					}
				}
				break;
			}
			default: {
				if (this.nearbyEnemyMobs.length > 0) {
					return this.nearbyEnemyMobs[0];
				}
				break;
			}
		}
		return null;
	}

	tryAttackMob(deltaTime: number) {
		//console.log("I am trying to attack", this);
		switch (this.missileType) {
			case MISSILETYPE.AFRAME: {
				this.nearbyEnemyMobs.forEach((value) => {
					value.addPartyLoyalty(this.ownerMob.party, this.auraRate * deltaTime);
				});
				break;
			}
			default: {
				const targetMob = this.chooseTargetMob();
				if (targetMob) {
					this.doAttackMob(targetMob);
					this.tLeftAttack = this.attackCooldown;
				}
				break;
			}
		}
	}

	doAttackMob(targetMob: Mob) {
		//console.log("I am attacking a mob!", this, targetMob);
		const newMissile = new Missile(this.ownerMob.pos.clone(), targetMob.pos.clone(), this.imgPath, this.missileType);
		newMissile.mobTarget = targetMob;
		newMissile.party = this.ownerMob.party;
		missileController.trackMissile(newMissile);

		this.tLeftAttack = this.attackCooldown;
	}
}

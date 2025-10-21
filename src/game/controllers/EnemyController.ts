//import Mob from '@game/Mob.ts';
import Mob, { MOBTYPE, type MobInfo } from '@game/Mob.ts';
import Vector2 from '@utils/Vector2.ts';
import mobController from '@controllers/MobController.ts';
//import gridController from '@controllers/GridController.ts';
import { ENEMY_SPAWNING_STRING } from '@utils/string_constants.ts';
import Timer from '@utils/Timer.ts';
import playerController from './PlayerController';

export class WaveEnemyDef {
	mobType: MOBTYPE;
	mobInfo: MobInfo;
	amountMax: number;
	amountLeft: number = 0;
	spawnProb: number = 0;

	constructor(mobType: MOBTYPE, amountMax: number, mobInfo?: MobInfo) {
		this.mobType = mobType;
		this.amountLeft = amountMax;
		this.amountMax = amountMax;
		if(mobInfo)
		{
			this.mobInfo = mobInfo;
		} else {
			this.mobInfo = mobController.createMobinfoFromTemplate();
		}
	}
}

export class EnemyWave {
	public enemyDefs: WaveEnemyDef[] = [];
	public totalMobs: number = 0;
	public totalDifficulty: number = 0;

	recalculateWaveInfo() {
		this.totalMobs = 0;
		this.totalDifficulty = 0;

		//calculate the total size of the wave
		for (const enemyDef of this.enemyDefs) {
			this.totalMobs += enemyDef.amountMax;
			this.totalDifficulty += enemyDef.amountMax * (1 + enemyDef.mobInfo.mobLevel);
		}

		for (const enemyDef of this.enemyDefs) {
			enemyDef.spawnProb = enemyDef.amountMax / this.totalMobs;
		}
	}

	getWaveEnemyDefToSpawn(): WaveEnemyDef | null {

		//pick a random enemy from the wave that has not been fully spawned yet
		//note: this assumes that the spawn probabilities for each enemy def are already calculated
		const result = Math.random();

		let curCounter = 0;
		for (const enemyDef of this.enemyDefs) {
			curCounter += enemyDef.spawnProb;
			if (curCounter >= result) {
				return enemyDef;
			}
		}

		//we couldnt choose one
		return null;
	}

	enemyDepleted(enemyDef: WaveEnemyDef) {
		//console.log("Enemy type depleted!", enemyDef);
		for (let i = 0; i < this.enemyDefs.length; i++) {
			const checkDef = this.enemyDefs[i];
			if (checkDef.mobType === enemyDef.mobType) {
				this.enemyDefs.splice(i, 1);
				break;
			}
		}

		this.recalculateWaveInfo();
	}

	areEnemiesDepleted(){
		return this.enemyDefs.length === 0;
	}
}

class EnemySpawner {
	timeLeftToSpawn: number = 0;
	spawnCooldown: number = 1;
	spawnMob: Mob;

	constructor(spawnloc: Vector2) {
		this.spawnMob = mobController.createMobInstance(MOBTYPE.ENEMYSPAWNER);
		mobController.envMobs.push(this.spawnMob);
		this.spawnMob.jumpToGridFromRawPos(spawnloc);
	}
}

class EnemyController {
	private upcomingWaves: EnemyWave[] = [];
	private isSpawning: boolean = false;
	//private tLeftStartSpawning: number = 0;
	private baseSpawnRate: number = 0.5; // spawn cooldown per spawner
	private spawners: EnemySpawner[] = [];
	waveTime: number = 0;
	waveStartTime: number = -1;
	timer: Timer|null = null;

	public getAllWaves(): EnemyWave[] {
		return this.upcomingWaves;
	}

	public getCurrentEnemyWave(){
		if(this.upcomingWaves.length > 0){
			return this.upcomingWaves[0];
		}
		return null;
	}

	ResetTimerLink(timer: Timer){
		this.timer = timer;
		this.timer.timerSliceStartedCallbacks.push(this.timerSliceStarted.bind(this));
	}

	Initialise() {
		// console.log("EnemyController::Initialise()");

		//create some spawn points
		this.spawners.push(new EnemySpawner(new Vector2(10, 60)));
		this.spawners.push(new EnemySpawner(new Vector2(10, 480)));

		//create some sample waves
		const parties = ["The Purple Party", "The Blue Party", "The Red Party"];
		let enemyWave: EnemyWave;
		let enemyDef;

		/* WAVE 1 */

		enemyWave = new EnemyWave();
		enemyDef = new WaveEnemyDef(MOBTYPE.VOTER_UNDECIDED, 10);
		enemyDef.mobInfo = mobController.createPresetMobInfo(0);
		enemyWave.enemyDefs.push(enemyDef);
		this.upcomingWaves.push(enemyWave);
		enemyWave.recalculateWaveInfo();

		/* WAVE 2 */

		enemyWave = new EnemyWave();

		//undecided voters
		enemyDef = new WaveEnemyDef(MOBTYPE.VOTER_UNDECIDED, 15);
		enemyDef.mobInfo = mobController.createPresetMobInfo(1);
		enemyWave.enemyDefs.push(enemyDef);

		//only add loyalist mobs for parties that are not the human player party
		for (const party of parties) {
			if (party != playerController.getHumanPlayer().value.playerParty) {
				const loyalistMobType = playerController.getPartyLoyalistMobType(party);
				if (loyalistMobType) {
					enemyDef = new WaveEnemyDef(loyalistMobType, 3);
					enemyDef.mobInfo = mobController.createPresetMobInfo(0, party);
					enemyWave.enemyDefs.push(enemyDef);
				}
			}
		}

		this.upcomingWaves.push(enemyWave);
		enemyWave.recalculateWaveInfo();

		/* WAVE 3 */

		enemyWave = new EnemyWave();

		//undecided voters
		enemyDef = new WaveEnemyDef(MOBTYPE.VOTER_UNDECIDED, 10);
		enemyDef.mobInfo = mobController.createPresetMobInfo(1);
		enemyWave.enemyDefs.push(enemyDef);
		enemyDef = new WaveEnemyDef(MOBTYPE.VOTER_UNDECIDED, 5);
		enemyDef.mobInfo = mobController.createPresetMobInfo(2);
		enemyWave.enemyDefs.push(enemyDef);

		//only add loyalist mobs for parties that are not the human player party
		for (const party of parties) {
			if (party != playerController.getHumanPlayer().value.playerParty) {
				const loyalistMobType = playerController.getPartyLoyalistMobType(party);
				if (loyalistMobType) {
					enemyDef = new WaveEnemyDef(loyalistMobType, 6);
					enemyDef.mobInfo = mobController.createPresetMobInfo(1, party);
					enemyWave.enemyDefs.push(enemyDef);
				}
			}
		}

		this.upcomingWaves.push(enemyWave);
		enemyWave.recalculateWaveInfo();

		/* WAVE 4 */

		enemyWave = new EnemyWave();

		//undecided voters
		enemyDef = new WaveEnemyDef(MOBTYPE.VOTER_UNDECIDED, 20);
		enemyDef.mobInfo = mobController.createPresetMobInfo(1);
		enemyWave.enemyDefs.push(enemyDef);

		enemyDef = new WaveEnemyDef(MOBTYPE.VOTER_UNDECIDED, 10);
		enemyDef.mobInfo = mobController.createPresetMobInfo(2);
		enemyWave.enemyDefs.push(enemyDef);

		enemyDef = new WaveEnemyDef(MOBTYPE.VOTER_UNDECIDED, 5);
		enemyDef.mobInfo = mobController.createPresetMobInfo(3);
		enemyWave.enemyDefs.push(enemyDef);

		//only add loyalist mobs for parties that are not the human player party
		for (const party of parties) {
			if (party != playerController.getHumanPlayer().value.playerParty) {
				const loyalistMobType = playerController.getPartyLoyalistMobType(party);
				if (loyalistMobType) {
					enemyDef = new WaveEnemyDef(loyalistMobType, 10);
					enemyDef.mobInfo = mobController.createPresetMobInfo(1, party);
					enemyWave.enemyDefs.push(enemyDef);

					enemyDef = new WaveEnemyDef(loyalistMobType, 5);
					enemyDef.mobInfo = mobController.createPresetMobInfo(2, party);
					enemyWave.enemyDefs.push(enemyDef);
				}
			}
		}

		this.upcomingWaves.push(enemyWave);
		enemyWave.recalculateWaveInfo();

		/* WAVE 5 */

		enemyWave = new EnemyWave();

		//undecided voters
		enemyDef = new WaveEnemyDef(MOBTYPE.VOTER_UNDECIDED, 15);
		enemyDef.mobInfo = mobController.createPresetMobInfo(2);
		enemyWave.enemyDefs.push(enemyDef);

		enemyDef = new WaveEnemyDef(MOBTYPE.VOTER_UNDECIDED, 10);
		enemyDef.mobInfo = mobController.createPresetMobInfo(3);
		enemyWave.enemyDefs.push(enemyDef);

		//only add loyalist mobs for parties that are not the human player party
		for (const party of parties) {
			if (party != playerController.getHumanPlayer().value.playerParty) {
				const loyalistMobType = playerController.getPartyLoyalistMobType(party);
				if (loyalistMobType) {
					enemyDef = new WaveEnemyDef(loyalistMobType, 15);
					enemyDef.mobInfo = mobController.createPresetMobInfo(1, party);
					enemyWave.enemyDefs.push(enemyDef);

					enemyDef = new WaveEnemyDef(loyalistMobType, 10);
					enemyDef.mobInfo = mobController.createPresetMobInfo(2, party);
					enemyWave.enemyDefs.push(enemyDef);

					enemyDef = new WaveEnemyDef(loyalistMobType, 5);
					enemyDef.mobInfo = mobController.createPresetMobInfo(3, party);
					enemyWave.enemyDefs.push(enemyDef);
				}
			}
		}

		this.upcomingWaves.push(enemyWave);
		enemyWave.recalculateWaveInfo();

	}

	getCurrentSpawningTimeMax(): number {
		if (this.upcomingWaves.length > 0) {

			//how fast can our spawners spawn the mobs?
			let spawnRate = 0;
			for(const curSpawner of this.spawners) {
				spawnRate += (1 / curSpawner.spawnCooldown);
			}

			const curWave = this.upcomingWaves[0];
			const expectedDuration = curWave.totalMobs / spawnRate;

			return expectedDuration;
		}

		console.error(`EnemyController::getCurrentSpawningTimeMax() but no current wave`);
		return 0;
	}

	setActive(isActive: boolean) {
		this.isActive = isActive;
	}

	timerSliceStarted(sliceLabel: string) {
		if (sliceLabel === ENEMY_SPAWNING_STRING) {
			this.startSpawning();
		}
	}

	startSpawning() {
		// console.log('enemycontroller::startSpawning()', this.upcomingWaves[0]);
		this.isSpawning = true;
		this.waveTime = 0;
		this.waveStartTime = Date.now() / 1000; //in seconds
		this.isActive = true;
	}

	areEnemiesDefeated(){
		if(mobController.getEnemyMobs().length > 0){
			// console.log(`EnemyController::areEnemiesDefeated() mobController.getEnemyMobs().length=${mobController.getEnemyMobs().length}`);
			return false;
		}

		if(this.isSpawning) {
			// console.log(`EnemyController::areEnemiesDefeated() this.isSpawning=true`);
			return false;
		}

		if(this.getCurrentEnemyWave() && this.getCurrentEnemyWave()?.areEnemiesDepleted()) {
			// console.log(`EnemyController::areEnemiesDefeated() this.getCurrentEnemyWave()?.areEnemiesDepleted()=true`);
			return true;
		}

		if(!this.getCurrentEnemyWave()){
			console.error(`ERROR EnemyController::areEnemiesDefected() no current enemy wave`);
			return true;
		}

		console.error(`ERROR EnemyController::areEnemiesDefected() unknown edge case`);
		return true;
	}

	isActive: boolean = false;
	tLeftStartSpawning: number = 0;
	update(deltaTime: number) {

		if (!this.isActive) {
			return;
		}

		if (this.tLeftStartSpawning >= 0) {
			// console.log("EnemyController::Update() ticking down");
			this.tLeftStartSpawning -= deltaTime;
			if (this.tLeftStartSpawning <= 0) {
				this.startSpawning();
			}
		}

		if (this.isSpawning) {
			this.waveTime += deltaTime;

			if (this.upcomingWaves.length <= 0) {
				this.isSpawning = false;
			}
			else {
				const curWave = this.upcomingWaves[0];
				for (const curSpawner of this.spawners) {
					if (curSpawner.timeLeftToSpawn <= 0) {
						curSpawner.timeLeftToSpawn = curSpawner.spawnCooldown;

						const spawningEnemyDef = curWave.getWaveEnemyDefToSpawn();
						if (spawningEnemyDef) {

							//are there enemies left to spawn of this type?
							if (spawningEnemyDef.amountLeft > 0) {
								if (spawningEnemyDef.mobInfo) {
									mobController.createActiveEnemyMobAdvanced(spawningEnemyDef.mobType, curSpawner.spawnMob.pos, spawningEnemyDef.mobInfo);
								}
								spawningEnemyDef.amountLeft--;
							}

							//has this enemy type been fully spawned?
							if (spawningEnemyDef.amountLeft <= 0) {
								curWave.enemyDepleted(spawningEnemyDef);
							}
						} else {
							this.isSpawning = false;
						}

					} else {
						curSpawner.timeLeftToSpawn -= deltaTime;
					}
				}
			}
		}
	}
}

const enemyController = new EnemyController();
export default enemyController;

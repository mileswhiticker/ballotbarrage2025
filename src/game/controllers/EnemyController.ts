//import Mob from '@game/Mob.ts';
import Mob, { MOBTYPE } from '@game/Mob.ts';
import Vector2 from '@utils/Vector2.ts';
import mobController from '@controllers/MobController.ts';
//import gridController from '@controllers/GridController.ts';

class WaveEnemyDef {
	mobType: MOBTYPE;
	amountMax: number;
	amountLeft: number = 0;
	spawnProb: number = 0;

	constructor(mobType: MOBTYPE, amountMax: number) {
		this.mobType = mobType;
		this.amountLeft = amountMax;
		this.amountMax = amountMax;
	}
};

class EnemyWave {
	enemyDefs: WaveEnemyDef[] = [];
	totalMobs: number = 0;

	recalculateSpawnProbabilities() {
		this.totalMobs = 0;

		//calculate the total size of the wave
		for (const enemyDef of this.enemyDefs) {
			this.totalMobs += enemyDef.amountMax;
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
		};

		this.recalculateSpawnProbabilities();
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

	Initialise() {
		//create some spawn points
		this.spawners.push(new EnemySpawner(new Vector2(10, 60)));
		this.spawners.push(new EnemySpawner(new Vector2(10, 480)));

		//create some sample waves
		let enemyWave: EnemyWave;

		//enemyWave = new EnemyWave();
		//enemyWave.enemyDefs.push(new WaveEnemyDef(MOBTYPE.VOTER_UNDECIDED, 10));
		//this.upcomingWaves.push(enemyWave);
		//enemyWave.recalculateSpawnProbabilities();

		enemyWave = new EnemyWave();
		enemyWave.enemyDefs.push(new WaveEnemyDef(MOBTYPE.VOTER_UNDECIDED, 15));
		enemyWave.enemyDefs.push(new WaveEnemyDef(MOBTYPE.VOTER_BLUE, 3));
		enemyWave.enemyDefs.push(new WaveEnemyDef(MOBTYPE.VOTER_RED, 3));
		enemyWave.enemyDefs.push(new WaveEnemyDef(MOBTYPE.VOTER_PURPLE, 3));
		this.upcomingWaves.push(enemyWave);
		enemyWave.recalculateSpawnProbabilities();

		enemyWave = new EnemyWave();
		enemyWave.enemyDefs.push(new WaveEnemyDef(MOBTYPE.VOTER_UNDECIDED, 15));
		enemyWave.enemyDefs.push(new WaveEnemyDef(MOBTYPE.VOTER_BLUE, 6));
		enemyWave.enemyDefs.push(new WaveEnemyDef(MOBTYPE.VOTER_RED, 6));
		enemyWave.enemyDefs.push(new WaveEnemyDef(MOBTYPE.VOTER_PURPLE, 6));
		this.upcomingWaves.push(enemyWave);
		enemyWave.recalculateSpawnProbabilities();

	}

	startSpawning() {
		//console.log('enemycontroller::startSpawning()');
		this.isSpawning = true;
		this.waveTime = 0;
		this.waveStartTime = Date.now() / 1000; //in seconds
	}

	tLeftStartSpawning: number = 2;
	update(deltaTime: number) {
		if (this.tLeftStartSpawning > 0) {
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
								mobController.createActiveEnemyMob(spawningEnemyDef.mobType, curSpawner.spawnMob.pos);
								spawningEnemyDef.amountLeft--;
							}

							//has this enemy type been fully spawned?
							if (spawningEnemyDef.amountLeft <= 0) {
								curWave.enemyDepleted(spawningEnemyDef);
							}
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

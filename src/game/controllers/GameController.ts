import Mob from '@game/Mob.ts';
import mobController from '@controllers/MobController.ts';
import mouseController from '@controllers/MouseController.ts';
import gridController from '@controllers/GridController.ts';
import enemyController from '@controllers/EnemyController.ts';
import missileController from '@controllers/MissileController.ts';
import appController, {GAMESCENE} from '@controllers/AppController.ts';
//import Vector2 from '@utils/Vector2.ts';
import Timer from '@utils/Timer.ts';
import {ENEMY_SPAWNING_STRING, PLAYER_BUILDING_STRING, PLAYER_BUYING_STRING} from '@utils/string_constants.ts';
import {COLOUR_BLUE, COLOUR_GREEN, COLOUR_RED} from '@utils/ColourInfo.ts';
import {nextTick} from 'vue';

class GameController {
	mobs: Mob[] = [];
	mainRenderFrameId: number = -1;
	gameCanvas: HTMLCanvasElement | null = null;
	game2dRenderContext: CanvasRenderingContext2D | null = null;
	timer: Timer;
	gametimerate: number = 1;

	gameTime: number = 0; //in seconds

	renderGameWorld: boolean = false;
	shutDown: boolean = false;

	constructor() {
		this.timer = new Timer();
	}

	async Initialise() {

		await nextTick();
		// console.log("GameController::Initialise()");

		enemyController.ResetTimerLink(this.timer);

		this.timer.timerSliceExpiryCallbacks = [];
		this.timer.timerSliceExpiryCallbacks.push(this.timerSliceExpired.bind(this));
		//this.timer.timerSliceStartedCallbacks.push(enemyController.timerSliceStarted.bind(enemyController));

		// console.log("GameController::Initialise() finished");
	}

	async LateInitialise() {
		await nextTick();
		// console.log("GameController::LateInitialise()");

		this.gameCanvas = document.getElementById("gameCanvas") as HTMLCanvasElement;
		this.game2dRenderContext = this.gameCanvas.getContext('2d');

		gridController.Initialise(this.game2dRenderContext as CanvasRenderingContext2D);
		mouseController.Initialise(this.game2dRenderContext as CanvasRenderingContext2D);
		mobController.Initialise(this.game2dRenderContext as CanvasRenderingContext2D);
		missileController.Initialise(this.game2dRenderContext as CanvasRenderingContext2D);

		this.mainRenderFrameId = requestAnimationFrame(this.Update.bind(this));
	}

	async startGame(){
		this.startNextRound();
	}

	tLastUpdate: number = Date.now();
	Update() {
		const tThisUpdate = Date.now();
		const deltaTime = this.gametimerate * (tThisUpdate - this.tLastUpdate) / 1000;
		this.tLastUpdate = tThisUpdate;
		// console.log("GameController::Update()", deltaTime);

		enemyController.update(deltaTime);
		mobController.update(deltaTime);

		this.renderEmptyCanvas();

		switch(appController.curGameScene){
			case GAMESCENE.ROUND_ACTIVE: {
				gridController.renderGridLines();
				gridController.renderDebug();
				mobController.renderEnvMobs();
				mobController.renderMobs();
				mouseController.renderBuildGhost();
				this.timer.render(deltaTime);
				break;
			}
		}
		missileController.update(deltaTime);

		if (!this.shutDown) {
			this.mainRenderFrameId = requestAnimationFrame(this.Update.bind(this));
		}
	}

	setupNextRound() {
		this.ResetTimer();
	}

	startNextRound() {
		enemyController.setActive(true);
		this.timer.StartTimer();
	}

	tryFinishRound(){
		//assume that safety checks have been done at this point
		//here we will just make sure we only end the round once
		if(appController.curGameScene === GAMESCENE.ROUND_ACTIVE){
			console.log(`GameController::tryFinishRound() success`);
			appController.changeScene(GAMESCENE.ROUND_POST);
		} else {
			console.error(`WARN: GameController::tryFinishRound() but not in active game round`);
		}
	}

	ResetTimer() {
		const enemySpawnTime = enemyController.getCurrentSpawningTimeMax();
		const timerData = [
			{ label: PLAYER_BUYING_STRING, seconds: 0, color: COLOUR_GREEN.hex_string },
			{ label: PLAYER_BUILDING_STRING, seconds: 0, color: COLOUR_BLUE.hex_string },
			{ label: ENEMY_SPAWNING_STRING, seconds: enemySpawnTime, color: COLOUR_RED.hex_string },
		];

		this.timer.SetTimerData(timerData);
		this.timer.ResetTimer();
	}

	timerSliceExpired(sliceLabel: string) {
		// console.log(`GameController Timer slice expired: ${sliceLabel}`);
	}

	isPaused(){
		return this.gametimerate === 0;
	}

	tryTogglePause(){
		if(this.gametimerate === 1){
			this.gametimerate = 0;
			return true;
		} else if(this.gametimerate === 0){
			this.gametimerate = 1;
			return true;
		}
		return false;
	}

	tryFastForwardRound(){
		if(this.gametimerate === 1){
			this.gametimerate = 75;
			return true;
		}
		return false;
	}

	renderEmptyCanvas() {
		if (this.game2dRenderContext && this.gameCanvas) {
			this.game2dRenderContext.fillStyle = '#ccc'
			this.game2dRenderContext.fillRect(0, 0, this.gameCanvas.width, this.gameCanvas.height)
		}

	}
}

const gameController = new GameController();
export default gameController;

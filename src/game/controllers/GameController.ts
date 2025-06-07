import Mob from '@game/Mob.ts';
import playerController from '@controllers/PlayerController.ts';
import mobController from '@controllers/MobController.ts';
import mouseController from '@controllers/MouseController.ts';
import gridController from '@controllers/GridController.ts';
import enemyController from '@controllers/EnemyController.ts';
import missileController from '@controllers/MissileController.ts';
import resourceController from '@controllers/ResourceController.ts';
//import Vector2 from '@utils/Vector2.ts';
import Timer from '@utils/Timer.ts';
import { PLAYER_BUYING_STRING, PLAYER_BUILDING_STRING, ENEMY_SPAWNING_STRING } from '@utils/string_constants.ts';
import { COLOUR_RED, COLOUR_GREEN, COLOUR_BLUE } from '@utils/ColourInfo.ts';

class GameController {
	mobs: Mob[] = [];
	mainRenderFrameId: number = -1;
	gameCanvas: HTMLCanvasElement | null = null;
	game2dRenderContext: CanvasRenderingContext2D | null = null;
	timer: Timer;

	gameTime: number = 0; //in seconds

	constructor() {
		this.timer = new Timer();
	}

	InitializeGame() {
		//console.log("GameController::InitializeGame() starting...");

		this.gameCanvas = document.getElementById("gameCanvas") as HTMLCanvasElement;
		this.game2dRenderContext = this.gameCanvas.getContext('2d');

		resourceController.Initialise();
		gridController.Initialise(this.game2dRenderContext as CanvasRenderingContext2D);
		mouseController.Initialise(this.game2dRenderContext as CanvasRenderingContext2D);
		mobController.Initialise(this.game2dRenderContext as CanvasRenderingContext2D);
		missileController.Initialise(this.game2dRenderContext as CanvasRenderingContext2D);
		playerController.Initialise();
		enemyController.Initialise(this.timer);

		this.timer.timerSliceExpiryCallbacks.push(this.timerSliceExpired.bind(this));
		//this.timer.timerSliceStartedCallbacks.push(enemyController.timerSliceStarted.bind(enemyController));
		this.ResetTimer();
		this.timer.StartTimer();

		this.mainRenderFrameId = requestAnimationFrame(this.Update.bind(this));

		//console.log("GameController::InitializeGame() finished");
	}

	tLastUpdate: number = Date.now();
	Update() {
		const tThisUpdate = Date.now();
		const deltaTime = (tThisUpdate - this.tLastUpdate) / 1000;
		this.tLastUpdate = tThisUpdate;
		//console.log("GameController::Update()", deltaTime);

		enemyController.update(deltaTime);
		mobController.update(deltaTime);

		this.renderEmptyCanvas();

		gridController.renderGridLines();
		gridController.renderDebug();
		mobController.renderEnvMobs();
		mobController.renderMobs();
		mouseController.renderBuildGhost();
		missileController.update(deltaTime);

		this.timer.render(deltaTime);

		this.mainRenderFrameId = requestAnimationFrame(this.Update.bind(this));
	}

	ResetTimer() {
		const enemySpawnTime = enemyController.getCurrentSpawningTimeMax();
		const timerData = [
			{ label: PLAYER_BUYING_STRING, seconds: 5, color: COLOUR_GREEN.hex_string },
			{ label: PLAYER_BUILDING_STRING, seconds: 5, color: COLOUR_BLUE.hex_string },
			{ label: ENEMY_SPAWNING_STRING, seconds: enemySpawnTime, color: COLOUR_RED.hex_string },
		];

		this.timer.SetTimerData(timerData);
		this.timer.ResetTimer();
	}

	timerSliceExpired(sliceLabel: string) {
		//console.log(`GameController Timer slice expired: ${sliceLabel}`);
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

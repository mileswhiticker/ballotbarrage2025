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
		enemyController.Initialise();

		//for testing
		this.timer.SetTimerData(Timer.sampleTimerdata);
		this.timer.ResetTimer();
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
		mobController.renderPlayerMobs();
		mobController.renderEnemyMobs();
		mouseController.renderBuildGhost();
		missileController.update(deltaTime);

		this.timer.render(deltaTime);

		this.mainRenderFrameId = requestAnimationFrame(this.Update.bind(this));
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

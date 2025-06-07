import Mob from '@game/Mob.ts';
//import { MOBTYPE } from '@game/Mob.ts';
import playerController from '@controllers/PlayerController.ts';
import mobController from '@controllers/MobController.ts';
import mouseController from '@controllers/MouseController.ts';
import gridController from '@controllers/GridController.ts';
import enemyController from '@controllers/EnemyController.ts';
import missileController from '@controllers/MissileController.ts';
import resourceController from '@controllers/ResourceController.ts';
//import Vector2 from '@utils/Vector2.ts';
import { renderTimer, initialiseTimer, sampleTimerdata, SetTimerData } from '@utils/Timer.ts';
import Vector2 from '@utils/Vector2.ts';

class GameController {
	mobs: Mob[] = [];
	mainRenderFrameId: number = -1;
	gameCanvas: HTMLCanvasElement | null = null;
	game2dRenderContext: CanvasRenderingContext2D | null = null;

	gameTime: number = 0; //in seconds

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

		initialiseTimer(this.game2dRenderContext as CanvasRenderingContext2D,
			new Vector2(170, 30),
			new Vector2(50, 50))
		SetTimerData(sampleTimerdata);

		this.mainRenderFrameId = requestAnimationFrame(this.Update.bind(this));

		//console.log("GameController::InitializeGame() finished");
	}

	tLastUpdate: number = 0;
	Update() {
		const tThisUpdate = Date.now();
		const deltaTime = (tThisUpdate - this.tLastUpdate) / 1000;
		this.tLastUpdate = tThisUpdate;
		//console.log("GameController::Update()", deltaTime);

		enemyController.update(deltaTime);
		mobController.update(deltaTime);

		this.renderEmptyCanvas();

		renderTimer(deltaTime);

		gridController.renderGridLines();
		gridController.renderDebug();
		mobController.renderEnvMobs();
		mobController.renderPlayerMobs();
		mobController.renderEnemyMobs();
		mouseController.renderBuildGhost();
		missileController.update(deltaTime);

		this.mainRenderFrameId = requestAnimationFrame(this.Update.bind(this));
	}

	renderEmptyCanvas() {
		if (this.game2dRenderContext && this.gameCanvas) {
			this.game2dRenderContext.fillStyle = '#ccc'
			this.game2dRenderContext.fillRect(0, 0, this.gameCanvas.width, this.gameCanvas.height)
		}

	}
}

export const gameController = new GameController();

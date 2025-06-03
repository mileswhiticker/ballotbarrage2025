import Mob from './Mob.ts';
//import { MOBTYPE } from './Mob.ts';
import playerController from './PlayerController.ts';
import mobController from './MobController.ts';
import mouseController from './MouseController.ts';
import gridController from './GridController.ts';
//import Vector2 from './Vector2.ts';

class GameController {
	mobs: Mob[] = [];
	mainRenderFrameId: number = -1;
	gameCanvas: HTMLCanvasElement | null = null;
	game2dRenderContext: CanvasRenderingContext2D | null = null;

	InitializeGame() {
		//console.log("GameController::InitializeGame() starting...");

		this.gameCanvas = document.getElementById("gameCanvas") as HTMLCanvasElement;
		this.game2dRenderContext = this.gameCanvas.getContext('2d');

		mouseController.Initialise(this.game2dRenderContext as CanvasRenderingContext2D);
		mobController.Initialise(this.game2dRenderContext as CanvasRenderingContext2D);
		gridController.Initialise(this.game2dRenderContext as CanvasRenderingContext2D);
		playerController.Initialise();

		this.mainRenderFrameId = requestAnimationFrame(this.Update.bind(this));

		//console.log("GameController::InitializeGame() finished");
	}

	tLastUpdate: number = 0;
	Update() {
		const tThisUpdate = Date.now();
		const deltaTime = tThisUpdate - this.tLastUpdate;
		this.tLastUpdate = tThisUpdate;
		//console.log("GameController::Update()", deltaTime);

		mobController.update(deltaTime);

		this.renderEmptyCanvas();
		gridController.renderGridLines();
		mobController.renderEnvMobs();
		mobController.renderPlayerMobs();
		mobController.renderGameMobs();
		mouseController.renderBuildGhost();

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

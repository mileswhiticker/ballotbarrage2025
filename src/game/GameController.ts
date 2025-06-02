import Mob from './Mob.ts';
import { MOBTYPE } from './Mob.ts';
import playerController from './PlayerController.ts';
import mobController from './MobController.ts';
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

		mobController.Initialise();
		playerController.Initialise();

		const newMob = mobController.createMobInstance(MOBTYPE.WANDER_ENEMY)
		newMob.isAlive = true;
		newMob.randomWander = true;
		newMob.pos.x = 0;
		newMob.pos.y = 0;
		this.mobs.push(newMob);

		this.mainRenderFrameId = requestAnimationFrame(this.Update.bind(this));

		//console.log("GameController::InitializeGame() finished");
	}

	tLastUpdate: number = 0;
	Update() {
		const tThisUpdate = Date.now();
		const deltaTime = tThisUpdate - this.tLastUpdate;
		this.tLastUpdate = tThisUpdate;
		//console.log("GameController::Update()", deltaTime);

		if (this.game2dRenderContext && this.gameCanvas) {
			this.game2dRenderContext.fillStyle = '#ccc'
			this.game2dRenderContext.fillRect(0, 0, this.gameCanvas.width, this.gameCanvas.height)
		}

		for (let i = 0; i < this.mobs.length; i++) {
			const curMob = this.mobs[i];
			curMob.update(deltaTime);

			if (this.game2dRenderContext && curMob.sprite)
			{
				curMob.sprite.Render(this.game2dRenderContext);
			}
		}

		this.mainRenderFrameId = requestAnimationFrame(this.Update.bind(this));
	}
}

export const gameController = new GameController();

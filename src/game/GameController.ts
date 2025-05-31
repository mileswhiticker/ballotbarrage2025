import Mob from './Mob.ts';
import { resourceController } from './ResourceController.ts';
import Vector2 from './Vector2.ts';

class GameController {
	mobs: Mob[] = [];
	mainRenderFrameId: number = -1;
	gameCanvas: HTMLCanvasElement | null = null;
	game2dRenderContext: CanvasRenderingContext2D | null = null;

	InitializeGame() {
	console.log("GameController::InitializeGame() starting...");

		this.gameCanvas = document.getElementById("gameCanvas") as HTMLCanvasElement;
		this.game2dRenderContext = this.gameCanvas.getContext('2d');

		resourceController.LoadImage('./src/assets/redman.png');
		const newMob = new Mob(new Vector2(300, 300), './src/assets/redman.png');
		this.mobs.push(newMob);

		this.mainRenderFrameId = requestAnimationFrame(this.Update.bind(this));

		console.log("GameController::InitializeGame() finished");
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

			if (this.game2dRenderContext)
			{
				const mobImage: HTMLImageElement | null = resourceController.GetImage(curMob.imagepath);
				if (mobImage) {
					this.game2dRenderContext.drawImage(mobImage, curMob.pos.x, curMob.pos.y, curMob.dims.x, curMob.dims.y);
				}
			}
		}

		this.mainRenderFrameId = requestAnimationFrame(this.Update.bind(this));
	}
}

export const gameController = new GameController();

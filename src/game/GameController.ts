import Mob from './Mob.ts';
import { resourceController } from './ResourceController.ts';

class GameController {
  mobs: Mob[] = [];
  mainRenderFrameId: number = -1;
  gameCanvas: HTMLCanvasElement | null = null;

  InitializeGame() {
    console.log("GameController::InitializeGame() starting...");

    this.gameCanvas = document.getElementById("gameCanvas") as HTMLCanvasElement;

    resourceController.LoadImage('./src/assets/redman.png');
    const newMob = new Mob(200, 200, './src/assets/redman.png');
    this.mobs.push(newMob);

    this.mainRenderFrameId = requestAnimationFrame(this.Update.bind(this));

    console.log("GameController::InitializeGame() finished");
  }

  tLastUpdate: number = 0;
  Update() {
    //console.log("GameController::Update()",this)
    const tThisUpdate = Date.now();
    const deltaTime = tThisUpdate - this.tLastUpdate;
    this.tLastUpdate = tThisUpdate;

    let ctx: CanvasRenderingContext2D | null = null;
    if (this.gameCanvas) {
      ctx = this.gameCanvas.getContext('2d');
    }

    for (let i = 0; i < this.mobs.length; i++) {
      const curMob = this.mobs[i];
      curMob.update(deltaTime);

      if (ctx)
      {
        const mobImage: HTMLImageElement | null = resourceController.GetImage(curMob.imagepath);
        if (mobImage) {
          ctx.drawImage(mobImage, curMob.xpos, curMob.ypos, curMob.xwidth, curMob.ywidth);
        }
      }
    }

    this.mainRenderFrameId = requestAnimationFrame(this.Update.bind(this));
  }
}

export const gameController = new GameController();

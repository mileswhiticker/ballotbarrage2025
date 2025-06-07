import Missile from '@game/Missile';

class MissileController {
	allMissiles: Missile[] = [];
	game2dRenderContext: CanvasRenderingContext2D | null = null;

	Initialise(game2dRenderContext: CanvasRenderingContext2D) {
		this.game2dRenderContext = game2dRenderContext;
	}

	trackMissile(missile: Missile) {
		this.allMissiles.push(missile);
	}

	update(deltaTime: number) {
		for (let i = 0; i < this.allMissiles.length; i++) {
			let curMissile = this.allMissiles[i];
			curMissile.update(deltaTime);

			//render the sprite
			if (this.game2dRenderContext) {
				if (curMissile.sprite) {
					curMissile.sprite.Render(this.game2dRenderContext);
				}
			}

			if (!curMissile.isAlive) {
				//remove from allMissiles
				this.allMissiles.splice(i, 1);
				i--; //adjust index since we removed an item
			}
		}
	}
}

const missileController = new MissileController();
export default missileController;

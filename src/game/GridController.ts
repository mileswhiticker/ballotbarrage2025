import Mob from './Mob.ts';
import Vector2 from './Vector2.ts';

export class GridRoute {
	squares: Vector2[] = [];
}

class GridController {
	gridCellDim: number = 64;
	private game2dRenderContext: CanvasRenderingContext2D | null = null;
	doDrawGridlines: boolean = false;

	Initialise(game2dRenderContext: CanvasRenderingContext2D) {
		this.game2dRenderContext = game2dRenderContext;
		//
	}

	renderGridLines() {
		if (this.game2dRenderContext) {
			this.game2dRenderContext.strokeStyle = '#A9A9A9';
			this.game2dRenderContext.lineWidth = 1;

			const width = 1000;
			const height = 1000;

			// Draw vertical lines
			for (let x = 0; x <= width; x += this.gridCellDim) {
				this.game2dRenderContext.beginPath();
				this.game2dRenderContext.moveTo(x, 0);
				this.game2dRenderContext.lineTo(x, height);
				this.game2dRenderContext.stroke();
			}

			// Draw horizontal lines
			for (let y = 0; y <= height; y += this.gridCellDim) {
				this.game2dRenderContext.beginPath();
				this.game2dRenderContext.moveTo(0, y);
				this.game2dRenderContext.lineTo(width, y);
				this.game2dRenderContext.stroke();
			}
		}
	}

	pathToMob(mobSource: Mob, mobDest: Mob): GridRoute {
		//todo
		const route = new GridRoute();

		return route;
	}
}

const gridController = new GridController();
export default gridController;

import Vector2 from '@utils/Vector2.ts';
import resourceController from '@controllers/ResourceController.ts';

export class Sprite {
	baseImage: HTMLImageElement | null = null;
	imagePath: string|undefined;

	dims: Vector2 = new Vector2(32, 32);
	pos: Vector2 = new Vector2(-99999, -99999);
	sourceOffset: Vector2 | null = null;	//if null, use the whole image
	sourceDims: Vector2 | null = null;		//if null, use the whole image
	debugRender: boolean = false;

	constructor(imagePath?: string) {
		if (imagePath) {
			this.imagePath = imagePath;
			this.baseImage = resourceController.GetImage(imagePath);
		}
		else {
			this.debugRender = true;
		}
	}

	render(context: CanvasRenderingContext2D) {

		if (this.debugRender) {
			context.strokeStyle = '#f603a3';
			context.lineWidth = 1;

			context.beginPath();
			context.moveTo(this.pos.x - 10, this.pos.y - 10);
			context.lineTo(this.pos.x + 10, this.pos.y + 10);
			context.stroke();

			context.beginPath();
			context.moveTo(this.pos.x - 10, this.pos.y + 10);
			context.lineTo(this.pos.x + 10, this.pos.y - 10);
			context.stroke();
			return;
		}
		if (!this.baseImage) {
			console.error("Sprite::Render() but baseImage is null", this);
			return;
		}

		if (this.sourceOffset && this.sourceDims) {
			context.drawImage(this.baseImage, this.sourceOffset.x, this.sourceOffset.y, this.sourceDims.x, this.sourceDims.y, this.pos.x, this.pos.y, this.dims.x, this.dims.y);
		}
		else {
			context.drawImage(this.baseImage, this.pos.x, this.pos.y, this.dims.x, this.dims.y);
		}
	}

	destroy() {
		//
	}
}

export class AnimatedSprite extends Sprite {
	rows: number = 1;
	cols: number = 1;
	curFrame: number = 0;

	//todo: multiple animation definitions per AnimatedSprite
}

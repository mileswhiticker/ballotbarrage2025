import Vector2 from '@utils/Vector2.ts';
import resourceController from '@controllers/ResourceController.ts';

export class Sprite {
	baseImage: HTMLImageElement | null = null;
	imagePath: string;

	dims: Vector2 = new Vector2(32, 32);
	pos: Vector2 = new Vector2(-99999, -99999);
	sourceOffset: Vector2 | null = null;	//if null, use the whole image
	sourceDims: Vector2|null = null;		//if null, use the whole image

	constructor(imagePath: string) {
		this.imagePath = imagePath;
		this.baseImage = resourceController.GetImage(imagePath);
	}

	Render(context: CanvasRenderingContext2D) {
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
}

export class AnimatedSprite extends Sprite {
	rows: number = 1;
	cols: number = 1;
	curFrame: number = 0;

	//todo: multiple animation definitions per AnimatedSprite
}


class ResourceController {
	gameCanvas: HTMLCanvasElement | null = null;
	images = new Map<string, HTMLImageElement>();

	constructor() {
		//
	}

	Initialise() {
	}

	LinkCanvas(canvas: HTMLCanvasElement) {
		this.gameCanvas = canvas;
	}
	
	LoadImage(imagepath: string, suppress_warning: boolean = false) {
		//if (!this.gameCanvas) {
			//return;
		//}

		if (this.images.has(imagepath)) {
			if (!suppress_warning) {
				console.warn("ResourcesController::LoadImage(" + imagepath + ") image already loaded");
			}
			return;
		}
		//console.error("ResourcesController::LoadImage(" + imagepath + ")");

		//define it
		const image = new Image();
		image.src = imagepath;

		//save it
		this.images.set(imagepath, image);

		//todo: a loading controller or await calls here
		//image.onload = () => {
		//  this.gameCanvas.width = image.width;
		//  this.gameCanvas.height = image.height;
		//  const ctx = this.gameCanvas.getContext('2d');
		//  ctx?.drawImage(image, 0, 0);
		//};
	}

	GetImage(imagepath: string): HTMLImageElement | null {
		//console.log(`ResourceController::GetImage(${imagepath})`,this);
		if (this.images.has(imagepath)) {
			return this.images.get(imagepath) as HTMLImageElement;
		}

		console.error("ResourcesController::GetImage(" + imagepath + ") image not loaded");
		return null;
	}
}

const resourceController = new ResourceController();
export default resourceController;



import {
	IMGPATH_GREYMAN,
	IMGPATH_REDMAN,
	IMGPATH_BLUEMAN,
	IMGPATH_PURPLEMAN,
	IMGPATH_MOB_AFRAME,
	IMGPATH_MOB_BBQ,
	IMGPATH_MOB_UNKNOWN,
	IMGPATH_MOB_VOLUNTEER,
	IMGPATH_BOOTHENTRY,
	IMGPATH_BUS,
	IMGPATH_MSL_SAUSAGESIZZLE,
	IMGPATH_MSL_FLYER,
} from '@assets/_AssetPaths.ts'; 

class ResourceController {
	gameCanvas: HTMLCanvasElement | null = null;
	images = new Map<string, HTMLImageElement>();

	constructor() {
		//
	}

	Initialise() {
		this.LoadImage(IMGPATH_GREYMAN);
		this.LoadImage(IMGPATH_REDMAN);
		this.LoadImage(IMGPATH_BLUEMAN);
		this.LoadImage(IMGPATH_PURPLEMAN);
		this.LoadImage(IMGPATH_MOB_UNKNOWN);

		this.LoadImage(IMGPATH_MOB_AFRAME);
		this.LoadImage(IMGPATH_MOB_BBQ);

		this.LoadImage(IMGPATH_MOB_VOLUNTEER);
		this.LoadImage(IMGPATH_BOOTHENTRY);
		this.LoadImage(IMGPATH_BUS);

		this.LoadImage(IMGPATH_MSL_FLYER);
		this.LoadImage(IMGPATH_MSL_SAUSAGESIZZLE);
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


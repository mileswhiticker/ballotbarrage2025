
import resourceController from './ResourceController.ts';

import Mob from './Mob.ts';
import { MOBTYPE } from './Mob.ts';
import Vector2 from './Vector2.ts';

const IMGPATH_GREYMAN: string = './src/assets/greyman.png';
const IMGPATH_REDMAN: string = './src/assets/redman.png';
const IMGPATH_BLUEMAN: string = './src/assets/blueman.png';
//const PATH_BORDER10: string = './src/assets/10 Border 01.png';

const IMGPATH_MOB_UNKNOWN: string = './src/assets/pinkquestion.png';
//const IMGPATH_MOB_VOLUNTEER: string = './src/assets/greyman.png';
const IMGPATH_MOB_AFRAME: string = './src/assets/aframe.png';
const IMGPATH_MOB_SAUSAGESIZZLE: string = './src/assets/sausagesizzle.png';

class MobController {

	Initialise() {
		resourceController.LoadImage(IMGPATH_GREYMAN);
		resourceController.LoadImage(IMGPATH_REDMAN);
		resourceController.LoadImage(IMGPATH_BLUEMAN);
		resourceController.LoadImage(IMGPATH_MOB_AFRAME);
		resourceController.LoadImage(IMGPATH_MOB_SAUSAGESIZZLE);
		//resourceController.LoadImage(IMGPATH_MOB_VOLUNTEER);
		resourceController.LoadImage(IMGPATH_MOB_UNKNOWN);
	}

	createMobInstance(mobType: MOBTYPE): Mob {
		let newMob: Mob;
		switch (mobType) {
			case MOBTYPE.AFRAME:
				{
					newMob = new Mob(new Vector2(-9999, -9999), IMGPATH_MOB_AFRAME, MOBTYPE.AFRAME);
					newMob.name = "A-Frame with posters";
					newMob.placeableDesc = "A stationary poster saying \'Vote for me!\'";
					break;
				}
			case MOBTYPE.SAUSAGESIZZLE:
				{
					newMob = new Mob(new Vector2(-9999, -9999), IMGPATH_MOB_SAUSAGESIZZLE, MOBTYPE.SAUSAGESIZZLE);
					newMob.name = "Sausage sizzle";
					newMob.placeableDesc = "A stall selling a tasty snack.";
					break;
				}
			case MOBTYPE.VOLUNTEER:
				{
					newMob = new Mob(new Vector2(-9999, -9999), IMGPATH_BLUEMAN, MOBTYPE.VOLUNTEER);
					newMob.name = "Volunteers";
					newMob.placeableDesc = "Your front line troopers, handing out flyers to voters.";
					break;
				} 
			case MOBTYPE.WANDER_ENEMY:
				{
					newMob = new Mob(new Vector2(-9999, -9999), IMGPATH_REDMAN, MOBTYPE.WANDER_ENEMY);
					newMob.name = "Wandering enemy";
					newMob.placeableDesc = "A bad dude";
					break;
				}
			default:
				{
					newMob = new Mob(new Vector2(-9999, -9999), IMGPATH_MOB_UNKNOWN, MOBTYPE.UNKNOWN);
					break;
				}
		}

		return newMob;
	}
}

const mobController = new MobController();
export default mobController;

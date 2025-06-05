
import { type PlayerInfo, random_name } from '@game/Player.ts';
import { ColourInfo } from '@utils/ColourInfo.ts';
import Mob from '@game/Mob.ts';
import { MOBTYPE } from '@game/Mob.ts';
import mobController from '@controllers/MobController.ts';

class PlayerController {
	allPlaceableMobs: Mob[] = [];
	playerPlaceableMobs: Mob[] = [];

	private currentPlayer: PlayerInfo | null = null;
	private noPlayer: PlayerInfo = {
		themePrimary: new ColourInfo("#808080"),
		themeSecondary: new ColourInfo("#808080"),
		playerName: "No player selected",
		playerImagePath: './src/assets/greyquestion.png'
	};

	Initialise() {
		//what mobs should the player be able to place?
		this.allPlaceableMobs.push(mobController.createMobInstance(MOBTYPE.VOLUNTEER));
		this.allPlaceableMobs.push(mobController.createMobInstance(MOBTYPE.AFRAME));
		this.allPlaceableMobs.push(mobController.createMobInstance(MOBTYPE.SAUSAGESIZZLE));

		//for now, let the player place all of them
		for (const curMob of this.allPlaceableMobs) {
			this.playerPlaceableMobs.push(curMob);
		}
	}

	newCurrentPlayer() {
		this.currentPlayer = {
			themePrimary: new ColourInfo("#808080"),
			themeSecondary: new ColourInfo("#808080"),
			playerName: random_name(),
			playerImagePath: './src/assets/greyface.png'
		}
	}

	getCurrentPlayer(): PlayerInfo {
		if (!this.currentPlayer) {
			return this.noPlayer;
		}

		return this.currentPlayer;
	}
}

const playerController = new PlayerController();
export default playerController;

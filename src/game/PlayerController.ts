
import { type PlayerInfo, random_name } from '../game/Player.ts';
import { ColourInfo } from './ColourInfo.ts';

class PlayerController {
	private currentPlayer: PlayerInfo | null = null;
	private noPlayer: PlayerInfo = {
		themePrimary: new ColourInfo("#808080"),
		themeSecondary: new ColourInfo("#808080"),
		playerName: "No player selected",
		playerImagePath: './src/assets/greyquestion.png'
	};

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


import { shallowRef, type Component } from 'vue';
//import { Component, ComponentPublicInstance } from 'vue'
// import gameController from '@controllers/GameController.ts';
import SceneMainMenu from '@components/SceneMainMenu.vue';
import GameWrapper from '@/GameWrapper.vue';
import gameController from '@controllers/GameController.ts';

export enum GAMESCENE {
	UNKNOWN = 0,
	MAIN_MENU,
	CHARSELECT,
	ROUND_PRE,
	ROUND_ACTIVE,
	ROUND_POST,
	ROUND_SHOP,
	GAMEOVER
}

class AppController {
	curGameScene: GAMESCENE = GAMESCENE.UNKNOWN;
	mountedSceneComponent = shallowRef<Component|null>(null);

	initialise() {
		// Set the initial game scene to MAIN_MENU
		//gameController.initialise();
		this.curGameScene = GAMESCENE.MAIN_MENU;
		this.mountedSceneComponent.value = SceneMainMenu;
	}

	onNewGame() {
		if (this.curGameScene == GAMESCENE.MAIN_MENU) {
			// console.log("AppController::onNewGame() called, switching to CHARSELECT scene");
			console.log("AppController::onNewGame() called, switching to GAME scene");
			this.mountedSceneComponent.value = GameWrapper;

			gameController.Initialise().then(() => gameController.startGame());
		} else {
			console.error(`AppController::onRoundStart() called this.curGameScene expected to be GAMESCENE.MAIN_MENU (${GAMESCENE.MAIN_MENU}) but got ${this.curGameScene}`);
		}
	}

	onCharSelect() {
		if (this.curGameScene == GAMESCENE.CHARSELECT) {
			console.log("AppController::onCharSelect() called, switching to ROUND_PRE scene");
		}
		else {
			console.error(`AppController::onRoundStart() called this.curGameScene expected to be GAMESCENE.CHARSELECT (${GAMESCENE.CHARSELECT}) but got ${this.curGameScene}`);
		}
	}

	onRoundStart() {
		if (this.curGameScene == GAMESCENE.ROUND_PRE) {
			console.log("AppController::onRoundStart() called, switching to ROUND_ACTIVE scene");
		}
		else {
			console.error(`AppController::onRoundStart() called this.curGameScene expected to be GAMESCENE.ROUND_PRE (${GAMESCENE.ROUND_PRE}) but got ${this.curGameScene}`);
		}
	}

	onRoundEnd() {
		if (this.curGameScene == GAMESCENE.ROUND_ACTIVE) {
			console.log("AppController::onRoundEnd() called, switching to ROUND_POST scene");
		}
		else {
			console.error(`AppController::onRoundEnd() called this.curGameScene expected to be GAMESCENE.ROUND_ACTIVE (${GAMESCENE.ROUND_ACTIVE}) but got ${this.curGameScene}`);
		}
	}

	onRoundEndShopOpen() {
		if (this.curGameScene == GAMESCENE.ROUND_POST) {
			console.log("AppController::onRoundEndShopStart() called, opening shop dialogue");
		}
		else {
			console.error(`AppController::onRoundEndShopStart() called this.curGameScene expected to be GAMESCENE.ROUND_POST (${GAMESCENE.ROUND_POST}) but got ${this.curGameScene}`);
		}
	}

	onRoundEndShopClose() {
		if (this.curGameScene == GAMESCENE.ROUND_POST) {
			console.log("AppController::onRoundEndShopEnd() called, closing shop dialogue");
		}
		else {
			console.error(`AppController::onRoundEndShopEnd() called this.curGameScene expected to be GAMESCENE.ROUND_POST (${GAMESCENE.ROUND_POST}) but got ${this.curGameScene}`);
		}
	}

	onNextRound() {
		if (this.curGameScene == GAMESCENE.ROUND_POST) {
			console.log("AppController::onNextRound() called, switching to ROUND_PRE scene");
		}
		else {
			console.error(`AppController::onNextRound() called this.curGameScene expected to be GAMESCENE.ROUND_POST (${GAMESCENE.ROUND_POST}) but got ${this.curGameScene}`);
		}
	}
};

const appController = new AppController();
export default appController;

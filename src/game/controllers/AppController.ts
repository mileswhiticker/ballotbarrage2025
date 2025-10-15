
import { shallowRef, type Component } from 'vue';
//import { Component, ComponentPublicInstance } from 'vue'
// import gameController from '@controllers/GameController.ts';
import SceneMainMenu from '@components/SceneMainMenu.vue';
import SceneCharSelect from '@components/SceneCharSelect.vue';
import SceneRoundPre from '@components/SceneRoundPre.vue';
import SceneGame from '@components/SceneGame.vue';
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

export const GAMESCENE_STR = [
	"UNKNOWN",
	"MAIN_MENU",
	"CHARSELECT",
	"ROUND_PRE",
	"ROUND_ACTIVE",
	"ROUND_POST",
	"ROUND_SHOP",
	"GAMEOVER"];

const sceneComponents: (Component|null)[] = [
	null,
	SceneMainMenu,
	SceneCharSelect,
	SceneRoundPre,
	SceneGame,
	null,	//ROUND_POST
	null,	//ROUND_SHOP
	null,	//GAMEOVER
];

class AppController {
	curGameScene: GAMESCENE = GAMESCENE.UNKNOWN;
	mountedSceneComponent = shallowRef<Component|null>(null);

	initialise() {
		// Set the initial game scene to MAIN_MENU
		this.changeScene(GAMESCENE.MAIN_MENU);
	}

	changeScene(newSceneId: GAMESCENE){

		//is there a predefined component for this?
		const nextScene = sceneComponents[newSceneId];

		//instantiate the new component
		if(nextScene) {
			this.mountedSceneComponent.value = nextScene;
			this.curGameScene = newSceneId;

			//handle other processing
			switch(newSceneId){
				case GAMESCENE.MAIN_MENU: {
					break;
				}
				case GAMESCENE.CHARSELECT:
				{
					gameController.Initialise();
					break;
				}
				case GAMESCENE.ROUND_PRE:
				{
					break;
				}
				case GAMESCENE.ROUND_ACTIVE:
				{
					gameController.LateInitialise();
					gameController.startGame();
					break;
				}
			}
			console.log(`changeScene(${newSceneId}) success, changed scene to ${GAMESCENE_STR[newSceneId]}`);
		} else {
			console.error(`changeScene(${newSceneId}) failed, no component defined for ${GAMESCENE_STR[newSceneId]}`);	//GAMESCENE_STR
		}
	}
}

const appController = new AppController();
export default appController;

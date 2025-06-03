import { MOBTYPE } from './Mob.ts';
import Mob from './Mob.ts';
import { ref, type Ref } from 'vue';
import mobController from './MobController.ts'

class MouseController {
	private mobBuildGhostType: Ref<MOBTYPE> = ref(MOBTYPE.NONE);
	private mobBuildGhostElement: HTMLElement | null = null;
	mobBuildGhost: Mob | null = null;
	interfaceBoundingClientRect: DOMRect | null = null;

	Initialise() {
		//we will need this to calculate the necessary mouse offset from the top left corner of the page
		const gameInterface = document.getElementById('gameInterface');
		if (gameInterface) {
			this.interfaceBoundingClientRect = gameInterface.getBoundingClientRect();
		}
	}

	SetBuildGhost(mobType: MOBTYPE) {
		if (this.mobBuildGhostType.value == mobType) {
			this.ClearBuildGhost();
		}
		else {
			//console.log(`MouseController::SetBuildGhost(${mobType})`);
			this.mobBuildGhostType.value = mobType;
			this.mobBuildGhost = mobController.createMobInstance(mobType);
		}
	}

	ClearBuildGhost() {
		//console.log(`MouseController::ClearBuildGhost()`);
		this.mobBuildGhostType.value = MOBTYPE.NONE;

		if (this.mobBuildGhost) {
			this.mobBuildGhost = null;
		}
	}

	GetBuildGhostType(): Ref<MOBTYPE> {
		return this.mobBuildGhostType;
	}

	mouseMove(event: MouseEvent) {
		//console.log(event);
		if (this.mobBuildGhost) {
			//console.log('updating pos', event);
			//32 px adjustment to fit perfectly under the mouse... 64px sprite
			let newX = event.clientX - 32;
			let newY = event.clientY - 32;

			//is the canvas offset from the topleft corner of the page?
			if (this.interfaceBoundingClientRect) {
				newX -= this.interfaceBoundingClientRect.left;
				newY -= this.interfaceBoundingClientRect.top;
			}
			
			this.mobBuildGhost.pos.x = newX;
			this.mobBuildGhost.pos.y = newY;
		}
		else {
			//console.log('not updating pos', event);
		}
	}
}

const mouseController = new MouseController();
export default mouseController;

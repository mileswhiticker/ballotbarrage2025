import { MOBTYPE } from './Mob.ts';
import { ref, type Ref } from 'vue';

class MouseController {
	private mobBuildGhostType: Ref<MOBTYPE> = ref(MOBTYPE.NONE);
	private mobBuildGhostElement: HTMLElement | null = null;
	private mob

	SetBuildGhost(mobType: MOBTYPE) {
		//console.log(`MouseController::SetBuildGhost(${mobType})`);
		if (this.mobBuildGhostType.value == mobType) {
			this.mobBuildGhostType.value = MOBTYPE.NONE;
		}
		else {
			this.mobBuildGhostType.value = mobType;
		}
	}

	GetBuildGhostType(): Ref<MOBTYPE> {
		return this.mobBuildGhostType;
	}

	mouseMove(event: MouseEvent) {
		console.log(event);
	}
}

const mouseController = new MouseController();
export default mouseController;

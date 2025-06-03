import { MOBTYPE } from './Mob.ts';
import Mob from './Mob.ts';
import { ref, type Ref } from 'vue';
import mobController from './MobController.ts'
import gridController from './GridController.ts';
import Vector2 from './Vector2.ts';

class MouseController {
	private mobBuildGhostType: Ref<MOBTYPE> = ref(MOBTYPE.NONE);
	private mobBuildGhostElement: HTMLElement | null = null;
	mobBuildGhost: Mob | null = null;
	interfaceBoundingClientRect: DOMRect | null = null;
	game2dRenderContext: CanvasRenderingContext2D | null = null;

	Initialise(game2dRenderContext: CanvasRenderingContext2D) {
		this.game2dRenderContext = game2dRenderContext;

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

	renderBuildGhost() {
		if (this.game2dRenderContext && mouseController.mobBuildGhost && mouseController.mobBuildGhost.sprite) {
			mouseController.mobBuildGhost.sprite.Render(this.game2dRenderContext);
		}
	}

	TransformCanvasPosition(event: MouseEvent): Vector2 {
		//32 px adjustment to fit perfectly under the mouse... 64px sprite
		const transformedPosition = new Vector2(event.clientX, event.clientY);
		transformedPosition.x -= gridController.gridCellDim / 2;
		transformedPosition.y -= gridController.gridCellDim / 2;

		//is the canvas offset from the topleft corner of the page?
		if (this.interfaceBoundingClientRect) {
			transformedPosition.x -= this.interfaceBoundingClientRect.left;
			transformedPosition.y -= this.interfaceBoundingClientRect.top;
		}

		return transformedPosition;
	}

	mouseMove(event: MouseEvent) {
		//console.log(event);
		if (this.mobBuildGhost) {
			//console.log('updating pos', event);
			const transformedPosition = this.TransformCanvasPosition(event);
			
			this.mobBuildGhost.pos.x = transformedPosition.x;
			this.mobBuildGhost.pos.y = transformedPosition.y;
		}
		else {
			//console.log('not updating pos', event);
		}
	}

	mouseClick(event: MouseEvent) {
		//console.log('MouseController::mouseClick()', event);
		if (this.mobBuildGhost) {

			//get the correct canvas position from the mouse event
			const transformedPosition = this.TransformCanvasPosition(event);

			//which grid cell is it?
			const gridCoords = gridController.getGridCoords(transformedPosition);

			//check if this grid cell is free to place something
			const blockingMob = mobController.getPlayerMobInGridCell(gridCoords);
			if (blockingMob) {
				console.warn(`Player is trying to place a mobType ${this.mobBuildGhostType.value} in grid ${gridCoords.x},${gridCoords.y}\
					but there is already a mobType ${blockingMob.mobType} there`);
				return;
			}

			//const snappedPosition = gridController.snapToGrid(transformedPosition);

			//console.log(`building new placeable mob...`);
			const newMob = mobController.createPlayerMob(this.mobBuildGhostType.value);
			newMob.jumpToGridFromRawPos(transformedPosition);

			this.ClearBuildGhost();
		}
	}
}

const mouseController = new MouseController();
export default mouseController;


enum MOBTYPE {
	UNKNOWN = -1,
	NONE,
	//
	VOLUNTEER,
	AFRAME,
	SAUSAGESIZZLE
}

class MouseController {
	private mobBuildGhostType: MOBTYPE = MOBTYPE.NONE;
	private mobBuildGhostElement: HTMLElement | null = null;

	SetBuildGhost(mobType: MOBTYPE) {
		console.log(`MouseController::SetBuildGhost(${mobType})`);
	}

	GetBuildGhostType(): MOBTYPE {
		return this.mobBuildGhostType;
	}
}

const mouseController = new MouseController();
export default mouseController;

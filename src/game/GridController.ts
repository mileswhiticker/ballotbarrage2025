import Mob from '@game/Mob.ts';
import mobController from '@controllers/MobController.ts';
import Vector2 from '@utils/Vector2.ts';

export class GridRoute {
	squares: Vector2[] = [];
}

class GridController {
	gridCellDim: number = 32;
	gridMax: Vector2 = new Vector2(26, 16);
	private game2dRenderContext: CanvasRenderingContext2D | null = null;
	doDrawGridlines: boolean = false;

	Initialise(game2dRenderContext: CanvasRenderingContext2D) {
		this.game2dRenderContext = game2dRenderContext;
		//
	}

	renderGridLines() {
		if (this.game2dRenderContext) {
			this.game2dRenderContext.strokeStyle = '#A9A9A9';
			this.game2dRenderContext.lineWidth = 1;

			const width = 1000;
			const height = 1000;

			// Draw vertical lines
			for (let x = 0; x <= width; x += this.gridCellDim) {
				this.game2dRenderContext.beginPath();
				this.game2dRenderContext.moveTo(x, 0);
				this.game2dRenderContext.lineTo(x, height);
				this.game2dRenderContext.stroke();
			}

			// Draw horizontal lines
			for (let y = 0; y <= height; y += this.gridCellDim) {
				this.game2dRenderContext.beginPath();
				this.game2dRenderContext.moveTo(0, y);
				this.game2dRenderContext.lineTo(width, y);
				this.game2dRenderContext.stroke();
			}
		}
	}

	snapToGrid(rawPos: Vector2): Vector2 {
		const snappedPos = new Vector2(0, 0);

		snappedPos.x = Math.round(rawPos.x / this.gridCellDim) * this.gridCellDim;
		snappedPos.y = Math.round(rawPos.y / this.gridCellDim) * this.gridCellDim;

		return snappedPos;
	}

	getGridCoords(rawPos: Vector2): Vector2 {
		const gridCoords = new Vector2(0, 0);
		gridCoords.x = Math.round(rawPos.x / this.gridCellDim);
		gridCoords.y = Math.round(rawPos.y / this.gridCellDim);

		return gridCoords;
	}

	getRawPosFromGridCoords(gridCoords: Vector2) {
		return new Vector2(gridCoords.x * this.gridCellDim, gridCoords.y * this.gridCellDim);
	}

	pathToMob(mobSource: Mob, mobDest: Mob): GridRoute {
		return this.pathToGrid(mobSource.gridCoords, mobDest.gridCoords);
	}

	pathToGrid(startCoords: Vector2, endCoords: Vector2, doDebug = false): GridRoute {
		const route = new GridRoute();
		if (doDebug) {
			gridController.debugRoute = route;
		}
		if (startCoords.x === endCoords.x && startCoords.y === endCoords.y) {
			console.warn(`GridController::pathToGrid() but start and end are the same! ${endCoords.x},${endCoords.y}`);
			route.squares.push(endCoords.clone());
			return route;
		}

		type GridCell = {
			pos: Vector2;
			g: number; // cost from start
			h: number; // heuristic to end
			parent: GridCell | null;
		};

		const start: GridCell = {
			pos: startCoords.clone(),
			g: 0,
			h: this.heuristic(startCoords, endCoords),
			parent: null
		};

		const openList: GridCell[] = [start];
		const closedList: Vector2[] = [];

		function getLowestFCell(list: GridCell[]): GridCell {
			return list.reduce((lowest, cell) =>
				cell.g + cell.h < lowest.g + lowest.h ? cell : lowest
			);
		}

		while (openList.length > 0) {
			const current = getLowestFCell(openList);
			const index = openList.indexOf(current);
			openList.splice(index, 1);
			closedList.push(current.pos);

			if (current.pos.equals(endCoords)) {
				let pathNode: GridCell | null = current;
				while (pathNode) {
					route.squares.unshift(pathNode.pos.clone());
					pathNode = pathNode.parent;
				}
				return route;
			}

			const neighbors: Vector2[] = this.getAdjacentWalkableCells(current.pos);
			for (const neighborPos of neighbors) {
				if (closedList.some(p => p.equals(neighborPos))) {
					continue;
				}

				let gCost = current.g + 1; // assume uniform movement cost

				//make diags slightly more expensive to disincentivise them
				if (current.pos.x != neighborPos.x && current.pos.y != neighborPos.y) {
					gCost += 0.1;
				}

				const existing = openList.find(c => c.pos.equals(neighborPos));

				if (!existing) {
					openList.push({
						pos: neighborPos.clone(),
						g: gCost,
						h: this.heuristic(neighborPos, endCoords),
						parent: current
					});
				} else if (gCost < existing.g) {
					existing.g = gCost;
					existing.parent = current;
				}
			}
		}

		console.warn("GridController::pathToGrid() - No path found.");
		return route;
	}
	
	heuristic(a: Vector2, b: Vector2): number {
		return this.heuristicManhattan(a, b);
	}

	heuristicManhattan(a: Vector2, b: Vector2): number {
		// Manhattan distance
		const heuristicDist = Math.abs(a.x - b.x) + Math.abs(a.y - b.y);

		return heuristicDist;
	}

	cardinals = [
		{ x: 0, y: -1 }, // up
		{ x: 0, y: 1 },  // down
		{ x: -1, y: 0 }, // left
		{ x: 1, y: 0 },   // right
	];

	subcardinals = [
		{ x: -1, y: -1 }, // top left
		{ x: 1, y: -1 },  // top right
		{ x: -1, y: 1 }, // bottom left
		{ x: 1, y: 1 }   // bottom right
	];

	getAdjacentWalkableCells(pos: Vector2): Vector2[] {
		const directions = [... this.cardinals, ...this.subcardinals];

		const neighbors: Vector2[] = [];

		for (const dir of directions) {
			const nx = pos.x + dir.x;
			const ny = pos.y + dir.y;

			if (this.isInBounds(nx, ny) && this.isWalkable(nx, ny)) {
				neighbors.push(new Vector2(nx, ny));
			}
		}

		return neighbors;
	}

	isInBounds(xcoord: number, ycoord: number): boolean {
		if (xcoord < 0) {
			return false;
		}
		if (ycoord < 0) {
			return false;
		}

		//todo: positive grid x and y bounds
		//

		return true;
	}

	isWalkable(xcoord: number, ycoord: number): boolean {
		if (!this.isInBounds(xcoord, ycoord)) {
			return false;
		}

		const gridCoords = new Vector2(xcoord, ycoord);
		const blockingMob = mobController.getPlayerMobInGridCell(gridCoords);
		if (blockingMob) {
			return false;
		}

		return true;
	}

	debugRoute: GridRoute | null = null;

	renderDebug() {
		if (this.debugRoute && this.debugRoute.squares.length > 1 && this.game2dRenderContext) {
			for (let i = 1; i < this.debugRoute.squares.length; i++) {
				const prevSquare = this.debugRoute.squares[i - 1];
				const curSquare = this.debugRoute.squares[i];

				this.game2dRenderContext.strokeStyle = '#0000FF';
				this.game2dRenderContext.lineWidth = 1;

				this.game2dRenderContext.beginPath();
				this.game2dRenderContext.moveTo(prevSquare.x * this.gridCellDim + this.gridCellDim / 2, prevSquare.y * this.gridCellDim + this.gridCellDim / 2);
				this.game2dRenderContext.lineTo(curSquare.x * this.gridCellDim + this.gridCellDim / 2, curSquare.y * this.gridCellDim + this.gridCellDim / 2);
				this.game2dRenderContext.stroke();

			}
		}
	}
}

interface GridCell {
	pos: Vector2;
	heuristicDist: number;
	parent: GridCell|null;
}

const gridController = new GridController();
export default gridController;

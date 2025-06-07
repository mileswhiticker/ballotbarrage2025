import enemyController from '@controllers/EnemyController.ts';
import Vector2 from '@utils/Vector2.ts';

type PieSlice = {
	label: string;
	value: number;
	color: string;
};

let game2dRenderContext: CanvasRenderingContext2D | null = null;
let centrePos: Vector2 = new Vector2(0, 0);
let dims: Vector2 = new Vector2(100, 100);

export function initialiseTimer(context: CanvasRenderingContext2D, newCentrePos: Vector2, newDims: Vector2) {
	game2dRenderContext = context;
	centrePos = newCentrePos;
	dims = newDims;
}

export const sampleTimerdata = [
	{ label: "Red", value: 30, color: "#f44336" },
	{ label: "Green", value: 50, color: "#4caf50" },
	{ label: "Blue", value: 20, color: "#2196f3" }
];

let currentData: PieSlice[] | null = null;
let angularRate: number = 0.5; // radians per second

export function SetTimerData(data: PieSlice[]) {
	currentData = data;
	let maxTime = 0;
	for (const data of currentData) {
		maxTime += data.value;
	}

	angularRate = (Math.PI * 2) / maxTime;
}

export function renderTimer(
	deltaTime: number
): void {
	if (!game2dRenderContext || !currentData) return;
	//console.log(`drawPieChart()`);

	const total = currentData.reduce((sum, slice) => sum + slice.value, 0);
	const radius = Math.min(dims.x, dims.y) / 2;
	const centerX = centrePos.x;
	const centerY = centrePos.y

	let startAngle = 0;

	const currentAngle = (Date.now() / 1000 - enemyController.waveStartTime) * angularRate;

	for (const slice of currentData) {
		const sliceAngle = (slice.value / total) * Math.PI * 2;
		const endAngle = startAngle + sliceAngle;
		//skip if the timer has already exceeded this slice
		if (endAngle < currentAngle) {
			startAngle += sliceAngle;
			continue;
		}

		let renderStartAngle = startAngle;
		if (renderStartAngle < currentAngle) {
			renderStartAngle = currentAngle;
		}

		game2dRenderContext.beginPath();
		game2dRenderContext.moveTo(centerX, centerY);
		game2dRenderContext.arc(
			centerX,
			centerY,
			radius,
			renderStartAngle,
			endAngle
		);
		game2dRenderContext.closePath();
		game2dRenderContext.fillStyle = slice.color;
		game2dRenderContext.fill();

		startAngle += sliceAngle;
	}

	//currentAngle += angularRate * deltaTime; // Update the angle based on deltaTime
	//console.log(currentAngle);
}

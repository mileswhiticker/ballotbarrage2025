import Vector2 from '@utils/Vector2.ts';
import { ref, type Ref } from 'vue';
import { COLOUR_RED, COLOUR_GREEN, COLOUR_BLUE } from '@utils/ColourInfo.ts';

type PieSlice = {
	label: string;
	seconds: number;
	color: string;
};

export default class Timer {
	currentData: PieSlice[] = [];
	renderContext: CanvasRenderingContext2D | null = null;
	dims: Vector2 = new Vector2(100, 100);
	centrePos: Vector2 = new Vector2(0, 0);
	angularRate: number = 0.5; // radians per second
	isRunning: boolean = false;
	currentAngle: number = 0; // in radians
	private sliceTimeLeft: number = 0; // time left in the current slice
	private currentSliceIndex: number = 0; // index of the current slice
	currentColour: Ref<string> = ref("#000000"); // default colour
	formattedTimeLeft: Ref<string> = ref("00:00");
	timerSliceExpiryCallbacks: ((sliceLabel: string) => void)[] = []; // callbacks for when a slice expires
	timerSliceStartedCallbacks: ((sliceLabel: string) => void)[] = []; // callbacks for when a slice starts

	static sampleTimerdata = [
		{ label: "Green", seconds: 5, color: COLOUR_GREEN.hex_string },
		{ label: "Blue", seconds: 10, color: COLOUR_BLUE.hex_string },
		{ label: "Red", seconds: 15, color: COLOUR_RED.hex_string },
	];

	Initialise(context: CanvasRenderingContext2D, newCentrePos: Vector2, newDims: Vector2) {
		this.renderContext = context;
		this.centrePos = newCentrePos;
		this.dims = newDims;
	}

	SetTimerData(data: PieSlice[]) {
		this.currentData = data;
		let maxTime = 0;
		for (const data of this.currentData) {
			maxTime += data.seconds;
		}

		this.angularRate = (Math.PI * 2) / maxTime;
	}

	StartTimer() {
		this.isRunning = true;
	}

	StopTimer() {
		this.isRunning = false;
	}

	ResetTimer() {
		this.currentSliceIndex = 0;
		if (this.currentData.length > 0) {
			this.sliceTimeLeft = this.currentData[0].seconds;
		}
		else {
			this.sliceTimeLeft = 0;
		}
		this.currentAngle = 0;
	}

	render(deltaTime: number) {
		if (!this.renderContext || !this.currentData) return;
		//console.log(`renderTimer()`, deltaTime);
		//if (deltaTime >= 100) {
		//	deltaTime = 100;
		//}

		if (this.isRunning) {
			this.sliceTimeLeft -= deltaTime;
			this.currentAngle += this.angularRate * deltaTime;
			//console.log(`renderTimer()`, this.sliceTimeLeft);

			//for testing: remove this later
			if (this.currentAngle >= Math.PI * 2) {
				this.StopTimer();
			}

			const rounded = Math.round(this.sliceTimeLeft);
			const minutes = Math.min(Math.floor(rounded / 60), 99);
			const seconds = rounded % 60;
			this.formattedTimeLeft.value = `${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;

			if (this.sliceTimeLeft <= 0) {
				this.currentSliceIndex++;
				this.sliceTimeLeft = this.currentData[this.currentSliceIndex]?.seconds || 0;
				//console.log("going to next slice", this.currentSliceIndex, this.sliceTimeLeft);
				for (const callback of this.timerSliceExpiryCallbacks) {
					callback(this.currentData[this.currentSliceIndex - 1].label);
				}

				//dont start the next slice if we have no more slices
				if (this.currentSliceIndex < this.currentData.length) {
					for (const callback of this.timerSliceStartedCallbacks) {
						callback(this.currentData[this.currentSliceIndex].label);
					}
				}
			}
		}

		const total = this.currentData.reduce((sum, slice) => sum + slice.seconds, 0);
		const radius = Math.min(this.dims.x, this.dims.y) / 2;
		const centerX = this.centrePos.x;
		const centerY = this.centrePos.y

		let startAngle = 0;
		this.renderContext.clearRect(0, 0, this.dims.x, this.dims.y);

		let colourSet = false;
		for (const slice of this.currentData) {
			const sliceAngle = (slice.seconds / total) * Math.PI * 2;
			const endAngle = startAngle + sliceAngle;
			//skip if the timer has already exceeded this slice
			if (endAngle < this.currentAngle) {
				startAngle += sliceAngle;
				continue;
			}

			if (!colourSet) {
				colourSet = true;
				this.currentColour.value = slice.color;
			}
			//console.log("timer setting new colour",slice.color);

			let renderStartAngle = startAngle;
			if (renderStartAngle < this.currentAngle) {
				renderStartAngle = this.currentAngle;
			}

			this.renderContext.beginPath();
			this.renderContext.moveTo(centerX, centerY);
			this.renderContext.arc(
				centerX,
				centerY,
				radius,
				renderStartAngle,
				endAngle
			);
			this.renderContext.closePath();
			this.renderContext.fillStyle = slice.color;
			this.renderContext.fill();

			startAngle += sliceAngle;
		}
	}
}

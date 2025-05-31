
export default class Vector2 {
	x: number;
	y: number;
		
	constructor(x: number, y: number) {
		this.x = x;
		this.y = y;
	}

	dist(other: Vector2): number
	{
		return Math.sqrt(this.distSqrd(other));
	}

	distSqrd(other: Vector2): number {
		const dx = this.x - other.x;
		const dy = this.y - other.y;
		return (dx * dx + dy * dy);
	}

	clone(): Vector2
	{
		return new Vector2(this.x, this.y);
	}

	magSqrd(): number {
		return (this.x ** 2 + this.y ** 2);
	}

	mag(): number {
		return Math.sqrt(this.magSqrd());
	}

	normalise() {
		const mag = this.mag();
		this.x /= mag;
		this.y /= mag;
	}

	add(value: Vector2 | number) {
		if (typeof value === "number") {
			this.x += value;
			this.y += value;
		}
		else
		{
			this.x += value.x;
			this.y += value.y;
		}
	}

	subtract(value: Vector2 | number) {
		if (typeof value === "number") {
			this.x -= value;
			this.y -= value;
		}
		else {
			this.x -= value.x;
			this.y -= value.y;
		}
	}

	multiply(val: number) {
		this.x *= val;
		this.y *= val;
	}

	divide(val: number) {
		this.x /= val;
		this.y /= val;
	}
}

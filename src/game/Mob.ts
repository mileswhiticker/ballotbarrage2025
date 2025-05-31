
export default class Mob {
  xpos: number;
  ypos: number;
  xwidth: number;
  ywidth: number;
  imagepath: string;
  age: number = 0;
  isAlive: boolean = false;

  constructor(startX: number, startY: number, imagepath: string) {
    this.xpos = startX;
    this.ypos = startY;
    this.imagepath = imagepath;
    this.xwidth = 64;
    this.ywidth = 64;
  }

  update(deltaTime: number) {
    if (this.isAlive) {
      this.age += deltaTime; }
  }
}

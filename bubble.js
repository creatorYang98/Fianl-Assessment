class Bubble {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.r = random(2, 5);
    this.xSpeed = random(-1, 1);
    this.ySpeed = random(-2, 2);
    this.colour = color(random(255), random(255), random(255));
  }

  update() {
    this.x += this.xSpeed;
    this.y += this.ySpeed;
  }

  draw() {
    fill(this.colour);
    noStroke();
    ellipse(this.x, this.y, this.r * 2);
  }
}
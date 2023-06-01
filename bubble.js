class Bubble {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.r = random(2, 5);
    // random speed
    this.xSpeed = random(-1, 1);
    this.ySpeed = random(-2, 2);
    // random colour
    this.colour = color(random(255), random(255), random(255));
  }

  update() {
    // update the Velocity
    this.x += this.xSpeed;
    this.y += this.ySpeed;
  }

  draw() {
    fill(this.colour);
    noStroke();
    ellipse(this.x, this.y, this.r * 2);
  }
}
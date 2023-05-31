
class Ball {
  constructor(args) {
    this.r = args.r;
    this.p = args.p;
    this.v = { x: randomSpeed(), y: randomSpeed() };
    this.colourGroup = random(args.colours);
    this.color = random(this.colourGroup);
    this.mode = 'sad';
    this.happyTimestamp = 0;
    this.angerTime = 0;
    this.colours = args.colours;

  }

  draw() {
    push()
    translate(this.p.x, this.p.y)
    fill(this.color)
    noStroke()
    ellipse(0, 0, this.r)
    if (this.mode == 'happy') {
      fill(255)
      ellipse(-16, -9, this.r / 2.5, this.r / 3)
      fill(0)
      ellipse(-16, -9, this.r / 4, this.r / 4)
      fill(255)
      ellipse(16, -9, this.r / 2.5, this.r / 3)
      fill(0)
      ellipse(16, -9, this.r / 4, this.r / 4)
      noStroke(0)
      fill(255);
      strokeWeight(2)
      arc(0, 13, 25, 25, 0, PI)
    }
    if (this.mode == 'sad') {
      push()
      rotate(0.09)
      fill(0)
      rect(-28, -18, this.r / 3, this.r / 15)
      pop()
      push()
      rotate(-0.09)
      fill(0)
      rect(5, -18, this.r / 3, this.r / 15)
      pop()
      fill(255)
      arc(-16, -10, this.r / 2.5, this.r / 2.5, 0, PI)
      fill(0)
      arc(-16, -10, this.r / 3.5, this.r / 3.5, 0, PI)
      fill(255)
      arc(16, -10, this.r / 2.5, this.r / 2.5, 0, PI)
      fill(0)
      arc(16, -10, this.r / 3.5, this.r / 3.5, 0, PI)
      noStroke()
      fill(255);
      strokeWeight(2)
      arc(0, 23, 25, 20, PI, TWO_PI);
      pop()
    }
    if (this.mode == 'anger') {
      push()
      rotate(0.3)
      fill(0)
      rect(-30, -16, this.r / 3, this.r / 15)
      pop()
      push()
      rotate(-0.3)
      fill(0)
      rect(7, -16, this.r / 3, this.r / 15)
      pop()
      fill(255)
      arc(-16, -10, this.r / 2.5, this.r / 2.5, 0, PI)
      fill(0)
      arc(-16, -10, this.r / 3.5, this.r / 3.5, 0, PI)
      fill(255)
      arc(16, -10, this.r / 2.5, this.r / 2.5, 0, PI)
      fill(0)
      arc(16, -10, this.r / 3.5, this.r / 3.5, 0, PI)
      stroke(0)
      fill(255)
      strokeWeight(2)
      ellipse(0, 20, 25, 16);
      pop()
    }


    pop()
  }


  update() {
    this.p.x += this.v.x
    this.p.y += this.v.y

    if ((this.p.x - this.r / 2 < 0 && this.v.x < 0) || (this.p.x + this.r / 2 > width && this.v.x > 0)) {
      this.v.x = -this.v.x;
    }
    if ((this.p.y - this.r / 2 < 0 && this.v.y < 0) || (this.p.y + this.r / 2 > height && this.v.y > 0)) {
      this.v.y = -this.v.y;
    }

    if (this.mode === 'happy' && millis() - this.happyTimestamp >= 5000) {
      this.mode = 'sad';
    } else if (this.mode === 'anger' && millis() - this.angerTimestamp >= 2000) {
      this.mode = 'sad';
    }
  }

  checkCollision(PreBall) {
    let dx = PreBall.p.x - this.p.x;
    let dy = PreBall.p.y - this.p.y;
    let distance = sqrt(dx * dx + dy * dy);
    let radiusSum = this.r / 2 + PreBall.r / 2

    if (distance < radiusSum) {
      let tempV = { x: this.v.x, y: this.v.y };
      this.v = { x: PreBall.v.x, y: PreBall.v.y };
      PreBall.v = { x: tempV.x, y: tempV.y };

      let collisionAngle = atan2(dy, dx);
      this.p.x -= cos(collisionAngle) * (radiusSum - distance) / 2;
      this.p.y -= sin(collisionAngle) * (radiusSum - distance) / 2;
      PreBall.p.x += cos(collisionAngle) * (radiusSum - distance) / 2;
      PreBall.p.y += sin(collisionAngle) * (radiusSum - distance) / 2;

      let sameColourGroup = false;

      for (let colourGroup of this.colours) {
        if (colourGroup.includes(this.color) && colourGroup.includes(PreBall.color)) {
          sameColourGroup = true;
          break;
        }
      }

      if (!sameColourGroup) {
        this.mode = 'anger';
        this.angerTimestamp = millis();
        PreBall.mode = 'anger';
        PreBall.angerTimestamp = millis();
      } else {
        this.mode = 'happy';
        this.happyTimestamp = millis();
        PreBall.mode = 'happy';
        PreBall.happyTimestamp = millis();
      }
    }
  }

}

var ball
var balls = []
let redColour = ["#F55900"]
let greenColour = ["#5C7C3B"]
let blueColour = ["#4230fa"]

let colours = [redColour, greenColour, blueColour]

function setup() {
  createCanvas(1680, 800);
  background(0);
  for (var i = 0; i < 20; i++) {
    let ball = new Ball({
      r: 70,
      p: { x: random(50, width - 50), y: random(50, height - 50) },
      colours: colours
    });
    balls.push(ball);
  }
}


function draw() {
  fill(0)
  rect(0, 0, width, height)

  let stColor = color(59, 138, 221)
  let edColor = color(12, 28, 59)
  for (var o = -1; o < 10; o++) {
    noStroke()
    let midColor = lerpColor(stColor, edColor, o / 10)

    push()
    translate(0, o * height / 10)
    fill(midColor)
    beginShape()
    vertex(0, 150)
    for (var i = 0; i < width; i += 2) {
      vertex(i, sin(i / (30 + noise(o, frameCount / 100) * 100) + o + cos(o + frameCount / 10)) * 30)
    }
    vertex(width, 150)
    endShape(CLOSE)
    pop()
  }

  noStroke()
  for (let i = 0; i < balls.length; i++) {
    for (let j = i + 1; j < balls.length; j++) {
      balls[i].checkCollision(balls[j])
    }
    balls[i].draw()
    balls[i].update()
  }
}


function randomSpeed() {
  let speed = random(-1, 1);
  if (speed > -0.5 && speed < 0.5) {
    if (speed > 0) {
      speed += 0.5;
    } else {
      speed -= 0.5;
    }
  }
  return speed;
}
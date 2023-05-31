var ball
var balls = []
let redColour = ["#F55900"]
let greenColour = ["#5C7C3B"]
let blueColour = ["#4230fa"]
let barriers = []

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

  for (let barrier of barriers) {
    drawCircle(barrier)
  }

  for (let i = barriers.length - 1; i >= 0; i--) {
    let barrier = barriers[i];
    drawCircle(barrier);
    if (barrier.lifespan <= 0) {
      barriers.splice(i, 1);
    }
  }

  noStroke()
  for (let i = 0; i < balls.length; i++) {
    for (let j = i + 1; j < balls.length; j++) {
      balls[i].checkCollision(balls[j])
    }
    for (let barrier of barriers) {
      balls[i].checkBarrierCollision(barrier);
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

function mouseClicked() {
  if (barriers.length >= 10) {
    barriers.shift(); // Remove the first barrier
  }
  let newBarrier = makeCircle(mouseX, mouseY);
  barriers.push(newBarrier);
}

var particle
var particles = []
let redColour = ["#F55900"]
let greenColour = ["#ffde59"]
let blueColour = ["#4230fa"]
let barriers = []
let texture
let backgroundColours = ["#094074", "#3c6997", "#5adbff", "#718e54", "#fe9000"];
let currentBgColour = backgroundColours[0];

let colours = [redColour, greenColour, blueColour]
let bubbles = []

function setup() {
  createCanvas(1680, 800);
  background(0);
  for (var i = 0; i < 20; i++) {
    let particle = new Particle({
      r: 70,
      p: { x: random(50, width - 50), y: random(50, height - 50) },
      colours: colours
    });
    particles.push(particle);
  }
  texture = createGraphics(width, height)
  texture.loadPixels()
  for (var i = 0; i < width + 50; i++) {
    for (var o = 0; o < height + 50; o++) {
      texture.set(i, o, color(100, noise(i / 3, o / 3, i * o / 50) * random([0, 40, 80])))
    }
  }
  texture.updatePixels()

  for (var i = 0; i < 5; i++) {
    let newBarrier = createBarrier(random(width), random(height));
    barriers.push(newBarrier);
  }
}

function draw() {
  fill(currentBgColour)
  rect(0, 0, width, height)

  push()
  blendMode(MULTIPLY)
  image(texture, 0, 0)
  pop()

  for (let barrier of barriers) {
    drawBarrier(barrier)
  }

  for (let i = barriers.length - 1; i >= 0; i--) {
    let barrier = barriers[i];
    if (barrier.lifespan <= 0) {
      barriers.splice(i, 1);
    }
  }

  noStroke()
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      particles[i].checkCollision(particles[j])
    }
    for (let barrier of barriers) {
      let collisionPoint = particles[i].checkBarrierCollision(barrier);
      if (collisionPoint) {
        let newBubble = new Bubble(collisionPoint.x, collisionPoint.y);
        bubbles.push(newBubble);
      }
    }
    particles[i].draw()
    particles[i].update()
  }
  for (let i = bubbles.length - 1; i >= 0; i--) {
    let bubble = bubbles[i];
    bubble.update();
    bubble.draw();
  }
  fill(255);
  textSize(32);
  text("Background", 10, 40);
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
  if (mouseX > 10 && mouseX < 200 && mouseY > 10 && mouseY < 50) {
    let randomIndex = floor(random(backgroundColours.length));
    currentBgColour = backgroundColours[randomIndex];
  } else {
    if (barriers.length >= 10) {
      barriers.shift();
    }
    let newBarrier = createBarrier(mouseX, mouseY);
    barriers.push(newBarrier);
  }
}

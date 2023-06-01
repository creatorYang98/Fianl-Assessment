var particle
var particles = []
let redColour = ["#F55900"]
let greenColour = ["#ffde59"]
let blueColour = ["#4230fa"]
let barriers = []
let texture

let colours = [redColour, greenColour, blueColour]

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
  for (var i = 0; i < width + 50; i ++) { 
    for (var o = 0; o < height + 50; o ++) { 
      texture.set(i, o, color(100, noise(i / 3, o / 3, i * o / 50) * random([0, 40, 80])))
    }
  }
  texture.updatePixels()
}


function draw() {
  fill('#094074')
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
      particles[i].checkBarrierCollision(barrier);
    }
    particles[i].draw()
    particles[i].update()
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
    barriers.shift();
  }
  let newBarrier = createBarrier(mouseX, mouseY);
  barriers.push(newBarrier);
}


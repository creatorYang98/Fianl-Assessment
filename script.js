// Global variable declaration

// particle
var particle
var particles = []

// particle colour
let redColour = ["#F55900"]
let greenColour = ["#ffde59"]
let blueColour = ["#4230fa"]
let colours = [redColour, greenColour, blueColour]

// barrier
let barriers = []

//bubble
let bubbles = []

// background texture
let texture
let backgroundColours = ["#094074", "#3c6997", "#5adbff", "#718e54", "#fe9000"];
let currentBgColour

function setup() {
  // responsive design 
  createCanvas(windowWidth, windowHeight)
  // Select a random colour from the backgroundColours array to be used as the current background colour.
  currentBgColour = random(backgroundColours);

  // The newly created particles are pushed into the particles array.
  // 20 particle, define the radius, position, colour
  for (var i = 0; i < 20; i++) {
    let particle = new Particle({
      r: 70,
      p: { x: random(50, width - 50), y: random(50, height - 50) },
      colours: colours
    });
    particles.push(particle);
  }

  // Create a new p5.Graphics object and load its pixel data. This Graphics object can be interpreted as a separate canvas.
  texture = createGraphics(width, height)
  texture.loadPixels()

  //This code sets a colour at each pixel position of the Graphics object. The brightness of the colour is determined by both the noise function and the random function. Finally, these colour settings are applied to the Graphics object using the updatePixels() function.
  for (var i = 0; i < width + 50; i++) {
    for (var o = 0; o < height + 50; o++) {
      texture.set(i, o, color(100, noise(i / 3, o / 3, i * o / 50) * random([0, 40, 80])))
    }
  }
  texture.updatePixels()

  //This loop creates 5 barrier, the positions of which are randomised within the canvas. The newly created obstacles are pushed into an array of barriers.
  for (var i = 0; i < 5; i++) {
    let newBarrier = createBarrier(random(width), random(height));
    barriers.push(newBarrier);
  }
}


function draw() {
  fill(currentBgColour)
  rect(0, 0, width, height)

  // The colour blending mode is set to multiply and the texture created earlier is drawn on the canvas.
  push()
  blendMode(MULTIPLY)
  image(texture, 0, 0)
  pop()

  // This loop will call the drawBarrier function for each barrier present in the barriers array.
  for (let barrier of barriers) {
    drawBarrier(barrier)
  }

  // This loop checks all barriers and removes them from the barriers array if their lifespan has reached or exceeded zero.
  for (let i = barriers.length - 1; i >= 0; i--) {
    let barrier = barriers[i];
    if (barrier.lifespan <= 0) {
      barriers.splice(i, 1);
    }
  }

  noStroke()
  //Collisions between particles are checked first, and then collisions between particles and barriers are checked. If a particle collides with an barrier, a new Bubble object is created at the point of collision and added to the bubbles array.
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

  // draw bubble
  for (let i = bubbles.length - 1; i >= 0; i--) {
    let bubble = bubbles[i];
    bubble.update();
    bubble.draw();
  }

  // create the word in order to change background colour
  fill(255);
  textSize(32);
  text("Background", 10, 40);
}

// The function generates a random velocity between -1 and 1, but to avoid generating velocities that are 0 and too small. If the velocity is greater than 0, the velocity is increased by 0.5 and if it is less than 0, the velocity is decreased by 0.5.
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


// When clicked in the top left corner of the canvas in the range (10, 10) to (200, 50), it will randomly change the current background colour. 
// Clicking in other areas will create new barriers. If the number of barriers reaches 10, the first one created is removed first to ensure that the number of barriers does not exceed 10
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

// responsive the windows size
function windowResized() {
  resizeCanvas(windowWidth, windowHeight)
}

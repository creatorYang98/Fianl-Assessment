// Use object-oriented programming, using Class to encapsulate the data and values of the particle.
class Particle {
  // The constructor takes one argument, args, which is an object containing the various initial properties of the particle.
  constructor(args) {
    // initial radius
    this.r = args.r;
    // initial position
    this.p = args.p;
    //initial velocity
    this.v = { x: randomSpeed(), y: randomSpeed() };
    // random colours from orange, yellow, blue.
    this.colourGroup = random(args.colours);
    // the particle's first colour
    this.currentColour = random(this.colourGroup);
    // all particle's face mode are sad
    this.mode = 'sad';
    // initial mode time
    this.happyTime = 0;
    this.angerTime = 0;
    this.colours = args.colours;
    this.collidedBarriers = [];
  }

  draw() {
    // draw ellipse(face)
    push()
    translate(this.p.x, this.p.y)
    fill(this.currentColour)
    noStroke()
    ellipse(0, 0, this.r)
    // happy face
    if (this.mode == 'happy') {
      fill(255)
      ellipse(-16, -9, this.r / 2.5, this.r / 2.5)
      fill(0)
      ellipse(-16, -9, this.r / 4, this.r / 4)
      fill(255)
      ellipse(16, -9, this.r / 2.5, this.r / 2.5)
      fill(0)
      ellipse(16, -9, this.r / 4, this.r / 4)
      noStroke(0)
      fill(255);
      strokeWeight(2)
      arc(0, 13, 25, 25, 0, PI)
    }
    // sad face
    if (this.mode == 'sad') {
      push();
      // using push() and pop() to save and restoring the current value, and not influence another values
      push()
      rotate(0.09);
      fill(0);
      rect(-28, -18, this.r / 3, this.r / 15);
      pop()
      push();
      rotate(-0.09);
      fill(0);
      rect(5, -18, this.r / 3, this.r / 15);
      pop();

      fill(255);
      arc(-16, -10, this.r / 2.5, this.r / 2.5, 0, PI);
      fill(0);
      arc(-16, -10, this.r / 3.5, this.r / 3.5, 0, PI);
      fill(255);
      arc(16, -10, this.r / 2.5, this.r / 2.5, 0, PI);
      fill(0);
      arc(16, -10, this.r / 3.5, this.r / 3.5, 0, PI);
      noStroke();
      fill(255);
      strokeWeight(2);
      arc(0, 23, 25, 20, PI, TWO_PI);
      pop();
    }
    // anger face
    if (this.mode == 'anger') {
      push()
      push();
      rotate(0.3);
      fill(0);
      rect(-30, -16, this.r / 3, this.r / 15);
      pop();

      push();
      rotate(-0.3);
      fill(0);
      rect(7, -16, this.r / 3, this.r / 15);
      pop();

      fill(255);
      arc(-16, -10, this.r / 2.5, this.r / 2.5, 0, PI);
      fill(0);
      arc(-16, -10, this.r / 3.5, this.r / 3.5, 0, PI);
      fill(255);
      arc(16, -10, this.r / 2.5, this.r / 2.5, 0, PI);
      fill(0);
      arc(16, -10, this.r / 3.5, this.r / 3.5, 0, PI);
      stroke(0);
      fill(255);
      strokeWeight(2);
      ellipse(0, 20, 25, 16);
      pop();
    }

    pop()
  }

  update() {
    // Each time the speed increases.
    this.p.x += this.v.x
    this.p.y += this.v.y
    // It is to detect whether the particle has touched the boundary and to have it bounce back when it does.
    if ((this.p.x - this.r / 2 < 0 && this.v.x < 0) || (this.p.x + this.r / 2 > width && this.v.x > 0)) {
      this.v.x = -this.v.x;
    }
    // Reverses the direction of velocity of the particle.
    if ((this.p.y - this.r / 2 < 0 && this.v.y < 0) || (this.p.y + this.r / 2 > height && this.v.y > 0)) {
      this.v.y = -this.v.y;
    }

    // If the particle's mode is "happy" and 5000 milliseconds have passed since it changed to "happy", then change its mode to "sad"
    if (this.mode === 'happy' && millis() - this.happyTime >= 5000) {
      this.mode = 'sad';
    } 
    // If the particle's mode is "anger" and 2000 milliseconds have passed since it changed to "anger", then change its mode to "sad"
    else if (this.mode === 'anger' && millis() - this.angerTimestamp >= 2000) {
      this.mode = 'sad';
    }

    // For each barrier the particles collide with, subtract one from their life cycle
    for (let barrier of this.collidedBarriers) {
      barrier.lifespan--;
    }
    // Clear the list of obstacles collided by particles, if it reaches ten.
    this.collidedBarriers = [];
  }

  changeColour() {
    // change colour.
    let newColour = random(this.colours.flat());
    // If the newly selected colour is the same as the current colour, the selection continues.
    while (newColour === this.currentColour) {
      newColour = random(this.colours.flat());
    }
    // change colour
    this.currentColour = newColour;
  }


  // check particle's collision
  checkCollision(PreParticle) {
    // Calculate the distance between the two particles on the x and y axes.
    let dx = PreParticle.p.x - this.p.x;
    let dy = PreParticle.p.y - this.p.y;
    // The straight line distance between two particles.
    let distance = sqrt(dx * dx + dy * dy);
    // Calculate the sum of the radius of the two particles.
    let radiusSum = this.r / 2 + PreParticle.r / 2

    // If the distance between two particles is less than the sum of their radius, then they have collided.
    if (distance < radiusSum) {
      //Temporarily store the velocity of the current particle (this)
      let tempV = { x: this.v.x, y: this.v.y };
      // Set the velocity of the current particle (this) to the velocity of another particle (PreParticle)
      this.v = { x: PreParticle.v.x, y: PreParticle.v.y };
      // Set the velocity of the other particle (PreParticle) to the original velocity of the current particle (i.e. tempV)
      PreParticle.v = { x: tempV.x, y: tempV.y };

      // The angle of collision is calculated. The position of the two particles is then adjusted so that they do not overlap and to avoid the particles falling into a state where they cannot move into each other.
      let collisionAngle = atan2(dy, dx);
      this.p.x -= cos(collisionAngle) * (radiusSum - distance) / 2;
      this.p.y -= sin(collisionAngle) * (radiusSum - distance) / 2;
      PreParticle.p.x += cos(collisionAngle) * (radiusSum - distance) / 2;
      PreParticle.p.y += sin(collisionAngle) * (radiusSum - distance) / 2;

      let sameColourGroup = false;

      // Check if the two particles belong to the same colour group.
      for (let colourGroup of this.colours) {
        if (colourGroup.includes(this.currentColour) && colourGroup.includes(PreParticle.currentColour)) {
          sameColourGroup = true;
          // break check
          break;
        }
      }
      // If they are not in the same colour group then they will show 'anger' mode, and also random their colour.
      if (!sameColourGroup) {
        this.mode = 'anger';
        this.angerTimestamp = millis();
        PreParticle.mode = 'anger';
        PreParticle.angerTimestamp = millis();
        this.changeColour();
        PreParticle.changeColour();
      } else {
        // If they are in the same colour group then they will show 'happy' mode
        this.mode = 'happy';
        this.happyTime = millis();
        PreParticle.mode = 'happy';
        PreParticle.happyTime = millis();
      }
    }
  }


  // check the collision between particle and barrier
  checkBarrierCollision(barrier) {
    // calculate the distance between the centre of the particle and the centre of the barrier in the x and y directions.
    let dx = barrier.position.x - this.p.x;
    let dy = barrier.position.y - this.p.y;

    // Calculate the straight line distance between the centre of the particle and the centre of the barrier.
    let distance = sqrt(dx * dx + dy * dy);

    // Sum of particle and obstacle radius
    let radiusSum = this.r / 2 + barrier.barrierRadius;

    // initial collision is false
    let collision = false;

    //If the distance is less than the sum of the radius, a collision between a particle and an obstacle has occurred.
    if (distance < radiusSum) {
      // if happen collision, change collision to the true.
      collision = true;

      // This is the angle between the line connecting the centre of the particle and the centre of the barrier and the horizontal direction
      let collisionAngle = atan2(dy, dx);

      // The velocity direction of the particle is reversed after the collision, with the same effect as a collision to a boundary.
      this.v.x = -this.v.x;
      this.v.y = -this.v.y;

      // Calculating the overlap distance between particles and obstacles, error protection
      let overlap = radiusSum - distance;

      // // Particle positions are adjusted accordingly to avoid further overlap
      this.p.x -= overlap * cos(collisionAngle);
      this.p.y -= overlap * sin(collisionAngle);

      // Add collision obstacles to the particle's list of collision barriers in preparation for generating a bubble.
      this.collidedBarriers.push(barrier);

      // Calculate the position of the collision point, which are the coordinates of the bubble.
      let collisionPoint = { x: this.p.x + this.r / 2 * cos(collisionAngle), y: this.p.y + this.r / 2 * sin(collisionAngle) };
      // Create bubbles at collision point locations
      this.createBubblesOnCollision(collisionPoint.x, collisionPoint.y);

      // return bubble's location
      return collisionPoint;
    }

    // if not collision, return null
    return null;
  }

  createBubblesOnCollision(x, y) {
    for (let i = 0; i < 5; i++) {
      bubbles.push(new Bubble(x, y));
    }
  }

}
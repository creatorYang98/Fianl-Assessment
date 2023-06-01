class Particle {
  constructor(args) {
    this.r = args.r;
    this.p = args.p;
    this.v = { x: randomSpeed(), y: randomSpeed() };
    this.colourGroup = random(args.colours);
    this.currentColour = random(this.colourGroup);
    this.mode = 'sad';
    this.happyTimestamp = 0;
    this.angerTime = 0;
    this.colours = args.colours;
    this.collidedBarriers = [];
  }

  draw() {
    push()
    translate(this.p.x, this.p.y)
    fill(this.currentColour)
    noStroke()
    ellipse(0, 0, this.r)
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
    if (this.mode == 'sad') {
      push();
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

    for (let barrier of this.collidedBarriers) {
      barrier.lifespan--;
    }
    this.collidedBarriers = [];
  }

  changeColour() {
    let newColour = random(this.colours.flat());
    while (newColour === this.currentColour) {
      newColour = random(this.colours.flat());
    }
    this.currentColour = newColour;
  }

  checkCollision(PreParticle) {
    let dx = PreParticle.p.x - this.p.x;
    let dy = PreParticle.p.y - this.p.y;
    let distance = sqrt(dx * dx + dy * dy);
    let radiusSum = this.r / 2 + PreParticle.r / 2

    if (distance < radiusSum) {
      let tempV = { x: this.v.x, y: this.v.y };
      this.v = { x: PreParticle.v.x, y: PreParticle.v.y };
      PreParticle.v = { x: tempV.x, y: tempV.y };

      let collisionAngle = atan2(dy, dx);
      this.p.x -= cos(collisionAngle) * (radiusSum - distance) / 2;
      this.p.y -= sin(collisionAngle) * (radiusSum - distance) / 2;
      PreParticle.p.x += cos(collisionAngle) * (radiusSum - distance) / 2;
      PreParticle.p.y += sin(collisionAngle) * (radiusSum - distance) / 2;

      let sameColourGroup = false;

      for (let colourGroup of this.colours) {
        if (colourGroup.includes(this.currentColour) && colourGroup.includes(PreParticle.currentColour)) {
          sameColourGroup = true;
          break;
        }
      }

      if (!sameColourGroup) {
        this.mode = 'anger';
        this.angerTimestamp = millis();
        PreParticle.mode = 'anger';
        PreParticle.angerTimestamp = millis();
        this.changeColour();
        PreParticle.changeColour();
      } else {
        this.mode = 'happy';
        this.happyTimestamp = millis();
        PreParticle.mode = 'happy';
        PreParticle.happyTimestamp = millis();
      }
    }
  }

  checkBarrierCollision(barrier) {
    let dx = barrier.position.x - this.p.x;
    let dy = barrier.position.y - this.p.y;
    let distance = sqrt(dx * dx + dy * dy);
    let radiusSum = this.r / 2 + barrier.barrierRadius;

    // collision flag
    let collision = false;

    if (distance < radiusSum) {
      collision = true;  // update the flag

      let collisionAngle = atan2(dy, dx);

      this.v.x = -this.v.x;
      this.v.y = -this.v.y;

      let overlap = radiusSum - distance;
      this.p.x -= overlap * cos(collisionAngle);
      this.p.y -= overlap * sin(collisionAngle);
      this.collidedBarriers.push(barrier);

      // calculate collision point
      let collisionPoint = { x: this.p.x + this.r / 2 * cos(collisionAngle), y: this.p.y + this.r / 2 * sin(collisionAngle) };
      this.createBubblesOnCollision(collisionPoint.x, collisionPoint.y);

      return collisionPoint;
    }

    return null;
  }



  createBubblesOnCollision(x, y) {
    for (let i = 0; i < 5; i++) {
      bubbles.push(new Bubble(x, y));
    }
  }

}
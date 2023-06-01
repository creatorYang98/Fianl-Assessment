function createBarrier(x, y) {
  let barr = {
    position: createVector(x, y), // initial position
    barrierRadius: 50,
    angle: 0,
    colour: '#eff2d7', 
    lifespan: 10, 
    collisionTime: 0 // initial collision time, the overall is 10
  };
  // return object
  return barr;
}

function drawBarrier(barrier) {
  var pos = barrier.position;
  var r = barrier.barrierRadius;
  var angle = barrier.angle;

  // save the status of current shape.
  push();
  translate(pos.x, pos.y);
  rotate(angle);
  fill(barrier.colour);
  stroke(0, 30);
  // use beginShape to create irregular shapes
  beginShape();
  let spanCount = 100;
  // Calculate the position of each vertex according to specific rules and add it to the polygon using the vertex function
  // Depending on the parity of o, it is decided whether the radius is r or r / 1.5 and the angle is o / spanCount * PI * 2. The aim of this is to create a star-shaped polygon.
  for (var o = 0; o < spanCount; o++) {
    let useR = (o % 4 < 2 ? r : r / 1.5);
    let useAng = o / spanCount * PI * 2;
    vertex(useR * cos(useAng), useR * sin(useAng));
  }
  endShape(CLOSE);
  // save the shape
  pop();
}

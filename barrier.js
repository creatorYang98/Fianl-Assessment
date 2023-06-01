function createBarrier(x, y) {
  let barr = {
    position: createVector(x, y),
    barrierRadius: 50,
    angle: 0,
    colour: '#eff2d7', 
    lifespan: 10,
    collisionTime: 0 
  };
  return barr;
}


function drawBarrier(barrier) {
  var pos = barrier.position;
  var r = barrier.barrierRadius;
  var angle = barrier.angle;

  push();
  translate(pos.x, pos.y);
  rotate(angle);
  fill(barrier.colour);
  stroke(0, 30);
  beginShape();
  let spanCount = 100;
  for (var o = 0; o < spanCount; o++) {
    let useR = (o % 4 < 2 ? r : r / 1.5);
    let useAng = o / spanCount * PI * 2;
    vertex(useR * cos(useAng), useR * sin(useAng));
  }
  endShape(CLOSE);
  pop();
}

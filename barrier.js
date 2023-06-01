function makeCircle(x, y) {
  let cir = {
    position: createVector(x, y),
    circleRadius: 50,
    angle: 0,
    color: 'blue', 
    spots: [],
    lifespan: 3,
    collisionTime: 0 
  };
  for (var i = 0; i < 10; i++) {
    cir.spots.push({
      x: random(-0.8, 0.8),
      y: random(-0.8, 0.8),
      r: random(0, 0.5)
    });
  }
  return cir;
}

function drawCircle(circle) {
  var pos = circle.position;
  var r = circle.circleRadius;
  var angle = circle.angle;

  push();
  translate(pos.x, pos.y);
  rotate(angle);
  fill(circle.color);
  stroke(0, 30);
  beginShape();
  let spanCount = int(r * 2 / 20) * 20;
  for (var o = 0; o < spanCount; o++) {
    let useR = (o % 4 < 2 ? r : r / 1.5);
    let useAng = o / spanCount * PI * 2;
    vertex(useR * cos(useAng), useR * sin(useAng));
  }
  endShape(CLOSE);
  pop();
}

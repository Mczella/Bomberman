const directions = new Set()
const player1 = {
  x: cellSize,
  y: cellSize,
  isMoving: false,
  isAlive: true,
  strongExplosion: false,
  moreBombs: 1,
  lives: 3,
  detonateOnClick: false,
  walkThroughBombs: false,
  onBomb: true
};


function alignPlayer() {
  if (directions.size === 2) {
     // FIX only snap if the bigger part of the player is in the next cell
      player1.x = positionToCellIdxAlign(player1).x
      player1.y = positionToCellIdxAlign(player1).y

    directions.clear()
  }
}

function movePlayer() {
  let isMoving = false;
  const speed = Math.floor(deltaTime * 0.2);
  const playerRealPosition = positionToCellIdxAlign(player1) // aligns position with cells
  alignPlayer()

  let deltaX = 0;
  let deltaY = 0;

  if (keyIsDown(RIGHT_ARROW)) {
    deltaX = 1;
    isMoving = true;
    directions.add("leftRight")
  } else if (keyIsDown(LEFT_ARROW)) {
    deltaX = -1;
    isMoving = true;
    directions.add("leftRight")
  }

  if (keyIsDown(UP_ARROW)) {
    deltaY = -1;
    isMoving = true;
    directions.add("upDown")
  } else if (keyIsDown(DOWN_ARROW)) {
    deltaY = 1;
    isMoving = true;
    directions.add("upDown")
  }

  if (keyIsDown(32)) {
    if (bombs.length < player1.moreBombs
        // no bombs on portals
      && grid[Math.round(player1.y / cellSize)][Math.round(player1.x / cellSize)] !== 12) {
      placeBomb(playerRealPosition.x, playerRealPosition.y)
      player1.onBomb = true
    }
  }

  const margin = 8;
  const destinationLeftTop = positionToCellIdx({
    x: player1.x + deltaX * speed + margin,
    y: player1.y + deltaY * speed + margin,
  });
  const destinationRightTop = positionToCellIdx({
    x: player1.x + cellSize - 1 + deltaX * speed - margin,
    y: player1.y + deltaY * speed + margin,
  });
  const destinationRightBottom = positionToCellIdx({
    x: player1.x + cellSize - 1 + deltaX * speed - margin,
    y: player1.y + cellSize - 1 + deltaY * speed - margin,
  });
  const destinationLeftBottom = positionToCellIdx({
    x: player1.x + deltaX * speed + margin,
    y: player1.y + cellSize - 1 + deltaY * speed - margin,
  });

  const allDestinations = [destinationLeftTop, destinationRightTop, destinationRightBottom, destinationLeftBottom]

  const checkAllDest = allDestinations.every(function (getNextDest){
    return (bombs.length > 0 && isCollidingWithBomb(getNextDest) === false)
  })

  if (checkAllDest) {
    player1.onBomb = false
  }

  isCollidingWithEnemy()

  for (const getNextDest of allDestinations) { // check for collisions
    if (isCollidingWithObstacle(getNextDest)) {
      return
    }
    if (!player1.walkThroughBombs) {// triggers collision with bomb
      if (isCollidingWithBomb(getNextDest) && player1.onBomb === false) {
        return
      }
    }
    takePrize(getNextDest) // collision with prize
  }

  player1.isMoving = isMoving
  player1.x += deltaX * speed
  player1.y += deltaY * speed
}

function drawPlayer() {
  let damping = 0;
  if (player1.isMoving && player1.isAlive) {
    damping = Math.abs(Math.sin(millis() / 50)) * 3; // 0 - 3
  }
  textSize(cellSize)
  textAlign(LEFT, BASELINE)

  if (player1.isAlive) {
    text("🤖", player1.x, player1.y + damping + offsetY);
  } else {
    text("💀", player1.x, player1.y + damping + offsetY);
  }
}

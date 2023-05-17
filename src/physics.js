function isCollidingWithObstacle(destination) {
  const xi = destination.xi;
  const yi = destination.yi;
  if (yi < 0 || xi < 0 || yi >= grid.length || xi >= grid[0].length) {
    return true;
  }
  const content = grid[yi][xi];
  if (content === 4 || content === 0 || content === 7 || content === 8
      || content === 10 || content === 12 || content === 14 || content === 16) {
    return false;
  }
  return true;
}

function isCollidingWithBomb(destination) {
  const xi = destination.xi;
  const yi = destination.yi;
  if (yi < 0 || xi < 0 || yi >= grid.length || xi >= grid[0].length) {
    return true;
  }
  const content = grid[yi][xi];
  if (content === 4) {
    return true;
  }
  return false;
}

function takePrize(destination) {
  const xi = destination.xi;
  const yi = destination.yi;;
  const content = grid[yi][xi];
  if (content === 7) {
    grid[yi][xi] = 0
    player1.strongExplosion = true
  } else if (content === 8) {
    grid[yi][xi] = 0
    player1.moreBombs ++
    console.log(player1.moreBombs)
  } else if (content === 10) {
    grid[yi][xi] = 0
    player1.lives ++
  } else if (content === 12 && enemies.length === 0) {
    grid[yi][xi] = 0
    game.level++
  } else if (content === 14) {
    grid[yi][xi] = 0
    player1.walkThroughBombs = true
  } else if (content === 16) {
    grid[yi][xi] = 0
    player1.detonateOnClick = true
  }
}

function isCollidingWithEnemy() {
  for (const enemy of enemies) {
    // FIX for ghost
    const diffY = Math.abs(player1.y - enemy.y)
    const diffX = Math.abs(player1.x - enemy.x)
    const tolerance = 10
    if (diffY < tolerance && diffX < tolerance) {
      player1.isAlive = false
    }
  }
}

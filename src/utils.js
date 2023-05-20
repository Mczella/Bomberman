function positionToCellIdx(position) {
  const rowIdx = Math.floor(position.y / cellSize)
  const colIdx = Math.floor(position.x / cellSize)
  return { xi: colIdx, yi: rowIdx }
}

function positionToCellIdxAlign(position) {
  const rowx = (Math.round(position.y / cellSize))*cellSize
  const colx = (Math.round(position.x / cellSize))*cellSize
  return { x: colx, y: rowx }
}

function addPrizesToWalls() {
  const getRandomCell = () => {
    let randcol = Math.floor(Math.random() * rows)
    let randrow = Math.floor(Math.random() * cols)
    return { randcol, randrow }
  }

  const AddPrizeToCell = (prize) => {
    let { randcol, randrow } = getRandomCell()
    while (grid[randcol][randrow] !== 3) {
      ({ randcol, randrow } = getRandomCell())
    }
    grid[randcol][randrow] = prize
  }

  AddPrizeToCell(5)
  AddPrizeToCell(6)

  if (game.level !== 1) {
    AddPrizeToCell(9)
  }

  AddPrizeToCell(11)
  AddPrizeToCell(13)

  if (game.level !== 1) {
    AddPrizeToCell(15)
  }
}

function pause() {
  function keyPressed() {
    if (!game.pause && keyCode === 27) {
      game.pause = true
    } else if (game.pause && keyCode === 13) {
      game.pause = false
    }
  }
  keyPressed()
}

function makeGrid() {
  for (let iy = 0; iy < rows; iy++) {
    const row = [];
    for (let ix = 0; ix < cols; ix++) {
      if (iy === 0 // first row
          || iy === rows - 1 // last row
          || ix === 0 // first column
          || ix === cols - 1 // last column
          || ix % 2 === 0 && iy % 2 === 0 // every other row and column combined
      ) {
        row.push(2)
      } else if (ix === 1 && iy === 2
          || ix === 1 && iy === 1
          || ix === 1 && iy === 3
          || ix === 2 && iy === 1) {
        row.push(0)
      } else if (Math.random() > 0.7) {
        row.push(3);
      } else {
        row.push(0)
      }
    }
    grid.push(row);
  }
}
function setLevel() {
  grid = []
  enemies = []
  explosions = []
  bombs = []
  player1.x = cellSize
  player1.y = cellSize
  player1.isAlive = true
  game.pause = true
  if (game.level >= 1 && game.level <= 3) {
    makeGrid()
    addPrizesToWalls()
    addEnemies()
  }
}

function addEnemies() {
  if (game.level === 1) {
    enemies.push(makeEnemy(placeEnemies().x * cellSize, placeEnemies().y * cellSize, "monster"))
    enemies.push(makeEnemy(placeEnemies().x * cellSize, placeEnemies().y * cellSize, "ghost"))
    enemies.push(makeEnemy(placeEnemies().x * cellSize, placeEnemies().y * cellSize, "stupid"))
  } else if (game.level === 2) {
    enemies.push(makeEnemy(placeEnemies().x * cellSize, placeEnemies().y * cellSize, "monster"))
    enemies.push(makeEnemy(placeEnemies().x * cellSize, placeEnemies().y * cellSize, "ghost"))
    enemies.push(makeEnemy(placeEnemies().x * cellSize, placeEnemies().y * cellSize, "ghost"))
    enemies.push(makeEnemy(placeEnemies().x * cellSize, placeEnemies().y * cellSize, "stupid"))
  } else if (game.level === 3) {
    enemies.push(makeEnemy(placeEnemies().x * cellSize, placeEnemies().y * cellSize, "monster"))
    enemies.push(makeEnemy(placeEnemies().x * cellSize, placeEnemies().y * cellSize, "ghost"))
    enemies.push(makeEnemy(placeEnemies().x * cellSize, placeEnemies().y * cellSize, "ghost"))
    enemies.push(makeEnemy(placeEnemies().x * cellSize, placeEnemies().y * cellSize, "stupid"))
    enemies.push(makeEnemy(placeEnemies().x * cellSize, placeEnemies().y * cellSize, "monster"))
  }
}
  function takeLife() {
    if (!player1.isAlive && player1.lives === 0) {
      enemies = []
      function keyPressed() {
        if (keyCode === 13) {
          game.level = 1
          player1.moreBombs = 1
          player1.detonateOnClick = false
          player1.strongExplosion = false
          player1.lives = 3
          player1.walkThroughBombs = false
          setLevel()
        }
      }

      keyPressed()
      fill(255,255,255, 180)
      rect(0, 0, width, height)
      textSize(50)
      fill(0, 0, 0)
      textAlign(CENTER, CENTER)
      text("GAME OVER", width/2, height / 2)
      textSize(25)
      text("press enter to try again", width / 2, height / 2 + cellSize)

    } else if (!player1.isAlive) {
      player1.strongExplosion = false
      player1.detonateOnClick = false
      player1.lives--
      setLevel()
    } else if (game.level === 4) { // FIX disappearing text
      fill(255,255,255, 180)
      rect(0, 0, width, height)
      textSize(50)
      fill(0, 0, 0)
      textAlign(CENTER, CENTER)
      text("YOU WON", width/2, height / 2)
    }
  }

function placeEnemies() {
  let randCol = 0
  let randRow = 0
  let isValidPosition = false
  while (!isValidPosition) {
    randCol = Math.floor(Math.random() * rows)
    randRow = Math.floor(Math.random() * cols)
    isValidPosition = grid[randCol][randRow] === 0 // FIX not working
    && randRow !== 2 && randCol !== 1
    && randRow !== 1 && randCol !== 3
    && randRow !== 2 && randCol !== 1
    && randRow !== 1 && randCol !== 1
  } return {x: randRow, y: randCol}
}

function changeLevel() {
  if (game.level !== game.nowPlaying && game.level !== 4) {
    game.nowPlaying = game.level
    setLevel()
  }
}

function menu() {
  function keyPressed() {
    if (game.menu && keyCode === 13) {
      game.menu = false
    }
  }

  if (game.menu) {
    keyPressed()
    fill(255, 255, 255, 180)
    rect(0, 0, width, height)
    textSize(50)
    fill(0, 0, 0)
    textAlign(CENTER, CENTER)
    text("BOMBERMAN", width / 2, height / 2)
    textSize(25)
    text("press enter to start", width / 2, height / 2 + cellSize)
    textSize(15)
    text("👹 Stupid but fast and unpredictable", width / 2, height / 2 + 2 * cellSize)
    text("👾 Smart and persistent", width / 2, height / 2 + 2 * cellSize + 20)
    text("👻 Smart and slow, but you never see him coming", width / 2, height / 2 + 2 * cellSize + 40)
  }
}

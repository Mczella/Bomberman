const cellSize = 50;
const offsetY = Math.floor(cellSize * 0.875);
const rows = 2*Math.floor((window.innerHeight / cellSize)/2)-1;
const cols = 2*Math.floor((window.innerWidth / cellSize)/2)-1;
let grid = [];
let enemies = []
const game = {
  level: 1,
  nowPlaying: 1,
  pause: true,
  menu: true
}

let explosionSound;

function setup() {
  frameRate(30);
  createCanvas(cols * cellSize, rows * cellSize);

  setLevel()
  explosionSound = loadSound("sound/explosion.mp3");
}

function draw() {
  background(115, 153, 95);
  textSize(cellSize);

  for (let iy = 0; iy < rows; iy++) {
    for (let ix = 0; ix < cols; ix++) {
      if (grid[iy][ix] === 2) {
        text("🌫", ix * cellSize, iy * cellSize + offsetY)
      } else if (grid[iy][ix] === 3) {
        text("⬛️", ix * cellSize, iy * cellSize + offsetY)
      } else if (grid[iy][ix] === 5) {
        text("⬛️", ix * cellSize, iy * cellSize + offsetY)
      } else if (grid[iy][ix] === 6) {
        text("⬛️", ix * cellSize, iy * cellSize + offsetY)
      } else if (grid[iy][ix] === 7) {
        text("🔥️", ix * cellSize, iy * cellSize + offsetY) // bigger explosions
      } else if (grid[iy][ix] === 8) {
        text("️🟩", ix * cellSize, iy * cellSize + offsetY) // more bombs
        text("️💣️", ix * cellSize, iy * cellSize + offsetY) // more bombs
      } else if (grid[iy][ix] === 9) {
        text("⬛️", ix * cellSize, iy * cellSize + offsetY)
      } else if (grid[iy][ix] === 10) {
        text("️💗️", ix * cellSize, iy * cellSize + offsetY) // extra life
      } else if (grid[iy][ix] === 11) {
        text("⬛️", ix * cellSize, iy * cellSize + offsetY)
      } else if (grid[iy][ix] === 12) {
        text("⚪️️", ix * cellSize, iy * cellSize + offsetY) // next level portal
      } else if (grid[iy][ix] === 13) {
        text("⬛️", ix * cellSize, iy * cellSize + offsetY)
      } else if (grid[iy][ix] === 14) {
        text("👣️", ix * cellSize, iy * cellSize + offsetY) // walk through bombs
      } else if (grid[iy][ix] === 15) {
        text("⬛️", ix * cellSize, iy * cellSize + offsetY)
      } else if (grid[iy][ix] === 16) {
        text("⏱", ix * cellSize, iy * cellSize + offsetY) // detonate bombs with Ctrl
      }
    }
  }

  textSize(15)
  strokeWeight(4)
  stroke(color(255, 255, 255))
  fill(0)
  textAlign(LEFT)

  const lives = player1.lives; // Replace with the actual variable storing the number of lives
  const level = game.nowPlaying; // Replace with the variable storing the current level
  const numberOfBombs = player1.moreBombs;
  const bigExplosion = player1.strongExplosion
  const detonator = player1.detonateOnClick
  const walkThroughBombs = player1.walkThroughBombs
  const strg = "Press Enter to start, Esc to pause. If you pick up ⏱, press Ctrl to detonate bombs."// Replace with the variable storing the number of powerups

  const infoText = `Level: ${level}   Lives💗️: ${lives}   💣: ${numberOfBombs}   🔥️: ${bigExplosion}   ⏱ ${detonator}   👣️: ${walkThroughBombs}
${strg}`;

  text(infoText, 10, 20);

  menu() // FIX shifted grid

  if (!game.menu) {
    pause()
    takeLife()
    changeLevel()

    drawBombs()

    if (game.pause === false) {
      detonateBombs()
      if (player1.isAlive === true) {
        movePlayer();
        if (enemies.length > 0) {
          for (const enemy of enemies) {
            moveEnemy(enemy, player1, grid, enemy.type)
          }
        }
      }
    }

    drawPlayer();
    drawEnemies()
  }
}

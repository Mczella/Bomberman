const cellSize = 50
const offsetY = Math.floor(cellSize * 0.875)
const rows = 2 * Math.floor((window.innerHeight / cellSize) / 2) - 1
const cols = 2 * Math.floor((window.innerWidth / cellSize) / 2) - 1
let grid = []
let enemies = []
const game = {
    level: 1,
    nowPlaying: 1,
    pause: true,
    menu: true,
}

let explosionSound

function setup() {
    frameRate(30)
    createCanvas(cols * cellSize, rows * cellSize)

    setLevel()
    explosionSound = loadSound("sound/explosion.mp3")
}

function draw() {
    background(115, 153, 95)
    textSize(cellSize)
    textAlign(LEFT, BASELINE)

    for (let iy = 0; iy < rows; iy++) {
        for (let ix = 0; ix < cols; ix++) {
            const emoji =
                grid[iy][ix] === 2 ? "🌫"
                    : grid[iy][ix] === 3
                    || grid[iy][ix] === 5
                    || grid[iy][ix] === 6
                    || grid[iy][ix] === 9
                    || grid[iy][ix] === 11
                    || grid[iy][ix] === 13
                    || grid[iy][ix] === 15 ? "⬛️"
                        : grid[iy][ix] === 7 ? "🔥️"
                            : grid[iy][ix] === 8 ? "️🟩\n️💣️"
                                : grid[iy][ix] === 10 ? "️💗️"
                                    : grid[iy][ix] === 12 ? "⚪️️"
                                        : grid[iy][ix] === 14 ? "👣️"
                                            : grid[iy][ix] === 16 ? "⏱"
                                                : ""

            text(emoji, ix * cellSize, iy * cellSize + offsetY)
        }
    }


    textSize(15)
    strokeWeight(4)
    stroke(color(255, 255, 255))
    fill(0)
    textAlign(LEFT)

    const lives = player1.lives
    const level = game.nowPlaying
    const numberOfBombs = player1.moreBombs
    const bigExplosion = player1.strongExplosion
    const detonator = player1.detonateOnClick
    const walkThroughBombs = player1.walkThroughBombs
    const strg = "Press Enter to start, Esc to pause. If you pick up ⏱, press Ctrl to detonate bombs."

    const infoText = `Level: ${level}   Lives💗️: ${lives}   💣: ${numberOfBombs}   🔥️: ${bigExplosion}   ⏱ ${detonator}   👣️: ${walkThroughBombs}
${strg}`

    text(infoText, 10, 20)

    menu()

    if (!game.menu) {
        pause()
        takeLife()
        changeLevel()

        drawBombs()

        if (!game.pause) {
            detonateBombs()
            if (player1.isAlive || game.level === 4) {
                movePlayer();
                if (enemies.length > 0) {
                    for (const enemy of enemies) {
                        moveEnemy(enemy, player1, grid, enemy.type)
                    }
                }
            }
        }

        drawPlayer()
        drawEnemies()
    }
}

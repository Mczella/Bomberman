let bombs = [];
let explosions = [];

function placeBomb(x, y) {
    const bomb = { x, y, placedAt: millis() }
    bombs.push(bomb)
    const bombGrid = positionToCellIdx(bomb)
    grid[bombGrid.yi][bombGrid.xi] = 4

    // delete bombs with duplicate x and y
    const uniqueBombs = []
    bombs.forEach(obj => {
        const { x, y } = obj
        const isDuplicate = uniqueBombs.some(uniqueObj => uniqueObj.x === x && uniqueObj.y === y)
        if (!isDuplicate) {
            uniqueBombs.push(obj)
        }
    })

    bombs = uniqueBombs
}

function drawBombs() {
    for (const bomb of bombs) {
        textSize(cellSize)
        text("💣", bomb.x, bomb.y + offsetY)
    }
    drawExplosions()
    cleanupExplosions()
}

const getRight = ({xi, yi}) => ({xi: xi + 1, yi})
const getLeft = ({xi, yi}) => ({xi: xi - 1, yi})
const getDown = ({xi, yi}) => ({xi, yi: yi - 1})
const getUp = ({xi, yi}) => ({xi, yi: yi + 1})

const allDirectionsGetNext = [getRight, getLeft, getUp, getDown]

const detonateDirection = (initialExplosion, getNext, maxLength, bomb) => {
    const allBombs = bombs
    let currentExplosion = initialExplosion
    for (let currentLength = 0; currentLength <= maxLength; currentLength++) {
        if (isOutOfGrid(currentExplosion) || isUnbreakable(currentExplosion)) {
            return
        }

        if (isOtherBomb(currentExplosion)) {
          const nextBomb = allBombs.find((otherBomb) => {
            return otherBomb.x === currentExplosion.xi * cellSize
                && otherBomb.y === currentExplosion.yi * cellSize
          })
          if (nextBomb != null) {
            console.log(nextBomb.placedAt, bomb.placedAt)
            nextBomb.placedAt = bomb.placedAt
          }
        }
        addExplosion(currentExplosion.xi * cellSize, currentExplosion.yi * cellSize)

        if (isBreakable(currentExplosion)) {
            return
        }

        currentExplosion = getNext(currentExplosion)
    }
}

const detonateAllDirections = (initialExplosion, bomb) => {
    for (const getNext of allDirectionsGetNext) {
        detonateDirection(initialExplosion, getNext, maxLength(), bomb)
    }
}

const maxLength = () => {
    if (player1.strongExplosion === false) {
        return 1
    } else {
        return 2
    }
}
const isOtherBomb = (cell) => {
    return grid[cell.yi][cell.xi] === 4
}
const isUnbreakable = (cell) => {
    return grid[cell.yi][cell.xi] === 2
}

const isBreakable = (cell) => {
    return grid[cell.yi][cell.xi] === 3
}

const isOutOfGrid = (cell) => {
    return cell.xi < 0 || cell.yi < 0 || cell.xi > cols || cell.yi > rows
}

function detonateBombs() {
    const allBombs = bombs;
    const newBombs = [];
    for (const bomb of allBombs) {
        if (player1.detonateOnClick === true) {
            if (keyIsDown(17)) {
                explosionSound.play();
                const bombGrid = positionToCellIdx(bomb)
                detonateAllDirections(bombGrid, bomb)
            } else {
                newBombs.push(bomb);
            }
        } else if (bomb.placedAt < millis() - 3000) {
            explosionSound.play();
            const bombGrid = positionToCellIdx(bomb)
            detonateAllDirections(bombGrid, bomb)
        } else {
            newBombs.push(bomb);
        }
    }
    bombs = newBombs;
}

function addExplosion(x, y) {
    const explosion = {
        x,
        y,
        placedAt: millis(),
        special: false // changes to true if it breaks a wall
    };
    explosions.push(explosion)
}

function drawExplosions() {
    for (const explosion of explosions) {
        textSize(cellSize)
        text("💥", explosion.x, explosion.y + offsetY)
    }
}

function cleanupExplosions() {
    const newExplosions = [];
    for (const ex of explosions) {
        const boom = positionToCellIdx(ex)
        if (ex.placedAt >= millis() - 1000) {
            newExplosions.push(ex);
        }
        if (boom.yi >= 0 && boom.xi >= 0) { //isn't out of grid
            if (grid[boom.yi][boom.xi] === 3 || grid[boom.yi][boom.xi] === 4) {
                grid[boom.yi][boom.xi] = 0
            } else if (grid[boom.yi][boom.xi] === 5) {
                ex.special = true
                grid[boom.yi][boom.xi] = 7
            } else if (grid[boom.yi][boom.xi] === 6) {
                ex.special = true
                grid[boom.yi][boom.xi] = 8
            } else if (ex.special === false && grid[boom.yi][boom.xi] === 7) {
                grid[boom.yi][boom.xi] = 0
            } else if (ex.special === false && grid[boom.yi][boom.xi] === 8) {
                grid[boom.yi][boom.xi] = 0
            } else if (grid[boom.yi][boom.xi] === 9) {
                ex.special = true
                grid[boom.yi][boom.xi] = 10
            } else if (ex.special === false && grid[boom.yi][boom.xi] === 10) {
                grid[boom.yi][boom.xi] = 0
            } else if (grid[boom.yi][boom.xi] === 11) {
                ex.special = true
                grid[boom.yi][boom.xi] = 12
            } else if (ex.special === false && grid[boom.yi][boom.xi] === 12) {
                enemies.push(makeEnemy(boom.xi*cellSize, boom.yi*cellSize, "stupid"))
            } else if (grid[boom.yi][boom.xi] === 13) {
                ex.special = true
                grid[boom.yi][boom.xi] = 14
            } else if (ex.special === false && grid[boom.yi][boom.xi] === 14) {
                grid[boom.yi][boom.xi] = 0
            } else if (grid[boom.yi][boom.xi] === 15) {
                ex.special = true
                grid[boom.yi][boom.xi] = 16
            } else if (ex.special === false && grid[boom.yi][boom.xi] === 16) {
                grid[boom.yi][boom.xi] = 0
            }
            const liveEnemies = []
            for (const enemy of enemies) {
                if (boom.yi === enemy.y/cellSize && boom.xi === enemy.x/cellSize) {
                    enemy.isAlive = false
                }
                if (enemy.isAlive) {
                    liveEnemies.push(enemy)
                }
            }
            enemies = liveEnemies

            const playerGrid = positionToCellIdx(player1)
            if (boom.yi === playerGrid.yi && boom.xi === playerGrid.xi) {
                player1.isAlive = false
            }
        }
        explosions = newExplosions;
    }


}
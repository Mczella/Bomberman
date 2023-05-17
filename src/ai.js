function makeEnemy(x, y, type) {
    return {
        x,
        y,
        lastMove: millis(),
        isAlive: true,
        nextPosition: null,
        type: type
    }
}

function drawEnemies() {
    for (const enemy of enemies) {
        textSize(cellSize);

        if (enemy.isAlive && enemy.type === "monster") {
            text("👾", enemy.x, enemy.y + offsetY);
        } else if (enemy.isAlive && enemy.type === "ghost") {
            text("👻", enemy.x, enemy.y + offsetY);
        } else if (enemy.isAlive && enemy.type === "stupid") {
            text("👹", enemy.x, enemy.y + offsetY);
    }
    }
}

function moveEnemy(enemy, player, grid) {
    if (enemy.nextPosition == null || (
        enemy.nextPosition.x === enemy.x && enemy.nextPosition.y === enemy.y
    )) {
        const src = {xi: enemy.x / cellSize, yi: enemy.y / cellSize};
        const dest = {xi: Math.round(player.x / cellSize), yi: Math.round(player.y / cellSize)};
        const path = findPath(src, dest, grid, enemy.type)
        const moves = [[-1, 0], [1, 0], [0, -1], [0, 1]]
        if (enemy.type === "stupid") {
            if (moves.every(move => grid[src.yi + move[0]][src.xi + move[1]] !== 0)) {
                    return
            } else {
                findStupidPath(enemy)
            }
        } else {
            if (path === false || path.length === 0) {
                if (moves.every(move => grid[src.yi + move[0]][src.xi + move[1]] !== 0)) {
                    return
                } else {
                    findStupidPath(enemy)
                }
            } else {
                const [yi, xi] = path[0]
                enemy.nextPosition = {x: xi * cellSize, y: yi * cellSize}
            }
        }
    }
    const speed = enemySpeed(enemy.type)
    stepEnemy(enemy, speed)
}


function enemySpeed(type) {
    if (type === "monster") {
        return 2
    } else if (type === "ghost") {
        return 1
    } else if (type === "stupid") {
        return 5
    }
}
function stepEnemy(enemy, speed) {
    if (enemy.x > enemy.nextPosition.x) {
        enemy.x -= speed
    } else if (enemy.x < enemy.nextPosition.x) {
        enemy.x += speed
    }

    if (enemy.y > enemy.nextPosition.y) {
        enemy.y -= speed
    } else if (enemy.y < enemy.nextPosition.y) {
        enemy.y += speed
    }
}


/**
 * Finds the shortest path between two points in a grid using Breadth-First Search.
 * The grid cells must be marked with 0 for walkable cells and non-zero for non-walkable cells.
 *
 * @param {Object} src - The starting position with properties {xi: number, yi: number}.
 * @param {Object} dest - The destination position with properties {xi: number, yi: number}.
 * @param {Array<Array<number>>} grid - The 2D grid of cells, where 0 represents walkable cells and non-zero values represent non-walkable cells.
 * @param {Object} enemy - Type of enemy.
 * @returns {Array<Array<number>>|false} An array of path coordinates [y, x] if a path is found, or false if no path exists.
 */
function findPath(src, dest, grid, type) {
    const visited = {};
    const queue = [[src.yi, src.xi, []]];
    while (queue.length) {
        const [y, x, path] = queue.shift();
        if (x === dest.xi && y === dest.yi) {
            return path;
        }
        // FIX if no path, wait until explosion subsides
        if (type === "monster" || type === "stupid") {
            if (
                y < 0 ||
                y >= grid.length ||
                x < 0 ||
                x >= grid[0].length ||
                grid[y][x] !== 0 ||
                `${x},${y}` in visited
            ) {
                continue
            }
        } else if (type === "ghost") {
            if (
                y < 0 ||
                y >= grid.length ||
                x < 0 ||
                x >= grid[0].length ||
                grid[y][x] !== 0 &&
                grid[y][x] !== 3 ||
                `${x},${y}` in visited
            ) {
                continue
            }
        }

        visited[`${x},${y}`] = true;
        for (const [dx, dy] of [[-1, 0], [1, 0], [0, -1], [0, 1]]) {
            queue.push([y + dy, x + dx, [...path, [y + dy, x + dx]]]);
        }
    }
    return false;
}

function findStupidPath(enemy) {
    const src = {xi: enemy.x / cellSize, yi: enemy.y / cellSize}
    const moves = [[-1, 0], [1, 0], [0, -1], [0, 1]]
    while (true) {
        //FIX infinite loop is there is nowhere to go
        const randomIndex = Math.floor(Math.random() * moves.length)
        const [nextPosX, nextPosY] = moves[randomIndex]
        if (grid[src.yi + nextPosY][src.xi + nextPosX] === 0) {
            enemy.nextPosition = {x: (src.xi + nextPosX) * cellSize, y: (src.yi + nextPosY) * cellSize}
            break
        }
    }
}


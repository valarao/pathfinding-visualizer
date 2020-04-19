const NUM_COLS = 100;
const NUM_ROWS = 50;

let grid;
let openSet, closedSet;
let start, end;
let cellWidth, cellHeight;

const createGrid = (cols, rows) => {
  const grid = new Array(cols);
  for (let i = 0; i < cols; i++) {
    grid[i] = new Array(rows);
  }

  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      grid[i][j] = new Cell(i, j);
    }
  }

  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      grid[i][j].addNeighbors(grid);
    }
  }

  return grid;
}

const removeCell = (arr, elt) => {
  for (let i = arr.length - 1; i >= 0; i--) {
    if (arr[i] == elt) {
      arr.splice(i, 1);
    }
  }
}

const heuristic = (a, b) => {
  return dist(a.x, a.y, b.x, b.y)
}

const checkCurrentCell = openSet => {
  let winner = 0;
  for (let i = 0; i < openSet.length; i++) {
    if (openSet[i].f < openSet[winner].f) {
      winner = i;
    }
  }

  const current = openSet[winner];    
  if (current === end) {
    console.log('You reached the end!');
    noLoop();
  }
  return current;
}

const lookForBetterPath = (neighbor, newPath, current, end) => {
  if (newPath) {
    neighbor.h = heuristic(neighbor, end);
    neighbor.f = neighbor.g + neighbor.h;
    neighbor.previous = current;
  }
}

const queueNeighbors = (current, neighbors) => {
  for (let i = 0; i < neighbors.length; i++) {
    const neighbor = neighbors[i];
    if (!closedSet.includes(neighbor) && !neighbor.wall) {
      const tempG = current.g + heuristic(neighbor, current);
      let newPath = false;
      if (openSet.includes(neighbor)) {
        if (tempG < neighbor.g) {
          neighbor.g = tempG;
          newPath = true;
        }
      } else {
        neighbor.g = tempG;
        newPath = true;
        openSet.push(neighbor);
      }

      lookForBetterPath(neighbor, newPath, current, end);
    }
  }
}

const createPath = current => {
  path = [];
  let temp = current;
  path.push(temp);
  while (temp.previous) {
    path.push(temp.previous);
    temp = temp.previous;
  }
  return path;
}

const drawWalls = grid => {
  for (let i = 0; i < NUM_COLS; i++) {
    for (let j = 0; j < NUM_ROWS; j++) {
      grid[i][j].show(color(255));
    }
  }
}

const drawVisitedCells = closedSet => {
  for (let i = 0; i < closedSet.length; i++) {
    closedSet[i].show(color(255, 0, 0, 50));
  }
}

const drawCandidateCells = openSet => {
  for (let i = 0; i < openSet.length; i++) {
    openSet[i].show(color(0, 255, 0, 50));
  }
}

const drawPath = path => {
  noFill();
  stroke(0, 102, 204);
  strokeWeight(cellWidth / 2);
  beginShape();
  for (let i = 0; i < path.length; i++) {
    vertex(
      path[i].x * cellWidth + cellWidth / 2,
      path[i].y * cellHeight + cellHeight / 2
    );
  }
  endShape();
}

setup = () => {
  createCanvas(800, 400);
  grid = createGrid(NUM_COLS, NUM_ROWS);
  openSet = [];
  closedSet = [];
  cellWidth = width / NUM_COLS;
  cellHeight = height / NUM_ROWS;

  // start = grid[NUM_COLS / 2][NUM_ROWS / 2];
  // end = grid[NUM_COLS - 1][NUM_ROWS - 1];
  start = grid[round((NUM_COLS - 1) * Math.random())][round((NUM_ROWS - 1) * Math.random())]
  end = grid[round((NUM_COLS - 1) * Math.random())][round((NUM_ROWS - 1) * Math.random())]
  start.wall = false;
  end.wall = false;
  openSet.push(start);
}

draw = () => {
  if (openSet.length == 0) {
    console.log('No Solution')
    noLoop();
    return;
  }

  const current = checkCurrentCell(openSet);
  removeCell(openSet, current);
  closedSet.push(current);
  queueNeighbors(current, current.neighbors);
  
  background(255);
  
  drawWalls(grid);
  drawVisitedCells(closedSet);
  drawCandidateCells(openSet);  
  const path = createPath(current);
  drawPath(path);
  start.show(color(0, 255, 255));
  end.show(color(0, 255, 0));
}
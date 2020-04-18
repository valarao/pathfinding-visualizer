class Cell {
  constructor(x, y) {
    this.x = x;
    this.y = y;

    this.f = 0;
    this.g = 0;
    this.h = 0;

    this.neighbors = [];
    this.previous;
    this.wall = random(1) < 0.2;

    this.show = col => {
      const cellColor = this.wall ? 0 : col;
      fill(cellColor);
      noStroke();
      rect(this.x * cellWidth, this.y * cellHeight, cellHeight - 1, cellHeight - 1);
    }

    this.addNeighbors = grid => {
      const x = this.x;
      const y = this.y;
      if (x < NUM_COLS - 1) {
        this.neighbors.push(grid[x + 1][y]);
      }

      if (x > 0) {
        this.neighbors.push(grid[x - 1][y]);
      }

      if (y < NUM_ROWS - 1) {
        this.neighbors.push(grid[x][y + 1]);
      }

      if (y > 0) {
        this.neighbors.push(grid[x][y - 1]);
      }
    }
  }
}
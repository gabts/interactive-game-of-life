const HEIGHT = 64;
const WIDTH = 64;
const SIZE = 10;

const canvas = document.getElementById("canvas") as HTMLCanvasElement;
canvas.height = HEIGHT * SIZE;
canvas.width = WIDTH * SIZE;
const ctx = canvas.getContext("2d")!;

let cells: boolean[][] = [];
let interval: undefined | number;
let timeout: undefined | number;

for (let y = 0; y < HEIGHT; y++) {
  cells[y] = [];
  for (let x = 0; x < WIDTH; x++) {
    cells[y].push(false);
  }
}

/**
 * Render current state of cells to canvas element.
 */
function render() {
  ctx.fillStyle = "#fff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#000";
  for (let y = 0; y < HEIGHT; y++) {
    for (let x = 0; x < WIDTH; x++) {
      if (cells[y][x]) {
        ctx.fillRect(x * SIZE + 1, y * SIZE + 1, SIZE - 1, SIZE - 1);
      }
    }
  }
}

/**
 * Calculates number of live neighbouring cells to x y position.
 */
function getLiveNeighbouringCellsAmount(
  cells: boolean[][],
  sourceY: number,
  sourceX: number
) {
  let amount = 0;
  for (let y = sourceY - 1; y <= sourceY + 1; y++) {
    if (y < 0 || y >= HEIGHT) continue;
    for (let x = sourceX - 1; x <= sourceX + 1; x++) {
      if (x < 0 || x >= WIDTH || (y === sourceY && x === sourceX)) continue;
      if (cells[y][x]) amount++;
    }
  }
  return amount;
}

/**
 * Updates cells state based on Conway's Game of Life rules.
 */
function gameOfLife() {
  const sourceCells = JSON.parse(JSON.stringify(cells));
  for (let y = 0; y < HEIGHT; y++) {
    for (let x = 0; x < WIDTH; x++) {
      const liveNeighbours = getLiveNeighbouringCellsAmount(sourceCells, y, x);
      // Any live cell with two or three live neighbours survives. Any dead cell
      // with three live neighbours becomes a live cell. All other live cells
      // die in the next generation. Similarly, all other dead cells stay dead.
      if (sourceCells[y][x] && liveNeighbours !== 2 && liveNeighbours !== 3) {
        cells[y][x] = false;
      } else if (!sourceCells[y][x] && liveNeighbours === 3) {
        cells[y][x] = true;
      }
    }
  }
  render();
}

/**
 * Start the game loop.
 */
function startGame() {
  gameOfLife();
  interval = setInterval(gameOfLife, 250);
}

/**
 * Handler when canvas element is clicked. Pauses the game for a few seconds and
 * updates cell state of clicked cell.
 */
function onMousedown(e: MouseEvent) {
  if (interval) clearInterval(interval);
  if (timeout) clearTimeout(timeout);
  const y = Math.floor(e.offsetY / SIZE);
  const x = Math.floor(e.offsetX / SIZE);
  cells[y][x] = !cells[y][x];
  render();
  timeout = setTimeout(startGame, 2000);
}

canvas.addEventListener("mousedown", onMousedown);

import "./utils/helpers.ts";

let input = await Deno.readTextFile("8.txt");
let exampleInput = `
30373
25512
65332
33549
35390`;

const cols = input
  .trim()
  .lines()
  .trim()
  .map((line) => line.split("").map((c) => parseInt(c)));

function isVisible(cols: number[][], x: number, y: number): boolean {
  if (x === 0 || y === 0 || y === cols.length - 1 || x === cols[y].length - 1)
    return true;

  const row = cols[y];
  const val = row[x];

  // left
  const left = row.slice(0, x);
  if (left.filter((v) => v < val).length === left.length) return true;

  const right = row.slice(x + 1);
  if (right.filter((v) => v < val).length === right.length) return true;

  const top = new Array(y).fill(0).map((_, i) => cols[i][x]);
  if (top.filter((v) => v < val).length === top.length) return true;

  const bottom = new Array(cols.length - y - 1)
    .fill(0)
    .map((_, i) => cols[i + y + 1][x]);
  if (bottom.filter((v) => v < val).length === bottom.length) return true;

  return false;
}

let visible = 0;
// let visibleMap = [...cols].map((row) => [...row]);
for (let y = 0; y < cols.length; y++) {
  const row = cols[y];
  for (let x = 0; x < row.length; x++) {
    if (isVisible(cols, x, y)) {
      visible++;
      // visibleMap[y][x] = 0;
    }
  }
}

console.log(visible);

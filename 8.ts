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

function getScenicScore(cols: number[][], x: number, y: number): number {
  if (x === 0 || y === 0 || y === cols.length - 1 || x === cols[y].length - 1)
    return 0;

  const row = cols[y];
  const val = row[x];
  let score = 1;

  const indexToScore = (arr: number[]) => {
    const index = arr.findIndex((v) => v >= val);
    return index === -1 ? arr.length : index + 1;
  };

  const left = [...row.slice(0, x)].reverse();
  score *= indexToScore(left);

  const right = row.slice(x + 1);
  score *= indexToScore(right);

  const top = [...new Array(y).fill(0).map((_, i) => cols[i][x])].reverse();
  score *= indexToScore(top);

  const bottom = new Array(cols.length - y - 1)
    .fill(0)
    .map((_, i) => cols[i + y + 1][x]);

  score *= indexToScore(bottom);
  return score;
}

const scores = [];
for (let y = 0; y < cols.length; y++) {
  const row = cols[y];
  for (let x = 0; x < row.length; x++) {
    const score = getScenicScore(cols, x, y);
    scores.push(score);
  }
}

console.log(scores.sortDesc()[0]);

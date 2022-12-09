import "./utils/helpers.ts";
import { range } from "./utils/helpers.ts";

let input = await Deno.readTextFile("9.txt");
let exampleInput = `R 4
U 4
L 3
D 1
R 4
D 1
L 5
R 2`;

let exampleInput2 = `R 5
U 8
L 8
D 3
R 17
D 10
L 25
U 20`;

const data = input
  .lines()
  .trim()
  .map((line) => line.split(" "))
  .map((v) => [v[0], parseInt(v[1])])
  .map((v) => {
    return {
      move: { R: [1, 0], L: [-1, 0], U: [0, -1], D: [0, 1] }[v[0]] as number[],
      amount: v[1] as number,
    };
  });

interface Point {
  x: number;
  y: number;
}

function print(knots: Point[]) {
  const size = 10;
  for (let i = -5; i < size / 2; i++) {
    let line = range(size)
      .map((_) => ".")
      .join("");
    for (let j = -5; j < size / 2; j++) {
      let foundKnot = false;
      for (let k = 0; k < knots.length; k++) {
        if (knots[k].x === j && knots[k].y === i && !foundKnot) {
          line = line.substring(0, j) + k + line.substring(j + 1);
          foundKnot = true;
          break;
        }
      }
    }
    console.log(line);
  }
}

function calcVisited(tailLength: number): number {
  const result = data.reduce(
    (av, cv) => {
      const { move, amount } = cv;
      const [x, y] = move;
      const { head, tails, visited } = av;
      const knots = [head, ...tails];

      function moveKnots(a: Point, b: Point) {
        const xdiff = Math.abs(a.x - b.x);
        const ydiff = Math.abs(a.y - b.y);
        if (xdiff > 1 || ydiff > 1) {
          if (a.x - b.x > 0) b.x++;
          else if (a.x - b.x < 0) b.x--;

          if (a.y - b.y > 0) b.y++;
          else if (a.y - b.y < 0) b.y--;
        }
      }

      for (let i = 0; i < amount; i++) {
        head.x += x;
        head.y += y;

        for (let k = 0; k < knots.length - 1; k++) {
          moveKnots(knots[k], knots[k + 1]);
          visited.add(`${tails.last().x},${tails.last().y}`);
        }
        // print();
      }

      return av;
    },
    {
      head: { x: 0, y: 0 },
      tails: range(tailLength).map((_) => ({ x: 0, y: 0 })),
      visited: new Set<string>(),
    }
  );
  return result.visited.size;
}

console.log(calcVisited(1));
console.log(calcVisited(9));

import "./utils/helpers.ts";

interface Pos {
  x: number;
  y: number;
  mapHeight: number;
  parent?: Pos;
  f: number;
  g: number;
  h: number;
}

let input = await Deno.readTextFile("12.txt");
let exampleInput = `
Sabqponm
abcryxxl
accszExk
acctuvwj
abdefghi`.trim();

let goalPos: [number, number] = [0, 0];
let startPos: [number, number] = [0, 0];
const goalHeight = "E".charCodeAt(0);
const goalChar = "z";
const startChar = "a";
const usingInput = input;

function findOnMap(...chars: string[]): number[][] {
  const nums = usingInput.lines().map(
    (line, y) =>
      line
        .split("")
        .map((char, x) => {
          if (chars.includes(char)) return [x, y];
        })
        .filter((v) => Boolean(v)) as number[][]
  );

  return nums.flat() as number[][];
}

function calc(startx: number, starty: number) {
  const map = usingInput.lines().map((line, y) =>
    line.split("").map((char, x) => {
      const isGoal = char.charCodeAt(0) === goalHeight;
      const isStart = startx === x && starty === y;
      if (isGoal) goalPos = [x, y];
      else if (isStart) startPos = [x, y];
      let mapHeight;
      if (isGoal) mapHeight = goalChar.charCodeAt(0);
      else if (isStart) mapHeight = startChar.charCodeAt(0);
      else mapHeight = char.charCodeAt(0);
      mapHeight = mapHeight - "a".charCodeAt(0);

      return {
        x,
        y,
        mapHeight,
        f: Infinity,
        h: Infinity,
        g: Infinity,
      };
    })
  );

  const goal = map[goalPos[1]][goalPos[0]];
  const start = map[startPos[1]][startPos[0]];

  function getNeighbors(point: Pos): Pos[] {
    const { x, y, mapHeight } = point;
    const candidates = [
      map[y - 1]?.[x],
      map[y + 1]?.[x],
      map[y]?.[x - 1],
      map[y]?.[x + 1],
    ]
      .filter(Boolean)
      .filter(
        (candiate) =>
          candiate.mapHeight <= mapHeight + 1
      );
    return candidates;
  }

  function dist(p1: Pos, p2: Pos): number {
    const dx = Math.abs(p1.x - p2.x);
    const dy = Math.abs(p1.y - p2.y);
    return dx + dy;
  }

  function search(): Pos[] {
    const open = new Set<Pos>();
    const visited = new Set<Pos>();
    open.add(start);

    while (open.size) {
      const current = [...open].sort((a, b) => a.f - b.f)[0];
      open.delete(current);
      visited.add(current);

      if (current === goal) {
        const path = [];
        let curr = current;
        while (curr) {
          path.push(curr);
          curr = curr.parent!;
        }
        return path;
      }

      const neighbors = getNeighbors(current);
      for (const neighbor of neighbors) {
        const gScore = current.g + 1;
        let gScoreIsBest = false;

        if (!visited.has(neighbor)) {
          neighbor.h = dist(neighbor, goal);
          neighbor.parent = current;
          open.add(neighbor);
        } else if (gScore < neighbor.g) {
          gScoreIsBest = true;
        }

        if (gScoreIsBest) {
          neighbor.parent = current;
          neighbor.g = gScore;
          neighbor.f = neighbor.g + neighbor.h;
        }
      }
    }
    return [];
  }

  const res = search();
  return res;
}

const startpos = findOnMap('S')[0];
console.log(calc(startpos[0], startpos[1]).length - 1);

const lowestSteps = findOnMap('a', 'S')
  .map((p) => {
    return calc(p[0], p[1]).length - 1;
  })
  .filter((steps) => steps > 0)
  .sortAsc()[0];

console.log(lowestSteps);
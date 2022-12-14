import "./utils/helpers.ts";

/**
 * 
 * 
  4     5  5
  9     0  0
  4     0  3
0 ......+...
1 ..........
2 ..........
3 ..........
4 ....#...##
5 ....#...#.
6 ..###...#.
7 ........#.
8 ........#.
9 #########.
 */

let input = await Deno.readTextFile("14.txt");
let exampleInput = `498,4 -> 498,6 -> 496,6
503,4 -> 502,4 -> 502,9 -> 494,9`.trim();

const simulateSandfall = (
  type: "untilFallingIntoVoid" | "untilReachedFloor",
  input: string
) => {
  const topos = (x: number, y: number) => x + "," + y;

  const map = input.lines().reduce((map, line) => {
    const pairs = line.split("->").map((val) => val.split(",").nums());

    for (let p = 0; p < pairs.length - 1; p++) {
      const [x, y] = pairs[p];
      const [x2, y2] = pairs[p + 1];

      for (let i = Math.min(x, x2); i <= Math.max(x, x2); i++) {
        map[topos(i, y)] = "#";
      }
      for (let j = Math.min(y, y2); j <= Math.max(y, y2); j++) {
        map[topos(x, j)] = "#";
      }
    }

    return map;
  }, {} as Record<string, string>);

  const highestY =
    Object.keys(map)
      .map((pos) => pos.split(",").nums()[1])
      .sortDesc()[0] + 2;

  const getAt = (x: number, y: number): string => {
    if (type === "untilReachedFloor" && y >= highestY) return "#";
    return map[topos(x, y)];
  };

  const sandStart = [500, 0];
  let sand: number[];
  let sandCount = 0;
  let stop = false;
  while (!stop) {
    sand = sandStart;
    while (!stop) {
      const beforeSand = sand;

      const posCanditates = [
        [0, 1],
        [-1, 1],
        [1, 1],
      ];
      for (const posCandidate of posCanditates) {
        const sandNext = [sand[0] + posCandidate[0], sand[1] + posCandidate[1]];
        const [x, y] = sandNext;

        const isAir = !getAt(x, y);
        if (!isAir) continue;

        if (type === "untilFallingIntoVoid" && sand[1] > highestY) {
          stop = true;
          break;
        }

        if (isAir) {
          sand = sandNext;
          break;
        }
      }
      if (sand === beforeSand) {
        map[topos(sand[0], sand[1])] = "o";
        sandCount++;
        break;
      }
    }
    if (sand === sandStart) break;
  }
  return sandCount;
};

// print tree
// for (let j = 0; j < highestY + 1; j++) {
//   let line = '';
//     for (let i = 500-10; i < 500+10; i++) {
//       line += getAt(i, j) ?? ' ';
//   }
//   console.log(line);
// }

console.log(simulateSandfall("untilFallingIntoVoid", input) - 1);
console.log(simulateSandfall("untilReachedFloor", input));

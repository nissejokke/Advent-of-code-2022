import "./utils/helpers.ts";
import { ObjectSet } from "./utils/object-set.ts";

const input = await Deno.readTextFile("15.txt");

const data: [number, string] = [2000000, input];
const ypos = data[0];

const positions = data[1]
  .lines()
  .map((line) => line.match(/-?[\d]+/g)?.nums() as number[]);

const result = positions.reduce((av, cv) => {
  const [sx, sy, bx, by] = cv;

  const dist = Math.abs(sx - bx) + Math.abs(sy - by);
  const dy = Math.abs(sy - ypos);
  const dx = (dist - dy);

  for (let x = sx - dx; x < sx + dx + 1; x++) {
    av.add([x, ypos]);
  }
  return av;
}, new ObjectSet<number[]>());

positions.forEach((row) => {
  result.delete([row[0], row[1]]);
  result.delete([row[2], row[3]]);
});

console.log(result.size);
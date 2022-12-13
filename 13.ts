import "./utils/helpers.ts";

const input = await Deno.readTextFile("13.txt");

const pairs = input
  .trim()
  .lines()
  .trim()
  .split("")
  .map((pair) => [eval(pair[0]), eval(pair[1])]);

function compare(
  val1: number | number[] | undefined,
  val2: number | number[] | undefined
): number {
  if (val1 === undefined && val2 === undefined) return 0;
  if (val1 === undefined) return -1;
  if (val2 === undefined) return 1;

  const val1num = typeof val1 === "number";
  const val2num = typeof val2 === "number";
  if (val1num && val2num) return val1 - val2;
  else if (!val1num && !val2num) {
    for (let i = 0; i < Math.max(val1.length, val2.length); i++) {
      const result = compare(val1[i], val2[i]);
      if (result !== 0) return result;
    }
    if (val1.length !== val2.length) return val1.length - val2.length;
    return 0;
  } else {
    if (val1num) return compare([val1], val2);
    else if (val2num) return compare(val1, [val2]);
    else throw new Error();
  }
}

const sum = pairs.reduce((av, pair: number[][], index) => {
  const [l1, l2] = pair;
  const right = compare(l1, l2) < 0;
  if (right) return av + index + 1;
  return av;
}, 0);

console.log(sum);

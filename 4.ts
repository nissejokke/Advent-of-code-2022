const data = await Deno.readTextFile("4.txt");
// data = `2-4,6-8
// 2-3,4-5
// 5-7,7-9
// 2-8,3-7
// 6-6,4-6
// 2-6,4-8`;

function intersect(setA: Set<number>, setB: Set<number>) {
  const intersection = new Set(
    [...setA].filter((element) => setB.has(element))
  );

  return intersection;
}

const result = data
  .trim()
  .split(/\n/g)
  .map((row) =>
    row.split(",").map((range) => {
      const [v1, v2] = range.split("-").map((v) => parseInt(v));
      return { start: v1, end: v2 };
    })
  )
  .map((rowval) => {
    const sets = rowval.map((val) => {
      const s = new Set<number>();
      const { start, end } = val;
      for (let j = start; j <= end; j++) {
        s.add(j);
      }
      return s;
    });

    const intersection = intersect(sets[0], sets[1]);
    return {
      intersect: intersection.size === Math.min(sets[0].size, sets[1].size),
      overlapAtAll: intersection.size > 0,
    };
  });

console.log("a", result.filter((r) => r.intersect).length);
console.log("b", result.filter((r) => r.overlapAtAll).length);

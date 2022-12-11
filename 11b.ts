import "./utils/helpers.ts";

const input = await Deno.readTextFile("11.txt");

interface Monkey {
  items: number[];
  op: "+" | "*";
  val: string;
  dividable: number;
  throwToIfTrue: number;
  throwToIfFalse: number;
  inspectCount: number;
}

const monkeys = input
  .trim()
  .lines()
  .split("")
  .reduce((av, cv) => {
    const items = cv[1].nums().map((val) => val);
    const [op, val] = cv[2].words().lastVals(2);
    const [dividable] = cv[3].nums();
    const [throwToIfTrue] = cv[4].nums();
    const [throwToIfFalse] = cv[5].nums();

    av.push({
      items,
      op: op as "+" | "*",
      val,
      dividable,
      throwToIfTrue,
      throwToIfFalse,
      inspectCount: 0,
    });
    return av;
  }, [] as Monkey[]);

const getScore = () => {
  const res = [...monkeys].sort((a, b) => b.inspectCount - a.inspectCount);
  return {
    insps: res.map((r) => r.inspectCount),
    monkeyBusiness: res[0].inspectCount * res[1].inspectCount,
  };
};

const commonDiv = monkeys.reduce((av, cv) => cv.dividable * av, 1);

for (let round = 0; round < 10000; round++) {
  for (const monkey of monkeys) {
    const { items, val, op, dividable, throwToIfFalse, throwToIfTrue } = monkey;

    let item: number;
    while ((item = items.pop()!)) {
      const getVar = (): number => (val === "old" ? item : parseInt(val));
      let updItem: number;
      if (op === "+") updItem = item + getVar();
      else updItem = item * getVar();

      const div = dividable;
      updItem %= commonDiv;
      const wasDiv = updItem % div === 0;
      if (wasDiv) {
        monkeys[throwToIfTrue].items.push(updItem);
      } else monkeys[throwToIfFalse].items.push(updItem);
      monkey.inspectCount++;
    }
  }
}

console.log(getScore().monkeyBusiness);

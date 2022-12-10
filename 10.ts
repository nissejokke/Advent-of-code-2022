import "./utils/helpers.ts";

let input = await Deno.readTextFile("10.txt");
const data = input.trim().lines().trim();

const result = data.reduce(
  (av, cv) => {
    const [instr, arg] = cv.split(" ");
    let addxCounter = 0;
    let instrDone = false;
    while (!instrDone) {
      // start of instr
      if (instr === "noop") {
        instrDone = true;
      } else if (instr === "addx") {
        if (addxCounter === 1) instrDone = true;
        addxCounter++;
      }
      av.cycle++;
      // end of instr
      if ([20, 60, 100, 140, 180, 220].includes(av.cycle)) {
        av.signalSum += av.cycle * av.x;
      }
    }

    // after instr
    if (addxCounter) {
      av.x += parseInt(arg, 10);
    }

    return av;
  },
  { x: 1, cycle: 0, signalSum: 0 }
);

console.log(result.signalSum);

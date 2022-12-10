import "./utils/helpers.ts";

let input = await Deno.readTextFile('10.txt');
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

      const crtPos = av.crt.length % 40;
      if (crtPos >= av.x - 1 && crtPos <= av.x + 1) {
        av.crt += '#';
      }
      else av.crt += '.';
    }

    // after instr
    if (addxCounter) {
      av.x += parseInt(arg, 10);
    }

    return av;
  },
  { x: 1, cycle: 0, crt: '' }
);

for (let i = 0; i < 6; i++)
  console.log(result.crt.substring(i * 40, (i+1) * 40))
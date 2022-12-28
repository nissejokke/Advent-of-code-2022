import "./utils/helpers.ts";

const input = await Deno.readTextFile('16.txt');
const exampleInput = `Valve AA has flow rate=0; tunnels lead to valves DD, II, BB
Valve BB has flow rate=13; tunnels lead to valves CC, AA
Valve CC has flow rate=2; tunnels lead to valves DD, BB
Valve DD has flow rate=20; tunnels lead to valves CC, AA, EE
Valve EE has flow rate=3; tunnels lead to valves FF, DD
Valve FF has flow rate=0; tunnels lead to valves EE, GG
Valve GG has flow rate=0; tunnels lead to valves FF, HH
Valve HH has flow rate=22; tunnel leads to valve GG
Valve II has flow rate=0; tunnels lead to valves AA, JJ
Valve JJ has flow rate=21; tunnel leads to valve II`.trim();

interface Tunnel {
  valve: string;
  flow: number;
  leadsTo: string[];
}

const data: Tunnel[] = input
  .trim()
  .lines()
  .map((line) => {
    const [flow] = line.nums();
    const [_, valve] = line.words();
    const leadsTo = line
      .split(/valves|valve/)[1]
      .trim()
      .split(",")
      .map((v) => v.trim());
    return { valve, flow, leadsTo };
  });

const dataDict = data.reduce((av,cv) => {
  av[cv.valve] = cv;
  return av;
}, {} as Record<string, Tunnel>);

let n = 0;
const valveIndex = data.map(d => d.valve).sort().reduce((av, cv, i) => {
  if (dataDict[cv].flow) {
    av[cv] = 2 ** n;
    n++;
  }
  else av[cv] = 0;
  return av;
}, {} as Record<string, number>);

const valveNums = data.map(d => d.valve).sort().reduce((av, cv, i) => {
  av[cv] = i;
  return av;
}, {} as Record<string, number>);

function solve(valve: string, time: number, open: number, otherPlayer: number, seen: Record<string, number>): number {

  if (time === 0) {
    if (otherPlayer > 0) return solve('AA', 26, open, otherPlayer - 1, seen);
    return 0;
  }
  const key = valveNums[valve] * 1e8 + time * 1e6 + open * 10 + otherPlayer;
  if (key in seen) return seen[key];

  let best = 0;
  for (const leadsTo of dataDict[valve].leadsTo) {
      best = Math.max(best, solve(leadsTo, time - 1, open, otherPlayer, seen));
  }

  // open
  if ((open & valveIndex[valve]) === 0 && dataDict[valve].flow > 0) {
    const newOpen = open | valveIndex[valve];
    if (newOpen <= open) throw new Error();
    best = Math.max(best, (time - 1)*dataDict[valve].flow + solve(valve, time - 1, newOpen, otherPlayer, seen));
  }
  seen[key] = best;
  return best;
}

console.log(solve('AA', 26, 0, 0, {}));
console.log(solve('AA', 26, 0, 1, {}));

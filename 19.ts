import './utils/helpers.ts';

let input = await Deno.readTextFile('19.txt');
let exampleInput = `Blueprint 1: Each ore robot costs 4 ore. Each clay robot costs 2 ore. Each obsidian robot costs 3 ore and 14 clay. Each geode robot costs 2 ore and 7 obsidian.
Blueprint 2: Each ore robot costs 2 ore. Each clay robot costs 3 ore. Each obsidian robot costs 3 ore and 8 clay. Each geode robot costs 3 ore and 12 obsidian.`.trim();

interface Robot {
    type: string;
    costs: {
        amount: number,
        type: string,
    }[]
}

interface Blueprint {
    id: number;
    robots: Robot[]
}

const blueprints = input.lines().map(blueprint => {
    const [id] = blueprint.nums();
    const robots = blueprint.replace('Blueprint ' + id + ':', '').split('.').reduce((av, cv) => {
        const type = cv.words()[2];
        const costs = cv.match(/\d+ \w+/g)?.map(e => {
            const [num, t] = e.words();
            return { amount: parseInt(num), type: t };
        });
        if (type && costs) {
            av.push({type, costs});
        }
        return av;
    }, [] as Robot[]);

    return { id, robots };
});

// options each turn:
// build a robot, if can afford
//   1) ore 2) clay 3) obsidian 4) geode
// not build a robot

function bfs(blueprint: Blueprint): number {

    let best = 0;
    const queue:[number, number, number, number, number, number, number, number, number][]  = [[ 24, 0, 0, 0, 0, 1, 0, 0, 0 ]];
    const seen = new Map();

    const r1CostOre = blueprint.robots[0].costs[0].amount;    
    const r2CostOre = blueprint.robots[1].costs[0].amount;
    const r3CostOre = blueprint.robots[2].costs[0].amount;
    const r3CostClay = blueprint.robots[2].costs[1].amount;
    const r4CostOre = blueprint.robots[3].costs[0].amount;
    const r4CostOb = blueprint.robots[3].costs[1].amount;

    const maxOre = Math.max(r1CostOre, r2CostOre, r3CostOre, r4CostOre);

    while (queue.length) {
        let [time, or, cl, ob, ge, r1, r2, r3, r4] = queue.shift()!;

        best = Math.max(best, ge);
        if (time === 1) {
            best = Math.max(best, ge + r4);
            continue;
        }

        if (2 * best > 2 * ((ge + r4 * time) + time*time - time)) continue;

        // hack: +7 prob wont work with all input
        or = Math.min(or, maxOre + 7, time*maxOre);
        cl = Math.min(cl, r3CostClay + 7, time*r3CostClay);
        ob = Math.min(ob, r4CostOb + 7, time*r4CostOb);

        const key = [or, cl, ob, ge, r1, r2, r3, r4].toString();
        if (seen.has(key)) continue;
        seen.set(key, best);

        const canAffordR1 = or - r1CostOre >= 0;
        const canAffordR2 = or - r2CostOre >= 0;
        const canAffordR3 = or - r3CostOre >= 0 && cl - r3CostClay >= 0;
        const canAffordR4 = or - r4CostOre >= 0 && ob - r4CostOb >= 0;

        if (canAffordR4)
            queue.push([time - 1, or - r4CostOre + r1, cl + r2, ob - r4CostOb + r3, ge + r4, r1, r2, r3, r4 + 1]);
        if (canAffordR1)
            queue.push([time - 1, or - r1CostOre + r1, cl + r2, ob + r3, ge + r4, r1 + 1, r2, r3, r4]);
        if (canAffordR2)
            queue.push([time - 1, or - r2CostOre + r1, cl + r2, ob + r3, ge + r4, r1, r2 + 1, r3, r4]);
        if (canAffordR3)
            queue.push([time - 1, or - r3CostOre + r1, cl - r3CostClay + r2, ob + r3, ge + r4, r1, r2, r3 + 1, r4]);
        
        // do nothing
        if (!(canAffordR1 && canAffordR2 && canAffordR3 && canAffordR4))
            queue.push([ time - 1, or + r1, cl + r2, ob + r3, ge + r4, r1, r2, r3, r4 ]);
    }

    return best;
}

const result = blueprints.map(bp => {
    const g = bfs(bp);
    console.log('--', bp.id, g);
    return g * bp.id;
}).sum();

console.log(result);

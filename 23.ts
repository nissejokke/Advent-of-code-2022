import './utils/helpers.ts';
import { ObjectSet } from './utils/object-set.ts';

const input = await Deno.readTextFile('23.txt');
const data = input.lines().map(line => line.split(''));

const elves = data.reduce((av, cv, y) => {
    cv.forEach((item, x) => item === '#' ? av.add([x,y]) : null);
    return av;
}, new ObjectSet<number[]>());

const allDirections = [[0,-1],[1,-1],[1,0],[1,1],[0,1],[-1,1],[-1,0],[-1,-1]];

function anyAdjecentElf(elf: number[], directions: number[][]) {
    return directions.some(d => elves.has([elf[0] + d[0], elf[1] + d[1]]));
}

function solve(rounds?: number) {
    const considereings = [[0,-1], [0, 1], [-1,0], [1,0]];
    let round;
    for (round = 0; true; round++) {
        const considered: {elves: number[][], pos:number[]}[] = [];

        for (const elf of elves.values()) {
            const isAnyAdjElf = anyAdjecentElf(elf, allDirections);
            if (!isAnyAdjElf) continue;

            for (const con of considereings) {
                if (!anyAdjecentElf(elf, allDirections.filter(d => (con[0] !== 0 ? d[0] === con[0] : true) && (con[1] !== 0 ? d[1] === con[1] : true)))) {
                    const pos = [elf[0]+con[0],elf[1]+con[1]];
                    const item = considered.find(c => c.pos.toString() === pos.toString());
                    if (item) {
                        item.elves.push(elf);
                    }
                    else {
                        considered.push({ elves: [elf], pos });
                    }
                    break;
                }
            }       
        }

        // update positions where only one elf consired moving
        for (const con of considered) {
            if (con.elves.length === 1) {
                elves.delete(con.elves[0]);
                elves.add(con.pos);
            }
        }

        if (rounds && round === rounds-1) break;
        else if (considered.length === 0) break;

        // rotate considerings
        considereings.push(considereings.shift()!);
    }

    if (!rounds) {
        return round + 2;
    }

    const min = [1e6,1e6];
    const max = [0,0];
    for (const elf of elves.values()) {
        if (elf[0] < min[0]) min[0] = elf[0];
        if (elf[1] < min[1]) min[1] = elf[1];
        if (elf[0] > max[0]) max[0] = elf[0];
        if (elf[1] > max[1]) max[1] = elf[1];
    }
    return (max[0] - min[0] + 1)*(max[1]-min[1] + 1)-elves.size;
}

console.log(solve(10));
console.log(solve());
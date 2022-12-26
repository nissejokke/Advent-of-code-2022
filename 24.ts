import './utils/helpers.ts';
import { ObjectSet } from './utils/object-set.ts';

const input = await Deno.readTextFile('24.txt');

const data = input.lines().map(line => {
    return line.split('');
});

type Map = Record<string, number[][]>;

const mapWidth = data[0].length - 2;
const mapHeight = data.length - 2;
const map = data.reduce((av, cv, y) => {
    cv.forEach((c, x) => {
        const key = [x-1,y-1].toString();
        if (c === '<') av[key] = [[-1,0]];
        if (c === '>') av[key] = [[1,0]];
        if (c === '^') av[key] = [[0,-1]];
        if (c === 'v') av[key] = [[0,1]];
    })
    return av;
}, {} as Map);

function nextState(map: Map, time: number): Map {
    const newMap: Map = {};
    for (const key of Object.keys(map)) {
        const [x, y] = key.split(',').map(v => parseInt(v));
        const objs = map[key];

        for (const obj of objs) {
            let [nx, ny] = [(x + obj[0]*time) % mapWidth, (y + obj[1]*time) % mapHeight];
            if (nx < 0) nx += mapWidth;
            if (ny < 0) ny += mapHeight;
            const newKey = [nx, ny].toString();
            newMap[newKey] = newMap[newKey] || [];
            newMap[newKey].push(obj);
        }
    }
    return newMap;
}

function getAvailableMoves(x: number, y: number, map: Map): number[][] {
    const ava = [];
    for (const move of [[0,-1],[1,0],[0,1],[-1,0]]) {
        const nx = x + move[0];
        const ny = y + move[1];
        if (nx === mapWidth - 1 && ny === mapHeight) {
            ava.push([nx, ny]);
        }
        else if (nx === 0 && ny === -1) {
            ava.push([nx, ny]);
        }
        if (nx >= 0 && nx < mapWidth && ny >= 0 && ny < mapHeight && !map[[nx,ny].toString()])
             ava.push([nx, ny]);
    }
    return ava;
}

/**
 * Breath first search all possible moves
 */
function solve(part: number, x: number, y: number, orgMap: Map) {
    type State = [number, number, number,boolean,boolean];
    const queue: State[] = [[x,y,1,false,false]];
    let move: State;
    const seen = new ObjectSet<unknown[]>();
    const maps: Record<number, Map> = {};
    const size  = mapWidth*mapHeight;

    // preconstruct maps for each time
    for (let t = 0; t < size; t++)
        maps[t] = nextState(orgMap, t); 

    while ((move = queue.shift()!)) {
        let [mx, my, time, seenGoal, seenStart] = move;
        if (my == mapHeight && part === 1) return time;
        if (my === mapHeight && part === 2 && seenGoal && seenStart) return time;
        if (my === mapHeight && part === 2) { seenGoal = true; }
        if (my === -1 && part === 2 && seenGoal) { seenStart = true; }

        const seenKey = move;
        if (seen.has(seenKey)) continue;
        seen.add(seenKey);
        
        const newMap = maps[(time+1) % size];

        // available moves
        const moves = getAvailableMoves(mx, my, newMap);
        moves.forEach(mv => queue.push([mv[0], mv[1], time + 1, seenGoal, seenStart]));

        // no move
        if  (!newMap[[mx, my].toString()])
            queue.push([mx, my, time + 1, seenGoal, seenStart]);
    }
}

console.log(solve(1, 0, -1, map));
console.log(solve(2, 0, -1, map));
import './utils/helpers.ts';
import { range } from './utils/helpers.ts';

let input = await Deno.readTextFile('22.txt');
let exampleInput = `        ...#
        .#..
        #...
        ....
...#.......#
........#...
..#....#....
..........#.
        ...#....
        .....#..
        .#......
        ......#.

10R5L5R10L4R5L5`;

const [mapinput, dirinput] = input.split(/\n\n/g);
const map = mapinput.lines().map(line => line.split(''));
const dirs = dirinput.trim().split('').reduce((av, cv) => {
    if (cv !== 'R' && cv !== 'L') {
        let last = av[av.length - 1];
        if (typeof last === 'number') {
            last *= 10;
            last += parseInt(cv);
            av[av.length - 1] = last;
        }
        else av.push(parseInt(cv));
    }
    else av.push(cv);
    return av;
}, [] as (number|string)[]);

// console.log(map, dirs);

const iy = 0;
const ix = map[0].findIndex(t => t !== ' ');

console.log('initial', ix, iy);

let trail: string[][] = range(map.length).map(i => range(map[i].length).map(_ => ''));
function print(x: number, y: number, size = 20) {
    console.log(range(3 + size).map(_ => ' ').join(''), x);
    for (let i = 0; i < size; i++) {
        let yp = i + y - size/2;
        let line = (yp).toString().padStart(3) +  ' ';
        for (let j = 0; j < size * 2; j++) {
            const xp = j + x - size;
            if (xp === x && yp === y) line += 'o';
            else if (trail?.[yp]?.[xp])
                line += trail?.[yp]?.[xp];
            else 
                line += map?.[yp]?.[xp] ?? '';
        }
        console.log(line);
    }
    console.log();
}

const tilesSeen: any = {};
function findTile(x: number, y: number, dir: number[]): { walkable: boolean, pos: number[] } {
    const key = JSON.stringify({x,y, dir});
    if (tilesSeen[key]) return tilesSeen[key];
    let ax = x;
    let ay = y;
    const walkable = ['.'];
    let t;
    while ((t = map?.[ay]?.[ax]) !== '#' && t !== '.') {
        let wrapped = false;
        if (dir[1] !== 0) {
            if (ay < 0) { ay += map.length; wrapped = true; }
            else if (ay >= map.length) { ay -= map.length; wrapped = true; }
        }
        else if (dir[0] !== 0) {
            if (ax < 0) { ax += map[ay].length; wrapped = true; }
            else if (ax >= map[ay].length) { ax -= map[ay].length; wrapped = true; }
        }

        if (!wrapped) {
            ax += dir[0];
            ay += dir[1];
        }
    }
    const res = { walkable: walkable.includes(map[ay][ax]), pos: [ax, ay] };
    tilesSeen[key] = res;
    return res;
}

let [x, y] = [ix, iy];
let dir = [1, 0];

let i = 0;
for (const d of dirs) {
    console.log(i, ':', d);
    i++;
    // if (i < 13) {
    //     print(x, y);
    // }
    // else if (i > 13) break;
    // print(x, y);
    // await new Promise(r => setTimeout(r, 1000));
    if (typeof d === 'number') {
        for (let n = 0; n < d; n++) {
            const [nx, ny] = [x + dir[0], y + dir[1]];
            const nextTile = map?.[ny]?.[nx];
            if (nextTile === '.') {
                x = nx;
                y = ny;
            }
            else if (!nextTile || nextTile === ' ') {
                const { walkable, pos: [tx, ty] } = findTile(nx, ny, dir);

                if (walkable) {
                    x = tx;
                    y = ty;
                }
            }

            if (dir.toString() === '1,0') trail[y][x] = '>';
            else if (dir.toString() === '-1,0') trail[y][x] = '<';
            else if (dir.toString() === '0,1') trail[y][x] = 'v';
            else if (dir.toString() === '0,-1') trail[y][x] = '^';
        }
    }
    else if (d === 'L') {
        if (dir.toString() === '1,0') dir = [0,-1];
        else if (dir.toString() === '-1,0') dir = [0,1];
        else if (dir.toString() === '0,1') dir = [1,0];
        else if (dir.toString() === '0,-1') dir = [-1,0];
    }
    else if (d === 'R') {
        if (dir.toString() === '1,0') dir = [0,1];
        else if (dir.toString() === '-1,0') dir = [0,-1];
        else if (dir.toString() === '0,1') dir = [-1,0];
        else if (dir.toString() === '0,-1') dir = [1,0];
    }
}

let facing = 0;
if (dir.toString() === '0,1') facing = 1;
else if (dir.toString() === '-1,0') facing = 2;
else if (dir.toString() === '0,-1') facing = 3;

print(x, y);

let score = 1000 * (y+1) + 4 * (x + 1) + facing;

console.log(x, y, score);

// low: 49242
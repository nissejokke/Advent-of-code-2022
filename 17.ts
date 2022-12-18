import './utils/helpers.ts';
import {ObjectSet} from './utils/object-set.ts'

const input = await Deno.readTextFile('17.txt');

const stream = input.split('').map(c => c === '>' ? 1 : -1);

interface Rock { 
    shape: number[][];
    height: number;
}

function calc(rockCount: number, optimize = false) {
    const minusshape = { shape: [[0,0], [1,0], [2,0], [3,0]], height: 1 };
    const plushape = { shape: [[1,0], [0,1], [1,1], [2,1], [1,2]], height: 3 };
    const lshape = { shape: [[2,0], [2,1], [2,2], [1,2], [0,2]], height: 3 };
    const ishape = { shape: [[0,0], [0,1], [0,2], [0,3]], height: 4 };
    const boxshape = { shape: [[0,0], [1,0], [0,1], [1,1]], height: 2 };

    const shapes: Rock[] = [minusshape, plushape, lshape, ishape, boxshape];

    const space = new ObjectSet();
    let highest = 0;
    let rockIndex = 0;
    let streamIndex = 0;
    const signs: Record<string, { highest: number, rockIndex: number }> = {};
    let addedHeight = 0;

    while (rockIndex < rockCount) {
        const currentShape = shapes[rockIndex % shapes.length];
        let x = 2;
        let y = highest - currentShape.height - 3;
        
        const isOutOfBounds = (x: number, y: number) => currentShape.shape.some(shape => 
            shape[0] + x < 0 || shape[0] + x >= 7 || shape[1] + y >= 0
        );

        const move = (dx: number, dy: number) => { 
            x += dx; 
            y += dy; 
            const hit = isCollision(x, y);
            if (hit) {
                x -= dx;
                y -= dy;
            }
        }
        const isCollision = (x: number, y: number) => {
            if (isOutOfBounds(x, y)) return true;
            return currentShape.shape.some(s => {
                if (s[1] + y >= 0) return true;
                return space.has([s[0] + x, s[1] + y]);
            });
        }
        const collision = (x: number, y: number) => {
            currentShape.shape.forEach(shape => {
                space.add([shape[0] + x, shape[1] + y]);
                if (shape[1] + y < highest)
                    highest = shape[1] + y;
            });
        };

        const signature = () => {
            if (highest > -100) return null;
            const sign = [];
            for (let i = 0; i < 25; i++) {
                for (let j = 0; j < 7; j++) {
                    if (space.has([j,highest + i])) sign.push([j, i]);
                    else sign.push([]);
                }
            }
            return JSON.stringify(sign);
        }

        if (optimize) {
            const s = signature();
            const key = s + '_' + (rockIndex % shapes.length) + '_' + (streamIndex % stream.length);
            if (s && signs[key] && rockIndex < rockCount / 2) {
                const val = signs[key];
                const dh = highest - val.highest;
                const dshi = rockIndex - val.rockIndex;
                const divs = parseInt(((rockCount) / dshi).toString()) - 3;
                addedHeight = divs * dh;
                rockIndex += divs * dshi;
                continue;
            }
            signs[key] = {rockIndex, highest};
        }
        
        while (true) {
            const currentStream = stream[streamIndex % stream.length];
            move(currentStream, 0);

            if (isCollision(x, y + 1)) {
                collision(x, y);
                break;
            }
            move(0, 1);        
            streamIndex++;
        }
        streamIndex++;
        rockIndex++;
    }

    if (rockIndex !== rockCount) throw new Error();
    return -highest - addedHeight;
}

console.log(calc(2022));
console.log(calc(1000000000000, true));
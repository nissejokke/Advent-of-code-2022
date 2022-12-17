import './utils/helpers.ts';
import {ObjectSet} from './utils/object-set.ts'

const input = await Deno.readTextFile('17.txt');

const stream = input.split('').map(c => c === '>' ? 1 : -1);

interface Shape { 
    shape: number[][];
    height: number;
}

const minusshape = { shape: [[0,0], [1,0], [2,0], [3,0]], height: 1 };
const plushape = { shape: [[1,0], [0,1], [1,1], [2,1], [1,2]], height: 3 };
const lshape = { shape: [[2,0], [2,1], [2,2], [1,2], [0,2]], height: 3 };
const ishape = { shape: [[0,0], [0,1], [0,2], [0,3]], height: 4 };
const boxshape = { shape: [[0,0], [1,0], [0,1], [1,1]], height: 2 };

const shapes: Shape[] = [minusshape, plushape, lshape, ishape, boxshape];

const room = new ObjectSet();
let highest = 0;
let shapeIndex = 0;
let streamIndex = 0;

while (shapeIndex < 2022) {
    const currentShape = shapes[shapeIndex % shapes.length];
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
            return room.has([s[0] + x, s[1] + y]);
        });
    }
    const collision = (x: number, y: number) => {
        currentShape.shape.forEach(shape => {
            room.add([shape[0] + x, shape[1] + y]);
            if (shape[1] + y < highest)
                highest = shape[1] + y;
        });
    };
    const print = (x?: number, y?: number, shape?: Shape) => {
        for (let i = highest - 6; i < 0; i++) {
            let line = (-i).toString().padStart(2, ' ')+ '|';
            for (let j = 0; j < 7; j++) {
                if (room.has([j, i])) line += '#';
                else if (shape && shape.shape.some(sh => j === sh[0] + x! && i === sh[1] + y!))
                    line += '@';
                else line += ' ';
            }
            line += '|';
            console.log(line);
        }
        console.log('  +-------+');
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
    shapeIndex++;
}

console.log(-highest)
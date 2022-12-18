import './utils/helpers.ts';
import {ObjectSet} from './utils/object-set.ts';

const input = await Deno.readTextFile('18.txt');

let [droplet, size] = input.trim().lines().map(line => {
    const [x,y,z] = line.nums();
    return {x,y,z};
}).reduce((av, d) => { 
    const [droplet] = av;
    droplet.add([d.x,d.y,d.z]);
    av[1] = Math.max(av[1], d.x, d.y, d.z);
    return av;
}, [new ObjectSet(), 0]);
size++;

function getDropletSolid() {
    const space = new ObjectSet();
    space.add([0,0,0]);
    const queue: number[][] = [[0,0,0]];

    function findSpace(x: number, y: number, z: number): void {
        for (const [sx,sy,sz] of [[-1,0,0], [1,0,0], [0,0,-1], [0,0,1], [0,-1,0], [0,1,0]]) {
            const [nx, ny, nz] = [x+sx, y+sy, z+sz];
            if (nx >= 0 && ny >= 0 && nz >= 0 && nx < size && ny < size && nz < size) {
                const npos = [nx, ny, nz];
                if (!droplet.has(npos) && !space.has(npos)) {
                    space.add(npos);
                    queue.push(npos);
                }
            }
        }
    }

    // find all space surrounding droplet
    let next: number[];
    // deno-lint-ignore no-cond-assign
    while (next=queue.pop()!)
        findSpace(next[0], next[1], next[2]);

    // fill set with a droplet that is cube except space  
    const dropletSolid = new ObjectSet();
    for (let iz = 0; iz < size; iz++) {
        for (let iy = 0; iy < size; iy++) {
            for (let ix = 0; ix < size; ix++) {
                if (!space.has([ix, iy, iz])) dropletSolid.add([ix, iy, iz]);
            }
        }
    }
    return dropletSolid;
}

// find all cube edges
function calcEdges(droplet: ObjectSet<number[]>) {
    let sum = 0;
    for (let iz = 0; iz < size; iz++) {
        for (let iy = 0; iy < size; iy++) {
            for (let ix = 0; ix < size; ix++) {
                if (droplet.has([ix, iy, iz])) {
                    // left, right, up, down, in, out
                    for (const [sx,sy,sz] of [[-1,0,0], [1,0,0], [0,0,-1], [0,0,1], [0,-1,0], [0,1,0]]) {
                        if (!droplet.has([ix+sx, iy+sy, iz+sz]))
                            sum++;
                    }
                } 
            }
        }
    }
    return sum;
}

console.log(calcEdges(droplet));
console.log(calcEdges(getDropletSolid()));

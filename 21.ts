import './utils/helpers.ts';

const input = await Deno.readTextFile('21.txt');

interface Node {
    v: string;
    parts: string[];
}

const data = input.lines().map(line => {
    const [v, expr] = line.split(':');
    const parts = expr.trim().split(/\s+/g).map(val => val);
    return {v, parts} as Node;
});

const root = data.find(node => node.v === 'root')!;
const humn = data.find(node => node.v === 'humn')!;

function solve(node: Node, ref: Record<string, number>) {
    if (node.parts.length === 1) return parseInt(node.parts[0], 10);

    const v1 = node.parts[0];
    const node1 = data.find(n => n.v === v1)!;
    const v2 = node.parts[2];
    const node2 = data.find(n => n.v === v2)!;
    const r1 = solve(node1, ref);
    const r2 = solve(node2, ref);
    ref.r1 = r1;
    ref.r2 = r2;

    return eval(`r1 ${node.parts[1]} r2`);
}

const res = solve(root, {});
console.log(res);

// part 2
root.parts[1] = '===';

// difference to goal number decreased linearly
// manually tried values to minimize difference
// some of the code used:

// let n = 0;
// let prevd;
// for (let i = 0; n < 100; n++) {
//     humn.parts[0] = i.toString();
//     const ref = {};
//     const res = solve(root, ref);
//     console.log(ref);
//     const d = ref.r2 - ref.r1;
//     const id = prevd - d;
//     if (id)
//         i+= id;
//     else 
//         i++;
//     console.log(d, id);
//     prevd = d;
//     if (res === true) {
//         console.log('found it', i);
//         break;
//     }
// }
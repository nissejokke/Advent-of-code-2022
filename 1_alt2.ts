import './helpers.ts';

const data = await Deno.readTextFile('1.txt');
const vals = data.lines().chunks('').map(arr => arr.nums().sum()).sortd();

console.log(vals[0]);
console.log(vals[0] + vals[1] + vals[2]);
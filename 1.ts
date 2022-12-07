import './utils/helpers.ts';

const data = await Deno.readTextFile('1.txt');
const vals = data.lines().split('').map(arr => arr.nums().sum()).sortDesc();

console.log(vals[0]);
console.log(vals[0] + vals[1] + vals[2]);
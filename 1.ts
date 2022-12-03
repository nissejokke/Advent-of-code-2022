
const data = await Deno.readTextFile("1.txt");
const result = data.trim().split(/\n\n/g).map(chunk => {
    return chunk.split(/\n/g).reduce((av, val) => { return parseInt(val) + av; }, 0);
});
result.sort((a,b) => b-a);
console.log(result[0]);
console.log(result[0]+result[1]+result[2]);
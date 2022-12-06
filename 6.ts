const data = await Deno.readTextFile('6.txt');

function calc(limit: number): number {
    const chars = [];
    let index = 0;
    for (const char of data.split('')) {
        index++;
        chars.push(char);
        if (chars.length > limit)
            chars.shift();
        if (new Set(chars).size === limit) {
            break;
        }
    }
    return index;
}

console.log(calc(4));
console.log(calc(14));
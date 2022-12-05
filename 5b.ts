let data = await Deno.readTextFile("5.txt");
// data = `    [D]    
// [N] [C]    
// [Z] [M] [P]
//  1   2   3 

// move 1 from 2 to 1
// move 3 from 1 to 3
// move 2 from 2 to 1
// move 1 from 1 to 2`;

const [initalPos, moves] = data.split(/\n\n/);
const initalPosRows = initalPos.split(/\n/g);

// 1, 5, 9
function getIndexAtPos(pos: number): number {
    const charIndex = pos * 4 + 1;
    return charIndex;
}

const posCount = Math.max(...initalPosRows[initalPosRows.length-1].match(/\d+/g)!.map(v => parseInt(v)));
const stacks = new Array(posCount).fill(' ').map(_ => ([] as string[]));
let foundAny = true;
for (let r = 0; foundAny; r++) {
    foundAny = false;
    for (let pos = 0; pos < posCount; pos++) {
        const colIndex = getIndexAtPos(pos);
        const char = initalPosRows[r].charAt(colIndex);
        if (char && char.charCodeAt(0) >= 65) {
            stacks[pos].push(char);
            foundAny = true;
        }
    }
}

const moveRows = moves.split(/\n/g);
for (const row of moveRows) {
    const [moveCount, from, to] = row.match(/\d+/g)?.map(v => parseInt(v)) as number[];
    const cratesToMove = [];
    for (let m = 0; m < moveCount; m++) {
        const val = stacks[from-1].shift() as string;
        cratesToMove.push(val);
    }
    for (const crate of cratesToMove.reverse()) {
        stacks[to-1].unshift(crate);
    }
}

console.log(stacks.map(s => s[0]).join(''))
import './utils/helpers.ts';
import { ObjectSet } from './utils/object-set.ts';

let input = await Deno.readTextFile('25.txt');
// let exampleInput = `1=-0-2
// 12111
// 2=0=
// 21
// 2=01
// 111
// 20012
// 112
// 1=-1=
// 1-12
// 12
// 1=
// 122`.trim();

const data = input.lines();

function toDecimal(val: string): number {
    let m = 1;
    let sum = 0;
    for (const char of val.split('').reverse()) {
        if (char === '-') sum += -m;
        else if (char === '=') sum += -2*m;
        else sum += parseInt(char, 10)*m;
        m *= 5;
    }
    return sum;
}

function divide(m: number) {
    if (m === 1) return 0;
    m /= 5;
    if (m >= 1) return m;
    return 1;
}

function maxValue(m: number): number {
    if (m === 0) return 0;
    return 2*m + maxValue(divide(m));
}

function toSNAFU(val: number): string {
    if (Number.isNaN(val)) throw new Error();
    console.log(val,'to snafu')
    let m: number;
    for (m = 1; true; m *= 5) {
        if ((val / m) <= 1) break;
    }

    const seen = new ObjectSet<unknown>();
    const queue: [string, number, number][] = [['', val, m]];
    let next;
    while ((next = queue.shift())!) {
        let [sum, val, m] = next;
        if (val === 0) {
            while (sum.charAt(0) === '0')
            sum = sum.substring(1);
            while (m > 1) {
                sum += '0';
                m = divide(m);
            }
            return sum;
        }
        if (m === 0) continue;
        if (seen.has(next)) continue;
        seen.add(next);
        
        const newm = divide(m);
        const len = queue.length;
        if (val - 2*m + maxValue(newm) >= 0)
            queue.push([sum + '2', val - 2 * m, newm]);
        else if (val - m + maxValue(newm) >= 0)
            queue.push([sum + '1', val - 1 * m, newm]);
        if (val + 2*m - maxValue(newm) <= 0)
            queue.push([sum + '=', val + 2 * m, newm]);
        else if (val + m - maxValue(newm) <= 0)
            queue.push([sum + '-', val + 1 * m, newm]);
        if (queue.length === len)
        queue.push([sum + '0', val, newm]);
    }
    return 'ERROR';
}

// let test = `1=-0-2     1747
//  12111      906
//   2=0=      198
//     21       11
//   2=01      201
//    111       31
//  20012     1257
//    112       32
//  1=-1=      353
//   1-12      107
//     12        7
//     1=        3
//    122       37
//     2=        8`
// test.lines().forEach(line => {
//     const [sn, de] = line.trim().split(/\s+/g).trim();
//     const snc = toSNAFU(parseInt(de));
//     console.log('expected', 'toSNAFU(' + de + '):', sn, 'got', snc, snc === sn);
// });

const sum = data.map(val => toDecimal(val)).sum();
console.log(toSNAFU(sum));
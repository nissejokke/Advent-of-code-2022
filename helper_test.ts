import { assertEquals } from "https://deno.land/std@0.167.0/testing/asserts.ts";
import './helpers.ts';

Deno.test("string ints", () => {
    const value = '[1-2]  [99-100]'.ints();
    const expected = [1,2,99,100];

    assertEquals(value, expected);
});

Deno.test("array split", () => {
    const value = `1
2
3

4
5
6`.split(/\n/g).chunks('');
    const expected = [['1','2','3'],['4','5','6']];

    assertEquals(value, expected);
});

console.log([1,'2x',3, 3,1].nums().uniq().sum());

console.log([2,4,1].sortd());

console.log([0x01, 2,'4','xy'].sum());

console.log('[1-2]  [99-100]'.split('').nums());

console.log('[1-2]  [99-100]'.ints());

console.log([1,2,3].mean());

console.log([1,20,10].max());
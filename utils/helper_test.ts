import { assertEquals } from "https://deno.land/std@0.167.0/testing/asserts.ts";
import { LinkedList } from "https://deno.land/x/linkedlist@v1.1.1/mod.ts";
import "./helpers.ts";
import { range } from "./helpers.ts";

Deno.test("string ints", () => {
  const value = "[1-2]  [99-100]".nums();
  const expected = [1, 2, 99, 100];

  assertEquals(value, expected);
});

Deno.test("array split", () => {
  const value = `1\n2\n3\n\n4\n5\n6`.lines().split("");
  const expected = [
    ["1", "2", "3"],
    ["4", "5", "6"],
  ];

  assertEquals(value, expected);
});

Deno.test("array chunks", () => {
  const value = [1, 2, 3, 4, 5, 6].chunks(2);
  const expected = [
    [1, 2],
    [3, 4],
    [5, 6],
  ];

  assertEquals(value, expected);
});

Deno.test("array intersect", () => {
  const value = [1, 2, 3, 4].intersect([3, 4, 5, 6]);
  const expected = [3, 4];

  assertEquals(value, expected);
});

Deno.test("array union", () => {
  const value = [1, 2, 3, 4].union([3, 4, 5, 6]);
  const expected = [1, 2, 3, 4, 5, 6];

  assertEquals(value, expected);
});

Deno.test("array diff", () => {
  const value = [1, 2, 3, 4].diff([3, 4, 5, 6]);
  const expected = [1, 2];

  assertEquals(value, expected);
});

Deno.test("array sortAsc", () => {
  const value = [100, 20, 3, 300].sortAsc();
  const expected = [3, 20, 100, 300];

  assertEquals(value, expected);
});

Deno.test("range upperbound", () => {
  const value = range(3);
  const expected = [0, 1, 2];

  assertEquals(value, expected);
});

Deno.test("range upper, lowerbound", () => {
    const value = range(3, 1);
    const expected = [1, 2];
  
    assertEquals(value, expected);
});

Deno.test("removeAt", () => {
  const value = [1,2,3].removeAt(0);
  const expected = [2,3];

  assertEquals(value, expected);
});

Deno.test("removeAt #2", () => {
  const value = [1,2,3].removeAt(1);
  const expected = [1,3];

  assertEquals(value, expected);
});

Deno.test("insertAt", () => {
  const value = [1,2,3].insertAt(0, 0);
  const expected = [0,1,2,3];

  assertEquals(value, expected);
});

Deno.test("insertAt #2", () => {
  const value = [1,2,3].insertAt(1,4);
  const expected = [1,4,2,3];

  assertEquals(value, expected);
});

Deno.test("insertAt #3", () => {
  const value = [1,2,3].insertAt(-1,4);
  const expected = [1,2,4,3];

  assertEquals(value, expected);
});

Deno.test("insertAt #4", () => {
  const value = [1, 2, -3, 0, 3, -2].insertAt(4+5,4);
  const expected = [1, 2, -3, 4, 0, 3, -2];

  assertEquals(value, expected);
});

console.log([1, "2x", 3, 3, 1].nums().uniq().sum());

console.log([2, 4, 1].sortDesc());

console.log([0x01, 2, "4", "xy"].sum());

console.log("[1-2]  [99-100]".split("").nums());

console.log("[1-2]  [99-100]".nums());

console.log([1, 2, 3].mean());

console.log([1, 20, 10].max());

console.log([" 1", " 2"].trim());

console.log([1, 2, 3, 4, 5, 6].lastVals(2));

console.log("this is a  sentence".words());

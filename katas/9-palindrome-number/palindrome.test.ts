import { describe, expect, it } from "bun:test";

function isPalindrome(x: number): boolean {
  if (x < 0 || (x % 10 === 0 && x !== 0)) {
    return false;
  }

  // use mod % 10 to peel off the last digit !!
  // use bitwise "| 0" instead of Math.floor

  let reversedHalf = 0;

  while (x > reversedHalf) {
    reversedHalf = reversedHalf * 10 + (x % 10);
    x = (x / 10) | 0; // bitwise truncation faster than Math.floor
  }

  // for even we'll get a same length
  // for odd, chop a digit off
  return x === reversedHalf || x === ((reversedHalf / 10) | 0);
}

describe("isPalindrome", () => {
  it.each([1, 121])("returns true for palindroms - %d", (testCase) => {
    expect(isPalindrome(testCase)).toBeTrue();
  });

  it.each([10, -121, 1222])("returns false for non palindromes - %d", (testCase) => {
    expect(isPalindrome(testCase)).toBeFalse();
  });
});

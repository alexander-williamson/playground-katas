import { describe, expect, it } from "bun:test";

function isPalindrome(x: number): boolean {
  const chars = String(x).split("");
  let firstPos = 0;
  let lastPos = chars.length - 1;
  while (firstPos < lastPos) {
    if (chars[firstPos] !== chars[lastPos]) {
      return false;
    }
    firstPos++;
    lastPos--;
  }
  return true;
}

describe("isPalindrome", () => {
  it("returns true for palindroms", () => {
    expect(isPalindrome(1)).toBeTrue();
    expect(isPalindrome(121)).toBeTrue();
  });

  it("returns false for non palindromes", () => {
    expect(isPalindrome(-121)).toBeFalse();
    expect(isPalindrome(-121)).toBeFalse();
  });
});

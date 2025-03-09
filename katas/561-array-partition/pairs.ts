function getPermutations(nums: number[], depth: number = 0): number[][][] {
  if (nums.length === 0) return [[]];

  const results: number[][][] = [];

  for (let i = 1; i < nums.length; i++) {
    let firstPair = [nums[0], nums[i]];

    const excluded = nums.slice(1, i).concat(nums.slice(i + 1));
    const perms = getPermutations(excluded, depth + 1);

    for (const p of perms) {
      results.push([firstPair, ...p]);
    }
  }

  return results;
}

console.debug(getPermutations([1, 2, 3, 4]));

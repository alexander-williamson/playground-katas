function getPermutations(input: number[], depth: number = 0): number[][] {
  if (input.length === 0) return [[]];

  const results: number[][] = [];

  for (let i = 0; i < input.length; i++) {
    let first = input[i];

    const excluded = input.slice(0, i).concat(input.slice(i + 1));
    const perms = getPermutations(excluded, depth + 1);

    for (const p of perms) {
      results.push([first, ...p]);
    }
  }

  return results;
}

console.debug(getPermutations([1, 2, 3]));

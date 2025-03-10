function wordPattern(pattern: string, words: string): boolean {
  const splitPattern = pattern.split("");
  const splitWords = words.split(" ");

  if (splitWords.length !== splitPattern.length) return false;

  const mapCharsToWord = new Map<string, string>();
  const mapWordToChar = new Map<string, string>();

  for (let i = 0; i < splitPattern.length; i++) {
    const char = splitPattern[i];
    const word = splitWords[i];

    if (mapCharsToWord.has(char) && mapCharsToWord.get(char) !== word) return false;
    if (mapWordToChar.has(word) && mapWordToChar.get(word) !== char) return false;

    mapCharsToWord.set(char, word);
    mapWordToChar.set(word, char);
  }

  return true;
}

console.debug(wordPattern("aabb", "dog dog cat cat"));
console.debug(wordPattern("abba", "dog cat cat dog"));
console.debug(wordPattern("abab", "dog cat dog cat"));
console.debug(wordPattern("abba", "dog dog dog dog")); // should be false
console.debug(wordPattern("aaa", "dog dog dog dog")); // should be false

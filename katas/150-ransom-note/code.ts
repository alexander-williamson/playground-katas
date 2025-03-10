function canConstruct(ransomNote: string, magazine: string): boolean {
  for (const letter of ransomNote) {
    const index = magazine.indexOf(letter);
    if (index >= 0) {
      magazine = magazine.slice(0, index) + magazine.slice(index + 1);
    } else {
      return false;
    }
  }
  return true;
}

/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",

  // 1. Tell Jest to transform JS files (required for node_modules)
  transform: {
    "^.+\\.[mj]sx?$": ["ts-jest", { useESM: false, TDisolatedModules: true }],
  },

  // 2. THE FIX: Add strip-ansi and ansi-regex to the whitelist
  // We use a negative lookahead to say: "Ignore all node_modules EXCEPT these specific ones"
  transformIgnorePatterns: ["node_modules/(?!(cmd-ts|chalk|strip-ansi|ansi-regex|ymatch)/)"],
};

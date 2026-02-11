# cmd-ts

This is an experiment to get `Jest` which prefers CommonJs modules with ESM modules used by chalk which is a dependency of `cmd-ts`.

```
npm ci
npm ts-node index.ts greet Alex --shout
npm ts-node index.ts farewell Alex --shout
npm t
```

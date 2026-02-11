import { subcommands, boolean, command, positional, string, option, flag } from "cmd-ts";
import { GreetCommand } from "./GreetCommand";
import { FarewellCommand } from "./FarewellCommand";

const greetCmd = command({
  name: "greet",
  description: "Greets a person",
  args: {
    name: positional(string),
    shout: flag({
      long: "shout",
      short: "s",
    }),
  },
  handler: ({ name, shout }) => {
    const cmd = new GreetCommand(name, shout);
    cmd.execute();
  },
});

const farewellCmd = command({
  name: "farewell",
  description: "Bids farewell to a person",
  args: {
    name: positional(string),
  },
  handler: (args) => {
    const cmd = new FarewellCommand();
    cmd.execute(args.name);
  },
});

export const app = subcommands({
  name: "my-cli",
  version: "1.0.0",
  cmds: {
    greet: greetCmd,
    farewell: farewellCmd,
  },
});

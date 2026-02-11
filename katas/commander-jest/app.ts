import { Command } from "commander";
import { GreetCommandHandler, GreetCommand } from "./GreetCommand";
import { FarewellCommand } from "./FarewellCommand";

export const program = new Command();

program.name("example-app-name").description("A friendly greeting CLI").version("1.0.0");

// 1. Define the interface for your options
interface GreetOptions {
  shout: boolean;
}

program
  .command("greet")
  .description("Greets a person")
  .argument("<name>", "Name of the person")
  .option("-s, --shout", "Shout the greeting", false) // Remove the generic here
  .action((name: string, options: GreetOptions) => {
    const handler = new GreetCommandHandler();
    const command = new GreetCommand(name, options.shout);
    handler.execute(command);
  });

program
  .command("farewell")
  .description("Bids farewell")
  .argument("<name>", "Name of the person")
  .action((name: string) => {
    const cmd = new FarewellCommand();
    cmd.execute(name);
  });

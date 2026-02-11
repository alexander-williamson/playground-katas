export class GreetCommandHandler {
  constructor() {}

  public execute(command: GreetCommand): string {
    const message = `Hello, ${command.name}`;
    if (command.shout) {
      console.log(message.toUpperCase());
    } else {
      console.log(message);
    }
    return message;
  }
}

export class GreetCommand {
  constructor(
    public readonly name: string,
    public readonly shout: boolean,
  ) {}
}

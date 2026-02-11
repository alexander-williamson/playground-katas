export class GreetCommand {
  private name: string;
  private shout: boolean;

  constructor(name: string, shout: boolean) {
    this.name = name;
    this.shout = shout;
  }

  public execute(): string {
    const message = `Hello, ${this.name}`;
    if (this.shout) {
      console.log(message.toUpperCase());
    } else {
      console.log(message);
    }
    return message;
  }
}

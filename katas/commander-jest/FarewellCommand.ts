export class FarewellCommand {
  public execute(name: string): string {
    const message = `Goodbye, ${name}!`;
    console.log(message);
    return message;
  }
}

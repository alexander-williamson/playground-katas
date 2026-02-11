import { run } from "cmd-ts";
import { app } from "./cli";
import { GreetCommand } from "./GreetCommand";
import { FarewellCommand } from "./FarewellCommand";

// 1. Mock the class modules
jest.mock("./GreetCommand");
jest.mock("./FarewellCommand");

describe("CLI Integration", () => {
  beforeEach(() => {
    // Clear mock history before every test
    jest.clearAllMocks();
  });

  it("should instantiate GreetCommand with name and shout=false", async () => {
    const args = ["greet", "Alice"];

    await run(app, args);

    // 2. Verify Constructor Params
    // The class symbol 'GreetCommand' acts as the spy for the constructor
    expect(GreetCommand).toHaveBeenCalledTimes(1);
    expect(GreetCommand).toHaveBeenCalledWith("Alice", false);

    // 3. Verify execute was called on the instance
    // We access the mock instance that was created
    const mockInstance = jest.mocked(GreetCommand).mock.instances[0];
    expect(mockInstance.execute).toHaveBeenCalledTimes(1);
  });

  it("should instantiate GreetCommand with shout=true when flag is present", async () => {
    const args = ["greet", "Bob", "--shout"];

    await run(app, args);

    expect(GreetCommand).toHaveBeenCalledWith("Bob", true);
  });

  it("should run the 'farewell' subcommand", async () => {
    const args = ["farewell", "Bob"];

    await run(app, args);

    // Verify FarewellCommand interactions (assuming it wasn't refactored to use constructor args)
    expect(FarewellCommand).toHaveBeenCalledTimes(1);
    const mockInstance = jest.mocked(FarewellCommand).mock.instances[0];
    expect(mockInstance.execute).toHaveBeenCalledWith("Bob");
  });
});

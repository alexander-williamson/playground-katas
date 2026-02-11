import { program } from "./app";
import { GreetCommandHandler, GreetCommand } from "./GreetCommand";
import { FarewellCommand } from "./FarewellCommand";

// 1. Mock the Handler/Command classes
jest.mock("./GreetCommand"); // filename
jest.mock("./FarewellCommand"); // filename

describe("CLI Application Logic", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should execute the Greet logic when 'greet' is called", async () => {
    // Simulate: "node my-cli greet Alice"
    await program.parseAsync(["greet", "Alice"], { from: "user" });

    // 1. Verify the Handler was instantiated
    expect(GreetCommandHandler).toHaveBeenCalledTimes(1);

    // 2. Verify the Command was instantiated with correct args
    // We check the constructor arguments here
    expect(GreetCommand).toHaveBeenCalledTimes(1);
    expect(GreetCommand).toHaveBeenCalledWith("Alice", false);

    // 3. Verify the Handler's execute method received the Command instance
    // Get the specific instances that were created during the test
    const mockHandler = jest.mocked(GreetCommandHandler).mock.instances[0];
    const mockCommand = jest.mocked(GreetCommand).mock.instances[0];

    // Check that execute was called with the exact command object created above
    expect(mockHandler.execute).toHaveBeenCalledWith(mockCommand);
  });

  it("should pass the shout flag correctly", async () => {
    // Simulate: "node my-cli greet Bob --shout"
    await program.parseAsync(["greet", "Bob", "--shout"], { from: "user" });

    // 1. Verify Command constructor got 'true' for shout
    expect(GreetCommand).toHaveBeenCalledWith("Bob", true);

    // 2. Verify flow
    const mockHandler = jest.mocked(GreetCommandHandler).mock.instances[0];
    const mockCommand = jest.mocked(GreetCommand).mock.instances[0];

    expect(mockHandler.execute).toHaveBeenCalledWith(mockCommand);
  });

  it("should execute the Farewell logic", async () => {
    await program.parseAsync(["farewell", "Charlie"], { from: "user" });

    expect(FarewellCommand).toHaveBeenCalledTimes(1);

    const mockCmd = jest.mocked(FarewellCommand).mock.instances[0];
    expect(mockCmd.execute).toHaveBeenCalledWith("Charlie");
  });
});

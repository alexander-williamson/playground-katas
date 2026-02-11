import { run, binary } from "cmd-ts";

import { app } from "./cli";

run(binary(app), process.argv);

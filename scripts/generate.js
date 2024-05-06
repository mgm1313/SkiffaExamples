#!/usr/bin/env node

import cp from "child_process";
import path from "path";

const workspaceRoot = path.resolve(import.meta.dirname, "..");

const options = { shell: true, stdio: "inherit", env: process.env };

const names = ["reverse-api"];

for (const name of names) {
  cp.execFileSync(
    "oa42-generator",
    [
      "package",
      path.resolve(workspaceRoot, "specifications", `${name}.yaml`),
      "--package-directory",
      path.resolve(workspaceRoot, "generated", "npm", name),
      "--package-name",
      name,
      "--package-version",
      "0.1.0",
    ],
    options,
  );

  cp.execFileSync("npm", ["--workspace", name, "run", "build"], options);
}

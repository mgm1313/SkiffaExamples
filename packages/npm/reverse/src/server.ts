import path from "path";
import * as api from "reverse-api";
import * as shared from "shared";
import * as authenticationHandlers from "./authentication-handlers/index.js";
import { Authentication } from "./authentication-handlers/types.js";
import * as operationHandlers from "./operation-handlers.js";
import { projectRoot } from "./root.js";

main();

// entrypoint for the server
async function main() {
  // create the server
  const server = new api.server.Server<Authentication>();

  // register authentication handlers
  server.registerAuthentications(authenticationHandlers);

  // register all operations
  server.registerOperations(operationHandlers);

  // serve some static files
  server.registerMiddleware(
    api.lib.createServeMiddleware({
      "/": {
        contentType: "text/html",
        path: path.join(projectRoot, "public", "index.html"),
      },
      "/client.js": {
        contentType: "application/javascript",
        path: path.join(projectRoot, "bundled", "client.js"),
      },
      "/client.js.map": {
        contentType: "application/json",
        path: path.join(projectRoot, "bundled", "client.js.map"),
      },
      "/favicon.ico": false,
    }),
  );

  // get port to listen to from the environment or use the default
  const port = Number(process.env.PORT ?? 8080);

  console.info(`Starting server...`);
  {
    // listen to the specified port and send requests to the server. We are
    // using the `using` syntax here, the server will be disposed (terminated)
    // at the end of the current block.
    await using listener = await api.lib.listen(server, { port });

    console.info(`Server started (${listener.port})`);

    // wait for a user to send a signal and eventually stop listening.
    await shared.waitForSignal("SIGINT", "SIGTERM");

    console.info("Stopping server...");

    // Thanks to the `using` keyword (and a proper implementation of the dispose)
    // the server is terminated here, at the end of this block.
  }
  console.info(`Server stopped`);
}

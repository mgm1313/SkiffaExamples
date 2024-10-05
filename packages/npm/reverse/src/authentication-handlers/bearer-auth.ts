import * as api from "reverse-api";
import { Authentication } from "./types.js";

export const bearerAuth: api.server.BearerAuthAuthenticationHandler<Authentication> = async (
  token,
) => {
  // check if the token is valid
  if (token === "123") {
    return {
      userId: "123",
    };
  }

  // return undefined if the token is invalid
  return undefined;
};

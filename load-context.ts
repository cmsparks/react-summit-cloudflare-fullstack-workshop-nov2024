import { type PlatformProxy } from "wrangler";
import { type AppLoadContext } from "@remix-run/cloudflare";
import aiMock from "./app/card-manager/test/ai.mock";

type Cloudflare = Omit<PlatformProxy<Env>, "dispose">;

declare module "@remix-run/cloudflare" {
  interface AppLoadContext {
    cloudflare: Cloudflare;
  }
}

type GetLoadContext = (args: {
  request: Request;
  context: { cloudflare: Cloudflare };
}) => AppLoadContext;

export const getLoadContext: GetLoadContext = ({ context }) => {
  const env = context.cloudflare.env;
  let ai = env.AI;

  if (env.mode === "e2e-test") {
    ai = aiMock() as unknown as Ai;
  }

  return {
    ...context,
    cloudflare: {
      ...context.cloudflare,
      env: {
        ...env,
        AI: ai,
      },
    },
  };
};

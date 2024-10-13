import { type PlatformProxy } from "wrangler";
import { type AppLoadContext } from "@remix-run/cloudflare";

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
    const imageArray = new Uint8Array();
    const imageBlob = new Blob([imageArray]);
    ai = {
      async run(..._: unknown[]) {
        await new Promise((resolve) => setTimeout(resolve, 500));
        return imageBlob.stream();
      },
    } as Ai;
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

import { type MockAi } from "./ai.mock";

declare module "cloudflare:test" {
  interface ProvidedEnv {
    KV: KVNamespace;
    AI: MockAi;
    R2: R2Bucket;
  }
}

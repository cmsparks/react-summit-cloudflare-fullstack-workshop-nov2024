import { afterEach, describe, it, vi } from "vitest";
import { env } from "cloudflare:test";
import { CardManagerKV } from "../card-manager-kv";

afterEach(() => {
  vi.spyOn(env.AI, "run").mockRestore();
});

describe("test CardManagerKV class", () => {
  const cardManager = new CardManagerKV(env);

  it("generateAndSaveCard()", async () => {
    // TODO
  });

  it("generateCardImage()", async () => {
    // TODO
  });

  it("getCard(): null card", async () => {
    // TODO
  });

  it("getCard(): non-null card", async () => {
    // TODO
  });

  it("getCardImage(): null card", async () => {
    // TODO
  });

  it("getCardImage(): non-null card", async () => {
    // TODO
  });
});

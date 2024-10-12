import { afterEach, describe, it, vi } from "vitest";
import { env } from "cloudflare:test";
import { CardManagerR2 } from "../card-manager-r2";

afterEach(() => {
  vi.spyOn(env.AI, "run").mockRestore();
});

describe("test CardManagerR2 class", () => {
  const cardManager = new CardManagerR2(env);

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

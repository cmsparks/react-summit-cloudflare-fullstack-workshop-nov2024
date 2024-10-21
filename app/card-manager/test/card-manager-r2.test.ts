import { afterEach, assert, describe, expect, it, vi } from "vitest";
import { env } from "cloudflare:test";
import { CardManagerR2 } from "../card-manager-r2";

afterEach(() => {
  vi.spyOn(env.AI, "run").mockRestore();
});

describe("test CardManagerR2 class", () => {
  const cardManager = new CardManagerR2(env);

  it("generateAndSaveCard()", async () => {
    const title = "test title";
    const description = "test description";

    // create a large array that gets buffered into multiple chunks
    const imageArray = Uint8Array.from({ length: 100000 }, () =>
      Math.floor(Math.random() * 100)
    );
    const imageBlob = new Blob([imageArray]);
    const stream = imageBlob.stream();
    const expectedPrompt = {
      prompt: [
        `Based on the following title and description, generate card artwork for a trading card`,
        `title: ${title}`,
        `description: ${description}`,
      ].join("\n"),
    };
    const mockAI = vi.spyOn(env.AI, "run").mockResolvedValueOnce(stream);

    const cardId = await cardManager.generateAndSaveCard({
      title,
      description,
    });

    expect(mockAI).toHaveBeenCalledWith(
      "@cf/stabilityai/stable-diffusion-xl-base-1.0",
      expectedPrompt
    );
    expect(mockAI).toHaveBeenCalledOnce();

    // validate data in R2
    const r2cardData = await env.R2.get(cardId);
    assert(r2cardData !== null);
    expect(new Uint8Array(await r2cardData.arrayBuffer())).toStrictEqual(
      imageArray
    );

    // and in KV
    const kvCard = (await env.KV.get(cardId, "json")) as Card;
    expect(kvCard.title).toStrictEqual("test title");
    expect(kvCard.description).toStrictEqual("test description");
  });

  it("generateCardImage()", async () => {
    const title = "test title";
    const description = "test description";

    const imageData = new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8]);
    const expectedPrompt = {
      prompt: [
        `Based on the following title and description, generate card artwork for a trading card`,
        `title: ${title}`,
        `description: ${description}`,
      ].join("\n"),
    };
    const mockAI = vi.spyOn(env.AI, "run").mockResolvedValueOnce(imageData);

    const cardData = await cardManager.generateCardImage({
      title,
      description,
    });

    expect(cardData).toStrictEqual(imageData);

    expect(mockAI).toHaveBeenCalledWith(
      "@cf/stabilityai/stable-diffusion-xl-base-1.0",
      expectedPrompt
    );
    expect(mockAI).toHaveBeenCalledOnce();
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

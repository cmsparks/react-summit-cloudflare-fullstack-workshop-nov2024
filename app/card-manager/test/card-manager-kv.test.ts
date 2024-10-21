import { afterEach, assert, describe, expect, it, vi } from "vitest";
import { env } from "cloudflare:test";
import { CardManagerKV } from "../card-manager-kv";

afterEach(() => {
  vi.spyOn(env.AI, "run").mockRestore();
});

describe("test CardManagerKV class", () => {
  const cardManager = new CardManagerKV(env);

  it("generateCardImage()", async () => {
    const title = "test title";
    const description = "test description";

    const arr = new Uint8Array([1, 2, 3, 4]);
    const blob = new Blob([arr]);
    const stream = blob.stream();

    const expectedPrompt = {
      prompt: [
        `Based on the following title and description, generate card artwork for a trading card`,
        `title: ${title}`,
        `description: ${description}`,
      ].join("\n"),
    };
    const mockAI = vi.spyOn(env.AI, "run").mockResolvedValueOnce(stream);

    const cardData = await cardManager.generateCardImage({
      title,
      description,
    });

    expect(cardData).toStrictEqual(stream);

    expect(mockAI).toHaveBeenCalledWith(
      "@cf/stabilityai/stable-diffusion-xl-base-1.0",
      expectedPrompt
    );
    expect(mockAI).toHaveBeenCalledOnce();
  });

  it("generateAndSaveCard()", async () => {
    const title = "test title";
    const description = "test description";

    // create a large array that gets buffered into multiple chunks
    const imageArray = new Uint8Array([1, 2, 3, 4]);
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

    // validate image in KV
    const kvCardImage = await env.KV.get(`/image/${cardId}`, "arrayBuffer");
    assert(kvCardImage !== null);
    expect(kvCardImage).toStrictEqual(imageArray.buffer);

    // and data
    const kvCard = (await env.KV.get(`/data/${cardId}`, "json")) as Card;
    expect(kvCard.title).toStrictEqual("test title");
    expect(kvCard.description).toStrictEqual("test description");
  });

  it("getCard(): null card", async () => {
    const nullCard = await cardManager.getCard("nonexistent-key");

    expect(nullCard).toBeNull();
  });

  it("getCard(): non-null card", async () => {
    const uuid = crypto.randomUUID();

    await env.KV.put(
      `/data/${uuid}`,
      JSON.stringify({
        title: "test title",
        description: "test description",
      })
    );

    const card = await cardManager.getCard(uuid);
    expect(card?.title).toStrictEqual("test title");
    expect(card?.description).toStrictEqual("test description");
    expect(card?.imageUrl).toMatch(/^\/image\/.*$/);
  });

  it("getCardImage(): null card", async () => {
    // TODO
  });

  it("getCardImage(): non-null card", async () => {
    // TODO
  });
});

import { afterEach, assert, describe, expect, it, vi } from "vitest";
import { env } from "cloudflare:test";
import { CardManagerKV } from "../card-manager-kv";

afterEach(() => {
  vi.spyOn(env.AI, "run").mockRestore();
});

describe("test CardManagerKV class", () => {
  const cardManager = new CardManagerKV(env);

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

    // validate image in KV
    const kvCardImage = await env.KV.get(`/image/${cardId}`, "arrayBuffer");
    assert(kvCardImage !== null);
    expect(new Uint8Array(kvCardImage)).toStrictEqual(imageArray);

    // and data
    const kvCard = (await env.KV.get(`/data/${cardId}`, "json")) as Card;
    expect(kvCard.title).toStrictEqual("test title");
    expect(kvCard.description).toStrictEqual("test description");
  });

  it("generateCardArt()", async () => {
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

    const cardData = await cardManager.generateCardArt({ title, description });

    expect(cardData).toStrictEqual(imageData);

    expect(mockAI).toHaveBeenCalledWith(
      "@cf/stabilityai/stable-diffusion-xl-base-1.0",
      expectedPrompt
    );
    expect(mockAI).toHaveBeenCalledOnce();
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
    const nullCard = await cardManager.getCardImage("nonexistent-key");

    expect(nullCard).toBeNull();
  });

  it("getCardImage(): non-null card", async () => {
    const uuid = crypto.randomUUID();

    const imageData = new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8]);

    await env.KV.put(`/image/${uuid}`, imageData);

    const cardImage = await cardManager.getCardImage(uuid);
    expect(
      new Uint8Array(await new Response(cardImage).arrayBuffer())
    ).toStrictEqual(imageData);
  });
});

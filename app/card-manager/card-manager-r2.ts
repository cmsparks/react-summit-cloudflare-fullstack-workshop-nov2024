import { convertReadableStreamToUint8Array } from "./utils";

/**
 * Trading card manager class that wraps KV, R2, and Workers AI. Handles all of our "business" logic
 */
export class CardManagerR2 implements CardManager {
  constructor(private env: Env) {}

  /**
   * @param card metadata for the trading card, including the title and description
   * @returns the card image data (as a readable stream)
   */
  async generateCardImage(
    card: Pick<Card, "title" | "description">
  ): Promise<ReadableStream<Uint8Array>> {
    // create prompt
    const input = {
      prompt: [
        `Based on the following title and description, generate card artwork for a trading card`,
        `title: ${card.title}`,
        `description: ${card.description}`,
      ].join("\n"),
    };

    // generate image data from aiBinding
    const imageData = await this.env.AI.run(
      "@cf/stabilityai/stable-diffusion-xl-base-1.0",
      input
    );

    return imageData;
  }

  /**
   * @param card card title and description to generate
   * @returns card id in KV
   */
  async generateAndSaveCard(
    card: Pick<Card, "title" | "description">
  ): Promise<string> {
    const key = crypto.randomUUID();

    const cardData = await this.generateCardImage(card);

    // we don't know the length of the readable stream returned from ai.run(),
    // so we need to read it all into a buffer so we can use it in env.R2.put()
    const arrayBuffer = await convertReadableStreamToUint8Array(cardData);

    await Promise.all([
      this.env.R2.put(key, arrayBuffer),
      this.env.KV.put(key, JSON.stringify(card)),
    ]);

    return key;
  }

  /**
   * @param cardId id of the card get
   * @returns card info if found, null otherwise
   */
  async getCard(cardId: string): Promise<Card | null> {
    // TODO
    throw new Error("Unimplemented");
  }

  /**
   * @param cardId id of the image's card
   * @returns card image data as a readable stream if found, null otherwise
   */
  async getCardImage(
    cardId: string
  ): Promise<ReadableStream<Uint8Array> | null> {
    // TODO
    throw new Error("Unimplemented");
  }
}

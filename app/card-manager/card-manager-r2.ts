/**
 * Trading card manager class that wraps KV, R2, and Workers AI. Handles all of our "business" logic
 */
export class CardManagerR2 implements CardManager {
  constructor(private env: Env) {}

  async generateAndSaveCard(
    card: Pick<Card, "title" | "description">
  ): Promise<string> {
    // TODO
    throw new Error("Unimplemented");
  }

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

  async getCard(cardId: string): Promise<Card | null> {
    // TODO
    throw new Error("Unimplemented");
  }

  async getCardImage(
    cardId: string
  ): Promise<ReadableStream<Uint8Array> | null> {
    // TODO
    throw new Error("Unimplemented");
  }
}

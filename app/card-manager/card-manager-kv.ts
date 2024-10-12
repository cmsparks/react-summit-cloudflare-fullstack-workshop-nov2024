/**
 * Trading card manager class that wraps KV, and Workers AI. Handles all of our "business" logic
 */
export class CardManagerKV implements CardManager {
  constructor(private env: Env) {}

  /**
   * @param card card title and description to generate
   * @returns card id in KV
   */
  async generateAndSaveCard(
    card: Pick<Card, "title" | "description">
  ): Promise<string> {
    // TODO
    throw new Error("Unimplemented");
  }

  /**
   * @param card metadata for the trading card, including the title and description
   * @returns the card image data (as a readable stream)
   */
  async generateCardImage(
    card: Pick<Card, "title" | "description">
  ): Promise<ReadableStream<Uint8Array>> {
    // TODO
    throw new Error("Unimplemented");
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

interface Env {
  mode?: "e2e-test";
}

interface Card {
  title: string;
  description: string;
  imageUrl: string;
}

/**
 * Trading card manager class that wraps KV, R2, and Workers AI. Handles all of our "business" logic
 */
interface CardManager {
  /**
   * @param card card title and description to generate
   * @returns card id in KV
   */
  generateAndSaveCard(
    card: Pick<Card, "title" | "description">
  ): Promise<string>;

  /**
   * @param card metadata for the trading card, including the title and description
   * @returns the card image data (as a readable stream)
   */
  generateCardImage(
    card: Pick<Card, "title" | "description">
  ): Promise<ReadableStream<Uint8Array>>;

  /**
   * @param cardId id of the card get
   * @returns card info if found, null otherwise
   */
  getCard(cardId: string): Promise<Card | null>;

  /**
   * @param cardId id of the image's card
   * @returns card image data as a readable stream if found, null otherwise
   */
  getCardImage(cardId: string): Promise<ReadableStream<Uint8Array> | null>;
}

// This could be replaced with a Zod validator
export function isCard(card: unknown): card is Card {
  return (
    typeof card === "object" &&
    card !== null &&
    "title" in card &&
    typeof card.title === "string" &&
    "description" in card &&
    typeof card.description === "string" &&
    "imageUrl" in card &&
    typeof card.imageUrl === "string"
  );
}

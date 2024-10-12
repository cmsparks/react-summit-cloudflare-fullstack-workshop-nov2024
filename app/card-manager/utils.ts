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

export async function convertReadableStreamToUint8Array(
  stream: ReadableStream<Uint8Array>
): Promise<Uint8Array> {
  // 1) read the entire ReadableStream to get the data and length
  const reader = stream.getReader();
  const buffer = [];
  let totalLength = 0;
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer.push(value);
    totalLength += value.byteLength;
  }

  // 2) convert to a statically sized Uint8Array()
  const arrayBuffer = new Uint8Array(totalLength);
  let offset = 0;
  for (const value of buffer) {
    arrayBuffer.set(value, offset);
    offset += value.byteLength;
  }

  return arrayBuffer;
}

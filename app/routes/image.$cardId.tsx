import { type LoaderFunctionArgs } from "@remix-run/cloudflare";
import { CardManager } from "~/card-manager";

export async function loader({ context, params }: LoaderFunctionArgs) {
  const cardManager = new CardManager(context.cloudflare.env);

  const cardImage = await cardManager.getCardImage(params.cardId!);

  if (!cardImage) {
    throw new Response(null, {
      status: 404,
      statusText: "Not Found",
    });
  }

  return new Response(cardImage, {
    headers: {
      "content-type": "image/png",
    },
  });
}

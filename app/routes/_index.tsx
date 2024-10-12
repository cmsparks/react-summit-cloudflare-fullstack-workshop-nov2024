import type {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  MetaFunction,
} from "@remix-run/cloudflare";
import { redirect, useLoaderData, useNavigation } from "@remix-run/react";
import Card from "~/components/card";
import CardForm from "~/components/cardForm";

export const meta: MetaFunction = () => {
  return [
    { title: "Trading Card Generator" },
    { name: "description", content: "A trading card generator" },
  ];
};

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const searchParams = url.searchParams;
  const cardId = searchParams.get("card-id");

  if (!cardId) {
    return null;
  }

  return {
    title: "placeholder title",
    description: "placeholder description",
    imageUrl: "image/placeholder",
  } satisfies Card;
}

export async function action({ request }: ActionFunctionArgs) {
  const body = await request.formData();
  const title = body.get("card-title");
  const description = body.get("card-description");

  console.log({
    title,
    description,
  });

  const sleep = new Promise<void>((resolve) => setTimeout(resolve, 1_000));
  await sleep;

  const cardId = "CARD_ID_PLACEHOLDER";

  return redirect(`/?card-id=${cardId}&new=1`);
}

type LoaderType = Awaited<ReturnType<typeof loader>>;

export default function Index() {
  const cardDetails = useLoaderData<LoaderType>();

  const { state } = useNavigation();
  const submitting = state === "submitting";

  return (
    <main className="main">
      {cardDetails === null ? (
        <CardForm submitting={submitting} />
      ) : (
        <Card card={cardDetails} />
      )}
    </main>
  );
}

import type {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  MetaFunction,
} from "@remix-run/cloudflare";
import { redirect, useLoaderData, useNavigation } from "@remix-run/react";
import { CardManager } from "~/card-manager";
import Card from "~/components/card";
import CardForm from "~/components/cardForm";

export const meta: MetaFunction = () => {
  return [
    { title: "Trading Card Generator" },
    { name: "description", content: "A trading card generator" },
  ];
};

export async function loader({ context, request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const searchParams = url.searchParams;
  const cardId = searchParams.get("card-id");

  if (!cardId) {
    return null;
  }

  const cardManager = new CardManager(context.cloudflare.env);

  const card = await cardManager.getCard(cardId);

  return card;
}

export async function action({ context, request }: ActionFunctionArgs) {
  const body = await request.formData();
  const title = body.get("card-title");
  const description = body.get("card-description");

  const cardManager = new CardManager(context.cloudflare.env);

  if (!title) {
    return { error: "no title was provided" };
  }

  if (title instanceof File) {
    return { error: "title cannot be a file" };
  }

  if (!description) {
    return { error: "no description was provided" };
  }

  if (description instanceof File) {
    return { error: "description cannot be a file" };
  }

  const cardId = await cardManager.generateAndSaveCard({
    title,
    description,
  });

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

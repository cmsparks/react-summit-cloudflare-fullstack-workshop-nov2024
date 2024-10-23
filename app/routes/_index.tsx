import type {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  MetaFunction,
} from "@remix-run/cloudflare";
import { Form, redirect, useLoaderData } from "@remix-run/react";

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

  return redirect(`/?card-id=${cardId}`);
}

export default function Index() {
  const cardDetails = useLoaderData<typeof loader>();

  return (
    <main className="main">
      {cardDetails === null ? (
        <Form className="card-form" method="post">
          <div className="card">
            <div className="card__image"></div>
            <input
              className="card__title card__title--input"
              type="text"
              name="card-title"
              id="card-title"
              placeholder="title"
              required
            />
            <textarea
              className="card__description card__description--input"
              name="card-description"
              id="card-description"
              placeholder="description..."
              required
            ></textarea>
          </div>
          <button className="btn btn--generate">Generate</button>
        </Form>
      ) : (
        <div className="card">
          <img
            className="card__image"
            src={cardDetails.imageUrl}
            alt="card illustration"
          />
          <p className="card__title">{cardDetails.title}</p>
          <p className="card__description">{cardDetails.description}</p>
        </div>
      )}
    </main>
  );
}

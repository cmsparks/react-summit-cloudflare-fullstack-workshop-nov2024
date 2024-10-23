import type {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  MetaFunction,
} from "@remix-run/cloudflare";
import {
  Form,
  redirect,
  useActionData,
  useLoaderData,
  useNavigation,
} from "@remix-run/react";
import { CardManager } from "~/card-manager";

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

  const errors: { title?: string; description?: string } = {};

  if (!title) {
    errors.title = "no title was provided";
  }

  if (title instanceof File) {
    errors.title = "title cannot be a file";
  }

  if (!description) {
    errors.description = "no description was provided";
  }

  if (description instanceof File) {
    errors.description = "description cannot be a file";
  }

  if (Object.keys(errors).length > 0) {
    return { errors };
  }

  const cardManager = new CardManager(context.cloudflare.env);

  const cardId = await cardManager.generateAndSaveCard({
    title: title as string,
    description: description as string,
  });

  return redirect(`/?card-id=${cardId}`);
}

export default function Index() {
  const cardDetails = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();

  const { state } = useNavigation();
  const submitting = state === "submitting";

  return (
    <main className="main">
      {cardDetails === null ? (
        <Form className="card-form" method="post">
          {submitting && (
            <div className="card-form__loading">
              <div className="loader"></div>
            </div>
          )}
          <div className="card">
            <div className="card__image"></div>
            <input
              className="card__title card__title--input"
              type="text"
              name="card-title"
              id="card-title"
              disabled={submitting}
              placeholder="title"
              required
            />
            {actionData?.errors?.title ? (
              <span className="card-form__error">
                {actionData?.errors.title}
              </span>
            ) : null}
            <textarea
              className="card__description card__description--input"
              name="card-description"
              id="card-description"
              disabled={submitting}
              placeholder="description..."
              required
            ></textarea>
            {actionData?.errors?.description ? (
              <span className="card-form__error">
                {actionData?.errors.description}
              </span>
            ) : null}
          </div>
          <button disabled={submitting} className="btn btn--generate">
            Generate
          </button>
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

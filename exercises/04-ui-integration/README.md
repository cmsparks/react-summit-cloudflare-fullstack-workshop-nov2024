# UI Integration Exercise

## Intro

At this point we've implemented both our Remix base UI and our card generation business logic, but separately.

We're now ready to combine the two to create a fully functional card generation application, which accepts inputs from the user, generates the card and displays it to the user.

> [!Note]
> If you've chosen to use the `cardManager` KV implementation you need to change the value
> of the `implementation` variable in `app/card-manager/index.ts` to `"KV"`

## The exercise

### Updating the index page

Just as a reminder, our `app/routes/_index.tsx` has the following structure:

```tsx
import { Form, redirect, useActionData, useLoaderData } from "@remix-run/react";

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const searchParams = url.searchParams;
  const cardId = searchParams.get("card-id");

  if (!card) {
    return null;
  }

  return {
    // ...
  };
}

export async function action({ request }: ActionFunctionArgs) {
  const body = await request.formData();
  const title = body.get("card-title");
  const description = body.get("card-description");

  // ...

  return redirect(`/?card-id=${cardId}`);
}

export default function Index() {
  const cardDetails = useLoaderData();

  // ...

  return <>{/* ... */}</>;
}
```

The component itself is already implemented and doesn't require modifications, what we need to modify are
our `loader` and `action` functions so that they make use of our `CardManager` class.

### Step 1 - Integrating the `action`

- update the `action` function, after the validation phase, to:

  - not log the title and description nor to sleep for one second (none of this is needed anymore)
  - get access the Cloudflare bindings (via [`context.cloudflare.env`](https://remix.run/docs/en/main/guides/vite#bindings))
  - use the bindings to create a new instance of the `CardManager` class
  - use the `CardManager` instance's `generateAndSaveCard` method to create the card
  - use the id obtained from the `generateAndSaveCard` method as the card id (instead of `CARD_ID_PLACEHOLDER`)

### Step 2 - Integrating the `loader`

- update the `loader` function, after having gathered a card id, to:

  - get access the Cloudflare bindings
  - use the bindings to create a new instance of the `CardManager` class
  - use the `CardManager` instance's `getCard` method to retrieve the card information
  - return the card details obtained from the `getCard` method (instead of returning a placeholder card)

### Step 3 - Implementing the image route

You should now be able to generate a card by using our form and then be able to view the generated card. You'll notice that the card image, although actually generated, is not being displayed, that is because we need to implement the image serving logic.

In other words, in our card displaying UI we end up with an `img` element with `src` set to `/image/<CARD_ID>` and the problem here is that the `/image/<CARD_ID>` route is not actually implemented.

To implement this functionality we need to update the content of the `app/routes/image.$cardId.tsx` file, this will be our [resource route](https://remix.run/docs/en/main/guides/resource-routes) that serves card images to our application's UI.

For now its implementation was just one that would always return `500` error responses, we're now ready to properly implement it.

What we want is for our route to use the provided card id to retrieve the card's image from our R2 bucket and simply return it as a `image/png` stream.

So, remove the current content of the route's `loader` function and similarly to what we did in the index route, update it to:

- get the card id from the [route's URL parameters](https://remix.run/docs/en/main/file-conventions/routes#dynamic-segments)
- get access the Cloudflare bindings
- use the bindings to create a new instance of the `CardManager` class
- use the `CardManager` instance's `getCardImage` method to retrieve the card image using the provided card id
- if the image is not found return a 404 response
- otherwise return the image readable stream wrapped in a `Response` object with its `content-type` header set to `'image/png'`

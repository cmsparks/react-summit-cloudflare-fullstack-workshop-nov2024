# UI Integration Exercise

## Intro

At this point we've implemented both our Remix base UI and our card generation business logic,
we're now ready to combine the two to create a fully functional card generation application.

> [!NOTE]
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

  return redirect(`/?card-id=${cardId}&new=1`);
}

export default function Index() {
  const cardDetails = useLoaderData();

  // ...

  return <>{/* ... */}</>;
}
```

The component itself is already implemented and doesn't require modifications, what we need to modify are
our `loader` and `action` functions so that they make use of our `CardManager` class.

So in any order:

- update the `action` function to:

  - get access the Cloudflare bindings
  - use the bindings to create a new instance of the `CardManager` class
  - use the `CardManager` instance's `generateAndSaveCard` method to create the card (instead of using `crypto.randomUUID()`)
  - use the card id obtained from the `generateAndSaveCard` method in the its `redirect` call
  - not to log the title and description nor to sleep for one second (none of this is needed anymore)

- update the `loader` function to:

  - get access the Cloudflare bindings
  - use the bindings to create a new instance of the `CardManager` class
  - use the `CardManager` instance's `getCard` method to retrieve the card information
  - return the card details obtained from the `getCard` method

### Updating the image route

We haven't yet dealt with the `app/routes/image.$cardId.tsx` file, this is a [resource route](https://remix.run/docs/en/main/guides/resource-routes) that
we need to serve to out application card images.

We're now ready to properly implement it instead of simply returning a 500 response.

Similarly to what you did in the index route, update the `loader` function to:

- get access the Cloudflare bindings
- get the card id from the route's URL parameters
- use the bindings to create a new instance of the `CardManager` class
- use the `CardManager` instance's `getCardImage` method to retrieve the card image
- if the image is not found return a 404 response
- otherwise return the image readable stream wrapper in a `Response` object with its `content-type` header set to `'image/png'`

## Useful Resources

- [Remix - How to access Cloudflare Bindings](https://remix.run/docs/en/main/guides/vite#bindings)
- [Remix - Dynamic Segments](https://remix.run/docs/en/main/file-conventions/routes#dynamic-segments) (includes how to retrieve URL parameters)

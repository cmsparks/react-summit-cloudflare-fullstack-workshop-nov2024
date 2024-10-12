# UI Card Form Exercise

## Intro

The base of the application has already be implemented and ready to be worked on.

To start the application simply install its dependencies via:

```sh
npm i
```

and run the application via:

```sh
npm run dev
```

You can then navigate to [localhost:5173](http://localhost:5173) (or whatever url the terminal presents to you) to view and interact with the application.

In the `app/routes` directory you can see two files:

- `_index.tsx` and
- `image.$cardId.tsx`

They follow [Remix's file based routing convention](https://remix.run/docs/en/main/file-conventions/routes), the latter is present to implement a route for serving our card images, we'll deal with this file in a later exercise.

The former implements the primary and only view of our application and is the one we'll be focusing on now.

## The exercise

Inside `_index.tsx` you can see the following component:

```tsx
/* TODO: add loader and action */

export default function Index() {
  const cardDetails = /* TODO: properly implement */ {
    title: "_PLACEHOLDER_TITLE_",
    description: "_PLACEHOLDER_DESCRIPTION_",
    imageUrl: "/image/_PLACEHOLDER_IMAGE_",
  };

  return (
    <main className="main">
      {cardDetails === null ? (
        <>{/* TODO: implement */ ""}</>
      ) : (
        <Card card={cardDetails}></Card>
      )}
    </main>
  );
}
```

The exercise's goal is implementing the parts now flagged with the `TODO` comment and consists in the following steps:

- implement a form using Remix's `Form` component that is displayed when there are no `cardDetails`
  - the form should have two inputs:
    - card title (`input`)
    - card description (`textarea`)
  - and a submission button
- implement an `action` that upon a form submission:
  - logs the provided title and description values
  - waits for one second (simulating a server/network delay)
  - generates a card id via `crypto.randomUUID()`
  - redirects the user to `/?card-id=${cardId}&new=1`
- implement a `loader` that:
  - checks if the request contains a card id search parameter
    - if there is no card id returns `null`
    - if there is a card id returns a simple placeholder object matching the
      `Card` interface

## Optional Exercise

If you've still got some time to spare as additional/optional steps:

- add a loader indicator that is displayed during the action's one second wait (so that the user can see that something is happening)
- create a new `CardForm` component in `app/components` and move all the form logic there

## Useful Resources

- [Remix `Form` component](https://remix.run/docs/en/main/components/form)
- [Remix `loader`s](https://remix.run/docs/en/main/discussion/data-flow#route-loader)
- [Remix `action`s](https://remix.run/docs/en/main/discussion/data-flow#route-action)

- [Remix `useNavigate().state`](https://remix.run/docs/en/main/hooks/use-navigation#navigationstate) (for the loading indicator)

## Styling

As styling is not part of this workshop, if you want your application to be styled by the css we've wrote ahead of time please make sure that you're form's html structure looks like this:

```
Form.card-form
├── (optional) div.card-form__loading>div.loader
├── div.card
|   ├── div.card__image (empty div used as the image placeholder)
|   ├── input.card__title.card__title--input
│   └── texarea.card__description.card__description--input
└── button.btn.btn--generate
```

## Deploying

If you want to deploy your Worker, first log into our Cloudflare account with `wrangler` using

```sh
npx wrangler login
```

and then, run the deploy command via:

```sh
npm run deploy
```

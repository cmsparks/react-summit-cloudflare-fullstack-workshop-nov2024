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

They follow [Remix's file based routing convention](https://remix.run/docs/en/main/file-conventions/routes).

The former implements the primary and only view of our application and is the one we'll be focusing on now.

While the latter is there to implement a route for serving our card images, we'll ignore this for now as we'll deal with it in a later exercise.

## The exercise

Our application as of now only shows us a card populated by placeholder values, our goal in this exercise is to instead display a form that accepts the
card title and description and that upon submission redirects to this card view.

Inside `_index.tsx` you can see the following component:

```tsx
/* TODO: add loader and action */

export default function Index() {
  const cardDetails = /* TODO: implement */ {
    title: "_PLACEHOLDER_TITLE_",
    description: "_PLACEHOLDER_DESCRIPTION_",
    imageUrl: "/image/_PLACEHOLDER_IMAGE_",
  };

  return (
    <main className="main">
      {cardDetails === null ? (
        <>
        {/* TODO: implement */ ""}
        </>
      ) : (
        /* card displaying jsx */
      )}
    </main>
  );
}
```

In this exercise we will replace all the `TODO` comments with actual code.

### Step 1 - Implementing the form

- in order to work on this let's start by commenting out the `cardDetails` declaration and replacing it with `const cardDetails = null as null|Card;`

- next, implement a form using [Remix `Form` component](https://remix.run/docs/en/main/components/form) that is displayed when there are no `cardDetails`
  - the `Form` should have two fields:
    - card title (`input` element)
    - card description (`textarea` element)
  - and a submission button
  - the `Form` should have a [`method` prop](https://remix.run/docs/en/main/components/form#method) set to `'post'`
  - the `Form` should not have an [`action` prop](https://remix.run/docs/en/main/components/form#action)

> [!Note]
>
> ## Styling
>
> As styling is not part of this workshop, if you want your application to be styled by the css we've wrote ahead of time please make sure that you're form's html structure looks like this:
>
> ```
> form.card-form
> ├── div.card
> |   ├── div.card__image (empty div used as the image placeholder)
> |   ├── input.card__title.card__title--input
> │   └── texarea.card__description.card__description--input
> └── button.btn.btn--generate
> ```

### Step 2 - Implementing the action

If you now try submitting the form you will get a `405 Method Not Allowed` error, that is because we haven't implemented any functionality that accepts and handles
the form submission. We can do that by using [Remix `action`s](https://remix.run/docs/en/main/discussion/data-flow#route-action). Actions are simply functions that you define and export from your route and that handle form submissions.

- So next, implement an `action` that upon a form submission:
  - retrieves the title and description values (from [request.formData()](https://developer.mozilla.org/en-US/docs/Web/API/Request/formData))
  - logs such title and description values
  - waits for one second (simulating a server/network delay)
  - sets a `cardId` variable to the string `'CARD_ID_PLACEHOLDER'`
  - redirects the user to `/?card-id=${cardId}` (via the [`redirect`](https://remix.run/docs/en/main/utils/redirect) utility)

### Step 3 - Implementing the loader

If you now submit your form you will see the appropriate values being logged in the terminal, you should also get redirected to the correct url, but there aren't actually any UI changes. That's what we'll address now using [Remix `loader`s](https://remix.run/docs/en/main/discussion/data-flow#route-loader). Similarly to actions, loaders are functions that you export from your route and that allow you to load and pass data to your React component.

- So, implement a `loader` that:

  - checks if the request contains a `card-id` [URL search parameter](https://remix.run/docs/en/main/guides/data-loading#url-search-params)
    - if there is no `card-id` returns `null`
    - if there is a card id returns a simple placeholder object matching the
      `Card` interface (present in `app/types.d.ts`)

- Finally set the component's `cardDetails` to the result of the loader, which you can get via the `useLoaderData` Remix hook

### Optional Steps

If you've still got some time to spare here are some additional/optional steps that you can work on (in no particular order)

#### Form validation

Add some basic form validation that makes sure that the title and description values have been provided.

To get started you can check the [Remix form validation guide](https://remix.run/docs/en/main/guides/form-validation))

> [!Note]
> To get the UI errors styled by our css make sure that they appear after their respective input/text-area element,
> that they are `span` elements and that they have the `card-form__error` class

#### Loading Indicator and inputs disablement

Add a loading indicator that is displayed during the action's one second wait so that the user can see that something is happening.

Also while the indicator is being shown disable the input fields and the card generation button.

In order to implement that use Remix's [`useNavigation().state`](https://remix.run/docs/en/main/hooks/use-navigation#navigationstate).

> [!Note]
> To get the loading indicator styled by our css make sure that the loader appears as the first child of the `.card-form` element, that it
> is a `div` with the `card-form__loading` class and that it contains a `div` with the `loader` class

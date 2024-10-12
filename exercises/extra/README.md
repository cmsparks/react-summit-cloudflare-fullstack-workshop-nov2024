# Extra Exercises

Hopefully you've enjoyed the exercises presented in the workshop, if you'd like more we've collected (in no particular order) a few extra exercise ideas that you can work on after the workshop to expand our application and your confidence and knowledge of the Cloudflare platform.

> [!Note]
> Opposite to the previous exercises the ones presented here don't have an implemented solution or steps. They are more broad and open-ended encouraging more experimentation and personalization of the solution.

# Nationalize the generated card image

When a worker receives a request the request is also augmented with a [`cf` object](https://developers.cloudflare.com/workers/runtime-apis/request/#incomingrequestcfproperties), such object contains various information regarding the request such as:

- the request's `country`
- the request's `city`
- the request's `timezone`
- etc...

Such object is exposed by the default Remix context loader as a `cf` field of the `cloudflare` object:

```ts
context.cloudflare.cf;
```

Take the request's `country` from the `cf` object and use it to update the prompt being passed to the Workers AI `run` method to nationalize the generated image (for example by appending to the prompt: `(this creature lives in ${country})`).

Make also sure to properly test this functionality.

## Cards Gallery

Right now our application allows you to create a card and view it based on its generated ID, meaning that if you don't know the ID of a card you have no way of viewing it.

You can solve this by adding a new `/gallery` route to the application that actually displays all the cards saved in our KV.

With the [`list`](https://developers.cloudflare.com/kv/api/list-keys/) method you can get a list of all the keys in your KV namespace, in other words all the card IDs saved in our system, from there creating the gallery view should be relatively straightforward.

# D1 card data storage

Our cards information storage is based on [Workers KV](https://developers.cloudflare.com/kv/), this works well but what if we wanted to be able to query cards in various specific ways? For example query cards created after a certain date or cards containing some specific text in their title or description?

Implementing a solution based on Workers KV would be possible but awkward and inefficient.

In such case a more appropriate tool to use could be Cloudflare's serverless SQL database solution: [D1](https://developers.cloudflare.com/d1/).

So try changing the underlying card data storage solution to a D1 based one without changing the application's behavior.

As an additional step here you can also implement a `/api/query` endpoint (i.e. [resource route](https://remix.run/docs/en/main/guides/resource-routes)) that allows external clients to be able to query cards from your application.

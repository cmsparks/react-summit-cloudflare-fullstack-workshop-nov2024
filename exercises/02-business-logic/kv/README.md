# Business Logic Exercise - KV

In this exercise, we'll be using solely the Workers AI and Workers KV bindings. This version of the exercise doesn't require entering in payment information, but omits information on R2.

## Bindings

Before starting our code, we need to do some setup to configure the Workers bindings we're using. In Workers, bindings combine the permissions and API of the worker into one piece, like an environment variable which has the API of a service embedded into it. Create a binding for your Worker, grants it a specific capability (i.e. R2, KV, Workers AI).

### Benefits of bindings

There are multiple benefits to this model:

- Lower security risks because you can't accidentally leak an API token
- No boilerplate needed to initialize your API client
- Easier to understand what resources are being used

> [!NOTE]
> For more reading check out [this blog on why bindings are live objects](https://blog.cloudflare.com/workers-environment-live-object-bindings/)

### Creating a KV namespace

Let's create a namespace with wrangler (the CLI for the CF dev plat) and add it to our wrangler.toml

```sh
# make sure you've logged in using `npx wrangler login`
npx wrangler kv namespace create trading-cards
```

```toml
[[kv_namespaces]]
binding = "KV"
id = "<NAMESPACE_ID>"
```

We'll be using this KV namespace binding later to store our trading card metadata

### Generating types from bindings

To automatically generate Typescript types from the bindings you just added, run:

```sh
npm run build
npm run cf-typegen
```

The final types generated should show up in `worker-configuration.d.ts`

## Workers Exercise

Now that we've created out bindings, let's work on our card generation logic.

### Running our tests

Currently, we have a few sample tests for a worker that reads and writes from KV. Let's try running these tests:

```sh
npm run test
```

You should see a passing test result, which looks like this:

```
 Test Files  1 passed (1)
      Tests  6 passed (6)
```

### Exercise: implementing the CardManager class

#### `CardManager`

We're going to abstract our card manager into a class to wrap our card generation & management functionality. This allows us to dependency inject our test bindings for easier testing. To do this, let's open `card-manager-kv.ts`, which has the following interface:

```ts
export class CardManagerKV implements CardManager {
  async generateAndSaveCard(
    card: Pick<Card, "title" | "description">
  ): Promise<string> {
    // TODO
    throw new Error("Unimplemented");
  }

  async generateCardImage(
    card: Pick<Card, "title" | "description">
  ): Promise<ReadableStream<Uint8Array>> {
    // TODO
    throw new Error("Unimplemented");
  }

  async getCard(cardId: string): Promise<Card | null> {
    // TODO
    throw new Error("Unimplemented");
  }

  async getCardImage(
    cardId: string
  ): Promise<ReadableStream<Uint8Array> | null> {
    // TODO
    throw new Error("Unimplemented");
  }
}
```

#### `CardManager` tests

We can also see `card-manager-kv.test.ts`, which has stubbed out tests for each method in our `CardManager`. Let's implement the tests & functionality for each method. You can implement these in any order you like, but we suggest starting with tests and then implementing the functionality, both marked with `TODO` comments.

```ts
afterEach(() => {
  vi.spyOn(env.AI, "run").mockRestore();
});

describe("test CardManagerKV class", () => {
  const cardManager = new CardManagerKV(env.KV, env.AI);

  it("generateAndSaveCard()", async () => {
    // TODO
  });

  it("generateCardImage()", async () => {
    // TODO
  });

  it("getCard(): null card", async () => {
    // TODO
  });

  it("getCard(): non-null card", async () => {
    // TODO
  });

  it("getCardImage(): null card", async () => {
    // TODO
  });

  it("getCardImage(): non-null card", async () => {
    // TODO
  });
});
```

We've already done the necessary configuration setting up your vitest config. We've added the following bindings for testing purposes:

- `kvNamespaces` attributes create new test bindings for KV
- `wrappedBindings` defines a mocked version of Workers AI because there isn't local support for Workers AI. In our tests, we'll be able to use `vi.spyOn(...)` to mock the return values of the AI binding

#### Tasks to complete

- Implement and test `generateCardImage` using `vi.spyOn(env.AI, 'run').mockImplementation(...)`
  - You'll need to use the [Workers AI binding to generate an image](https://developers.cloudflare.com/workers-ai/models/stable-diffusion-xl-base-1.0)
  - You might need to do a bit of prompt engineering. We used the following prompt:

```
Based on the following title and description, generate card artwork for a trading card
title: ...
description: ...
```

- Implement and test `generateAndSaveCard`
  - We'll use `generateCardImage` in this function
  - You can store the card metadata (title, description, and imageUrl) however you prefer, but we stored it as JSON like so: `{ "title": "...", "description": "...", "imageUrl": "/image/<CARD_ID>"}`. You should maintain the same imageUrl format that we use, `/image/<CARD_ID>`.
  - You can store the card image data however you prefer, but we stored it as an `arrayBuffer` in KV
    - You'll need to convert the `ReadableStream<Uint8Array>` of an unknown length to a statically sized `Uint8Array` if you want to store the data in kv as an `arrayBuffer` type
  - Here's some usful documentation on [storing data in KV](https://developers.cloudflare.com/kv/api/write-key-value-pairs/)
  - You'll need to use a consistent key prefix to differentiate card metadata and card image data. We prefixed all card metadata with `/card/<CARD_ID>` and image data with `/image/<CARD_ID>`
- Implement and test `getCard`
  - Here's some useful documentation on [reading data from KV](https://developers.cloudflare.com/kv/api/read-key-value-pairs/)
- Implement and test `getCardImage`

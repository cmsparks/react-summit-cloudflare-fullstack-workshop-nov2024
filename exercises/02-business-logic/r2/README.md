# Business Logic Exercise - R2

In this exercise, we'll be using the Workers AI, Workers KV, and Workers R2 bindings. This version of the exercise uses the free plan, but requires inputting your payment information to use the free tier of R2. Although we recommend the R2 version of the exercise, if you prefer to avoid inputting your payment information, see the KV-only version of this exercise at `02-business-logic/kv/README.md`.

## Bindings

Before starting our code, we need to do some setup to configure the Workers bindings we're using. In Workers, bindings combine the permissions and API of the worker into one piece, like an environment variable which has the API of a service embedded into it. Create a binding for your Worker, grants it a specific capability (i.e. R2, KV, Workers AI).

### How to use bindings.

I can configure my worker to use a Binding, like Workers AI in the `wrangler.toml`:

```toml
# grant my worker a binding
[ai]
binding = "AI"
```

And then use that binding:

```ts
export default {
  async fetch(request: Request, env: Env) {
    // ...
    const dogImage = await env.AI.run(
      "@cf/stabilityai/stable-diffusion-xl-base-1.0",
      {
        prompt: "generate an image of a dog",
      }
    );
    // ...
  },
};
```

> [!NOTE]
> The `Env` type can be generated for you by running the `wrangler types` command

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

### Creating an R2 bucket

Let's also create an R2 bucket and add it to our `wrangler.toml`

```sh
npx wrangler r2 bucket create card-images
```

```toml
[[r2_buckets]]
binding = "R2"
bucket_name = "card-images"
```

We'll be using this bucket as a binding later to store our trading card images

### Generating types from bindings

To automatically generate Typescript types from the bindings you just added, run:

```sh
npm run typegen
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

We're going to abstract our card manager into a class to wrap our card generation & management functionality. This allows us to dependency inject our test bindings for easier testing. To do this, let's open `card-manager.r2.ts`, which has the following interface:

```ts
export class CardManagerR2 implements CardManager {
  /**
   * @param card card title and description to generate
   * @returns card key in KV
   */
  async generateAndSaveCard(
    card: Pick<Card, "title" | "description">
  ): Promise<string> {
    // TODO
    throw new Error("Unimplemented");
  }

  /**
   * @param card metadata for the trading card, including the title and description
   * @returns fully populated card data
   */
  async generateCardArt(
    card: Pick<Card, "title" | "description">
  ): Promise<ReadableStream<Uint8Array>> {
    // TODO
    throw new Error("Unimplemented");
  }

  /**
   * @param cardKey card key to get
   * @returns card from cardKey
   */
  async getCard(cardKey: string): Promise<Card | null> {
    // TODO
    throw new Error("Unimplemented");
  }

  async getCardImage(
    cardKey: string
  ): Promise<ReadableStream<Uint8Array> | null> {
    // TODO
    throw new Error("Unimplemented");
  }
}
```

#### `CardManager` tests

We can also see `card-manager.test.ts`, which has stubbed out tests for each method in our `CardManager`. Let's implement the tests & functionality for each method. You can implement these in any order you like, but we suggest starting with tests and then implementing the functionality, both marked with `TODO` comments.

```ts
afterEach(() => {
  vi.spyOn(env.AI, "run").mockRestore();
});

describe("test CardManagerR2 class", () => {
  const cardManager = new CardManagerR2(env.KV, env.AI, env.R2);

  it("generateAndSaveCard()", async () => {
    // TODO
  });

  it("generateCardArt()", async () => {
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

- `kvNamespaces` and `r2Buckets` attributes create new test bindings for KV and R2
- `wrappedBindings` defines a mocked version of Workers AI because there isn't local support for Workers AI. In our tests, we'll be able to use `vi.spyOn(...)` to mock the return values of the AI binding

As mentioned before, the exercise's goal is implementing the parts flagged with the `TODO` comment. Let's complete the following steps:

- Implement and test `generateCardArt` using `vi.spyOn(env.AI, 'run').mockImplementation(...)`
- Implement and test `generateAndSaveCard` using `generateCardArt`
- Implement and test `getCard`
- Implement and test `getCardImage`

#### Useful links

- [Read from KV](https://developers.cloudflare.com/kv/api/read-key-value-pairs/)
- [Write to KV](https://developers.cloudflare.com/kv/api/write-key-value-pairs/)
- [R2 API Reference](https://developers.cloudflare.com/r2/api/workers/workers-api-reference/)
- [Workers AI Stable Diffusion usage](https://developers.cloudflare.com/workers-ai/models/stable-diffusion-xl-base-1.0)

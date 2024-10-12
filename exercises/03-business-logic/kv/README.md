# Business Logic Exercise - KV

In this exercise, we'll be using solely the Workers AI and Workers KV bindings. This version of the exercise doesn't require entering in payment information, but omits information on R2.

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
      Tests  12 passed (12)
```

### Exercise: implementing the CardManager class

#### `CardManager`

We're going to abstract our card manager into a class to wrap our card generation & management functionality. This allows us to dependency inject our test bindings for easier testing. To do this, let's open `card-manager-kv.ts`, which has the following interface:

```ts
export class CardManagerKV implements CardManager {
  /**
   * @param card metadata for the trading card, including the title and description
   * @returns the card image data (as a readable stream)
   */
  async generateCardImage(
    card: Pick<Card, "title" | "description">
  ): Promise<ReadableStream<Uint8Array>> {
    // TODO
    throw new Error("Unimplemented");
  }

  /**
   * @param card card title and description to generate
   * @returns card id in KV
   */
  async generateAndSaveCard(
    card: Pick<Card, "title" | "description">
  ): Promise<string> {
    // TODO
    throw new Error("Unimplemented");
  }

  /**
   * @param cardId id of the card get
   * @returns card info if found, null otherwise
   */
  async getCard(cardId: string): Promise<Card | null> {
    // TODO
    throw new Error("Unimplemented");
  }

  /**
   * @param cardId id of the image's card
   * @returns card image data as a readable stream if found, null otherwise
   */
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
  const cardManager = new CardManagerKV(env);

  it("generateCardImage()", async () => {
    // TODO
  });

  it("generateAndSaveCard()", async () => {
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

One additional note: if you see strange test results, like "Failed to pop isolated storage stack frame" or hanging tests, you may have failed to `await` an asynchronous function from a binding in your tests.

### Step 1 - Implement and test `generateCardImage`

- Implement `generateCardImage`

  - You'll need to use the [Workers AI binding to generate an image](https://developers.cloudflare.com/workers-ai/models/stable-diffusion-xl-base-1.0)
  - First, we'll define a prompt to generate an image we want. We used the following prompt:

    ```
    Based on the following title and description, generate card artwork for a trading card
    title: ...
    description: ...
    ```

- Then, use `this.AI.run(...)` to generate the image

- Test `generateCardImage`

  - Create some sample image data of the type `ReadableStream<Uint8Array>`. Here's a snippet, which might be useful:

    ```ts
    const imageArray = new Uint8Array([1, 2, 3, 4]);
    const imageBlob = new Blob([imageArray]);
    const stream: ReadableStream<Uint8Array> = imageBlob.stream();
    ```

- You can use `vi.spyOn(env.AI, 'run').mockImplementation(...)` or `vi.spyOn(env.AI, 'run').mockResolvedValue(stream)` to mock the implementation of the AI binding. You can use this to mock returning the sample data.
- Use some `expect(...)` functions to assert the functionality of the `generateCardImage` method. See [Vitest docs](https://vitest.dev/) for more information on using Vitest.

### Step 2 - Implement and test `generateAndSaveCard`

- Implement `generateAndSaveCard`

  - First, generate a UUID for the card using `crypto.randomUUID()`
  - Writing the card metadata as a key value pair [using the KV API](https://developers.cloudflare.com/kv/api/write-key-value-pairs/). In this case, the key is the UUID we just generated, and the value is some JSON, structued like so:

    ```json
    {
      "title": "...",
      "description": "...",
      "imageUrl": "/image/<CARD_ID>"
    }
    ```

- Use the `generateCardImage` method to generate an image, and write the card image data [using the KV API](https://developers.cloudflare.com/kv/api/write-key-value-pairs/). We stored it as an `arrayBuffer`
  - You'll need to convert the `ReadableStream<Uint8Array>` from the `generateCardImage` method to a statically sized `Uint8Array` before writing the data to R2. You can use the helper function `convertReadableStreamToUint8Array` in `utils.ts` to do this for you.
- Test `generateAndSaveCard`
  - You'll need to include similar binding mocking functionality for the AI binding as in step 1 using `vitest.spyOn(...)`
  - The local testing environment provides fully mocked R2 and KV functionality, so you can simply use the bindings as normal. After running the `generateAndSaveCard()` method, you can verify that the function wrote the correct data by getting data from the `env.KV` binding in your test.

### Step 3 - Implement and test `getCard`

- Implement `getCard`
  - Given some cardID, [read the data from Workers KV](https://developers.cloudflare.com/kv/api/read-key-value-pairs/). Remember from above that the key is the UUID and the value is our JSON-formatted card metadata.
  - Do some validation. We've provided you with the `isCard()` typeguard to validate the structure of card metadata
- Test `getCard`
  - You'll need to put some sample card metadata into KV, either using the sample functions above, or manually writing the data into KV.
  - Assert that you get the correct card metadata back from KV using Vitest `expect(...)` functions

### Step 4 - Implement and test `getCardImage`

- Implement `getCardImage`
  - Here's some useful documentation on [reading data from KV](https://developers.cloudflare.com/kv/api/read-key-value-pairs/)
- Test `getCardImage`
  - You'll need to put some sample image data into KV, either using the sample functions above, or manually writing the data into R2
  - Assert that you get the correct card image data back from KV using Vitest `expect(...)` functions

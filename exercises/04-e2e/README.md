# E2E Exercise

## Intro

Our application is done! 🚀 We can now add e2e tests to it to make sure that everything works as intended.

To test the application in a local manner that is as close as possible to the real thing we'll want to run
our application via the `wrangler dev` command, that's the dev server that we'll want to test.

> [!NOTE]
> Why don't we just use the `dev` script? what's the difference?
>
> The `dev` script starts a vite dev server which runs our application in a nodejs process. This works
> well when developing (when a fast iteration cycle is a must) and we do even get access to simulation of
> bindings thanks to the [Cloudflare Proxy](https://remix.run/docs/en/main/guides/vite#cloudflare-proxy).
> But this runs the application in the nodejs runtime, which is different from the workerd runtime
> Cloudflare uses to run your code, this difference can cause different behaviors thus we do want to
> run `wrangler dev` which does indeed run the code inside the workerd runtime matching as close as
> possible the real thing.
>
> Interestingly! We're working hard and collaborating with the Vite team to leverage their new
> [Environment API](https://remix.run/docs/en/main/guides/vite#cloudflare-proxy) to actually allow Vite to
> use the workerd runtime itself! Hopefully soon-ish you'll be able just use `vite` both for development
> and e2e testing! Getting the best of both Vite's performance and wrangler's accuracy!

## Pre-exercise

### Playwright setup

Before actually adding our e2e tests there is some preliminary setup to be done.

Let's start by installing playwright:

```
npm init playwright@latest
```

During the interactive command type `./e2es` as the path for the tests (or whatever path you'd prefer to use)
and make sure to select `yes` when asked if you want to install the playwright browsers.

Once that's done run

```
npx playwright test
```

to make sure that everything is working fine

Notice that playwright created some boilerplate/example tests for you, both in the `./e2es` directory and in a new
`./tests-examples/` one. Feel free to keep these files as they might come in handy as references during the exercise.
Afterwords (of right away if you prefer!) they can be deleted.

### Cloudflare-specific setup

Next, let's go into the `playwright.config.ts` file and:

- uncomment the `webServer` section at the bottom of the file
- replace its command to `npm run preview` (which builds our application and runs it with `wrangler dev` on port `8787`)
- replace the port in its url with `8788`
  The resulting `webServer` object should look like this:

```js
	webServer: {
		command: 'npm run preview',
		url: 'http://127.0.0.1:8788',
		reuseExistingServer: !process.env.CI,
	},
```

### Workers-AI workaround

We want to mock the AI binding functionality, this for mainly two reasons:

- the `run` method takes a certain amount of time to execute, although we could deal with this delay in our tests it would make the tests execution significantly longer and would also potentially introduce flakiness
- the binding's use incurs usage charges even during local development (as per the [Cloudflare documentation](https://developers.cloudflare.com/workers/wrangler/configuration/#workers-ai)) so using it in the e2e tests would simply be a waste of money/resources

Unfortunately `wrangler dev` does not provide a way for you to mock the AI binding, so we need to change actual code in the application to achieve this, fortunately Remix flexibility allows to do that in a clean manner.

Let's start by adding two new scripts to our `package.json`:

```json
"preview:test": "npm run build && npm run cf:dev:test",
"cf:dev:test": "wrangler cf dev --var mode:e2e-test",
```

The `cf:dev:test` script uses the `--var` flag to set the `mode` binding to `e2e-test`, we will use this binding value to discern whether or not we're in "e2e testing mode".

`preview:test` simply uses the above test to run the preview in "e2e testing mode".

Make sure to update the `webServer`'s `command` in the `playwright.config.ts` file to `npm run preview:test`.

Next let's actually mock our AI binding, we can leverage [Remix load context augmentation capabilities](https://remix.run/docs/en/main/guides/vite#augmenting-load-context) to override (as cleanly as possible) the implementation of the AI binding when in "e2e testing mode".

To do that update the `load-context.ts` file in the following way:

```diff
import { type PlatformProxy } from "wrangler";
+import { type AppLoadContext } from "@remix-run/cloudflare";

type Cloudflare = Omit<PlatformProxy<Env>, "dispose">;

declare module "@remix-run/cloudflare" {
  interface AppLoadContext {
    cloudflare: Cloudflare;
  }
}
+
+type GetLoadContext = (args: {
+  request: Request;
+  context: { cloudflare: Cloudflare };
+}) => AppLoadContext;
+
+export const getLoadContext: GetLoadContext = ({ context }) => {
+  const env = context.cloudflare.env;
+  let ai = env.AI;
+
+  if (env.mode === "e2e-test") {
+    const imageArray = new Uint8Array();
+    const imageBlob = new Blob([imageArray]);
+    ai = {
+      async run(..._: unknown[]) {
+        return imageBlob.stream();
+      },
+    } as Ai;
+  }
+
+  return {
+    ...context,
+    cloudflare: {
+      ...context.cloudflare,
+      env: {
+        ...env,
+        AI: ai,
+      },
+    },
+  };
+};
+
```

The `vite.config.ts` in the following way:

```diff
import {
  vitePlugin as remix,
  cloudflareDevProxyVitePlugin as remixCloudflareDevProxy,
} from "@remix-run/dev";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
+import { getLoadContext } from "./load-context";

export default defineConfig({
  plugins: [
-    remixCloudflareDevProxy(),
+    remixCloudflareDevProxy({ getLoadContext }),
    remix({
      future: {
        v3_fetcherPersist: true,
        v3_relativeSplatPath: true,
        v3_throwAbortReason: true,
      },
    }),
    tsconfigPaths(),
  ],
});
```

And `functions/[[path]].ts`:

```diff
import type { ServerBuild } from "@remix-run/cloudflare";
import { createPagesFunctionHandler } from "@remix-run/cloudflare-pages";
+import { getLoadContext } from "../load-context";

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore - the server build file is generated by `remix vite:build`
// eslint-disable-next-line import/no-unresolved
import * as rawBuild from "../build/server";

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore - the server build is a js file and as such it doesn't include all the appropriate types
const build = rawBuild as ServerBuild;

-export const onRequest = createPagesFunctionHandler({ build });
+// eslint-disable-next-line @typescript-eslint/ban-ts-comment
+// @ts-expect-error
+export const onRequest = createPagesFunctionHandler({ build, getLoadContext });
```

In this way, when the `cf:dev:test` runs the AI binding will not actually be called but an empty result for its functionality will be returned instead.

> [!IMPORTANT]
> With the above we're modifying actual application logic in order to facilitate testing, this is generally a very bad practice to avoid.
> However it can sometimes, like now, be (nearly) inevitable.

## The exercise

With all the above in place we're now ready to implement some e2e tests!

We'll do that interactively using playwright code generation capabilities, in order to do that let's start our testing dev server:

```
npm run preview:test
```

in a separate terminal let's then run

```
npx playwright codegen localhost:8787
```

you will notice two windows opened, one with our site ready to be interacted with, and the other with the playwright inspector, such inspector is where our e2e generated code ends up.

Now you can simply interact with the application and code will just appear in the playwright inspector, ready to be copy pasted into a new `spec` file into our `e2es` folder, the playwright inspector also has quite a few handy utilities that can make the task even simpler.

This exercise simply consist in implementing an e2e test that tests the normal functioning of our application, it should:

- check the visibility of the initial card-like form, including its placeholder image (`div`)
- input (as a user would) a title and description in the form
- click the generation button
- check that the card is still visible, and its image is now "populated" (`img`)
- check that the card title and description match the ones we've provided

When you're test is ready run it via `npx playwright test` to make sure that everything works as it should.

Once you're done notice that playwright used various different methods of the `page` object to locate your target elements such as:

- `page.getByPlaceholder('description...')`
- `page.getByRole('button', { name: 'Generate' })`
- and even `page.locator('div').first()`
  These are playwright best effort locators, these do the job but are pretty brittle (especially the `div` one!).

For example let's imagine that in the future we might want to change our description placeholder text, or the text of our button! Such operations would (wrongly) break our tests!

So in order to make our tests more robust, let's go through the elements we've targeted in our tests and a `data-testid` attribute to each of them.

If you now repeat the exercise you will see that playwright code generation prioritizes such attributes and selects our elements via `page.getByTestId`, now generating much more robust and resilient tests.

> [!NOTE]
> Unless you have some specific reason, such as wanting to make sure that a placeholder always remains the same, or that an element has a specific role (which helps with accessibility), we recommend always relying on test id attributes for e2e tests as those make the tests more robust, simple and resilient. On top of that such attributes convey intent to other developers leaving little doubt as to why they are there and what they are used for.

## Optional Exercise

If you've still got some time to spare as an additional exercise to familiarize yourself with playwright, try to also test the loading indicator displayed when a form is submitted!

Note that in order to test the indicator you will need to add some artificial time delay in the AI mock present in our custom `getLoadContext` function.

## Useful Resources

- [Playwright - intro](https://playwright.dev/docs/intro)
- [Playwright - locate by test id](https://playwright.dev/docs/locators#locate-by-test-id)

## Deploying the final application

Now that we've completed our trading card generator, let's deploy by running

```sh
# make sure you've logged in using `npx wrangler login`
npm run deploy
```

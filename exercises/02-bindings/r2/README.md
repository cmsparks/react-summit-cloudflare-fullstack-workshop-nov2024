# Bindings & Deployment

In this exercise, we'll configuring some deploying our Pages Project and configuring some bindings

## Deployment

Lets try deploying our Pages project without any bindings. To do that, lets run

```sh
# this runs our build command and `wrangler pages deploy`
npm run deploy
```

You should see a prompt to create a new Pages project, which should look like this:

```
The project you specified does not exist: "react-summit-cloudflare-fullstack-workshop-nov2024". Would you like to create it?
❯ Create a new project
✔ Enter the production branch name: … HEAD
✨ Successfully created the 'react-summit-cloudflare-fullstack-workshop-nov2024-5' project.
```

After creating the project, your Pages project should be deployed:

```
✨ Compiled Worker successfully
🌏  Uploading... (11/11)

✨ Success! Uploaded 11 files (3.83 sec)

✨ Uploading _headers
✨ Uploading Functions bundle
✨ Uploading _routes.json
🌎 Deploying...
✨ Deployment complete! Take a peek over at https://56080c90.react-summit-cloudflare-fullstack-workshop-nov2024-5.pages.dev
```

You can click the link to navigate to your live site. However, it may take a minute or so for the first deployment of a new Pages project to be available. In the meantime, let's configure our bindings.

## Bindings

Before starting our code, we need to do some setup to configure the Workers/Pages bindings we're using. On Cloudflare, bindings combine the permissions and API of the Worker into one piece, like an environment variable which has the API of a service embedded into it. Creating a binding for your Worker grants it a specific capability (i.e. R2, KV, Workers AI).

### Benefits of bindings

There are multiple benefits to this model:

- Lower security risks because you can't accidentally leak an API token
- No boilerplate needed to initialize your API client
- Easier to understand what resources are being used

> [!Note]
> For more reading check out [this blog on why bindings are live objects](https://blog.cloudflare.com/workers-environment-live-object-bindings/)

## AI Binding

Our AI binding is already set up for you:

```toml
[ai]
binding = "AI"
```

This just automatically instantiates an API on the Worker's `env` variable, with no setup code or API tokens needed.

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
npm run build
npm run cf-typegen
```

The final types generated should show up in `worker-configuration.d.ts`

### Redeploying with bindings

Now that we've configured our bindings, lets deploy our site by running `npm run deploy` again. At this point, the site should be live and you'll be able to view the deployment link with your live code.

Let's also look in the Cloudflare Dashboard to verify that we deployed with our correct bindings. If you go to this link `https://dash.cloudflare.com/<YOUR_ACCOUNT_ID>/workers-and-pages`, you should see a new entry in the top of the list. Navigate to: `<PAGES_PROJECT_NAME> > Settings > Bindings` and you should see the bindings we just created via Wrangler.

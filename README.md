# react-summit-cloudflare-fullstack-workshop-nov2024

This is the repository for the React Summit workshop titled: [Deploy and Test Full-Stack React Apps on Cloudflare](https://reactsummit.us/#workshop-deploy-and-test-full-stack-react-apps-on-cloudflare)

Our `main` branch contains all the necessary checkpoints for the workshop. To start from the beginning, you can `git checkout start`.

## Resources

The presentation can be found here: https://react-summit-nov2024-cloudflare-slides.pages.dev/

Or a PDF is provided in the repository under `workshop-presentation.pdf`

## Useful commands

To build the app:

```sh
npm run build
```

To run in a local dev environment using the vite dev server:

```sh
npm run dev
```

To run in a local development environment using wrangler dev

```sh
npm run preview
```

For linting and typechecking:

```sh
npm run lint
npm run typecheck
```

To regenerate the types you've defined in your `wrangler.toml`:

```sh
npm run cf-typegen
```

To run our tests use:

```sh
npm run test
```

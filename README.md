# react-summit Cloudflare Fullstack Workshop November 2024

This is the repository for the React Summit workshop titled: [Deploy and Test Full-Stack React Apps on Cloudflare](https://reactsummit.us/#workshop-deploy-and-test-full-stack-react-apps-on-cloudflare)

Welcome and thanks for joining our workshop! 🫶

This workshop is designed to be followed step by step, during the actual live workshop you will be given instructions and time to implement the various solutions alongside us,
we'll also live code the various exercises solutions.

Each exercise has its own README file in the [./exercises](./exercises/) directory.

The workshop's slides for this can be found here: https://react-summit-nov2024-cloudflare-slides.pages.dev/
(for convenience a pdf of the slide is also present here [`workshop-presentation.pdf`](./workshop-presentation.pdf)).

## Git tags

If you were to fall behind and/or want to skip an exercises we have step-by-step tagged commits that you can
use to jump to different parts of the workshop.

The included tags are:

- `exr01_start`: start of the exercise 01 (=== start of the workshop)
- `exr01_step_1`: solution to the workshop till exercise 01 step 1
- `exr01_step_2`: solution to the workshop till exercise 01 step 2
- `exr01_step_3`: solution to the workshop till exercise 01 step 3
- `exr01_done`: solution to the workshop till exercise 01 (including the optional steps)
- `exr02_start`: start of the exercise 02
- `exr02_done`: solution to the workshop till exercise 02
- `exr03_start`: start of the exercise 03
- `exr03_step_1`: solution to the workshop till exercise 03 step 1
- `exr03_step_2`: solution to the workshop till exercise 03 step 2
- `exr03_step_3`: solution to the workshop till exercise 03 step 3
- `exr03_done`: solution to the workshop till exercise 03
- `exr04_start`: start of the exercise 04
- `exr04_step_1`: solution to the workshop till exercise 04 step 1
- `exr04_step_2`: solution to the workshop till exercise 04 step 2
- `exr04_done`: solution to the workshop till exercise 04
- `exr05_start`: start of the exercise 05
- `exr05_step_1`: solution to the workshop till exercise 05 step 1
- `exr05_step_2`: solution to the workshop till exercise 05 step 2
- `exr05_step_3`: solution to the workshop till exercise 05 step 3
- `exr05_step_4`: solution to the workshop till exercise 05 step 4
- `exr05_step_5`: solution to the workshop till exercise 05 step 5
- `exr05_done`: solution to the workshop till exercise 05

So if you're behind or in any case want to jump to another point of the workshop:

- stash or commit your current progress (in case you want to get back to it later)
- decide what tag you want to jump to
- run `git checkout -b <MY_BRANCH> <CHOSEN_TAG>` to create a new branch called `MY_BRANCH` that starts from the desired commit, you can then start working from there

> [!Warning]
> If you have some changes that are specific to you (for example binding data in the `wrangler.toml` file which we populate in exercise 02) make sure to copy those over onto your new branch

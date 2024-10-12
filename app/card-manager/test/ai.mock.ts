class MockAi implements Ai {
  // @ts-expect-error (we only implement a subset of the `run` capabilities here)
  async run(
    model: BaseAiTextToImageModels,
    prompt: AiTextToImageInput,
    options?: AiOptions
  ): Promise<AiTextToImageOutput> {
    console.warn("Unmocked AI.run: ", model, prompt, options);
    return new Blob([new Uint8Array()]).stream();
  }
}

export default function () {
  return new MockAi();
}

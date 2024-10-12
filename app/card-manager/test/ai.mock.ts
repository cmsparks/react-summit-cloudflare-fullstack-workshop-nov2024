class MockAi implements Ai {
  constructor() {}

  // @ts-expect-error (we only implement a single signature of the `run` here)
  async run(
    _model: BaseAiTextToImageModels,
    _prompt: AiTextToImageInput,
    _options?: AiOptions
  ): Promise<AiTextToImageOutput> {
    return new Blob([new Uint8Array()]).stream();
  }
}

export default function (): Ai {
  return new MockAi() as unknown as Ai;
}

class MockAi implements Ai {
  constructor(private mockOptions: MockOptions) {}

  // @ts-expect-error (we only implement a single signature of the `run` here)
  async run(
    _model: BaseAiTextToImageModels,
    _prompt: AiTextToImageInput,
    _options?: AiOptions
  ): Promise<AiTextToImageOutput> {
    if (this.mockOptions.runDuration) {
      await new Promise((resolve) =>
        setTimeout(resolve, this.mockOptions.runDuration)
      );
    }
    return new Blob([new Uint8Array()]).stream();
  }
}

type MockOptions = { runDuration?: number };

export default function (mockOptions: MockOptions = {}): Ai {
  return new MockAi(mockOptions) as unknown as Ai;
}

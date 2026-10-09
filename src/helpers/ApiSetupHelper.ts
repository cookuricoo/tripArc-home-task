export interface SetupContext { scenario: string; runId: string }
export interface SetupResult { status: 'not-configured' | 'ready'; fixtureIds: readonly string[] }
export interface ApiSetupProvider {
  setup(context: SetupContext): Promise<SetupResult>;
  cleanup(result: SetupResult): Promise<void>;
}

// A genuine backend adapter can be injected later. No fictional HTTP endpoints
// or silently substituted UI setup: an unavailable API is explicit.
export class UnconfiguredApiProvider implements ApiSetupProvider {
  async setup(_context: SetupContext): Promise<SetupResult> {
    return { status: 'not-configured', fixtureIds: [] };
  }
  async cleanup(_result: SetupResult): Promise<void> { /* No remote state was created. */ }
}

export class ApiSetupHelper {
  private result?: SetupResult;
  constructor(private readonly provider: ApiSetupProvider = new UnconfiguredApiProvider()) {}
  async setup(context: SetupContext): Promise<SetupResult> {
    this.result = await this.provider.setup(context);
    return this.result;
  }
  async cleanup(): Promise<void> {
    if (this.result) await this.provider.cleanup(this.result);
    this.result = undefined;
  }
}

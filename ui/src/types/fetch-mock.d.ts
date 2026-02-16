declare module "fetch-mock" {
  interface FetchMock {
    mock(matcher: string, response: unknown, options?: unknown): FetchMock;
    reset(): void;
    resetHistory(): void;
    calls(): [string, RequestInit | undefined][];
    lastUrl(): string | undefined;
    lastOptions(): RequestInit | undefined;
    flush(waitForBody?: boolean): Promise<void>;
  }
  const fetchMock: FetchMock;
  export default fetchMock;
  export type { FetchMock };
}

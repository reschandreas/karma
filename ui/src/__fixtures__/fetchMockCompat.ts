// Compatibility shim for fetch-mock v12 to support the v9 API
// used throughout the test suite.

// Use direct CJS path to bypass moduleNameMapper which redirects "fetch-mock" to this file
// eslint-disable-next-line @typescript-eslint/no-var-requires
const fetchMockModule = require("fetch-mock/dist/cjs/index.js");
// fetch-mock v12 exports { FetchMock, default } - the default is an instance
const fm = fetchMockModule.default || fetchMockModule;

// Ensure fetch-mock intercepts global fetch from the start
if (fm && fm.mockGlobal) {
  fm.mockGlobal();
}

interface FetchMockCompat {
  mock(matcher: string, response: any, options?: any): FetchMockCompat;
  reset(): void;
  resetHistory(): void;
  calls(): any[];
  lastUrl(): string | undefined;
  lastOptions(): any | undefined;
  flush(waitForBody?: boolean): Promise<any>;
}

const compat: FetchMockCompat = {
  mock(matcher: string, response: any, options?: any) {
    if (fm.route) {
      fm.route(matcher, response, options);
    }
    return compat;
  },
  reset() {
    if (fm.removeRoutes) {
      fm.removeRoutes();
      fm.clearHistory();
    }
  },
  resetHistory() {
    if (fm.clearHistory) {
      fm.clearHistory();
    }
  },
  calls() {
    if (fm.callHistory) {
      return fm.callHistory.calls().map((call: any) => [
        call.url,
        call.options,
      ]);
    }
    return [];
  },
  lastUrl() {
    if (fm.callHistory) {
      const call = fm.callHistory.lastCall();
      return call ? call.url : undefined;
    }
    return undefined;
  },
  lastOptions() {
    if (fm.callHistory) {
      const call = fm.callHistory.lastCall();
      return call ? call.options : undefined;
    }
    return undefined;
  },
  async flush(waitForBody?: boolean) {
    if (fm.callHistory) {
      return fm.callHistory.flush(waitForBody);
    }
  },
};

export default compat;

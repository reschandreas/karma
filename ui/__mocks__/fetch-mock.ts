// Manual mock for fetch-mock v12 to provide the v9 API
// This file is auto-discovered by Jest as a manual mock for the "fetch-mock" module.

// Import the actual fetch-mock v12 module
const { FetchMock } = jest.requireActual("fetch-mock") as {
  FetchMock: new (config?: any) => any;
};

// Create a fresh instance, explicitly passing Request/Response/Headers
// because FetchMock captures globalThis.Request at construction time,
// and it may not be available yet in the jsdom environment.
const fm = new FetchMock({
  Request: globalThis.Request,
  Response: globalThis.Response,
  Headers: globalThis.Headers,
});
fm.mockGlobal();

const compat = {
  mock(matcher: string, response: any, options?: any) {
    fm.route(matcher, response, options);
    return compat;
  },
  reset() {
    fm.removeRoutes();
    fm.clearHistory();
  },
  resetHistory() {
    fm.clearHistory();
  },
  calls() {
    return fm.callHistory.calls().map((call: any) => {
      const opts = { ...call.options };
      if (opts.method) opts.method = opts.method.toUpperCase();
      return [call.url, opts];
    });
  },
  lastUrl() {
    const call = fm.callHistory.lastCall();
    return call ? call.url : undefined;
  },
  lastOptions() {
    const call = fm.callHistory.lastCall();
    if (!call) return undefined;
    const opts = { ...call.options };
    // v12 lowercases method (native fetch behavior), v9 preserved original case
    if (opts.method) opts.method = opts.method.toUpperCase();
    return opts;
  },
  async flush(waitForBody?: boolean) {
    return fm.callHistory.flush(waitForBody);
  },
};

export default compat;

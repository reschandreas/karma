const JsdomEnvironment = require("jest-environment-jsdom").TestEnvironment;

class JsdomWithFetchEnvironment extends JsdomEnvironment {
  async setup() {
    await super.setup();
    // jest-environment-jsdom replaces globals with jsdom's window,
    // which lacks fetch/Request/Response/ReadableStream. Copy them from Node's globals.
    if (!this.global.fetch) {
      this.global.fetch = fetch;
      this.global.Request = Request;
      this.global.Response = Response;
      this.global.Headers = Headers;
    }
    if (!this.global.ReadableStream) {
      this.global.ReadableStream = ReadableStream;
    }
    if (!this.global.TextEncoder) {
      this.global.TextEncoder = TextEncoder;
    }
    if (!this.global.TextDecoder) {
      this.global.TextDecoder = TextDecoder;
    }
  }
}

module.exports = JsdomWithFetchEnvironment;

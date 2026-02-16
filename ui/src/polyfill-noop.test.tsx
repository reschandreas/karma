import { act } from "@testing-library/react";

import fetchMock from "fetch-mock";

import { EmptyAPIResponse } from "__fixtures__/Fetch";
import { mockMatchMedia } from "__fixtures__/matchMedia";

declare let global: any;
declare let window: any;

const settingsElement = {
  dataset: {
    defaultFiltersBase64: "WyJmb289YmFyIiwiYmFyPX5iYXoiXQ==",
  },
};

beforeEach(() => {
  window.matchMedia = mockMatchMedia({});

  global.MutationObserver = class {
    disconnect() {}
    observe() {}
  };
});

afterEach(() => {
  jest.restoreAllMocks();
});

it("doesn't load ResizeObserver polyfill if not needed", async () => {
  // Suppress expected react-cool-dimensions warnings about ResizeObserver
  const consoleSpy = jest.spyOn(console, "error").mockImplementation(() => {});
  const consoleInfoSpy = jest
    .spyOn(console, "info")
    .mockImplementation(() => {});

  global.window.ResizeObserver = jest.fn((cb) => {
    return {
      observe: jest.fn(),
      disconnect: jest.fn(),
    };
  });

  const root = document.createElement("div");
  jest.spyOn(global.document, "getElementById").mockImplementation((name) => {
    return name === "settings"
      ? settingsElement
      : name === "defaults"
        ? null
        : name === "root"
          ? root
          : null;
  });
  const response = EmptyAPIResponse();
  response.filters = [];

  fetchMock.reset();
  fetchMock.mock("*", {
    body: JSON.stringify(response),
  });

  let appRoot: any;
  await act(async () => {
    appRoot = require("./index.tsx").default;
  });
  expect(window.ResizeObserver).toBeTruthy();

  // Unmount to prevent async operations from leaking after test
  await act(async () => {
    appRoot.unmount();
  });

  consoleSpy.mockRestore();
  consoleInfoSpy.mockRestore();
});

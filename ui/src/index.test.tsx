import { act } from "@testing-library/react";

import fetchMock from "fetch-mock";

import { EmptyAPIResponse } from "__fixtures__/Fetch";
import { DefaultsBase64 } from "__fixtures__/Defaults";
import { mockMatchMedia } from "__fixtures__/matchMedia";

const settingsElement = {
  dataset: {
    defaultFiltersBase64: "WyJmb289YmFyIiwiYmFyPX5iYXoiXQ==",
  },
};

// Flush all pending async work (lazy imports, media hook effects, fetch responses)
// so that all React state updates happen within act() boundaries.
// React.lazy uses dynamic import() which resolves on macrotask boundaries,
// and each resolved lazy component can trigger further effects.
const flushAsyncWork = async () => {
  for (let round = 0; round < 5; round++) {
    for (let i = 0; i < 10; i++) await Promise.resolve();
    await new Promise((resolve) => setTimeout(resolve, 0));
  }
};

beforeEach(() => {
  window.matchMedia = mockMatchMedia({});
  jest.resetModules();
});

afterEach(() => {
  jest.restoreAllMocks();
});

it("renders without crashing with missing defaults div", async () => {
  const root = document.createElement("div");
  jest
    .spyOn(global.document, "getElementById")
    .mockImplementation((name: string) => {
      return name === "settings"
        ? (settingsElement as any)
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

  await act(async () => {
    const Index = require("./index.tsx");
    expect(Index).toBeTruthy();
    await flushAsyncWork();
    await fetchMock.flush(true);
    await flushAsyncWork();
  });
  expect(root.innerHTML).toMatch(/data-theme="auto"/);
});

it("renders without crashing with defaults present", async () => {
  const root = document.createElement("div");
  jest
    .spyOn(global.document, "getElementById")
    .mockImplementation((name: string) => {
      return name === "settings"
        ? (settingsElement as any)
        : name === "defaults"
          ? {
              innerHTML: DefaultsBase64,
            }
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

  await act(async () => {
    const Index = require("./index.tsx");
    expect(Index).toBeTruthy();
    await flushAsyncWork();
    await fetchMock.flush(true);
    await flushAsyncWork();
  });
});

import { act } from "react";
import { render, cleanup } from "@testing-library/react";
import fetchMock from "fetch-mock";

import { EmptyAPIResponse } from "__fixtures__/Fetch";
import { DefaultsBase64 } from "__fixtures__/Defaults";
import { mockMatchMedia } from "__fixtures__/matchMedia";
import { App } from "./App";
import { ParseDefaultFilters, ParseUIDefaults } from "./AppBoot";

// Mock react-media-hook to prevent async setState calls in effects
// that escape act() boundaries.
jest.mock("react-media-hook", () => ({
  useMedia: () => ({ media: "not all", matches: false }),
  useMediaPredicate: () => false,
}));

const settingsElement = {
  dataset: {
    defaultFiltersBase64: "WyJmb289YmFyIiwiYmFyPX5iYXoiXQ==",
  },
} as unknown as HTMLElement;

const flushEffects = async () => {
  for (let i = 0; i < 3; i++) {
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });
  }
};

beforeEach(() => {
  localStorage.clear();
  window.matchMedia = mockMatchMedia({});
  (globalThis as Record<string, unknown>).IS_REACT_ACT_ENVIRONMENT = true;

  const response = EmptyAPIResponse();
  response.filters = [];
  fetchMock.reset();
  fetchMock.mock("*", {
    body: JSON.stringify(response),
  });
});

afterEach(() => {
  cleanup();
  fetchMock.reset();
});

it("renders without crashing with missing defaults div", async () => {
  const defaultFilters = ParseDefaultFilters(settingsElement);
  const uiDefaults = ParseUIDefaults(null);

  const { container } = render(
    <App defaultFilters={defaultFilters} uiDefaults={uiDefaults} />,
  );

  await flushEffects();
  await act(async () => {
    await fetchMock.flush(true);
  });
  await flushEffects();

  expect(container.innerHTML).toMatch(/data-theme="auto"/);
});

it("renders without crashing with defaults present", async () => {
  const defaultFilters = ParseDefaultFilters(settingsElement);
  const uiDefaults = ParseUIDefaults({
    innerHTML: DefaultsBase64,
  } as unknown as HTMLElement);

  const { container } = render(
    <App defaultFilters={defaultFilters} uiDefaults={uiDefaults} />,
  );

  await flushEffects();
  await act(async () => {
    await fetchMock.flush(true);
  });
  await flushEffects();

  expect(container.innerHTML).toMatch(/data-theme="light"/);
});

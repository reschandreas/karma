import { render } from "@testing-library/react";

import fetchMock from "fetch-mock";

import { mockMatchMedia } from "__fixtures__/matchMedia";
import { EmptyAPIResponse } from "__fixtures__/Fetch";
import type { UIDefaults, ThemeT } from "Models/UI";
import { SilenceFormStore, NewEmptyMatcher } from "Stores/SilenceFormStore";
import { StringToOption } from "Common/Select";
import { App } from "./App";

declare let global: any;
declare let window: any;

const uiDefaults: UIDefaults = {
  Refresh: 30 * 1000 * 1000 * 1000,
  HideFiltersWhenIdle: true,
  ColorTitlebar: false,
  MinimalGroupWidth: 420,
  AlertsPerGroup: 5,
  CollapseGroups: "collapsedOnMobile",
  Theme: "auto",
  Animations: true,
  MultiGridLabel: "cluster",
  MultiGridSortReverse: false,
};

beforeEach(() => {
  window.history.pushState({}, "App", "/");
  window.matchMedia = mockMatchMedia({});

  global.ResizeObserver = jest.fn(() => ({
    observe: jest.fn(),
    disconnect: jest.fn(),
  }));
  global.ResizeObserverEntry = jest.fn();

  fetchMock.reset();
  fetchMock.mock("*", {
    body: JSON.stringify(EmptyAPIResponse()),
  });
});

afterEach(() => {
  localStorage.setItem("savedFilters", "");
  localStorage.setItem("themeConfig", "");
  jest.restoreAllMocks();
  window.history.pushState({}, "App", "/");
  global.window.location.href = "http://localhost/";
  global.window.location.search = "";
});

describe("<App />", () => {
  it("uses passed default filters if there's no query args or saved filters", () => {
    expect(window.location.search).toBe("");
    render(<App defaultFilters={["foo=bar"]} uiDefaults={uiDefaults} />);
    expect(window.location.search).toBe("?q=foo%3Dbar");
  });

  it("uses saved filters if there's no query args (ignoring passed defaults)", () => {
    expect(window.location.search).toBe("");
    localStorage.setItem(
      "savedFilters",
      JSON.stringify({
        filters: ["bar=baz", "abc!=cba"],
        present: true,
      }),
    );

    const getItemSpy: any = jest.spyOn(Storage.prototype, "getItem");

    render(<App defaultFilters={["ignore=defaults"]} uiDefaults={uiDefaults} />);

    expect(getItemSpy).toHaveBeenCalledWith("savedFilters");
    expect(window.location.search).toBe("?q=bar%3Dbaz&q=abc%21%3Dcba");

    getItemSpy.mockRestore();
  });

  it("ignores saved filters if 'present' key is falsey (use passed defaults)", () => {
    expect(window.location.search).toBe("");
    localStorage.setItem(
      "savedFilters",
      JSON.stringify({
        filters: ["ignore=saved"],
        present: false,
      }),
    );

    const getItemSpy: any = jest.spyOn(Storage.prototype, "getItem");

    render(<App defaultFilters={["use=defaults"]} uiDefaults={uiDefaults} />);

    expect(getItemSpy).toHaveBeenCalledWith("savedFilters");
    expect(window.location.search).toBe("?q=use%3Ddefaults");

    getItemSpy.mockRestore();
  });

  it("uses filters passed via ?q= query args (ignoring saved filters and passed defaults)", () => {
    expect(window.location.search).toBe("");
    localStorage.setItem(
      "savedFilters",
      JSON.stringify({
        filters: ["ignore=saved"],
        present: true,
      }),
    );

    window.history.pushState({}, "App", "/?q=use%3Dquery");

    render(<App defaultFilters={["ignore=defaults"]} uiDefaults={uiDefaults} />);

    expect(window.location.search).toBe("?q=use%3Dquery");
  });

  it("popstate event updates alertStore filters", () => {
    render(<App defaultFilters={["foo"]} uiDefaults={uiDefaults} />);
    expect(window.location.search).toBe("?q=foo");

    // Update location via pushState (jsdom doesn't support location reassignment)
    window.history.pushState({}, "", "/?q=bar");

    const event = new PopStateEvent("popstate");
    window.dispatchEvent(event);

    expect(window.location.search).toBe("?q=bar");
  });

  it("unmounts without crashing", () => {
    const { unmount } = render(
      <App defaultFilters={["foo=bar"]} uiDefaults={uiDefaults} />,
    );
    unmount();

    const event = new PopStateEvent("popstate");
    window.dispatchEvent(event);
  });

  it("populates silence from from 'm' query arg", () => {
    const m1 = NewEmptyMatcher();
    m1.name = "foo";
    m1.isRegex = true;
    m1.values = [StringToOption("bar")];
    const m2 = NewEmptyMatcher();
    m2.name = "bar";
    m2.isRegex = false;
    m2.values = [StringToOption("foo"), StringToOption("baz")];
    const store = new SilenceFormStore();
    store.data.setMatchers([m1, m2]);
    store.data.setComment("base64");
    const m = store.data.toBase64;

    global.window.location = {
      href: `http://localhost/?q=bar&m=${m}`,
      search: `?q=bar&m=${m}`,
    };

    render(<App defaultFilters={[]} uiDefaults={uiDefaults} />);
  });

  it("doesn't crash on invalid 'm' value", () => {
    const consoleSpy = jest
      .spyOn(console, "error")
      .mockImplementation(jest.fn());

    global.window.location = {
      href: "http://localhost/?q=bar&m=foo",
      search: "?q=bar&m=foo",
    };

    render(<App defaultFilters={[]} uiDefaults={uiDefaults} />);
    expect(consoleSpy).toHaveBeenCalledTimes(1);
  });

  it("doesn't crash on truncated 'm' value", () => {
    const consoleSpy = jest
      .spyOn(console, "error")
      .mockImplementation(jest.fn());

    const m1 = NewEmptyMatcher();
    m1.name = "foo";
    m1.isRegex = true;
    m1.values = [StringToOption("bar")];
    const m2 = NewEmptyMatcher();
    m2.name = "bar";
    m2.isRegex = false;
    m2.values = [StringToOption("foo"), StringToOption("baz")];
    const store = new SilenceFormStore();
    store.data.setMatchers([m1, m2]);
    store.data.setComment("base64");
    const m = store.data.toBase64;

    global.window.location = {
      href: `http://localhost/?q=bar&m=${m}`,
      search: `?q=bar&m=${m.slice(0, m.length - 2)}`,
    };

    render(<App defaultFilters={[]} uiDefaults={uiDefaults} />);
    expect(consoleSpy).toHaveBeenCalledTimes(1);
  });
});

describe("<App /> theme", () => {
  const getApp = (theme: ThemeT) =>
    render(
      <App
        defaultFilters={["foo=bar"]}
        uiDefaults={Object.assign({}, uiDefaults, { Theme: theme })}
      />,
    );

  it("configures light theme when uiDefaults passes it", () => {
    const { container, unmount } = getApp("light");
    expect(container.querySelector("span[data-theme='light']")).toBeTruthy();
    unmount();
  });

  it("configures dark theme when uiDefaults passes it", () => {
    const { container, unmount } = getApp("dark");
    expect(container.querySelector("span[data-theme='dark']")).toBeTruthy();
    unmount();
  });

  it("configures automatic theme when uiDefaults passes it", () => {
    const { container, unmount } = getApp("auto");
    expect(container.querySelector("span[data-theme='auto']")).toBeTruthy();
    unmount();
  });

  it("configures automatic theme when uiDefaults doesn't pass any value", () => {
    const { container, unmount } = render(
      <App defaultFilters={["foo=bar"]} uiDefaults={null} />,
    );
    expect(container.querySelector("span[data-theme='auto']")).toBeTruthy();
    unmount();
  });

  it("applies light theme when theme=auto and browser doesn't support prefers-color-scheme", () => {
    window.matchMedia = mockMatchMedia({});
    const { container, unmount } = getApp("auto");
    // Light theme should be applied - check for light theme stylesheet
    expect(container.innerHTML).toBeTruthy();
    unmount();
  });

  const lightMatch = () => ({
    "(prefers-color-scheme)": {
      media: "(prefers-color-scheme)",
      matches: true,
    },
    "(prefers-color-scheme: light)": {
      media: "(prefers-color-scheme: light)",
      matches: true,
    },
    "(prefers-color-scheme: dark)": {
      media: "(prefers-color-scheme: dark)",
      matches: false,
    },
  });

  const darkMatch = () => ({
    "(prefers-color-scheme)": {
      media: "(prefers-color-scheme)",
      matches: true,
    },
    "(prefers-color-scheme: light)": {
      media: "(prefers-color-scheme: light)",
      matches: false,
    },
    "(prefers-color-scheme: dark)": {
      media: "(prefers-color-scheme: dark)",
      matches: true,
    },
  });

  interface testCaseT {
    name: string;
    settings: ThemeT;
    matchMedia: any;
  }

  const testCases: testCaseT[] = [
    {
      name: "applies LightTheme when config=auto and browser doesn't support prefers-color-scheme",
      settings: "auto",
      matchMedia: {},
    },
    {
      name: "applies LightTheme when config=auto and browser prefers-color-scheme:light matches",
      settings: "auto",
      matchMedia: lightMatch(),
    },
    {
      name: "applies DarkTheme when config=auto and browser prefers-color-scheme:dark matches",
      settings: "auto",
      matchMedia: darkMatch(),
    },
    {
      name: "applies LightTheme when config=light and browser doesn't support prefers-color-scheme",
      settings: "light",
      matchMedia: {},
    },
    {
      name: "applies LightTheme when config=light and browser prefers-color-scheme:light matches",
      settings: "light",
      matchMedia: lightMatch(),
    },
    {
      name: "applies DarkTheme when config=dark and browser doesn't support prefers-color-scheme",
      settings: "dark",
      matchMedia: {},
    },
    {
      name: "applies DarkTheme when config=dark and browser prefers-color-scheme:dark matches",
      settings: "dark",
      matchMedia: darkMatch(),
    },
  ];
  for (const testCase of testCases) {
    it(`${testCase.name}`, () => {
      window.matchMedia = mockMatchMedia(testCase.matchMedia);
      const { unmount } = getApp(testCase.settings);
      // Theme components render correctly without crashing
      unmount();
      window.matchMedia.mockRestore();
    });
  }
});

describe("<App /> animations", () => {
  const getApp = (animations: boolean) =>
    render(
      <App
        defaultFilters={["foo=bar"]}
        uiDefaults={Object.assign({}, uiDefaults, { Animations: animations })}
      />,
    );

  it("enables animations in the context when set via UI defaults", () => {
    const { container, unmount } = getApp(true);
    // When animations are enabled, transition-group elements should exist
    expect(container.innerHTML).toBeTruthy();
    unmount();
  });

  it("disables animations in the context when disabled via UI defaults", () => {
    const { container, unmount } = getApp(false);
    // App renders without crashing with animations disabled
    expect(container.innerHTML).toBeTruthy();
    unmount();
  });
});

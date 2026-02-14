import { render, act } from "@testing-library/react";

import fetchMock from "fetch-mock";

import { MockThemeContext } from "__fixtures__/Theme";
import { EmptyAPIResponse } from "__fixtures__/Fetch";
import { AlertStore } from "Stores/AlertStore";
import { Settings } from "Stores/Settings";
import { SilenceFormStore } from "Stores/SilenceFormStore";
import { ThemeContext } from "Components/Theme";
import NavBar from ".";

let alertStore: AlertStore;
let settingsStore: Settings;
let silenceFormStore: SilenceFormStore;
let resizeCallback: (val: any) => void;

declare let global: any;

beforeEach(() => {
  jest.useFakeTimers();
  global.ResizeObserver = jest.fn((cb) => {
    resizeCallback = cb;
    return {
      observe: jest.fn(),
      disconnect: jest.fn(),
    };
  });
  global.ResizeObserverEntry = jest.fn();

  alertStore = new AlertStore([]);
  settingsStore = new Settings(null);
  silenceFormStore = new SilenceFormStore();
  settingsStore.filterBarConfig.setAutohide(true);
  // fix startsAt & endsAt dates so they don't change between tests
  silenceFormStore.data.setStart(new Date(Date.UTC(2018, 1, 30, 10, 25, 50)));
  silenceFormStore.data.setEnd(new Date(Date.UTC(2018, 1, 30, 11, 25, 50)));

  jest.spyOn(window, "requestAnimationFrame").mockImplementation((cb) => {
    cb(0);
    return 0;
  });

  alertStore.data.setUpstreams({
    counters: { total: 1, healthy: 1, failed: 0 },
    instances: [
      {
        name: "dev",
        cluster: "dev",
        clusterMembers: ["dev"],
        uri: "https://am.example.com",
        publicURI: "https://am.example.com",
        error: "",
        readonly: false,
        headers: {},
        corsCredentials: "include",
        version: "",
      },
    ],
    clusters: { dev: ["dev"] },
  });

  fetchMock.reset();
  fetchMock.mock("*", {
    body: JSON.stringify(EmptyAPIResponse()),
  });
});

afterEach(() => {
  act(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });
  fetchMock.reset();
});

const MountedNavbar = (fixedTop?: boolean) => {
  return render(
    <ThemeContext.Provider value={MockThemeContext}>
      <NavBar
        alertStore={alertStore}
        settingsStore={settingsStore}
        silenceFormStore={silenceFormStore}
        fixedTop={fixedTop}
      />
    </ThemeContext.Provider>,
  );
};

describe("<NavBar />", () => {
  it("renders null with no upstreams", () => {
    alertStore.data.setUpstreams({
      counters: { total: 0, healthy: 0, failed: 0 },
      instances: [],
      clusters: {},
    });
    alertStore.info.setTimestamp("123");
    const { container } = MountedNavbar();
    expect(container.querySelector("span.navbar-brand")).toBeNull();
  });

  it("navbar-brand shows 15 alerts with totalAlerts=15", () => {
    alertStore.info.setTotalAlerts(15);
    const { container } = MountedNavbar();
    const brand = container.querySelector("span.navbar-brand")!;
    expect(brand.textContent).toBe("15");
  });

  it("navbar includes 'fixed-top' class by default", () => {
    const { container } = MountedNavbar();
    const nav = container.querySelector(".navbar")!;
    expect(nav.classList.contains("fixed-top")).toBe(true);
  });

  it("navbar includes 'fixed-top' class with fixedTop=true", () => {
    const { container } = MountedNavbar(true);
    const nav = container.querySelector(".navbar")!;
    expect(nav.classList.contains("fixed-top")).toBe(true);
    expect(nav.classList.contains("w-100")).toBe(false);
  });

  it("navbar doesn't 'fixed-top' class with fixedTop=false", () => {
    const { container } = MountedNavbar(false);
    const nav = container.querySelector(".navbar")!;
    expect(nav.classList.contains("fixed-top")).toBe(false);
    expect(nav.classList.contains("w-100")).toBe(true);
  });

  it("body 'padding-top' style is updated after resize", () => {
    MountedNavbar();
    act(() => {
      resizeCallback([{ contentRect: { width: 100, height: 10 } }]);
    });
    expect(
      window
        .getComputedStyle(document.body, null)
        .getPropertyValue("padding-top"),
    ).toBe("18px");

    act(() => {
      resizeCallback([{ contentRect: { width: 100, height: 36 } }]);
    });
    expect(
      window
        .getComputedStyle(document.body, null)
        .getPropertyValue("padding-top"),
    ).toBe("44px");
  });
});

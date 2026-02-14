import { render, fireEvent, act } from "@testing-library/react";

import fetchMock from "fetch-mock";

import { MockGrid } from "__fixtures__/Stories";
import { MockThemeContextWithoutAnimations } from "__fixtures__/Theme";
import { mockMatchMedia } from "__fixtures__/matchMedia";
import { AlertStore } from "Stores/AlertStore";
import { Settings } from "Stores/Settings";
import { SilenceFormStore } from "Stores/SilenceFormStore";
import type { APIGridT } from "Models/APITypes";
import { ThemeContext } from "Components/Theme";
import AlertGrid from ".";
import { GridLabelSelect } from "./GridLabelSelect";

let alertStore: AlertStore;
let settingsStore: Settings;
let silenceFormStore: SilenceFormStore;
let grid: APIGridT;

declare let global: any;
declare let document: any;
declare let window: any;

beforeEach(() => {
  fetchMock.reset();
  fetchMock.mock("*", {
    body: JSON.stringify([]),
  });

  alertStore = new AlertStore([]);
  settingsStore = new Settings(null);
  silenceFormStore = new SilenceFormStore();
  grid = {
    labelName: "foo",
    labelValue: "bar",
    alertGroups: [],
    totalGroups: 0,
    stateCount: {
      active: 0,
      suppressed: 0,
      unprocessed: 0,
    },
  };
  alertStore.data.setLabelNames(["alertname", "job", "cluster"]);

  window.matchMedia = mockMatchMedia({});
  global.ResizeObserver = jest.fn((cb) => {
    return {
      observe: jest.fn(),
      disconnect: jest.fn(),
    };
  });
  global.ResizeObserverEntry = jest.fn();

  jest.useFakeTimers();
});

const MountedGridLabelSelect = () => {
  return render(
    <GridLabelSelect
      alertStore={alertStore}
      settingsStore={settingsStore}
      grid={grid}
    />,
  );
};

describe("<GridLabelSelect />", () => {
  it("select dropdown is hidden by default", async () => {
    const promise = Promise.resolve();
    const { container } = MountedGridLabelSelect();
    expect(
      container.querySelector("div.components-grid-label-select-menu"),
    ).toBeNull();
    await act(() => promise);
  });

  it("clicking toggle renders select dropdown", async () => {
    const promise = Promise.resolve();
    MockGrid(alertStore);
    const { container } = MountedGridLabelSelect();
    const toggle = container.querySelector(
      "span.components-grid-label-select-dropdown",
    )!;
    fireEvent.click(toggle);
    expect(
      container.querySelector("div.components-grid-label-select-menu"),
    ).toBeTruthy();
    await act(() => promise);
  });

  it("clicking an option updates grid settings", async () => {
    const promise = Promise.resolve();
    MockGrid(alertStore);
    const { container } = MountedGridLabelSelect();

    const toggle = container.querySelector(
      "span.components-grid-label-select-dropdown",
    )!;
    fireEvent.click(toggle);
    expect(
      container.querySelector("div.components-grid-label-select-menu"),
    ).toBeTruthy();

    settingsStore.multiGridConfig.setGridLabel("foo");
    const options = container.querySelectorAll("div.react-select__option");
    fireEvent.click(options[5]);
    expect(settingsStore.multiGridConfig.config.gridLabel).toBe("cluster");
    await act(() => promise);
  });

  it("clicking toggle twice hides select dropdown", async () => {
    const promise = Promise.resolve();
    const { container } = MountedGridLabelSelect();
    const toggle = container.querySelector(
      "span.components-grid-label-select-dropdown",
    )!;

    fireEvent.click(toggle);
    act(() => {
      jest.runOnlyPendingTimers();
    });
    expect(
      container.querySelector("div.components-grid-label-select-menu"),
    ).toBeTruthy();

    fireEvent.click(toggle);
    act(() => {
      jest.runOnlyPendingTimers();
    });
    expect(
      container.querySelector("div.components-grid-label-select-menu"),
    ).toBeNull();
    await act(() => promise);
  });

  it("clicking outside hides select dropdown", async () => {
    const promise = Promise.resolve();
    const { container } = MountedGridLabelSelect();
    const toggle = container.querySelector(
      "span.components-grid-label-select-dropdown",
    )!;

    fireEvent.click(toggle);
    act(() => {
      jest.runOnlyPendingTimers();
    });
    expect(
      container.querySelector("div.components-grid-label-select-menu"),
    ).toBeTruthy();

    const clickEvent = document.createEvent("MouseEvents");
    clickEvent.initEvent("mousedown", true, true);
    act(() => {
      document.dispatchEvent(clickEvent);
    });

    act(() => {
      jest.runOnlyPendingTimers();
    });
    expect(
      container.querySelector("div.components-grid-label-select-menu"),
    ).toBeNull();
    await act(() => promise);
  });

  it("opening label select sets z-index", async () => {
    const promise = Promise.resolve();
    alertStore.data.setGrids([
      {
        labelName: "foo",
        labelValue: "bar",
        alertGroups: [],
        totalGroups: 0,
        stateCount: {
          unprocessed: 1,
          suppressed: 2,
          active: 3,
        },
      },
    ]);
    const { container } = render(
      <ThemeContext.Provider value={MockThemeContextWithoutAnimations}>
        <AlertGrid
          alertStore={alertStore}
          settingsStore={settingsStore}
          silenceFormStore={silenceFormStore}
        />
      </ThemeContext.Provider>,
    );

    fireEvent.click(
      container.querySelector("span.components-grid-label-select-dropdown")!,
    );
    expect(
      container.querySelector("div.components-grid-label-select-menu"),
    ).toBeTruthy();

    fireEvent.click(
      container.querySelector("span.components-grid-label-select-dropdown")!,
    );
    act(() => {
      jest.runOnlyPendingTimers();
    });
    expect(
      container.querySelector("div.components-grid-label-select-menu"),
    ).toBeNull();

    await act(() => promise);
  });
});

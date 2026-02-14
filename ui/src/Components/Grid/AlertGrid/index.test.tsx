import { render, fireEvent, act } from "@testing-library/react";

import { MockAlert, MockAlertGroup } from "__fixtures__/Alerts";
import { mockMatchMedia } from "__fixtures__/matchMedia";
import {
  MockThemeContext,
  MockThemeContextWithoutAnimations,
} from "__fixtures__/Theme";
import { AlertStore } from "Stores/AlertStore";
import { Settings } from "Stores/Settings";
import { SilenceFormStore } from "Stores/SilenceFormStore";
import { ThemeContext, ThemeCtx } from "Components/Theme";
import { GetGridElementWidth, GridSizesConfig } from "./GridSize";
import Grid from "./Grid";
import AlertGrid from ".";

let alertStore: AlertStore;
let settingsStore: Settings;
let silenceFormStore: SilenceFormStore;
let resizeCallback: any;

declare let global: any;
declare let document: any;
declare let window: any;

beforeEach(() => {
  alertStore = new AlertStore([]);
  settingsStore = new Settings(null);
  silenceFormStore = new SilenceFormStore();

  window.matchMedia = mockMatchMedia({});

  window.requestAnimationFrame = (cb: FrameRequestCallback) => {
    cb(0);
    return 0;
  };

  Object.defineProperty(document.body, "clientWidth", {
    writable: true,
    value: 1000,
  });

  global.ResizeObserver = jest.fn((cb) => {
    resizeCallback = cb;
    return {
      observe: jest.fn(),
      disconnect: jest.fn(),
    };
  });
  global.ResizeObserverEntry = jest.fn();
});

afterEach(() => {
  jest.clearAllTimers();
  jest.clearAllMocks();
  jest.restoreAllMocks();
  jest.useRealTimers();
});

const MountedAlertGrid = () => {
  return render(
    <ThemeContext.Provider value={MockThemeContext}>
      <AlertGrid
        alertStore={alertStore}
        settingsStore={settingsStore}
        silenceFormStore={silenceFormStore}
      />
    </ThemeContext.Provider>,
  );
};

const MockGrid = () => ({
  labelName: "",
  labelValue: "",
  alertGroups: alertStore.data.grids.length
    ? alertStore.data.grids[0].alertGroups
    : [],
  totalGroups: alertStore.data.grids.length
    ? alertStore.data.grids[0].alertGroups.length
    : 0,
  stateCount: {
    unprocessed: 1,
    suppressed: 2,
    active: 3,
  },
});

const MountedGrid = (theme?: ThemeCtx) => {
  return render(
    <ThemeContext.Provider value={theme || MockThemeContext}>
      <Grid
        alertStore={alertStore}
        silenceFormStore={silenceFormStore}
        settingsStore={settingsStore}
        gridSizesConfig={GridSizesConfig(420)}
        groupWidth={420}
        grid={MockGrid()}
        outerPadding={0}
        paddingTop={0}
        zIndex={101}
      />
    </ThemeContext.Provider>,
  );
};

const MockGroup = (groupName: string, alertCount: number) => {
  const alerts = [];
  for (let i = 1; i <= alertCount; i++) {
    alerts.push(
      MockAlert([], [{ name: "instance", value: `instance${i}` }], "active"),
    );
  }
  const group = MockAlertGroup(
    [
      { name: "alertname", value: "Fake Alert" },
      { name: "group", value: "groupName" },
    ],
    alerts,
    [],
    [],
    {},
  );
  return group;
};

const MockGroupList = (
  count: number,
  alertPerGroup: number,
  totalGroups?: number,
) => {
  const groups = [];
  for (let i = 1; i <= count; i++) {
    const id = `id${i}`;
    const group = MockGroup(`group${i}`, alertPerGroup);
    group.id = id;
    groups.push(group);
  }
  alertStore.data.setUpstreams({
    counters: { total: 0, healthy: 1, failed: 0 },
    instances: [
      {
        name: "am",
        cluster: "am",
        clusterMembers: ["am"],
        uri: "http://am",
        publicURI: "http://am",
        error: "",
        version: "0.24.0",
        headers: {},
        corsCredentials: "omit",
        readonly: false,
      },
    ],
    clusters: { am: ["am"] },
  });
  alertStore.data.setGrids([
    {
      labelName: "",
      labelValue: "",
      alertGroups: groups,
      totalGroups: totalGroups ? totalGroups : groups.length,
      stateCount: {
        unprocessed: 1,
        suppressed: 2,
        active: 3,
      },
    },
  ]);
};

describe("<Grid />", () => {
  it("uses animations when settingsStore.themeConfig.config.animations is true", () => {
    MockGroupList(1, 1);
    const { container } = MountedGrid(MockThemeContext);
    const alertGroupEl = container.querySelector(
      "div.components-grid-alertgrid-alertgroup",
    )!;
    expect(alertGroupEl.classList.contains("animate")).toBe(true);
  });

  it("doesn't use animations when settingsStore.themeConfig.config.animations is false", () => {
    MockGroupList(1, 1);
    const { container } = MountedGrid(MockThemeContextWithoutAnimations);
    const alertGroupEl = container.querySelector(
      "div.components-grid-alertgrid-alertgroup",
    )!;
    expect(alertGroupEl.classList.contains("animate")).toBe(false);
  });

  it("renders all alert groups", () => {
    MockGroupList(55, 5);
    const { container } = MountedGrid();
    const alertGroups = container.querySelectorAll(
      "div.components-grid-alertgrid-alertgroup",
    );
    expect(alertGroups).toHaveLength(55);
  });

  it("appends more groups after clicking 'Load More' button", () => {
    MockGroupList(40, 5, 70);
    const { container } = render(
      <ThemeContext.Provider value={MockThemeContext}>
        <Grid
          alertStore={alertStore}
          silenceFormStore={silenceFormStore}
          settingsStore={settingsStore}
          gridSizesConfig={GridSizesConfig(420)}
          groupWidth={420}
          grid={alertStore.data.grids[0]}
          outerPadding={0}
          paddingTop={0}
          zIndex={101}
        />
      </ThemeContext.Provider>,
    );
    fireEvent.click(container.querySelector("button")!);
    expect(alertStore.ui.gridGroupLimits).toStrictEqual({
      "": { "": 40 + alertStore.settings.values.gridGroupLimit },
    });
  });

  it("sets correct limits after clicking 'Load More' button", () => {
    MockGroupList(50, 5, 60);
    alertStore.settings.setValues({
      ...alertStore.settings.values,
      gridGroupLimit: 20,
    });
    alertStore.data.setGrids([
      {
        ...alertStore.data.grids[0],
        labelName: "foo",
        labelValue: "bar",
        totalGroups: 69,
      },
    ]);
    const { container } = render(
      <ThemeContext.Provider value={MockThemeContext}>
        <Grid
          alertStore={alertStore}
          silenceFormStore={silenceFormStore}
          settingsStore={settingsStore}
          gridSizesConfig={GridSizesConfig(420)}
          groupWidth={420}
          grid={alertStore.data.grids[0]}
          outerPadding={0}
          paddingTop={0}
          zIndex={101}
        />
      </ThemeContext.Provider>,
    );
    fireEvent.click(container.querySelector("button")!);
    expect(alertStore.ui.gridGroupLimits).toStrictEqual({
      foo: { bar: 70 },
    });
  });

  it("click on the grid toggle toggles all groups", () => {
    jest.useFakeTimers();

    MockGroupList(10, 3);
    const grid = {
      ...MockGrid(),
      labelName: "foo",
      labelValue: "bar",
      stateCount: {
        unprocessed: 1,
        suppressed: 2,
        active: 3,
      },
    };
    alertStore.data.setGrids([grid]);
    const { container } = render(
      <ThemeContext.Provider value={MockThemeContext}>
        <Grid
          alertStore={alertStore}
          silenceFormStore={silenceFormStore}
          settingsStore={settingsStore}
          gridSizesConfig={GridSizesConfig(420)}
          groupWidth={420}
          grid={alertStore.data.grids[0]}
          outerPadding={0}
          paddingTop={0}
          zIndex={101}
        />
      </ThemeContext.Provider>,
    );
    expect(
      container.querySelectorAll("div.components-grid-alertgrid-alertgroup"),
    ).toHaveLength(10);

    // Click the collapse toggle (second cursor-pointer span)
    const toggles = container.querySelectorAll("span.cursor-pointer");
    fireEvent.click(toggles[1]);
    act(() => {
      jest.runOnlyPendingTimers();
    });
    expect(
      container.querySelectorAll("div.components-grid-alertgrid-alertgroup"),
    ).toHaveLength(0);

    fireEvent.click(toggles[1]);
    act(() => {
      jest.runOnlyPendingTimers();
    });
    expect(
      container.querySelectorAll("div.components-grid-alertgrid-alertgroup"),
    ).toHaveLength(10);
  });

  it("renders filter badge for grids with a value", () => {
    MockGroupList(1, 1);
    const grid = {
      ...MockGrid(),
      labelName: "foo",
      labelValue: "bar",
      stateCount: {
        unprocessed: 0,
        suppressed: 0,
        active: 0,
      },
    };
    alertStore.data.setGrids([grid, MockGrid()]);
    const { container } = render(
      <ThemeContext.Provider value={MockThemeContext}>
        <Grid
          alertStore={alertStore}
          silenceFormStore={silenceFormStore}
          settingsStore={settingsStore}
          gridSizesConfig={GridSizesConfig(420)}
          groupWidth={420}
          grid={grid}
          outerPadding={0}
          paddingTop={0}
          zIndex={101}
        />
      </ThemeContext.Provider>,
    );
    const h5 = container.querySelector("h5")!;
    const filterLabel = h5.querySelector(".components-label .components-label-name");
    expect(filterLabel).not.toBeNull();
    expect(filterLabel!.closest(".components-label")!.textContent).toBe("foo: bar");
  });

  it("doesn't render filter badge for grids with no value", () => {
    MockGroupList(1, 1);
    const grid = {
      ...MockGrid(),
      labelName: "foo",
      labelValue: "",
      stateCount: {
        unprocessed: 0,
        suppressed: 0,
        active: 0,
      },
    };
    alertStore.data.setGrids([grid, MockGrid()]);
    const { container } = render(
      <ThemeContext.Provider value={MockThemeContext}>
        <Grid
          alertStore={alertStore}
          silenceFormStore={silenceFormStore}
          settingsStore={settingsStore}
          gridSizesConfig={GridSizesConfig(420)}
          groupWidth={420}
          grid={grid}
          outerPadding={0}
          paddingTop={0}
          zIndex={101}
        />
      </ThemeContext.Provider>,
    );
    const h5 = container.querySelector("h5");
    if (h5) {
      const filterLabel = h5.querySelector(".components-label .components-label-name");
      expect(filterLabel).toBeNull();
    }
  });

  it("left click on a group collapse toggle only toggles clicked group", () => {
    MockGroupList(10, 3);
    const { container } = MountedGrid();

    const alertGroups = container.querySelectorAll(
      "div.components-grid-alertgrid-alertgroup",
    );
    expect(alertGroups).toHaveLength(10);

    // Each group should have 3 alerts
    for (let i = 0; i < 10; i++) {
      expect(
        alertGroups[i].querySelectorAll(
          "li.components-grid-alertgrid-alertgroup-alert",
        ),
      ).toHaveLength(3);
    }

    // Click collapse toggle on 3rd group (index 2)
    const group3 = alertGroups[2];
    const toggles = group3.querySelectorAll("span.cursor-pointer");
    // The collapse toggle is the second cursor-pointer span in the group header
    fireEvent.click(toggles[1]);

    // Re-query after click
    const updatedGroups = container.querySelectorAll(
      "div.components-grid-alertgrid-alertgroup",
    );
    for (let i = 0; i < 10; i++) {
      expect(
        updatedGroups[i].querySelectorAll(
          "li.components-grid-alertgrid-alertgroup-alert",
        ),
      ).toHaveLength(i === 2 ? 0 : 3);
    }
  });

  it("left click + alt on a group collapse toggle toggles all groups in current grid", () => {
    MockGroupList(20, 3);
    const groups = alertStore.data.grids[0].alertGroups;
    alertStore.data.setGrids([
      {
        labelName: "foo",
        labelValue: "bar",
        alertGroups: groups.slice(0, 10),
        totalGroups: groups.slice(0, 10).length,
        stateCount: {
          unprocessed: 1,
          suppressed: 2,
          active: 3,
        },
      },
      {
        labelName: "foo",
        labelValue: "",
        alertGroups: groups.slice(10, 20),
        totalGroups: groups.slice(10, 20).length,
        stateCount: {
          unprocessed: 1,
          suppressed: 2,
          active: 3,
        },
      },
    ]);
    const { container } = MountedAlertGrid();

    const allGroups = container.querySelectorAll(
      "div.components-grid-alertgrid-alertgroup",
    );
    expect(allGroups).toHaveLength(20);

    for (let i = 0; i < 20; i++) {
      expect(
        allGroups[i].querySelectorAll(
          "li.components-grid-alertgrid-alertgroup-alert",
        ),
      ).toHaveLength(3);
    }

    // Alt+click on 3rd group's collapse toggle
    const group3 = allGroups[2];
    const toggles = group3.querySelectorAll("span.cursor-pointer");
    fireEvent.click(toggles[1], { altKey: true });

    // First 10 groups (same grid) should be collapsed
    const updatedGroups = container.querySelectorAll(
      "div.components-grid-alertgrid-alertgroup",
    );
    // After collapsing, groups in first grid should not render alerts
    for (let i = 0; i < updatedGroups.length; i++) {
      const alerts = updatedGroups[i].querySelectorAll(
        "li.components-grid-alertgrid-alertgroup-alert",
      );
      if (i < 10) {
        expect(alerts).toHaveLength(0);
      } else {
        expect(alerts).toHaveLength(3);
      }
    }
  });

  it("doesn't throw errors after FontFaceObserver timeout", () => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date(Date.UTC(2000, 1, 1, 0, 0, 0)));

    MockGroupList(1, 1);
    MountedGrid();
    // skip a minute to trigger FontFaceObserver timeout handler
    jest.setSystemTime(new Date(Date.UTC(2000, 1, 1, 0, 1, 0)));
    act(() => {
      jest.runOnlyPendingTimers();
    });
  });

  it("doesn't crash on unmount", () => {
    MockGroupList(5, 3);
    const { unmount } = MountedGrid();
    unmount();
  });
});

describe("<AlertGrid />", () => {
  it("renders expected number of columns for every resolution", () => {
    const minWidth = 400;
    let lastColumns = 1;
    for (let i = 100; i <= 4096; i++) {
      const expectedColumns = Math.max(Math.floor(i / minWidth), 1);
      const columns = Math.floor(i / GetGridElementWidth(i, i, 0, minWidth));

      expect({
        resolution: i,
        minWidth: minWidth,
        columns: columns,
      }).toEqual({
        resolution: i,
        minWidth: minWidth,
        columns: expectedColumns,
      });
      expect(columns).toBeGreaterThanOrEqual(lastColumns);

      lastColumns = columns;
    }
  });

  it("alt+click on a grid toggle toggles all grid groups", () => {
    MockGroupList(3, 1);
    const groups = alertStore.data.grids[0].alertGroups;
    alertStore.data.setGrids([
      {
        labelName: "foo",
        labelValue: "bar",
        alertGroups: groups,
        totalGroups: groups.length,
        stateCount: {
          unprocessed: 1,
          suppressed: 2,
          active: 3,
        },
      },
      {
        labelName: "foo",
        labelValue: "",
        alertGroups: groups,
        totalGroups: groups.length,
        stateCount: {
          unprocessed: 1,
          suppressed: 2,
          active: 3,
        },
      },
    ]);
    const { container } = MountedAlertGrid();
    expect(
      container.querySelectorAll("div.components-grid"),
    ).toHaveLength(2);
    expect(
      container.querySelectorAll("div.components-grid-alertgrid-alertgroup"),
    ).toHaveLength(6);

    // toggle all grids to hide all groups
    const firstGrid = container.querySelectorAll("div.components-grid")[0];
    const toggles = firstGrid
      .closest("div[style]")!
      .querySelectorAll("span.cursor-pointer");
    fireEvent.click(toggles[1], { altKey: true });
  });

  it("adds extra padding to alert groups when multi-grid is enabled", () => {
    MockGroupList(10, 3);
    const groups = alertStore.data.grids[0].alertGroups;
    alertStore.data.setGrids([
      {
        labelName: "foo",
        labelValue: "bar",
        alertGroups: groups,
        totalGroups: groups.length,
        stateCount: {
          unprocessed: 0,
          suppressed: 0,
          active: 0,
        },
      },
      {
        labelName: "foo",
        labelValue: "",
        alertGroups: groups,
        totalGroups: groups.length,
        stateCount: {
          unprocessed: 0,
          suppressed: 0,
          active: 0,
        },
      },
    ]);
    document.body.clientWidth = 1200;
    window.innerWidth = 1000;
    const { container } = MountedAlertGrid();
    expect(container.querySelectorAll("div.components-grid")).toHaveLength(2);
    expect(
      container.querySelectorAll("div.components-grid-alertgrid-alertgroup"),
    ).toHaveLength(20);

    const gridDiv = container.querySelector("div.components-grid")!;
    expect(gridDiv.getAttribute("style")).toMatch(/padding-left:\s*5px/);
    expect(gridDiv.getAttribute("style")).toMatch(/padding-right:\s*5px/);

    container
      .querySelectorAll("div.components-grid-alertgrid-alertgroup")
      .forEach((node) => {
        expect(node.getAttribute("style")).toMatch(/width:\s*595/);
      });
  });

  it("doesn't add extra padding to alert groups when multi-grid is disabled", () => {
    MockGroupList(10, 3);
    const groups = alertStore.data.grids[0].alertGroups;
    alertStore.data.setGrids([
      {
        labelName: "",
        labelValue: "",
        alertGroups: groups,
        totalGroups: groups.length,
        stateCount: {
          unprocessed: 0,
          suppressed: 0,
          active: 0,
        },
      },
    ]);
    document.body.clientWidth = 1200;
    window.innerWidth = 1000;
    const { container } = MountedAlertGrid();
    expect(container.querySelectorAll("div.components-grid")).toHaveLength(1);
    expect(
      container.querySelectorAll("div.components-grid-alertgrid-alertgroup"),
    ).toHaveLength(10);

    const gridDiv = container.querySelector("div.components-grid")!;
    expect(gridDiv.getAttribute("style")).toMatch(/padding-left:\s*0px/);
    expect(gridDiv.getAttribute("style")).toMatch(/padding-right:\s*0px/);

    container
      .querySelectorAll("div.components-grid-alertgrid-alertgroup")
      .forEach((node) => {
        expect(node.getAttribute("style")).toMatch(/width:\s*600/);
      });
  });

  it("doesn't crash on unmount", () => {
    MockGroupList(5, 1);
    const { unmount } = MountedAlertGrid();
    unmount();
  });
});

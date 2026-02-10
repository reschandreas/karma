<<<<<<< HEAD
import { render, screen } from "@testing-library/react";
=======
import { render } from "@testing-library/react";
>>>>>>> f2d4110a (upgrading to react 19)

import { mockMatchMedia } from "__fixtures__/matchMedia";
import { AlertStore } from "Stores/AlertStore";
import { Settings } from "Stores/Settings";
import { SilenceFormStore } from "Stores/SilenceFormStore";
import Grid from ".";

let alertStore: AlertStore;
let settingsStore: Settings;
let silenceFormStore: SilenceFormStore;

let originalInnerWidth: number;

declare let global: any;

beforeEach(() => {
  alertStore = new AlertStore([]);
  settingsStore = new Settings(null);
  silenceFormStore = new SilenceFormStore();

  originalInnerWidth = global.innerWidth;

  global.ResizeObserver = jest.fn(() => ({
    observe: jest.fn(),
    disconnect: jest.fn(),
  }));
  global.ResizeObserverEntry = jest.fn();

  window.matchMedia = mockMatchMedia({});
});

afterEach(() => {
  global.innerWidth = originalInnerWidth;
});

<<<<<<< HEAD
const renderGrid = () => {
=======
const RenderGrid = () => {
>>>>>>> f2d4110a (upgrading to react 19)
  return render(
    <Grid
      alertStore={alertStore}
      settingsStore={settingsStore}
      silenceFormStore={silenceFormStore}
    />,
  );
};

const setupGrids = () => {
  alertStore.data.setGrids([
    {
      labelName: "",
      labelValue: "",
      alertGroups: [],
      totalGroups: 0,
      stateCount: { unprocessed: 0, suppressed: 0, active: 0 },
    },
  ]);
};

describe("<Grid />", () => {
  it("renders only AlertGrid when all upstreams are healthy", () => {
<<<<<<< HEAD
    setupGrids();
    const { container } = renderGrid();
    expect(container.querySelector(".components-grid")).toBeInTheDocument();
=======
    const { container } = RenderGrid();
    // AlertGrid is rendered (no error/special states)
    expect(container.textContent).not.toMatch(/No alertmanager server/);
    expect(container.querySelector(".screen-center-icon-big")).toBeNull();
>>>>>>> f2d4110a (upgrading to react 19)
  });

  it("renders FatalError if there's only one upstream and it's unhealthy", () => {
    alertStore.data.setUpstreams({
      counters: { total: 1, healthy: 0, failed: 1 },
      instances: [
        {
          name: "am1",
          cluster: "am",
          clusterMembers: ["am"],
          uri: "http://am1",
          publicURI: "http://am1",
          error: "connection refused",
          version: "0.24.0",
          readonly: false,
          corsCredentials: "include",
          headers: {},
        },
      ],
      clusters: { am1: ["am1"] },
    });
<<<<<<< HEAD
    renderGrid();
    expect(screen.getByText("error")).toBeInTheDocument();
=======
    const { container } = RenderGrid();
    expect(container.textContent).toMatch(/connection refused/);
>>>>>>> f2d4110a (upgrading to react 19)
  });

  it("renders AlertGrid if there's only one upstream and it's unhealthy but there are alerts", () => {
    alertStore.data.setUpstreams({
      counters: { total: 1, healthy: 0, failed: 1 },
      instances: [
        {
          name: "am1",
          cluster: "am",
          clusterMembers: ["am"],
          uri: "http://am1",
          publicURI: "http://am1",
          error: "error",
          version: "0.24.0",
          readonly: false,
          corsCredentials: "include",
          headers: {},
        },
      ],
      clusters: { am1: ["am1"] },
    });
    alertStore.info.setTotalAlerts(1);
<<<<<<< HEAD
    setupGrids();
    const { container } = renderGrid();
    expect(container.querySelector(".components-grid")).toBeInTheDocument();
=======
    const { container } = RenderGrid();
    // AlertGrid is rendered, no FatalError
    expect(container.querySelector(".screen-center-icon-big")).toBeNull();
>>>>>>> f2d4110a (upgrading to react 19)
  });

  it("renders FatalError if there's only one upstream and it's unhealthy but without any error", () => {
    alertStore.data.setUpstreams({
      counters: { total: 1, healthy: 0, failed: 1 },
      instances: [
        {
          name: "am1",
          cluster: "am",
          clusterMembers: ["am"],
          uri: "http://am1",
          publicURI: "http://am1",
          error: "error",
          version: "0.24.0",
          readonly: false,
          corsCredentials: "include",
          headers: {},
        },
      ],
      clusters: { am1: ["am1"] },
    });
<<<<<<< HEAD
    renderGrid();
    expect(screen.getByText("error")).toBeInTheDocument();
=======
    const { container } = RenderGrid();
    expect(container.textContent).toMatch(/error/);
>>>>>>> f2d4110a (upgrading to react 19)
  });

  it("renders only FatalError on failed fetch", () => {
    alertStore.status.setError("fetch error");
    alertStore.data.setUpstreams({
      counters: { total: 0, healthy: 0, failed: 1 },
      instances: [
        {
          name: "am1",
          cluster: "am",
          clusterMembers: ["am"],
          uri: "http://am1",
          publicURI: "http://am1",
          error: "error",
          version: "0.24.0",
          readonly: false,
          corsCredentials: "include",
          headers: {},
        },
      ],
      clusters: { am1: ["am1"] },
    });
<<<<<<< HEAD
    renderGrid();
    expect(screen.getByText("fetch error")).toBeInTheDocument();
=======
    const { container } = RenderGrid();
    expect(container.textContent).toMatch(/fetch error/);
>>>>>>> f2d4110a (upgrading to react 19)
  });

  it("renders UpgradeNeeded when alertStore.info.upgradeNeeded=true", () => {
    alertStore.info.setUpgradeNeeded(true);
<<<<<<< HEAD
    renderGrid();
    expect(screen.getByText(/new version/i)).toBeInTheDocument();
=======
    const { container } = RenderGrid();
    expect(container.textContent).toMatch(alertStore.info.version);
>>>>>>> f2d4110a (upgrading to react 19)
  });

  it("renders ReloadNeeded when alertStore.info.reloadNeeded=true", () => {
    alertStore.info.setReloadNeeded(true);
<<<<<<< HEAD
    renderGrid();
    expect(screen.getByText(/reload/i)).toBeInTheDocument();
=======
    const { container } = RenderGrid();
    expect(container.textContent).toMatch(/will try to reload/);
>>>>>>> f2d4110a (upgrading to react 19)
  });

  it("renders AlertGrid before any fetch finished when totalAlerts is 0", () => {
    alertStore.info.setVersion("unknown");
    alertStore.info.setTotalAlerts(0);
<<<<<<< HEAD
    setupGrids();
    const { container } = renderGrid();
    expect(container.querySelector(".components-grid")).toBeInTheDocument();
=======
    const { container } = RenderGrid();
    expect(container.textContent).not.toMatch(/No alertmanager server/);
    expect(container.querySelector(".screen-center-icon-big")).toBeNull();
>>>>>>> f2d4110a (upgrading to react 19)
  });

  it("renders EmptyGrid after first fetch when totalAlerts is 0", () => {
    alertStore.info.setVersion("1.2.3");
    alertStore.info.setTotalAlerts(0);
    alertStore.data.setUpstreams({
      counters: { total: 1, healthy: 1, failed: 1 },
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
<<<<<<< HEAD
    const { container } = renderGrid();
    expect(container.querySelector(".fa-mug-hot")).toBeInTheDocument();
=======
    const { container } = RenderGrid();
    expect(container.querySelector(".screen-center-icon-big")).toBeTruthy();
>>>>>>> f2d4110a (upgrading to react 19)
  });

  it("renders NoUpstream after first fetch when upstream list is empty", () => {
    alertStore.info.setVersion("1.2.3");
    alertStore.info.setTotalAlerts(0);
    alertStore.data.setUpstreams({
      counters: { total: 0, healthy: 0, failed: 0 },
      instances: [],
      clusters: {},
    });
<<<<<<< HEAD
    renderGrid();
    expect(
      screen.getByText(/No alertmanager server configured/i),
    ).toBeInTheDocument();
=======
    const { container } = RenderGrid();
    expect(container.textContent).toMatch(/No alertmanager server configured/);
>>>>>>> f2d4110a (upgrading to react 19)
  });

  it("renders AlertGrid after first fetch finished when totalAlerts is >0", () => {
    alertStore.info.setVersion("unknown");
    alertStore.info.setTotalAlerts(1);
<<<<<<< HEAD
    setupGrids();
    const { container } = renderGrid();
    expect(container.querySelector(".components-grid")).toBeInTheDocument();
  });

  it("unmounts without crashes", () => {
    const { unmount } = renderGrid();
=======
    const { container } = RenderGrid();
    expect(container.textContent).not.toMatch(/No alertmanager server/);
    expect(container.querySelector(".screen-center-icon-big")).toBeNull();
  });

  it("unmounts without crashes", () => {
    const { unmount } = RenderGrid();
>>>>>>> f2d4110a (upgrading to react 19)
    unmount();
  });
});

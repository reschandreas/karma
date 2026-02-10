import { render } from "@testing-library/react";

import { AlertStore } from "Stores/AlertStore";
import { Settings } from "Stores/Settings";
import { SilenceFormStore } from "Stores/SilenceFormStore";
import Grid from ".";

let alertStore: AlertStore;
let settingsStore: Settings;
let silenceFormStore: SilenceFormStore;

let originalInnerWidth: number;

beforeEach(() => {
  alertStore = new AlertStore([]);
  settingsStore = new Settings(null);
  silenceFormStore = new SilenceFormStore();

  originalInnerWidth = global.innerWidth;
});

afterEach(() => {
  global.innerWidth = originalInnerWidth;
});

const RenderGrid = () => {
  return render(
    <Grid
      alertStore={alertStore}
      settingsStore={settingsStore}
      silenceFormStore={silenceFormStore}
    />,
  );
};

describe("<Grid />", () => {
  it("renders only AlertGrid when all upstreams are healthy", () => {
    const { container } = RenderGrid();
    // AlertGrid is rendered (no error/special states)
    expect(container.textContent).not.toMatch(/No alertmanager server/);
    expect(container.querySelector(".screen-center-icon-big")).toBeNull();
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
    const { container } = RenderGrid();
    expect(container.textContent).toMatch(/connection refused/);
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
    const { container } = RenderGrid();
    // AlertGrid is rendered, no FatalError
    expect(container.querySelector(".screen-center-icon-big")).toBeNull();
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
    const { container } = RenderGrid();
    expect(container.textContent).toMatch(/error/);
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
    const { container } = RenderGrid();
    expect(container.textContent).toMatch(/fetch error/);
  });

  it("renders UpgradeNeeded when alertStore.info.upgradeNeeded=true", () => {
    alertStore.info.setUpgradeNeeded(true);
    const { container } = RenderGrid();
    expect(container.textContent).toMatch(alertStore.info.version);
  });

  it("renders ReloadNeeded when alertStore.info.reloadNeeded=true", () => {
    alertStore.info.setReloadNeeded(true);
    const { container } = RenderGrid();
    expect(container.textContent).toMatch(/will try to reload/);
  });

  it("renders AlertGrid before any fetch finished when totalAlerts is 0", () => {
    alertStore.info.setVersion("unknown");
    alertStore.info.setTotalAlerts(0);
    const { container } = RenderGrid();
    expect(container.textContent).not.toMatch(/No alertmanager server/);
    expect(container.querySelector(".screen-center-icon-big")).toBeNull();
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
    const { container } = RenderGrid();
    expect(container.querySelector(".screen-center-icon-big")).toBeTruthy();
  });

  it("renders NoUpstream after first fetch when upstream list is empty", () => {
    alertStore.info.setVersion("1.2.3");
    alertStore.info.setTotalAlerts(0);
    alertStore.data.setUpstreams({
      counters: { total: 0, healthy: 0, failed: 0 },
      instances: [],
      clusters: {},
    });
    const { container } = RenderGrid();
    expect(container.textContent).toMatch(/No alertmanager server configured/);
  });

  it("renders AlertGrid after first fetch finished when totalAlerts is >0", () => {
    alertStore.info.setVersion("unknown");
    alertStore.info.setTotalAlerts(1);
    const { container } = RenderGrid();
    expect(container.textContent).not.toMatch(/No alertmanager server/);
    expect(container.querySelector(".screen-center-icon-big")).toBeNull();
  });

  it("unmounts without crashes", () => {
    const { unmount } = RenderGrid();
    unmount();
  });
});

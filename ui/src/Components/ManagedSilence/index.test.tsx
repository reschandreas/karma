import { render, fireEvent, act } from "@testing-library/react";

import { MockSilence } from "__fixtures__/Alerts";
import { MockThemeContext } from "__fixtures__/Theme";
import type { APISilenceT } from "Models/APITypes";
import { AlertStore } from "Stores/AlertStore";
import { SilenceFormStore } from "Stores/SilenceFormStore";
import { ThemeContext } from "Components/Theme";
import { ManagedSilence, GetAlertmanager } from ".";

let alertStore: AlertStore;
let silenceFormStore: SilenceFormStore;
let cluster: string;
let silence: APISilenceT;

beforeEach(() => {
  jest.useFakeTimers();
  jest.setSystemTime(new Date(Date.UTC(2000, 0, 1, 0, 30, 0)));

  alertStore = new AlertStore([]);
  silenceFormStore = new SilenceFormStore();
  cluster = "am";
  silence = MockSilence();

  alertStore.data.setUpstreams({
    counters: { total: 1, healthy: 1, failed: 0 },
    instances: [
      {
        name: "am1",
        cluster: "am",
        clusterMembers: ["am1"],
        uri: "http://localhost:9093",
        publicURI: "http://example.com",
        readonly: false,
        error: "",
        version: "0.24.0",
        headers: {},
        corsCredentials: "include",
      },
    ],
    clusters: { am: ["am1"] },
  });

  jest.restoreAllMocks();
});

afterEach(() => {
  jest.restoreAllMocks();
  jest.useRealTimers();
});

const MountedManagedSilence = (onDidUpdate?: () => void) => {
  return render(
    <ThemeContext.Provider value={MockThemeContext}>
      <ManagedSilence
        cluster={cluster}
        alertCount={123}
        alertCountAlwaysVisible={true}
        silence={silence}
        alertStore={alertStore}
        silenceFormStore={silenceFormStore}
        onDidUpdate={onDidUpdate}
      />
    </ThemeContext.Provider>,
  );
};

describe("<ManagedSilence />", () => {
  it("matches snapshot when collapsed", () => {
    const { asFragment } = MountedManagedSilence();
    expect(asFragment()).toMatchSnapshot();
  });

  it("clicking on expand toggle shows silence details", () => {
    const { container } = MountedManagedSilence();
    fireEvent.click(container.querySelector("svg.text-muted.cursor-pointer")!);
    expect(container.querySelectorAll(".badge")).not.toHaveLength(0);
  });

  it("matches snapshot with expaned details", () => {
    const { container, asFragment } = MountedManagedSilence();
    fireEvent.click(container.querySelector("svg.text-muted.cursor-pointer")!);
    expect(asFragment()).toMatchSnapshot();
  });

  it("GetAlertmanager() returns alertmanager object from alertStore.data.upstreams.instances", () => {
    const am = GetAlertmanager(alertStore, cluster);
    expect(am).toEqual({
      name: "am1",
      cluster: "am",
      clusterMembers: ["am1"],
      uri: "http://localhost:9093",
      publicURI: "http://example.com",
      readonly: false,
      error: "",
      version: "0.24.0",
      headers: {},
      corsCredentials: "include",
    });
  });

  it("GetAlertmanager() returns only writable instances", () => {
    alertStore.data.setUpstreams({
      counters: { total: 2, healthy: 2, failed: 0 },
      instances: [
        {
          name: "am1",
          cluster: "am",
          clusterMembers: ["am1", "am2"],
          uri: "http://localhost:9093",
          publicURI: "http://example.com",
          readonly: false,
          error: "",
          version: "0.24.0",
          headers: {},
          corsCredentials: "include",
        },
        {
          name: "am2",
          cluster: "am",
          clusterMembers: ["am1", "am2"],
          uri: "http://localhost:9094",
          publicURI: "http://example.com",
          readonly: true,
          error: "",
          version: "0.24.0",
          headers: {},
          corsCredentials: "include",
        },
      ],
      clusters: { am: ["am1", "am2"] },
    });

    const am = GetAlertmanager(alertStore, cluster);
    expect(am).toEqual({
      name: "am1",
      cluster: "am",
      clusterMembers: ["am1"],
      uri: "http://localhost:9093",
      publicURI: "http://example.com",
      readonly: false,
      error: "",
      version: "0.24.0",
      headers: {},
      corsCredentials: "include",
    });
  });

  it("shows Edit button on unexpired silence", () => {
    const { container } = MountedManagedSilence();
    fireEvent.click(container.querySelector("svg.text-muted.cursor-pointer")!);

    const button = container.querySelector(".btn-primary")!;
    expect(button.textContent).toBe("Edit");
  });

  it("shows Delete button on unexpired silence", () => {
    const { container } = MountedManagedSilence();
    fireEvent.click(container.querySelector("svg.text-muted.cursor-pointer")!);

    const button = container.querySelector(".btn-danger")!;
    expect(button.textContent).toBe("Delete");
  });

  it("shows Recreate button on expired silence", () => {
    jest.setSystemTime(new Date(Date.UTC(2000, 0, 1, 23, 30, 0)));
    const { container } = MountedManagedSilence();
    fireEvent.click(container.querySelector("svg.text-muted.cursor-pointer")!);

    const button = container.querySelector(".btn-primary")!;
    expect(button.textContent).toBe("Recreate");
  });

  it("clicking on Edit calls", () => {
    const { container } = MountedManagedSilence();
    fireEvent.click(container.querySelector("svg.text-muted.cursor-pointer")!);

    expect(silenceFormStore.data.silenceID).toBeNull();

    const button = container.querySelector(".btn-primary")!;
    expect(button.textContent).toBe("Edit");

    fireEvent.click(button);
    expect(silenceFormStore.data.silenceID).toBe(silence.id);
  });

  it("call onDidUpdate if passed", () => {
    const fakeUpdate = jest.fn();
    const { container } = MountedManagedSilence(fakeUpdate);
    fireEvent.click(container.querySelector("svg.text-muted.cursor-pointer")!);
    expect(fakeUpdate).toHaveBeenCalled();
  });
});

describe("<ManagedSilence progress bar />", () => {
  it("renders with class 'danger' and no progressbar when expired", () => {
    jest.setSystemTime(new Date(Date.UTC(2001, 0, 1, 23, 0, 0)));
    const { container } = MountedManagedSilence();
    expect(container.innerHTML).toMatch(/bg-danger/);
    expect(container.textContent).toMatch(/Expired 1 year ago/);
  });

  it("renders with class 'warning' if <= 5m is left", () => {
    jest.setSystemTime(new Date(Date.UTC(2000, 0, 1, 0, 56, 0)));
    const { container } = MountedManagedSilence();
    expect(container.innerHTML).toMatch(/bg-warning/);
    expect(container.textContent).toMatch(/Expires in 4 minutes/);
  });

  it("progressbar uses class 'danger' when > 90%", () => {
    jest.setSystemTime(new Date(Date.UTC(2000, 0, 1, 0, 55, 0)));
    const { container } = MountedManagedSilence();
    expect(container.innerHTML).toMatch(/progress-bar bg-danger/);
  });

  it("progressbar uses class 'danger' when > 75%", () => {
    jest.setSystemTime(new Date(Date.UTC(2000, 0, 1, 0, 50, 0)));
    const { container } = MountedManagedSilence();
    expect(container.innerHTML).toMatch(/progress-bar bg-warning/);
  });

  it("progressbar uses class 'success' when <= 75%", () => {
    jest.setSystemTime(new Date(Date.UTC(2000, 0, 1, 0, 30, 0)));
    const { container } = MountedManagedSilence();
    expect(container.innerHTML).toMatch(/progress-bar bg-success/);
  });

  it("progressbar is updated every 30 seconds", () => {
    jest.setSystemTime(new Date(Date.UTC(2000, 0, 1, 0, 30, 0)));
    const { container } = MountedManagedSilence();
    expect(container.innerHTML).toMatch(/progress-bar bg-success/);

    jest.setSystemTime(new Date(Date.UTC(2000, 0, 1, 0, 50, 0)));
    act(() => {
      jest.runOnlyPendingTimers();
    });
    expect(container.innerHTML).toMatch(/progress-bar bg-warning/);

    jest.setSystemTime(new Date(Date.UTC(2000, 0, 1, 0, 55, 0)));
    act(() => {
      jest.runOnlyPendingTimers();
    });
    expect(container.innerHTML).toMatch(/progress-bar bg-danger/);
  });

  it("unmounts cleanly", () => {
    const { unmount } = MountedManagedSilence();
    unmount();
  });
});

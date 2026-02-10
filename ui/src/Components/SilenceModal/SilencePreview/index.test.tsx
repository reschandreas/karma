<<<<<<< HEAD
import { render, screen, fireEvent } from "@testing-library/react";
=======
import { render, fireEvent } from "@testing-library/react";
>>>>>>> f2d4110a (upgrading to react 19)

import { AlertStore } from "Stores/AlertStore";
import { SilenceFormStore, NewEmptyMatcher } from "Stores/SilenceFormStore";
import { useFetchGet } from "Hooks/useFetchGet";
import { StringToOption } from "Common/Select";
import { useFetchGetMock } from "__fixtures__/useFetchGet";
import { SilencePreview } from ".";

let alertStore: AlertStore;
let silenceFormStore: SilenceFormStore;

beforeEach(() => {
  alertStore = new AlertStore([]);

  const matcher = NewEmptyMatcher();
  matcher.name = "foo";
  matcher.values = [StringToOption("bar")];

  silenceFormStore = new SilenceFormStore();
  silenceFormStore.data.setMatchers([matcher]);
});

afterEach(() => {
  jest.restoreAllMocks();
  (useFetchGet as jest.MockedFunction<typeof useFetchGetMock>).mockReset();
});

<<<<<<< HEAD
const renderSilencePreview = () => {
=======
const MountedSilencePreview = () => {
>>>>>>> f2d4110a (upgrading to react 19)
  return render(
    <SilencePreview
      alertStore={alertStore}
      silenceFormStore={silenceFormStore}
    />,
  );
};

describe("<SilencePreview />", () => {
  it("fetches matching alerts on mount", () => {
    renderSilencePreview();
    expect(useFetchGet).toHaveBeenCalled();
  });

  it("fetch uses correct filters with single Alertmanager instance", () => {
    silenceFormStore.data.setAlertmanagers([
      { label: "amName", value: ["amValue"] },
    ]);
    renderSilencePreview();
    expect(useFetchGet).toHaveBeenCalledWith(
      "./alertList.json?q=foo%3Dbar&q=%40alertmanager%3D~%5E%28amValue%29%24",
    );
  });

  it("fetch uses correct filters with multiple Alertmanager instances", () => {
    silenceFormStore.data.setAlertmanagers([
      { label: "cluster", value: ["am1", "am2"] },
    ]);
    renderSilencePreview();
    expect(useFetchGet).toHaveBeenCalledWith(
      "./alertList.json?q=foo%3Dbar&q=%40alertmanager%3D~%5E%28am1%7Cam2%29%24",
    );
  });

  it("matches snapshot", () => {
    useFetchGetMock.fetch.setMockedData({
      response: {
        alerts: Array(25).map((i) => [
          { name: "alertname", value: `alert${i}` },
        ]),
      },
      error: undefined,
      isLoading: false,
      isRetrying: false,
      retryCount: 0,
      get: jest.fn(),
      cancelGet: jest.fn(),
    });

<<<<<<< HEAD
    const { asFragment } = renderSilencePreview();
=======
    const { asFragment } = MountedSilencePreview();
>>>>>>> f2d4110a (upgrading to react 19)
    expect(asFragment()).toMatchSnapshot();
  });

  it("renders Placeholder while loading preview", () => {
    useFetchGetMock.fetch.setMockedData({
      response: null,
      error: undefined,
      isLoading: true,
      isRetrying: false,
      retryCount: 0,
      get: jest.fn(),
      cancelGet: jest.fn(),
    });
<<<<<<< HEAD
    renderSilencePreview();
    expect(
      document.body.querySelectorAll(".text-placeholder"),
=======
    const { container } = MountedSilencePreview();
    expect(
      container.querySelectorAll(".placeholder"),
>>>>>>> f2d4110a (upgrading to react 19)
    ).not.toHaveLength(0);
  });

  it("renders StaticLabel after fetch", () => {
    useFetchGetMock.fetch.setMockedData({
      response: {
        alerts: [
          [
            { name: "alertname", value: "Fake Alert" },
            { name: "foo", value: "1" },
            { name: "bar", value: "1" },
          ],
        ],
      },
      error: undefined,
      isLoading: false,
      isRetrying: false,
      retryCount: 0,
      get: jest.fn(),
      cancelGet: jest.fn(),
    });
<<<<<<< HEAD
    renderSilencePreview();
    expect(screen.getByText(/Affected alerts/)).toBeInTheDocument();
=======
    const { container } = MountedSilencePreview();
    expect(container.textContent).toMatch(/Affected alerts/);
    expect(
      container.querySelectorAll("span.components-label"),
    ).toHaveLength(3);
>>>>>>> f2d4110a (upgrading to react 19)
  });

  it("handles empty grid response correctly", () => {
    useFetchGetMock.fetch.setMockedData({
      response: { alerts: [] },
      error: undefined,
      isLoading: false,
      isRetrying: false,
      retryCount: 0,
      get: jest.fn(),
      cancelGet: jest.fn(),
    });

<<<<<<< HEAD
    renderSilencePreview();
    expect(screen.getByText(/No alerts matched/)).toBeInTheDocument();
=======
    const { container } = MountedSilencePreview();
    expect(container.textContent).toMatch(/No alerts matched/);
>>>>>>> f2d4110a (upgrading to react 19)
  });

  it("renders FetchError on failed fetch", () => {
    useFetchGetMock.fetch.setMockedData({
      response: null,
      error: "Fetch error",
      isLoading: false,
      isRetrying: false,
      retryCount: 0,
      get: jest.fn(),
      cancelGet: jest.fn(),
    });

<<<<<<< HEAD
    const { container } = renderSilencePreview();
    expect(container.innerHTML).toMatch(/Fetch error/);
  });

  it("renders LabelSetList on successful fetch", () => {
    const { container } = renderSilencePreview();
    expect(container.innerHTML).not.toMatch(/Fetch error/);
  });

  it("clicking on the submit button moves form to the 'Submit' stage", () => {
    const { container } = renderSilencePreview();
    const button = container.querySelector(".btn-primary");
    fireEvent.click(button!);
=======
    const { container } = MountedSilencePreview();
    expect(
      container.querySelectorAll("svg.fa-circle-exclamation"),
    ).toHaveLength(1);
  });

  it("renders LabelSetList on successful fetch", () => {
    const { container } = MountedSilencePreview();
    expect(
      container.querySelectorAll("svg.fa-circle-exclamation"),
    ).toHaveLength(0);
  });

  it("clicking on the submit button moves form to the 'Submit' stage", () => {
    const { container } = MountedSilencePreview();
    const button = container.querySelector(".btn-primary")!;
    fireEvent.click(button);
>>>>>>> f2d4110a (upgrading to react 19)
    expect(silenceFormStore.data.currentStage).toBe("submit");
  });
});

import { render, fireEvent, act } from "@testing-library/react";

import { MockThemeContext } from "__fixtures__/Theme";
import { AlertStore } from "Stores/AlertStore";
import { Settings } from "Stores/Settings";
import { SilenceFormStore } from "Stores/SilenceFormStore";
import { ThemeContext } from "Components/Theme";
import { SilenceModalContent } from "./SilenceModalContent";
import type { APIAlertsResponseUpstreamsT } from "Models/APITypes";

let alertStore: AlertStore;
let settingsStore: Settings;
let silenceFormStore: SilenceFormStore;

const generateUpstreams = (): APIAlertsResponseUpstreamsT => ({
  counters: { total: 1, healthy: 1, failed: 0 },
  instances: [
    {
      name: "am1",
      cluster: "am",
      clusterMembers: ["am1"],
      uri: "http://localhost:9093",
      publicURI: "http://localhost:9093",
      readonly: false,
      error: "",
      version: "0.24.0",
      headers: {},
      corsCredentials: "include",
    },
  ],
  clusters: { am: ["am1"] },
});

beforeEach(() => {
  alertStore = new AlertStore([]);
  settingsStore = new Settings(null);
  silenceFormStore = new SilenceFormStore();

  alertStore.data.setUpstreams(generateUpstreams());

  silenceFormStore.tab.setTab("editor");
});

afterEach(() => {
  jest.restoreAllMocks();
});

const MockOnHide = jest.fn();

const MountedSilenceModalContent = () => {
  return render(
    <ThemeContext.Provider value={MockThemeContext}>
      <SilenceModalContent
        alertStore={alertStore}
        settingsStore={settingsStore}
        silenceFormStore={silenceFormStore}
        onHide={MockOnHide}
      />
    </ThemeContext.Provider>,
  );
};

describe("<SilenceModalContent />", () => {
  it("Renders ReadOnlyPlaceholder when there are no writable Alertmanager upstreams", () => {
    const upstreams = generateUpstreams();
    upstreams.instances[0].readonly = true;
    alertStore.data.setUpstreams(upstreams);
    const { container } = MountedSilenceModalContent();
    expect(container.querySelectorAll(".display-5")).toHaveLength(1);
  });

  it("Clicking on the Browser tab changes content", () => {
    const { container } = MountedSilenceModalContent();
    const tabs = container.querySelectorAll(".nav-link");
    fireEvent.click(tabs[1]);
    expect(container.querySelectorAll("#silence-show-expired")).toHaveLength(1);
  });

  it("Clicking on the Editor tab changes content", () => {
    silenceFormStore.tab.setTab("browser");
    const { container } = MountedSilenceModalContent();
    const tabs = container.querySelectorAll(".nav-link");
    fireEvent.click(tabs[0]);
    expect(container.querySelector("form")).toBeTruthy();
  });

  it("Content is not blurred when silenceFormStore.toggle.blurred is false", () => {
    silenceFormStore.toggle.setBlur(false);
    const { container } = MountedSilenceModalContent();
    expect(container.querySelectorAll("div.modal-body.modal-content-blur")).toHaveLength(0);
  });

  it("Content is blurred when silenceFormStore.toggle.blurred is true", () => {
    silenceFormStore.toggle.setBlur(true);
    const { container } = MountedSilenceModalContent();
    expect(container.querySelectorAll("div.modal-body.modal-content-blur")).toHaveLength(1);
  });
});

describe("<SilenceModalContent /> Editor", () => {
  it("title is 'New silence' when creating new silence", () => {
    silenceFormStore.data.setStage("form");
    silenceFormStore.data.setSilenceID(null);
    const { container } = MountedSilenceModalContent();
    const tab = container.querySelectorAll(".nav-link")[0];
    expect(tab.textContent).toBe("New silence");
  });
  it("title is 'Editing silence' when editing exiting silence", () => {
    silenceFormStore.data.setStage("form");
    silenceFormStore.data.setSilenceID("1234");
    const { container } = MountedSilenceModalContent();
    const tab = container.querySelectorAll(".nav-link")[0];
    expect(tab.textContent).toBe("Editing silence");
  });
  it("title is 'Preview silenced alerts' when previewing silenced alerts", () => {
    silenceFormStore.data.setStage("preview");
    silenceFormStore.data.setSilenceID("1234");
    const { container } = MountedSilenceModalContent();
    const tab = container.querySelectorAll(".nav-link")[0];
    expect(tab.textContent).toBe("Preview silenced alerts");
  });
  it("title is 'Silence submitted' after sending silence to Alertmanager", () => {
    silenceFormStore.data.setStage("submit");
    silenceFormStore.data.setSilenceID("1234");
    const { container } = MountedSilenceModalContent();
    const tab = container.querySelectorAll(".nav-link")[0];
    expect(tab.textContent).toBe("Silence submitted");
  });

  it("renders SilenceForm when silenceFormStore.data.currentStage is 'UserInput'", () => {
    silenceFormStore.data.setStage("form");
    const { container } = MountedSilenceModalContent();
    expect(container.querySelector("form")).toBeTruthy();
  });

  it("renders SilencePreview when silenceFormStore.data.currentStage is 'Preview'", () => {
    silenceFormStore.data.setStage("preview");
    const { container } = MountedSilenceModalContent();
    expect(container.querySelector(".badge")).toBeTruthy();
  });

  it("renders SilenceSubmitController when silenceFormStore.data.currentStage is 'Submit'", () => {
    silenceFormStore.data.setStage("submit");
    const { asFragment } = MountedSilenceModalContent();
    expect(asFragment()).toMatchSnapshot();
  });
});

describe("<SilenceModalContent /> Browser", () => {
  it("renders silence browser when tab is set to Browser", () => {
    silenceFormStore.tab.setTab("browser");
    const { container } = MountedSilenceModalContent();
    expect(container.querySelectorAll("#silence-show-expired")).toHaveLength(1);
  });
});

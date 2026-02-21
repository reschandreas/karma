import { render, fireEvent, act } from "@testing-library/react";

import { MockThemeContext } from "__fixtures__/Theme";
import { AlertStore } from "Stores/AlertStore";
import { SilenceFormStore } from "Stores/SilenceFormStore";
import { ThemeContext } from "Components/Theme";
import { AlertManagerInput } from ".";
import type { APIAlertsResponseUpstreamsT } from "Models/APITypes";

let alertStore: AlertStore;
let silenceFormStore: SilenceFormStore;

const generateUpstreams = (): APIAlertsResponseUpstreamsT => ({
  counters: { total: 3, healthy: 3, failed: 0 },
  instances: [
    {
      name: "am1",
      uri: "http://am1.example.com",
      publicURI: "http://am1.example.com",
      readonly: false,
      headers: {},
      corsCredentials: "include",
      error: "",
      version: "0.24.0",
      cluster: "HA",
      clusterMembers: ["am1", "am2"],
    },
    {
      name: "am2",
      uri: "http://am2.example.com",
      publicURI: "http://am2.example.com",
      readonly: false,
      headers: {},
      corsCredentials: "include",
      error: "",
      version: "0.24.0",
      cluster: "HA",
      clusterMembers: ["am1", "am2"],
    },
    {
      name: "am3",
      uri: "http://am3.example.com",
      publicURI: "http://am3.example.com",
      readonly: false,
      headers: {},
      corsCredentials: "include",
      error: "",
      version: "0.24.0",
      cluster: "am3",
      clusterMembers: ["am3"],
    },
  ],
  clusters: { HA: ["am1", "am2"], am3: ["am3"] },
});

beforeEach(() => {
  alertStore = new AlertStore([]);
  alertStore.data.setUpstreams(generateUpstreams());
  silenceFormStore = new SilenceFormStore();
});

const MountedAlertManagerInput = () => {
  return render(
    <ThemeContext.Provider value={MockThemeContext}>
      <AlertManagerInput
        alertStore={alertStore}
        silenceFormStore={silenceFormStore}
      />
    </ThemeContext.Provider>,
  );
};

const ValidateSuggestions = () => {
  const result = MountedAlertManagerInput();
  // clear all selected instances, they are selected by default
  const clear = result.container.querySelector(
    "div.react-select__clear-indicator",
  )!;
  fireEvent.mouseDown(clear, { button: 0 });
  // click on the react-select component doesn't seem to trigger options
  // rendering in tests, so change the input instead
  const input = result.container.querySelector("input")!;
  fireEvent.change(input, { target: { value: "am" } });
  return result;
};

describe("<AlertManagerInput />", () => {
  it("matches snapshot", () => {
    const { container } = MountedAlertManagerInput();
    expect(container.innerHTML).toMatchSnapshot();
  });

  it("doesn't render ValidationError after passed validation", () => {
    const { container } = MountedAlertManagerInput();
    act(() => {
      silenceFormStore.data.setWasValidated(true);
    });
    expect(container.innerHTML).not.toMatch(/fa-circle-exclamation/);
    expect(container.innerHTML).not.toMatch(/Required/);
  });

  it("renders ValidationError after failed validation", () => {
    const { container } = MountedAlertManagerInput();
    fireEvent.click(
      container.querySelectorAll("div.react-select__multi-value__remove")[0],
    );
    fireEvent.click(
      container.querySelectorAll("div.react-select__multi-value__remove")[0],
    );
    act(() => {
      silenceFormStore.data.setAlertmanagers([]);
      silenceFormStore.data.setWasValidated(true);
    });
    expect(container.innerHTML).toMatch(/fa-circle-exclamation/);
    expect(container.innerHTML).toMatch(/Required/);
  });

  it("all available Alertmanager instances are selected by default", () => {
    MountedAlertManagerInput();
    expect(silenceFormStore.data.alertmanagers).toHaveLength(2);
    expect(silenceFormStore.data.alertmanagers).toContainEqual({
      label: "Cluster: HA",
      value: ["am1", "am2"],
    });
    expect(silenceFormStore.data.alertmanagers).toContainEqual({
      label: "am3",
      value: ["am3"],
    });
  });

  it("doesn't override last selected Alertmanager instances on mount", () => {
    silenceFormStore.data.setAlertmanagers([{ label: "am3", value: ["am3"] }]);
    MountedAlertManagerInput();
    expect(silenceFormStore.data.alertmanagers).toHaveLength(1);
    expect(silenceFormStore.data.alertmanagers).toContainEqual({
      label: "am3",
      value: ["am3"],
    });
  });

  it("renders all 3 suggestions", () => {
    const { container } = ValidateSuggestions();
    const options = container.querySelectorAll("div.react-select__option");
    expect(options).toHaveLength(2);
    expect(options[0].textContent).toBe("Cluster: HA");
    expect(options[1].textContent).toBe("am3");
  });

  it("clicking on options appends them to silenceFormStore.data.alertmanagers", () => {
    silenceFormStore.data.setAlertmanagers([]);
    const { container } = ValidateSuggestions();
    const options = container.querySelectorAll("div.react-select__option");
    fireEvent.click(options[0]);
    // re-open the menu after first selection
    const input = container.querySelector("input")!;
    fireEvent.change(input, { target: { value: "am" } });
    const options2 = container.querySelectorAll("div.react-select__option");
    fireEvent.click(options2[0]);
    expect(silenceFormStore.data.alertmanagers).toHaveLength(2);
    expect(silenceFormStore.data.alertmanagers).toContainEqual({
      label: "Cluster: HA",
      value: ["am1", "am2"],
    });
    expect(silenceFormStore.data.alertmanagers).toContainEqual({
      label: "am3",
      value: ["am3"],
    });
  });

  it("silenceFormStore.data.alertmanagers gets updated from alertStore.data.upstreams.instances on mismatch", () => {
    MountedAlertManagerInput();
    act(() => {
      alertStore.data.setClusters({
        amNew: ["amNew"],
      });
    });
    expect(silenceFormStore.data.alertmanagers).toContainEqual({
      label: "amNew",
      value: ["amNew"],
    });
  });

  it("is enabled when silenceFormStore.data.silenceID is null", () => {
    silenceFormStore.data.setSilenceID(null);
    const { container } = MountedAlertManagerInput();
    expect(
      container.querySelector("div.react-select__control--is-disabled"),
    ).toBeNull();
  });

  it("is disabled when silenceFormStore.data.silenceID is not null", () => {
    silenceFormStore.data.setSilenceID("1234");
    const { container } = MountedAlertManagerInput();
    expect(
      container.querySelector("div.react-select__control--is-disabled"),
    ).not.toBeNull();
  });

  it("removing last options sets silenceFormStore.data.alertmanagers to []", () => {
    const { container } = MountedAlertManagerInput();
    expect(silenceFormStore.data.alertmanagers).toHaveLength(2);

    fireEvent.click(
      container.querySelectorAll("div.react-select__multi-value__remove")[0],
    );
    expect(silenceFormStore.data.alertmanagers).toHaveLength(1);

    fireEvent.click(
      container.querySelector("div.react-select__multi-value__remove")!,
    );
    expect(silenceFormStore.data.alertmanagers).toHaveLength(0);
    expect(silenceFormStore.data.alertmanagers).toEqual([]);
  });

  it("doesn't include readonly instances", () => {
    const upstreams = generateUpstreams();
    upstreams.instances[0].readonly = true;
    upstreams.instances[2].readonly = true;
    MountedAlertManagerInput();
    act(() => {
      alertStore.data.setUpstreams(upstreams);
    });
    expect(silenceFormStore.data.alertmanagers).toHaveLength(1);
    expect(silenceFormStore.data.alertmanagers).toContainEqual({
      label: "am2",
      value: ["am2"],
    });
  });

  it("uses default alertmanagers to select the cluster", () => {
    const upstreams = generateUpstreams();
    alertStore.settings.setValues({
      ...alertStore.settings.values,
      ...{
        silenceForm: {
          strip: {
            labels: [],
          },
          defaultAlertmanagers: ["am2", "bob"],
        },
      },
    });
    MountedAlertManagerInput();
    act(() => {
      alertStore.data.setUpstreams(upstreams);
    });
    expect(silenceFormStore.data.alertmanagers).toHaveLength(1);
    expect(silenceFormStore.data.alertmanagers).toContainEqual({
      label: "Cluster: HA",
      value: ["am1", "am2"],
    });
  });

  it("uses default alertmanagers to select the instance", () => {
    const upstreams = generateUpstreams();
    alertStore.settings.setValues({
      ...alertStore.settings.values,
      ...{
        silenceForm: {
          strip: {
            labels: [],
          },
          defaultAlertmanagers: ["am0", "am3", "bob"],
        },
      },
    });
    MountedAlertManagerInput();
    act(() => {
      alertStore.data.setUpstreams(upstreams);
    });
    expect(silenceFormStore.data.alertmanagers).toHaveLength(1);
    expect(silenceFormStore.data.alertmanagers).toContainEqual({
      label: "am3",
      value: ["am3"],
    });
  });
});

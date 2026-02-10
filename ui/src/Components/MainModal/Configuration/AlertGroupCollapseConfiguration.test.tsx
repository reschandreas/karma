import { render, fireEvent } from "@testing-library/react";

import { MockThemeContext } from "__fixtures__/Theme";
import { Settings } from "Stores/Settings";
import { ThemeContext } from "Components/Theme";
import { AlertGroupCollapseConfiguration } from "./AlertGroupCollapseConfiguration";

let settingsStore: Settings;

beforeEach(() => {
  settingsStore = new Settings(null);
});

const FakeConfiguration = () => {
  return render(
    <ThemeContext.Provider value={MockThemeContext}>
      <AlertGroupCollapseConfiguration settingsStore={settingsStore} />
    </ThemeContext.Provider>,
  );
};

describe("<AlertGroupCollapseConfiguration />", () => {
  it("matches snapshot with default values", () => {
    const { asFragment } = FakeConfiguration();
    expect(asFragment()).toMatchSnapshot();
  });

  it("resets stored config to defaults if it is invalid", (done) => {
    settingsStore.alertGroupConfig.setDefaultCollapseState("foo" as any);
    const { container } = FakeConfiguration();
    const select = container.querySelector("div.react-select__value-container");
    expect(select!.textContent).toBe(
      settingsStore.alertGroupConfig.options.collapsedOnMobile.label,
    );
    setTimeout(() => {
      expect(settingsStore.alertGroupConfig.config.defaultCollapseState).toBe(
        settingsStore.alertGroupConfig.options.collapsedOnMobile.value,
      );
      done();
    }, 200);
  });

  it("rendered correct default value", (done) => {
    settingsStore.alertGroupConfig.setDefaultCollapseState("expanded");
    const { container } = FakeConfiguration();
    const select = container.querySelector("div.react-select__value-container");
    setTimeout(() => {
      expect(select!.textContent).toBe(
        settingsStore.alertGroupConfig.options.expanded.label,
      );
      done();
    }, 200);
  });

  it("clicking on a label option updates settingsStore", (done) => {
    const { container } = FakeConfiguration();
    fireEvent.change(
      container.querySelector(
        "input#react-select-configuration-collapse-input",
      )!,
      { target: { value: " " } },
    );
    const options = container.querySelectorAll("div.react-select__option");
    fireEvent.click(options[1]);
    setTimeout(() => {
      expect(settingsStore.alertGroupConfig.config.defaultCollapseState).toBe(
        settingsStore.alertGroupConfig.options.collapsed.value,
      );
      done();
    }, 200);
  });
});

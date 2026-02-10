<<<<<<< HEAD
import { render, fireEvent, waitFor } from "@testing-library/react";
=======
import { render, fireEvent } from "@testing-library/react";
>>>>>>> f2d4110a (upgrading to react 19)

import { MockThemeContext } from "__fixtures__/Theme";
import { Settings } from "Stores/Settings";
import { ThemeContext } from "Components/Theme";
import { AlertGroupCollapseConfiguration } from "./AlertGroupCollapseConfiguration";

let settingsStore: Settings;

beforeEach(() => {
  settingsStore = new Settings(null);
});

<<<<<<< HEAD
const renderConfiguration = () => {
=======
const FakeConfiguration = () => {
>>>>>>> f2d4110a (upgrading to react 19)
  return render(
    <ThemeContext.Provider value={MockThemeContext}>
      <AlertGroupCollapseConfiguration settingsStore={settingsStore} />
    </ThemeContext.Provider>,
  );
};

describe("<AlertGroupCollapseConfiguration />", () => {
  it("matches snapshot with default values", () => {
<<<<<<< HEAD
    const { asFragment } = renderConfiguration();
=======
    const { asFragment } = FakeConfiguration();
>>>>>>> f2d4110a (upgrading to react 19)
    expect(asFragment()).toMatchSnapshot();
  });

  it("resets stored config to defaults if it is invalid", async () => {
    settingsStore.alertGroupConfig.setDefaultCollapseState("foo" as any);
<<<<<<< HEAD
    const { container } = renderConfiguration();
    const select = container.querySelector("div.react-select__value-container");
    expect(select?.textContent).toBe(
=======
    const { container } = FakeConfiguration();
    const select = container.querySelector("div.react-select__value-container");
    expect(select!.textContent).toBe(
>>>>>>> f2d4110a (upgrading to react 19)
      settingsStore.alertGroupConfig.options.collapsedOnMobile.label,
    );
    await waitFor(() => {
      expect(settingsStore.alertGroupConfig.config.defaultCollapseState).toBe(
        settingsStore.alertGroupConfig.options.collapsedOnMobile.value,
      );
    });
  });

  it("rendered correct default value", async () => {
    settingsStore.alertGroupConfig.setDefaultCollapseState("expanded");
<<<<<<< HEAD
    const { container } = renderConfiguration();
    const select = container.querySelector("div.react-select__value-container");
    await waitFor(() => {
      expect(select?.textContent).toBe(
=======
    const { container } = FakeConfiguration();
    const select = container.querySelector("div.react-select__value-container");
    setTimeout(() => {
      expect(select!.textContent).toBe(
>>>>>>> f2d4110a (upgrading to react 19)
        settingsStore.alertGroupConfig.options.expanded.label,
      );
    });
  });

<<<<<<< HEAD
  it("clicking on a label option updates settingsStore", async () => {
    const { container } = renderConfiguration();
    const input = container.querySelector(
      "input#react-select-configuration-collapse-input",
    );
    fireEvent.change(input!, { target: { value: " " } });
    const options = container.querySelectorAll("div.react-select__option");
    fireEvent.click(options[1]);
    await waitFor(() => {
=======
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
>>>>>>> f2d4110a (upgrading to react 19)
      expect(settingsStore.alertGroupConfig.config.defaultCollapseState).toBe(
        settingsStore.alertGroupConfig.options.collapsed.value,
      );
    });
  });
});

import { render, fireEvent } from "@testing-library/react";

import { MockThemeContext } from "__fixtures__/Theme";
import { Settings, ThemeT } from "Stores/Settings";
import { ThemeContext } from "Components/Theme";
import { ThemeConfiguration } from "./ThemeConfiguration";

let settingsStore: Settings;

beforeEach(() => {
  settingsStore = new Settings(null);
});

const FakeConfiguration = () => {
  return render(
    <ThemeContext.Provider value={MockThemeContext}>
      <ThemeConfiguration settingsStore={settingsStore} />
    </ThemeContext.Provider>,
  );
};

describe("<ThemeConfiguration />", () => {
  it("matches snapshot with default values", () => {
    const { asFragment } = FakeConfiguration();
    expect(asFragment()).toMatchSnapshot();
  });

  it("resets stored config to defaults if it is invalid", (done) => {
    settingsStore.themeConfig.setTheme("foo" as ThemeT);
    const { container } = FakeConfiguration();
    const select = container.querySelector("div.react-select__value-container");
    expect(select!.textContent).toBe(
      settingsStore.themeConfig.options.auto.label,
    );
    setTimeout(() => {
      expect(settingsStore.themeConfig.config.theme).toBe(
        settingsStore.themeConfig.options.auto.value,
      );
      done();
    }, 200);
  });

  it("rendered correct default value", (done) => {
    settingsStore.themeConfig.setTheme("auto");
    const { container } = FakeConfiguration();
    const select = container.querySelector("div.react-select__value-container");
    setTimeout(() => {
      expect(select!.textContent).toBe(
        settingsStore.themeConfig.options.auto.label,
      );
      done();
    }, 200);
  });

  it("clicking on a label option updates settingsStore", (done) => {
    const { container } = FakeConfiguration();
    fireEvent.change(
      container.querySelector(
        "input#react-select-configuration-theme-input",
      )!,
      { target: { value: " " } },
    );
    const options = container.querySelectorAll("div.react-select__option");
    fireEvent.click(options[1]);
    setTimeout(() => {
      expect(settingsStore.themeConfig.config.theme).toBe(
        settingsStore.themeConfig.options.dark.value,
      );
      done();
    }, 200);
  });
});

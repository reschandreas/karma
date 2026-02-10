<<<<<<< HEAD
import { render, fireEvent, waitFor } from "@testing-library/react";
=======
import { render, fireEvent } from "@testing-library/react";
>>>>>>> f2d4110a (upgrading to react 19)

import { MockThemeContext } from "__fixtures__/Theme";
import { Settings, ThemeT } from "Stores/Settings";
import { ThemeContext } from "Components/Theme";
import { ThemeConfiguration } from "./ThemeConfiguration";

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
      <ThemeConfiguration settingsStore={settingsStore} />
    </ThemeContext.Provider>,
  );
};

describe("<ThemeConfiguration />", () => {
  it("matches snapshot with default values", () => {
<<<<<<< HEAD
    const { asFragment } = renderConfiguration();
=======
    const { asFragment } = FakeConfiguration();
>>>>>>> f2d4110a (upgrading to react 19)
    expect(asFragment()).toMatchSnapshot();
  });

  it("resets stored config to defaults if it is invalid", async () => {
    settingsStore.themeConfig.setTheme("foo" as ThemeT);
<<<<<<< HEAD
    const { container } = renderConfiguration();
    const select = container.querySelector("div.react-select__value-container");
    expect(select?.textContent).toBe(
      settingsStore.themeConfig.options.auto.label,
    );
    await waitFor(() => {
=======
    const { container } = FakeConfiguration();
    const select = container.querySelector("div.react-select__value-container");
    expect(select!.textContent).toBe(
      settingsStore.themeConfig.options.auto.label,
    );
    setTimeout(() => {
>>>>>>> f2d4110a (upgrading to react 19)
      expect(settingsStore.themeConfig.config.theme).toBe(
        settingsStore.themeConfig.options.auto.value,
      );
    });
  });

  it("rendered correct default value", async () => {
    settingsStore.themeConfig.setTheme("auto");
<<<<<<< HEAD
    const { container } = renderConfiguration();
    const select = container.querySelector("div.react-select__value-container");
    await waitFor(() => {
      expect(select?.textContent).toBe(
        settingsStore.themeConfig.options.auto.label,
      );
    });
  });

  it("clicking on a label option updates settingsStore", async () => {
    const { container } = renderConfiguration();
    const input = container.querySelector(
      "input#react-select-configuration-theme-input",
    );
    fireEvent.change(input!, { target: { value: " " } });
    const options = container.querySelectorAll("div.react-select__option");
    fireEvent.click(options[1]);
    await waitFor(() => {
=======
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
>>>>>>> f2d4110a (upgrading to react 19)
      expect(settingsStore.themeConfig.config.theme).toBe(
        settingsStore.themeConfig.options.dark.value,
      );
    });
  });
});

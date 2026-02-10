import { render, fireEvent } from "@testing-library/react";

import { Settings } from "Stores/Settings";
import { AnimationsConfiguration } from "./AnimationsConfiguration";

let settingsStore: Settings;
beforeEach(() => {
  settingsStore = new Settings(null);
});

const FakeConfiguration = () => {
  return render(<AnimationsConfiguration settingsStore={settingsStore} />);
};

describe("<AnimationsConfiguration />", () => {
  it("matches snapshot with default values", () => {
    const { asFragment } = FakeConfiguration();
    expect(asFragment()).toMatchSnapshot();
  });

  it("animations is 'true' by default", () => {
    expect(settingsStore.themeConfig.config.animations).toBe(true);
  });

  it("unchecking the checkbox sets stored animations value to 'false'", (done) => {
    const { container } = FakeConfiguration();
    const checkbox = container.querySelector("#configuration-animations")!;

    settingsStore.themeConfig.setAnimations(true);
    expect(settingsStore.themeConfig.config.animations).toBe(true);
    fireEvent.click(checkbox);
    setTimeout(() => {
      expect(settingsStore.themeConfig.config.animations).toBe(false);
      done();
    }, 200);
  });

  it("checking the checkbox sets stored animations value to 'true'", (done) => {
    const { container } = FakeConfiguration();
    const checkbox = container.querySelector("#configuration-animations")!;

    settingsStore.themeConfig.setAnimations(false);
    expect(settingsStore.themeConfig.config.animations).toBe(false);
    fireEvent.click(checkbox);
    setTimeout(() => {
      expect(settingsStore.themeConfig.config.animations).toBe(true);
      done();
    }, 200);
  });
});

import { render, fireEvent, act } from "@testing-library/react";

import { Settings } from "Stores/Settings";
import { AlertGroupTitleBarColor } from "./AlertGroupTitleBarColor";

let settingsStore: Settings;
beforeEach(() => {
  settingsStore = new Settings(null);
});

const FakeConfiguration = () => {
  return render(<AlertGroupTitleBarColor settingsStore={settingsStore} />);
};

describe("<AlertGroupTitleBarColor />", () => {
  it("matches snapshot with default values", () => {
    const { asFragment } = FakeConfiguration();
    expect(asFragment()).toMatchSnapshot();
  });

  it("colorTitleBar is 'false' by default", () => {
    expect(settingsStore.alertGroupConfig.config.colorTitleBar).toBe(false);
  });

  it("unchecking the checkbox sets stored colorTitleBar value to 'false'", (done) => {
    // Set to true before render so checkbox starts checked
    settingsStore.alertGroupConfig.setColorTitleBar(true);
    const { container } = FakeConfiguration();
    const checkbox = container.querySelector("#configuration-colortitlebar")!;

    expect(settingsStore.alertGroupConfig.config.colorTitleBar).toBe(true);
    act(() => {
      fireEvent.click(checkbox);
    });
    setTimeout(() => {
      expect(settingsStore.alertGroupConfig.config.colorTitleBar).toBe(false);
      done();
    }, 200);
  });

  it("checking the checkbox sets stored colorTitleBar value to 'true'", (done) => {
    settingsStore.alertGroupConfig.setColorTitleBar(false);
    const { container } = FakeConfiguration();
    const checkbox = container.querySelector("#configuration-colortitlebar")!;

    expect(settingsStore.alertGroupConfig.config.colorTitleBar).toBe(false);
    act(() => {
      fireEvent.click(checkbox);
    });
    setTimeout(() => {
      expect(settingsStore.alertGroupConfig.config.colorTitleBar).toBe(true);
      done();
    }, 200);
  });
});

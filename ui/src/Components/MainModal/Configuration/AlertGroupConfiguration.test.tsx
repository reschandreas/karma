import { render, fireEvent } from "@testing-library/react";

import { Settings } from "Stores/Settings";
import { AlertGroupConfiguration } from "./AlertGroupConfiguration";

let settingsStore: Settings;

beforeEach(() => {
  settingsStore = new Settings(null);
});

<<<<<<< HEAD
const renderConfiguration = () => {
=======
const FakeConfiguration = () => {
>>>>>>> f2d4110a (upgrading to react 19)
  return render(<AlertGroupConfiguration settingsStore={settingsStore} />);
};

describe("<AlertGroupConfiguration />", () => {
  it("matches snapshot with default values", () => {
<<<<<<< HEAD
    const { asFragment } = renderConfiguration();
=======
    const { asFragment } = FakeConfiguration();
>>>>>>> f2d4110a (upgrading to react 19)
    expect(asFragment()).toMatchSnapshot();
  });

  it("settings are updated on completed change", () => {
<<<<<<< HEAD
    const { container } = renderConfiguration();
    expect(settingsStore.alertGroupConfig.config.defaultRenderCount).toBe(5);

    const slider = container.querySelector("div.input-range-thumb");
    fireEvent.click(slider!);

    fireEvent.keyDown(slider!, { key: "ArrowLeft", keyCode: 37 });
    fireEvent.keyUp(slider!, { key: "ArrowLeft", keyCode: 37 });

    expect(settingsStore.alertGroupConfig.config.defaultRenderCount).toBe(4);

    fireEvent.keyDown(slider!, { key: "ArrowRight", keyCode: 39 });
    fireEvent.keyUp(slider!, { key: "ArrowRight", keyCode: 39 });
    fireEvent.keyDown(slider!, { key: "ArrowRight", keyCode: 39 });
    fireEvent.keyUp(slider!, { key: "ArrowRight", keyCode: 39 });
=======
    const { container } = FakeConfiguration();
    expect(settingsStore.alertGroupConfig.config.defaultRenderCount).toBe(5);

    const slider = container.querySelector(`div.input-range-thumb`)!;
    fireEvent.click(slider);

    fireEvent.keyDown(slider, { key: "ArrowLeft", keyCode: 37 });
    fireEvent.keyUp(slider, { key: "ArrowLeft", keyCode: 37 });

    expect(settingsStore.alertGroupConfig.config.defaultRenderCount).toBe(4);

    fireEvent.keyDown(slider, { key: "ArrowRight", keyCode: 39 });
    fireEvent.keyUp(slider, { key: "ArrowRight", keyCode: 39 });
    fireEvent.keyDown(slider, { key: "ArrowRight", keyCode: 39 });
    fireEvent.keyUp(slider, { key: "ArrowRight", keyCode: 39 });
>>>>>>> f2d4110a (upgrading to react 19)
    expect(settingsStore.alertGroupConfig.config.defaultRenderCount).toBe(6);
  });

  it("custom interval value is rendered correctly", () => {
    settingsStore.alertGroupConfig.setDefaultRenderCount(4);
<<<<<<< HEAD
    const { container } = renderConfiguration();
    const thumb = container.querySelector(".input-range-thumb");
    expect(thumb).toBeInTheDocument();
=======
    const { container } = FakeConfiguration();
    const thumb = container.querySelector("div.input-range-thumb");
    expect(thumb).toBeTruthy();
>>>>>>> f2d4110a (upgrading to react 19)
  });
});

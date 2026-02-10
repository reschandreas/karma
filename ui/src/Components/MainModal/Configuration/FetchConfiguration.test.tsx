import { render, fireEvent } from "@testing-library/react";

import { Settings } from "Stores/Settings";
import { FetchConfiguration } from "./FetchConfiguration";

let settingsStore: Settings;
beforeEach(() => {
  settingsStore = new Settings(null);
});

<<<<<<< HEAD
const renderConfiguration = () => {
=======
const FakeConfiguration = () => {
>>>>>>> f2d4110a (upgrading to react 19)
  return render(<FetchConfiguration settingsStore={settingsStore} />);
};

describe("<FetchConfiguration />", () => {
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
    expect(settingsStore.fetchConfig.config.interval).toBe(30);

    const slider = container.querySelector("div.input-range-thumb");
    fireEvent.click(slider!);

    fireEvent.keyDown(slider!, { key: "ArrowLeft", keyCode: 37 });
    fireEvent.keyUp(slider!, { key: "ArrowLeft", keyCode: 37 });

    expect(settingsStore.fetchConfig.config.interval).toBe(20);

    fireEvent.keyDown(slider!, { key: "ArrowRight", keyCode: 39 });
    fireEvent.keyUp(slider!, { key: "ArrowRight", keyCode: 39 });
    fireEvent.keyDown(slider!, { key: "ArrowRight", keyCode: 39 });
    fireEvent.keyUp(slider!, { key: "ArrowRight", keyCode: 39 });
=======
    const { container } = FakeConfiguration();
    expect(settingsStore.fetchConfig.config.interval).toBe(30);

    const slider = container.querySelector(`div.input-range-thumb`)!;
    fireEvent.click(slider);

    fireEvent.keyDown(slider, { key: "ArrowLeft", keyCode: 37 });
    fireEvent.keyUp(slider, { key: "ArrowLeft", keyCode: 37 });

    expect(settingsStore.fetchConfig.config.interval).toBe(20);

    fireEvent.keyDown(slider, { key: "ArrowRight", keyCode: 39 });
    fireEvent.keyUp(slider, { key: "ArrowRight", keyCode: 39 });
    fireEvent.keyDown(slider, { key: "ArrowRight", keyCode: 39 });
    fireEvent.keyUp(slider, { key: "ArrowRight", keyCode: 39 });
>>>>>>> f2d4110a (upgrading to react 19)

    expect(settingsStore.fetchConfig.config.interval).toBe(40);
  });

  it("custom interval value is rendered correctly", () => {
    settingsStore.fetchConfig.setInterval(70);
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

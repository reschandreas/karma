<<<<<<< HEAD
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
=======
import { render, fireEvent } from "@testing-library/react";
>>>>>>> f2d4110a (upgrading to react 19)

import { Settings } from "Stores/Settings";
import { AnimationsConfiguration } from "./AnimationsConfiguration";

let settingsStore: Settings;
beforeEach(() => {
  settingsStore = new Settings(null);
});

<<<<<<< HEAD
const renderConfiguration = () => {
=======
const FakeConfiguration = () => {
>>>>>>> f2d4110a (upgrading to react 19)
  return render(<AnimationsConfiguration settingsStore={settingsStore} />);
};

describe("<AnimationsConfiguration />", () => {
  it("matches snapshot with default values", () => {
<<<<<<< HEAD
    const { asFragment } = renderConfiguration();
=======
    const { asFragment } = FakeConfiguration();
>>>>>>> f2d4110a (upgrading to react 19)
    expect(asFragment()).toMatchSnapshot();
  });

  it("animations is 'true' by default", () => {
    expect(settingsStore.themeConfig.config.animations).toBe(true);
  });

<<<<<<< HEAD
  it("unchecking the checkbox sets stored animations value to 'false'", async () => {
    renderConfiguration();
    const checkbox = screen.getByRole("checkbox");
=======
  it("unchecking the checkbox sets stored animations value to 'false'", (done) => {
    const { container } = FakeConfiguration();
    const checkbox = container.querySelector("#configuration-animations")!;
>>>>>>> f2d4110a (upgrading to react 19)

    settingsStore.themeConfig.setAnimations(true);
    expect(settingsStore.themeConfig.config.animations).toBe(true);
    fireEvent.click(checkbox);
<<<<<<< HEAD
    await waitFor(() => {
=======
    setTimeout(() => {
>>>>>>> f2d4110a (upgrading to react 19)
      expect(settingsStore.themeConfig.config.animations).toBe(false);
    });
  });

<<<<<<< HEAD
  it("checking the checkbox sets stored animations value to 'true'", async () => {
    renderConfiguration();
    const checkbox = screen.getByRole("checkbox");
=======
  it("checking the checkbox sets stored animations value to 'true'", (done) => {
    const { container } = FakeConfiguration();
    const checkbox = container.querySelector("#configuration-animations")!;
>>>>>>> f2d4110a (upgrading to react 19)

    settingsStore.themeConfig.setAnimations(false);
    expect(settingsStore.themeConfig.config.animations).toBe(false);
    fireEvent.click(checkbox);
<<<<<<< HEAD
    await waitFor(() => {
=======
    setTimeout(() => {
>>>>>>> f2d4110a (upgrading to react 19)
      expect(settingsStore.themeConfig.config.animations).toBe(true);
    });
  });
});

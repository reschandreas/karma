<<<<<<< HEAD
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
=======
import { render, fireEvent, act } from "@testing-library/react";
>>>>>>> f2d4110a (upgrading to react 19)

import { Settings } from "Stores/Settings";
import { AlertGroupTitleBarColor } from "./AlertGroupTitleBarColor";

let settingsStore: Settings;
beforeEach(() => {
  settingsStore = new Settings(null);
});

<<<<<<< HEAD
const renderConfiguration = () => {
=======
const FakeConfiguration = () => {
>>>>>>> f2d4110a (upgrading to react 19)
  return render(<AlertGroupTitleBarColor settingsStore={settingsStore} />);
};

describe("<AlertGroupTitleBarColor />", () => {
  it("matches snapshot with default values", () => {
<<<<<<< HEAD
    const { asFragment } = renderConfiguration();
=======
    const { asFragment } = FakeConfiguration();
>>>>>>> f2d4110a (upgrading to react 19)
    expect(asFragment()).toMatchSnapshot();
  });

  it("colorTitleBar is 'false' by default", () => {
    expect(settingsStore.alertGroupConfig.config.colorTitleBar).toBe(false);
  });

<<<<<<< HEAD
  it("unchecking the checkbox sets stored colorTitleBar value to 'false'", async () => {
    renderConfiguration();
    const checkbox = screen.getByRole("checkbox");

=======
  it("unchecking the checkbox sets stored colorTitleBar value to 'false'", (done) => {
    // Set to true before render so checkbox starts checked
>>>>>>> f2d4110a (upgrading to react 19)
    settingsStore.alertGroupConfig.setColorTitleBar(true);
    const { container } = FakeConfiguration();
    const checkbox = container.querySelector("#configuration-colortitlebar")!;

    expect(settingsStore.alertGroupConfig.config.colorTitleBar).toBe(true);
<<<<<<< HEAD
    fireEvent.click(checkbox);
    await waitFor(() => {
=======
    act(() => {
      fireEvent.click(checkbox);
    });
    setTimeout(() => {
>>>>>>> f2d4110a (upgrading to react 19)
      expect(settingsStore.alertGroupConfig.config.colorTitleBar).toBe(false);
    });
  });

<<<<<<< HEAD
  it("checking the checkbox sets stored colorTitleBar value to 'true'", async () => {
    renderConfiguration();
    const checkbox = screen.getByRole("checkbox");

=======
  it("checking the checkbox sets stored colorTitleBar value to 'true'", (done) => {
>>>>>>> f2d4110a (upgrading to react 19)
    settingsStore.alertGroupConfig.setColorTitleBar(false);
    const { container } = FakeConfiguration();
    const checkbox = container.querySelector("#configuration-colortitlebar")!;

    expect(settingsStore.alertGroupConfig.config.colorTitleBar).toBe(false);
<<<<<<< HEAD
    fireEvent.click(checkbox);
    await waitFor(() => {
=======
    act(() => {
      fireEvent.click(checkbox);
    });
    setTimeout(() => {
>>>>>>> f2d4110a (upgrading to react 19)
      expect(settingsStore.alertGroupConfig.config.colorTitleBar).toBe(true);
    });
  });
});

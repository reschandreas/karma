<<<<<<< HEAD
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
=======
import { render, fireEvent } from "@testing-library/react";
>>>>>>> f2d4110a (upgrading to react 19)

import { Settings } from "Stores/Settings";
import { FilterBarConfiguration } from "./FilterBarConfiguration";

let settingsStore: Settings;
beforeEach(() => {
  settingsStore = new Settings(null);
});

<<<<<<< HEAD
const renderConfiguration = () => {
=======
const FakeConfiguration = () => {
>>>>>>> f2d4110a (upgrading to react 19)
  return render(<FilterBarConfiguration settingsStore={settingsStore} />);
};

describe("<FilterBarConfiguration />", () => {
  it("matches snapshot with default values", () => {
<<<<<<< HEAD
    const { asFragment } = renderConfiguration();
    expect(asFragment()).toMatchSnapshot();
  });

  it("unchecking the checkbox sets stored autohide value to 'false'", async () => {
    renderConfiguration();
    const checkbox = screen.getByRole("checkbox");

    expect(settingsStore.filterBarConfig.config.autohide).toBe(true);
    fireEvent.click(checkbox);
    await waitFor(() => {
=======
    const { asFragment } = FakeConfiguration();
    expect(asFragment()).toMatchSnapshot();
  });

  it("unchecking the checkbox sets stored autohide value to 'false'", (done) => {
    const { container } = FakeConfiguration();
    const checkbox = container.querySelector("#configuration-autohide")!;

    expect(settingsStore.filterBarConfig.config.autohide).toBe(true);
    fireEvent.click(checkbox); // checked: false } });
    setTimeout(() => {
>>>>>>> f2d4110a (upgrading to react 19)
      expect(settingsStore.filterBarConfig.config.autohide).toBe(false);
    });
  });

<<<<<<< HEAD
  it("checking the checkbox sets stored autohide value to 'true'", async () => {
    renderConfiguration();
    const checkbox = screen.getByRole("checkbox");
=======
  it("checking the checkbox sets stored autohide value to 'true'", (done) => {
    const { container } = FakeConfiguration();
    const checkbox = container.querySelector("#configuration-autohide")!;
>>>>>>> f2d4110a (upgrading to react 19)

    settingsStore.filterBarConfig.setAutohide(false);
    expect(settingsStore.filterBarConfig.config.autohide).toBe(false);
<<<<<<< HEAD
    fireEvent.click(checkbox);
    await waitFor(() => {
=======
    fireEvent.click(checkbox); // checked: true } });
    setTimeout(() => {
>>>>>>> f2d4110a (upgrading to react 19)
      expect(settingsStore.filterBarConfig.config.autohide).toBe(true);
    });
  });
});

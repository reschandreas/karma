import { render, fireEvent, waitFor } from "@testing-library/react";

import { Settings } from "Stores/Settings";
import { FilterBarConfiguration } from "./FilterBarConfiguration";

let settingsStore: Settings;
beforeEach(() => {
  settingsStore = new Settings(null);
});

const FakeConfiguration = () => {
  return render(<FilterBarConfiguration settingsStore={settingsStore} />);
};

describe("<FilterBarConfiguration />", () => {
  it("matches snapshot with default values", () => {
    const { asFragment } = FakeConfiguration();
    expect(asFragment()).toMatchSnapshot();
  });

  it("unchecking the checkbox sets stored autohide value to 'false'", async () => {
    const { container } = FakeConfiguration();
    const checkbox = container.querySelector("#configuration-autohide")!;

    expect(settingsStore.filterBarConfig.config.autohide).toBe(true);
    fireEvent.click(checkbox); // checked: false } });
    await waitFor(() => {
      expect(settingsStore.filterBarConfig.config.autohide).toBe(false);
    });
  });

  it("checking the checkbox sets stored autohide value to 'true'", async () => {
    settingsStore.filterBarConfig.setAutohide(false);
    const { container } = FakeConfiguration();
    const checkbox = container.querySelector("#configuration-autohide")!;

    expect(settingsStore.filterBarConfig.config.autohide).toBe(false);
    fireEvent.click(checkbox); // checked: true } });
    await waitFor(() => {
      expect(settingsStore.filterBarConfig.config.autohide).toBe(true);
    });
  });
});

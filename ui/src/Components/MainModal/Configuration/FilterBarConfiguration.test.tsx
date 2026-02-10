import { render, fireEvent } from "@testing-library/react";

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

  it("unchecking the checkbox sets stored autohide value to 'false'", (done) => {
    const { container } = FakeConfiguration();
    const checkbox = container.querySelector("#configuration-autohide")!;

    expect(settingsStore.filterBarConfig.config.autohide).toBe(true);
    fireEvent.click(checkbox); // checked: false } });
    setTimeout(() => {
      expect(settingsStore.filterBarConfig.config.autohide).toBe(false);
      done();
    }, 200);
  });

  it("checking the checkbox sets stored autohide value to 'true'", (done) => {
    const { container } = FakeConfiguration();
    const checkbox = container.querySelector("#configuration-autohide")!;

    expect(settingsStore.filterBarConfig.config.autohide).toBe(false);
    fireEvent.click(checkbox); // checked: true } });
    setTimeout(() => {
      expect(settingsStore.filterBarConfig.config.autohide).toBe(true);
      done();
    }, 200);
  });
});

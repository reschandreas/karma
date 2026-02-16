import { render } from "@testing-library/react";

import { MockThemeContext } from "__fixtures__/Theme";
import { ThemeContext } from "Components/Theme";
import { UpgradeNeeded } from ".";

beforeEach(() => {
  jest.useFakeTimers();
  jest.clearAllTimers();
});

afterEach(() => {
  jest.clearAllTimers();
  jest.restoreAllMocks();
});

describe("<UpgradeNeeded />", () => {
  it("matches snapshot", () => {
    const { asFragment } = render(
      <ThemeContext.Provider value={MockThemeContext}>
        <UpgradeNeeded newVersion="1.2.3" reloadAfter={100000000} />
      </ThemeContext.Provider>,
    );
    expect(asFragment()).toMatchSnapshot();
  });

  it("renders the version number", () => {
    const { container } = render(
      <ThemeContext.Provider value={MockThemeContext}>
        <UpgradeNeeded newVersion="1.2.3" reloadAfter={100000000} />
      </ThemeContext.Provider>,
    );
    expect(container.textContent).toContain("1.2.3");
  });

  it("cleans up timer on unmount", () => {
    const clearTimeoutSpy = jest.spyOn(global, "clearTimeout");

    const { unmount } = render(
      <ThemeContext.Provider value={MockThemeContext}>
        <UpgradeNeeded newVersion="1.2.3" reloadAfter={100000000} />
      </ThemeContext.Provider>,
    );

    unmount();
    expect(clearTimeoutSpy).toHaveBeenCalled();
  });
});

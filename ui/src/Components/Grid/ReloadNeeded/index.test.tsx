import { render } from "@testing-library/react";

import { MockThemeContext } from "__fixtures__/Theme";
import { ThemeContext } from "Components/Theme";
import { ReloadNeeded } from ".";

beforeEach(() => {
  jest.useFakeTimers();
  jest.clearAllTimers();
});

afterEach(() => {
  jest.clearAllTimers();
  jest.restoreAllMocks();
});

describe("<ReloadNeeded />", () => {
  it("matches snapshot", () => {
    const { asFragment } = render(
      <ThemeContext.Provider value={MockThemeContext}>
        <ReloadNeeded reloadAfter={100000000} />
      </ThemeContext.Provider>,
    );
    expect(asFragment()).toMatchSnapshot();
  });

  it("renders the reload message", () => {
    const { container } = render(
      <ThemeContext.Provider value={MockThemeContext}>
        <ReloadNeeded reloadAfter={100000000} />
      </ThemeContext.Provider>,
    );
    expect(container.textContent).toContain("will try to reload");
  });

  it("cleans up timer on unmount", () => {
    const clearTimeoutSpy = jest.spyOn(global, "clearTimeout");

    const { unmount } = render(
      <ThemeContext.Provider value={MockThemeContext}>
        <ReloadNeeded reloadAfter={100000000} />
      </ThemeContext.Provider>,
    );

    unmount();
    expect(clearTimeoutSpy).toHaveBeenCalled();
  });
});

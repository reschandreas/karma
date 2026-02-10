<<<<<<< HEAD
import { act } from "react-dom/test-utils";

=======
>>>>>>> f2d4110a (upgrading to react 19)
import { render } from "@testing-library/react";

import { MockThemeContext } from "__fixtures__/Theme";
import { ThemeContext } from "Components/Theme";
import { UpgradeNeeded } from ".";

beforeEach(() => {
  jest.useFakeTimers();
  jest.clearAllTimers();
<<<<<<< HEAD

  delete window.location;
  window.location = { reload: jest.fn() };
=======
>>>>>>> f2d4110a (upgrading to react 19)
});

afterEach(() => {
  jest.clearAllTimers();
  jest.restoreAllMocks();
});

const renderWithTheme = (ui: React.ReactElement) =>
  render(
    <ThemeContext.Provider value={MockThemeContext}>
      {ui}
    </ThemeContext.Provider>,
  );

describe("<UpgradeNeeded />", () => {
  it("matches snapshot", () => {
<<<<<<< HEAD
    const { asFragment } = renderWithTheme(
      <UpgradeNeeded newVersion="1.2.3" reloadAfter={100000000} />,
=======
    const { asFragment } = render(
      <ThemeContext.Provider value={MockThemeContext}>
        <UpgradeNeeded newVersion="1.2.3" reloadAfter={100000000} />
      </ThemeContext.Provider>,
>>>>>>> f2d4110a (upgrading to react 19)
    );
    expect(asFragment()).toMatchSnapshot();
  });

<<<<<<< HEAD
  it("calls window.location.reload after timer is done", () => {
    const reloadSpy = jest
      .spyOn(global.window.location, "reload")
      .mockImplementation(() => {});

    renderWithTheme(
      <UpgradeNeeded newVersion="1.2.3" reloadAfter={100000000} />,
    );

    act(() => {
      jest.runOnlyPendingTimers();
    });
    expect(reloadSpy).toBeCalled();
=======
  it("renders the version number", () => {
    const { container } = render(
      <ThemeContext.Provider value={MockThemeContext}>
        <UpgradeNeeded newVersion="1.2.3" reloadAfter={100000000} />
      </ThemeContext.Provider>,
    );
    expect(container.textContent).toContain("1.2.3");
>>>>>>> f2d4110a (upgrading to react 19)
  });

  it("cleans up timer on unmount", () => {
    const clearTimeoutSpy = jest.spyOn(global, "clearTimeout");

<<<<<<< HEAD
    const { unmount } = renderWithTheme(
      <UpgradeNeeded newVersion="1.2.3" reloadAfter={100000000} />,
=======
    const { unmount } = render(
      <ThemeContext.Provider value={MockThemeContext}>
        <UpgradeNeeded newVersion="1.2.3" reloadAfter={100000000} />
      </ThemeContext.Provider>,
>>>>>>> f2d4110a (upgrading to react 19)
    );

<<<<<<< HEAD
    act(() => {
      unmount();
    });

    act(() => {
      jest.runOnlyPendingTimers();
    });
    expect(reloadSpy).not.toBeCalled();
=======
    unmount();
    expect(clearTimeoutSpy).toHaveBeenCalled();
>>>>>>> f2d4110a (upgrading to react 19)
  });
});

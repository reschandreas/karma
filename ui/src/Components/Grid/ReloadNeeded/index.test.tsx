<<<<<<< HEAD
import { act } from "react-dom/test-utils";

=======
>>>>>>> f2d4110a (upgrading to react 19)
import { render } from "@testing-library/react";

import { MockThemeContext } from "__fixtures__/Theme";
import { ThemeContext } from "Components/Theme";
import { ReloadNeeded } from ".";

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

describe("<ReloadNeeded />", () => {
  it("matches snapshot", () => {
<<<<<<< HEAD
    const { asFragment } = renderWithTheme(
      <ReloadNeeded reloadAfter={100000000} />,
=======
    const { asFragment } = render(
      <ThemeContext.Provider value={MockThemeContext}>
        <ReloadNeeded reloadAfter={100000000} />
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

    renderWithTheme(<ReloadNeeded reloadAfter={100000000} />);

    act(() => {
      jest.runOnlyPendingTimers();
    });
    expect(reloadSpy).toBeCalled();
=======
  it("renders the reload message", () => {
    const { container } = render(
      <ThemeContext.Provider value={MockThemeContext}>
        <ReloadNeeded reloadAfter={100000000} />
      </ThemeContext.Provider>,
    );
    expect(container.textContent).toContain("will try to reload");
>>>>>>> f2d4110a (upgrading to react 19)
  });

  it("cleans up timer on unmount", () => {
    const clearTimeoutSpy = jest.spyOn(global, "clearTimeout");

<<<<<<< HEAD
    const { unmount } = renderWithTheme(
      <ReloadNeeded reloadAfter={100000000} />,
    );
    expect(reloadSpy).not.toBeCalled();

    act(() => {
      unmount();
    });
    act(() => {
      jest.runOnlyPendingTimers();
    });
    expect(reloadSpy).not.toBeCalled();
=======
    const { unmount } = render(
      <ThemeContext.Provider value={MockThemeContext}>
        <ReloadNeeded reloadAfter={100000000} />
      </ThemeContext.Provider>,
    );

    unmount();
    expect(clearTimeoutSpy).toHaveBeenCalled();
>>>>>>> f2d4110a (upgrading to react 19)
  });
});

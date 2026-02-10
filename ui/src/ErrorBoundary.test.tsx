<<<<<<< HEAD
import { render, screen } from "@testing-library/react";
=======
import { render, act } from "@testing-library/react";
>>>>>>> f2d4110a (upgrading to react 19)

import { ErrorBoundary } from "./ErrorBoundary";

let consoleSpy: any;

beforeEach(() => {
  jest.useFakeTimers();
  consoleSpy = jest.spyOn(console, "error").mockImplementation(() => {});
});

afterEach(() => {
  jest.clearAllTimers();
  jest.restoreAllMocks();
});

const FailingComponent = () => {
  throw new Error("Error thrown from problem child");
};

<<<<<<< HEAD
const renderFailingComponent = () => {
=======
const MountedFailingComponent = () => {
>>>>>>> f2d4110a (upgrading to react 19)
  return render(
    <ErrorBoundary>
      <FailingComponent></FailingComponent>
    </ErrorBoundary>,
  );
};

describe("<ErrorBoundary />", () => {
  it("matches snapshot", () => {
<<<<<<< HEAD
    const { asFragment } = renderFailingComponent();
=======
    const { asFragment } = MountedFailingComponent();
>>>>>>> f2d4110a (upgrading to react 19)
    expect(asFragment()).toMatchSnapshot();
    expect(consoleSpy).toHaveBeenCalled();
  });

  it("componentDidCatch should catch an error from FailingComponent", () => {
<<<<<<< HEAD
    jest.spyOn(ErrorBoundary.prototype, "componentDidCatch");
    renderFailingComponent();
    expect(ErrorBoundary.prototype.componentDidCatch).toHaveBeenCalled();
  });

  it("calls window.location.reload after 60s", () => {
    const reloadSpy = jest.spyOn(global.window.location, "reload");
    renderFailingComponent();
    jest.advanceTimersByTime(1000 * 61);
    expect(reloadSpy).toHaveBeenCalled();
=======
    const { container } = MountedFailingComponent();
    expect(container.textContent).toContain("Internal error");
    expect(container.textContent).toContain("Error thrown from problem child");
  });

  it("countdown decreases over time", () => {
    const { container } = MountedFailingComponent();
    expect(container.textContent).toContain("60s");
>>>>>>> f2d4110a (upgrading to react 19)
    expect(consoleSpy).toHaveBeenCalled();

    // Advance 1 second - the setInterval fires every 1000ms
    for (let i = 0; i < 1; i++) {
      act(() => {
        jest.advanceTimersByTime(1000);
      });
    }
    expect(container.textContent).toContain("59s");
  });

<<<<<<< HEAD
  it("renders error message when component fails", () => {
    renderFailingComponent();
    expect(
      screen.getByText("Error: Error thrown from problem child"),
    ).toBeInTheDocument();
    expect(consoleSpy).toHaveBeenCalled();
=======
  it("reloadSeconds is 40 after 20s", () => {
    const { container } = MountedFailingComponent();
    expect(container.textContent).toContain("60s");

    // Advance 20 seconds one at a time to let each interval fire
    for (let i = 0; i < 20; i++) {
      act(() => {
        jest.advanceTimersByTime(1000);
      });
    }

    expect(container.textContent).toContain("40s");
>>>>>>> f2d4110a (upgrading to react 19)
  });
});

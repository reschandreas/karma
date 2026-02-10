import { render, act } from "@testing-library/react";

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

const MountedFailingComponent = () => {
  return render(
    <ErrorBoundary>
      <FailingComponent></FailingComponent>
    </ErrorBoundary>,
  );
};

describe("<ErrorBoundary />", () => {
  it("matches snapshot", () => {
    const { asFragment } = MountedFailingComponent();
    expect(asFragment()).toMatchSnapshot();
    expect(consoleSpy).toHaveBeenCalled();
  });

  it("componentDidCatch should catch an error from FailingComponent", () => {
    const { container } = MountedFailingComponent();
    expect(container.textContent).toContain("Internal error");
    expect(container.textContent).toContain("Error thrown from problem child");
  });

  it("countdown decreases over time", () => {
    const { container } = MountedFailingComponent();
    expect(container.textContent).toContain("60s");
    expect(consoleSpy).toHaveBeenCalled();

    // Advance 1 second - the setInterval fires every 1000ms
    for (let i = 0; i < 1; i++) {
      act(() => {
        jest.advanceTimersByTime(1000);
      });
    }
    expect(container.textContent).toContain("59s");
  });

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
  });
});

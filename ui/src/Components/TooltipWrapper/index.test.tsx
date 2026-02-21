import { render, fireEvent, act } from "@testing-library/react";

import { TooltipWrapper } from ".";

describe("TooltipWrapper", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("renders only children", () => {
    const { container } = render(
      <TooltipWrapper title="my title">
        <span>Hover me</span>
      </TooltipWrapper>,
    );
    expect(container.textContent).toBe("Hover me");
    expect(document.querySelectorAll("div.tooltip")).toHaveLength(0);
  });

  it("uses passed className", () => {
    const { container } = render(
      <TooltipWrapper title="my title" className="foo">
        <span>Hover me</span>
      </TooltipWrapper>,
    );
    expect(container.querySelectorAll("div.foo")).toHaveLength(1);
    expect(container.querySelector("div.foo")!.textContent).toBe("Hover me");
  });

  it("on non-touch devices it renders tooltip on mouseOver and hides on mouseLeave", async () => {
    const { container } = render(
      <TooltipWrapper title="my title">
        <span>Hover me</span>
      </TooltipWrapper>,
    );

    fireEvent.mouseOver(container.firstChild!);
    act(() => {
      jest.runAllTimers();
    });
    expect(document.querySelectorAll("div.tooltip")).toHaveLength(1);

    fireEvent.mouseLeave(container.firstChild!);
    act(() => {
      jest.runAllTimers();
    });
    expect(document.querySelectorAll("div.tooltip")).toHaveLength(0);

    await act(async () => {
      jest.runAllTimers();
    });
  });

  it("on touch devices it renders tooltip on touchStart and hides on touchEnd", async () => {
    const { container } = render(
      <TooltipWrapper title="my title">
        <span>Hover me</span>
      </TooltipWrapper>,
    );

    // Enable touch mode by dispatching touchstart on window after render
    // so the useSupportsTouch hook's listener is active
    act(() => {
      const event = new Event("touchstart");
      global.window.dispatchEvent(event);
    });

    fireEvent.touchStart(container.firstChild!);
    act(() => {
      jest.runAllTimers();
    });
    expect(document.querySelectorAll("div.tooltip")).toHaveLength(1);

    fireEvent.touchEnd(container.firstChild!);
    act(() => {
      jest.runAllTimers();
    });
    expect(document.querySelectorAll("div.tooltip")).toHaveLength(0);

    await act(async () => {
      jest.runAllTimers();
    });
  });

  it("hides the tooltip after click and show again on mouseOver", () => {
    const { container, unmount } = render(
      <TooltipWrapper title="my title">
        <span>Hover me</span>
      </TooltipWrapper>,
    );

    fireEvent.mouseOver(container.firstChild!);
    act(() => {
      jest.runAllTimers();
    });
    expect(document.querySelectorAll("div.tooltip")).toHaveLength(1);

    fireEvent.click(container.firstChild!);
    act(() => {
      jest.runAllTimers();
    });
    expect(document.querySelectorAll("div.tooltip")).toHaveLength(0);

    fireEvent.mouseLeave(container.firstChild!);
    act(() => {
      jest.runAllTimers();
    });
    expect(document.querySelectorAll("div.tooltip")).toHaveLength(0);

    fireEvent.mouseOver(container.firstChild!);
    act(() => {
      jest.runAllTimers();
    });
    expect(document.querySelectorAll("div.tooltip")).toHaveLength(1);

    unmount();
    act(() => {
      jest.runAllTimers();
    });
  });
});

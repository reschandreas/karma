import type { FC, Ref } from "react";

import { render, renderHook, fireEvent } from "@testing-library/react";

import { useGrid } from "./useGrid";

const sizes = [{ columns: 2, gutter: 0 }];

const Component: FC<{ count: number }> = ({ count }) => {
  const { ref, repack } = useGrid(sizes);
  return (
    <div ref={ref as Ref<any>} id="root" onClick={repack}>
      {Array.from(Array(count).keys()).map((i) => (
        <div key={i} id={`item${i}`} style={{ width: 400 }}></div>
      ))}
    </div>
  );
};

describe("useGrid", () => {
  it("does nothing if ref is null", () => {
    const { result } = renderHook(() => useGrid([]));
    expect(result.current.ref).toMatchObject({ current: null });
  });

  it("repack does nothing if ref is null", () => {
    const { result } = renderHook(() => useGrid([]));
    expect(result.current.ref).toMatchObject({ current: null });
    result.current.repack();
  });

  it("packs grid if ref is set", () => {
    const { container } = render(<Component count={4} />);
    expect(container.querySelector("#item0")!.outerHTML).toMatch(/data-packed/);
    expect(container.querySelector("#item1")!.outerHTML).toMatch(/data-packed/);
    expect(container.querySelector("#item2")!.outerHTML).toMatch(/data-packed/);
    expect(container.querySelector("#item3")!.outerHTML).toMatch(/data-packed/);
  });

  it("repack will repack the grid if ref is set", () => {
    const { container, rerender } = render(<Component count={4} />);
    expect(container.querySelector("#item0")!.outerHTML).toMatch(/data-packed/);
    expect(container.querySelector("#item1")!.outerHTML).toMatch(/data-packed/);
    expect(container.querySelector("#item2")!.outerHTML).toMatch(/data-packed/);
    expect(container.querySelector("#item3")!.outerHTML).toMatch(/data-packed/);

    rerender(<Component count={5} />);
    expect(container.querySelector("#item4")!.outerHTML).not.toMatch(
      /data-packed/,
    );

    fireEvent.click(container.querySelector("#root")!);
    expect(container.querySelector("#item4")!.outerHTML).toMatch(/data-packed/);
  });

  it("unmounts cleanly", () => {
    const { unmount } = render(<Component count={4} />);
    unmount();
  });

  it("repack after unmount does nothing", () => {
    let repackFn: (() => void) | undefined;
    const RepackCapture: FC = () => {
      const { ref, repack } = useGrid(sizes);
      repackFn = repack;
      return (
        <div ref={ref as Ref<any>} id="root">
          {Array.from(Array(4).keys()).map((i) => (
            <div key={i} id={`item${i}`} style={{ width: 400 }}></div>
          ))}
        </div>
      );
    };
    const { unmount } = render(<RepackCapture />);
    unmount();
    repackFn!();
  });
});

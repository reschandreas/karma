import { FC, useRef, useState } from "react";
import { render, fireEvent, act } from "@testing-library/react";

import { useOnClickOutside } from "./useOnClickOutside";

describe("useOnClickOutside", () => {
  const Component: FC<{
    enabled: boolean;
  }> = ({ enabled }) => {
    const ref = useRef<HTMLDivElement | null>(null);
    const [isModalOpen, setModalOpen] = useState<boolean>(true);
    useOnClickOutside(ref, () => setModalOpen(false), enabled);

    return (
      <div>
        {isModalOpen ? (
          <div ref={ref}>
            <span>Open</span>
          </div>
        ) : (
          <div>Hidden</div>
        )}
      </div>
    );
  };

  it("closes modal on click outside", () => {
    const { container } = render(<Component enabled />);
    expect(container.textContent).toBe("Open");

    const clickEvent = document.createEvent("MouseEvents");
    clickEvent.initEvent("mousedown", true, true);
    act(() => {
      document.dispatchEvent(clickEvent);
    });

    expect(container.textContent).toBe("Hidden");
  });

  it("ignores events when hidden", () => {
    const { container } = render(<Component enabled />);
    expect(container.textContent).toBe("Open");

    const clickEvent = document.createEvent("MouseEvents");
    clickEvent.initEvent("mousedown", true, true);
    act(() => {
      document.dispatchEvent(clickEvent);
    });

    act(() => {
      document.dispatchEvent(clickEvent);
    });
    expect(container.textContent).toBe("Hidden");
  });

  it("modal stays open on click inside", () => {
    const { container } = render(<Component enabled />);
    expect(container.textContent).toBe("Open");
    fireEvent.click(container.querySelector("span")!);
    expect(container.textContent).toBe("Open");
  });

  it("only runs when enabled", () => {
    const { container, rerender } = render(<Component enabled={false} />);
    expect(container.textContent).toBe("Open");

    const clickEvent = document.createEvent("MouseEvents");
    clickEvent.initEvent("mousedown", true, true);
    act(() => {
      document.dispatchEvent(clickEvent);
    });

    expect(container.textContent).toBe("Open");

    rerender(<Component enabled={true} />);
    act(() => {
      document.dispatchEvent(clickEvent);
    });
    expect(container.textContent).toBe("Hidden");
  });

  it("unmounts cleanly", () => {
    const { container, unmount } = render(<Component enabled />);
    expect(container.textContent).toBe("Open");
    unmount();
  });
});

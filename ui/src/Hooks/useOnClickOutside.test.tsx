import { FC, useRef, useState } from "react";
<<<<<<< HEAD
import { act } from "react-dom/test-utils";

import { render, screen, fireEvent } from "@testing-library/react";
=======
import { render, fireEvent, act } from "@testing-library/react";
>>>>>>> f2d4110a (upgrading to react 19)

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
<<<<<<< HEAD
    render(<Component enabled />);
    expect(screen.getByText("Open")).toBeInTheDocument();
=======
    const { container } = render(<Component enabled />);
    expect(container.textContent).toBe("Open");
>>>>>>> f2d4110a (upgrading to react 19)

    const clickEvent = document.createEvent("MouseEvents");
    clickEvent.initEvent("mousedown", true, true);
    act(() => {
      document.dispatchEvent(clickEvent);
    });

<<<<<<< HEAD
    expect(screen.getByText("Hidden")).toBeInTheDocument();
  });

  it("ignores events when hidden", () => {
    render(<Component enabled />);
    expect(screen.getByText("Open")).toBeInTheDocument();
=======
    expect(container.textContent).toBe("Hidden");
  });

  it("ignores events when hidden", () => {
    const { container } = render(<Component enabled />);
    expect(container.textContent).toBe("Open");
>>>>>>> f2d4110a (upgrading to react 19)

    const clickEvent = document.createEvent("MouseEvents");
    clickEvent.initEvent("mousedown", true, true);
    act(() => {
      document.dispatchEvent(clickEvent);
    });

    act(() => {
      document.dispatchEvent(clickEvent);
    });
<<<<<<< HEAD
    expect(screen.getByText("Hidden")).toBeInTheDocument();
  });

  it("modal stays open on click inside", () => {
    render(<Component enabled />);
    expect(screen.getByText("Open")).toBeInTheDocument();
    fireEvent.click(screen.getByText("Open"));
    expect(screen.getByText("Open")).toBeInTheDocument();
  });

  it("only runs when enabled", () => {
    const { rerender } = render(<Component enabled={false} />);
    expect(screen.getByText("Open")).toBeInTheDocument();
=======
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
>>>>>>> f2d4110a (upgrading to react 19)

    const clickEvent = document.createEvent("MouseEvents");
    clickEvent.initEvent("mousedown", true, true);
    act(() => {
      document.dispatchEvent(clickEvent);
    });

<<<<<<< HEAD
    expect(screen.getByText("Open")).toBeInTheDocument();
=======
    expect(container.textContent).toBe("Open");
>>>>>>> f2d4110a (upgrading to react 19)

    rerender(<Component enabled={true} />);
    act(() => {
      document.dispatchEvent(clickEvent);
    });
<<<<<<< HEAD
    expect(screen.getByText("Hidden")).toBeInTheDocument();
  });

  it("unmounts cleanly", () => {
    const { unmount } = render(<Component enabled />);
    expect(screen.getByText("Open")).toBeInTheDocument();
=======
    expect(container.textContent).toBe("Hidden");
  });

  it("unmounts cleanly", () => {
    const { container, unmount } = render(<Component enabled />);
    expect(container.textContent).toBe("Open");
>>>>>>> f2d4110a (upgrading to react 19)
    unmount();
  });
});

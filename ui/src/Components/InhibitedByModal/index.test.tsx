import { render, fireEvent, act } from "@testing-library/react";

import { AlertStore } from "Stores/AlertStore";
import { InhibitedByModal } from ".";

let alertStore: AlertStore;

beforeEach(() => {
  jest.useFakeTimers();

  alertStore = new AlertStore([]);
});

afterEach(() => {
  document.body.className = "";
});

describe("<InhibitedByModal />", () => {
  it("renders a spinner placeholder while modal content is loading", () => {
    const { container } = render(
      <InhibitedByModal alertStore={alertStore} fingerprints={["foo"]} />,
    );
    const toggle = container.querySelector("span.badge.bg-light") as HTMLElement;
    fireEvent.click(toggle);
    expect(document.body.querySelectorAll(".modal-content svg.fa-spinner")).toHaveLength(1);
  });

  it("renders modal content if fallback is not used", () => {
    const { container } = render(
      <InhibitedByModal alertStore={alertStore} fingerprints={["foo"]} />,
    );
    const toggle = container.querySelector("span.badge.bg-light") as HTMLElement;
    fireEvent.click(toggle);
    expect(document.body.querySelector(".modal-title")!.textContent).toBe("Inhibiting alerts");
    expect(document.body.querySelectorAll(".modal-content svg.fa-spinner")).toHaveLength(0);
  });

  it("handles multiple fingerprints", () => {
    const { container } = render(
      <InhibitedByModal
        alertStore={alertStore}
        fingerprints={["foo", "bar"]}
      />,
    );
    const toggle = container.querySelector("span.badge.bg-light") as HTMLElement;
    fireEvent.click(toggle);
    expect(document.body.querySelector(".modal-title")!.textContent).toBe("Inhibiting alerts");
    expect(document.body.querySelectorAll(".modal-content svg.fa-spinner")).toHaveLength(0);
  });

  it("hides the modal when toggle() is called twice", () => {
    const { container } = render(
      <InhibitedByModal alertStore={alertStore} fingerprints={["foo"]} />,
    );
    const toggle = container.querySelector("span.badge.bg-light") as HTMLElement;

    fireEvent.click(toggle);
    act(() => {
      jest.runOnlyPendingTimers();
    });
    expect(document.body.querySelector(".modal-title")!.textContent).toBe("Inhibiting alerts");

    fireEvent.click(toggle);
    act(() => {
      jest.runOnlyPendingTimers();
    });
    expect(document.body.querySelectorAll(".modal-title")).toHaveLength(0);
  });

  it("hides the modal when button.btn-close is clicked", () => {
    const { container } = render(
      <InhibitedByModal alertStore={alertStore} fingerprints={["foo"]} />,
    );
    const toggle = container.querySelector("span.badge.bg-light") as HTMLElement;

    fireEvent.click(toggle);
    expect(document.body.querySelector(".modal-title")!.textContent).toBe("Inhibiting alerts");

    fireEvent.click(document.body.querySelector("button.btn-close") as HTMLElement);
    act(() => {
      jest.runOnlyPendingTimers();
    });
    expect(document.body.querySelectorAll(".modal-content")).toHaveLength(0);
  });

  it("'modal-open' class is appended to body node when modal is visible", () => {
    const { container } = render(
      <InhibitedByModal alertStore={alertStore} fingerprints={["foo"]} />,
    );
    const toggle = container.querySelector("span.badge.bg-light") as HTMLElement;
    fireEvent.click(toggle);
    expect(document.body.className.split(" ")).toContain("modal-open");
  });

  it("'modal-open' class is removed from body node after modal is hidden", () => {
    const { container } = render(
      <InhibitedByModal alertStore={alertStore} fingerprints={["foo"]} />,
    );

    fireEvent.click(container.querySelector("span.badge.bg-light") as HTMLElement);
    expect(document.body.className.split(" ")).toContain("modal-open");

    fireEvent.click(container.querySelector("span.badge.bg-light") as HTMLElement);
    act(() => {
      jest.runOnlyPendingTimers();
    });
    expect(document.body.className.split(" ")).not.toContain("modal-open");
  });

  it("'modal-open' class is removed from body node after modal is unmounted", () => {
    const { container, unmount } = render(
      <InhibitedByModal alertStore={alertStore} fingerprints={["foo"]} />,
    );

    const toggle = container.querySelector("span.badge.bg-light") as HTMLElement;
    fireEvent.click(toggle);

    act(() => {
      unmount();
    });
    expect(document.body.className.split(" ")).not.toContain("modal-open");
  });
});

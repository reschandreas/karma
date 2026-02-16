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
  it("renders a spinner placeholder while modal content is loading", async () => {
    const { container } = render(
      <InhibitedByModal alertStore={alertStore} fingerprints={["foo"]} />,
    );
    const toggle = container.querySelector(
      "span.badge.bg-light",
    ) as HTMLElement;
    fireEvent.click(toggle);
    expect(
      document.body.querySelectorAll(".modal-content svg.fa-spinner"),
    ).toHaveLength(1);
    await act(async () => {});
  });

  it("renders modal content if fallback is not used", async () => {
    const { container } = render(
      <InhibitedByModal alertStore={alertStore} fingerprints={["foo"]} />,
    );
    const toggle = container.querySelector(
      "span.badge.bg-light",
    ) as HTMLElement;
    await act(async () => {
      fireEvent.click(toggle);
    });
    expect(document.body.querySelector(".modal-title")!.textContent).toBe(
      "Inhibiting alerts",
    );
    expect(
      document.body.querySelectorAll(".modal-content svg.fa-spinner"),
    ).toHaveLength(0);
  });

  it("handles multiple fingerprints", async () => {
    const { container } = render(
      <InhibitedByModal
        alertStore={alertStore}
        fingerprints={["foo", "bar"]}
      />,
    );
    const toggle = container.querySelector(
      "span.badge.bg-light",
    ) as HTMLElement;
    await act(async () => {
      fireEvent.click(toggle);
    });
    expect(document.body.querySelector(".modal-title")!.textContent).toBe(
      "Inhibiting alerts",
    );
    expect(
      document.body.querySelectorAll(".modal-content svg.fa-spinner"),
    ).toHaveLength(0);
  });

  it("hides the modal when toggle() is called twice", async () => {
    const { container } = render(
      <InhibitedByModal alertStore={alertStore} fingerprints={["foo"]} />,
    );
    const toggle = container.querySelector(
      "span.badge.bg-light",
    ) as HTMLElement;

    await act(async () => {
      fireEvent.click(toggle);
    });
    act(() => {
      jest.runOnlyPendingTimers();
    });
    expect(document.body.querySelector(".modal-title")!.textContent).toBe(
      "Inhibiting alerts",
    );

    fireEvent.click(toggle);
    act(() => {
      jest.runOnlyPendingTimers();
    });
    expect(document.body.querySelectorAll(".modal-title")).toHaveLength(0);
  });

  it("hides the modal when button.btn-close is clicked", async () => {
    const { container } = render(
      <InhibitedByModal alertStore={alertStore} fingerprints={["foo"]} />,
    );
    const toggle = container.querySelector(
      "span.badge.bg-light",
    ) as HTMLElement;

    await act(async () => {
      fireEvent.click(toggle);
    });
    expect(document.body.querySelector(".modal-title")!.textContent).toBe(
      "Inhibiting alerts",
    );

    fireEvent.click(
      document.body.querySelector("button.btn-close") as HTMLElement,
    );
    act(() => {
      jest.runOnlyPendingTimers();
    });
    expect(document.body.querySelectorAll(".modal-content")).toHaveLength(0);
  });

  it("'modal-open' class is appended to body node when modal is visible", async () => {
    const { container } = render(
      <InhibitedByModal alertStore={alertStore} fingerprints={["foo"]} />,
    );
    const toggle = container.querySelector(
      "span.badge.bg-light",
    ) as HTMLElement;
    await act(async () => {
      fireEvent.click(toggle);
    });
    expect(document.body.className.split(" ")).toContain("modal-open");
  });

  it("'modal-open' class is removed from body node after modal is hidden", async () => {
    const { container } = render(
      <InhibitedByModal alertStore={alertStore} fingerprints={["foo"]} />,
    );

    await act(async () => {
      fireEvent.click(
        container.querySelector("span.badge.bg-light") as HTMLElement,
      );
    });
    expect(document.body.className.split(" ")).toContain("modal-open");

    fireEvent.click(
      container.querySelector("span.badge.bg-light") as HTMLElement,
    );
    act(() => {
      jest.runOnlyPendingTimers();
    });
    expect(document.body.className.split(" ")).not.toContain("modal-open");
  });

  it("'modal-open' class is removed from body node after modal is unmounted", async () => {
    const { container, unmount } = render(
      <InhibitedByModal alertStore={alertStore} fingerprints={["foo"]} />,
    );

    const toggle = container.querySelector(
      "span.badge.bg-light",
    ) as HTMLElement;
    await act(async () => {
      fireEvent.click(toggle);
    });

    act(() => {
      unmount();
    });
    expect(document.body.className.split(" ")).not.toContain("modal-open");
  });
});

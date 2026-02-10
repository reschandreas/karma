<<<<<<< HEAD
import { act } from "react-dom/test-utils";

import { render, screen, fireEvent, waitFor } from "@testing-library/react";
=======
import { render, fireEvent, act } from "@testing-library/react";
>>>>>>> f2d4110a (upgrading to react 19)

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

const renderInhibitedByModal = (fingerprints: string[]) => {
  return render(
    <InhibitedByModal alertStore={alertStore} fingerprints={fingerprints} />,
  );
};

describe("<InhibitedByModal />", () => {
  it("renders a spinner placeholder while modal content is loading", () => {
<<<<<<< HEAD
    const { container } = renderInhibitedByModal(["foo"]);
    const toggle = container.querySelector("span.badge.bg-light");
    fireEvent.click(toggle!);
    expect(
      document.body.querySelector(".modal-content svg.fa-spinner"),
    ).toBeInTheDocument();
  });

  it("renders modal content if fallback is not used", () => {
    const { container } = renderInhibitedByModal(["foo"]);
    const toggle = container.querySelector("span.badge.bg-light");
    fireEvent.click(toggle!);
    expect(screen.getByText("Inhibiting alerts")).toBeInTheDocument();
  });

  it("handles multiple fingerprints", () => {
    const { container } = renderInhibitedByModal(["foo", "bar"]);
    const toggle = container.querySelector("span.badge.bg-light");
    fireEvent.click(toggle!);
    expect(screen.getByText("Inhibiting alerts")).toBeInTheDocument();
  });

  it("hides the modal when toggle() is called twice", async () => {
    const { container } = renderInhibitedByModal(["foo"]);
    const toggle = container.querySelector("span.badge.bg-light");

    fireEvent.click(toggle!);
    act(() => {
      jest.runOnlyPendingTimers();
    });
    expect(screen.getByText("Inhibiting alerts")).toBeInTheDocument();

    fireEvent.click(toggle!);
    act(() => {
      jest.runOnlyPendingTimers();
    });
    await waitFor(() => {
      expect(screen.queryByText("Inhibiting alerts")).not.toBeInTheDocument();
    });
  });

  it("hides the modal when button.btn-close is clicked", async () => {
    const { container } = renderInhibitedByModal(["foo"]);
    const toggle = container.querySelector("span.badge.bg-light");

    fireEvent.click(toggle!);
    expect(screen.getByText("Inhibiting alerts")).toBeInTheDocument();

    const closeBtn = document.body.querySelector("button.btn-close");
    fireEvent.click(closeBtn!);
    act(() => {
      jest.runOnlyPendingTimers();
    });
    await waitFor(() => {
      expect(screen.queryByText("Inhibiting alerts")).not.toBeInTheDocument();
    });
  });

  it("'modal-open' class is appended to body node when modal is visible", () => {
    const { container } = renderInhibitedByModal(["foo"]);
    const toggle = container.querySelector("span.badge.bg-light");
    fireEvent.click(toggle!);
=======
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
>>>>>>> f2d4110a (upgrading to react 19)
    expect(document.body.className.split(" ")).toContain("modal-open");
  });

  it("'modal-open' class is removed from body node after modal is hidden", () => {
<<<<<<< HEAD
    const { container } = renderInhibitedByModal(["foo"]);

    const toggle = container.querySelector("span.badge.bg-light");
    fireEvent.click(toggle!);
    expect(document.body.className.split(" ")).toContain("modal-open");

    fireEvent.click(toggle!);
=======
    const { container } = render(
      <InhibitedByModal alertStore={alertStore} fingerprints={["foo"]} />,
    );

    fireEvent.click(container.querySelector("span.badge.bg-light") as HTMLElement);
    expect(document.body.className.split(" ")).toContain("modal-open");

    fireEvent.click(container.querySelector("span.badge.bg-light") as HTMLElement);
>>>>>>> f2d4110a (upgrading to react 19)
    act(() => {
      jest.runOnlyPendingTimers();
    });
    expect(document.body.className.split(" ")).not.toContain("modal-open");
  });

  it("'modal-open' class is removed from body node after modal is unmounted", () => {
<<<<<<< HEAD
    const { container, unmount } = renderInhibitedByModal(["foo"]);

    const toggle = container.querySelector("span.badge.bg-light");
    fireEvent.click(toggle!);
=======
    const { container, unmount } = render(
      <InhibitedByModal alertStore={alertStore} fingerprints={["foo"]} />,
    );

    const toggle = container.querySelector("span.badge.bg-light") as HTMLElement;
    fireEvent.click(toggle);
>>>>>>> f2d4110a (upgrading to react 19)

    act(() => {
      unmount();
    });
    expect(document.body.className.split(" ")).not.toContain("modal-open");
  });
});

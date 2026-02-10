<<<<<<< HEAD
import { act } from "react-dom/test-utils";

import { render, screen, fireEvent, waitFor } from "@testing-library/react";
=======
import { render, fireEvent, act } from "@testing-library/react";
>>>>>>> f2d4110a (upgrading to react 19)

import { useFetchGetMock } from "__fixtures__/useFetchGet";
import { AlertStore } from "Stores/AlertStore";
import { OverviewModal } from ".";

let alertStore: AlertStore;

beforeEach(() => {
  alertStore = new AlertStore([]);
  jest.useFakeTimers();
});

afterEach(() => {
  document.body.className = "";
});

<<<<<<< HEAD
const renderOverviewModal = () => {
=======
const MountedOverviewModal = () => {
>>>>>>> f2d4110a (upgrading to react 19)
  return render(<OverviewModal alertStore={alertStore} />);
};

describe("<OverviewModal />", () => {
  it("only renders the counter when modal is not shown", () => {
<<<<<<< HEAD
    renderOverviewModal();
    expect(screen.getByText("0")).toBeInTheDocument();
    expect(screen.queryByText("Overview")).not.toBeInTheDocument();
  });

  it("renders a spinner placeholder while modal content is loading", () => {
    const { container } = renderOverviewModal();
    const toggle = container.querySelector("div.navbar-brand");
    fireEvent.click(toggle!);
    expect(
      document.body.querySelector(".modal-content svg.fa-spinner"),
    ).toBeInTheDocument();
=======
    const { container } = MountedOverviewModal();
    expect(container.textContent).toBe("0");
    expect(document.body.querySelectorAll(".modal-content")).toHaveLength(0);
  });

  it("renders a spinner placeholder while modal content is loading", () => {
    const { container } = MountedOverviewModal();
    const toggle = container.querySelector("div.navbar-brand") as HTMLElement;
    fireEvent.click(toggle);
    expect(document.body.querySelectorAll(".modal-content svg.fa-spinner")).toHaveLength(1);
>>>>>>> f2d4110a (upgrading to react 19)
  });

  it("renders a spinner placeholder while fetch is in progress", () => {
    useFetchGetMock.fetch.setMockedData({
      response: null,
      error: null,
      isLoading: true,
      isRetrying: false,
      retryCount: 0,
      get: jest.fn(),
      cancelGet: jest.fn(),
    });
<<<<<<< HEAD
    const { container } = renderOverviewModal();
    const toggle = container.querySelector("div.navbar-brand");
    fireEvent.click(toggle!);
    expect(
      document.body.querySelector(".modal-content svg.fa-spinner"),
    ).toBeInTheDocument();
=======
    const { container } = MountedOverviewModal();
    const toggle = container.querySelector("div.navbar-brand") as HTMLElement;
    fireEvent.click(toggle);
    expect(document.body.querySelectorAll(".modal-content svg.fa-spinner")).toHaveLength(1);
>>>>>>> f2d4110a (upgrading to react 19)
  });

  it("renders an error message on fetch error", () => {
    useFetchGetMock.fetch.setMockedData({
      response: null,
      error: "mock error",
      isLoading: false,
      isRetrying: false,
      retryCount: 0,
      get: jest.fn(),
      cancelGet: jest.fn(),
    });
<<<<<<< HEAD
    const { container } = renderOverviewModal();
    const toggle = container.querySelector("div.navbar-brand");
    fireEvent.click(toggle!);
    expect(screen.getByText("mock error")).toBeInTheDocument();
=======
    const { container } = MountedOverviewModal();
    const toggle = container.querySelector("div.navbar-brand") as HTMLElement;
    fireEvent.click(toggle);
    expect(document.body.querySelector("h1.text-danger")!.textContent).toBe("mock error");
>>>>>>> f2d4110a (upgrading to react 19)
  });

  it("renders modal content if fallback is not used", () => {
    useFetchGetMock.fetch.setMockedData({
      response: {
        total: 20,
        counters: [],
      },
      error: null,
      isLoading: false,
      isRetrying: false,
      retryCount: 0,
      get: jest.fn(),
      cancelGet: jest.fn(),
    });
<<<<<<< HEAD
    const { container } = renderOverviewModal();
    const toggle = container.querySelector("div.navbar-brand");
    fireEvent.click(toggle!);
    expect(screen.getByText("Overview")).toBeInTheDocument();
=======
    const { container } = MountedOverviewModal();
    const toggle = container.querySelector("div.navbar-brand") as HTMLElement;
    fireEvent.click(toggle);
    expect(document.body.querySelector(".modal-title")!.textContent).toBe("Overview");
    expect(document.body.querySelectorAll(".modal-content svg.fa-spinner")).toHaveLength(0);
>>>>>>> f2d4110a (upgrading to react 19)
  });

  it("re-fetches counters after timestamp change", () => {
    alertStore.info.setTimestamp("old");
    useFetchGetMock.fetch.setMockedData({
      response: {
        total: 20,
        counters: [],
      },
      error: null,
      isLoading: false,
      isRetrying: false,
      retryCount: 0,
      get: jest.fn(),
      cancelGet: jest.fn(),
    });
<<<<<<< HEAD
    const { container } = renderOverviewModal();
    const toggle = container.querySelector("div.navbar-brand");
    fireEvent.click(toggle!);
=======
    const { container } = MountedOverviewModal();
    const toggle = container.querySelector("div.navbar-brand") as HTMLElement;
    fireEvent.click(toggle);
>>>>>>> f2d4110a (upgrading to react 19)
    expect(useFetchGetMock.fetch.calls).toHaveLength(1);

    act(() => {
      alertStore.info.setTimestamp("new");
    });
    expect(useFetchGetMock.fetch.calls).toHaveLength(2);
  });

<<<<<<< HEAD
  it("hides the modal when toggle() is called twice", async () => {
    const { container } = renderOverviewModal();
    const toggle = container.querySelector("div.navbar-brand");

    fireEvent.click(toggle!);
    act(() => {
      jest.runOnlyPendingTimers();
    });
    expect(screen.getByText("Overview")).toBeInTheDocument();

    fireEvent.click(toggle!);
    act(() => {
      jest.runOnlyPendingTimers();
    });
    await waitFor(() => {
      expect(screen.queryByText("Overview")).not.toBeInTheDocument();
    });
  });

  it("hides the modal when button.btn-close is clicked", async () => {
    const { container } = renderOverviewModal();
    const toggle = container.querySelector("div.navbar-brand");

    fireEvent.click(toggle!);
    expect(screen.getByText("Overview")).toBeInTheDocument();

    const closeBtn = document.body.querySelector("button.btn-close");
    fireEvent.click(closeBtn!);
    act(() => {
      jest.runOnlyPendingTimers();
    });
    await waitFor(() => {
      expect(screen.queryByText("Overview")).not.toBeInTheDocument();
    });
  });

  it("'modal-open' class is appended to body node when modal is visible", () => {
    const { container } = renderOverviewModal();
    const toggle = container.querySelector("div.navbar-brand");
    fireEvent.click(toggle!);
=======
  it("hides the modal when toggle() is called twice", () => {
    const { container } = MountedOverviewModal();
    const toggle = container.querySelector("div.navbar-brand") as HTMLElement;

    fireEvent.click(toggle);
    act(() => {
      jest.runOnlyPendingTimers();
    });
    expect(document.body.querySelector(".modal-title")!.textContent).toBe("Overview");

    fireEvent.click(toggle);
    act(() => {
      jest.runOnlyPendingTimers();
    });
    expect(document.body.querySelectorAll(".modal-title")).toHaveLength(0);
  });

  it("hides the modal when button.btn-close is clicked", () => {
    const { container } = MountedOverviewModal();
    const toggle = container.querySelector("div.navbar-brand") as HTMLElement;

    fireEvent.click(toggle);
    expect(document.body.querySelector(".modal-title")!.textContent).toBe("Overview");

    fireEvent.click(document.body.querySelector("button.btn-close") as HTMLElement);
    act(() => {
      jest.runOnlyPendingTimers();
    });
    expect(document.body.querySelectorAll(".modal-content")).toHaveLength(0);
  });

  it("'modal-open' class is appended to body node when modal is visible", () => {
    const { container } = MountedOverviewModal();
    const toggle = container.querySelector("div.navbar-brand") as HTMLElement;
    fireEvent.click(toggle);
>>>>>>> f2d4110a (upgrading to react 19)
    expect(document.body.className.split(" ")).toContain("modal-open");
  });

  it("'modal-open' class is removed from body node after modal is hidden", () => {
<<<<<<< HEAD
    const { container } = renderOverviewModal();

    const toggle = container.querySelector("div.navbar-brand");
    fireEvent.click(toggle!);
    expect(document.body.className.split(" ")).toContain("modal-open");

    fireEvent.click(toggle!);
=======
    const { container } = MountedOverviewModal();

    fireEvent.click(container.querySelector("div.navbar-brand") as HTMLElement);
    expect(document.body.className.split(" ")).toContain("modal-open");

    fireEvent.click(container.querySelector("div.navbar-brand") as HTMLElement);
>>>>>>> f2d4110a (upgrading to react 19)
    act(() => {
      jest.runOnlyPendingTimers();
    });
    expect(document.body.className.split(" ")).not.toContain("modal-open");
  });

  it("'modal-open' class is removed from body node after modal is unmounted", () => {
<<<<<<< HEAD
    const { container, unmount } = renderOverviewModal();
    const toggle = container.querySelector("div.navbar-brand");
    fireEvent.click(toggle!);
=======
    const { container, unmount } = MountedOverviewModal();
    const toggle = container.querySelector("div.navbar-brand") as HTMLElement;
    fireEvent.click(toggle);
>>>>>>> f2d4110a (upgrading to react 19)
    unmount();
    expect(document.body.className.split(" ")).not.toContain("modal-open");
  });
});

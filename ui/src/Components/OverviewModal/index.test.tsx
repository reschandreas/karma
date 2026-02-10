import { render, fireEvent, act } from "@testing-library/react";

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

const MountedOverviewModal = () => {
  return render(<OverviewModal alertStore={alertStore} />);
};

describe("<OverviewModal />", () => {
  it("only renders the counter when modal is not shown", () => {
    const { container } = MountedOverviewModal();
    expect(container.textContent).toBe("0");
    expect(document.body.querySelectorAll(".modal-content")).toHaveLength(0);
  });

  it("renders a spinner placeholder while modal content is loading", () => {
    const { container } = MountedOverviewModal();
    const toggle = container.querySelector("div.navbar-brand") as HTMLElement;
    fireEvent.click(toggle);
    expect(document.body.querySelectorAll(".modal-content svg.fa-spinner")).toHaveLength(1);
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
    const { container } = MountedOverviewModal();
    const toggle = container.querySelector("div.navbar-brand") as HTMLElement;
    fireEvent.click(toggle);
    expect(document.body.querySelectorAll(".modal-content svg.fa-spinner")).toHaveLength(1);
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
    const { container } = MountedOverviewModal();
    const toggle = container.querySelector("div.navbar-brand") as HTMLElement;
    fireEvent.click(toggle);
    expect(document.body.querySelector("h1.text-danger")!.textContent).toBe("mock error");
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
    const { container } = MountedOverviewModal();
    const toggle = container.querySelector("div.navbar-brand") as HTMLElement;
    fireEvent.click(toggle);
    expect(document.body.querySelector(".modal-title")!.textContent).toBe("Overview");
    expect(document.body.querySelectorAll(".modal-content svg.fa-spinner")).toHaveLength(0);
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
    const { container } = MountedOverviewModal();
    const toggle = container.querySelector("div.navbar-brand") as HTMLElement;
    fireEvent.click(toggle);
    expect(useFetchGetMock.fetch.calls).toHaveLength(1);

    act(() => {
      alertStore.info.setTimestamp("new");
    });
    expect(useFetchGetMock.fetch.calls).toHaveLength(2);
  });

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
    expect(document.body.className.split(" ")).toContain("modal-open");
  });

  it("'modal-open' class is removed from body node after modal is hidden", () => {
    const { container } = MountedOverviewModal();

    fireEvent.click(container.querySelector("div.navbar-brand") as HTMLElement);
    expect(document.body.className.split(" ")).toContain("modal-open");

    fireEvent.click(container.querySelector("div.navbar-brand") as HTMLElement);
    act(() => {
      jest.runOnlyPendingTimers();
    });
    expect(document.body.className.split(" ")).not.toContain("modal-open");
  });

  it("'modal-open' class is removed from body node after modal is unmounted", () => {
    const { container, unmount } = MountedOverviewModal();
    const toggle = container.querySelector("div.navbar-brand") as HTMLElement;
    fireEvent.click(toggle);
    unmount();
    expect(document.body.className.split(" ")).not.toContain("modal-open");
  });
});

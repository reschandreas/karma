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
  it("only renders the counter when modal is not shown", async () => {
    const { container } = MountedOverviewModal();
    expect(container.textContent).toBe("0");
    expect(document.body.querySelectorAll(".modal-content")).toHaveLength(0);
    await act(async () => {});
  });

  it("renders a spinner placeholder while modal content is loading", async () => {
    const { container } = MountedOverviewModal();
    const toggle = container.querySelector("div.navbar-brand") as HTMLElement;
    fireEvent.click(toggle);
    expect(
      document.body.querySelectorAll(".modal-content svg.fa-spinner"),
    ).toHaveLength(1);
    await act(async () => {});
  });

  it("renders a spinner placeholder while fetch is in progress", async () => {
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
    await act(async () => {
      fireEvent.click(toggle);
    });
    expect(
      document.body.querySelectorAll(".modal-content svg.fa-spinner"),
    ).toHaveLength(1);
  });

  it("renders an error message on fetch error", async () => {
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
    await act(async () => {
      fireEvent.click(toggle);
    });
    expect(document.body.querySelector("h1.text-danger")!.textContent).toBe(
      "mock error",
    );
  });

  it("renders modal content if fallback is not used", async () => {
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
    await act(async () => {
      fireEvent.click(toggle);
    });
    expect(document.body.querySelector(".modal-title")!.textContent).toBe(
      "Overview",
    );
    expect(
      document.body.querySelectorAll(".modal-content svg.fa-spinner"),
    ).toHaveLength(0);
  });

  it("re-fetches counters after timestamp change", async () => {
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
    await act(async () => {
      fireEvent.click(toggle);
    });
    expect(useFetchGetMock.fetch.calls).toHaveLength(1);

    act(() => {
      alertStore.info.setTimestamp("new");
    });
    expect(useFetchGetMock.fetch.calls).toHaveLength(2);
  });

  it("hides the modal when toggle() is called twice", async () => {
    const { container } = MountedOverviewModal();
    const toggle = container.querySelector("div.navbar-brand") as HTMLElement;

    await act(async () => {
      fireEvent.click(toggle);
    });
    act(() => {
      jest.runOnlyPendingTimers();
    });
    expect(document.body.querySelector(".modal-title")!.textContent).toBe(
      "Overview",
    );

    fireEvent.click(toggle);
    act(() => {
      jest.runOnlyPendingTimers();
    });
    expect(document.body.querySelectorAll(".modal-title")).toHaveLength(0);
  });

  it("hides the modal when button.btn-close is clicked", async () => {
    const { container } = MountedOverviewModal();
    const toggle = container.querySelector("div.navbar-brand") as HTMLElement;

    await act(async () => {
      fireEvent.click(toggle);
    });
    expect(document.body.querySelector(".modal-title")!.textContent).toBe(
      "Overview",
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
    const { container } = MountedOverviewModal();
    const toggle = container.querySelector("div.navbar-brand") as HTMLElement;
    await act(async () => {
      fireEvent.click(toggle);
    });
    expect(document.body.className.split(" ")).toContain("modal-open");
  });

  it("'modal-open' class is removed from body node after modal is hidden", async () => {
    const { container } = MountedOverviewModal();

    await act(async () => {
      fireEvent.click(
        container.querySelector("div.navbar-brand") as HTMLElement,
      );
    });
    expect(document.body.className.split(" ")).toContain("modal-open");

    fireEvent.click(container.querySelector("div.navbar-brand") as HTMLElement);
    act(() => {
      jest.runOnlyPendingTimers();
    });
    expect(document.body.className.split(" ")).not.toContain("modal-open");
  });

  it("'modal-open' class is removed from body node after modal is unmounted", async () => {
    const { container, unmount } = MountedOverviewModal();
    const toggle = container.querySelector("div.navbar-brand") as HTMLElement;
    await act(async () => {
      fireEvent.click(toggle);
    });
    unmount();
    expect(document.body.className.split(" ")).not.toContain("modal-open");
  });
});

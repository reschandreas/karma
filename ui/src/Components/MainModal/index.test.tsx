import { render, fireEvent, act } from "@testing-library/react";

import fetchMock from "fetch-mock";

import { MockThemeContext } from "__fixtures__/Theme";
import { AlertStore } from "Stores/AlertStore";
import { Settings } from "Stores/Settings";
import { ThemeContext } from "Components/Theme";
import { MainModal } from ".";

let alertStore: AlertStore;
let settingsStore: Settings;

beforeEach(() => {
  alertStore = new AlertStore([]);
  settingsStore = new Settings(null);

  jest.useFakeTimers();
  fetchMock.reset();
  fetchMock.mock("*", {
    body: JSON.stringify([]),
  });
});

afterEach(() => {
  jest.restoreAllMocks();
  fetchMock.reset();
  document.body.className = "";
});

const MountedMainModal = () => {
  return render(
    <ThemeContext.Provider value={MockThemeContext}>
      <MainModal alertStore={alertStore} settingsStore={settingsStore} />
    </ThemeContext.Provider>,
  );
};

describe("<MainModal />", () => {
  it("only renders FontAwesomeIcon when modal is not shown", () => {
    const { container } = MountedMainModal();
    expect(container.querySelectorAll("svg")).toHaveLength(1);
    expect(document.body.querySelectorAll(".modal-content")).toHaveLength(0);
  });

  it("renders a spinner placeholder while modal content is loading", () => {
    const { container } = MountedMainModal();
    const toggle = container.querySelector(".nav-link")!;
    fireEvent.click(toggle);
    expect(container.querySelectorAll("svg")).not.toHaveLength(0);
    expect(
      document.body.querySelectorAll(".modal-content svg.fa-spinner"),
    ).toHaveLength(1);
    expect(document.body.querySelectorAll(".modal-content")).toHaveLength(1);
  });

  it("renders modal content if fallback is not used", () => {
    const { container } = MountedMainModal();
    const toggle = container.querySelector(".nav-link")!;
    fireEvent.click(toggle);
    expect(container.querySelectorAll("svg")).not.toHaveLength(0);
    expect(
      document.body.querySelectorAll(".modal-content svg.fa-spinner"),
    ).toHaveLength(0);
    expect(document.body.querySelectorAll(".modal-content")).toHaveLength(1);
  });

  it("hides the modal when toggle() is called twice", () => {
    const { container } = MountedMainModal();
    const toggle = container.querySelector(".nav-link")!;

    fireEvent.click(toggle);
    act(() => {
      jest.runOnlyPendingTimers();
    });
    expect(document.body.querySelectorAll(".modal-content")).toHaveLength(1);

    fireEvent.click(toggle);
    act(() => {
      jest.runOnlyPendingTimers();
    });
    expect(document.body.querySelectorAll(".modal-content")).toHaveLength(0);
  });

  it("hides the modal when button.btn-close is clicked", () => {
    const { container } = MountedMainModal();
    const toggle = container.querySelector(".nav-link")!;

    fireEvent.click(toggle);
    expect(document.body.querySelectorAll(".modal-content")).toHaveLength(1);

    fireEvent.click(document.body.querySelector("button.btn-close")!);
    act(() => {
      jest.runOnlyPendingTimers();
    });
    expect(document.body.querySelectorAll(".modal-content")).toHaveLength(0);
  });

  it("'modal-open' class is appended to body node when modal is visible", () => {
    const { container } = MountedMainModal();
    const toggle = container.querySelector(".nav-link")!;
    fireEvent.click(toggle);
    expect(document.body.className.split(" ")).toContain("modal-open");
  });

  it("'modal-open' class is removed from body node after modal is hidden", () => {
    const { container } = MountedMainModal();
    const toggle = container.querySelector(".nav-link")!;

    fireEvent.click(toggle);
    expect(document.body.className.split(" ")).toContain("modal-open");

    fireEvent.click(toggle);
    act(() => {
      jest.runOnlyPendingTimers();
    });
    expect(document.body.className.split(" ")).not.toContain("modal-open");
  });

  it("'modal-open' class is removed from body node after modal is unmounted", () => {
    const { container, unmount } = MountedMainModal();
    const toggle = container.querySelector(".nav-link")!;
    fireEvent.click(toggle);
    unmount();
    expect(document.body.className.split(" ")).not.toContain("modal-open");
  });
});

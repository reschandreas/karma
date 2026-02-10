<<<<<<< HEAD
import { act } from "react-dom/test-utils";

import { render, screen, fireEvent } from "@testing-library/react";
=======
import { render, fireEvent, act } from "@testing-library/react";
>>>>>>> f2d4110a (upgrading to react 19)

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

<<<<<<< HEAD
const renderMainModal = () => {
=======
const MountedMainModal = () => {
>>>>>>> f2d4110a (upgrading to react 19)
  return render(
    <ThemeContext.Provider value={MockThemeContext}>
      <MainModal alertStore={alertStore} settingsStore={settingsStore} />
    </ThemeContext.Provider>,
  );
};

describe("<MainModal />", () => {
  it("only renders FontAwesomeIcon when modal is not shown", () => {
<<<<<<< HEAD
    const { container } = renderMainModal();
    expect(container.querySelectorAll("svg")).toHaveLength(1);
    expect(screen.queryByText("Configuration")).not.toBeInTheDocument();
  });

  it("renders a spinner placeholder while modal content is loading", () => {
    const { container } = renderMainModal();
    const toggle = container.querySelector(".nav-link");
    fireEvent.click(toggle!);
    expect(
      document.body.querySelector(".modal-content svg.fa-spinner"),
    ).toBeInTheDocument();
  });

  it("renders modal content if fallback is not used", () => {
    const { container } = renderMainModal();
    const toggle = container.querySelector(".nav-link");
    fireEvent.click(toggle!);
    expect(screen.getByText("Configuration")).toBeInTheDocument();
  });

  it("hides the modal when toggle() is called twice", () => {
    const { container } = renderMainModal();
    const toggle = container.querySelector(".nav-link");

    fireEvent.click(toggle!);
    act(() => {
      jest.runOnlyPendingTimers();
    });
    expect(screen.getByText("Configuration")).toBeInTheDocument();

    fireEvent.click(toggle!);
    act(() => {
      jest.runOnlyPendingTimers();
    });
    expect(screen.queryByText("Configuration")).not.toBeInTheDocument();
  });

  it("hides the modal when button.btn-close is clicked", () => {
    const { container } = renderMainModal();
    const toggle = container.querySelector(".nav-link");

    fireEvent.click(toggle!);
    expect(screen.getByText("Configuration")).toBeInTheDocument();

    const closeBtn = document.body.querySelector("button.btn-close");
    fireEvent.click(closeBtn!);
    act(() => {
      jest.runOnlyPendingTimers();
    });
    expect(screen.queryByText("Configuration")).not.toBeInTheDocument();
  });

  it("'modal-open' class is appended to body node when modal is visible", () => {
    const { container } = renderMainModal();
    const toggle = container.querySelector(".nav-link");
    fireEvent.click(toggle!);
=======
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
>>>>>>> f2d4110a (upgrading to react 19)
    expect(document.body.className.split(" ")).toContain("modal-open");
  });

  it("'modal-open' class is removed from body node after modal is hidden", () => {
<<<<<<< HEAD
    const { container } = renderMainModal();
    const toggle = container.querySelector(".nav-link");

    fireEvent.click(toggle!);
    expect(document.body.className.split(" ")).toContain("modal-open");

    fireEvent.click(toggle!);
=======
    const { container } = MountedMainModal();
    const toggle = container.querySelector(".nav-link")!;

    fireEvent.click(toggle);
    expect(document.body.className.split(" ")).toContain("modal-open");

    fireEvent.click(toggle);
>>>>>>> f2d4110a (upgrading to react 19)
    act(() => {
      jest.runOnlyPendingTimers();
    });
    expect(document.body.className.split(" ")).not.toContain("modal-open");
  });

  it("'modal-open' class is removed from body node after modal is unmounted", () => {
<<<<<<< HEAD
    const { container, unmount } = renderMainModal();
    const toggle = container.querySelector(".nav-link");
    fireEvent.click(toggle!);
=======
    const { container, unmount } = MountedMainModal();
    const toggle = container.querySelector(".nav-link")!;
    fireEvent.click(toggle);
>>>>>>> f2d4110a (upgrading to react 19)
    unmount();
    expect(document.body.className.split(" ")).not.toContain("modal-open");
  });
});

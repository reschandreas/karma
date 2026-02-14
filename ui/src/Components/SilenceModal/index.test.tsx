<<<<<<< HEAD
import { act } from "react-dom/test-utils";

import { render, fireEvent } from "@testing-library/react";
=======
import { render, fireEvent, act } from "@testing-library/react";
>>>>>>> f2d4110a (upgrading to react 19)

import fetchMock from "fetch-mock";

import { MockThemeContext } from "__fixtures__/Theme";
import { ThemeContext } from "Components/Theme";
import { AlertStore } from "Stores/AlertStore";
import { Settings } from "Stores/Settings";
import { SilenceFormStore } from "Stores/SilenceFormStore";
import SilenceModal from ".";

let alertStore: AlertStore;
let settingsStore: Settings;
let silenceFormStore: SilenceFormStore;

beforeEach(() => {
  alertStore = new AlertStore([]);
  settingsStore = new Settings(null);
  silenceFormStore = new SilenceFormStore();

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
const renderSilenceModal = () => {
=======
const MountedSilenceModal = () => {
>>>>>>> f2d4110a (upgrading to react 19)
  return render(
    <ThemeContext.Provider value={MockThemeContext}>
      <SilenceModal
        alertStore={alertStore}
        silenceFormStore={silenceFormStore}
        settingsStore={settingsStore}
      />
    </ThemeContext.Provider>,
  );
};

describe("<SilenceModal />", () => {
  it("only renders FontAwesomeIcon when modal is not shown", () => {
<<<<<<< HEAD
    const { container } = renderSilenceModal();
    expect(container.querySelectorAll("svg")).toHaveLength(1);
    expect(container.querySelector(".modal-content")).toBeNull();
  });

  it("renders a spinner placeholder while modal content is loading", () => {
    const { container } = renderSilenceModal();
    const toggle = container.querySelector(".nav-link");
    fireEvent.click(toggle!);
    expect(container.querySelectorAll("svg")).not.toHaveLength(0);
    expect(
      document.body.querySelector(".modal-content svg.fa-spinner"),
    ).toBeInTheDocument();
  });

  it("renders a spinner placeholder after modal content load but no upstreams", () => {
    const { container } = renderSilenceModal();
    const toggle = container.querySelector(".nav-link");
    fireEvent.click(toggle!);
    expect(container.querySelectorAll("svg")).not.toHaveLength(0);
    expect(
      document.body.querySelector(".modal-content svg.fa-spinner"),
    ).toBeInTheDocument();
=======
    const { container } = MountedSilenceModal();
    expect(container.querySelectorAll("svg")).toHaveLength(1);
    expect(document.body.querySelectorAll(".modal-content")).toHaveLength(0);
  });

  it("renders a spinner placeholder while modal content is loading", () => {
    const { container } = MountedSilenceModal();
    const toggle = container.querySelector(".nav-link") as HTMLElement;
    fireEvent.click(toggle);
    expect(container.querySelectorAll("svg")).not.toHaveLength(0);
    expect(document.body.querySelectorAll(".modal-content svg.fa-spinner")).toHaveLength(1);
  });

  it("renders a spinner placeholder after modal content load but no upstreams", () => {
    const { container } = MountedSilenceModal();
    const toggle = container.querySelector(".nav-link") as HTMLElement;
    fireEvent.click(toggle);
    expect(container.querySelectorAll("svg")).not.toHaveLength(0);
    expect(document.body.querySelectorAll(".modal-content svg.fa-spinner")).toHaveLength(1);
>>>>>>> f2d4110a (upgrading to react 19)
  });

  it("renders modal content if fallback is not used", () => {
    alertStore.data.setUpstreams({
      counters: { total: 1, healthy: 0, failed: 0 },
      instances: [
        {
          name: "dev",
          cluster: "dev",
          clusterMembers: ["dev"],
          uri: "http://localhost:9093",
          publicURI: "http://localhost:9093",
          error: "",
          version: "0.24.0",
          headers: {},
          corsCredentials: "same-origin",
          readonly: false,
        },
      ],
      clusters: { dev: ["dev"] },
    });
<<<<<<< HEAD
    const { container } = renderSilenceModal();
    const toggle = container.querySelector(".nav-link");
    fireEvent.click(toggle!);
    expect(container.querySelectorAll("svg")).not.toHaveLength(0);
    expect(container.querySelector(".modal-content svg.fa-spinner")).toBeNull();
  });

  it("hides the modal when toggle() is called twice", () => {
    const { container } = renderSilenceModal();
    const toggle = container.querySelector(".nav-link");

    fireEvent.click(toggle!);
    act(() => {
      jest.runOnlyPendingTimers();
    });
    expect(document.body.querySelector(".modal-content")).toBeInTheDocument();

    fireEvent.click(toggle!);
    act(() => {
      jest.runOnlyPendingTimers();
    });
    expect(document.body.querySelector(".modal-content")).toBeNull();
  });

  it("hides the modal when hide() is called", () => {
    const { container } = renderSilenceModal();
    const toggle = container.querySelector(".nav-link");

    fireEvent.click(toggle!);
    act(() => {
      jest.runOnlyPendingTimers();
    });
    expect(document.body.querySelector(".modal-content")).toBeInTheDocument();
=======
    const { container } = MountedSilenceModal();
    const toggle = container.querySelector(".nav-link") as HTMLElement;
    fireEvent.click(toggle);
    expect(container.querySelectorAll("svg")).not.toHaveLength(0);
    expect(document.body.querySelectorAll(".modal-content svg.fa-spinner")).toHaveLength(0);
  });

  it("hides the modal when toggle() is called twice", () => {
    const { container } = MountedSilenceModal();
    const toggle = container.querySelector(".nav-link") as HTMLElement;

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

  it("hides the modal when hide() is called", () => {
    const { container } = MountedSilenceModal();
    const toggle = container.querySelector(".nav-link") as HTMLElement;

    fireEvent.click(toggle);
    act(() => {
      jest.runOnlyPendingTimers();
    });
    expect(document.body.querySelectorAll(".modal-content")).toHaveLength(1);
>>>>>>> f2d4110a (upgrading to react 19)

    act(() => {
      silenceFormStore.toggle.hide();
    });
    act(() => {
      jest.runOnlyPendingTimers();
    });
<<<<<<< HEAD
    expect(document.body.querySelector(".modal-content")).toBeNull();
  });

  it("resets progress on hide", () => {
    const { container } = renderSilenceModal();
    const toggle = container.querySelector(".nav-link");
    fireEvent.click(toggle!);
=======
    expect(document.body.querySelectorAll(".modal-content")).toHaveLength(0);
  });

  it("resets progress on hide", () => {
    const { container } = MountedSilenceModal();
    const toggle = container.querySelector(".nav-link") as HTMLElement;
    fireEvent.click(toggle);
>>>>>>> f2d4110a (upgrading to react 19)

    // mark form as dirty, resetProgress() should change this value to false
    silenceFormStore.data.setWasValidated(true);
    // disable autofill, closing modal should re-enable it
    silenceFormStore.data.setAutofillMatchers(false);

    // click to hide
<<<<<<< HEAD
    fireEvent.click(toggle!);
=======
    fireEvent.click(toggle);
>>>>>>> f2d4110a (upgrading to react 19)
    // wait for animation to finish
    act(() => {
      jest.runOnlyPendingTimers();
    });
    // form should be reset
    expect(silenceFormStore.data.currentStage).toBe("form");
    expect(silenceFormStore.data.wasValidated).toBe(false);
    expect(silenceFormStore.data.autofillMatchers).toBe(true);
  });

  it("'modal-open' class is appended to body node when modal is visible", () => {
<<<<<<< HEAD
    const { container } = renderSilenceModal();
    const toggle = container.querySelector(".nav-link");
    fireEvent.click(toggle!);
=======
    const { container } = MountedSilenceModal();
    const toggle = container.querySelector(".nav-link") as HTMLElement;
    fireEvent.click(toggle);
>>>>>>> f2d4110a (upgrading to react 19)
    expect(document.body.className.split(" ")).toContain("modal-open");
  });

  it("'modal-open' class is removed from body node after modal is hidden", () => {
<<<<<<< HEAD
    const { container } = renderSilenceModal();
    const toggle = container.querySelector(".nav-link");

    fireEvent.click(toggle!);
    expect(document.body.className.split(" ")).toContain("modal-open");

    fireEvent.click(toggle!);
=======
    const { container } = MountedSilenceModal();
    const toggle = container.querySelector(".nav-link") as HTMLElement;

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
    const { container, unmount } = renderSilenceModal();
    const toggle = container.querySelector(".nav-link");
    fireEvent.click(toggle!);
=======
    const { container, unmount } = MountedSilenceModal();
    const toggle = container.querySelector(".nav-link") as HTMLElement;
    fireEvent.click(toggle);
>>>>>>> f2d4110a (upgrading to react 19)
    unmount();
    expect(document.body.className.split(" ")).not.toContain("modal-open");
  });
});

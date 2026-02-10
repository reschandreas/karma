<<<<<<< HEAD
import { act } from "react-dom/test-utils";

import { render, screen, fireEvent, waitFor } from "@testing-library/react";
=======
import { render, fireEvent, act } from "@testing-library/react";
>>>>>>> f2d4110a (upgrading to react 19)

import { MockSilence } from "__fixtures__/Alerts";
import { PressKey } from "__fixtures__/PressKey";
import { useFetchDelete } from "Hooks/useFetchDelete";
import type { APISilenceT, APIAlertsResponseUpstreamsT } from "Models/APITypes";
import { AlertStore } from "Stores/AlertStore";
import { SilenceFormStore } from "Stores/SilenceFormStore";
import { DeleteSilence, DeleteSilenceModalContent } from "./DeleteSilence";

jest.mock("Hooks/useFetchDelete");

let alertStore: AlertStore;
let silenceFormStore: SilenceFormStore;
let cluster: string;
let silence: APISilenceT;

const generateUpstreams = (): APIAlertsResponseUpstreamsT => ({
  counters: { total: 1, healthy: 1, failed: 0 },
  instances: [
    {
      name: "am1",
      cluster: "am",
      uri: "http://localhost:9093",
      publicURI: "http://localhost:9093",
      readonly: false,
      error: "",
      version: "0.24.0",
      headers: {},
      corsCredentials: "include",
      clusterMembers: ["am1"],
    },
  ],
  clusters: { am: ["am1"] },
});

beforeEach(() => {
  jest.useFakeTimers();
  jest.setSystemTime(new Date(Date.UTC(2000, 0, 1, 0, 30, 0)));

  alertStore = new AlertStore([]);
  silenceFormStore = new SilenceFormStore();
  cluster = "am";
  silence = MockSilence();

  alertStore.data.setUpstreams(generateUpstreams());
});

afterEach(() => {
  (useFetchDelete as jest.MockedFunction<typeof useFetchDelete>).mockClear();

  jest.restoreAllMocks();
  jest.useRealTimers();
  document.body.className = "";
});

const MockOnHide = jest.fn();

<<<<<<< HEAD
const renderDeleteSilenceModalContent = () => {
=======
const MountedDeleteSilenceModalContent = () => {
>>>>>>> f2d4110a (upgrading to react 19)
  return render(
    <DeleteSilenceModalContent
      alertStore={alertStore}
      silenceFormStore={silenceFormStore}
      cluster={cluster}
      silence={silence}
      onHide={MockOnHide}
    />,
  );
};

const renderDeleteSilence = () => {
  return render(
    <DeleteSilence
      alertStore={alertStore}
      silenceFormStore={silenceFormStore}
      cluster={cluster}
      silence={silence}
    />,
  );
};

describe("<DeleteSilence />", () => {
  it("label is 'Delete' by default", () => {
<<<<<<< HEAD
    renderDeleteSilence();
    expect(screen.getByText("Delete")).toBeInTheDocument();
  });

  it("opens modal on click", () => {
    const { container } = renderDeleteSilence();
    const button = container.querySelector("button.btn-danger");
    fireEvent.click(button!);
    expect(document.body.querySelector(".modal-body")).toBeInTheDocument();
  });

  it("closes modal on close button click", async () => {
    const { container } = renderDeleteSilence();
    const button = container.querySelector("button.btn-danger");
    fireEvent.click(button!);
    expect(document.body.querySelector(".modal-body")).toBeInTheDocument();

    const closeBtn = document.body.querySelector("button.btn-close");
    fireEvent.click(closeBtn!);
    act(() => {
      jest.runOnlyPendingTimers();
    });
    await waitFor(() => {
      expect(
        document.body.querySelector(".modal-body"),
      ).not.toBeInTheDocument();
    });
  });

  it("closes modal on esc button press", async () => {
    const { container } = renderDeleteSilence();
    const button = container.querySelector("button.btn-danger");
    fireEvent.click(button!);
    expect(document.body.querySelector(".modal-body")).toBeInTheDocument();
=======
    const { container } = render(
      <DeleteSilence
        alertStore={alertStore}
        silenceFormStore={silenceFormStore}
        cluster={cluster}
        silence={silence}
      />,
    );
    expect(container.textContent).toBe("Delete");
  });

  it("opens modal on click", () => {
    const { container } = render(
      <DeleteSilence
        alertStore={alertStore}
        silenceFormStore={silenceFormStore}
        cluster={cluster}
        silence={silence}
      />,
    );
    fireEvent.click(container.querySelector("button.btn-danger")!);
    expect(document.body.querySelectorAll(".modal-body")).toHaveLength(1);
  });

  it("closes modal on close button click", () => {
    const { container } = render(
      <DeleteSilence
        alertStore={alertStore}
        silenceFormStore={silenceFormStore}
        cluster={cluster}
        silence={silence}
      />,
    );
    fireEvent.click(container.querySelector("button.btn-danger")!);
    expect(document.body.querySelectorAll(".modal-body")).toHaveLength(1);

    fireEvent.click(document.body.querySelector("button.btn-close")!);
    act(() => {
      jest.runOnlyPendingTimers();
    });
    expect(document.body.querySelectorAll(".modal-body")).toHaveLength(0);
  });

  it("closes modal on esc button press", () => {
    const { container } = render(
      <DeleteSilence
        alertStore={alertStore}
        silenceFormStore={silenceFormStore}
        cluster={cluster}
        silence={silence}
      />,
    );
    fireEvent.click(container.querySelector("button.btn-danger")!);
    expect(document.body.querySelectorAll(".modal-body")).toHaveLength(1);
>>>>>>> f2d4110a (upgrading to react 19)

    PressKey("Escape", 27);
    act(() => {
      jest.runOnlyPendingTimers();
    });
<<<<<<< HEAD
    await waitFor(() => {
      expect(container.querySelector(".modal-body")).not.toBeInTheDocument();
    });
=======
    expect(document.body.querySelectorAll(".modal-body")).toHaveLength(0);
>>>>>>> f2d4110a (upgrading to react 19)
  });

  it("button is disabled when all alertmanager instances are read-only", () => {
    const upstreams = generateUpstreams();
    upstreams.instances[0].readonly = true;
    alertStore.data.setUpstreams(upstreams);

<<<<<<< HEAD
    const { container } = renderDeleteSilence();
    const button = container.querySelector("button");
    expect(button?.disabled).toBe(true);

    fireEvent.click(button!);
    expect(container.querySelector(".modal-body")).not.toBeInTheDocument();
=======
    const { container } = render(
      <DeleteSilence
        alertStore={alertStore}
        silenceFormStore={silenceFormStore}
        cluster={cluster}
        silence={silence}
      />,
    );
    expect(
      (container.querySelector("button") as HTMLButtonElement).disabled,
    ).toBe(true);

    fireEvent.click(container.querySelectorAll("button")[0]);
    expect(document.body.querySelectorAll(".modal-body")).toHaveLength(0);
>>>>>>> f2d4110a (upgrading to react 19)
  });
});

describe("<DeleteSilenceModalContent />", () => {
  it("blurs silence form on mount", () => {
    expect(silenceFormStore.toggle.blurred).toBe(false);
    renderDeleteSilenceModalContent();
    expect(silenceFormStore.toggle.blurred).toBe(true);
  });

  it("unblurs silence form on unmount", () => {
<<<<<<< HEAD
    const { unmount } = renderDeleteSilenceModalContent();
=======
    const { unmount } = MountedDeleteSilenceModalContent();
>>>>>>> f2d4110a (upgrading to react 19)
    expect(silenceFormStore.toggle.blurred).toBe(true);
    act(() => {
      unmount();
    });
    expect(silenceFormStore.toggle.blurred).toBe(false);
  });

  it("sends a DELETE request after clicking 'Confirm' button", () => {
    (
      useFetchDelete as jest.MockedFunction<typeof useFetchDelete>
    ).mockReturnValue({ response: "success", error: null, isDeleting: false });

<<<<<<< HEAD
    const { container } = renderDeleteSilenceModalContent();
    const button = container.querySelector(".btn-danger");
    fireEvent.click(button!);
=======
    const { container } = MountedDeleteSilenceModalContent();
    fireEvent.click(container.querySelector(".btn-danger")!);
>>>>>>> f2d4110a (upgrading to react 19)

    expect(
      (useFetchDelete as jest.MockedFunction<typeof useFetchDelete>).mock
        .calls[0][0],
    ).toBe(
      "http://localhost:9093/api/v2/silence/04d37636-2350-4878-b382-e0b50353230f",
    );
    expect(
      (useFetchDelete as jest.MockedFunction<typeof useFetchDelete>).mock
        .calls[0][1],
    ).toMatchObject({
      headers: {},
      credentials: "include",
    });
  });

  it("sends headers from alertmanager config", () => {
    (
      useFetchDelete as jest.MockedFunction<typeof useFetchDelete>
    ).mockReturnValue({ response: "success", error: null, isDeleting: false });

    const upstreams = generateUpstreams();
    upstreams.instances[0].headers = {
      Authorization: "Basic ***",
    };
    alertStore.data.setUpstreams(upstreams);

<<<<<<< HEAD
    const { container } = renderDeleteSilenceModalContent();
    const button = container.querySelector(".btn-danger");
    fireEvent.click(button!);
=======
    const { container } = MountedDeleteSilenceModalContent();
    fireEvent.click(container.querySelector(".btn-danger")!);
>>>>>>> f2d4110a (upgrading to react 19)

    expect(
      (useFetchDelete as jest.MockedFunction<typeof useFetchDelete>).mock
        .calls[0][0],
    ).toBe(
      "http://localhost:9093/api/v2/silence/04d37636-2350-4878-b382-e0b50353230f",
    );
    expect(
      (useFetchDelete as jest.MockedFunction<typeof useFetchDelete>).mock
        .calls[0][1],
    ).toMatchObject({
      credentials: "include",
      headers: { Authorization: "Basic ***" },
    });
  });

  it("uses CORS credentials from alertmanager config", () => {
    (
      useFetchDelete as jest.MockedFunction<typeof useFetchDelete>
    ).mockReturnValue({ response: "success", error: null, isDeleting: false });

    const upstreams = generateUpstreams();
    upstreams.instances[0].corsCredentials = "omit";
    alertStore.data.setUpstreams(upstreams);

<<<<<<< HEAD
    const { container } = renderDeleteSilenceModalContent();
    const button = container.querySelector(".btn-danger");
    fireEvent.click(button!);
=======
    const { container } = MountedDeleteSilenceModalContent();
    fireEvent.click(container.querySelector(".btn-danger")!);
>>>>>>> f2d4110a (upgrading to react 19)

    expect(
      (useFetchDelete as jest.MockedFunction<typeof useFetchDelete>).mock
        .calls[0][0],
    ).toBe(
      "http://localhost:9093/api/v2/silence/04d37636-2350-4878-b382-e0b50353230f",
    );
    expect(
      (useFetchDelete as jest.MockedFunction<typeof useFetchDelete>).mock
        .calls[0][1],
    ).toMatchObject({
      credentials: "omit",
      headers: {},
    });
  });

  it("renders ProgressMessage while awaiting response status", () => {
    (
      useFetchDelete as jest.MockedFunction<typeof useFetchDelete>
    ).mockReturnValue({ response: null, error: null, isDeleting: true });

<<<<<<< HEAD
    const { container } = renderDeleteSilenceModalContent();
    const button = container.querySelector(".btn-danger");
    fireEvent.click(button!);

    expect(container.querySelector(".fa-circle-notch")).toBeInTheDocument();
=======
    const { container } = MountedDeleteSilenceModalContent();
    fireEvent.click(container.querySelector(".btn-danger")!);

    expect(container.querySelectorAll("svg.fa-spinner")).toHaveLength(1);
>>>>>>> f2d4110a (upgrading to react 19)
  });

  it("renders SuccessMessage on successful response status", () => {
    (
      useFetchDelete as jest.MockedFunction<typeof useFetchDelete>
    ).mockReturnValue({ response: "success", error: null, isDeleting: false });

<<<<<<< HEAD
    const { container } = renderDeleteSilenceModalContent();
    const button = container.querySelector(".btn-danger");
    fireEvent.click(button!);

    expect(screen.getByText(/Silence deleted/)).toBeInTheDocument();
=======
    const { container } = MountedDeleteSilenceModalContent();
    fireEvent.click(container.querySelector(".btn-danger")!);

    expect(
      container.querySelectorAll("svg.fa-circle-check"),
    ).toHaveLength(1);
>>>>>>> f2d4110a (upgrading to react 19)
  });

  it("renders ErrorMessage on failed delete fetch request", () => {
    (
      useFetchDelete as jest.MockedFunction<typeof useFetchDelete>
    ).mockReturnValue({
      response: null,
      error: "failed",
      isDeleting: false,
    });

<<<<<<< HEAD
    const { container } = renderDeleteSilenceModalContent();
    const button = container.querySelector(".btn-danger");
    fireEvent.click(button!);

    expect(screen.getByText("failed")).toBeInTheDocument();
=======
    const { container } = MountedDeleteSilenceModalContent();
    fireEvent.click(container.querySelector(".btn-danger")!);

    expect(
      container.querySelectorAll("svg.fa-circle-exclamation"),
    ).toHaveLength(1);
>>>>>>> f2d4110a (upgrading to react 19)
  });

  it("'Retry' button is present after failed delete", () => {
    (
      useFetchDelete as jest.MockedFunction<typeof useFetchDelete>
    ).mockReturnValue({
      response: null,
      error: "fake error",
      isDeleting: false,
    });

<<<<<<< HEAD
    const { container } = renderDeleteSilenceModalContent();
    const button = container.querySelector(".btn-danger");
    fireEvent.click(button!);

    expect(screen.getByText("Retry")).toBeInTheDocument();
=======
    const { container } = MountedDeleteSilenceModalContent();
    fireEvent.click(container.querySelector(".btn-danger")!);

    expect(container.querySelector(".btn-danger")!.textContent).toBe("Retry");
>>>>>>> f2d4110a (upgrading to react 19)
  });

  it("'Retry' button is not present after successful delete", () => {
    (
      useFetchDelete as jest.MockedFunction<typeof useFetchDelete>
    ).mockReturnValue({ response: "success", error: null, isDeleting: false });

<<<<<<< HEAD
    const { container } = renderDeleteSilenceModalContent();
    const button = container.querySelector(".btn-danger");
    fireEvent.click(button!);

    expect(screen.queryByText("Retry")).not.toBeInTheDocument();
=======
    const { container } = MountedDeleteSilenceModalContent();
    fireEvent.click(container.querySelector(".btn-danger")!);

    expect(container.querySelectorAll(".btn-danger")).toHaveLength(0);
>>>>>>> f2d4110a (upgrading to react 19)
  });

  it("Clicking 'Retry' button triggers new delete", () => {
    (
      useFetchDelete as jest.MockedFunction<typeof useFetchDelete>
    ).mockReturnValue({
      response: null,
      error: "fake error",
      isDeleting: false,
    });

<<<<<<< HEAD
    const { container } = renderDeleteSilenceModalContent();
    const button = container.querySelector(".btn-danger");
    fireEvent.click(button!);
    expect(useFetchDelete).toHaveBeenCalledTimes(1);

    jest.setSystemTime(new Date(Date.UTC(2000, 0, 1, 0, 30, 1)));
    const retryBtn = screen.getByText("Retry");
    fireEvent.click(retryBtn);
=======
    const { container } = MountedDeleteSilenceModalContent();
    fireEvent.click(container.querySelector(".btn-danger")!);
    expect(useFetchDelete).toHaveBeenCalledTimes(1);

    jest.setSystemTime(new Date(Date.UTC(2000, 0, 1, 0, 30, 1)));
    fireEvent.click(container.querySelector(".btn-danger")!);
>>>>>>> f2d4110a (upgrading to react 19)
    expect(useFetchDelete).toHaveBeenCalledTimes(2);
  });
});

import { render, fireEvent } from "@testing-library/react";

import copy from "copy-to-clipboard";

import { MockSilence } from "__fixtures__/Alerts";
import type { APIAlertsResponseUpstreamsT, APISilenceT } from "Models/APITypes";
import { AlertStore } from "Stores/AlertStore";
import { SilenceFormStore } from "Stores/SilenceFormStore";
import { SilenceDetails } from "./SilenceDetails";

let alertStore: AlertStore;
let silenceFormStore: SilenceFormStore;
let cluster: string;
let silence: APISilenceT;

const MockEditSilence = jest.fn();

const generateUpstreams = (): APIAlertsResponseUpstreamsT => ({
  counters: { total: 1, healthy: 1, failed: 0 },
  instances: [
    {
      name: "am1",
      cluster: "am",
      clusterMembers: ["am"],
      uri: "http://localhost:9093",
      publicURI: "http://example.com",
      readonly: false,
      error: "",
      version: "0.24.0",
      headers: {},
      corsCredentials: "include",
    },
  ],
  clusters: { am: ["am1"] },
});

beforeEach(() => {
  alertStore = new AlertStore([]);
  silenceFormStore = new SilenceFormStore();
  cluster = "am";
  silence = MockSilence();

  alertStore.data.setUpstreams(generateUpstreams());

  jest.restoreAllMocks();
  jest.useFakeTimers();
});

afterEach(() => {
  jest.restoreAllMocks();
  jest.useRealTimers();
});

<<<<<<< HEAD
const renderSilenceDetails = () => {
=======
const MountedSilenceDetails = () => {
>>>>>>> f2d4110a (upgrading to react 19)
  return render(
    <SilenceDetails
      alertStore={alertStore}
      silenceFormStore={silenceFormStore}
      silence={silence}
      cluster={cluster}
      onEditSilence={MockEditSilence}
    />,
  );
};

describe("<SilenceDetails />", () => {
  it("unexpired silence endsAt label doesn't use 'danger' class", () => {
    jest.setSystemTime(new Date(Date.UTC(2000, 0, 1, 0, 30, 0)));
<<<<<<< HEAD
    const { container } = renderSilenceDetails();
    const badges = container.querySelectorAll("span.badge");
    expect(badges[1]?.outerHTML).not.toMatch(/text-danger/);
=======
    const { container } = MountedSilenceDetails();
    const endsAt = container.querySelectorAll("span.badge")[1];
    expect(endsAt.innerHTML).not.toMatch(/text-danger/);
>>>>>>> f2d4110a (upgrading to react 19)
  });

  it("expired silence endsAt label uses 'danger' class", () => {
    jest.setSystemTime(new Date(Date.UTC(2000, 0, 1, 23, 0, 0)));
<<<<<<< HEAD
    const { container } = renderSilenceDetails();
    const badges = container.querySelectorAll("span.badge");
    expect(badges[1]?.outerHTML).toMatch(/text-danger/);
  });

  it("id links to Alertmanager silence view via alertmanager.publicURI", () => {
    const { container } = renderSilenceDetails();
    const link = container.querySelector("a");
    expect(link?.href).toBe(
=======
    const { container } = MountedSilenceDetails();
    const endsAt = container.querySelectorAll("span.badge")[1];
    expect(endsAt.className).toMatch(/text-danger/);
  });

  it("id links to Alertmanager silence view via alertmanager.publicURI", () => {
    const { container } = MountedSilenceDetails();
    const link = container.querySelector("a")!;
    expect(link.href).toBe(
>>>>>>> f2d4110a (upgrading to react 19)
      "http://example.com/#/silences/04d37636-2350-4878-b382-e0b50353230f",
    );
  });

  it("clicking on the copy button copies silence ID to the clipboard", () => {
<<<<<<< HEAD
    const { container } = renderSilenceDetails();
    const button = container.querySelector("span.badge.bg-secondary");
    fireEvent.click(button!);
=======
    const { container } = MountedSilenceDetails();
    const button = container.querySelector("span.badge.bg-secondary")!;
    fireEvent.click(button);
>>>>>>> f2d4110a (upgrading to react 19)
    expect(copy).toHaveBeenCalledTimes(1);
    expect(copy).toHaveBeenCalledWith(silence.id);
  });

  it("Edit silence button is disabled when all alertmanager instances are read-only", () => {
    const upstreams = generateUpstreams();
    upstreams.instances[0].readonly = true;
    alertStore.data.setUpstreams(upstreams);
<<<<<<< HEAD
    const { container } = renderSilenceDetails();
    const button = container.querySelector("button");
    expect(button?.disabled).toBe(true);

    fireEvent.click(button!);
    expect(container.querySelector(".modal-body")).not.toBeInTheDocument();
=======
    const { container } = MountedSilenceDetails();
    expect(
      (container.querySelector("button") as HTMLButtonElement).disabled,
    ).toBe(true);

    fireEvent.click(container.querySelectorAll("button")[0]);
    expect(document.body.querySelectorAll(".modal-body")).toHaveLength(0);
>>>>>>> f2d4110a (upgrading to react 19)
  });
});

import { render, fireEvent } from "@testing-library/react";

import { MockSilence } from "__fixtures__/Alerts";
import type { APISilenceT } from "Models/APITypes";
import { AlertStore } from "Stores/AlertStore";
import { SilenceComment } from "./SilenceComment";

let silence: APISilenceT;
let alertStore: AlertStore;

beforeEach(() => {
  jest.useFakeTimers();
  jest.setSystemTime(new Date(Date.UTC(2000, 0, 1, 0, 30, 0)));

  silence = MockSilence();
  alertStore = new AlertStore([]);
});

afterEach(() => {
  jest.restoreAllMocks();
  jest.useRealTimers();
});

const CollapseMock = jest.fn();

const MountedSilenceComment = (collapsed: boolean, cluster?: string) => {
  return render(
    <SilenceComment
      alertStore={alertStore}
      alertCount={123}
      cluster={cluster || "default"}
      silence={silence}
      collapsed={collapsed}
      collapseToggle={CollapseMock}
    />,
  );
};

const MockMultipleClusters = () => {
  alertStore.data.setUpstreams({
    counters: { total: 2, healthy: 2, failed: 0 },
    clusters: { ha: ["ha1", "ha2"], single: ["single"] },
    instances: [
      {
        name: "ha1",
        uri: "http://ha1.example.com",
        publicURI: "http://ha1.example.com",
        readonly: false,
        headers: {},
        corsCredentials: "include",
        error: "",
        version: "0.24.0",
        cluster: "ha",
        clusterMembers: ["ha1", "ha2"],
      },
      {
        name: "ha2",
        uri: "http://ha2.example.com",
        publicURI: "http://ha2.example.com",
        readonly: false,
        headers: {},
        corsCredentials: "include",
        error: "",
        version: "0.24.0",
        cluster: "ha",
        clusterMembers: ["ha1", "ha2"],
      },
      {
        name: "single",
        uri: "http://single.example.com",
        publicURI: "http://single.example.com",
        readonly: false,
        headers: {},
        corsCredentials: "include",
        error: "",
        version: "0.24.0",
        cluster: "single",
        clusterMembers: ["single"],
      },
    ],
  });
};

describe("<SilenceComment />", () => {
  it("Matches snapshot when collapsed", () => {
    const { asFragment } = MountedSilenceComment(true);
    expect(asFragment()).toMatchSnapshot();
  });

  it("Matches snapshot when expanded", () => {
    const { asFragment } = MountedSilenceComment(false);
    expect(asFragment()).toMatchSnapshot();
  });

  it("Matches snapshot when collapsed and multiple clusters are present", () => {
    MockMultipleClusters();
    const { asFragment } = MountedSilenceComment(true, "ha");
    expect(asFragment()).toMatchSnapshot();
  });

  it("Matches snapshot when expanded and multiple clusters are present", () => {
    MockMultipleClusters();
    const { asFragment } = MountedSilenceComment(false, "ha");
    expect(asFragment()).toMatchSnapshot();
  });

  it("Renders a JIRA link if present", () => {
    silence.ticketURL = "http://localhost/1234";
    silence.ticketID = "1234";
    silence.comment = "Ticket id 1234 and also 1234";
    const { container } = MountedSilenceComment(true);
    expect(
      container.querySelectorAll("a[href='http://localhost/1234']"),
    ).toHaveLength(2);
  });

  it("Renders a JIRA link if present and comment is expanded", () => {
    silence.ticketURL = "http://localhost/1234";
    silence.ticketID = "1234";
    silence.comment = "Ticket id 1234";
    const { container } = MountedSilenceComment(false);
    expect(
      container.querySelectorAll("a[href='http://localhost/1234']"),
    ).toHaveLength(1);
  });

  it("Correctly renders comments with spaces", () => {
    silence.ticketURL = "http://localhost/1234";
    silence.ticketID = "1234";
    silence.comment = "Ticket id 1234 should be linked here";
    const { container } = MountedSilenceComment(false);
    expect(container.innerHTML).toContain(
      '<div class="components-managed-silence-comment "> Ticket id <a href="http://localhost/1234" target="_blank" rel="noopener noreferrer">1234</a> should be linked here</div>',
    );
  });

  it("Correctly renders comments starting with a link", () => {
    silence.ticketURL = "http://localhost/1234";
    silence.ticketID = "1234";
    silence.comment = "1234 is the ticket id.";
    const { container } = MountedSilenceComment(false);
    expect(container.innerHTML).toContain(
      '<div class="components-managed-silence-comment "><a href="http://localhost/1234" target="_blank" rel="noopener noreferrer">1234</a> is the ticket id.</div>',
    );
  });

  it("collapseToggle is called when collapse icon is clicked", () => {
    const { container } = MountedSilenceComment(true);
    const collapse = container.querySelector("svg.fa-chevron-down")!;
    fireEvent.click(collapse);
    expect(CollapseMock).toHaveBeenCalled();
  });

  it("Doesn't render cluster badges when collapsed and only a single cluster is present", () => {
    const { container } = MountedSilenceComment(true);
    expect(
      container.querySelectorAll("span.badge.bg-secondary"),
    ).toHaveLength(0);
  });

  it("Doesn't render cluster badges when expanded and only a single cluster is present", () => {
    const { container } = MountedSilenceComment(false);
    expect(
      container.querySelectorAll("span.badge.bg-secondary"),
    ).toHaveLength(0);
  });

  it("Renders cluster badge when collapsed and multiple clusters are present", () => {
    MockMultipleClusters();
    const { container } = MountedSilenceComment(true, "single");
    const ams = container.querySelectorAll("span.badge.bg-secondary");
    expect(ams).toHaveLength(1);
    expect(ams[0].innerHTML).toMatch(/single/);
  });

  it("Doesn't render cluster badge when expanded and multiple clusters are present", () => {
    MockMultipleClusters();
    const { container } = MountedSilenceComment(false, "single");
    expect(
      container.querySelectorAll("span.badge.bg-secondary"),
    ).toHaveLength(0);
  });
});

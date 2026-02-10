import { act, render, fireEvent } from "@testing-library/react";

import copy from "copy-to-clipboard";

import { MockAlertGroup, MockAlert } from "__fixtures__/Alerts";
import type {
  APIAlertGroupT,
  APIAlertT,
  APIAlertsResponseUpstreamsT,
  APIGridT,
} from "Models/APITypes";
import { AlertStore } from "Stores/AlertStore";
import { SilenceFormStore } from "Stores/SilenceFormStore";
import { AlertMenu, MenuContent } from "./AlertMenu";
import { alertToJSON } from "Common/Alert";

let alertStore: AlertStore;
let silenceFormStore: SilenceFormStore;
let alert: APIAlertT;
let group: APIAlertGroupT;
let grid: APIGridT;

let MockAfterClick: () => void;
let MockSetIsMenuOpen: () => void;

const generateUpstreams = (): APIAlertsResponseUpstreamsT => ({
  counters: { total: 1, healthy: 1, failed: 0 },
  clusters: { default: ["am1"], ro: ["ro"], am2: ["am2"] },
  instances: [
    {
      name: "am1",
      uri: "http://localhost:8080",
      publicURI: "http://example.com",
      readonly: false,
      headers: {},
      corsCredentials: "include",
      error: "",
      version: "0.24.0",
      cluster: "default",
      clusterMembers: ["am1"],
    },
    {
      name: "ro",
      uri: "http://localhost:8080",
      publicURI: "http://example.com",
      readonly: true,
      headers: {},
      corsCredentials: "include",
      error: "",
      version: "0.24.0",
      cluster: "ro",
      clusterMembers: ["ro"],
    },
    {
      name: "am2",
      uri: "http://localhost:8080",
      publicURI: "http://example.com",
      readonly: false,
      headers: {},
      corsCredentials: "include",
      error: "",
      version: "0.24.0",
      cluster: "am2",
      clusterMembers: ["am2"],
    },
  ],
});

beforeEach(() => {
  jest.useFakeTimers();

  alertStore = new AlertStore([]);
  silenceFormStore = new SilenceFormStore();

  MockAfterClick = jest.fn();
  MockSetIsMenuOpen = jest.fn();

  alert = MockAlert([], [{ name: "foo", value: "bar Alert" }], "active");
  group = MockAlertGroup(
    [{ name: "alertname", value: "Fake Alert" }],
    [alert],
    [],
    [],
    {},
  );
  grid = {
    labelName: "foo",
    labelValue: "bar",
    alertGroups: [],
    totalGroups: 0,
    stateCount: {
      active: 0,
      suppressed: 0,
      unprocessed: 0,
    },
  };

  alertStore.data.setUpstreams(generateUpstreams());
});

const MountedAlertMenu = (group: APIAlertGroupT) => {
  return render(
    <AlertMenu
      grid={grid}
      group={group}
      alert={alert}
      alertStore={alertStore}
      silenceFormStore={silenceFormStore}
      setIsMenuOpen={MockSetIsMenuOpen}
    />,
  );
};

describe("<AlertMenu />", () => {
  it("menu content is hidden by default", () => {
    const { container } = MountedAlertMenu(group);
    expect(container.querySelectorAll("div.dropdown-menu")).toHaveLength(0);
    expect(MockSetIsMenuOpen).not.toHaveBeenCalled();
  });

  it("clicking toggle renders menu content", async () => {
    const promise = Promise.resolve();
    const { container } = MountedAlertMenu(group);
    const toggle = container.querySelector("span.cursor-pointer")!;
    fireEvent.click(toggle);
    expect(MockSetIsMenuOpen).toHaveBeenCalledTimes(1);
    expect(container.querySelectorAll("div.dropdown-menu")).toHaveLength(1);
    await act(() => promise);
  });

  it("clicking toggle twice hides menu content", async () => {
    const promise = Promise.resolve();
    const { container } = MountedAlertMenu(group);
    const toggle = container.querySelector("span.cursor-pointer")!;

    fireEvent.click(toggle);
    act(() => {
      jest.runOnlyPendingTimers();
    });
    expect(MockSetIsMenuOpen).toHaveBeenCalledTimes(1);
    expect(container.querySelectorAll("div.dropdown-menu")).toHaveLength(1);

    fireEvent.click(toggle);
    act(() => {
      jest.runOnlyPendingTimers();
    });
    expect(MockSetIsMenuOpen).toHaveBeenCalledTimes(2);
    expect(container.querySelectorAll("div.dropdown-menu")).toHaveLength(0);
    await act(() => promise);
  });

  it("clicking menu item hides menu content", async () => {
    const promise = Promise.resolve();
    const { container } = MountedAlertMenu(group);
    const toggle = container.querySelector("span.cursor-pointer")!;

    fireEvent.click(toggle);
    expect(MockSetIsMenuOpen).toHaveBeenCalledTimes(1);
    expect(container.querySelectorAll("div.dropdown-menu")).toHaveLength(1);

    const menuItems = container.querySelectorAll("a.dropdown-item");
    fireEvent.click(menuItems[0]);
    act(() => {
      jest.runOnlyPendingTimers();
    });
    expect(MockSetIsMenuOpen).toHaveBeenCalledTimes(2);
    expect(container.querySelectorAll("div.dropdown-menu")).toHaveLength(0);
    await act(() => promise);
  });
});

const MountedMenuContent = (group: APIAlertGroupT) => {
  return render(
    <MenuContent
      x={0}
      y={0}
      floating={null}
      strategy={"absolute"}
      group={group}
      alert={alert}
      afterClick={MockAfterClick}
      alertStore={alertStore}
      silenceFormStore={silenceFormStore}
    />,
  );
};

describe("<MenuContent />", () => {
  it("clicking on 'Silence' icon opens the silence form modal", () => {
    group.alertmanagerCount = { am1: 1, ro: 1 };
    const { container } = MountedMenuContent(group);
    const buttons = container.querySelectorAll(".dropdown-item");
    fireEvent.click(buttons[2]);
    expect(silenceFormStore.toggle.visible).toBe(true);
    expect(silenceFormStore.data.alertmanagers).toMatchObject([
      { label: "am1", value: ["am1"] },
    ]);
  });

  it("'Silence' menu entry is disabled when all Alertmanager instances are read-only", () => {
    const upstreams = generateUpstreams();
    upstreams.instances[0].readonly = true;
    upstreams.instances[2].readonly = true;
    alertStore.data.setUpstreams(upstreams);
    const { container } = MountedMenuContent(group);
    const button = container.querySelectorAll(".dropdown-item")[2];
    expect(button.classList.contains("disabled")).toBe(true);
    fireEvent.click(button);
    expect(silenceFormStore.toggle.visible).toBe(false);
  });

  it("source link points at alert source", () => {
    const { container } = MountedMenuContent(group);
    const link = container.querySelector(
      "a.dropdown-item[href='localhost/graph']",
    )!;
    expect(link.textContent).toBe("default");
  });

  it("renders action annotations when present", () => {
    alert = MockAlert(
      [
        {
          name: "nonLinkAction",
          value: "nonLinkAction",
          visible: true,
          isLink: false,
          isAction: true,
        },
        {
          name: "linkAction",
          value: "linkAction",
          visible: true,
          isLink: true,
          isAction: true,
        },
        {
          name: "nonLinkNonAction",
          value: "nonLinkNonAction",
          visible: true,
          isLink: false,
          isAction: false,
        },
      ],
      [{ name: "foo", value: "bar" }],
      "active",
    );
    group = MockAlertGroup(
      [{ name: "alertname", value: "Fake Alert" }],
      [alert],
      [
        {
          name: "nonLinkActionShared",
          value: "nonLinkActionShared",
          visible: true,
          isLink: false,
          isAction: true,
        },
        {
          name: "linkActionShared",
          value: "linkActionShared",
          visible: true,
          isLink: true,
          isAction: true,
        },
        {
          name: "nonLinkNonActionShared",
          value: "nonLinkNonActionShared",
          visible: true,
          isLink: false,
          isAction: false,
        },
      ],
      [],
      {},
    );

    const { container } = MountedMenuContent(group);
    expect(container.querySelectorAll("a.dropdown-item")).toHaveLength(3);

    const link1 = container.querySelector(
      "a.dropdown-item[href='linkAction']",
    )!;
    expect(link1.textContent).toBe("linkAction");

    const link2 = container.querySelector(
      "a.dropdown-item[href='linkActionShared']",
    )!;
    expect(link2.textContent).toBe("linkActionShared");

    expect(
      container.querySelectorAll("a.dropdown-item[href='nonLinkNonAction']"),
    ).toHaveLength(0);
    expect(
      container.querySelectorAll("a.dropdown-item[href='nonLinkNonAction']"),
    ).toHaveLength(0);
    expect(
      container.querySelectorAll(
        "a.dropdown-item[href='nonLinkNonActionShared']",
      ),
    ).toHaveLength(0);
    expect(
      container.querySelectorAll(
        "a.dropdown-item[href='nonLinkNonActionShared']",
      ),
    ).toHaveLength(0);
  });

  it("clicking on 'Copy' icon copies alert data to clipboard", async () => {
    group.alertmanagerCount = { am1: 1, ro: 1 };
    const { container } = MountedMenuContent(group);
    const button = container.querySelectorAll(".dropdown-item")[1];
    fireEvent.click(button);
    expect(copy).toBeCalledWith(JSON.stringify(alertToJSON(group, alert)));
  });
});

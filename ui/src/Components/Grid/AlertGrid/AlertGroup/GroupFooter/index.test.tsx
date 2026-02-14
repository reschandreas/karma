import { render } from "@testing-library/react";

import {
  MockAlertGroup,
  MockAnnotation,
  MockAlert,
  MockSilence,
} from "__fixtures__/Alerts";
import { MockThemeContext } from "__fixtures__/Theme";
import type { APIAlertGroupT } from "Models/APITypes";
import { AlertStore } from "Stores/AlertStore";
import { SilenceFormStore } from "Stores/SilenceFormStore";
import { ThemeContext } from "Components/Theme";
import GroupFooter from ".";

let group: APIAlertGroupT;
let alertStore: AlertStore;
let silenceFormStore: SilenceFormStore;

const MockGroup = () => {
  const group = MockAlertGroup(
    [{ name: "alertname", value: "Fake Alert" }],
    [
      MockAlert([], [], "suppressed"),
      MockAlert([], [], "suppressed"),
      MockAlert([], [], "suppressed"),
    ],
    [
      MockAnnotation("summary", "This is summary", true, false, false),
      MockAnnotation(
        "hidden",
        "This is hidden annotation",
        false,
        false,
        false,
      ),
      MockAnnotation("link", "http://link.example.com", true, true, false),
    ],
    [
      { name: "label1", value: "foo" },
      { name: "label2", value: "bar" },
    ],
    {},
  );
  return group;
};

const MockAfterUpdate = jest.fn();

beforeEach(() => {
  alertStore = new AlertStore([]);
  silenceFormStore = new SilenceFormStore();
  group = MockGroup();

  jest.useFakeTimers();
  jest.setSystemTime(new Date(Date.UTC(2000, 0, 1, 15, 0, 0)));

  alertStore.data.setReceivers(["by-cluster-service", "by-name"]);
});

afterEach(() => {
  jest.restoreAllMocks();
  jest.useRealTimers();
});

const MountedGroupFooter = () => {
  return render(
    <ThemeContext.Provider value={MockThemeContext}>
      <GroupFooter
        group={group}
        afterUpdate={MockAfterUpdate}
        alertStore={alertStore}
        silenceFormStore={silenceFormStore}
      />
    </ThemeContext.Provider>,
  );
};

describe("<GroupFooter />", () => {
  it("matches snapshot", () => {
    group.shared.clusters = ["default"];
    const { container } = MountedGroupFooter();
    expect(container.innerHTML).toMatchSnapshot();
  });

  it("render deduplicated silence if present", () => {
    for (let index = 0; index < group.alerts.length; index++) {
      group.alerts[index].alertmanager[0].silencedBy = ["123456789"];
    }
    group.shared.silences = { default: ["123456789"] };
    alertStore.data.setSilences({
      default: {
        "123456789": MockSilence(),
      },
    });

    const { container } = MountedGroupFooter();
    expect(
      container.querySelectorAll(
        ".components-managed-silence",
      ),
    ).toHaveLength(1);
  });

  it("render fallback silence if not found in alertStore", () => {
    for (let index = 0; index < group.alerts.length; index++) {
      group.alerts[index].alertmanager[0].silencedBy = ["123456789"];
    }
    group.shared.silences = { default: ["123456789"] };
    alertStore.data.setSilences({
      default: {},
    });

    const { container } = MountedGroupFooter();
    expect(container.textContent).toMatch(/Silenced by 123456789/);
  });

  it("render fallback silence if cluster not found in alertStore", () => {
    for (let index = 0; index < group.alerts.length; index++) {
      group.alerts[index].alertmanager[0].silencedBy = ["123456789"];
    }
    group.shared.silences = { default: ["123456789"] };
    alertStore.data.setSilences({
      foo: {},
    });

    const { container } = MountedGroupFooter();
    expect(container.textContent).toMatch(/Silenced by 123456789/);
  });

  it("mathes snapshot when silence is rendered", () => {
    for (let index = 0; index < group.alerts.length; index++) {
      group.alerts[index].alertmanager[0].silencedBy = ["123456789"];
    }
    group.shared.silences = { default: ["123456789"] };
    group.shared.clusters = ["default"];

    const silence = MockSilence();
    silence.id = "123456789";
    alertStore.data.setSilences({
      default: {
        "123456789": silence,
      },
    });

    const { container } = MountedGroupFooter();
    expect(container.innerHTML).toMatchSnapshot();
  });

  it("renders @receiver label when alertStore.data.receivers.length > 1", () => {
    alertStore.data.setReceivers(["foo", "bar"]);
    const { container } = MountedGroupFooter();
    expect(container.innerHTML).toMatch(/@receiver:/);
  });

  it("doesn't render @receiver label when alertStore.data.receivers.length == 0", () => {
    alertStore.data.setReceivers([]);
    const { container } = MountedGroupFooter();
    expect(container.innerHTML).not.toMatch(/@receiver:/);
  });

  it("doesn't render silences when showSilences=false", () => {
    for (let index = 0; index < group.alerts.length; index++) {
      group.alerts[index].alertmanager[0].silencedBy = ["123456789"];
    }
    group.shared.silences = { default: ["123456789"] };

    const silence = MockSilence();
    silence.id = "123456789";
    alertStore.data.setSilences({
      default: {
        "123456789": silence,
      },
    });

    const { container } = render(
      <ThemeContext.Provider value={MockThemeContext}>
        <GroupFooter
          group={group}
          afterUpdate={MockAfterUpdate}
          alertStore={alertStore}
          silenceFormStore={silenceFormStore}
          showSilences={false}
        />
      </ThemeContext.Provider>,
    );
    expect(
      container.querySelectorAll(
        "div.components-grid-alertgrid-alertgroup-shared-silence",
      ),
    ).toHaveLength(0);
  });

  it("doesn't render annotations when showAnnotations=false", () => {
    const { container } = render(
      <ThemeContext.Provider value={MockThemeContext}>
        <GroupFooter
          group={group}
          afterUpdate={MockAfterUpdate}
          alertStore={alertStore}
          silenceFormStore={silenceFormStore}
          showAnnotations={false}
        />
      </ThemeContext.Provider>,
    );
    // No link annotations or non-link annotations should be rendered
    expect(container.querySelector("a[href='http://link.example.com']")).toBeNull();
    expect(container.querySelector(".components-grid-annotation")).toBeNull();
  });

  it("renders @cluster label if there's more than one cluster", () => {
    alertStore.data.setUpstreams({
      counters: { total: 2, healthy: 2, failed: 0 },
      clusters: { default: ["default"], second: ["second"] },
      instances: [
        {
          name: "default",
          cluster: "default",
          clusterMembers: ["default"],
          uri: "http://localhost",
          publicURI: "http://localhost",
          error: "",
          version: "0.24.0",
          readonly: false,
          corsCredentials: "include",
          headers: {},
        },
        {
          name: "second",
          cluster: "second",
          clusterMembers: ["second"],
          uri: "http://localhost",
          publicURI: "http://localhost",
          error: "",
          version: "0.24.0",
          readonly: false,
          corsCredentials: "include",
          headers: {},
        },
      ],
    });
    group.shared.clusters = ["default", "second"];
    const { container } = render(
      <ThemeContext.Provider value={MockThemeContext}>
        <GroupFooter
          group={group}
          afterUpdate={MockAfterUpdate}
          alertStore={alertStore}
          silenceFormStore={silenceFormStore}
          showAnnotations={false}
        />
      </ThemeContext.Provider>,
    );
    expect(container.innerHTML).toMatch(/@cluster:/);
  });

  it("doesn't render @cluster label if there's only one cluster", () => {
    group.shared.clusters = ["default"];
    const { container } = render(
      <ThemeContext.Provider value={MockThemeContext}>
        <GroupFooter
          group={group}
          afterUpdate={MockAfterUpdate}
          alertStore={alertStore}
          silenceFormStore={silenceFormStore}
          showAnnotations={false}
        />
      </ThemeContext.Provider>,
    );
    expect(container.innerHTML).not.toMatch(/@cluster:/);
  });
});

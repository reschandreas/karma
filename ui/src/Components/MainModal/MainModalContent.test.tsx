import { render, fireEvent } from "@testing-library/react";

import fetchMock from "fetch-mock";

import { MockThemeContext } from "__fixtures__/Theme";
import { AlertStore } from "Stores/AlertStore";
import { Settings } from "Stores/Settings";
import { ThemeContext } from "Components/Theme";
import { MainModalContent } from "./MainModalContent";

let alertStore: AlertStore;
let settingsStore: Settings;
const onHide = jest.fn();

beforeEach(() => {
  alertStore = new AlertStore([]);
  settingsStore = new Settings(null);
  onHide.mockClear();
  fetchMock.reset();
  fetchMock.mock("*", {
    body: JSON.stringify([]),
  });
});

afterEach(() => {
  jest.restoreAllMocks();
  fetchMock.reset();
});

const Wrapped = (component: any) => (
  <ThemeContext.Provider value={MockThemeContext}>
    {component}
  </ThemeContext.Provider>
);

const FakeModal = () => {
  return render(
    Wrapped(
      <MainModalContent
        alertStore={alertStore}
        settingsStore={settingsStore}
        onHide={onHide}
        expandAllOptions={true}
      />,
    ),
  );
};

const ValidateSetTab = (title: string) => {
  const { container } = FakeModal();

  const tab = container.querySelector(
    `.nav-link[title="${title}"], .nav-item.nav-link`,
  );
  // Find the tab by text content
  const tabs = container.querySelectorAll(".nav-item.nav-link");
  let targetTab: Element | null = null;
  tabs.forEach((t) => {
    if (t.textContent === title) {
      targetTab = t;
    }
  });
  if (targetTab) {
    fireEvent.click(targetTab);
  }
  expect(container.querySelector(".nav-link.active")!.textContent).toBe(title);
};

describe("<MainModalContent />", () => {
  it("matches snapshot", () => {
    const { asFragment } = render(
      <span>
        {Wrapped(
          <MainModalContent
            alertStore={alertStore}
            settingsStore={settingsStore}
            onHide={onHide}
            expandAllOptions={true}
          />,
        )}
      </span>,
    );
    expect(asFragment()).toMatchSnapshot();
  });

  it("shows 'Configuration' tab by default", () => {
    const { container } = FakeModal();
    const activeTab = container.querySelector(".nav-link.active");
    expect(activeTab!.textContent).toBe("Configuration");
  });

  // modal makes it tricky to verify re-rendered content, so only check if we
  // update the store for now
  it("calls setTab('configuration') after clicking on the 'Configuration' tab", () => {
    ValidateSetTab("Configuration");
  });

  it("calls setTab('help') after clicking on the 'Help' tab", () => {
    ValidateSetTab("Help");
  });

  it("shows username when alertStore.info.authentication.enabled=true", () => {
    alertStore.info.setAuthentication(true, "me@example.com");
    const { container } = render(
      <span>
        {Wrapped(
          <MainModalContent
            alertStore={alertStore}
            settingsStore={settingsStore}
            onHide={onHide}
            expandAllOptions={true}
          />,
        )}
      </span>,
    );
    expect(container.textContent).toMatch(/Username: me@example.com/);
  });
});

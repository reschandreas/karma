<<<<<<< HEAD
import { render, screen, fireEvent } from "@testing-library/react";
=======
import { render, fireEvent } from "@testing-library/react";
>>>>>>> f2d4110a (upgrading to react 19)

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

<<<<<<< HEAD
const renderModalContent = () => {
  return render(
    <ThemeContext.Provider value={MockThemeContext}>
=======
const Wrapped = (component: any) => (
  <ThemeContext.Provider value={MockThemeContext}>
    {component}
  </ThemeContext.Provider>
);

const FakeModal = () => {
  return render(
    Wrapped(
>>>>>>> f2d4110a (upgrading to react 19)
      <MainModalContent
        alertStore={alertStore}
        settingsStore={settingsStore}
        onHide={onHide}
        expandAllOptions={true}
      />
    </ThemeContext.Provider>,
  );
};

<<<<<<< HEAD
const validateSetTab = (title: string) => {
  const { container } = renderModalContent();

  const tab = screen.getByText(title);
  fireEvent.click(tab);
  expect(container.querySelector(".nav-link.active")?.textContent).toBe(title);
=======
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
>>>>>>> f2d4110a (upgrading to react 19)
};

describe("<MainModalContent />", () => {
  it("matches snapshot", () => {
<<<<<<< HEAD
    const { asFragment } = renderModalContent();
=======
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
>>>>>>> f2d4110a (upgrading to react 19)
    expect(asFragment()).toMatchSnapshot();
  });

  it("shows 'Configuration' tab by default", () => {
<<<<<<< HEAD
    const { container } = renderModalContent();
    const activeTab = container.querySelector(".nav-link.active");
    expect(activeTab?.textContent).toBe("Configuration");
=======
    const { container } = FakeModal();
    const activeTab = container.querySelector(".nav-link.active");
    expect(activeTab!.textContent).toBe("Configuration");
>>>>>>> f2d4110a (upgrading to react 19)
  });

  it("calls setTab('configuration') after clicking on the 'Configuration' tab", () => {
    validateSetTab("Configuration");
  });

  it("calls setTab('help') after clicking on the 'Help' tab", () => {
    validateSetTab("Help");
  });

  it("shows username when alertStore.info.authentication.enabled=true", () => {
    alertStore.info.setAuthentication(true, "me@example.com");
<<<<<<< HEAD
    renderModalContent();
    expect(screen.getByText(/Username: me@example.com/)).toBeInTheDocument();
=======
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
>>>>>>> f2d4110a (upgrading to react 19)
  });
});

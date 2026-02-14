import { render, fireEvent, act } from "@testing-library/react";

import { AlertStore, NewUnappliedFilter } from "Stores/AlertStore";
import { Settings } from "Stores/Settings";
import { History } from "./History";

let alertStore: AlertStore;
let settingsStore: Settings;

declare let global: any;

beforeEach(() => {
  alertStore = new AlertStore([]);
  settingsStore = new Settings(null);

  global.window.innerWidth = 1024;
  jest.useFakeTimers();
});

afterEach(() => {
  localStorage.setItem("history.filters", "");
});

const MountedHistory = () => {
  return render(
    <History alertStore={alertStore} settingsStore={settingsStore} />,
  );
};

const AppliedFilter = (name: string, matcher: string, value: string) => {
  const filter = NewUnappliedFilter(`${name}${matcher}${value}`);
  filter.applied = true;
  filter.isValid = true;
  filter.name = name;
  filter.matcher = matcher;
  filter.value = value;
  return filter;
};

const PopulateHistory = (count: number) => {
  for (let i = 1; i <= count; i++) {
    alertStore.filters.setFilterValues([
      AppliedFilter("foo", "=", `bar${i}`),
      AppliedFilter("baz", "=~", `bar${i}`),
    ]);
    act(() => {
      jest.runOnlyPendingTimers();
    });
  }
};

describe("<History />", () => {
  it("menu content is hidden by default", async () => {
    const promise = Promise.resolve();
    const { container } = MountedHistory();
    expect(container.querySelector("div.dropdown-menu")).toBeNull();
    await act(() => promise);
  });

  it("clicking toggle renders menu content", async () => {
    const promise = Promise.resolve();
    const { container } = MountedHistory();
    const toggle = container.querySelector("button.cursor-pointer")!;
    fireEvent.click(toggle);
    expect(container.querySelector("div.dropdown-menu")).toBeTruthy();
    await act(() => promise);
  });

  it("clicking toggle twice hides menu content", async () => {
    const promise = Promise.resolve();
    const { container } = MountedHistory();
    const toggle = container.querySelector("button.cursor-pointer")!;

    fireEvent.click(toggle);
    act(() => {
      jest.runOnlyPendingTimers();
    });
    expect(container.querySelector("div.dropdown-menu")).toBeTruthy();

    fireEvent.click(toggle);
    act(() => {
      jest.runOnlyPendingTimers();
    });
    expect(container.querySelector("div.dropdown-menu")).toBeNull();
    await act(() => promise);
  });

  it("clicking menu item hides menu content", async () => {
    const promise = Promise.resolve();
    const { container } = MountedHistory();
    const toggle = container.querySelector("button.cursor-pointer")!;

    fireEvent.click(toggle);
    expect(container.querySelector("div.dropdown-menu")).toBeTruthy();

    const historyButton = container.querySelector(".component-history-button")!;
    fireEvent.click(historyButton);
    act(() => {
      jest.runOnlyPendingTimers();
    });
    expect(container.querySelector("div.dropdown-menu")).toBeNull();
    await act(() => promise);
  });

  it("saves only applied filters to history", async () => {
    const promise = Promise.resolve();
    alertStore.filters.setFilterValues([
      AppliedFilter("foo", "=", "bar"),
      NewUnappliedFilter("foo=unapplied"),
      AppliedFilter("baz", "!=", "bar"),
    ]);
    const { container } = MountedHistory();
    fireEvent.click(container.querySelector("button.cursor-pointer")!);
    expect(container.querySelectorAll("button.dropdown-item")).toHaveLength(1);
    const labels = container.querySelectorAll(
      ".components-navbar-historymenu-labels span.components-label",
    );
    expect(labels).toHaveLength(2);
    expect(labels[0].innerHTML).toMatch(/foo=bar/);
    expect(labels[1].innerHTML).toMatch(/baz!=bar/);
    await act(() => promise);
  });
});

describe("<HistoryMenu />", () => {
  it("renders correctly when rendered with empty history", async () => {
    const promise = Promise.resolve();
    const { container } = MountedHistory();
    fireEvent.click(container.querySelector("button.cursor-pointer")!);
    expect(container.textContent).toBe(
      "Last used filtersEmptySave filtersReset filtersClear history",
    );
    await act(() => promise);
  });

  it("renders correctly when rendered with a filter in history", async () => {
    const promise = Promise.resolve();
    PopulateHistory(1);
    const { container } = MountedHistory();
    fireEvent.click(container.querySelector("button.cursor-pointer")!);

    expect(container.textContent).toBe(
      "Last used filtersfoo=bar1baz=~bar1Save filtersReset filtersClear history",
    );

    const labels = container.querySelectorAll(
      ".components-navbar-historymenu-labels span.components-label",
    );
    expect(labels).toHaveLength(2);
    expect(labels[0].innerHTML).toMatch(/foo=bar1/);
    expect(labels[1].innerHTML).toMatch(/baz=~bar1/);
    await act(() => promise);
  });

  it("clicking on a filter set in history populates alertStore", async () => {
    const promise = Promise.resolve();
    PopulateHistory(1);
    const { container } = MountedHistory();
    fireEvent.click(container.querySelector("button.cursor-pointer")!);

    const button = container.querySelectorAll("button.dropdown-item")[0];
    expect(button.textContent).toBe("foo=bar1baz=~bar1");

    alertStore.filters.setFilterValues([AppliedFilter("job", "=", "foo")]);
    expect(alertStore.filters.values).toHaveLength(1);

    fireEvent.click(button);
    act(() => {
      jest.runOnlyPendingTimers();
    });
    expect(alertStore.filters.values).toHaveLength(2);
    expect(alertStore.filters.values[0]).toMatchObject({ raw: "foo=bar1" });
    expect(alertStore.filters.values[1]).toMatchObject({ raw: "baz=~bar1" });
    await act(() => promise);
  });

  it("renders only up to 8 last filter sets in history on desktop", async () => {
    global.window.innerWidth = 1024;

    const promise = Promise.resolve();
    const { container } = MountedHistory();
    PopulateHistory(16);
    fireEvent.click(container.querySelector("button.cursor-pointer")!);
    expect(container.querySelectorAll("button.dropdown-item")).toHaveLength(8);

    const labelSets = container.querySelectorAll(
      ".components-navbar-historymenu-labels",
    );
    expect(labelSets).toHaveLength(8);

    // oldest pushed label should be rendered last
    const labelsLast = labelSets[labelSets.length - 1].querySelectorAll(
      "span.components-label",
    );
    expect(labelsLast).toHaveLength(2);
    expect(labelsLast[0].innerHTML).toMatch(/foo=bar9/);
    expect(labelsLast[1].innerHTML).toMatch(/baz=~bar9/);

    // most recently pushed label should be rendered first
    const labelsFirst = labelSets[0].querySelectorAll("span.components-label");
    expect(labelsFirst).toHaveLength(2);
    expect(labelsFirst[0].innerHTML).toMatch(/foo=bar16/);
    expect(labelsFirst[1].innerHTML).toMatch(/baz=~bar16/);
    await act(() => promise);
  });

  it("renders only up to 4 last filter sets in history on mobile", async () => {
    global.window.innerWidth = 500;

    const promise = Promise.resolve();
    const { container } = MountedHistory();
    PopulateHistory(16);
    fireEvent.click(container.querySelector("button.cursor-pointer")!);
    expect(container.querySelectorAll("button.dropdown-item")).toHaveLength(4);

    const labelSets = container.querySelectorAll(
      ".components-navbar-historymenu-labels",
    );
    expect(labelSets).toHaveLength(4);

    // oldest pushed label should be rendered last
    const labelsLast = labelSets[labelSets.length - 1].querySelectorAll(
      "span.components-label",
    );
    expect(labelsLast).toHaveLength(2);
    expect(labelsLast[0].innerHTML).toMatch(/foo=bar13/);
    expect(labelsLast[1].innerHTML).toMatch(/baz=~bar13/);

    // most recently pushed label should be rendered first
    const labelsFirst = labelSets[0].querySelectorAll("span.components-label");
    expect(labelsFirst).toHaveLength(2);
    expect(labelsFirst[0].innerHTML).toMatch(/foo=bar16/);
    expect(labelsFirst[1].innerHTML).toMatch(/baz=~bar16/);
    await act(() => promise);
  });

  it("clicking on 'Save filters' saves current filter set to Settings", async () => {
    const promise = Promise.resolve();
    alertStore.filters.setFilterValues([
      AppliedFilter("foo", "=", "bar"),
      AppliedFilter("bar", "=~", "baz"),
    ]);

    const { container } = MountedHistory();
    fireEvent.click(container.querySelector("button.cursor-pointer")!);
    const buttons = container.querySelectorAll(".component-history-button");
    const button = buttons[0];
    expect(button.textContent).toBe("Save filters");

    fireEvent.click(button);
    act(() => {
      jest.runOnlyPendingTimers();
    });
    expect(settingsStore.savedFilters.config.filters).toHaveLength(2);
    expect(settingsStore.savedFilters.config.filters).toContain("foo=bar");
    expect(settingsStore.savedFilters.config.filters).toContain("bar=~baz");
    await act(() => promise);
  });

  it("clicking on 'Reset filters' clears current filter set in Settings", async () => {
    const promise = Promise.resolve();
    settingsStore.savedFilters.save(["foo=bar"]);
    const { container } = MountedHistory();
    fireEvent.click(container.querySelector("button.cursor-pointer")!);

    const buttons = container.querySelectorAll(".component-history-button");
    const button = buttons[1];
    expect(button.textContent).toBe("Reset filters");
    fireEvent.click(button);
    act(() => {
      jest.runOnlyPendingTimers();
    });
    expect(settingsStore.savedFilters.config.filters).toHaveLength(0);
    await act(() => promise);
  });
});

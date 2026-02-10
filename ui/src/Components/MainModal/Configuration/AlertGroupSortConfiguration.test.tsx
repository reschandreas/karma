import { render, fireEvent } from "@testing-library/react";

import { MockThemeContext } from "__fixtures__/Theme";
import { useFetchGetMock } from "__fixtures__/useFetchGet";
import { Settings } from "Stores/Settings";
import { ThemeContext } from "Components/Theme";
import { AlertGroupSortConfiguration } from "./AlertGroupSortConfiguration";

let settingsStore: Settings;

beforeEach(() => {
  settingsStore = new Settings(null);
});

afterEach(() => {
  jest.restoreAllMocks();
});

const FakeConfiguration = () => {
  return render(
    <ThemeContext.Provider value={MockThemeContext}>
      <AlertGroupSortConfiguration settingsStore={settingsStore} />
    </ThemeContext.Provider>,
  );
};

const ExpandSortLabelSuggestions = () => {
  settingsStore.gridConfig.setSortOrder("label");
  const result = FakeConfiguration();

  fireEvent.change(
    result.container.querySelector(
      "input#react-select-configuration-sort-label-input",
    )!,
    { target: { value: "a" } },
  );

  return result;
};

describe("<AlertGroupSortConfiguration />", () => {
  it("matches snapshot with default values", () => {
    const { asFragment } = FakeConfiguration();
    expect(asFragment()).toMatchSnapshot();
  });

  it("invalid sortOrder value is reset on mount", () => {
    settingsStore.gridConfig.setSortOrder("badValue" as any);
    FakeConfiguration();
    expect(settingsStore.gridConfig.config.sortOrder).toBe(
      settingsStore.gridConfig.options.default.value,
    );
  });

  it("changing sort order value update settingsStore", () => {
    useFetchGetMock.fetch.setMockedData({
      response: null,
      error: "fake error",
      isLoading: false,
      isRetrying: false,
      retryCount: 0,
      get: jest.fn(),
      cancelGet: jest.fn(),
    });

    settingsStore.gridConfig.setSortOrder("label");
    expect(settingsStore.gridConfig.config.sortOrder).toBe(
      settingsStore.gridConfig.options.label.value,
    );
    const { container } = FakeConfiguration();

    fireEvent.change(
      container.querySelector(
        "input#react-select-configuration-sort-order-input",
      )!,
      { target: { value: " " } },
    );
    fireEvent.click(
      container.querySelectorAll("div.react-select__option")[2],
    );

    expect(settingsStore.gridConfig.config.sortOrder).toBe(
      settingsStore.gridConfig.options.startsAt.value,
    );
  });

  it("reverse checkbox is not rendered when sort order is == 'default'", () => {
    settingsStore.gridConfig.setSortOrder("default");
    const { container } = FakeConfiguration();
    const labelSelect = container.querySelector("#configuration-sort-reverse");
    expect(labelSelect).toBeNull();
  });

  it("reverse checkbox is not rendered when sort order is == 'disabled'", () => {
    settingsStore.gridConfig.setSortOrder("disabled");
    const { container } = FakeConfiguration();
    const labelSelect = container.querySelector("#configuration-sort-reverse");
    expect(labelSelect).toBeNull();
  });

  it("reverse checkbox is rendered when sort order is = 'startsAt'", () => {
    settingsStore.gridConfig.setSortOrder("startsAt");
    const { container } = FakeConfiguration();
    const labelSelect = container.querySelector("#configuration-sort-reverse");
    expect(labelSelect).not.toBeNull();
  });

  it("reverse checkbox is rendered when sort order is = 'label'", () => {
    settingsStore.gridConfig.setSortOrder("label");
    const { container } = FakeConfiguration();
    const labelSelect = container.querySelector("#configuration-sort-reverse");
    expect(labelSelect).not.toBeNull();
  });

  it("label select is not rendered when sort order is != 'label'", () => {
    settingsStore.gridConfig.setSortOrder("disabled");
    const { container } = FakeConfiguration();
    const labelSelect = container.querySelector(
      "input#react-select-configuration-sort-label-input",
    );
    expect(labelSelect).toBeNull();
  });

  it("label select is rendered when sort order is == 'label'", () => {
    settingsStore.gridConfig.setSortOrder("label");
    const { container } = FakeConfiguration();
    const labelSelect = container.querySelector(
      "input#react-select-configuration-sort-label-input",
    );
    expect(labelSelect).not.toBeNull();
  });

  it("label select renders suggestions on click", () => {
    const { container } = ExpandSortLabelSuggestions();
    const options = container.querySelectorAll("div.react-select__option");
    // Filter "a" narrows results to labels containing "a" + creatable "New label: a"
    expect(options).toHaveLength(2);
    expect(options[0].textContent).toBe("instance");
    expect(options[1].textContent).toBe("New label: a");
  });

  it("label select handles fetch errors", () => {
    useFetchGetMock.fetch.setMockedData({
      response: null,
      error: "fake error",
      isLoading: false,
      isRetrying: false,
      retryCount: 0,
      get: jest.fn(),
      cancelGet: jest.fn(),
    });
    const { container } = ExpandSortLabelSuggestions();
    const options = container.querySelectorAll("div.react-select__option");
    // With error, no API labels are loaded; filter "a" matches only "New label: a"
    expect(options).toHaveLength(1);
    expect(options[0].textContent).toBe("New label: a");
  });

  it("clicking on a label option updates settingsStore", () => {
    expect(settingsStore.gridConfig.config.sortLabel).toBeNull();
    settingsStore.gridConfig.setSortOrder("label");
    const { container } = FakeConfiguration();
    // Open dropdown with space to show all options (no filter)
    fireEvent.change(
      container.querySelector(
        "input#react-select-configuration-sort-label-input",
      )!,
      { target: { value: " " } },
    );
    const options = container.querySelectorAll("div.react-select__option");
    const jobOption = Array.from(options).find(
      (o) => o.textContent === "job",
    );
    expect(jobOption).toBeDefined();
    fireEvent.click(jobOption!);
    expect(settingsStore.gridConfig.config.sortLabel).toBe("job");
  });

  it("clicking on the 'reverse' checkbox updates settingsStore", () => {
    settingsStore.gridConfig.setSortOrder("label");
    settingsStore.gridConfig.setSortReverse(false);
    const { container } = FakeConfiguration();
    const checkbox = container.querySelector("#configuration-sort-reverse")!;

    expect(settingsStore.gridConfig.config.reverseSort).toBe(false);
    fireEvent.click(checkbox);
    expect(settingsStore.gridConfig.config.reverseSort).toBe(true);
  });
});

import { render, fireEvent } from "@testing-library/react";

import fetchMock from "fetch-mock";

import { MockThemeContext } from "__fixtures__/Theme";
import { useFetchGetMock } from "__fixtures__/useFetchGet";
import { Settings } from "Stores/Settings";
import { ThemeContext } from "Components/Theme";
import { MultiGridConfiguration } from "./MultiGridConfiguration";

let settingsStore: Settings;
beforeEach(() => {
  fetchMock.reset();
  fetchMock.mock("*", {
    body: JSON.stringify([]),
  });

  settingsStore = new Settings(null);
});

afterEach(() => {
  jest.restoreAllMocks();
});

const FakeConfiguration = () => {
  return render(
    <ThemeContext.Provider value={MockThemeContext}>
      <MultiGridConfiguration settingsStore={settingsStore} />
    </ThemeContext.Provider>,
  );
};

const ExpandSortLabelSuggestions = () => {
  settingsStore.gridConfig.setSortOrder("label");
  const result = FakeConfiguration();

  fireEvent.change(
    result.container.querySelector(
      "input#react-select-configuration-grid-label-input",
    )!,
    { target: { value: "a" } },
  );

  return result;
};

describe("<MultiGridConfiguration />", () => {
  it("matches snapshot with default values", () => {
    const { asFragment } = FakeConfiguration();
    expect(asFragment()).toMatchSnapshot();
  });

  it("correctly renders default option when multi-grid is disabled", () => {
    settingsStore.multiGridConfig.setGridLabel("");
    const { container } = FakeConfiguration();
    expect(
      container.querySelector("div.react-select__value-container")!
        .textContent,
    ).toBe("Disable multi-grid");
  });

  it("correctly renders default option when multi-grid is set to @auto", () => {
    settingsStore.multiGridConfig.setGridLabel("@auto");
    const { container } = FakeConfiguration();
    expect(
      container.querySelector("div.react-select__value-container")!
        .textContent,
    ).toBe("Automatic selection");
  });

  it("correctly renders default option when multi-grid is enabled", () => {
    settingsStore.multiGridConfig.setGridLabel("cluster");
    const { container } = FakeConfiguration();
    expect(
      container.querySelector("div.react-select__value-container")!
        .textContent,
    ).toBe("cluster");
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
    // Filter "a" narrows to options containing "a" + the creatable "New label: a"
    expect(options).toHaveLength(4);
    expect(options[0].textContent).toBe("Disable multi-grid");
    expect(options[1].textContent).toBe("Automatic selection");
    expect(options[2].textContent).toBe("@alertmanager");
    expect(options[3].textContent).toBe("New label: a");
  });

  it("clicking on a label option updates settingsStore", () => {
    const { container } = FakeConfiguration();
    // Open the dropdown and click on a specific label option
    fireEvent.change(
      container.querySelector(
        "input#react-select-configuration-grid-label-input",
      )!,
      { target: { value: " " } },
    );
    const options = container.querySelectorAll("div.react-select__option");
    // Find the "job" option and click it
    const jobOption = Array.from(options).find(
      (o) => o.textContent === "job",
    );
    expect(jobOption).toBeDefined();
    fireEvent.click(jobOption!);
    expect(settingsStore.multiGridConfig.config.gridLabel).toBe("job");
  });

  it("clicking on the 'reverse' checkbox updates settingsStore", () => {
    settingsStore.gridConfig.setSortReverse(false);
    const { container } = FakeConfiguration();
    const checkbox = container.querySelector(
      "#configuration-multigrid-sort-reverse",
    )!;

    expect(settingsStore.gridConfig.config.reverseSort).toBe(false);
    fireEvent.click(checkbox);
    expect(settingsStore.multiGridConfig.config.gridSortReverse).toBe(true);
  });
});

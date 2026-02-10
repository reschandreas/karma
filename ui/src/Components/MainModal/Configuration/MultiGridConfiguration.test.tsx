<<<<<<< HEAD
import { render, screen, fireEvent } from "@testing-library/react";
=======
import { render, fireEvent } from "@testing-library/react";
>>>>>>> f2d4110a (upgrading to react 19)

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

<<<<<<< HEAD
const renderConfiguration = () => {
=======
const FakeConfiguration = () => {
>>>>>>> f2d4110a (upgrading to react 19)
  return render(
    <ThemeContext.Provider value={MockThemeContext}>
      <MultiGridConfiguration settingsStore={settingsStore} />
    </ThemeContext.Provider>,
  );
};

const expandSortLabelSuggestions = () => {
  settingsStore.gridConfig.setSortOrder("label");
<<<<<<< HEAD
  const view = renderConfiguration();

  const input = view.container.querySelector(
    "input#react-select-configuration-grid-label-input",
  );
  fireEvent.change(input!, { target: { value: " " } });

  return view;
=======
  const result = FakeConfiguration();

  fireEvent.change(
    result.container.querySelector(
      "input#react-select-configuration-grid-label-input",
    )!,
    { target: { value: "a" } },
  );

  return result;
>>>>>>> f2d4110a (upgrading to react 19)
};

describe("<MultiGridConfiguration />", () => {
  it("matches snapshot with default values", () => {
<<<<<<< HEAD
    const { asFragment } = renderConfiguration();
=======
    const { asFragment } = FakeConfiguration();
>>>>>>> f2d4110a (upgrading to react 19)
    expect(asFragment()).toMatchSnapshot();
  });

  it("correctly renders default option when multi-grid is disabled", () => {
    settingsStore.multiGridConfig.setGridLabel("");
<<<<<<< HEAD
    renderConfiguration();
    expect(screen.getByText("Disable multi-grid")).toBeInTheDocument();
=======
    const { container } = FakeConfiguration();
    expect(
      container.querySelector("div.react-select__value-container")!
        .textContent,
    ).toBe("Disable multi-grid");
>>>>>>> f2d4110a (upgrading to react 19)
  });

  it("correctly renders default option when multi-grid is set to @auto", () => {
    settingsStore.multiGridConfig.setGridLabel("@auto");
<<<<<<< HEAD
    renderConfiguration();
    expect(screen.getByText("Automatic selection")).toBeInTheDocument();
=======
    const { container } = FakeConfiguration();
    expect(
      container.querySelector("div.react-select__value-container")!
        .textContent,
    ).toBe("Automatic selection");
>>>>>>> f2d4110a (upgrading to react 19)
  });

  it("correctly renders default option when multi-grid is enabled", () => {
    settingsStore.multiGridConfig.setGridLabel("cluster");
<<<<<<< HEAD
    renderConfiguration();
    expect(screen.getByText("cluster")).toBeInTheDocument();
=======
    const { container } = FakeConfiguration();
    expect(
      container.querySelector("div.react-select__value-container")!
        .textContent,
    ).toBe("cluster");
>>>>>>> f2d4110a (upgrading to react 19)
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
<<<<<<< HEAD
    const { container } = expandSortLabelSuggestions();
    const options = container.querySelectorAll("div.react-select__option");
    expect(options).toHaveLength(6);
    expect(options[0].textContent).toBe("Disable multi-grid");
    expect(options[1].textContent).toBe("Automatic selection");
    expect(options[2].textContent).toBe("@alertmanager");
    expect(options[3].textContent).toBe("@cluster");
    expect(options[4].textContent).toBe("@receiver");
    expect(options[5].textContent).toBe("New label:  ");
  });

  it("clicking on a label option updates settingsStore", () => {
    const { container } = expandSortLabelSuggestions();
    const options = container.querySelectorAll("div.react-select__option");
    fireEvent.click(options[3]);
    expect(settingsStore.multiGridConfig.config.gridLabel).toBe("@cluster");
  });

  it("clicking on the 'reverse' checkbox updates settingsStore", () => {
    settingsStore.multiGridConfig.setGridSortReverse(false);
    const { container } = renderConfiguration();
    const checkbox = container.querySelector(
      "#configuration-multigrid-sort-reverse",
    );

    expect(settingsStore.multiGridConfig.config.gridSortReverse).toBe(false);
    fireEvent.click(checkbox!);
=======
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
>>>>>>> f2d4110a (upgrading to react 19)
    expect(settingsStore.multiGridConfig.config.gridSortReverse).toBe(true);
  });
});

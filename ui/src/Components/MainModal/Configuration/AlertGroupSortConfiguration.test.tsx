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

<<<<<<< HEAD
const renderConfiguration = () => {
=======
const FakeConfiguration = () => {
>>>>>>> f2d4110a (upgrading to react 19)
  return render(
    <ThemeContext.Provider value={MockThemeContext}>
      <AlertGroupSortConfiguration settingsStore={settingsStore} />
    </ThemeContext.Provider>,
  );
};

const expandSortLabelSuggestions = () => {
  settingsStore.gridConfig.setSortOrder("label");
<<<<<<< HEAD
  const view = renderConfiguration();

  const input = view.container.querySelector(
    "input#react-select-configuration-sort-label-input",
  );
  fireEvent.change(input!, { target: { value: "c" } });

  return view;
=======
  const result = FakeConfiguration();

  fireEvent.change(
    result.container.querySelector(
      "input#react-select-configuration-sort-label-input",
    )!,
    { target: { value: "a" } },
  );

  return result;
>>>>>>> f2d4110a (upgrading to react 19)
};

describe("<AlertGroupSortConfiguration />", () => {
  it("matches snapshot with default values", () => {
<<<<<<< HEAD
    const { asFragment } = renderConfiguration();
=======
    const { asFragment } = FakeConfiguration();
>>>>>>> f2d4110a (upgrading to react 19)
    expect(asFragment()).toMatchSnapshot();
  });

  it("invalid sortOrder value is reset on mount", () => {
    settingsStore.gridConfig.setSortOrder("badValue" as any);
    renderConfiguration();
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
<<<<<<< HEAD
    const { container } = renderConfiguration();

    const input = container.querySelector(
      "input#react-select-configuration-sort-order-input",
    );
    fireEvent.change(input!, { target: { value: " " } });
    const options = container.querySelectorAll("div.react-select__option");
    fireEvent.click(options[2]);
=======
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
>>>>>>> f2d4110a (upgrading to react 19)

    expect(settingsStore.gridConfig.config.sortOrder).toBe(
      settingsStore.gridConfig.options.startsAt.value,
    );
  });

  it("reverse checkbox is not rendered when sort order is == 'default'", () => {
    settingsStore.gridConfig.setSortOrder("default");
<<<<<<< HEAD
    const { container } = renderConfiguration();
    const labelSelect = container.querySelector("#configuration-sort-reverse");
    expect(labelSelect).not.toBeInTheDocument();
=======
    const { container } = FakeConfiguration();
    const labelSelect = container.querySelector("#configuration-sort-reverse");
    expect(labelSelect).toBeNull();
>>>>>>> f2d4110a (upgrading to react 19)
  });

  it("reverse checkbox is not rendered when sort order is == 'disabled'", () => {
    settingsStore.gridConfig.setSortOrder("disabled");
<<<<<<< HEAD
    const { container } = renderConfiguration();
    const labelSelect = container.querySelector("#configuration-sort-reverse");
    expect(labelSelect).not.toBeInTheDocument();
=======
    const { container } = FakeConfiguration();
    const labelSelect = container.querySelector("#configuration-sort-reverse");
    expect(labelSelect).toBeNull();
>>>>>>> f2d4110a (upgrading to react 19)
  });

  it("reverse checkbox is rendered when sort order is = 'startsAt'", () => {
    settingsStore.gridConfig.setSortOrder("startsAt");
<<<<<<< HEAD
    const { container } = renderConfiguration();
    const labelSelect = container.querySelector("#configuration-sort-reverse");
    expect(labelSelect).toBeInTheDocument();
=======
    const { container } = FakeConfiguration();
    const labelSelect = container.querySelector("#configuration-sort-reverse");
    expect(labelSelect).not.toBeNull();
>>>>>>> f2d4110a (upgrading to react 19)
  });

  it("reverse checkbox is rendered when sort order is = 'label'", () => {
    settingsStore.gridConfig.setSortOrder("label");
<<<<<<< HEAD
    const { container } = renderConfiguration();
    const labelSelect = container.querySelector("#configuration-sort-reverse");
    expect(labelSelect).toBeInTheDocument();
=======
    const { container } = FakeConfiguration();
    const labelSelect = container.querySelector("#configuration-sort-reverse");
    expect(labelSelect).not.toBeNull();
>>>>>>> f2d4110a (upgrading to react 19)
  });

  it("label select is not rendered when sort order is != 'label'", () => {
    settingsStore.gridConfig.setSortOrder("disabled");
<<<<<<< HEAD
    const { container } = renderConfiguration();
    const labelSelect = container.querySelector(
      "input#react-select-configuration-sort-label-input",
    );
    expect(labelSelect).not.toBeInTheDocument();
=======
    const { container } = FakeConfiguration();
    const labelSelect = container.querySelector(
      "input#react-select-configuration-sort-label-input",
    );
    expect(labelSelect).toBeNull();
>>>>>>> f2d4110a (upgrading to react 19)
  });

  it("label select is rendered when sort order is == 'label'", () => {
    settingsStore.gridConfig.setSortOrder("label");
<<<<<<< HEAD
    const { container } = renderConfiguration();
    const labelSelect = container.querySelector(
      "input#react-select-configuration-sort-label-input",
    );
    expect(labelSelect).toBeInTheDocument();
  });

  it("label select renders suggestions on click", () => {
    const { container } = expandSortLabelSuggestions();
    const options = container.querySelectorAll("div.react-select__option");
    expect(options).toHaveLength(3);
    expect(options[0].textContent).toBe("cluster");
    expect(options[1].textContent).toBe("instance");
    expect(options[2].textContent).toBe("New label: c");
=======
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
    expect(options).toHaveLength(1);
    expect(options[0].textContent).toBe("New label: c");
=======
    const { container } = ExpandSortLabelSuggestions();
    const options = container.querySelectorAll("div.react-select__option");
    // With error, no API labels are loaded; filter "a" matches only "New label: a"
    expect(options).toHaveLength(1);
    expect(options[0].textContent).toBe("New label: a");
>>>>>>> f2d4110a (upgrading to react 19)
  });

  it("clicking on a label option updates settingsStore", () => {
    expect(settingsStore.gridConfig.config.sortLabel).toBeNull();
<<<<<<< HEAD
    const { container } = expandSortLabelSuggestions();
    const options = container.querySelectorAll("div.react-select__option");
    fireEvent.click(options[1]);
    expect(settingsStore.gridConfig.config.sortLabel).toBe("instance");
=======
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
>>>>>>> f2d4110a (upgrading to react 19)
  });

  it("clicking on the 'reverse' checkbox updates settingsStore", () => {
    settingsStore.gridConfig.setSortOrder("label");
    settingsStore.gridConfig.setSortReverse(false);
<<<<<<< HEAD
    const { container } = renderConfiguration();
    const checkbox = container.querySelector("#configuration-sort-reverse");

    expect(settingsStore.gridConfig.config.reverseSort).toBe(false);
    fireEvent.click(checkbox!);
=======
    const { container } = FakeConfiguration();
    const checkbox = container.querySelector("#configuration-sort-reverse")!;

    expect(settingsStore.gridConfig.config.reverseSort).toBe(false);
    fireEvent.click(checkbox);
>>>>>>> f2d4110a (upgrading to react 19)
    expect(settingsStore.gridConfig.config.reverseSort).toBe(true);
  });
});

import { render, fireEvent } from "@testing-library/react";

import { MockThemeContext } from "__fixtures__/Theme";
import { useFetchGetMock } from "__fixtures__/useFetchGet";
import { NewEmptyMatcher, MatcherWithIDT } from "Stores/SilenceFormStore";
import { ThemeContext } from "Components/Theme";
import { useFetchGet } from "Hooks/useFetchGet";
import { LabelNameInput } from "./LabelNameInput";

let matcher: MatcherWithIDT;

beforeEach(() => {
  matcher = NewEmptyMatcher();
  matcher.name = "cluster";
});

afterEach(() => {
  jest.restoreAllMocks();
  (useFetchGet as jest.MockedFunction<typeof useFetchGetMock>).mockReset();
});

<<<<<<< HEAD
const renderLabelNameInput = (isValid: boolean) => {
=======
const MountedLabelNameInput = (isValid: boolean) => {
>>>>>>> f2d4110a (upgrading to react 19)
  return render(
    <ThemeContext.Provider value={MockThemeContext}>
      <LabelNameInput matcher={matcher} isValid={isValid} />
    </ThemeContext.Provider>,
  );
};

describe("<LabelNameInput />", () => {
  it("matches snapshot", () => {
<<<<<<< HEAD
    const { asFragment } = renderLabelNameInput(true);
=======
    const { asFragment } = MountedLabelNameInput(true);
>>>>>>> f2d4110a (upgrading to react 19)
    expect(asFragment()).toMatchSnapshot();
  });

  it("doesn't renders ValidationError after passed validation", () => {
    // clear the name so placeholder is rendered
    matcher.name = "";
<<<<<<< HEAD
    const { container } = renderLabelNameInput(true);
=======
    const { container } = MountedLabelNameInput(true);
>>>>>>> f2d4110a (upgrading to react 19)
    expect(container.innerHTML).toMatch(/Label name/);
    expect(container.innerHTML).not.toMatch(/fa-circle-exclamation/);
    expect(container.innerHTML).not.toMatch(/Required/);
  });

  it("renders ValidationError after failed validation", () => {
    // clear the name so placeholder is rendered
    matcher.name = "";
<<<<<<< HEAD
    const { container } = renderLabelNameInput(false);
=======
    const { container } = MountedLabelNameInput(false);
>>>>>>> f2d4110a (upgrading to react 19)
    expect(container.innerHTML).not.toMatch(/Label name/);
    expect(container.innerHTML).toMatch(/fa-circle-exclamation/);
    expect(container.innerHTML).toMatch(/Required/);
  });

  it("renders suggestions", () => {
<<<<<<< HEAD
    const { container } = renderLabelNameInput(true);
    const input = container.querySelector("input");
    fireEvent.change(input!, { target: { value: "j" } });
    const options = container.querySelectorAll("div.react-select__option");
    expect(options).toHaveLength(2);
    expect(options[0].textContent).toBe("job");
    expect(options[1].textContent).toBe("New label: j");
  });

  it("clicking on options updates the matcher", () => {
    const { container } = renderLabelNameInput(true);
    const input = container.querySelector("input");
    fireEvent.change(input!, { target: { value: "j" } });
    const options = container.querySelectorAll("div.react-select__option");
    fireEvent.click(options[0]);
=======
    const { container } = MountedLabelNameInput(true);
    fireEvent.change(container.querySelector("input")!, {
      target: { value: "f" },
    });
    const options = container.querySelectorAll("div.react-select__option");
    expect(options).toHaveLength(2);
    expect(options[0].textContent).toBe("job");
    expect(options[1].textContent).toBe("instance");
  });

  it("clicking on options updates the matcher", () => {
    const { container } = MountedLabelNameInput(true);
    fireEvent.change(container.querySelector("input")!, {
      target: { value: "f" },
    });
    const option = container.querySelectorAll("div.react-select__option")[0];
    fireEvent.click(option);
>>>>>>> f2d4110a (upgrading to react 19)
    expect(matcher.name).toBe("job");
  });

  it("populates suggestions on mount", () => {
    renderLabelNameInput(true);
    expect(
      (useFetchGet as jest.MockedFunction<typeof useFetchGetMock>).mock
        .calls[0][0],
    ).toBe("./labelNames.json");
  });

  it("handles fetch errors when populating suggestions", () => {
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
    const { container } = renderLabelNameInput(true);
    const input = container.querySelector("input");
    fireEvent.change(input!, { target: { value: "j" } });
    const options = container.querySelectorAll("div.react-select__option");
    expect(options).toHaveLength(1);
    expect(options[0].textContent).toBe("New label: j");
=======
    const { container } = MountedLabelNameInput(true);
    fireEvent.change(container.querySelector("input")!, {
      target: { value: "f" },
    });
    const options = container.querySelectorAll("div.react-select__option");
    expect(options).toHaveLength(0);
>>>>>>> f2d4110a (upgrading to react 19)
  });
});

<<<<<<< HEAD
import { render, fireEvent } from "@testing-library/react";
=======
import { render, fireEvent, act } from "@testing-library/react";
>>>>>>> f2d4110a (upgrading to react 19)

import { useFetchGetMock } from "__fixtures__/useFetchGet";
import { MockThemeContext } from "__fixtures__/Theme";
import {
  SilenceFormStore,
  NewEmptyMatcher,
  MatcherWithIDT,
} from "Stores/SilenceFormStore";
import { ThemeContext } from "Components/Theme";
import { StringToOption } from "Common/Select";
import { LabelValueInput } from "./LabelValueInput";

let silenceFormStore: SilenceFormStore;
let matcher: MatcherWithIDT;

beforeEach(() => {
  silenceFormStore = new SilenceFormStore();
  matcher = NewEmptyMatcher();
  matcher.name = "cluster";
});

afterEach(() => {
  jest.restoreAllMocks();
});

<<<<<<< HEAD
const renderLabelValueInput = (isValid: boolean) => {
=======
const MountedLabelValueInput = (isValid: boolean) => {
>>>>>>> f2d4110a (upgrading to react 19)
  return render(
    <ThemeContext.Provider value={MockThemeContext}>
      <LabelValueInput
        silenceFormStore={silenceFormStore}
        matcher={matcher}
        isValid={isValid}
      />
    </ThemeContext.Provider>,
  );
};

describe("<LabelValueInput />", () => {
  it("matches snapshot", () => {
<<<<<<< HEAD
    const { asFragment } = renderLabelValueInput(true);
=======
    const { asFragment } = MountedLabelValueInput(true);
>>>>>>> f2d4110a (upgrading to react 19)
    expect(asFragment()).toMatchSnapshot();
  });

  it("fetches suggestions on mount", () => {
<<<<<<< HEAD
    const { asFragment } = renderLabelValueInput(true);
=======
    const { asFragment } = MountedLabelValueInput(true);
>>>>>>> f2d4110a (upgrading to react 19)
    expect(asFragment()).toMatchSnapshot();
    expect(useFetchGetMock.fetch.calls).toHaveLength(1);
    expect(useFetchGetMock.fetch.calls[0]).toBe(
      "./labelValues.json?name=cluster",
    );
  });

  it("doesn't fetch suggestions if name is not set", () => {
    matcher.name = "";
    renderLabelValueInput(true);
    expect(useFetchGetMock.fetch.calls).toHaveLength(0);
  });

  it("doesn't renders ValidationError after passed validation", () => {
<<<<<<< HEAD
    const { container } = renderLabelValueInput(true);
=======
    const { container } = MountedLabelValueInput(true);
>>>>>>> f2d4110a (upgrading to react 19)
    expect(container.innerHTML).not.toMatch(/fa-circle-exclamation/);
    expect(container.innerHTML).not.toMatch(/Required/);
  });

  it("renders ValidationError after failed validation", () => {
<<<<<<< HEAD
    const { container } = renderLabelValueInput(false);
=======
    const { container } = MountedLabelValueInput(false);
>>>>>>> f2d4110a (upgrading to react 19)
    expect(container.innerHTML).toMatch(/fa-circle-exclamation/);
    expect(container.innerHTML).toMatch(/Required/);
  });

  it("renders suggestions", () => {
<<<<<<< HEAD
    const { container } = renderLabelValueInput(true);
    const input = container.querySelector("input");
    fireEvent.change(input!, { target: { value: "d" } });
    const options = container.querySelectorAll("div.react-select__option");
    expect(options).toHaveLength(3);
    expect(options[0].textContent).toBe("dev");
    expect(options[1].textContent).toBe("prod");
    expect(options[2].textContent).toBe("New value: d");
  });

  it("clicking on options appends them to matcher.values", () => {
    const { container } = renderLabelValueInput(true);
    const input = container.querySelector("input");
    fireEvent.change(input!, { target: { value: "d" } });
    let options = container.querySelectorAll("div.react-select__option");
    fireEvent.click(options[0]);
    fireEvent.change(input!, { target: { value: "s" } });
    options = container.querySelectorAll("div.react-select__option");
    fireEvent.click(options[0]);
=======
    const { container } = MountedLabelValueInput(true);
    fireEvent.change(container.querySelector("input")!, {
      target: { value: "f" },
    });
    const options = container.querySelectorAll("div.react-select__option");
    expect(options).toHaveLength(3);
    expect(options[0].textContent).toBe("dev");
    expect(options[1].textContent).toBe("staging");
    expect(options[2].textContent).toBe("prod");
  });

  it("clicking on options appends them to matcher.values", () => {
    const { container } = MountedLabelValueInput(true);
    fireEvent.change(container.querySelector("input")!, {
      target: { value: "f" },
    });
    const options = container.querySelectorAll("div.react-select__option");
    fireEvent.click(options[0]);
    fireEvent.click(options[1]);
>>>>>>> f2d4110a (upgrading to react 19)
    expect(matcher.values).toHaveLength(2);
    expect(matcher.values).toContainEqual(StringToOption("dev"));
    expect(matcher.values).toContainEqual(StringToOption("staging"));
  });

  it("selecting one option doesn't force matcher.isRegex=true", () => {
<<<<<<< HEAD
    const { container } = renderLabelValueInput(true);
    const input = container.querySelector("input");
    fireEvent.change(input!, { target: { value: "d" } });
=======
    const { container } = MountedLabelValueInput(true);
    fireEvent.change(container.querySelector("input")!, {
      target: { value: "f" },
    });
>>>>>>> f2d4110a (upgrading to react 19)
    expect(matcher.isRegex).toBe(false);
    const options = container.querySelectorAll("div.react-select__option");
    fireEvent.click(options[0]);
    expect(matcher.isRegex).toBe(false);
  });

  it("selecting one option when matcher.isRegex=true doesn't change it back to false", () => {
    matcher.isRegex = true;
<<<<<<< HEAD
    const { container } = renderLabelValueInput(true);
    const input = container.querySelector("input");
    fireEvent.change(input!, { target: { value: "d" } });
=======
    const { container } = MountedLabelValueInput(true);
    fireEvent.change(container.querySelector("input")!, {
      target: { value: "f" },
    });
>>>>>>> f2d4110a (upgrading to react 19)
    expect(matcher.isRegex).toBe(true);
    const options = container.querySelectorAll("div.react-select__option");
    fireEvent.click(options[0]);
    expect(matcher.isRegex).toBe(true);
  });

  it("selecting multiple options forces matcher.isRegex=true", () => {
<<<<<<< HEAD
    const { container } = renderLabelValueInput(true);
    const input = container.querySelector("input");
    fireEvent.change(input!, { target: { value: "d" } });
    expect(matcher.isRegex).toBe(false);
    let options = container.querySelectorAll("div.react-select__option");
    fireEvent.click(options[0]);
    fireEvent.change(input!, { target: { value: "s" } });
    options = container.querySelectorAll("div.react-select__option");
    fireEvent.click(options[0]);
=======
    const { container } = MountedLabelValueInput(true);
    fireEvent.change(container.querySelector("input")!, {
      target: { value: "f" },
    });
    expect(matcher.isRegex).toBe(false);
    const options = container.querySelectorAll("div.react-select__option");
    fireEvent.click(options[0]);
    fireEvent.click(options[1]);
>>>>>>> f2d4110a (upgrading to react 19)
    expect(matcher.isRegex).toBe(true);
  });

  it("creating a manual option sets wasCreated=true", () => {
<<<<<<< HEAD
    const { container } = renderLabelValueInput(true);
    const input = container.querySelector("input");
    fireEvent.change(input!, { target: { value: "foo" } });
    fireEvent.keyDown(input!, { key: "Enter", code: "Enter" });
    expect(matcher.values.length).toBeGreaterThan(0);
=======
    const { container } = MountedLabelValueInput(true);
    // Simulate creating a new option by typing and pressing Enter
    const input = container.querySelector("input")!;
    fireEvent.change(input, { target: { value: "foo" } });
    fireEvent.keyDown(input, { key: "Enter", keyCode: 13 });
    expect(matcher.values[0]).toStrictEqual({
      label: "foo",
      value: "foo",
      wasCreated: true,
    });
>>>>>>> f2d4110a (upgrading to react 19)
  });

  it("removing last value sets matcher.values to []", () => {
    matcher.values = [StringToOption("dev"), StringToOption("staging")];
<<<<<<< HEAD
    const { container } = renderLabelValueInput(true);

    const removeButtons = container.querySelectorAll(
      "div.react-select__multi-value__remove",
    );
    fireEvent.click(removeButtons[0]);
    expect(matcher.values).toHaveLength(1);

    const remainingRemove = container.querySelector(
      "div.react-select__multi-value__remove",
    );
    fireEvent.click(remainingRemove!);
=======
    const { container } = MountedLabelValueInput(true);

    fireEvent.click(
      container.querySelectorAll("div.react-select__multi-value__remove")[0],
    );
    expect(matcher.values).toHaveLength(1);

    fireEvent.click(
      container.querySelector("div.react-select__multi-value__remove")!,
    );
>>>>>>> f2d4110a (upgrading to react 19)
    expect(matcher.values).toHaveLength(0);
    expect(matcher.values).toEqual([]);
  });
});

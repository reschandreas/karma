import { render, fireEvent, act } from "@testing-library/react";

import { useFetchGetMock } from "__fixtures__/useFetchGet";
import { MockThemeContext } from "__fixtures__/Theme";
import {
  SilenceFormStore,
  NewEmptyMatcher,
  MatcherWithIDT,
} from "Stores/SilenceFormStore";
import { ThemeContext } from "Components/Theme";
import { OptionT, StringToOption } from "Common/Select";
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

const MountedLabelValueInput = (isValid: boolean) => {
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
    const { asFragment } = MountedLabelValueInput(true);
    expect(asFragment()).toMatchSnapshot();
  });

  it("fetches suggestions on mount", () => {
    const { asFragment } = MountedLabelValueInput(true);
    expect(asFragment()).toMatchSnapshot();
    expect(useFetchGetMock.fetch.calls).toHaveLength(1);
    expect(useFetchGetMock.fetch.calls[0]).toBe(
      "./labelValues.json?name=cluster",
    );
  });

  it("doesn't fetch suggestions if name is not set", () => {
    matcher.name = "";
    MountedLabelValueInput(true);
    expect(useFetchGetMock.fetch.calls).toHaveLength(0);
  });

  it("doesn't renders ValidationError after passed validation", () => {
    const { container } = MountedLabelValueInput(true);
    expect(container.innerHTML).not.toMatch(/fa-circle-exclamation/);
    expect(container.innerHTML).not.toMatch(/Required/);
  });

  it("renders ValidationError after failed validation", () => {
    const { container } = MountedLabelValueInput(false);
    expect(container.innerHTML).toMatch(/fa-circle-exclamation/);
    expect(container.innerHTML).toMatch(/Required/);
  });

  it("renders suggestions", () => {
    const { container } = MountedLabelValueInput(true);
    const input = container.querySelector("input")!;
    fireEvent.focus(input);
    fireEvent.keyDown(input, { key: "ArrowDown", keyCode: 40 });
    const options = container.querySelectorAll("div.react-select__option");
    expect(options).toHaveLength(3);
    expect(options[0].textContent).toBe("dev");
    expect(options[1].textContent).toBe("staging");
    expect(options[2].textContent).toBe("prod");
  });

  it("clicking on options appends them to matcher.values", () => {
    const { container } = MountedLabelValueInput(true);
    const input = container.querySelector("input")!;
    fireEvent.focus(input);
    fireEvent.keyDown(input, { key: "ArrowDown", keyCode: 40 });
    const options = container.querySelectorAll("div.react-select__option");
    fireEvent.click(options[0]);
    fireEvent.keyDown(input, { key: "ArrowDown", keyCode: 40 });
    const options2 = container.querySelectorAll("div.react-select__option");
    fireEvent.click(options2[0]);
    expect(matcher.values).toHaveLength(2);
    expect(matcher.values).toContainEqual(StringToOption("dev"));
    expect(matcher.values).toContainEqual(StringToOption("staging"));
  });

  it("selecting one option doesn't force matcher.isRegex=true", () => {
    const { container } = MountedLabelValueInput(true);
    fireEvent.change(container.querySelector("input")!, {
      target: { value: "f" },
    });
    expect(matcher.isRegex).toBe(false);
    const options = container.querySelectorAll("div.react-select__option");
    fireEvent.click(options[0]);
    expect(matcher.isRegex).toBe(false);
  });

  it("selecting one option when matcher.isRegex=true doesn't change it back to false", () => {
    matcher.isRegex = true;
    const { container } = MountedLabelValueInput(true);
    fireEvent.change(container.querySelector("input")!, {
      target: { value: "f" },
    });
    expect(matcher.isRegex).toBe(true);
    const options = container.querySelectorAll("div.react-select__option");
    fireEvent.click(options[0]);
    expect(matcher.isRegex).toBe(true);
  });

  it("selecting multiple options forces matcher.isRegex=true", () => {
    const { container } = MountedLabelValueInput(true);
    const input = container.querySelector("input")!;
    fireEvent.focus(input);
    fireEvent.keyDown(input, { key: "ArrowDown", keyCode: 40 });
    expect(matcher.isRegex).toBe(false);
    const options = container.querySelectorAll("div.react-select__option");
    fireEvent.click(options[0]);
    fireEvent.keyDown(input, { key: "ArrowDown", keyCode: 40 });
    const options2 = container.querySelectorAll("div.react-select__option");
    fireEvent.click(options2[0]);
    expect(matcher.isRegex).toBe(true);
  });

  it("creating a manual option sets wasCreated=true", () => {
    const { container } = MountedLabelValueInput(true);
    // Simulate creating a new option by typing and pressing Enter
    const input = container.querySelector("input")!;
    fireEvent.change(input, { target: { value: "foo" } });
    fireEvent.keyDown(input, { key: "Enter", keyCode: 13 });
    expect(matcher.values[0]).toMatchObject({
      label: "foo",
      value: "foo",
      wasCreated: true,
    });
  });

  it("removing last value sets matcher.values to []", () => {
    matcher.values = [StringToOption("dev"), StringToOption("staging")];
    const { container } = MountedLabelValueInput(true);

    fireEvent.click(
      container.querySelectorAll("div.react-select__multi-value__remove")[0],
    );
    expect(matcher.values).toHaveLength(1);

    fireEvent.click(
      container.querySelector("div.react-select__multi-value__remove")!,
    );
    expect(matcher.values).toHaveLength(0);
    expect(matcher.values).toEqual([]);
  });
});

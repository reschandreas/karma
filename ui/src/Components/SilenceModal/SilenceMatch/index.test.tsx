import { render, fireEvent } from "@testing-library/react";

import {
  SilenceFormStore,
  NewEmptyMatcher,
  MatcherWithIDT,
} from "Stores/SilenceFormStore";
import { StringToOption } from "Common/Select";
import SilenceMatch from ".";

let silenceFormStore: SilenceFormStore;
let matcher: MatcherWithIDT;

beforeEach(() => {
  silenceFormStore = new SilenceFormStore();
  matcher = NewEmptyMatcher();
});

const MockOnDelete = jest.fn();

const MountedLabelValueInput = () => {
  return render(
    <SilenceMatch
      matcher={matcher}
      silenceFormStore={silenceFormStore}
      showDelete={false}
      onDelete={MockOnDelete}
      isValid={true}
    />,
  );
};

describe("<SilenceMatch />", () => {
  it("allows changing matcher.isRegex value when matcher.values contains 1 element", () => {
    matcher.values = [StringToOption("foo")];
    const { container } = MountedLabelValueInput();
    expect(matcher.isRegex).toBe(false);
    const regex = container.querySelectorAll("input[type='checkbox']")[1];
    fireEvent.click(regex);
    expect(matcher.isRegex).toBe(true);
  });

  it("disallows changing matcher.isRegex value when matcher.values contains 2 elements", () => {
    matcher.isRegex = true;
    matcher.values = [StringToOption("foo"), StringToOption("bar")];
    const { container } = MountedLabelValueInput();
    expect(matcher.isRegex).toBe(true);
    const regex = container.querySelectorAll("input[type='checkbox']")[1];
    fireEvent.click(regex);
    expect(matcher.isRegex).toBe(true);
  });

  it("updates isEqual on click", () => {
    matcher.values = [StringToOption("foo")];
    const { container } = MountedLabelValueInput();
    expect(matcher.isEqual).toBe(true);
    const checkbox = container.querySelectorAll("input[type='checkbox']")[0];
    fireEvent.click(checkbox);
    expect(matcher.isEqual).toBe(false);
  });
});

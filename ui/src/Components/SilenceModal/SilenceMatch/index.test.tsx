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

<<<<<<< HEAD
const renderSilenceMatch = () => {
=======
const MountedLabelValueInput = () => {
>>>>>>> f2d4110a (upgrading to react 19)
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
<<<<<<< HEAD
    const { container } = renderSilenceMatch();
    expect(matcher.isRegex).toBe(false);
    const checkboxes = container.querySelectorAll("input[type='checkbox']");
    fireEvent.click(checkboxes[1]);
=======
    const { container } = MountedLabelValueInput();
    expect(matcher.isRegex).toBe(false);
    const regex = container.querySelectorAll("input[type='checkbox']")[1];
    fireEvent.click(regex);
>>>>>>> f2d4110a (upgrading to react 19)
    expect(matcher.isRegex).toBe(true);
  });

  it("disallows changing matcher.isRegex value when matcher.values contains 2 elements", () => {
    matcher.isRegex = true;
    matcher.values = [StringToOption("foo"), StringToOption("bar")];
<<<<<<< HEAD
    const { container } = renderSilenceMatch();
    expect(matcher.isRegex).toBe(true);
    const checkboxes = container.querySelectorAll("input[type='checkbox']");
    fireEvent.click(checkboxes[1]);
=======
    const { container } = MountedLabelValueInput();
    expect(matcher.isRegex).toBe(true);
    const regex = container.querySelectorAll("input[type='checkbox']")[1];
    fireEvent.click(regex);
>>>>>>> f2d4110a (upgrading to react 19)
    expect(matcher.isRegex).toBe(true);
  });

  it("updates isEqual on click", () => {
    matcher.values = [StringToOption("foo")];
<<<<<<< HEAD
    const { container } = renderSilenceMatch();
    expect(matcher.isEqual).toBe(true);
    const checkboxes = container.querySelectorAll("input[type='checkbox']");
    fireEvent.click(checkboxes[0]);
=======
    const { container } = MountedLabelValueInput();
    expect(matcher.isEqual).toBe(true);
    const checkbox = container.querySelectorAll("input[type='checkbox']")[0];
    fireEvent.click(checkbox);
>>>>>>> f2d4110a (upgrading to react 19)
    expect(matcher.isEqual).toBe(false);
  });
});

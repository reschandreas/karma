import { render, fireEvent } from "@testing-library/react";

import Select from "react-select";

import {
  ReactSelectColors,
  ReactSelectStyles,
} from "Components/Theme/ReactSelect";

const Option = (value: string) => ({ label: value, value: value });

const ThemedSelect = (props: any) => (
  <Select styles={ReactSelectStyles(ReactSelectColors.Light)} {...props} />
);

describe("<WrappedCustomMultiSelect />", () => {
  it("matches snapshot with isMulti=true", () => {
    const { asFragment } = render(<ThemedSelect isMulti />);
    expect(asFragment()).toMatchSnapshot();
  });

  it("matches snapshot when focused", () => {
    // this test is to cover styles state.isFocused conditions
    const { container, asFragment } = render(<ThemedSelect autoFocus />);
    fireEvent.focus(container.querySelector("input")!);
    expect(asFragment()).toMatchSnapshot();
  });

  it("matches snapshot when focused and disabled", () => {
    const { container, asFragment } = render(
      <ThemedSelect autoFocus isDisabled />,
    );
    fireEvent.focus(container.querySelector("input")!);
    expect(asFragment()).toMatchSnapshot();
  });

  it("matches snapshot with a value", () => {
    const { asFragment } = render(
      <ThemedSelect
        defaultValue={Option("foo")}
        options={[Option("foo"), Option("bar")]}
      />,
    );
    expect(asFragment()).toMatchSnapshot();
  });

  it("matches snapshot with isMulti=true and a value", () => {
    const { asFragment } = render(
      <ThemedSelect
        isMulti
        defaultValue={Option("foo")}
        options={[Option("foo"), Option("bar")]}
      />,
    );
    expect(asFragment()).toMatchSnapshot();
  });

  it("matches snapshot with isDisabled=true", () => {
    const { asFragment } = render(
      <ThemedSelect
        isDisabled
        defaultValue={Option("foo")}
        options={[Option("foo"), Option("bar")]}
      />,
    );
    expect(asFragment()).toMatchSnapshot();
  });
});

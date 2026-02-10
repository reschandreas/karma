import { render, fireEvent } from "@testing-library/react";

import { AlertStore, NewUnappliedFilter } from "Stores/AlertStore";

import LabelWithPercent from ".";

let alertStore: AlertStore;

beforeEach(() => {
  alertStore = new AlertStore([]);
});

const MountedLabelWithPercent = (
  name: string,
  value: string,
  hits: number,
  percent: number,
  offset: number,
  isActive: boolean,
) => {
  return render(
    <LabelWithPercent
      alertStore={alertStore}
      name={name}
      value={value}
      hits={hits}
      percent={percent}
      offset={offset}
      isActive={isActive}
    />,
  );
};

const RenderAndClick = (name: string, value: string, clickOptions?: any) => {
  const { container } = MountedLabelWithPercent(name, value, 25, 50, 0, false);
  const span = container.querySelector(
    ".components-label .components-label-value",
  );
  fireEvent.click(span!, clickOptions || {});
};

describe("<LabelWithPercent />", () => {
  it("matches snapshot with offset=0", () => {
    const { asFragment } = MountedLabelWithPercent(
      "foo",
      "bar",
      25,
      50,
      0,
      false,
    );
    expect(asFragment()).toMatchSnapshot();
  });

  it("matches snapshot with offset=25", () => {
    const { asFragment } = MountedLabelWithPercent(
      "foo",
      "bar",
      25,
      50,
      25,
      false,
    );
    expect(asFragment()).toMatchSnapshot();
  });

  it("matches snapshot with isActive=true", () => {
    const { asFragment } = MountedLabelWithPercent(
      "foo",
      "bar",
      25,
      50,
      0,
      true,
    );
    expect(asFragment()).toMatchSnapshot();
  });

  it("calling adds a new filter 'foo=bar'", () => {
    RenderAndClick("foo", "bar");
    expect(alertStore.filters.values).toHaveLength(1);
    expect(alertStore.filters.values).toContainEqual(
      NewUnappliedFilter("foo=bar"),
    );
  });

  it("clicking the X buttom removes label from filters", () => {
    const { container } = MountedLabelWithPercent(
      "foo",
      "bar",
      25,
      50,
      0,
      true,
    );
    const svg = container.querySelector(".components-label svg");
    fireEvent.click(svg!);
    expect(alertStore.filters.values).toHaveLength(0);
    expect(alertStore.filters.values).not.toContainEqual(
      NewUnappliedFilter("foo=bar"),
    );
  });

  it("calling onClick() while holding Alt key adds a new filter 'foo!=bar'", () => {
    RenderAndClick("foo", "bar", { altKey: true });
    expect(alertStore.filters.values).toHaveLength(1);
    expect(alertStore.filters.values).toContainEqual(
      NewUnappliedFilter("foo!=bar"),
    );
  });

  it("uses bg-danger when percent is >66", () => {
    const { container } = MountedLabelWithPercent(
      "foo",
      "bar",
      25,
      67,
      0,
      false,
    );
    expect(container.innerHTML).toMatch(/progress-bar bg-danger/);
  });

  it("uses bg-warning when percent is >33", () => {
    const { container } = MountedLabelWithPercent(
      "foo",
      "bar",
      25,
      66,
      0,
      false,
    );
    expect(container.innerHTML).toMatch(/progress-bar bg-warning/);
  });

  it("uses bg-success when percent is <=33", () => {
    const { container } = MountedLabelWithPercent(
      "foo",
      "bar",
      25,
      33,
      0,
      false,
    );
    expect(container.innerHTML).toMatch(/progress-bar bg-success/);
  });
});

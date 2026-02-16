import { render, fireEvent } from "@testing-library/react";

import copy from "copy-to-clipboard";

import { AlertStore, NewUnappliedFilter } from "Stores/AlertStore";

import FilteringLabel from ".";

let alertStore: AlertStore;

beforeEach(() => {
  alertStore = new AlertStore([]);
});

const MountedFilteringLabel = (name: string, value: string) => {
  return render(
    <FilteringLabel alertStore={alertStore} name={name} value={value} />,
  );
};

const RenderAndClick = (name: string, value: string, clickOptions?: any) => {
  const { container } = MountedFilteringLabel(name, value);
  const label = container.querySelector(".components-label")!;
  fireEvent.click(label, clickOptions || {});
};

describe("<FilteringLabel />", () => {
  it("matches snapshot", () => {
    const { asFragment } = render(
      <FilteringLabel alertStore={alertStore} name="foo" value="bar" />,
    );
    expect(asFragment()).toMatchSnapshot();
  });

  it("calling onClick() adds a new filter 'foo=bar'", () => {
    RenderAndClick("foo", "bar");
    expect(alertStore.filters.values).toHaveLength(1);
    expect(alertStore.filters.values).toContainEqual(
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

  it("calling onClick() multiple times appends extra filter 'baz=bar'", () => {
    RenderAndClick("foo", "bar");
    RenderAndClick("bar", "baz");
    expect(alertStore.filters.values).toHaveLength(2);
    expect(alertStore.filters.values).toContainEqual(
      NewUnappliedFilter("foo=bar"),
    );
    expect(alertStore.filters.values).toContainEqual(
      NewUnappliedFilter("bar=baz"),
    );
  });

  it("calling onClick() while holding Shift key copies label value to clipboard", () => {
    RenderAndClick("foo", "bar", { shiftKey: true });
    expect(copy).toHaveBeenCalledWith("bar");
  });

  it("label with dark background color should have 'components-label-dark' class", () => {
    alertStore.data.setColors({
      foo: {
        bar: {
          brightness: 125,
          background: "rgba(4,5,6,200)",
        },
      },
      ...alertStore.data.colors,
    });
    const { container } = MountedFilteringLabel("foo", "bar");
    const label = container.querySelector(".components-label");
    expect(label?.classList.contains("components-label-dark")).toBe(true);
  });

  it("label with bright background color should have 'components-label-bright' class", () => {
    alertStore.data.setColors({
      foo: {
        bar: {
          brightness: 200,
          background: "rgba(4,5,6,200)",
        },
      },
      ...alertStore.data.colors,
    });
    const { container } = MountedFilteringLabel("foo", "bar");
    const label = container.querySelector(".components-label");
    expect(label?.classList.contains("components-label-bright")).toBe(true);
  });

  it("doesn't render the name if it's included in valueOnlyLabels", () => {
    alertStore.settings.setValues({
      ...alertStore.settings.values,
      ...{
        labels: {
          foo: { isStatic: false, isValueOnly: true },
        },
      },
    });
    const { container } = render(
      <FilteringLabel alertStore={alertStore} name="foo" value="bar" />,
    );
    expect(container.textContent).toBe("bar");
  });

  it("renders the name if it's not included in valueOnlyLabels", () => {
    alertStore.settings.setValues({
      ...alertStore.settings.values,
      ...{
        labels: {
          bar: { isStatic: false, isValueOnly: true },
        },
      },
    });
    const { container } = render(
      <FilteringLabel alertStore={alertStore} name="foo" value="bar" />,
    );
    expect(container.textContent).toBe("foo: bar");
  });
});

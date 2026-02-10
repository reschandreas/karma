<<<<<<< HEAD
import { render, screen, fireEvent } from "@testing-library/react";
=======
import { render, fireEvent } from "@testing-library/react";
>>>>>>> f2d4110a (upgrading to react 19)

import copy from "copy-to-clipboard";

import { AlertStore, NewUnappliedFilter } from "Stores/AlertStore";

import FilteringLabel from ".";

let alertStore: AlertStore;

beforeEach(() => {
  alertStore = new AlertStore([]);
});

<<<<<<< HEAD
const renderFilteringLabel = (name: string, value: string) => {
=======
const MountedFilteringLabel = (name: string, value: string) => {
>>>>>>> f2d4110a (upgrading to react 19)
  return render(
    <FilteringLabel alertStore={alertStore} name={name} value={value} />,
  );
};

<<<<<<< HEAD
const renderAndClick = (name: string, value: string, clickOptions?: any) => {
  const { container } = renderFilteringLabel(name, value);
  const label = container.querySelector(".components-label");
  fireEvent.click(label!, clickOptions || {});
=======
const RenderAndClick = (name: string, value: string, clickOptions?: any) => {
  const { container } = MountedFilteringLabel(name, value);
  const label = container.querySelector(".components-label")!;
  fireEvent.click(label, clickOptions || {});
>>>>>>> f2d4110a (upgrading to react 19)
};

describe("<FilteringLabel />", () => {
  it("matches snapshot", () => {
    const { asFragment } = render(
      <FilteringLabel alertStore={alertStore} name="foo" value="bar" />,
    );
    expect(asFragment()).toMatchSnapshot();
  });

  it("calling onClick() adds a new filter 'foo=bar'", () => {
    renderAndClick("foo", "bar");
    expect(alertStore.filters.values).toHaveLength(1);
    expect(alertStore.filters.values).toContainEqual(
      NewUnappliedFilter("foo=bar"),
    );
  });

  it("calling onClick() while holding Alt key adds a new filter 'foo!=bar'", () => {
    renderAndClick("foo", "bar", { altKey: true });
    expect(alertStore.filters.values).toHaveLength(1);
    expect(alertStore.filters.values).toContainEqual(
      NewUnappliedFilter("foo!=bar"),
    );
  });

  it("calling onClick() multiple times appends extra filter 'baz=bar'", () => {
    renderAndClick("foo", "bar");
    renderAndClick("bar", "baz");
    expect(alertStore.filters.values).toHaveLength(2);
    expect(alertStore.filters.values).toContainEqual(
      NewUnappliedFilter("foo=bar"),
    );
    expect(alertStore.filters.values).toContainEqual(
      NewUnappliedFilter("bar=baz"),
    );
  });

  it("calling onClick() while holding Shift key copies label value to clipboard", () => {
    renderAndClick("foo", "bar", { shiftKey: true });
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
<<<<<<< HEAD
    const { container } = renderFilteringLabel("foo", "bar");
    expect(container.querySelector(".components-label")).toHaveClass(
      "components-label-dark",
    );
=======
    const { container } = MountedFilteringLabel("foo", "bar");
    const label = container.querySelector(".components-label");
    expect(label?.classList.contains("components-label-dark")).toBe(true);
>>>>>>> f2d4110a (upgrading to react 19)
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
<<<<<<< HEAD
    const { container } = renderFilteringLabel("foo", "bar");
    expect(container.querySelector(".components-label")).toHaveClass(
      "components-label-bright",
    );
=======
    const { container } = MountedFilteringLabel("foo", "bar");
    const label = container.querySelector(".components-label");
    expect(label?.classList.contains("components-label-bright")).toBe(true);
>>>>>>> f2d4110a (upgrading to react 19)
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
<<<<<<< HEAD
    render(<FilteringLabel alertStore={alertStore} name="foo" value="bar" />);
    expect(screen.getByText("bar")).toBeInTheDocument();
    expect(screen.queryByText("foo:")).not.toBeInTheDocument();
=======
    const { container } = render(
      <FilteringLabel alertStore={alertStore} name="foo" value="bar" />,
    );
    expect(container.textContent).toBe("bar");
>>>>>>> f2d4110a (upgrading to react 19)
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
<<<<<<< HEAD
    render(<FilteringLabel alertStore={alertStore} name="foo" value="bar" />);
    expect(screen.getByText("foo:")).toBeInTheDocument();
    expect(screen.getByText("bar")).toBeInTheDocument();
=======
    const { container } = render(
      <FilteringLabel alertStore={alertStore} name="foo" value="bar" />,
    );
    expect(container.textContent).toBe("foo: bar");
>>>>>>> f2d4110a (upgrading to react 19)
  });
});

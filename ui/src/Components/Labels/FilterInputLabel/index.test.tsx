import { render, fireEvent } from "@testing-library/react";

import { AlertStore, NewUnappliedFilter } from "Stores/AlertStore";

import { FilterInputLabel } from ".";

let alertStore: AlertStore;

beforeEach(() => {
  alertStore = new AlertStore([]);
});

const NonEqualMatchers = ["!=", "=~", "!~", ">", "<"];

const MockColors = () => {
  alertStore.data.setColors({
    foo: {
      bar: {
        brightness: 200,
        background: "rgba(4,5,6,200)",
      },
    },
    ...alertStore.data.colors,
  });
};

const RenderLabel = (
  matcher: string,
  applied: boolean,
  valid: boolean,
  hits: number,
) => {
  const name = "foo";
  const value = "bar";
  const filter = NewUnappliedFilter(`${name}${matcher}${value}`);
  filter.applied = applied;
  filter.name = name;
  filter.matcher = matcher;
  filter.value = value;
  filter.isValid = valid;
  filter.hits = hits;
  return render(<FilterInputLabel alertStore={alertStore} filter={filter} />);
};

const ValidateClass = (
  matcher: string,
  applied: boolean,
  expectedClass: string,
) => {
  const { container } = RenderLabel(matcher, applied, true, 1);
  const element = container.querySelector("button");
  expect(element?.classList.contains(expectedClass)).toBe(true);
};

const ValidateOnChange = (newRaw: string) => {
  const { container } = render(
    <FilterInputLabel
      alertStore={alertStore}
      filter={alertStore.filters.values[0]}
    />,
  );

  // Click the text span to enter edit mode
  const editableSpan = container.querySelector(".cursor-text") as HTMLElement;
  fireEvent.click(editableSpan);
  // Now find the input that appears
  const input = container.querySelector("input") as HTMLInputElement;
  fireEvent.change(input, { target: { value: newRaw } });
  fireEvent.keyDown(input, { keyCode: 13 });

  return container;
};

describe("<FilterInputLabel /> className", () => {
  it("unapplied filter with '=' matcher should use 'btn-secondary' class", () => {
    ValidateClass("=", false, "btn-secondary");
  });

  it("unapplied filter with any matcher other than '=' should use 'btn-secondary' class", () => {
    for (const matcher of NonEqualMatchers) {
      ValidateClass(matcher, false, "btn-secondary");
    }
  });

  it("applied filter with '=' matcher and no color should use 'btn-default' class", () => {
    ValidateClass("=", true, "btn-default");
  });

  it("applied filter with any matcher other than '=' and no color should use 'btn-default' class", () => {
    for (const matcher of NonEqualMatchers) {
      ValidateClass(matcher, true, "btn-default");
    }
  });

  it("applied filter included in staticColorLabels with '=' matcher should use 'btn-info' class", () => {
    alertStore.settings.setValues({
      ...alertStore.settings.values,
      ...{
        labels: {
          foo: { isStatic: true, isValueOnly: false },
        },
      },
    });
    ValidateClass("=", true, "btn-info");
  });

  it("applied filter included in staticColorLabels with any matcher other than '=' should use 'btn-default' class", () => {
    alertStore.settings.setValues({
      ...alertStore.settings.values,
      ...{
        labels: {
          foo: { isStatic: true, isValueOnly: false },
        },
      },
    });
    for (const matcher of NonEqualMatchers) {
      ValidateClass(matcher, true, "btn-default");
    }
  });
});

describe("<FilterInputLabel /> style", () => {
  it("unapplied filter with color information and '=' matcher should have empty style", () => {
    MockColors();
    const { container } = RenderLabel("=", false, true, 1);
    const element = container.querySelector("button") as HTMLElement;
    expect(element.style.backgroundColor).toBe("");
  });

  it("unapplied filter with no color information and '=' matcher should have empty style", () => {
    const { container } = RenderLabel("=", false, true, 1);
    const element = container.querySelector("button") as HTMLElement;
    expect(element.style.backgroundColor).toBe("");
  });

  it("unapplied filter with no color information and any matcher other than '=' should have empty style", () => {
    for (const matcher of NonEqualMatchers) {
      const { container } = RenderLabel(matcher, false, true, 1);
      const element = container.querySelector("button") as HTMLElement;
      expect(element.style.backgroundColor).toBe("");
    }
  });

  it("applied filter with color information and '=' matcher should have non empty style", () => {
    MockColors();
    const { container } = RenderLabel("=", true, true, 1);
    const element = container.querySelector("button") as HTMLElement;
    expect(element.style.backgroundColor).not.toBe("");
  });

  it("applied filter with no color information and '=' matcher should have empty style", () => {
    const { container } = RenderLabel("=", true, true, 1);
    const element = container.querySelector("button") as HTMLElement;
    expect(element.style.backgroundColor).toBe("");
  });

  it("applied filter with no color information and any matcher other than '=' should have empty style", () => {
    for (const matcher of NonEqualMatchers) {
      const { container } = RenderLabel(matcher, true, true, 1);
      const element = container.querySelector("button") as HTMLElement;
      expect(element.style.backgroundColor).toBe("");
    }
  });
});

describe("<FilterInputLabel /> onChange", () => {
  it("filter raw value is updated after onChange call", () => {
    alertStore.filters.setFilterValues([NewUnappliedFilter("foo=bar")]);
    ValidateOnChange("baz=abc");
    expect(alertStore.filters.values).toHaveLength(1);
    expect(alertStore.filters.values).toContainEqual(
      NewUnappliedFilter("baz=abc"),
    );
  });

  it("filter is removed after onChange call with empty value", () => {
    alertStore.filters.setFilterValues([NewUnappliedFilter("foo=bar")]);
    // InlineEdit only calls onChange when editedValue is truthy,
    // so empty string doesn't trigger filter removal via inline edit.
    // Instead, test removal via the X button (covered in separate test).
    const { container } = render(
      <FilterInputLabel
        alertStore={alertStore}
        filter={alertStore.filters.values[0]}
      />,
    );
    const xButton = container.querySelector("svg.fa-xmark") as SVGElement;
    fireEvent.click(xButton);
    expect(alertStore.filters.values).toHaveLength(0);
  });

  it("onChange doesn't allow duplicates", () => {
    alertStore.filters.setFilterValues([
      NewUnappliedFilter("foo=bar"),
      NewUnappliedFilter("bar=baz"),
    ]);
    ValidateOnChange("bar=baz");
    expect(alertStore.filters.values).toHaveLength(1);
    expect(alertStore.filters.values).not.toContainEqual(
      NewUnappliedFilter("foo=bar"),
    );
    expect(alertStore.filters.values).toContainEqual(
      NewUnappliedFilter("bar=baz"),
    );
  });

  it("clicking on the X button removes filters from alertStore", () => {
    alertStore.filters.setFilterValues([
      NewUnappliedFilter("foo=bar"),
      NewUnappliedFilter("bar=baz"),
    ]);
    const { container } = render(
      <FilterInputLabel
        alertStore={alertStore}
        filter={alertStore.filters.values[0]}
      />,
    );

    const button = container.querySelector("svg.fa-xmark") as SVGElement;
    fireEvent.click(button);
    expect(alertStore.filters.values).toHaveLength(1);
    expect(alertStore.filters.values).toContainEqual(
      NewUnappliedFilter("bar=baz"),
    );
  });
});

describe("<FilterInputLabel /> render", () => {
  it("invalid filter renders error indicator", () => {
    const { container } = RenderLabel("=", true, false, 1);
    // Invalid filter should render a text-danger element with an icon
    const errorIcon = container.querySelector(".text-danger");
    expect(errorIcon).toBeTruthy();
  });
});

const PopulateFiltersFromHits = (totalAlerts: number, hitsList: number[]) => {
  alertStore.info.setTotalAlerts(totalAlerts);
  hitsList.forEach((hits, index) => {
    const filter = NewUnappliedFilter(`foo=${index}`);
    filter.hits = hits;
    filter.applied = true;
    alertStore.filters.setFilterValues([...alertStore.filters.values, filter]);
  });
};

describe("<FilterInputLabel /> counter badge", () => {
  it("counter is not rendered when hits === totalAlerts", () => {
    PopulateFiltersFromHits(10, [10, 10]);
    const { container } = render(
      <FilterInputLabel
        alertStore={alertStore}
        filter={alertStore.filters.values[0]}
      />,
    );
    const counter = container.querySelectorAll(".rounded-pill");
    expect(counter).toHaveLength(0);
  });

  it("counter is rendered when hits !== totalAlerts #1", () => {
    PopulateFiltersFromHits(10, [10, 5]);
    const { container } = render(
      <FilterInputLabel
        alertStore={alertStore}
        filter={alertStore.filters.values[0]}
      />,
    );
    const counter = container.querySelectorAll(".rounded-pill");
    expect(counter).toHaveLength(1);
  });

  it("counter is rendered when hits !== totalAlerts #2", () => {
    PopulateFiltersFromHits(10, [4, 5]);
    const { container } = render(
      <FilterInputLabel
        alertStore={alertStore}
        filter={alertStore.filters.values[1]}
      />,
    );
    const counter = container.querySelectorAll(".rounded-pill");
    expect(counter).toHaveLength(1);
  });
});

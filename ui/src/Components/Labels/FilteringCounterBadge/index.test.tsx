import { render, fireEvent } from "@testing-library/react";

import { AlertStore, NewUnappliedFilter } from "Stores/AlertStore";
import { QueryOperators } from "Common/Query";
import FilteringCounterBadge from ".";

let alertStore: AlertStore;

beforeEach(() => {
  alertStore = new AlertStore([]);
});

const validateClassName = (
  value: string,
  className: string,
  themed: boolean,
) => {
  const { container } = render(
    <FilteringCounterBadge
      alertStore={alertStore}
      name="@state"
      value={value}
      counter={1}
      themed={themed}
    />,
  );
  expect(container.querySelector("span")?.classList.contains(className)).toBe(true);
};

const validateStyle = (value: string, themed: boolean) => {
  const { container } = render(
    <FilteringCounterBadge
      alertStore={alertStore}
      name="@state"
      value={value}
      counter={1}
      themed={themed}
    />,
  );
  const span = container.querySelector("span") as HTMLElement;
  expect(span.style.backgroundColor).toBe("");
};

const validateOnClick = (
  value: string,
  themed: boolean,
  isNegative: boolean,
  isAppend: boolean,
) => {
  alertStore.filters.setFilterValues([NewUnappliedFilter("foo=bar")]);
  const { container } = render(
    <FilteringCounterBadge
      alertStore={alertStore}
      name="@state"
      value={value}
      counter={1}
      themed={themed}
      isAppend={isAppend}
    />,
  );
  const label = container.querySelector(".components-label")!;
  fireEvent.click(label, { altKey: isNegative ? true : false });
  expect(alertStore.filters.values).toHaveLength(isAppend ? 2 : 1);
  if (isAppend) {
    expect(alertStore.filters.values).toContainEqual(
      NewUnappliedFilter("foo=bar"),
    );
  }
  expect(alertStore.filters.values).toContainEqual(
    NewUnappliedFilter(
      `@state${
        isNegative ? QueryOperators.NotEqual : QueryOperators.Equal
      }${value}`,
    ),
  );
};

describe("<FilteringCounterBadge />", () => {
  it("themed @state=unprocessed counter badge should have className 'bg-secondary'", () => {
    validateClassName("unprocessed", "bg-secondary", true);
  });
  it("themed @state=active counter badge should have className 'bg-secondary'", () => {
    validateClassName("active", "bg-danger", true);
  });
  it("themed @state=suppressed counter badge should have className 'bg-secondary'", () => {
    validateClassName("suppressed", "bg-success", true);
  });
  it("unthemed @state=suppressed counter badge should have className 'bg-light'", () => {
    validateClassName("suppressed", "bg-light", false);
  });

  it("@state=unprocessed counter badge should have empty style", () => {
    validateStyle("unprocessed", true);
  });
  it("@state=active counter badge should have empty style", () => {
    validateStyle("active", true);
  });
  it("@state=suppressed counter badge should have empty style", () => {
    validateStyle("suppressed", true);
  });

  it("counter badge should have correct children based on the counter prop value", () => {
    const { container } = render(
      <FilteringCounterBadge
        alertStore={alertStore}
        name="@state"
        value="active"
        counter={123}
        themed={true}
      />,
    );
    expect(container.textContent).toBe("123");
  });

  for (const state of ["unprocessed", "active", "suppressed"]) {
    it(`click on @state=${state} counter badge should add a new filter`, () => {
      validateOnClick(state, true, false, true);
    });
    it(`alt+click method on @state=${state} counter badge should add a new negative filter`, () => {
      validateOnClick(state, true, true, true);
    });

    it(`click on @state=${state} counter badge when isAppend=false should replace filters`, () => {
      validateOnClick(state, true, false, false);
    });
    it(`alt+click method on @state=${state} counter badge when isAppend=false should replace filters with a negative one`, () => {
      validateOnClick(state, true, true, false);
    });
  }
});

import { render } from "@testing-library/react";

import { AlertStore } from "Stores/AlertStore";

import HistoryLabel from ".";

let alertStore: AlertStore;

beforeEach(() => {
  alertStore = new AlertStore([]);
});

const RenderHistoryLabel = (name: string, matcher: string, value: string) => {
  return render(
    <HistoryLabel
      alertStore={alertStore}
      name={name}
      matcher={matcher}
      value={value}
    />,
  );
};

describe("<HistoryLabel />", () => {
  it("renders name, matcher and value if all are set", () => {
    const { container } = RenderHistoryLabel("foo", "=", "bar");
    expect(container.textContent).toBe("foo=bar");
  });

  it("renders only value if name is falsey", () => {
    const { container } = render(
      <HistoryLabel alertStore={alertStore} name="" matcher="" value="bar" />,
    );
    expect(container.textContent).toBe("bar");
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
    const { container } = RenderHistoryLabel("foo", "=", "bar");
    expect(
      container
        .querySelector(".components-label")
        ?.classList.contains("components-label-dark"),
    ).toBe(true);
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
    const { container } = RenderHistoryLabel("foo", "=", "bar");
    expect(
      container
        .querySelector(".components-label")
        ?.classList.contains("components-label-bright"),
    ).toBe(true);
  });
});

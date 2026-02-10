<<<<<<< HEAD
import { render, screen } from "@testing-library/react";
=======
import { render } from "@testing-library/react";
>>>>>>> f2d4110a (upgrading to react 19)

import { AlertStore } from "Stores/AlertStore";

import HistoryLabel from ".";

let alertStore: AlertStore;

beforeEach(() => {
  alertStore = new AlertStore([]);
});

<<<<<<< HEAD
const renderHistoryLabel = (name: string, matcher: string, value: string) => {
=======
const RenderHistoryLabel = (name: string, matcher: string, value: string) => {
>>>>>>> f2d4110a (upgrading to react 19)
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
<<<<<<< HEAD
    renderHistoryLabel("foo", "=", "bar");
    expect(screen.getByText("foo=bar")).toBeInTheDocument();
  });

  it("renders only value if name is falsey", () => {
    render(
      <HistoryLabel alertStore={alertStore} name="" matcher="" value="bar" />,
    );
    expect(screen.getByText("bar")).toBeInTheDocument();
=======
    const { container } = RenderHistoryLabel("foo", "=", "bar");
    expect(container.textContent).toBe("foo=bar");
  });

  it("renders only value if name is falsey", () => {
    const { container } = render(
      <HistoryLabel alertStore={alertStore} name="" matcher="" value="bar" />,
    );
    expect(container.textContent).toBe("bar");
>>>>>>> f2d4110a (upgrading to react 19)
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
    renderHistoryLabel("foo", "=", "bar");
    expect(
      screen.getByText("foo=bar").closest(".components-label"),
    ).toHaveClass("components-label-dark");
=======
    const { container } = RenderHistoryLabel("foo", "=", "bar");
    expect(
      container
        .querySelector(".components-label")
        ?.classList.contains("components-label-dark"),
    ).toBe(true);
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
    renderHistoryLabel("foo", "=", "bar");
    expect(
      screen.getByText("foo=bar").closest(".components-label"),
    ).toHaveClass("components-label-bright");
=======
    const { container } = RenderHistoryLabel("foo", "=", "bar");
    expect(
      container
        .querySelector(".components-label")
        ?.classList.contains("components-label-bright"),
    ).toBe(true);
>>>>>>> f2d4110a (upgrading to react 19)
  });
});

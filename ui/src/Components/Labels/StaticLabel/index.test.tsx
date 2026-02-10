import { render } from "@testing-library/react";

import { AlertStore } from "Stores/AlertStore";

import StaticLabel from ".";

let alertStore: AlertStore;

beforeEach(() => {
  alertStore = new AlertStore([]);
});

<<<<<<< HEAD
const renderStaticLabel = () => {
=======
const MountedStaticLabel = () => {
>>>>>>> f2d4110a (upgrading to react 19)
  return render(<StaticLabel alertStore={alertStore} name="foo" value="bar" />);
};

describe("<StaticLabel />", () => {
  it("matches snapshot", () => {
<<<<<<< HEAD
    const { asFragment } = renderStaticLabel();
=======
    const { asFragment } = MountedStaticLabel();
>>>>>>> f2d4110a (upgrading to react 19)
    expect(asFragment()).toMatchSnapshot();
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
    const { container } = renderStaticLabel();
    expect(container.querySelector(".components-label")).toHaveClass(
      "components-label-dark",
    );
=======
    const { container } = MountedStaticLabel();
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
    const { container } = renderStaticLabel();
    expect(container.querySelector(".components-label")).toHaveClass(
      "components-label-bright",
    );
=======
    const { container } = MountedStaticLabel();
    expect(
      container
        .querySelector(".components-label")
        ?.classList.contains("components-label-bright"),
    ).toBe(true);
>>>>>>> f2d4110a (upgrading to react 19)
  });
});

<<<<<<< HEAD
import { render, fireEvent } from "@testing-library/react";
=======
import { render, fireEvent, act } from "@testing-library/react";
>>>>>>> f2d4110a (upgrading to react 19)

import { PageSelect } from ".";

let originalInnerWidth: number;

declare let global: any;

beforeAll(() => {
  originalInnerWidth = global.innerWidth;
});

beforeEach(() => {
  global.innerWidth = originalInnerWidth;
});

afterEach(() => {
  global.innerWidth = originalInnerWidth;
});

describe("<PageSelect />", () => {
  it("calls setPageCallback on arrow key press", () => {
    const setPageCallback = jest.fn();

    const { container } = render(
      <PageSelect
        totalPages={4}
        maxPerPage={5}
        totalItemsCount={17}
        setPageCallback={setPageCallback}
      />,
    );
<<<<<<< HEAD
    fireEvent.focus(container.firstChild as Element);
=======
>>>>>>> f2d4110a (upgrading to react 19)

    // react-hotkeys-hook listens on keydown with key names
    const pressKey = (key: string, code: string) => {
      act(() => {
        document.dispatchEvent(
          new KeyboardEvent("keydown", {
            key,
            code,
            bubbles: true,
          }),
        );
        document.dispatchEvent(
          new KeyboardEvent("keyup", {
            key,
            code,
            bubbles: true,
          }),
        );
      });
    };

    pressKey("ArrowRight", "ArrowRight");
    expect(setPageCallback).toHaveBeenLastCalledWith(2);

    pressKey("ArrowRight", "ArrowRight");
    expect(setPageCallback).toHaveBeenLastCalledWith(3);

    pressKey("ArrowRight", "ArrowRight");
    expect(setPageCallback).toHaveBeenLastCalledWith(4);

    pressKey("ArrowRight", "ArrowRight");
    expect(setPageCallback).toHaveBeenLastCalledWith(4);

    pressKey("ArrowLeft", "ArrowLeft");
    expect(setPageCallback).toHaveBeenLastCalledWith(3);

    pressKey("ArrowLeft", "ArrowLeft");
    expect(setPageCallback).toHaveBeenLastCalledWith(2);

    pressKey("ArrowLeft", "ArrowLeft");
    expect(setPageCallback).toHaveBeenLastCalledWith(1);

    pressKey("ArrowLeft", "ArrowLeft");
    expect(setPageCallback).toHaveBeenLastCalledWith(1);
  });

  it("calls setPageCallback on button press", () => {
    const setPageCallback = jest.fn();

    const { container } = render(
      <PageSelect
        totalPages={15}
        maxPerPage={5}
        totalItemsCount={15 * 5}
        setPageCallback={setPageCallback}
      />,
    );
<<<<<<< HEAD
    fireEvent.focus(container.firstChild as Element);
=======

    const getButtons = () =>
      container.querySelectorAll<HTMLButtonElement>("button.page-link");
>>>>>>> f2d4110a (upgrading to react 19)

    for (const elem of [
      { index: 0, page: 1, label: "" },
      { index: 1, page: 1, label: "" },
      { index: 2, page: 1, label: "1" },
      { index: 3, page: 2, label: "2" },
      { index: 4, page: 3, label: "3" },
      { index: 5, page: 4, label: "4" },
      { index: 4, page: 4, label: "4" },
      { index: 0, page: 1, label: "" },
      { index: 6, page: 5, label: "5" },
      { index: 7, page: 6, label: "" },
      { index: 1, page: 5, label: "" },
      { index: 8, page: 15, label: "" },
    ]) {
<<<<<<< HEAD
      const buttons = container.querySelectorAll("button.page-link");
=======
      const buttons = getButtons();
>>>>>>> f2d4110a (upgrading to react 19)
      expect(buttons[elem.index].textContent).toBe(elem.label);
      fireEvent.click(buttons[elem.index]);
      expect(setPageCallback).toHaveBeenLastCalledWith(elem.page);
    }
  });

  it("doesn't render anything if totalItemsCount <= maxPerPage", () => {
    global.innerWidth = 1024;
    const { container } = render(
      <PageSelect
        totalPages={1}
        maxPerPage={5}
        totalItemsCount={5}
        setPageCallback={jest.fn()}
      />,
    );
    expect(container.querySelectorAll(".page-link")).toHaveLength(0);
  });

  it("renders 5 page range on desktop", () => {
    global.innerWidth = 1024;
    const { container } = render(
      <PageSelect
        totalPages={7}
        maxPerPage={5}
        totalItemsCount={35}
        setPageCallback={jest.fn()}
      />,
    );
    expect(container.querySelectorAll(".page-link")).toHaveLength(7);
  });

  it("renders 3 page range on mobile", () => {
    global.innerWidth = 760;
    const { container } = render(
      <PageSelect
        totalPages={7}
        maxPerPage={5}
        totalItemsCount={35}
        setPageCallback={jest.fn()}
      />,
    );
    expect(container.querySelectorAll(".page-link")).toHaveLength(5);
  });

  it("resets page if activePage >= totalPages", () => {
    const setPageCallback = jest.fn();
    const { container, rerender } = render(
      <PageSelect
        initialPage={3}
        totalPages={7}
        maxPerPage={5}
        totalItemsCount={35}
        setPageCallback={setPageCallback}
      />,
    );
<<<<<<< HEAD
    expect(
      container.querySelectorAll(".page-item")[3].classList.contains("active"),
    ).toBe(true);
=======
    const pageItems = container.querySelectorAll(".page-item");
    expect(pageItems[3].classList.contains("active")).toBe(true);
>>>>>>> f2d4110a (upgrading to react 19)

    rerender(
      <PageSelect
        initialPage={3}
        totalPages={2}
        maxPerPage={5}
<<<<<<< HEAD
        totalItemsCount={35}
        setPageCallback={setPageCallback}
      />,
    );
    expect(
      container.querySelectorAll(".page-item")[2].classList.contains("active"),
    ).toBe(true);
=======
        totalItemsCount={10}
        setPageCallback={setPageCallback}
      />,
    );
    const updatedPageItems = container.querySelectorAll(".page-item");
    expect(updatedPageItems[2].classList.contains("active")).toBe(true);
>>>>>>> f2d4110a (upgrading to react 19)
    expect(setPageCallback).toHaveBeenLastCalledWith(2);

    rerender(
      <PageSelect
        initialPage={3}
        totalPages={5}
        maxPerPage={5}
<<<<<<< HEAD
        totalItemsCount={35}
        setPageCallback={setPageCallback}
      />,
    );
    expect(
      container.querySelectorAll(".page-item")[2].classList.contains("active"),
    ).toBe(true);
=======
        totalItemsCount={25}
        setPageCallback={setPageCallback}
      />,
    );
    const finalPageItems = container.querySelectorAll(".page-item");
    expect(finalPageItems[2].classList.contains("active")).toBe(true);
>>>>>>> f2d4110a (upgrading to react 19)
  });
});

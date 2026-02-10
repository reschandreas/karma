import { render, fireEvent, act } from "@testing-library/react";

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

    const getButtons = () =>
      container.querySelectorAll<HTMLButtonElement>("button.page-link");

    for (const elem of [
      { index: 0, page: 1, label: "" }, // <<
      { index: 1, page: 1, label: "" }, // <
      { index: 2, page: 1, label: "1" }, // <<12345>> -> <<12345>>
      { index: 3, page: 2, label: "2" }, // <<12345>> -> <<12345>>
      { index: 4, page: 3, label: "3" }, // <<12345>> -> <<12345>>
      { index: 5, page: 4, label: "4" }, // <<12345>> -> <<23456>>
      { index: 4, page: 4, label: "4" }, //  <<23456>> -> <<23456>>
      { index: 0, page: 1, label: "" }, //  <<23456>> -> <<12345>>
      { index: 6, page: 5, label: "5" }, //  <<12345>> -> <<34567>>
      { index: 7, page: 6, label: "" }, //  <<34567>> -> <<45678>>
      { index: 1, page: 5, label: "" }, //  <<34567>> -> <<23456>>
      { index: 8, page: 15, label: "" }, //  <<23456>> -> <<end>>
    ]) {
      const buttons = getButtons();
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
    const pageItems = container.querySelectorAll(".page-item");
    expect(pageItems[3].classList.contains("active")).toBe(true);

    rerender(
      <PageSelect
        initialPage={3}
        totalPages={2}
        maxPerPage={5}
        totalItemsCount={10}
        setPageCallback={setPageCallback}
      />,
    );
    const updatedPageItems = container.querySelectorAll(".page-item");
    expect(updatedPageItems[2].classList.contains("active")).toBe(true);
    expect(setPageCallback).toHaveBeenLastCalledWith(2);

    rerender(
      <PageSelect
        initialPage={3}
        totalPages={5}
        maxPerPage={5}
        totalItemsCount={25}
        setPageCallback={setPageCallback}
      />,
    );
    const finalPageItems = container.querySelectorAll(".page-item");
    expect(finalPageItems[2].classList.contains("active")).toBe(true);
  });
});

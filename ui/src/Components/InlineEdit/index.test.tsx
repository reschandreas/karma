import { render, fireEvent, screen, act } from "@testing-library/react";

import { InlineEdit } from ".";

describe("<InlineEdit />", () => {
  it("renders span by default", () => {
    const { container } = render(
      <InlineEdit value="foo" onChange={jest.fn()} />,
    );
    expect(container.innerHTML).toBe('<span tabindex="0">foo</span>');
  });

  it("renders input after click", () => {
    const { container } = render(
      <InlineEdit value="foo" onChange={jest.fn()} />,
    );
    fireEvent.click(container.querySelector("span")!);
    expect(container.querySelector("input")).toBeTruthy();
    expect(container.querySelector("input")!.value).toBe("foo");
  });

  it("edit mode start calls onEnterEditing", () => {
    const onEnterEditing = jest.fn();
    const { container } = render(
      <InlineEdit
        value="foo"
        onChange={jest.fn()}
        onEnterEditing={onEnterEditing}
      />,
    );

    expect(onEnterEditing).not.toHaveBeenCalled();

    fireEvent.click(container.querySelector("span")!);
    expect(container.querySelector("input")).toBeTruthy();
    expect(onEnterEditing).toHaveBeenCalled();
  });

  it("edit mode finish calls onExitEditing", () => {
    const onExitEditing = jest.fn();
    const { container } = render(
      <div id="root">
        <button>click me</button>
        <InlineEdit
          value="foo"
          onChange={jest.fn()}
          onExitEditing={onExitEditing}
        />
      </div>,
    );

    expect(onExitEditing).not.toHaveBeenCalled();

    fireEvent.click(container.querySelector("span")!);
    expect(onExitEditing).not.toHaveBeenCalled();

    act(() => {
      document.dispatchEvent(
        new Event("mousedown", {
          bubbles: true,
        }),
      );
    });
    expect(container.innerHTML).not.toMatch(/<input/);
    expect(onExitEditing).toHaveBeenCalled();
  });

  it("cancels edits after click outside", () => {
    const { container } = render(
      <div id="root">
        <button>click me</button>
        <InlineEdit value="foo" onChange={jest.fn()} />
      </div>,
    );

    fireEvent.click(container.querySelector("span")!);
    expect(container.innerHTML).toMatch(/<input/);

    act(() => {
      document.dispatchEvent(
        new Event("mousedown", {
          bubbles: true,
        }),
      );
    });
    expect(container.innerHTML).not.toMatch(/<input/);
  });

  it("typing in the input changes value", () => {
    const { container } = render(
      <InlineEdit value="foo" onChange={jest.fn()} />,
    );

    fireEvent.click(container.querySelector("span")!);
    expect(container.innerHTML).toMatch(/<input/);

    fireEvent.change(container.querySelector("input")!, {
      target: { value: "bar" },
    });
    expect(container.querySelector("input")!.value).toBe("bar");
  });

  it("enter calls onChange if value was edited", () => {
    const onChange = jest.fn();
    const { container } = render(
      <InlineEdit value="foo" onChange={onChange} />,
    );

    fireEvent.click(container.querySelector("span")!);
    expect(container.innerHTML).toMatch(/<input/);

    fireEvent.change(container.querySelector("input")!, {
      target: { value: "bar" },
    });
    expect(container.querySelector("input")!.value).toBe("bar");

    fireEvent.keyDown(container.querySelector("input")!, { keyCode: 13 });
    expect(onChange).toHaveBeenCalledWith("bar");
  });

  it("enter doesn't call onChange if value was not edited", () => {
    const onChange = jest.fn();
    const { container } = render(
      <InlineEdit value="foo" onChange={onChange} />,
    );

    fireEvent.click(container.querySelector("span")!);
    expect(container.innerHTML).toMatch(/<input/);

    fireEvent.keyDown(container.querySelector("input")!, { keyCode: 13 });
    expect(onChange).not.toHaveBeenCalled();
  });

  it("esc cancels edit mode", () => {
    const onChange = jest.fn();
    const { container } = render(
      <InlineEdit value="foo" onChange={onChange} />,
    );

    fireEvent.click(container.querySelector("span")!);
    expect(container.innerHTML).toMatch(/<input/);

    fireEvent.keyDown(container.querySelector("input")!, { keyCode: 27 });
    expect(container.innerHTML).not.toMatch(/<input/);
    expect(onChange).not.toHaveBeenCalled();
  });

  it("unknown keyDown does nothing", () => {
    const onChange = jest.fn();
    const { container } = render(
      <InlineEdit value="foo" onChange={onChange} />,
    );

    fireEvent.click(container.querySelector("span")!);
    expect(container.innerHTML).toMatch(/<input/);

    fireEvent.keyDown(container.querySelector("input")!, { keyCode: 45 });
    expect(container.innerHTML).toMatch(/<input/);
    expect(onChange).not.toHaveBeenCalled();
  });
});

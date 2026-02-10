<<<<<<< HEAD
import { act } from "react-dom/test-utils";

import { render, screen, fireEvent } from "@testing-library/react";
=======
import { render, fireEvent, screen, act } from "@testing-library/react";
>>>>>>> f2d4110a (upgrading to react 19)

import { InlineEdit } from ".";

describe("<InlineEdit />", () => {
  it("renders span by default", () => {
<<<<<<< HEAD
    render(<InlineEdit value="foo" onChange={jest.fn()} />);
    expect(screen.getByText("foo")).toBeInTheDocument();
    expect(screen.getByText("foo").tagName).toBe("SPAN");
  });

  it("renders input after click", () => {
    render(<InlineEdit value="foo" onChange={jest.fn()} />);
    fireEvent.click(screen.getByText("foo"));
    expect(screen.getByRole("textbox")).toBeInTheDocument();
    expect(screen.getByRole("textbox")).toHaveValue("foo");
=======
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
>>>>>>> f2d4110a (upgrading to react 19)
  });

  it("edit mode start calls onEnterEditing", () => {
    const onEnterEditing = jest.fn();
<<<<<<< HEAD
    render(
=======
    const { container } = render(
>>>>>>> f2d4110a (upgrading to react 19)
      <InlineEdit
        value="foo"
        onChange={jest.fn()}
        onEnterEditing={onEnterEditing}
      />,
    );

    expect(onEnterEditing).not.toHaveBeenCalled();

<<<<<<< HEAD
    fireEvent.click(screen.getByText("foo"));
    expect(screen.getByRole("textbox")).toBeInTheDocument();
=======
    fireEvent.click(container.querySelector("span")!);
    expect(container.querySelector("input")).toBeTruthy();
>>>>>>> f2d4110a (upgrading to react 19)
    expect(onEnterEditing).toHaveBeenCalled();
  });

  it("edit mode finish calls onExitEditing", () => {
    const onExitEditing = jest.fn();
<<<<<<< HEAD
    render(
=======
    const { container } = render(
>>>>>>> f2d4110a (upgrading to react 19)
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

<<<<<<< HEAD
    fireEvent.click(screen.getByText("foo"));
    expect(onExitEditing).not.toHaveBeenCalled();

    act(() => {
      document.dispatchEvent(new Event("mousedown"));
    });
    expect(screen.queryByRole("textbox")).not.toBeInTheDocument();
=======
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
>>>>>>> f2d4110a (upgrading to react 19)
    expect(onExitEditing).toHaveBeenCalled();
  });

  it("cancels edits after click outside", () => {
<<<<<<< HEAD
    render(
=======
    const { container } = render(
>>>>>>> f2d4110a (upgrading to react 19)
      <div id="root">
        <button>click me</button>
        <InlineEdit value="foo" onChange={jest.fn()} />
      </div>,
    );

<<<<<<< HEAD
    fireEvent.click(screen.getByText("foo"));
    expect(screen.getByRole("textbox")).toBeInTheDocument();

    act(() => {
      document.dispatchEvent(new Event("mousedown"));
    });
    expect(screen.queryByRole("textbox")).not.toBeInTheDocument();
  });

  it("typing in the input changes value", () => {
    render(<InlineEdit value="foo" onChange={jest.fn()} />);

    fireEvent.click(screen.getByText("foo"));
    expect(screen.getByRole("textbox")).toBeInTheDocument();

    fireEvent.change(screen.getByRole("textbox"), { target: { value: "bar" } });
    expect(screen.getByRole("textbox")).toHaveValue("bar");
=======
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
>>>>>>> f2d4110a (upgrading to react 19)
  });

  it("enter calls onChange if value was edited", () => {
    const onChange = jest.fn();
<<<<<<< HEAD
    render(<InlineEdit value="foo" onChange={onChange} />);

    fireEvent.click(screen.getByText("foo"));
    expect(screen.getByRole("textbox")).toBeInTheDocument();

    fireEvent.change(screen.getByRole("textbox"), { target: { value: "bar" } });
    expect(screen.getByRole("textbox")).toHaveValue("bar");

    fireEvent.keyDown(screen.getByRole("textbox"), { keyCode: 13 });
=======
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
>>>>>>> f2d4110a (upgrading to react 19)
    expect(onChange).toHaveBeenCalledWith("bar");
  });

  it("enter doesn't call onChange if value was not edited", () => {
    const onChange = jest.fn();
<<<<<<< HEAD
    render(<InlineEdit value="foo" onChange={onChange} />);

    fireEvent.click(screen.getByText("foo"));
    expect(screen.getByRole("textbox")).toBeInTheDocument();

    fireEvent.keyDown(screen.getByRole("textbox"), { keyCode: 13 });
=======
    const { container } = render(
      <InlineEdit value="foo" onChange={onChange} />,
    );

    fireEvent.click(container.querySelector("span")!);
    expect(container.innerHTML).toMatch(/<input/);

    fireEvent.keyDown(container.querySelector("input")!, { keyCode: 13 });
>>>>>>> f2d4110a (upgrading to react 19)
    expect(onChange).not.toHaveBeenCalled();
  });

  it("esc cancels edit mode", () => {
    const onChange = jest.fn();
<<<<<<< HEAD
    render(<InlineEdit value="foo" onChange={onChange} />);

    fireEvent.click(screen.getByText("foo"));
    expect(screen.getByRole("textbox")).toBeInTheDocument();

    fireEvent.keyDown(screen.getByRole("textbox"), { keyCode: 27 });
    expect(screen.queryByRole("textbox")).not.toBeInTheDocument();
=======
    const { container } = render(
      <InlineEdit value="foo" onChange={onChange} />,
    );

    fireEvent.click(container.querySelector("span")!);
    expect(container.innerHTML).toMatch(/<input/);

    fireEvent.keyDown(container.querySelector("input")!, { keyCode: 27 });
    expect(container.innerHTML).not.toMatch(/<input/);
>>>>>>> f2d4110a (upgrading to react 19)
    expect(onChange).not.toHaveBeenCalled();
  });

  it("unknown keyDown does nothing", () => {
    const onChange = jest.fn();
<<<<<<< HEAD
    render(<InlineEdit value="foo" onChange={onChange} />);

    fireEvent.click(screen.getByText("foo"));
    expect(screen.getByRole("textbox")).toBeInTheDocument();

    fireEvent.keyDown(screen.getByRole("textbox"), { keyCode: 45 });
    expect(screen.getByRole("textbox")).toBeInTheDocument();
=======
    const { container } = render(
      <InlineEdit value="foo" onChange={onChange} />,
    );

    fireEvent.click(container.querySelector("span")!);
    expect(container.innerHTML).toMatch(/<input/);

    fireEvent.keyDown(container.querySelector("input")!, { keyCode: 45 });
    expect(container.innerHTML).toMatch(/<input/);
>>>>>>> f2d4110a (upgrading to react 19)
    expect(onChange).not.toHaveBeenCalled();
  });
});

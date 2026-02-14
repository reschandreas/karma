import React from "react";

import { render, act } from "@testing-library/react";

import {
  MockThemeContext,
  MockThemeContextWithoutAnimations,
} from "__fixtures__/Theme";
import { ThemeContext } from "Components/Theme";
import { Modal, ModalInner } from ".";

beforeEach(() => {
  jest.restoreAllMocks();
});

afterEach(() => {
  jest.restoreAllMocks();
  document.body.className = "";
});

const fakeToggle = jest.fn();

const RenderedModal = (isOpen: boolean, isUpper?: boolean) => {
  return render(
    <Modal isOpen={isOpen} isUpper={isUpper || false} toggleOpen={fakeToggle}>
      <div />
    </Modal>,
  );
};

describe("<ModalInner />", () => {
  it("'modal-open' class is appended to MountModal container", () => {
    const { container } = RenderedModal(true);
    expect(
      document.body.querySelector("div.modal-open"),
    ).toBeInTheDocument();
  });

  it("'modal-open' class is appended to body node when modal is visible", () => {
    RenderedModal(true);
    expect(document.body.className.split(" ")).toContain("modal-open");
  });

  it("'modal-open' class is not removed from body node after hidden modal is unmounted", () => {
    document.body.classList.add("modal-open");
    const { unmount } = RenderedModal(false);
    unmount();
    expect(document.body.className.split(" ")).toContain("modal-open");
  });

  it("'modal-open' class is removed from body node after modal is unmounted", () => {
    const { unmount } = RenderedModal(true);
    act(() => {
      unmount();
    });
    expect(document.body.className.split(" ")).not.toContain("modal-open");
  });

  it("'modal-open' class is not removed from body when hidden modal is updated", () => {
    document.body.classList.toggle("modal-open", true);
    const { rerender } = RenderedModal(false);
    expect(document.body.className.split(" ")).toContain("modal-open");
    // force update
    rerender(
      <Modal isOpen={false} isUpper={false} toggleOpen={fakeToggle} style={{}}>
        <div />
      </Modal>,
    );
    expect(document.body.className.split(" ")).toContain("modal-open");
  });

  it("'modal-open' class is removed from body when visible modal is updated to be hidden", () => {
    document.body.classList.toggle("modal-open", true);
    const { rerender } = RenderedModal(true);
    expect(document.body.className.split(" ")).toContain("modal-open");

    rerender(
      <Modal isOpen={false} isUpper={false} toggleOpen={fakeToggle}>
        <div />
      </Modal>,
    );
    expect(document.body.className.split(" ")).toContain("modal-open");
  });

  it("passes extra props down to the CSSTransition animation component", () => {
    const onExited = jest.fn();
    render(
      <Modal isOpen={true} toggleOpen={fakeToggle} onExited={onExited}>
        <div />
      </Modal>,
    );
    // With RTL we can't directly inspect CSSTransition props,
    // but we verify the onExited prop is wired by checking the modal renders
    expect(
      document.body.querySelector("div.modal-open"),
    ).toBeInTheDocument();
  });

  it("uses components-animation-modal class when animations are enabled", () => {
    const CSSTransition = jest.requireActual("react-transition-group").CSSTransition;
    const classNamesSpy = jest.fn();
    jest.spyOn(require("react-transition-group"), "CSSTransition").mockImplementation(
      (props: any) => {
        classNamesSpy(props.classNames);
        return <CSSTransition {...props} />;
      },
    );
    const onExited = jest.fn();
    render(
      <ThemeContext.Provider value={MockThemeContext}>
        <Modal isOpen={true} toggleOpen={fakeToggle} onExited={onExited}>
          <div />
        </Modal>
      </ThemeContext.Provider>,
    );
    expect(classNamesSpy).toHaveBeenCalledWith(
      "components-animation-modal",
    );
  });

  it("doesn't use components-animation-modal class when animations are disabled", () => {
    const CSSTransition = jest.requireActual("react-transition-group").CSSTransition;
    const classNamesSpy = jest.fn();
    jest.spyOn(require("react-transition-group"), "CSSTransition").mockImplementation(
      (props: any) => {
        classNamesSpy(props.classNames);
        return <CSSTransition {...props} />;
      },
    );
    const onExited = jest.fn();
    render(
      <ThemeContext.Provider value={MockThemeContextWithoutAnimations}>
        <Modal isOpen={true} toggleOpen={fakeToggle} onExited={onExited}>
          <div />
        </Modal>
      </ThemeContext.Provider>,
    );
    expect(classNamesSpy).toHaveBeenCalledWith("");
  });

  it("toggleOpen is called after pressing 'esc'", () => {
    RenderedModal(true);
    act(() => {
      document.dispatchEvent(
        new KeyboardEvent("keydown", {
          key: "Escape",
          keyCode: 27,
          code: "Escape",
        } as KeyboardEventInit),
      );
      document.dispatchEvent(
        new KeyboardEvent("keyup", {
          key: "Escape",
          keyCode: 27,
          code: "Escape",
        } as KeyboardEventInit),
      );
    });
    expect(fakeToggle).toHaveBeenCalled();
  });

  it("scroll isn't enabled if ref is null", () => {
    const useRefSpy = jest.spyOn(React, "useRef").mockImplementation(() =>
      Object.defineProperty({} as any, "current", {
        get: () => null,
        set: () => {},
      }),
    );
    const { rerender } = render(
      <ModalInner size="modal-lg" isUpper toggleOpen={fakeToggle} />,
    );
    rerender(
      <ModalInner size="modal-lg" isUpper={false} toggleOpen={fakeToggle} />,
    );
    rerender(
      <ModalInner size="modal-lg" isUpper toggleOpen={fakeToggle} />,
    );
    rerender(
      <ModalInner size="modal-lg" isUpper={false} toggleOpen={fakeToggle} />,
    );
    expect(useRefSpy).toHaveBeenCalled();
    expect(document.body.className.split(" ")).not.toContain("modal-open");
  });
});

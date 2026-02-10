<<<<<<< HEAD
import { act } from "react-dom/test-utils";

import { render, screen, fireEvent } from "@testing-library/react";
=======
import { render, fireEvent, act } from "@testing-library/react";
>>>>>>> f2d4110a (upgrading to react 19)

import { faExclamation } from "@fortawesome/free-solid-svg-icons/faExclamation";

import { Toast } from ".";

describe("<Toast />", () => {
  it("renders body by default", () => {
<<<<<<< HEAD
    render(
=======
    const { container } = render(
>>>>>>> f2d4110a (upgrading to react 19)
      <Toast
        icon={faExclamation}
        iconClass="text-danger"
        message="fake error"
        hasClose
      />,
    );
<<<<<<< HEAD
    expect(screen.getByText("fake error")).toBeInTheDocument();
=======
    expect(container.innerHTML).toMatch(/fake error/);
>>>>>>> f2d4110a (upgrading to react 19)
  });

  it("hides body on close icon click", () => {
    const { container } = render(
      <Toast
        icon={faExclamation}
        iconClass="text-danger"
        message="fake error"
        hasClose
      />,
    );
<<<<<<< HEAD
    expect(screen.getByText("fake error")).toBeInTheDocument();

    const closeBtn = container.querySelector("span.badge.cursor-pointer");
    fireEvent.click(closeBtn!);
    expect(screen.queryByText("fake error")).not.toBeInTheDocument();
=======
    expect(container.innerHTML).toMatch(/fake error/);

    fireEvent.click(container.querySelector("span.badge.cursor-pointer")!);
    expect(container.innerHTML).not.toMatch(/fake error/);
>>>>>>> f2d4110a (upgrading to react 19)
  });

  it("shows hidden body on showNotifications event", () => {
    const { container } = render(
      <Toast
        icon={faExclamation}
        iconClass="text-danger"
        message="fake error"
        hasClose
      />,
    );
<<<<<<< HEAD
    expect(screen.getByText("fake error")).toBeInTheDocument();

    const closeBtn = container.querySelector("span.badge.cursor-pointer");
    fireEvent.click(closeBtn!);
    expect(screen.queryByText("fake error")).not.toBeInTheDocument();
=======
    expect(container.innerHTML).toMatch(/fake error/);

    fireEvent.click(container.querySelector("span.badge.cursor-pointer")!);
    expect(container.innerHTML).not.toMatch(/fake error/);
>>>>>>> f2d4110a (upgrading to react 19)

    const e = new CustomEvent("showNotifications");
    act(() => {
      window.dispatchEvent(e);
    });
<<<<<<< HEAD
    expect(screen.getByText("fake error")).toBeInTheDocument();
=======
    expect(container.innerHTML).toMatch(/fake error/);
>>>>>>> f2d4110a (upgrading to react 19)
  });

  it("renders close icon when hasClose=true", () => {
    const { container } = render(
      <Toast
        icon={faExclamation}
        iconClass="text-danger"
        message="fake error"
        hasClose={true}
      />,
    );
<<<<<<< HEAD
    expect(container.querySelector("svg.fa-xmark")).toBeInTheDocument();
=======
    expect(container.innerHTML).toMatch(/fa-xmark/);
>>>>>>> f2d4110a (upgrading to react 19)
  });

  it("doesn't render close icon when hasClose=false", () => {
    const { container } = render(
      <Toast
        icon={faExclamation}
        iconClass="text-danger"
        message="fake error"
        hasClose={false}
      />,
    );
<<<<<<< HEAD
    expect(container.querySelector("svg.fa-xmark")).not.toBeInTheDocument();
=======
    expect(container.innerHTML).not.toMatch(/fa-xmark/);
>>>>>>> f2d4110a (upgrading to react 19)
  });

  it("unmounts cleanly", () => {
    const { unmount } = render(
      <Toast
        icon={faExclamation}
        iconClass="text-danger"
        message="fake error"
        hasClose
      />,
    );
    unmount();
  });
});

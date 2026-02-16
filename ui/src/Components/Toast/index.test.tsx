import { render, fireEvent, act } from "@testing-library/react";

import { faExclamation } from "@fortawesome/free-solid-svg-icons/faExclamation";

import { Toast } from ".";

describe("<Toast />", () => {
  it("renders body by default", () => {
    const { container } = render(
      <Toast
        icon={faExclamation}
        iconClass="text-danger"
        message="fake error"
        hasClose
      />,
    );
    expect(container.innerHTML).toMatch(/fake error/);
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
    expect(container.innerHTML).toMatch(/fake error/);

    fireEvent.click(container.querySelector("span.badge.cursor-pointer")!);
    expect(container.innerHTML).not.toMatch(/fake error/);
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
    expect(container.innerHTML).toMatch(/fake error/);

    fireEvent.click(container.querySelector("span.badge.cursor-pointer")!);
    expect(container.innerHTML).not.toMatch(/fake error/);

    const e = new CustomEvent("showNotifications");
    act(() => {
      window.dispatchEvent(e);
    });
    expect(container.innerHTML).toMatch(/fake error/);
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
    expect(container.innerHTML).toMatch(/fa-xmark/);
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
    expect(container.innerHTML).not.toMatch(/fa-xmark/);
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

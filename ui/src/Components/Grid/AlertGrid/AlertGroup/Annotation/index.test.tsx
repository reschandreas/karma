import { render, fireEvent } from "@testing-library/react";

import { RenderNonLinkAnnotation, RenderLinkAnnotation } from ".";

const RenderLinkAnnotationComponent = () => {
  return render(
    <RenderLinkAnnotation
      name="annotation name"
      value="http://localhost/foo"
    />,
  );
};

describe("<RenderLinkAnnotation />", () => {
  it("matches snapshot", () => {
    const { container } = RenderLinkAnnotationComponent();
    expect(container.innerHTML).toMatchSnapshot();
  });

  it("contains a link", () => {
    const { container } = RenderLinkAnnotationComponent();
    const link = container.querySelector("a[href='http://localhost/foo']");
    expect(link).not.toBeNull();
    expect(link!.textContent).toMatch(/annotation name/);
  });
});

const MockAfterUpdate = jest.fn();

const RenderNonLinkAnnotationComponent = (visible: boolean) => {
  return render(
    <RenderNonLinkAnnotation
      name="foo"
      value="some long text"
      visible={visible}
      allowHTML={false}
      afterUpdate={MockAfterUpdate}
    />,
  );
};

const RenderNonLinkAnnotationContainingLink = (visible: boolean) => {
  return render(
    <RenderNonLinkAnnotation
      name="foo"
      value="some long text with http://example.com link"
      visible={visible}
      allowHTML={false}
      afterUpdate={MockAfterUpdate}
    />,
  );
};

describe("<RenderNonLinkAnnotation />", () => {
  it("matches snapshot when visible=true", () => {
    const { container } = RenderNonLinkAnnotationComponent(true);
    expect(container.innerHTML).toMatchSnapshot();
  });

  it("contains value when visible=true", () => {
    const { container } = RenderNonLinkAnnotationComponent(true);
    expect(container.innerHTML).toMatch(/some long text/);
  });

  it("matches snapshot when visible=false", () => {
    const { container } = RenderNonLinkAnnotationComponent(false);
    expect(container.innerHTML).toMatchSnapshot();
  });

  it("doesn't contain value when visible=false", () => {
    const { container } = RenderNonLinkAnnotationComponent(false);
    expect(container.innerHTML).not.toMatch(/some long text/);
  });

  it("links inside annotation are rendered as a.href", () => {
    const { container } = RenderNonLinkAnnotationContainingLink(true);
    const link = container.querySelector("a[href='http://example.com']");
    expect(link).not.toBeNull();
    expect(link!.textContent).toBe("http://example.com");
  });

  it("clicking on - icon hides the value", () => {
    const { container } = RenderNonLinkAnnotationComponent(true);
    expect(container.innerHTML).toMatch(/angle-right/);
    expect(container.innerHTML).toMatch(/some long text/);
    fireEvent.click(container.querySelector(".fa-angle-right")!);
    expect(container.innerHTML).toMatch(/angle-left/);
    expect(container.innerHTML).not.toMatch(/some long text/);
  });

  it("clicking on + icon shows the value", () => {
    const { container } = RenderNonLinkAnnotationComponent(false);
    expect(container.innerHTML).toMatch(/angle-left/);
    expect(container.innerHTML).not.toMatch(/some long text/);
    fireEvent.click(container.querySelector(".components-grid-annotation")!);
    expect(container.innerHTML).toMatch(/angle-right/);
    expect(container.innerHTML).toMatch(/some long text/);
  });

  it("escapes HTML when allowHTML=false", () => {
    const { container } = render(
      <RenderNonLinkAnnotation
        name="foo"
        value="<div>inside div</div>"
        visible
        allowHTML={false}
        afterUpdate={MockAfterUpdate}
      />,
    );
    expect(container.innerHTML).toMatch(
      /&lt;div&gt;inside div&lt;\/div&gt;/,
    );
  });

  it("doesn't escape HTML when allowHTML=true", () => {
    const { container } = render(
      <RenderNonLinkAnnotation
        name="foo"
        value="<div>inside div</div>"
        visible
        allowHTML={true}
        afterUpdate={MockAfterUpdate}
      />,
    );
    expect(container.innerHTML).toMatch(/<div>inside div<\/div>/);
  });
});

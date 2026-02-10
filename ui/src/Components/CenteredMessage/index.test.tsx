<<<<<<< HEAD
import { render, screen } from "@testing-library/react";
=======
import { render } from "@testing-library/react";
>>>>>>> f2d4110a (upgrading to react 19)

import { MockThemeContext } from "__fixtures__/Theme";
import { ThemeContext } from "Components/Theme";
import { CenteredMessage } from ".";

<<<<<<< HEAD
const renderWithTheme = (ui: React.ReactElement) =>
  render(
    <ThemeContext.Provider value={MockThemeContext}>
      {ui}
    </ThemeContext.Provider>,
  );

=======
>>>>>>> f2d4110a (upgrading to react 19)
describe("<CenteredMessage />", () => {
  const Message = () => <div>Foo</div>;

  it("matches snapshot", () => {
<<<<<<< HEAD
    const { asFragment } = renderWithTheme(
      <CenteredMessage>
        <Message />
      </CenteredMessage>,
=======
    const { asFragment } = render(
      <ThemeContext.Provider value={MockThemeContext}>
        <CenteredMessage>
          <Message />
        </CenteredMessage>
      </ThemeContext.Provider>,
>>>>>>> f2d4110a (upgrading to react 19)
    );
    expect(asFragment()).toMatchSnapshot();
  });

  it("uses 'display-1 text-placeholder' className by default", () => {
<<<<<<< HEAD
    renderWithTheme(
      <CenteredMessage>
        <Message />
      </CenteredMessage>,
    );
    expect(screen.getByRole("heading")).toHaveClass(
      "display-1",
      "text-placeholder",
    );
  });

  it("uses custom className if passed", () => {
    renderWithTheme(
      <CenteredMessage className="bar-class">
        <Message />
      </CenteredMessage>,
    );
    const heading = screen.getByRole("heading");
    expect(heading).toHaveClass("bar-class");
    expect(heading).not.toHaveClass("display-1", "text-placeholder");
=======
    const { container } = render(
      <ThemeContext.Provider value={MockThemeContext}>
        <CenteredMessage>
          <Message />
        </CenteredMessage>
      </ThemeContext.Provider>,
    );
    expect(container.innerHTML).toMatch(/display-1 text-placeholder/);
  });

  it("uses custom className if passed", () => {
    const { container } = render(
      <ThemeContext.Provider value={MockThemeContext}>
        <CenteredMessage className="bar-class">
          <Message />
        </CenteredMessage>
      </ThemeContext.Provider>,
    );
    expect(container.innerHTML).toMatch(/bar-class/);
    expect(container.innerHTML).not.toMatch(
      /display-1 text-placeholder/,
    );
>>>>>>> f2d4110a (upgrading to react 19)
  });
});

import { render } from "@testing-library/react";

import { MockThemeContext } from "__fixtures__/Theme";
import { ThemeContext } from "Components/Theme";
import { CenteredMessage } from ".";

describe("<CenteredMessage />", () => {
  const Message = () => <div>Foo</div>;

  it("matches snapshot", () => {
    const { asFragment } = render(
      <ThemeContext.Provider value={MockThemeContext}>
        <CenteredMessage>
          <Message />
        </CenteredMessage>
      </ThemeContext.Provider>,
    );
    expect(asFragment()).toMatchSnapshot();
  });

  it("uses 'display-1 text-placeholder' className by default", () => {
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
  });
});

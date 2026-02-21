import React, { FC, ReactNode, useRef } from "react";

import { CSSTransition } from "react-transition-group";

import { ThemeContext } from "Components/Theme";

const DropdownSlide: FC<{
  children: ReactNode;
  in?: boolean;
  unmountOnExit?: boolean;
}> = ({ children, ...props }) => {
  const context = React.useContext(ThemeContext);
  const nodeRef = useRef<HTMLDivElement>(null);

  return (
    <CSSTransition
      nodeRef={nodeRef}
      classNames="components-animation-slide"
      timeout={context.animations.duration ? 150 : 0}
      appear={true}
      exit={true}
      {...props}
    >
      <div ref={nodeRef}>{children}</div>
    </CSSTransition>
  );
};

export { DropdownSlide };

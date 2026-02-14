import { useState, useEffect, useRef, useCallback, ReactNode } from "react";

import type { TransitionProps } from "react-transition-group/Transition";

import { useInView } from "react-intersection-observer";

const defaultProps: TransitionProps = {
  in: false,
  classNames: "components-animation-flash",
  timeout: 800,
  appear: false,
  enter: false,
  exit: false,
};

const useFlashTransition = (
  flashOn: ReactNode,
): { ref: (node?: Element | null) => void; props: TransitionProps } => {
  const mountRef = useRef<boolean>(false);
  const nodeRef = useRef<HTMLElement | null>(null);
  const [inViewRef, inView] = useInView();
  const [isPending, setIsPending] = useState<boolean>(false);
  const [props, setProps] = useState<TransitionProps>({
    ...defaultProps,
    nodeRef: nodeRef as unknown as React.Ref<undefined>,
  });

  const ref = useCallback(
    (node?: Element | null) => {
      inViewRef(node);
      nodeRef.current = (node as HTMLElement) || null;
    },
    [inViewRef],
  );

  useEffect(() => {
    if (mountRef.current) {
      setIsPending(true);
    } else {
      mountRef.current = true;
    }
  }, [flashOn]);

  useEffect(() => {
    setProps({
      ...defaultProps,
      nodeRef: nodeRef as unknown as React.Ref<undefined>,
      in: isPending && inView,
      enter: isPending && inView,
      onEntered: () => setIsPending(false),
    });
  }, [inView, isPending]);

  return { ref, props };
};

export { useFlashTransition, defaultProps };

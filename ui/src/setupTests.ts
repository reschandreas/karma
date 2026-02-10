import "@testing-library/jest-dom";

import ReactDOM from "react-dom";

import "regenerator-runtime/runtime";

import { configure } from "mobx";

import { FetchRetryConfig } from "Common/Fetch";

import { useFetchGetMock } from "__fixtures__/useFetchGet";
import { useFetchGet } from "Hooks/useFetchGet";

import { useInView } from "react-intersection-observer";

// Polyfill findDOMNode for react-transition-group v4 which uses it,
// but it was removed in React 19
if (!(ReactDOM as any).findDOMNode) {
  (ReactDOM as any).findDOMNode = function (component: any) {
    if (component == null) return null;
    if (component.nodeType) return component;
    return null;
  };
}

// react-idle-timer >= 4.6.0

configure({
  enforceActions: "always",
  //computedRequiresReaction: true,
  //reactionRequiresObservable: true,
  //observableRequiresReaction: true,
});

jest.mock("Hooks/useFetchGet");

jest.mock("react-intersection-observer");

FetchRetryConfig.minTimeout = 2;
FetchRetryConfig.maxTimeout = 10;

beforeEach(() => {
  useFetchGetMock.fetch.reset();
  (useFetchGet as jest.MockedFunction<typeof useFetchGetMock>).mockRestore();
  (
    useFetchGet as jest.MockedFunction<typeof useFetchGetMock>
  ).mockImplementation(useFetchGetMock);

  (useInView as jest.MockedFunction<typeof useInView>).mockReturnValue([
    jest.fn(),
    true,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ] as any);
});

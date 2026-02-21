import { act } from "@testing-library/react";

function PressKey(key: string, code: number): void {
  act(() => {
    document.dispatchEvent(
      new KeyboardEvent("keydown", {
        key: key,
        keyCode: code,
        which: code,
      } as KeyboardEventInit),
    );
    document.dispatchEvent(
      new KeyboardEvent("keyup", {
        key: key,
        keyCode: code,
        which: code,
      } as KeyboardEventInit),
    );
  });
}

export { PressKey };

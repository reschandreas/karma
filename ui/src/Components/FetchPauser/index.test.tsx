<<<<<<< HEAD
import { act } from "react-dom/test-utils";

import { render } from "@testing-library/react";
=======
import { render, act } from "@testing-library/react";
>>>>>>> f2d4110a (upgrading to react 19)

import { AlertStore } from "Stores/AlertStore";
import { FetchPauser } from ".";

let alertStore: AlertStore;

beforeEach(() => {
  alertStore = new AlertStore([]);
});

<<<<<<< HEAD
const renderFetchPauser = () => {
=======
const MountedFetchPauser = () => {
>>>>>>> f2d4110a (upgrading to react 19)
  return render(
    <FetchPauser alertStore={alertStore}>
      <div />
    </FetchPauser>,
  );
};

describe("<FetchPauser />", () => {
  it("mounting FetchPauser pauses alertStore", () => {
    renderFetchPauser();
    expect(alertStore.status.paused).toBe(true);
  });

  it("unmounting FetchPauser resumes alertStore", () => {
<<<<<<< HEAD
    const { unmount } = renderFetchPauser();
=======
    const { unmount } = MountedFetchPauser();
>>>>>>> f2d4110a (upgrading to react 19)
    act(() => {
      unmount();
    });
    expect(alertStore.status.paused).toBe(false);
  });
});

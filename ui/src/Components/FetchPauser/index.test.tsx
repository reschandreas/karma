import { render, act } from "@testing-library/react";

import { AlertStore } from "Stores/AlertStore";
import { FetchPauser } from ".";

let alertStore: AlertStore;

beforeEach(() => {
  alertStore = new AlertStore([]);
});

const MountedFetchPauser = () => {
  return render(
    <FetchPauser alertStore={alertStore}>
      <div />
    </FetchPauser>,
  );
};

describe("<FetchPauser />", () => {
  it("mounting FetchPauser pauses alertStore", () => {
    MountedFetchPauser();
    expect(alertStore.status.paused).toBe(true);
  });

  it("unmounting FetchPauser resumes alertStore", () => {
    const { unmount } = MountedFetchPauser();
    act(() => {
      unmount();
    });
    expect(alertStore.status.paused).toBe(false);
  });
});

import { render } from "@testing-library/react";

import { MockSilence } from "__fixtures__/Alerts";
import { AlertStore } from "Stores/AlertStore";
import { SilenceFormStore } from "Stores/SilenceFormStore";
import { RenderSilence } from "./Silences";

describe("<RenderSilence />", () => {
  let alertStore: AlertStore;
  let silenceFormStore: SilenceFormStore;

  beforeEach(() => {
    alertStore = new AlertStore([]);
    silenceFormStore = new SilenceFormStore();

    jest.useFakeTimers();
    jest.setSystemTime(new Date(Date.UTC(2000, 1, 1, 0, 0, 0)));
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("renders fallback text if silence is not present in AlertStore", () => {
    const { container } = render(
      <RenderSilence
        alertStore={alertStore}
        silenceFormStore={silenceFormStore}
        afterUpdate={jest.fn()}
        cluster="fakeCluster"
        silenceID="1234567890"
      />,
    );
    expect(container.textContent).toBe("Silenced by 1234567890");
    expect(container.innerHTML).toMatchSnapshot();
  });

  it("renders ManagedSilence if silence is present in AlertStore", () => {
    const silence = MockSilence();

    alertStore.data.setSilences({ fakeCluster: { [silence.id]: silence } });

    const { container } = render(
      <RenderSilence
        alertStore={alertStore}
        silenceFormStore={silenceFormStore}
        afterUpdate={jest.fn()}
        cluster="fakeCluster"
        silenceID={silence.id}
      />,
    );
    expect(container.querySelector(".components-managed-silence")).toBeTruthy();
    expect(container.textContent).toMatch(/Mocked Silence/);
    expect(container.innerHTML).toMatchSnapshot();
  });

  it("re-render when silence was removed AlertStore is a no-op", () => {
    const silence = MockSilence();

    alertStore.data.setSilences({ fakeCluster: { [silence.id]: silence } });

    const { container, rerender } = render(
      <RenderSilence
        alertStore={alertStore}
        silenceFormStore={silenceFormStore}
        afterUpdate={jest.fn()}
        cluster="fakeCluster"
        silenceID={silence.id}
      />,
    );
    expect(container.querySelector(".components-managed-silence")).toBeTruthy();
    const snapshot = container.innerHTML;

    alertStore.data.setSilences({});

    rerender(
      <RenderSilence
        alertStore={alertStore}
        silenceFormStore={silenceFormStore}
        afterUpdate={jest.fn()}
        cluster="fakeCluster"
        silenceID={silence.id}
      />,
    );
    expect(container.querySelector(".components-managed-silence")).toBeTruthy();
    expect(container.innerHTML).toBe(snapshot);
  });

  it("re-render when silence ID was changed updates it", () => {
    const { container, rerender } = render(
      <RenderSilence
        alertStore={alertStore}
        silenceFormStore={silenceFormStore}
        afterUpdate={jest.fn()}
        cluster="fakeCluster"
        silenceID="silence1"
      />,
    );
    expect(container.textContent).toBe("Silenced by silence1");

    rerender(
      <RenderSilence
        alertStore={alertStore}
        silenceFormStore={silenceFormStore}
        afterUpdate={jest.fn()}
        cluster="fakeCluster"
        silenceID="silence2"
      />,
    );
    expect(container.textContent).toBe("Silenced by silence2");
  });

  it("re-render when cluster name was changed updates it", () => {
    const { container, rerender } = render(
      <RenderSilence
        alertStore={alertStore}
        silenceFormStore={silenceFormStore}
        afterUpdate={jest.fn()}
        cluster="cluster1"
        silenceID="1234567890"
      />,
    );
    expect(container.textContent).toBe("Silenced by 1234567890");

    rerender(
      <RenderSilence
        alertStore={alertStore}
        silenceFormStore={silenceFormStore}
        afterUpdate={jest.fn()}
        cluster="cluster2"
        silenceID="1234567890"
      />,
    );
    expect(container.textContent).toBe("Silenced by 1234567890");
  });
});

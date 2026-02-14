<<<<<<< HEAD
import { act } from "react-dom/test-utils";

import { render, fireEvent } from "@testing-library/react";
=======
import { render, fireEvent, act } from "@testing-library/react";
>>>>>>> f2d4110a (upgrading to react 19)

import { addMinutes } from "date-fns/addMinutes";
import { addHours } from "date-fns/addHours";
import { differenceInMilliseconds } from "date-fns/differenceInMilliseconds";
import { format } from "date-fns";

import { SilenceFormStore } from "Stores/SilenceFormStore";
import {
  DateTimeSelect,
  TabContentStart,
  TabContentEnd,
  TabContentDuration,
} from ".";

let silenceFormStore: SilenceFormStore;

beforeEach(() => {
  jest.useFakeTimers();

  silenceFormStore = new SilenceFormStore();
  silenceFormStore.data.setStart(new Date(2060, 1, 1, 0, 0, 0));
  silenceFormStore.data.setEnd(new Date(2061, 1, 1, 0, 0, 0));
});

afterEach(() => {
  jest.useRealTimers();
});

<<<<<<< HEAD
const renderDateTimeSelect = () => {
=======
const RenderDateTimeSelect = () => {
  return render(<DateTimeSelect silenceFormStore={silenceFormStore} />);
};

const MountedDateTimeSelect = () => {
>>>>>>> f2d4110a (upgrading to react 19)
  return render(<DateTimeSelect silenceFormStore={silenceFormStore} />);
};

describe("<DateTimeSelect />", () => {
  it("renders 3 tabs", () => {
<<<<<<< HEAD
    const { container } = renderDateTimeSelect();
=======
    const { container } = RenderDateTimeSelect();
>>>>>>> f2d4110a (upgrading to react 19)
    const tabs = container.querySelectorAll(".nav-link");
    expect(tabs).toHaveLength(3);
  });

  it("renders 'Duration' tab by default", () => {
<<<<<<< HEAD
    const { container } = renderDateTimeSelect();
    const tab = container.querySelector(".nav-link.active");
    expect(tab).toBeInTheDocument();
    expect(tab?.textContent).toMatch(/Duration/);
    expect(container.querySelector(".tab-content")?.textContent).toBe(
=======
    const { container } = MountedDateTimeSelect();
    const tab = container.querySelectorAll(".nav-link.active");
    expect(tab).toHaveLength(1);
    // check tab title
    expect(tab[0].textContent).toMatch(/Duration/);
    // check tab content
    expect(container.querySelector(".tab-content")!.textContent).toBe(
>>>>>>> f2d4110a (upgrading to react 19)
      "366days0hours0minutes",
    );
  });

  it("'Duration' tab matches snapshot", () => {
    jest.setSystemTime(new Date(2060, 1, 1, 0, 0, 0));
<<<<<<< HEAD
    const { asFragment } = renderDateTimeSelect();
=======
    const { asFragment } = MountedDateTimeSelect();
>>>>>>> f2d4110a (upgrading to react 19)
    expect(asFragment()).toMatchSnapshot();
  });

  it("'Duration' tab unmounts without crashing", () => {
<<<<<<< HEAD
    const { unmount } = renderDateTimeSelect();
=======
    const { unmount } = MountedDateTimeSelect();
>>>>>>> f2d4110a (upgrading to react 19)
    unmount();
  });

  it("clicking on the 'Starts' tab switches content to 'startsAt' selection", () => {
<<<<<<< HEAD
    const { container } = renderDateTimeSelect();
    const tabs = container.querySelectorAll(".nav-link");
    expect(tabs[0].textContent).toMatch(/Starts/);
    fireEvent.click(tabs[0]);
    expect(container.querySelector(".tab-content")?.textContent).toMatch(
=======
    const { container } = MountedDateTimeSelect();
    const tab = container.querySelectorAll(".nav-link")[0];
    expect(tab.textContent).toMatch(/Starts/);
    fireEvent.click(tab);
    expect(container.querySelector(".tab-content")!.textContent).toMatch(
>>>>>>> f2d4110a (upgrading to react 19)
      /2060/,
    );
  });

  it("'Starts' tab matches snapshot", () => {
    jest.setSystemTime(new Date(2060, 1, 1, 0, 0, 0));
<<<<<<< HEAD
    const { container, asFragment } = renderDateTimeSelect();
=======
    const { container, asFragment } = MountedDateTimeSelect();
>>>>>>> f2d4110a (upgrading to react 19)
    fireEvent.click(container.querySelectorAll(".nav-link")[0]);
    expect(asFragment()).toMatchSnapshot();
  });

  it("'Starts' tab unmounts without crashing", () => {
<<<<<<< HEAD
    const { container, unmount } = renderDateTimeSelect();
=======
    const { container, unmount } = MountedDateTimeSelect();
>>>>>>> f2d4110a (upgrading to react 19)
    fireEvent.click(container.querySelectorAll(".nav-link")[0]);
    unmount();
  });

  it("clicking on the 'Ends' tab switches content to 'endsAt' selection", () => {
<<<<<<< HEAD
    const { container } = renderDateTimeSelect();
    const tabs = container.querySelectorAll(".nav-link");
    expect(tabs[1].textContent).toMatch(/Ends/);
    fireEvent.click(tabs[1]);
    expect(container.querySelector(".tab-content")?.textContent).toMatch(
=======
    const { container } = MountedDateTimeSelect();
    const tab = container.querySelectorAll(".nav-link")[1];
    expect(tab.textContent).toMatch(/Ends/);
    fireEvent.click(tab);
    expect(container.querySelector(".tab-content")!.textContent).toMatch(
>>>>>>> f2d4110a (upgrading to react 19)
      /2061/,
    );
  });

  it("'Ends' tab matches snapshot", () => {
    jest.setSystemTime(new Date(2060, 1, 1, 0, 0, 0));
<<<<<<< HEAD
    const { container, asFragment } = renderDateTimeSelect();
=======
    const { container, asFragment } = MountedDateTimeSelect();
>>>>>>> f2d4110a (upgrading to react 19)
    fireEvent.click(container.querySelectorAll(".nav-link")[1]);
    expect(asFragment()).toMatchSnapshot();
  });

  it("'Ends' tab unmounts without crashing", () => {
<<<<<<< HEAD
    const { container, unmount } = renderDateTimeSelect();
=======
    const { container, unmount } = MountedDateTimeSelect();
>>>>>>> f2d4110a (upgrading to react 19)
    fireEvent.click(container.querySelectorAll(".nav-link")[1]);
    unmount();
  });

  it("clicking on the 'Duration' tabs switches content to duration selection", () => {
<<<<<<< HEAD
    const { container } = renderDateTimeSelect();
    const tabs = container.querySelectorAll(".nav-link");
    fireEvent.click(tabs[0]);
    expect(tabs[2].textContent).toMatch(/Duration/);
    fireEvent.click(tabs[2]);
    expect(container.querySelector(".tab-content")?.textContent).toBe(
=======
    const { container } = MountedDateTimeSelect();
    // first switch to 'Starts'
    fireEvent.click(container.querySelectorAll(".nav-link")[0]);
    // then switch back to 'Duration'
    const tab = container.querySelectorAll(".nav-link")[2];
    expect(tab.textContent).toMatch(/Duration/);
    fireEvent.click(tab);
    expect(container.querySelector(".tab-content")!.textContent).toBe(
>>>>>>> f2d4110a (upgrading to react 19)
      "366days0hours0minutes",
    );
  });

  it("'Ends' tab offset badge is updated after 1 minute", () => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date(2060, 1, 1, 12, 0, 0));
    silenceFormStore.data.setStart(new Date(2060, 1, 1, 12, 0, 0));
    silenceFormStore.data.setEnd(new Date(2060, 1, 1, 13, 0, 0));

<<<<<<< HEAD
    const { container } = renderDateTimeSelect();
=======
    const { container } = MountedDateTimeSelect();
>>>>>>> f2d4110a (upgrading to react 19)
    expect(container.querySelectorAll(".nav-link")[1].textContent).toBe(
      "Endsin 1h ",
    );

    jest.setSystemTime(new Date(2060, 1, 1, 12, 1, 0));
    act(() => {
      jest.runOnlyPendingTimers();
    });

    expect(container.querySelectorAll(".nav-link")[1].textContent).toBe(
      "Endsin 59m ",
    );
  });

  it("unmounts cleanly", () => {
<<<<<<< HEAD
    const { unmount } = renderDateTimeSelect();
=======
    const { unmount } = MountedDateTimeSelect();
>>>>>>> f2d4110a (upgrading to react 19)
    unmount();
  });
});

const ValidateTimeButton = (
  container: HTMLElement,
  storeKey: "startsAt" | "endsAt",
  elemIndex: number,
  iconMatch: RegExp,
  expectedDiff: number,
) => {
<<<<<<< HEAD
  const buttons = container.querySelectorAll("td > span");
  const button = buttons[elemIndex];
=======
  const button = container.querySelectorAll("td > span")[elemIndex];
>>>>>>> f2d4110a (upgrading to react 19)
  expect(button.innerHTML).toMatch(iconMatch);

  const oldTimeValue = new Date(silenceFormStore.data[storeKey]);
  fireEvent.click(button);
  expect(silenceFormStore.data[storeKey].toISOString()).not.toBe(
    oldTimeValue.toISOString(),
  );
  const diffMS = differenceInMilliseconds(
    silenceFormStore.data[storeKey],
    oldTimeValue,
  );
  expect(diffMS).toBe(expectedDiff);
};

const ValidateTimeWheel = (
  container: HTMLElement,
  storeKey: "startsAt" | "endsAt",
  className: string,
  deltaY: number,
  expectedDiff: number,
) => {
<<<<<<< HEAD
  const elem = container.querySelector(className);

  const oldTimeValue = new Date(silenceFormStore.data[storeKey]);

  fireEvent.wheel(elem!, { deltaY: deltaY });
  // fire real event so cancel listener will trigger
  const event = new WheelEvent("wheel", { deltaY: deltaY });
  const hourMinute = container.querySelector("div.components-hour-minute");
  hourMinute?.dispatchEvent(event);
=======
  const elem = container.querySelector(className)!;

  const oldTimeValue = new Date(silenceFormStore.data[storeKey]);

  fireEvent.wheel(elem, { deltaY: deltaY });
  // fire real event so cancel listener will trigger
  const event = new Event("wheel", { deltaY: deltaY } as EventInit);
  container
    .querySelectorAll("div.components-hour-minute")[0]
    .dispatchEvent(event);
>>>>>>> f2d4110a (upgrading to react 19)

  expect(silenceFormStore.data[storeKey].toISOString()).not.toBe(
    oldTimeValue.toISOString(),
  );
  const diffMS = differenceInMilliseconds(
    silenceFormStore.data[storeKey],
    oldTimeValue,
  );
  expect(diffMS).toBe(expectedDiff);
};

<<<<<<< HEAD
const renderTabContentStart = () => {
=======
const MountedTabContentStart = () => {
>>>>>>> f2d4110a (upgrading to react 19)
  return render(<TabContentStart silenceFormStore={silenceFormStore} />);
};

describe("<TabContentStart />", () => {
  it("selecting date on DayPicker updates startsAt", () => {
<<<<<<< HEAD
    const { container } = renderTabContentStart();
    expect(silenceFormStore.data.startsAt.toISOString()).toBe(
      new Date(2060, 1, 1, 0, 0, 0).toISOString(),
    );
    const dayButtons = container.querySelectorAll("button.rdp-button.rdp-day");
    fireEvent.click(dayButtons[17]);
=======
    const { container } = MountedTabContentStart();
    expect(silenceFormStore.data.startsAt.toISOString()).toBe(
      new Date(2060, 1, 1, 0, 0, 0).toISOString(),
    );
    fireEvent.click(
      container.querySelectorAll("button.rdp-day_button")[17],
    );
>>>>>>> f2d4110a (upgrading to react 19)
    expect(silenceFormStore.data.startsAt.toISOString()).toBe(
      new Date(2060, 1, 18, 0, 0, 0).toISOString(),
    );
  });

  it("clicking on the hour inc button adds 1h to startsAt", () => {
<<<<<<< HEAD
    const { container } = renderTabContentStart();
=======
    const { container } = MountedTabContentStart();
>>>>>>> f2d4110a (upgrading to react 19)
    ValidateTimeButton(container, "startsAt", 0, /angle-up/, 3600 * 1000);
  });

  it("Today button takes you back to the current month", () => {
<<<<<<< HEAD
    const { container } = renderTabContentStart();
    expect(silenceFormStore.data.startsAt.toISOString()).toBe(
      new Date(2060, 1, 1, 0, 0, 0).toISOString(),
    );
    expect(container.querySelector(".rdp-caption_label")?.textContent).toBe(
=======
    const { container } = MountedTabContentStart();
    expect(silenceFormStore.data.startsAt.toISOString()).toBe(
      new Date(2060, 1, 1, 0, 0, 0).toISOString(),
    );
    expect(container.querySelector(".rdp-caption_label")!.textContent).toBe(
>>>>>>> f2d4110a (upgrading to react 19)
      "February 2060",
    );
    fireEvent.click(
      container.querySelector("button.rdp-button_next")!,
    );
<<<<<<< HEAD
    expect(container.querySelector(".rdp-caption_label")?.textContent).toBe(
      "March 2060",
    );
    fireEvent.click(container.querySelector("button.btn.btn-light.btn-sm")!);
    expect(container.querySelector(".rdp-caption_label")?.textContent).toBe(
=======
    expect(container.querySelector(".rdp-caption_label")!.textContent).toBe(
      "March 2060",
    );
    fireEvent.click(
      container.querySelector("button.btn.btn-light.btn-sm")!,
    );
    expect(container.querySelector(".rdp-caption_label")!.textContent).toBe(
>>>>>>> f2d4110a (upgrading to react 19)
      format(new Date(), "LLLL yyyy"),
    );
  });

  it("scrolling up on the hour button adds 1h to startsAt", () => {
<<<<<<< HEAD
    const { container } = renderTabContentStart();
=======
    const { container } = MountedTabContentStart();
>>>>>>> f2d4110a (upgrading to react 19)
    ValidateTimeWheel(
      container,
      "startsAt",
      "td.components-hour-up",
      -1,
      3600 * 1000,
    );
  });

  it("clicking on the minute inc button adds 1m to startsAt", () => {
<<<<<<< HEAD
    const { container } = renderTabContentStart();
=======
    const { container } = MountedTabContentStart();
>>>>>>> f2d4110a (upgrading to react 19)
    ValidateTimeButton(container, "startsAt", 1, /angle-up/, 60 * 1000);
  });

  it("scrolling up on the minute button adds 1m to startsAt", () => {
<<<<<<< HEAD
    const { container } = renderTabContentStart();
=======
    const { container } = MountedTabContentStart();
>>>>>>> f2d4110a (upgrading to react 19)
    ValidateTimeWheel(
      container,
      "startsAt",
      "td.components-minute-up",
      -2,
      60 * 1000,
    );
  });

  it("clicking on the hour dec button subtracts 1h from startsAt", () => {
<<<<<<< HEAD
    const { container } = renderTabContentStart();
=======
    const { container } = MountedTabContentStart();
>>>>>>> f2d4110a (upgrading to react 19)
    ValidateTimeButton(
      container,
      "startsAt",
      2,
      /angle-down/,
      -1 * 3600 * 1000,
    );
  });

  it("scrolling down on the hour button subtracts 1h from startsAt", () => {
<<<<<<< HEAD
    const { container } = renderTabContentStart();
=======
    const { container } = MountedTabContentStart();
>>>>>>> f2d4110a (upgrading to react 19)
    ValidateTimeWheel(
      container,
      "startsAt",
      "td.components-hour-down",
      1,
      -1 * 3600 * 1000,
    );
  });

  it("scrolling up on the minute adds 1m to startsAt", () => {
<<<<<<< HEAD
    const { container } = renderTabContentStart();
=======
    const { container } = MountedTabContentStart();
>>>>>>> f2d4110a (upgrading to react 19)
    ValidateTimeWheel(
      container,
      "startsAt",
      "td.components-minute",
      -2,
      60 * 1000,
    );
  });

  it("scrolling down on the minute subtracts 1m from startsAt", () => {
<<<<<<< HEAD
    const { container } = renderTabContentStart();
=======
    const { container } = MountedTabContentStart();
>>>>>>> f2d4110a (upgrading to react 19)
    ValidateTimeWheel(
      container,
      "startsAt",
      "td.components-minute",
      1,
      -1 * 60 * 1000,
    );
  });

  it("clicking on the minute dec button subtracts 1m from startsAt", () => {
<<<<<<< HEAD
    const { container } = renderTabContentStart();
    ValidateTimeButton(container, "startsAt", 3, /angle-down/, -1 * 60 * 1000);
  });

  it("scrolling down by deltaY=2 on the minute button subtracts 1m from startsAt", () => {
    const { container } = renderTabContentStart();
=======
    const { container } = MountedTabContentStart();
    ValidateTimeButton(
      container,
      "startsAt",
      3,
      /angle-down/,
      -1 * 60 * 1000,
    );
  });

  it("scrolling down by deltaY=2 on the minute button subtracts 1m from startsAt", () => {
    const { container } = MountedTabContentStart();
>>>>>>> f2d4110a (upgrading to react 19)
    ValidateTimeWheel(
      container,
      "startsAt",
      "td.components-minute-down",
      2,
      -1 * 60 * 1000,
    );
  });

  it("scrolling up on the minute subtracts 1m from startsAt", () => {
<<<<<<< HEAD
    const { container } = renderTabContentStart();
=======
    const { container } = MountedTabContentStart();
>>>>>>> f2d4110a (upgrading to react 19)
    ValidateTimeWheel(
      container,
      "startsAt",
      "td.components-minute",
      -50,
      60 * 1000,
    );
  });

  it("scrolling down by deltaY=1 on the minute subtracts 1m from startsAt", () => {
<<<<<<< HEAD
    const { container } = renderTabContentStart();
=======
    const { container } = MountedTabContentStart();
>>>>>>> f2d4110a (upgrading to react 19)
    ValidateTimeWheel(
      container,
      "startsAt",
      "td.components-minute",
      1,
      -1 * 60 * 1000,
    );
  });
});

<<<<<<< HEAD
const renderTabContentEnd = () => {
=======
const MountedTabContentEnd = () => {
>>>>>>> f2d4110a (upgrading to react 19)
  return render(<TabContentEnd silenceFormStore={silenceFormStore} />);
};

describe("<TabContentEnd />", () => {
  it("Selecting date on DayPicker updates endsAt", () => {
<<<<<<< HEAD
    const { container } = renderTabContentEnd();
    expect(silenceFormStore.data.endsAt.toISOString()).toBe(
      new Date(2061, 1, 1, 0, 0, 0).toISOString(),
    );
    const dayButtons = container.querySelectorAll("button.rdp-button.rdp-day");
    fireEvent.click(dayButtons[23]);
=======
    const { container } = MountedTabContentEnd();
    expect(silenceFormStore.data.endsAt.toISOString()).toBe(
      new Date(2061, 1, 1, 0, 0, 0).toISOString(),
    );
    fireEvent.click(
      container.querySelectorAll("button.rdp-day_button")[23],
    );
>>>>>>> f2d4110a (upgrading to react 19)
    expect(silenceFormStore.data.endsAt.toISOString()).toBe(
      new Date(2061, 1, 24, 0, 0, 0).toISOString(),
    );
  });

  it("clicking on the hour inc button adds 1h to endsAt", () => {
<<<<<<< HEAD
    const { container } = renderTabContentEnd();
=======
    const { container } = MountedTabContentEnd();
>>>>>>> f2d4110a (upgrading to react 19)
    ValidateTimeButton(container, "endsAt", 0, /angle-up/, 3600 * 1000);
  });

  it("Today button takes you back to the current month", () => {
<<<<<<< HEAD
    const { container } = renderTabContentEnd();
    expect(silenceFormStore.data.endsAt.toISOString()).toBe(
      new Date(2061, 1, 1, 0, 0, 0).toISOString(),
    );
    expect(container.querySelector(".rdp-caption_label")?.textContent).toBe(
=======
    const { container } = MountedTabContentEnd();
    expect(silenceFormStore.data.endsAt.toISOString()).toBe(
      new Date(2061, 1, 1, 0, 0, 0).toISOString(),
    );
    expect(container.querySelector(".rdp-caption_label")!.textContent).toBe(
>>>>>>> f2d4110a (upgrading to react 19)
      "February 2061",
    );
    fireEvent.click(
      container.querySelector("button.rdp-button_next")!,
    );
<<<<<<< HEAD
    expect(container.querySelector(".rdp-caption_label")?.textContent).toBe(
      "March 2061",
    );
    fireEvent.click(container.querySelector("button.btn.btn-light.btn-sm")!);
    expect(container.querySelector(".rdp-caption_label")?.textContent).toBe(
=======
    expect(container.querySelector(".rdp-caption_label")!.textContent).toBe(
      "March 2061",
    );
    fireEvent.click(
      container.querySelector("button.btn.btn-light.btn-sm")!,
    );
    expect(container.querySelector(".rdp-caption_label")!.textContent).toBe(
>>>>>>> f2d4110a (upgrading to react 19)
      format(new Date(), "LLLL yyyy"),
    );
  });

  it("scrolling up on the hour button adds 1h to endsAt", () => {
<<<<<<< HEAD
    const { container } = renderTabContentEnd();
=======
    const { container } = MountedTabContentEnd();
>>>>>>> f2d4110a (upgrading to react 19)
    ValidateTimeWheel(
      container,
      "endsAt",
      "td.components-hour-up",
      -1,
      3600 * 1000,
    );
  });

  it("scrolling up on the hour adds 1h to endsAt", () => {
<<<<<<< HEAD
    const { container } = renderTabContentEnd();
=======
    const { container } = MountedTabContentEnd();
>>>>>>> f2d4110a (upgrading to react 19)
    ValidateTimeWheel(
      container,
      "endsAt",
      "td.components-hour",
      -1,
      3600 * 1000,
    );
  });

  it("scrolling down on the hour subtracts 1h from endsAt", () => {
<<<<<<< HEAD
    const { container } = renderTabContentEnd();
=======
    const { container } = MountedTabContentEnd();
>>>>>>> f2d4110a (upgrading to react 19)
    ValidateTimeWheel(
      container,
      "endsAt",
      "td.components-hour",
      1,
      -1 * 3600 * 1000,
    );
  });

  it("clicking on the minute inc button adds 1m to endsAt", () => {
<<<<<<< HEAD
    const { container } = renderTabContentEnd();
=======
    const { container } = MountedTabContentEnd();
>>>>>>> f2d4110a (upgrading to react 19)
    ValidateTimeButton(container, "endsAt", 1, /angle-up/, 60 * 1000);
  });

  it("scrolling up on the minute button adds 1m to endsAt", () => {
<<<<<<< HEAD
    const { container } = renderTabContentEnd();
=======
    const { container } = MountedTabContentEnd();
>>>>>>> f2d4110a (upgrading to react 19)
    ValidateTimeWheel(
      container,
      "endsAt",
      "td.components-minute-up",
      -10,
      60 * 1000,
    );
  });

  it("clicking on the hour dec button subtracts 1h from endsAt", () => {
<<<<<<< HEAD
    const { container } = renderTabContentEnd();
    ValidateTimeButton(container, "endsAt", 2, /angle-down/, -1 * 3600 * 1000);
  });

  it("scrolling down on the hour button subtracts 1h from endsAt", () => {
    const { container } = renderTabContentEnd();
=======
    const { container } = MountedTabContentEnd();
    ValidateTimeButton(
      container,
      "endsAt",
      2,
      /angle-down/,
      -1 * 3600 * 1000,
    );
  });

  it("scrolling down on the hour button subtracts 1h from endsAt", () => {
    const { container } = MountedTabContentEnd();
>>>>>>> f2d4110a (upgrading to react 19)
    ValidateTimeWheel(
      container,
      "endsAt",
      "td.components-hour-down",
      1,
      -1 * 3600 * 1000,
    );
  });

  it("clicking on the minute dec button subtracts 1m from endsAt", () => {
<<<<<<< HEAD
    const { container } = renderTabContentEnd();
    ValidateTimeButton(container, "endsAt", 3, /angle-down/, -1 * 60 * 1000);
  });

  it("scrolling down on the minute button subtracts 1m from endsAt", () => {
    const { container } = renderTabContentEnd();
=======
    const { container } = MountedTabContentEnd();
    ValidateTimeButton(
      container,
      "endsAt",
      3,
      /angle-down/,
      -1 * 60 * 1000,
    );
  });

  it("scrolling down on the minute button subtracts 1m from endsAt", () => {
    const { container } = MountedTabContentEnd();
>>>>>>> f2d4110a (upgrading to react 19)
    ValidateTimeWheel(
      container,
      "endsAt",
      "td.components-minute-down",
      50,
      -1 * 60 * 1000,
    );
  });

  it("scrolling up on the minute adds 1m to endsAt", () => {
<<<<<<< HEAD
    const { container } = renderTabContentEnd();
=======
    const { container } = MountedTabContentEnd();
>>>>>>> f2d4110a (upgrading to react 19)
    ValidateTimeWheel(
      container,
      "endsAt",
      "td.components-minute",
      -10,
      60 * 1000,
    );
  });

  it("scrolling down on the minute subtracts 1m from endsAt", () => {
<<<<<<< HEAD
    const { container } = renderTabContentEnd();
=======
    const { container } = MountedTabContentEnd();
>>>>>>> f2d4110a (upgrading to react 19)
    ValidateTimeWheel(
      container,
      "endsAt",
      "td.components-minute",
      15,
      -1 * 60 * 1000,
    );
  });
});

const ValidateDurationButton = (
  elemIndex: number,
  iconMatch: RegExp,
  expectedDiff: number,
) => {
  const { container } = render(
    <TabContentDuration silenceFormStore={silenceFormStore} />,
  );
<<<<<<< HEAD
  const buttons = container.querySelectorAll("td > span");
  const button = buttons[elemIndex];
=======
  const button = container.querySelectorAll("td > span")[elemIndex];
>>>>>>> f2d4110a (upgrading to react 19)
  expect(button.innerHTML).toMatch(iconMatch);

  const oldEndsAt = new Date(silenceFormStore.data.endsAt);
  fireEvent.click(button);
  expect(silenceFormStore.data.endsAt.toISOString()).not.toBe(
    oldEndsAt.toISOString(),
  );
  const diffMS = differenceInMilliseconds(
    silenceFormStore.data.endsAt,
    oldEndsAt,
  );
  expect(diffMS).toBe(expectedDiff);
};

const ValidateDurationWheel = (
  elemIndex: number,
  deltaY: number,
  expectedDiff: number,
) => {
  const { container } = render(
    <TabContentDuration silenceFormStore={silenceFormStore} />,
  );
<<<<<<< HEAD
  const elems = container.querySelectorAll(".components-duration");
  const elem = elems[elemIndex];
=======
  const elem = container.querySelectorAll(".components-duration")[elemIndex];
>>>>>>> f2d4110a (upgrading to react 19)

  const oldEndsAt = new Date(silenceFormStore.data.endsAt);

  fireEvent.wheel(elem, { deltaY: deltaY });
  // fire real event so cancel listener will trigger
<<<<<<< HEAD
  const event = new WheelEvent("wheel", { deltaY: deltaY });
=======
  const event = new Event("wheel", { deltaY: deltaY } as EventInit);
>>>>>>> f2d4110a (upgrading to react 19)
  elem.dispatchEvent(event);

  expect(silenceFormStore.data.endsAt.toISOString()).not.toBe(
    oldEndsAt.toISOString(),
  );
  const diffMS = differenceInMilliseconds(
    silenceFormStore.data.endsAt,
    oldEndsAt,
  );
  expect(diffMS).toBe(expectedDiff);
};

describe("<TabContentDuration />", () => {
  it("clicking on the day inc button adds 1d to endsAt", () => {
    ValidateDurationButton(0, /angle-up/, 24 * 3600 * 1000);
  });

  it("scrolling up on the day button adds 1d to endsAt", () => {
    ValidateDurationWheel(0, -1, 24 * 3600 * 1000);
  });

  it("clicking on the day dec button subtracts 1d from endsAt", () => {
    ValidateDurationButton(2, /angle-down/, -1 * 24 * 3600 * 1000);
  });

  it("scrolling down on the day button subtracts 1d from endsAt", () => {
    ValidateDurationWheel(0, 1, -1 * 24 * 3600 * 1000);
  });

  it("clicking on the hour inc button adds 1h to endsAt", () => {
    ValidateDurationButton(3, /angle-up/, 3600 * 1000);
  });

  it("scrolling up on the hour inc button adds 1h to endsAt", () => {
    ValidateDurationWheel(1, -2, 3600 * 1000);
  });

  it("clicking on the hour dec button subtracts 1h from endsAt", () => {
    ValidateDurationButton(5, /angle-down/, -1 * 3600 * 1000);
  });

  it("scrolling down on the hour dec button subtracts 1h from endsAt", () => {
    ValidateDurationWheel(1, 2, -1 * 3600 * 1000);
  });

  it("clicking on the minute inc button adds 5m to endsAt", () => {
    ValidateDurationButton(6, /angle-up/, 5 * 60 * 1000);
  });

  it("scrolling up on the minute inc button adds 5m to endsAt", () => {
    ValidateDurationWheel(2, -1, 5 * 60 * 1000);
  });

  it("clicking on the minute dec button subtracts 5m from endsAt", () => {
    ValidateDurationButton(8, /angle-down/, -1 * 5 * 60 * 1000);
  });

  it("scrolling down on the minute dec button subtracts 5m from endsAt", () => {
    ValidateDurationWheel(2, 1, -1 * 5 * 60 * 1000);
  });
});

const SetDurationTo = (hours: number, minutes: number) => {
  const startsAt = new Date(2060, 1, 1, 0, 0, 0);
  const endsAt = addMinutes(addHours(startsAt, hours), minutes);
  silenceFormStore.data.setStart(startsAt);
  silenceFormStore.data.setEnd(endsAt);
};

describe("<TabContentDuration /> inc minute CalculateChangeValue", () => {
  it("inc on 0:1:0 duration sets 0:1:5", () => {
    SetDurationTo(1, 0);
    ValidateDurationButton(6, /angle-up/, 5 * 60 * 1000);
  });

  it("inc on 0:1:1 duration sets 0:1:2", () => {
    SetDurationTo(1, 1);
    ValidateDurationButton(6, /angle-up/, 60 * 1000);
  });

  it("inc on 0:1:4 duration sets 0:1:5", () => {
    SetDurationTo(1, 4);
    ValidateDurationButton(6, /angle-up/, 60 * 1000);
  });

  it("inc on 0:1:5 duration sets 0:1:10", () => {
    SetDurationTo(1, 5);
    ValidateDurationButton(6, /angle-up/, 5 * 60 * 1000);
  });

  it("inc on 0:1:6 duration sets 0:1:10", () => {
    SetDurationTo(1, 6);
    ValidateDurationButton(6, /angle-up/, 4 * 60 * 1000);
  });

  it("inc on 0:0:55 duration sets 0:1:0", () => {
    SetDurationTo(0, 55);
    ValidateDurationButton(6, /angle-up/, 5 * 60 * 1000);
  });
});

describe("<TabContentDuration /> dec minute CalculateChangeValue", () => {
  it("inc on 0:1:0 duration sets 0:0:55", () => {
    SetDurationTo(1, 0);
    ValidateDurationButton(8, /angle-down/, -5 * 60 * 1000);
  });

  it("inc on 0:0:59 duration sets 0:0:55", () => {
    SetDurationTo(0, 59);
    ValidateDurationButton(8, /angle-down/, -4 * 60 * 1000);
  });

  it("inc on 0:0:56 duration sets 0:0:55", () => {
    SetDurationTo(0, 56);
    ValidateDurationButton(8, /angle-down/, -1 * 60 * 1000);
  });

  it("inc on 0:0:55 duration sets 0:0:50", () => {
    SetDurationTo(1, 0);
    ValidateDurationButton(8, /angle-down/, -5 * 60 * 1000);
  });

  it("inc on 0:1:10 duration sets 0:1:5", () => {
    SetDurationTo(1, 10);
    ValidateDurationButton(8, /angle-down/, -5 * 60 * 1000);
  });

  it("inc on 0:1:6 duration sets 0:1:5", () => {
    SetDurationTo(1, 6);
    ValidateDurationButton(8, /angle-down/, -1 * 60 * 1000);
  });

  it("inc on 0:1:5 duration sets 0:1:0", () => {
    SetDurationTo(1, 5);
    ValidateDurationButton(8, /angle-down/, -5 * 60 * 1000);
  });

  it("inc on 0:1:4 duration sets 0:1:3", () => {
    SetDurationTo(1, 4);
    ValidateDurationButton(8, /angle-down/, -1 * 60 * 1000);
  });

  it("inc on 0:1:1 duration sets 0:1:0", () => {
    SetDurationTo(1, 1);
    ValidateDurationButton(8, /angle-down/, -1 * 60 * 1000);
  });
});

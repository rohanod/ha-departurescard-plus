import {
  buildDeparturesConfig,
  getActiveWindow,
  validateScheduledDeparturesConfig,
} from "./schedule";
import type { ScheduledDeparturesCardConfig, ScheduleWindowConfig } from "./types";

const monday = (hour: number, minute: number) => new Date(2026, 0, 5, hour, minute);
const saturday = (hour: number, minute: number) => new Date(2026, 0, 10, hour, minute);

const entity = { entity: "sensor.bus_10" };

const windowConfig = (
  overrides: Partial<ScheduleWindowConfig> = {},
): ScheduleWindowConfig => ({
  from: "06:00",
  to: "07:10",
  title: "Morning",
  entities: [entity],
  ...overrides,
});

const cardConfig = (
  windows: ScheduleWindowConfig[],
): ScheduledDeparturesCardConfig => ({
  type: "custom:scheduled-departures-card",
  departuresCard: {
    departuresToShow: 4,
    theme: "nord",
    entities: [{ entity: "sensor.should_not_survive" }],
    title: "Shared title",
  },
  windows,
});

describe("schedule matching", () => {
  it("matches from inclusively and to exclusively", () => {
    const windows = [windowConfig()];

    expect(getActiveWindow(windows, monday(6, 0))?.title).toBe("Morning");
    expect(getActiveWindow(windows, monday(7, 9))?.title).toBe("Morning");
    expect(getActiveWindow(windows, monday(7, 10))).toBeUndefined();
  });

  it("treats a missing to time as the end of the local day", () => {
    const windows = [windowConfig({ from: "23:00", to: undefined })];

    expect(getActiveWindow(windows, monday(23, 59))?.title).toBe("Morning");
    expect(getActiveWindow(windows, new Date(2026, 0, 6, 0, 0))).toBeUndefined();
  });

  it("matches every day when days is missing and only listed days when present", () => {
    expect(getActiveWindow([windowConfig()], saturday(6, 30))?.title).toBe("Morning");
    expect(
      getActiveWindow([windowConfig({ days: ["mon", "tue"] })], saturday(6, 30)),
    ).toBeUndefined();
    expect(
      getActiveWindow([windowConfig({ days: ["mon", "tue"] })], monday(6, 30))?.title,
    ).toBe("Morning");
  });

  it("returns no active window when no range matches", () => {
    expect(getActiveWindow([windowConfig()], monday(5, 59))).toBeUndefined();
  });
});

describe("config validation", () => {
  it("accepts adjacent windows and rejects overlapping windows on shared days", () => {
    expect(() =>
      validateScheduledDeparturesConfig(
        cardConfig([
          windowConfig({ from: "06:00", to: "07:10", title: "A" }),
          windowConfig({ from: "07:10", to: "08:00", title: "B" }),
        ]),
      ),
    ).not.toThrow();

    expect(() =>
      validateScheduledDeparturesConfig(
        cardConfig([
          windowConfig({ from: "06:00", to: "07:10", days: ["mon"], title: "A" }),
          windowConfig({ from: "07:00", to: "08:00", days: ["mon"], title: "B" }),
        ]),
      ),
    ).toThrow(/overlap/i);
  });

  it("allows the same time ranges on different days", () => {
    expect(() =>
      validateScheduledDeparturesConfig(
        cardConfig([
          windowConfig({ days: ["mon"], title: "Monday" }),
          windowConfig({ days: ["tue"], title: "Tuesday" }),
        ]),
      ),
    ).not.toThrow();
  });

  it("rejects missing required fields, invalid times, invalid days, and empty entities", () => {
    expect(() =>
      validateScheduledDeparturesConfig({
        type: "custom:scheduled-departures-card",
        departuresCard: {},
        windows: [],
      }),
    ).toThrow(/at least one/i);

    expect(() =>
      validateScheduledDeparturesConfig(cardConfig([windowConfig({ from: "6:00" })])),
    ).toThrow(/HH:mm/);

    expect(() =>
      validateScheduledDeparturesConfig(
        cardConfig([windowConfig({ days: ["monday" as never] })]),
      ),
    ).toThrow(/invalid day/i);

    expect(() =>
      validateScheduledDeparturesConfig(cardConfig([windowConfig({ entities: [] })])),
    ).toThrow(/entities/i);
  });
});

describe("departures-card config merging", () => {
  it("keeps shared config and lets the active window supply title and entities", () => {
    const activeWindow = windowConfig({
      title: "Active",
      entities: [{ entity: "sensor.active", lineColor: "#006e3d" }],
    });

    expect(buildDeparturesConfig(cardConfig([activeWindow]), activeWindow)).toEqual({
      type: "custom:departures-card",
      departuresToShow: 4,
      theme: "nord",
      title: "Active",
      entities: [{ entity: "sensor.active", lineColor: "#006e3d" }],
    });
  });
});

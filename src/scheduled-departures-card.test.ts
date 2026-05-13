import { html, LitElement } from "lit";
import { beforeEach, vi } from "vitest";
import { ScheduledDeparturesCard } from "./scheduled-departures-card";

class FakeDeparturesCard extends LitElement {
  public hass: unknown;
  public receivedConfig: unknown;

  setConfig(config: unknown) {
    this.receivedConfig = config;
  }

  render() {
    return html`<div id="fake-card"></div>`;
  }
}

const baseConfig = {
  type: "custom:scheduled-departures-card",
  departuresCard: {
    departuresToShow: 4,
  },
  windows: [
    {
      from: "06:00",
      to: "07:00",
      title: "Morning",
      entities: [{ entity: "sensor.bus_10" }],
    },
  ],
} as const;

const flush = () => Promise.resolve();

describe("ScheduledDeparturesCard", () => {
  beforeEach(() => {
    if (!customElements.get("departures-card")) {
      customElements.define("departures-card", FakeDeparturesCard);
    }
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 0, 5, 6, 30));
  });

  afterEach(() => {
    vi.useRealTimers();
    document.body.replaceChildren();
  });

  it("renders the installed departures-card with merged active config and hass", async () => {
    const card = document.createElement(
      "scheduled-departures-card",
    ) as ScheduledDeparturesCard;

    card.setConfig(baseConfig);
    card.hass = { states: {} };
    document.body.append(card);
    await card.updateComplete;
    await flush();

    const child = card.shadowRoot?.querySelector("departures-card") as FakeDeparturesCard;
    expect(child).toBeTruthy();
    expect(child.receivedConfig).toEqual({
      type: "custom:departures-card",
      departuresToShow: 4,
      title: "Morning",
      entities: [{ entity: "sensor.bus_10" }],
    });
    expect(child.hass).toEqual({ states: {} });
  });

  it("renders nothing and reports size zero when no window matches", async () => {
    vi.setSystemTime(new Date(2026, 0, 5, 8, 0));
    const card = document.createElement(
      "scheduled-departures-card",
    ) as ScheduledDeparturesCard;

    card.setConfig(baseConfig);
    document.body.append(card);
    await card.updateComplete;

    expect(card.shadowRoot?.querySelector("departures-card")).toBeNull();
    expect(card.getCardSize()).toBe(0);
  });

  it("rechecks the active window every minute and cleans up the timer", async () => {
    const clearIntervalSpy = vi.spyOn(window, "clearInterval");
    const card = document.createElement(
      "scheduled-departures-card",
    ) as ScheduledDeparturesCard;

    card.setConfig({
      ...baseConfig,
      windows: [
        ...baseConfig.windows,
        {
          from: "07:00",
          to: "08:00",
          title: "Later",
          entities: [{ entity: "sensor.bus_22" }],
        },
      ],
    });
    document.body.append(card);
    await card.updateComplete;
    vi.setSystemTime(new Date(2026, 0, 5, 7, 1));
    vi.advanceTimersByTime(60_000);
    await card.updateComplete;
    await flush();

    const child = card.shadowRoot?.querySelector("departures-card") as FakeDeparturesCard;
    expect(child.receivedConfig).toMatchObject({
      title: "Later",
      entities: [{ entity: "sensor.bus_22" }],
    });

    card.remove();
    expect(clearIntervalSpy).toHaveBeenCalled();
  });

  it("shows a useful error card for invalid config", async () => {
    const card = document.createElement(
      "scheduled-departures-card",
    ) as ScheduledDeparturesCard;

    card.setConfig({
      type: "custom:scheduled-departures-card",
      departuresCard: {},
      windows: [],
    });
    document.body.append(card);
    await card.updateComplete;

    expect(card.shadowRoot?.textContent).toContain("windows");
  });

  it("provides a Lovelace GUI editor element", () => {
    const editor = ScheduledDeparturesCard.getConfigElement();

    expect(editor.tagName.toLowerCase()).toBe("scheduled-departures-card-editor");
  });
});

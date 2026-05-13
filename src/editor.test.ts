import "./scheduled-departures-card-editor";
import type { ScheduledDeparturesCardEditor } from "./scheduled-departures-card-editor";
import type { ScheduledDeparturesCardConfig } from "./types";

const config: ScheduledDeparturesCardConfig = {
  type: "custom:scheduled-departures-card",
  departuresCard: {
    departuresToShow: 4,
  },
  windows: [
    {
      from: "06:00",
      to: "07:00",
      days: ["mon"],
      title: "Morning",
      entities: [
        {
          entity: "sensor.bus_10",
          lineColor: "#006e3d",
          lineName: null,
          destinationName: null,
          destinationSource: "direction",
        },
      ],
    },
  ],
};

describe("ScheduledDeparturesCardEditor", () => {
  afterEach(() => {
    document.body.replaceChildren();
  });

  it("adds, deletes, and reorders windows through config-changed events", async () => {
    const editor = document.createElement(
      "scheduled-departures-card-editor",
    ) as ScheduledDeparturesCardEditor;
    const listener = vi.fn();
    editor.setConfig(config);
    editor.addEventListener("config-changed", listener);
    document.body.append(editor);

    editor.addWindow();
    expect(listener).toHaveBeenLastCalledWith(
      expect.objectContaining({
        detail: expect.objectContaining({
          config: expect.objectContaining({
            windows: expect.arrayContaining([
              expect.objectContaining({ from: "08:00", title: "New schedule" }),
            ]),
          }),
        }),
      }),
    );

    const addedConfig = listener.mock.calls.at(-1)?.[0].detail.config;
    editor.setConfig({
      ...addedConfig,
      windows: [
        addedConfig.windows[0],
        { ...addedConfig.windows[1], title: "Second" },
      ],
    });
    editor.moveWindow(1, -1);
    expect(listener.mock.calls.at(-1)?.[0].detail.config.windows[0].title).toBe("Second");

    editor.setConfig(listener.mock.calls.at(-1)?.[0].detail.config);
    editor.deleteWindow(0);
    expect(listener.mock.calls.at(-1)?.[0].detail.config.windows).toHaveLength(1);
  });

  it("updates window fields, day toggles, entity rows, and shared yaml config", () => {
    const editor = document.createElement(
      "scheduled-departures-card-editor",
    ) as ScheduledDeparturesCardEditor;
    const listener = vi.fn();
    editor.setConfig(config);
    editor.addEventListener("config-changed", listener);

    editor.updateWindow(0, { title: "Updated", to: "" });
    expect(listener.mock.calls.at(-1)?.[0].detail.config.windows[0]).toMatchObject({
      title: "Updated",
    });
    expect(listener.mock.calls.at(-1)?.[0].detail.config.windows[0]).not.toHaveProperty("to");

    editor.setConfig(listener.mock.calls.at(-1)?.[0].detail.config);
    editor.toggleDay(0, "fri");
    expect(listener.mock.calls.at(-1)?.[0].detail.config.windows[0].days).toEqual([
      "mon",
      "fri",
    ]);

    editor.setConfig(listener.mock.calls.at(-1)?.[0].detail.config);
    editor.updateEntity(0, 0, { lineName: "10", destinationName: "Rive" });
    expect(listener.mock.calls.at(-1)?.[0].detail.config.windows[0].entities[0]).toMatchObject({
      lineName: "10",
      destinationName: "Rive",
    });

    editor.updateDeparturesCardYaml("departuresToShow: 2\ntheme: nord\n");
    expect(listener.mock.calls.at(-1)?.[0].detail.config.departuresCard).toEqual({
      departuresToShow: 2,
      theme: "nord",
    });
  });

  it("renders only the departures-card passthrough as YAML and uses visual controls for schedule data", async () => {
    const editor = document.createElement(
      "scheduled-departures-card-editor",
    ) as ScheduledDeparturesCardEditor;
    editor.setConfig(config);
    document.body.append(editor);
    await editor.updateComplete;

    expect(editor.shadowRoot?.querySelectorAll("textarea")).toHaveLength(1);
    expect(editor.shadowRoot?.querySelector("textarea")?.getAttribute("aria-label")).toBe(
      "departuresCard YAML",
    );
    expect(editor.shadowRoot?.querySelector('ha-textfield[data-field="from"]')).toBeTruthy();
    expect(editor.shadowRoot?.querySelector('ha-textfield[data-field="title"]')).toBeTruthy();
    expect(editor.shadowRoot?.querySelector('input[type="checkbox"]')).toBeTruthy();
    expect(editor.shadowRoot?.querySelector("ha-entity-picker")).toBeTruthy();
    expect(editor.shadowRoot?.querySelector('input[type="color"]')).toBeTruthy();
    expect(editor.shadowRoot?.textContent).toContain("Schedule windows");
  });

  it("updates entity rows from Home Assistant picker and control events", () => {
    const editor = document.createElement(
      "scheduled-departures-card-editor",
    ) as ScheduledDeparturesCardEditor;
    const listener = vi.fn();
    editor.setConfig(config);
    editor.addEventListener("config-changed", listener);

    editor.handleEntityPicked(0, 0, "sensor.bus_22");
    expect(listener.mock.calls.at(-1)?.[0].detail.config.windows[0].entities[0].entity).toBe(
      "sensor.bus_22",
    );

    editor.setConfig(listener.mock.calls.at(-1)?.[0].detail.config);
    editor.handleEntityFieldChanged(0, 0, "destinationSource", "direction");
    expect(
      listener.mock.calls.at(-1)?.[0].detail.config.windows[0].entities[0].destinationSource,
    ).toBe("direction");
  });
});

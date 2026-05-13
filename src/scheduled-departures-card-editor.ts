import { LitElement, css, html, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { parse, stringify } from "yaml";
import { DAYS } from "./schedule";
import type {
  DepartureEntityConfig,
  HomeAssistant,
  ScheduledDeparturesCardConfig,
  ScheduleDay,
  ScheduleWindowConfig,
} from "./types";

const EMPTY_ENTITY: DepartureEntityConfig = {
  entity: "",
  lineColor: "",
  lineName: null,
  destinationName: null,
  destinationSource: "direction",
};

@customElement("scheduled-departures-card-editor")
export class ScheduledDeparturesCardEditor extends LitElement {
  @property({ attribute: false })
  public hass?: HomeAssistant;

  @state()
  private config?: ScheduledDeparturesCardConfig;

  @state()
  private yamlError?: string;

  public setConfig(config: ScheduledDeparturesCardConfig): void {
    this.config = cloneConfig(config);
    this.yamlError = undefined;
  }

  public addWindow(): void {
    if (!this.config) {
      return;
    }

    this.emitConfig({
      ...this.config,
      windows: [
        ...this.config.windows,
        {
          from: "08:00",
          title: "New schedule",
          entities: [{ ...EMPTY_ENTITY }],
        },
      ],
    });
  }

  public deleteWindow(index: number): void {
    if (!this.config) {
      return;
    }

    this.emitConfig({
      ...this.config,
      windows: this.config.windows.filter((_, windowIndex) => windowIndex !== index),
    });
  }

  public moveWindow(index: number, direction: -1 | 1): void {
    if (!this.config) {
      return;
    }

    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= this.config.windows.length) {
      return;
    }

    const windows = [...this.config.windows];
    const [windowConfig] = windows.splice(index, 1);
    windows.splice(targetIndex, 0, windowConfig);
    this.emitConfig({ ...this.config, windows });
  }

  public updateWindow(index: number, updates: Partial<ScheduleWindowConfig>): void {
    if (!this.config) {
      return;
    }

    const windows = this.config.windows.map((windowConfig, windowIndex) => {
      if (windowIndex !== index) {
        return windowConfig;
      }

      const updatedWindow = { ...windowConfig, ...updates };
      if (updates.to === "") {
        delete updatedWindow.to;
      }
      return updatedWindow;
    });

    this.emitConfig({ ...this.config, windows });
  }

  public handleWindowFieldChanged(
    index: number,
    field: "from" | "to" | "title",
    value: string,
  ): void {
    this.updateWindow(index, { [field]: value } as Partial<ScheduleWindowConfig>);
  }

  public toggleDay(index: number, day: ScheduleDay): void {
    if (!this.config) {
      return;
    }

    const windowConfig = this.config.windows[index];
    const days = windowConfig.days ? [...windowConfig.days] : [];
    const nextDays = days.includes(day)
      ? days.filter((existingDay) => existingDay !== day)
      : [...days, day];

    this.updateWindow(index, {
      days: nextDays.length > 0 ? nextDays : undefined,
    });
  }

  public addEntity(windowIndex: number): void {
    const windowConfig = this.config?.windows[windowIndex];
    if (!windowConfig) {
      return;
    }

    this.updateWindow(windowIndex, {
      entities: [...windowConfig.entities, { ...EMPTY_ENTITY }],
    });
  }

  public deleteEntity(windowIndex: number, entityIndex: number): void {
    const windowConfig = this.config?.windows[windowIndex];
    if (!windowConfig) {
      return;
    }

    this.updateWindow(windowIndex, {
      entities: windowConfig.entities.filter((_, index) => index !== entityIndex),
    });
  }

  public updateEntity(
    windowIndex: number,
    entityIndex: number,
    updates: Partial<DepartureEntityConfig>,
  ): void {
    const windowConfig = this.config?.windows[windowIndex];
    if (!windowConfig) {
      return;
    }

    this.updateWindow(windowIndex, {
      entities: windowConfig.entities.map((entityConfig, index) =>
        index === entityIndex ? { ...entityConfig, ...updates } : entityConfig,
      ),
    });
  }

  public handleEntityPicked(windowIndex: number, entityIndex: number, value: string): void {
    this.updateEntity(windowIndex, entityIndex, { entity: value });
  }

  public handleEntityFieldChanged(
    windowIndex: number,
    entityIndex: number,
    field: keyof DepartureEntityConfig,
    value: string,
  ): void {
    this.updateEntity(windowIndex, entityIndex, {
      [field]: nullableValue(value),
    });
  }

  public updateDeparturesCardYaml(value: string): void {
    if (!this.config) {
      return;
    }

    try {
      const parsed = parse(value);
      if (!isRecord(parsed)) {
        throw new Error("departuresCard YAML must define an object.");
      }

      this.yamlError = undefined;
      this.emitConfig({
        ...this.config,
        departuresCard: parsed,
      });
    } catch (error) {
      this.yamlError = error instanceof Error ? error.message : String(error);
      this.requestUpdate();
    }
  }

  protected render() {
    if (!this.config) {
      return nothing;
    }

    return html`
      <div class="editor">
        <label>
          Shared departures-card YAML
          <textarea
            aria-label="departuresCard YAML"
            rows="12"
            .value=${stringify(this.config.departuresCard).trimEnd()}
            @change=${(event: Event) =>
              this.updateDeparturesCardYaml((event.target as HTMLTextAreaElement).value)}
          ></textarea>
        </label>
        ${this.yamlError ? html`<div class="error">${this.yamlError}</div>` : nothing}

        <div class="header">
          <h3>Schedule windows</h3>
          <button type="button" @click=${() => this.addWindow()}>Add window</button>
        </div>

        ${this.config.windows.map(
          (windowConfig, windowIndex) => html`
            <section class="window">
              <div class="window-toolbar">
                <div class="window-heading">
                  <span class="eyebrow">Window ${windowIndex + 1}</span>
                  <strong>${windowConfig.title || "Untitled schedule"}</strong>
                  <small>${windowConfig.from}${windowConfig.to ? ` - ${windowConfig.to}` : " onward"}</small>
                </div>
                <span class="actions">
                  <button
                    type="button"
                    ?disabled=${windowIndex === 0}
                    @click=${() => this.moveWindow(windowIndex, -1)}
                  >
                    Up
                  </button>
                  <button
                    type="button"
                    ?disabled=${windowIndex === this.config!.windows.length - 1}
                    @click=${() => this.moveWindow(windowIndex, 1)}
                  >
                    Down
                  </button>
                  <button type="button" @click=${() => this.deleteWindow(windowIndex)}>
                    Delete
                  </button>
                </span>
              </div>

              <div class="grid">
                ${this.renderWindowField(windowIndex, "from", "From", windowConfig.from, "time")}
                ${this.renderWindowField(windowIndex, "to", "To", windowConfig.to ?? "", "time")}
                ${this.renderWindowField(windowIndex, "title", "Title", windowConfig.title)}
              </div>

              <fieldset class="days">
                <legend>Days</legend>
                ${DAYS.map(
                  (day) => html`
                    <label class="day">
                      <input
                        type="checkbox"
                        .checked=${windowConfig.days?.includes(day) ?? false}
                        @change=${() => this.toggleDay(windowIndex, day)}
                      />
                      ${day}
                    </label>
                  `,
                )}
              </fieldset>

              <div class="header">
                <h4>Entities</h4>
                <button type="button" @click=${() => this.addEntity(windowIndex)}>
                  Add entity
                </button>
              </div>

              ${windowConfig.entities.map(
                (entityConfig, entityIndex) => html`
                  <div class="entity">
                    <ha-entity-picker
                      data-field="entity"
                      label="Entity"
                      .hass=${this.hass}
                      .value=${entityConfig.entity}
                      .allowCustomEntity=${true}
                      @value-changed=${(event: CustomEvent<{ value?: string }>) =>
                        this.handleEntityPicked(windowIndex, entityIndex, event.detail.value ?? "")}
                    ></ha-entity-picker>
                    ${this.renderLineColorField(windowIndex, entityIndex, entityConfig)}
                    ${this.renderEntityField(windowIndex, entityIndex, entityConfig, "lineName")}
                    ${this.renderEntityField(
                      windowIndex,
                      entityIndex,
                      entityConfig,
                      "destinationName",
                    )}
                    ${this.renderDestinationSourceField(windowIndex, entityIndex, entityConfig)}
                    <button
                      type="button"
                      class="delete-entity"
                      @click=${() => this.deleteEntity(windowIndex, entityIndex)}
                    >
                      Delete entity
                    </button>
                  </div>
                `,
              )}
            </section>
          `,
        )}
      </div>
    `;
  }

  private renderWindowField(
    windowIndex: number,
    field: "from" | "to" | "title",
    label: string,
    value: string,
    type = "text",
  ) {
    return html`
      <ha-textfield
        data-field=${field}
        label=${label}
        type=${type}
        .value=${value}
        @change=${(event: Event) =>
          this.handleWindowFieldChanged(windowIndex, field, eventValue(event))}
      ></ha-textfield>
    `;
  }

  private renderEntityField(
    windowIndex: number,
    entityIndex: number,
    entityConfig: DepartureEntityConfig,
    field: keyof DepartureEntityConfig,
  ) {
    return html`
      <ha-textfield
        label=${entityFieldLabel(field)}
        .value=${String(entityConfig[field] ?? "")}
        @change=${(event: Event) =>
          this.handleEntityFieldChanged(windowIndex, entityIndex, field, eventValue(event))}
        data-field=${String(field)}
      ></ha-textfield>
    `;
  }

  private renderLineColorField(
    windowIndex: number,
    entityIndex: number,
    entityConfig: DepartureEntityConfig,
  ) {
    const lineColor = String(entityConfig.lineColor ?? "");

    return html`
      <div class="color-field">
        <label>
          <span>Line color</span>
          <input
            type="color"
            .value=${validHexColor(lineColor) ? lineColor : "#000000"}
            @input=${(event: Event) =>
              this.handleEntityFieldChanged(windowIndex, entityIndex, "lineColor", eventValue(event))}
          />
        </label>
        <ha-textfield
          data-field="lineColor"
          label="Hex"
          .value=${lineColor}
          @change=${(event: Event) =>
            this.handleEntityFieldChanged(windowIndex, entityIndex, "lineColor", eventValue(event))}
        ></ha-textfield>
      </div>
    `;
  }

  private renderDestinationSourceField(
    windowIndex: number,
    entityIndex: number,
    entityConfig: DepartureEntityConfig,
  ) {
    const value = String(entityConfig.destinationSource ?? "");

    return html`
      <ha-select
        data-field="destinationSource"
        label="Destination source"
        .value=${value}
        @selected=${(event: Event) =>
          this.handleEntityFieldChanged(
            windowIndex,
            entityIndex,
            "destinationSource",
            eventValue(event),
          )}
        @change=${(event: Event) =>
          this.handleEntityFieldChanged(
            windowIndex,
            entityIndex,
            "destinationSource",
            eventValue(event),
          )}
      >
        ${destinationSourceOptions(value).map(
          (option) => html`<mwc-list-item .value=${option}>${option || "Default"}</mwc-list-item>`,
        )}
      </ha-select>
    `;
  }

  private emitConfig(config: ScheduledDeparturesCardConfig): void {
    this.config = cloneConfig(config);
    this.dispatchEvent(
      new CustomEvent("config-changed", {
        detail: { config },
        bubbles: true,
        composed: true,
      }),
    );
  }

  static styles = css`
    :host {
      display: block;
    }

    .editor {
      display: grid;
      gap: 16px;
    }

    label {
      display: grid;
      gap: 6px;
      font-weight: 500;
    }

    input,
    textarea,
    ha-textfield,
    ha-entity-picker,
    ha-select {
      box-sizing: border-box;
      width: 100%;
    }

    input,
    textarea {
      border: 1px solid var(--divider-color, #d0d0d0);
      border-radius: 4px;
      background: var(--card-background-color, #fff);
      color: var(--primary-text-color, #111);
      font: inherit;
      padding: 8px;
    }

    textarea {
      font-family: var(--code-font-family, monospace);
      min-height: 180px;
    }

    button {
      border: 1px solid var(--divider-color, #d0d0d0);
      border-radius: 4px;
      background: var(--secondary-background-color, #f4f4f4);
      color: var(--primary-text-color, #111);
      cursor: pointer;
      font: inherit;
      padding: 6px 10px;
    }

    button:disabled {
      cursor: default;
      opacity: 0.5;
    }

    .header,
    .window-toolbar {
      align-items: center;
      display: flex;
      gap: 8px;
      justify-content: space-between;
    }

    .window-heading {
      display: grid;
      gap: 2px;
    }

    .window-heading strong {
      font-size: 1rem;
    }

    .window-heading small,
    .eyebrow {
      color: var(--secondary-text-color, #666);
    }

    .eyebrow {
      font-size: 0.75rem;
      font-weight: 700;
      letter-spacing: 0.02em;
      text-transform: uppercase;
    }

    .actions {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
      justify-content: flex-end;
    }

    h3,
    h4 {
      margin: 0;
    }

    .window {
      border: 1px solid var(--divider-color, #d0d0d0);
      border-radius: 8px;
      display: grid;
      gap: 12px;
      padding: 12px;
    }

    .grid,
    .entity {
      display: grid;
      gap: 10px;
      grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
    }

    .entity {
      align-items: end;
      border: 1px solid var(--divider-color, #d0d0d0);
      border-radius: 6px;
      padding: 10px;
    }

    .color-field {
      align-items: end;
      display: grid;
      gap: 8px;
      grid-template-columns: 52px minmax(100px, 1fr);
    }

    .color-field label {
      gap: 4px;
    }

    .color-field span {
      color: var(--secondary-text-color, #666);
      font-size: 0.75rem;
    }

    input[type="color"] {
      height: 40px;
      padding: 2px;
    }

    .delete-entity {
      min-height: 40px;
    }

    fieldset {
      border: 1px solid var(--divider-color, #d0d0d0);
      border-radius: 6px;
      margin: 0;
      padding: 10px;
    }

    .day {
      display: inline-flex;
      gap: 4px;
      margin: 4px 10px 4px 0;
    }

    .day input {
      width: auto;
    }

    .error {
      color: var(--error-color, #db4437);
    }
  `;
}

function cloneConfig(config: ScheduledDeparturesCardConfig): ScheduledDeparturesCardConfig {
  return structuredClone(config);
}

function eventValue(event: Event): string {
  const customEvent = event as CustomEvent<{ value?: string }>;
  if (customEvent.detail?.value !== undefined) {
    return customEvent.detail.value;
  }

  return (event.target as HTMLInputElement | HTMLSelectElement | null)?.value ?? "";
}

function nullableValue(value: string): string | null {
  return value === "" ? null : value;
}

function entityFieldLabel(field: keyof DepartureEntityConfig): string {
  switch (field) {
    case "lineName":
      return "Line name";
    case "destinationName":
      return "Destination name";
    case "destinationSource":
      return "Destination source";
    case "lineColor":
      return "Line color";
    case "entity":
      return "Entity";
    default:
      return String(field);
  }
}

function destinationSourceOptions(currentValue: string): string[] {
  const options = ["", "direction"];
  return currentValue && !options.includes(currentValue) ? [...options, currentValue] : options;
}

function validHexColor(value: string): boolean {
  return /^#[0-9a-f]{6}$/i.test(value);
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

declare global {
  interface HTMLElementTagNameMap {
    "scheduled-departures-card-editor": ScheduledDeparturesCardEditor;
  }
}

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
        <!-- Shared YAML section -->
        <div class="yaml-section">
          <div class="yaml-label">Shared departures-card config</div>
          <textarea
            aria-label="departuresCard YAML"
            rows="10"
            .value=${stringify(this.config.departuresCard).trimEnd()}
            @change=${(event: Event) =>
              this.updateDeparturesCardYaml((event.target as HTMLTextAreaElement).value)}
          ></textarea>
          ${this.yamlError
            ? html`<div class="error-banner" style="margin-top:10px">${this.yamlError}</div>`
            : nothing}
        </div>

        <!-- Windows toolbar -->
        <div class="toolbar">
          <h3>Schedule windows</h3>
          <button type="button" class="btn-primary" @click=${() => this.addWindow()}>
            + Add window
          </button>
        </div>

        <!-- Window cards -->
        ${this.config.windows.map(
          (windowConfig, windowIndex) => html`
            <section class="window">
              <!-- Departure board strip header -->
              <div class="window-toolbar">
                <div class="window-heading">
                  <span class="eyebrow">Window ${windowIndex + 1}</span>
                  <strong>${windowConfig.title || "Untitled schedule"}</strong>
                  <span class="window-timerange">
                    ${windowConfig.from}
                    <span class="arrow">→</span>
                    ${windowConfig.to ?? "∞"}
                  </span>
                </div>
                <span class="actions">
                  <button
                    type="button"
                    class="btn-ghost"
                    ?disabled=${windowIndex === 0}
                    @click=${() => this.moveWindow(windowIndex, -1)}
                    title="Move up"
                  >↑</button>
                  <button
                    type="button"
                    class="btn-ghost"
                    ?disabled=${windowIndex === this.config!.windows.length - 1}
                    @click=${() => this.moveWindow(windowIndex, 1)}
                    title="Move down"
                  >↓</button>
                  <button
                    type="button"
                    class="btn-danger"
                    @click=${() => this.deleteWindow(windowIndex)}
                  >Delete</button>
                </span>
              </div>

              <div class="window-body">
                <!-- Time + title fields -->
                <div class="grid">
                  ${this.renderWindowField(windowIndex, "from", "From", windowConfig.from, "time")}
                  ${this.renderWindowField(windowIndex, "to", "To", windowConfig.to ?? "", "time")}
                  ${this.renderWindowField(windowIndex, "title", "Title", windowConfig.title)}
                </div>

                <!-- Day pill toggles -->
                <div class="days-group">
                  <div class="days-legend">Active days</div>
                  <div class="days-pills">
                    ${DAYS.map((day) => {
                      const checked = windowConfig.days?.includes(day) ?? false;
                      const id = `day-${windowIndex}-${day}`;
                      return html`
                        <div class="day-pill">
                          <input
                            type="checkbox"
                            id=${id}
                            .checked=${checked}
                            @change=${() => this.toggleDay(windowIndex, day)}
                          />
                          <label for=${id}>${day}</label>
                        </div>
                      `;
                    })}
                  </div>
                </div>

                <hr class="divider" />

                <!-- Entities -->
                <div class="entities-toolbar">
                  <h4>Entities</h4>
                  <button
                    type="button"
                    class="btn-ghost"
                    @click=${() => this.addEntity(windowIndex)}
                  >+ Add entity</button>
                </div>

                <div class="entities-section">
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
                          class="btn-danger"
                          style="min-height:40px"
                          @click=${() => this.deleteEntity(windowIndex, entityIndex)}
                        >Remove</button>
                      </div>
                    `,
                  )}
                </div>
              </div>
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
        <div class="color-wrap">
          <span class="color-meta">Color</span>
          <input
            type="color"
            .value=${validHexColor(lineColor) ? lineColor : "#000000"}
            @input=${(event: Event) =>
              this.handleEntityFieldChanged(windowIndex, entityIndex, "lineColor", eventValue(event))}
          />
        </div>
        <ha-textfield
          data-field="lineColor"
          label="Hex code"
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
    /* ── Transit Board Design System ─────────────────────────────── */
    :host {
      display: block;
      font-family: 'Inter', 'Helvetica Neue', system-ui, sans-serif;
    }

    /* ── Root editor shell ───────────────────────────────────────── */
    .editor {
      display: grid;
      gap: 20px;
    }

    /* ── Section: Shared YAML ────────────────────────────────────── */
    .yaml-section {
      background: var(--card-background-color, #1a1d27);
      border: 1px solid rgba(245, 166, 35, 0.2);
      border-radius: 10px;
      padding: 16px;
      position: relative;
      overflow: hidden;
    }

    .yaml-section::before {
      content: '';
      position: absolute;
      inset: 0 auto 0 0;
      width: 3px;
      background: #f5a623;
      border-radius: 10px 0 0 10px;
    }

    .yaml-label {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 0.7rem;
      font-weight: 700;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      color: #f5a623;
      margin-bottom: 10px;
    }

    .yaml-label::after {
      content: '';
      flex: 1;
      height: 1px;
      background: rgba(245, 166, 35, 0.15);
    }

    textarea {
      box-sizing: border-box;
      width: 100%;
      background: rgba(0, 0, 0, 0.35);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 6px;
      color: #e8eaf2;
      font-family: 'JetBrains Mono', 'Fira Code', 'Cascadia Code', monospace;
      font-size: 0.8rem;
      line-height: 1.6;
      min-height: 160px;
      padding: 12px 14px;
      resize: vertical;
      transition: border-color 0.15s ease;
    }

    textarea:focus {
      border-color: rgba(245, 166, 35, 0.5);
      outline: none;
    }

    /* ── Toolbar row (header + action button) ────────────────────── */
    .toolbar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 10px;
    }

    .section-label {
      font-size: 0.7rem;
      font-weight: 700;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      color: var(--secondary-text-color, #8891a8);
    }

    h3, h4 {
      margin: 0;
      font-size: 0.8rem;
      font-weight: 700;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      color: var(--secondary-text-color, #8891a8);
    }

    /* ── Buttons ─────────────────────────────────────────────────── */
    button {
      cursor: pointer;
      font: inherit;
      font-size: 0.75rem;
      font-weight: 600;
      letter-spacing: 0.04em;
      border-radius: 6px;
      padding: 6px 12px;
      transition: all 0.15s ease;
      border: 1px solid transparent;
    }

    .btn-primary {
      background: #f5a623;
      border-color: #f5a623;
      color: #0f1117;
    }

    .btn-primary:hover {
      background: #ffc04d;
      border-color: #ffc04d;
      box-shadow: 0 0 0 3px rgba(245, 166, 35, 0.2);
    }

    .btn-ghost {
      background: transparent;
      border-color: rgba(255, 255, 255, 0.12);
      color: var(--secondary-text-color, #8891a8);
    }

    .btn-ghost:hover:not(:disabled) {
      border-color: rgba(255, 255, 255, 0.25);
      color: var(--primary-text-color, #e8eaf2);
      background: rgba(255, 255, 255, 0.05);
    }

    .btn-danger {
      background: transparent;
      border-color: rgba(220, 53, 69, 0.3);
      color: #ff6b7a;
    }

    .btn-danger:hover {
      background: rgba(220, 53, 69, 0.1);
      border-color: rgba(220, 53, 69, 0.6);
    }

    button:disabled {
      cursor: default;
      opacity: 0.35;
    }

    /* ── ha-* component overrides ────────────────────────────────── */
    input,
    ha-textfield,
    ha-entity-picker,
    ha-select {
      box-sizing: border-box;
      width: 100%;
    }

    /* ── Window card ─────────────────────────────────────────────── */
    .window {
      background: var(--card-background-color, #1a1d27);
      border: 1px solid rgba(255, 255, 255, 0.07);
      border-radius: 12px;
      display: grid;
      gap: 16px;
      padding: 0;
      overflow: hidden;
      transition: border-color 0.2s ease;
    }

    .window:hover {
      border-color: rgba(245, 166, 35, 0.25);
    }

    /* Window header "departure board" strip */
    .window-toolbar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 10px;
      background: rgba(0, 0, 0, 0.3);
      border-bottom: 1px solid rgba(255, 255, 255, 0.06);
      padding: 12px 16px;
    }

    .window-heading {
      display: flex;
      flex-direction: column;
      gap: 2px;
      min-width: 0;
    }

    .eyebrow {
      font-size: 0.65rem;
      font-weight: 700;
      letter-spacing: 0.15em;
      text-transform: uppercase;
      color: #f5a623;
      opacity: 0.7;
    }

    .window-heading strong {
      font-size: 0.95rem;
      font-weight: 600;
      color: var(--primary-text-color, #e8eaf2);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .window-timerange {
      display: inline-flex;
      align-items: center;
      gap: 5px;
      font-family: 'JetBrains Mono', 'Fira Code', monospace;
      font-size: 0.72rem;
      color: rgba(245, 166, 35, 0.8);
      background: rgba(245, 166, 35, 0.08);
      border: 1px solid rgba(245, 166, 35, 0.15);
      border-radius: 4px;
      padding: 2px 7px;
      margin-top: 2px;
      width: fit-content;
    }

    .window-timerange .arrow {
      opacity: 0.5;
    }

    .actions {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
      align-items: center;
      justify-content: flex-end;
      flex-shrink: 0;
    }

    /* Window body */
    .window-body {
      display: grid;
      gap: 16px;
      padding: 16px;
    }

    /* ── Field grid ──────────────────────────────────────────────── */
    .grid {
      display: grid;
      gap: 10px;
      grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    }

    /* ── Day toggles ─────────────────────────────────────────────── */
    .days-group {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .days-legend {
      font-size: 0.68rem;
      font-weight: 700;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      color: var(--secondary-text-color, #8891a8);
    }

    .days-pills {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
    }

    .day-pill {
      position: relative;
    }

    .day-pill input[type="checkbox"] {
      position: absolute;
      opacity: 0;
      width: 0;
      height: 0;
    }

    .day-pill label {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 38px;
      height: 28px;
      border-radius: 5px;
      font-size: 0.72rem;
      font-weight: 700;
      letter-spacing: 0.05em;
      text-transform: uppercase;
      cursor: pointer;
      transition: all 0.15s ease;
      border: 1px solid rgba(255, 255, 255, 0.1);
      background: rgba(255, 255, 255, 0.04);
      color: var(--secondary-text-color, #8891a8);
      user-select: none;
    }

    .day-pill input:checked + label {
      background: #f5a623;
      border-color: #f5a623;
      color: #0f1117;
      box-shadow: 0 0 8px rgba(245, 166, 35, 0.35);
    }

    .day-pill label:hover {
      border-color: rgba(245, 166, 35, 0.4);
      color: #f5a623;
    }

    /* ── Entity row ──────────────────────────────────────────────── */
    .entities-section {
      display: grid;
      gap: 10px;
    }

    .entity {
      display: grid;
      gap: 10px;
      grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
      align-items: end;
      background: rgba(0, 0, 0, 0.2);
      border: 1px solid rgba(255, 255, 255, 0.05);
      border-left: 3px solid rgba(245, 166, 35, 0.3);
      border-radius: 8px;
      padding: 12px;
      transition: border-left-color 0.2s ease;
    }

    .entity:hover {
      border-left-color: #f5a623;
    }

    /* ── Color swatch + hex field ─────────────────────────────────── */
    .color-field {
      display: grid;
      gap: 6px;
      grid-template-columns: 40px minmax(80px, 1fr);
      align-items: end;
    }

    .color-field .color-wrap {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .color-field .color-meta {
      font-size: 0.65rem;
      font-weight: 600;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      color: var(--secondary-text-color, #8891a8);
    }

    input[type="color"] {
      width: 40px;
      height: 40px;
      padding: 2px;
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 6px;
      background: rgba(0, 0, 0, 0.3);
      cursor: pointer;
    }

    /* ── Error states ────────────────────────────────────────────── */
    .error-banner {
      display: flex;
      align-items: flex-start;
      gap: 8px;
      background: rgba(220, 53, 69, 0.08);
      border: 1px solid rgba(220, 53, 69, 0.3);
      border-radius: 8px;
      padding: 10px 12px;
      font-size: 0.8rem;
      color: #ff6b7a;
    }

    .error-banner::before {
      content: '⚠';
      flex-shrink: 0;
      font-size: 0.9rem;
    }

    .error {
      color: #ff6b7a;
      font-size: 0.78rem;
    }

    /* ── Divider ─────────────────────────────────────────────────── */
    .divider {
      height: 1px;
      background: rgba(255, 255, 255, 0.06);
      margin: 0;
      border: none;
    }

    /* ── Entity sub-header ───────────────────────────────────────── */
    .entities-toolbar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 8px;
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

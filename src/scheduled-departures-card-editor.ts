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
                <strong>${windowConfig.title || `Window ${windowIndex + 1}`}</strong>
                <span>
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
                <label>
                  From
                  <input
                    type="time"
                    .value=${windowConfig.from}
                    @change=${(event: Event) =>
                      this.updateWindow(windowIndex, {
                        from: (event.target as HTMLInputElement).value,
                      })}
                  />
                </label>
                <label>
                  To
                  <input
                    type="time"
                    .value=${windowConfig.to ?? ""}
                    @change=${(event: Event) =>
                      this.updateWindow(windowIndex, {
                        to: (event.target as HTMLInputElement).value,
                      })}
                  />
                </label>
                <label>
                  Title
                  <input
                    .value=${windowConfig.title}
                    @change=${(event: Event) =>
                      this.updateWindow(windowIndex, {
                        title: (event.target as HTMLInputElement).value,
                      })}
                  />
                </label>
              </div>

              <fieldset>
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
                    ${this.renderEntityField(windowIndex, entityIndex, entityConfig, "entity")}
                    ${this.renderEntityField(windowIndex, entityIndex, entityConfig, "lineColor")}
                    ${this.renderEntityField(windowIndex, entityIndex, entityConfig, "lineName")}
                    ${this.renderEntityField(
                      windowIndex,
                      entityIndex,
                      entityConfig,
                      "destinationName",
                    )}
                    ${this.renderEntityField(
                      windowIndex,
                      entityIndex,
                      entityConfig,
                      "destinationSource",
                    )}
                    <button
                      type="button"
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

  private renderEntityField(
    windowIndex: number,
    entityIndex: number,
    entityConfig: DepartureEntityConfig,
    field: keyof DepartureEntityConfig,
  ) {
    return html`
      <label>
        ${field}
        <input
          .value=${String(entityConfig[field] ?? "")}
          @change=${(event: Event) =>
            this.updateEntity(windowIndex, entityIndex, {
              [field]: nullableValue((event.target as HTMLInputElement).value),
            })}
          data-field=${String(field)}
        />
      </label>
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
    textarea {
      box-sizing: border-box;
      width: 100%;
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

function nullableValue(value: string): string | null {
  return value === "" ? null : value;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

declare global {
  interface HTMLElementTagNameMap {
    "scheduled-departures-card-editor": ScheduledDeparturesCardEditor;
  }
}

import { LitElement, html, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { buildDeparturesConfig, getActiveWindow, validateScheduledDeparturesConfig } from "./schedule";
import type {
  HomeAssistant,
  ScheduledDeparturesCardConfig,
  ScheduleWindowConfig,
} from "./types";

interface DeparturesCardElement extends HTMLElement {
  hass?: HomeAssistant;
  setConfig?: (config: Record<string, unknown>) => void;
}

@customElement("scheduled-departures-card")
export class ScheduledDeparturesCard extends LitElement {
  @property({ attribute: false })
  public hass?: HomeAssistant;

  @state()
  private config?: ScheduledDeparturesCardConfig;

  @state()
  private activeWindow?: ScheduleWindowConfig;

  @state()
  private error?: string;

  private timerId?: number;
  private child?: DeparturesCardElement;

  public setConfig(config: unknown): void {
    try {
      validateScheduledDeparturesConfig(config);
      this.config = config;
      this.error = undefined;
      this.refreshActiveWindow();
      this.ensureTimer();
    } catch (error) {
      this.config = undefined;
      this.activeWindow = undefined;
      this.error = error instanceof Error ? error.message : String(error);
      this.clearTimer();
    }
  }

  public connectedCallback(): void {
    super.connectedCallback();
    this.ensureTimer();
  }

  public disconnectedCallback(): void {
    this.clearTimer();
    super.disconnectedCallback();
  }

  public getCardSize(): number {
    if (this.error) {
      return 1;
    }

    return this.activeWindow ? 1 : 0;
  }

  protected updated(changedProperties: Map<string, unknown>): void {
    if (changedProperties.has("hass") && this.child && this.hass) {
      this.child.hass = this.hass;
    }

    this.syncChild();
  }

  protected render() {
    if (this.error) {
      return html`
        <ha-card>
          <div class="error">
            <strong>Scheduled Departures Card configuration error</strong>
            <div>${this.error}</div>
          </div>
        </ha-card>
      `;
    }

    if (!this.config || !this.activeWindow) {
      return nothing;
    }

    if (!customElements.get("departures-card")) {
      return html`
        <ha-card>
          <div class="error">
            <strong>Missing required card</strong>
            <div>Install custom:departures-card before using scheduled-departures-card.</div>
          </div>
        </ha-card>
      `;
    }

    return html`<div id="card-host"></div>`;
  }

  private refreshActiveWindow(): void {
    this.activeWindow = this.config ? getActiveWindow(this.config.windows) : undefined;
  }

  private ensureTimer(): void {
    if (!this.isConnected || !this.config || this.timerId) {
      return;
    }

    this.timerId = window.setInterval(() => {
      this.refreshActiveWindow();
    }, 60_000);
  }

  private clearTimer(): void {
    if (this.timerId) {
      window.clearInterval(this.timerId);
      this.timerId = undefined;
    }
  }

  private syncChild(): void {
    const host = this.renderRoot.querySelector("#card-host");
    if (!host || !this.config || !this.activeWindow || !customElements.get("departures-card")) {
      this.child = undefined;
      return;
    }

    const departuresConfig = buildDeparturesConfig(this.config, this.activeWindow);
    if (!this.child || this.child.parentElement !== host) {
      host.replaceChildren();
      this.child = document.createElement("departures-card") as DeparturesCardElement;
      host.append(this.child);
    }

    this.child.setConfig?.(departuresConfig);
    if (this.hass) {
      this.child.hass = this.hass;
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "scheduled-departures-card": ScheduledDeparturesCard;
  }
}

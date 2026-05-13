import "./scheduled-departures-card";
import "./scheduled-departures-card-editor";

declare global {
  interface Window {
    customCards?: Array<Record<string, unknown>>;
  }
}

window.customCards = window.customCards ?? [];
window.customCards.push({
  type: "scheduled-departures-card",
  name: "Scheduled Departures Card",
  description: "Schedule which ha-departures-card departures are shown by local time.",
  preview: false,
});

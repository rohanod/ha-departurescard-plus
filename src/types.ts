export type ScheduleDay = "mon" | "tue" | "wed" | "thu" | "fri" | "sat" | "sun";

export interface DepartureEntityConfig {
  entity: string;
  lineColor?: string | null;
  lineName?: string | null;
  destinationName?: string | null;
  destinationSource?: string | null;
  [key: string]: unknown;
}

export interface ScheduleWindowConfig {
  from: string;
  to?: string;
  days?: ScheduleDay[];
  title: string;
  entities: DepartureEntityConfig[];
}

export interface ScheduledDeparturesCardConfig {
  type: "custom:scheduled-departures-card";
  departuresCard: Record<string, unknown>;
  windows: ScheduleWindowConfig[];
}

export interface HomeAssistant {
  [key: string]: unknown;
}

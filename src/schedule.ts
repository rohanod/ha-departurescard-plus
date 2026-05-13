import type {
  ScheduledDeparturesCardConfig,
  ScheduleDay,
  ScheduleWindowConfig,
} from "./types";

export const DAYS: ScheduleDay[] = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];

const DAY_BY_DATE_INDEX: Record<number, ScheduleDay> = {
  0: "sun",
  1: "mon",
  2: "tue",
  3: "wed",
  4: "thu",
  5: "fri",
  6: "sat",
};

const TIME_PATTERN = /^([01]\d|2[0-3]):([0-5]\d)$/;

export function validateScheduledDeparturesConfig(
  config: unknown,
): asserts config is ScheduledDeparturesCardConfig {
  if (!isObject(config)) {
    throw new Error("Scheduled departures card config must be an object.");
  }

  if (!isObject(config.departuresCard)) {
    throw new Error("departuresCard is required and must be an object.");
  }

  if (!Array.isArray(config.windows) || config.windows.length === 0) {
    throw new Error("windows must include at least one schedule window.");
  }

  config.windows.forEach((windowConfig, index) => {
    validateWindow(windowConfig, index);
  });
  validateNoOverlaps(config.windows as ScheduleWindowConfig[]);
}

export function getActiveWindow(
  windows: ScheduleWindowConfig[],
  now: Date = new Date(),
): ScheduleWindowConfig | undefined {
  const currentDay = DAY_BY_DATE_INDEX[now.getDay()];
  const currentMinute = now.getHours() * 60 + now.getMinutes();

  return windows.find((windowConfig) => {
    const days = windowDays(windowConfig);
    if (!days.includes(currentDay)) {
      return false;
    }

    const from = parseTimeToMinutes(windowConfig.from);
    const to = windowConfig.to ? parseTimeToMinutes(windowConfig.to) : 24 * 60;
    return currentMinute >= from && currentMinute < to;
  });
}

export function buildDeparturesConfig(
  config: ScheduledDeparturesCardConfig,
  activeWindow: ScheduleWindowConfig,
): Record<string, unknown> {
  const { title, entities } = activeWindow;

  return {
    type: "custom:departures-card",
    ...config.departuresCard,
    title,
    entities,
  };
}

function validateWindow(windowConfig: unknown, index: number): void {
  const label = `windows[${index}]`;

  if (!isObject(windowConfig)) {
    throw new Error(`${label} must be an object.`);
  }

  if (!isValidTime(windowConfig.from)) {
    throw new Error(`${label}.from is required and must use HH:mm format.`);
  }

  if (windowConfig.to !== undefined && !isValidTime(windowConfig.to)) {
    throw new Error(`${label}.to must use HH:mm format.`);
  }

  if (
    typeof windowConfig.to === "string" &&
    parseTimeToMinutes(windowConfig.to) <= parseTimeToMinutes(windowConfig.from)
  ) {
    throw new Error(`${label}.to must be later than from.`);
  }

  if (windowConfig.days !== undefined) {
    if (!Array.isArray(windowConfig.days)) {
      throw new Error(`${label}.days must be a list of weekday names.`);
    }

    for (const day of windowConfig.days) {
      if (!DAYS.includes(day as ScheduleDay)) {
        throw new Error(`${label} contains invalid day "${String(day)}".`);
      }
    }
  }

  if (typeof windowConfig.title !== "string") {
    throw new Error(`${label}.title is required and must be a string.`);
  }

  if (!Array.isArray(windowConfig.entities) || windowConfig.entities.length === 0) {
    throw new Error(`${label}.entities must include at least one entity.`);
  }

  windowConfig.entities.forEach((entityConfig, entityIndex) => {
    if (!isObject(entityConfig) || typeof entityConfig.entity !== "string") {
      throw new Error(`${label}.entities[${entityIndex}].entity is required.`);
    }
  });
}

function validateNoOverlaps(windows: ScheduleWindowConfig[]): void {
  for (let leftIndex = 0; leftIndex < windows.length; leftIndex += 1) {
    for (let rightIndex = leftIndex + 1; rightIndex < windows.length; rightIndex += 1) {
      const left = windows[leftIndex];
      const right = windows[rightIndex];
      const sharedDays = windowDays(left).filter((day) => windowDays(right).includes(day));

      if (sharedDays.length > 0 && rangesOverlap(left, right)) {
        throw new Error(
          `Schedule windows ${leftIndex + 1} and ${rightIndex + 1} overlap on ${sharedDays.join(
            ", ",
          )}.`,
        );
      }
    }
  }
}

function rangesOverlap(left: ScheduleWindowConfig, right: ScheduleWindowConfig): boolean {
  const leftStart = parseTimeToMinutes(left.from);
  const leftEnd = left.to ? parseTimeToMinutes(left.to) : 24 * 60;
  const rightStart = parseTimeToMinutes(right.from);
  const rightEnd = right.to ? parseTimeToMinutes(right.to) : 24 * 60;

  return leftStart < rightEnd && rightStart < leftEnd;
}

function windowDays(windowConfig: ScheduleWindowConfig): ScheduleDay[] {
  return windowConfig.days && windowConfig.days.length > 0 ? windowConfig.days : DAYS;
}

function parseTimeToMinutes(time: string): number {
  const match = TIME_PATTERN.exec(time);
  if (!match) {
    throw new Error(`Invalid time "${time}". Times must use HH:mm format.`);
  }

  return Number(match[1]) * 60 + Number(match[2]);
}

function isValidTime(value: unknown): value is string {
  return typeof value === "string" && TIME_PATTERN.test(value);
}

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

# Scheduled Departures Card

`scheduled-departures-card` is a frontend-only Home Assistant Lovelace card that wraps [`ha-departures-card`](https://github.com/alex-jung/ha-departures-card) and chooses which departures to show based on the browser's local time.

This card does not replace `ha-departures-card`. Install `ha-departures-card` first, then install this wrapper.

## Example

```yaml
type: custom:scheduled-departures-card
departuresCard:
  cardOrientation: vertical
  departuresToShow: 4
  showCardHeader: true
  theme: nord
windows:
  - from: "06:00"
    to: "07:10"
    days:
      - mon
      - tue
      - wed
      - thu
      - fri
    title: To LGB
    entities:
      - entity: sensor.bus_10_bouchet_to_rive
        lineColor: "#006e3d"
        destinationName: null
        destinationSource: direction
  - from: "08:00"
    title: To City Center
    entities:
      - entity: sensor.bus_10_bouchet_to_rive
        lineColor: "#006e3d"
        destinationName: null
        destinationSource: direction
```

## Configuration

| Option | Required | Description |
| --- | --- | --- |
| `departuresCard` | yes | Shared config passed through to `custom:departures-card`. |
| `windows` | yes | Schedule windows. The active window supplies `title` and `entities`. |

Each schedule window has one continuous local-time range:

| Option | Required | Description |
| --- | --- | --- |
| `from` | yes | Start time in `HH:mm`, inclusive. |
| `to` | no | End time in `HH:mm`, exclusive. Missing means end of day. |
| `days` | no | Optional list of `mon`, `tue`, `wed`, `thu`, `fri`, `sat`, `sun`. Missing means every day. |
| `title` | yes | Title passed to `ha-departures-card`. |
| `entities` | yes | Entities passed to `ha-departures-card`. |

If no schedule window matches, the card hides itself completely. Overlapping windows are invalid and show a config error.

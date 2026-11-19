import { readFileSync } from "node:fs";
import { normalizeTrains } from "./js/data/normalize.js";

const trains = JSON.parse(readFileSync("data/sample-trains.json", "utf8"));
const events = normalizeTrains(trains, "HKI");

console.table(
  events.map((event) => ({
    trainNumber: event.trainNumber,
    kind: event.kind,
    cancelled: event.cancelled,
  }))
);
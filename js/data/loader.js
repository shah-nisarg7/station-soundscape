import {normalizeTrains} from "./normalize.js";

export async function loadSample(station="HKI"){
    const res = await fetch("data/sample-trains.json");
    if (!res.ok){
        throw new Error('Sample data load failed: ${res.status}');

    }
    const raw = await res.json();
    return normalizeTrains(raw, station);
}     
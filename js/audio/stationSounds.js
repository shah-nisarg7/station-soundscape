//each station gets its diff mood/ key (so it sound slightly different than same pentatonic scale)'

const STATION_SOUNDS = {
  HKI: { rootNote: 60, brightness: 2000 },
  TPE: {rootNote: 65, brightness: 2600 },
  TKU: { rootNote: 67, brightness: 3200 },
  OUL: {rootNote: 60, brightness:1400 },
  RI: {rootNote: 65, brightness: 1800 },
};

//unknown stations use the Helsinki sound
export function getStationSound(station) {
  return STATION_SOUNDS[station] ??STATION_SOUNDS.HKI;
}
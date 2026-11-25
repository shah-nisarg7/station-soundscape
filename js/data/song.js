//searched for a song that matches the pentatonic scales 
//so using mary had a little lamb
const TUNE = [
  [2, 1], [1, 1], [0, 1], [1, 1], [2, 1], [2, 1], [2, 2],
  [1, 1], [1, 1], [1, 2],
  [2, 1], [3, 1], [3, 2],
  [2, 1], [1, 1], [0, 1], [1, 1], [2, 1], [2, 1], [2, 1], [2, 1],
  [1, 1], [1, 1], [2, 1], [1, 1], [0, 4],
];
//hard coded the tune of the song (sourced from some website then told ai to form notes)
const BEAT_IN_REAL_MS = 18000;

export function makeSongEvents(options={}){
    const {station = "HKI",startTime = new Date()} = options;

    let currentTimeInMs = startTime.getTime();
    return TUNE.map(([songStep,beats],index)=>{
        const scheduledTime = new Date(currentTimeInMs).toISOString();
        currentTimeInMs= currentTimeInMs+ beats*BEAT_IN_REAL_MS;

        return{
            id: `song-${index}`,
            trainNumber: 100 + index,
            trainType: "IC",
            category: "Long-distance",
            operator: "vr",
            kind: index % 2 === 0 ?"arrival": "departure",//so dots fly in and out
            station,
            scheduledTime,
            actualTime: scheduledTime,
            delayMin: 0,
            track: String(songStep + 1), //the dots 1 to 4 light up for C, D, E, G
            cancelled: false,
            songStep, // the music code reads this to know which note to play
        };
    });
}
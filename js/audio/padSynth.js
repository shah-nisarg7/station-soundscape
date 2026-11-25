//soft and slow sound , it fades in holds and then fades out
const SETTINGS = {
    attackSeconds : 1.5,//fade in time
    holdSeconds: 1.0, //time for full loudness
    releaseSeconds: 3.0, //time to fade out
    peakVolume : 0.15,//keeping it low for now, will test
    filterFrequency: 2000, //sounds above this get softened
}
export const SONG_VOICE = {
  attackSeconds: 0.03,
  holdSeconds: 0.15,
  releaseSeconds: 1.2,
  peakVolume: 0.22,
  filterFrequency: 2500,
};
export function getEnvelopeTimes(startTime,settings=SETTINGS){
    const peakTime = startTime + settings.attackSeconds;
    const releaseStartTime = peakTime + settings.holdSeconds;
    const endTime = releaseStartTime + settings.releaseSeconds;
    return {startTime,peakTime, releaseStartTime,endTime};
}
export function playPadNote(audioContext, destination, frequency, settings = SETTINGS) {
  const times = getEnvelopeTimes(audioContext.currentTime, settings);
    //i tried diff volume shapes then settled with 0 to peak to hold to 0 
    const noteGain = audioContext.createGain();
    noteGain.gain.linearRampToValueAtTime(SETTINGS.peakVolume, times.peakTime);
    noteGain.gain.setValueAtTime(SETTINGS.peakVolume, times.releaseStartTime);
    noteGain.gain.linearRampToValueAtTime(0, times.endTime);
    //to remove harsh high parts
    const softFilter = audioContext.createBiquadFilter();
    softFilter.type = "lowpass";
    softFilter.frequency.value = SETTINGS.filterFrequency;
    
    //trying to layer sound
    const layers = [
        {type:"sine",detune:-6},
        {type:"triangle",detune:6},
    ];

    for (const layer of layers){
        const oscillator = audioContext.createOscillator();
        oscillator.type = layer.type;
        oscillator.frequency.value = frequency;
        oscillator.detune.value = layer.detune;
        oscillator.connect(softFilter);
        oscillator.start(times.startTime);
        oscillator.stop(times.endTime+0.1)
    }
    softFilter.connect(noteGain);
    noteGain.connect(destination); //sending it to the speakerse
}


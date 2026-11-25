import { midiToFrequency } from "./music.js";

const DRONE_NOTES  = [48,55];
const DRONE_VOLUME = 0.05;
const FADE_IN_SECONDS = 4;

export function startDrone(audioContext,destination){
    const now = audioContext.currentTime;

    //fades in slowly so it doesnt suddenly appear
    const droneGain = audioContext.createGain();
    droneGain.gain.setValueAtTime(0,now);
    droneGain.gain.linearRampToValueAtTime(DRONE_VOLUME,now+FADE_IN_SECONDS);

    //softens it so its a hum type sound not buzz
    const softFilter = audioContext.createBiquadFilter();
    softFilter.type = "lowpass";
    softFilter.frequency.value =600;

    for (const note of DRONE_NOTES){
        const oscillator = audioContext.createOscillator();
        oscillator.type ="sine";
        oscillator.frequency.value = midiToFrequency(note);
        oscillator.connect(softFilter);
        oscillator.start(now);
    }

    softFilter.connect(droneGain);
    droneGain.connect(destination);
}
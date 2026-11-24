import { playPadNote } from "./padSynth.js";
import { createEffects } from "./effects.js";
//controls the browsers audio system (emppty till the user clicks start)
let audioContext = null;
let masterGain = null; //one common volume knob that all sounds will go thru
let currentVolume = 0.5;
let musicBus = null;
//keeps volume bw 0-1 , any other value just becomes 0
export function clampVolume(value){
    if (typeof value!=="number"|| Number.isNaN(value)) return 0;
    return Math.min(1,Math.max(0,value));
}

//a short beep to test if we can hear it (testing audio basically)
function playConfirmationBeep(){
    const now = audioContext.currentTime;
    const oscillator = audioContext.createOscillator();
    const beepGain = audioContext.createGain();

    oscillator.type = "sine";
    oscillator.frequency.value = 440;

    //fade in fast and fade out slowly so theres no click sound
    beepGain.gain.setValueAtTime(0,now);
    beepGain.gain.linearRampToValueAtTime(0.3,now+0.02); //2ms for fast fade in
    beepGain.gain.linearRampToValueAtTime(0,now+0.4);//ig this function basically adds audio volume gradient
     
    oscillator.connect(beepGain);
    beepGain.connect(masterGain);
    oscillator.start(now);
    oscillator.stop(now+0.5);
}

export async function startAudio(){
    
    if (audioContext===null){
        audioContext = new AudioContext();
        masterGain = audioContext.createGain();
        masterGain.gain.value = currentVolume;
        masterGain.connect(audioContext.destination);//basically audio goes to speakers
        musicBus = createEffects(audioContext,masterGain).input;
        }

    await audioContext.resume();
    playConfirmationBeep();
}

export async function pauseAudio(){
    if(audioContext!== null){
        await audioContext.suspend();
    }
}

export function isAudioRunning(){
    return audioContext !== null && audioContext.state ==="running";

}

export function setVolume(value){
    currentVolume = clampVolume(value);
    //if the audio didnt start yet, just saving the value for later
    if(masterGain!==null){
        masterGain.gain.setTargetAtTime(currentVolume,audioContext.currentTime,0.05);
    }
}

export function playNote(frequency){
    if(!isAudioRunning()) return;
    playPadNote(audioContext, musicBus, frequency);
}
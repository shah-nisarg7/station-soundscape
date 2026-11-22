import { getTrainEvents } from "./data/dataSource.js";
import {
    startAudio,
    pauseAudio,
    isAudioRunning,
    setVolume,
    playNote,
} from "./audio/audioEngine.js";
import { eventToFrequency } from "./audio/music.js";
import { startPlayback } from "./audio/trainPlayer.js";
const statusEl = document.getElementById('status');
const startButton = document.getElementById("start-button");
const volumeSlider = document.getElementById("volume-slider");

const STATION_CODE = "HKI";
//opening the page with offline mode to test offline mode manually
function getWantedModeFromUrl(){
    const params = new URLSearchParams(window.location.search);
    return params.get("mode")=== "offline"?"offline":"auto";
}  

//shows live /offline on the page with the event count
function showStatus(result){
    const modeLabel = result.mode ==="live"?"LIVE":"OFFLINE (fake trains)";
    statusEl.textContent = `${modeLabel}:${result.events.length} events for ${STATION_CODE}`;
    statusEl.className = `status ${result.mode}`;
    if (result.reason){
        console.log("Why offline : ",result.reason);
    }       
}

async function init(){
    statusEl.textContent = "Getting train data..";
    try {
        const result = await getTrainEvents(STATION_CODE,{
            wantedMode: getWantedModeFromUrl(),
        });
        showStatus(result);
        currentEvents = result.events;    
        console.table(result.events);

    } catch(error){
        statusEl.textCotent = `could not get any train data : ${error.message}`;
        console.error(error);
    }
}

// called once for every train event , show it and play tis note
function handleTrainEvent(event){
    const frequency = eventToFrequency(event);
    if(frequency===null){
        nowPlayingEl.textContent = `Train ${event.trainNumber} cancelled (silent)`;
        return;
    }
    playNote(frequency);
    nowPlayingEl.textContent = `Train ${event.trainNumber} ${event.kind},  track ${event.track}, ${event.delayMin} mins late`; 
}

async function handleStartButtonClick(){
    if(isAudioRunning()){
        if(stopTrainPlayback) stopTrainPlayback();
        await pauseAudio();
        startButton.textContent = "Start Sound";
    } else {
        await startAudio();
        stopTrainPlayback = startPlayback(currentEvents,handleTrainEvent);
        startButton.textContent= "Pause Sound";
    }
}
//i kept volume range 0-1 so dividing it by 100 so it stays bw that range
function handleVolumeChange(){
    setVolume(Number(volumeSlider.value)/100);
}
startButton.addEventListener("click",handleStartButtonClick);
volumeSlider.addEventListener("input",handleVolumeChange);

const nowPlayingEl = document.getElementById("now-playing");

let currentEvents = []; //filled once data loads
let stopTrainPlayback = null; //set while the music is playing



init();
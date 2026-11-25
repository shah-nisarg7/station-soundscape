import { getTrainEvents } from "./data/dataSource.js";
import { setupCanvas, drawStationRing, drawParticles, drawRipples } from "./viz/canvasView.js";
import {
    startAudio,
    pauseAudio,
    isAudioRunning,
    setVolume,
    playNote,
} from "./audio/audioEngine.js";
import {createRipple, isRippleFinished} from "./viz/ripples.js";
import {eventToFrequency } from "./audio/music.js";
import {createParticle, isParticleFinished } from "./viz/particles.js";
import {TRACK_COUNT } from "./viz/layout.js";
import {startPlayback } from "./audio/trainPlayer.js";
import {getEventStats} from "./data/stats.js";
import{SONG_VOICE} from "./audio/padSynth.js";

const statusEl = document.getElementById('status');
const startButton = document.getElementById("start-button");
const volumeSlider = document.getElementById("volume-slider");
const stationSelect = document.getElementById("station-select");
const scaleSelect = document.getElementById("scale-select");
const hudModeEl = document.getElementById("hud-mode");
const hudEventsEl = document.getElementById("hud-events");
const hudDelayEl = document.getElementById("hud-delay");
const hudProblemsEl = document.getElementById("hud-problems");

let currentScale = "majorPentatonic";

let currentStation = "HKI";
//opening the page with offline mode to test offline mode manually
function getWantedModeFromUrl(){
    const params = new URLSearchParams(window.location.search);
    const modeFromUrl = params.get("mode");
    return ["offline","song"].includes(modeFromUrl)? modeFromUrl: "auto";
}  

//shows live /offline on the page with the event count
function showStatus(result){
    const modeLabel = result.mode ==="live"?"LIVE":"OFFLINE (fake trains)";
    statusEl.textContent = `${modeLabel}:${result.events.length} events for ${currentStation}`;
    statusEl.className = `status ${result.mode}`;
    if (result.reason){
        console.log("Why offline : ",result.reason); }   
    
    //filling the stats panel
    const stats = getEventStats(result.events);
    hudModeEl.textContent= result.mode === "live"? "LIVE":"OFFLINE";
    hudModeEl.className = `hud-value and hud-value ${result.mode}`;
    hudEventsEl.textContent = stats.eventCount;
    hudDelayEl.textContent = `${stats.averageDelayMin.toFixed(1)} min`;
    hudProblemsEl.textContent =  `${stats.lateCount}/${stats.cancelledCount}`;

}

async function init(){
    statusEl.textContent = "Getting train data..";
    try {
        const result = await getTrainEvents(currentStation,{
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
      activeParticles.push(createParticle(event, TRACK_COUNT, performance.now()));
    const frequency = eventToFrequency(event,currentScale);
    if(frequency===null){
        nowPlayingEl.textContent = `Train ${event.trainNumber} cancelled (silent)`;
        return;
    }
    playNote(frequency, event.songStep === undefined ? undefined : SONG_VOICE);
    activeRipples.push(createRipple(event, TRACK_COUNT, performance.now()));
    nowPlayingEl.textContent = `Train ${event.trainNumber} ${event.kind},  track ${event.track}, ${event.delayMin} mins late`; 
}

//starts the train music usingn current events
function startTrainMusic() {
  if (stopTrainPlayback) stopTrainPlayback();
  const isSong =currentEvents.length> 0 &&currentEvents[0].songStep !== undefined;
  const timing = isSong
    ? { minGapSeconds: 0,maxGapSeconds:5, loopPauseSeconds: 2 }
    :{ minGapSeconds: 1,maxGapSeconds:3 };

  stopTrainPlayback =startPlayback(currentEvents,handleTrainEvent, timing);
}

async function handleStartButtonClick() {
  if (isAudioRunning()) {
    if (stopTrainPlayback) stopTrainPlayback();
    await pauseAudio();
    startButton.textContent = "Start sound";
  } else {
    await startAudio();
    startTrainMusic();
    startButton.textContent = "Pause sound";
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
const activeParticles =[];
const activeRipples = [];// rings that are spreading right now

const canvasView = setupCanvas(document.getElementById("viz"));

function redrawCanvas(){
    drawStationRing(canvasView,currentStation);
}
window.addEventListener("resize",()=>{
    canvasView.resize();   
});

function removeFinishedItems(list,isFinished,now){
    for(let index = list.length-1; index>=0;index--){
        if(isFinished(list[index],now)){
            list.splice(index,1);
        }
    }
}
function animationLoop(now){
    removeFinishedItems(activeParticles,isParticleFinished,now);
    removeFinishedItems(activeRipples,isRippleFinished,now);

    drawStationRing(canvasView,currentStation);
    drawRipples(canvasView,activeRipples,now);
    drawParticles(canvasView,activeParticles,now);
    requestAnimationFrame(animationLoop)
}

window.addEventListener("resize",()=>canvasView.resize());
requestAnimationFrame(animationLoop);

//new station so load its trains, restart music if it was playing
async function handleStationChange(){
    currentStation = stationSelect.value;
    await init();
    if(isAudioRunning()) startTrainMusic();
}

function handleScaleChange(){
    currentScale = scaleSelect.value;
}
stationSelect.addEventListener("change", handleStationChange);
scaleSelect.addEventListener("change", handleScaleChange);
init();
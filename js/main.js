import { getTrainEvents } from "./data/dataSource.js";
const statusEl = document.getElementById('status');

const STATION_CODE = "HKI";
//opening the page with offline mode to test offline mode manually
function getWantedModeFromUrl(){
    const params = new URLSearchParams(window.location.search);
    return params.get("mode")=== "offline"?"offline":"auto";
}  

//shows live /offline on the page with the event count
function showStatus(result){
    const modeLabel = result.mode ==="live"?"LIVE":"OFFLINE (sample data)";
    statusEl.textContent = `${modelLabel}:${result.events.length} events for ${STATION_CODE}`;
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
        console.table(result.events);

    } catch(error){
        statusEl.textCotent = `could not get any train data : ${error.message}`;
        console.error(error);
    }
}
init();   
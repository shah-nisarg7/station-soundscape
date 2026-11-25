import { fetchLiveEvents } from "./liveApi.js";
import { makeFakeEvents } from "./simulator.js";
import { makeSongEvents} from "./song.js";
//checking if there is net or no
function browserSaysOffline(){
    return typeof navigator !=="undefined" && navigator.onLine ===false;   
}
//reason = why we went offline(itll be empty when live)
//the options at the end let our test pass in the fake functions
async function makeOfflineEvents(station){
    return makeFakeEvents({station});
}

export async function getTrainEvents(station="HKI", options={}){
    const {
        wantedMode  = "auto",
        getLiveEvents = fetchLiveEvents,
        getSampleEvents = makeOfflineEvents,
        getSongEvents = (stationCode) =>makeSongEvents({station:stationCode }),
    } = options;
    if(wantedMode==="song"){
        return{events:getSongEvents(station),mode:"offline",reasonn:"Song mode"};
    }
    if (wantedMode === "offline"){
        const events = await getSampleEvents(station);
        return {events, mode:"offline",reason: "offline mode was chosen"};

    }
    if (browserSaysOffline()){
        const events = await getSampleEvents(station);
        return { events,mode:"offline",reason: "No internet connection"};
    }
    //trying the live data first
    try{
        const events = await getLiveEvents(station);
        return {events,mode:"live",reason:""};
    }catch(error){
        const events= await getSampleEvents(station);
        return {events, mode:"offline", reason:error.message};
    }
}
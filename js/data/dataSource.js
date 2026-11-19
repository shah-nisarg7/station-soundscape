import { fetchLiveEvents } from "./liveApi.js";
import {loadSample} from "./loader.js";

//checking if there is net or no
function browserSaysOffline(){
    return typeof navigator !=="undefined" && navigator.onLine ===false;   
}
//reason = why we went offline(itll be empty when live)
//the options at the end let our test pass in the fake functions
export async function getTrainEvents(station="HKI", options={}){
    const {
        wantedMode  = "auto",
        getLiveEvents = fetchLiveEvents,
        getSampleEvents = loadSample,
    } = options;
    
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
import { loadSample } from "./data/loader.js";
import {fetchLiveEvents} from "./data/liveApi.js";
const statusEl = document.getElementById('status');

async function init(){
    statusEl.textContent = "getting live train data...";
    try{
        const events = await fetchLiveEvents("HKI");
        statusEl.textContent = `Live data : ${events.length} events for HKI`;
        console.table(events);
    } catch (error) {
        //rn it only shows the problem.. later ill add a offline fallback.
        statusEl.textContent = "Could not get the live data";
        console.error(error);
    }
}     
init();   
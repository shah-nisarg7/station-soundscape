import { loadSample } from "./data/loader.js";

const statusEl = document.getElementById('status');

async function init(){
    try{
        const events = await loadSample("HKI");
        statusEl.textContent = `Loaded ${events.length} events for hki sample data`;
        console.table(events);
    } catch (err){
        statusEl.textContent = "failed to load the data.";
        console.error(err);
    }
}
init();
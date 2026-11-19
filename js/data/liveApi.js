import {normalizeTrains} from "./normalize.js";
// using digitraffic which is Finland's free train data website
//it doesnt require any api key

const LIVE_API_BASE_URL = "https://rata.digitraffic.fi/api/v1/live-trains/station";

const WAIT_LIMIT_IN_MILLISECONDS = 8000; //giving up after 8s if it doesnt load

//builds the full web address for one station like HKI
export function buildLiveUrl(station){
    const settings = new URLSearchParams({
        arrived_trains:"5",//5 trains that alr arrived
        arriving_trains:"5",//5 trains about to arrive
        departed_trains:"5",//5 trains that already left
        departing_trains:"5",//5 trains about to leave
        include_nonstopping:"false",//skip trains that pass thru the station
        train_categories:"Commuter,Long-distance",//passanger trains only (not needed but sure)
    });
    return `${LIVE_API_BASE_URL}/${station}?${settings}`;
}
// gets live trains and cleans them with the same normalizer as we did with sample data
export async function fetchLiveEvents(station="HKI"){
    //this will cancel the req if it takes too long (have to do it with api s)
    const cancelController = new AbortController();
    const timerId = setTimeout(()=> cancelController.abort(),WAIT_LIMIT_IN_MILLISECONDS);

    try {
        const response = await fetch(buildLiveUrl(station),{
            signal: cancelController.signal,
        });

        if (!response.ok){
            throw new Error(`Live data load failed: ${response.status}`);
        }
            const rawTrains = await response.json();

    // we should get a list of trains, if not then throw an error
    if (!Array.isArray(rawTrains)) {
      throw new Error("Live data was not a list of trains");
    }

    // clean the trains and give them back
    return normalizeTrains(rawTrains, station);
  } catch (error) {
    // Give the timeout a clearer message
    if (error.name === "AbortError") {
      throw new Error("Live data took too long (timeout)");
    }
    throw error;
  } finally {
    // stop the timer anyway
    clearTimeout(timerId);
  }
}
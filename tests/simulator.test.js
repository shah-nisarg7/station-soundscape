import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {makeFakeEvents} from "../js/data/simulator.js";
import { normalizeTrains} from "../js/data/normalize.js";
import { start } from "node:repl";
import { normalize } from "node:path";

//fixed start time, so the tests give the same answer daily
const startTime = new Date("2026-11-12T08:00:00.000Z");

test("gives exactly the number of events we ask for", ()=>{
    assert.equal(makeFakeEvents({howManyEvents:10,startTime}).length,10);
    assert.equal(makeFakeEvents({startTime}).length,40);//the default
});

test("same seed gives same events, diff give diff",()=>{
    const first = makeFakeEvents({startTime,seed:5});
    const second = makeFakeEvents({startTime,seed:5});
    const third = makeFakeEvents({startTime,seed:6});
    assert.deepEqual(first,second);
    assert.notDeepEqual(first,third);
});

test("events are in the time order and all come after the start time",()=>{
    const events = makeFakeEvents({startTime});
    const times = events.map((event)=> new Date(event.scheduledTime).getTime());
    assert.ok(times[0]> startTime.getTime());
    for(let index = 1; index<times.length; index++){
        assert.ok(times[index]>= times[index-1]);

    }
});

test("fake events have the same fileds as real cleaned events",()=>{
    const sampleFileUrl = new URL("../data/sample-trains.json",import.meta.url);
    const sampleTrains = JSON.parse(readFileSync(sampleFileUrl,"utf8"));
    const realEvent = normalizeTrains(sampleTrains,"HKI")[0];
    const fakeEvent = makeFakeEvents({startTime})[0];
    assert.deepEqual(Object.keys(fakeEvent).sort(),Object.keys(realEvent).sort());
});

test("values stay in logical range",()=>{
    const events = makeFakeEvents({howManyEvents:200,startTime});
    for (const event of events){
        assert.ok(["arrival","departure"].includes(event.kind));
        assert.ok(event.delayMin>=-1 && event.delayMin <=12);
        assert.ok(Number(event.track)>= 1 && Number(event.track)<=12);

        if(event.cancelled){
            assert.equal(event.actualTime,null);
        }
    } 
});

test("uses the station we give it",()=>{
    const events = makeFakeEvents({station:"TPE", startTime});
    assert.ok(events.every((event)=>event.station==="TPE"));
});
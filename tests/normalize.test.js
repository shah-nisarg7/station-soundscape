import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {normalizeTrains} from "../js/data/normalize.js";

//reading the sample file from disk 
const sampleFileUrl = new URL("../data/sample-trains.json",import.meta.url);
const sampleTrains = JSON.parse(readFileSync(sampleFileUrl, "utf8"));

//small helper so that each test can find one train quickly
function findEventByTrainNumber(events,trainNumber){
    return events.find((event)=> event.trainNumber === trainNumber);
}

test("HKI station gives 6 events from the sample data", ()=>{
    const events = normalizeTrains(sampleTrains,"HKI");
    assert.equal(events.length,6);
})

test("events come out in time order",()=>{
    const events = normalizeTrains(sampleTrains,"HKI");
    const trainNumbersInOrder = events.map((event)=> event.trainNumber);
    assert.deepEqual(trainNumbersInOrder,[27,123,55,12,801,49]);
});
test("cancelled train 801 is marked as cancelled",()=>{
    const events = normalizeTrains(sampleTrains,"HKI");
    assert.equal(findEventByTrainNumber(events,801).cancelled,true);
    assert.equal(findEventByTrainNumber(events,801).cancelled,false);
});

test("delay minutes are copied correctly (late and early)",()=>{
    const events = normalizeTrains(sampleTrains,"HKI");
    assert.equal(findEventByTrainNumber(events,12).delayMin,11);//checking for late
    assert.equal(findEventByTrainNumber(events,49).delayMin,-1);//case for early
});
test ("a station with no trains gives an empty list",()=>{
    const events = normalizeTrains(sampleTrains,"XYZ");
    assert.deepEqual(events,[]);
});
test("a train with no timetable rows does not crash", () => {
  const brokenTrain = [{ trainNumber: 1 }];
  const events = normalizeTrains(brokenTrain, "HKI");
  assert.deepEqual(events, []);
});

test("kind is lowercase and missing actualTime becomes null", () => {
  const events = normalizeTrains(sampleTrains, "HKI");
  assert.equal(findEventByTrainNumber(events, 27).kind, "departure");
  assert.equal(findEventByTrainNumber(events, 801).actualTime, null);
});
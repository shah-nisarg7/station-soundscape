import test from "node:test";
import assert from "node:assert/strict";
import { getEnvelopeTimes } from "../js/audio/padSynth.js";

test("envelope times go in the right order",()=>{
    const times = getEnvelopeTimes(10);
    assert.equal(times.startTime,10);
    assert.ok(times.peakTime>times.startTime);
    assert.ok(times.releaseStartTime>times.peakTime);
    assert.ok(times.endTime>times.releaseStartTime);
});
test("envelope times add up from our settings",()=>{
    const settings = {attackSeconds:2,holdSeconds:1, releaseSeconds:4};
    const times = getEnvelopeTimes(0,settings);
    assert.equal(times.peakTime,2);
    assert.equal(times.releaseStartTime,3);
    assert.equal(times.endTime,7);
});

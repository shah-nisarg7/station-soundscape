import test from "node:test";
import assert from "node:assert/strict";
import { makePlaybackPlan } from "../js/audio/trainPlayer.js";

//makes a small event that happens at a certain time on same day
function eventAt(time) {
  return { scheduledTime: `2026-11-12T${time}:00.000Z` };
}
test("no events gives an empty plan",()=>{
    assert.deepEqual(makePlaybackPlan([]),[]);
});

test("gaps are sped up 1 min become 2s",()=>{
    const events = [eventAt("08:00"), eventAt("08:01"), eventAt("08:03")];
    console.log(events);
    const delays = makePlaybackPlan(events).map((step)=>step.delaySeconds);
    assert.deepEqual(delays,[0,2,6]);
});

test("a very long gap is cut to the maxx", () => {
  const events = [eventAt("08:00"), eventAt("09:00")];
  const delays = makePlaybackPlan(events).map((step) => step.delaySeconds);
  assert.deepEqual(delays, [0, 8]);
});

test("events at the sme time play at the same time", () => {
  const events = [eventAt("08:00"), eventAt("08:00")];
  const delays = makePlaybackPlan(events).map((step) => step.delaySeconds);
  assert.deepEqual(delays, [0, 0]);
});
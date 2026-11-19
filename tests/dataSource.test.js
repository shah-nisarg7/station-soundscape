import test from "node:test";
import assert from "node:assert/strict";
import { getTrainEvents } from "../js/data/dataSource.js";

//fake data sources so no internet is needed
const fakeLIveEvents = [{trainNumber:1}];
const fakeSampleEvents = [{trainNumber:2},{trainNumber:3}];

test("uses live data when it works",async()=>{
    const result = await getTrainEvents("HKI",{
        getLiveEvents: async()=> fakeLIveEvents,
        getSampleEvents : async()=> fakeSampleEvents,

    });
    assert.equal(result.mode,"live");
    assert.deepEqual(result.events,fakeLIveEvents);
});

test("uses sample data when live data fails", async () => {
  const result = await getTrainEvents("HKI", {
    getLiveEvents: async () => {
      throw new Error("Live data request failed: 500");
    },
    getSampleEvents: async () => fakeSampleEvents,
  });
  assert.equal(result.mode, "offline");
  assert.deepEqual(result.events, fakeSampleEvents);
  assert.ok(result.reason.includes("500"));
});

test("offline mode never calls the live website", async () => {
  let liveWasCalled = false;
  const result = await getTrainEvents("HKI", {
    wantedMode: "offline",
    getLiveEvents: async () => {
      liveWasCalled = true;
      return fakeLiveEvents;
    },
    getSampleEvents: async () => fakeSampleEvents,
  });
  assert.equal(liveWasCalled, false);
  assert.equal(result.mode, "offline");
});

test("fails when both live and sample data fail", async () => {
  await assert.rejects(() =>
    getTrainEvents("HKI", {
      getLiveEvents: async () => {
        throw new Error("live broke");
      },
      getSampleEvents: async () => {
        throw new Error("sample broke");
      },
    })
  );
});
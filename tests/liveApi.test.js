import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {buildLiveUrl, fetchLiveEvents} from "../js/data/liveApi.js";

const sampleFileUrl = new URL("../data/sample-trains.json",import.meta.url);
const sampleTrains = JSON.parse(readFileSync(sampleFileUrl, "utf8"));

// Swaps the real fetch for a fake one while a test runs, then puts it back
async function runWithFakeFetch(fakeFetch, testBody) {
  const realFetch = globalThis.fetch;
  globalThis.fetch = fakeFetch;
  try {
    await testBody();
  } finally {
    globalThis.fetch = realFetch;
  }
}
test("buildLiveUrl has the station and passenger settings", () => {
  const url = buildLiveUrl("TPE");
  assert.ok(url.includes("/station/TPE?"));
  assert.ok(url.includes("include_nonstopping=false"));
  assert.ok(url.includes("train_categories=Commuter"));
});
test("fetchLiveEvents cleans the data it gets", async () => {
  const fakeFetch = async () => ({ ok: true, json: async () => sampleTrains });
  await runWithFakeFetch(fakeFetch, async () => {
    const events = await fetchLiveEvents("HKI");
    assert.equal(events.length, 6);
  });
});

test("fetchLiveEvents fails when the website gives a error", async () => {
  const fakeFetch = async () => ({ ok: false, status: 500 });
  await runWithFakeFetch(fakeFetch, async () => {
    await assert.rejects(() => fetchLiveEvents("HKI"), /500/);
  });
});
test("fetchLiveEvents fails when the answer is not a list", async () => {
  const fakeFetch = async () => ({ ok: true, json: async () => ({ oops: true }) });
  await runWithFakeFetch(fakeFetch, async () => {
    await assert.rejects(() => fetchLiveEvents("HKI"), /not a list/);
  });
});
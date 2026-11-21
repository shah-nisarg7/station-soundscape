import test from "node:test";
import assert from "node:assert/strict";
import { clampVolume} from "../js/audio/audioEngine.js";

test("normal volume stays the same",()=>{
    assert.equal(clampVolume(0),0);
    assert.equal(clampVolume(0.3),0.3);
    assert.equal(clampVolume(1),1);
});

test("volumes that are too high / low get cut to 0 or 1",()=>{
    assert.equal(clampVolume(-1),0);
    assert.equal(clampVolume(5),1);
});

test("things that are not numbers become 0",()=>{
    assert.equal(clampVolume("loud"),0);
    assert.equal(clampVolume(NaN),0);
    assert.equal(clampVolume(undefined),0);
});
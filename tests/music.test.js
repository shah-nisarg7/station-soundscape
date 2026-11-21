import test from "node:test";
import assert from "node:assert/strict";
import {
    midiToFrequency,
    getNoteFromScale,
    eventToFrequency,
} from "../js/audio/music.js";

//checks two decimal numbers are almost the same 
function assertClose(actual,expected){
    assert.ok(Math.abs(actual-expected)<0.001, `${actual} is not ${expected}`);
}

function makeEvent(changes = {}){
    return {track:"0", delayMin:0,cancelled:false,...changes};
}

test("miditofreq A is 440 and octave doubles it/halfs it ",()=>{
    assertClose(midiToFrequency(69),440);
    assertClose(midiToFrequency(81),880);
    assertClose(midiToFrequency(57),220);
    assertClose(midiToFrequency(60),261.6256); //middle c /c3
});
test("GetNotefromscale step climbs the scale and octaves",()=>{
    assert.equal(getNoteFromScale("majorPentatonic",0),48);
    assert.equal(getNoteFromScale("majorPentatonic",1),50);
    assert.equal(getNoteFromScale("majorPentatonic",4),57);
    assert.equal(getNoteFromScale("majorPentatonic",5),60);//goes to next octave
    assert.equal(getNoteFromScale("minorPentatonic",2),53);
});
test("getNotefromscale, negative steps go down, unknown scale fails", () => {
  assert.equal(getNoteFromScale("majorPentatonic", -1), 45);
  assert.throws(() => getNoteFromScale("nope", 0), /Unknown scale/);
});
test("eventtofreq , higher track no. gives a higher note",()=>{
    const lowNote = eventToFrequency(makeEvent({track:"1"}));
    const highNote = eventToFrequency(makeEvent({track: "7"}));
    assert.ok(highNote >lowNote);
});

test("eventtofreq , late train is exactly one octave lower",()=>{
    const onTime = eventToFrequency(makeEvent());
    const late = eventToFrequency(makeEvent({delayMin:5}));
    assertClose(late,onTime/2);
})
test("eventtofreq, cancelled is silent",()=>{
    assert.equal(eventToFrequency(makeEvent({cancelled: true})),null);
    assert.equal(
    eventToFrequency(makeEvent({ track: "" })),
    eventToFrequency(makeEvent({ track: "0" }))
    );
});
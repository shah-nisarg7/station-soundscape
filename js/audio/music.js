//pentatonic scales are 5 notes per octave that sound nice in any order (usually)]
export const SCALES = {
    majorPentatonic : [0,2,4,7,9], //sounds calm 
    minorPentatonic: [0,3,5,7,10], //major usually sounds slightly sad/off
};

const MELODY_ROOT_NOTE = 60; // note 60 is the higher c (C4 note) on piano
const LATE_LIMIT_MINUTES =5; //5 min or more counts as late
const NOTES_USED =5; //only 5 diff notes (one actave) so jump stays small

//midi note number will be sound freq in hz
// note 69 is A at 440hz, every 12 notes up the freq doubles

export function midiToFrequency(midiNote){
    return 440*2**((midiNote-69)/12);
}
//step 0 is the root note, step 1 is next note of the scale
//steps after end of scale go up an octave and negative goes down
export function getNoteFromScale(scaleName,stepNumber,rootNote= ROOT_NOTE){
    const scaleSteps = SCALES[scaleName];
    if(!scaleSteps){
        throw new Error(`Unknown scale : ${scaleName}`);
    }
    const octave = Math.floor(stepNumber/scaleSteps.length);
    const position = ((stepNumber%scaleSteps.length)+scaleSteps.length)% scaleSteps.length;
    return rootNote +octave *12 + scaleSteps[position];
}
//turns one train event into freq /null if cancelled
// track num picks the note (higher track = higher note)
//late train sounds like low notes so dropping one octave

export function eventToFrequency(event,scaleName = "majorPentatonic"){
    if(event.cancelled) return null;
    const trackNumber = Number.parseInt(event.track,10);
    const stepNumber =
    typeof event.songStep === "number"
      ? event.songStep
      : Number.isNaN(trackNumber)? 0 : trackNumber% NOTES_USED;

    let note = getNoteFromScale(scaleName, stepNumber,MELODY_ROOT_NOTE);
    if(event.delayMin >=LATE_LIMIT_MINUTES){
        note-=12;
    }
    return midiToFrequency(note);
}
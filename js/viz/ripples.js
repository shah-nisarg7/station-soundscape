import {getTrackIndex,getColorForEvent} from "./particles.js";

export const RIPPLE_LIFETIME_MS = 2000;
const START_RADIUS = 14; //same size as the track dot 
const END_RADIUS = 60;

export function createRipple(event,trackCount,now){
    return{
        trackIndex: getTrackIndex(event,trackCount),
        color: getColorForEvent(event),
        startTime : now,
    };
}

export function getRippleProgress(ripple,now){
    const progress = (now-ripple.startTime)/RIPPLE_LIFETIME_MS;
    return Math.min(1,Math.max(0,progress));
}

export function isRippleFinished(ripple,now){
    return now-ripple.startTime>= RIPPLE_LIFETIME_MS;
}
export function getRippleRadius(progress){
    return START_RADIUS +(END_RADIUS-START_RADIUS)*progress;
}
export function getRippleAlpha(progress){
    return 0.8*(1-progress);
}
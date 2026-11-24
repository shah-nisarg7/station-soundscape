//making particle as a small dot that flies in for arrival and out for departure
export const PARTICLE_LIFETIME_MS = 3000;
const FAR_DISTANCE = 1.7; // start or end this far out from the ring
//green = on time , amber = bit late , red = very late , grey is cancelled

export function getColorForEvent(event){
    if(event.cancelled) return "#6e7681";
    if(event.delayMin>= 5) return "#f85149";
    if(event.delayMin>=1) return "#d29922";
    return "#3fb950";
}
//track1 is dot 0 and track 12 is 11 (13 wraps back to dot 0)
export function getTrackIndex(event,trackCount){
    const trackNumber = Number.parseInt(event.track,10);
    if(Number.isNaN(trackNumber)|| trackNumber <1) return 0;
    return(trackNumber-1) % trackCount;
}

export function createParticle(event,trackCount,now){
    return {
        trackIndex: getTrackIndex(event,trackCount),
        kind: event.kind,
        color: getColorForEvent(event),
        cancelled : event.cancelled,
        startTime:now,
    };
}
//0 is just formed 1 is end
export function getParticleProgress(particle,now){
    const progress = (now-particle.startTime)/PARTICLE_LIFETIME_MS;
    return Math.min(1,Math.max(0,progress));
}
export function isParticleFinished(particle,now){
    return now - particle.startTime >= PARTICLE_LIFETIME_MS;
}
export function getParticleDistanceFactor(kind,progress){
    const slowDown = 1-(1-progress)**2; //moves fast first then slow
    if(kind==="arrival"){
        return FAR_DISTANCE-(FAR_DISTANCE-1)*slowDown;
    }
    return 1+(FAR_DISTANCE-1)*slowDown;
}
export function getParticleAlpha(particle,progress){
    const startAlpha = particle.cancelled?0.4:1;
    return startAlpha *(1-progress); //linear progress of alpha
}

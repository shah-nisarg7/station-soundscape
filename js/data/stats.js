//works out nnumbers to show on panel
export function getEventStats(events){
    //cancelled trains have no real delay so leaving them out of avg
    const runningEvents = events.filter((event)=>!event.cancelled);
    const totalDelay = runningEvents.reduce((sum,event)=>sum+event.delayMin,0);

    return {
        eventCount: events.length,
        averageDelayMin: runningEvents.length === 0 ? 0 : totalDelay / runningEvents.length,
        lateCount: runningEvents.filter((event) => event.delayMin >= 5).length,
        cancelledCount: events.filter((event) => event.cancelled).length,
    }
}
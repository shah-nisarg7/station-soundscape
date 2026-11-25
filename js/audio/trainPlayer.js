//real trains are mins apart so.. we play it sped up
//very long gaps are cut short, so it never waits too long for next note
export function makePlaybackPlan(events,options={}){
    const {secondsPerRealMinute = 2, maxGapSeconds= 8,minGapSeconds = 0,beatSeconds=0} = options;

    let previousTimeInMs = null;
    let elapsedSeconds = 0;

    return events.map((event)=>{
        const timeInMs = new Date(event.scheduledTime).getTime();

        if (previousTimeInMs !== null){
            const realGapMinutes = (timeInMs - previousTimeInMs) / 60000;
            const gapSeconds = realGapMinutes * secondsPerRealMinute;
            elapsedSeconds += Math.min(Math.max(gapSeconds, minGapSeconds), maxGapSeconds);
        }
        previousTimeInMs = timeInMs;
        const delaySeconds =
        beatSeconds > 0? Math.round(elapsedSeconds/beatSeconds) * beatSeconds : elapsedSeconds;
        return { event, delaySeconds};
    });
}

//plays every event at its time then waits for a bit and starts again
export function startPlayback(events,onEvent,options={}){
    const {loopPauseSeconds = 4}= options;
    const plan = makePlaybackPlan(events,options);

    //nothing to play
    if(plan.length ===0){
        return function stop(){};
    }

    let timerIds = [];

    function playOneRound(){
        timerIds=[];
        for(const step of plan){
            timerIds.push(setTimeout(()=> onEvent(step.event),step.delaySeconds*1000));
        }
        //after last event and some short time, repeating again
        const lastDelaySeconds = plan[plan.length-1].delaySeconds;
        timerIds.push(setTimeout(playOneRound,(lastDelaySeconds+loopPauseSeconds)*1000));
    }
    playOneRound();

    return function stop(){
        timerIds.forEach((timerId)=> clearTimeout(timerId));
        timerIds = [];
    };
}
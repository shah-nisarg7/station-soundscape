//making fake train events that look like real ones
//offline mode needs trains that start from rn

const TRAIN_CHOICES = [
    {type:"IC", category:"Long-distance"},
    {type : "P", category:"Commuter"},
    {type: "S",category: "Long-distance"},
    { type:"R", category: "Commuter"},
    
]

//simple random number maker  but with same seed giving same number
// so we can test it (and get same output basically)
function makeRandomNumberMaker(seed){
    let current = seed;
    return function nextRandomNumber(){
        current = (current * 1664525 + 1013904223)% 4294967296;
        return current/42494967296; // a number from 0 up to 1 but excluding 1

        };
    }

//random whole number from min to max (both included)
function randomWholeNumber(min,max,random){
    return min + Math.floor(random()*(max-min+1));
}

function pickOne(list,random){
    return list[Math.floor(random()*list.length)];
}

//most trains are on time, some r a bit early, some are late
function pickDelay(random){
    const chance = random();
    if (chance<0.6) return 0; //meaning 60$ on time
    if (chance<0.7) return -1; 
    return randomWholeNumber(1,12,random)//30% late by 1 to 12 mins

}

export function makeFakeEvents(options={}){
    const {
        station = "HKI",
        howManyEvents = 40,
        startTime = new Date(),
        seed = 1,
    } = options;

    const random = makeRandomNumberMaker(seed);
    const events = [];
    let currentTimeInMs = startTime.getTime();

    for (let index = 0; index <howManyEvents; index++){
        //each event happens 1-6 min after the one before it
        currentTimeInMs += randomWholeNumber(1,6,random)*60*1000;

        const trainChoice = pickOne(TRAIN_CHOICES,random);
        const trainNumber = randomWholeNumber(1,999,random);
        const kind = random()<0.5? "arrival":"departure";
        const delayMin = pickDelay(random);
        const cancelled = random()< 0.05; // about 1 in 20 caneclld 
        const track = String(randomWholeNumber(1,12,random));

        const scheduledTime = new Date(currentTimeInMs).toISOString();
        const actualTime = cancelled
        ? null //a cancelled train never shows up
        :new Date(currentTimeInMs+ delayMin*60*1000).toISOString();

        events.push({
            id:`${trainNumber}-${kind}-${scheduledTime}`,
            trainNumber,
            trainType: trainChoice.type,
            category: trainChoice.category,
            operator: "vr",
            kind,
            station,
            scheduledTime,
            actualTime,
            delayMin : cancelled? 0: delayMin,
            track,
            cancelled,
        });
    }
    return events;

}

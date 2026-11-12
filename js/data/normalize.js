

export function normalizeTrain(raw,station){
    const rows = raw.timeTableRows ?? [];

    return rows
        .filter((row)=> row.stationShortCode ===station)
        .map(row => ({
            id : '${raw.trainNumber}-${row.type}-${row.scheduledTime}',
            trainNumber : raw.trainNumber,
            trainType: raw.trainType,
            category : raw.trainCategory,
            operator : raw.operatorShortCode,
            kind: row.type.toLowerCase(),
            scheduledTime: row.scheduledTime,
            actualTime: row.actualTime ?? null,
            delayMin : row.differenceInMinutes ?? 0,
            track: row.commericalTrack ?? "",
            cancelled : Boolean(raw.cancelled || row.cancelled),

        })
    );
}

export function normalizeTrains(rawTrains,station){
    return rawTrains 
        .flatMap((raw)=> normalizeTrain(raw,station))
        .sort ((a,b)=> new Date(a.scheduledTime) - new Date(b.scheduledTime));
}
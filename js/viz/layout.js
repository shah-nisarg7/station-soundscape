//total dots going around the ring (1 dot for each track number 1-12))
export const TRACK_COUNT = 12;
//finds position of each dot on circle
//first dot starts at top then we go clockwise
export function getRingPositions(count,centerX,centerY,radius){
    const positions = [];
    for(let index = 0; index<count;index++){
        //-90 deg (in rads ) meaning starting at the top bcs angle is from +x
        const angle = -Math.PI/2+ (2*Math.PI*index)/count;
        positions.push({
            x : centerX + radius*Math.cos(angle),
            y: centerY + radius*Math.sin(angle),
        });
    }
        return positions; 
}
  
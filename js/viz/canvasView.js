import {TRACK_COUNT,getRingPositions} from "./layout.js";
import {
    getParticleProgress,
    getParticleDistanceFactor,
    getParticleAlpha,
} from "./particles.js";
import {
    getRippleProgress,
    getRippleRadius,
    getRippleAlpha,
} from "./ripples.js";
//repeating our css colours here
const COLORS = {
    ring:"#30363d",
    dotFill: "#161b22",
    accent: "#58a6ff",
    text: "#8b949e",
};

//makes the canvas right size 
export function setupCanvas(canvas){
    const context = canvas.getContext("2d");
    const size = { width: 0, height:0}; //size on screen

    function resize(){
        const pixelRatio = window.devicePixelRatio||1;
        const box = canvas.getBoundingClientRect();
        size.width = box.width;
        size.height = box.height;
        //The real canvas has more pixels than the screen box so it looks sharp
        canvas.width = Math.round(box.width*pixelRatio);
        canvas.height = Math.round(box.height*pixelRatio);
        //now we can just draw using normal screen sizes
        context.setTransform(pixelRatio,0,0,pixelRatio,0,0);
    }

        resize();
        return {context,size,resize};
}

function getRingShape(size){
    return{
        centerX : size.width/2,
        centerY : size.height/2,
        radius: Math.min(size.width,size.height)*0.35,    };
}
export function drawStationRing(view,stationCode){
    const {context,size}= view;
    context.clearRect(0,0,size.width,size.height);

    const { centerX, centerY, radius } = getRingShape(size);
    //the big ring line
    context.strokeStyle = COLORS.ring;
    context.linewidth = 2;
    context.beginPath();
    context.arc(centerX,centerY,radius,0,Math.PI*2);
    context.stroke();
    //one dot with a number for each track
    context.textAlign = "center";
    context.textBaseLine = "middle";
    context.font = "12px system-ui, sans-serif";
    const positions = getRingPositions(TRACK_COUNT,centerX,centerY,radius);
    positions.forEach((position,index)=>{
        context.beginPath();
        context.arc(position.x, position.y,14,0,Math.PI*2);
        context.fillStyle = COLORS.dotFill;
        context.fill();
        context.strokeStyle = COLORS.accent;
        context.stroke();

        context.fillStyle = COLORS.text;
        context.fillText(String(index+1),position.x,position.y);
    });

    //station name in the middle
    context.font = "bold 28px system-ui,sans-serif";
    context.fillStyle = COLORS.accent;
    context.fillText (stationCode,centerX,centerY);
}

export function drawParticles(view,particles,now){
    const {context,size}= view;
    const {centerX,centerY,radius} = getRingShape(size);
    const dots = getRingPositions(TRACK_COUNT,centerX,centerY,radius);

    for(const particle of particles){
        const progress = getParticleProgress(particle,now);
        const dot = dots[particle.trackIndex];
        const factor = getParticleDistanceFactor(particle.kind,progress);
        const x = centerX + (dot.x-centerX)*factor;
        const y = centerY + (dot.y-centerY)*factor;

        context.globalAlpha = getParticleAlpha(particle,progress);
        context.fillStyle = particle.color;
        context.beginPath();
        context.arc(x,y,6,0,Math.PI*2);
        context.fill();
    }  
    context.globalAlpha = 1; //back to normalf for other drawing
}

export function drawRipples(view, ripples, now) {
  const { context, size } = view;
  const { centerX, centerY, radius } = getRingShape(size);
  const dots = getRingPositions(TRACK_COUNT, centerX, centerY, radius);

  context.lineWidth = 2;
  for (const ripple of ripples) {
    const progress = getRippleProgress(ripple, now);
    const dot = dots[ripple.trackIndex];

    context.globalAlpha = getRippleAlpha(progress);
    context.strokeStyle = ripple.color;
    context.beginPath();
    context.arc(dot.x, dot.y, getRippleRadius(progress), 0, Math.PI * 2);
    context.stroke();
  }
  context.globalAlpha = 1; // back to normal for other drawing
}
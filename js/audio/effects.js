function makeReverbBuffer(audioContext,seconds = 4, fadePower =3){
    const sampleCount = Math.floor(audioContext.sampleRate*seconds);
    const buffer = audioContext.createBuffer(2,sampleCount,audioContext.sampleRate);

    for(let channelNumber =0; channelNumber<2; channelNumber++){
        const samples = buffer.getChannelData(channelNumber);
        for(let index =0; index<sampleCount;index++){
            const fadeOut = (1-index/sampleCount)** fadePower;
            samples[index] = (Math.random()*2-1)*fadeOut;
        }
    }
    return buffer;
}

export function createEffects(audioContext,destination){
    const input = audioContext.createGain();

    //dry (original sound with nothing added)
    const dryGain= audioContext.createGain();
    dryGain.gain.value = 0.6;
    input.connect(dryGain);
    dryGain.connect(destination);

    //reverb 
    const reverb = audioContext.createConvolver();
    reverb.buffer = makeReverbBuffer(audioContext);
    const reverbGain = audioContext.createGain();
    reverbGain.gain.value = 0.4;
    input.connect(reverb);
    reverb.connect(reverbGain);
    reverbGain.connect(destination);

    //echo
    const echoDelay = audioContext.createDelay(2);
    echoDelay.delayTime.value = 0.45; //secs bw repeats
    const echoFeedback = audioContext.createGain();
    echoFeedback.gain.value = 0.35;
    const echoGain = audioContext.createGain();
    echoGain.gain.value = 0.3;
    input.connect(echoDelay);
    echoDelay.connect(echoFeedback);
    echoFeedback.connect(echoDelay); // loops the echo back into itself
    echoDelay.connect(echoGain);
    echoGain.connect(destination);

    return {input};

}
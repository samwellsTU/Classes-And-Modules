export class Note {
  constructor(myAudioContext, dest, freq) {
    this.ctx = myAudioContext;
    this.osc = new OscillatorNode(this.ctx);
    this.adsr = new GainNode(this.ctx);
    this.adsr.gain.value = 0;
    this.frequency = freq;
    this.osc.frequency.value = this.frequency;

    this.osc.connect(this.adsr);
    this.adsr.connect(dest);
    this.attack = 0.2;
    this.decay = 0.1;
    this.sustain = 0.5;
    this.release = 5;
  }
  play() {
    let now = this.ctx.currentTime;
    this.osc.start(now);
    this.adsr.gain.cancelScheduledValues(now);
    this.adsr.gain.setValueAtTime(this.adsr.gain.value, now);

    this.adsr.gain.linearRampToValueAtTime(1, now + this.attack);
    this.adsr.gain.linearRampToValueAtTime(
      this.sustain,
      now + this.attack + this.decay,
    );
  }
  end() {
    let now = this.ctx.currentTime;

    this.adsr.gain.cancelScheduledValues(now);
    this.adsr.gain.setValueAtTime(this.adsr.gain.value, now);
    this.adsr.gain.linearRampToValueAtTime(0, now + this.release);

    this.osc.stop(now + this.release + 0.01);
  }
}

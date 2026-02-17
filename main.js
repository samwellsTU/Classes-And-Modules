// import { atodb, dbtoa } from "./MusicTools.js";
import * as myTools from "./MusicTools.js";
import { Note } from "./Note.js";

const theButtons = document.querySelectorAll("button");
const myNotes = Array(13);
const pitches = [60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72];

console.log(theButtons);

const ctx = new AudioContext();
const masterGain = new GainNode(ctx);
masterGain.gain.value = 0;
masterGain.connect(ctx.destination);

document.querySelector("#volSlider").addEventListener("input", (event) => {
  let sliderValue = event.target.value;
  document.querySelector("#volLabel").innerText = `${sliderValue} dBFS`;
  sliderValue = Number(sliderValue); //dB
  masterGain.gain.linearRampToValueAtTime(
    myTools.dbtoa(sliderValue),
    ctx.currentTime + 0.1,
  );
});

let myOsc;

theButtons.forEach((aButton, index) => {
  aButton.addEventListener("pointerdown", () => {
    myNotes[index] = new Note(ctx, masterGain, myTools.mtof(pitches[index]));
    myNotes[index].play();
  });
  aButton.addEventListener("pointerup", () => {
    myNotes[index].end();
  });
});

// document.querySelector("button").addEventListener("pointerdown", () => {
//   myOsc = new Note(ctx, masterGain, myTools.mtof(60));
//   myOsc.play();
// });

// document.querySelector("button").addEventListener("pointerup", () => {
//   myOsc.end();
// });

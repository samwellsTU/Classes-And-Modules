// Import all functions and variables from MusicTools.js module
// The * means "import everything" and we access them via MyTools.functionName()
import * as MyTools from "./MusicTools.js";


// ===== DATA SETUP =====

// Array of MIDI note numbers for one octave starting at middle C (C4)
// MIDI numbers: 60=C, 61=C#, 62=D, 63=D#, 64=E, 65=F, 66=F#, 67=G, 68=G#, 69=A, 70=A#, 71=B, 72=C
const myNotes = [60,61,62,63,64,65,66,67,68,69,70,71,72];

// Create an array with 13 empty slots to store our Note objects
// Each slot will hold one oscillator/note when a button is pressed
const myOscs = Array(13);

// Get ALL <button> elements from the HTML page and store them in a NodeList
// This finds all 13 piano key buttons we created in the HTML
const theButtons = document.querySelectorAll("button");


// ===== WEB AUDIO API SETUP =====

// Create the main audio context - this is required for all Web Audio API operations
// Think of it as the "audio engine" that manages all sound processing
const ctx = new AudioContext();

// Create a gain node (volume control) that all sounds will pass through
// This lets us control the master volume for all notes at once
const masterGain = new GainNode(ctx);

// Connect the master gain to the speakers/headphones (the final destination)
// Audio flow: oscillators → masterGain → speakers
masterGain.connect(ctx.destination);


// ===== CUSTOM TUNING =====

// Change the reference tuning frequency from default 440Hz (standard A4) to 315Hz
// This will make all notes sound lower/different than standard tuning
MyTools.TUNING_FREQ = 315;

// Log the new tuning frequency to verify it changed
console.log(MyTools.TUNING_FREQ);


// ===== NOTE CLASS DEFINITION =====

// Class to create and manage individual musical notes using Web Audio oscillators
class Note{
    // Constructor runs when we create a new Note with: new Note(...)
    // Parameters:
    //   context = the AudioContext to use
    //   outputDestination = where to send the audio (our masterGain node)
    //   freq = the frequency in Hz for this note
    constructor(context, outputDestination, freq) {
        // Store the audio context for this note
        this.myContext = context;

        // Store where this note's audio should be sent
        this.destination = outputDestination;

        // Create an oscillator node - this generates the actual sound wave
        this.osc = new OscillatorNode(this.myContext);

        // Set the oscillator's frequency to the note we want (in Hz)
        this.osc.frequency.value = freq;

        // Set up what happens when the oscillator stops playing
        // .bind(this) ensures 'this' still refers to our Note object inside cleanup()
        this.osc.onended = this.cleanup.bind(this);

        // Connect the oscillator to the destination (masterGain)
        // Now audio can flow from oscillator → masterGain → speakers
        this.osc.connect(this.destination);
    }

    // Method to start playing the note
    start(){
        // Tell the oscillator to begin generating sound
        this.osc.start();
        console.log("start");
    }

    // Method to stop playing the note
    stop(){
        // Tell the oscillator to stop generating sound
        // This also triggers the 'onended' event which calls cleanup()
        this.osc.stop();
        console.log("stop");
    }

    // Cleanup method that runs automatically when oscillator ends
    cleanup(){
        // Disconnect the oscillator from the audio graph
        // This breaks the connection: oscillator -X- masterGain
        this.osc.disconnect();

        // Set oscillator to null to free up memory
        // Once stopped, oscillators can't be reused, so we delete the reference
        this.osc = null;
    }
}


// ===== EVENT LISTENERS FOR PIANO KEYS =====

// Loop through each button and set up mouse event listeners
// forEach gives us the button element (item) and its position (index: 0-12)
theButtons.forEach((item, index)=>{

    // When mouse button is pressed down on this piano key...
    item.addEventListener("mousedown", ()=>{
        // 1. Create a new Note object:
        //    - Use our audio context (ctx)
        //    - Send audio to masterGain
        //    - Convert MIDI note number to frequency using mtof()
        //      Example: myNotes[0] is 60 (middle C) → converts to ~261.63 Hz
        myOscs[index] = new Note(ctx, masterGain, MyTools.mtof(myNotes[index]));

        // 2. Start playing the note immediately
        myOscs[index].start();
    });

    // When mouse button is released from this piano key...
    item.addEventListener("mouseup", ()=>{
        // Stop the note at this index
        // This triggers the oscillator's 'onended' event, which calls cleanup()
        myOscs[index].stop();
    });
});
/**
 * Music calculation utilities for working with MIDI, frequencies, and decibels.
 * @module MusicTools
 */

/**
 * Reference tuning frequency in Hz (A4 = 440Hz by default).
 * @type {number}
 */
let TUNING_FREQ = 440;

/**
 * Converts amplitude to decibels.
 * @param {number} amp - Amplitude value
 * @returns {number} Decibel value
 */
export function atodb(amp){
    return 20*Math.log10(amp/20)
}

/**
 * Converts decibels to amplitude.
 * @param {number} db - Decibel value
 * @returns {number} Amplitude value
 */
export function dbtoa(db){
    return 10**(db/20)
}

/**
 * Converts MIDI note number to frequency in Hz.
 * Uses the current TUNING_FREQ as reference (A4 = MIDI 69).
 * @param {number} midi - MIDI note number (0-127)
 * @returns {number} Frequency in Hz
 */
export function mtof(midi){
    return TUNING_FREQ * 2**((midi-69)/12)
}

/**
 * Converts frequency in Hz to MIDI note number.
 * Uses the current TUNING_FREQ as reference (A4 = MIDI 69).
 * @param {number} freq - Frequency in Hz
 * @returns {number} MIDI note number (can be fractional)
 */
export function ftom(freq){
    return Math.log2(freq/TUNING_FREQ) * 12 + 69;
}

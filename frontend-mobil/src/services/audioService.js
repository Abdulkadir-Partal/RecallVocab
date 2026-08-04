import * as Speech from "expo-speech";

export const playAudio = (word) => {

    if (!word) return;

    Speech.stop();

    Speech.speak(word, {

        language: "en-US",

        rate: 0.9,

        pitch: 1.0,

    });

};

export const stopAudio = () => {

    Speech.stop();

};
import { useContext, createContext, useState, useRef } from 'react';
import { useTextToSpeech } from 'react-speech-highlight';

import { knobOptions } from '../utils/constants';

type Speech = {
  autoHL: boolean;
  disableSentenceHL: boolean;
  disableWordHL: boolean;
  autoScroll: boolean;
  volume: number;
  pitch: { angle: number; value: number };
  rate: number;
  controlHL: any;
  statusHL: any;
  prepareHL: any;
  spokenHL: any;
  textEl: any;
  calibrating: boolean;
  updatePitch: () => void;
};

const SpeechContext = createContext<Speech | null>(null);

export function SpeechProvider({ children }: { children: React.ReactNode }) {
  // Config with react state,
  const [autoHL, setAutoHL] = useState(true);
  const [disableSentenceHL, setDisableSentenceHL] = useState(false);
  const [disableWordHL, setDisableWordHL] = useState(false);
  const [autoScroll, setAutoScroll] = useState(true);

  const [volume, setVolume] = useState(100);
  const [pitch, setPitch] = useState({
    value: 1.6,
    angle: 0,
  });

  const [rate, setRate] = useState(0.9);

  const textEl = useRef<HTMLInputElement | null>(null);

  const { controlHL, statusHL, prepareHL, spokenHL } = useTextToSpeech({
    disableSentenceHL: disableSentenceHL,
    disableWordHL: disableWordHL,
    autoHL: autoHL,
    autoScroll: autoScroll,
    lang: { lang: 'en-US' },
    clear: true,
  });

  const calibrating = statusHL === 'calibration';

  const handleSetPitch = (pitch: { angle: number; value: number }) => {
    setPitch(pitch);
    controlHL.changeConfig({
      pitch: pitch.value,
    });
  };

  const updatePitch = () => {
    const activePitchIndex = knobOptions.map((i) => i.angle).indexOf(pitch.angle);
    const lastPitchIndex = knobOptions.length - 1;

    if (activePitchIndex === lastPitchIndex) {
      handleSetPitch(knobOptions[0]);
    } else {
      handleSetPitch(knobOptions[activePitchIndex + 1]);
    }
  };

  return (
    <SpeechContext.Provider
      value={{
        autoHL,
        disableSentenceHL,
        disableWordHL,
        autoScroll,
        volume,
        pitch,
        rate,
        controlHL,
        statusHL,
        prepareHL,
        spokenHL,
        textEl,
        calibrating,
        updatePitch,
      }}
    >
      {children}
    </SpeechContext.Provider>
  );
}

export function useSpeech() {
  const context = useContext(SpeechContext);
  if (context === null) {
    throw new Error('usesSpeech must be used within a SpeechProvider');
  }
  return context;
}

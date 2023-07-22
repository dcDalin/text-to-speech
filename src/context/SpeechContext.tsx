import { useContext, createContext, useState, useRef } from 'react';
import { useTextToSpeech } from 'react-speech-highlight';

type Speech = {
  autoHL: boolean;
  disableSentenceHL: boolean;
  disableWordHL: boolean;
  autoScroll: boolean;
  volume: number;
  pitch: number;
  rate: number;
  controlHL: any;
  statusHL: any;
  prepareHL: any;
  spokenHL: any;
  textEl: any;
  calibrating: boolean;
};

const SpeechContext = createContext<Speech | null>(null);

export function SpeechProvider({ children }: { children: React.ReactNode }) {
  // Config with react state,
  const [autoHL, setAutoHL] = useState(true);
  const [disableSentenceHL, setDisableSentenceHL] = useState(false);
  const [disableWordHL, setDisableWordHL] = useState(false);
  const [autoScroll, setAutoScroll] = useState(true);

  const [volume, setVolume] = useState(100);
  const [pitch, setPitch] = useState(1);
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

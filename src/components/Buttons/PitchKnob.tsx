import PitchIndicators from '../../assets/pitch-indicators.svg';
import PitchKnobIcon from '../../assets/pitch-knob.svg';
import { useSpeech } from '../../context/SpeechContext';

export default function PitchKnob() {
  const { pitch, updatePitch } = useSpeech();

  const rotate = `rotate-${pitch.angle}`;

  return (
    <div className="relative flex flex-col items-center">
      <img src={PitchIndicators} alt="pitch indicator" />
      <button className="absolute top-[6px]" onClick={updatePitch}>
        <img src={PitchKnobIcon} alt="pitch knob" className={`${rotate}`} />
      </button>
    </div>
  );
}

import SeekBackImage from '../../assets/seek-back.svg';
import SeekForwardImage from '../../assets/seek-forward.svg';
import { useSpeech } from '../../context/SpeechContext';

interface ISeekTimeProps {
  seek: 'forward' | 'backward';
}

export default function SeekTime({ seek }: ISeekTimeProps) {
  const { controlHL } = useSpeech();

  return (
    <button onClick={seek === 'forward' ? controlHL.seekSentenceForward : controlHL.seekSentenceBackward}>
      <img src={seek === 'forward' ? SeekForwardImage : SeekBackImage} alt={`seek ${seek}`} />
    </button>
  );
}

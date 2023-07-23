import SeekBackImage from '../../assets/seek-back.svg';
import SeekForwardImage from '../../assets/seek-forward.svg';

interface ISeekTimeProps {
  seek: 'forward' | 'backward';
}

export default function SeekTime({ seek }: ISeekTimeProps) {
  return (
    <div>
      <img src={seek === 'forward' ? SeekForwardImage : SeekBackImage} alt={`seek ${seek}`} />
    </div>
  );
}

import { CircularProgressbarWithChildren, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { FaPause, FaPlay } from 'react-icons/fa';
import { ImSpinner8 } from 'react-icons/im';

import { useSpeech } from '../../context/SpeechContext';

interface ICircularProgressProps {
  handleClick?: () => void;
  isButton?: boolean;
  isPlay?: boolean;
}

export default function CircularProgress({ handleClick, isButton = false, isPlay = false }: ICircularProgressProps) {
  const { spokenHL, calibrating } = useSpeech();

  const percentage = spokenHL.precentageSentence;

  return (
    <button onClick={handleClick}>
      <CircularProgressbarWithChildren
        value={percentage}
        styles={buildStyles({
          // Rotation of path and trail, in number of turns (0-1)
          rotation: 0,

          // Whether to use rounded or flat corners on the ends - can use 'butt' or 'round'
          strokeLinecap: 'butt',

          // How long animation takes to go from one percentage to another, in seconds
          pathTransitionDuration: 0.5,

          // Can specify path transition in more detail, or remove it entirely
          // pathTransition: 'none',

          // Colors
          pathColor: `rgba(62, 152, 199, ${100})`,
          textColor: '#f88',
          trailColor: '#d6d6d6',
          backgroundColor: '#3e98c7',
        })}
      >
        {calibrating ? (
          <ImSpinner8 className="animate-spin" />
        ) : isButton && isPlay ? (
          <FaPause />
        ) : isButton && !isPlay ? (
          <FaPlay />
        ) : (
          ''
        )}
      </CircularProgressbarWithChildren>
    </button>
  );
}

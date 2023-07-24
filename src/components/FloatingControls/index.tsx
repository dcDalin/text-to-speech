import Options from '../Buttons/Options';
import PitchKnob from '../Buttons/PitchKnob';
import SeekTime from '../Buttons/SeekTime';
import CircularProgress from '../CircularProgress';

interface IFloatingControlsProps {
  isPlay: boolean;
  play: () => void;
  pause: () => void;
  stop: () => void;
}

export default function FloatingControls({ isPlay, play, pause, stop }: IFloatingControlsProps) {
  return (
    <div className="w-full h-full rounded-full player-bg flex items-center justify-between shadow-lg px-6">
      <PitchKnob />

      <SeekTime seek="backward" />
      <div className="h-10 md:h-14 w-10 md:w-14">
        <CircularProgress
          isButton={true}
          isPlay={isPlay}
          handleClick={() => {
            if (isPlay) {
              pause();
            } else {
              play();
            }
          }}
        />
      </div>
      <SeekTime seek="forward" />

      <Options />
    </div>
  );
}

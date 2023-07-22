import CircularProgress from '../CircularProgress';

interface IFloatingControlsProps {
  isPlay: boolean;
  play: () => void;
  pause: () => void;
  stop: () => void;
}

export default function FloatingControls({ isPlay, play, pause, stop }: IFloatingControlsProps) {
  return (
    <div className="w-full h-full rounded-full player-bg flex items-center justify-between shadow-lg">
      <div className="flex items-center space-x-4">
        <div className="h-14 w-14">
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
      </div>
    </div>
  );
}

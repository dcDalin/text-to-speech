interface IFloatingControlsProps {
  isPlay: boolean;
  play: () => void;
  pause: () => void;
  stop: () => void;
}

export default function FloatingControls({ isPlay, play, pause, stop }: IFloatingControlsProps) {
  return (
    <div>
      <button
        onClick={() => {
          if (isPlay) {
            pause();
          } else {
            play();
          }
        }}
      >
        {isPlay ? 'pause' : 'play'}
      </button>

      {isPlay && <button onClick={stop}>stop</button>}
    </div>
  );
}

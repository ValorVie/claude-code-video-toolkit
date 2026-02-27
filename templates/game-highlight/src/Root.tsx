import { Composition } from 'remotion';
import { GameHighlight } from './GameHighlight';
import { videoConfig, highlightConfig, calculateTotalFrames } from './config/highlight-config';

export const RemotionRoot: React.FC = () => {
  const totalFrames = calculateTotalFrames(highlightConfig, videoConfig.fps);

  return (
    <>
      <Composition
        id="GameHighlight"
        component={GameHighlight}
        durationInFrames={totalFrames}
        fps={videoConfig.fps}
        width={videoConfig.width}
        height={videoConfig.height}
      />
    </>
  );
};

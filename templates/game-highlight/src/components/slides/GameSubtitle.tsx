import React from 'react';
import {
  useCurrentFrame,
  interpolate,
  spring,
  useVideoConfig,
} from 'remotion';

interface GameSubtitleProps {
  text: string;
  durationInFrames: number;
}

export const GameSubtitle: React.FC<GameSubtitleProps> = ({
  text,
  durationInFrames,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const fadeIn = interpolate(frame, [0, 10], [0, 1], {
    extrapolateRight: 'clamp',
  });
  const fadeOut = interpolate(
    frame,
    [durationInFrames - 10, durationInFrames],
    [1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  );
  const opacity = Math.min(fadeIn, fadeOut);

  const slideUp = spring({ frame, fps, config: { damping: 20, stiffness: 100 } });
  const translateY = interpolate(slideUp, [0, 1], [24, 0]);

  return (
    <div
      style={{
        position: 'absolute',
        bottom: 80,
        left: 0,
        right: 0,
        display: 'flex',
        justifyContent: 'center',
        opacity,
        transform: `translateY(${translateY}px)`,
        zIndex: 20,
      }}
    >
      <div
        style={{
          backgroundColor: 'rgba(0, 0, 0, 0.75)',
          padding: '10px 28px',
          borderRadius: 8,
          maxWidth: '80%',
          borderLeft: '3px solid #00D4AA',
        }}
      >
        <span
          style={{
            color: 'white',
            fontSize: 40,
            fontFamily: 'Microsoft JhengHei, sans-serif',
            fontWeight: 600,
            textShadow: '2px 2px 4px rgba(0,0,0,0.9)',
            lineHeight: 1.4,
          }}
        >
          {text}
        </span>
      </div>
    </div>
  );
};

import React from 'react';
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from 'remotion';

interface TitleCardProps {
  headline: string;
  subheadline?: string;
}

export const TitleCard: React.FC<TitleCardProps> = ({ headline, subheadline }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleSpring = spring({ frame, fps, config: { damping: 15, stiffness: 80 } });
  const titleY = interpolate(titleSpring, [0, 1], [40, 0]);
  const titleOpacity = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: 'clamp' });

  const subOpacity = interpolate(frame, [15, 35], [0, 1], { extrapolateRight: 'clamp' });
  const subY = interpolate(frame, [15, 35], [20, 0], { extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: '#0a0a0a',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <h1
        style={{
          color: 'white',
          fontSize: 72,
          fontFamily: 'Microsoft JhengHei, sans-serif',
          fontWeight: 700,
          opacity: titleOpacity,
          transform: `translateY(${titleY}px)`,
          textShadow: '0 4px 20px rgba(0,100,255,0.3)',
          margin: 0,
        }}
      >
        {headline}
      </h1>
      {subheadline && (
        <p
          style={{
            color: '#888',
            fontSize: 32,
            fontFamily: 'Inter, sans-serif',
            fontWeight: 400,
            opacity: subOpacity,
            transform: `translateY(${subY}px)`,
            marginTop: 16,
          }}
        >
          {subheadline}
        </p>
      )}
    </AbsoluteFill>
  );
};
